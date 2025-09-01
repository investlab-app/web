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

interface CreateCandlestickChartOptionsProps {
  stockName: string;
  chartData: Array<InstrumentPricePoint>;
  selectedInterval: string;
  zoom?: number;
  i18n: ReturnType<typeof useTranslation>['i18n'];
}

export function createCandlestickChartOptions({
  stockName,
  chartData,
  selectedInterval,
  zoom = 1 / 3,
  i18n,
}: CreateCandlestickChartOptionsProps) {
  const dates = chartData.map((item) => item.date);
  const seriesData = chartData.map((item) => [
    item.open,
    item.close,
    item.low,
    item.high,
  ]);

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

    const candlestickDataType = type(['number', 'number', 'number', 'number']);

    const candlestickData = candlestickDataType(data);

    if (candlestickData instanceof type.errors) {
      return '';
    }

    const [open, close, low, high] = candlestickData;

    return `<div>
<strong>${formattedDate}</strong><br />
Open: $${toFixedLocalized(open, i18n.language, 2)}<br />
Close: $${toFixedLocalized(close, i18n.language, 2)}<br />
High: $${toFixedLocalized(high, i18n.language, 2)}<br />
Low: $${toFixedLocalized(low, i18n.language, 2)}
</div>`;
  };

  const series: Array<SeriesOption> = [
    {
      animation: true,
      animationDuration: 0,
      name: stockName,
      type: 'candlestick',
      data: seriesData,
      itemStyle: {
        color: cssVar('--green-hex'),
        color0: cssVar('--red-hex'),
        borderColor: cssVar('--green-lighter-hex'),
        borderColor0: cssVar('--red-lighter-hex'),
      },
    },
  ];

  return createChartOptions({
    axisPointerType: 'shadow',
    formatter,
    dates,
    boundaryGap: false,
    zoom,
    series,
    interval: selectedInterval,
    i18n,
  });
}
