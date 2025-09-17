import { queryOptions } from '@tanstack/react-query';
import { profileOverview } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

export async function fetchProfileOverview() {
  return validatedFetch(
    `/api/investors/me/statistics/profile-overview/`,
    profileOverview
  );
}

export const profileOverviewQueryOptions = queryOptions({
  queryKey: ['profileOverviewStats'],
  queryFn: fetchProfileOverview,
  staleTime: 60 * 1000,
});
