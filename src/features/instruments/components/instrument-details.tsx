// components/NetflixDetailView.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { StockChartContainer } from "@/features/charts/components/stock-chart-container";


const BuySellSection = () => {
  return (
    <Card className="space-y-4">
      <CardContent className="space-y-4 pt-4">
        <Tabs defaultValue="limit" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="limit">Limit</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="stop">Stop Limit</TabsTrigger>
          </TabsList>
        </Tabs>

        <Input placeholder="Price" />
        <Input placeholder="Size" />

        <div className="flex justify-between gap-4">
          <Button className="bg-green-600 hover:bg-green-700 w-full">Buy/Long</Button>
          <Button className="bg-red-600 hover:bg-red-700 w-full">Sell/Short</Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>Cost 0.00 USDT</div>
          <div>Max 0.000 BTC</div>
        </div>
      </CardContent>
    </Card>
  );
};

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
              Netflix is joining its streaming rivals in testing the amount and types of advertisements
              its subscribers are willing to endure for lower...
            </div>
            <div className="text-xs text-muted-foreground mt-1">16 hours ago</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InstrumentDetails = () => {
    return (
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-semibold text-left">AAPL Overview</h2>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <StockChartContainer ticker="AAPL" />
            </div>
      
            <div className="space-y-4 md:space-y-0 md:col-span-1">
              <BuySellSection />
            </div>
      
            <div className="space-y-4 md:space-y-0 md:col-span-1">
              <NewsSection />
            </div>
          </div>
        </div>
      );
      
};

export default InstrumentDetails;