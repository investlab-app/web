import { type } from 'arktype';
import { formatChartDateByRange } from './chart-formatting';
import { createChartOptions } from './create-chart-options';
import type {
  DefaultLabelFormatterCallbackParams,
  SeriesOption,
  TooltipComponentFormatterCallbackParams,
} from 'echarts';
import type { useTranslation } from 'react-i18next';
import type { InstrumentPricePoint } from '../types/instrument-price-point';
import { cssVar } from '@/features/shared/utils/styles';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

interface CreateLineChartOptionsProps {
  stockName: string;
  chartData: Array<InstrumentPricePoint>;
  selectedInterval: string;
  zoom?: number;
  translation: Pick<ReturnType<typeof useTranslation>, 't' | 'i18n'>;
}

export function createLineChartOptions({
  stockName,
  chartData,
  selectedInterval,
  zoom = 1,
  translation: { t, i18n },
}: CreateLineChartOptionsProps) {
  const dates = chartData.map((item) => item.date);
  const seriesData = chartData.map((item) => item.close);

  const formatter = (params: TooltipComponentFormatterCallbackParams) => {
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

    const value = type('number')(data);

    if (value instanceof type.errors) {
      return '';
    }

    return `<div>
<strong>${formattedDate}</strong>
<br />
${t('instruments.price')}: $${toFixedLocalized(value, i18n.language, 2)}
</div>`;
  };

  const series: Array<SeriesOption> = [
    {
      name: stockName,
      type: 'line',
      animation: true,
      animationDuration: 0,
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
            { offset: 0, color: cssVar('--color-card-foreground-hex')! },
            { offset: 1, color: cssVar('--color-card-hex')! },
          ],
        },
      },
      lineStyle: {
        color: cssVar('--color-card-foreground-hex'),
        width: 1,
      },
    },
  ];

  return createChartOptions({
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
