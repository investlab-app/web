import { useTranslation } from 'react-i18next';
import { useInstrumentNews } from '../hooks/use-instrument-news';
import { BuySellContainer } from './buy-sell-action';
import type { Instrument } from '../types/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { StockChartContainer } from '@/features/charts/components/stock-chart-container';

type NewsSectionProps = {
  ticker: string;
};

const NewsSection = ({ ticker }: NewsSectionProps) => {
  const { t } = useTranslation();
  const { news, loading, error } = useInstrumentNews({ ticker });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('instruments.news')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </CardContent>
      </Card>
    );
  }

  if (error || news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('instruments.news')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            {error || 'No news available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const firstNews = news[0];
  const thumbnailUrl = firstNews.content.thumbnail?.original_url || 
                      (firstNews.content.thumbnail?.resolutions?.[0] as { url: string } | undefined)?.url;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('instruments.news')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={firstNews.content.thumbnail?.caption || 'news thumbnail'}
              className="w-20 h-20 rounded object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="flex-1">
            <div className="font-semibold">
              {firstNews.content.title || 'No title available'}
            </div>
            <div className="text-muted-foreground text-sm mt-1">
              {firstNews.content.description || firstNews.content.summary || 'No description available'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {firstNews.content.pub_date 
                ? formatTimeAgo(firstNews.content.pub_date)
                : firstNews.content.display_time || 'Unknown time'
              }
            </div>
            {firstNews.content.provider?.display_name && (
              <div className="text-xs text-muted-foreground mt-1">
                {firstNews.content.provider.display_name}
              </div>
            )}
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
  const { t } = useTranslation();
  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-left">
        {instrument.name} - {t('instruments.overview')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <StockChartContainer ticker={instrument.symbol} />
        </div>

        <div className="space-y-4 md:space-y-0 md:col-span-1 h-full">
          <BuySellContainer currentPrice={instrument.currentPrice} />
        </div>

        <div className="space-y-4 md:space-y-0 md:col-span-1 h-full">
          <NewsSection ticker={instrument.symbol} />
        </div>
      </div>
    </div>
  );
};

export default InstrumentDetails;

