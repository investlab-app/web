export const timeRanges = [
  { label: '1 Hour', value: '1h' },
  { label: '1 Day', value: '1d' },
  { label: '1 Week', value: '1w' },
  { label: '1 Month', value: '1m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
  { label: '5 Years', value: '5y' },
  { label: 'Max', value: 'max' },
];

export const rangeToIntervalMap: Record<string, string> = {
  '1h': '1m',
  '1d': '5m',
  '1w': '30m',
  '1m': '1d',
  '6m': '1d',
  '1y': '1d',
  '5y': '1d',
  max: '1wk',
};

export const rangeToStartDate = (range: string): Date => {
  const now = new Date();
  const start = new Date(now);
  switch (range) {
    case '1h':
      start.setHours(now.getHours() - 1);
      break;
    case '1d':
      start.setDate(now.getDate() - 1);
      break;
    case '1w':
      start.setDate(now.getDate() - 7);
      break;
    case '1m':
      start.setMonth(now.getMonth() - 1);
      break;
    case '6m':
      start.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case '5y':
      start.setFullYear(now.getFullYear() - 5);
      break;
    case 'max':
      start.setFullYear(now.getFullYear() - 50);
      break;
  }
  return start;
};
