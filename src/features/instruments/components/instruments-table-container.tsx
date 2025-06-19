import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../helpers/debounce';
import { useInstruments } from '../helpers/use-instruments';
import InstrumentTable from './instrument-table';
import type { Instrument } from '../types/instruments.types';
import type { Client } from '@/features/shared/hooks/use-sse.ts';
import { useLivePrices } from '@/features/shared/hooks/use-sse';
import SearchInput from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

type InstrumentsTableContainerProps = {
  setInstrument: (instrument: Instrument) => void;
  setOpenSheet: (open: boolean) => void;
};

const InstrumentsTableContainer = ({
  setInstrument,
  setOpenSheet,
}: InstrumentsTableContainerProps) => {
  // const { t } = useTranslation();

  // const [search, setSearch] = useState<string>('');
  // const debouncedSearch = useDebounce(search, 500);
  // const [, setPage] = useState(1);
  // useEffect(() => {
  //   setPage(1);
  // }, [debouncedSearch]);

  // const { instruments, loading, hasMore } = useInstruments({
  //   filter: debouncedSearch,
  //   page,
  //   perPage: PAGE_SIZE,
  // });

  const instruments: Array<Instrument> = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 150,
      dayChange: 1.5,
      volume: 1000000,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      currentPrice: 2800,
      dayChange: -0.5,
      volume: 500000,
    },
  ];

  const livePrices = useLivePrices();

  const handleMessage = useCallback((message: string) => {
    console.log('Received message:', message);
    // try {
    //   // Replace single quotes with double quotes to ensure valid JSON
    //   const fixedMessage = message.replace(/'/g, '"');
    //   const parsed = JSON.parse(fixedMessage);
    //   const { id, price, change_percent } = parsed;

    //   if (!id || !price || !change_percent) {
    //     console.warn('Invalid message format:', parsed);
    //     return;
    //   }

    //   priceUpdatesRef.current[id] = {
    //     currentPrice: price,
    //     dayChange: change_percent,
    //   };
    // } catch (error) {
    //   console.error('Failed to parse message:', message, error);
    // }
  }, []);

  useEffect(() => {
    console.log('Subscribing to live prices for instruments:', instruments);

    const tickers = new Set(instruments.map((instrument) => instrument.symbol));

    const handler = {
      id: crypto.randomUUID(),
      symbols: tickers,
      handler: handleMessage,
    } as Client;

    livePrices.subscribe(handler);

    return () => {
      console.log(
        'Unsubscribing from live prices for instruments:',
        instruments
      );
      livePrices.unsubscribe(handler);
    };
  }, [instruments]);

  const handleInstrumentPressed = (asset: Instrument) => {
    setInstrument(asset);
    setOpenSheet(true);
  };

  return (
    <div className="p-4">
      {/* <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3"
        placeholder={t('common.search')}
      /> */}
      <InstrumentTable
        data={instruments}
        onInstrumentPressed={handleInstrumentPressed}
      />
      {/* <div className="flex justify-center mt-4">
        {hasMore && (
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {loading ? t('common.loading') : t('common.more')}
          </Button>
        )}
      </div> */}
    </div>
  );
};

export default InstrumentsTableContainer;
