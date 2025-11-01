import { useState } from 'react';
import { PositionSummary, PositionSummarySkeleton } from './position-summary';
import { PositionsTable, PositionsTableSkeleton } from './positions-table';
import type { Position } from '@/client';
import { cn } from '@/features/shared/utils/styles';

export function PositionSummaryWithTable({ position }: { position: Position }) {
  const [collapsed, setCollapsed] = useState(false);
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
        <PositionsTable
          history={position.history}
          className="rounded-b-lg border-b border-l border-r border-muted border-t border-t-muted-foreground/25 "
        />
      )}
    </div>
  );
}

export function PositionSummaryWithTableSkeleton() {
  return (
    <div className="overflow-hidden">
      <PositionSummarySkeleton className="rounded-t-lg" />
      <PositionsTableSkeleton className="rounded-b-lg border-b border-l border-r border-muted" />
    </div>
  );
}
