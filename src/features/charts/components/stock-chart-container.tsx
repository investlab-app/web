import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type } from 'arktype';
import { CandlestickChartIcon, LineChartIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { intervalToStartDate, timeIntervals } from '../utils/time-ranges';
import { instrumentHistoryQueryOptions } from '../queries/fetch-instrument-history';
import { Message } from '../../shared/components/error-message';
import { StockChart, StockChartSkeleton } from './stock-chart';
import type { TimeInterval } from '../utils/time-ranges';
import type { InstrumentPricePoint } from '../types/instrument-price-point';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/components/ui/select';
import { useWS } from '@/features/shared/hooks/use-ws';
import { livePrice } from '@/features/charts/types/live-price';
import { useFrozenValue } from '@/features/shared/hooks/use-frozen';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/features/shared/components/ui/toggle-group';

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
  const [currentPrice, setCurrentPrice] = useState<InstrumentPricePoint>();

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
      const out = livePrice(lastJsonMessage);
      if (out instanceof type.errors) return;

      const tickerData = out.prices.find((item) => item.symbol === ticker);
      if (!tickerData) return;

      setCurrentPrice({
        date: new Date(tickerData.end_timestamp).toISOString(),
        open: tickerData.open,
        high: tickerData.high,
        low: tickerData.low,
        close: tickerData.close,
      });
    }
  }, [lastJsonMessage, ticker]);

  const appliedInterval = useFrozenValue(interval, isFetching);
  const isIntervalChanging = appliedInterval !== interval;

  const latestClosingPrice = currentPrice?.close || priceHistory?.at(-1)?.close;

  // reason for this mad calculation: if we get e.g. only 5 data points and the
  // zoom is set to 0.1 we'll only see one point on load. This exact situation
  // happens with yearly interval for polygon since it's capped to past 5 years
  const zoom = Math.max(0.1, 0.9 - (priceHistory ?? []).length / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker}</CardTitle>
        {latestClosingPrice && (
          <CardDescription>
            {t('instruments.current_price')}: $
            {toFixedLocalized(latestClosingPrice, i18n.language, 2)}
          </CardDescription>
        )}
        <CardAction>
          <div className="flex items-center gap-1">
            <ToggleGroup
              type="single"
              value={isCandlestick ? 'candle' : 'line'}
              onValueChange={(value) => setIsCandlestick(value === 'candle')}
              variant="outline"
              aria-label="Toggle chart type"
            >
              <ToggleGroupItem value="line" aria-label="Line chart">
                <LineChartIcon strokeWidth={1.5} />
              </ToggleGroupItem>
              <ToggleGroupItem value="candle" aria-label="Candlestick chart">
                <CandlestickChartIcon strokeWidth={1.5} />
              </ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={interval}
              onValueChange={(value) => setInterval(value as TimeInterval)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger
                    className={`w-40 ${isIntervalChanging && 'animate-pulse'}`}
                    aria-label="Select interval"
                  >
                    <SelectValue placeholder={t('common.select_interval')} />
                  </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>{t('common.select_interval')}</TooltipContent>
              </Tooltip>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('common.interval')}</SelectLabel>
                  {Object.entries(timeIntervals)
                    .filter(([key]) =>
                      CHART_INTERVALS.includes(key as TimeInterval)
                    )
                    .map(([value, translationKey]) => (
                      <SelectItem key={value} value={value}>
                        {t(translationKey)}{' '}
                      </SelectItem>
                    ))}
                </SelectGroup>
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
              type={isCandlestick ? 'candlestick' : 'line'}
              ticker={ticker}
              priceHistory={priceHistory}
              selectedInterval={appliedInterval}
              zoom={zoom}
              liveUpdatePoint={currentPrice}
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
