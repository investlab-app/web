import { useCallback } from 'react';
import { z } from 'zod';
import { formatChartDateByRange } from '../utils/chart-formatting';
import { useChartOptions } from './use-chart-options';
import type {
  DefaultLabelFormatterCallbackParams,
  SeriesOption,
  TooltipComponentFormatterCallbackParams,
} from 'echarts';
import type { useTranslation } from 'react-i18next';
import type { InstrumentPricePoint } from '../types/instrument-price-point';
import type { TimeInterval } from '../utils/time-ranges';
import { useCssVar } from '@/features/shared/utils/styles';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

interface CreateLineChartOptionsProps {
  stockName: string;
  chartData: Array<InstrumentPricePoint>;
  selectedInterval: TimeInterval;
  zoom?: number;
  translation: Pick<ReturnType<typeof useTranslation>, 't' | 'i18n'>;
}

export function useLineChartOptions({
  stockName,
  chartData,
  selectedInterval,
  zoom = 1,
  translation: { t, i18n },
}: CreateLineChartOptionsProps) {
  const dates = chartData.map((item) => item.date);
  const seriesData = chartData.map((item) => item.close);

  const primaryColor = useCssVar('--color-primary-hex');
  const cardColor = useCssVar('--color-card-hex');

  const formatter = useCallback(
    (params: TooltipComponentFormatterCallbackParams) => {
      const paramArray = Array.isArray(params) ? params : [params];
      const { axisValue, data } =
        paramArray[0] as DefaultLabelFormatterCallbackParams & {
          axisValue: string;
        };

      const formattedDate = formatChartDateByRange({
        date: new Date(axisValue),
        range: selectedInterval,
        tooltip: true,
        i18n,
      });
      const valueSchema = z.number();
      const parseResult = valueSchema.safeParse(data);

      if (!parseResult.success) {
        console.error('Invalid line chart data format', parseResult.error);
        return '';
      }

      const value = parseResult.data;

      return `<div>
<strong>${formattedDate}</strong>
<br />
${t('instruments.price')}: $${toFixedLocalized(value, i18n.language, 2)}
</div>`;
    },
    [selectedInterval, i18n, t]
  );

  const series: Array<SeriesOption> = [
    {
      name: stockName,
      type: 'line',
      smooth: false,
      data: seriesData,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: cardColor },
          ],
        },
      },
      lineStyle: {
        color: primaryColor,
        width: 1,
      },
      markPoint: {
        symbol: 'circle',
        symbolKeepAspect: true,
        symbolOffset: [0, 0],
        label: { show: false },
        data:
          seriesData.length > 0 && dates.length > 0
            ? [
                {
                  name: 'Last Value',
                  xAxis: dates[dates.length - 1],
                  yAxis: seriesData[seriesData.length - 1],
                  itemStyle: {
                    color: primaryColor,
                    borderWidth: 0,
                  },
                  symbol: 'circle',
                  symbolSize: 6,
                },
              ]
            : [],
        emphasis: { disabled: true },
      },
    },
  ];

  return useChartOptions({
    axisPointerType: 'line',
    formatter,
    dates,
    boundaryGap: false,
    zoom,
    series,
    interval: selectedInterval,
    i18n,
  });
}
