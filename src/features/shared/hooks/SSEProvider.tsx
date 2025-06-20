import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSSE } from './use-sse';
import type { ClientId, ClientSubscription } from './use-sse';
import type { ReactNode } from 'react';

interface SSEContextType {
  subscribe: (operation: ClientSubscription) => void;
  unsubscribe: (clientId: ClientId) => void;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

interface SSEProviderParams {
  children: ReactNode;
}

export function SSEProvider({ children }: SSEProviderParams) {
  const { subscribe, unsubscribe } = useSSE();

  const contextValue: SSEContextType = useMemo(
    () => ({ subscribe, unsubscribe }),
    [subscribe, unsubscribe]
  );

  return (
    <SSEContext.Provider value={contextValue}>{children}</SSEContext.Provider>
  );
}

export function useSSEMessages(events: Set<string>) {
  const sse = useContext(SSEContext);

  if (sse === undefined) {
    throw new Error('useSSEProvider must be used within a SSEProvider');
  }

  const [messages, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    const clientId: ClientId = crypto.randomUUID();

    console.log(
      'Subscribing to SSE events:',
      events,
      'with clientId:',
      clientId
    );

    sse.subscribe({
      clientId,
      events,
      handler: (data: string) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      },
    });

    return () => {
      console.log('Should unsubscribe from SSE events:', events);
      sse.unsubscribe(clientId);
    };
  }, [sse, events]);

  return { messages };
}
