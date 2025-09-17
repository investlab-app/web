import { queryOptions } from '@tanstack/react-query';
import { mostTradedOverview } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

export async function fetchMostTradedOverview() {
  return validatedFetch(
    `/api/investors/me/statistics/most-traded/`,
    mostTradedOverview
  );
}

export const mostTradedOverviewQueryOptions = queryOptions({
  queryKey: ['mostTradedInstrumentsOverview'],
  queryFn: fetchMostTradedOverview,
});
