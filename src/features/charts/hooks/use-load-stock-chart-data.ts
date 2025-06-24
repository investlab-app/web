import { useAuth } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { type } from 'arktype';
import { intervalToStartDate } from '../utils/time-ranges';
import {
  dataPointToInstrumentPriceProps,
  instrumentHistory,
} from '../types/types';
import type { InstrumentPriceProps } from '../types/types';
import { formatDate } from '@/features/shared/utils';
import { fetchWithAuth } from '@/features/shared/queries/fetch-with-url';

type LoadResult = {
  parsed: Array<InstrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
};

type LoadResultError = {
  error: unknown;
};

type FetchHistoryForInstrumentOptions = {
  ticker: string;
  startDate: Date;
  endDate: Date;
  interval: string;
  token: string;
};

async function fetchHistoryForInstrument({
  ticker,
  startDate,
  endDate,
  interval,
  token,
}: FetchHistoryForInstrumentOptions) {
  const params = new URLSearchParams({
    ticker,
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    interval,
  });

  const history = await fetchWithAuth(
    `/api/prices?${params.toString()}`,
    token
  );

  const out = instrumentHistory(history);

  if (out instanceof type.errors) {
    console.error(out.summary);
    throw new Error(out.summary);
  }

  return out;
}

export const useLoadStockChartData = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useCallback(
    async (
      ticker: string,
      interval: string
    ): Promise<LoadResult | LoadResultError> => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No auth token available');

        const startDate = intervalToStartDate(interval);
        const endDate = new Date();

        const apiData = await queryClient.fetchQuery({
          queryKey: ['stock-data', ticker, interval],
          queryFn: () =>
            fetchHistoryForInstrument({
              ticker,
              startDate,
              endDate,
              interval,
              token,
            }),
          staleTime: 1000 * 60,
        });

        const parsed = apiData.data.map(dataPointToInstrumentPriceProps);
        return {
          parsed,
          minPrice: apiData.min_price,
          maxPrice: apiData.max_price,
        };
      } catch (error) {
        return { error };
      }
    },
    [getToken, queryClient]
  );
};
