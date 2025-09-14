import { IconSwitchVertical } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { BuySellActionProps } from '../types/types';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { Button } from '@/features/shared/components/ui/button';
import { useIsMobile } from '@/features/shared/hooks/use-media-query';

export const BuySellSection = ({
  mode,
  value,
  derivedValue,
  onValueChange,
  onModeToggle,
}: BuySellActionProps) => {
  const { t } = useTranslation();
  const handleInputChange = (val: number | null | undefined) => {
    if (typeof val === 'number' && !isNaN(val)) {
      onValueChange(val);
    }
  };
  const numberInput = (
    <NumberInput
      value={value}
      onValueChange={handleInputChange}
      prefix={mode === 'price' ? '$' : undefined}
      fixedDecimalScale
      stepper={mode === 'price' ? (value > 100 ? 100 : 10) : 0.25}
      decimalScale={mode === 'price' ? 2 : 5}
      className="w-full"
    />
  );
  const topLabel = (
    <p className="text-sm font-medium">
      {mode === 'price' ? t('instruments.price') : t('instruments.volume')}
    </p>
  );
  const bottomLabel = (
    <p className="text-muted-foreground text-sm">
      {mode === 'price'
        ? `${t('instruments.volume')}: ${derivedValue.toFixed(5)}`
        : `${t('instruments.price')}: $${derivedValue.toFixed(2)}`}
    </p>
  );

  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div className="flex flex-col mt-3">
        {topLabel}
        <div className="flex gap-2 mt-1">
          {numberInput}
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
            <IconSwitchVertical />
          </Button>
        </div>
        {bottomLabel}

        <div className="flex gap-2 mt-1">
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
    <div className="flex items-center gap-2 mt-2">
      <Button className="bg-green-600 hover:bg-green-700 w-1/4">
        {t('instruments.buy')}
      </Button>
      <div className="mt-1 w-full">
        {topLabel}
        {numberInput}
        {bottomLabel}
      </div>
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
        <IconSwitchVertical />
      </Button>
      <Button className="bg-red-600 hover:bg-red-700 w-1/4">
        {t('instruments.sell')}
      </Button>
    </div>
  );
};
