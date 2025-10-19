import { use, useEffect } from 'react';
import { toast } from 'sonner';
import { inAppNotification } from '../types/in-app-notification';
import { WSContext } from './ws-provider';

export function InAppNotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wsContext = use(WSContext);

  if (wsContext === undefined) {
    throw new Error(
      'InAppNotificationsProvider must be used within a WSProvider'
    );
  }

  useEffect(() => {
    const notificationData = inAppNotification.safeParse(
      wsContext.ws.lastJsonMessage
    );
    if (notificationData.error) return;

    const notification = notificationData.data.notification;

    toast.info(notification.title, {
      description: notification.body,
    });
  }, [wsContext.ws.lastJsonMessage]);

  return <>{children}</>;
}
