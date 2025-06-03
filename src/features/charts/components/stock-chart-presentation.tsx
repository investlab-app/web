import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import {
  createLabelIntervalFn,
  formatChartDateByRange as formatChartDateByInterval,
} from '../helpers/stock-chart-formatting-helpers';
import type { ChartPresentationsProps } from '../helpers/charts-props';

export const StockChartPresentation: React.FC<ChartPresentationsProps> = ({
  stockName,
  chartData,
  minPrice,
  maxPrice,
  selectedInterval,
}) => {
  const dates = chartData.map((item) => item.date);
  const seriesData = chartData.map((item) => ({
    value: item.close,
    high: item.high,
    low: item.low,
    open: item.open,
  }));

  const startPercent = 90;
  const endPercent = 100;

  const chartOptions = {
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: { animation: false },
      backgroundColor: 'rgba(47, 5, 77, 0.9)',
      textStyle: { color: 'white' },
      // eslint-disable-next-line
      formatter: (params: Array<any>) => {
        const { axisValue, data } = params[0];
        return `<div><strong>
          ${formatChartDateByInterval(axisValue, selectedInterval, true)}
        </strong><br />
        Price: $${data.value?.toFixed(2)}<br />
        High: $${data.high?.toFixed(2)}<br />
        Low: $${data.low?.toFixed(2)}</div>`;
      },
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisTick: { show: false },
      axisLine: { show: true },
      axisLabel: {
        interval: createLabelIntervalFn(chartData.length),
        formatter: (value: string) =>
          formatChartDateByInterval(value, selectedInterval),
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: true },
      min: Math.floor(minPrice),
      max: Math.ceil(maxPrice),
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
      {
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
