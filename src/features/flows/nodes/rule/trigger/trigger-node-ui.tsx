import { Handle, Position } from '@xyflow/react';
import { NodeUI } from '../../node-ui';
import type { ReactNode } from 'react';

interface TriggerNodeUIProps {
  children?: ReactNode;
  connectionsLen?: number;
}

export function TriggerNodeUI({
  children,
  connectionsLen,
}: TriggerNodeUIProps) {
  const hasNoConnections = connectionsLen !== undefined && connectionsLen < 1;

  return (
    <NodeUI
      className={`bg-[var(--node-trigger)] ${hasNoConnections ? 'border-red-500' : ''}`}
    >
      {children}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={connectionsLen ? connectionsLen < 1 : true}
      />
    </NodeUI>
  );
}
