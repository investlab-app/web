import { type } from 'arktype';
import {
  instrumentOverview,
  instrumentOverviewItemToInstrument,
} from '../types/types';
import type { FetchInstrumentsOverviewOptions } from '../types/types';
import { fetchWithAuth } from '@/queries/fetch-with-url';

export async function fetchInstrumentsOverview({
  tickers = [],
  page,
  pageSize,
  sector = '',
  sortBy = '',
  sortDirection = 'asc',
  token,
}: FetchInstrumentsOverviewOptions) {
  const params = new URLSearchParams({
    tickers: tickers.map(String).join(','),
    page: page.toString(),
    page_size: pageSize.toString(),
    ...(sector && { sector }),
    ...(sortBy && { sort_by: sortBy }),
    ...(sortDirection && { sort_direction: sortDirection }),
  });

  const response = await fetchWithAuth(
    `/api/instruments?${params.toString()}`,
    token
  );

  const out = instrumentOverview(response);
  if (out instanceof type.errors) {
    console.error(out.summary);
    throw new Error(out.summary);
  }

  const instruments = out.items.map(instrumentOverviewItemToInstrument);

  return {
    ...out,
    items: instruments,
  };
}
