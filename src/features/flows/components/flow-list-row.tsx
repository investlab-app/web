import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, ChevronRight, Trash2 } from 'lucide-react';
import { useStrategyMutations } from '../hooks/strategy-mutations';
import { cn } from '@/features/shared/utils/styles';
import { Button } from '@/features/shared/components/ui/button';

interface FlowListRowProps {
  id: string;
  name: string;
  className?: string;
}

export function FlowListRow({ id, name, className }: FlowListRowProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { deleteMutation } = useStrategyMutations();
  const navigate = useNavigate();

  const handleDeleteFlow = () => {
    deleteMutation.mutate({ path: { id } });
  };

  return (
    <div className={cn('bg-muted/40', className)}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 sm:gap-4 p-4 border-b-muted-foreground/10 border-b">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isCollapsed ? t('common.expand') : t('common.collapse')}
            aria-expanded={!isCollapsed}
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}
            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 border border-transparent hover:border-muted-foreground/20"
          >
            <ChevronRight
              className={cn(
                'h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform',
                isCollapsed ? 'rotate-0' : 'rotate-90'
              )}
            />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <span className="text-sm sm:text-base font-semibold text-foreground truncate">
              {name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: `/strategies/${id}` })}
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              asChild
            >
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label={t('common.delete')}
              onClick={() => {
                handleDeleteFlow();
              }}
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4 border-b border-muted-foreground/10">
            <p className="text-sm text-muted-foreground">
              {t('flows.strategy_details_placeholder')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
