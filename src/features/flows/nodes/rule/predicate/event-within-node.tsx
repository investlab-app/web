import { useUpdateNodeInternals } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';

import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import { EventWithinNodeUI } from '@/features/flows/nodes/rule/predicate/event-within-node-ui';

export type EventWithinNode = Node<
  {
    value: number;
  },
  CustomNodeTypes.EventWithin
>;

export const EventWithinNode = (props: NodeProps<EventWithinNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();
  return (
    <EventWithinNodeUI
      value={props.data.value}
      onValueChange={(val) => {
        props.data.value = val!;
        updateNodeInternals(props.id);
      }}
    />
  );
};
