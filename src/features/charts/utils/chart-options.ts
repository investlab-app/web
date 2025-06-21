import {
  createLabelIntervalFn,
  formatChartDateByRange as formatChartDateByInterval,
} from './chart-formatting';
import type { InstrumentPriceProps } from '../types/types';
import type { EChartsOption } from 'echarts';


export function createChartOptions(
  stockName: string,
  chartData: Array<InstrumentPriceProps>,
  selectedInterval: string,
  zoom: number = 1,
  isCandlestick?: boolean
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

  zoom = isCandlestick ? zoom / 5 : zoom;
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
      // eslint-disable-next-line
      formatter: (params: Array<any>) => {
        const paramArray = Array.isArray(params) ? params : [params];
        const { axisValue, data } = paramArray[0];
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
}
