import React, { useEffect, useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { createChartOptions } from '../helpers/chart-options';
import type { InstrumentPriceProps } from '../helpers/charts-props';

export type ChartPresentationsProps = {
  stockName: string;
  chartData: Array<InstrumentPriceProps>;
  minPrice: number;
  maxPrice: number;
  selectedInterval: string;
  liveUpdateValue?: [InstrumentPriceProps, boolean] | null;
};

export const StockChartPresentation: React.FC<ChartPresentationsProps> = ({
  stockName,
  chartData,
  minPrice,
  maxPrice,
  selectedInterval,
  liveUpdateValue = null,
}) => {
  const chartRef = useRef<any>(null);

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
    if (!chartInstance) return;

    const [val, isUpdate] = liveUpdateValue;

    const oldSeriesData = chartInstance.getOption()?.series?.[0]?.data ?? [];
    const oldXData = chartInstance.getOption()?.xAxis?.[0]?.data ?? [];

    let newSeriesData = [...oldSeriesData];
    let newXData = [...oldXData];

    if (isUpdate && newSeriesData.length > 0 && newXData.length > 0) {
      console.log('updating with value', val);
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
