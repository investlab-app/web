import { instrumentOverview } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

type FetchInstrumentsOverviewOptions = {
  tickers: Array<string>;
  page: number;
  pageSize: number;
  sector?: string;
  sortBy?: string;
  sortDirection?: string;
};

export async function fetchInstrumentsOverview({
  tickers,
  page,
  pageSize,
  sector,
  sortBy,
  sortDirection = 'asc',
}: FetchInstrumentsOverviewOptions) {
  const params = new URLSearchParams({
    tickers: tickers.map(String).join(','),
    page: page.toString(),
    page_size: pageSize.toString(),
    ...(sector && { sector }),
    ...(sortBy && { sort_by: sortBy }),
    sortDirection,
  });

  const response = await validatedFetch(
    `/api/instruments?${params.toString()}`,
    instrumentOverview
  );

  const instruments = response.items.map((item) => ({
    name: item.name,
    volume: item.volume,
    currentPrice: parseFloat(item.current_price),
    dayChange: parseFloat(item.day_change),
    symbol: item.ticker,
  }));

  return {
    ...response,
    items: instruments,
  };
}
