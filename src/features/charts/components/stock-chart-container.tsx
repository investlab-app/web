import { useAuth } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import {
  intervalToStartDate,
  timeIntervals,
} from '../helpers/time-ranges-helpers';
import { transformApiResponse } from '../helpers/api-reasponse-helpers';
import { StockChartWrapper } from './stock-chart-wrapper';
import type { InstrumentPriceProps } from '../helpers/charts-props';
import { fetchHistoryForInstrument } from '@/remote/api';

type StockChartContainerProps = {
  ticker: string;
};

export const StockChartContainer: React.FC<StockChartContainerProps> = ({
  ticker,
}) => {
  const { getToken } = useAuth();

  const [interval, setInterval] = useState('1h');

  const [data, setData] = useState<Array<InstrumentPriceProps>>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  function updateValue(newVal: string) {
    loadData(newVal);
  }

  const queryClient = useQueryClient();

  const loadData = useCallback(
    async (chosenInterval: string) => {
      setHasError(false);
      try {
        const token = await getToken();
        if (!token) throw new Error('No auth token available');

        const startDate = intervalToStartDate(chosenInterval);
        const endDate = new Date();

        const apiData = await queryClient.fetchQuery({
          queryKey: ['stock-data', ticker, chosenInterval],
          queryFn: () =>
            fetchHistoryForInstrument({
              ticker,
              startDate,
              endDate,
              interval: chosenInterval,
              token,
            }),
          staleTime: 1000 * 60,
        });

        const parsed = transformApiResponse(apiData);
        if (parsed.length === 0) {
          setHasError(true);
          return;
        }

        setData(parsed);
        setCurrentPrice(parsed[parsed.length - 1].close);

        setInterval(chosenInterval);
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
        setHasError(true);
      }
    },
    [getToken, queryClient, ticker]
  );

  useEffect(() => {
    loadData(interval);
  }, [interval, loadData]);

  return (
    <StockChartWrapper
      stockName={ticker}
      currentPrice={currentPrice}
      timeRanges={timeIntervals}
      selectedInterval={interval}
      onIntervalChange={updateValue}
      data={data}
      hasError={hasError}
    />
  );
};
