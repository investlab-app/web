import { useTranslation } from 'react-i18next';

import { BUY_SELL_OPTIONS } from '../constants/node-options';
import { EnumSelect } from './enum-select';
import type { BuySellAction } from '../types/node-enums';

interface BuySellSelectProps {
  action?: BuySellAction;
  onActionChange?: (value: BuySellAction) => void;
}

export function BuySellSelect({ action, onActionChange }: BuySellSelectProps) {
  const { t } = useTranslation();
  return onActionChange ? (
    <EnumSelect
      value={action}
      onChange={onActionChange}
      options={BUY_SELL_OPTIONS}
      className="px-2 py-1 border rounded"
    />
  ) : (
    <div className="px-1">{t('flows.placeholders.buy_sell')}</div>
  );
}
