import { LogicOperatorNodeSettings } from './logic-operator-node-settings';
import { AndNodeUI } from './and-node';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';

export class AndNodeSettings extends LogicOperatorNodeSettings {
  constructor() {
    super();
  }
}

export type AndNode = Node<
  {
    settings: AndNodeSettings;
  },
  typeof CustomNodeTypes.And
>;

export const AndNode = (props: NodeProps<AndNode>) => {
  return <AndNodeUI nodeId={props.id} />;
};
