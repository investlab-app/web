import { useQuery } from '@tanstack/react-query';
import { useLivePrices } from './use-live-prices';
import { pricesRetrieveOptions } from '@/client/@tanstack/react-query.gen';

export function useLivePrice(ticker: string): number | undefined {
  const prices = useLivePrices([ticker]);
  const tickerPrice = useQuery({
    ...pricesRetrieveOptions({ path: { ticker } }),
    enabled: !prices[ticker],
  });
  return prices[ticker] ?? tickerPrice.data?.current_price;
}
