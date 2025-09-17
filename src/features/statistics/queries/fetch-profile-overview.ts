import { queryOptions } from '@tanstack/react-query';
import { profileOverview } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';
import { currentAccountValue } from '@/features/home/queries/fetch-current-account-value';

export async function fetchProfileOverview() {

  const [profileOverviewResult, currentAccountValueResult] = await Promise.all([
  validatedFetch(`/api/investors/me/statistics/profile-overview/`, profileOverview),
  validatedFetch(`/api/investors/me/current-account-value/`, currentAccountValue),
]);

    return {
  ...profileOverviewResult,
  ...currentAccountValueResult,
};

}

export const profileOverviewQueryOptions = queryOptions({
  queryKey: ['profileOverviewStats'],
  queryFn: fetchProfileOverview,
  staleTime: 60 * 1000,
});
