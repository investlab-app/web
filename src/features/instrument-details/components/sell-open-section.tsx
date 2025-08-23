import { Button } from '@/features/shared/components/ui/button';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { IconSwitchVertical } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { BuySellActionProps } from '../types/types';

export const SellOpenSection = ({
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

  return (
    <div className="mt-4 space-y-2 w-full">
      <label className="text-sm font-medium">
        {mode === 'price' ? t('instruments.price') : t('instruments.volume')}
      </label>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <NumberInput
            value={value}
            onValueChange={handleInputChange}
            prefix={mode === 'price' ? '$' : undefined}
            fixedDecimalScale
            stepper={mode === 'price' ? (value > 100 ? 100 : 10) : 0.25}
            decimalScale={mode === 'price' ? 2 : 5}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9" // Match the input height
          onClick={onModeToggle}
          title={mode === 'price' ? 'Switch to Volume' : 'Switch to Price'}
        >
          <IconSwitchVertical />
        </Button>
        <Button className="bg-red-600 hover:bg-red-700  w-1/3">
          {t('instruments.sell')}
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        {mode === 'price'
          ? `${t('instruments.volume')}: ${derivedValue.toFixed(5)}`
          : `${t('instruments.price')}: $${derivedValue.toFixed(2)}`}
      </p>
    </div>
  );
};
