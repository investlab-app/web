import { useTranslation } from 'react-i18next';
import { BuyCard } from './buy-card';
import type { HistoryEntry } from '@/client';
import { ScrollableHorizontally } from '@/features/shared/components/scrollable-horizontally';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/features/shared/components/ui/card';

interface PositionsCardsProps {
  history: Array<HistoryEntry>;
  open: boolean;
  className?: string;
}

export function PositionsCards({
  history,
  open,
  className,
}: PositionsCardsProps) {
  const { t } = useTranslation();

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <ScrollableHorizontally>
      <div className={`flex flex-row ${className || ''}`}>
        {history.map((entry, index) => (
          <div
            key={`${entry.timestamp}-${index}`}
            className="h-full snap-start"
          >
            <BuyCard open={open} entry={entry} />
          </div>
        ))}
        {history.length > 0 && (
          <div className="flex-shrink-0 snap-start flex items-center justify-center px-6">
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              {t('transactions.end_of_history')}
            </span>
          </div>
        )}
      </div>
    </ScrollableHorizontally>
  );
}

export function PositionsCardsSkeleton({ className }: { className?: string }) {
  return (
    <ScrollableHorizontally>
      <div className={`flex ${className || ''}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={'flex-shrink-0 snap-start'}>
            <Card className="w-[16rem] sm:w-72 md:w-80 h-full rounded-none animate-pulse">
              <CardHeader className="px-3">
                <div className="h-3 bg-muted rounded w-16 mb-1" />
                <div className="h-2.5 bg-muted rounded w-20" />
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-2">
                <div className="space-y-1">
                  <div className="h-2.5 bg-muted rounded w-full" />
                  <div className="h-2.5 bg-muted rounded w-full" />
                  <div className="h-2.5 bg-muted rounded w-full" />
                  <div className="border-t pt-1 mt-1 space-y-1">
                    <div className="h-2.5 bg-muted rounded w-full" />
                    <div className="h-2.5 bg-muted rounded w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </ScrollableHorizontally>
  );
}
