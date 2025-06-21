import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, useStore } from '@tanstack/react-store';
import { type } from 'arktype';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { CandlestickChartIcon, LineChartIcon } from 'lucide-react';
import { useLoadStockChartData } from '../hooks/use-load-stock-chart-data';
import { timeIntervals } from '../utils/time-ranges';
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
import { livePriceDataDTO } from '@/features/instruments/types/types';
import { cn } from '@/features/shared/utils';

type StockChartProps = {
  ticker: string;
};

export const StockChartContainer = ({ ticker }: StockChartProps) => {
  const { t } = useTranslation();

  const store = useMemo(() => {
    return new Store({
      interval: '1h',
      data: new Array<InstrumentPriceProps>(),
      currentPrice: 0,
      hasError: false,
      liveUpdateValue: null as [InstrumentPriceProps, boolean] | null,
      isCandlestick: true,
    });
  }, []);

  const {
    interval,
    data,
    currentPrice,
    hasError,
    liveUpdateValue,
    isCandlestick,
  } = useStore(store);

  const loadStockData = useLoadStockChartData();

  const { cleanup } = useSSE({
    events: new Set([ticker]),
    callback: (eventData) => {
      let jsonData;
      try {
        jsonData = JSON.parse(eventData.replace(/'/g, '"'));
      } catch {
        // ignore
        return;
      }
      const out = livePriceDataDTO(jsonData);
      if (out instanceof type.errors) {
        console.error('Invalid data point received:', out.summary);
        store.setState((state) => ({
          ...state,
          hasError: true,
        }));
        return;
      }
      if (out.id !== ticker) {
        return;
      }
      store.setState((state) => {
        const newDataPoint = {
          date: new Date(parseInt(out.time)).toLocaleTimeString(),
          open: out.price,
          high: out.price,
          low: out.price,
          close: out.price,
        } as InstrumentPriceProps;
        return {
          ...state,
          currentPrice: out.price,
          liveUpdateValue: [newDataPoint, true],
          hasError: false,
        };
      });
    },
  });

  const chartTypeToggle = (value: string) => {
    console.log('love you', value);
    store.setState((state) => {
      return {
        ...state,
        isCandlestick: value === 'candle',
      };
    });
  };

  const changeInterval = useCallback(
    async (newInterval: string) => {
      const result = await loadStockData(ticker, newInterval);
      store.setState((state) => {
        return {
          ...state,
          interval: newInterval,
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
    changeInterval('1h');
    return () => {
      cleanup();
    };
  }, [changeInterval, cleanup]);

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
          <div className="flex items-center gap-1">
            <ToggleGroup
              type="single"
              onValueChange={chartTypeToggle}
              aria-label="Toggle chart type"
            >
              <ToggleGroupItem
                value="line"
                aria-label="Line chart"
                className={cn(
                  'p-2 rounded-md',
                  !isCandlestick ? 'bg-muted text-foreground' : ''
                )}
              >
                <LineChartIcon />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="candle"
                aria-label="Candlestick chart"
                className={cn(
                  'p-2 rounded-md',
                  isCandlestick ? 'bg-muted text-foreground' : ''
                )}
              >
                <CandlestickChartIcon />
              </ToggleGroupItem>
            </ToggleGroup>
            <Select value={interval} onValueChange={changeInterval}>
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
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        {hasError ? (
          <ChartErrorMessage />
        ) : (
          <StockChart
            stockName={ticker}
            chartData={data}
            selectedInterval={interval}
            liveUpdateValue={liveUpdateValue}
            zoom={0.1}
            isCandlestick={isCandlestick}
          />
        )}
      </CardContent>
    </Card>
  );
};
