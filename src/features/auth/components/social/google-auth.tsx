import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { ResultAsync, err } from 'neverthrow';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SocialAuthButton } from '@/features/auth/components/social/social-auth-button';

interface GoogleButtonProps {
  onClick: () => void;
  type: 'login' | 'signup';
}

const GoogleButton = ({ onClick, type }: GoogleButtonProps) => {
  const { t } = useTranslation();
  return (
    <SocialAuthButton provider="google" onClick={onClick}>
      {type === 'signup' && t('auth.signup_w_google')}
      {type === 'login' && t('auth.login_w_google')}
    </SocialAuthButton>
  );
};

const LogIn = () => {
  const { isLoaded, signIn } = useSignIn();
  const navigate = useNavigate();

  const authenticateWithRedirect = async () => {
    if (!isLoaded) {
      return err('Please try again later.');
    }

    return await ResultAsync.fromPromise(
      signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrlComplete: '/',
        continueSignUp: true,
        redirectUrl: `/login?${new URLSearchParams({
          error: 'Could not verify email. Make sure you have signed up first.',
        })}`,
      }),
      (e) => (e instanceof Error ? e.message : 'Could not verify email.')
    );
  };

  const handleLogIn = async () => {
    const authResult = await authenticateWithRedirect();
    if (authResult.isErr()) {
      navigate({
        to: '/login',
        params: {
          error: authResult.error,
        },
      });
    }
  };

  return <GoogleButton onClick={handleLogIn} type="login" />;
};

const SignUp = () => {
  const { isLoaded, signUp } = useSignUp();
  const navigate = useNavigate();

  const authenticateWithRedirect = async () => {
    if (!isLoaded) {
      return err('Please try again later.');
    }

    return await ResultAsync.fromPromise(
      signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrlComplete: '/',
        redirectUrl: `/signup?${new URLSearchParams({
          error:
            'Could not authenticate with Google. You might already have an account. Please try logging in instead.',
        })}`,
      }),
      (e) => (e instanceof Error ? e.message : 'Could not verify email.')
    );
  };

  const handleSignUp = async () => {
    const authResult = await authenticateWithRedirect();
    if (authResult.isErr()) {
      navigate({
        to: '/signup',
        params: {
          error: authResult.error,
        },
      });
    }
  };

  return <GoogleButton onClick={handleSignUp} type="signup" />;
};

export const GoogleAuth = {
  LogIn,
  SignUp,
};
