import { expect, test } from '@playwright/test';
import { clerk } from '@clerk/testing/playwright';
import { cleanCurrentClerkUser, createClerkUser } from './utils';

test('login', async ({ page }) => {
  const user = await createClerkUser();

  await page.goto('/login');

  await page.getByRole('textbox', { name: 'Email' }).click();
  await page
    .getByRole('textbox', { name: 'Email' })
    .fill(user.email_address[0]);

  await page.getByRole('textbox', { name: 'Email' }).press('Tab');

  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);

  await clerk.loaded({ page });

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');

  await cleanCurrentClerkUser(page);
});
