import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { ClerkError } from '@/features/login/clerk-error';
import { PasswordInput } from '@/features/shared/components/ui/password-input';
import { SocialAuthButton } from '@/features/login/components/social-auth-button';
import { Divider } from '@/features/shared/components/ui/divider';
import { AuthForm } from '@/features/login/components/auth-form';
import { FormInput } from '@/features/shared/components/ui/form-input';
import { Button } from '@/features/shared/components/ui/button';

export function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    setError(null);
    if (password !== confirmPassword) {
      setError(t('auth.passwords_dont_match'));
      return;
    }

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setLoading(false);
      navigate({ to: '/verify-email' });
    } catch (err: unknown) {
      setLoading(false);
      setError(
        (err as ClerkError).errors[0]?.message || 'Something went wrong.'
      );
      console.error('Sign-up error:', err);
    }
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    try {
      signUp?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrlComplete: '/sso-callback',
        redirectUrl: '/sso-fail-callback',
      });
    } catch (err) {
      setLoading(false);
      console.error('Google OAuth error:', err);
      setError('Google sign-up failed. Please try again.');
    }
  };

  return (
    <AuthForm>
      <AuthForm.Header
        title={t('auth.create_your_account')}
        description={t('auth.signup_form_desc')}
      />
      <AuthForm.Content>
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <SocialAuthButton provider="google" onClick={handleGoogleAuth}>
            {t('auth.signup_w_google')}
          </SocialAuthButton>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <Divider text={t('auth.or_continue')} />

          <div className="grid gap-4">
            <FormInput
              id="firstName"
              label={t('auth.first_name')}
              name="firstName"
              required
            />
            <FormInput
              id="lastName"
              label={t('auth.last_name')}
              name="lastName"
              required
            />
            <FormInput
              id="email"
              label="Email"
              type="email"
              name="email"
              required
            />
            <PasswordInput
              id="password"
              name="password"
              label={t('auth.password')}
              required
            />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label={t('auth.confirm_password')}
              required
            />

            <div id="clerk-captcha" className="flex justify-center" />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button autoFocus type="submit" className="w-full">
              {t('auth.signup')}
            </Button>
          </div>
        </form>
        <AuthForm.Footer type="signup" onBack={() => navigate({ to: '/' })} />
      </AuthForm.Content>
    </AuthForm>
  );
}
