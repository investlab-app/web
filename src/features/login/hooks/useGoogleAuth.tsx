import { useSignIn } from '@clerk/clerk-react';
import { ResultAsync } from 'neverthrow';
import { useAuthForm } from './useAuthForm';
import type { ClerkError } from '../clerk-error';

export const useGoogleAuth = () => {
  const { isLoaded, signIn } = useSignIn();

  const form = useAuthForm({
    onSubmit: async ({ formApi }) => {
      if (!isLoaded) {
        return formApi.setErrorMap({
          onSubmit: {
            ...formApi.getAllErrors(),
            form: 'Please try again later.',
          },
        });
      }

      const result = await ResultAsync.fromPromise(
        signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrlComplete: '/sso-callback',
          redirectUrl: '/sso-fail-callback',
        }),
        (err): ClerkError => ({
          type: 'clerk',
          error:
            err instanceof Error ? err : new Error('Could not verify email.'),
        })
      );

      result.mapErr((err) =>
        formApi.setErrorMap({
          onSubmit: {
            ...formApi.getAllErrors(),
            form: err.error.message,
          },
        })
      );

    },
  });

  return { form };
};
