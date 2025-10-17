import { z } from 'zod';

export const instrument = z.object({
  name: z.string(),
  volume: z.number().nullable(),
  currentPrice: z.number().nullable(),
  dayChange: z.number().nullable(),
  symbol: z.string(),
  logo: z.string().nullable(),
  icon: z.string().nullable(),
});
export type Instrument = z.infer<typeof instrument>;
