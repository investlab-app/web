import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { useAuth } from '@clerk/clerk-react';
import { useStore } from '@tanstack/react-store';
import { sseStore } from './SSEStore';
import type { Client } from './SSEStore';
import type { ReactNode } from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

interface LivePricesContextType {
  subscribe: (handler: Client) => void;
  unsubscribe: (handler: Client) => void;
}

const LivePricesContext = createContext<LivePricesContextType | undefined>(
  undefined
);

interface LivePricesProviderParams {
  children: ReactNode;
}

export function LivePricesProvider({ children }: LivePricesProviderParams) {
  const { getToken } = useAuth();
  const connectionRef = useRef<AbortController | null>(null);

  const store = useStore(sseStore);

  const fetchLiveSymbolsData = useCallback(
    async ({ abortController }: { abortController: AbortController }) => {
      console.log(`awaiting token for connection ID: ${store.connectionId}`);
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      const params = new URLSearchParams();
      params.append('symbols', Array.from(store.symbols).join(','));
      params.append('connectionId', store.connectionId);
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
          store.clients.forEach((client) => {
            if (
              Array.from(client.symbols).some((symbol) =>
                msg.data.includes(symbol)
              )
            ) {
              client.handler(msg.data);
            }
          });
        },
        onclose() {
          console.log(`Connection closed (ID: ${store.connectionId})`);
          throw new Error('Connection closed unexpectedly');
        },
        onerror(error) {
          console.log(`Connection error (ID: ${store.connectionId}):`, error);
          throw new Error('Connection error: ' + error.message);
        },
      });
    },
    [store.connectionId]
  );

  useEffect(() => {
    if (connectionRef.current) {
      connectionRef.current.abort();
    }

    const abortController = new AbortController();
    connectionRef.current = abortController;

    const attemptReconnect = () => {
      fetchLiveSymbolsData({ abortController }).catch(() => {
        console.log('Attempting to reconnect SSE');
        setTimeout(attemptReconnect, 5000); // Retry after 5 seconds
      });
    };

    attemptReconnect();

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
