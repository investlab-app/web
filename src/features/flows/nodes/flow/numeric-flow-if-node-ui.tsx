import { useTranslation } from 'react-i18next';
import { FlowNodeUI } from './flow-node-ui';
import type { CustomNodeProps } from '../../types/node-props';

export function NumericFlowIfNodeUI({ nodeId, preview }: CustomNodeProps) {
  const { t } = useTranslation();

  return (
    <FlowNodeUI preview={preview} nodeId={nodeId}>
      <div>{t('flows.nodes.if').toUpperCase()}</div>
      <div>
        {t('flows.nodes.then').toUpperCase()} {t('flows.nodes.number')}
      </div>
      <div>
        {t('flows.nodes.else').toUpperCase()} {t('flows.nodes.number')}
      </div>
    </FlowNodeUI>
  );
}
