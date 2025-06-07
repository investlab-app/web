// components/NetflixDetailView.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';
import { TabsContent } from '@radix-ui/react-tabs';
import { NumberInput } from '@/components/ui/number-input';
import { useCallback, useState } from 'react';
import { BuySellContainer, BuySellSection } from './buy-sell-section';
import type { Instrument } from '../helpers/instrument';

const NewsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <img
            src="https://image.tmdb.org/t/p/w185/5zmiBoMzeeVdQ62no55JOJMY498.jpg"
            alt="news thumbnail"
            className="w-20 h-20 rounded object-cover"
          />
          <div>
            <div className="font-semibold">
              Netflix will show generative AI ads midway through streams in 2026
            </div>
            <div className="text-muted-foreground text-sm mt-1">
              Netflix is joining its streaming rivals in testing the amount and
              types of advertisements its subscribers are willing to endure for
              lower...
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              16 hours ago
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type InstrumentDetailsProps = {
  instrument: Instrument;
};

const InstrumentDetails = ({ instrument }: InstrumentDetailsProps) => {
  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-left">
        {instrument.name}L Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <StockChartContainer ticker={instrument.name} />
        </div>

        <div className="space-y-4 md:space-y-0 md:col-span-1 h-full">
          <BuySellContainer currentPrice={instrument.currentPrice} />
        </div>

        <div className="space-y-4 md:space-y-0 md:col-span-1 h-full">
          <NewsSection />
        </div>
      </div>
    </div>
  );
};

export default InstrumentDetails;
