import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';

import type { ReactNode } from 'react';
import { CustomHandle } from '@/features/flows/components/validated-handle';

interface RuleNodeUIProps {
  children?: ReactNode;
  nodeId: string;
  preview?: boolean;
}

export function RuleNodeUI({ children, nodeId, preview }: RuleNodeUIProps) {
  return (
    <NodeUI
      className={`bg-[var(--node-predicate)] `}
      preview={preview}
      nodeId={nodeId}
    >
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
