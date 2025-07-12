import { Outlet, createRootRoute } from '@tanstack/react-router';
import { UserEnhancedPostHogProvider } from '@/features/shared/providers/user-enhanced-posthog-provider';

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
if (!POSTHOG_KEY) {
  throw new Error('VITE_PUBLIC_POSTHOG_KEY is not defined');
}

const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
if (!POSTHOG_HOST) {
  throw new Error('VITE_PUBLIC_POSTHOG_HOST is not defined');
}

export const Route = createRootRoute({
  component: () => (
    <>
      <UserEnhancedPostHogProvider phKey={POSTHOG_KEY} phHost={POSTHOG_HOST}>
        <Outlet />
      </UserEnhancedPostHogProvider>
    </>
  ),
});
