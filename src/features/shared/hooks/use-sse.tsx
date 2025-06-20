import { Store } from '@tanstack/react-store';
import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export interface ClientId {
  value: string;
}

type SSEEvent = string;

export interface ClientSubscription {
  clientId: ClientId;
  events: Set<SSEEvent>;
  handler: (data: string) => void;
}

interface Subscription {
  type: 'subscription';
  clientId: ClientId;
  events: Set<SSEEvent>;
  handler: (data: string) => void;
}

interface Cancellation {
  type: 'cancellation';
  clientId: ClientId;
  events: Set<SSEEvent>;
}

export type Operation = Subscription | Cancellation;

const store = new Store({
  clients: new Map<ClientId, ClientSubscription>(),
  events: new Set<SSEEvent>(),
  connectionId: crypto.randomUUID(),
  pendingOperations: new Map<ClientId, Array<Operation>>(),
});

export function useSSE() {
  const { getToken } = useAuth();
  const connectionRef = useRef<AbortController | null>(null);

  const batchOperation = (operation: Operation) => {
    store.setState((state) => {
      const existingOperations =
        state.pendingOperations.get(operation.clientId) || [];

      const updatedOperations = state.pendingOperations.set(
        operation.clientId,
        [...existingOperations, operation]
      );

      return {
        ...state,
        pendingOperations: updatedOperations,
      };
    });
  };

  const { mutate: callSSE } = useMutation({
    mutationFn: async ({
      events,
      connectionId,
      action,
    }: {
      events: Array<SSEEvent>;
      connectionId: string;
      action: 'subscribe' | 'unsubscribe';
    }) => {
      if (events.length === 0) {
        return { success: true, message: 'No events to unsubscribe from' };
      }
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${baseUrl}/api/sse/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols: events, connectionId }),
      });

      if (!response.ok) {
        throw new Error(
          `${action.charAt(0).toUpperCase() + action.slice(1)} failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
  });

  const processBatchedOperations = useCallback(() => {
    const { pendingOperations, clients } = store.state;

    const actualOperations = pendingOperations
      .keys()
      .reduce((acc, clientId) => {
        const operations = pendingOperations.get(clientId) || [];

        const operationsBalance = operations.reduce((balanceAcc, operation) => {
          operation.events.forEach((symbol) => {
            balanceAcc.set(
              symbol,
              (balanceAcc.get(symbol) || 0) +
                (operation.type === 'subscription' ? 1 : -1)
            );
          });
          return balanceAcc;
        }, new Map<SSEEvent, number>());

        const actualClientOperations = operationsBalance
          .entries()
          .reduce((actualAcc, [symbol, count]) => {
            if (count === 0) {
              return actualAcc;
            }

            const operation =
              count > 0
                ? operations.findLast(
                    (op) => op.events.has(symbol) && op.type === 'subscription'
                  )
                : ({
                    type: 'cancellation',
                    clientId,
                    events: new Set([symbol]),
                  } as Cancellation);

            if (!operation) {
              console.warn(
                `No operation found for client ${clientId.value} and event ${symbol}`
              );
              return actualAcc;
            }

            actualAcc.push(operation);

            return actualAcc;
          }, new Array<Operation>());

        return acc.set(clientId, actualClientOperations);
      }, new Map<ClientId, Array<Operation>>());

    // Update clients
    actualOperations.forEach((operations, clientId) => {
      const client = clients.get(clientId) ?? {
        clientId,
        events: new Set<SSEEvent>(),
        handler: () => {},
      };

      const newEvents = operations.reduce((acc, operation) => {
        switch (operation.type) {
          case 'subscription':
            acc.union(new Set(operation.events));
            break;
          case 'cancellation':
            acc.difference(new Set(operation.events));
            break;
        }
        return acc;
      }, client.events);

      clients.set(clientId, {
        ...client,
        events: newEvents,
      });
    });

    // Update store events
    const atomSubscriptions = Array.from(actualOperations.values())
      .flatMap((ops) => Array.from(ops.values()))
      .flatMap((op) => {
        return Array.from(op.events).map((event) => ({
          events: event,
          type: op.type,
        }));
      });

    const symbolChanges = atomSubscriptions.reduce((acc, current) => {
      switch (current.type) {
        case 'subscription':
          acc = acc.filter((item) => item.events !== current.events);
          acc.push(current);
          break;
        case 'cancellation':
          // keep
          break;
      }
      return acc;
    }, atomSubscriptions);

    const changes = symbolChanges.reduce(
      (acc, current) => {
        if (
          current.type === 'subscription' &&
          !store.state.events.has(current.events)
        ) {
          acc.subscribe.add(current.events);
        } else if (
          current.type === 'cancellation' &&
          store.state.events.has(current.events)
        ) {
          acc.cancellation.add(current.events);
        }

        return acc;
      },
      { subscribe: new Set<SSEEvent>(), cancellation: new Set<SSEEvent>() }
    );

    // update events in store
    store.setState((state) => ({
      ...state,
      events: new Set([...state.events, ...changes.subscribe]).difference(
        changes.cancellation
      ),
      pendingOperations: new Map(),
    }));

    // request changes to backend
    if (changes.subscribe.size > 0) {
      callSSE({
        events: Array.from(changes.subscribe),
        connectionId: store.state.connectionId,
        action: 'subscribe',
      });
    }
    if (changes.cancellation.size > 0) {
      callSSE({
        events: Array.from(changes.cancellation),
        connectionId: store.state.connectionId,
        action: 'unsubscribe',
      });
    }
  }, [callSSE]);

  const consumeSSE = useCallback(
    async ({ abortController }: { abortController: AbortController }) => {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      const params = new URLSearchParams();
      params.append('symbols', Array.from(store.state.events).join(','));
      params.append('connectionId', store.state.connectionId);
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
          store.state.clients.forEach((client) => {
            if (
              Array.from(client.events).some((event) => msg.event === event)
            ) {
              client.handler(msg.data);
            }
          });
        },
        onclose() {
          console.log(`Connection closed (ID: ${store.state.connectionId})`);
          throw new Error('Connection closed unexpectedly');
        },
        onerror(error) {
          console.log(
            `Connection error (ID: ${store.state.connectionId}):`,
            error
          );
          throw new Error('Connection error: ' + error.message);
        },
      });
    },
    [getToken]
  );

  useEffect(() => {
    if (connectionRef.current) {
      connectionRef.current.abort();
    }

    const abortController = new AbortController();
    connectionRef.current = abortController;

    const attemptReconnect = () => {
      consumeSSE({ abortController }).catch(() => {
        console.log('Attempting to reconnect SSE');
        setTimeout(attemptReconnect, 5000); // Retry after 5 seconds
      });
    };

    attemptReconnect();

    return () => {
      console.log('Cleanup SSE');

      abortController.abort();
      if (connectionRef.current === abortController) {
        connectionRef.current = null;
      }
    };
  }, [consumeSSE]);

  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(({ currentVal }) => {
      if (
        currentVal.pendingOperations.size === 0 ||
        Date.now() - lastUpdateRef.current < 1000
      ) {
        return;
      }
      lastUpdateRef.current = Date.now();

      // console.log("its actually an update");

      const timeoutId = setTimeout(() => {
        processBatchedOperations();
      }, 100);

      return () => {
        console.log('Clearing timeout for batched operations');
        clearTimeout(timeoutId);
      };
    });

    return () => {
      unsubscribe();
    };
  }, [processBatchedOperations]);

  return {
    batchOperation,
  };
}
