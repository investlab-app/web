import { useTranslation } from 'react-i18next';
import { ArrowUpDown } from 'lucide-react';
import { NumberInput } from '@/features/shared/components/ui/number-input';
import { Button } from '@/features/shared/components/ui/button';

interface SellOpenSectionProps {
  mode: 'price' | 'volume';
  value: number;
  derivedValue: number;
  onValueChange: (val: number) => void;
  onModeToggle: () => void;
}

export const SellOpenSection = ({
  mode,
  value,
  derivedValue,
  onValueChange,
  onModeToggle,
}: SellOpenSectionProps) => {
  const { t } = useTranslation();
  const handleInputChange = (val: number | undefined) => {
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
        <Button variant="red" className="w-1/3">
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
