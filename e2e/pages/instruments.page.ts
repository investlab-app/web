import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import type { Page } from '@playwright/test';

export class InstrumentsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get instrumentsTable() {
    return this.page.locator('table');
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

  private get loadingSpinner() {
    return this.page
      .locator('[data-testid="loading-spinner"]')
      .or(this.page.getByRole('status'));
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

  private get noDataMessage() {
    return this.page.getByText(/no.*instruments|no.*data|no.*results/i);
  }

  async navigateTo() {
    await this.goto('/instruments/');
  }

  async waitForTableToLoad() {
    // Wait for table to be visible
    await this.instrumentsTable
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
    // Wait for at least one row to appear (could be data or empty state)
    await this.allTableRows
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
    // Wait a moment for skeleton rows to be replaced
    await this.page.waitForTimeout(1000);
    // Wait for loading state to disappear if it exists
    const loadingSpinner = this.loadingSpinner.first();
    if (await loadingSpinner.isVisible().catch(() => false)) {
      await loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }

  async isLoading() {
    return this.loadingSpinner
      .first()
      .isVisible()
      .catch(() => false);
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

    console.log(
      `All Rows: ${allRows}, Pending Rows: ${pendingRows}, Empty Rows: ${emptyRows}`
    );

    const realRowCount = allRows - pendingRows - emptyRows;

    return realRowCount;
  }

  async clickInstrumentByName(instrumentName: string) {
    await this.page
      .locator('table tbody tr')
      .filter({ has: this.page.getByText(instrumentName) })
      .first()
      .click();
  }

  async clickInstrumentByIndex(index: number) {
    await this.tableRows.nth(index).click();
  }

  async getVisibleInstrumentNames(): Promise<Array<string>> {
    const names: Array<string> = [];
    const rows = await this.tableRows.count();

    for (let i = 0; i < rows; i++) {
      const cellText = await this.tableRows
        .nth(i)
        .locator('td')
        .first()
        .textContent();
      if (cellText) {
        names.push(cellText.trim());
      }
    }

    return names;
  }

  async getInstrumentRowData(index: number) {
    const row = this.tableRows.nth(index);
    const cells = await row.locator('td').allTextContents();
    return cells.map((cell) => cell.trim());
  }

  async isTableVisible() {
    return this.instrumentsTable.first().isVisible();
  }

  async isNoDataMessageVisible() {
    return this.noDataMessage.isVisible().catch(() => false);
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

  async clearSearch() {
    const input = this.searchInput;
    if (await input.isVisible()) {
      await input.clear();
      await input.press('Enter');
      await this.waitForTableToLoad();
    }
  }

  async getSearchValue() {
    return this.searchInput.inputValue().catch(() => '');
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

  async getSheetContent() {
    await this.waitForSheetToAppear();
    return this.sheetContent.textContent();
  }

  async isTextInSheet(text: string) {
    return this.sheetContent
      .getByText(text)
      .isVisible()
      .catch(() => false);
  }

  async assertPageURL() {
    await expect(this.page).toHaveURL(/\/instruments\/$/);
  }

  async assertTableIsVisible() {
    await expect(this.instrumentsTable.first()).toBeVisible();
  }

  async assertInstrumentsAreVisible() {
    await this.waitForTableToLoad();
    const count = await this.getInstrumentCount();
    expect(count).toBeGreaterThan(0);
  }

  async assertSheetContainsText(text: string) {
    await expect(this.sheetContent.getByText(text)).toBeVisible();
  }

  async assertInstrumentCount(expectedCount: number) {
    const actualCount = await this.getInstrumentCount();
    expect(actualCount).toBe(expectedCount);
  }

  async assertSearchResultsVisible() {
    await this.waitForTableToLoad();
    const isVisible = await this.isTableVisible();
    expect(isVisible).toBeTruthy();
  }
}
