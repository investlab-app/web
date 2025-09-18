import { queryOptions } from '@tanstack/react-query';
import { tickerPrice } from '../types/ticker-price';
import { httpRequest } from '@/features/shared/queries/http-request';

interface fetchTickerPriceOptions {
  ticker: string;
}

async function fetchTickerPrice({ ticker }: fetchTickerPriceOptions) {
  return httpRequest({
    endpoint: `/api/prices/${ticker}/`,
    validator: tickerPrice,
  });
}

interface InstrumentCurrentPriceQueryOptions {
  ticker: string;
}

export function tickerPriceQueryOptions({
  ticker,
}: InstrumentCurrentPriceQueryOptions) {
  return queryOptions({
    queryKey: [`ticker-price`, ticker],
    queryFn: () => fetchTickerPrice({ ticker: ticker }),
  });
}
