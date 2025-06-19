import { Store } from '@tanstack/react-store';
import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

type ClientId = string;
type Event = string;

export interface Client {
  clientId: ClientId;
  events: Set<Event>;
  handler: (data: string) => void;
}

interface SseOperation {
  type: 'subscribe' | 'unsubscribe';
  clientId: ClientId;
  events: Set<Event>;
  handler?: (data: string) => void;
}

export function useSSE() {
  const store = useRef(
    new Store({
      clients: new Map<ClientId, Client>(),
      events: new Set<Event>(),
      connectionId: crypto.randomUUID(),
      pendingOperations: new Map<ClientId, Array<SseOperation>>(),
    })
  );

  const connectionRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (connectionRef.current) {
      connectionRef.current.abort();
    }

    const abortController = new AbortController();
    connectionRef.current = abortController;

    const attemptReconnect = () => {
      fetchLiveEventsData({ abortController }).catch(() => {
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { getToken } = useAuth();

  store.current.subscribe(({ prevVal, currentVal }) => {
    console.log('update');
    console.log(
      `prevVal.pendingOperations: ${prevVal.pendingOperations.forEach(console.log)}`
    );
    console.log(
      `currentVal.pendingOperations: ${currentVal.pendingOperations.forEach(console.log)}`
    );
    if (prevVal.pendingOperations === currentVal.pendingOperations) {
      return;
    }
    console.log('UPDATE!');

    // Add delay to batch operations
    const timeoutId = setTimeout(() => {
      processOperations();
    }, 100);

    // Return cleanup function
    return () => clearTimeout(timeoutId);
  });

  const addOperation = ({ operation }: { operation: SseOperation }) => {
    console.log(
      `Adding operation: ${operation.type} for client ${operation.clientId} with events ${Array.from(operation.events).join(', ')}`
    );
    store.current.setState((state) => {
      const existingOperations =
        state.pendingOperations.get(operation.clientId) || [];

      console.log(
        `Existing operations for client ${operation.clientId}:`,
        existingOperations
      );

      console.log(`New operation:`, operation);

      const updatedOperations = state.pendingOperations.set(
        operation.clientId,
        [...existingOperations, operation]
      );

      console.log(
        `Updated operations ${Array.from(updatedOperations.values().map((ops) => ops.map((op) => op.events).flat()))}`
      );

      return {
        ...state,
        pendingOperations: updatedOperations,
      };
    });
  };

  const subscribe = ({
    clientId,
    events,
    handler,
  }: {
    clientId: ClientId;
    events: Set<string>;
    handler: (data: string) => void;
  }) => {
    addOperation({
      operation: {
        type: 'subscribe',
        clientId,
        events: events,
        handler,
      },
    });

    console.log('Added new OPERATION');
  };

  const unsubscribe = ({
    clientId,
    events,
  }: {
    clientId: ClientId;
    events: Set<Event>;
  }) =>
    addOperation({
      operation: {
        type: 'unsubscribe',
        clientId,
        events: events,
      },
    });

  const callSSE = useMutation({
    mutationFn: async ({
      events,
      connectionId,
      action,
    }: {
      events: Array<Event>;
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
        body: JSON.stringify({ events, connectionId }),
      });

      if (!response.ok) {
        throw new Error(
          `${action.charAt(0).toUpperCase() + action.slice(1)} failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
  });

  const processOperations = () => {
    console.log('PROCESSING OPERATIONS!');
    const { pendingOperations, clients } = store.current.state;

    // Get actual clients updates
    const actualOperations = pendingOperations
      .keys()
      .reduce((acc, clientId) => {
        const operations = pendingOperations.get(clientId) || [];

        const operationsBalance = operations.reduce((balanceAcc, operation) => {
          operation.events.forEach((symbol) => {
            balanceAcc.set(
              symbol,
              (balanceAcc.get(symbol) || 0) +
                (operation.type === 'subscribe' ? 1 : -1)
            );
          });
          return balanceAcc;
        }, new Map<Event, number>());

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
              events: new Set([symbol]),
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

      const newEvents = operations.reduce((acc, operation) => {
        switch (operation.type) {
          case 'subscribe':
            acc.union(new Set(operation.events));
            break;
          case 'unsubscribe':
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
        case 'subscribe':
          acc = acc.filter((item) => item.events !== current.events);
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
          acc.subscribe.add(current.events);
        } else {
          acc.unsubscribe.add(current.events);
        }
        return acc;
      },
      { subscribe: new Set<Event>(), unsubscribe: new Set<Event>() }
    );

    // update events in store
    store.current.setState((state) => ({
      ...state,
      events: new Set([...state.events, ...changes.subscribe]).difference(
        changes.unsubscribe
      ),
      pendingOperations: new Map(),
    }));

    // request changes to backend
    if (changes.subscribe.size > 0) {
      callSSE.mutate({
        events: Array.from(changes.subscribe),
        connectionId: store.current.state.connectionId,
        action: 'subscribe',
      });
    }
    if (changes.unsubscribe.size > 0) {
      callSSE.mutate({
        events: Array.from(changes.unsubscribe),
        connectionId: store.current.state.connectionId,
        action: 'unsubscribe',
      });
    }
  };

  const fetchLiveEventsData = useCallback(
    async ({ abortController }: { abortController: AbortController }) => {
      console.log(
        `awaiting token for connection ID: ${store.current.state.connectionId}`
      );
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      const params = new URLSearchParams();
      params.append('events', Array.from(store.current.state.events).join(','));
      params.append('connectionId', store.current.state.connectionId);
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
          store.current.state.clients.forEach((client) => {
            if (
              Array.from(client.events).some((symbol) =>
                msg.data.includes(symbol)
              )
            ) {
              client.handler(msg.data);
            }
          });
        },
        onclose() {
          console.log(
            `Connection closed (ID: ${store.current.state.connectionId})`
          );
          throw new Error('Connection closed unexpectedly');
        },
        onerror(error) {
          console.log(
            `Connection error (ID: ${store.current.state.connectionId}):`,
            error
          );
          throw new Error('Connection error: ' + error.message);
        },
      });
    },
    [getToken]
  );

  return {
    subscribe,
    unsubscribe,
  };
}
