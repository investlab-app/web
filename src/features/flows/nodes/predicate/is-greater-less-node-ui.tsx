import { useTranslation } from 'react-i18next';
import { PredicateNodeUI } from './predicate-node-ui';
import type { ChangeEvent } from 'react';
import type { CustomNodeProps } from '../../types/node-props';

interface IsGreaterLessNodeUIProps {
  direction?: 'greater' | 'less';
  value?: number;
  onDirectionChange?: (value: 'greater' | 'less') => void;
  onValueChange?: (value: number | undefined) => void;
}

export function IsGreaterLessNodeUI({
  direction,
  value,
  onDirectionChange,
  onValueChange,
  nodeId,
  preview,
}: IsGreaterLessNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <PredicateNodeUI
      nodeId={nodeId}
      preview={preview}
      onValueChange={onValueChange}
      value={value}
    >
      <div>{t('flows.nodes.is')}</div>

      {onDirectionChange ? (
        <select
          className="px-2 py-1 mx-2 border rounded"
          value={direction}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onDirectionChange(e.target.value as 'greater' | 'less')
          }
        >
          <option value="greater">{t('flows.nodes.greater')}</option>
          <option value="less">{t('flows.nodes.less')}</option>
        </select>
      ) : (
        <div className="mx-1">{t('flows.placeholders.greater_less')}</div>
      )}

      <div>{t('flows.nodes.than')}</div>
    </PredicateNodeUI>
  );
}
