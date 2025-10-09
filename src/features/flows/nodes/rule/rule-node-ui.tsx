import { Handle, Position } from '@xyflow/react';

import { NodeUI } from '../node-ui';
import type { ReactNode } from 'react';

interface RuleNodeUIProps {
  children?: ReactNode;
  id: string;
  className?: string;
  connectionsLen?: number;
}

export function RuleNodeUI({
  children,
  className,
  connectionsLen,
}: RuleNodeUIProps) {
  const hasNoConnections = connectionsLen !== undefined && connectionsLen < 1;

  return (
    <NodeUI
      className={` ${hasNoConnections ? 'border-red-500' : ''} ${className}`}
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
