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

const LAST_POINTS_QUANTITY = 400;

export const intervalToStartDate = (range: TimeInterval, now: Date): Date => {
  const start = new Date(now);

  switch (range) {
    case 'SECOND':
      start.setSeconds(now.getSeconds() - LAST_POINTS_QUANTITY);
      break;
    case 'MINUTE':
      start.setMinutes(now.getMinutes() - LAST_POINTS_QUANTITY);
      break;
    case 'HOUR':
      start.setHours(now.getHours() - LAST_POINTS_QUANTITY);
      break;
    case 'DAY':
      start.setDate(now.getDate() - LAST_POINTS_QUANTITY);
      break;
    case 'WEEK':
      start.setDate(now.getDate() - LAST_POINTS_QUANTITY * 7);
      break;
    case 'MONTH':
      start.setMonth(now.getMonth() - LAST_POINTS_QUANTITY);
      break;
    case 'QUARTER':
      start.setMonth(now.getMonth() - LAST_POINTS_QUANTITY * 3);
      break;
    case 'YEAR': {
      start.setFullYear(now.getFullYear() - LAST_POINTS_QUANTITY);
      break;
    }
  }

  // Return epoch start if calculated date is before epoch
  if (start.getTime() < 0) {
    return new Date(0);
  }

  return start;
};
