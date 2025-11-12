import { createFileRoute } from '@tanstack/react-router';
import { StatisticsPending } from '@/routes/-components/statistics-pending';
import {
  statisticsStatisticsMostTradedListOptions,
  statisticsStatisticsTradingOverviewRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_authed/statistics')({
  loader: async ({ context: { i18n, queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(
        statisticsStatisticsTradingOverviewRetrieveOptions()
      ),
      queryClient.ensureQueryData(statisticsStatisticsMostTradedListOptions()),
    ]);

    return {
      crumb: i18n.t('common.statistics'),
    };
  },
  pendingComponent: StatisticsPending,
});
