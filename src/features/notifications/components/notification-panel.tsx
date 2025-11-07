import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  Clock,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import type { LucideIcon } from 'lucide-react';
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

type NotificationBadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline';

type NotificationTypeMeta = {
  labelKey: string;
  fallbackLabel: string;
  badgeVariant: NotificationBadgeVariant;
  icon: LucideIcon;
  iconClassName: string;
};

const NOTIFICATION_TYPE_META: Record<string, NotificationTypeMeta> = {
  price_alert: {
    labelKey: 'notifications.types.price_alert',
    fallbackLabel: 'Price alert',
    badgeVariant: 'outline',
    icon: TrendingUp,
    iconClassName:
      'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-400',
  },
  order: {
    labelKey: 'notifications.types.order',
    fallbackLabel: 'Order update',
    badgeVariant: 'outline',
    icon: ShoppingCart,
    iconClassName:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  transaction: {
    labelKey: 'notifications.types.transaction',
    fallbackLabel: 'Transaction',
    badgeVariant: 'outline',
    icon: Receipt,
    iconClassName:
      'border-violet-500/30 bg-violet-500/10 text-violet-600 dark:border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-400',
  },
  system: {
    labelKey: 'notifications.types.system',
    fallbackLabel: 'System',
    badgeVariant: 'secondary',
    icon: ShieldCheck,
    iconClassName:
      'border-muted-foreground/30 bg-muted text-muted-foreground dark:border-muted-foreground/40 dark:bg-muted/60',
  },
};

const RELATIVE_TIME_DIVISIONS: Array<{
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}> = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Infinity, unit: 'year' },
];

const formatterCache = new Map<string, Intl.RelativeTimeFormat>();

function getPluralForm(count: number, locale: string): string {
  if (count === 1) return 'one';

  // Polish plural forms
  const isPolish = locale.startsWith('pl');
  if (isPolish) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 12 && lastTwoDigits <= 14) return 'many';
    if (lastDigit >= 2 && lastDigit <= 4) return 'few';
    return 'many';
  }

  // English and other languages
  return 'other';
}

function getRelativeTimeFormatter(
  locale: string
): Intl.RelativeTimeFormat | null {
  if (
    typeof Intl === 'undefined' ||
    typeof Intl.RelativeTimeFormat === 'undefined'
  ) {
    return null;
  }

  if (!formatterCache.has(locale)) {
    formatterCache.set(
      locale,
      new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    );
  }

  return formatterCache.get(locale) ?? null;
}

function formatRelativeTime(dateString: string, locale: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diffInSeconds = (date.getTime() - Date.now()) / 1000;
  const formatter = getRelativeTimeFormatter(locale);

  if (!formatter) {
    return date.toLocaleString(locale);
  }

  let duration = diffInSeconds;

  for (const division of RELATIVE_TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount || division.amount === Infinity) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), 'year');
}

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
