import { type Page, type Locator, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '@helpers/wait.helper';
import type { DocDetailsLocators } from '@locators/doc-details.locators';

export class HistoryTab {
  constructor(
    private readonly page: Page,
    private readonly l: DocDetailsLocators,
  ) {}

  private async waitForOSLoad(): Promise<void> {
    await waitForOSScreenLoad(this.page);
  }

  async clickViewHistory(): Promise<void> {
    await this.l.viewHistoryLink.waitFor({ state: 'visible', timeout: 60_000 });
    await this.l.viewHistoryLink.click();
    await this.waitForOSLoad();
  }

  async expectHistoryDialogVisible(): Promise<void> {
    await expect(this.l.historyDialog).toBeVisible({ timeout: 30_000 });
  }

  async expectHistoryGridVisible(): Promise<void> {
    await expect(this.l.historyGrid).toBeVisible({ timeout: 30_000 });
  }

  async expectHistoryGridHasRows(): Promise<void> {
    await expect(this.l.historyGrid.locator('tbody tr').first()).toBeVisible({ timeout: 30_000 });
  }

  async expectHistoryGridColumnHeaders(): Promise<void> {
    const expected = ['Date', 'User', 'Activity', 'Description'];
    for (const header of expected) {
      await expect(
        this.l.historyGrid.locator('th').filter({ hasText: header }),
      ).toBeVisible({ timeout: 15_000 });
    }
  }

  async expectHistoryFiltersVisible(): Promise<void> {
    await expect(this.l.historySearchInput).toBeVisible({ timeout: 15_000 });
    await expect(this.l.historyActivityFilter).toBeVisible({ timeout: 15_000 });
    await expect(this.l.historySearchButton).toBeVisible({ timeout: 15_000 });
    await expect(this.l.historyResetButton).toBeVisible({ timeout: 15_000 });
  }

  async expectHistoryDateRangeInputsVisible(): Promise<void> {
    await expect(this.l.historyDateFromInput).toBeVisible({ timeout: 15_000 });
  }

  async getHistoryRowCount(): Promise<number> {
    return this.l.historyGrid.locator('tbody tr').count();
  }

  async getHistoryDateTexts(limit = 5): Promise<string[]> {
    const dateCells = this.l.historyGrid.locator('tbody tr td:first-child');
    const count = Math.min(await dateCells.count(), limit);
    const values: string[] = [];

    for (let index = 0; index < count; index++) {
      const value = (await dateCells.nth(index).textContent() ?? '').trim();
      if (value) values.push(value);
    }

    return values;
  }

  async clickHistorySearchButton(): Promise<void> {
    await this.l.historySearchButton.click();
    await this.waitForOSLoad();
  }

  async selectHistoryActivityFilter(activityLabel: string): Promise<void> {
    await this.l.historyActivityFilter.selectOption({ label: activityLabel });
    await this.waitForOSLoad();
  }

  async clickHistoryResetFilters(): Promise<void> {
    await this.l.historyResetButton.click();
    await this.waitForOSLoad();
  }

  async getHistorySearchInputValue(): Promise<string> {
    return this.l.historySearchInput.inputValue();
  }

  async getSelectedHistoryActivityFilterLabel(): Promise<string> {
    return this.l.historyActivityFilter.evaluate((element) => {
      const select = element as unknown as { options: { textContent?: string }[]; selectedIndex: number };
      return select.options[select.selectedIndex]?.textContent?.trim() ?? '';
    });
  }

  async closeHistoryDialog(): Promise<void> {
    await this.l.historyCloseButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.historyCloseButton.click();
    await this.waitForOSLoad();
  }

  async fillHistorySearchInput(text: string): Promise<void> {
    await this.l.historySearchInput.fill(text);
  }

  private formatHistoryDateInputValue(targetDate: Date): string {
    const day = targetDate.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    return `${day} ${month} ${year}`;
  }

  private async setHistoryDateInput(input: Locator, targetDate: Date): Promise<void> {
    const value = this.formatHistoryDateInputValue(targetDate);
    const normalizedTarget = value.toLowerCase().replace(/\s+/g, ' ').trim();

    const readValue = async (): Promise<string> => (
      await input.inputValue().catch(() => '')
    ).toLowerCase().replace(/\s+/g, ' ').trim();

    await input.waitFor({ state: 'visible', timeout: 15_000 });
    await input.scrollIntoViewIfNeeded().catch(() => undefined);
    await input.focus().catch(() => undefined);
    await input.click({ force: true }).catch(() => undefined);
    await input.press(`${process.platform === 'darwin' ? 'Meta' : 'Control'}+A`).catch(() => undefined);
    await input.fill(value).catch(() => undefined);
    if ((await readValue()) !== normalizedTarget) {
      await input.pressSequentially(value, { delay: 30 }).catch(() => undefined);
    }
    await input.press('Enter').catch(() => undefined);
    await input.press('Tab').catch(() => undefined);

    let currentValue = await readValue();
    if (currentValue !== normalizedTarget) {
      await input.evaluate((element, newValue) => {
        const field = element as unknown as { value: string; dispatchEvent: (e: Event) => void; blur: () => void };
        const prototype = Object.getPrototypeOf(field);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
        descriptor?.set?.call(field, newValue);
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.blur();
      }, value);
      currentValue = await readValue();
    }

    if (currentValue !== normalizedTarget) {
      throw new Error(`Failed to set DOC History date input to ${value}.`);
    }
  }

  async selectHistoryDateRange(fromDate: Date, toDate: Date): Promise<void> {
    await this.setHistoryDateInput(this.l.historyDateFromInput, fromDate);

    const toInputVisible = await this.l.historyDateToInput.isVisible().catch(() => false);
    if (toInputVisible) {
      await this.setHistoryDateInput(this.l.historyDateToInput, toDate);
    }
  }

  async getHistoryActivityFilterOptionCount(): Promise<number> {
    let count = 0;
    try {
      await expect.poll(
        async () => {
          const h = await this.l.historyActivityFilter.elementHandle();
          if (!h) return 0;
          count = await h.evaluate((el) => (el as unknown as { options: { length: number } }).options.length);
          return count;
        },
        { timeout: 8_000, intervals: [500, 500, 1_000, 2_000] },
      ).toBeGreaterThan(1);
    } catch {
      // Timed out; return whatever was last read
    }
    return count;
  }

  async getHistoryActivityFilterOptions(): Promise<string[]> {
    await this.getHistoryActivityFilterOptionCount();
    const options = await this.l.historyActivityFilter.locator('option').allTextContents();
    return options.map(o => o.trim()).filter(o => o.length > 0 && !/^(- select -|select|all)$/i.test(o));
  }

  async getHistoryTotalRecordCount(): Promise<number> {
    await this.l.historyPaginationStatus.waitFor({ state: 'visible', timeout: 15_000 });
    const statusText = await this.l.historyPaginationStatus.textContent();
    const match = statusText?.match(/(\d+)\s*record(?:s)?/i);
    return match ? Number(match[1]) : 0;
  }

  async changeHistoryPerPage(value: '10' | '20' | '30' | '50' | '100'): Promise<void> {
    await this.l.historyPerPageSelect.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.historyPerPageSelect.selectOption(value);
    await this.waitForOSLoad();
    await expect
      .poll(() => this.getHistoryRowCount(), { timeout: 30_000, intervals: [500, 1_000, 2_000] })
      .toBeGreaterThan(0);
  }

  async getCurrentHistoryPageNumber(): Promise<number> {
    const currentPageButton = this.l.historyPaginationNav.getByRole('button', { name: /current page/i });
    const text = await currentPageButton.textContent();
    return Number(text?.trim() || '0');
  }

  async goToHistoryPage(pageNumber: number): Promise<void> {
    await this.l.historyPaginationNav.getByRole('button', { name: `go to page ${pageNumber}` }).click();
    await this.waitForOSLoad();
  }

  async expectHistoryNoDataMessageVisible(): Promise<void> {
    await expect(this.l.historyNoDataMessage).toBeVisible({ timeout: 15_000 });
  }

  async getHistoryFirstRowDateText(): Promise<string> {
    const firstRow = this.l.historyGrid.locator('tbody tr').first();
    return ((await firstRow.locator('td').first().textContent()) ?? '').trim();
  }
}
