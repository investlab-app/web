import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/instruments')({
  loader: ({ context: { i18n } }) => ({
    crumb: i18n.t('common.stocks'),
  }),
});
