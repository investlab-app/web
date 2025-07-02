import { Store } from '@tanstack/react-store';
import { useAuth } from '@clerk/clerk-react';
import { createContext, useCallback, useEffect, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import type { ReactNode } from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export type HandlerId = string;
export type HandlerFn = (data: string) => void;
export type SSEEvent = string;

export class Handler {
  constructor(
    readonly handlerId: HandlerId,
    readonly handler: HandlerFn,
    readonly events: Set<SSEEvent>
  ) {}
}

const store = new Store({
  connectionId: crypto.randomUUID(),
  handlers: new Map<HandlerId, Handler>(),
  events: new Map<SSEEvent, Array<HandlerId>>(),
});

interface SSEContextType {
  updateHandler: (handler: Handler) => void;
  cleanup: (handlerId: HandlerId) => void;
}

export const SSEContext = createContext<SSEContextType | undefined>(undefined);

interface SSEProviderParams {
  children: ReactNode;
}

export function SSEProvider({ children }: SSEProviderParams) {
  const { getToken } = useAuth();

  const { mutate: syncBackend } = useMutation({
    mutationFn: async () => {
      const events = Array.from(store.state.events.keys());
      const connectionId = store.state.connectionId;

      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${baseUrl}/api/sse/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols: events, connectionId }),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to update SSE subscriptions: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
  });

  const consume = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      return;
    }

    const params = new URLSearchParams();
    params.append('symbols', '');
    params.append('connectionId', store.state.connectionId);
    const url = `${baseUrl}/api/sse?${params.toString()}`;

    await fetchEventSource(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      openWhenHidden: true,
      async onopen(response) {
        if (
          response.ok &&
          response.headers.get('content-type') === EventStreamContentType
        ) {
          // syncBackend();
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
        store.state.handlers.forEach((handler) => {
          // if (Array.from(handler.events).some((event) => msg.event === event)) {
          try {
            handler.handler(msg.data);
          } catch (error) {
            console.error('Error handling SSE message:', error);
          }
        });
      },
      onclose() {
        throw new Error('Connection closed unexpectedly');
      },
      onerror(error) {
        throw error;
      },
    });
  }, [getToken]);

  useEffect(() => {
    const consumeWithReconnection = () => {
      consume().catch(() => {
        setTimeout(consumeWithReconnection, 1000);
      });
    };

    consumeWithReconnection();
  }, [consume]);

  const updateHandler = useCallback(
    (handler: Handler) => {
      const handlers = new Map(store.state.handlers);
      handlers.set(handler.handlerId, handler);

      const events = new Map(store.state.events);
      const oldEvents =
        store.state.handlers.get(handler.handlerId)?.events || new Set();
      const newEvents = new Set(handler.events);
      const eventsToSubscribe = newEvents.difference(oldEvents);
      eventsToSubscribe.forEach((event) => {
        const existingClients = events.get(event) || [];
        events.set(event, [...existingClients, handler.handlerId]);
      });
      const eventsToUnsubscribe = oldEvents.difference(newEvents);
      eventsToUnsubscribe.forEach((event) => {
        const clientsForEvent = events.get(event) || [];
        if (clientsForEvent.length === 1) {
          events.delete(event);
        } else {
          events.set(
            event,
            clientsForEvent.filter((id) => id !== handler.handlerId)
          );
        }
      });

      if (
        new Set(events.keys()).difference(new Set(store.state.events.keys()))
          .size > 0
      ) {
        syncBackend();
      }

      store.setState({
        ...store.state,
        handlers,
        events,
      });
    },
    [syncBackend]
  );

  const cleanup = useCallback(
    (handlerId: HandlerId) => {
      const handlers = new Map(store.state.handlers);
      handlers.delete(handlerId);

      const eventsToUnsubscribe =
        store.state.handlers.get(handlerId)?.events || new Set();

      const events = new Map(store.state.events);
      eventsToUnsubscribe.forEach((event) => {
        const clientsForEvent = events.get(event) || [];
        if (clientsForEvent.length === 1) {
          events.delete(event);
        } else {
          events.set(
            event,
            clientsForEvent.filter((id) => id !== handlerId)
          );
        }
      });

      if (
        new Set(events.keys()).difference(new Set(store.state.events.keys()))
          .size > 0
      ) {
        syncBackend();
      }

      store.setState({
        ...store.state,
        handlers,
        events,
      });
    },
    [syncBackend]
  );

  const contextValue: SSEContextType = useMemo(
    () => ({ updateHandler, cleanup }),
    [updateHandler, cleanup]
  );

  return (
    <SSEContext.Provider value={contextValue}>{children}</SSEContext.Provider>
  );
}
