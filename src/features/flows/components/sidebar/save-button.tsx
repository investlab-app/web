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
      className="px-4 mr-4 mb-4 bg-[var(--primary)] text-white rounded"
    >
      {t('flows.sidebar.save_flow')}
    </Button>
  );
}
