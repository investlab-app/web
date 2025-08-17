import { ArkError, ArkErrors, match, type } from 'arktype';
import { AlertCircleIcon } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/features/shared/components/ui/alert';
import { cn } from '@/features/shared/utils/styles';

interface ErrorAlertProps {
  title?: string;
  errors: Iterable<ArkErrors | ArkError | string | undefined>;
  className?: string;
}

const errorMatcher = match
  .case('string', (e) => [e])
  .case('undefined', () => [])
  .case(type.instanceOf(ArkErrors), (es) => es.flat().map((e) => e.message))
  .case(type.instanceOf(ArkError), (e) => [e.message])
  .default('never');

export const ErrorAlert = ({ title, errors, className }: ErrorAlertProps) => {
  const uniqueStringErrors = new Set(Array.from(errors).flatMap(errorMatcher));

  return (
    uniqueStringErrors.size > 0 && (
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [0, -4, 4, -4, 4, 0] }}
        transition={{ duration: 0.35, ease: [0.36, 0.07, 0.19, 0.97] }}
        className={cn('w-full', className)}
      >
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          {title && <AlertTitle>{title}:</AlertTitle>}
          <AlertDescription>
            {Array.from(uniqueStringErrors).map((error) => (
              <div key={error}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      </motion.div>
    )
  );
};
