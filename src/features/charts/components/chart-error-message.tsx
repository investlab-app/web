import * as React from 'react';
import { useTranslation } from 'react-i18next';

type ChartErrorMessageProps = {
  message?: string;
};

export const ChartErrorMessage: React.FC<ChartErrorMessageProps> = ({
  message,
}) => {
  const { t } = useTranslation();

  return (
    <div
      style={{ height: 300 }}
      className="flex items-center justify-center text-center text-muted-foreground p-8"
    >
      {message ?? t('instruments.error_loading_price_history')}
    </div>
  );
};
