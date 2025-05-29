import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { PasswordInput } from '@/components/ui/password-input';
import { SocialAuthButton } from '@/features/login/components/social-auth-button';
import { Divider } from '@/components/ui/divider';
import { AuthFormContainer } from '@/features/login/components/auth-form-container';
import { AuthFormHeader } from '@/features/login/components/auth-form-header';
import { FormInput } from '@/components/ui/form-input';
import { AuthFormFooter } from '@/features/login/components/auth-form-footer';
import { Button } from '@/components/ui/button';
import { THIS_URL } from '@/lib/constants';

export function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setError('Passwords do not match.');
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
      setError(err.errors?.[0]?.message || 'Something went wrong.');
      console.error('Sign-up error:', err);
    }
  };

  const handleGoogleAuth = () => {
    signUp?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrlComplete: `${THIS_URL}sso-callback`,
      redirectUrl: `${THIS_URL}sso-fail-callback`,
    });
  };

  return (
    <AuthFormContainer
      header={
        <AuthFormHeader
          title="Create your account"
          description="Sign up with email"
        />
      }
    >
      {loading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <SocialAuthButton provider="google" onClick={handleGoogleAuth}>
          Sign up with Google
        </SocialAuthButton>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <Divider text="Or continue with" />

        <div className="grid gap-4">
          <FormInput
            id="firstName"
            label="First Name"
            name="firstName"
            required
          />
          <FormInput id="lastName" label="Last Name" name="lastName" required />
          <FormInput
            id="email"
            label="Email"
            type="email"
            name="email"
            required
          />
          <PasswordInput id="password" name="password" required />
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button autoFocus type="submit" className="w-full">
            Sign Up
          </Button>

          <AuthFormFooter type="signup" onBack={() => navigate({ to: '/' })} />
        </div>
      </form>
    </AuthFormContainer>
  );
}
