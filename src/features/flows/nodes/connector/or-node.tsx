import { ConnectorNodeUI } from './connector-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export type OrNode = Node<
  {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
  CustomNodeTypes.Or
>;

export const OrNode = (props: NodeProps<OrNode>) => {
  return <OrNodeUI id={props.id} />;
};

interface OrNodeUIProps {
  id: string;
  preview?: boolean;
}

export function OrNodeUI({ id, preview }: OrNodeUIProps) {
  return (
    <ConnectorNodeUI id={id} preview={preview}>
      OR
    </ConnectorNodeUI>
  );
}
