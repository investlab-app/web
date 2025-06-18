import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  const [handlers, setHandlers] = useState<Array<Handler>>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    if (tickers.length === 0) {
      return;
    }

    const connectToSSE = async () => {
      try {
        const params = new URLSearchParams();
        params.append('symbols', tickers.join(','));
        const url = `${baseUrl}/api/sse?${params.toString()}`;

        const token = await getToken();
        if (!token) {
          console.error('No authentication token available');
          return;
        }

        await fetchEventSource(url, {
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
          },
          onmessage: (msg) => {
            if (msg.event === 'FatalError') {
              throw new FatalError(msg.data);
            }
            console.log('Received SSE message:', msg.data);

            // Call handlers that are subscribed to this symbol
            handlers.forEach((handler) => {
              // if (handler.symbols.some((symbol) => msg.data.includes(symbol))) {
                handler.callback(msg.data);
              // }
            });
          },
          onclose() {
            console.log('SSE connection closed');
            throw new RetriableError('Connection closed');
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
        console.error('Failed to establish SSE connection:', error);
      }
    };

    connectToSSE();
  }, [tickers, getToken, handlers]);

  const subscribe = useCallback((handler: Handler) => {
    setHandlers((prev) => [...prev, handler]);

    // Update tickers list with new symbols
    setTickers((prev) => {
      const newSymbols = handler.symbols.filter(
        (symbol) => !prev.includes(symbol)
      );
      return [...prev, ...newSymbols];
    });
  }, []);

  const unsubscribe = useCallback(
    (handler: Handler) => {
      setHandlers((prev) => prev.filter((h) => h !== handler));

      // Remove tickers that are no longer needed
      setTickers((prev) => {
        const remainingHandlers = handlers.filter((h) => h !== handler);
        const stillNeededSymbols = new Set(
          remainingHandlers.flatMap((h) => h.symbols)
        );
        return prev.filter((symbol) => stillNeededSymbols.has(symbol));
      });
    },
    [handlers]
  );

  const contextValue: LivePricesContextType = {
    subscribe,
    unsubscribe,
  };

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