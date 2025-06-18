import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { type } from 'arktype';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import InstrumentsTableContainer from '@/features/instruments/components/instruments-table-container';
import InstrumentDetails from '@/features/instruments/components/instrument-details';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export const Instrument = type({
  name: 'string',
  volume: 'number',
  currentPrice: 'number',
  dayChange: 'number',
  symbol: 'string',
});


export default function InstrumentsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [instrument, setInstrument] = useState<typeof Instrument.infer>();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/' });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || !isSignedIn) return null;

  console.log("INSTRUMENTS PAGE");

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

export const Route = createFileRoute('/instruments-page')({
  component: InstrumentsPage,
});
