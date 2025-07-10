import path from 'node:path';
import { clerk, clerkSetup } from '@clerk/testing/playwright';
import { expect, test as setup } from '@playwright/test';

// Setup must be run serially, this is necessary if Playwright is configured
// to run fully parallel: https://playwright.dev/docs/test-parallel
setup.describe.configure({ mode: 'serial' });

setup('global setup', async () => {
  await clerkSetup({ debug: true });
});

// This is a global setup that authenticates the user and saves the state to
// storage. For more information, see:
// https://clerk.com/docs/testing/playwright/test-authenticated-flows
const authFile = path.join(process.cwd(), 'playwright/.clerk/user.json');

setup('authenticate and save state to storage', async ({ page }) => {
  // Perform authentication steps.
  // This example uses a Clerk helper to authenticate
  await page.goto('/');

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: process.env.E2E_CLERK_USER_EMAIL!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  });

  // go to protected page
  await page.goto('/instruments');

  // only auth user can see the table header
  await expect(page.getByRole('cell', { name: 'Current price' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
