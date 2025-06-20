import { useContext, useEffect, useRef } from 'react';
import { Handler, SSEContext } from './SSEProvider';
import type { HandlerId } from './SSEProvider';

export function useSSE({
  events,
  callback,
}: {
  events: Set<string>;
  callback: (data: string) => void;
}) {
  const sse = useContext(SSEContext);

  if (sse === undefined) {
    throw new Error('useSSEProvider must be used within a SSEProvider');
  }

  const handlerId = useRef<HandlerId>(crypto.randomUUID());

  useEffect(() => {
    const handler = new Handler(handlerId.current, callback, events);
    sse.updateHandler(handler);
  }, [sse, events, callback]);

  return {
    cleanup: () => sse.cleanup(handlerId.current),
  };
}
