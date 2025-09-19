import { queryOptions } from '@tanstack/react-query';
import { investorStats } from '../types/types';
import { httpRequest } from '@/features/shared/queries/http-request';

export async function fetchInvestorStats() {
  return httpRequest({
    endpoint: `/api/investors/me/stats/`,
    validator: investorStats,
  });
}

export const investorStatsQueryOptions = queryOptions({
  queryKey: ['investorStats'],
  queryFn: fetchInvestorStats,
});
