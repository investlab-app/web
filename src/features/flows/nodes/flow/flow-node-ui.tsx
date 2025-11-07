import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { ValidatedHandle } from '../../components/validated-handle';
import type { CustomNodeProps } from '../../types/node-props';

export function FlowNodeUI({ nodeId, preview, children }: CustomNodeProps) {
  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--node-flow)]`}
    >
      <div className="flex flex-col gap-2 text-center">{children}</div>
      {!preview && (
        <>
          <ValidatedHandle
            nodeId={nodeId}
            type="source"
            position={Position.Right}
            id="inIf"
            style={{ top: '20%' }}
          />
          <ValidatedHandle
            nodeId={nodeId}
            type="source"
            position={Position.Right}
            id="inThen"
            style={{ top: '50%' }}
          />
          <ValidatedHandle
            nodeId={nodeId}
            type="source"
            position={Position.Right}
            id="inElse"
            style={{ top: '80%' }}
          />
          <ValidatedHandle
            nodeId={nodeId}
            type="target"
            position={Position.Left}
            id="out"
            style={{ top: '20%' }}
          />
        </>
      )}
    </NodeUI>
  );
}
