import { useMemo } from 'react';
import {
  type UseInstrumentsOptions,
  type UseInstrumentsReturn,
} from '../types/instruments.types';
import { useAvailableInstruments } from '../hooks/use-available-instruments';
import { useInstrumentPages } from '../hooks/use-instrument-pages';

export const useInstruments = ({
  filter = '',
  page,
  perPage,
  sector,
  sortBy,
  sortDirection,
}: UseInstrumentsOptions): UseInstrumentsReturn => {
  const {
    data: availableInstruments = [],
    isLoading: availableInstrumentsLoading,
    error: availableInstrumentsError,
  } = useAvailableInstruments();

  const filteredTickers = useMemo(() => {
    if (!filter?.trim()) return availableInstruments;
    console.log(`availableInstruments: ${availableInstruments}`);
    return availableInstruments.filter((ticker) =>
      ticker.toLowerCase().includes(filter.toLowerCase().trim())
    );
  }, [availableInstruments, filter]);

  const instrumentPages = useInstrumentPages({
    tickers: filteredTickers,
    page,
    perPage,
    sector,
    sortBy,
    sortDirection,
  });

  const combinedData = useMemo(() => {
    let allInstruments: any[] = [];
    let totalItems = 0;
    let numPages = 0;
    let hasError = false;
    let errorMessage: string | null = null;
    let isLoading = false;

    for (const query of instrumentPages) {
      if (query.isLoading) isLoading = true;
      if (query.error) {
        hasError = true;
        errorMessage =
          query.error instanceof Error
            ? query.error.message
            : 'Failed to load instruments';
        break;
      }
      if (query.data) {
        allInstruments = [...allInstruments, ...query.data.instruments];
        totalItems = query.data.total;
        numPages = query.data.numPages;
      }
    }

    return {
      instruments: allInstruments,
      loading: isLoading,
      error: errorMessage,
      totalItems,
      numPages,
      hasMore: page < numPages,
    };
  }, [instrumentPages, page]);

  const error = availableInstrumentsError
    ? availableInstrumentsError instanceof Error
      ? availableInstrumentsError.message
      : 'Failed to load available instruments'
    : combinedData.error;

  return {
    instruments: combinedData.instruments,
    loading: availableInstrumentsLoading || combinedData.loading,
    hasMore: combinedData.hasMore,
    availableInstruments,
    availableInstrumentsLoading,
    error,
    totalItems: combinedData.totalItems,
    numPages: combinedData.numPages,
  };
};
