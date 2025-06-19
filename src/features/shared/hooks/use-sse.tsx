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
import { Store } from '@tanstack/react-store';
import { useSubscribeToSymbols } from './use-subscribe';
import { useUnsubscribeFromSymbols } from './use-unsubscribe';
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


type ClientId = string;
type Symbol = string;

export interface Client {
  clientId: ClientId;
  handler: (message: string) => void;
  symbols: Set<Symbol>;
}

export interface SseOperation {
  type: 'subscribe' | 'unsubscribe';
  clientId: ClientId;
  symbols: Symbol[];
}


const sseStore = new Store({
  clients: new Map<ClientId, Client>(),
  symbols: new Set<Symbol>(),
  connectionId: crypto.randomUUID(),
  pendingOperations: new Map<ClientId, Array<SseOperation>>(),
});
type SSEStore = typeof sseStore;

const processOperations = (store: SSEStore) => {
  const { pendingOperations, clients } = store.state;

  // Process pending operations
  const actualOperations = pendingOperations.keys().reduce((acc, clientId) => {
    const operations = pendingOperations.get(clientId) || [];

    const operationsBalance = operations.reduce((acc, operation) => {
      operation.symbols.forEach((symbol) => {
        acc.set(symbol, (acc.get(symbol) || 0) + (operation.type === 'subscribe' ? 1 : -1));
      });
      return acc;
    }, new Map<Symbol, number>()) || new Map<Symbol, number>();

    const actualOperations = operationsBalance.keys().reduce((acc, symbol) => {
      const count = operationsBalance.get(symbol);

      if (!count || count === 0) {
        return acc;
      }
      const operation: SseOperation = {
        type: count > 0 ? 'subscribe' : 'unsubscribe',
        clientId,
        symbols: [symbol],
      };

      acc.push(operation);
      return acc;
    }, new Array<SseOperation>());

    return acc.set(clientId, actualOperations);
  }, new Map<ClientId, Array<SseOperation>>());

  // Update clients
  actualOperations.forEach((operations, clientId) => {
    const client = clients.get(clientId);
    if (!client) {
      return;
    }

    const newSymbols = operations.reduce((acc, operation) => {
      switch (operation.type) {
        case 'subscribe':
          acc.union(new Set(operation.symbols));
          break;
        case 'unsubscribe':
          acc.difference(new Set(operation.symbols));
          break;
      }
      return acc;
    }, client.symbols);

    clients.set(clientId, {
      ...client,
      symbols: newSymbols
    });
  });

  // Update store symbols
  const atomSubscriptions = Array.from(actualOperations.values()).flatMap(
    (ops) => Array.from(ops.values())
  ).flatMap((op) => {
    return op.symbols.map((symbol) => ({
      symbols: symbol,
      type: op.type,
    }));
  });

  const symbolChanges = atomSubscriptions.reduce(
    (acc, current) => {
      switch (current.type) {
        case 'subscribe':
          acc = acc.filter((item) => item.symbols !== current.symbols);
          acc.push(current);
          break;
        case 'unsubscribe':
          // keep
          break;
      }
      return acc;
    }, atomSubscriptions);

  const changes = symbolChanges.reduce(
    (acc, current) => {
      if (current.type === 'subscribe') {
        acc.subscribe.add(current.symbols);
      } else {
        acc.unsubscribe.add(current.symbols);
      }
      return acc;
    },
    { subscribe: new Set<Symbol>(), unsubscribe: new Set<Symbol>() }
  );

  // send operations to backend
  if (changes.subscribe.size > 0) {
  }

  if (changes.unsubscribe.size > 0) {
  }

  // update symbols in store
  if (changes.subscribe.size > 0) {
    store.setState((state) => ({
      ...state,
      symbols: new Set([...state.symbols, ...changes.subscribe]).difference(changes.unsubscribe)}))
  }
}
export function LivePricesProvider({ children }: LivePricesProviderParams) {
  const { getToken } = useAuth();
  const connectionRef = useRef<AbortController | null>(null);

  const 


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
              handler.handler(msg.data);
            }
          });
        },
        onclose() {
          console.log(`Connection closed (ID: ${connectionId})`);
          throw new Error('Connection closed unexpectedly');
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
    (handler: Client) => {
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
    (handler: Client) => {
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
