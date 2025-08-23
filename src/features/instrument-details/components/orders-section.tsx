import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui/tabs';
import { BuySellContainer } from './buy-sell-action';
import { StopLimitContainer } from './stop-limit-action';
import type { InstrumentPrice } from '../types/types';

interface OrdersSectionProps {
  currentPriceData: InstrumentPrice | undefined;
}

export function OrdersSection({ currentPriceData }: OrdersSectionProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'market' | 'limit' | 'sl_tp'>('market');

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-4">
        {t('orders.place_order')}
      </h2>
      {!currentPriceData ? (
        <></>
      ) : 
        (
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
              <StopLimitContainer
                currentPrice={currentPriceData.currentPrice}
              />
            </TabsContent>
            <TabsContent value="sl_tp"></TabsContent>
          </Tabs>
        
      )}
    </div>
  );
}
