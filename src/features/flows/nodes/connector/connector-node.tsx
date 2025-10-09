import { useNodeConnections } from '@xyflow/react';
import { ConnectorNodeUI } from './connector-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export type ConnectorNode = Node<
  {
    isAnd: boolean;
  },
  CustomNodeTypes.Connector
>;

export const ConnectorNode = (props: NodeProps<ConnectorNode>) => {
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
    <ConnectorNodeUI
      id={props.id}
      isAnd={props.data.isAnd}
      topConnectionsLen={topConnections.length}
      bottomConnectionsLen={bottomConnections.length}
      outConnectionsLen={outConnections.length}
    />
  );
};
