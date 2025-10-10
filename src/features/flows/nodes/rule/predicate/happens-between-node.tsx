import { useUpdateNodeInternals } from '@xyflow/react';
import { HappensBetweenNodeUI } from './happens-between-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';

export type HappensBetweenNode = Node<
  {
    startDate: number;
    endDate: number;
  },
  CustomNodeTypes.HappensBetween
>;

export const HappensBetweenNode = (props: NodeProps<HappensBetweenNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { startDate, endDate } = props.data;

  const handleStartChange = (date: Date | undefined) => {
    props.data.startDate = date ? date.getTime() : 0;
    updateNodeInternals(props.id);
  };

  const handleEndChange = (date: Date | undefined) => {
    props.data.endDate = date ? date.getTime() : 0;
    updateNodeInternals(props.id);
  };

  return (
    <HappensBetweenNodeUI
      startDate={new Date(startDate)}
      endDate={new Date(endDate)}
      onStartChange={handleStartChange}
      onEndChange={handleEndChange}
    />
  );
};
