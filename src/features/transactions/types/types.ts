import { type } from 'arktype';

export const historyEntry = type({
  date: 'string', // Backend returns ISO string, not Date object
  type: 'string',
  quantity: 'number',
  share_price: 'number', // Changed from sharePrice to match backend
  acquisition_price: 'number | null', // Changed from acquisitionPrice
  market_value: 'number', // Changed from marketValue
  gain_loss: 'number', // Changed from gainLoss
  gain_loss_pct: 'number', // Changed from gainLossPct
});
export type HistoryEntry = typeof historyEntry.infer;

export const position = type({
  name: 'string',
  quantity: 'number',
  market_value: 'number', // Changed from marketValue
  gain_loss: 'number', // Changed from gainLoss
  gain_loss_pct: 'number', // Changed from gainLossPct
  history: historyEntry.array(),
});
export type Position = typeof position.infer;

export const transactionHistoryResponse = position.array();
export type TransactionsHistoryResponse =
  typeof transactionHistoryResponse.infer;
