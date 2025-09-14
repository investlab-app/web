import { type } from 'arktype';
import type { Instrument } from '@/features/instruments/types/types';

const instrumentOverviewItem = type({
  ticker: 'string',
  name: 'string',
  sector: 'string',
  industry: 'string',
  country: 'string',
  currency: 'string',
  current_price: 'string',
  previous_close: 'string',
  day_change: 'string',
  day_change_percent: 'string',
  market_cap: 'string',
  volume: 'number',
});
type InstrumentOverviewItem = typeof instrumentOverviewItem.infer;

export const instrumentOverview = type({
  items: instrumentOverviewItem.array(),
  total: 'number',
  num_pages: 'number',
  page: 'number',
  page_size: 'number',
});

export const instrumentOverviewItemToInstrument = (
  item: InstrumentOverviewItem
): Instrument => {
  return {
    name: item.name,
    volume: item.volume,
    currentPrice: parseFloat(item.current_price),
    dayChange: parseFloat(item.day_change),
    symbol: item.ticker,
  };
};
