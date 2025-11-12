import { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useCandlestickChartOptions } from '../hooks/use-candlestick-chart-options';
import { useLiveCandlestickChartUpdate } from '../hooks/use-live-candlestick-chart-update';
import type { StockChartProps } from './stock-chart';

export function StockChartCandlestick({
  ticker,
  priceHistory,
  selectedInterval,
  zoom,
  liveUpdatePoint,
}: Omit<StockChartProps, 'type'>) {
  const chartRef = useRef<ReactECharts | null>(null);
  const { i18n } = useTranslation();

  const chartOptions = useCandlestickChartOptions({
    ticker,
    priceHistory,
    selectedInterval,
    zoom: zoom ?? 1 / 3,
    i18n,
  });

  useLiveCandlestickChartUpdate({
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
