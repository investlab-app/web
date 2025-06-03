import * as React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { intervalToStartDate, timeIntervals } from '../helpers/time-ranges-helpers';
import { transformApiResponse } from '../helpers/api-reasponse-helpers';
import { StockChartWrapper } from './stock-chart-wrapper';
import type { instrumentPriceProps } from '../helpers/charts-props';
import { fetchHistoryForInstrument } from '@/remote/api';

type StockChartContainerProps = {
  ticker: string;
};

export const StockChartContainer: React.FC<StockChartContainerProps> = ({ ticker }) => {
  const { getToken } = useAuth();

  const [interval, setInterval] = React.useState('1h');

  const [data, setData] = React.useState<Array<instrumentPriceProps>>([]);
  const [minPrice, setMinPrice] = React.useState<number>(0);
  const [maxPrice, setMaxPrice] = React.useState<number>(0);
  const [currentPrice, setCurrentPrice] = React.useState<number>(0);
  const [hasError, setHasError] = React.useState<boolean>(false);

  function updateValue(newVal : string) {
    loadData(newVal);
  }

  const loadData = async (chosenInterval: string) => {
    setHasError(false);
    try {
      const token = await getToken();
      if (!token) throw new Error('No auth token available');

      const startDate = intervalToStartDate(chosenInterval);
      const endDate = new Date();

      const apiData = await fetchHistoryForInstrument({
        ticker,
        startDate,
        endDate,
        interval: chosenInterval,
        token,
      });

      const parsed = transformApiResponse(apiData);
      if (parsed.length === 0) {
        setHasError(true);
        return;
      }

      setData(parsed);
      setCurrentPrice(parsed[parsed.length - 1].close);
      setMinPrice(apiData.min_price);
      setMaxPrice(apiData.max_price);

      setInterval(chosenInterval);
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
      setHasError(true);
    }
  };

  React.useEffect(() => {

    loadData(interval);
  }, [getToken, ticker, interval]);

  return (
    <StockChartWrapper
      stockName={ticker}
      currentPrice={currentPrice}
      timeRanges={timeIntervals}
      selectedInterval={interval}
      onIntervalChange={updateValue} 
      data={data}
      minPrice={minPrice}
      maxPrice={maxPrice}
      hasError={hasError}
    />
  );
};
