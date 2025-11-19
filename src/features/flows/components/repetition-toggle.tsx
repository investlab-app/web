import { useTranslation } from 'react-i18next';
import { Play, Repeat } from 'lucide-react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/features/shared/components/ui/toggle-group';
import { useIsMobile } from '@/features/shared/hooks/use-media-query';

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

  const isMobile = useIsMobile();

  return (
    <ToggleGroup
      type="single"
      value={repeat ? 'repeat' : 'single'}
      onValueChange={(value) => value && onToggle(value === 'repeat')}
      variant="outline"
      aria-label="Toggle strategy repetition"
      className={className}
    >
      <ToggleGroupItem value="single" aria-label="Single">
        {isMobile ? <Play className="h-4 w-4" /> : t('flows.listview.single')}
      </ToggleGroupItem>
      <ToggleGroupItem value="repeat" aria-label="Repeat">
        {isMobile ? <Repeat className="h-4 w-4" /> : t('flows.listview.repeat')}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
