import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { getProfabilityColor } from '../../shared/utils/colors';
import { TransactionRow } from './transaction-row';
import { PositionsTableHeader } from './positions-table';
import type { Position } from '@/client/types.gen';
import {
  Table,
  TableBody,
} from '@/features/shared/components/ui/table';
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
      <div
        className="border border-border hover:bg-muted/20 cursor-pointer p-4"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
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
              <Button variant="link" asChild className="p-0">
                <Link
                  aria-label={`${t('transactions.actions.instrument_details')} ${position.name}`}
                  title={t('transactions.actions.instrument_details')}
                  to={`/instruments/${position.name}`}
                >
                  {position.name}
                </Link>
              </Button>
            ) : (
              <span>{position.name}</span>
            )}
          </div>
          <div className="flex items-center justify-end gap-6 text-sm">
            <div className="text-right">
              <p className="text-muted-foreground text-xs">
                {t('common.quantity')}
              </p>
              <p>{toFixedLocalized(position.quantity, i18n.language, 2)}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs">
                {t('common.market_value')}
              </p>
              <p>
                {toFixedLocalized(position.market_value, i18n.language, 2)}{' '}
                {t('common.currency')}
              </p>
            </div>
            <div className={`text-right ${getProfabilityColor(position.gain)}`}>
              <p className="text-muted-foreground text-xs">
                {t('common.gain')}
              </p>
              <p>
                {toFixedLocalized(position.gain, i18n.language, 2)}{' '}
                {t('common.currency')}
              </p>
            </div>
            <div
              className={`text-right ${getProfabilityColor(position.gain_percentage)}`}
            >
              <p className="text-muted-foreground text-xs">
                {t('common.gain_percentage')}
              </p>
              <p>
                {position.gain_percentage === null
                  ? 'N/A'
                  : `${toFixedLocalized(position.gain_percentage, i18n.language, 2)}%`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!collapsed && (
        <Table>
          <PositionsTableHeader />
          <TableBody>
            {position.history.map((h, i) => (
              <TransactionRow key={i} entry={h} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};
