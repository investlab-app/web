import { useNodeConnections, useNodes } from '@xyflow/react';
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
  const selectedNodes = useNodes().filter((node) => node.selected);
  const isSelected = selectedNodes.some((node) => node.id === nodeId);

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
      className={`
        p-2 text-sm border rounded min-w-[100px] border-[#555] flex items-center justify-center 
        transition-shadow duration-200
        ${className ?? ''} 
        ${!preview && !isSelected && !validateNode(nodeId, inConnections, outConnections) ? 'shadow-[0_0_5px_#ff0000]' : ''}
        ${isSelected && !preview ? 'shadow-[0_0_5px_#000,0_0_5px_#fff]' : ''}
      `}
    >
      {children}
    </div>
  );
}
