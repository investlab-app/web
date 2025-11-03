import { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { inAppNotification } from '../types/in-app-notification';
import { WSContext } from './ws-provider';

export function InAppNotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wsContext = useContext(WSContext);

  if (wsContext === undefined) {
    throw new Error(
      'InAppNotificationsProvider must be used within a WSProvider'
    );
  }

  const { notificationsWs } = wsContext;

  useEffect(() => {
    if (!notificationsWs.lastJsonMessage) return;

    const notificationData = inAppNotification.safeParse(
      notificationsWs.lastJsonMessage
    );
    if (notificationData.error) {
      console.warn('Invalid notification format:', notificationData.error);
      return;
    }

    const notification = notificationData.data.notification;

    toast.info(notification.title, {
      description: notification.body,
    });
  }, [notificationsWs.lastJsonMessage]);

  return <>{children}</>;
}
