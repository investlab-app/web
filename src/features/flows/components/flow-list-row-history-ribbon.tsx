import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { HistoryCard } from './history-card';
import type { GraphTransactionEffect } from '@/client';
import { graphLangResultsListOptions } from '@/client/@tanstack/react-query.gen';
import { ScrollableHorizontally } from '@/features/shared/components/scrollable-horizontally';

export function FlowListRowHistoryRibbon({ id }: { id: string }) {
  const { t } = useTranslation();

  const { data, isPending, isError } = useQuery({
    ...graphLangResultsListOptions({
      path: { id: id },
    }),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (isPending) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {t('common.error_loading_data')}
      </div>
    );
  }

  return (
    <div className="p-0 overflow-clip">
      {data.results.length === 0 ? (
        <div className="text-sm text-muted-foreground m-4">
          {t('flows.listview.no_history')}
        </div>
      ) : (
        <ScrollableHorizontally>
          <div className={`flex flex-row`}>
            {data.results
              .filter((r) => r.effect.effect_type == 'transaction')
              .map((result, index) => (
                <HistoryCard
                  timestamp={result.created_at}
                  instrument={
                    (result.effect as GraphTransactionEffect).instrument.ticker
                  }
                  success={result.success}
                  isBuy={(result.effect as GraphTransactionEffect).is_buy}
                  quantity={(result.effect as GraphTransactionEffect).amount}
                  key={id + index.toString()}
                />
              ))}
          </div>
        </ScrollableHorizontally>
      )}
    </div>
  );
}
