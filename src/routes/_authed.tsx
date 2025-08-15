import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.userId) {
      throw redirect({ to: '/' });
    }
  },
});
