import { Store } from '@tanstack/react-store';
import { createContext } from 'react';
import useWebSocket from 'react-use-websocket';
import type { ReactNode } from 'react';

export type HandlerId = string;
export type WSEvent = string;

interface Handler {
  handlerId: HandlerId;
  events: Set<WSEvent>;
}

const store = new Store({
  handlers: new Map<HandlerId, Handler>(),
  events: new Map<WSEvent, Array<HandlerId>>(),
});

interface WSContextType {
  ws: ReturnType<typeof useWebSocket>;
  updateHandler: (handler: Handler) => void;
  removeHandler: (handlerId: HandlerId) => void;
}

export const WSContext = createContext<WSContextType | undefined>(undefined);

interface WSProviderParams {
  children: ReactNode;
}

export function WSProvider({ children }: WSProviderParams) {
  const loc = window.location;
  const protocol = import.meta.env.PROD ? 'wss' : 'ws';
  const url = `${protocol}://${loc.host}/ws/`;
  const ws = useWebSocket(url, {
    onError: (event) => {
      console.error('WebSocket error observed:', event);
    },
    shouldReconnect: () => true,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 60000,
      interval: 25000,
    },
  });

  function syncBackend() {
    const events = new Set(store.state.events.keys());
    ws.sendJsonMessage({
      set_subscription: Array.from(events),
    });
  }

  function updateHandler({ handlerId, events: newHandlerEvents }: Handler) {
    const newHandlers = new Map(new Map(store.state.handlers));
    if (newHandlerEvents.size > 0) {
      newHandlers.set(handlerId, { handlerId, events: newHandlerEvents });
    } else {
      newHandlers.delete(handlerId);
    }

    const oldEvents = new Map(store.state.events);
    const newEvents = new Map(store.state.events);

    const oldHandlerEvents =
      store.state.handlers.get(handlerId)?.events || new Set();

    const eventsToSubscribe = newHandlerEvents.difference(oldHandlerEvents);
    eventsToSubscribe.forEach((event) => {
      const existingClients = newEvents.get(event) || [];
      newEvents.set(event, [...existingClients, handlerId]);
    });

    const eventsToUnsubscribe = oldHandlerEvents.difference(newHandlerEvents);
    eventsToUnsubscribe.forEach((event) => {
      const clientsForEvent = newEvents.get(event) || [];
      if (clientsForEvent.length === 1) {
        newEvents.delete(event);
      } else {
        newEvents.set(
          event,
          clientsForEvent.filter((id) => id !== handlerId)
        );
      }
    });

    store.setState({
      handlers: newHandlers,
      events: newEvents,
    });

    if (
      new Set(newEvents.keys()).symmetricDifference(new Set(oldEvents.keys()))
        .size > 0
    ) {
      syncBackend();
    }
  }

  function removeHandler(handlerId: HandlerId) {
    updateHandler({ handlerId, events: new Set() });
  }

  const contextValue: WSContextType = {
    updateHandler,
    removeHandler,
    ws,
  };

  return (
    <WSContext.Provider value={contextValue}>{children}</WSContext.Provider>
  );
}
