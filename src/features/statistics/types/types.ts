import { type } from 'arktype';

export const statisticsOverview = type({
  total_trades: 'number',
  buys_sells: 'string',
  avg_gain: 'number',
  avg_loss: 'number',
  total_return: 'number',
});
export type StatisticsOverview = typeof statisticsOverview.infer;

export const instrumentSummary = type({
  symbol: 'string',
  no_trades: 'number',
  buys_sells: 'string',
  avg_gain: 'number',
  avg_loss: 'number',
  total_return: 'number',
});
export type InstrumentSummary = typeof instrumentSummary.infer;

export const profileSummary = type({
  level: 'string',
  exp_points: 'number',
  left_to_next_level: 'number',
  total_account_value: 'number',
  gain: 'number',
  gain_percent: 'number',
});
export type ProfileSummary = typeof profileSummary.infer;
