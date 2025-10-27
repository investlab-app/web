import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import { ValidatedHandle } from '@/features/flows/components/validated-handle';

export function TriggerNodeUI({
  children,
  nodeId,
  preview = false,
}: CustomNodeProps) {
  return (
    <NodeUI
      className={`bg-[var(--node-trigger)]`}
      nodeId={nodeId}
      preview={preview}
    >
      {children}
      <ValidatedHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="in"
      />
    </NodeUI>
  );
}
