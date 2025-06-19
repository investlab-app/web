import { Store } from '@tanstack/react-store';
import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { baseUrl } from '@/features/shared/api';

type ClientId = string; // todo: Is there a way to have opaque types in TS?
type Symbol = string;

const useSubscribe = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      symbols,
      connectionId,
    }: {
      symbols: Array<Symbol>;
      connectionId: string;
    }) => {
      if (symbols.length === 0) {
        return { success: true, message: 'No symbols to subscribe to' };
      }
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${baseUrl}/api/sse/subscribe`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols, connectionId }),
      });

      if (!response.ok) {
        throw new Error(
          `Subscription failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
  });
};

const useUnsubscribe = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      symbols,
      connectionId,
    }: {
      symbols: Array<Symbol>;
      connectionId: string;
    }) => {
      if (symbols.length === 0) {
        return { success: true, message: 'No symbols to unsubscribe from' };
      }
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${baseUrl}/api/sse/unsubscribe`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols, connectionId }),
      });

      if (!response.ok) {
        throw new Error(
          `Unsubscription failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
  });
};

export interface Client {
  clientId: ClientId;
  handler: (message: string) => void;
  symbols: Set<Symbol>;
}

interface SseOperation {
  type: 'subscribe' | 'unsubscribe';
  clientId: ClientId;
  symbols: Array<Symbol>;
}

export const sseStore = new Store({
  clients: new Map<ClientId, Client>(),
  symbols: new Set<Symbol>(),
  connectionId: crypto.randomUUID(),
  pendingOperations: new Map<ClientId, Array<SseOperation>>(),
});

type SSEStore = typeof sseStore;

sseStore.subscribe((state) => {
  const subscribe = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  // Add delay to batch operations
  const timeoutId = setTimeout(() => {
    processOperations({
      store: sseStore,
      subscribeFn: (symbols) => {
        subscribe.mutate({
          symbols: Array.from(symbols),
          connectionId: state.currentVal.connectionId,
        });
      },
      unsubscribe: (symbols) => {
        unsubscribeMutation.mutate({
          symbols: Array.from(symbols),
          connectionId: state.currentVal.connectionId,
        });
      },
    });
  }, 100);

  // Return cleanup function
  return () => clearTimeout(timeoutId);
});

const addOperation = ({
  client,
  operation,
}: {
  client: Client;
  operation: SseOperation;
}) => {
  sseStore.setState((state) => {
    const existingOperations =
      state.pendingOperations.get(client.clientId) || [];

    return {
      ...state,
      clients: new Map(state.clients).set(client.clientId, client),
      pendingOperations: state.pendingOperations.set(client.clientId, [
        ...existingOperations,
        operation,
      ]),
    };
  });
};

export const subscribe = ({
  client,
  symbols,
}: {
  client: Client;
  symbols: Set<string>;
}) =>
  addOperation({
    client,
    operation: {
      type: 'subscribe',
      clientId: client.clientId,
      symbols: Array.from(symbols),
    },
  });

export const unsubscribe = ({
  client,
  symbols,
}: {
  client: Client;
  symbols: Set<string>;
}) =>
  addOperation({
    client,
    operation: {
      type: 'unsubscribe',
      clientId: client.clientId,
      symbols: Array.from(symbols),
    },
  });

const processOperations = ({
  store,
  subscribeFn,
  unsubscribeFn,
}: {
  store: SSEStore;
  subscribeFn: (symbols: Set<string>) => void;
  unsubscribeFn: (symbols: Set<string>) => void;
}) => {
  const { pendingOperations, clients } = store.state;

  // Get actual clients updates
  const actualOperations = pendingOperations.keys().reduce((acc, clientId) => {
    const operations = pendingOperations.get(clientId) || [];

    const operationsBalance = operations.reduce((balanceAcc, operation) => {
      operation.symbols.forEach((symbol) => {
        balanceAcc.set(
          symbol,
          (balanceAcc.get(symbol) || 0) +
            (operation.type === 'subscribe' ? 1 : -1)
        );
      });
      return balanceAcc;
    }, new Map<Symbol, number>());

    const actualClientOperations = operationsBalance
      .keys()
      .reduce((actualAcc, symbol) => {
        const count = operationsBalance.get(symbol);

        if (!count || count === 0) {
          return actualAcc;
        }
        const operation: SseOperation = {
          type: count > 0 ? 'subscribe' : 'unsubscribe',
          clientId,
          symbols: [symbol],
        };

        actualAcc.push(operation);
        return actualAcc;
      }, new Array<SseOperation>());

    return acc.set(clientId, actualClientOperations);
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
      symbols: newSymbols,
    });
  });

  // Update store symbols
  const atomSubscriptions = Array.from(actualOperations.values())
    .flatMap((ops) => Array.from(ops.values()))
    .flatMap((op) => {
      return op.symbols.map((symbol) => ({
        symbols: symbol,
        type: op.type,
      }));
    });

  const symbolChanges = atomSubscriptions.reduce((acc, current) => {
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

  // update symbols in store
  store.setState((state) => ({
    ...state,
    symbols: new Set([...state.symbols, ...changes.subscribe]).difference(
      changes.unsubscribe
    ),
  }));

  // request changes to backend
  if (changes.subscribe.size > 0) {
    subscribeFn(changes.subscribe);
  }
  if (changes.unsubscribe.size > 0) {
    unsubscribeFn(changes.unsubscribe);
  }
};
