import type { Instrument } from '../helpers/instrument';

export type UseInstrumentsOptions = {
  filter?: string;
  page: number;
  perPage: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
};

export type UseInstrumentsReturn = {
  instruments: Instrument[];
  loading: boolean;
  hasMore: boolean;
  availableInstruments: string[];
  availableInstrumentsLoading: boolean;
  error: string | null;
  totalItems: number;
  numPages: number;
};

export type InstrumentsPageData = {
  instruments: Instrument[];
  total: number;
  numPages: number;
  page: number;
};
