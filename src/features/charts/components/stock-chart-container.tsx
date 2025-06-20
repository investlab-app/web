import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, useStore } from '@tanstack/react-store';
import { type } from 'arktype';
import { useLoadStockChartData } from '../hooks/use-load-stock-chart-data';
import { timeIntervals } from '../utils/time-ranges';
import { dataPoint, dataPointToInstrumentPriceProps } from '../types/types';
import { StockChart } from './stock-chart';
import { ChartErrorMessage } from './chart-error-message';
import type { InstrumentPriceProps } from '../types/types';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/components/ui/select';
import { useSSE } from '@/features/shared/hooks/use-sse';

type StockChartProps = {
  ticker: string;
};

export const StockChartContainer = ({ ticker }: StockChartProps) => {
  const { t } = useTranslation();

  const store = useMemo(() => {
    return new Store({
      interval: '1h',
      data: new Array<InstrumentPriceProps>(),
      minPrice: 0,
      maxPrice: 0,
      currentPrice: 0,
      hasError: false,
      liveUpdateValue: null as [InstrumentPriceProps, boolean] | null,
    });
  }, []);

  const {
    interval,
    data,
    minPrice,
    maxPrice,
    currentPrice,
    hasError,
    liveUpdateValue,
  } = useStore(store);

  const loadStockData = useLoadStockChartData();

  useSSE({
    events: new Set([ticker]),
    callback: (eventData) => {
      const out = dataPoint(eventData);
      if (out instanceof type.errors) {
        console.error('Invalid data point received:', out);
        store.setState((state) => ({
          ...state,
          hasError: true,
        }));
        return;
      }
      const instrumentPriceProps = dataPointToInstrumentPriceProps(out);
      store.setState((state) => {
        const newData = [...state.data, instrumentPriceProps];
        return {
          ...state,
          data: newData,
          liveUpdateValue: [instrumentPriceProps, true],
          currentPrice: instrumentPriceProps.close,
        };
      });
    },
  });

  const changeInterval = useCallback(
    async (newInterval: string) => {
      const result = await loadStockData(ticker, newInterval);
      store.setState((state) => {
        return {
          ...state,
          data: result.parsed,
          minPrice: result.minPrice,
          maxPrice: result.maxPrice,
          currentPrice: result.parsed[result.parsed.length - 1]?.close || 0,
        };
      });
    },
    [loadStockData, store, ticker]
  );

  useEffect(() => {
    changeInterval(interval);
  }, [changeInterval, interval]);

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
          <Select
            value={interval}
            onValueChange={(value) =>
              store.setState((state) => ({ ...state, interval: value }))
            }
          >
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
          <StockChart
            stockName={ticker}
            chartData={data}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedInterval={interval}
            liveUpdateValue={liveUpdateValue}
          />
        )}
      </CardContent>
    </Card>
  );
};
