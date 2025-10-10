import { Handle, Position } from '@xyflow/react';
import { NodeUI } from '../../node-ui';

import type { ReactNode } from 'react';

interface ActionNodeUIProps {
  children?: ReactNode;
  connectionsLen?: number;
}

export function ActionNodeUI({ children, connectionsLen }: ActionNodeUIProps) {
  const notEnoughConnections =
    connectionsLen !== undefined && connectionsLen < 2;

  return (
    <NodeUI
      className={`bg-[var(--node-action)] ${notEnoughConnections ? 'border-red-500' : ''}`}
    >
      {children}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={connectionsLen ? connectionsLen < 1 : true}
      />
    </NodeUI>
  );
}
