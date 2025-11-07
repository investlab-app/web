import { useRef } from 'react';
import type { RefObject } from 'react';
import type ReactECharts from 'echarts-for-react';

interface EChartSeries {
  data: Array<number | [number, number, number, number]>;
}

interface EChartXAxis {
  data: Array<string>;
}

interface UseChartDataUpdateProps {
  chartRef: RefObject<ReactECharts | null>;
}

interface UpdateDataResult {
  shouldAnimate: boolean;
  xValue?: string;
  yValue?: number;
}

/* A React hook that provides data update functionality for ECharts instances */
export function useChartDataUpdate({ chartRef }: UseChartDataUpdateProps) {
  const lastUpdateRef = useRef<{ value: number | [number, number, number, number]; date: string } | null>(null);

  const updateData = (value: number | [number, number, number, number], date: string): UpdateDataResult => {
    if (!chartRef.current) {
      return { shouldAnimate: false };
    }

    const chartInstance = chartRef.current.getEchartsInstance();
    const currentOption = chartInstance.getOption();

    if (!currentOption) {
      return { shouldAnimate: false };
    }

    const seriesData = (currentOption?.series as Array<EChartSeries>)[0]?.data ?? [];
    const xAxisData = (currentOption?.xAxis as Array<EChartXAxis>)[0]?.data ?? [];

    if (seriesData.length > 0 && xAxisData.length > 0) {
      // Update existing last point
      seriesData[seriesData.length - 1] = value;
    } else {
      // Add first point
      seriesData.push(value);
      xAxisData.push(date);
    }

    chartInstance.setOption({
      series: [{ data: seriesData }],
      xAxis: { data: xAxisData },
    });

    // Check if this is a new update (different from last one)
    const isNewUpdate = !lastUpdateRef.current ||
      lastUpdateRef.current.value !== value ||
      lastUpdateRef.current.date !== date;

    if (isNewUpdate) {
      lastUpdateRef.current = { value, date };

      // Extract coordinates for animation
      const xValue = xAxisData[xAxisData.length - 1];
      const yValue = typeof value === 'number'
        ? value
        : Array.isArray(value)
          ? value[1] || value[0]
          : (undefined as unknown as number);

      return { shouldAnimate: true, xValue, yValue };
    }

    return { shouldAnimate: false };
  };

  return { updateData };
}