import { z } from 'zod';

export const orderUpdateSchema = z.object({
  type: z.literal('order_update'),
  data: z.object({
    tickers: z.array(z.string()),
  }),
});
