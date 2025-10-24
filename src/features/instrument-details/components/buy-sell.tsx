import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { Button } from '@/features/shared/components/ui/button';
import { ordersMarketCreateMutation } from '@/client/@tanstack/react-query.gen';
import { useLivePrice } from '@/features/shared/hooks/use-live-price';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

interface BuySellProps {
  ticker: string;
  onlySell?: boolean;
}

export const BuySell = ({ ticker }: BuySellProps) => {
  const { t } = useTranslation();

  const [mode, setMode] = useState<'price' | 'volume'>('price');
  const onModeToggle = () =>
    setMode((prev) => (prev === 'price' ? 'volume' : 'price'));

  const currentPrice = useLivePrice(ticker);
  const [price, setPrice] = useState(currentPrice);
  const [volume, setVolume] = useState(
    currentPrice && price ? price / currentPrice : undefined
  );
  const value = mode === 'price' ? price : volume;

  const handlePriceChange = (newPrice: number | undefined) => {
    if (newPrice === undefined) return;
    setPrice(newPrice);
    setVolume(newPrice / currentPrice!);
  };

  const handleVolumeChange = (newVolume: number | undefined) => {
    if (newVolume === undefined) return;
    setVolume(newVolume);
    setPrice(newVolume * currentPrice!);
  };

  const { mutate: createOrder, isPending } = useMutation({
    ...ordersMarketCreateMutation(),
    onSuccess: () => {
      toast.success('Order placed successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to place order: ${error.message}`);
    },
  });

  const order = (type: 'buy' | 'sell') => {
    if (!price || !volume) return;
    createOrder({
      body: {
        ticker,
        volume: volume.toFixed(2),
        is_buy: type === 'buy',
      },
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mt-2">
        <div className="mt-1 w-full">
          <p className="text-sm font-medium">
            {mode === 'price'
              ? t('instruments.price')
              : t('instruments.volume')}
          </p>
          {price === undefined ||
          volume === undefined ||
          currentPrice === undefined ? (
            <>
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-5 w-24" />
            </>
          ) : (
            <>
              <div className="flex gap-2 mb-1">
                {mode === 'price' ? (
                  <NumberInput
                    value={price}
                    onValueChange={handlePriceChange}
                    prefix={'$'}
                    fixedDecimalScale
                    stepper={price > 100 ? 100 : 10}
                    decimalScale={2}
                    className="w-full"
                  />
                ) : (
                  <NumberInput
                    value={volume}
                    onValueChange={handleVolumeChange}
                    fixedDecimalScale
                    stepper={0.25}
                    decimalScale={5}
                    className="w-full"
                  />
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={onModeToggle}
                  title={
                    mode === 'price'
                      ? t('orders.switch_to_volume')
                      : t('orders.switch_to_price')
                  }
                >
                  <ArrowUpDown />
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">
                {mode === 'price'
                  ? `${t('instruments.volume')}: ${(price / currentPrice).toFixed(5)}`
                  : `${t('instruments.price')}: $${(volume * currentPrice).toFixed(2)}`}
              </p>
            </>
          )}
        </div>
      </div>
      <div className='flex gap-2'>
        <Button
          className="bg-green-600 hover:bg-green-700 flex-1"
          onClick={() => order('buy')}
          disabled={isPending || value === 0}
        >
          {t('instruments.buy')}
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700 flex-1"
          onClick={() => order('sell')}
          disabled={isPending || value === 0}
        >
          {t('instruments.sell')}
        </Button>
      </div>
    </div>
  );
};
