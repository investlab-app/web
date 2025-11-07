import { useEffect } from 'react';
import { useChartAnimation } from './use-chart-animation';
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
  chartType = 'line',
}: UseLiveChartUpdateProps) {
  // Get primary color once at the component level
  const primaryColor = useCssVar('--color-primary-hex');

  useEffect(() => {
    if (value === undefined || !date || !chartRef.current) return;

    const chartInstance = chartRef.current.getEchartsInstance();
    const currentOption = chartInstance.getOption();

    // Be conservative: ECharts types on getOption can be loose across versions
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

  // Animation hook for line charts
  const xValue = chartRef.current
    ? (() => {
        const chartInstance = chartRef.current.getEchartsInstance();
        const currentOption = chartInstance.getOption();

        const xAxisData =
          (currentOption.xAxis as Array<EChartXAxis>)[0]?.data ?? [];
        return xAxisData[xAxisData.length - 1];
      })()
    : undefined;

  const yValue =
    value !== undefined
      ? typeof value === 'number'
        ? value
        : Array.isArray(value)
          ? value[1] || value[0]
          : undefined
      : undefined;

  useChartAnimation({
    chartRef,
    xValue: xValue || '',
    yValue: yValue || 0,
    trigger: chartType === 'line' && value !== undefined && date !== undefined,
  });

  // Ensure center dot is always visible even when no live update is happening (only for line charts)
  useEffect(() => {
    if (!chartRef.current || chartType !== 'line') return;
    // If we have live update values, animation effect handles the dot
    if (value === undefined || !date) {
      // If we have live update values, animation effect handles the dot
    } else {
      const chartInstance = chartRef.current.getEchartsInstance();
      const currentOption = chartInstance.getOption();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!currentOption?.series || !currentOption.xAxis) {
        return;
      }

      const seriesData =
        (currentOption.series as Array<EChartSeries>)[0]?.data ?? [];
      const xAxisData =
        (currentOption.xAxis as Array<EChartXAxis>)[0]?.data ?? [];

      const lastIndex = Math.min(seriesData.length, xAxisData.length) - 1;
      if (lastIndex < 0) {
        return;
      }

      const lastY =
        typeof seriesData[lastIndex] === 'number'
          ? seriesData[lastIndex]
          : Array.isArray(seriesData[lastIndex])
            ? (seriesData[lastIndex] as Array<number>)[1] ||
              (seriesData[lastIndex] as Array<number>)[0]
            : undefined;

      const lastX = xAxisData[lastIndex];
      if (lastY === undefined || !lastX) {
        return;
      }

      // eslint-disable-next-line react-you-might-not-need-an-effect/no-pass-data-to-parent
      chartInstance.setOption({
        series: [
          {
            markPoint: {
              symbol: 'circle',
              symbolKeepAspect: true,
              symbolOffset: [0, 0],
              label: { show: false },
              data: [
                {
                  xAxis: lastX,
                  yAxis: lastY,
                  itemStyle: {
                    color: primaryColor,
                    borderWidth: 0,
                  },
                  symbol: 'circle',
                  symbolSize: [6, 6],
                  symbolOffset: [0, 0],
                },
              ],
              emphasis: { disabled: true },
            },
          },
        ],
      });
    }
  }, [chartRef, value, date, primaryColor, chartType]);
}
