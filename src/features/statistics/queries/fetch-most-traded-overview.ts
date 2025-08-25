import { queryOptions } from '@tanstack/react-query';
import { type } from 'arktype';
import { instrumentSummary } from '../types/types';
import type { InstrumentSummary } from '../types/types';

export async function fetchMostTradedOverview() {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      const fakeData = _generateFakeStatisticsOverview();
      resolve(fakeData);
    }, 3000);
  });

  const result = instrumentSummary.array()(response);
  if (result instanceof type.errors) {
    console.error('Invalid statistics overview response:', result.summary);
    throw new Error(`Invalid statistics overview response: ${result.summary}`);
  }

  return result;
}

export const mostTradedOverviewQueryOptions = queryOptions({
  queryKey: ['mostTradedInstrumentsOverview'],
  queryFn: fetchMostTradedOverview,
});

const _generateFakeStatisticsOverview = (): Array<InstrumentSummary> => {
  return Array.from({ length: 5 }).map(() => ({
    symbol: `SYM${Math.floor(Math.random() * 1000)}`,
    no_trades: Math.floor(Math.random() * 100),
    buys_sells: `${Math.floor(Math.random() * 50).toString()} / ${Math.floor(Math.random() * 50).toString()}`,
    avg_gain: parseFloat((Math.random() * 10).toFixed(2)),
    avg_loss: parseFloat((Math.random() * 10).toFixed(2)),
    total_return: parseFloat((Math.random() * 100).toFixed(2)),
  }));
};
