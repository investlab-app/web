import {
  createLabelIntervalFn,
  formatChartDateByRange as formatChartDateByInterval,
} from './chart-formatting';
import type { InstrumentPriceProps } from '../types/types';
import type {
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
  DefaultLabelFormatterCallbackParams,
} from 'echarts';

export function createChartOptions(
  stockName: string,
  chartData: Array<InstrumentPriceProps>,
  selectedInterval: string,
  zoom: number = 1,
  isCandlestick: boolean = false
): EChartsOption {
  const dates = chartData.map((item) => item.date);
  const seriesData = !isCandlestick
    ? chartData.map((item) => ({
        value: item.close,
        high: item.high,
        low: item.low,
        open: item.open,
      }))
    : chartData.map((item) => [item.open, item.close, item.low, item.high]);

  zoom = isCandlestick ? zoom / 3 : zoom;
  const startPercent = (1 - zoom) * 100;

  return {
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
            Open: $${open?.toFixed(2)}<br />
            Close: $${close?.toFixed(2)}<br />
            High: $${high?.toFixed(2)}<br />
            Low: $${low?.toFixed(2)}</div>`;
        } else {
          const value =
            typeof data === 'object' && data !== null && 'value' in data
              ? (data as any).value
              : data;
          return `<div><strong>${formattedDate}</strong><br />
            Price: $${value?.toFixed(2)}</div>`;
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
        end: 100,
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
            data: seriesData as number[][],
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
}
