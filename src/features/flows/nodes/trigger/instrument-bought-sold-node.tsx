import { useTranslation } from 'react-i18next';
import { useUpdateNodeInternals } from '@xyflow/react';
import { TriggerNodeUI } from './trigger-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';

export type InstrumentBoughtSoldNode = Node<
  {
    value: string;
    action: 'bought' | 'sold';
  },
  CustomNodeTypes.InstrumentBoughtSold
>;

export const InstrumentBoughtSoldNode = (
  props: NodeProps<InstrumentBoughtSoldNode>
) => {
  const updateNodeInternals = useUpdateNodeInternals();

  return (
    <InstrumentBoughtSoldNodeUI
      value={props.data.value}
      action={props.data.action}
      onValueChange={(val) => {
        props.data.value = val;
        updateNodeInternals(props.id);
      }}
      onActionChange={(act) => {
        props.data.action = act;
        updateNodeInternals(props.id);
      }}
      nodeId={props.id}
    />
  );
};

interface InstrumentBoughtSoldNodeUIProps {
  value: string;
  action: 'bought' | 'sold';
  onValueChange?: (value: string) => void;
  onActionChange?: (action: 'bought' | 'sold') => void;
}

export function InstrumentBoughtSoldNodeUI({
  value,
  action,
  onValueChange,
  onActionChange,
  nodeId,
  preview,
}: InstrumentBoughtSoldNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <TriggerNodeUI nodeId={nodeId} preview={preview}>
      {onValueChange ? (
        <input
          className="px-2 py-1 border rounded"
          type="text"
          placeholder="AAPL"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
        />
      ) : (
        <div>{t('flows.placeholders.instrument')}</div>
      )}
      {onActionChange ? (
        <select
          className="px-2 ml-2 py-1 border rounded"
          value={action}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onActionChange(e.target.value as 'bought' | 'sold')
          }
        >
          <option value="bought">{t('flows.nodes.bought')}</option>
          <option value="sold">{t('flows.nodes.sold')}</option>
        </select>
      ) : (
        <div className="pl-1">{t('flows.placeholders.bought_sold')}</div>
      )}
    </TriggerNodeUI>
  );
}
