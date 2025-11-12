import { useTranslation } from 'react-i18next';

import { EnumSelect } from '../../components/enum-select';
import { COMPARISON_DIRECTION_OPTIONS } from '../../constants/node-options';
import { PredicateNodeUI } from './predicate-node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { ComparisonDirection } from '../../types/input-options-types';

interface IsGreaterLessNodeUIProps {
  direction?: ComparisonDirection;
  value?: number;
  onDirectionChange?: (value: ComparisonDirection) => void;
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
      comparatorComponent={<div>
        {t('flows.nodes.than')}
      </div>}
      onValueChange={onValueChange}
      value={value}
    >
      <div>{t('flows.nodes.is')}</div>

      {onDirectionChange ? (
        <EnumSelect
          value={direction}
          onChange={onDirectionChange}
          options={COMPARISON_DIRECTION_OPTIONS}
          className="px-2 py-1 ml-2 border rounded"
        />
      ) : (
        <div className="mx-1">{t('flows.placeholders.greater_less')}</div>
      )}
    </PredicateNodeUI>
  );
}
