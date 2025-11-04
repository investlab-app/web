import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import { TRANSACTION_ACTION_OPTIONS } from '../../constants/node-options';
import { TriggerNodeUI } from './trigger-node-ui';
import type { TransactionAction } from '../../types/node-enums';
import type { CustomNodeProps } from '../../types/node-props';

interface InstrumentBoughtSoldNodeUIProps {
  value?: string;
  action?: TransactionAction;
  onValueChange?: (value: string) => void;
  onActionChange?: (action: TransactionAction) => void;
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
          onChange={(e) => onValueChange(e.target.value)}
        />
      ) : (
        <div>{t('flows.placeholders.instrument')}</div>
      )}
      {onActionChange ? (
        <EnumSelect
          value={action}
          onChange={onActionChange}
          options={TRANSACTION_ACTION_OPTIONS}
          className="px-2 ml-2 py-1 border rounded"
        />
      ) : (
        <div className="pl-1">{t('flows.placeholders.bought_sold')}</div>
      )}
    </TriggerNodeUI>
  );
}
