import { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { createChartOptions } from '../utils/chart-options';
import type { InstrumentPriceProps } from '../types/types';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

type SeriesData = {
  value: number;
  high: number;
  low: number;
  open: number;
};

type EChartSeries = {
  data: Array<SeriesData>;
};

type EChartXAxis = {
  data: Array<string>;
};

export type ChartPresentationsProps = {
  stockName: string;
  chartData: Array<InstrumentPriceProps>;
  selectedInterval: string;
  zoom?: number;
  isCandlestick: boolean;
  liveUpdateValue?: [InstrumentPriceProps, boolean] | null;
};

export const StockChart = ({
  stockName,
  chartData,
  selectedInterval,
  zoom,
  isCandlestick,
  liveUpdateValue = null,
}: ChartPresentationsProps) => {
  const chartRef = useRef<ReactECharts | null>(null);
  const { t, i18n } = useTranslation();

  const chartOptions = createChartOptions(
    stockName,
    chartData,
    selectedInterval,
    zoom,
    isCandlestick,
    { t, i18n }
  );

  useEffect(() => {
    if (!liveUpdateValue || !chartRef.current) return;

    const chartInstance = chartRef.current.getEchartsInstance();

    const [val, isUpdate] = liveUpdateValue;

    const oldSeriesData =
      (chartInstance.getOption().series as Array<EChartSeries>)[0]?.data ?? [];
    const oldXData =
      (chartInstance.getOption().xAxis as Array<EChartXAxis>)[0]?.data ?? [];

    const newSeriesData = [...oldSeriesData];
    const newXData = [...oldXData];

    if (isUpdate && newSeriesData.length > 0 && newXData.length > 0) {
      // Update last point
      newSeriesData[newSeriesData.length - 1] = {
        value: val.close,
        high: val.high,
        low: val.low,
        open: val.open,
      };
      // newXData[newXData.length - 1] = val.date;
    } else {
      // Append new point
      newSeriesData.push({
        value: val.close,
        high: val.high,
        low: val.low,
        open: val.open,
      });
      newXData.push(val.date);
    }

    chartInstance.setOption(
      {
        series: [{ data: newSeriesData }],
        xAxis: { data: newXData },
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
};

function StockChartSkeleton() {
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

StockChart.Skeleton = StockChartSkeleton;
