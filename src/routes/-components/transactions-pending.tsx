import { useTranslation } from 'react-i18next';
import { CheckCircle2, CircleDot } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
import AppFrame from '@/features/shared/components/app-frame';
import { PositionSummaryWithTableSkeleton } from '@/features/transactions/components/position-summary-with-table';

export const TransactionsPending = () => {
  const { t } = useTranslation();

  return (
    <AppFrame>
      <Tabs defaultValue="open">
        <TabsList className="mb-2">
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
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <PositionSummaryWithTableSkeleton key={`open-skeleton-${index}`} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="closed">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <PositionSummaryWithTableSkeleton key={`closed-skeleton-${index}`} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppFrame>
  );
};