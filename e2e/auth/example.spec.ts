import { clerk } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';
import { cleanClerkUser, createClerkUser } from './utils';

test.use({ storageState: { cookies: [], origins: [] } });

let user: Awaited<ReturnType<typeof createClerkUser>> | null = null;

test.beforeAll(async () => {
  user = await createClerkUser();
});

test('example', async ({ page }) => {
  if (!user) throw new Error('User not created');

  await page.goto('/');

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: user.email_address[0],
      password: user.password,
    },
  });

  // users email is shown in the sidebar
  await expect(page.getByText(user.email_address[0])).toBeVisible();

  await clerk.signOut({ page });
});

test.afterAll(async () => {
  if (!user) throw new Error('User not created');

  await cleanClerkUser(user.id);
});
