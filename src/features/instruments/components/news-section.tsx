import { useTranslation } from 'react-i18next';
import { useInstrumentNews } from '../hooks/use-instrument-news';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/components/ui/card';

type NewsSectionProps = {
  ticker: string;
};

const NewsSection = ({ ticker }: NewsSectionProps) => {
  const { t } = useTranslation();
  const { news, loading, error } = useInstrumentNews({ ticker });
  const MAX_NEWS_ITEMS = 2;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('instruments.news')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.slice(0, MAX_NEWS_ITEMS).map((newsItem, index) => {
            const thumbnailUrl =
              newsItem.content.thumbnail?.original_url ||
              (
                newsItem.content.thumbnail?.resolutions[0] as
                  | { url: string }
                  | undefined
              )?.url;

            return (
              <div
                key={index}
                className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
              >
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt={
                      newsItem.content.thumbnail?.caption || 'news thumbnail'
                    }
                    className="w-20 h-20 rounded object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold line-clamp-2">
                    {newsItem.content.title || 'No title available'}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1 line-clamp-3">
                    {newsItem.content.description ||
                      newsItem.content.summary ||
                      t('instruments.no_description_available')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {newsItem.content.pub_date
                      ? formatTimeAgo(newsItem.content.pub_date)
                      : newsItem.content.display_time || 'Unknown time'}
                  </div>
                  {newsItem.content.provider?.display_name && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {newsItem.content.provider.display_name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
