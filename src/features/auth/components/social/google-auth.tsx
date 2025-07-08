import { useSignIn } from '@clerk/clerk-react';
import { ResultAsync, err } from 'neverthrow';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SocialAuthButton } from '@/features/auth/components/social/social-auth-button';

export const ContinueWithGoogle = () => {
  const { isLoaded, signIn } = useSignIn();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const authenticateWithRedirect = async () => {
    if (!isLoaded) {
      return err('Please try again later.');
    }

    return await ResultAsync.fromPromise(
      signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrlComplete: '/',
        redirectUrl: '/sso-callback',
      }),
      (e) => (e instanceof Error ? e.message : 'Could not verify email.')
    );
  };

  const handleContinueWithGoogle = async () => {
    const authResult = await authenticateWithRedirect();
    console.log('authResult', authResult);
    if (authResult.isErr()) {
      navigate({
        to: '/signup',
        params: {
          error: authResult.error,
        },
      });
    }
  };

  return (
    <SocialAuthButton provider="google" onClick={handleContinueWithGoogle}>
      {t('auth.continue_with_google')}
    </SocialAuthButton>
  );
};
