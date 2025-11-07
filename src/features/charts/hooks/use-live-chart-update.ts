import { useEffect } from 'react';
import { useExpandingCirclesChartAnimation } from './use-expanding-circles-chart-animation';
import type { RefObject } from 'react';
import type ReactECharts from 'echarts-for-react';
import { useCssVar } from '@/features/shared/utils/styles';

interface EChartSeries {
  data: Array<number | [number, number, number, number]>;
}

interface EChartXAxis {
  data: Array<string>;
}

interface UseLiveChartUpdateProps {
  chartRef: RefObject<ReactECharts | null>;
  value?: number | [number, number, number, number];
  date?: string;
  chartType?: 'line' | 'candlestick';
}

/* A React hook that provides live updates to an ECharts instance 
   by adding or updating the latest data point with the provided 
   value and date. */
export function useLiveChartUpdate({
  chartRef,
  value,
  date,
  chartType,
}: UseLiveChartUpdateProps) {
  const primaryColor = useCssVar('--color-primary-hex');

  useEffect(() => {
    if (value === undefined || !date || !chartRef.current) return;

    const chartInstance = chartRef.current.getEchartsInstance();
    const currentOption = chartInstance.getOption();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!currentOption) return;

    const seriesData =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (currentOption?.series as Array<EChartSeries>)[0]?.data ?? [];
    const xAxisData =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (currentOption?.xAxis as Array<EChartXAxis>)[0]?.data ?? [];

    if (seriesData.length > 0 && xAxisData.length > 0) {
      seriesData[seriesData.length - 1] = value;
    } else {
      seriesData.push(value);
      xAxisData.push(date);
    }

    /* eslint-disable-next-line
       react-you-might-not-need-an-effect/no-pass-data-to-parent 
       -- imperative chart update, not passing data to parent */
    chartInstance.setOption({
      series: [{ data: seriesData }],
      xAxis: { data: xAxisData },
    });
  }, [value, date, chartRef, primaryColor, chartType]);

  useExpandingCirclesChartAnimation({
    chartRef,
    xValue: date || '',
    yValue: typeof value === 'number' ? value : (value?.[1] ?? 0),
    trigger: chartType === 'line' && value !== undefined && date !== undefined,
  });
}
