// BuySellSection.tsx
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconChevronDown } from '@tabler/icons-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
import { Card, CardContent } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface BuySellSectionProps {
  mode: 'price' | 'volume';
  value: number;
  derivedValue: number;
  onValueChange: (val: number) => void;
  onModeToggle: () => void;
}

export const BuySellSection = ({
  mode,
  value,
  derivedValue,
  onValueChange,
  onModeToggle,
}: BuySellSectionProps) => {
  const { t } = useTranslation();
  const handleInputChange = (val: number | null | undefined) => {
    if (typeof val === 'number' && !isNaN(val)) {
      onValueChange(val);
    }
  };

  return (
    <Card className="space-y-4">
      <CardContent className="space-y-4">
        <Tabs defaultValue="market" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
          </TabsList>

          <TabsContent value="market">
            <div className="mt-4 space-y-2 w-full">
              <label className="text-sm font-medium">
                {mode === 'price'
                  ? t('instruments.price')
                  : t('instruments.volume')}
              </label>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={value}
                    onValueChange={handleInputChange}
                    prefix={mode === 'price' ? '$' : undefined}
                    fixedDecimalScale
                    stepper={mode === 'price' ? 0.5 : 0.05}
                    decimalScale={mode === 'price' ? 2 : 5}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9" // Match the input height
                  onClick={onModeToggle}
                  title={
                    mode === 'price' ? 'Switch to Volume' : 'Switch to Price'
                  }
                >
                  <IconChevronDown />
                </Button>
              </div>

              <p className="text-muted-foreground text-sm">
                {mode === 'price'
                  ? `${t('instruments.volume')}: ${derivedValue.toFixed(5)}`
                  : `${t('instruments.price')}: $${derivedValue.toFixed(2)}`}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <Button className="bg-green-600 hover:bg-green-700 flex-1">
                {t('instruments.buy')}
              </Button>
              <Button className="bg-red-600 hover:bg-red-700  flex-1">
                {t('instruments.sell')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export const useBuySellForm = (initialPrice: number, currentPrice: number) => {
  const [mode, setMode] = useState<'price' | 'volume'>('price');
  const [price, setPrice] = useState(initialPrice);
  const [volume, setVolume] = useState(initialPrice / currentPrice);

  const calcVolumeFromPrice = useCallback(
    (priceValue: number) => priceValue / currentPrice,
    [currentPrice]
  );

  const calcPriceFromVolume = useCallback(
    (volumeValue: number) => volumeValue * currentPrice,
    [currentPrice]
  );

  const handlePriceChange = useCallback(
    (newPrice: number) => {
      setPrice(newPrice);
      setVolume(calcVolumeFromPrice(newPrice));
    },
    [calcVolumeFromPrice]
  );

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      setPrice(calcPriceFromVolume(newVolume));
    },
    [calcPriceFromVolume]
  );

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'price' ? 'volume' : 'price'));
  }, []);

  return {
    mode,
    price,
    volume,
    handlePriceChange,
    handleVolumeChange,
    toggleMode,
  };
};

interface BuySellContainerProps {
  currentPrice: number;
}

export const BuySellContainer = ({ currentPrice }: BuySellContainerProps) => {
  const {
    mode,
    price,
    volume,
    handlePriceChange,
    handleVolumeChange,
    toggleMode,
  } = useBuySellForm(100, currentPrice);

  return (
    <BuySellSection
      mode={mode}
      value={mode === 'price' ? price : volume}
      derivedValue={mode === 'price' ? volume : price}
      onValueChange={mode === 'price' ? handlePriceChange : handleVolumeChange}
      onModeToggle={toggleMode}
    />
  );
};
