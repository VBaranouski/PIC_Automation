import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { releaseDetailLocators } from '../locators/release-detail.locators';
import type { ReleaseDetailLocators } from '../locators/release-detail.locators';
import { BasePage } from './base.page';

function escapeCssIdentifier(value: string): string {
  return value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

/**
 * Expected Release pipeline stage names.
 * Observed on qa.leap.schneider-electric.com (ReleaseId=3605, "One more product"):
 *   Stage 4 aria-label is "Security & Privacy Readiness Sign Off"
 *   (Some older releases may show "SDPA & PQL Sign Off" for stage 4)
 */
export const RELEASE_PIPELINE_STAGES = [
  'Creation & Scoping',
  'Review & Confirm',
  'Manage',
  'Security & Privacy Readiness Sign Off',
  'FCSR Review',
  'Post FCSR Actions',
  'Final Acceptance',
] as const;

export class ReleaseDetailPage extends BasePage {
  /** Not used for goto() — releases are navigated to via product/landing */
  readonly url = '/GRC_PICASso/ReleaseDetail';
  protected readonly l: ReleaseDetailLocators;

  constructor(page: Page) {
    super(page);
    this.l = releaseDetailLocators(page);
  }

  // ── Page load ──────────────────────────────────────────────────────────────

  /** Wait for the Release Detail page to settle after navigation. */
  async waitForPageLoad(timeout = 60_000): Promise<void> {
    await this.page.waitForURL(/ReleaseDetail/, { timeout });
    await this.page.waitForFunction(
      "() => !document.body?.innerText?.includes('JavaScript is required')",
      undefined,
      { timeout },
    ).catch(() => undefined);
    await this.waitForOSLoad();
    await expect(this.l.releaseDetailsTab).toBeVisible({ timeout: 20_000 });
  }

  // ── Breadcrumb ─────────────────────────────────────────────────────────────

  /** Asserts that the breadcrumb navigation is visible. */
  async expectBreadcrumbVisible(): Promise<void> {
    await expect(this.l.breadcrumbNav).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Returns the text of each breadcrumb item in order.
   * Waits for at least 2 links to appear (OutSystems renders breadcrumb
   * items asynchronously — the product link may appear after initial paint).
   * Filters out empty strings caused by whitespace-only nodes.
   */
  async getBreadcrumbTexts(): Promise<string[]> {
    const nav = this.l.breadcrumbNav;
    await nav.waitFor({ state: 'visible', timeout: 20_000 });

    // Poll until the link count stabilises (handles async breadcrumb rendering)
    const links = nav.locator('a');
    await expect(links).not.toHaveCount(0, { timeout: 15_000 });
    // Give AJAX-rendered breadcrumb segments a moment to appear
    await this.page.waitForTimeout(1_500);

    const texts = await links.allTextContents();
    return texts.map((t) => t.trim()).filter((t) => t.length > 0);
  }

  /** Asserts Home link is visible in the breadcrumb. */
  async expectBreadcrumbHomeLinkVisible(): Promise<void> {
    await expect(this.l.breadcrumbHomeLink).toBeVisible({ timeout: 15_000 });
  }

  /** Asserts the product name link is visible in the breadcrumb. */
  async expectBreadcrumbProductLinkVisible(): Promise<void> {
    await expect(this.l.breadcrumbProductLink).toBeVisible({ timeout: 15_000 });
  }

  /** Clicks the Home link in the breadcrumb and waits for navigation. */
  async clickBreadcrumbHome(): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation({ timeout: 30_000 }),
      this.l.breadcrumbHomeLink.click(),
    ]);
    await this.waitForOSLoad();
  }

  /** Clicks the Product link in the breadcrumb and waits for navigation. */
  async clickBreadcrumbProduct(): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation({ timeout: 30_000 }),
      this.l.breadcrumbProductLink.click(),
    ]);
    await this.waitForOSLoad();
  }

  // ── Status badge ───────────────────────────────────────────────────────────

  /** Returns the text of the release status badge (e.g. "Scoping"). */
  async getReleaseStatusText(): Promise<string> {
    await this.l.releaseStatusBadge.waitFor({ state: 'visible', timeout: 20_000 });
    return (await this.l.releaseStatusBadge.textContent())?.trim() ?? '';
  }

  /** Asserts the release status badge is visible and has non-empty text. */
  async expectReleaseStatusBadgeVisible(): Promise<void> {
    // Wait for the outer container first (loaded via AJAX), then check the inner span
    const container = this.page.locator('[data-block="Patterns.ReleaseStatusTag"]').first();
    await container.waitFor({ state: 'visible', timeout: 25_000 });
    await expect(this.l.releaseStatusBadge).toBeVisible({ timeout: 10_000 });
    const text = await this.getReleaseStatusText();
    expect(text.length, 'Release status badge must have non-empty text').toBeGreaterThan(0);
  }

  // ── Pipeline ───────────────────────────────────────────────────────────────

  /**
   * Returns the aria-label text of all pipeline stage tabs.
   */
  async getPipelineStageLabels(): Promise<string[]> {
    await this.l.pipelineStages.first().waitFor({ state: 'visible', timeout: 20_000 });
    return this.l.pipelineStages.evaluateAll((els) =>
      els.map((el) => (el.getAttribute('aria-label') ?? el.textContent ?? '').trim()),
    );
  }

  /** Returns the count of pipeline stage tabs. */
  async getPipelineStageCount(): Promise<number> {
    return this.l.pipelineStages.count();
  }

  /** Asserts exactly `expected` pipeline stages are visible. */
  async expectPipelineStageCount(expected: number): Promise<void> {
    await this.l.pipelineStages.first().waitFor({ state: 'visible', timeout: 20_000 });
    await expect(this.l.pipelineStages).toHaveCount(expected, { timeout: 15_000 });
  }

  /** Asserts exactly one stage has the `active` CSS class. */
  async expectExactlyOneActiveStage(): Promise<void> {
    await this.l.pipelineActiveStage.waitFor({ state: 'visible', timeout: 20_000 });
    const count = await this.l.pipelineActiveStage.count();
    expect(count, 'Exactly one pipeline stage should be active').toBe(1);
  }

  /** Returns the aria-label of the currently active pipeline stage. */
  async getActiveStageName(): Promise<string> {
    await this.l.pipelineActiveStage.waitFor({ state: 'visible', timeout: 20_000 });
    return (
      (await this.l.pipelineActiveStage.getAttribute('aria-label')) ??
      (await this.l.pipelineActiveStage.textContent()) ??
      ''
    ).trim();
  }

  // ── View Flow toggle ───────────────────────────────────────────────────────

  /** Asserts the "View Flow" toggle div is visible. */
  async expectViewFlowToggleVisible(): Promise<void> {
    await expect(this.l.viewFlowToggle).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Clicks the "View Flow" toggle and waits for the expandable area to become visible.
   * The pipeline area starts collapsed on some releases; clicking expands it.
   */
  async clickViewFlowToggleAndExpand(): Promise<void> {
    await this.l.viewFlowToggle.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.viewFlowToggle.click();
    // Wait briefly for the animation / DOM toggle
    await this.page.waitForTimeout(800);
  }

  /** Asserts the pipeline expandable area is visible (expanded state). */
  async expectPipelineAreaVisible(): Promise<void> {
    await expect(this.l.pipelineExpandableArea).toBeVisible({ timeout: 10_000 });
  }

  async getWorkflowPanelLines(): Promise<string[]> {
    await this.expectPipelineAreaVisible();
    const text = await this.l.pipelineExpandableArea.innerText();
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  async getWorkflowSectionLines(stageName: string): Promise<string[]> {
    const lines = await this.getWorkflowPanelLines();
    const stages = RELEASE_PIPELINE_STAGES.map((stage) => stage.toLowerCase());
    const startIndex = lines.findIndex((line) => line.toLowerCase().includes(stageName.toLowerCase()));

    if (startIndex === -1) {
      return [];
    }

    const sectionLines: string[] = [];
    for (let index = startIndex; index < lines.length; index += 1) {
      const line = lines[index];
      if (index > startIndex && stages.some((stage) => line.toLowerCase().includes(stage))) {
        break;
      }
      sectionLines.push(line);
    }

    return sectionLines;
  }

  async getWorkflowStageSubmissionSummary(stageName: string): Promise<string> {
    const sectionLines = await this.getWorkflowSectionLines(stageName);
    return sectionLines.find((line) => /submission/i.test(line)) ?? '';
  }

  async getWorkflowStageResponsibleEntries(stageName: string): Promise<string[]> {
    const sectionLines = await this.getWorkflowSectionLines(stageName);
    return sectionLines.filter((line) => {
      const normalized = line.toLowerCase();
      return normalized !== stageName.toLowerCase()
        && !/submission/i.test(normalized)
        && !RELEASE_PIPELINE_STAGES.some((stage) => normalized.includes(stage.toLowerCase()));
    });
  }

  // ── Need Help ──────────────────────────────────────────────────────────────

  /** Asserts the "Need Help" anchor link is visible in the header. */
  async expectNeedHelpLinkVisible(): Promise<void> {
    await expect(this.l.needHelpLink).toBeVisible({ timeout: 15_000 });
  }

  // ── Release Details tab ─────────────────────────────────────────────────

  async expectReleaseDetailsTabSelected(): Promise<void> {
    await expect(this.l.releaseDetailsTab).toBeVisible({ timeout: 20_000 });
    await expect(this.l.releaseDetailsTab).toHaveAttribute('aria-selected', 'true');
  }

  getTopLevelTab(tabName: string) {
    const escapedTabName = tabName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('tab', { name: new RegExp(`^${escapedTabName}\\b`, 'i') }).first();
  }

  async clickTopLevelTab(tabName: string): Promise<void> {
    const tab = this.getTopLevelTab(tabName);
    await expect(tab).toBeVisible({ timeout: 20_000 });
    await tab.click();
    await this.waitForOSLoad();
  }

  async isTopLevelTabVisible(tabName: string): Promise<boolean> {
    return this.getTopLevelTab(tabName).isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async isTopLevelTabDisabled(tabName: string): Promise<boolean> {
    const tab = this.getTopLevelTab(tabName);
    const isVisible = await tab.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!isVisible) {
      return true;
    }

    return tab.evaluate((element) => {
      const className = (element.getAttribute('class') ?? '').toLowerCase();
      return element.getAttribute('aria-disabled') === 'true'
        || (element as { disabled?: boolean }).disabled === true
        || className.includes('disabled');
    }).catch(() => true);
  }

  async getTopLevelTabPanelText(tabName: string): Promise<string> {
    const tab = this.getTopLevelTab(tabName);
    await expect(tab).toBeVisible({ timeout: 20_000 });

    const disabled = await this.isTopLevelTabDisabled(tabName);
    if (!disabled) {
      await tab.click();
      await this.waitForOSLoad();
    }

    const panelId = await tab.getAttribute('aria-controls');
    if (panelId) {
      const panel = this.page.locator(`#${escapeCssIdentifier(panelId)}`).first();
      const visible = await panel.isVisible({ timeout: 5_000 }).catch(() => false);
      if (visible) {
        return (await panel.innerText().catch(() => '')).trim();
      }
    }

    const genericPanel = this.page.getByRole('tabpanel').first();
    const genericVisible = await genericPanel.isVisible({ timeout: 5_000 }).catch(() => false);
    if (genericVisible) {
      return (await genericPanel.innerText().catch(() => '')).trim();
    }

    return (await this.page.locator('body').innerText().catch(() => '')).trim();
  }

  async expectTopLevelTabSelected(tabName: string): Promise<void> {
    await expect(this.getTopLevelTab(tabName)).toHaveAttribute('aria-selected', 'true');
  }

  async expectTopLevelTabNotSelected(tabName: string): Promise<void> {
    await expect(this.getTopLevelTab(tabName)).not.toHaveAttribute('aria-selected', 'true');
  }

  async expectStartQuestionnaireVisible(): Promise<void> {
    await expect(this.l.startQuestionnaireButton).toBeVisible({ timeout: 20_000 });
  }

  async expectQuestionnaireEmptyStateVisible(): Promise<void> {
    await expect(this.l.questionnaireEmptyState).toBeVisible({ timeout: 20_000 });
  }

  async expectQuestionnaireSubmitGuidanceVisible(): Promise<void> {
    await expect(this.l.questionnaireSubmitGuidance).toBeVisible({ timeout: 20_000 });
  }

  async isStartQuestionnaireVisible(): Promise<boolean> {
    return this.l.startQuestionnaireButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async expectTabDisabled(tabName: string): Promise<void> {
    const tab = this.getTopLevelTab(tabName);
    await expect(tab).toBeVisible({ timeout: 20_000 });
    await expect
      .poll(
        async () => tab.evaluate((element) => {
          const className = (element.getAttribute('class') ?? '').toLowerCase();
          return element.getAttribute('aria-disabled') === 'true'
            || (element as { disabled?: boolean }).disabled === true
            || className.includes('disabled');
        }),
        { timeout: 20_000, message: `Expected tab "${tabName}" to be disabled` },
      )
      .toBe(true);
  }

  async expectTabsDisabled(tabNames: string[]): Promise<void> {
    for (const tabName of tabNames) {
      await this.expectTabDisabled(tabName);
    }
  }

  async expectReleaseDetailsCoreFieldsVisible(): Promise<void> {
    for (const label of [
      'Release Creation',
      'Release Version',
      'Target Release Date',
      'Change Summary',
    ]) {
      await expect(this.page.getByText(label, { exact: true }).first()).toBeVisible({ timeout: 20_000 });
    }
  }

  async expectSeProductSubTabsVisible(): Promise<void> {
    await expect(this.l.includedSeComponentsTab).toBeVisible({ timeout: 20_000 });
    await expect(this.l.partOfSeProductsTab).toBeVisible({ timeout: 20_000 });
  }

  async openReleaseDetailsEditMode(): Promise<void> {
    await expect(this.l.editReleaseDetailsButton).toBeVisible({ timeout: 20_000 });
    await this.l.editReleaseDetailsButton.click();
    await this.waitForOSLoad();
  }

  async expectReleaseDetailsEditModeVisible(): Promise<void> {
    await expect(this.l.saveReleaseDetailsButton).toBeVisible({ timeout: 20_000 });
    await expect(this.l.cancelReleaseDetailsButton).toBeVisible({ timeout: 20_000 });
    await expect(this.l.targetReleaseDateInput).toBeVisible({ timeout: 20_000 });
    await expect(this.l.changeSummaryTextarea).toBeVisible({ timeout: 20_000 });
    await expect(this.l.changeSummaryTextarea).toBeEditable({ timeout: 20_000 });
  }

  async fillReleaseDetailsChangeSummary(value: string): Promise<void> {
    await this.l.changeSummaryTextarea.fill(value);
  }

  async getEditModeChangeSummaryValue(): Promise<string> {
    await expect(this.l.changeSummaryTextarea).toBeVisible({ timeout: 20_000 });
    return this.l.changeSummaryTextarea.inputValue();
  }

  async saveReleaseDetailsEditMode(): Promise<void> {
    await this.l.saveReleaseDetailsButton.click();
    await this.waitForOSLoad();
  }

  async cancelReleaseDetailsEditMode(): Promise<void> {
    await this.l.cancelReleaseDetailsButton.click();
    await this.waitForOSLoad();
  }

  async expectReleaseDetailsReadOnlyModeVisible(): Promise<void> {
    await expect(this.l.editReleaseDetailsButton).toBeVisible({ timeout: 20_000 });
    await expect(this.l.saveReleaseDetailsButton).toBeHidden({ timeout: 20_000 });
    await expect(this.l.cancelReleaseDetailsButton).toBeHidden({ timeout: 20_000 });
  }

  async expectEditModeChangeSummaryValue(value: string): Promise<void> {
    await expect.poll(async () => this.getEditModeChangeSummaryValue(), { timeout: 20_000 }).toBe(value);
  }

  async clickPartOfSeProductsTab(): Promise<void> {
    await this.l.partOfSeProductsTab.click();
    await this.waitForOSLoad();
  }

  async expectPartOfSeProductsTabSelected(): Promise<void> {
    await expect(this.l.partOfSeProductsTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectAddSeProductButtonHidden(): Promise<void> {
    await expect(this.l.addSeProductButton).toBeHidden({ timeout: 15_000 });
  }

  async openAddSeProductDialog(): Promise<void> {
    await expect(this.l.addSeProductButton).toBeVisible({ timeout: 20_000 });
    await this.l.addSeProductButton.click();
  }

  async expectAddSeProductDialogVisible(): Promise<void> {
    await expect(this.l.addSeProductDialog).toBeVisible({ timeout: 20_000 });
  }

  async expectIncludedSeComponentsSectionLoaded(): Promise<void> {
    const loaded = await Promise.any([
      this.l.addSeProductButton.waitFor({ state: 'visible', timeout: 20_000 }),
      this.l.includedSeComponentsEmptyState.waitFor({ state: 'visible', timeout: 20_000 }),
      this.page.locator('table, [role="grid"]').first().waitFor({ state: 'visible', timeout: 20_000 }),
    ]).then(() => true).catch(() => false);

    expect(loaded, 'Included SE Components section should load with a button, empty state, or grid').toBe(true);
  }
}
