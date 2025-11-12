import { Receipt, ShieldCheck, ShoppingCart, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NotificationBadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline';

export type NotificationTypeMeta = {
  labelKey: string;
  fallbackLabel: string;
  badgeVariant: NotificationBadgeVariant;
  icon: LucideIcon;
  iconClassName: string;
};

export const NOTIFICATION_TYPE_META: Record<string, NotificationTypeMeta> = {
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

export function getPluralForm(count: number, locale: string): string {
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

export function formatRelativeTime(dateString: string, locale: string) {
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
