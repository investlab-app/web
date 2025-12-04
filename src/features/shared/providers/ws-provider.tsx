import { Store } from '@tanstack/react-store';
import { createContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useAuth } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateOrderQueries } from '../utils/invalidate-order-queries';
import { orderUpdateSchema } from './types/order-update';
import { llmSchema } from './types/llm';
import type { ReactNode } from 'react';
import { handleLlmMessage } from '@/features/chat/stores/live-chats-store';

export type SubscriptionHandlerId = string;
export type WSEvent = string;

interface SubscriptionHandler {
  handlerId: SubscriptionHandlerId;
  events: Set<WSEvent>;
}

const subscriptionsStore = new Store({
  handlers: new Map<SubscriptionHandlerId, SubscriptionHandler>(),
  events: new Map<WSEvent, Array<SubscriptionHandlerId>>(),
});

interface TypedWSMessage {
  type: string;
  [key: string]: unknown;
}

interface WSContextType {
  ws: ReturnType<typeof useWebSocket<TypedWSMessage | null>>;
  updateHandler: (handler: SubscriptionHandler) => void;
  removeHandler: (handlerId: SubscriptionHandlerId) => void;
}

export const WSContext = createContext<WSContextType | undefined>(undefined);

interface WSProviderParams {
  children: ReactNode;
}

export function WSProvider({ children }: WSProviderParams) {
  const loc = window.location;
  const protocol = loc.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${protocol}://${loc.host}/ws/`;
  const { isSignedIn } = useAuth();
  const connect = isSignedIn;
  const ws = useWebSocket<TypedWSMessage | null>(
    url,
    {
      onError: (event) => {
        console.error('WebSocket error observed:', event);
      },
      shouldReconnect: () => true,
      heartbeat: {
        message: JSON.stringify({ type: 'ping' }),
        returnMessage: JSON.stringify({ type: 'pong' }),
        timeout: 60000,
        interval: 25000,
      },
    },
    connect
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (ws.lastJsonMessage?.type === 'order_update') {
      const parsed = orderUpdateSchema.safeParse(ws.lastJsonMessage);
      if (parsed.success) {
        invalidateOrderQueries(queryClient, parsed.data.data.tickers);
      } else {
        console.error('Failed to parse order_update message', parsed.error);
      }
    }

    if (ws.lastJsonMessage?.type === 'llm') {
      const parsed = llmSchema.safeParse(ws.lastJsonMessage);
      if (parsed.success) {
        handleLlmMessage(parsed.data);
      } else {
        console.error('Failed to parse llm message', parsed.error);
      }
    }
  }, [ws.lastJsonMessage, queryClient]);

  function syncBackend() {
    const events = new Set(subscriptionsStore.state.events.keys());
    ws.sendJsonMessage({
      type: 'set_subscription',
      subscriptions: Array.from(events),
    });
  }

  function updateHandler({
    handlerId,
    events: newHandlerEvents,
  }: SubscriptionHandler) {
    const newHandlers = new Map(new Map(subscriptionsStore.state.handlers));
    if (newHandlerEvents.size > 0) {
      newHandlers.set(handlerId, { handlerId, events: newHandlerEvents });
    } else {
      newHandlers.delete(handlerId);
    }

    const oldEvents = new Map(subscriptionsStore.state.events);
    const newEvents = new Map(subscriptionsStore.state.events);

    const oldHandlerEvents =
      subscriptionsStore.state.handlers.get(handlerId)?.events || new Set();

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

    subscriptionsStore.setState({
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

  function removeHandler(handlerId: SubscriptionHandlerId) {
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
