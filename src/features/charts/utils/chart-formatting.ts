import type { useTranslation } from 'react-i18next';
import type { TimeInterval } from './time-ranges';

export interface FormatChartDateByRangeProps {
  date: Date;
  range: TimeInterval;
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
    case 'SECOND':
    case 'MINUTE':
    case 'HOUR':
      // Show day, month, hour, and minute
      return `${date.toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'short',
      })} ${date.toLocaleTimeString(i18n.language, {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

    case 'DAY':
    case 'WEEK':
    case 'MONTH':
    case 'QUARTER':
    case 'YEAR':
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
