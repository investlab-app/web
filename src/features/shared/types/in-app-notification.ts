import { z } from 'zod';

export const inAppNotification = z.object({
  notification: z.object({
    type: z.string(),
    title: z.string(),
    body: z.string(),
  }),
});

export type InAppNotification = z.infer<typeof inAppNotification>;
