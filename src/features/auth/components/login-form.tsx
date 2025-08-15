import { useSignIn } from '@clerk/tanstack-react-start';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ResultAsync, err, ok } from 'neverthrow';
import { match, type } from 'arktype';
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
        .andThen((signInResource) =>
          match({
            "'complete'": () =>
              signInResource.createdSessionId
                ? ok(signInResource.createdSessionId)
                : err('No session created'),
            "'needs_first_factor'": () => err(t('auth.needs_first_factor')),
            "'needs_second_factor'": () => err(t('auth.needs_second_factor')),
            "'needs_identifier'": () => err(t('auth.needs_identifier')),
            "'needs_new_password'": () => err(t('auth.needs_new_password')),
            null: () => err(t('auth.could_not_sign_in')),
            default: 'never',
          })(signInResource.status)
        )
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
        <ErrorAlert errors={[pageError]} />
        <ContinueWithGoogle />
        <Divider text={t('auth.or_continue')} backgroundClass="bg-card" />
        <form className="flex flex-col gap-4">
          <form.AppField
            name="email"
            validators={{
              onChange: type('string.email')
                .configure({
                  message: t('auth.invalid_email'),
                })
                .pipe(() => undefined),
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
                <ErrorAlert errors={field.state.meta.errors} />
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
                <ErrorAlert errors={field.state.meta.errors} />
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
