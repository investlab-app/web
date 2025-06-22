import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { ChartErrorMessage } from '../../charts/components/chart-error-message';
import { StockChart } from '../../charts/components/stock-chart';
import { fetchAccountValueOverTime } from '../queries/fetch-account-value-over-time';
import type { InstrumentPriceProps } from '../../charts/types/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';

export const AccountValueChartContainer = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['accountValueOverTime'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token');
      return fetchAccountValueOverTime(token);
    },
    staleTime: 60 * 1000,
  });

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

        {!hasError && typeof currentValue === 'number' && (
          <div className="text-4xl font-bold tabular-nums">
            {currentValue.toFixed(2)} {t('common.currency')}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">{t('common.loading')}</div>
        ) : hasError ? (
          <ChartErrorMessage />
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
