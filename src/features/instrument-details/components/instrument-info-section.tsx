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

interface InstrumentInfoSectionProps {
  instrumentData: InstrumentInfo | undefined;
}

export function InstrumentInfoSection({
  instrumentData,
}: InstrumentInfoSectionProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-4">
        {t('instruments.general_info')}
      </h2>
      {!instrumentData ? (
        <InstrumentInfoSkeleton />
      ) : (
        <Card className="mt-1">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-8">
              <div className="text-lg">{instrumentData.ticker}</div>
              <div>
                {t('instruments.exchange')}: {instrumentData.market}
              </div>
              <div>
                {' '}
                {t('instruments.sector')}: {instrumentData.sector}
              </div>
            </CardTitle>
            <CardDescription>
              {t('instruments.market_capital')}: {instrumentData.market_cap}{' '}
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
