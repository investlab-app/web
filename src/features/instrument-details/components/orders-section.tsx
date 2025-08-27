import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BuySellContainer } from './buy-sell-action';
import { StopLimitContainer } from './stop-limit-action';
import type { InstrumentPrice } from '../types/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { Message } from '@/features/shared/components/error-message';

interface OrdersSectionProps {
  currentPriceData: InstrumentPrice | undefined;
  isError: boolean;
}

export function OrdersSection({
  currentPriceData,
  isError,
}: OrdersSectionProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'market' | 'limit' | 'sl_tp'>('market');

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-4">
        {t('orders.place_order')}
      </h2>
      {isError ? (
        <Message message={t('orders.current_price_error')} />
      ) : !currentPriceData ? (
        <OrderSectionSkeleton />
      ) : (
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as 'market' | 'limit' | 'sl_tp')}
        >
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
            <BuySellContainer currentPrice={currentPriceData.currentPrice} />
          </TabsContent>
          <TabsContent value="limit">
            <StopLimitContainer currentPrice={currentPriceData.currentPrice} />
          </TabsContent>
          <TabsContent value="sl_tp"></TabsContent>
        </Tabs>
      )}
    </div>
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
