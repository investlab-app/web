import { useState, useEffect } from 'react';
import { Bell, BellOff, Trash2, Download, Wifi } from 'lucide-react';
import { Button } from '../../features/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../features/shared/components/ui/card';
import { Checkbox } from '../../features/shared/components/ui/checkbox';
import { toast } from 'sonner';

export function PWASettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [cacheSize, setCacheSize] = useState<string>('0 KB');

  useEffect(() => {
    // Check if app is installed
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Get cache size
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map((cacheName) =>
            caches.open(cacheName).then((cache) => cache.keys())
          )
        ).then((cacheKeys) => {
          const totalSize = cacheKeys.reduce((acc, keys) => acc + keys.length, 0);
          setCacheSize(`${totalSize} items`);
        });
      });
    }
  }, []);

  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      toast.error('Notifications are not supported in this browser');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(false);
      toast.success('Notifications disabled');
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success('Notifications enabled');
      } else {
        toast.error('Notification permission denied');
      }
    }
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      setCacheSize('0 KB');
      toast.success('Cache cleared successfully');
    }
  };

  const handleInstall = () => {
    // Trigger install prompt
    const event = new Event('beforeinstallprompt');
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            PWA Settings
          </CardTitle>
          <CardDescription>
            Manage your Progressive Web App settings and offline features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Installation Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">App Installation</p>
              <p className="text-sm text-muted-foreground">
                {isInstalled ? 'Installed as app' : 'Not installed'}
              </p>
            </div>
            {!isInstalled && (
              <Button onClick={handleInstall} size="sm">
                Install App
              </Button>
            )}
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 text-green-500" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates and alerts
                </p>
              </div>
            </div>
            <Checkbox
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>

          {/* Cache Management */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Offline Cache</p>
                <p className="text-sm text-muted-foreground">
                  {cacheSize} cached for offline use
                </p>
              </div>
            </div>
            <Button
              onClick={handleClearCache}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}