import { use, useEffect, useMemo } from 'react';
import { WSContext } from '../providers/ws-provider';
import { generateUUID } from '../utils/uuid';

export function useWS(events: Array<string>) {
  const wsContext = use(WSContext);

  if (wsContext === undefined) {
    throw new Error('useWSProvider must be used within a WSProvider');
  }

  const handlerId = useMemo(generateUUID, []);

  useEffect(() => {
    wsContext.updateHandler({
      handlerId,
      events: new Set(events),
    });
  }, [wsContext, events, handlerId]);

  useEffect(() => {
    return () => wsContext.removeHandler(handlerId);
  }, [wsContext, handlerId]);

  return wsContext.ws;
}
