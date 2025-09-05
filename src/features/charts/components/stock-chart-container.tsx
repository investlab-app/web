import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type } from 'arktype';
import { CandlestickChartIcon, LineChartIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { intervalToStartDate, timeIntervals } from '../utils/time-ranges';
import { instrumentHistoryQueryOptions } from '../queries/fetch-instrument-history';
import { Message } from '../../shared/components/error-message';
import { createLineChartOptions } from '../utils/create-line-chart-options';
import { createCandlestickChartOptions } from '../utils/create-candlestick-chart-options';
import { StockChart, StockChartSkeleton } from './stock-chart';
import type { TimeInterval } from '../utils/time-ranges';
import type { InstrumentPricePoint } from '../types/instrument-price-point';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
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
import { useWS } from '@/features/shared/hooks/use-ws';
import { livePriceDataDTO } from '@/features/instruments/types/types';
import { useFrozenValue } from '@/features/shared/hooks/use-frozen';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

interface StockChartProps {
  ticker: string;
}

const CHART_INTERVALS: Array<TimeInterval> = [
  'MINUTE',
  'HOUR',
  'DAY',
  'WEEK',
  'MONTH',
  'YEAR',
];

export function StockChartContainer({ ticker }: StockChartProps) {
  const { t, i18n } = useTranslation();

  const [interval, setInterval] = useState<TimeInterval>('HOUR');
  const startDate = intervalToStartDate(interval);
  const endDate = new Date();

  const [isCandlestick, setIsCandlestick] = useState(false);
  const [livePrice, setLivePrice] = useState<InstrumentPricePoint>();

  const {
    data: priceHistory,
    isPending,
    isFetching,
    isSuccess,
    isError,
  } = useQuery(
    instrumentHistoryQueryOptions({
      ticker,
      startDate,
      endDate,
      interval,
    })
  );

  const { lastJsonMessage } = useWS([ticker]);

  useEffect(() => {
    if (lastJsonMessage) {
      const out = livePriceDataDTO(lastJsonMessage);
      if (out instanceof type.errors) return;

      const tickerData = out.prices.find((item) => item.symbol === ticker);
      if (!tickerData) return;

      setLivePrice({
        date: new Date(tickerData.end_timestamp).toLocaleTimeString(),
        open: tickerData.open,
        high: tickerData.high,
        low: tickerData.low,
        close: tickerData.close,
      });
    }
  }, [lastJsonMessage, ticker]);

  const appliedInterval = useFrozenValue(interval, isFetching);
  const isIntervalChanging = appliedInterval !== interval;

  const currentPrice =
    livePrice?.close || priceHistory?.[priceHistory.length - 1]?.close;

  // reason for this mad calculation: if we get e.g. only 5 data points and the
  // zoom is set to 0.1 we'll only see one point on load. This exact situation
  // happens with yearly interval for polygon since it's capped to past 5 years
  const zoom = Math.max(0.1, 0.9 - (priceHistory ?? []).length / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker}</CardTitle>
        {currentPrice && (
          <CardDescription>
            {t('instruments.current_price')}: $
            {toFixedLocalized(currentPrice, i18n.language, 2)}
          </CardDescription>
        )}
        <CardAction>
          <div className="flex items-center gap-1">
            <Tabs
              value={isCandlestick ? 'candle' : 'line'}
              onValueChange={(value) => setIsCandlestick(value === 'candle')}
              aria-label="Toggle chart type"
            >
              <TabsList>
                <TabsTrigger value="line" aria-label="Line chart">
                  <LineChartIcon strokeWidth={1.5} />
                </TabsTrigger>
                <TabsTrigger value="candle" aria-label="Candlestick chart">
                  <CandlestickChartIcon strokeWidth={1.5} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Select
              value={interval}
              onValueChange={(value) => setInterval(value as TimeInterval)}
            >
              <SelectTrigger
                className={`w-40 ${isIntervalChanging && 'animate-pulse'}`}
                aria-label="Select time range"
              >
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(timeIntervals)
                  .filter(([key]) =>
                    CHART_INTERVALS.includes(key as TimeInterval)
                  )
                  .map(([value, translationKey]) => (
                    <SelectItem key={value} value={value}>
                      {t(translationKey)}{' '}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="h-96">
        {isPending && <StockChartSkeleton />}
        {isError && <Message message={t('common.error_loading_data')} />}
        {isSuccess &&
          (priceHistory.length ? (
            <StockChart
              chartOptions={
                isCandlestick
                  ? createCandlestickChartOptions({
                      stockName: ticker,
                      chartData: priceHistory,
                      selectedInterval: appliedInterval,
                      zoom,
                      i18n,
                    })
                  : createLineChartOptions({
                      stockName: ticker,
                      chartData: priceHistory,
                      selectedInterval: appliedInterval,
                      zoom,
                      translation: { t, i18n },
                    })
              }
              liveUpdateValue={livePrice}
            />
          ) : (
            <Message
              message={t('instruments.history_empty', {
                ticker,
                interval: t(timeIntervals[interval]),
              })}
            />
          ))}
      </CardContent>
    </Card>
  );
}
