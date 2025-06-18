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

const baseUrl = import.meta.env.VITE_BACKEND_URL;

interface LivePricesContextType {
  subscribe: (handler: Handler) => void;
  unsubscribe: (handler: Handler) => void;
}

const LivePricesContext = createContext<LivePricesContextType | undefined>(
  undefined
);

interface LivePricesProviderParams {
  children: React.ReactNode;
}

class RetriableError extends Error {}

class FatalError extends Error {}

interface Handler {
  callback: (message: string) => void;
  symbols: Array<string>;
}

export function LivePricesProvider({ children }: LivePricesProviderParams) {
  const [tickers, setTickers] = useState<Array<string>>([]);
  const { getToken } = useAuth();
  const connectionRef = useRef<AbortController | null>(null);
  const handlersRef = useRef<Array<Handler>>([]);
  const mountedRef = useRef(false);
    // Generate a proper UUID for connectionId
  const connectionId = useMemo(() => crypto.randomUUID(), []);
  useEffect(() => {
    if (mountedRef.current) {
      console.log(`LivePricesProvider re-mount detected, skipping (ID: ${connectionId})`);
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
      if (tickers.length === 0) {
      console.log(`No tickers to subscribe to, skipping SSE connection (ID: ${connectionId})`);
      return;
    }

    // Abort any existing connection
    if (connectionRef.current) {
      console.log(`Aborting existing connection (ID: ${connectionId})`);
      connectionRef.current.abort();
    }

    const abortController = new AbortController();
    connectionRef.current = abortController;
      const connectToSSE = async () => {
      try {
        const params = new URLSearchParams();
        params.append('symbols', tickers.join(','));
        params.append('connectionId', connectionId);
        const url = `${baseUrl}/api/sse?${params.toString()}`;

        const token = await getToken();
        if (!token) {
          console.error('No authentication token available');
          return;
        }

        console.log(`Connecting to SSE with tickers: ${tickers.join(',')} (connectionId: ${connectionId})`);

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
              throw new FatalError(
                `HTTP ${response.status}: ${response.statusText}`
              );
            } else {
              throw new RetriableError(
                `HTTP ${response.status}: ${response.statusText}`
              );
            }
          },          onmessage: (msg) => {
            if (msg.event === 'FatalError') {
              throw new FatalError(msg.data);
            }
            console.log('Received SSE message:', msg.data);

            // Call handlers that are subscribed to this symbol
            handlersRef.current.forEach((handler) => {
              // if (handler.symbols.some((symbol) => msg.data.includes(symbol))) {
              handler.callback(msg.data);
              // }
            });
          },
          onclose() {
            if (!abortController.signal.aborted) {
              console.log('SSE connection closed unexpectedly');
              throw new RetriableError('Connection closed');
            } else {
              console.log('SSE connection closed by cleanup');
            }
          },
          onerror(err) {
            console.error('SSE error:', err);
            if (err instanceof FatalError) {
              throw err;
            }
            throw new RetriableError('Connection error');
          },
        });
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Failed to establish SSE connection:', error);
        }
      }
    };

    connectToSSE();    // Cleanup function to abort the connection
    return () => {
      console.log(`Cleaning up SSE connection (ID: ${connectionId})`);
      abortController.abort();
      if (connectionRef.current === abortController) {
        connectionRef.current = null;
      }
    };
  }, [tickers, getToken, connectionId]);  const subscribe = useCallback((handler: Handler) => {
    // Check if handler already exists to prevent duplicates
    const existingHandler = handlersRef.current.find(h => 
      h.callback === handler.callback && 
      JSON.stringify(h.symbols) === JSON.stringify(handler.symbols)
    );
    
    if (existingHandler) {
      console.log('Handler already exists, skipping subscription');
      return;
    }
    
    handlersRef.current = [...handlersRef.current, handler];
    
    setTickers((prev) => {
      const newSymbols = handler.symbols.filter(
        (symbol) => !prev.includes(symbol)
      );
      if (newSymbols.length > 0) {
        console.log('SUBSCRIBE: Adding new symbols:', newSymbols);
      }
      return [...prev, ...newSymbols];
    });
  }, []);

  const unsubscribe = useCallback((handler: Handler) => {
    const newHandlers = handlersRef.current.filter((h) => h !== handler);
    handlersRef.current = newHandlers;
    
    setTickers((prevTickers) => {
      const stillNeededSymbols = new Set(
        newHandlers.flatMap((h) => h.symbols)
      );
      return prevTickers.filter((symbol) => stillNeededSymbols.has(symbol));
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
