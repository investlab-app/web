import { z } from 'zod';

export const llmSchema = z.object({
  type: z.literal('llm'),
  data: z.discriminatedUnion('state', [
    z.object({
      state: z.literal('streaming'),
      chunk: z.string(),
      chat_id: z.string(),
    }),
    z.object({
      state: z.literal('start'),
      chat_id: z.string(),
    }),
    z.object({
      state: z.literal('end'),
      chat_id: z.string(),
    }),
    z.object({
      state: z.literal('error'),
      error_type: z.string(),
      chat_id: z.string(),
    }),
  ]),
});

export type LlmMessage = z.infer<typeof llmSchema>;
