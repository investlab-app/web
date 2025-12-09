import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class InstrumentDetailsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get chartCard() {
    return this.page
      .locator('[data-slot="card"]')
      .filter({ has: this.page.locator('canvas') })
      .first();
  }

  private get chartCanvas() {
    return this.page.locator('canvas').first();
  }

  private get lineChartButton() {
    return this.page.locator('[aria-label="Line chart"]');
  }

  private get candlestickChartButton() {
    return this.page.locator('[aria-label="Candlestick chart"]');
  }

  private get intervalSelect() {
    return this.page.getByRole('combobox', { name: /interval/i });
  }

  private get newsSection() {
    return this.page.locator('[data-slot="card"]').filter({ hasText: /news/i });
  }

  private get newsItems() {
    return this.newsSection
      .locator('a')
      .filter({ has: this.page.locator('h3') });
  }

  async navigateTo(ticker: string) {
    await this.page.goto(`/instruments/${ticker}`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageReady() {
    await this.page.waitForTimeout(2000);
    // Wait for chart to load
    await expect(
      this.chartCanvas.or(this.page.getByText(/error|empty/i))
    ).toBeVisible({ timeout: 15000 });
  }

  async assertChartVisible() {
    await expect(this.chartCanvas).toBeVisible({ timeout: 10000 });
  }

  async assertChartCardVisible() {
    await expect(this.chartCard).toBeVisible();
  }

  async switchToLineChart() {
    await this.lineChartButton.click();
    await this.page.waitForTimeout(500);
  }

  async switchToCandlestickChart() {
    await this.candlestickChartButton.click();
    await this.page.waitForTimeout(500);
  }

  async isLineChartActive(): Promise<boolean> {
    const button = this.lineChartButton;
    const dataState = await button.getAttribute('data-state');
    return dataState === 'on';
  }

  async isCandlestickChartActive(): Promise<boolean> {
    const button = this.candlestickChartButton;
    const dataState = await button.getAttribute('data-state');
    return dataState === 'on';
  }

  async selectInterval(interval: string) {
    await this.intervalSelect.click();
    await this.page
      .getByRole('option', { name: new RegExp(interval, 'i') })
      .click();
    await this.page.waitForTimeout(1000);
  }

  async assertNewsSectionVisible() {
    await expect(this.newsSection).toBeVisible({ timeout: 10000 });
  }

  async assertNewsDisplayed() {
    // Either news items are visible or an empty/error message is shown
    const hasNews = await this.newsItems
      .first()
      .isVisible()
      .catch(() => false);
    const hasEmptyMessage = await this.newsSection
      .getByText(/unavailable|no news/i)
      .isVisible()
      .catch(() => false);

    expect(hasNews || hasEmptyMessage).toBeTruthy();
  }

  async getNewsCount(): Promise<number> {
    const count = await this.newsItems.count();
    return count;
  }

  async assertInstrumentHeader(ticker: string) {
    await expect(
      this.page
        .getByRole('heading', { name: ticker })
        .or(this.page.getByText(ticker).first())
    ).toBeVisible();
  }

  async assertCurrentPriceDisplayed() {
    await expect(
      this.page
        .locator('[data-slot="card-description"]')
        .filter({ hasText: /current price/i })
    ).toBeVisible();
  }

  async getChartType(): Promise<'line' | 'candlestick'> {
    const isCandlestick = await this.isCandlestickChartActive();
    return isCandlestick ? 'candlestick' : 'line';
  }
}
