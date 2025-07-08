import { ArkError } from 'arktype';
import type { ArkErrors } from 'arktype';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/features/shared/components/ui/alert';

interface ErrorAlertProps {
  title?: string;
  errors: Set<string>;
}

export const arkErrorsArrayToStringSet = (
  errors: Array<ArkErrors | undefined>
) =>
  new Set(
    errors
      .flatMap((error) => error ?? [])
      .flatMap((error) =>
        error instanceof ArkError ? error.flat.map((e) => e.message) : [error]
      )
  );

export const ErrorAlert = ({ title, errors }: ErrorAlertProps) => {
  return (
    errors.size > 0 && (
      <Alert variant="destructive" className="w-full">
        {title && <AlertTitle>{title}:</AlertTitle>}
        <AlertDescription>
          {Array.from(errors).map((error) => (
            <div key={error}>{error}</div>
          ))}
        </AlertDescription>
      </Alert>
    )
  );
};
