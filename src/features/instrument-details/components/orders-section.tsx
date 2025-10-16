import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BuySellContainer } from './buy-sell-action';
import { StopLimitContainer } from './stop-limit-action';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { ErrorMessage } from '@/features/shared/components/error-message';
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
import { pricesRetrieveOptions } from '@/client/@tanstack/react-query.gen';

interface OrdersSectionProps {
  ticker: string;
  className?: string;
}

export function OrdersSection({
  ticker: instrumentId,
  className,
}: OrdersSectionProps) {
  const { t } = useTranslation();

  const { data, isError, isPending } = useQuery(
    pricesRetrieveOptions({
      path: { ticker: instrumentId },
      throwOnError: true,
    })
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('orders.place_order')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorMessage message={t('orders.current_price_error')} />
        ) : isPending ? (
          <OrderSectionSkeleton />
        ) : (
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
              <BuySellContainer
                currentPrice={parseFloat(data.current_price)}
                ticker={instrumentId}
              />
            </TabsContent>
            <TabsContent value="limit">
              <StopLimitContainer
                currentPrice={parseFloat(data.current_price)}
              />
            </TabsContent>
            <TabsContent value="sl_tp"></TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

function OrderSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-6 w-24 " />
        <Skeleton className="h-6 w-36 " />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-40 " />
    </div>
  );
}
