import { expect, test } from '@playwright/test';

// use authed state from global setup
test.use({ storageState: 'playwright/.clerk/user.json' });

test('example', async ({ page }) => {
  // go to protected page
  await page.goto('/instruments');

  // only auth user can see the table header
  await expect(page.getByRole('cell', { name: 'Current price' })).toBeVisible();
});
