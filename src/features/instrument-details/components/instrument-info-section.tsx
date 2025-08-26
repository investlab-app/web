import { useTranslation } from 'react-i18next';
import type { InstrumentInfo } from '../types/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Skeleton } from '@/features/shared/components/ui/skeleton';
import { Message } from '@/features/shared/components/error-message';

interface InstrumentInfoSectionProps {
  instrumentData: InstrumentInfo | undefined;
  isError: boolean;
}

export function InstrumentInfoSection({
  instrumentData,
  isError,
}: InstrumentInfoSectionProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-4">
        {t('instruments.general_info')}
      </h2>
      {isError ? (
        <Message message={t('instruments.errors.info_loading')} />
      ) : !instrumentData ? (
        <InstrumentInfoSkeleton />
      ) : (
        <Card className="mt-1">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-8">
              <div className="text-lg">{instrumentData.ticker}</div>

              <div className="text-sm text-gray-500">
                <span>{t('instruments.exchange')}:</span>{' '}
                <span className="text-black">{instrumentData.market}</span>
              </div>

              <div className="text-sm text-gray-500">
                <span>{t('instruments.sector')}:</span>{' '}
                <span className="text-black">{instrumentData.sector}</span>
              </div>
            </CardTitle>
            <CardDescription>
              {t('instruments.market_capital')}:{' '}
              <span className="text-black font-bold">
                {instrumentData.market_cap}
              </span>{' '}
              {instrumentData.currency_name}
            </CardDescription>
          </CardHeader>
          <CardContent>{instrumentData.description}</CardContent>
        </Card>
      )}
    </div>
  );
}

function InstrumentInfoSkeleton() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent className="h-20">
        <Skeleton className="w-full h-full" />
      </CardContent>
    </Card>
  );
}
