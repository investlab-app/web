export const timeIntervals = [
  { label: '1 Minute', value: '1m' },
  { label: '5 Minutes', value: '5m' },
  { label: '30 Minutes', value: '30m' },
  { label: '1 Hour', value: '1h' },
  { label: '1 Day', value: '1d' },
  { label: '1 Week', value: '1wk' },
];

export const intervalToStartDate = (range: string, date?: Date): Date => {
  const now = date ?? new Date();
  const start = new Date(now);
  switch (range) {
    case '1m':
      start.setDate(now.getDate() - 1);
      break;
    case '5m':
      start.setDate(now.getDate() - 5);
      break;
    case '30m':
      start.setMonth(now.getMonth() - 1);
      break;
    case '1h':
      start.setMonth(now.getMonth() - 3);
      break;
    case '1d':
      start.setFullYear(now.getFullYear() - 5);
      break;
    case '1wk':
      start.setFullYear(now.getFullYear() - 50);
      break;
  }
  return start;
};
