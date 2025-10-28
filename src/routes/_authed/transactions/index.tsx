import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, CircleDot } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
import { PositionsTable } from '@/features/transactions/components/positions-table';
import AppFrame from '@/features/shared/components/app-frame';
import { ScrollableHorizontally } from '@/features/shared/components/scrollable-horizontally';

export const Route = createFileRoute('/_authed/transactions/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <AppFrame>
      <Tabs defaultValue="open">
        <TabsList className='mb-2'>
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
          <ScrollableHorizontally>
            <PositionsTable type="open" />
          </ScrollableHorizontally>
        </TabsContent>
        <TabsContent value="closed">
          <ScrollableHorizontally>
            <PositionsTable type="closed" />
          </ScrollableHorizontally>
        </TabsContent>
      </Tabs>
    </AppFrame>
  );
}
