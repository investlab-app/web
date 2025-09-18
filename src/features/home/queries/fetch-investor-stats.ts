import { investorStats } from '../types/types';
import { validatedFetch } from '@/features/shared/queries/validated-fetch';

export async function fetchInvestorStats() {
  return validatedFetch(`/api/investors/me/stats/`, investorStats);
}
