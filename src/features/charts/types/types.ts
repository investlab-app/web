import { type } from 'arktype';

export const dataPoint = type({
  timestamp: 'string',
  open: 'string',
  close: 'string',
  high: 'string',
  low: 'string',
});
export type DataPoint = typeof dataPoint.infer;

export const instrumentHistory = type({
  min_price: 'number',
  max_price: 'number',
  data: dataPoint.array(),
});
export type InstrumentHistory = typeof instrumentHistory.infer;

export interface InstrumentPriceProps {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
}

export const instrumentOverviewItem = type({
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
export type InstrumentOverviewItem = typeof instrumentOverviewItem.infer;

export const instrumentOverview = type({
  items: instrumentOverviewItem.array(),
  total: 'number',
  num_pages: 'number',
  page: 'number',
  page_size: 'number',
});
export type InstrumentOverview = typeof instrumentOverview.infer;

export const AvailableInstrumentsResponse = type({
  instruments: 'string[]',
});
