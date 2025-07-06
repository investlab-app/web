import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { ResultAsync } from 'neverthrow';
import { AuthForm } from '../components/auth-form';
import { useAppForm } from './useAppForm';
import type { ClerkError } from '../clerk-error';

const LogIn = () => {
  const { isLoaded, signIn } = useSignIn();

  const authenticateWithRedirect = () => {
    if (!isLoaded) {
      throw new Error('Please try again later.');
    }

    return signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrlComplete: '/sso-callback',
      redirectUrl: '/login', // todo: add failure info in query params
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
      redirectUrlComplete: '/sso-callback',
      redirectUrl: '/signup', // todo: add failure info in query params
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

export const Google = {
  LogIn,
  SignUp,
};
