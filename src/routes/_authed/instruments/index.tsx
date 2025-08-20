import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Instrument } from '@/features/instruments/types/types';
import InstrumentsTableContainer from '@/features/instruments/components/instruments-table-container';
import InstrumentDetails from '@/features/instruments/components/instrument-details';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/features/shared/components/ui/sheet';
import AppFrame from '@/features/shared/components/app-frame';

export const Route = createFileRoute('/_authed/instruments/')({
  component: Instruments,
});

function Instruments() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [instrument, setInstrument] = useState<Instrument>();

  return (
    <AppFrame>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2/3">
          {instrument ? (
            <>
              <SheetHeader>
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

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <InstrumentsTableContainer
                setOpenSheet={setOpen}
                setInstrument={setInstrument}
              />
            </div>
          </div>
        </div>
      </Sheet>
    </AppFrame>
  );
}
