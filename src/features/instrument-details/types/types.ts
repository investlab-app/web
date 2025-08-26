import { type } from 'arktype';

export interface BuySellActionProps {
  mode: 'price' | 'volume';
  value: number;
  derivedValue: number;
  onValueChange: (val: number) => void;
  onModeToggle: () => void;
}

export const instrumentPrice = type({
  name: 'string',
  currentPrice: 'number',
  dayChange: 'number',
});
export type InstrumentPrice = typeof instrumentPrice.infer;

export const instrumentInfo = type({
  ticker: 'string',
  ticker_type: 'string',
  delisted: 'boolean',

  description: 'string',
  icon_url: 'string',
  logo_url: 'string',
  homepage_url: 'string',

  currency_name: 'string',
  market: 'string',
  market_cap: 'number',
  phone_number: 'string',
  sector: 'string',
  total_employess: 'number',
});
export type InstrumentInfo = typeof instrumentInfo.infer;
