import { NodeUI } from '../../node-ui';
import type { ReactNode } from 'react';

interface TriggerNodeUIProps {
  children?: ReactNode;
}

export function TriggerNodeUI({
  children,
}: TriggerNodeUIProps) {
  return (
    <NodeUI
      className="bg-[var(--node-trigger)]"
    >
      {children}
    </NodeUI>
  );
}
