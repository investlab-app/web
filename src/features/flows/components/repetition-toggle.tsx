import { useTranslation } from 'react-i18next';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/features/shared/components/ui/toggle-group';

interface RepetitionToggleProps {
  repeat: boolean;
  onToggle: (repeat: boolean) => void;
  className?: string;
}

export function RepetitionToggle({
  repeat,
  onToggle,
  className,
}: RepetitionToggleProps) {
  const { t } = useTranslation();
  return (
    <ToggleGroup
      type="single"
      value={repeat ? 'repeat' : 'single'}
      onValueChange={(value) => onToggle(value === 'repeat' ? true : false)}
      variant="outline"
      aria-label="Toggle strategy repetition"
      className={className}
    >
      <ToggleGroupItem value="single" aria-label="Single">
        {t('flows.listview.single')}
      </ToggleGroupItem>
      <ToggleGroupItem value="repeat" aria-label="Repeat">
        {t('flows.listview.repeat')}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
