import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../utils/styles';

export const ErrorMessage = ({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'h-full flex flex-col items-center justify-center text-center text-muted-foreground',
        className
      )}
    >
      <AlertTriangle className="w-10 h-10 mb-2" />
      <p>{message || t('common.error_loading_data')}</p>
    </div>
  );
};
