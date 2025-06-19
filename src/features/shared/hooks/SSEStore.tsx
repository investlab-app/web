import { Store } from '@tanstack/react-store';

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

    const operationsBalance =
      operations.reduce((acc, operation) => {
        operation.symbols.forEach((symbol) => {
          acc.set(
            symbol,
            (acc.get(symbol) || 0) + (operation.type === 'subscribe' ? 1 : -1)
          );
        });
        return acc;
      }, new Map<Symbol, number>());

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
  if (changes.subscribe.size > 0) {
    store.setState((state) => ({
      ...state,
      symbols: new Set([...state.symbols, ...changes.subscribe]).difference(
        changes.unsubscribe
      ),
    }));
  }
};
