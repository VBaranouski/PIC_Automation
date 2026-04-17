import { type Page, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '../helpers/wait.helper';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  async goto(): Promise<void> {
    // Retry with exponential backoff for OutSystems cold-start timeouts.
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.page.goto(this.url, { timeout: 90_000, waitUntil: 'domcontentloaded' });
        return;
      } catch (error) {
        if (attempt === maxRetries) throw error;
        const delay = 2_000 * Math.pow(2, attempt - 1); // 2s, 4s
        await this.page.waitForTimeout(delay);
      }
    }
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
