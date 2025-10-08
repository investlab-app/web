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
  return <ConnectorNodeUI id={props.id} isAnd={props.data.isAnd} />;
};
