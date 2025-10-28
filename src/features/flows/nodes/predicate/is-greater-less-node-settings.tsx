import { useNodeData } from '../../hooks/use-node-data';
import { IsGreaterLessNodeUI } from './is-greater-less-node-ui';
import { PredicateNodeSettings } from './predicate-node-settings';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class IsGreaterLessNodeSettings extends PredicateNodeSettings {
  direction: 'greater' | 'less';

  constructor() {
    super();
    this.direction = 'greater';
  }

  getUpdatedDirection(
    direction: 'greater' | 'less'
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
      value={props.data.settings.value}
      onDirectionChange={(val: 'greater' | 'less') => {
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
