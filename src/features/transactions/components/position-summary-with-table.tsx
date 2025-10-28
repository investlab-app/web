import { useState } from 'react';
import { PositionSummary } from './position-summary';
import { PositionsTable } from './positions-table';
import type { Position } from '@/client';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

export function PositionSummaryWithTable({
  position,
  className,
}: {
  position: Position;
  className?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={className}>
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
  return <Skeleton />;
}
