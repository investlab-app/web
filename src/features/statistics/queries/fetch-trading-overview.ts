import { queryOptions } from '@tanstack/react-query';
import { tradingOverview } from '../types/types';
import { httpRequest } from '@/features/shared/queries/http-request';

export async function fetchTradingOverview() {
  return httpRequest({
    endpoint: `/api/investors/me/statistics/trading-overview/`,
    validator: tradingOverview,
  });
}

export const tradingOverviewQueryOptions = queryOptions({
  queryKey: ['tradingOverview'],
  queryFn: fetchTradingOverview,
  staleTime: 1 * 1000,
});
