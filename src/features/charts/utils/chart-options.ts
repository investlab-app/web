import {
  createLabelIntervalFn,
  formatChartDateByRange,
} from './chart-formatting';
import type { InstrumentPriceProps } from '../types/types';
import type {
  DefaultLabelFormatterCallbackParams,
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from 'echarts';
import type { useTranslation } from 'react-i18next';
import { cssVar } from '@/features/shared/utils/styles';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

export function createChartOptions(
  stockName: string,
  chartData: Array<InstrumentPriceProps>,
  selectedInterval: string,
  zoom: number = 1,
  isCandlestick: boolean = false,
  { t, i18n }: Pick<ReturnType<typeof useTranslation>, 't' | 'i18n'>
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
        const formattedDate = formatChartDateByRange(
          axisValue,
          selectedInterval,
          true,
          i18n
        );

        if (isCandlestick) {
          const candlestickData = Array.isArray(data)
            ? data
            : [null, null, null, null];
          if (!candlestickData.every((d) => typeof d === 'number')) return '';
          const [open, close, low, high] = candlestickData;
          return `<div><strong>${formattedDate}</strong><br />
            Open: $${toFixedLocalized(open, i18n.language, 2)}<br />
            Close: $${toFixedLocalized(close, i18n.language, 2)}<br />
            High: $${toFixedLocalized(high, i18n.language, 2)}<br />
            Low: $${toFixedLocalized(low, i18n.language, 2)}</div>`;
        } else {
          const value =
            typeof data === 'object' && data !== null && 'value' in data
              ? data.value
              : data;
          if (!(typeof value === 'number')) return '';
          return `<div><strong>${formattedDate}</strong><br />
            ${t('instruments.price')}: $${toFixedLocalized(value, i18n.language, 2)}</div>`;
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
          formatChartDateByRange(value, selectedInterval, false, i18n),
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
                  { offset: 0, color: cssVar('--color-card-foreground-hex')! },
                  { offset: 1, color: cssVar('--color-card-hex')! },
                ],
              },
            },
            lineStyle: {
              color: cssVar('--color-card-foreground-hex')!,
              width: 1,
            },
          },
    ],
  };
}
