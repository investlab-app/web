import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartErrorMessage } from '../../charts/components/chart-error-message';
import { StockChart } from '../../charts/components/stock-chart';
import type { InstrumentPriceProps } from '../../charts/types/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';

export const AccountValueChartContainer = () => {
  const { t } = useTranslation();
  const data: Array<InstrumentPriceProps> = useMemo(() => {
    const today = new Date();
    const prices: Array<InstrumentPriceProps> = [];

    for (let i = 0; i < 120; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i * 7);

      const base = 100 + Math.random() * 5;
      const price = base + Math.random() * 3;

      prices.unshift({
        date: date.toISOString().split('T')[0],
        open: parseFloat(price.toFixed(2)),
        close: parseFloat(price.toFixed(2)),
        high: parseFloat(price.toFixed(2)),
        low: parseFloat(price.toFixed(2)),
      });
    }

    return prices;
  }, []);

  const currentValue = data[data.length - 1]?.close ?? 0;
  const hasError = data.length === 0;

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
        {hasError ? (
          <ChartErrorMessage />
        ) : (
          <StockChart
            stockName="Test"
            chartData={data}
            selectedInterval="1wk"
            isCandlestick={false}
          />
        )}
      </CardContent>
    </Card>
  );
};
