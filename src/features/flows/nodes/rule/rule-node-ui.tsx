import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';

import type { CustomNodeProps } from '../../types/node-props';
import { CustomHandle } from '@/features/flows/components/validated-handle';

export function RuleNodeUI({ children, nodeId, preview }: CustomNodeProps) {
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
