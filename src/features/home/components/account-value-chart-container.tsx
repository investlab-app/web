import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { Message } from '../../shared/components/error-message';
import { fetchAccountValueOverTime } from '../queries/fetch-account-value-over-time';
import type { InstrumentPriceProps } from '../../charts/types/types';
import { StockChart } from '@/features/charts/components/stock-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

export const accountValueOverTimeQueryOptions = queryOptions({
  queryKey: ['accountValueOverTime'],
  queryFn: fetchAccountValueOverTime,
  staleTime: 60 * 1000,
});

export const AccountValueChartContainer = () => {
  const { t, i18n } = useTranslation();

  const { data, isLoading, error } = useQuery(accountValueOverTimeQueryOptions);

  const chartData: Array<InstrumentPriceProps> = useMemo(() => {
    if (!data) return [];
    // Map backend data to InstrumentPriceProps for StockChart
    return data.data.map((point) => ({
      date: point.date,
      open: point.value,
      close: point.value,
      high: point.value,
      low: point.value,
    }));
  }, [data]);

  const currentValue = chartData[chartData.length - 1]?.close ?? 0;
  const hasError = !!error || !data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {t('investor.account_value_over_time')}
        </CardTitle>

        {isLoading ? (
          <Skeleton className="h-10 w-48 mt-2" />
        ) : !hasError && typeof currentValue === 'number' ? (
          <div className="text-4xl font-bold tabular-nums">
            {toFixedLocalized(currentValue, i18n.language)}{' '}
            {t('common.currency')}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="h-96">
        {isLoading ? (
          <Skeleton className="w-full" />
        ) : hasError ? (
          <Message />
        ) : (
          <StockChart
            stockName="Account Value"
            chartData={chartData}
            selectedInterval="1wk"
            isCandlestick={false}
          />
        )}
      </CardContent>
    </Card>
  );
};
