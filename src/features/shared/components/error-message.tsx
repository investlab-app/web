import { useTranslation } from 'react-i18next';
import { cn } from '../utils/styles';

export const Message = ({
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
        'h-full flex items-center justify-center text-center text-muted-foreground',
        className
      )}
    >
      <p>{message || t('common.error_loading_data')}</p>
    </div>
  );
};
