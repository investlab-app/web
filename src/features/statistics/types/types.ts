import { type } from 'arktype';

export const tradingOverview = type({
  total_trades: 'number',
  buys: 'number',
  sells: 'number',
  avg_gain: 'number',
  avg_loss: 'number',
  total_return: 'number',
});
export type TradingOverview = typeof tradingOverview.infer;

const instrumentSummary = type({
  symbol: 'string',
  no_trades: 'number',
  buys: 'number',
  sells: 'number',
  avg_gain: 'number',
  avg_loss: 'number',
  total_return: 'number',
});
export type InstrumentSummary = typeof instrumentSummary.infer;

export const mostTradedOverview = type({
  instruments: instrumentSummary.array(),
});

export type MostTradedOverview = typeof mostTradedOverview.infer;

export const profileOverview = type({
  level: 'string',
  exp_points: 'number',
  left_to_next_level: 'number',
});
export type ProfileOverview = typeof profileOverview.infer;
