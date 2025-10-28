import { useTranslation } from 'react-i18next';
import { NumberNodeUI } from './number-node-ui';
import type { CustomNodeProps } from '../../types/node-props';

export function MoneyAvailableNodeUI({
  nodeId,
  preview,
}: CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <NumberNodeUI nodeId={nodeId} preview={preview}>
      <div>{t('flows.nodes.money_available')}</div>
    </NumberNodeUI>
  );
}
