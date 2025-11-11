import { useTranslation } from "react-i18next";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { dateToLocale } from "@/features/shared/utils/date";
import { cn } from "@/features/shared/utils/styles";


interface HistoryCardProps {
    timestamp: string;
    instrument: string;
    quantity: string;
    isBuy: boolean;
    success: boolean;
}

export function HistoryCard( { timestamp, instrument, quantity, isBuy, success }: HistoryCardProps ) {

    const { t, i18n } = useTranslation();
    const language = i18n.language;
    return (
    <Card
      className={cn(
        'flex-shrink-0 snap-start transition-colors h-full rounded-none',
        'w-[16rem] sm:w-72 md:w-80',
        'py-4',
        success ? '' : 'bg-red-300/10'
      )}
    >
      <CardHeader className="px-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="ml-2 text-xs text-muted-foreground">
              {dateToLocale(timestamp, language)}
            </CardTitle>
            <Badge variant="undecorated" className="mb-2 text-xs">
            {isBuy ? t('transactions.badge.buy') : t('transactions.badge.sell')}
            </Badge>
            <Badge variant="default" className="mb-2 text-xs">
            {success ? t('flows.card.success') : t('flows.card.fail')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 flex flex-col h-full">
        <div className="space-y-2 flex-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('flows.card.bought_instrument')}
            </span>
            <span className="font-medium">{instrument}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.table.headers.quantity')}
            </span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t('transactions.table.headers.share_price')}
            </span>
            <span className="font-medium">
              424.00 USD
            </span>
          </div>
         
        </div>
      </CardContent>
    </Card>
  );
}