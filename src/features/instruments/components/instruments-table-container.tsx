import { useCallback, useEffect } from 'react';
// import type { Instrument } from '@/routes/instruments-page';
import { useLivePrices } from '@/hooks/use-sse.ts';

// const PAGE_SIZE = 10;

// type Props = {
//   setOpenSheet: (open: boolean) => void;
//   setInstrument: (instrument: typeof Instrument.infer) => void;
// };

const InstrumentsTableContainer = () => {
  // const { t } = useTranslation();

  // const [search, setSearch] = useState('');
  // const debouncedSearch = useDebounce(search, 500); // only update filter after 500ms pause

  // const [page, setPage] = useState(1);

  // const { instruments, loading, hasMore } = useInstruments({
  //   filter: debouncedSearch,
  //   page,
  //   perPage: PAGE_SIZE,
  // });

  // const tickers = instruments.map((instrument) => instrument.symbol);

  const livePrices = useLivePrices();
  
  const handleMessage = useCallback((message: string) => {
    console.log('Received SSE message:', message);
  }, []);
  
  useEffect(() => {
    const tickers = ['AAPL', 'MSFT', 'GOOGL'];
    
    const handler = {
      symbols: tickers,
      callback: handleMessage,
    };

    console.log('Subscribing to live prices for:', tickers);
    livePrices.subscribe(handler);

    return () => {
      livePrices.unsubscribe(handler);
    };
  }, [livePrices, handleMessage]);

  // Avoid unused parameter warnings
  // console.log('Props available:', { setOpenSheet, setInstrument });

  // const priceUpdatesRef = useRef<Record<string, Partial<Instrument>>>({});

  // tickers.forEach((ticker) => {
  //   const tickerMessages = messages[ticker];
  //   if (tickerMessages && tickerMessages.length > 0) {
  //     const latestRaw = tickerMessages[tickerMessages.length - 1];
  //     try {
  //       // const parsed = JSON.parse(latestRaw.replace(/'/g, '"'));

  //       // priceUpdatesRef.current[ticker] = {
  //       //   currentPrice: parsed.price,
  //       //   dayChange: parsed.change_percent,
  //       // };
  //     } catch (e) {
  //       console.warn('Invalid SSE message for', ticker, latestRaw);
  //     }
  //   }
  // });

  // useEffect(() => {
  //   setPage(1); // reset to page 1 whenever search changes
  // }, [debouncedSearch]);

  // const handleLoadMore = () => {
  //   setPage((prev) => prev + 1);
  // };

  // const handleInstrumentPressed = (asset: Instrument) => {
  //   console.log('Instrument clicked:', asset);
  //   setInstrument(asset);
  //   setOpenSheet(true);
  // };

  // const mergedData = instruments;
  // .map((instrument) => {
  //   const updates = priceUpdatesRef.current[instrument.symbol] || {};
  //   return {
  //     ...instrument,
  //     ...updates,
  //   };
  // });

  return (
    <div className="p-4">
      {/* <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3"
        placeholder={t('common.search')}
      />
      <InstrumentTable
        data={mergedData}
        onInstrumentPressed={handleInstrumentPressed}
      />
      <div className="flex justify-center mt-4">
        {hasMore && (
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {loading ? t('common.loading') : t('common.more')}
          </Button>
        )}
      </div> */}
    </div>
  );
};

export default InstrumentsTableContainer;
