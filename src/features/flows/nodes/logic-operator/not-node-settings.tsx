import { NotNodeUI } from './not-node';
import { LogicOperatorNodeSettings } from './logic-operator-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class NotNodeSettings extends LogicOperatorNodeSettings {
  constructor() {
    super();
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    for (const key in inConnections) {
      if (inConnections[key] != 1) return false;
    }
    for (const key in outConnections) {
      if (outConnections[key] != 1) return false;
    }
    return (
      Object.keys(inConnections).length == 1 &&
      Object.keys(outConnections).length == 1
    );
  }
}

export type NotNode = Node<
  {
    settings: NotNodeSettings;
  },
  CustomNodeTypes.Not
>;

export const NotNode = (props: NodeProps<NotNode>) => {
  return <NotNodeUI nodeId={props.id} />;
};
