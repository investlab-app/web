// hooks/useLiveInstrumentUpdates.ts
import { useEffect, useState } from 'react';
import type { Instrument } from './instrument';

const useLiveInstrumentUpdates = (
  instruments: Array<Instrument>,
  intervalMs: number = 3000
) => {
  const [liveData, setLiveData] = useState<Array<Instrument>>(instruments);

  useEffect(() => {
    // Set initial data
    setLiveData(instruments);

    const interval = setInterval(() => {
      setLiveData((prevData) =>
        prevData.map((asset) => ({
          ...asset,
          currentPrice: parseFloat(
            (asset.currentPrice * (1 + (Math.random() - 0.5) / 100)).toFixed(2)
          ),
          percentPL: parseFloat(
            (asset.percentPL + (Math.random() - 0.5)).toFixed(2)
          ),
          dollarPL: parseFloat(
            (asset.dollarPL + (Math.random() - 0.5) * 5).toFixed(2)
          ),
        }))
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [instruments, intervalMs]);

  return liveData;
};

export default useLiveInstrumentUpdates;
