import { queryOptions } from '@tanstack/react-query';
import { type } from 'arktype';
import { instrumentPrice } from '../types/types';

const generateRandomPrice = (ticker: string) => {
  return {
    name: ticker,
    currentPrice: Math.floor(Math.random() * 1000) + 1,
    dayChange: Math.random() * 10,
  };
};

interface fetchInstrumentCurrentPriceOptions {
  ticker: string;
}

async function fetchInstrumentCurrentPrice({
  ticker,
}: fetchInstrumentCurrentPriceOptions) {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      const history = generateRandomPrice(ticker);
      resolve(history);
    }, 3000);
  });

  const result = instrumentPrice(response);
  if (result instanceof type.errors) {
    console.error('Invalid transactions history response:', result.summary);
    throw new Error(`Invalid transactions history response: ${result.summary}`);
  }

  return result;
}

interface InstrumentCurrentPriceQueryOptions {
  ticker: string;
}

export function instrumentCurrentPriceQueryOptions({
  ticker,
}: InstrumentCurrentPriceQueryOptions) {
  return queryOptions({
    queryKey: [`instrumentCurrentPrice`, ticker],
    queryFn: () => fetchInstrumentCurrentPrice({ ticker: ticker }),
  });
}
