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

class RetriableError extends Error {}

class FatalError extends Error {}

export function LivePricesProvider({ children }: LivePricesProviderParams) {
  const [, setTickers] = useState<Set<string>>(new Set<string>());
  const { getToken, sessionId } = useAuth();
  const connectionId = useMemo(() => crypto.randomUUID(), []);
  const connectionRef = useRef<AbortController | null>(null);
  const handlersRef = useRef<Array<Handler>>([]);

  useEffect(() => {
    if (connectionRef.current) {
      connectionRef.current.abort();
    }

    const abortController = new AbortController();
    connectionRef.current = abortController;

    const connectToSSE = async () => {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      const params = new URLSearchParams();
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
            throw new FatalError(
              `HTTP ${response.status}: ${response.statusText}`
            );
          } else {
            throw new RetriableError(
              `Unexpected response from SSE: ${response.status} ${response.statusText}`
            );
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
          if (!abortController.signal.aborted) {
            throw new RetriableError('Connection closed');
          }
        },
        onerror(error) {
          throw new RetriableError('Connection error', error);
        },
      });
    };

    connectToSSE().catch((error) => {
      console.error(`Error in SSE connection (ID: ${connectionId}):`, error);
    });

    return () => {
      abortController.abort();
      if (connectionRef.current === abortController) {
        connectionRef.current = null;
      }
    };
  }, [getToken, connectionId, sessionId]);

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

      setTickers((prev) => {
        return prev.union(new Set(handler.symbols));
      });
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

      setTickers((prev) => {
        return prev.difference(new Set(handler.symbols));
      });
    },
    [connectionId, unsubscribeFromSymbols]
  );

  const contextValue: LivePricesContextType = useMemo(
    () => ({
      subscribe,
      unsubscribe,
    }),
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
