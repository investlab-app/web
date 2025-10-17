import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { CustomHandle } from '../../components/validated-handle';
import type { ReactNode } from 'react';

interface ConnectorNodeUIProps {
  id: string;
  children?: ReactNode;
  preview?: boolean;
}

export function ConnectorNodeUI({
  children,
  id,
  preview,
}: ConnectorNodeUIProps) {
  return (
    <NodeUI preview={preview} nodeId={id} className={`bg-[var(--background)]`}>
      {children}

      <CustomHandle
        nodeId={id}
        type="source"
        position={Position.Right}
        id="right"
      />
      <CustomHandle
        nodeId={id}
        type="target"
        position={Position.Left}
        id="top-left"
        style={{ top: '30%' }}
      />
      <CustomHandle
        nodeId={id}
        type="target"
        position={Position.Left}
        style={{ top: '70%' }}
        id="bottom-left"
      />
    </NodeUI>
  );
}
