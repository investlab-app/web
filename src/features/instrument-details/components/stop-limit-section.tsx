import { Button } from '@/features/shared/components/ui/button';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/features/shared/hooks/use-is-mobile';

export interface StopLimitSectionProps {
  value: number;
  derivedValue: number;
  onVolumeChange: (val: number) => void;
  onPriceChange: (val: number) => void;
}

export const StopLimitSection = ({
  value,
  derivedValue,
  onVolumeChange,
  onPriceChange,
}: StopLimitSectionProps) => {
  const { t } = useTranslation();

  const numberInputPrice = (
    <NumberInput
      value={derivedValue}
      prefix={'$'}
      fixedDecimalScale
      onValueChange={(val) => onPriceChange(val ?? 0)}
      stepper={derivedValue > 100 ? 100 : 10}
      decimalScale={2}
    />
  );
  const numberInputVolume = (
    <NumberInput
      value={value}
      fixedDecimalScale
      onValueChange={(val) => onVolumeChange(val ?? 0)}
      stepper={value > 5 ? 1 : 0.25}
      decimalScale={5}
    />
  );
  const priceLabel = <p className="text-sm">{t('instruments.price')}</p>;
  const volumeLabel = <p className="text-sm">{t('instruments.volume')}</p>;

  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div className="flex flex-col mt-3">
        <div className="flex gap-2">
          <div className="w-1/2">
            {volumeLabel}
            {numberInputVolume}
          </div>
          <div className="w-1/2">
            {priceLabel}
            {numberInputPrice}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <Button className="bg-green-600 hover:bg-green-700 flex-2">
            {t('instruments.buy')}
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 flex-2">
            {t('instruments.sell')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button className="bg-green-600 hover:bg-green-700 w-1/4 mt-5">
        {t('instruments.buy')}
      </Button>
      <div className="w-full">
        {volumeLabel}
        {numberInputVolume}
      </div>
      <div className="w-full">
        {priceLabel}
        {numberInputPrice}
      </div>
      <Button className="bg-red-600 hover:bg-red-700 w-1/4 mt-5">
        {t('instruments.sell')}
      </Button>
    </div>
  );
};
