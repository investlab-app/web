import { type } from 'arktype';

export const instrumentHistory = type({
  timestamp: 'string',
  open: 'number',
  close: 'number',
  high: 'number',
  low: 'number',
}).array();
