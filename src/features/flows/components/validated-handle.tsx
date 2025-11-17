import { Handle, useNodeConnections } from '@xyflow/react';
import { useValidators } from '../hooks/use-validators';
import type { HandleType, Position } from '@xyflow/react';

export interface CustomHandleProps {
  nodeId: string;
  id: number;
  type: HandleType;
  position: Position;
  style?: Record<string, string>;
  overrideAllowedConnections?: number;
}
export interface ValidatedHandleProps {
  nodeId: string;
  id: string;
  type: HandleType;
  position: Position;
  style?: Record<string, string>;
  overrideAllowedConnections?: number;
}

export const ValidatedHandle = ({
  nodeId,
  id,
  type,
  position,
  style,
  overrideAllowedConnections,
}: ValidatedHandleProps) => {
  const { getAllowedConnections, isConnectionValid } = useValidators();
  const connections = useNodeConnections({
    id: nodeId,
    handleType: type,
    handleId: id.toString(),
  });
  return (
    <Handle
      id={id.toString()}
      type={type}
      position={position}
      isConnectable={isConnectionValid(
        connections.length,
        overrideAllowedConnections ?? getAllowedConnections(nodeId, type, id)
      )}
      style={{ ...style, scale: '1.3' }}
    />
  );
};
