import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type } from 'arktype';
import { CandlestickChartIcon, LineChartIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { intervalToStartDate, timeIntervals } from '../utils/time-ranges';
import { instrumentHistoryQueryOptions } from '../queries/fetch-instrument-history';
import { Message } from '../../shared/components/error-message';
import { StockChart } from './stock-chart';
import type { InstrumentPriceProps } from '../types/types';
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
import { useSSE } from '@/features/shared/hooks/use-sse';
import { livePriceDataDTO } from '@/features/instruments/types/types';
import { useFrozenValue } from '@/features/shared/hooks/use-frozen';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

type StockChartProps = {
  ticker: string;
};

export const StockChartContainer = ({ ticker }: StockChartProps) => {
  const { t, i18n } = useTranslation();

  const [interval, setInterval] = useState('1h');
  const [startDate, endDate] = useMemo(
    () => [intervalToStartDate(interval), new Date()],
    [interval]
  );

  const [isCandlestick, setIsCandlestick] = useState(false);
  const [livePrice, setLivePrice] = useState<
    [InstrumentPriceProps, boolean] | null
  >(null);

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

  console.log(`isFetching: ${isFetching}, isPending: ${isPending}`);

  const { cleanup } = useSSE({
    events: new Set([`PRICE_UPDATE_${ticker}`]),
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
        return;
      }
      if (out.id !== ticker) {
        // ignore
        return;
      }
      const newDataPoint = {
        date: new Date(parseInt(out.time)).toLocaleTimeString(),
        open: out.price,
        high: out.price,
        low: out.price,
        close: out.price,
      };
      setLivePrice([newDataPoint, true]);
    },
  });

  useEffect(() => cleanup, [cleanup]);

  const appliedInterval = useFrozenValue(interval, isFetching);
  const isIntervalChanging = appliedInterval !== interval;

  const currentPrice =
    livePrice?.[0]?.close ||
    priceHistory?.data[priceHistory.data.length - 1]?.close;

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
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger
                className={`w-40 ${isIntervalChanging ? 'animate-pulse' : ''}`}
                aria-label="Select time range"
              >
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {timeIntervals.map(({ labelKey, value }) => (
                  <SelectItem key={value} value={value}>
                    {t(labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="h-96">
        {isPending && <StockChart.Skeleton />}
        {isError && <Message message={t('common.error_loading_data')} />}
        {isSuccess &&
          (priceHistory.data.length ? (
            <StockChart
              stockName={ticker}
              chartData={priceHistory.data}
              selectedInterval={appliedInterval}
              liveUpdateValue={livePrice}
              zoom={0.1}
              isCandlestick={isCandlestick}
            />
          ) : (
            <Message
              message={t('instruments.history_empty', {
                ticker,
                interval: t(
                  timeIntervals.find(({ value }) => value === interval)
                    ?.labelKey || 'intervals.one_hour'
                ),
              })}
            />
          ))}
      </CardContent>
    </Card>
  );
};
