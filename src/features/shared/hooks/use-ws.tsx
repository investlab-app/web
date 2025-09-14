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
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
    We only want to update the handler when events change */
  }, [events, handlerId]);

  useEffect(() => {
    return () => wsContext.removeHandler(handlerId);
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
    We only want to remove the handler on unmount */
  }, []);

  return wsContext.ws;
}
