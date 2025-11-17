import { useNodeData } from '../../hooks/use-node-data';
import { MathNodeSettings } from './math-node-settings';
import { SubtractNodeUI } from './subtract-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';

export class SubtractNodeSettings extends MathNodeSettings {
  constructor() {
    super();
  }
}

export type SubtractNode = Node<
  {
    settings: SubtractNodeSettings;
  },
  typeof CustomNodeTypes.Subtract
>;

export const SubtractNode = (props: NodeProps<SubtractNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <SubtractNodeUI
      nodeId={props.id}
      value={props.data.settings.inB}
      onValueChange={(val) =>
        updateNodeData({ settings: props.data.settings.getUpdatedValue(val) })
      }
    />
  );
};
