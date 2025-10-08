import { Handle, Position, useNodeConnections } from '@xyflow/react';

import { CommandNodeUI } from './command-node-ui';
import type { ReactNode } from 'react';

interface RuleNodeUIProps {
  children?: ReactNode;
  id: string;
  className?: string;
}

export function RuleNodeUI({ children,  id, className}: RuleNodeUIProps) {

 const connections = useNodeConnections({ id: id });
  return (
    <CommandNodeUI className={className}>
      {children}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={connections.length < 1}
      />
    </CommandNodeUI>
  );}