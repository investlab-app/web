import { Handle, Position } from '@xyflow/react';
import { NodeUI } from '../node-ui';

interface ConnectorNodeUIProps {
  isAnd: boolean;
  id: string;
  outConnectionsLen?: number;
  topConnectionsLen?: number;
  bottomConnectionsLen?: number;
}

export function ConnectorNodeUI({
  isAnd,
  id,
  outConnectionsLen,
  topConnectionsLen,
  bottomConnectionsLen,
}: ConnectorNodeUIProps) {
  const hasNoConnections =
    topConnectionsLen !== undefined &&
    bottomConnectionsLen !== undefined &&
    (topConnectionsLen < 1 || bottomConnectionsLen < 1);

  return (
    <NodeUI
      className={` ${
        hasNoConnections ? 'border-red-500' : ''
      } bg-[var(--background)]`}
    >
      {isAnd ? 'AND' : 'OR'}

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={outConnectionsLen ? outConnectionsLen < 1 : true}
        isValidConnection={(connection) => connection.target !== id}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="top-left"
        style={{ top: '30%' }}
        isConnectable={topConnectionsLen ? topConnectionsLen < 1 : true}
        isValidConnection={(connection) => connection.source !== id}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '70%' }}
        id="bottom-left"
        isConnectable={bottomConnectionsLen ? bottomConnectionsLen < 1 : true}
        isValidConnection={(connection) => connection.source !== id}
      />
    </NodeUI>
  );
}
