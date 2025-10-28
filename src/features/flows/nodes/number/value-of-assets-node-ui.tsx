import { useTranslation } from 'react-i18next';
import { NumberNodeUI } from './number-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';

interface ValueOfAssetsNodeUIProps {
  value?: string;
  onValueChange?: (value: string | undefined) => void;
}

export function ValueOfAssetsNodeUI({
  value,
  onValueChange,
  nodeId,
  preview,
}: ValueOfAssetsNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <NumberNodeUI nodeId={nodeId} preview={preview}>
      <div>{t('flows.nodes.value_of')}</div>

      {onValueChange ? (
        <input
          className="px-2 py-1  mx-2 border rounded"
          type="text"
          placeholder="AAPL"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
        />
      ) : <div className='ml-1'/>}

      <div>{t('flows.nodes.assets_suffix')}</div>

    </NumberNodeUI>
  );
}
