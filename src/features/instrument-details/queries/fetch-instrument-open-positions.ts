import { queryOptions } from '@tanstack/react-query';
import { type } from 'arktype';
import { position } from '@/features/transactions/types/types';

const generateRandomTickerTransactionHistory = (ticker: string) => {
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
  return {
    name: ticker,
    quantity: Math.floor(Math.random() * 10) + 1,
    marketValue: Math.random() * 1000,
    gainLoss: Math.random() * 100 - 50,
    gainLossPct: Math.random() * 100 - 50,
    history: generateRandomHistory(),
  };
};

interface fetchInstrumentOpenPositionsOptions {
  ticker: string;
}

async function fetchInstrumentOpenPositions({
  ticker,
}: fetchInstrumentOpenPositionsOptions) {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      const history = generateRandomTickerTransactionHistory(ticker);
      resolve(history);
    }, 3000);
  });

  const result = position(response);
  if (result instanceof type.errors) {
    console.error('Invalid transactions history response:', result.summary);
    throw new Error(`Invalid transactions history response: ${result.summary}`);
  }

  return result;
}

interface InstrumentOpenPositionsQueryOptions {
  ticker: string;
}

export function instrumentOpenPositionsQueryOptions({
  ticker,
}: InstrumentOpenPositionsQueryOptions) {
  return queryOptions({
    queryKey: [`positions`, ticker],
    queryFn: () => fetchInstrumentOpenPositions({ ticker: ticker }),
  });
}
