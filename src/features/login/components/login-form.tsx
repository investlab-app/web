import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { ClerkError } from '@/lib/clerk-error';
import { AuthFormContainer } from '@/features/login/components/auth-form-container';
import { AuthFormHeader } from '@/features/login/components/auth-form-header';
import { FormInput } from '@/components/ui/form-input';
import { SocialAuthButton } from '@/features/login/components/social-auth-button';
import { Divider } from '@/components/ui/divider';
import { AuthFormFooter } from '@/features/login/components/auth-form-footer';
import { Button } from '@/components/ui/button';
import { THIS_URL } from '@/lib/constants';
import { PasswordInput } from '@/components/ui/password-input';

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setError(null);
    setLoading(true);

    try {
      const result = await signIn.create({
        strategy: 'password',
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setLoading(false);
        navigate({ to: '/' });
      }
    } catch (err: unknown) {
      setLoading(false);
      console.error('Sign-in error:', (err as ClerkError).errors);
      setError(
        (err as ClerkError).errors[0]?.message || 'Something went wrong.'
      );
    }
  };

  const handleGoogleAuth = () => {
    signIn?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrlComplete: `${THIS_URL}/sso-callback`,
      redirectUrl: `${THIS_URL}/sso-fail-callback`,
    });
  };

  return (
    <AuthFormContainer
      header={
        <AuthFormHeader
          title={t('auth.welcome_back')}
          description={t('auth.login_form_desc')}
        />
      }
    >
      {loading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      <SocialAuthButton provider="google" onClick={handleGoogleAuth}>
        {t('auth.login_w_google')}
      </SocialAuthButton>
      <div className="py-4">
        <Divider text={t('auth.or_continue')} backgroundClass="bg-card" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {' '}
        <FormInput
          id="email"
          label="Email"
          type="email"
          name="email"
          placeholder={t('auth.email_placeholder')}
          required
        />
        <PasswordInput
          id="password"
          name="password"
          label={t('auth.password')}
          placeholder={t('auth.password_placeholder')}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button autoFocus type="submit" className="w-full">
          {t('auth.login')}
        </Button>
      </form>
      <div className="text-sm text-muted-foreground text-center mt-2">
        <AuthFormFooter type="login" onBack={() => navigate({ to: '/' })} />
      </div>
    </AuthFormContainer>
  );
}
