import { Store } from '@tanstack/react-store';
import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { useCallback, useEffect, useRef } from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export type ClientId = string;
export type SSEEvent = string;
export type Handler = (data: string) => void;

export interface ClientSubscription {
  clientId: ClientId;
  events: Set<SSEEvent>;
  handler: Handler;
}

interface ClientData {
  events: Set<SSEEvent>;
  handler: Handler;
}

const store = new Store({
  clients: new Map<ClientId, ClientData>(),
  events: new Map<SSEEvent, Array<ClientId>>(),
  connectionId: crypto.randomUUID(),
});

export function useSSE() {
  const { getToken } = useAuth();
  const connectionRef = useRef<AbortController | null>(null);

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

  const consumeSSE = useCallback(
    async ({ abortController }: { abortController: AbortController }) => {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      const params = new URLSearchParams();
      params.append('symbols', '');
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
            throw new Error(`Client error: ${response.status}`);
          } else {
            throw new Error(`Server error: ${response.status}`);
          }
        },
        onmessage: (msg) => {
          if (msg.event === 'connection_established') {
            // callSSE({
            //   action: 'subscribe',
            //   connectionId: store.state.connectionId,
            //   events: Array.from(store.state.events.keys()),
            // });
          }
          store.state.clients.forEach((client) => {
            // if (
            //   Array.from(client.events).some((event) => msg.event === event)
            // ) {
            client.handler(msg.data);
            // }
          });
        },
        onclose() {
          throw new Error('Connection closed unexpectedly');
        },
        onerror(error) {
          throw error;
        },
      });
    },
    [callSSE, getToken]
  );

  useEffect(() => {
    console.log('Setting up SSE connection');
    if (connectionRef.current) {
      connectionRef.current.abort();
    }

    const abortController = new AbortController();
    connectionRef.current = abortController;

    const attemptReconnect = () => {
      consumeSSE({ abortController }).catch(() => {
        console.log('Attempting to reconnect SSE');
        setTimeout(attemptReconnect, 1000);
      });
    };

    attemptReconnect();

    return () => {
      console.log('Cleaning up SSE connection');
      abortController.abort();
      if (connectionRef.current === abortController) {
        connectionRef.current = null;
      }
    };
  }, [consumeSSE]);

  const updateSubscriptions = useCallback(
    ({
      newEvents,
      oldEvents,
    }: {
      newEvents: Set<SSEEvent>;
      oldEvents: Set<SSEEvent>;
    }) => {
      console.log('New events:', newEvents);
      console.log('Old events:', oldEvents);

      const eventsToSubscribe = newEvents.difference(oldEvents);
      if (eventsToSubscribe.size > 0) {
        console.log('Subscribing to new events:', eventsToSubscribe);
        callSSE({
          action: 'subscribe',
          connectionId: store.state.connectionId,
          events: Array.from(eventsToSubscribe),
        });
      }

      const eventsToUnsubscribe = oldEvents.difference(newEvents);
      if (eventsToUnsubscribe.size > 0) {
        console.log('Unsubscribing from old events:', eventsToUnsubscribe);
        callSSE({
          action: 'unsubscribe',
          connectionId: store.state.connectionId,
          events: Array.from(eventsToUnsubscribe),
        });
      }
    },
    [callSSE]
  );

  const subscribe = useCallback(
    (client: ClientSubscription) => {
      console.log('Clients subscribe start', store.state.clients);
      console.log('Events subscribe start', store.state.events);

      const clients = new Map(store.state.clients);
      clients.set(client.clientId, {
        events: client.events,
        handler: client.handler,
      });

      const events = new Map(store.state.events);
      Array.from(client.events).forEach((event) => {
        const existingClients = events.get(event) || [];
        events.set(event, [...existingClients, client.clientId]);
      });

      updateSubscriptions({
        newEvents: new Set(events.keys()),
        oldEvents: new Set(store.state.events.keys()),
      });

      store.setState((state) => {
        return {
          ...state,
          clients,
          events,
        };
      });

      console.log('Clients subscribe end', store.state.clients);
      console.log('Events subscribe end', store.state.events);
    },
    [updateSubscriptions]
  );

  const unsubscribe = useCallback(
    (clientId: ClientId) => {
      console.log('Clients unsubscribe start', store.state.clients);
      console.log('Events unsubscribe start', store.state.events);

      const clientData = store.state.clients.get(clientId);
      if (!clientData) return;

      const clients = new Map(store.state.clients);
      clients.delete(clientId);

      const events = new Map(store.state.events);
      clientData.events.forEach((event) => {
        const clientsForEvent = events.get(event) || [];

        if (clientsForEvent.length === 1) {
          events.delete(event);
        } else {
          events.set(
            event,
            clientsForEvent.filter((id) => id !== clientId)
          );
        }
      });

      updateSubscriptions({
        newEvents: new Set(events.keys()),
        oldEvents: new Set(store.state.events.keys()),
      });

      store.setState((state) => {
        return {
          ...state,
          clients,
          events,
        };
      });

      console.log('Clients unsubscribe end', store.state.clients);
      console.log('Events unsubscribe end', store.state.events);
    },
    [updateSubscriptions]
  );

  return {
    subscribe,
    unsubscribe,
  };
}
