import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { CommandNodeUI } from './command-node-ui';

interface ConnectorNodeUIProps {
  isAnd: boolean;
  id: string;
}

export function ConnectorNodeUI({ isAnd,  id }: ConnectorNodeUIProps) {
  const topConnections = useNodeConnections({
    id: id,
    handleId: 'top-left',
    handleType: 'target',
  });
  const bottomConnections = useNodeConnections({
    id: id,
    handleId: 'bottom-left',
    handleType: 'target',
  });
  const outConnections = useNodeConnections({
    id: id,
    handleType: 'source',
  });

  return (
   <CommandNodeUI>
      {isAnd ? 'AND' : 'OR'}

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={outConnections.length < 1}
        isValidConnection={(connection) => connection.source !== id}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="top-left"
        style={{ top: '30%' }}
        isConnectable={topConnections.length < 1}
        isValidConnection={(connection) => connection.source !== id}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '70%' }}
        id="bottom-left"
        isConnectable={bottomConnections.length < 1}
        isValidConnection={(connection) => connection.source !== id}
      />
</CommandNodeUI>
  );
}
