import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/features/shared/components/ui/button';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { useLivePrice } from '@/features/shared/hooks/use-live-price';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

interface StopLimitProps {
  ticker: string;
}

export const StopLimit = ({ ticker }: StopLimitProps) => {
  const currentPrice = useLivePrice(ticker);
  const [price, setPrice] = useState(currentPrice);
  const [volume, setVolume] = useState(
    currentPrice && price ? price / currentPrice : undefined
  );

  const handleVolumeChange = (newVolume: number) => {
    if (!currentPrice) return;
    setVolume(newVolume);
    setPrice(newVolume * currentPrice);
  };

  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
  };

  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 mt-2 mb-5">
      <Button className="bg-green-600 hover:bg-green-700 w-1/4 mt-5">
        {t('instruments.buy')}
      </Button>
      <div className="w-full">
        <p className="text-sm mb-1">{t('instruments.volume')}</p>
        {volume === undefined ? (
          <Skeleton className="h-8 w-full rounded-md" />
        ) : (
          <NumberInput
            value={volume}
            fixedDecimalScale
            onValueChange={(val) => handleVolumeChange(val ?? 0)}
            stepper={volume > 5 ? 1 : 0.25}
            decimalScale={5}
          />
        )}
      </div>
      <div className="w-full">
        <p className="text-sm mb-1">{t('instruments.price')}</p>
        {price === undefined ? (
          <Skeleton className="h-8 w-full rounded-md" />
        ) : (
          <NumberInput
            value={price}
            prefix={'$'}
            fixedDecimalScale
            onValueChange={(val) => handlePriceChange(val ?? 0)}
            stepper={price > 1000 ? 100 : 10}
            decimalScale={2}
          />
        )}
      </div>
      <Button className="bg-red-600 hover:bg-red-700 w-1/4 mt-5">
        {t('instruments.sell')}
      </Button>
    </div>
  );
};
