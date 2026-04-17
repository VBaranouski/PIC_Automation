import { type Page, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '@helpers/wait.helper';
import type { DocDetailsLocators } from '@locators/doc-details.locators';

export class RiskSummaryTab {
  constructor(
    private readonly page: Page,
    private readonly l: DocDetailsLocators,
  ) {}

  private async waitForOSLoad(): Promise<void> {
    await waitForOSScreenLoad(this.page);
  }

  async clickRiskSummaryTab(): Promise<void> {
    await this.waitForOSLoad();

    const panelVisible = await this.l.riskSummaryPanel.isVisible().catch(() => false);
    if (panelVisible) {
      return;
    }

    await this.l.riskSummaryTab.waitFor({ state: 'visible', timeout: 30_000 });
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.l.riskSummaryTab.click({ force: attempt > 1 });
      await this.waitForOSLoad();

      if (await this.l.riskSummaryPanel.isVisible().catch(() => false)) {
        return;
      }
    }

    await this.l.riskSummaryPanel.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async expectRiskSummarySectionsVisible(): Promise<void> {
    await expect(this.l.riskSummarySdlTitle).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryPrivacyTitle).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryItsTitle).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryControlsTitle).toBeVisible({ timeout: 15_000 });
  }

  async expectRiskSummarySdlFcsrContentVisible(): Promise<void> {
    await expect(this.l.riskSummarySdlDecisionLabel).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummarySdlCommentsLabel).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummarySdlLinkLabel).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryLinks.first()).toBeVisible({ timeout: 15_000 });
  }

  async expectRiskSummaryPrivacyContentVisible(): Promise<void> {
    await expect(this.l.riskSummaryPrivacyDecisionLabel).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryPrivacyCommentsLabel).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryPrivacyLinkLabel).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryLinks.nth(1)).toBeVisible({ timeout: 15_000 });
  }

  async expectRiskSummaryItsControlSummaryVisible(): Promise<void> {
    await expect(this.l.riskSummaryOverallRiskLabel).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryItsCommentLabel).toBeVisible({ timeout: 15_000 });
  }

  async hasRiskSummaryNoResultsMessage(): Promise<boolean> {
    return this.l.riskSummaryNoResultsMessage.isVisible().catch(() => false);
  }

  async getRiskSummaryPanelText(): Promise<string> {
    await expect(this.l.riskSummaryPanel).toBeVisible({ timeout: 15_000 });
    return (await this.l.riskSummaryPanel.textContent())?.replace(/\s+/g, ' ').trim() ?? '';
  }

  async hasRiskSummaryControlsGrid(): Promise<boolean> {
    return this.l.riskSummaryControlsGrid.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectRiskSummaryControlsGridColumnHeaders(): Promise<void> {
    const headers = ['Category', 'Status', 'Risk Level'];
    for (const header of headers) {
      await expect(
        this.l.riskSummaryControlsGrid.locator('th').filter({ hasText: header }),
      ).toBeVisible({ timeout: 15_000 });
    }
  }

  async getRiskSummaryControlsRowCount(): Promise<number> {
    return this.l.riskSummaryControlsDataRows.count();
  }
}
