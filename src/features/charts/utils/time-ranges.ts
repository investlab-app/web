export type TimeInterval =
  | 'SECOND'
  | 'MINUTE'
  | 'HOUR'
  | 'DAY'
  | 'WEEK'
  | 'MONTH'
  | 'QUARTER'
  | 'YEAR';

export const timeIntervals: Record<TimeInterval, string> = {
  SECOND: 'common.intervals.second',
  MINUTE: 'common.intervals.minute',
  HOUR: 'common.intervals.hour',
  DAY: 'common.intervals.day',
  WEEK: 'common.intervals.week',
  MONTH: 'common.intervals.month',
  QUARTER: 'common.intervals.quarter',
  YEAR: 'common.intervals.year',
};

export const intervalToStartDate = (
  range: TimeInterval,
  now = new Date()
): Date => {
  const start = new Date(now);

  switch (range) {
    case 'SECOND':
      start.setMinutes(now.getMinutes() - 1);
      break;
    case 'MINUTE':
      start.setDate(now.getDate() - 1);
      break;
    case 'HOUR':
      start.setDate(now.getDate() - 5);
      break;
    case 'DAY':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'WEEK':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'MONTH':
      start.setFullYear(now.getFullYear() - 5);
      break;
    case 'QUARTER':
      start.setFullYear(now.getFullYear() - 50);
      break;
    case 'YEAR':
      start.setFullYear(Math.max(now.getFullYear() - 100, 1970));
      break;
  }

  return start;
};
