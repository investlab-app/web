import { useTranslation } from 'react-i18next';
import { useNodeData } from '../../hooks/use-node-data';
import { BuySellSelect } from '../../components/buy-sell-select';
import { ActionNodeUI } from './action-node-ui';
import type { Node, NodeProps } from '@xyflow/react';
import type { CustomNodeTypes } from '@/features/flows/types/node-types';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

export type BuySellPercentNode = Node<
  {
    instrument: string;
    percent: number;
    action: string;
  },
  CustomNodeTypes.BuySellPercent
>;

export const BuySellPercentNode = (props: NodeProps<BuySellPercentNode>) => {
  const { updateNodeData } = useNodeData<BuySellPercentNode['data']>(props.id);

  return (
    <BuySellPercentNodeUI
      nodeId={props.id}
      instrument={props.data.instrument}
      percent={props.data.percent}
      action={props.data.action}
      onInstrumentChange={(val) => {
        console.log('instrument change', val, 'for node', props.id);
        updateNodeData({ instrument: val! });
      }}
      onPercentChange={(val) => {
        updateNodeData({ percent: val! });
      }}
      onActionChange={(val) => {
        const updates: Partial<BuySellPercentNode['data']> = { action: val };
        if (val === 'sell' && props.data.percent > 100) {
          updates.percent = 100;
        }
        updateNodeData(updates);
      }}
    />
  );
};

interface BuySellPercentNodeUIProps {
  instrument: string;
  onInstrumentChange?: (value: string | undefined) => void;
  percent: number;
  onPercentChange?: (value: number | undefined) => void;
  action: string;
  onActionChange?: (value: string) => void;
}

export function BuySellPercentNodeUI({
  instrument,
  onInstrumentChange,
  percent,
  onPercentChange,
  action,
  onActionChange,
  nodeId,
  preview,
}: BuySellPercentNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <ActionNodeUI preview={preview} nodeId={nodeId}>
      <BuySellSelect action={action} onActionChange={onActionChange} />
      {onPercentChange && (
        <NumberInput
          className="w-30 mx-2"
          min={0}
          max={action === 'sell' ? 100 : undefined}
          defaultValue={10}
          stepper={5}
          suffix="%"
          value={percent}
          onValueChange={(val) => {
            if (action === 'sell' && val && val > 100) {
              onPercentChange(100);
            } else {
              onPercentChange(val);
            }
          }}
          decimalScale={0}
        />
      )}
      {!onPercentChange && <div className="pr-1">X%</div>}
      <div>{t('flows.nodes.of_owned')}</div>
      {!onPercentChange && <div className="px-1"></div>}
      {onInstrumentChange && (
        <input
          className="mx-2 px-2 py-1 border rounded"
          type="text"
          placeholder="AAPL"
          value={instrument}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onInstrumentChange(e.target.value)
          }
        />
      )}
    </ActionNodeUI>
  );
}
