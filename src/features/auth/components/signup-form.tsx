import { useSignUp } from '@clerk/clerk-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ResultAsync, err, ok } from 'neverthrow';
import { z } from 'zod';
import { ErrorAlert } from './error-alert';
import { useAppForm } from '@/features/shared/hooks/use-app-form';
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
    onSubmit: async ({ value }) => {
      if (!isLoaded) {
        navigate({
          to: '.',
          replace: true,
          search: { error: t('auth.please_try_again_later') },
        });
        return;
      }

      const signUpResult = await ResultAsync.fromPromise(
        signUp.create({
          emailAddress: value.email,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
        }),
        (e) => (e instanceof Error ? e.message : t('auth.could_not_sign_up'))
      ).andThen((result) => {
        switch (result.status) {
          case 'complete':
            return ok();
          case 'abandoned':
            return err(t('auth.abandoned'));
          case 'missing_requirements':
            return ok(); // email verification is required
          case null:
            return err(t('auth.could_not_sign_up'));
          default:
            throw new Error('Unexpected status');
        }
      });

      if (signUpResult.isErr()) {
        navigate({
          to: '.',
          replace: true,
          search: { error: signUpResult.error },
        });
        return;
      }

      const prepareEmailAddressVerificationResult =
        await ResultAsync.fromPromise(
          signUp.prepareEmailAddressVerification({ strategy: 'email_code' }),
          (e) =>
            e instanceof Error
              ? e.message
              : t('auth.could_not_prepare_email_address_verification')
        ).andThen((result) => {
          switch (result.status) {
            case 'complete':
              return ok();
            case 'abandoned':
              return err(t('auth.abandoned'));
            case 'missing_requirements':
              return ok(); // email verification is required
            case null:
              return err(
                t('auth.could_not_prepare_email_address_verification')
              );
            default:
              throw new Error('Unexpected status');
          }
        });

      if (prepareEmailAddressVerificationResult.isErr()) {
        navigate({
          to: '.',
          replace: true,
          search: { error: prepareEmailAddressVerificationResult.error },
        });
        return;
      }

      navigate({ to: '/verify-email' });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <CardTitle>{t('auth.create_your_account')}</CardTitle>
        <CardDescription>{t('auth.signup_form_desc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ErrorAlert errors={pageError ? [pageError] : []} />
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
              onBlur: z.string().min(1, t('auth.first_name_required')),
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
                  title={t('auth.first_name')}
                  errors={field.state.meta.errors
                    .filter((e) => e != undefined)
                    .map((e) => e.message)}
                />
              </>
            )}
          />
          <form.AppField
            name="lastName"
            validators={{
              onBlur: z.string().min(1, t('auth.last_name_required')),
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
                  title={t('auth.last_name')}
                  errors={field.state.meta.errors
                    .filter((e) => e != undefined)
                    .map((e) => e.message)}
                />
              </>
            )}
          />
          <form.AppField
            name="email"
            validators={{
              onBlur: z.email(t('auth.invalid_email')),
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
                  errors={field.state.meta.errors
                    .filter((e) => e != undefined)
                    .map((e) => e.message)}
                />
              </>
            )}
          />
          <form.AppField
            name="password"
            validators={{
              onBlur: ({ value }) => {
                if (!value) {
                  return t('auth.password_required');
                }
                if (value.length < 8) {
                  return t('auth.password_min_length', { min: 8 });
                }
              },
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
                  title={t('auth.password')}
                  errors={field.state.meta.errors.filter((e) => e != undefined)}
                />
              </>
            )}
          />
          <form.AppField
            name="confirmPassword"
            validators={{
              onBlur: ({ value, fieldApi }) => {
                if (!value) {
                  return t('auth.password_required');
                }
                if (value !== fieldApi.form.state.values.password) {
                  return t('auth.passwords_do_not_match');
                }
              },
            }}
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
                <ErrorAlert
                  errors={field.state.meta.errors.filter((e) => e != undefined)}
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
