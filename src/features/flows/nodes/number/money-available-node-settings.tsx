import { MoneyAvailableNodeUI } from './money-available-node-ui';
import { NumberNodeSettings } from './number-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';

export class MoneyAvailableNodeSettings extends NumberNodeSettings {
  constructor() {
    super();
  }
}

export type MoneyAvailableNode = Node<
  {
    settings: MoneyAvailableNodeSettings;
  },
  CustomNodeTypes.MoneyAvailable
>;

export const MoneyAvailableNode = (props: NodeProps<MoneyAvailableNode>) => {
  return <MoneyAvailableNodeUI nodeId={props.id} />;
};
