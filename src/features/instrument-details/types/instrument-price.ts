import { type } from 'arktype';

export const instrumentPrice = type({
  current_price: 'number',
  daily_summary: {
    open: 'number',
    high: 'number',
    low: 'number',
    close: 'number',
    volume: 'number',
    volume_weighted_average_price: 'number',
  },
  todays_change: 'number',
  todays_change_percent: 'number',
  last_updated: 'string',
});
