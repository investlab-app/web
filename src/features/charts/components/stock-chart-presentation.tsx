import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import {
  createLabelIntervalFn,
  formatChartDateByRange as formatChartDateByInterval,
} from '../helpers/stock-chart-formatting-helpers';
import type { InstrumentPriceProps } from '../helpers/charts-props';

export type ChartPresentationsProps = {
  stockName: string;
  chartData: Array<InstrumentPriceProps>;
  selectedInterval: string;
  zoom?: number;
  isCandlestick?: boolean;
};

export const StockChartPresentation: React.FC<ChartPresentationsProps> = ({
  stockName,
  chartData,
  selectedInterval,
  zoom = 1,
  isCandlestick = false,
}) => {
  const dates = chartData.map((item) => item.date);
  const seriesData = !isCandlestick
    ? chartData.map((item) => ({
        value: item.close,
        high: item.high,
        low: item.low,
        open: item.open,
      }))
    : chartData.map((item) => [item.open, item.close, item.low, item.high]);

  zoom = isCandlestick ? zoom / 5 : zoom;
  const startPercent = (1 - zoom) * 100;
  const endPercent = 100;

  const chartOptions = {
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
        type: isCandlestick ? 'shadow' : 'line',
      },
      backgroundColor: isCandlestick
        ? 'var(--color-card)'
        : 'var(--blended-primary)',
      textStyle: {
        color: isCandlestick ? 'var(--foreground)' : 'var(--foreground)',
      },
      // eslint-disable-next-line
      formatter: (params: Array<any>) => {
        const { axisValue, data } = params[0];
        const formattedDate = formatChartDateByInterval(
          axisValue,
          selectedInterval,
          true
        );

        if (isCandlestick) {
          const [, open, close, low, high] = data
            ? data
            : [null, null, null, null, null];
          return `<div><strong>${formattedDate}</strong><br />
            Open: $${open?.toFixed(2)}<br />
            Close: $${close?.toFixed(2)}<br />
            High: $${high?.toFixed(2)}<br />
            Low: $${low?.toFixed(2)}</div>`;
        } else {
          return `<div><strong>${formattedDate}</strong><br />
            Price: $${data.value?.toFixed(2)}<br />
            High: $${data.high?.toFixed(2)}<br />
            Low: $${data.low?.toFixed(2)}</div>`;
        }
      },
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisTick: { show: false },
      axisLine: { show: true },
      axisLabel: {
        interval: createLabelIntervalFn(chartData.length, zoom),
        formatter: (value: string) =>
          formatChartDateByInterval(value, selectedInterval),
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: true },
      scale: true,
      splitLine: { lineStyle: { opacity: 0.2 } },
    },
    dataZoom: [
      {
        type: 'inside',
        zoomLock: true,
        start: startPercent,
        end: endPercent,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
        zoomOnMouseWheel: false,
      },
    ],
    series: [
      isCandlestick
        ? {
            name: stockName,
            type: 'candlestick',
            data: seriesData,
            itemStyle: {
              color: '#00b894',
              color0: '#d63031',
              borderColor: '#00b894',
              borderColor0: '#d63031',
            },
          }
        : {
            name: stockName,
            type: 'line',
            smooth: false,
            data: seriesData,
            showSymbol: false,
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

  return <ReactECharts option={chartOptions} style={{ height: '400px' }} />;
};
