import { useEffect } from 'react';
import type { Instrument } from '../types/instruments.types';
import { useSSEMessages } from '@/features/shared/hooks/SSEProvider';

// const PAGE_SIZE = 10;

type InstrumentsTableContainerProps = {
  setInstrument: (instrument: Instrument) => void;
  setOpenSheet: (open: boolean) => void;
};

const instruments: Array<Instrument> = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 150,
    dayChange: 1.5,
    volume: 1000000,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 2800,
    dayChange: -0.5,
    volume: 500000,
  },
];

const InstrumentsTableContainer = ({
  setInstrument,
  setOpenSheet,
}: InstrumentsTableContainerProps) => {
  // const { t } = useTranslation();

  // const [search, setSearch] = useState<string>('');
  // const debouncedSearch = useDebounce(search, 500);
  // const [, setPage] = useState(1);
  // useEffect(() => {
  //   setPage(1);
  // }, [debouncedSearch]);

  // const { instruments, loading, hasMore } = useInstruments({
  //   filter: debouncedSearch,
  //   page,
  //   perPage: PAGE_SIZE,
  // });

  const { messages } = useSSEMessages(
    new Set(instruments.map((i) => i.symbol))
  );

  useEffect(() => {
    console.log('Listening to messages for instruments:', instruments);

    messages.forEach((message) => {
      console.log('Received message:', message);
    });
  }, [messages]);

  // const livePrices = useLivePrices();

  // const handleMessage = useCallback((message: string) => {
  //   console.log('Received message:', message);
  //   // try {
  //   //   // Replace single quotes with double quotes to ensure valid JSON
  //   //   const fixedMessage = message.replace(/'/g, '"');
  //   //   const parsed = JSON.parse(fixedMessage);
  //   //   const { id, price, change_percent } = parsed;

  //   //   if (!id || !price || !change_percent) {
  //   //     console.warn('Invalid message format:', parsed);
  //   //     return;
  //   //   }

  //   //   priceUpdatesRef.current[id] = {
  //   //     currentPrice: price,
  //   //     dayChange: change_percent,
  //   //   };
  //   // } catch (error) {
  //   //   console.error('Failed to parse message:', message, error);
  //   // }
  // }, []);

  // useEffect(() => {
  //   console.log('Subscribing to live prices for instruments:', instruments);

  //   const tickers = new Set(instruments.map((instrument) => instrument.symbol));

  //   const handler = {
  //     clientId: crypto.randomUUID(),
  //     symbols: tickers,
  //     handler: handleMessage,
  //   };

  //   livePrices.subscribe(handler);

  //   return () => {
  //     console.log(
  //       'Unsubscribing from live prices for instruments:',
  //       instruments
  //     );
  //     livePrices.unsubscribe(handler);
  //   };
  // }, [instruments]);

  // const handleInstrumentPressed = (asset: Instrument) => {
  //   setInstrument(asset);
  //   setOpenSheet(true);
  // };

  return (
    <h1>This is SSE DEMO</h1>
    // <div className="p-4">
    //   <SearchInput
    //     value={search}
    //     onChange={(e) => setSearch(e.target.value)}
    //     className="w-1/3"
    //     placeholder={t('common.search')}
    //   />
    //   <InstrumentTable
    //     data={instruments}
    //     onInstrumentPressed={handleInstrumentPressed}
    //   />
    //   <div className="flex justify-center mt-4">
    //     {hasMore && (
    //       <Button
    //         onClick={() => setPage((prev) => prev + 1)}
    //         disabled={loading}
    //         className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
    //       >
    //         {loading ? t('common.loading') : t('common.more')}
    //       </Button>
    //     )}
    //   </div>
    // </div>
  );
};

export default InstrumentsTableContainer;
