import { type } from 'arktype';

export const instrumentDetail = type({
  address: {
    address1: 'string | null',
    address2: 'string | null',
    city: 'string | null',
    postal_code: 'string | null',
    state: 'string | null',
  },
  active: 'boolean | null',
  cik: 'string | null',
  composite_figi: 'string | null',
  currency_name: 'string | null',
  description: 'string | null',
  homepage_url: 'string | null',
  icon: 'string | null',
  id: 'string | null',
  list_date: 'string | null',
  locale: 'string | null',
  logo: 'string | null',
  market_cap: 'string | null',
  market: 'string | null',
  name: 'string | null',
  phone_number: 'string | null',
  primary_exchange: 'string | null',
  share_class_figi: 'string | null',
  share_class_shares_outstanding: 'number | null',
  sic_code: 'string | null',
  sic_description: 'string | null',
  ticker: 'string | null',
  ticker_root: 'string | null',
  ticker_suffix: 'string | null',
  total_employees: 'number | null',
  type: 'string | null',
  weighted_shares_outstanding: 'number | null',
});

export type InstrumentInfo = typeof instrumentDetail.infer;
