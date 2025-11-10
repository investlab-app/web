import { useTranslation } from 'react-i18next';
import { CircleQuestionMark } from 'lucide-react';

interface FlowListRowPlaceholderProps {
  active: boolean;
}

export function FlowListRowPlaceholder({
  active,
}: FlowListRowPlaceholderProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-muted/40 flex items-center gap-2 sm:gap-4 p-4 border-b-muted-foreground/10 border-b">
      <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 border border-transparent items-center justify-center flex">
        <CircleQuestionMark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <span className="text-sm sm:text-base font-semibold text-foreground truncate">
          {active
            ? t('flows.placeholders.no_active_strategies')
            : t('flows.placeholders.no_history_strategies')}
        </span>
      </div>
    </div>
  );
}
