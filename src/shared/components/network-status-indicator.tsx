import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useNetworkStatus } from '../hooks/use-network-status';
import { Badge } from '../../features/shared/components/ui/badge';

export function NetworkStatusIndicator() {
  const { isOnline, isReconnecting } = useNetworkStatus();

  if (isReconnecting) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Reconnecting...
      </Badge>
    );
  }

  if (!isOnline) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="flex items-center gap-1">
      <Wifi className="h-3 w-3" />
      Online
    </Badge>
  );
}