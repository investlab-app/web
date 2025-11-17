import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/features/shared/components/ui/alert';

interface FlowListRowPlaceholderProps {
  active: boolean;
}

export function FlowListRowPlaceholder({
  active,
}: FlowListRowPlaceholderProps) {
  const { t } = useTranslation();

  return (
    <Alert className="border-warning bg-warning/10">
      <AlertDescription>
        {active
          ? t('flows.placeholders.no_active_strategies')
          : t('flows.placeholders.no_history_strategies')}
      </AlertDescription>
    </Alert>
  );
}
