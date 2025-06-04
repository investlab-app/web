import { useEffect, useState } from 'react';
import useInstruments from '../helpers/use-instruments';
import useLiveInstrumentUpdates from '../helpers/use-live-instrument-updates';
import InstrumentTable from './instrument-table';
import type { Instrument } from '../helpers/instrument';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/ui/search-input';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 2;

const InstrumentsTableContainer = () => {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, hasMore } = useInstruments({
    filter: search,
    page,
    perPage: PAGE_SIZE,
  });

  const liveData = useLiveInstrumentUpdates(data);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleInstrumentPressed = (asset: Instrument) => {
    console.log('Instrument clicked:', asset);
  };

  return (
    <div className="p-4">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3"
        placeholder={t('common.search')}
      />
      <InstrumentTable
        data={liveData}
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
