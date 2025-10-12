import { ConnectorNodeUI } from './connector-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { ConnectorNodeTypes } from '../../types/node-types';

export type AndNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  ConnectorNodeTypes.And
>;

export const AndNode = (props: NodeProps<AndNode>) => {
  return <AndNodeUI id={props.id} />;
};

export interface AndNodeUIProps {
  id: string;
  preview?: boolean;
}

export function AndNodeUI({ id, preview }: AndNodeUIProps) {
  return (
    <ConnectorNodeUI id={id} preview={preview}>
      AND
    </ConnectorNodeUI>
  );
}
