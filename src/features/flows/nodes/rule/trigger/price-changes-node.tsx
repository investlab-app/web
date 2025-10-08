import { memo } from 'react';
import { useUpdateNodeInternals, } from '@xyflow/react';
import type {   Node,  NodeProps } from '@xyflow/react';
import { PriceChangesNodeUI } from '@/features/flows/components/nodes-ui/price-changes-node-ui';

export type PriceChangesNode = Node<
  {
    value: string;
    direction: 'rises' | 'falls';
  },
  'priceChangesNode'
>;

export const PriceChangesNode = memo((props: NodeProps<PriceChangesNode>) => {

const updateNodeInternals = useUpdateNodeInternals();
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
            console.log("dir", dir);
            props.data.direction = dir;
            updateNodeInternals(props.id);
        }}
      />

  );
});
