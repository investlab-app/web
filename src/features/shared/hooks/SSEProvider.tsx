import { createContext, useContext, useMemo, useState } from 'react';
import { useSSE } from './use-sse-store';
import type { Client } from './use-sse-store';
import type { ReactNode } from 'react';

interface SSEContextType {
  subscribe: (update: Client) => void;
  unsubscribe: (update: Client) => void;
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
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error('useSSEProvider must be used within a SSEProvider');
  }

  const [messages, setMessages] = useState<Array<string>>([]);

  useMemo(() => {
    const handler = (message: string) => {
      setMessages((prev) => [...prev, message]);
    };

    const clientId = crypto.randomUUID();

    context.subscribe({ clientId, events, handler });

    return () => {
      context.unsubscribe({ clientId, events, handler });
    };
  }, [context, events]);

  return { messages };
}
