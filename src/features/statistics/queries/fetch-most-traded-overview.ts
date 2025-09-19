import { queryOptions } from '@tanstack/react-query';
import { mostTradedOverview } from '../types/types';
import { httpRequest } from '@/features/shared/queries/http-request';

export async function fetchMostTradedOverview() {
  return httpRequest({
    endpoint: `/api/investors/me/statistics/most-traded/`,
    validator: mostTradedOverview,
  });
}

export const mostTradedOverviewQueryOptions = queryOptions({
  queryKey: ['mostTradedInstrumentsOverview'],
  queryFn: fetchMostTradedOverview,
});
