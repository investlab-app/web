import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import InstrumentsTableContainer from '@/features/instruments/components/instruments-table-container';
import InstrumentDetails from '@/features/instruments/components/instrument-details';

export default function InstrumentsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <InstrumentsTableContainer />
              <InstrumentDetails></InstrumentDetails>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createFileRoute('/instruments-page')({
  component: InstrumentsPage,
});

const {hide, show, isOpen} = useRightSidebar()


<RightSidebarProvider>

...

    <RightSidebar>
        ...
    </RightSidebar>


...

</RightSidebarProvider>



export function useRightSidebar() {
    const context = useContext(RightSidebarContext)

    const open = () => {}
    const close = () => {}
    const isOpen = true

    return {open, close, isOpen}
}



const RightSidebarContext = React.createContext(initialState)
export function RightSidebarProvider(children) {
    
    return (
        <RightSidebarContext>
            {children}
        </RightSidebarContext>
    )
}