import { createFileRoute } from '@tanstack/react-router';
import {
  graphLangListOptions,
  instrumentsTickersRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_authed/strategies')({
  loader: ({ context: { i18n, queryClient } }) => {
    try {
      Promise.all([
        queryClient.ensureQueryData(instrumentsTickersRetrieveOptions()),
        queryClient.ensureQueryData(graphLangListOptions()),
      ]);
    } catch {}
    return {
      crumb: i18n.t('common.strategies'),
    };
  },
});
