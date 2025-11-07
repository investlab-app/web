import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Loader2 } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
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
import { investorsMeNotificationsListOptions } from '@/client/@tanstack/react-query.gen';

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
  type: string;
  localizedMessage: string;
  sent_at: string;
}

function NotificationItem({
  type,
  localizedMessage,
  sent_at,
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

  const notificationType = type || 'system';

  return (
    <div
      className={cn(
        'w-full text-left p-3 rounded-md border transition-colors',
        NOTIFICATION_TYPE_COLORS[notificationType],
        'opacity-100 hover:opacity-90'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate">
              {notificationType.charAt(0).toUpperCase() +
                notificationType.slice(1)}
            </h4>
            <Badge
              variant={NOTIFICATION_TYPE_BADGE_VARIANTS[notificationType]}
              className="flex-shrink-0 text-xs"
            >
              {notificationType}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
            {localizedMessage}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(sent_at)}</p>
        </div>
      </div>
    </div>
  );
}

export function NotificationPanel() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const {
    data: notifications = [],
    isPending,
  } = useQuery(investorsMeNotificationsListOptions());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-7 w-7"
          aria-label={t('common.notifications', 'Notifications')}
        >
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[420px] p-0" align="end">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <h3 className="font-semibold text-base">
            {t('common.notifications', 'Notifications')}
          </h3>
        </div>

        <Separator />

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {isPending ? (
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
                  type={notification.type}
                  localizedMessage={
                    i18n.language === 'pl'
                      ? notification.message_pl
                      : notification.message_en
                  }
                  sent_at={notification.sent_at}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
