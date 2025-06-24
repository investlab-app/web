export const timeIntervals = [
  { labelKey: 'common.intervals.one_minute', value: '1m' },
  { labelKey: 'common.intervals.five_minutes', value: '5m' },
  { labelKey: 'common.intervals.thirty_minutes', value: '30m' },
  { labelKey: 'common.intervals.one_hour', value: '1h' },
  { labelKey: 'common.intervals.one_day', value: '1d' },
  { labelKey: 'common.intervals.one_week', value: '1wk' },
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
