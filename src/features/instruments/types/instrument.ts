import { z } from 'zod';

export const instrument = z.object({
  id: z.string().uuid(),
  name: z.string(),
  volume: z.number().nullable(),
  currentPrice: z.number().nullable(),
  dayChange: z.number().nullable(),
  symbol: z.string(),
  logo: z.string().nullable(),
  icon: z.string().nullable(),
  is_watched: z.boolean().default(false),
});
export type Instrument = z.infer<typeof instrument>;
