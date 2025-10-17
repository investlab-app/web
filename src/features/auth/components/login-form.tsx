import { useSignIn } from '@clerk/clerk-react';
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

interface LoginFormProps {
  pageError?: string;
}

export function LoginForm({ pageError }: LoginFormProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
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

      await ResultAsync.fromPromise(
        signIn.create({
          strategy: 'password',
          identifier: value.email,
          password: value.password,
        }),
        (e) =>
          e instanceof Error
            ? t('auth.unknown_error', { cause: e.message })
            : t('auth.could_not_verify_email')
      )
        .andThen((signInResource) => {
          switch (signInResource.status) {
            case 'complete':
              return signInResource.createdSessionId
                ? ok(signInResource.createdSessionId)
                : err('No session created');
            case 'needs_first_factor':
              return err(t('auth.needs_first_factor'));
            case 'needs_second_factor':
              return err(t('auth.needs_second_factor'));
            case 'needs_identifier':
              return err(t('auth.needs_identifier'));
            case 'needs_new_password':
              return err(t('auth.needs_new_password'));
            case null:
              return err(t('auth.could_not_sign_in'));
            default:
              throw new Error('Unexpected status');
          }
        })
        .match(
          (sessionId) => {
            setActive({ session: sessionId });
            navigate({ to: '/' });
          },
          (e) => {
            navigate({
              to: '.',
              replace: true,
              search: { error: e },
            });
          }
        );
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <CardTitle>{t('auth.welcome_back')}</CardTitle>
        <CardDescription>{t('auth.login_form_desc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ErrorAlert errors={pageError ? [pageError] : []} />
        <ContinueWithGoogle />
        <Divider text={t('auth.or_continue')} backgroundClass="bg-card" />
        <form className="flex flex-col gap-4">
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
                  errors={field.state.meta.errors
                    .filter((e) => e != null)
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
              },
            }}
            children={(field) => (
              <>
                <field.FormInput
                  id="password"
                  label={t('auth.password')}
                  type="password"
                  name="password"
                  placeholder="********"
                  autoComplete="current-password"
                  required
                />
                <ErrorAlert
                  errors={field.state.meta.errors.filter((e) => e != undefined)}
                />
              </>
            )}
          />
          <form.AppForm>
            <form.SubmitButton>{t('auth.login')}</form.SubmitButton>
          </form.AppForm>
        </form>
        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          {t('auth.dont_have_an_account')}
          <Link
            to="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t('auth.signup')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
