import { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useLineChartOptions } from '../hooks/use-line-chart-options';
import { useCandlestickChartOptions } from '../hooks/use-candlestick-chart-options';
import { useLiveChartUpdate } from '../hooks/use-live-chart-update';
import type { InstrumentPricePoint } from '../types/instrument-price-point';
import type { TimeInterval } from '../utils/time-ranges';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

export interface StockChartProps {
  type: 'candlestick' | 'line';
  ticker: string;
  priceHistory: Array<InstrumentPricePoint>;
  selectedInterval: TimeInterval;
  zoom?: number;
  liveUpdatePoint?: InstrumentPricePoint;
}

export function StockChart(props: StockChartProps) {
  if (props.type === 'candlestick') {
    return <StockChartCandlestick {...props} />;
  }
  return <StockChartLine {...props} />;
}

function StockChartCandlestick({
  ticker,
  priceHistory,
  selectedInterval,
  zoom,
  liveUpdatePoint,
}: Omit<StockChartProps, 'type'>) {
  const chartRef = useRef<ReactECharts | null>(null);
  const { i18n } = useTranslation();

  const chartOptions = useCandlestickChartOptions({
    stockName: ticker,
    chartData: priceHistory,
    selectedInterval,
    zoom: zoom ?? 1 / 3,
    i18n,
  });

  useLiveChartUpdate({
    chartRef,
    value: liveUpdatePoint && [
      liveUpdatePoint.open,
      liveUpdatePoint.close,
      liveUpdatePoint.low,
      liveUpdatePoint.high,
    ],
    date: liveUpdatePoint?.date,
  });

  return (
    <ReactECharts
      ref={chartRef}
      option={chartOptions}
      style={{ width: '100%', height: '100%' }}
      lazyUpdate
    />
  );
}

function StockChartLine({
  ticker,
  priceHistory,
  selectedInterval,
  zoom,
  liveUpdatePoint,
}: Omit<StockChartProps, 'type'>) {
  const chartRef = useRef<ReactECharts | null>(null);
  const { t, i18n } = useTranslation();

  const chartOptions = useLineChartOptions({
    stockName: ticker,
    chartData: priceHistory,
    selectedInterval,
    zoom: zoom ?? 1,
    translation: { t, i18n },
  });

  useLiveChartUpdate({
    chartRef,
    value: liveUpdatePoint?.close,
    date: liveUpdatePoint?.date,
  });

  return (
    <ReactECharts
      ref={chartRef}
      option={chartOptions}
      style={{ width: '100%', height: '100%' }}
      lazyUpdate
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
