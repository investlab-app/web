import { useEffect, useState } from 'react';
import useInstruments from '../helpers/use-instruments';
// import { useLiveInstrumentUpdates } from '../helpers/use-live-instrument-updates';
import InstrumentTable from './instrument-table';
import type { Instrument } from '../helpers/instrument';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/ui/search-input';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../helpers/debounce';

const PAGE_SIZE = 10;

type Props = {
  setOpenSheet: (open: boolean) => void;
  setInstrument: (instrument: Instrument) => void;
};

const InstrumentsTableContainer = ({ setOpenSheet, setInstrument }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // only update filter after 500ms pause
  const [page, setPage] = useState(1);

  const { data, loading, hasMore } = useInstruments({
    filter: debouncedSearch,
    page,
    perPage: PAGE_SIZE,
  });


  useEffect(() => {
    setPage(1); // reset to page 1 whenever search changes
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleInstrumentPressed = (asset: Instrument) => {
    console.log('Instrument clicked:', asset);
    // show();
    setInstrument(asset);
    setOpenSheet(true);
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
        data={data}
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
