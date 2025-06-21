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
