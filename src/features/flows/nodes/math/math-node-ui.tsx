import { Position, useNodeConnections } from '@xyflow/react';
import { NodeUI } from '../node-ui';
import { ValidatedHandle } from '../../components/validated-handle';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface MathNodeUIProps {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
}

export function MathNodeUI({
  nodeId,
  preview,
  children,
  value,
  onValueChange,
}: MathNodeUIProps & CustomNodeProps) {
  const connections = useNodeConnections({
    id: nodeId,
    handleType: 'source',
    handleId: 'inB',
  });

  return (
    <NodeUI
      preview={preview}
      nodeId={nodeId}
      className={`bg-[var(--node-math)]`}
    >
      <div className="flex flex-col gap-2 text-center">
        {children}
        {onValueChange && (
          <NumberInput
            disabled={connections.length > 0}
            className="w-30 ml-2"
            min={-9999}
            max={9999}
            stepper={1}
            value={value}
            onValueChange={onValueChange}
            decimalScale={3}
          />
        )}
      </div>
      {!preview && (
        <>
          <ValidatedHandle
            nodeId={nodeId}
            type="source"
            position={Position.Right}
            id="inA"
            style={{ top: '25%' }}
          />
          <ValidatedHandle
            nodeId={nodeId}
            type="source"
            position={Position.Right}
            id="inB"
            style={{ top: '75%' }}
          />
          <ValidatedHandle
            nodeId={nodeId}
            type="target"
            position={Position.Left}
            id="out"
          />
        </>
      )}
    </NodeUI>
  );
}
