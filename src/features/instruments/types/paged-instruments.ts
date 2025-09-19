import { type } from 'arktype';

export const pagedInstrumentsItem = type({
  id: 'string',
  ticker: 'string',
  type: 'string | null',
  active: 'boolean',
  name: 'string',
  market: 'string',
  market_cap: 'string | null',
  currency_name: 'string',
  icon: 'string | null',
  logo: 'string | null',
});

export const pagedInstruments = type({
  count: 'number',
  next: 'string | null',
  previous: 'string | null',
  results: pagedInstrumentsItem.array(),
});
