import { Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { ReactNode } from 'react';
import { ValidatedHandle } from '@/features/flows/components/validated-handle';

interface ActionNodeUIProps {
  bottomChild?: ReactNode;
}

export function ActionNodeUI({
  children,
  preview,
  nodeId,
  bottomChild,
}: CustomNodeProps & ActionNodeUIProps) {
  return (
    <NodeUI
      nodeId={nodeId}
      preview={preview}
      className={`bg-[var(--node-action)]`}
    >
      <div className="flex flex-col">
        <div className="flex flex-row items-center">{children}</div>
        {bottomChild && <div className="mt-2 w-full">{bottomChild}</div>}
      </div>
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
