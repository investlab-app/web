import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Clock } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import {
  NOTIFICATION_TYPE_META,
  formatRelativeTime,
  getPluralForm,
} from '../utils/notification-helpers';
import type { NotificationTypeMeta } from '../utils/notification-helpers';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/shared/components/ui/popover';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { ScrollArea } from '@/features/shared/components/ui/scroll-area';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { Separator } from '@/features/shared/components/ui/separator';
import { cn } from '@/features/shared/utils/styles';
import { investorsMeNotificationsListOptions } from '@/client/@tanstack/react-query.gen';

interface NotificationItemProps {
  title: string;
  message: string;
  sentAt: string;
  locale: string;
  meta: NotificationTypeMeta;
}

function NotificationItem({
  title,
  message,
  sentAt,
  locale,
  meta,
}: NotificationItemProps) {
  const Icon = meta.icon;

  return (
    <article className="group relative flex w-full items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3 transition hover:bg-muted/60">
      <span
        aria-hidden
        className={cn(
          'flex h-10 w-10 flex-none items-center justify-center rounded-md border text-base transition-colors',
          meta.iconClassName
        )}
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold leading-tight text-foreground">
            {title}
          </h4>
          <Badge
            variant={meta.badgeVariant}
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          >
            {meta.fallbackLabel}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
          {message}
        </p>

        <div className="mt-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          <time dateTime={sentAt}>{formatRelativeTime(sentAt, locale)}</time>
        </div>
      </div>
    </article>
  );
}

export function NotificationPanel() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data: notifications = [], isPending } = useQuery(
    investorsMeNotificationsListOptions()
  );

  const locale = i18n.language || 'en';

  const normalizedNotifications = useMemo(
    () =>
      notifications.map((notification) => {
        const typeKey = notification.type || 'system';
        const meta =
          NOTIFICATION_TYPE_META[typeKey] ?? NOTIFICATION_TYPE_META.system;
        const fallbackMessage =
          notification.message_en || notification.message_pl || '';

        return {
          id: notification.id,
          title: t(meta.labelKey, meta.fallbackLabel),
          message:
            locale.startsWith('pl') && notification.message_pl
              ? notification.message_pl
              : notification.message_en || fallbackMessage,
          sentAt: notification.sent_at,
          meta,
        };
      }),
    [notifications, locale, t]
  );

  const hasNotifications = normalizedNotifications.length > 0;
  const triggerLabel = hasNotifications
    ? t('notifications.trigger_with_count', {
        count: normalizedNotifications.length,
      })
    : t('common.notifications');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={triggerLabel}
        >
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[420px] overflow-hidden rounded-xl border border-border/60 p-0 shadow-xl"
        align="end"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-4 py-3">
          <h3 className="text-sm font-semibold leading-none">
            {t('common.notifications')}
          </h3>
          {hasNotifications ? (
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              {t(
                `notifications.count_${getPluralForm(normalizedNotifications.length, locale)}`,
                {
                  count: normalizedNotifications.length,
                }
              )}
            </Badge>
          ) : null}
        </div>

        <Separator />

        <ScrollArea className="h-[400px]">
          {isPending ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : !hasNotifications ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-border/60 bg-muted/40">
                <Bell className="h-6 w-6 text-muted-foreground" aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {t('common.no_notifications')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.empty_state.description')}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {normalizedNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  title={notification.title}
                  message={notification.message}
                  sentAt={notification.sentAt}
                  locale={locale}
                  meta={notification.meta}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
