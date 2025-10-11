// import { useNodeConnections, useUpdateNodeInternals } from '@xyflow/react';
// import { PredicateNodeUI } from './predicate-node-ui';
// import type { Node, NodeProps } from '@xyflow/react';
// import type { CustomNodeTypes } from '@/features/flows/types/node-types';
// import { NumberInput } from '@/features/shared/components/ui/number-input';

// export type EventWithinNode = Node<
//   {
//     value: number;
//   },
//   CustomNodeTypes.EventWithin
// >;

// export const EventWithinNode = (props: NodeProps<EventWithinNode>) => {
//   const updateNodeInternals = useUpdateNodeInternals();
//   const toConnections = useNodeConnections({
//     id: props.id,
//     handleType: 'target',
//   });
//   const fromConnections = useNodeConnections({
//     id: props.id,
//     handleType: 'source',
//   });
//   return (
//     <EventWithinNodeUI
//       value={props.data.value}
//       onValueChange={(val) => {
//         props.data.value = val!;
//         updateNodeInternals(props.id);
//       }}
//       fromConnectionsLen={fromConnections.length}
//       toConnectionsLen={toConnections.length}
//     />
//   );
// };

// interface EventWithinNodeUIProps {
//   value: number;
//   onValueChange?: (value: number | undefined) => void;
//   toConnectionsLen?: number;
//   fromConnectionsLen?: number;
// }

// export function EventWithinNodeUI({
//   value,
//   onValueChange,
//   toConnectionsLen,
//   fromConnectionsLen,
// }: EventWithinNodeUIProps) {
//   return (
//     <PredicateNodeUI
//       toConnectionsLen={toConnectionsLen}
//       fromConnectionsLen={fromConnectionsLen}
//     >
//       <div className="text-sm px-1">Happens in the past</div>
//       {onValueChange && (
//         <NumberInput
//           className="w-20 mx-2"
//           min={1}
//           defaultValue={1}
//           value={value}
//           onValueChange={onValueChange}
//           decimalScale={0}
//         />
//       )}
//       {!onValueChange && <div className="px-1">X</div>}
//       <div className="text-sm">days</div>
//     </PredicateNodeUI>
//   );
// }
