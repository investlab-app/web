import { LogicOperatorNodeSettings } from './logic-operator-node-settings';
import { OrNodeUI } from './or-node';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class OrNodeSettings extends LogicOperatorNodeSettings {
  constructor() {
    super();
  }
}

export type OrNode = Node<
  {
    settings: OrNodeSettings;
  },
  CustomNodeTypes.Or
>;

export const OrNode = (props: NodeProps<OrNode>) => {
  return <OrNodeUI nodeId={props.id} />;
};
