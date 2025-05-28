import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { PasswordInput } from './ui/password-input';
import { SocialAuthButton } from './ui/social-auth-button';
import { Divider } from './ui/divider';
import { AuthFormContainer } from '@/components/auth-form-container';
import { AuthFormHeader } from '@/components/auth-form-header';
import { FormInput } from '@/components/ui/form-input';
import { AuthFormFooter } from '@/components/auth-form-footer';
import { Button } from '@/components/ui/button';

export function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [code, setCode] = useState('');
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
      setError(null);
      setShowVerification(true);
    } catch (err: unknown) {
      setLoading(false);
      setError(err.errors?.[0]?.message || 'Something went wrong.');
      console.error('Sign-up error:', err);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate({ to: '/' });
      }
    } catch (err: unknown) {
      setError('Invalid or expired verification code.');
      setError(err.errors?.[0]?.message || 'Something went wrong.');
    }
  };

  const handleGoogleAuth = () => {
    signUp?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrlComplete: 'http://localhost:3000/sso-callback',
    });
  };

  if (showVerification) {
    return (
      <AuthFormContainer
        header={
          <AuthFormHeader
            title="Verify your email"
            description="Enter the code sent to your email"
          />
        }
      >
        <form onSubmit={handleCodeSubmit} className="grid gap-6">
          <FormInput
            id="code"
            label="Verification Code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Verify Email
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setError(null);
              setShowVerification(false);
            }}
            type="button"
          >
            Go Back
          </Button>
        </form>
      </AuthFormContainer>
    );
  }

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

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="flex flex-col gap-4">
          <SocialAuthButton provider="google" onClick={handleGoogleAuth}>
            Sign in with Google
          </SocialAuthButton>
        </div>

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

          <Button type="submit" className="w-full">
            Sign Up
          </Button>

          <AuthFormFooter type="signup" onBack={() => navigate({ to: '/' })} />
        </div>
      </form>
    </AuthFormContainer>
  );
}
