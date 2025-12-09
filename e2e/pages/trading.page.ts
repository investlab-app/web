import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class TradingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get orderTypeSelect() {
    return this.page
      .locator('[role="combobox"]')
      .filter({ hasText: /market|limit/i });
  }

  private get priceInput() {
    return this.page.locator('input[placeholder="0.00"]').first();
  }

  private get volumeInput() {
    return this.page.locator('input[placeholder="0.00000"]');
  }

  private get buyButton() {
    return this.page.getByRole('button', { name: /^buy$/i });
  }

  private get sellButton() {
    return this.page.getByRole('button', { name: /^sell$/i });
  }

  private get confirmOrderButton() {
    return this.page
      .getByRole('dialog')
      .getByRole('button', { name: /confirm|yes/i });
  }

  private get orderDialog() {
    return this.page.getByRole('dialog');
  }

  private get pendingOrdersSection() {
    return this.page.locator('section').filter({ hasText: /pending.*orders/i });
  }

  private get transactionHistorySection() {
    return this.page
      .locator('[data-slot="card"]')
      .filter({ hasText: /transaction.*history/i });
  }

  private get walletSection() {
    return this.page
      .locator('[data-slot="sidebar-menu-item"]')
      .filter({ hasText: /wallet/i });
  }

  async navigateToInstrument(ticker: string) {
    await this.page.goto(`/instruments/${ticker}`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageReady() {
    // Wait for order form to load
    await this.page.waitForTimeout(2000);
    await expect(this.buyButton).toBeVisible({ timeout: 15000 });
  }

  async selectMarketOrder() {
    await this.orderTypeSelect.click();
    await this.page.getByRole('option', { name: /market/i }).click();
    await this.page.waitForTimeout(500);
  }

  async selectLimitOrder() {
    await this.orderTypeSelect.click();
    await this.page.getByRole('option', { name: /limit|stop/i }).click();
    await this.page.waitForTimeout(500);
  }

  async setOrderAmount(amount: number) {
    const input = this.priceInput;
    await input.clear();
    await input.fill(amount.toString());
  }

  async setOrderVolume(volume: number) {
    // First switch to volume mode if needed
    const modeToggle = this.page
      .getByRole('button', { name: /switch/i })
      .or(
        this.page
          .locator('button')
          .filter({ has: this.page.locator('svg.lucide-arrow-up-down') })
      );

    // Check if we're in price mode (input has $ prefix)
    const isPriceMode = await this.priceInput.isVisible();
    if (isPriceMode) {
      await modeToggle.click();
      await this.page.waitForTimeout(300);
    }

    const input = this.volumeInput;
    await input.clear();
    await input.fill(volume.toString());
  }

  async clickBuy() {
    await this.buyButton.click();
  }

  async clickSell() {
    await this.sellButton.click();
  }

  async confirmOrder() {
    await this.orderDialog.waitFor({ state: 'visible' });
    await this.confirmOrderButton.click();
  }

  async placeBuyOrder(amount: number) {
    await this.setOrderAmount(amount);
    await this.clickBuy();
    await this.confirmOrder();
  }

  async placeSellOrder(amount: number) {
    await this.setOrderAmount(amount);
    await this.clickSell();
    await this.confirmOrder();
  }

  async getWalletBalance(): Promise<number> {
    const walletText = await this.walletSection
      .locator('span.cursor-help')
      .textContent();
    if (!walletText) return 0;
    const cleanedText = walletText.replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(cleanedText) || 0;
  }

  async waitForBalanceChange(
    previousBalance: number,
    timeout = 15000
  ): Promise<number> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const currentBalance = await this.getWalletBalance();
      if (Math.abs(currentBalance - previousBalance) > 0.01) {
        return currentBalance;
      }
      await this.page.waitForTimeout(500);
    }
    return await this.getWalletBalance();
  }

  async getPendingOrdersCount(): Promise<number> {
    const table = this.pendingOrdersSection.locator('table tbody tr');
    const count = await table.count();
    // Check if empty state
    const emptyState = await this.pendingOrdersSection
      .getByText(/no pending/i)
      .isVisible()
      .catch(() => false);
    return emptyState ? 0 : count;
  }

  async hasPendingOrders(): Promise<boolean> {
    const count = await this.getPendingOrdersCount();
    return count > 0;
  }

  async hasTransactionHistory(): Promise<boolean> {
    const emptyState = await this.transactionHistorySection
      .getByText(/no.*positions|no.*transactions/i)
      .isVisible()
      .catch(() => false);
    return !emptyState;
  }

  async assertOrderSuccessToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast]')
        .filter({ hasText: /success|order/i })
    ).toBeVisible({ timeout: 10000 });
  }

  async assertOrderErrorToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast]')
        .filter({ hasText: /error|failed|insufficient/i })
    ).toBeVisible({ timeout: 10000 });
  }

  async assertPendingOrderVisible() {
    await expect(
      this.pendingOrdersSection.locator('table tbody tr').first()
    ).toBeVisible({ timeout: 10000 });
  }

  async assertNoPendingOrders() {
    await expect(
      this.pendingOrdersSection.getByText(/no pending/i)
    ).toBeVisible({ timeout: 10000 });
  }

  async assertTransactionInHistory() {
    await expect(
      this.transactionHistorySection.locator('table tbody tr').first()
    ).toBeVisible({ timeout: 10000 });
  }
}
