import { type } from 'arktype';

export const instrument = type({
  name: 'string',
  volume: 'number | null',
  currentPrice: 'number | null',
  dayChange: 'number | null',
  symbol: 'string',
  logo: 'string | null',
  icon: 'string | null',
});
export type Instrument = typeof instrument.infer;
