import { Store } from '@tanstack/react-store';
import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { useCallback, useEffect, useRef } from 'react';

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
  events: Set<SSEEvent>;
}

interface Cancellation {
  type: 'cancellation';
  events: Set<SSEEvent>;
}

export type Operation = Subscription | Cancellation;

const store = new Store({
  clients: new Map<ClientId, ClientSubscription>(),
  events: new Set<SSEEvent>(),
  connectionId: crypto.randomUUID(),
  pendingOperations: new Array<Operation>(),
});

export function useSSE() {
  const { getToken } = useAuth();
  const connectionRef = useRef<AbortController | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const batchOperation = (operation: Operation) => {
    console.log(operation.type);
    lastUpdateRef.current = Date.now();
    store.setState((state) => {
      return {
        ...state,
        pendingOperations: [...state.pendingOperations, operation],
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
    const { pendingOperations } = store.state;

    const { subscribe, cancellation } = pendingOperations
      .reduce((acc, operation) => {
        operation.events.forEach((symbol) => {
          acc.set(
            symbol,
            (acc.get(symbol) || 0) +
              (operation.type === 'subscription' ? 1 : -1)
          );
        });
        return acc;
      }, new Map<SSEEvent, number>())
      .entries()
      .reduce(
        (acc, [symbol, count]) => {
          if (count > 0) {
            acc.subscribe.add(symbol);
          } else if (count < 0) {
            acc.cancellation.add(symbol);
          }
          return acc;
        },
        { subscribe: new Set<SSEEvent>(), cancellation: new Set<SSEEvent>() }
      );

    store.setState((state) => ({
      ...state,
      events: new Set([...state.events, ...subscribe]).difference(cancellation),
      pendingOperations: [],
    }));

    // request changes to backend
    if (subscribe.size > 0) {
      callSSE({
        events: Array.from(subscribe),
        connectionId: store.state.connectionId,
        action: 'subscribe',
      });
    }
    if (cancellation.size > 0) {
      callSSE({
        events: Array.from(cancellation),
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
            throw new Error(`Client error: ${response.status}`);
          } else {
            console.log('Unexpected error');
            throw new Error(`Server error: ${response.status}`);
          }
        },
        onmessage: (msg) => {
          if (msg.event === 'connection_established') {
            batchOperation({
              type: 'subscription',
              events: new Set(store.state.events),
            });
          }
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
          // Throw error to prevent fetchEventSource from retrying
          // Let our React logic handle the retry with fresh state
          throw error;
        },
      });
    },
    [callSSE, getToken]
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

  const waitForProcessing = useCallback(async () => {
    return await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (
          store.state.pendingOperations.length !== 0 &&
          Date.now() - lastUpdateRef.current > 1000
        ) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }, []);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      waitForProcessing().then(() => {
        processBatchedOperations();
      });
    });

    return () => {
      unsubscribe();
    };
  }, [processBatchedOperations, waitForProcessing]);

  return {
    batchOperation,
  };
}
