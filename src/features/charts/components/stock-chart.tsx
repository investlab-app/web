import { useEffect, useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { createChartOptions } from '../utils/chart-options';
import type { InstrumentPriceProps } from '../types/types';

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
  data: Array<string>
};

export type ChartPresentationsProps = {
  stockName: string;
  chartData: Array<InstrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
  selectedInterval: string;
  liveUpdateValue?: [InstrumentPriceProps, boolean] | null;
};

export const StockChart = ({
  stockName,
  chartData,
  minPrice,
  maxPrice,
  selectedInterval,
  liveUpdateValue = null,
}: ChartPresentationsProps) => {
  const chartRef = useRef<ReactECharts | null>(null);

  const chartOptions = useMemo(
    () =>
      createChartOptions(
        stockName,
        chartData,
        minPrice,
        maxPrice,
        selectedInterval
      ),
    [stockName, chartData, minPrice, maxPrice, selectedInterval]
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
      style={{ height: '400px' }}
    />
  );
};
