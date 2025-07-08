import { useSignUp } from '@clerk/clerk-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ResultAsync, err, ok } from 'neverthrow';
import { match, type } from 'arktype';
import { useAppForm } from '../hooks/use-auth-form';
import { BackButton } from './back-button';
import { ErrorAlert, arkErrorsArrayToStringSet } from './error-alert';
import { ContinueWithGoogle } from '@/features/auth/components/continue-with-google';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Divider } from '@/features/shared/components/ui/divider';

interface SignUpFormProps {
  pageError?: string;
}

export function SignUpForm({ pageError }: SignUpFormProps) {
  const { isLoaded, signUp } = useSignUp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    validators: {
      onBlur: ({ value }) =>
        value.password !== value.confirmPassword
          ? 'Passwords do not match'
          : undefined,
      onSubmitAsync: async ({ value }) => {
        if (!isLoaded) {
          return 'Please try again later.';
        }

        const signUpResult = await ResultAsync.fromPromise(
          signUp.create({
            emailAddress: value.email,
            password: value.password,
            firstName: value.firstName,
            lastName: value.lastName,
          }),
          (e) =>
            e instanceof Error
              ? e.message
              : 'Could not sign up. Please try again later.'
        ).andThen(
          match.at('status').match({
            "'complete'": () => ok(),
            "'abandoned'": () => err(t('auth.abandoned')),
            "'missing_requirements'": () => ok(), // email verification is required
            null: () => err(t('auth.could_not_sign_up')),
            default: 'never',
          })
        );

        if (signUpResult.isErr()) {
          return signUpResult.error;
        }

        const prepareEmailAddressVerificationResult =
          await ResultAsync.fromPromise(
            signUp.prepareEmailAddressVerification({ strategy: 'email_code' }),
            (e) =>
              e instanceof Error
                ? e.message
                : 'Could not prepare email address verification.'
          ).andThen(
            match.at('status').match({
              "'complete'": () => ok(),
              "'abandoned'": () => err(t('auth.abandoned')),
              "'missing_requirements'": () => ok(), // email verification is required
              null: () =>
                err(t('auth.could_not_prepare_email_address_verification')),
              default: 'never',
            })
          );

        if (prepareEmailAddressVerificationResult.isErr()) {
          return prepareEmailAddressVerificationResult.error;
        }

        navigate({ to: '/verify-email' });
      },
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <CardTitle>{t('auth.create_your_account')}</CardTitle>
        <CardDescription>{t('auth.signup_form_desc')}</CardDescription>
      </CardHeader>
      <form.Subscribe
        selector={(state) => state.errors}
        children={(errors) => (
          <ErrorAlert
            errors={
              new Set(
                [pageError, ...errors].filter((e): e is string => e != null)
              )
            }
          />
        )}
      />
      <CardContent className="flex flex-col gap-2">
        <ContinueWithGoogle />
        <Divider
          text={t('auth.or_continue')}
          backgroundClass="bg-card"
          className="mt-1"
        />
        <form className="flex flex-col gap-4">
          <form.AppField
            name="firstName"
            validators={{
              onChange: type('string').pipe(() => undefined),
            }}
            children={(field) => (
              <>
                <field.FormInput
                  id="firstName"
                  label={t('auth.first_name')}
                  name="firstName"
                  placeholder={t('auth.first_name_placeholder')}
                  autoComplete="given-name"
                  required
                />
                <ErrorAlert
                  title="First Name"
                  errors={arkErrorsArrayToStringSet(field.state.meta.errors)}
                />
              </>
            )}
          />
          <form.AppField
            name="lastName"
            validators={{
              onBlur: type('string > 0').pipe(() => undefined),
            }}
            children={(field) => (
              <>
                <field.FormInput
                  id="lastName"
                  label={t('auth.last_name')}
                  name="lastName"
                  placeholder={t('auth.last_name_placeholder')}
                  autoComplete="family-name"
                  required
                />
                <ErrorAlert
                  title="Last Name"
                  errors={arkErrorsArrayToStringSet(field.state.meta.errors)}
                />
              </>
            )}
          />
          <form.AppField
            name="email"
            validators={{
              onBlur: type('string.email').pipe(() => undefined),
            }}
            children={(field) => (
              <>
                <field.FormInput
                  id="email"
                  label="Email"
                  type="email"
                  name="email"
                  placeholder={t('auth.email_placeholder')}
                  autoComplete="email"
                  required
                />
                <ErrorAlert
                  title="Email"
                  errors={arkErrorsArrayToStringSet(field.state.meta.errors)}
                />
              </>
            )}
          />
          <form.AppField
            name="password"
            validators={{
              onBlur: type('string').pipe(() => undefined), // TODO: Add password validation
            }}
            children={(field) => (
              <>
                <field.FormInput
                  id="password"
                  label={t('auth.password')}
                  type="password"
                  name="password"
                  placeholder={t('auth.password_placeholder')}
                  autoComplete="new-password"
                  required
                />
                <ErrorAlert
                  title="Password"
                  errors={arkErrorsArrayToStringSet(field.state.meta.errors)}
                />
              </>
            )}
          />
          <form.AppField
            name="confirmPassword"
            children={(field) => (
              <>
                <field.FormInput
                  id="confirmPassword"
                  label={t('auth.confirm_password')}
                  type="password"
                  name="confirmPassword"
                  placeholder={t('auth.password_placeholder')}
                  autoComplete="new-password"
                  required
                />
              </>
            )}
          />
          <div>
            <div id="clerk-captcha" />
            <form.AppForm>
              <form.SubmitButton className="w-full">
                {' '}
                {t('auth.signup')}{' '}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
        <BackButton variant="ghost" />
        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          {t('auth.already_have_an_account')}{' '}
          <Link
            to={'/login'}
            className="underline underline-offset-4 hover:text-primary"
          >
            {t('auth.login')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
