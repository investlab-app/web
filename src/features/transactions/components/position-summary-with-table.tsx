import { useId, useState } from 'react';
import { PositionSummary, PositionSummarySkeleton } from './position-summary';
import { PositionsCards, PositionsCardsSkeleton } from './positions-cards';
import type { Position } from '@/client';
import { cn } from '@/features/shared/utils/styles';

export function PositionSummaryWithTable({
  position,
  open,
}: {
  position: Position;
  open: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const contentId = useId();

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow',
        'hover:shadow-md'
      )}
    >
      <PositionSummary
        key={position.symbol}
        position={position}
        open={open}
        setCollapsed={() => setCollapsed(!collapsed)}
        isCollapsed={collapsed}
        className={cn(
          'rounded-t-xl overflow-hidden bg-muted/40',
          collapsed && 'rounded-b-xl'
        )}
      />

      {!collapsed && (
        <div
          id={contentId}
          aria-hidden={collapsed}
          className={cn(
            'relative rounded-b-xl border-t border-muted-foreground/20 bg-background'
          )}
        >
          <PositionsCards
            open={open}
            history={position.history}
            className={cn('rounded-none scroll-smooth snap-x snap-mandatory')}
          />
        </div>
      )}
    </section>
  );
}

export function PositionSummaryWithTableSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
      <PositionSummarySkeleton className="rounded-t-xl" />
      <div className="relative bg-background rounded-b-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-0 w-8 bg-gradient-to-r from-background to-transparent rounded-bl-xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 right-0 w-8 bg-gradient-to-l from-background to-transparent rounded-br-xl"
        />
        <PositionsCardsSkeleton className="rounded-none" />
      </div>
    </section>
  );
}
