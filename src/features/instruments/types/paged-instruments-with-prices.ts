import { type } from 'arktype';
import { pagedInstrumentsItem } from './paged-instruments';

const price = type({
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

export const pagedInstrumentsItemWithPrices = pagedInstrumentsItem.and({
  price: price.or('null'),
});

export const pagedInstrumentsWithPrices = type({
  count: 'number',
  next: 'string | null',
  previous: 'string | null',
  results: pagedInstrumentsItemWithPrices.array(),
});
