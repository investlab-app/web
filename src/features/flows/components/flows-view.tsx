import { CheckCircle2, CircleDot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FlowsList } from './flows-list';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';

enum FlowType {
  Active = 'active',
  Closed = 'closed',
}

export function FlowsView() {
  const { t } = useTranslation();
  const strategies = [
    { id: '1', name: 'Strategy One' },
    { id: '2', name: 'Strategy Two' },
    { id: '3', name: 'Strategy Three' },
  ];
  return (
    <div>
      <h1>{t('flows.title')}</h1>
      <h3>{t('flows.description')}</h3>
      <Tabs defaultValue={FlowType.Active} className="mt-4">
        <TabsList>
          <TabsTrigger
            value={FlowType.Active}
            className="cursor-pointer text-xs"
          >
            <CircleDot className="opacity-80" />
            {t('transactions.tabs.open_positions')}
          </TabsTrigger>
          <TabsTrigger
            value={FlowType.Closed}
            className="cursor-pointer text-xs"
          >
            <CheckCircle2 className="opacity-80" />
            {t('transactions.tabs.closed_positions')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={FlowType.Active}>
          <FlowsList isActive strategies={strategies} />
        </TabsContent>
        <TabsContent value={FlowType.Closed}>
          <FlowsList strategies={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
