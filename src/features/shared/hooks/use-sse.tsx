import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { useAuth } from '@clerk/clerk-react';
import { useSubscribeToSymbols } from './use-subscribe';
import { useUnsubscribeFromSymbols } from './use-unsubscribe';
import type { ReactNode } from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

interface LivePricesContextType {
  subscribe: (handler: Handler) => void;
  unsubscribe: (handler: Handler) => void;
}

const LivePricesContext = createContext<LivePricesContextType | undefined>(
  undefined
);

interface LivePricesProviderParams {
  children: ReactNode;
}

export interface Handler {
  id: string;
  callback: (message: string) => void;
  symbols: Set<string>;
}

export function LivePricesProvider({ children }: LivePricesProviderParams) {
  const [symbols, setSymbols] = useState<Set<string>>(new Set());
  const { getToken, sessionId } = useAuth();
  const connectionId = useMemo(() => crypto.randomUUID(), []);
  const connectionRef = useRef<AbortController | null>(null);
  const handlersRef = useRef<Array<Handler>>([]);

  const fetchLiveSymbolsData = useCallback(
    async ({ abortController }: { abortController: AbortController }) => {
      console.log(`awaiting token for connection ID: ${connectionId}`);
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      const params = new URLSearchParams();
      params.append('symbols', Array.from(symbols).join(','));
      params.append('connectionId', connectionId);
      const url = `${baseUrl}/api/sse?${params.toString()}`;

      await fetchEventSource(url, {
        signal: abortController.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        async onopen(response) {
          if (
            response.ok &&
            response.headers.get('content-type') === EventStreamContentType
          ) {
            return Promise.resolve();
          } else if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
            console.log('Client error');
          } else {
            console.log('Unexpected error');
          }
        },
        onmessage: (msg) => {
          handlersRef.current.forEach((handler) => {
            if (
              Array.from(handler.symbols).some((symbol) =>
                msg.data.includes(symbol)
              )
            ) {
              handler.callback(msg.data);
            }
          });
        },
        onclose() {
          console.log(`Connection closed (ID: ${connectionId})`);
        },
        onerror(error) {
          console.log(`Connection error (ID: ${connectionId}):`, error);
          throw new Error('Connection error: ' + error.message);
        },
      });
    },
    [connectionId, getToken, symbols]
  );

  const { mutate: subscribeToSymbols } = useSubscribeToSymbols();

  const subscribe = useCallback(
    (handler: Handler) => {
      handlersRef.current = [
        ...handlersRef.current.filter((h) => h.id !== handler.id),
        handler,
      ];

      subscribeToSymbols({
        symbols: Array.from(handler.symbols),
        connectionId,
      });

      setSymbols((prevSymbols) => prevSymbols.union(handler.symbols));
    },
    [connectionId, subscribeToSymbols]
  );

  const { mutate: unsubscribeFromSymbols } = useUnsubscribeFromSymbols();

  const unsubscribe = useCallback(
    (handler: Handler) => {
      handlersRef.current = handlersRef.current.filter(
        (h) => h.id !== handler.id
      );

      unsubscribeFromSymbols({
        symbols: Array.from(handler.symbols),
        connectionId,
      });

      setSymbols((prevSymbols) => prevSymbols.difference(handler.symbols));
    },
    [connectionId, unsubscribeFromSymbols]
  );

  useEffect(() => {
    if (connectionRef.current) {
      connectionRef.current.abort();
    }

    const abortController = new AbortController();
    connectionRef.current = abortController;

    fetchLiveSymbolsData({ abortController }).catch((error) => {
      console.error(`Catched error in SSE connection:`, error);
    });

    return () => {
      console.log('Cleanup SSE');
      unsubscribeFromSymbols({
        symbols: Array.from(symbols),
        connectionId,
      });
      abortController.abort();
      if (connectionRef.current === abortController) {
        connectionRef.current = null;
      }
    };
  }, [
    connectionId,
    sessionId,
    symbols,
    getToken,
    unsubscribeFromSymbols,
    fetchLiveSymbolsData,
  ]);

  const contextValue: LivePricesContextType = useMemo(
    () => ({ subscribe, unsubscribe }),
    [subscribe, unsubscribe]
  );

  return (
    <LivePricesContext.Provider value={contextValue}>
      {children}
    </LivePricesContext.Provider>
  );
}

export function useLivePrices() {
  const context = useContext(LivePricesContext);
  if (context === undefined) {
    throw new Error('useLivePrices must be used within a LivePricesProvider');
  }
  return context;
}
