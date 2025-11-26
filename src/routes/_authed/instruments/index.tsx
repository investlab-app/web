import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import type { Instrument } from '@/features/instruments/types/instrument';
import { InstrumentsTableContainer } from '@/features/instruments/components/instruments-table-container';
import { Sheet, SheetContent } from '@/features/shared/components/ui/sheet';
import AppFrame from '@/features/shared/components/app-frame';
import { InstrumentSheetContent } from '@/features/instrument-details/components/instrument-sheet';
import { instrumentsWithPricesListInfiniteOptions } from '@/client/@tanstack/react-query.gen';
import { InstrumentsPending } from '@/routes/-components/instruments-pending';

export const Route = createFileRoute('/_authed/instruments/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    try {
      await queryClient.ensureInfiniteQueryData({
        ...instrumentsWithPricesListInfiniteOptions({
          query: { ordering: 'ticker', page_size: 10, search: '' },
        }),
        initialPageParam: 1,
        meta: { persist: false },
      });
    } catch {}
  },
  pendingComponent: InstrumentsPending,
});

function RouteComponent() {
  const [open, setOpen] = useState(false);
  const [instrument, setInstrument] = useState<Instrument>();

  return (
    <AppFrame>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2/3 gap-0 overflow-y-auto">
          {instrument && <InstrumentSheetContent instrument={instrument} />}
        </SheetContent>

        <InstrumentsTableContainer
          setOpenSheet={setOpen}
          setInstrument={setInstrument}
        />
      </Sheet>
    </AppFrame>
  );
}
