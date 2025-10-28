import { useNodeData } from '../../hooks/use-node-data';
import { MathNodeSettings } from './math-node-settings';
import { DivideNodeUI } from './divide-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class DivideNodeSettings extends MathNodeSettings {
  constructor() {
    super();
  }
}

export type DivideNode = Node<
  {
    settings: DivideNodeSettings;
  },
  CustomNodeTypes.Divide
>;

export const DivideNode = (props: NodeProps<DivideNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <DivideNodeUI
      nodeId={props.id}
      value={props.data.settings.value}
      onValueChange={(val) =>
        updateNodeData({ settings: props.data.settings.getUpdatedValue(val) })
      }
    />
  );
};
