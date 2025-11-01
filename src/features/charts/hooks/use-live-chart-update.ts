import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type ReactECharts from 'echarts-for-react';

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
}

/**
 * Provides live updates to an ECharts line chart and renders a radiating
 * ring animation on the latest point:
 * - Rings are true circles (symbol: 'circle')
 * - Rings are stroke-only (transparent fill, colored border)
 * - Rings are anchored using xAxis/yAxis coordinates (no 'pin' effect)
 */
export function useLiveChartUpdate({
  chartRef,
  value,
  date,
}: UseLiveChartUpdateProps) {
  const animationFrameRef = useRef<number | null>(null);
  const cleanupTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === undefined || !date || !chartRef.current) return;

    const chartInstance = chartRef.current.getEchartsInstance();
    const currentOption = chartInstance.getOption();

    // Be conservative: ECharts types on getOption can be loose across versions
    if (!currentOption) return;

    const seriesData =
      ((currentOption.series as Array<EChartSeries>)?.[0]
        ?.data as EChartSeries['data']) ?? [];
    const xAxisData =
      ((currentOption.xAxis as Array<EChartXAxis>)?.[0]
        ?.data as EChartXAxis['data']) ?? [];

    // Update or initialize last point
    if (seriesData.length > 0 && xAxisData.length > 0) {
      seriesData[seriesData.length - 1] = value;
    } else {
      seriesData.push(value);
      xAxisData.push(date);
    }

    // Commit data update
    chartInstance.setOption({
      series: [{ data: seriesData }],
      xAxis: { data: xAxisData },
    });

    // Cancel any existing animations/timeouts
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    // Resolve axis coordinates for anchoring the rings
    const xValue = xAxisData[xAxisData.length - 1]; // date string on x-axis
    // In our current usage (line chart), value is a number (close price).
    // If an array is provided (OHLC), fallback to the second element or first if missing.
    const yValue =
      typeof value === 'number'
        ? value
        : Array.isArray(value)
          ? (value[1] ?? value[0])
          : (undefined as unknown as number);

    // Animation config
    const durationMs = 800;
    const startTs = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTs;
      const progress = Math.min(elapsed / durationMs, 1);

      // Center dot (solid)
      const centerDotSize = 6;

      // Two stroke-only rings that expand and fade
      // Sizes expand from base+delta; border opacity fades out over time
      const rings = [
        { maxGrow: 26, opacityFactor: 1.0, borderWidth: 2 },
        { maxGrow: 18, opacityFactor: 0.7, borderWidth: 2 },
      ];

      const ringDataItems = rings.map((ring) => {
        const size = centerDotSize + ring.maxGrow * progress;
        const opacity = Math.max(0, 1 - progress * ring.opacityFactor);

        return {
          // Use axis-based positioning to avoid "pin" effects and ensure true center anchoring
          xAxis: xValue,
          yAxis: yValue,
          // Stroke-only circle
          itemStyle: {
            color: 'rgba(0,0,0,0)', // transparent fill
            borderColor: `rgba(34, 197, 94, ${opacity})`, // green-500 stroke
            borderWidth: ring.borderWidth,
          },
          symbolSize: [size, size] as [number, number],
          // Ensure circle symbol, not pin
          symbol: 'circle' as const,
          // Force anchor at exact center
          symbolOffset: [0, 0] as [number, number],
        };
      });

      const markPointData = [
        // Solid center dot
        {
          xAxis: xValue,
          yAxis: yValue,
          itemStyle: {
            color: '#22c55e', // green-500
            borderWidth: 0,
          },
          symbol: 'circle' as const,
          symbolSize: [centerDotSize, centerDotSize] as [number, number],
          // Force anchor at exact center
          symbolOffset: [0, 0] as [number, number],
        },
        // Expanding stroke-only rings
        ...ringDataItems,
      ];

      chartInstance.setOption({
        series: [
          {
            markPoint: {
              symbol: 'circle',
              symbolKeepAspect: true,
              // Ensure all mark points are centered (no pin-like offset)
              symbolOffset: [0, 0],
              label: { show: false },
              data: markPointData,
              // Avoid hover styles shifting visuals
              emphasis: { disabled: true },
            },
          },
        ],
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Clean up effect a moment after finishing
        cleanupTimeoutRef.current = window.setTimeout(() => {
          chartInstance.setOption({
            series: [
              {
                markPoint: { data: [] },
              },
            ],
          });
        }, 100);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
    };
  }, [value, date, chartRef]);
}
