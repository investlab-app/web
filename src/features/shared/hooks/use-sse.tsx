import { useCallback, useContext, useEffect, useRef } from 'react';
import { Handler, SSEContext } from '../providers/sse-provider';
import type { HandlerId } from '../providers/sse-provider';

export function useSSE({
  events,
  callback: callback,
}: {
  events: Set<string>;
  callback: (data: string) => void;
}) {
  const sse = useContext(SSEContext);

  if (sse === undefined) {
    throw new Error('useSSEProvider must be used within a SSEProvider');
  }

  const handlerId = useRef<HandlerId>(crypto.randomUUID());
  const callbackRef = useRef(callback);
  const eventsRef = useRef(events);

  // Update refs when dependencies change
  callbackRef.current = callback;
  eventsRef.current = events;

  useEffect(() => {
    const handler = new Handler(
      handlerId.current,
      callbackRef.current,
      eventsRef.current
    );
    sse.updateHandler(handler);
  }, [sse, events, callback]);

  const cleanup = useCallback(() => {
    sse.cleanup(handlerId.current);
  }, [sse]);

  return {
    cleanup,
  };
}
