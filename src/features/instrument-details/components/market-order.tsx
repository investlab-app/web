import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OrderConfirmationModalWrapper } from './order-confirmation-modal-wrapper';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { Button } from '@/features/shared/components/ui/button';

import {
  investorsMeRetrieveOptions,
  ordersListOptions,
  ordersMarketCreateMutation,
  statisticsTransactionsHistoryListOptions,
} from '@/client/@tanstack/react-query.gen';

import { useLivePrice } from '@/features/shared/hooks/use-live-prices';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

interface MarketOrderProps {
  ticker: string;
  onlySell?: boolean;
}

const VOLUME_PRECISION = 5;
const PRICE_PRECISION = 2;

export const MarketOrder = ({ ticker }: MarketOrderProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<'price' | 'volume'>('price');
  const onModeToggle = () =>
    setMode((prev) => (prev === 'price' ? 'volume' : 'price'));

  const currentPrice = useLivePrice(ticker);
  const [price, setPrice] = useState(currentPrice);
  const [volume, setVolume] = useState(
    currentPrice && price ? price / currentPrice : undefined
  );

  useEffect(() => {
    if (currentPrice === undefined) return;
    switch (mode) {
      case 'price':
        if (price === undefined) {
          setPrice(currentPrice);
        }
        setVolume(price !== undefined ? price / currentPrice : 1);
        break;
      case 'volume':
        if (volume === undefined) {
          setVolume(1);
        }
        setPrice(volume !== undefined ? volume * currentPrice : 1);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrice]);

  const handlePriceChange = (newPrice: number | undefined) => {
    if (newPrice === undefined || !currentPrice) return;
    setPrice(newPrice);
    setVolume(newPrice / currentPrice);
  };

  const handleVolumeChange = (newVolume: number | undefined) => {
    if (newVolume === undefined || !currentPrice) return;
    setVolume(newVolume);
    setPrice(newVolume * currentPrice);
  };

  const { mutate: createOrder, isPending } = useMutation({
    ...ordersMarketCreateMutation(),
    onSuccess: () => {
      toast.success(t('orders.order_success'));
      queryClient.invalidateQueries({
        queryKey: statisticsTransactionsHistoryListOptions({
          query: {
            type: 'open',
            tickers: [ticker],
          },
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
      console.warn('Order creation failed:', error);
      toast.error(t('orders.order_failed'));
    },
    onSettled: () => {},
  });

  const handleOrder = (type: 'buy' | 'sell') => {
    if (price === undefined || volume === undefined) return;
    createOrder({
      body: {
        ticker,
        volume: volume.toFixed(VOLUME_PRECISION),
        is_buy: type === 'buy',
      },
    });
  };

  if (
    price === undefined ||
    volume === undefined ||
    currentPrice === undefined
  ) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <label className="font-medium">
          {mode === 'price' ? t('instruments.price') : t('instruments.volume')}
          {': '}
        </label>
        {mode === 'price' ? (
          <NumberInput
            value={price}
            onValueChange={handlePriceChange}
            prefix={'$'}
            fixedDecimalScale
            stepper={price > 100 ? 100 : 10}
            decimalScale={2}
            className="w-full"
            placeholder="0.00"
          />
        ) : (
          <NumberInput
            value={volume}
            onValueChange={handleVolumeChange}
            fixedDecimalScale
            stepper={0.25}
            decimalScale={VOLUME_PRECISION}
            className="w-full"
            placeholder="0.00000"
          />
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onModeToggle}
          className="h-9"
          title={
            mode === 'price'
              ? t('orders.switch_to_volume')
              : t('orders.switch_to_price')
          }
        >
          <ArrowUpDown className="h-full w-3" />
        </Button>
      </div>
      <div className="bg-muted rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {mode === 'price'
              ? t('instruments.volume')
              : t('instruments.price')}
          </span>
          <span className="font-medium tabular-nums">
            {mode === 'price'
              ? (price / currentPrice).toFixed(VOLUME_PRECISION)
              : `$${(volume * currentPrice).toFixed(PRICE_PRECISION)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {t('instruments.current_price')}
          </span>
          <span className="font-medium tabular-nums">
            ${Number(currentPrice).toFixed(PRICE_PRECISION)}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <OrderConfirmationModalWrapper
          isBuy={true}
          isLimitOrder={false}
          ticker={ticker}
          price={price}
          volume={volume}
          onConfirm={() => handleOrder('buy')}
        >
          <Button
            size="lg"
            variant="green"
            className="flex-1"
            disabled={
              isPending || !price || !volume || price <= 0 || volume <= 0
            }
          >
            {t('instruments.buy')}
          </Button>
        </OrderConfirmationModalWrapper>
        <OrderConfirmationModalWrapper
          isBuy={false}
          isLimitOrder={false}
          ticker={ticker}
          price={price}
          volume={volume}
          onConfirm={() => handleOrder('sell')}
        >
          <Button
            size="lg"
            variant="red"
            className="flex-1"
            disabled={
              isPending || !price || !volume || price <= 0 || volume <= 0
            }
          >
            {t('instruments.sell')}
          </Button>
        </OrderConfirmationModalWrapper>
      </div>
    </div>
  );
};
