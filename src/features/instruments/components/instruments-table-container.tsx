import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInstrumentsTable } from '../hooks/use-instruments-table';
import { InstrumentTable } from './instruments-table';
import type { Instrument } from '../types/instrument';
import type { SortingState } from '@tanstack/react-table';
import { Button } from '@/features/shared/components/ui/button';
import SearchInput from '@/features/shared/components/ui/search-input';
import { Badge } from '@/features/shared/components/ui/badge';
import { ScrollableHorizontally } from '@/features/shared/components/scrollable-horizontally';
import { X } from 'lucide-react';

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

  const {
    data,
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

  const getSortLabel = () => {
    if (!ordering || ordering.length === 0) return null;
    const sortField = ordering[0].id;
    const sortDirection = ordering[0].desc ? 'desc' : 'asc';
    return `${sortField} (${sortDirection})`;
  };

  const hasActiveFilters = search || (ordering && ordering.length > 0);
  const sortLabel = getSortLabel();

  return (
    <div className="flex flex-col gap-2">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
        placeholder={t('common.search')}
      />

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="gap-2">
              <span>
                {t('common.search')}: {search}
              </span>
              <button
                onClick={() => setSearch('')}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {sortLabel && (
            <Badge variant="secondary" className="gap-2">
              <span>
                {t('common.sorting')}: {sortLabel}
              </span>
              <button
                onClick={() => setOrdering([{ id: 'symbol', desc: false }])}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      <ScrollableHorizontally>
        <InstrumentTable
          data={data}
          onInstrumentPressed={handleInstrumentPressed}
          rowCount={pageSize}
          sorting={ordering}
          onSortingChange={setOrdering}
          isPending={isPending}
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
