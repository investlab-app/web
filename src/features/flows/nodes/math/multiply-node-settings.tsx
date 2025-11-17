import { useNodeData } from '../../hooks/use-node-data';
import { MathNodeSettings } from './math-node-settings';
import { MultiplyNodeUI } from './multiply-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types';

export class MultiplyNodeSettings extends MathNodeSettings {
  constructor() {
    super();
  }
}

export type MultiplyNode = Node<
  {
    settings: MultiplyNodeSettings;
  },
  typeof CustomNodeTypes.Multiply
>;

export const MultiplyNode = (props: NodeProps<MultiplyNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <MultiplyNodeUI
      nodeId={props.id}
      value={props.data.settings.inB}
      onValueChange={(val) =>
        updateNodeData({ settings: props.data.settings.getUpdatedValue(val) })
      }
    />
  );
};
