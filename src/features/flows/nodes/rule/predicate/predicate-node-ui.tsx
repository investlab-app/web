import { Position } from '@xyflow/react';
import { NodeUI } from '../../node-ui';

import type { ReactNode } from 'react';
import { CustomHandle } from '@/features/flows/components/validated-handle';

interface PredicateNodeUIProps {
  children?: ReactNode;
  nodeId: string;
}

export function PredicateNodeUI({ children, nodeId }: PredicateNodeUIProps) {
  return (
    <NodeUI className={`bg-[var(--node-predicate)] `}>
      {children}
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="right"
      />
      <CustomHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id="left"
      />
    </NodeUI>
  );
}
