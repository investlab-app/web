// hooks/useLiveInstrumentUpdates.ts
import { useLiveUpdates } from './use-live-updates';
import { useEffect, useState } from 'react';

type InputInstrument = {
  name: string;
  quantity: number;
  currentPrice: number;
};

type Instrument = {
  name: string;
  quantity: number;
  currentPrice: number;
  marketValue: number;
  percentPL: number;
  dollarPL: number;
};

export function useLiveInstrumentUpdates(instruments: InputInstrument[]) {
  // Track live prices separately
  const livePriceAAPL = useLiveUpdates('AAPL')['price'];

  const [liveData, setLiveData] = useState<Instrument[]>([]);

  useEffect(() => {
    const updated = instruments.map((instrument) => {
      const livePrice = livePriceAAPL;

      const originalTotal = instrument.quantity * instrument.currentPrice;
      const marketValue = +(instrument.quantity * livePrice).toFixed(2);
      const dollarPL = +(marketValue - originalTotal).toFixed(2);
      const percentPL = +((dollarPL / originalTotal) * 100).toFixed(2);

      return {
        ...instrument,
        currentPrice: livePrice,
        marketValue,
        dollarPL,
        percentPL,
      };
    });

    setLiveData(updated);
  }, [livePriceAAPL, instruments]);

  return liveData;
}
