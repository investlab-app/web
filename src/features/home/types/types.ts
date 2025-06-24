import { type } from 'arktype';

export const asset = type({
  name: 'string',
  volume: 'number',
  value: 'number',
  gain: 'number',
  gain_percent: 'number',
  symbol: 'string',
});
export type Asset = typeof asset.infer;

export const investorStats = type({
  todays_return: 'number',
  total_return: 'number',
  invested: 'number',
  total_value: 'number',
});
export type InvestorStats = typeof investorStats.infer;

export type OwnedShareItem = {
  name: string;
  symbol: string;
  volume: number;
  value: number;
  profit: number;
  profit_percentage: number;
};

export type OwnedShares = {
  owned_shares: Array<OwnedShareItem>;
};
