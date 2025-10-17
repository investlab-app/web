import { Handle, useNodeConnections } from '@xyflow/react';
import { useValidators } from '../hooks/use-validators';
import type { HandleType, Position } from '@xyflow/react';

export interface CustomHandleProps {
  nodeId: string;
  id: string;
  type: HandleType;
  position: Position;
  style?: Record<string, string>;
}

export const CustomHandle = ({
  nodeId,
  id,
  type,
  position,
  style,
}: CustomHandleProps) => {
  const { getAllowedConnections, isConnectionValid } = useValidators();
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
      isConnectable={isConnectionValid(
        connections.length,
        getAllowedConnections(nodeId, type)
      )}
      style={style}
    />
  );
};
