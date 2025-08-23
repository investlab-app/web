// BuySellSection.tsx
import { useCallback, useState } from 'react';
import { BuySellSection } from '@/features/instrument-details/components/buy-sell-section';
import { SellOpenSection } from '@/features/instrument-details/components/sell-open-section';

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
  onlySell?: boolean;
}

export const BuySellContainer = ({
  currentPrice,
  onlySell = false,
}: BuySellContainerProps) => {
  const {
    mode,
    price,
    volume,
    handlePriceChange,
    handleVolumeChange,
    toggleMode,
  } = useBuySellForm(100, currentPrice);

  return onlySell ? (
    <SellOpenSection
      mode={mode}
      value={mode === 'price' ? price : volume}
      derivedValue={mode === 'price' ? volume : price}
      onValueChange={mode === 'price' ? handlePriceChange : handleVolumeChange}
      onModeToggle={toggleMode}
    />
  ) : (
    <BuySellSection
      mode={mode}
      value={mode === 'price' ? price : volume}
      derivedValue={mode === 'price' ? volume : price}
      onValueChange={mode === 'price' ? handlePriceChange : handleVolumeChange}
      onModeToggle={toggleMode}
    />
  );
};
