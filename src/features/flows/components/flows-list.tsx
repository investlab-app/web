import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { FlowListRowPlaceholder } from './flow-list-row-placeholder';
import { FlowListRow } from './flow-list-row';
import { Button } from '@/features/shared/components/ui/button';
import { useIsMobile } from '@/features/shared/hooks/use-media-query';
import { Alert, AlertDescription } from '@/features/shared/components/ui/alert';

interface FlowsListProps {
  strategies: ReadonlyArray<{
    id: string;
    name: string;
    repeat: boolean | undefined;
  }>;
  isActive?: boolean;
}

export function FlowsList({ strategies, isActive }: FlowsListProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      {strategies.toSorted().map((strategy) => (
        <FlowListRow
          key={strategy.id}
          id={strategy.id}
          name={strategy.name}
          repeat={strategy.repeat}
        />
      ))}

      {strategies.length === 0 && (
        <FlowListRowPlaceholder active={isActive ?? false} />
      )}

      {isActive && !isMobile && (
        <div className="bg-muted/40 border-b-muted-foreground/10 border-b">
          <Button
            variant="ghost"
            onClick={() => {
              navigate({ to: `/strategies/new` });
            }}
            className="w-full h-auto p-4 justify-start gap-3"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 flex items-center justify-center">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 " />
            </div>
            <span className="text-sm sm:text-base font-semibold text-foreground">
              {t('flows.listview.add_strategy')}
            </span>
          </Button>
        </div>
      )}
      {isActive && isMobile && (
        <Alert className="border-warning bg-warning/10">
          <AlertDescription>
            {t('flows.errors.add_restricted')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
