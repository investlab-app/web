import { type } from 'arktype';

export const instrumentHistory = type({
  min_price: 'number',
  max_price: 'number',
  data: type({
    timestamp: 'string',
    open: 'string',
    close: 'string',
    high: 'string',
    low: 'string',
  }).array(),
});
