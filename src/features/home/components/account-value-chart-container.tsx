import { useMemo } from 'react';
import { ChartErrorMessage } from '../../charts/components/chart-error-message';
import { StockChartPresentation } from '../../charts/components/stock-chart-presentation';
import type { InstrumentPriceProps } from '../../charts/helpers/charts-props';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const AccuntValueChartContainer = () => {
  const data: Array<InstrumentPriceProps> = useMemo(() => {
    const today = new Date();
    const prices: Array<InstrumentPriceProps> = [];

    for (let i = 0; i < 50; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i * 7);

      const base = 100 + Math.random() * 20;
      const high = base + Math.random() * 5;
      const low = base - Math.random() * 5;
      const open = base + (Math.random() - 0.5) * 2;
      const close = base + (Math.random() - 0.5) * 2;

      prices.unshift({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
      });
    }

    return prices;
  }, []);

  const currentValue = data[data.length - 1]?.close ?? 0;
  const hasError = data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total investments</CardTitle>
        {!hasError && typeof currentValue === 'number' && (
          <CardDescription>${currentValue.toFixed(2)}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {hasError ? (
          <ChartErrorMessage />
        ) : (
          <StockChartPresentation
            stockName="Test"
            chartData={data}
            selectedInterval="1wk"
          />
        )}
      </CardContent>
    </Card>
  );
};
