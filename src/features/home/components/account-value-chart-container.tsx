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

  const { data, isLoading, isError } = useQuery(
    accountValueOverTimeQueryOptions
  );

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

  if (isLoading) {
    return <AccountValueChartContainer.Skeleton />;
  }

  if (isError) {
    return <AccountValueChartContainer.Error />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {t('investor.account_value_over_time')}
        </CardTitle>
        <div className="text-4xl font-bold tabular-nums">
          {toFixedLocalized(currentValue, i18n.language)} {t('common.currency')}
        </div>
      </CardHeader>
      <CardContent className="h-96">
        <StockChart
          stockName="Account Value"
          chartData={chartData}
          selectedInterval="1wk"
          isCandlestick={false}
        />
      </CardContent>
    </Card>
  );
};

function AccountValueChartContainerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent className="h-96">
        <Skeleton className="w-full h-full" />
      </CardContent>
    </Card>
  );
}

AccountValueChartContainer.Skeleton = AccountValueChartContainerSkeleton;

function AccountValueChartContainerError() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('investor.account_value_over_time')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Message message={t('common.error_loading_data')} />
      </CardContent>
    </Card>
  );
}

AccountValueChartContainer.Error = AccountValueChartContainerError;
