import { clerk } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';
import { cleanClerkUser, createClerkUser } from './utils';

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

  // go to protected page
  await page.goto('/instruments');

  // only auth user can see the table header
  await expect(page.getByRole('cell', { name: 'Current price' })).toBeVisible();

  await clerk.signOut({ page });
});

test.afterAll(async () => {
  if (!user) throw new Error('User not created');

  await cleanClerkUser(user!.id);
});
