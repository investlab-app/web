import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MarketOrder } from './market-order';
import { LimitOrder } from './limit-order';
import { PendingLimitOrders } from './pending-limit-orders';
import { PendingMarketOrders } from './pending-market-orders';
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
        return (
          <div className="space-y-4">
            <MarketOrder ticker={instrumentId} />
            <PendingMarketOrders ticker={instrumentId} />
          </div>
        );
      case 'limit':
        return (
          <div className="space-y-4">
            <LimitOrder ticker={instrumentId} />
            <PendingLimitOrders ticker={instrumentId} />
          </div>
        );
      default:
        console.error(`Unknown order type: ${orderType}`);
        return null;
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
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <OrderForm />
      </CardContent>
    </Card>
  );
}
