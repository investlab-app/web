import { createFileRoute } from '@tanstack/react-router';
import { instrumentsTickersRetrieveOptions } from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_authed/strategies')({
  loader: ({ context: { i18n, queryClient } }) => {
    try {
      queryClient.ensureQueryData(instrumentsTickersRetrieveOptions());
    } catch {}
    return {
      crumb: i18n.t('common.strategies'),
    };
  },
});
