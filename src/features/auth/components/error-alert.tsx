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
  errors: Array<string>;
  className?: string;
}

export const ErrorAlert = ({ title, errors, className }: ErrorAlertProps) => {
  return (
    errors.length > 0 && (
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
            {errors.map((error) => (
              <div key={error}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      </motion.div>
    )
  );
};
