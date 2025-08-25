import { queryOptions } from '@tanstack/react-query';
import { type } from 'arktype';
import { profileSummary } from '../types/types';
import type { ProfileSummary } from '../types/types';

export async function fetchProfileOverview() {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      const fakeData = _generateFakeProfileOverview();
      resolve(fakeData);
    }, 3000);
  });

  const result = profileSummary(response);
  if (result instanceof type.errors) {
    console.error('Invalid statistics overview response:', result.summary);
    throw new Error(`Invalid statistics overview response: ${result.summary}`);
  }

  return result;
}

export const profileOverviewQueryOptions = queryOptions({
  queryKey: ['profileOverviewStats'],
  queryFn: fetchProfileOverview,
  staleTime: 60 * 1000,
});

const _generateFakeProfileOverview = (): ProfileSummary => {
  const _totalAccountValue = parseFloat((Math.random() * 10000).toFixed(2));
  const _gain = parseFloat((Math.random() * 1000 - 500).toFixed(2));
  return {
    level: 'Newbie',
    exp_points: Math.floor(Math.random() * 1000),
    left_to_next_level: Math.floor(Math.random() * 100),
    total_account_value: _totalAccountValue,
    gain: _gain,
    gain_percent: _gain / (_totalAccountValue - _gain),
  };
};
