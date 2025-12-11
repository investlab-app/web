import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class WalletPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get walletSection() {
    return this.page.locator('[data-slot="sidebar-menu-item"]');
  }

  private get addMoneyButton() {
    return this.page
      .locator('[data-slot="sidebar"]')
      .getByRole('button', { name: /add/i });
  }

  private get depositDialog() {
    return this.page.getByRole('dialog');
  }

  private get depositAmountInput() {
    return this.depositDialog.locator('#deposit-amount');
  }

  private get depositButton() {
    return this.depositDialog.getByRole('button', { name: /deposit/i }).last();
  }

  async getWalletBalance(): Promise<number> {
    const walletText = await this.walletSection
      .locator('span.cursor-help')
      .textContent();
    if (!walletText) return 0;
    const cleanedText = walletText.replace(/[^0-9.,]/g, '');
    return parseFloat(cleanedText.replace(/,/g, '')) || 0;
  }

  async openDepositDialog() {
    await this.addMoneyButton.click();
    await this.depositDialog.waitFor({ state: 'visible' });
  }

  async fillDepositAmount(amount: number) {
    await this.depositAmountInput.clear();
    await this.depositAmountInput.fill(amount.toFixed(2));
  }

  async submitDeposit() {
    await this.depositButton.click();
  }

  async deposit(amount: number) {
    await this.openDepositDialog();
    await this.fillDepositAmount(amount);
    await this.submitDeposit();
    // Wait for dialog to close
    await this.depositDialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async waitForBalanceUpdate(previousBalance: number, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const currentBalance = await this.getWalletBalance();
      if (currentBalance !== previousBalance) {
        return currentBalance;
      }
      await this.page.waitForTimeout(500);
    }
    return await this.getWalletBalance();
  }

  async assertDepositSuccessToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast]')
        .filter({ hasText: /deposit|success/i })
    ).toBeVisible({ timeout: 10000 });
  }

  async assertDepositErrorToast() {
    await expect(
      this.page.locator('[data-sonner-toast]').filter({ hasText: /maximum/i })
    ).toBeVisible({ timeout: 10000 });
  }

  async assertDialogVisible() {
    await expect(this.depositDialog).toBeVisible();
  }

  async assertDialogHidden() {
    await expect(this.depositDialog).toBeHidden();
  }
}
