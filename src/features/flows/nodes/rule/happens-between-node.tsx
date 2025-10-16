import { useUpdateNodeInternals } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { RuleNodeUI } from './rule-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { CustomNodeProps } from '../../types/node-props';

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
      nodeId={props.id}
    />
  );
};

interface HappensBetweenNodeUIProps {
  startDate: Date;
  endDate: Date;
  onStartChange?: (value: Date | undefined) => void;
  onEndChange?: (value: Date | undefined) => void;
}

export function HappensBetweenNodeUI({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  nodeId,
  preview,
}: HappensBetweenNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onStartChange?.(val ? new Date(val) : undefined);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onEndChange?.(val ? new Date(val) : undefined);
  };

  return (
    <RuleNodeUI nodeId={nodeId} preview={preview}>
      <div>{t('flows.nodes.happens_between')}</div>
      {onStartChange && (
        <input
          type="date"
          value={formatDate(startDate)}
          onChange={handleStartChange}
          className="border p-1 rounded mx-2"
        />
      )}
      {onEndChange && (
        <div className="inline-block">{t('flows.nodes.and')}</div>
      )}
      {onEndChange && (
        <input
          type="date"
          value={formatDate(endDate)}
          onChange={handleEndChange}
          className="border p-1 rounded ml-2"
        />
      )}
    </RuleNodeUI>
  );
}
