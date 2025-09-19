import { queryOptions } from '@tanstack/react-query';
import { instrumentPrice } from '../types/instrument-price';
import { httpRequest } from '@/features/shared/queries/http-request';

interface fetchInstrumentPriceOptions {
  ticker: string;
}

async function fetchInstrumentPrice({ ticker }: fetchInstrumentPriceOptions) {
  return httpRequest({
    endpoint: `/api/prices/${ticker}/`,
    validator: instrumentPrice,
  });
}

interface InstrumentCurrentPriceQueryOptions {
  ticker: string;
}

export function instrumentPriceQueryOptions({
  ticker,
}: InstrumentCurrentPriceQueryOptions) {
  return queryOptions({
    queryKey: [`instrument-price`, ticker],
    queryFn: () => fetchInstrumentPrice({ ticker: ticker }),
  });
}
