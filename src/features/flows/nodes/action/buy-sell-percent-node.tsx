import { useTranslation } from 'react-i18next';
import { BuySellSelect } from '../../components/buy-sell-select';
import { ActionNodeUI } from './action-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';
import { NumberInput } from '@/features/shared/components/ui/number-input';

interface BuySellPercentNodeUIProps {
  instrument: string;
  onInstrumentChange?: (value: string | undefined) => void;
  percent?: number;
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
