import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { memo } from 'react';
import type { Node, NodeProps } from '@xyflow/react';

export type ConnectorNode = Node<
  {
    isAnd: boolean;
  },
  'connectorNode'
>;

export const ConnectorNode = memo((props: NodeProps<ConnectorNode>) => {
  const topConnections = useNodeConnections({
    id: props.id,
    handleId: 'top-left',
    handleType: 'target',
  });
  const bottomConnections = useNodeConnections({
    id: props.id,
    handleId: 'bottom-left',
    handleType: 'target',
  });
  const outConnections = useNodeConnections({
    id: props.id,
    handleType: 'source',
  });

  return (
    <div className="p-2 border border-[#555] rounded min-w-[100px]">
      {props.data.isAnd ? 'AND' : 'OR'}

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={outConnections.length < 1}
        isValidConnection={(connection) => connection.source !== props.id}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="top-left"
        style={{ top: '30%' }}
        isConnectable={topConnections.length < 1}
        isValidConnection={(connection) => connection.source !== props.id}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '70%' }}
        id="bottom-left"
        isConnectable={bottomConnections.length < 1}
        isValidConnection={(connection) => connection.source !== props.id}
      />
    </div>
  );
});
