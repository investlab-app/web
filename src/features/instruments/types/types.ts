import { type } from 'arktype';

export const instrumentDTO = type({
  country: 'string',
  currency: 'string',
  current_price: 'string',
  day_change_percent: 'string',
  day_change: 'string',
  industry: 'string',
  market_cap: 'string',
  name: 'string',
  previous_close: 'string',
  sector: 'string',
  ticker: 'string',
  volume: 'number',
});
export type InstrumentDTO = typeof instrumentDTO.infer;

export const instrument = type({
  name: 'string',
  volume: 'number',
  currentPrice: 'number',
  dayChange: 'number',
  symbol: 'string',
});
export type Instrument = typeof instrument.infer;

export function fromDTO(dto: InstrumentDTO): Instrument | undefined {
  try {
    const parsed = {
      name: dto.name,
      volume: dto.volume,
      currentPrice: parseFloat(dto.current_price),
      dayChange: parseFloat(dto.day_change),
      symbol: dto.ticker,
    };
    return parsed;
  } catch {
    return undefined;
  }
}

export const livePriceDataDTO = type({
  change_percent: 'number?',
  change: 'number?',
  day_volume: 'string?',
  exchange: 'string',
  id: 'string',
  market_hours: 'number?',
  price_hint: 'string',
  price: 'number',
  quote_type: 'number',
  time: 'string',
});
export type LivePriceDataDTO = typeof livePriceDataDTO.infer;
