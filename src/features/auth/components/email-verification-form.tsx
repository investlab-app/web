import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { ResultAsync, err, ok } from 'neverthrow';
import { useTranslation } from 'react-i18next';
import { BackButton } from './back-button';
import { ErrorAlert } from './error-alert';
import { useAppForm } from '@/features/shared/hooks/use-app-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';

interface EmailVerificationFormProps {
  pageError?: string;
}

export function EmailVerificationForm({
  pageError,
}: EmailVerificationFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      code: '',
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
        signUp.attemptEmailAddressVerification({
          code: value.code,
        }),
        (e) =>
          e instanceof Error
            ? t('auth.unknown_error', { cause: e.message })
            : t('auth.could_not_verify_email')
      )
        .andThen((signUpResource) => {
          switch (signUpResource.status) {
            case 'complete':
              return signUpResource.createdSessionId
                ? ok(signUpResource.createdSessionId)
                : err('No session created');
            case 'abandoned':
              return err(t('auth.abandoned'));
            case 'missing_requirements':
              return err(t('auth.missing_requirements'));
            default:
              return err(t('auth.could_not_verify_email'));
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
    <form.AppForm>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <CardTitle>{t('auth.verify_email')}</CardTitle>
          <CardDescription>{t('auth.verify_email_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ErrorAlert title="Error" errors={pageError ? [pageError] : []} />
          <form.AppField
            name="code"
            validators={{
              onBlur: z.string().length(6, {
                message: t('auth.code_must_be_digits', { digits: 6 }),
              }),
            }}
            children={(field) => (
              <>
                <div className="flex justify-center">
                  <field.SixDigitOTPInput />
                </div>
                <ErrorAlert
                  title={t('auth.code')}
                  errors={field.state.meta.errors
                    .filter((e) => e != null)
                    .map((e) => e.message)}
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
