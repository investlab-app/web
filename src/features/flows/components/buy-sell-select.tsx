import { useTranslation } from 'react-i18next';
import type { ChangeEvent } from 'react';

interface BuySellSelectProps {
  action?: string;
  onActionChange?: (value: string) => void;
}

export function BuySellSelect({ action, onActionChange }: BuySellSelectProps) {
  const { t } = useTranslation();
  return onActionChange ? (
    <select
      className="px-2 py-1 border rounded"
      value={action}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onActionChange(e.target.value as 'buy' | 'sell')
      }
    >
      <option value="buy">{t('flows.nodes.buy')}</option>
      <option value="sell">{t('flows.nodes.sell')}</option>
    </select>
  ) : (
    <div className="px-1">{t('flows.placeholders.buy_sell')}</div>
  );
}
