import { useNodeConnections } from '@xyflow/react';
import { useValidators } from '../hooks/use-validators';
import type { CustomNodeProps } from '../types/node-props';

interface NodeUIProps {
  className?: string;
}

export function NodeUI({
  children,
  className,
  preview,
  nodeId,
}: NodeUIProps & CustomNodeProps) {
  const { validateNode } = useValidators();
  const inConnections = useNodeConnections({
    id: nodeId,
    handleType: 'target',
  });
  const outConnections = useNodeConnections({
    id: nodeId,
    handleType: 'source',
  });
  return (
    <div
      className={`p-2 text-sm border border-[#555] rounded min-w-[100px] flex items-center justify-center ${className ?? ''} ${!preview && !validateNode(nodeId, inConnections.length, outConnections.length) ? 'border-red-500' : ''}`}
    >
      {children}
    </div>
  );
}
