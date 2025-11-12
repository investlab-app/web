import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  investorsMeRetrieveOptions,
  ordersLimitCreateMutation,
  ordersListOptions,
  statisticsTransactionsHistoryListOptions,
} from '@/client/@tanstack/react-query.gen';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { Button } from '@/features/shared/components/ui/button';
import { Label } from '@/features/shared/components/ui/label';
import { useLivePrice } from '@/features/shared/hooks/use-live-prices';
import { withCurrency } from '@/features/shared/utils/numbers';
import { cn } from '@/features/shared/utils/styles';

interface LimitOrderProps {
  ticker: string;
  className?: string;
}

const VOLUME_PRECISION = 5;
const LIMIT_PRICE_PRECISION = 8;

export function LimitOrder({ ticker, className }: LimitOrderProps) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const currentPrice = useLivePrice(ticker);
  const [limitPrice, setLimitPrice] = useState(currentPrice);
  const [volume, setVolume] = useState(1);

  if (currentPrice !== undefined && limitPrice === undefined) {
    setLimitPrice(currentPrice);
  }

  const totalValue = limitPrice !== undefined ? limitPrice * volume : undefined;

  const { mutate: createLimitOrder, isPending } = useMutation({
    ...ordersLimitCreateMutation(),
    onSuccess: () => {
      toast.success(t('orders.order_success'));
      queryClient.invalidateQueries({
        queryKey: statisticsTransactionsHistoryListOptions({
          query: { type: 'open', tickers: [ticker] },
        }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: investorsMeRetrieveOptions().queryKey,
      });
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ordersListOptions().queryKey,
        });
      }, 1000);
    },
    onError: (error) => {
      console.warn('Limit order creation failed:', error);
      toast.error(t('orders.order_failed'));
    },
  });

  const handleSubmit = (side: 'buy' | 'sell') => {
    if (limitPrice === undefined || limitPrice <= 0 || volume <= 0) {
      return;
    }

    createLimitOrder({
      body: {
        ticker,
        limit_price: limitPrice.toFixed(LIMIT_PRICE_PRECISION),
        volume: volume.toFixed(VOLUME_PRECISION),
        is_buy: side === 'buy',
      },
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label
            htmlFor={`limit-price-${ticker}`}
            className="text-sm font-medium text-foreground"
          >
            {t('instruments.price')}
          </Label>
          <NumberInput
            id={`limit-price-${ticker}`}
            value={limitPrice}
            onValueChange={setLimitPrice}
            decimalScale={4}
            fixedDecimalScale={false}
            prefix="$"
            min={0}
            stepper={limitPrice && limitPrice > 100 ? 1 : 0.1}
            className="w-full"
            placeholder="0.0000"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`limit-volume-${ticker}`}
            className="text-sm font-medium text-foreground"
          >
            {t('instruments.volume')}
          </Label>
          <NumberInput
            id={`limit-volume-${ticker}`}
            value={volume}
            onValueChange={(newVolume) => {
              if (newVolume) {
                setVolume(newVolume);
              }
            }}
            decimalScale={VOLUME_PRECISION}
            fixedDecimalScale={false}
            min={0}
            stepper={0.1}
            className="w-full"
            placeholder="0.00000"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t('instruments.current_price')}</span>
          <span className="tabular-nums font-medium text-foreground">
            {currentPrice !== undefined
              ? withCurrency(currentPrice, i18n.language)
              : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t('transactions.table.headers.market_value')}</span>
          <span className="tabular-nums font-semibold text-foreground">
            {totalValue !== undefined
              ? withCurrency(totalValue, i18n.language)
              : '—'}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="lg"
          variant="green"
          className="flex-1"
          disabled={isPending || !limitPrice || !volume}
          onClick={() => handleSubmit('buy')}
        >
          {t('instruments.buy')}
        </Button>
        <Button
          size="lg"
          variant="red"
          className="flex-1"
          disabled={isPending || !limitPrice || !volume}
          onClick={() => handleSubmit('sell')}
        >
          {t('instruments.sell')}
        </Button>
      </div>
    </div>
  );
}
