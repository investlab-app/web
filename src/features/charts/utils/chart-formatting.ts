import type { useTranslation } from 'react-i18next';

interface FormatChartDateByRangeProps {
  date: Date;
  range: string;
  tooltip?: boolean;
  i18n: ReturnType<typeof useTranslation>['i18n'];
}

export function formatChartDateByRange({
  date,
  range,
  tooltip = false,
  i18n,
}: FormatChartDateByRangeProps): string {
  switch (range) {
    case '1m':
    case '5m':
    case '30m':
    case '1h':
      // Show day, month, hour, and minute
      return `${date.toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'short',
      })} ${date.toLocaleTimeString(i18n.language, {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

    case '1d':
    case '1wk':
      // Show month and year
      return tooltip
        ? date.toLocaleDateString(i18n.language, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : date.toLocaleDateString(i18n.language, {
            month: 'short',
            year: 'numeric',
          });

    default:
      // Fallback
      return date.toLocaleDateString(i18n.language);
  }
}
