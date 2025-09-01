import { useTranslation } from 'react-i18next';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { Message } from '../../shared/components/error-message';
import { fetchAccountValueOverTime } from '../queries/fetch-account-value-over-time';
import type { InstrumentPricePoint } from '../../charts/types/instrument-price-point';
import { StockChart } from '@/features/charts/components/stock-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import { createLineChartOptions } from '@/features/charts/utils/create-line-chart-options';

export const accountValueOverTimeQueryOptions = queryOptions({
  queryKey: ['accountValueOverTime'],
  queryFn: fetchAccountValueOverTime,
  staleTime: 60 * 1000,
});

export const AccountValueChartContainer = () => {
  const { t, i18n } = useTranslation();

  const { data, isPending, isError } = useQuery(
    accountValueOverTimeQueryOptions
  );

  const chartData: Array<InstrumentPricePoint> =
    data?.data.map((point) => ({
      date: point.date,
      open: point.value,
      close: point.value,
      high: point.value,
      low: point.value,
    })) || [];

  const currentValue = chartData[chartData.length - 1]?.close ?? 0;

  if (isPending) {
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
          chartOptions={createLineChartOptions({
            stockName: 'Account Value',
            chartData: chartData,
            selectedInterval: '1wk',
            translation: { t, i18n },
          })}
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
