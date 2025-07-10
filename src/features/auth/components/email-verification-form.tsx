import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { match, type } from 'arktype';
import { ResultAsync, err, ok } from 'neverthrow';
import { useTranslation } from 'react-i18next';
import { BackButton } from './back-button';
import { ErrorAlert, arkErrorsArrayToStringSet } from './error-alert';
import { useAppForm } from '@/features/shared/hooks/use-app-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';

export function EmailVerificationForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (!isLoaded) {
          return 'Please try again later.';
        }

        return await ResultAsync.fromPromise(
          signUp.attemptEmailAddressVerification({
            code: value.code,
          }),
          (e) =>
            e instanceof Error
              ? t('auth.unknown_error', { cause: e.message })
              : t('auth.could_not_verify_email')
        )
          .andThen((signUpResource) =>
            match({
              "'complete'": () =>
                signUpResource.createdSessionId
                  ? ok(signUpResource.createdSessionId)
                  : err('No session created'),
              "'abandoned'": () => err(t('auth.abandoned')),
              "'missing_requirements'": () =>
                err(t('auth.missing_requirements')),
              null: () => err(t('auth.could_not_verify_email')),
              default: 'never',
            })(signUpResource.status)
          )
          .match(
            (sessionId) => {
              setActive({ session: sessionId });
              navigate({ to: '/' });
            },
            (e) => e
          );
      },
    },
  });

  return (
    <form.AppForm>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <CardTitle>{t('auth.verify_email')}</CardTitle>
          <CardDescription>{t('auth.verify_email_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form.AppField
            name="code"
            validators={{ onBlur: type('string == 6').pipe(() => undefined) }}
            children={(field) => (
              <>
                <div className="flex justify-center">
                  <field.SixDigitOTPInput />
                </div>
                <ErrorAlert
                  title="Code"
                  errors={arkErrorsArrayToStringSet(field.state.meta.errors)}
                />
              </>
            )}
          />
          <div className="flex flex-col gap-2 w-full">
            <form.SubmitButton>{t('auth.verify_email')}</form.SubmitButton>
            <BackButton variant="ghost" />
          </div>
        </CardContent>
      </Card>
    </form.AppForm>
  );
}
