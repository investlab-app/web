import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, CircleDot } from 'lucide-react';
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
import { PositionsTable } from '@/features/transactions/components/positions-table';

export const Route = createFileRoute('/transactions/')({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'open' | 'closed'>('open');

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
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
              <PositionsTable type="open" />
            </TabsContent>
            <TabsContent value="closed">
              <PositionsTable type="closed" />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
