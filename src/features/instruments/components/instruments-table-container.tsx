import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../helpers/debounce';
import { useInstruments } from '../helpers/use-instruments';
import InstrumentTable from './instrument-table';
import type { Instrument } from '../types/instruments.types';
import type { Handler } from '@/features/shared/hooks/use-sse.ts';
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
  const { t } = useTranslation();

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);

  const { instruments, loading, hasMore } = useInstruments({
    filter: debouncedSearch,
    page,
    perPage: PAGE_SIZE,
  });

  const livePrices = useLivePrices();

  const handleMessage = useCallback((message: string) => {
    try {
      // Replace single quotes with double quotes to ensure valid JSON
      const fixedMessage = message.replace(/'/g, '"');
      const parsed = JSON.parse(fixedMessage);
      const { id, price, change_percent } = parsed;

      if (!id || !price || !change_percent) {
        console.warn('Invalid message format:', parsed);
        return;
      }

      priceUpdatesRef.current[id] = {
        currentPrice: price,
        dayChange: change_percent,
      };
    } catch (error) {
      console.error('Failed to parse message:', message, error);
    }
  }, []);

  useEffect(() => {
    const tickers = new Set(instruments.map((instrument) => instrument.symbol));

    const handler = {
      id: crypto.randomUUID(),
      symbols: tickers,
      callback: handleMessage,
    } as Handler;

    livePrices.subscribe(handler);

    return () => {
      livePrices.unsubscribe(handler);
    };
  }, [livePrices, handleMessage, instruments]);

  const priceUpdatesRef = useRef<
    Record<string, Partial<(typeof instruments)[0]>>
  >({});

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleInstrumentPressed = (asset: Instrument) => {
    setInstrument(asset);
    setOpenSheet(true);
  };

  const mergedData = instruments.map((instrument) => {
    const updates = priceUpdatesRef.current[instrument.symbol];
    return {
      ...instrument,
      ...updates,
    };
  });

  return (
    <div className="p-4">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3"
        placeholder={t('common.search')}
      />
      <InstrumentTable
        data={mergedData}
        onInstrumentPressed={handleInstrumentPressed}
      />
      <div className="flex justify-center mt-4">
        {hasMore && (
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {loading ? t('common.loading') : t('common.more')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InstrumentsTableContainer;
