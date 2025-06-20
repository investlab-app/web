import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSSE } from './use-sse';
import type { ClientId, Operation } from './use-sse';
import type { ReactNode } from 'react';

interface SSEContextType {
  addOperation: (operation: Operation) => void;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

interface SSEProviderParams {
  children: ReactNode;
}

export function SSEProvider({ children }: SSEProviderParams) {
  const { batchOperation } = useSSE();

  const contextValue: SSEContextType = useMemo(
    () => ({ addOperation: batchOperation }),
    [batchOperation]
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

  useEffect(() => {
    const clientId: ClientId = { value: crypto.randomUUID() };

    context.addOperation({
      type: 'subscription',
      events: events,
    });

    return () => {
      context.addOperation({
        type: 'cancellation',
        events: events,
      });
    };
  }, [context, events]);

  return { messages };
}
