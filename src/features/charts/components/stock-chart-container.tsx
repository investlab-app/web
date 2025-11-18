import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CandlestickChartIcon, LineChartIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { intervalToStartDate, timeIntervals } from '../utils/time-ranges';
import { ErrorMessage } from '../../shared/components/error-message';
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
import { withCurrency } from '@/features/shared/utils/numbers';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/features/shared/components/ui/toggle-group';
import { pricesBarsQueryKey } from '@/client/@tanstack/react-query.gen';
import { pricesBars } from '@/client';
import { roundDateToMinute, serialize } from '@/features/shared/utils/date';
import { EmptyMessage } from '@/features/shared/components/empty-message';

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

  const query = {
    ticker,
    interval,
    start_date: serialize(roundDateToMinute(startDate)),
    end_date: serialize(roundDateToMinute(endDate)),
  };

  const {
    data: priceHistory,
    isPending,
    isError,
  } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: pricesBarsQueryKey({
      query: {
        ticker,
        interval,
        start_date: '',
      },
    }),
    queryFn: async () => {
      const bars = await pricesBars({ query });

      if (!bars.data) {
        console.error(`Error fetching price bars: ${bars.error}`);
        throw new Error(`Error fetching price bars: ${bars.error}`);
      }

      return bars.data.map((item) => ({
        date: item.timestamp,
        open: parseFloat(item.open),
        close: parseFloat(item.close),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
      }));
    },
    staleTime: 60_000, // 1 minute
  });

  const { lastJsonMessage } = useWS([ticker]);

  useEffect(() => {
    if (lastJsonMessage) {
      const out = livePrice.safeParse(lastJsonMessage);
      if (!out.success) return;

      const tickerData = out.data.data.find((item) => item.symbol === ticker);
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

  const appliedInterval = useFrozenValue(interval, isPending);
  const appliedPriceHistory = useFrozenValue(priceHistory, isPending);
  const isIntervalChanging = appliedInterval !== interval;

  const latestClosingPrice = currentPrice?.close || priceHistory?.at(-1)?.close;

  // reason for this mad calculation: if we get e.g. only 5 data points and the
  // zoom is set to 0.1 we'll only see one point on load. This exact situation
  // happens with yearly interval for polygon since it's capped to past 5 years
  const zoom = useFrozenValue(
    Math.max(0.1, 0.9 - (priceHistory?.length ?? 0) / 100),
    isPending
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker}</CardTitle>
        {latestClosingPrice && (
          <CardDescription>
            {`${t('instruments.current_price')}: ${withCurrency(latestClosingPrice, i18n.language, 2)}`}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="line" aria-label="Line chart">
                    <LineChartIcon strokeWidth={1.5} />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t(
                      'common.tooltips.charts.line_chart',
                      'Display price data as a simple line chart'
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="candle"
                    aria-label="Candlestick chart"
                  >
                    <CandlestickChartIcon strokeWidth={1.5} />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t(
                      'common.tooltips.charts.candlestick_chart',
                      'Display detailed candlestick chart with open, high, low, close data'
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
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
        {isError ? (
          <ErrorMessage message={t('common.error_loading_data')} />
        ) : appliedPriceHistory === undefined ? (
          <StockChartSkeleton />
        ) : appliedPriceHistory.length ? (
          <StockChart
            type={isCandlestick ? 'candlestick' : 'line'}
            ticker={ticker}
            priceHistory={appliedPriceHistory}
            selectedInterval={appliedInterval}
            liveUpdatePoint={currentPrice}
            zoom={zoom}
          />
        ) : (
          <EmptyMessage
            message={t('instruments.history_empty', {
              ticker,
              interval: t(timeIntervals[interval]),
            })}
          />
        )}
      </CardContent>
    </Card>
  );
}
