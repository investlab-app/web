import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';
import { cleanCurrentClerkUser, getRandomClerkTestEmail } from './utils';

test.use({ storageState: { cookies: [], origins: [] } });

// Wait for async validator to complete (100ms debounce + some buffer)
const ASYNC_VALIDATOR_WAIT_TIME = 200;

test('signup', async ({ page }) => {
  await setupClerkTestingToken({ page });

  await page.goto('/signup');

  const email = getRandomClerkTestEmail();

  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: email,
    password: 'password123',
  };

  await page.getByLabel('First name').click();
  await page.getByLabel('First name').fill(user.firstName);
  await page.getByLabel('First name').press('Tab');
  await page.waitForTimeout(ASYNC_VALIDATOR_WAIT_TIME);

  await page.getByLabel('Last name').click();
  await page.getByLabel('Last name').fill(user.lastName);
  await page.getByLabel('Last name').press('Tab');
  await page.waitForTimeout(ASYNC_VALIDATOR_WAIT_TIME);

  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Email').press('Tab');
  await page.waitForTimeout(ASYNC_VALIDATOR_WAIT_TIME);

  await page.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Password', exact: true })
    .fill(user.password);
  await page
    .getByRole('textbox', { name: 'Password', exact: true })
    .press('Tab');
  await page.waitForTimeout(ASYNC_VALIDATOR_WAIT_TIME);

  await page.getByRole('textbox', { name: 'Confirm password' }).click();
  await page
    .getByRole('textbox', { name: 'Confirm password' })
    .fill(user.password);
  await page.getByRole('textbox', { name: 'Confirm password' }).press('Tab');
  await page.waitForTimeout(ASYNC_VALIDATOR_WAIT_TIME);

  await clerk.loaded({ page });

  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.waitForURL('**/verify-email');

  const otpInput = page.locator('input[data-input-otp="true"]');
  await otpInput.click();
  await otpInput.fill('424242');
  await otpInput.press('Tab');
  await page.waitForTimeout(ASYNC_VALIDATOR_WAIT_TIME);

  await page.getByRole('button', { name: 'Verify email' }).click();

  await page.waitForURL('**/?initial_session=true');

  await clerk.loaded({ page });

  // users email is shown in the sidebar
  await expect(page.getByText(email)).toBeVisible();

  await cleanCurrentClerkUser(page);
});
