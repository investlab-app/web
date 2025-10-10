import { useNodeConnections } from '@xyflow/react';
import { ConnectorNodeUI } from './connector-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export type OrNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.Or
>;

export const OrNode = (props: NodeProps<OrNode>) => {
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
    <OrNodeUI
      id={props.id}
      topConnectionsLen={topConnections.length}
      bottomConnectionsLen={bottomConnections.length}
      outConnectionsLen={outConnections.length}
    />
  );
};

interface OrNodeUIProps {
  id: string;
  outConnectionsLen?: number;
  topConnectionsLen?: number;
  bottomConnectionsLen?: number;
}

export function OrNodeUI({
  id,
  outConnectionsLen,
  topConnectionsLen,
  bottomConnectionsLen,
}: OrNodeUIProps) {
  return (
    <ConnectorNodeUI
      id={id}
      outConnectionsLen={outConnectionsLen}
      topConnectionsLen={topConnectionsLen}
      bottomConnectionsLen={bottomConnectionsLen}
    >
      OR
    </ConnectorNodeUI>
  );
}
