import { useAuth, useUser } from '@clerk/clerk-react';
import { useRouter } from '@tanstack/react-router';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

const PostHogUserIdentification = () => {
  const posthog = usePostHog();
  const { isSignedIn, userId, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user && userId) {
      posthog.identify(userId, {
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username,
        fullName: user.fullName,
      });
    } else if (posthog._isIdentified()) {
      posthog.reset();
    }
  }, [posthog, isSignedIn, user, userId, isLoaded]);

  return null;
};

const PostHogPageView = () => {
  const posthog = usePostHog();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', () => {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      });
    });

    return unsubscribe;
  }, [posthog, router]);

  return null;
};

interface UserEnhancedPostHogProviderProps {
  phKey: string;
  phHost: string;
  children: React.ReactNode;
}

export const UserEnhancedPostHogProvider = ({
  phKey,
  phHost,
  children,
}: UserEnhancedPostHogProviderProps) => (
  <PostHogProvider
    apiKey={phKey}
    options={{
      api_host: phHost,
      capture_pageview: false,
    }}
  >
    <PostHogUserIdentification />
    <PostHogPageView />
    {children}
  </PostHogProvider>
);
