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
  const [, setTickers] = useState<Set<string>>(new Set<string>());

  const { getToken } = useAuth();

  const connectionId = useMemo(() => crypto.randomUUID(), []);
  const connectionRef = useRef<AbortController | null>(null);
  const handlersRef = useRef<Array<Handler>>([]);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) {
      console.log(
        `LivePricesProvider re-mount detected, skipping (ID: ${connectionId})`
      );
      return;
    }

    mountedRef.current = true;
    console.log(`LivePricesProvider mounted (ID: ${connectionId})`);

    return () => {
      mountedRef.current = false;
    };
  }, [connectionId]);

  useEffect(() => {
    if (!mountedRef.current) {
      return;
    }

    if (connectionRef.current) {
      console.log(`Aborting existing connection (ID: ${connectionId})`);
      connectionRef.current.abort();
    }

    const abortController = new AbortController();
    connectionRef.current = abortController;

    const connectToSSE = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error('No authentication token available');
          return;
        }

        const params = new URLSearchParams();
        params.append('connectionId', connectionId);
        const url = `${baseUrl}/api/sse?${params.toString()}`;
        console.log(`Connecting to SSE (connectionId: ${connectionId})`);

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
              console.log('SSE connection opened successfully');
              return Promise.resolve();
            } else if (
              response.status >= 400 &&
              response.status < 500 &&
              response.status !== 429
            ) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
              );
            } else {
              throw new Error(
                `Unexpected response from SSE: ${response.status} ${response.statusText}`
              );
            }
          },
          onmessage: (msg) => {
            console.log('Received SSE message:', msg.data);

            handlersRef.current.forEach((handler) => {
              // if (handler.symbols.some((symbol) => msg.data.includes(symbol))) {
              handler.callback(msg.data);
              // }
            });
          },
          onclose() {
            if (!abortController.signal.aborted) {
              console.log('SSE connection closed unexpectedly');
              throw new Error('SSE connection closed unexpectedly');
            } else {
              console.log('SSE connection closed by cleanup');
            }
          },
          onerror(err) {
            console.error('SSE error:', err);
            throw err;
          },
        });
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Failed to establish SSE connection:', error);
        }
      }
    };

    connectToSSE();

    return () => {
      console.log(`Cleaning up SSE connection (ID: ${connectionId})`);
      abortController.abort();
      if (connectionRef.current === abortController) {
        connectionRef.current = null;
      }
    };
  }, [getToken, connectionId]);

  const { mutate } = useSubscribeToSymbols();

  const subscribe = useCallback((handler: Handler) => {
    console.log(
      `Subscribing handler (ID: ${handler.id}) for symbols: ${Array.from(handler.symbols)}`
    );

    handlersRef.current = [
      ...handlersRef.current.filter((h) => h.id !== handler.id),
      handler,
    ];

    mutate({
      symbols: Array.from(handler.symbols),
      connectionId,
    });

    setTickers((prev) => {
      return prev.union(new Set(handler.symbols));
    });
  }, []);

  const unsubscribe = useCallback((handler: Handler) => {
    handlersRef.current = handlersRef.current.filter(
      (h) => h.id !== handler.id
    );

    setTickers((prevTickers) => {
      return prevTickers.difference(new Set(handler.symbols));
    });
  }, []);

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
