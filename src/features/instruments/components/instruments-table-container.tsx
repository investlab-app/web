import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInstruments } from '../helpers/use-instruments';
import { useDebounce } from '../helpers/debounce';
import InstrumentTable from './instrument-table';
import type { Instrument } from '../types/instruments.types';
import { useSSE } from '@/features/shared/hooks/use-sse';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/ui/search-input';

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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { instruments, loading, hasMore } = useInstruments({
    filter: debouncedSearch,
    page,
    perPage: PAGE_SIZE,
  });

  const [liveInstruments, setLiveInstruments] = useState<Record<string, Instrument>>({});

  useEffect(() => {
    // const instrumentsMap = instruments.reduce((acc, instrument) => {
    //   acc[instrument.symbol] = instrument;
    //   return acc;
    // }, {} as Record<string, Instrument>);

    // console.log('Setting live instruments:', instrumentsMap);
    
    // setLiveInstruments(instrumentsMap);

    console.log('Setting live instruments:', instruments);
  }, [instruments]);

  const tickers = instruments.map((i) => i.symbol);

  const tickersSet = useMemo(
    () => new Set(tickers),
    [tickers.join(',')] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useSSE({
    events: tickersSet,
    callback: (data) => {
      console.log('SSE callback triggered for tickers:', tickersSet);
      try {
        const fixedMessage = data.replace(/'/g, '"');
        const parsed = JSON.parse(fixedMessage);
        const { id, price, change_percent } = parsed;

        if (!id || !price || !change_percent) {
          console.warn('Invalid message format:', parsed);
          return;
        }

        setLiveInstruments((prev) => {
          const updated = { ...prev };
          updated[id] = {
            ...updated[id],
            currentPrice: price,
            dayChange: change_percent,
          };
          return updated;
        });
      } catch (error) {
        console.error('Failed to parse message:', data, error);
      }
    },
  });

  const handleInstrumentPressed = useCallback(
    (asset: Instrument) => {
      setInstrument(asset);
      setOpenSheet(true);
    },
    [setInstrument, setOpenSheet]
  );

  return (
    <div className="p-4">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3"
        placeholder={t('common.search')}
      />
      <InstrumentTable
        data={Object.values(liveInstruments)}
        onInstrumentPressed={handleInstrumentPressed}
      />
      <div className="flex justify-center mt-4">
        {hasMore && (
          <Button
            onClick={() => setPage((prev) => prev + 1)}
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
