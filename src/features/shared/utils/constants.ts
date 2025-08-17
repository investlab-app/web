export const THIS_URL = import.meta.env.VITE_THIS_URL;

export const IS_PROD = import.meta.env.PROD;

export const CLERK_PUBLIC_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLIC_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

export const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
if (!POSTHOG_KEY) {
  throw new Error('VITE_PUBLIC_POSTHOG_KEY is not defined');
}

export const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
if (!POSTHOG_HOST) {
  throw new Error('VITE_PUBLIC_POSTHOG_HOST is not defined');
}
