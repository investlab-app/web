import { useEffect, useRef, useState } from 'react';
import { useChartDataUpdate } from './use-chart-data-update';
import { useChartPulseAnimation } from './use-chart-pulse-animation';
import type { RefObject } from 'react';
import type ReactECharts from 'echarts-for-react';
import type { ECharts } from 'echarts';

interface UseLiveChartUpdateProps {
  chartRef: RefObject<ReactECharts | null>;
  value?: number | [number, number, number, number];
  date?: string;
}

/* A React hook that provides live updates to an ECharts instance
   by adding or updating the latest data point with the provided
   value and date, with animated pulse effects. */
export function useLiveChartUpdate({
  chartRef,
  value,
  date,
}: UseLiveChartUpdateProps) {
  const { updateData } = useChartDataUpdate({ chartRef });
  const animationTriggerRef = useRef(0);

  // State to hold animation parameters
  const [animationParams, setAnimationParams] = useState<{
    chartInstance: ECharts | null;
    xValue: string;
    yValue: number;
    trigger: boolean;
  }>({
    chartInstance: null,
    xValue: '',
    yValue: 0,
    trigger: false,
  });

  // Call the animation hook with the current animation parameters
  useChartPulseAnimation({
    chartInstance: animationParams.chartInstance as ECharts,
    xValue: animationParams.xValue,
    yValue: animationParams.yValue,
    trigger: animationParams.trigger,
  });

  useEffect(() => {
    if (value === undefined || !date || !chartRef.current) return;

    const chartInstance = chartRef.current.getEchartsInstance();
    const result = updateData(value, date);

    if (result.shouldAnimate && result.xValue && result.yValue) {
      // Increment trigger to restart animation
      animationTriggerRef.current += 1;

      // Update animation state immediately
      setAnimationParams({
        chartInstance,
        xValue: result.xValue,
        yValue: result.yValue,
        trigger: animationTriggerRef.current > 0,
      });
    }
  }, [value, date, chartRef, updateData]);
}
