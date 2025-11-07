import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type ReactECharts from 'echarts-for-react';
import { useCssVar } from '@/features/shared/utils/styles';

interface EChartSeries {
  data: Array<number | [number, number, number, number]>;
}

interface EChartXAxis {
  data: Array<string>;
}

interface UseLiveLineChartUpdateProps {
  chartRef: RefObject<ReactECharts | null>;
  value?: number | [number, number, number, number];
  date?: string;
}

/* A React hook that provides live updates to an ECharts instance 
   by adding or updating the latest data point with the provided 
   value and date. */
export function useLiveLineChartUpdate({
  chartRef,
  value,
  date,
}: UseLiveLineChartUpdateProps) {
  const animationFrameRef = useRef<number | null>(null);

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

    // Cancel any existing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Resolve axis coordinates for anchoring the circles
    const xValue = xAxisData[xAxisData.length - 1]; // date string on x-axis
    // In our current usage (line chart), value is a number (close price).
    // If an array is provided (OHLC), fallback to the second element or first if missing.
    const yValue =
      typeof value === 'number'
        ? value
        : Array.isArray(value)
          ? value[1] || value[0]
          : (undefined as unknown as number);

    // Animation config
    const expandDurationMs = 800;
    const startTs = Date.now();
    const centerDotSize = 6;

    // Set initial mark point with center dot visible
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
                xAxis: xValue,
                yAxis: yValue,
                itemStyle: {
                  color: primaryColor,
                  borderWidth: 0,
                },
                symbol: 'circle' as const,
                symbolSize: [centerDotSize, centerDotSize] as [number, number],
                symbolOffset: [0, 0] as [number, number],
              },
            ],
            emphasis: { disabled: true },
          },
        },
      ],
    });

    const animate = () => {
      const elapsed = Date.now() - startTs;
      const expandProgress = Math.min(elapsed / expandDurationMs, 1);

      // Three filled circles that expand and fade
      const discs = [
        { maxGrow: 30, opacityFactor: 1.2 },
        { maxGrow: 22, opacityFactor: 0.9 },
        { maxGrow: 14, opacityFactor: 0.6 },
      ];

      const discDataItems = discs.map((disc) => {
        const size = centerDotSize + disc.maxGrow * expandProgress;
        const opacity = Math.max(0, 1 - expandProgress * disc.opacityFactor);

        // Convert opacity (0-1) to hex alpha
        const hexAlpha = Math.round(opacity * 255)
          .toString(16)
          .padStart(2, '0');

        return {
          // Use axis-based positioning to avoid "pin" effects and ensure true center anchoring
          xAxis: xValue,
          yAxis: yValue,
          // Filled circle with fading opacity
          itemStyle: {
            color: `${primaryColor}${hexAlpha}`, // primary color with dynamic opacity
            borderWidth: 0,
          },
          symbolSize: [size, size] as [number, number],
          // Ensure circle symbol, not pin
          symbol: 'circle' as const,
          // Force anchor at exact center
          symbolOffset: [0, 0] as [number, number],
        };
      });

      const markPointData = [
        // Solid center dot (always visible)
        {
          xAxis: xValue,
          yAxis: yValue,
          itemStyle: {
            color: primaryColor,
            borderWidth: 0,
          },
          symbol: 'circle' as const,
          symbolSize: [centerDotSize, centerDotSize] as [number, number],
          // Force anchor at exact center
          symbolOffset: [0, 0] as [number, number],
        },
        // Expanding filled circles (only during expand phase)
        ...(expandProgress < 1 ? discDataItems : []),
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

      if (expandProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [value, date, chartRef, primaryColor]);
}
