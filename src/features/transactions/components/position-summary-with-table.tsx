import { useState } from 'react';
import { PositionSummary, PositionSummarySkeleton } from './position-summary';
import { PositionsCards, PositionsCardsSkeleton } from './positions-cards';
import type { Position } from '@/client';
import { cn } from '@/features/shared/utils/styles';

export function PositionSummaryWithTable({ position }: { position: Position }) {
  const [collapsed, setCollapsed] = useState(false);

  const currentPrice = position.market_value / position.quantity;

  return (
    <div>
      <PositionSummary
        key={position.symbol}
        position={position}
        setCollapsed={() => setCollapsed(!collapsed)}
        isCollapsed={collapsed}
        className={cn(
          'rounded-t-lg overflow-hidden',
          collapsed && 'rounded-b-lg'
        )}
      />
      {!collapsed && (
        <div className="border-b border-l border-r border-muted border-t border-t-muted-foreground/25 rounded-b-lg bg-background overflow-hidden">
          <PositionsCards
            history={position.history}
            currentPrice={currentPrice}
            className="rounded-none"
          />
        </div>
      )}
    </div>
  );
}

export function PositionSummaryWithTableSkeleton() {
  return (
    <div className="overflow-hidden">
      <PositionSummarySkeleton className="rounded-t-lg" />
      <div className="border-b border-l border-r border-muted bg-background rounded-b-lg overflow-hidden">
        <PositionsCardsSkeleton className="rounded-none" />
      </div>
    </div>
  );
}
