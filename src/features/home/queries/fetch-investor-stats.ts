import { investorStats } from '../types/types';
import { currentAccountValue } from './fetch-current-account-value';
import { tradingOverview } from '@/features/statistics/types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

export async function fetchInvestorStats() {

  const [currentAccountValueResult, tradingOverviewResult, investorStatsResult] = await Promise.all([
    validatedFetch(`/api/investors/me/current-account-value/`, currentAccountValue),
    validatedFetch(`/api/investors/me/statistics/trading-overview/`, tradingOverview),
    validatedFetch(`/api/investors/me/stats/`, investorStats),
  ]);

  return {
    total_value: currentAccountValueResult.total_account_value,
    total_return: tradingOverviewResult.total_return,
    todays_return: investorStatsResult.todays_return,
    invested: investorStatsResult.invested

};
}
