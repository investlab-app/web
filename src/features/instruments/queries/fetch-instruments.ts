import { pagedInstruments } from '../types/paged-instruments';
import { httpRequest } from '@/features/shared/queries/http-request';

interface FetchInstrumentsProps {
  ordering?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

async function fetchInstruments({
  ordering,
  page,
  pageSize,
  search,
}: FetchInstrumentsProps) {
  const params = {
    ordering,
    page,
    page_size: pageSize,
    search,
  };
  return httpRequest({
    endpoint: `/api/instruments`,
    searchParams: params,
    validator: pagedInstruments,
  });
}

export const instrumentsQueryOptions = (props: FetchInstrumentsProps) => ({
  queryKey: ['instruments', props],
  queryFn: () => fetchInstruments(props),
});
