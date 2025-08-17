import { type } from 'arktype';
import { investorStats } from '../types/types';
import type { InvestorStats } from '../types/types';
import { fetchWithAuth } from '@/features/shared/queries/fetch-with-url';

export async function fetchInvestorStats(
  token: string
): Promise<InvestorStats> {
  const response = await fetchWithAuth('/api/investors/me/stats/', token);

  const result = investorStats(response);
  if (result instanceof type.errors) {
    console.error('Invalid investor stats response:', result.summary);
    throw new Error(`Invalid investor stats response: ${result.summary}`);
  }

  return result;
}
