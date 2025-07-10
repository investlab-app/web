import { clerk } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

test('example', async ({ page }) => {
  const clerkUserEmail = process.env.E2E_CLERK_USER_EMAIL!;

  // go to protected route
  await page.goto('/instruments');

  // users email is shown in the sidebar
  await expect(page.getByText(clerkUserEmail)).toBeVisible();

  // sign out
  await clerk.signOut({ page });

  // exppect that you are redirected to the home page
  expect(page.url()).toContain('/');
});
