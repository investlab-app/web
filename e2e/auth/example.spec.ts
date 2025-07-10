import { clerk } from '@clerk/testing/playwright';
import { test } from '@playwright/test';
import { cleanClerkUser, createClerkUser } from './utils';

test('example', async ({ page }) => {
  const user = await createClerkUser();

  await page.goto('/');

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: user.email_address[0],
      password: user.password,
    },
  });

  // user is logged in
  // things can be tested here

  await clerk.signOut({ page });

  // user is logged out
  // things can be tested here

  await cleanClerkUser(user.id);
});
