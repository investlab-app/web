import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type } from 'arktype';
import { useInstruments } from '../hooks/use-instruments';
import { useDebounce } from '../hooks/use-debounce';
import { livePriceDataDTO } from '../types/types';
import InstrumentTable from './instruments-table';
import type { Instrument } from '../types/types';
import { Button } from '@/features/shared/components/ui/button';
import SearchInput from '@/features/shared/components/ui/search-input';
import { useWS } from '@/features/shared/hooks/use-ws';

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
  const [liveInstruments, setLiveInstruments] = useState<
    Record<string, Instrument>
  >({});
  // Create a stable key based on instruments content to avoid infinite loops
  const instrumentsKey = useMemo(
    () =>
      instruments
        .map((i) => `${i.symbol}-${i.name}`)
        .sort()
        .join('|'),
    [instruments]
  );

  useEffect(() => {
    const instrumentsMap = {} as Record<string, Instrument>;
    instruments.forEach((instrument) => {
      instrumentsMap[instrument.symbol] = { ...instrument };
    });
    setLiveInstruments(instrumentsMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrumentsKey]); // Use stable key instead of instruments array

  const tickers = instruments.map((i) => i.symbol);

  const { lastJsonMessage } = useWS(
    tickers.map((ticker) => `PRICE_UPDATE_${ticker}`)
  );

  useEffect(() => {
    if (lastJsonMessage) {
      const out = livePriceDataDTO(lastJsonMessage);

      if (out instanceof type.errors) {
        console.error('Invalid live price data received:', out);
        return;
      }

      setLiveInstruments((prev) => {
        const updated = { ...prev };
        updated[out.id] = {
          ...updated[out.id],
          currentPrice: out.price,
          dayChange: out.change || updated[out.id].dayChange,
        };
        return updated;
      });
    }
  }, [lastJsonMessage]);

  const handleInstrumentPressed = useCallback(
    (asset: Instrument) => {
      setInstrument(asset);
      setOpenSheet(true);
    },
    [setInstrument, setOpenSheet]
  );
  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3"
        placeholder={t('common.search')}
      />
      <InstrumentTable
        data={Object.values(liveInstruments)}
        onInstrumentPressed={handleInstrumentPressed}
        rowCount={PAGE_SIZE}
        loading={loading && instruments.length === 0}
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
