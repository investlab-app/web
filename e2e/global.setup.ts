import path from 'node:path';
import { clerk, clerkSetup } from '@clerk/testing/playwright';
import { expect, test as setup } from '@playwright/test';

// Setup must be run serially, this is necessary if Playwright is configured
// to run fully parallel: https://playwright.dev/docs/test-parallel
setup.describe.configure({ mode: 'serial' });

setup('global setup', async () => {
  await clerkSetup();
});

// This is a global setup that authenticates the user and saves the state to
// storage. For more information, see:
// https://clerk.com/docs/testing/playwright/test-authenticated-flows
const authFile = path.join(process.cwd(), 'playwright/.clerk/user.json');

setup('authenticate and save state to storage', async ({ page }) => {
  const clerkUserEmail = process.env.E2E_CLERK_USER_EMAIL!;
  const clerkUserPassword = process.env.E2E_CLERK_USER_PASSWORD!;

  // Perform authentication steps.
  // This example uses a Clerk helper to authenticate
  await page.goto('/');

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: clerkUserEmail,
      password: clerkUserPassword,
    },
  });

  // users email is shown in the sidebar
  await expect(page.getByText(clerkUserEmail)).toBeVisible();

  await page.context().storageState({ path: authFile });
});
