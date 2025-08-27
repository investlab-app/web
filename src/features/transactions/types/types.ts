import { type } from 'arktype';

export const historyEntry = type({
  date: 'Date',
  type: 'string',
  quantity: 'number',
  sharePrice: 'number',
  acquisitionPrice: 'number | null',
  marketValue: 'number',
  gainLoss: 'number',
  gainLossPct: 'number',
});
export type HistoryEntry = typeof historyEntry.infer;

export const position = type({
  name: 'string',
  quantity: 'number',
  marketValue: 'number',
  gainLoss: 'number',
  gainLossPct: 'number',
  history: historyEntry.array(),
});
export type Position = typeof position.infer;

export const transactionHistoryResponse = position.array();
export type TransactionsHistoryResponse =
  typeof transactionHistoryResponse.infer;
