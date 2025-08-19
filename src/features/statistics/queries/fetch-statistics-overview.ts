import { queryOptions } from '@tanstack/react-query';
import { type } from 'arktype';
import { statisticsOverview } from '../types/types';
import type { StatisticsOverview } from '../types/types';

export async function fetchStatisticsOverview() {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      const fakeData = _generateFakeStatisticsOverview();
      resolve(fakeData);
    }, 3000);
  });

  const result = statisticsOverview(response);
  if (result instanceof type.errors) {
    console.error('Invalid statistics overview response:', result.summary);
    throw new Error(`Invalid statistics overview response: ${result.summary}`);
  }

  return result;
}

export const statisticsOverviewQueryOptions = queryOptions({
  queryKey: ['statisticsOverview'],
  queryFn: fetchStatisticsOverview,
  staleTime: 1 * 1000,
});

const _generateFakeStatisticsOverview = (): StatisticsOverview => {
  return {
    total_trades: Math.floor(Math.random() * 500),
    buys_sells: `${Math.floor(Math.random() * 250).toString()} / ${Math.floor(Math.random() * 250).toString()}`,
    avg_gain: parseFloat((Math.random() * 10).toFixed(2)),
    avg_loss: parseFloat((-Math.random() * 10).toFixed(2)),
    total_return: parseFloat((Math.random() * 10000).toFixed(2)),
  };
};
