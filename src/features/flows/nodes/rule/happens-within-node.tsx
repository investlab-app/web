import { useUpdateNodeInternals } from '@xyflow/react';
import { RuleNodeUI } from './rule-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import { NumberInput } from '@/features/shared/components/ui/number-input';

export type HappensWithinNode = Node<
  {
    value: number;
  },
  CustomNodeTypes.HappensWithin
>;

export const HappensWithinNode = (props: NodeProps<HappensWithinNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();

  return (
    <HappensWithinNodeUI
      nodeId={props.id}
      value={props.data.value}
      onValueChange={(val) => {
        props.data.value = val!;
        updateNodeInternals(props.id);
      }}
    />
  );
};

interface HappensWithinNodeUIProps {
  value: number;
  onValueChange?: (value: number | undefined) => void;
  nodeId: string;
  preview?: boolean;
}

export function HappensWithinNodeUI({
  value,
  onValueChange,
  nodeId,
  preview,
}: HappensWithinNodeUIProps) {
  return (
    <RuleNodeUI preview={preview} nodeId={nodeId}>
      <div className="text-sm px-1">Happens in the past</div>
      {onValueChange && (
        <NumberInput
          className="w-20 mx-2"
          min={1}
          defaultValue={1}
          value={value}
          onValueChange={onValueChange}
          decimalScale={0}
        />
      )}
      {!onValueChange && <div className="px-1">X</div>}
      <div className="text-sm">days</div>
    </RuleNodeUI>
  );
}
