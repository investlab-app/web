import { investorStats } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

export async function fetchInvestorStats() {
  return await validatedFetch('/api/investors/me/stats/', investorStats);
}
