import { useUpdateNodeInternals } from '@xyflow/react';
import { RuleNodeUI } from './rule-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

export type PriceHigherLowerNode = Node<
  {
    value: number;
    state: 'over' | 'under';
  },
  CustomNodeTypes.PriceOverUnder
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
}

export function PriceHigherLowerNodeUI({
  value,
  state,
  onValueChange,
  onStateChange,
  nodeId,
  preview,
}: PriceHigherLowerNodeUIProps & CustomNodeProps) {
  return (
    <RuleNodeUI nodeId={nodeId} preview={preview}>
      <div className="text-sm">Price</div>
     { onStateChange ? ( <select
        className="mx-2 px-2 py-1 border rounded text-xs"
        value={state}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onStateChange(e.target.value as 'over' | 'under')
        }
      >
        <option value="over">over</option>
        <option value="under">under</option>
      </select>) : (<div className="pl-1">reaches threshold</div>)}
      {onValueChange && (
        <NumberInput
          className="text-xs w-30"
          min={1}
          stepper={25}
          defaultValue={100.0}
          value={value}
          onValueChange={onValueChange}
          fixedDecimalScale={true}
          decimalScale={2}
        />
      )}
    </RuleNodeUI>
  );
}
