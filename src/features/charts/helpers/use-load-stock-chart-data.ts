import { useAuth } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { intervalToStartDate } from './time-ranges-helpers';
import { transformApiResponse } from './api-reasponse-helpers';
import { fetchHistoryForInstrument } from '@/remote/api';
import type { InstrumentPriceProps } from './charts-props';

type LoadResult = {
  parsed: InstrumentPriceProps[];
  minPrice: number;
  maxPrice: number;
};

export const useLoadStockChartData = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useCallback(
    async (ticker: string, interval: string): Promise<LoadResult> => {
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

      const parsed = transformApiResponse(apiData);
      return {
        parsed,
        minPrice: apiData.min_price,
        maxPrice: apiData.max_price,
      };
    },
    [getToken, queryClient]
  );
};
