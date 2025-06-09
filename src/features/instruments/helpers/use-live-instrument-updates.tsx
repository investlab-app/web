import { useEffect, useRef, useState } from 'react';
import { subscribeToTicker, unsubscribeFromTicker } from '@/remote/event-stream';

type Instrument = {
  name: string;
  quantity: number;
  currentPrice: number;
  marketValue: number;
  percentPL: number;
  dollarPL: number;
};

export function useLiveInstrumentUpdates(initialInstruments: Instrument[]) {
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [liveData, setLiveData] = useState<Instrument[]>([]);

  const instrumentsRef = useRef<Record<string, Instrument>>({});
  const handlersRef = useRef<Record<string, (price: number) => void>>({});

  // Initialize instrument map
  useEffect(() => {
    const map: Record<string, Instrument> = {};
    for (const inst of initialInstruments) {
      map[inst.name] = inst;
    }
    instrumentsRef.current = map;
  }, [initialInstruments]);

  // Update live data whenever prices or instruments change
  useEffect(() => {
    const updated: Instrument[] = Object.entries(instrumentsRef.current).map(
      ([ticker, inst]) => {
        const livePrice = livePrices[ticker] ?? inst.currentPrice;
        const originalTotal = inst.quantity * inst.currentPrice;
        const marketValue = +(inst.quantity * livePrice).toFixed(2);
        const dollarPL = +(marketValue - originalTotal).toFixed(2);
        const percentPL = +((dollarPL / originalTotal) * 100).toFixed(2);

        return {
          ...inst,
          currentPrice: livePrice,
          marketValue,
          dollarPL,
          percentPL,
        };
      }
    );

    setLiveData(updated);
  }, [livePrices]);

  const subscribe = (ticker: string) => {
    if (handlersRef.current[ticker]) return; // already subscribed

    const handler = (price: number) => {
      console.log("handling", ticker)
      setLivePrices((prev) => ({ ...prev, [ticker]: price }));
    };

    handlersRef.current[ticker] = handler;
    subscribeToTicker(ticker, handler);
  };

  const unsubscribe = (ticker: string) => {
    const handler = handlersRef.current[ticker];
    if (!handler) return;

    unsubscribeFromTicker(ticker, handler);
    delete handlersRef.current[ticker];
  };

  return {
    liveData,
    subscribe,
    unsubscribe,
  };
}
