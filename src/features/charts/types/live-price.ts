import { type } from 'arktype';

export const livePrice = type({
  prices: type({
    symbol: 'string',
    volume: 'number',
    accumulated_volume: 'number',
    official_open_price: 'number',
    vwap: 'number',
    open: 'number',
    close: 'number',
    high: 'number',
    low: 'number',
    aggregate_vwap: 'number',
    average_size: 'number',
    start_timestamp: 'number',
    end_timestamp: 'number',
  }).array(),
});

export type LivePrice = typeof livePrice.infer;
