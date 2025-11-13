import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import type { Page } from '@playwright/test';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get navigationLinks() {
    return this.page.locator('nav a, nav button');
  }

  private get instrumentsLink() {
    return this.page.getByRole('link').filter({ hasText: /instruments/i });
  }

  private get statisticsLink() {
    return this.page.getByRole('link').filter({ hasText: /statistics/i });
  }

  private get transactionsLink() {
    return this.page
      .getByRole('link')
      .filter({ hasText: /transactions|history/i });
  }

  async navigateToHome() {
    await this.goto('/');
  }

  async clickInstrumentsLink() {
    await this.instrumentsLink.first().click();
  }

  async clickStatisticsLink() {
    await this.statisticsLink.first().click();
  }

  async clickTransactionsLink() {
    await this.transactionsLink.first().click();
  }

  async isInstrumentsLinkVisible() {
    return this.instrumentsLink.first().isVisible();
  }

  async isStatisticsLinkVisible() {
    return this.statisticsLink.first().isVisible();
  }

  async isTransactionsLinkVisible() {
    return this.transactionsLink.first().isVisible();
  }

  async waitForDashboardToLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async assertNavigationIsVisible() {
    await expect(this.navigationLinks.first()).toBeVisible();
  }

  async assertUserIsLoggedIn() {
    await this.assertNavigationIsVisible();
  }
}
