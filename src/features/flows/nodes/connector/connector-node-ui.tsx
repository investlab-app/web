import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { CustomNodeProps } from '../../types/node-props';

export function ConnectorNodeUI({
  children,
  nodeId,
  preview,
}: CustomNodeProps) {
  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--background)]`}
    >
      {children}

      <CustomHandle
        nodeId={nodeId}
        type="target"
        position={Position.Left}
        id={0}
      />
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        id={0}
        style={{ top: '30%' }}
      />
      <CustomHandle
        nodeId={nodeId}
        type="source"
        position={Position.Right}
        style={{ top: '70%' }}
        id={1}
      />
    </NodeUI>
  );
}
