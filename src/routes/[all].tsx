import { createFileRoute, redirect } from '@tanstack/react-router';

export default function NotFoundRedirect() {
  return null;
}

export const Route = createFileRoute('/[all]')({
    beforeLoad: () => {
      throw redirect({ to: '/' });
    },
    component: NotFoundRedirect,
  });