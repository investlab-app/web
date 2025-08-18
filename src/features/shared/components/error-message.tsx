import { useTranslation } from 'react-i18next';

export const ErrorMessage = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="h-32 flex items-center justify-center text-center">
      <p>{message || t('common.error_loading_data')}</p>
    </div>
  );
};
