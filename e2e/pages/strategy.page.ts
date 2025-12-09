import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class StrategyPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get activeStrategiesTab() {
    return this.page.getByRole('tab', { name: /active/i });
  }

  private get closedStrategiesTab() {
    return this.page.getByRole('tab', { name: /closed/i });
  }

  private get addStrategyButton() {
    return this.page.getByRole('button', { name: /add new strategy/i });
  }

  async navigateToStrategies() {
    await this.page.goto('/strategies');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToNewStrategy() {
    await this.page.goto('/strategies/new');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageReady() {
    await this.page.waitForTimeout(1000);
  }

  async clickAddStrategy() {
    await this.addStrategyButton.click();
    await this.page.waitForURL(/\/strategies\/new/);
  }

  async getStrategyNames(): Promise<Array<string>> {
    const strategyRows = this.page.locator(
      '.rounded-xl.border.bg-card .font-semibold.text-foreground'
    );
    const count = await strategyRows.count();
    const names: Array<string> = [];
    for (let i = 0; i < count; i++) {
      const text = await strategyRows.nth(i).textContent();
      const trimmed = text?.trim();
      if (trimmed && !/add new strategy/i.test(trimmed)) {
        names.push(trimmed);
      }
    }
    return names;
  }

  async isStrategyInList(strategyName: string): Promise<boolean> {
    const names = await this.getStrategyNames();
    return names.includes(strategyName);
  }

  async clickStrategyByName(name: string) {
    const strategyRow = this.page
      .locator('.rounded-xl.border.bg-card')
      .filter({ hasText: name });
    await strategyRow.getByRole('button', { name: /edit|arrow/i }).click();
  }

  async deleteStrategyByName(name: string) {
    const strategyRow = this.page
      .locator('.rounded-xl.border.bg-card')
      .filter({ hasText: name });
    await strategyRow.getByRole('button', { name: /delete/i }).click();
  }

  async switchToActiveStrategies() {
    await this.activeStrategiesTab.click();
    await this.page.waitForTimeout(500);
  }

  async switchToClosedStrategies() {
    await this.closedStrategiesTab.click();
    await this.page.waitForTimeout(500);
  }

  async getStrategyCount(): Promise<number> {
    const names = await this.getStrategyNames();
    return names.length;
  }

  async assertStrategyInList(name: string) {
    await expect(
      this.page.locator('.rounded-xl.border.bg-card').filter({ hasText: name })
    ).toBeVisible({ timeout: 10000 });
  }

  async assertStrategyNotInList(name: string) {
    await expect(
      this.page.locator('.rounded-xl.border.bg-card').filter({ hasText: name })
    ).toBeHidden({ timeout: 10000 });
  }

  async assertSuccessToast(message?: string | RegExp) {
    const pattern = message || /success|created|deleted|updated/i;
    await expect(
      this.page.locator('[data-sonner-toast]').filter({ hasText: pattern })
    ).toBeVisible({ timeout: 10000 });
  }

  async assertNoActiveStrategiesPlaceholder() {
    await expect(this.page.getByText(/no active strategies/i)).toBeVisible();
  }

  async waitForStrategyDeletion(name: string, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const isInList = await this.isStrategyInList(name);
      if (!isInList) return true;
      await this.page.waitForTimeout(500);
    }
    return false;
  }
}
