import { queryOptions } from '@tanstack/react-query';
import { profileOverview } from '../types/types';
import { httpRequest } from '@/features/shared/queries/http-request';

export async function fetchProfileOverview() {
  return httpRequest({
    endpoint: `/api/investors/me/statistics/profile-overview/`,
    validator: profileOverview,
  });
}

export const profileOverviewQueryOptions = queryOptions({
  queryKey: ['profileOverviewStats'],
  queryFn: fetchProfileOverview,
  staleTime: 60 * 1000,
});
