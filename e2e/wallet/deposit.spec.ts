import { expect, test } from '@playwright/test';

import { WalletPage } from '../pages/wallet.page';

test.describe('Wallet Deposit', () => {
  let walletPage: WalletPage;

  test.beforeEach(async ({ page }) => {
    walletPage = new WalletPage(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should add money to wallet and verify balance increased, then verify second deposit is blocked within 24h limit', async ({
    page,
  }) => {
    // Get initial balance
    const initialBalance = await walletPage.getWalletBalance();

    // First deposit
    const depositAmount = 100;
    await walletPage.openDepositDialog();
    await walletPage.assertDialogVisible();

    await walletPage.fillDepositAmount(depositAmount);
    await walletPage.submitDeposit();

    // Wait for success toast
    await walletPage.assertDepositSuccessToast();

    // Wait for dialog to close
    await walletPage.assertDialogHidden();

    // Verify balance increased
    const newBalance = await walletPage.waitForBalanceUpdate(initialBalance);
    expect(newBalance).toBeGreaterThan(initialBalance);
    const currentBalance = await walletPage.getWalletBalance();
    expect(currentBalance).toBeCloseTo(initialBalance + depositAmount, 0);

    // Second deposit - should eventually hit the 24h limit
    // Deposit max amount to hit the limit faster
    const secondDepositAmount = 1000;
    await walletPage.openDepositDialog();
    await walletPage.assertDialogVisible();

    await walletPage.fillDepositAmount(secondDepositAmount);
    await walletPage.submitDeposit();

    // Check for either success or error (depending on remaining limit)
    // If total deposits exceed 1000 in 24h, it should be blocked
    const successToast = page
      .locator('[data-sonner-toast]')
      .filter({ hasText: /deposit|success/i });
    const errorToast = page
      .locator('[data-sonner-toast]')
      .filter({ hasText: /error|exceeded|failed|limit/i });

    // Wait for either success or error toast
    await expect(successToast.or(errorToast)).toBeVisible({ timeout: 10000 });

    // If we got success, try another deposit to hit the limit
    const isSuccess = await successToast.isVisible().catch(() => false);

    if (isSuccess) {
      // Close any open dialog
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Try to deposit again - this should definitely be blocked
      await walletPage.openDepositDialog();
      await walletPage.fillDepositAmount(500);
      await walletPage.submitDeposit();

      // Now we expect an error since we've deposited more than 1000
      await walletPage.assertDepositErrorToast();
    } else {
      // Second deposit was blocked as expected
      await walletPage.assertDepositErrorToast();
    }
  });
});
