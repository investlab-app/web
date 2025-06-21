import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { ClerkError } from '@/features/login/clerk-error';
import { AuthFormContainer } from '@/features/login/components/auth-form-container';
import { AuthFormHeader } from '@/features/login/components/auth-form-header';
import { FormInput } from '@/features/shared/components/ui/form-input';
import { Divider } from '@/features/shared/components/ui/divider';
import { AuthFormFooter } from '@/features/login/components/auth-form-footer';
import { Button } from '@/features/shared/components/ui/button';
import { PasswordInput } from '@/features/shared/components/ui/password-input';
import { THIS_URL } from '@/features/shared/constants';

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
      } else if (result.status === 'needs_first_factor') {
        setLoading(false);
        setError(
          'First factor authentication required. Please check your email or phone for verification.'
        );
      } else if (result.status === 'needs_second_factor') {
        setLoading(false);
        setError(
          'Two-factor authentication required. Please enter your verification code.'
        );
      } else if (result.status === 'needs_identifier') {
        setLoading(false);
        setError(
          'Additional identification required. Please provide the requested information.'
        );
      } else {
        setLoading(false);
        setError(
          'Additional verification required. Please follow the instructions to complete sign-in.'
        );
      }
    } catch (err: unknown) {
      setLoading(false);
      console.error('Sign-in error:', (err as ClerkError).errors);
      setError(
        (err as ClerkError).errors[0]?.message || 'Something went wrong.'
      );
    }
  };

  const handleGoogleAuth = async () => {
    if (!isLoaded) return;

    setGoogleLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrlComplete: `${THIS_URL}/sso-callback`,
        redirectUrl: `${THIS_URL}/sso-fail-callback`,
      });
    } catch (err) {
      setGoogleLoading(false);
      console.error('Google auth error:', err);
    }
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
      {(loading || googleLoading) && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      {/* Google OAuth Button */}
      <Button
        size="sm"
        variant="outline"
        type="button"
        onClick={handleGoogleAuth}
        disabled={loading || googleLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2"
      >
        {googleLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current" />
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('auth.login_w_google')}
          </>
        )}
      </Button>

      <div className="py-4">
        <Divider text={t('auth.or_continue')} backgroundClass="bg-card" />
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          id="email"
          label="Email"
          type="email"
          name="email"
          placeholder="name@example.com"
          required
        />

        <PasswordInput
          id="password"
          name="password"
          label={t('auth.password')}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button
          autoFocus
          type="submit"
          className="w-full"
          disabled={loading || googleLoading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current" />
          ) : (
            t('auth.login')
          )}
        </Button>
      </form>

      <div className="text-sm text-muted-foreground text-center mt-2">
        <AuthFormFooter type="login" onBack={() => navigate({ to: '/' })} />
      </div>
    </AuthFormContainer>
  );
}
