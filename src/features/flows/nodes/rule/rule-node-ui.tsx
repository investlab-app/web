import { Handle, Position, useNodeConnections } from '@xyflow/react';

import { NodeUI } from '../node-ui';
import type { ReactNode } from 'react';

interface RuleNodeUIProps {
  children?: ReactNode;
  id: string;
  className?: string;
}

export function RuleNodeUI({ children, id, className }: RuleNodeUIProps) {
  const connections = useNodeConnections({ id: id });
  return (
    <NodeUI className={`${className} min-w-[200px]`}>
      {children}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={connections.length < 1}
      />
    </NodeUI>
  );
}
