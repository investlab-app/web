import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/assistant')({
  loader: ({ context: { i18n } }) => {
    return {
      crumb: i18n.t('common.assistant'),
    };
  },
});
