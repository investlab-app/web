import { queryOptions } from '@tanstack/react-query';
import { type } from 'arktype';
import type { useAuth } from '@clerk/clerk-react';

const historyEntry = type({
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

const position = type({
  name: 'string',
  quantity: 'number',
  marketValue: 'number',
  gainLoss: 'number',
  gainLossPct: 'number',
  history: historyEntry.array(),
});
export type Position = typeof position.infer;

const transactionHistoryResponse = position.array();
export type TransactionsHistoryResponse =
  typeof transactionHistoryResponse.infer;

const generateRandomTickerTransactionHistory = () => {
  const names = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NFLX', 'FB'];
  const generateRandomHistory = () => {
    const transactionCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: transactionCount }, () =>
      (() => {
        const transactionType = Math.random() > 0.5 ? 'BUY' : 'SELL';
        return {
          date: new Date(
            Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
          ),
          type: transactionType,
          quantity: Math.floor(Math.random() * 10) + 1,
          sharePrice: Math.random() * 1000,
          acquisitionPrice:
            transactionType === 'BUY'
              ? Math.floor(Math.random() * 10) + 1
              : null,
          marketValue: Math.random() * 1000,
          gainLoss: Math.random() * 100 - 50,
          gainLossPct: Math.random() * 100 - 50,
        };
      })()
    );
  };
  const transactions = names.map((symbol) => ({
    name: symbol,
    quantity: Math.floor(Math.random() * 10) + 1,
    marketValue: Math.random() * 1000,
    gainLoss: Math.random() * 100 - 50,
    gainLossPct: Math.random() * 100 - 50,
    history: generateRandomHistory(),
  }));
  return transactions;
};

interface FetchTransactionsHistoryOptions {
  type: 'open' | 'closed';
}

async function fetchTransactionsHistory({
  type: transactionType,
}: FetchTransactionsHistoryOptions) {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      void transactionType;
      const history = generateRandomTickerTransactionHistory();
      resolve(history);
    }, 3000);
  });

  const result = transactionHistoryResponse(response);
  if (result instanceof type.errors) {
    console.error('Invalid transactions history response:', result.summary);
    throw new Error(`Invalid transactions history response: ${result.summary}`);
  }

  return result;
}

interface TransactionsHistoryQueryOptions {
  type: 'open' | 'closed';
  getToken: ReturnType<typeof useAuth>['getToken'];
}

export function transactionsHistoryQueryOptions({
  type: transactionsType,
  getToken,
}: TransactionsHistoryQueryOptions) {
  return queryOptions({
    queryKey: ['positions', transactionsType],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token available');
      return fetchTransactionsHistory({ type: transactionsType });
    },
  });
}
