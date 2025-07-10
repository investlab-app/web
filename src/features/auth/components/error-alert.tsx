import { ArkError } from 'arktype';
import { AlertCircleIcon } from 'lucide-react';
import type { ArkErrors } from 'arktype';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/features/shared/components/ui/alert';
import { cn } from '@/features/shared/utils';

interface ErrorAlertProps {
  title?: string;
  errors: Set<string>;
  className?: string;
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

export const ErrorAlert = ({ title, errors, className }: ErrorAlertProps) => {
  return (
    errors.size > 0 && (
      <Alert variant="destructive" className={cn('w-full', className)}>
        <AlertCircleIcon className="h-4 w-4" />
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
