import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StopLimit } from './stop-limit';
import { BuySell } from './buy-sell';
import { StopLossTakeProfit } from './stop-loss-take-profit';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/components/ui/select';

interface OrdersSectionProps {
  ticker: string;
  className?: string;
}

export function OrdersSection({
  ticker: instrumentId,
  className,
}: OrdersSectionProps) {
  const { t } = useTranslation();
  const [orderType, setOrderType] = useState('market');

  const OrderForm = () => {
    switch (orderType) {
      case 'market':
        return <BuySell ticker={instrumentId} />;
      case 'limit':
        return <StopLimit ticker={instrumentId} />;
      default:
        return <StopLossTakeProfit ticker={instrumentId} />
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('orders.place_order')}</CardTitle>
        <Select value={orderType} onValueChange={setOrderType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market">
              {t('orders.tabs.market_order')}
            </SelectItem>
            <SelectItem value="limit">
              {t('orders.tabs.stop_limit_order')}
            </SelectItem>
            <SelectItem value="sl_tp">
              {t('orders.tabs.stop_loss_take_profit')}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <OrderForm />
      </CardContent>
    </Card>
  );
}
