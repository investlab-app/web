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
import { withCurrency } from '@/features/shared/utils/numbers';

interface UseCandlestickChartOptionsProps {
  ticker: string;
  priceHistory: Array<InstrumentPricePoint>;
  selectedInterval: TimeInterval;
  zoom?: number;
  i18n: ReturnType<typeof useTranslation>['i18n'];
}

export function useCandlestickChartOptions({
  ticker,
  priceHistory,
  selectedInterval,
  zoom = 1 / 3,
  i18n,
}: UseCandlestickChartOptionsProps) {
  const dates = priceHistory.map((item) => item.date);
  const seriesData = priceHistory.map((item) => [
    item.open,
    item.close,
    item.low,
    item.high,
  ]);

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

      const CandlestickDataSchema = z.tuple([
        z.number(), // id
        z.number(), // open
        z.number(), // close
        z.number(), // low
        z.number(), // high
      ]);

      const parseResult = CandlestickDataSchema.safeParse(data);

      if (!parseResult.success) {
        console.error('Invalid candlestick data format', parseResult.error);
        return '';
      }

      const candlestickData = parseResult.data;

      return `<div>
  <strong>${formattedDate}</strong><br />
  Open: $${withCurrency(candlestickData[1], i18n.language, 2)}<br />
  Close: $${withCurrency(candlestickData[2], i18n.language, 2)}<br />
  High: $${withCurrency(candlestickData[4], i18n.language, 2)}<br />
  Low: $${withCurrency(candlestickData[3], i18n.language, 2)}
  </div>`;
    },
    [i18n, selectedInterval]
  );

  const greenColor = useCssVar('--green-hex');
  const redColor = useCssVar('--red-hex');
  const borderColor = useCssVar('--border-color');
  const borderColor0 = useCssVar('--border-color');

  const series: Array<SeriesOption> = [
    {
      name: ticker,
      type: 'candlestick',
      data: seriesData,

      itemStyle: {
        color: greenColor,
        color0: redColor,
        borderColor: borderColor,
        borderColor0: borderColor0,
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
