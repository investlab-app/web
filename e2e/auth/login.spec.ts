import { expect, test } from '@playwright/test';
import { clerk } from '@clerk/testing/playwright';
import { cleanCurrentClerkUser, createClerkUser } from './utils';

test.use({ storageState: { cookies: [], origins: [] } });

const ASYNC_VALIDATOR_WAIT_TIME = 200;

test('login', async ({ page }) => {
  const user = await createClerkUser();

  await page.goto('/login');

  await page.getByRole('textbox', { name: 'Email' }).click();
  await page
    .getByRole('textbox', { name: 'Email' })
    .fill(user.email_address[0]);
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.waitForTimeout(ASYNC_VALIDATOR_WAIT_TIME);

  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('textbox', { name: 'Password' }).press('Tab');
  await page.waitForTimeout(ASYNC_VALIDATOR_WAIT_TIME);

  await clerk.loaded({ page });

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');

  // users email is shown in the sidebar
  await expect(page.getByText(user.email_address[0])).toBeVisible();

  await cleanCurrentClerkUser(page);
});
