import { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useLineChartOptions } from '../hooks/use-line-chart-options';
import { useLiveLineChartUpdate } from '../hooks/use-live-line-chart-update';
import type { StockChartProps } from './stock-chart';

export function StockChartLine({
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

  useLiveLineChartUpdate({
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
