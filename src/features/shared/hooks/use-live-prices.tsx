import { useEffect, useState } from 'react';
import { useWS } from './use-ws';
import { livePrice } from '@/features/charts/types/live-price';

export function useLivePrices(tickers: Array<string>) {
  const { lastJsonMessage } = useWS(tickers);

  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!lastJsonMessage) return;

    const out = livePrice.safeParse(lastJsonMessage);

    if (!out.success) {
      console.error('Failed to parse live price message:', out.error);
      return;
    }

    const pricesRecord = Object.fromEntries(
      out.data.prices.map((p) => [p.symbol, p.close])
    );

    setPrices((prev) => ({
      ...prev,
      ...pricesRecord,
    }));
  }, [lastJsonMessage]);

  return prices;
}
