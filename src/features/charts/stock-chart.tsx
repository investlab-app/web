import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type StockChartProps = {
  stockName: string;
  currentPrice: number;
  timeRanges: Array<{ label: string; value: string }>;
  selectedRange: string;
  onRangeChange: (value: string) => void;
  data: Array<{ date: string; price: number }>;
  minPrice: number;
  maxPrice: number;
};

export const StockChart: React.FC<StockChartProps> = ({
  stockName,
  currentPrice,
  timeRanges,
  selectedRange,
  onRangeChange,
  data,
  minPrice,
  maxPrice,
})  => {
  const dates = data.map((item) => item.date);
  const prices = data.map((item) => item.price);

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      backgroundColor: 'rgba(47, 5, 77, 0.9)',
      textStyle: { color: 'white' },
      formatter: (params: any[]) => {
        const { axisValue, data } = params[0];
        return `<div><strong>${axisValue}</strong><br />Price: $${data.toFixed(2)}</div>`;
      },
    },
    xAxis: {
      type: 'category',
      data: dates,
      splitNumber: 3,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisLabel: {
        interval: 'auto',
        formatter: (value: string) => {
          const date = new Date(value);
          
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        },
      },
    },
    yAxis: { type: 'value',
      axisLine: {
        show: true,
      },
  min: Math.floor(minPrice),
  max: Math.ceil(maxPrice),
     },
    series: [
      {
        name: stockName,
        type: 'line',
        smooth: true,
        data: prices,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(117, 33, 232, 0.5)' },
              { offset: 1, color: 'rgba(117, 33, 232, 0)' },
            ],
          },
        },
        lineStyle: { color: 'rgba(117, 33, 232, 1)' },
        itemStyle: { color: 'rgba(117, 33, 232, 1)' },
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{stockName}</CardTitle>
        <CardDescription>Current price: ${currentPrice.toFixed(2)}</CardDescription>
        <CardAction>
          <Select value={selectedRange} onValueChange={onRangeChange}>
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
        <ReactECharts option={chartOptions} style={{ height: '400px' }} />
      </CardContent>
    </Card>
  );
};
