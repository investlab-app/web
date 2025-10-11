import { Handle, useNodeConnections } from '@xyflow/react';
import { useValidators } from '../hooks/use-validators';
import type { HandleType, Position } from '@xyflow/react';

export interface CustomHandleProps {
  nodeId: string;
  id: string;
  type: HandleType;
  position: Position;
}

export const CustomHandle = ({
  nodeId,
  id,
  type,
  position,
}: CustomHandleProps) => {
  const { getAllowedConnections } = useValidators();
  const connections = useNodeConnections({
    id: nodeId,
    handleType: type,
    handleId: id,
  });
  return (
    <Handle
      id={id}
      type={type}
      position={position}
      isConnectable={connections.length < getAllowedConnections(nodeId, type)}
    />
  );
};
