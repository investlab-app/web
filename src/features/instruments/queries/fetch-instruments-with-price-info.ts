import { infiniteQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { pagedInstrumentsWithPriceInfo } from '../types/paged-instruments-with-price-info';
import { httpRequest } from '@/features/shared/queries/http-request';

interface FetchInstrumentsWithPriceInfoProps {
  ordering?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function fetchInstrumentsWithPriceInfo({
  ordering,
  page,
  pageSize,
  search,
}: FetchInstrumentsWithPriceInfoProps) {
  const params = {
    ordering,
    page,
    page_size: pageSize,
    search,
  };
  return httpRequest({
    endpoint: `/api/instruments/with-price-info`,
    searchParams: params,
    validator: pagedInstrumentsWithPriceInfo,
  });
}

export const instrumentsWithPriceInfoQueryOptions = (
  props: FetchInstrumentsWithPriceInfoProps
) => ({
  queryKey: ['instruments-with-price-info', props],
  queryFn: () => fetchInstrumentsWithPriceInfo(props),
});

export const infiniteInstrumentsWithPriceInfoQueryOptions = (
  props: Omit<FetchInstrumentsWithPriceInfoProps, 'page'>
) => {
  return infiniteQueryOptions({
    queryKey: ['instruments-with-price-info', props],
    queryFn: ({ pageParam }) =>
      fetchInstrumentsWithPriceInfo({ ...props, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.next ? lastPageParam + 1 : undefined,
    placeholderData: keepPreviousData,
    meta: {
      persist: false,
    },
  });
};
