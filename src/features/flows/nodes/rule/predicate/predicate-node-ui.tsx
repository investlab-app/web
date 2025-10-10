import { Handle, Position } from '@xyflow/react';
import { NodeUI } from '../../node-ui';

import type { ReactNode } from 'react';

interface PredicateNodeUIProps {
  children?: ReactNode;
  toConnectionsLen?: number;
  fromConnectionsLen?: number;
}

export function PredicateNodeUI({
  children,
  toConnectionsLen,
  fromConnectionsLen,
}: PredicateNodeUIProps) {
  const notEnoughConnections =
    (toConnectionsLen !== undefined && toConnectionsLen < 1) ||
    (fromConnectionsLen !== undefined && fromConnectionsLen < 1);

  return (
    <NodeUI
      className={`bg-[var(--node-predicate)] ${notEnoughConnections ? 'border-red-500' : ''}`}
    >
      {children}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={fromConnectionsLen ? fromConnectionsLen < 1 : true}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={toConnectionsLen ? toConnectionsLen < 1 : true}
      />
    </NodeUI>
  );
}
