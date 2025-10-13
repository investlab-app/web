import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { getProfabilityColor } from '../../shared/utils/colors';
import { TransactionRow } from './transaction-row';
import type { Position } from '@/client/types.gen';
import { TableCell, TableRow } from '@/features/shared/components/ui/table';
import { toFixedLocalized } from '@/features/shared/utils/numbers';
import { Button } from '@/features/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/components/ui/tooltip';

interface PositionRowProps {
  position: Position;
  isNavigable?: boolean;
}

export const PositionRow = ({
  position,
  isNavigable = true,
}: PositionRowProps) => {
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'ghost'}
                  className="size-8"
                  aria-label={
                    collapsed ? t('common.expand') : t('common.collapse')
                  }
                >
                  {collapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {collapsed ? (
                  <p>{t('transactions.tooltips.expand_details')}</p>
                ) : (
                  <p>{t('transactions.tooltips.hide_details')}</p>
                )}
              </TooltipContent>
            </Tooltip>
            {isNavigable ? (
              <Button variant={'link'} asChild>
                <Link
                  className="p-1! text-foreground! h-8!"
                  aria-label={`${t('transactions.actions.instrument_details')} ${position.name}`}
                  title={t('transactions.actions.instrument_details')}
                  to={`/instruments/${position.name}`}
                >
                  {position.name}
                </Link>
              </Button>
            ) : (
              <span className="p-1 h-8 flex items-center">{position.name}</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          {toFixedLocalized(position.quantity, i18n.language, 2)}
        </TableCell>
        <TableCell></TableCell>
        <TableCell className="hidden xl:table-cell"></TableCell>
        <TableCell className="text-right">
          {toFixedLocalized(position.market_value, i18n.language, 2)}{' '}
          {t('common.currency')}
        </TableCell>
        <TableCell
          className={`text-right ${getProfabilityColor(position.gain_loss)}`}
        >
          {toFixedLocalized(position.gain_loss, i18n.language, 2)}{' '}
          {t('common.currency')}
        </TableCell>
        <TableCell
          className={`text-right ${getProfabilityColor(position.gain_loss)}`}
        >
          {toFixedLocalized(position.gain_loss_pct, i18n.language, 2)}%
        </TableCell>
      </TableRow>

      {!collapsed &&
        position.history.map((h, i) => <TransactionRow key={i} entry={h} />)}
    </>
  );
};
