import { type } from 'arktype';
import type { Instrument } from '@/features/instruments/types/types';

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
  data: type([dataPoint]),
});
export type InstrumentHistory = typeof instrumentHistory.infer;

export interface InstrumentPriceProps {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
}

export function dataPointToInstrumentPriceProps(
  item: DataPoint
): InstrumentPriceProps {
  return {
    date: item.timestamp,
    open: parseFloat(item.open),
    close: parseFloat(item.close),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
  };
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

export const instrumentOverview = type({
  items: instrumentOverviewItem.array(),
  total: 'number',
  num_pages: 'number',
  page: 'number',
  page_size: 'number',
});
export type InstrumentOverview = typeof instrumentOverview.infer;

export type FetchInstrumentsOverviewOptions = {
  tickers?: Array<string>;
  page: number;
  pageSize: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
  token: string;
};
export const AvailableInstrumentsResponse = type({
  instruments: 'string[]',
});
