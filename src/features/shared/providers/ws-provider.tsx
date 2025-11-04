import { Store } from '@tanstack/react-store';
import { createContext } from 'react';
import useWebSocket from 'react-use-websocket';
import type { ReactNode } from 'react';

export type HandlerId = string;
export type WSEvent = string;
export type WSChannel = 'prices' | 'chat' | 'notifications';

interface Handler {
  handlerId: HandlerId;
  events: Set<WSEvent>;
}

interface ChannelStore {
  handlers: Map<HandlerId, Handler>;
  events: Map<WSEvent, Array<HandlerId>>;
}

const pricesStore = new Store<ChannelStore>({
  handlers: new Map<HandlerId, Handler>(),
  events: new Map<WSEvent, Array<HandlerId>>(),
});

const chatStore = new Store<ChannelStore>({
  handlers: new Map<HandlerId, Handler>(),
  events: new Map<WSEvent, Array<HandlerId>>(),
});

const notificationsStore = new Store<ChannelStore>({
  handlers: new Map<HandlerId, Handler>(),
  events: new Map<WSEvent, Array<HandlerId>>(),
});

interface WSContextType {
  pricesWs: ReturnType<typeof useWebSocket>;
  chatWs: ReturnType<typeof useWebSocket>;
  notificationsWs: ReturnType<typeof useWebSocket>;
  updateHandler: (channel: WSChannel, handler: Handler) => void;
  removeHandler: (channel: WSChannel, handlerId: HandlerId) => void;
}

export const WSContext = createContext<WSContextType | undefined>(undefined);

interface WSProviderParams {
  children: ReactNode;
}

export function WSProvider({ children }: WSProviderParams) {
  const loc = window.location;
  const protocol = import.meta.env.PROD ? 'wss' : 'ws';

  const pricesUrl = `${protocol}://${loc.host}/ws/prices/`;
  const chatUrl = `${protocol}://${loc.host}/ws/chat/`;
  const notificationsUrl = `${protocol}://${loc.host}/ws/notifications/`;

  // Prices WebSocket connection
  const pricesWs = useWebSocket(pricesUrl, {
    onError: (event) => {
      console.error('Prices WebSocket error observed:', event);
    },
    shouldReconnect: () => true,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 60000,
      interval: 25000,
    },
  });

  // Chat WebSocket connection
  const chatWs = useWebSocket(chatUrl, {
    onError: (event) => {
      console.error('Chat WebSocket error observed:', event);
    },
    shouldReconnect: () => true,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 5 * 60000,
      interval: 25000,
    },
  });

  // Notifications WebSocket connection
  const notificationsWs = useWebSocket(notificationsUrl, {
    onError: (event) => {
      console.error('Notifications WebSocket error observed:', event);
    },
    shouldReconnect: () => true,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 60000,
      interval: 25000,
    },
  });

  function syncPricesBackend() {
    const events = new Set(pricesStore.state.events.keys());
    pricesWs.sendJsonMessage({
      set_subscription: Array.from(events),
    });
  }

  function updateHandler(
    channel: WSChannel,
    { handlerId, events: newHandlerEvents }: Handler
  ) {
    let store;

    if (channel === 'prices') {
      store = pricesStore;
    } else if (channel === 'chat') {
      store = chatStore;
    } else {
      store = notificationsStore;
    }

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
      // Only sync backend for prices channel
      if (channel === 'prices') {
        syncPricesBackend();
      }
    }
  }

  function removeHandler(channel: WSChannel, handlerId: HandlerId) {
    updateHandler(channel, { handlerId, events: new Set() });
  }

  const contextValue: WSContextType = {
    pricesWs,
    chatWs,
    notificationsWs,
    updateHandler,
    removeHandler,
  };

  return (
    <WSContext.Provider value={contextValue}>{children}</WSContext.Provider>
  );
}
