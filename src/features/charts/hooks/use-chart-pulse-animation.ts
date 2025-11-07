import { useEffect, useRef } from 'react';
import { ANIMATION_CONFIG, hexOpacityToHexAlpha } from './chart-animation-utils';
import type { ECharts } from 'echarts';
import { useCssVar } from '@/features/shared/utils/styles';

interface UseChartPulseAnimationProps {
  chartInstance: ECharts;
  xValue: string;
  yValue: number;
  trigger: boolean; // Used to restart animation
}

/* A React hook that creates an expanding pulse animation at a specific point on an ECharts instance */
export function useChartPulseAnimation({
  chartInstance,
  xValue,
  yValue,
  trigger,
}: UseChartPulseAnimationProps) {
  const animationFrameRef = useRef<number | null>(null);
  const primaryColor = useCssVar('--color-primary-hex');

  useEffect(() => {
    if (!trigger) return;

    const startTs = Date.now();

    // Cancel any existing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Set initial mark point with center dot visible
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
                symbolSize: [ANIMATION_CONFIG.centerDotSize, ANIMATION_CONFIG.centerDotSize] as [number, number],
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
      const expandProgress = Math.min(elapsed / ANIMATION_CONFIG.expandDurationMs, 1);

      const discDataItems = ANIMATION_CONFIG.discs.map((disc) => {
        const size = ANIMATION_CONFIG.centerDotSize + disc.maxGrow * expandProgress;
        const opacity = Math.max(0, 1 - expandProgress * disc.opacityFactor);
        const hexAlpha = hexOpacityToHexAlpha(opacity);

        return {
          xAxis: xValue,
          yAxis: yValue,
          itemStyle: {
            color: `${primaryColor}${hexAlpha}`,
            borderWidth: 0,
          },
          symbolSize: [size, size] as [number, number],
          symbol: 'circle' as const,
          symbolOffset: [0, 0] as [number, number],
        };
      });

      const markPointData = [
        {
          xAxis: xValue,
          yAxis: yValue,
          itemStyle: {
            color: primaryColor,
            borderWidth: 0,
          },
          symbol: 'circle' as const,
          symbolSize: [ANIMATION_CONFIG.centerDotSize, ANIMATION_CONFIG.centerDotSize] as [number, number],
          symbolOffset: [0, 0] as [number, number],
        },
        ...(expandProgress < 1 ? discDataItems : []),
      ];

      chartInstance.setOption({
        series: [
          {
            markPoint: {
              symbol: 'circle',
              symbolKeepAspect: true,
              symbolOffset: [0, 0],
              label: { show: false },
              data: markPointData,
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
  }, [trigger, chartInstance, xValue, yValue, primaryColor]);
}