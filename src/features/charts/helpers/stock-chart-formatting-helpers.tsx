export function createLabelIntervalFn(
  dataLength: number
): (index: number, value: string) => boolean {
  if (dataLength <= 10) {
    // Show all labels if there are 10 or fewer
    return () => true;
  }

  const interval = Math.floor(dataLength / 5);

  return (index: number) => index % interval === 0;
}

export function formatChartDateByRange(
  value: string,
  range: string,
  tooltip = false
): string {
  const date = new Date(value);

  switch (range) {
    case '1h':
    case '1d':
      // Show hour and minute
      return date.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      });

    case '1w':
      // Show day, month, hour, and minute
      return `${date.toLocaleDateString('en-UK', {
        day: 'numeric',
        month: 'short',
      })} ${date.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

    case '1m':
      // Show day and month
      return date.toLocaleDateString('en-UK', {
        day: 'numeric',
        month: 'short',
      });

    case '6m':
    case '1y':
    case '5y':
    case 'max':
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
