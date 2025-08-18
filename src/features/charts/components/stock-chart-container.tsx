import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type } from 'arktype';
import { CandlestickChartIcon, LineChartIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { intervalToStartDate, timeIntervals } from '../utils/time-ranges';
import { instrumentHistoryQueryOptions } from '../queries/fetch-instrument-history';
import { ErrorMessage } from '../../shared/components/error-message';
import { StockChart } from './stock-chart';
import type { InstrumentPriceProps } from '../types/types';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/features/shared/components/ui/toggle-group';
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
import { cn } from '@/features/shared/utils/styles';

type StockChartProps = {
  ticker: string;
};

export const StockChartContainer = ({ ticker }: StockChartProps) => {
  const { t } = useTranslation();

  const [interval, setInterval] = useState('1h');
  const startDate = intervalToStartDate(interval);

  const [isCandlestick, setIsCandlestick] = useState(true);
  const [livePrice, setLivePrice] = useState<
    [InstrumentPriceProps, boolean] | null
  >(null);

  const {
    data: instrumentHistory,
    isLoading,
    isError,
  } = useQuery(
    instrumentHistoryQueryOptions({
      ticker,
      startDate,
      endDate: new Date(),
      interval,
    })
  );

  console.log(
    'Instrument History:',
    instrumentHistory,
    `isLoading: ${isLoading}, isError: ${isError}`
  );

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

  const currentPrice =
    livePrice?.[0]?.close ||
    instrumentHistory?.data[instrumentHistory.data.length - 1]?.close;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker}</CardTitle>
        {currentPrice && (
          <CardDescription>
            {t('instruments.current_price')}: ${currentPrice.toFixed(2)}
          </CardDescription>
        )}
        <CardAction>
          <div className="flex items-center gap-1">
            <ToggleGroup
              type="single"
              onValueChange={(value) => setIsCandlestick(value === 'candle')}
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
                <LineChartIcon strokeWidth={1.5} />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="candle"
                aria-label="Candlestick chart"
                className={cn(
                  'p-2 rounded-md',
                  isCandlestick ? 'bg-muted text-foreground' : ''
                )}
              >
                <CandlestickChartIcon strokeWidth={1.5} />
              </ToggleGroupItem>
            </ToggleGroup>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger className="w-40" aria-label="Select time range">
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
      <CardContent>
        {!instrumentHistory?.data ? (
          <ErrorMessage
            message={t('instruments.history_empty', {
              ticker,
              interval: t(
                timeIntervals.find(({ value }) => value === interval)
                  ?.labelKey || 'intervals.one_hour'
              ),
            })}
          />
        ) : (
          <StockChart
            stockName={ticker}
            chartData={instrumentHistory.data}
            selectedInterval={interval}
            liveUpdateValue={livePrice}
            zoom={0.1}
            isCandlestick={isCandlestick}
          />
        )}
      </CardContent>
    </Card>
  );
};
