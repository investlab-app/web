import { clerk } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

// use authed state from global setup
test.use({ storageState: 'playwright/.clerk/user.json' });

test('example', async ({ page }) => {
  // go to protected page
  await expect(page.goto('/instruments')).resolves.toBeTruthy();

  // sign out
  await clerk.signOut({ page });

  // exppect that you are redirected to the home page
  expect(page.url()).toContain('/');
});
