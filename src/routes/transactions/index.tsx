import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, CircleDot } from 'lucide-react';
import { fetchTransactionsHistory } from '@/features/transactions/queries/fetch-transactions-history';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
import {
  SidebarInset,
  SidebarProvider,
} from '@/features/shared/components/ui/sidebar';
import { AppSidebar } from '@/features/shared/components/app-sidebar';
import { SiteHeader } from '@/features/shared/components/site-header';
import { Sheet, SheetContent } from '@/features/shared/components/ui/sheet';
import InstrumentDetails from '@/features/instruments/components/instrument-details';
import { fetchInstrumentInfo } from '@/features/instruments/queries/fetch-instrument-info';
import { PositionsTable } from '@/features/transactions/components/positions-table';

export const Route = createFileRoute('/transactions/')({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { t } = useTranslation();
  const { getToken } = useAuth();

  const [tab, setTab] = useState<'open' | 'closed'>('open');

  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token available');
      return fetchTransactionsHistory();
    },
  });

  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: instrument, isLoading: instrumentLoading } = useQuery({
    queryKey: ['instrument', selectedInstrument],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token available');
      if (!selectedInstrument) throw new Error('No instrument selected');
      return fetchInstrumentInfo({ symbol: selectedInstrument });
    },
    enabled: !!selectedInstrument,
  });

  const handleViewDetails = (instrumentSymbol: string) => {
    setSelectedInstrument(instrumentSymbol);
    setSheetOpen(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="w-full sm:max-w-2/3">
            {selectedInstrument && (
              <InstrumentDetails
                instrument={instrument}
                isLoading={instrumentLoading}
              />
            )}
          </SheetContent>
          <SiteHeader />
          <div className="p-4">
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as 'open' | 'closed')}
            >
              <TabsList>
                <TabsTrigger value="open" className="cursor-pointer text-xs">
                  <CircleDot className="opacity-80" />
                  {t('transactions.tabs.open_positions')}
                </TabsTrigger>
                <TabsTrigger value="closed" className="cursor-pointer text-xs">
                  <CheckCircle2 className="opacity-80" />
                  {t('transactions.tabs.closed_positions')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="open">
                <PositionsTable
                  positions={positions?.open || []}
                  loading={positionsLoading}
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
              <TabsContent value="closed">
                <PositionsTable
                  positions={positions?.closed || []}
                  loading={positionsLoading}
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
            </Tabs>
          </div>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  );
}
