import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { Button } from '../../features/shared/components/ui/button';
import { toast } from 'sonner';

export function PWAUpdater() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
        toast.info('New version available! Click to update.', {
          action: {
            label: 'Update',
            onClick: () => updateSW(),
          },
        });
      },
      onOfflineReady() {
        setOfflineReady(true);
        toast.success('App is ready for offline use!');
      },
      onRegistered(swRegistration) {
        console.log('SW registered: ', swRegistration);
      },
      onRegisterError(error) {
        console.log('SW registration error', error);
      },
    });
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4 max-w-sm">
        {needRefresh && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">New version available!</p>
            <Button onClick={handleUpdate} size="sm" className="w-full">
              Update Now
            </Button>
          </div>
        )}
        {offlineReady && (
          <div>
            <p className="text-sm text-muted-foreground">
              App is ready for offline use
            </p>
          </div>
        )}
      </div>
    </div>
  );
}