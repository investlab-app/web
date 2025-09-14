import {
  instrumentOverview,
  instrumentOverviewItemToInstrument,
} from '../types/instrument-overview';
import type { SortDirection } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

type FetchInstrumentsOverviewOptions = {
  tickers?: Array<string>;
  page: number;
  pageSize: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
};

export async function fetchInstrumentsOverview({
  tickers = [],
  page,
  pageSize,
  sector = '',
  sortBy = '',
  sortDirection = 'asc',
}: FetchInstrumentsOverviewOptions) {
  const params = new URLSearchParams({
    tickers: tickers.map(String).join(','),
    page: page.toString(),
    page_size: pageSize.toString(),
    ...(sector && { sector }),
    ...(sortBy && { sort_by: sortBy }),
    sort_direction: sortDirection,
  });

  const response = await validatedFetch(
    `/api/instruments?${params.toString()}`,
    instrumentOverview
  );

  const instruments = response.items.map(instrumentOverviewItemToInstrument);

  return {
    ...response,
    items: instruments,
  };
}
