import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '../../features/shared/components/ui/button';

interface OfflineFallbackProps {
  onRetry?: () => void;
}

export function OfflineFallback({ onRetry }: OfflineFallbackProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <WifiOff className="h-16 w-16 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">You're offline</h1>
          <p className="text-muted-foreground max-w-md">
            It looks like you've lost your internet connection. 
            Some features may not be available while offline.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>If you continue to have issues, please check your connection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}