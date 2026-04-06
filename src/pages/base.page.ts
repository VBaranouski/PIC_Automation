import { type Page, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '../helpers/wait.helper';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  async goto(): Promise<void> {
    // Use a generous timeout and retry once on network failure.
    // QA environment can be slow under load (multiple long test sessions).
    await this.page.goto(this.url, { timeout: 90_000 })
      .catch(async () => {
        await this.page.waitForTimeout(3_000);
        await this.page.goto(this.url, { timeout: 90_000 });
      });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForOSLoad(): Promise<void> {
    await waitForOSScreenLoad(this.page);
  }

  async expectUrl(pattern: string | RegExp, options?: { timeout?: number }): Promise<void> {
    await expect(this.page).toHaveURL(pattern, options);
  }
}
