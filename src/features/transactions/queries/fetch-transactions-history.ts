import { queryOptions } from '@tanstack/react-query';
import { transactionHistoryResponse } from '../types/types';
import { httpRequest } from '@/features/shared/queries/http-request';

interface FetchTransactionsHistoryOptions {
  type: 'open' | 'closed' | 'both';
  page?: number;
  pageSize?: number;
  ticker?: string;
}

async function fetchTransactionsHistory({
  type: transactionType,
  page,
  pageSize,
  ticker,
}: FetchTransactionsHistoryOptions) {
  const params = {
    type: transactionType,
    page,
    page_size: pageSize,
    ticker,
  };

  return httpRequest({
    endpoint: '/api/investors/me/transactions-history/',
    searchParams: params,
    validator: transactionHistoryResponse,
  });
}

interface TransactionsHistoryQueryOptions {
  type: 'open' | 'closed' | 'both';
  page?: number;
  pageSize?: number;
  ticker?: string;
}

export function transactionsHistoryQueryOptions(
  params: Omit<TransactionsHistoryQueryOptions, 'ticker'>
) {
  return queryOptions({
    queryKey: ['transactions-history', params],
    queryFn: () => fetchTransactionsHistory(params),
  });
}

export function tickerTransactionsHistoryQueryOptions(
  params: TransactionsHistoryQueryOptions
) {
  return queryOptions({
    ...transactionsHistoryQueryOptions(params),
    select: (data) => data.at(0),
  });
}
