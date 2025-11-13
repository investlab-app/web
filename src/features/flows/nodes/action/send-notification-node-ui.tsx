import { useTranslation } from 'react-i18next';

import { PredefinedOptionsSelect } from '../../components/predefined-options-select';
import { NOTIFICATION_TYPE_OPTIONS } from '../../constants/node-options';
import { ActionNodeUI } from './action-node-ui';
import type { CustomNodeProps } from '../../types/node-props';
import type { NotificationType } from '../../types/input-options-types';
import { Textarea } from '@/features/shared/components/ui/textarea';

interface SendNotificationNodeUIProps {
  type?: NotificationType;
  onTypeChange?: (value: NotificationType) => void;
  message?: string;
  onMessageChange?: (value: string) => void;
}

export function SendNotificationNodeUI({
  type,
  onTypeChange,
  message,
  onMessageChange,
  nodeId,
  preview,
}: SendNotificationNodeUIProps & CustomNodeProps) {
  const { t } = useTranslation();
  return (
    <ActionNodeUI
      preview={preview}
      nodeId={nodeId}
      bottomChild={
        onMessageChange && (
          <Textarea
            className="w-full p-2 border rounded resize-none"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
        )
      }
    >
      <div>{t('flows.nodes.send_notification')}</div>
      {onTypeChange && (
        <PredefinedOptionsSelect
          value={type}
          onChange={onTypeChange}
          options={NOTIFICATION_TYPE_OPTIONS}
          className="px-2 mx-2 py-1 border rounded"
        />
      )}
      {!onTypeChange && (
        <div className="px-1">{t('flows.placeholders.email_push')}</div>
      )}
      <div>{t('flows.nodes.with_message')}</div>
    </ActionNodeUI>
  );
}
