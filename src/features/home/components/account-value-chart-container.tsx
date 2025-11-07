import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../../shared/components/error-message';
import type { InstrumentPricePoint } from '../../charts/types/instrument-price-point';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { StockChart } from '@/features/charts/components/stock-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import { investorsMeAccountValueListOptions } from '@/client/@tanstack/react-query.gen';
import { EmptyMessage } from '@/features/shared/components/empty-message';

export const AccountValueChartContainer = () => {
  const { t, i18n } = useTranslation();

  const { data, isPending, isError } = useQuery(
    investorsMeAccountValueListOptions()
  );

  const chartData: Array<InstrumentPricePoint> =
    data?.map((point) => ({
      date: new Date(point.date).toISOString(),
      open: point.value,
      close: point.value,
      high: point.value,
      low: point.value,
    })) || [];

  const currentValue = chartData[chartData.length - 1]?.close ?? 0;

  if (isPending) {
    return <AccountValueChartContainerSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('investor.account_value_over_time')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={t('common.error_loading_data')} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {t('investor.account_value_over_time')}
        </CardTitle>
        <div className="text-4xl font-bold tabular-nums">
          {toFixedLocalized(currentValue, i18n.language)}
        </div>
      </CardHeader>
      <CardContent className="h-96">
        {chartData.length === 0 ? (
          <EmptyMessage
            message={t('investor.no_account_value_data')}
            cta={{
              to: '/instruments',
              label: t('instruments.browse_instruments'),
            }}
          />
        ) : (
          <StockChart
            type="line"
            ticker="Account Value"
            priceHistory={chartData}
            selectedInterval="WEEK"
          />
        )}
      </CardContent>
    </Card>
  );
};

export const AccountValueChartContainerSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-6 w-40 bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="h-96">
        <Skeleton className="w-full h-full" />
      </CardContent>
    </Card>
  );
};
