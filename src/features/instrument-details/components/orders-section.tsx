import { useTranslation } from 'react-i18next';
import { StopLimit } from './stop-limit';
import { BuySell } from './buy-sell';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';

interface OrdersSectionProps {
  ticker: string;
  className?: string;
}

export function OrdersSection({
  ticker: instrumentId,
  className,
}: OrdersSectionProps) {
  const { t } = useTranslation();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('orders.place_order')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market">
          <TabsList>
            <TabsTrigger value="market" className="cursor-pointer text-xs">
              {t('orders.tabs.market_order')}
            </TabsTrigger>
            <TabsTrigger value="limit" className="cursor-pointer text-xs">
              {t('orders.tabs.stop_limit_order')}
            </TabsTrigger>
            <TabsTrigger value="sl_tp" className="cursor-pointer text-xs">
              {t('orders.tabs.stop_loss_take_profit')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="market">
            <BuySell ticker={instrumentId} />
          </TabsContent>
          <TabsContent value="limit">
            <StopLimit ticker={instrumentId} />
          </TabsContent>
          <TabsContent value="sl_tp"></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
