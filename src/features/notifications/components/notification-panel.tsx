import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Loader2 } from 'lucide-react';

import {
  useMarkAllNotificationsAsSeen,
  useMarkNotificationAsSeen,
  useNotifications,
  useUnseenNotificationCount,
} from '../hooks';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/shared/components/ui/popover';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { ScrollArea } from '@/features/shared/components/ui/scroll-area';
import { Separator } from '@/features/shared/components/ui/separator';
import { cn } from '@/features/shared/utils/styles';

const NOTIFICATION_TYPE_COLORS: Record<string, string> = {
  price_alert: 'bg-blue-50 dark:bg-blue-950',
  order: 'bg-green-50 dark:bg-green-950',
  transaction: 'bg-purple-50 dark:bg-purple-950',
  system: 'bg-gray-50 dark:bg-gray-950',
};

const NOTIFICATION_TYPE_BADGE_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  price_alert: 'default',
  order: 'default',
  transaction: 'default',
  system: 'secondary',
};

interface NotificationItemProps {
  id: string;
  type: string | undefined;
  title: string | undefined;
  message: string | undefined;
  is_seen: boolean | undefined;
  created_at: string;
  onMarkAsSeen: (id: string) => void;
  isMarking: boolean;
}

function NotificationItem({
  id,
  type,
  title,
  message,
  is_seen,
  created_at,
  onMarkAsSeen,
  isMarking,
}: NotificationItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const notificationType = type ?? 'system';
  const isSeen = is_seen ?? false;

  return (
    <button
      onClick={() => {
        if (!isSeen) onMarkAsSeen(id);
      }}
      className={cn(
        'w-full text-left p-3 rounded-md border transition-colors',
        NOTIFICATION_TYPE_COLORS[notificationType],
        isSeen ? 'opacity-60' : 'opacity-100 hover:opacity-90',
        !isSeen ? 'border-accent' : ''
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate">
              {title ?? 'Notification'}
            </h4>
            <Badge
              variant={NOTIFICATION_TYPE_BADGE_VARIANTS[notificationType]}
              className="flex-shrink-0 text-xs"
            >
              {notificationType}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
            {message ?? 'No message'}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(created_at)}
          </p>
        </div>
        {!isSeen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsSeen(id);
            }}
            disabled={isMarking}
            className="flex-shrink-0 ml-2 mt-1 text-blue-500 hover:text-blue-600 disabled:opacity-50"
            aria-label="Mark as seen"
          >
            {isMarking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </button>
  );
}

export function NotificationPanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data: notifications, isLoading } = useNotifications();
  const { count: unseenCount } = useUnseenNotificationCount();
  const markAsSeen = useMarkNotificationAsSeen();
  const markAllAsSeen = useMarkAllNotificationsAsSeen();

  const handleMarkAsSeen = (id: string) => {
    markAsSeen.mutate(id);
  };

  const handleMarkAllAsSeen = () => {
    markAllAsSeen.mutate();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={t('common.notifications', 'Notifications')}
        >
          <Bell className="h-5 w-5" />
          {unseenCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold"
            >
              {unseenCount > 99 ? '99+' : unseenCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[420px] p-0" align="end">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <h3 className="font-semibold text-base">
            {t('common.notifications', 'Notifications')}
          </h3>
          {unseenCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsSeen}
              disabled={markAllAsSeen.isPending}
              className="h-8 text-xs"
            >
              {markAllAsSeen.isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <span>{t('common.mark_all_as_seen', 'Mark all as seen')}</span>
              )}
            </Button>
          )}
        </div>

        <Separator />

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 p-6">
              <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground text-center">
                {t('common.no_notifications', 'No notifications yet')}
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  type={notification.type}
                  title={notification.title}
                  message={notification.message}
                  is_seen={notification.is_seen}
                  created_at={notification.created_at}
                  onMarkAsSeen={handleMarkAsSeen}
                  isMarking={markAsSeen.isPending}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
