import { useNodeConnections } from '@xyflow/react';
import { ConnectorNodeUI } from './connector-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export type AndNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.And
>;

export const AndNode = (props: NodeProps<AndNode>) => {
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
    <AndNodeUI
      id={props.id}
      topConnectionsLen={topConnections.length}
      bottomConnectionsLen={bottomConnections.length}
      outConnectionsLen={outConnections.length}
    />
  );
};

export interface AndNodeUIProps {
  id: string;
  outConnectionsLen?: number;
  topConnectionsLen?: number;
  bottomConnectionsLen?: number;
}

export function AndNodeUI({
  id,
  outConnectionsLen,
  topConnectionsLen,
  bottomConnectionsLen,
}: AndNodeUIProps) {
  return (
    <ConnectorNodeUI
      id={id}
      outConnectionsLen={outConnectionsLen}
      topConnectionsLen={topConnectionsLen}
      bottomConnectionsLen={bottomConnectionsLen}
    >
      AND
    </ConnectorNodeUI>
  );
}
