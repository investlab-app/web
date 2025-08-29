import { useState } from 'react';
import { StopLimitSection } from './stop-limit-section';

export const useStopLimitForm = (
  initialVolume: number,
  currentPrice: number
) => {
  const [price, setPrice] = useState(initialVolume * currentPrice);
  const [volume, setVolume] = useState(initialVolume);

  const calcPriceFromVolume = (volumeValue: number) =>
    volumeValue * currentPrice;

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setPrice(calcPriceFromVolume(newVolume));
  };

  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
  };

  return {
    price,
    volume,
    handleVolumeChange,
    handlePriceChange,
  };
};

interface StopLimitContainerProps {
  currentPrice: number;
}

export const StopLimitContainer = ({
  currentPrice,
}: StopLimitContainerProps) => {
  const { price, volume, handleVolumeChange, handlePriceChange } =
    useStopLimitForm(1, currentPrice);

  return (
    <StopLimitSection
      value={volume}
      derivedValue={price}
      onVolumeChange={handleVolumeChange}
      onPriceChange={handlePriceChange}
    />
  );
};
