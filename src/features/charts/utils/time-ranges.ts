export type TimeInterval = '1m' | '5m' | '30m' | '1h' | '1d' | '1wk';

export const timeIntervals: Record<TimeInterval, string> = {
  '1m': 'common.intervals.one_minute',
  '5m': 'common.intervals.five_minutes',
  '30m': 'common.intervals.thirty_minutes',
  '1h': 'common.intervals.one_hour',
  '1d': 'common.intervals.one_day',
  '1wk': 'common.intervals.one_week',
};

export const intervalToStartDate = (
  range: TimeInterval,
  now = new Date()
): Date => {
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
