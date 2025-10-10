import { useNodeConnections, useUpdateNodeInternals } from '@xyflow/react';
import { PriceHigherLowerNodeUI } from './price-higher-lower-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';

export type PriceHigherLowerNode = Node<
  {
    value: number;
    state: 'over' | 'under';
  },
  CustomNodeTypes.PriceHigherLower
>;

export const PriceHigherLowerNode = (
  props: NodeProps<PriceHigherLowerNode>
) => {
   const updateNodeInternals = useUpdateNodeInternals();
    const connections = useNodeConnections({ id: props.id });
  return (
    <PriceHigherLowerNodeUI
      value={props.data.value}
      state={props.data.state}
      onValueChange={(val) => {
        props.data.value = val!;
        updateNodeInternals(props.id);
      }}
      onStateChange={(dir) => {
        props.data.state = dir;
        updateNodeInternals(props.id);
      }}
      connectionsLen={connections.length}
    />
  );
};
