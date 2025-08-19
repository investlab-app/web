import { type } from 'arktype';

export const inAppNotification = type({
  notification: type({
    type: 'string',
    title: 'string',
    body: 'string',
  }),
});
export type InAppNotification = typeof inAppNotification.infer;
