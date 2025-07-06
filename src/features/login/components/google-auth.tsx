import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { ResultAsync } from 'neverthrow';
import type { ClerkError } from '@/features/login/utils/clerk-error';
import { AuthForm } from '@/features/login/components/auth-form';
import { useAppForm } from '@/features/shared/hooks/use-app-form';

const LogIn = () => {
  const { isLoaded, signIn } = useSignIn();

  const authenticateWithRedirect = () => {
    if (!isLoaded) {
      throw new Error('Please try again later.');
    }

    return signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrlComplete: '/',
      redirectUrl: `/login?${new URLSearchParams({
        error: 'Could not verify email. Make sure you have signed up first.',
      })}`,
    });
  };

  const googleForm = useAppForm({
    onSubmit: async ({ formApi }) => {
      const result = await ResultAsync.fromPromise(
        authenticateWithRedirect(),
        (error): ClerkError => ({
          type: 'clerk',
          error:
            error instanceof Error
              ? error
              : new Error('Could not verify email.'),
        })
      );

      result.mapErr((err) =>
        formApi.setErrorMap({
          onSubmit: {
            form: err.error.message,
            fields: {},
          },
        })
      );
    },
  });

  return (
    <AuthForm.GoogleButton onClick={googleForm.handleSubmit} type="login" />
  );
};

const SignUp = () => {
  const { isLoaded, signUp } = useSignUp();

  const authenticateWithRedirect = () => {
    if (!isLoaded) {
      throw new Error('Please try again later.');
    }

    return signUp.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrlComplete: '/',
      redirectUrl: `/signup?${new URLSearchParams({
        error:
          'Could not authenticate with Google. You might already have an account. Please try logging in instead.',
      })}`,
    });
  };

  const googleForm = useAppForm({
    onSubmit: async ({ formApi }) => {
      const result = await ResultAsync.fromPromise(
        authenticateWithRedirect(),
        (error): ClerkError => ({
          type: 'clerk',
          error:
            error instanceof Error
              ? error
              : new Error('Could not verify email.'),
        })
      );

      result.mapErr((err) =>
        formApi.setErrorMap({
          onSubmit: {
            form: err.error.message,
            fields: {},
          },
        })
      );
    },
  });

  return (
    <AuthForm.GoogleButton onClick={googleForm.handleSubmit} type="signup" />
  );
};

export const GoogleAuth = {
  LogIn,
  SignUp,
};
