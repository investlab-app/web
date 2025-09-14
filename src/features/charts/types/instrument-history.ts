import { type } from 'arktype';

export const instrumentHistory = type({
  timestamp: 'string',
  open: 'number >= 0',
  close: 'number >= 0',
  high: 'number >= 0',
  low: 'number >= 0',
}).array();
