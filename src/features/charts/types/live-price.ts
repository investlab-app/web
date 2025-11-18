import { z } from 'zod';

export const livePrice = z.object({
  type: z.literal('prices'),
  data: z.array(
    z.object({
      symbol: z.string(),
      volume: z.number(),
      accumulated_volume: z.number(),
      official_open_price: z.number(),
      vwap: z.number(),
      open: z.number(),
      close: z.number(),
      high: z.number(),
      low: z.number(),
      aggregate_vwap: z.number(),
      average_size: z.number(),
      start_timestamp: z.number(),
      end_timestamp: z.number(),
    })
  ),
});

export type LivePrice = z.infer<typeof livePrice>;
