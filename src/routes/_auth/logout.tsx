import { createFileRoute } from '@tanstack/react-router';
import { router } from '@/main';
import { clearCookies } from '@/features/shared/utils/cookies';

export const Route = createFileRoute('/_auth/logout')({
  component: RouteComponent,
  beforeLoad: async () => {
    clearCookies();
    localStorage.clear();
    sessionStorage.clear();
    await router.navigate({ to: '/' });
  },
});

function RouteComponent() {}
