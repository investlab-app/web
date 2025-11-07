import { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useLineChartOptions } from '../hooks/use-line-chart-options';
import { useLiveChartUpdate } from '../hooks/use-live-chart-update';
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

  useLiveChartUpdate({
    chartRef,
    value: liveUpdatePoint?.close,
    date: liveUpdatePoint?.date,
    chartType: 'line',
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
