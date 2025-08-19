import { type } from 'arktype';

export const statisticsOverview = type({
  total_trades: 'number',
  buys_sells: 'string',
  avg_gain: 'number',
  avg_loss: 'number',
    total_return: 'number',
});
export type StatisticsOverview = typeof statisticsOverview.infer;
