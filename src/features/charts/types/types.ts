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
  data: type([dataPoint]),
});

export type InstrumentHistory = typeof instrumentHistory.infer;

export interface InstrumentPriceProps {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
};

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

export const instrumentOverview = type({
  instruments: [{
      ticker: 'string',
      name: 'string',
      sector: 'string',
      price: 'number',
      change: 'number',
      change_percent: 'number',
    }],
  total: 'number',
  numPages: 'number',
  page: 'number',
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