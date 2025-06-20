import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { Instrument } from '@/features/instruments/types/instruments.types';
import { SidebarInset, SidebarProvider } from '@/features/shared/components/ui/sidebar';
import { AppSidebar } from '@/features/shared/components/app-sidebar';
import { SiteHeader } from '@/features/shared/components/site-header';
import InstrumentsTableContainer from '@/features/instruments/components/instruments-table-container';
import InstrumentDetails from '@/features/instruments/components/instrument-details';
import { Sheet, SheetContent } from '@/features/shared/components/ui/sheet';

export default function InstrumentsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [instrument, setInstrument] = useState<Instrument>();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/' });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className=" w-full sm:max-w-2/3">
            {instrument ? <InstrumentDetails instrument={instrument} /> : null}
          </SheetContent>

          <SiteHeader />
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
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createFileRoute('/instruments/')({
  component: InstrumentsPage,
});
