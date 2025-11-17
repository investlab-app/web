import { useTranslation } from 'react-i18next';
import { NumberNodeUI } from './number-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';

interface PriceOfNodeUIProps {
  value?: string;
  onValueChange?: (value: string | undefined) => void;
}

export function PriceOfNodeUI({
  value,
  onValueChange,
  nodeId,
  preview,
}: PriceOfNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <NumberNodeUI nodeId={nodeId} preview={preview}>
      <div>{t('flows.nodes.price_of')}</div>

      {onValueChange && (
        <input
          className="px-2 py-1 ml-2 border rounded"
          type="text"
          placeholder="AAPL"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
        />
      )}
    </NumberNodeUI>
  );
}
