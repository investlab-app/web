import { useNodeData } from '../../hooks/use-node-data';
import { ComparisonDirection } from '../../types/node-enums';
import { IsGreaterLessNodeUI } from './is-greater-less-node-ui';
import { PredicateNodeSettings } from './predicate-node-settings';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export class IsGreaterLessNodeSettings extends PredicateNodeSettings {
  direction: ComparisonDirection;

  constructor() {
    super();
    this.direction = ComparisonDirection.Greater;
  }

  getUpdatedDirection(
    direction: ComparisonDirection
  ): IsGreaterLessNodeSettings {
    this.direction = direction;
    return this;
  }
}

export type IsGreaterLessNode = Node<
  {
    settings: IsGreaterLessNodeSettings;
  },
  CustomNodeTypes.IsGreaterLesser
>;

export const IsGreaterLessNode = (props: NodeProps<IsGreaterLessNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <IsGreaterLessNodeUI
      nodeId={props.id}
      direction={props.data.settings.direction}
      value={props.data.settings.inX}
      onDirectionChange={(val: ComparisonDirection) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedDirection(val),
        });
      }}
      onValueChange={(val: number | undefined) => {
        updateNodeData({
          settings: props.data.settings.getUpdatedValue(val),
        });
      }}
    />
  );
};
