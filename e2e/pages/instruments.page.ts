import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class InstrumentsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get instrumentsTable() {
    return this.page.locator('table');
  }

  private get tableHeaders() {
    return this.page.locator('table thead th');
  }

  private get sheetContent() {
    return this.page
      .locator('[role="dialog"]')
      .or(this.page.locator('[data-slot="sheet"]'));
  }

  private get sheetCloseButton() {
    return this.page
      .locator('button[aria-label="Close"]')
      .or(this.page.getByRole('button', { name: /close/i }));
  }

  private get searchInput() {
    return this.page.getByPlaceholder(/search|filter|query/i);
  }

  private get tableRows() {
    return this.page.locator('table tbody tr:not([key*="skeleton"])');
  }

  private get allTableRows() {
    return this.page.locator('table tbody tr');
  }

  async navigateTo() {
    await this.page.goto('/instruments/');
  }

  async waitForTableToLoad() {
    await this.page.waitForTimeout(1000);
    await this.page
      .locator('[data-testid="instrument-table-ready"]')
      .waitFor({ state: 'attached', timeout: 10000 });
  }

  async waitForPageReady() {
    await this.waitForTableToLoad();
  }

  async getInstrumentCount() {
    const allRows = await this.allTableRows.count();

    const pendingRows = await this.page
      .locator('table tbody tr[data-testid="pending-state-data-table-row"]')
      .count();

    const emptyRows = await this.page
      .locator('table tbody tr[data-testid="empty-state-data-table-row"]')
      .count();

    return allRows - pendingRows - emptyRows;
  }

  async clickInstrumentByIndex(index: number) {
    await this.tableRows.nth(index).click();
  }

  async getVisibleInstrumentNames(): Promise<Array<string>> {
    return this.getColumnText('name');
  }

  async getVisibleInstrumentSymbols(): Promise<Array<string>> {
    return this.getColumnText('symbol');
  }

  async getHeaders(): Promise<Array<string>> {
    const headers = await this.tableHeaders.allTextContents();
    return headers.map((h) => h.trim());
  }

  async getColumnText(columnHeader: string | RegExp): Promise<Array<string>> {
    const headers = await this.tableHeaders.allTextContents();
    const headerIndex = headers.findIndex((h) =>
      typeof columnHeader === 'string'
        ? h.toLowerCase().includes(columnHeader.toLowerCase())
        : columnHeader.test(h)
    );

    if (headerIndex === -1) {
      return [];
    }

    const texts: Array<string> = [];
    const rows = await this.tableRows.count();
    for (let i = 0; i < rows; i++) {
      const cell = this.tableRows.nth(i).locator('td').nth(headerIndex);
      texts.push(((await cell.textContent()) || '').trim());
    }
    return texts;
  }

  async searchInstrument(query: string) {
    const input = this.searchInput;
    if (await input.isVisible()) {
      await input.clear();
      await input.fill(query);
      await input.press('Enter');
      await this.waitForTableToLoad();
    }
  }

  async isSheetOpen() {
    return this.sheetContent.isVisible().catch(() => false);
  }

  async closeSheet() {
    if (await this.isSheetOpen()) {
      await this.sheetCloseButton.click();
      await this.sheetContent.waitFor({ state: 'hidden' });
    }
  }

  async waitForSheetToAppear() {
    await this.sheetContent.waitFor({ state: 'visible' });
  }

  async clickTableHeader(headerName: string | RegExp) {
    const header = this.tableHeaders.filter({ hasText: headerName }).first();
    if (await header.isVisible()) {
      const button = header.locator('button');
      if ((await button.count()) > 0) {
        await button.click();
      } else {
        await header.click();
      }
      await this.waitForTableToLoad();
    }
  }

  async toggleWatchInTable(rowIndex: number) {
    const row = this.tableRows.nth(rowIndex);
    await row.hover();
    await this.page.waitForTimeout(200);
    const star = row.locator('.group\\/heart svg.cursor-pointer').first();
    await star.click({ force: true });
    await this.page.waitForTimeout(500); // Wait for optimistic update
  }

  async assertSeeDetailsLink() {
    return this.sheetContent
      .getByRole('link', { name: /see details|details/i })
      .waitFor({ state: 'visible' });
  }

  async assertChartInSheet() {
    await this.sheetContent
      .locator('canvas')
      .first()
      .waitFor({ state: 'visible' });
  }

  async assertNewsInSheet() {
    await this.sheetContent
      .getByText(/news|latest news/i)
      .first()
      .waitFor({ state: 'visible' });
  }

  async assertTableIsVisible() {
    await expect(this.instrumentsTable.first()).toBeVisible();
  }

  async assertSheetContainsText(text: string) {
    await expect(this.sheetContent.getByText(text)).toBeVisible();
  }
}
