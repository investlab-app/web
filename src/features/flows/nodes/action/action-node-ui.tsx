import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import { ValidatedHandle } from '@/features/flows/components/validated-handle';

export function ActionNodeUI({ children, preview, nodeId }: CustomNodeProps) {
  console.log('Rendering ActionNodeUI', nodeId);
  return (
    <NodeUI
      nodeId={nodeId}
      preview={preview}
      className={`bg-[var(--node-action)]`}
    >
      {children}
      {!preview && (
        <ValidatedHandle
          nodeId={nodeId}
          type="target"
          position={Position.Left}
          id="out"
        />
      )}
    </NodeUI>
  );
}
