import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWS } from './use-ws';
import { livePrice } from '@/features/charts/types/live-price';
import { pricesListOptions } from '@/client/@tanstack/react-query.gen';

export function useLivePrices(...tickers: Array<string>) {
  const { lastJsonMessage } = useWS(tickers);

  const [prices, setPrices] = useState<Record<string, number>>({});

  const queryOptions = pricesListOptions({ query: { tickers } });

  const { data } = useQuery({
    ...queryOptions,
    staleTime: Infinity,
    enabled: tickers.length > 0,
  });

  useEffect(() => {
    if (data === undefined) return;
    const initialPrices = Object.fromEntries(
      data.map((p) => {
        const price = Number(p.current_price);
        return [p.ticker, price];
      })
    );
    setPrices(initialPrices);
  }, [data]);

  useEffect(() => {
    if (!lastJsonMessage) return;

    const out = livePrice.safeParse(lastJsonMessage);

    if (!out.success) {
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

export function useLivePrice(ticker: string): number | undefined {
  const prices = useLivePrices(ticker);
  return prices[ticker];
}
