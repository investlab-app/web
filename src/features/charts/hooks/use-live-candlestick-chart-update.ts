/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type ReactECharts from 'echarts-for-react';

interface EChartSeries {
  data: Array<number | [number, number, number, number]>;
}

interface EChartXAxis {
  data: Array<string>;
}

interface UseLiveCandlestickChartUpdateProps {
  chartRef: RefObject<ReactECharts | null>;
  value?: number | [number, number, number, number];
  date?: string;
}

/* A React hook that provides basic data updates to an ECharts instance
   without any animation effects. */
export function useLiveCandlestickChartUpdate({
  chartRef,
  value,
  date,
}: UseLiveCandlestickChartUpdateProps) {
  useEffect(() => {
    if (value === undefined || !date || !chartRef.current) return;

    const chartInstance = chartRef.current.getEchartsInstance();
    const currentOption = chartInstance.getOption();

    if (!currentOption) return;

    const seriesData =
      (currentOption?.series as Array<EChartSeries>)[0]?.data ?? [];
    const xAxisData =
      (currentOption?.xAxis as Array<EChartXAxis>)[0]?.data ?? [];

    if (seriesData.length > 0 && xAxisData.length > 0) {
      // Update existing last point
      seriesData[seriesData.length - 1] = value;
    } else {
      // Add first point
      seriesData.push(value);
      xAxisData.push(date);
    }

    // eslint-disable-next-line react-you-might-not-need-an-effect/no-pass-data-to-parent
    chartInstance.setOption({
      series: [{ data: seriesData }],
      xAxis: { data: xAxisData },
    });
  }, [value, date, chartRef]);
}
