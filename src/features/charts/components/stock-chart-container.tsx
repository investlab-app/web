import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { useLoadStockChartData } from '../helpers/use-load-stock-chart-data';
import { StockChartPresentation } from './stock-chart-presentation';
import { ChartErrorMessage } from './chart-error-message';
import { timeIntervals } from '../helpers/time-ranges-helpers';
import type { InstrumentPriceProps } from '../helpers/charts-props';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useSSETickers } from '@/hooks/use-sse';

type StockChartProps = {
  ticker: string;
};

export const StockChartContainer: React.FC<StockChartProps> = ({ ticker }) => {
  const { t } = useTranslation();
  const [interval, setInterval] = useState('1h');
  const [data, setData] = useState<InstrumentPriceProps[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  const { messages } = useSSETickers([ticker]);
  const liveUpdateValue = useRef<[InstrumentPriceProps, boolean] | null>(null);
  const loadStockData = useLoadStockChartData();

  const updateValue = async (newInterval: string) => {
    try {
      setHasError(false);
      const result = await loadStockData(ticker, newInterval);

      if (!result.parsed.length) {
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

  useEffect(() => {
    const tickerMessages = messages[ticker];
    if (tickerMessages && tickerMessages.length > 0) {
      const latestRaw = tickerMessages[tickerMessages.length - 1];
      try {
        const parsed = JSON.parse(latestRaw.replace(/'/g, '"'));
        const price: InstrumentPriceProps = {
          close: Number(parsed.price),
          high: Number(parsed.price),
          low: Number(parsed.price),
          open: Number(parsed.price),
          date: DateTime.now().toISO(),
        };
        liveUpdateValue.current = [price, true];
      } catch (e) {
        console.warn('Invalid price message:', latestRaw);
      }
    }
  }, [messages[ticker]]);

  useEffect(() => {
    updateValue(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker}</CardTitle>
        {!hasError && typeof currentPrice === 'number' && (
          <CardDescription>
            {t('instruments.current_price')}: ${currentPrice.toFixed(2)}
          </CardDescription>
        )}
        <CardAction>
          <Select value={interval} onValueChange={updateValue}>
            <SelectTrigger className="w-40" aria-label="Select time range">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {timeIntervals.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        {hasError ? (
          <ChartErrorMessage />
        ) : (
          <StockChartPresentation
            stockName={ticker}
            chartData={data}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedInterval={interval}
            liveUpdateValue={liveUpdateValue.current}
          />
        )}
      </CardContent>
    </Card>
  );
};
