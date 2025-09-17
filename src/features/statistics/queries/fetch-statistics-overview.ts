import { queryOptions } from '@tanstack/react-query';
import { tradingOverview } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

export async function fetchTradingOverview() {
  return validatedFetch(
      `/api/investors/me/statistics/trading-overview/`,
      tradingOverview
    );
}

export const tradingOverviewQueryOptions = queryOptions({
  queryKey: ['tradingOverview'],
  queryFn: fetchTradingOverview,
  staleTime: 1 * 1000,
});
