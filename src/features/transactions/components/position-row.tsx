import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { getProfabilityColor } from '../utils/colors';
import { TransactionRow } from './transaction-row';
import type { Position } from '../types/types';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import { toFixedLocalized } from '@/features/shared/utils/numbers';

interface PositionRowProps {
  position: Position;
  showDetails: () => void;
}

export const PositionRow = ({ position, showDetails }: PositionRowProps) => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <TableRow
        className="border-border hover:bg-muted/20 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <TableCell>
          <div className="flex items-center gap-1">
            <button
              className="p-1 hover:bg-muted/20 rounded cursor-pointer border border-transparent"
              aria-label={collapsed ? t('common.expand') : t('common.collapse')}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showDetails();
              }}
              className="p-1 hover:bg-muted/20 rounded cursor-pointer border border-transparent font-medium"
              aria-label={`${t('transactions.actions.instrument_details')} ${position.name}`}
              title={t('transactions.actions.instrument_details')}
            >
              {position.name}
            </button>
          </div>
        </TableCell>
        <TableCell>
          {toFixedLocalized(position.quantity, i18n.language, 2)}
        </TableCell>
        <TableCell></TableCell>
        <TableCell className="hidden xl:table-cell"></TableCell>
        <TableCell className="text-right">
          {toFixedLocalized(position.marketValue, i18n.language, 2)}{' '}
          {t('common.currency')}
        </TableCell>
        <TableCell
          className={`text-right ${getProfabilityColor(position.gainLoss)}`}
        >
          {toFixedLocalized(position.gainLoss, i18n.language, 2)}{' '}
          {t('common.currency')}
        </TableCell>
        <TableCell
          className={`text-right ${getProfabilityColor(position.gainLoss)}`}
        >
          {toFixedLocalized(position.gainLossPct, i18n.language, 2)}%
        </TableCell>
      </TableRow>

      {!collapsed &&
        position.history.map((h, i) => <TransactionRow key={i} entry={h} />)}
    </>
  );
};
