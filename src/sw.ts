/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precached manifest injected at build
precacheAndRoute(self.__WB_MANIFEST);

// Serve index.html for all SPA navigation requests
const networkFirst = new NetworkFirst({ cacheName: 'html-cache' });
const navRoute = new NavigationRoute(networkFirst, {
  denylist: [/^\/api\//],
});
registerRoute(navRoute);

// Show notifications
self.addEventListener('push', (event) => {
  const handlePush = async () => {
    let data;
    try {
      data = event.data?.json() ?? {};
    } catch {
      data = { body: event.data?.text() || 'You have a new message.' };
    }

    const title = data.title || 'InvestLab';
    const options = {
      body: data.body,
      icon: data.icon || '/icons/logo192.png',
      badge: data.badge || '/icons/logo192.png',
      image: data.image,
      data: data.url || '/',
    };

    self.registration.showNotification(title, options);

    const allClients = await self.clients.matchAll({
      includeUncontrolled: true,
    });
    for (const client of allClients) {
      client.postMessage({ type: 'PUSH_RECEIVED', payload: data });
    }
  };
  event.waitUntil(handlePush());
});

// Focus open tab or open new one
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length > 0) {
        return clients[0].focus();
      } else {
        return self.clients.openWindow(event.notification.data);
      }
    })
  );
});
