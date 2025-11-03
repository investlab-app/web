import { useNodeData } from '../../hooks/use-node-data';
import { MathNodeSettings } from './math-node-settings';
import { AddNodeUI } from './add-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '../../types/node-types-2';

export class AddNodeSettings extends MathNodeSettings {
  constructor() {
    super();
  }
}

export type AddNode = Node<
  {
    settings: AddNodeSettings;
  },
  CustomNodeTypes.Add
>;

export const AddNode = (props: NodeProps<AddNode>) => {
  const { updateNodeData } = useNodeData(props.id);

  return (
    <AddNodeUI
      nodeId={props.id}
      value={props.data.settings.inB}
      onValueChange={(val) =>
        updateNodeData({ settings: props.data.settings.getUpdatedValue(val) })
      }
    />
  );
};
