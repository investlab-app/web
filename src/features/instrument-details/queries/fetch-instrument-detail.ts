import { queryOptions } from '@tanstack/react-query';
import { instrumentDetail } from '../types/instrument-detail';
import { httpRequest } from '@/features/shared/queries/http-request';

interface FetchInstrumentDetailProps {
  cik?: string;
  compositeFigi?: string;
  id?: string;
  shareClassFigi?: string;
  ticker?: string;
}

async function fetchInstrumentDetail({
  cik,
  compositeFigi,
  id,
  shareClassFigi,
  ticker,
}: FetchInstrumentDetailProps) {
  const params = {
    cik,
    composite_figi: compositeFigi,
    id,
    share_class_figi: shareClassFigi,
    ticker,
  };
  return httpRequest({
    endpoint: `api/instruments/detail/`,
    searchParams: params,
    validator: instrumentDetail,
  });
}

export function instrumentDetailQueryOptions(
  props: FetchInstrumentDetailProps
) {
  return queryOptions({
    queryKey: ['instrument-detail', props],
    queryFn: () => fetchInstrumentDetail(props),
  });
}
