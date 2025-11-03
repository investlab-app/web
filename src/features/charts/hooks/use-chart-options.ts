import { formatChartDateByRange } from '../utils/chart-formatting';
import type {
  EChartsOption,
  SeriesOption,
  TooltipComponentFormatterCallbackParams,
} from 'echarts';
import type { useTranslation } from 'react-i18next';
import type { TimeInterval } from '../utils/time-ranges';
import { useCssVar } from '@/features/shared/utils/styles';

interface CreateChartOptionsProps {
  axisPointerType: 'line' | 'shadow';
  formatter: (params: TooltipComponentFormatterCallbackParams) => string;
  dates: Array<string>;
  boundaryGap: boolean;
  zoom: number;
  series: Array<SeriesOption>;
  interval: TimeInterval;
  i18n: ReturnType<typeof useTranslation>['i18n'];
}

function createLabelIntervalFn(
  dataLength: number,
  zoom: number
): (index: number, value: string) => boolean {
  if (dataLength <= 10) {
    return () => true;
  }

  const interval = Math.floor((dataLength * zoom) / 3);

  return (index: number) => index % interval === 0;
}

export function useChartOptions({
  axisPointerType,
  formatter,
  dates,
  boundaryGap,
  zoom,
  series,
  interval,
  i18n,
}: CreateChartOptionsProps): EChartsOption {
  return {
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: axisPointerType,
      },
      backgroundColor: useCssVar('--color-card'),
      textStyle: {
        color: useCssVar('--foreground'),
      },
      formatter,
    },
    grid: { left: 20, right: 20, top: 20, bottom: 20 },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap,
      axisTick: { show: false },
      axisLine: { show: true },
      axisLabel: {
        interval: createLabelIntervalFn(dates.length, zoom),
        formatter: (value: string) =>
          formatChartDateByRange({
            date: new Date(value),
            range: interval,
            tooltip: false,
            i18n,
          }),
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
        start: (1 - zoom) * 100,
        end: 100,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
        zoomOnMouseWheel: false,
      },
    ],
    series,
  };
}
