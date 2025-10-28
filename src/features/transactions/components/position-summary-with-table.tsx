import { useState } from 'react';
import { PositionSummary, PositionSummarySkeleton } from './position-summary';
import { PositionsTable, PositionsTableSkeleton } from './positions-table';
import type { Position } from '@/client';

export function PositionSummaryWithTable({ position }: { position: Position }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div>
      <PositionSummary
        key={position.symbol}
        position={position}
        setCollapsed={() => setCollapsed(!collapsed)}
        isCollapsed={collapsed}
      />
      {!collapsed && <PositionsTable position={position} />}
    </div>
  );
}

export function PositionSummaryWithTableSkeleton() {
  return (
    <div>
      <PositionSummarySkeleton />
      <PositionsTableSkeleton />
    </div>
  );
}
