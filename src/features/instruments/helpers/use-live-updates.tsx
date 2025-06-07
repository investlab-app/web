import { useEffect, useState } from 'react';

export function useLiveUpdates(ticker: string) {
  const [price, setPrice] = useState(() => {
    return +(50 + Math.random() * 100).toFixed(2);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => {
        const changePercent = (Math.random() - 0.5) / 100;
        const newPrice = +(prev * (1 + changePercent)).toFixed(2);
        return newPrice;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { ticker, price };
}
