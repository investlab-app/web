import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { newsListOptions } from '@/client/@tanstack/react-query.gen';
import { EmptyMessage } from '@/features/shared/components/empty-message';
import { ErrorMessage } from '@/features/shared/components/error-message';

type NewsSectionProps = {
  ticker: string;
  className?: string;
};

const MAX_NEWS_ITEMS = 3;

export function NewsSection({ ticker, className }: NewsSectionProps) {
  const { t } = useTranslation();

  const {
    data: news,
    isPending,
    isSuccess,
    isError,
  } = useQuery(
    newsListOptions({
      query: {
        ticker,
      },
    })
  );

  return (
    <Card className={className}>
      <NewsHeader />
      <CardContent>
        {isError && (
          <ErrorMessage
            className="text-muted-foreground"
            message={t('instruments.errors.news_unavailable')}
          />
        )}
        {isPending && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: MAX_NEWS_ITEMS }).map((_, index) => (
              <div
                key={index}
                className="pb-4 border-b border-border last:border-b-0 last:pb-0"
              >
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded flex-shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isSuccess &&
          (news.length === 0 ? (
            <EmptyMessage
              className="text-muted-foreground"
              message={t('instruments.errors.news_unavailable')}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {news.slice(0, MAX_NEWS_ITEMS).map((newsItem, index) => {
                return (
                  <div
                    key={index}
                    className="pb-4 border-b border-border last:border-b-0 last:pb-0"
                  >
                    <Link
                      to={newsItem.article_url ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 hover:[&_h3]:underline"
                    >
                      {newsItem.image_url && (
                        <img
                          src={newsItem.image_url}
                          className="w-20 h-20 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        <h3 className="font-bold line-clamp-2">
                          {newsItem.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {newsItem.description}
                        </p>
                        <span className="text-xs text-muted-foreground block">
                          {newsItem.published_utc
                            ? formatTimeAgo(newsItem.published_utc, t)
                            : t('common.unknown_date')}
                          <span className="mx-2">|</span>
                          {newsItem.author}
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

function NewsHeader() {
  const { t } = useTranslation();
  return (
    <CardHeader>
      <CardTitle>{t('instruments.news')}</CardTitle>
    </CardHeader>
  );
}

function formatTimeAgo(dateString: string, t: (key: string, options?: any) => string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return t('common.time_ago.less_than_hour');
  if (diffInHours < 24) {
    return t(diffInHours === 1 ? 'common.time_ago.hour' : 'common.time_ago.hours', { count: diffInHours });
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return t(diffInDays === 1 ? 'common.time_ago.day' : 'common.time_ago.days', { count: diffInDays });
}
