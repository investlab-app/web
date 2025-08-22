import type { useTranslation } from 'react-i18next';

export function createLabelIntervalFn(
  dataLength: number,
  zoom: number
): (index: number, value: string) => boolean {
  if (dataLength <= 10) {
    return () => true;
  }

  const interval = Math.floor(dataLength / (3 * (1 / zoom)));

  return (index: number) => index % interval === 0;
}

export function formatChartDateByRange(
  value: string,
  range: string,
  tooltip = false,
  i18n: ReturnType<typeof useTranslation>['i18n']
): string {
  const date = new Date(value);

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
        ? date.toLocaleDateString('en-UK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : date.toLocaleDateString('en-UK', {
            month: 'short',
            year: 'numeric',
          });

    default:
      return value; // Fallback
  }
}
