import { useEffect, useState } from 'react';
import { useLoadStockChartData } from '../helpers/use-load-stock-chart-data';
import { StockChartWrapper } from './stock-chart-wrapper';
import { timeIntervals } from '../helpers/time-ranges-helpers';
import type { InstrumentPriceProps } from '../helpers/charts-props';

type StockChartContainerProps = {
  ticker: string;
};

export const StockChartContainer: React.FC<StockChartContainerProps> = ({
  ticker,
}) => {
  const [interval, setInterval] = useState('1h');
  const [data, setData] = useState<Array<InstrumentPriceProps>>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  const loadStockData = useLoadStockChartData();

  const updateValue = async (newInterval: string) => {
    try {
      setHasError(false);
      const result = await loadStockData(ticker, newInterval);

      if (result.parsed.length === 0) {
        setHasError(true);
        return;
      }

      setData(result.parsed);
      setCurrentPrice(result.parsed[result.parsed.length - 1].close);
      setMinPrice(result.minPrice);
      setMaxPrice(result.maxPrice);
      setInterval(newInterval);
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
      setHasError(true);
    }
  };

  // Load once on mount
  useEffect(() => {
    updateValue(interval);
  }, []);

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
