import { Position, useNodeConnections } from '@xyflow/react';
import { ValidatedHandle } from '../../components/validated-handle';
import { NodeUI } from '../node-ui';
import type { ReactNode } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface PredicateNodeUIProps {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
  comparatorComponent: ReactNode;
}

export function PredicateNodeUI({
  nodeId,
  preview,
  children,
  comparatorComponent,
  value,
  onValueChange,
}: PredicateNodeUIProps & CustomNodeProps) {
  const connections = useNodeConnections({
    id: nodeId,
    handleType: 'source',
    handleId: 'inX',
  });

  return (
    <NodeUI
      nodeId={nodeId}
      preview={preview}
      className={`bg-[var(--node-predicate)]`}
    >
      <div className="flex flex-col items-end">
        <div className="flex flex-row items-center">{children}</div>

        {onValueChange && (
          <div className="flex items-center justify-end mt-2">
            <div className="mr-2">{comparatorComponent}</div>
            <NumberInput
              disabled={connections.length > 0}
              className="w-30"
              min={-9999}
              max={9999}
              stepper={1}
              value={value}
              onValueChange={onValueChange}
              decimalScale={3}
            />
          </div>
        )}
      </div>
      {!preview && (
        <>
          <ValidatedHandle
            type="target"
            id="out"
            nodeId={nodeId}
            position={Position.Left}
          />
          <ValidatedHandle
            type="source"
            id="inValue"
            nodeId={nodeId}
            position={Position.Right}
            style={{ top: '25%' }}
          />
          <ValidatedHandle
            type="source"
            id="inX"
            nodeId={nodeId}
            position={Position.Right}
            style={{ top: '75%' }}
          />
        </>
      )}
    </NodeUI>
  );
}
