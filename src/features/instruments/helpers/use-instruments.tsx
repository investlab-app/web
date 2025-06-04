// hooks/useInstruments.ts
import { useEffect, useState } from 'react';
import type { Instrument } from './instrument';
import mockInstrumentData from '@/remote/mocks';

interface UseInstrumentsParams {
  filter?: string;
  page?: number;
  perPage?: number;
}

const useInstruments = ({
  filter = '',
  page = 1,
  perPage = 2,
}: UseInstrumentsParams) => {
  const [data, setData] = useState<Array<Instrument>>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await new Promise((res) => setTimeout(res, 400));

      const filtered = mockInstrumentData.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );

      const paginated = filtered.slice(0, page * perPage);

      setData(paginated);
      setHasMore(paginated.length < filtered.length);
      setLoading(false);
    };

    fetchData();
  }, [filter, page, perPage]);

  return { data, loading, hasMore };
};

export default useInstruments;
