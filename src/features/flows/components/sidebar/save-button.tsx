import { useTranslation } from 'react-i18next';
import { Button } from '@/features/shared/components/ui/button';

interface SaveButtonProps {
  onSave: () => void;
}

export function SaveButton({ onSave }: SaveButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      onClick={onSave}
      className="px-4 mb-4 bg-[var(--primary)] text-primary-foreground rounded"
    >
      {t('flows.sidebar.save')}
    </Button>
  );
}
