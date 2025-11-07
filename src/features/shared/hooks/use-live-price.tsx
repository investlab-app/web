import { useLivePrices } from './use-live-prices';

export function useLivePrice(ticker: string): number | undefined {
  const prices = useLivePrices(ticker);
  return prices[ticker];
}
