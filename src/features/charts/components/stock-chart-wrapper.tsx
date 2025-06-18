import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StockChartPresentation } from './stock-chart-presentation';
import { ChartErrorMessage } from './chart-error-message';
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

export type StockChartProps = {
  stockName: string;
  currentPrice: number;
  timeRanges: Array<{ label: string; value: string }>;
  selectedInterval: string;
  onIntervalChange: (value: string) => void;
  data: Array<InstrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
};

export const StockChartWrapper: React.FC<
  StockChartProps & { hasError?: boolean }
> = ({
  stockName,
  currentPrice,
  timeRanges,
  selectedInterval: selectedInterval,
  onIntervalChange: onIntervalChange,
  data,
  minPrice,
  maxPrice,
  hasError = false,
}) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{stockName}</CardTitle>
        {!hasError && typeof currentPrice === 'number' && (
          <CardDescription>
            {t('instruments.current_price')}: ${currentPrice.toFixed(2)}
          </CardDescription>
        )}
        <CardAction>
          <Select value={selectedInterval} onValueChange={onIntervalChange}>
            <SelectTrigger className="w-40" aria-label="Select time range">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(({ label, value }) => (
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
            stockName={stockName}
            chartData={data}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedInterval={selectedInterval}
            zoom={0.1}
          />
        )}
      </CardContent>
    </Card>
  );
};
