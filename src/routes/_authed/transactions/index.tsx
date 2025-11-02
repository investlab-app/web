import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, CircleDot } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
import { Button } from '@/features/shared/components/ui/button';
import { Minimize2, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import AppFrame from '@/features/shared/components/app-frame';
import { Positions } from '@/features/transactions/components/positions';

export const Route = createFileRoute('/_authed/transactions/')({
  component: RouteComponent,
});

function RouteComponent() {
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
          <Positions type="open" />
        </TabsContent>
        <TabsContent value="closed">
          <Positions type="closed" />
        </TabsContent>
      </Tabs>
    </AppFrame>
  );
}
