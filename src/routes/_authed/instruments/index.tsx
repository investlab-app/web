import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Instrument } from '@/features/instruments/types/types';
import { Button } from '@/features/shared/components/ui/button';
import InstrumentDetails from '@/features/instruments/components/instrument-details';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/features/shared/components/ui/sheet';
import AppFrame from '@/features/shared/components/app-frame';
import InstrumentTable from '@/features/instruments/components/instruments-table';
import SearchInput from '@/features/shared/components/ui/search-input';
import { useDebounce } from '@/features/instruments/hooks/use-debounce';
import { useInstruments } from '@/features/instruments/hooks/use-instruments';
// import useLiveInstruments from '@/features/instruments/hooks/use-live-instruments';

export const Route = createFileRoute('/_authed/instruments/')({
  component: Instruments,
});

const PAGE_SIZE = 10;

function Instruments() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [instrument, setInstrument] = useState<Instrument>();

  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 500);

  const [page, setPage] = useState(1);

  const { data, isMore, isPending, isFetching, isError } = useInstruments({
    page,
    pageSize: PAGE_SIZE,
    query: debouncedQuery,
  });

  // const updates = useLiveInstruments();

  function handleInstrumentPressed(asset: Instrument) {
    setInstrument(asset);
    setOpen(true);
  }

  return (
    <AppFrame>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2/3">
          {instrument ? (
            <>
              <SheetHeader className="backdrop-blur">
                <SheetTitle>
                  {instrument.name} - {t('instruments.overview')}
                </SheetTitle>
                <SheetDescription>{t('instruments.overview')}</SheetDescription>
              </SheetHeader>

              <div className="p-4 space-y-4 overflow-y-auto">
                <InstrumentDetails instrument={instrument} />
              </div>
            </>
          ) : null}
        </SheetContent>

        <div className="flex flex-col gap-4">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-24"
            placeholder={t('common.search')}
          />

          <div className="-mx-(--page-padding) overflow-x-auto flex">
            <div className="grow px-(--page-padding)">
              {isPending ? (
                <InstrumentTable.Skeleton rowCount={PAGE_SIZE} />
              ) : isError ? (
                <div>Error loading instruments</div>
              ) : (
                <InstrumentTable
                  data={data}
                  onInstrumentPressed={handleInstrumentPressed}
                />
              )}
            </div>
          </div>

          {isMore && (
            <div className="mx-auto">
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isFetching}
                className={'disabled:opacity-100 disabled:animate-pulse'}
              >
                {isFetching ? t('common.loading') : t('common.more')}
              </Button>
            </div>
          )}
        </div>
      </Sheet>
    </AppFrame>
  );
}
