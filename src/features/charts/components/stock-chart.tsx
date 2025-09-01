import { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { InstrumentPricePoint } from '../types/instrument-price-point';
import type { EChartsOption } from 'echarts';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

interface EChartSeries {
  data: Array<{
    value: number;
    high: number;
    low: number;
    open: number;
  }>;
}

interface EChartXAxis {
  data: Array<string>;
}

export interface StockChartProps {
  chartOptions: EChartsOption;
  liveUpdateValue?: InstrumentPricePoint;
}

export function StockChart({ chartOptions, liveUpdateValue }: StockChartProps) {
  const chartRef = useRef<ReactECharts | null>(null);

  useEffect(() => {
    if (!liveUpdateValue || !chartRef.current) return;

    const chartInstance = chartRef.current.getEchartsInstance();

    const seriesData =
      (chartInstance.getOption().series as Array<EChartSeries>)[0]?.data ?? [];
    const xAxisData =
      (chartInstance.getOption().xAxis as Array<EChartXAxis>)[0]?.data ?? [];

    const liveUpdatePoint = {
      value: liveUpdateValue.close,
      high: liveUpdateValue.high,
      low: liveUpdateValue.low,
      open: liveUpdateValue.open,
    };

    if (seriesData.length > 0 && xAxisData.length > 0) {
      seriesData[seriesData.length - 1] = liveUpdatePoint;
    } else {
      seriesData.push(liveUpdatePoint);
      xAxisData.push(liveUpdateValue.date);
    }

    chartInstance.setOption(
      {
        series: [{ data: seriesData }],
        xAxis: { data: xAxisData },
      },
      {
        notMerge: false,
        lazyUpdate: true,
      }
    );
  }, [liveUpdateValue]);

  return (
    <ReactECharts
      ref={chartRef}
      option={chartOptions}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
}

export function StockChartSkeleton() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 relative">
        <div className="ml-8 mb-3 mt-1 h-full flex flex-col">
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex flex-col justify-between">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-px w-full" />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,90 L3,85 L6,83 L9,80 L12,75 L15,79 L18,67 L21,60 L24,58 L27,51 L30,48 L33,40 L36,39 L39,43 L42,48 L45,45 L48,40 L51,37 L54,38 L57,30 L60,25 L63,23 L66,18 L69,13 L72,18 L75,15 L78,18 L81,34 L84,45 L87,52 L90,55 L93,58 L96,68 L100,75 L100,100 L0,100 Z"
                  className="animate-pulse fill-foreground/50"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
