import { createFileRoute } from '@tanstack/react-router';
import { TransactionsPending } from '@/routes/-components/transactions-pending';
import { statisticsTransactionsHistoryListOptions } from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_authed/transactions')({
  loader: async ({ context: { i18n, queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(
        statisticsTransactionsHistoryListOptions({ query: { type: 'open' } })
      ),
      queryClient.ensureQueryData(
        statisticsTransactionsHistoryListOptions({ query: { type: 'closed' } })
      ),
    ]);

    return {
      crumb: i18n.t('common.transactions'),
    };
  },
  pendingComponent: TransactionsPending,
});
