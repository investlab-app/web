import { infiniteQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { pagedInstrumentsWithPrices } from '../types/paged-instruments-with-prices';
import { httpRequest } from '@/features/shared/queries/http-request';

interface FetchInstrumentsWithPricesProps {
  ordering?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function fetchInstrumentsWithPrices({
  ordering,
  page,
  pageSize,
  search,
}: FetchInstrumentsWithPricesProps) {
  const params = {
    ordering,
    page,
    page_size: pageSize,
    search,
  };
  return httpRequest({
    endpoint: `/api/instruments/with-prices`,
    searchParams: params,
    validator: pagedInstrumentsWithPrices,
  });
}

export const instrumentsWithPricesQueryOptions = (
  props: FetchInstrumentsWithPricesProps
) => ({
  queryKey: ['instruments-with-prices', props],
  queryFn: () => fetchInstrumentsWithPrices(props),
});

export const infiniteInstrumentsWithPricesQueryOptions = (
  props: Omit<FetchInstrumentsWithPricesProps, 'page'>
) => {
  return infiniteQueryOptions({
    queryKey: ['instruments-with-prices', props],
    queryFn: ({ pageParam }) =>
      fetchInstrumentsWithPrices({ ...props, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.next ? lastPageParam + 1 : undefined,
    placeholderData: keepPreviousData,
    meta: {
      persist: false,
    },
  });
};
