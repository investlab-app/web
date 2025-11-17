import { Position } from '@xyflow/react';
import { ValidatedHandle } from '../../components/validated-handle';
import { NodeUI } from '../node-ui';
import type { CustomNodeProps } from '../../types/node-props';

export function NumberNodeUI({ nodeId, preview, children }: CustomNodeProps) {
  return (
    <NodeUI
      nodeId={nodeId}
      preview={preview}
      className={`bg-[var(--node-number)]`}
    >
      {children}
      {!preview && (
        <ValidatedHandle
          type="target"
          id="out"
          nodeId={nodeId}
          position={Position.Left}
        />
      )}
    </NodeUI>
  );
}
