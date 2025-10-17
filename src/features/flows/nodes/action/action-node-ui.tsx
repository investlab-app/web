import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';

import type { ReactNode } from 'react';
import { CustomHandle } from '@/features/flows/components/validated-handle';

interface ActionNodeUIProps {
  children?: ReactNode;
  preview?: boolean;
  nodeId: string;
}

export function ActionNodeUI({ children, preview, nodeId }: ActionNodeUIProps) {
  return (
    <NodeUI
      nodeId={nodeId}
      preview={preview}
      className={`bg-[var(--node-action)]`}
    >
      {children}
      <CustomHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id="left"
      />
    </NodeUI>
  );
}
