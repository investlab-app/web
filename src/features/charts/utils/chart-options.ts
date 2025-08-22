import {
  createLabelIntervalFn,
  formatChartDateByRange as formatChartDateByInterval,
} from './chart-formatting';
import type { InstrumentPriceProps } from '../types/types';
import type {
  DefaultLabelFormatterCallbackParams,
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from 'echarts';
import { cssVar } from '@/features/shared/utils/styles';

export function createChartOptions(
  stockName: string,
  chartData: Array<InstrumentPriceProps>,
  selectedInterval: string,
  zoom: number = 1,
  isCandlestick: boolean = false
): EChartsOption {
  const dates = chartData.map((item) => item.date);
  const seriesData = isCandlestick
    ? chartData.map((item) => [item.open, item.close, item.low, item.high])
    : chartData.map((item) => ({
        value: item.close,
        high: item.high,
        low: item.low,
        open: item.open,
      }));

  zoom = isCandlestick ? zoom / 3 : zoom;

  const startPercent = (1 - zoom) * 100;

  const trendColor =
    chartData[chartData.length - 1].close - chartData[0].close > 0
      ? cssVar('--color-green-hex') // gain
      : cssVar('--color-red-hex'); // loss

  return {
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: isCandlestick ? 'shadow' : 'line',
      },
      backgroundColor: cssVar('--color-card'),
      textStyle: {
        color: isCandlestick ? cssVar('--foreground') : cssVar('--foreground'),
      },
      formatter: (params: TooltipComponentFormatterCallbackParams) => {
        const paramArray = Array.isArray(params) ? params : [params];
        const { axisValue, data } =
          paramArray[0] as DefaultLabelFormatterCallbackParams & {
            axisValue: string;
          };
        const formattedDate = formatChartDateByInterval(
          axisValue,
          selectedInterval,
          true
        );

        if (isCandlestick) {
          const candlestickData = Array.isArray(data)
            ? data
            : [null, null, null, null];
          if (!candlestickData.every((d) => typeof d === 'number')) return '';
          const [open, close, low, high] = candlestickData;
          return `<div><strong>${formattedDate}</strong><br />
            Open: $${open.toFixed(2)}<br />
            Close: $${close.toFixed(2)}<br />
            High: $${high.toFixed(2)}<br />
            Low: $${low.toFixed(2)}</div>`;
        } else {
          const value =
            typeof data === 'object' && data !== null && 'value' in data
              ? data.value
              : data;
          if (!(typeof value === 'number')) return '';
          return `<div><strong>${formattedDate}</strong><br />
            Price: $${value.toFixed(2)}</div>`;
        }
      },
    },
    grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: isCandlestick ? true : false,
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
        end: 100,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
        zoomOnMouseWheel: false,
      },
    ],
    series: [
      isCandlestick
        ? {
            animation: true,
            animationDuration: 0,
            name: stockName,
            type: 'candlestick',
            data: seriesData as Array<Array<number>>,
            itemStyle: {
              color: cssVar('--green-hex'),
              color0: cssVar('--red-hex'),
              borderColor: cssVar('--green-lighter-hex'),
              borderColor0: cssVar('--red-lighter-hex'),
            },
          }
        : {
            name: stockName,
            type: 'line',
            animation: true,
            animationDuration: 0,
            smooth: false,
            data: seriesData as Array<{
              value: number;
              high: number;
              low: number;
              open: number;
            }>,
            showSymbol: false,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: trendColor! },
                  { offset: 1, color: cssVar('--color-card-hex')! },
                ],
              },
            },
            lineStyle: {
              color: trendColor,
              width: 1,
            },
          },
    ],
  };
}
