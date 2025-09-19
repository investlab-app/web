import { type } from 'arktype';
import { pagedInstrumentsItem } from './paged-instruments';

const priceInfo = type({
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

export const pagedInstrumentsItemWithPriceInfo = pagedInstrumentsItem.and({
  price_info: priceInfo.or('null'),
});

export const pagedInstrumentsWithPriceInfo = type({
  count: 'number',
  next: 'string | null',
  previous: 'string | null',
  results: pagedInstrumentsItemWithPriceInfo.array(),
});
