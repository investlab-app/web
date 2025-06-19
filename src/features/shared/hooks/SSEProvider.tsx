import { createContext, useContext, useMemo, useState } from 'react';
import { useSSE } from './use-sse-store';
import type { Operation } from './use-sse-store';
import type { ReactNode } from 'react';

interface SSEContextType {
  addOperation: (operation: Operation) => void;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

interface SSEProviderParams {
  children: ReactNode;
}

export function SSEProvider({ children }: SSEProviderParams) {
  const { addOperation } = useSSE();

  const contextValue: SSEContextType = useMemo(
    () => ({ addOperation }),
    [addOperation]
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
    // const handler = (message: string) => {
    //   setMessages((prev) => [...prev, message]);
    // };

    const clientId = { value: crypto.randomUUID() };

    const eventsArray = new Set(events.values().map((e) => ({ value: e })));

    context.addOperation({
      type: 'subscription',
      clientId,
      events: eventsArray,
    });

    return () => {
      context.addOperation({
        type: 'cancellation',
        clientId,
        events: eventsArray,
      });
    };
  }, [context, events]);

  return { messages };
}
