import { ConnectorNodeUI } from './connector-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';
import type { CustomNodeProps } from '../../types/node-props';

export type AndNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.And
>;

export const AndNode = (props: NodeProps<AndNode>) => {
  return <AndNodeUI nodeId={props.id} />;
};

export function AndNodeUI({ nodeId, preview }: CustomNodeProps) {
  return (
    <ConnectorNodeUI nodeId={nodeId} preview={preview}>
      AND
    </ConnectorNodeUI>
  );
}
