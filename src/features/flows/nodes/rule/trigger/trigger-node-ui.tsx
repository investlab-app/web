import { Position } from '@xyflow/react';
import { NodeUI } from '../../node-ui';
import type { ReactNode } from 'react';
import { CustomHandle } from '@/features/flows/components/validated-handle';

interface TriggerNodeUIProps {
  children?: ReactNode;
  nodeId: string;
}

export function TriggerNodeUI({ children, nodeId }: TriggerNodeUIProps) {
  const hasNoConnections = false;

  return (
    <NodeUI
      className={`bg-[var(--node-trigger)] ${hasNoConnections ? 'border-red-500' : ''}`}
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
