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
 * Stage 4 was renamed between release versions:
 *   - Newer releases: "Security & Privacy Readiness Sign Off"
 *   - Older releases: "SDPA & PQL Sign Off"
 * Both names are listed in RELEASE_STAGE_4_ALIASES; tests should accept either.
 */
export const RELEASE_STAGE_4_ALIASES = [
  'Security & Privacy Readiness Sign Off',
  'SDPA & PQL Sign Off',
] as const;

export const RELEASE_PIPELINE_STAGES = [
  'Creation & Scoping',
  'Review & Confirm',
  'Manage',
  RELEASE_STAGE_4_ALIASES[0], // primary name; RELEASE_STAGE_4_ALIASES covers the alternate
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
    await expect(this.l.releaseDetailsTab).toBeVisible({ timeout });
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
    // All known stage name variants (including both stage-4 aliases)
    const allStages = [
      ...RELEASE_PIPELINE_STAGES.map((s) => s.toLowerCase()),
      ...RELEASE_STAGE_4_ALIASES.map((s) => s.toLowerCase()),
    ];
    // Resolve stage 4 aliases: if stageName is any alias, try all aliases
    const isStage4Alias = RELEASE_STAGE_4_ALIASES.some(
      (alias) => stageName.toLowerCase() === alias.toLowerCase(),
    );
    const searchTerms = isStage4Alias
      ? RELEASE_STAGE_4_ALIASES.map((a) => a.toLowerCase())
      : [stageName.toLowerCase()];

    const startIndex = lines.findIndex((line) =>
      searchTerms.some((term) => line.toLowerCase().includes(term)),
    );

    if (startIndex === -1) {
      return [];
    }

    const sectionLines: string[] = [];
    for (let index = startIndex; index < lines.length; index += 1) {
      const line = lines[index];
      if (index > startIndex && allStages.some((stage) => line.toLowerCase().includes(stage))) {
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
    const allStages = [
      ...RELEASE_PIPELINE_STAGES.map((s) => s.toLowerCase()),
      ...RELEASE_STAGE_4_ALIASES.map((s) => s.toLowerCase()),
    ];
    return sectionLines.filter((line) => {
      const normalized = line.toLowerCase();
      return normalized !== stageName.toLowerCase()
        && !/submission/i.test(normalized)
        && !allStages.some((stage) => normalized.includes(stage));
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

  // ── Review & Confirm tab ──────────────────────────────────────────────────

  /** Returns true if the Review & Confirm content tab is accessible (not disabled-tab). */
  async isReviewConfirmTabAccessible(): Promise<boolean> {
    const tab = this.l.reviewConfirmContentTab;
    const isVisible = await tab.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!isVisible) {
      return false;
    }

    const cls = await tab.getAttribute('class').catch(() => '');
    return !cls?.includes('disabled-tab');
  }

  /** Asserts the Review & Confirm content tab is accessible (not disabled-tab). */
  async expectReviewConfirmTabAccessible(): Promise<void> {
    await expect(this.l.reviewConfirmContentTab).toBeVisible({ timeout: 20_000 });
    const cls = await this.l.reviewConfirmContentTab.getAttribute('class');
    expect(
      cls?.includes('disabled-tab'),
      'Review & Confirm tab should NOT have disabled-tab class when past Scoping stage',
    ).toBe(false);
  }

  /** Asserts the Review & Confirm tab is disabled (has disabled-tab class). */
  async expectReviewConfirmTabDisabled(): Promise<void> {
    await expect(this.l.reviewConfirmContentTab).toBeVisible({ timeout: 20_000 });
    const cls = await this.l.reviewConfirmContentTab.getAttribute('class');
    expect(
      cls?.includes('disabled-tab'),
      'Review & Confirm tab should have disabled-tab class at Scoping stage',
    ).toBe(true);
  }

  /** Clicks the Review & Confirm content tab (osui-tabs__header-item version). */
  async clickReviewConfirmContentTab(): Promise<void> {
    await expect(this.l.reviewConfirmContentTab).toBeVisible({ timeout: 20_000 });
    await this.l.reviewConfirmContentTab.click();
    await this.waitForOSLoad();
  }

  /** Asserts the Requirements Summary accordion is visible. */
  async expectRequirementsSummaryAccordionVisible(): Promise<void> {
    await expect(this.l.requirementsSummaryAccordion).toBeVisible({ timeout: 20_000 });
  }

  /** Returns true if the Requirements Summary accordion is collapsed (has is-closed class). */
  async isRequirementsSummaryCollapsed(): Promise<boolean> {
    const cls = await this.l.requirementsSummaryAccordion.getAttribute('class').catch(() => '');
    return (cls ?? '').includes('is-closed');
  }

  /** Expands the Requirements Summary accordion by clicking its title. */
  async expandRequirementsSummary(): Promise<void> {
    const isClosed = await this.isRequirementsSummaryCollapsed();
    if (isClosed) {
      await this.l.requirementsSummaryAccordionTitle.click();
      await this.waitForOSLoad();
    }
  }

  /** Returns true if the Previous FCSR Summary accordion is collapsed. */
  async isPreviousFcsrCollapsed(): Promise<boolean> {
    const cls = await this.l.previousFcsrAccordion.getAttribute('class').catch(() => '');
    return (cls ?? '').includes('is-closed');
  }

  /** Expands the Previous FCSR Summary accordion by clicking its title. */
  async expandPreviousFcsrSummary(): Promise<void> {
    const isClosed = await this.isPreviousFcsrCollapsed();
    if (isClosed) {
      await this.l.previousFcsrAccordionTitle.click();
      await this.waitForOSLoad();
    }
  }

  /** Asserts the Scope Review Participants section header is visible. */
  async expectScopeReviewParticipantsVisible(): Promise<void> {
    await expect(this.l.scopeReviewParticipantsHeader).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Asserts the Scope Review Participants table contains the expected column headers.
   * DOM column text uses Title Case; CSS text-transform makes them appear UPPERCASE visually.
   * Expected: Scope Review Participant Name, Role, Recommendation, Participant's Comments
   */
  async expectScopeReviewParticipantsColumnsVisible(): Promise<void> {
    const expectedHeaders = [
      /scope review participant name/i,
      /^role$/i,
      /^recommendation$/i,
      /participant.s comments/i,
    ];
    for (const header of expectedHeaders) {
      await expect(
        this.page.locator('[role="columnheader"], th').filter({ hasText: header }).first(),
        `Column header matching /${header.source}/i should be visible in the Scope Review Participants table`,
      ).toBeVisible({ timeout: 15_000 });
    }
  }

  /** Asserts the Key Discussion Topics section header is visible. */
  async expectKeyDiscussionTopicsVisible(): Promise<void> {
    await expect(this.l.keyDiscussionTopicsHeader).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Asserts the Key Discussion Topics table has the expected column headers.
   * DOM column text may be mixed case; case-insensitive matching used.
   * Expected: Topic Name, Discussion Details, Date, Added By
   */
  async expectKeyDiscussionTopicsColumnsVisible(): Promise<void> {
    const expectedHeaders = [
      /topic name/i,
      /discussion details/i,
      /^date$/i,
      /added by/i,
    ];
    for (const header of expectedHeaders) {
      await expect(
        this.page.locator('[role="columnheader"], th').filter({ hasText: header }).first(),
        `Column header matching /${header.source}/i should be visible in the Key Discussion Topics table`,
      ).toBeVisible({ timeout: 15_000 });
    }
  }

  /** Asserts the Scope Review Decision section header is visible. */
  async expectScopeReviewDecisionVisible(): Promise<void> {
    await expect(this.l.scopeReviewDecisionHeader).toBeVisible({ timeout: 20_000 });
  }

  /** Asserts the Action Plan header reads "ACTION PLAN FOR SCOPE REVIEW DECISIONS". */
  async expectActionPlanHeaderVisible(): Promise<void> {
    await expect(this.l.actionPlanHeader).toBeVisible({ timeout: 20_000 });
  }

  /** Asserts the Action Plan section shows "No Actions added yet" empty state. */
  async expectActionPlanEmptyState(): Promise<void> {
    await expect(this.l.actionPlanEmptyState).toBeVisible({ timeout: 15_000 });
  }

  // ── Manage Stage (WF6) ────────────────────────────────────────────────────

  /** Returns true if the release is at the Manage stage (pipeline active stage = "Manage"). */
  async isAtManageStage(): Promise<boolean> {
    const label = await this.getActiveStageName();
    return /^Manage$/i.test(label);
  }

  /**
   * Returns true if the release is at or past the Manage stage.
   * Accepts: Manage, SA & PQL Sign Off (any alias), FCSR Review, Post FCSR Actions, Final Acceptance.
   */
  async isAtOrPastManageStage(): Promise<boolean> {
    const label = await this.getActiveStageName();
    return /^Manage$|Security\s*&\s*Privacy|SDPA\s*&\s*PQL|FCSR\s*Review|Post\s*FCSR|Final\s*Acceptance/i.test(label);
  }

  /** Asserts the "Submit for SA & PQL Sign Off" action button is visible. */
  async expectSubmitForSaPqlButtonVisible(): Promise<void> {
    // The button label may be "Submit for SA & PQL Sign Off" OR "Submit for Security & Privacy..."
    const btn = this.l.submitForSaPqlButton;
    const isVisible = await btn.isVisible({ timeout: 10_000 }).catch(() => false);
    if (!isVisible) {
      // Fall back to the generic Submit button in the actions bar
      await expect(this.l.manageStageSubmitButton).toBeVisible({ timeout: 15_000 });
    }
  }

  /** Asserts the Actions Management sidebar link is visible. */
  async expectActionsManagementLinkVisible(): Promise<void> {
    await expect(this.l.actionsManagementLink).toBeVisible({ timeout: 20_000 });
  }

  /** Asserts the View Release History sidebar link is visible. */
  async expectViewReleaseHistoryLinkVisible(): Promise<void> {
    await expect(this.l.viewReleaseHistoryLink).toBeVisible({ timeout: 20_000 });
  }

  /** Clicks the CSRR tab and waits for content to load. */
  async clickCsrrTab(): Promise<void> {
    await expect(this.l.csrrTab).toBeVisible({ timeout: 20_000 });
    await this.l.csrrTab.click();
    await this.waitForOSLoad();
  }

  /** Asserts the CSRR tab is accessible (not disabled). */
  async expectCsrrTabAccessible(): Promise<void> {
    await expect(this.l.csrrTab).toBeVisible({ timeout: 20_000 });
    const isDisabled = await this.isTopLevelTabDisabled('Cybersecurity Residual Risks');
    expect(isDisabled, 'CSRR tab should not be disabled at Manage stage or later').toBe(false);
  }

  /** Asserts the FCSR Decision tab is accessible. */
  async expectFcsrDecisionTabAccessible(): Promise<void> {
    await expect(this.l.fcsrDecisionTab).toBeVisible({ timeout: 20_000 });
    const isDisabled = await this.isTopLevelTabDisabled('FCSR Decision');
    expect(isDisabled, 'FCSR Decision tab should not be disabled at Manage stage or later').toBe(false);
  }

  /** Asserts the SBOM Status label is visible on the CSRR SDL Processes Summary. */
  async expectSbomStatusLabelVisible(): Promise<void> {
    await expect(this.l.sbomStatusLabel).toBeVisible({ timeout: 20_000 });
  }

  /** Clicks the FCSR Decision tab and waits for content to load. */
  async clickFcsrDecisionTab(): Promise<void> {
    await expect(this.l.fcsrDecisionTab).toBeVisible({ timeout: 20_000 });
    await this.l.fcsrDecisionTab.click();
    await this.waitForOSLoad();
  }
}