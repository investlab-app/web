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

/**
 * Updates ECharts line charts with live data points and expanding circle animations.
 * Used for real-time stock price charts and other streaming data visualizations.
 */
export function useLiveLineChartUpdate({
  chartRef,
  value,
  date,
}: UseLiveLineChartUpdateProps) {
  const animationFrameRef = useRef<number | null>(null);
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

    // Calculate chart coordinates for new data point
    const xValue = xAxisData[xAxisData.length - 1]; // date on x-axis
    const yValue =
      typeof value === 'number'
        ? value
        : Array.isArray(value)
          ? value[1] || value[0] // OHLC fallback: close price, then open
          : (undefined as unknown as number);

    // Animation timing and sizing
    const expandDurationMs = 800;
    const startTs = Date.now();
    const centerDotSize = 6;

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

      // Three expanding circles with different sizes and fade rates
      const discs = [
        { maxGrow: 30, opacityFactor: 1.2 },
        { maxGrow: 22, opacityFactor: 0.9 },
        { maxGrow: 14, opacityFactor: 0.6 },
      ];

      const discDataItems = discs.map((disc) => {
        const size = centerDotSize + disc.maxGrow * expandProgress;
        const opacity = Math.max(0, 1 - expandProgress * disc.opacityFactor);

        // Convert opacity to hex for color string
        const hexAlpha = Math.round(opacity * 255)
          .toString(16)
          .padStart(2, '0');

        return {
          xAxis: xValue,
          yAxis: yValue,
          itemStyle: {
            color: `${primaryColor}${hexAlpha}`, // primary color with alpha
            borderWidth: 0,
          },
          symbolSize: [size, size] as [number, number],
          symbol: 'circle' as const,
          symbolOffset: [0, 0] as [number, number], // center anchor
        };
      });

      // Combine static center dot with expanding rings
      const markPointData = [
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
        // Show expanding rings only during animation
        ...(expandProgress < 1 ? discDataItems : []),
      ];

      chartInstance.setOption({
        series: [
          {
            markPoint: {
              symbol: 'circle',
              symbolKeepAspect: true,
              symbolOffset: [0, 0], // prevent pin-style offset
              label: { show: false },
              data: markPointData,
              emphasis: { disabled: true }, // prevent hover effects
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
