import { type Page, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '@helpers/wait.helper';
import type { DocDetailsLocators } from '@locators/doc-details.locators';

export class ActionsTab {
  constructor(
    private readonly page: Page,
    private readonly l: DocDetailsLocators,
  ) {}

  private async waitForOSLoad(): Promise<void> {
    await waitForOSScreenLoad(this.page);
  }

  async clickActionPlanTab(): Promise<void> {
    await this.waitForOSLoad();

    const panelVisible = await this.l.actionPlanPanel.isVisible().catch(() => false);
    if (panelVisible) {
      return;
    }

    await this.l.actionPlanTab.waitFor({ state: 'visible', timeout: 30_000 });
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.l.actionPlanTab.click({ force: attempt > 1 });
      await this.waitForOSLoad();

      if (await this.l.actionPlanPanel.isVisible().catch(() => false)) {
        return;
      }
    }

    await this.l.actionPlanPanel.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async expectActionPlanTitleVisible(): Promise<void> {
    await expect(this.l.actionPlanTitle).toBeVisible({ timeout: 15_000 });
  }

  async expectActionPlanControlsVisible(): Promise<void> {
    await expect(this.l.actionPlanSearchInput).toBeVisible({ timeout: 15_000 });
    await expect(this.l.actionPlanShowOpenOnly).toBeVisible({ timeout: 15_000 });
    await expect(this.l.actionPlanResetButton).toBeVisible({ timeout: 15_000 });
  }

  async expectActionPlanGridColumnHeaders(): Promise<void> {
    const expected = ['Action Name', 'Description', 'Status', 'Due Date', 'Assignee', 'Findings'];
    for (const header of expected) {
      await expect(this.l.actionPlanGrid.getByRole('columnheader', { name: header })).toBeVisible({ timeout: 15_000 });
    }
  }

  async hasActionPlanRows(): Promise<boolean> {
    return this.l.actionPlanDataRows.first().isVisible().catch(() => false);
  }

  async getActionPlanRowCount(): Promise<number> {
    return this.l.actionPlanDataRows.count();
  }

  async getActionPlanRowText(rowIndex = 0): Promise<string> {
    const row = this.l.actionPlanDataRows.nth(rowIndex);
    await expect(row).toBeVisible({ timeout: 15_000 });
    return (await row.textContent())?.replace(/\s+/g, ' ').trim() ?? '';
  }

  async expectFirstActionNameLinkVisible(): Promise<void> {
    await expect(this.l.actionPlanDataRows.first().getByRole('link').first()).toBeVisible({ timeout: 15_000 });
  }

  async expectAnyFindingLinkVisible(): Promise<void> {
    await expect(this.l.actionPlanDataRows.getByRole('link', { name: /Finding/i }).first()).toBeVisible({ timeout: 15_000 });
  }

  async searchActionPlan(query: string): Promise<void> {
    await this.l.actionPlanSearchInput.fill(query);
    await this.waitForOSLoad();
  }

  async toggleActionPlanShowOpenOnly(enable: boolean): Promise<void> {
    await this.l.actionPlanShowOpenOnly.setChecked(enable);
    await this.waitForOSLoad();
  }

  async resetActionPlanFilters(): Promise<void> {
    await this.l.actionPlanResetButton.click();
    await this.waitForOSLoad();
    await this.l.actionPlanDataRows.first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined);
  }

  async hasActionPlanNoResultsMessage(): Promise<boolean> {
    return this.l.actionPlanNoResultsMessage.isVisible().catch(() => false);
  }

  async isAddActionButtonVisible(): Promise<boolean> {
    return this.l.actionPlanAddActionButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectAddActionButtonVisible(): Promise<void> {
    await expect(this.l.actionPlanAddActionButton).toBeVisible({ timeout: 15_000 });
  }

  async clickAddActionButton(): Promise<void> {
    await this.l.actionPlanAddActionButton.click();
    await this.waitForOSLoad();
  }

  async hasActionPlanNoActionsMessage(): Promise<boolean> {
    return this.l.actionPlanNoActionsMessage.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectActionPlanNoActionsMessageVisible(): Promise<void> {
    await expect(this.l.actionPlanNoActionsMessage).toBeVisible({ timeout: 15_000 });
  }

  async clickFirstActionNameLink(): Promise<void> {
    const firstLink = this.l.actionPlanDataRows.first().getByRole('link').first();
    await expect(firstLink).toBeVisible({ timeout: 15_000 });
    await firstLink.click();
    await this.waitForOSLoad();
  }
}
