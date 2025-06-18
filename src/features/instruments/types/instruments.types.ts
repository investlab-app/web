import { type } from 'arktype';

export const Instrument = type({
  name: 'string',
  volume: 'number',
  current_price: 'string',
  day_change: 'string',
  day_change_percent: 'string',
  ticker: 'string',
  previous_close: 'string',
  market_cap: 'string',
  sector: 'string?',
  industry: 'string?',
  country: 'string?',
  currency: 'string?',
});
export type InstrumentType = typeof Instrument.infer;

export type UseInstrumentsOptions = {
  filter?: string;
  page: number;
  perPage: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
};

export type UseInstrumentsReturn = {
  instruments: Array<InstrumentType>;
  loading: boolean;
  hasMore: boolean;
  availableInstruments: Array<string>;
  availableInstrumentsLoading: boolean;
  error: string | null;
  totalItems: number;
  numPages: number;
};

export type InstrumentsPageData = {
  instruments: Array<InstrumentType>;
  total: number;
  numPages: number;
  page: number;
};
