import { useEffect, useState } from 'react';
import { withTimeout } from '../utils/promise';

export interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface NotificationData {
  instrument?: string;
  price?: number;
  [key: string]: unknown;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    () => Notification.permission
  );
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [lastNotification, setLastNotification] =
    useState<NotificationData | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

  useEffect(() => {
    if (!isSupported) return;

    const listener = (event: MessageEvent) => {
      const notificationData = event.data.payload.data || {};
      setLastNotification(notificationData);
    };

    navigator.serviceWorker.addEventListener('message', listener);
    return () => {
      navigator.serviceWorker.removeEventListener('message', listener);
    };
  }, [isSupported]);

  const requestPermission = async () => {
    if (!isSupported) {
      console.error('Push not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Permission request failed:', err);
      return false;
    }
  };

  const getVapidPublicKey = async () => {
    try {
      const response = await fetch('/api/notifications/vapid-public-key/');
      const data = await response.json();
      return data.public_key;
    } catch (err) {
      console.error('Failed to fetch VAPID public key:', err);
      return null;
    }
  };

  const subscribe = async () => {
    if (!isSupported) {
      console.error('Push notifications are not supported in this browser.');
      return null;
    }

    if (permission === 'default') {
      const granted = await requestPermission();
      if (!granted) {
        console.error('Push notification permission was denied');
        return null;
      }
    }

    const vapidPublicKey = await getVapidPublicKey();
    if (!vapidPublicKey) {
      return null;
    }

    try {
      const registration =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (await navigator.serviceWorker.ready) ??
        (await navigator.serviceWorker.register('/sw.js'));

      const existing = await registration.pushManager.getSubscription();
      if (existing) {
        setSubscription(existing);
        return toData(existing);
      }

      const applicationServerKey = base64UrlToUint8Array(
        vapidPublicKey
      ) as BufferSource;

      const subscribePromise = registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const newSub = await withTimeout(subscribePromise, 10000);
      setSubscription(newSub);
      return toData(newSub);
    } catch (err) {
      const browserInfo = {
        userAgent: navigator.userAgent,
        isHelium: navigator.userAgent.includes('Helium'),
        pushManagerSupport: 'subscribe' in PushManager.prototype,
      };

      if (err instanceof Error && err.message.includes('timed out')) {
        console.warn(
          'Push subscription timeout - browser may not support push notifications',
          browserInfo
        );
      } else {
        console.error('Subscription failed:', err, browserInfo);
      }

      return null;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) {
      return true;
    }

    try {
      const result = await subscription.unsubscribe();
      if (result) {
        setSubscription(null);
      }
      return result;
    } catch (err) {
      console.error('Unsubscribe failed:', err);
      return false;
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    lastNotification,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

function base64UrlToUint8Array(base64String: string): Uint8Array {
  return Uint8Array.from(
    atob(base64String.replace(/-/g, '+').replace(/_/g, '/')),
    (c) => c.charCodeAt(0)
  );
}

function toData(sub: PushSubscription): PushSubscriptionData {
  return {
    endpoint: sub.endpoint,
    p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('p256dh')!))),
    auth: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('auth')!))),
  };
}
