import { useNodeConnections, useUpdateNodeInternals } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import { PriceChangesNodeUI } from '@/features/flows/nodes/rule/trigger/price-changes-node-ui';

export type PriceChangesNode = Node<
  {
    value: string;
    direction: 'rises' | 'falls';
  },
  CustomNodeTypes.PriceChanges
>;

export const PriceChangesNode = (props: NodeProps<PriceChangesNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const connections = useNodeConnections({ id: props.id });
  return (
    <PriceChangesNodeUI
      id={props.id}
      value={props.data.value}
      direction={props.data.direction}
      onValueChange={(val) => {
        props.data.value = val;
        updateNodeInternals(props.id);
      }}
      onDirectionChange={(dir) => {
        props.data.direction = dir;
        updateNodeInternals(props.id);
      }}
      connectionsLen={connections.length}
    />
  );
};
