import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/transactions')({
  loader: ({ context: { i18n } }) => ({
    crumb: i18n.t('common.transactions'),
  }),
});
