import { CheckCircle2, CircleDot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { FlowsList } from './flows-list';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
import { graphLangListOptions } from '@/client/@tanstack/react-query.gen';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { Message } from '@/features/shared/components/error-message';

const FlowType = {
  Active: 'active',
  Closed:'closed',
} as const;

export function FlowsView() {
  const { t } = useTranslation();

  const {
    data: flowsData,
    isPending,
    isError,
  } = useQuery(graphLangListOptions());

  const activeStrategies =
    flowsData?.results
      .filter((r) => r.active)
      .map((flow) => ({
        id: flow.id,
        name: flow.name,
        repeat: flow.repeat,
      })) ?? [];
  const closedStrategies =
    flowsData?.results
      .filter((r) => !r.active)
      .map((flow) => ({
        id: flow.id,
        name: flow.name,
        repeat: flow.repeat,
      })) ?? [];

  if (isPending) {
    return (
      <div>
        <div className="text-2xl font-semibold mb-2">
          {t('flows.listview.title')}
        </div>
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="text-2xl font-semibold mb-2">
          {t('flows.listview.title')}
        </div>
        <Message message={t('common.error_loading_data')} />
      </div>
    );
  }

  return (
    <div>
      <div className="text-2xl font-semibold mb-2">
        {t('flows.listview.title')}
      </div>
      <div>{t('flows.listview.description1')}</div>
      <div className="mb-4">{t('flows.listview.description2')}</div>
      <Tabs defaultValue={FlowType.Active} className="mt-4">
        <TabsList>
          <TabsTrigger
            value={FlowType.Active}
            className="cursor-pointer text-xs"
          >
            <CircleDot className="opacity-80" />
            {t('flows.listview.active_strategies')}
          </TabsTrigger>
          <TabsTrigger
            value={FlowType.Closed}
            className="cursor-pointer text-xs"
          >
            <CheckCircle2 className="opacity-80" />
            {t('flows.listview.closed_strategies')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={FlowType.Active}>
          <FlowsList isActive strategies={activeStrategies} />
        </TabsContent>
        <TabsContent value={FlowType.Closed}>
          <FlowsList strategies={closedStrategies} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
