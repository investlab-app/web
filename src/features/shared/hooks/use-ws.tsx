import { useContext, useEffect, useMemo } from 'react';
import { generateUUID } from '../utils/pseudo-crypto';
import { WSContext } from '../providers/ws-provider';

export function useWS(events: Array<string>) {
  const wsContext = useContext(WSContext);

  if (wsContext === undefined) {
    throw new Error('useWS must be used within a WSProvider');
  }

  const handlerId = useMemo(generateUUID, []);

  useEffect(() => {
    wsContext.updateHandler(channel, {
      handlerId,
      events: new Set(events),
    });
  }, [channel, events, handlerId, wsContext]);

  useEffect(() => {
    return () => wsContext.removeHandler(channel, handlerId);
  }, [channel, handlerId, wsContext]);

  if (channel === 'prices') {
    return wsContext.pricesWs;
  }
  if (channel === 'chat') {
    return wsContext.chatWs;
  }
  return wsContext.notificationsWs;
}
