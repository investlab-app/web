import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import type { ReactNode } from 'react';
import { CustomHandle } from '@/features/flows/components/validated-handle';

interface TriggerNodeUIProps {
  children?: ReactNode;
  nodeId: string;
  preview?: boolean;
}

export function TriggerNodeUI({
  children,
  nodeId,
  preview = false,
}: TriggerNodeUIProps) {
  return (
    <NodeUI
      className={`bg-[var(--node-trigger)]`}
      nodeId={nodeId}
      preview={preview}
    >
      {children}
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id="right"
      />
    </NodeUI>
  );
}
