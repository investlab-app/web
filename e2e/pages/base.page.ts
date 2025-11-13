import type { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  getCurrentURL() {
    return this.page.url();
  }

  async waitForText(text: string) {
    await this.page.getByText(text).first().waitFor({ state: 'visible' });
  }

  async isElementVisible(selector: string) {
    return this.page.locator(selector).isVisible();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
