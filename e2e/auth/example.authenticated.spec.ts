import { clerk } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

// use authed state from global setup
test.use({ storageState: 'playwright/.clerk/user.json' });

test('example', async ({ page }) => {
  // go to protected page
  await expect(page.goto('/instruments')).resolves.toBeTruthy();

  // sign out
  await clerk.signOut({ page });

  // go to protected page
  await page.goto('/instruments');

  // exppect that you are redirected to the home page
  await expect(page.url()).toContain('/');
});
