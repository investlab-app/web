import { type } from 'arktype';
import { fetchWithAuth } from '@/features/shared/queries/fetch-with-url';

const investorStats = type({
  todays_return: 'number',
  total_return: 'number',
  invested: 'number',
  total_value: 'number',
});

export type InvestorStats = typeof investorStats.infer;

export async function fetchInvestorStats(
  token: string
): Promise<InvestorStats> {
  const response = await fetchWithAuth<InvestorStats>(
    '/api/investors/me/stats/',
    token
  );

  const result = investorStats(response);
  if (result instanceof type.errors) {
    console.error('Invalid investor stats response:', result.summary);
    throw new Error(`Invalid investor stats response: ${result.summary}`);
  }

  return result;
}
