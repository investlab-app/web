import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { useInstrumentsTable } from '../hooks/use-instruments-table';
import { InstrumentTable } from './instruments-table';
import type { Instrument } from '../types/instrument';
import type { SortingState } from '@tanstack/react-table';
import { Button } from '@/features/shared/components/ui/button';
import SearchInput from '@/features/shared/components/ui/search-input';
import { ScrollableHorizontally } from '@/features/shared/components/scrollable-horizontally';

type InstrumentsTableContainerProps = {
  setInstrument: (instrument: Instrument) => void;
  setOpenSheet: (open: boolean) => void;
};

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGES = 7;

export const InstrumentsTableContainer = ({
  setInstrument,
  setOpenSheet,
}: InstrumentsTableContainerProps) => {
  const { t } = useTranslation();

  const [ordering, setOrdering] = useState<SortingState>([
    { id: 'symbol', desc: false },
  ]);
  const [showWatchedOnly, setShowWatchedOnly] = useState(false);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    isPending,
    hasNextPage,
    fetchNextPage,
    search,
    setSearch,
    pageSize,
    pagesCount,
  } = useInstrumentsTable({
    ordering,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const handleInstrumentPressed = (asset: Instrument) => {
    setInstrument(asset);
    setOpenSheet(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
        placeholder={t('common.search')}
      />

      <div className="flex items-center gap-2">
        <Button
          onClick={() => setShowWatchedOnly(!showWatchedOnly)}
          variant={showWatchedOnly ? 'default' : 'secondary'}
          size="sm"
          className="flex items-center gap-2"
        >
          <Star
            className="size-4"
            fill={showWatchedOnly ? 'currentColor' : 'none'}
          />
          <span>{t('common.watched')}</span>
        </Button>
      </div>

      <ScrollableHorizontally>
        <InstrumentTable
          data={showWatchedOnly ? data.filter((i) => i.is_watched) : data}
          onInstrumentPressed={handleInstrumentPressed}
          rowCount={pageSize}
          sorting={ordering}
          onSortingChange={setOrdering}
          isPending={isPending}
          isFetching={isFetching}
        />
      </ScrollableHorizontally>
      <div className="flex justify-center mt-4">
        {hasNextPage && pagesCount < MAX_PAGES && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant={'outline'}
          >
            {isFetchingNextPage ? t('common.loading') : t('common.more')}
          </Button>
        )}
      </div>
    </div>
  );
};
