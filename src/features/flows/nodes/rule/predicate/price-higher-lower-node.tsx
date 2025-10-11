import { useUpdateNodeInternals } from '@xyflow/react';
import { PredicateNodeUI } from './predicate-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { RuleNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import { NumberInput } from '@/features/shared/components/ui/number-input';

export type PriceHigherLowerNode = Node<
  {
    value: number;
    state: 'over' | 'under';
  },
  RuleNodeTypes.PriceOverUnder
>;

export const PriceHigherLowerNode = (
  props: NodeProps<PriceHigherLowerNode>
) => {
  const updateNodeInternals = useUpdateNodeInternals();

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
      nodeId={props.id}
    />
  );
};

interface PriceHigherLowerNodeUIProps {
  value: number;
  state: 'over' | 'under';
  onValueChange?: (value: number | undefined) => void;
  onStateChange?: (state: 'over' | 'under') => void;
  nodeId: string;
}

export function PriceHigherLowerNodeUI({
  value,
  state,
  onValueChange,
  onStateChange,
  nodeId,
}: PriceHigherLowerNodeUIProps) {
  return (
    <PredicateNodeUI nodeId={nodeId}>
      <div className="text-sm px-1">Price</div>
      <select
        className="mx-2 px-2 py-1 border rounded text-xs"
        value={state}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onStateChange!(e.target.value as 'over' | 'under')
        }
      >
        <option value="over">over</option>
        <option value="under">under</option>
      </select>
      {onValueChange && (
        <NumberInput
          className="text-xs w-30"
          min={1}
          stepper={50}
          defaultValue={100.0}
          value={value}
          onValueChange={onValueChange}
          decimalScale={2}
        />
      )}
      {!onValueChange && <div className="px-1">X</div>}
    </PredicateNodeUI>
  );
}
