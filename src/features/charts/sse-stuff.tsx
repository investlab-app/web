import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ChartErrorMessage } from './components/chart-error-message';
import type { InstrumentPriceProps } from './helpers/charts-props';
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
import { useRef } from 'react';

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
  const chartComponentRef = useRef<StockChartRef>(null);

  const addPoint = () => {
    console.log('fdhljfsaddfsa');
    const newPoint: InstrumentPriceProps = {
      date: new Date().toISOString(),
      open: 105,
      close: 107,
      high: 110,
      low: 103,
    };

    chartComponentRef.current?.updateChart(newPoint);
  };
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <button onClick={addPoint}>Add New Point</button>
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
          <StockChartPresentation11
            ref={chartComponentRef}
            stockName={stockName}
            chartData={data}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedInterval={selectedInterval}
          />
        )}
      </CardContent>
    </Card>
  );
};

import ReactECharts from 'echarts-for-react';
import { createChartOptions } from './helpers/chart-options';

export type ChartPresentationsProps = {
  stockName: string;
  chartData: Array<InstrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
  selectedInterval: string;
};

export type StockChartRef = {
  updateChart: (val: InstrumentPriceProps) => void;
};

export const StockChartPresentation11 = React.forwardRef<
  StockChartRef,
  ChartPresentationsProps
>(({ stockName, chartData, minPrice, maxPrice, selectedInterval }, ref) => {
  const chartRef = React.useRef<any>(null);

  const chartOptions = React.useMemo(
    () =>
      createChartOptions(
        stockName,
        chartData,
        minPrice,
        maxPrice,
        selectedInterval
      ),
    [stockName, chartData, minPrice, maxPrice, selectedInterval]
  );

  React.useImperativeHandle(ref, () => ({
    updateChart: (val: InstrumentPriceProps) => {
      const chartInstance = chartRef.current?.getEchartsInstance();
      if (!chartInstance) return;

      const oldData = chartInstance.getOption()?.series?.[0]?.data ?? [];
      const oldXData = chartInstance.getOption()?.xAxis?.[0]?.data ?? [];

      chartInstance.setOption(
        {
          series: [
            {
              data: [
                ...oldData,
                {
                  value: val.close,
                  high: val.high,
                  low: val.low,
                  open: val.open,
                },
              ],
            },
          ],
          xAxis: {
            data: [...oldXData, val.date],
          },
        },
        {
          notMerge: false,
          lazyUpdate: true,
        }
      );
    },
  }));

  return (
    <ReactECharts
      ref={chartRef}
      option={chartOptions}
      style={{ height: '400px' }}
    />
  );
});
