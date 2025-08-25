interface UseLiveInstrumentsProps {
  symbols: Array<string>;
}

function useLiveInstruments({ symbols }: UseLiveInstrumentsProps) {
  // TODO: THIS HAS TO GET REPLACED BY WEBSOCKET and should return an array of live instrument data
  // i need to mingle with it to get it right and nice

  // const [liveInstruments, setLiveInstruments] = useState<
  //   Record<string, Instrument>
  // >({});
  // // Create a stable key based on instruments content to avoid infinite loops
  // const instrumentsKey = useMemo(
  //   () =>
  //     instruments
  //       .map((i) => `${i.symbol}-${i.name}`)
  //       .sort()
  //       .join('|'),
  //   [instruments]
  // );

  // useEffect(() => {
  //   const instrumentsMap = {} as Record<string, Instrument>;
  //   instruments.forEach((instrument) => {
  //     instrumentsMap[instrument.symbol] = { ...instrument };
  //   });
  //   setLiveInstruments(instrumentsMap);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [instrumentsKey]); // Use stable key instead of instruments array

  // const tickers = instruments.map((i) => i.symbol);

  // const tickersSet = useMemo(
  //   () => {
  //     return new Set(tickers.map((ticker) => `PRICE_UPDATE_${ticker}`));
  //   },
  //   [tickers.join(',')] // eslint-disable-line react-hooks/exhaustive-deps
  // );

  // const sseCallback = useCallback(
  //   (data: string) => {
  //     const fixedMessage = data.replace(/'/g, '"');

  //     const out = livePriceDataDTO(JSON.parse(fixedMessage));

  //     if (out instanceof type.errors) {
  //       console.error('Invalid live price data received:', out);
  //       return;
  //     }

  //     setLiveInstruments((prev) => {
  //       const updated = { ...prev };
  //       updated[out.id] = {
  //         ...updated[out.id],
  //         currentPrice: out.price,
  //         dayChange: out.change || updated[out.id].dayChange,
  //       };
  //       return updated;
  //     });
  //   },
  //   [setLiveInstruments]
  // );

  // const { cleanup: cleanupSSE } = useSSE({
  //   events: tickersSet,
  //   callback: sseCallback,
  // });

  // useEffect(() => {
  //   return cleanupSSE;
  // }, [cleanupSSE]);

  // // Merge live price data with instruments data
  // const tableData = useMemo(() => {
  //   return instruments.map((instrument) => ({
  //     ...instrument,
  //     ...liveInstruments[instrument.symbol],
  //   }));
  // }, [instruments, liveInstruments]);

  return { symbols };
}

export default useLiveInstruments;
