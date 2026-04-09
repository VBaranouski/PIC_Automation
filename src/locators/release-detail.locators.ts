import type { Page } from '@playwright/test';

/**
 * Locators for the Release Detail page.
 *
 * DOM notes (observed 2026-04-07 on qa.leap.schneider-electric.com):
 *   - Breadcrumb:   <nav aria-label="breadcrumb" class="breadcrumbs">
 *   - Release badge: [data-block="Patterns.ReleaseStatusTag"] .tag span
 *   - Pipeline:     .wizard-wrapper[role="tablist"] > .wizard-wrapper-item[role="tab"]
 *   - Active stage: .wizard-wrapper-item.active[role="tab"]
 *   - View Flow:    div.expandable-area--toggle  (collapses/expands pipeline area)
 *   - Need Help:    [data-block="Release.ReleaseHelp"] a
 */
export function releaseDetailLocators(page: Page) {
  return {
    // ── Breadcrumb ──────────────────────────────────────────────────────────
    /** Full breadcrumb nav element */
    breadcrumbNav: page.locator('nav[aria-label="breadcrumb"], .breadcrumbs').first(),
    /** "Home" anchor in breadcrumb */
    breadcrumbHomeLink: page
      .locator('nav[aria-label="breadcrumb"] a[href*="HomePage"], .breadcrumbs a[href*="HomePage"]')
      .first(),
    /** Product name anchor in breadcrumb */
    breadcrumbProductLink: page
      .locator(
        'nav[aria-label="breadcrumb"] a[href*="ProductDetail"], .breadcrumbs a[href*="ProductDetail"]',
      )
      .first(),
    /** Current-page anchor (release version) — has aria-current="page" */
    breadcrumbCurrentLink: page
      .locator(
        'nav[aria-label="breadcrumb"] a[aria-current="page"], .breadcrumbs a[aria-current="page"]',
      )
      .first(),
    /** All breadcrumb item wrappers */
    breadcrumbItems: page.locator('.breadcrumbs-item, nav[aria-label="breadcrumb"] li'),

    // ── Header status badges ─────────────────────────────────────────────────
    /** Release status badge text (e.g. "Scoping", "Active", "Actions Closure") */
    releaseStatusBadge: page.locator('[data-block="Patterns.ReleaseStatusTag"] .tag span').first(),
    /** Product status badge text (e.g. "Active") */
    productStatusBadge: page.locator('[data-block="Patterns.ProductStatusTag"] .tag span').first(),

    // ── Pipeline / workflow bar ──────────────────────────────────────────────
    /** Tablist wrapper that contains all 7 stage tabs */
    pipelineTablist: page.locator('.wizard-wrapper[role="tablist"]').first(),
    /** All 7 stage tab elements */
    pipelineStages: page.locator('.wizard-wrapper-item[role="tab"]'),
    /** The single currently-active stage tab */
    pipelineActiveStage: page.locator('.wizard-wrapper-item.active[role="tab"]').first(),
    /** Stage tabs that have been completed (past) */
    pipelinePastStages: page.locator('.wizard-wrapper-item.past[role="tab"]'),

    // ── View Flow toggle (div — NOT a button) ───────────────────────────────
    /** Clicking this div expands/collapses the pipeline expandable area */
    viewFlowToggle: page.locator('div.expandable-area--toggle').first(),
    /** Wrapper div that is expanded/collapsed by the toggle */
    pipelineExpandableArea: page.locator('div.expandable-area').first(),

    // ── Need Help ───────────────────────────────────────────────────────────
    /** "Need Help" anchor link in the top-right of the release header */
    needHelpLink: page
      .locator('[data-block="Release.ReleaseHelp"] a, a:has-text("Need Help")')
      .first(),

    // ── Release Details tab ────────────────────────────────────────────────
    /** Default content tab on Release Detail */
    releaseDetailsTab: page.getByRole('tab', { name: /^Release Details\b/i }).first(),
    questionnaireTab: page.getByRole('tab', { name: /^Questionnaire\b/i }).first(),
    processRequirementsTab: page.getByRole('tab', { name: /^Process Requirements\b/i }).first(),
    productRequirementsTab: page.getByRole('tab', { name: /^Product Requirements\b/i }).first(),
    reviewAndConfirmTab: page.getByRole('tab', { name: /^Review\s*&\s*Confirm\b/i }).first(),
    csrrTab: page.getByRole('tab', { name: /^(Cybersecurity Residual Risks\b|CSRR\b)/i }).first(),
    fcsrDecisionTab: page.getByRole('tab', { name: /^FCSR Decision\b/i }).first(),
    dppReviewTab: page.getByRole('tab', { name: /^(Data Protection and Privacy Review\b|DPP Review\b)/i }).first(),
    startQuestionnaireButton: page.getByRole('button', { name: /Start Questionnaire/i }).first(),
    questionnaireEmptyState: page.getByText(/No questionnaire started yet!?/i).first(),
    questionnaireSubmitGuidance: page
      .getByText(/The "Submit for Review" button will be enabled, once the Questionnaire has been submitted/i)
      .first(),
    /** Nested SE product subtabs inside Release Details */
    includedSeComponentsTab: page.getByRole('tab', { name: /^Included SE Components$/i }).first(),
    partOfSeProductsTab: page.getByRole('tab', { name: /^Part of SE Products$/i }).first(),
    /** Action button shown in Included SE Components area */
    addSeProductButton: page.getByRole('button', { name: /Add SE Product/i }).first(),
    /** Modal opened from Included SE Components */
    addSeProductDialog: page.getByRole('dialog').filter({ has: page.getByText(/Add SE Component/i) }).first(),
    /** Inline edit trigger in Release Details */
    editReleaseDetailsButton: page.getByRole('button', { name: /Edit Release Details/i }).first(),
    /** Inline actions and fields rendered after entering edit mode */
    saveReleaseDetailsButton: page.getByRole('button', { name: /^Save$/ }).first(),
    cancelReleaseDetailsButton: page.getByRole('button', { name: /^Cancel$/ }).first(),
    targetReleaseDateInput: page.getByRole('textbox', { name: 'Select a date.' }).first(),
    changeSummaryTextarea: page.getByRole('textbox', { name: /Change Summary/i }).first(),
    /** Empty state observed when no related SE products are associated */
    includedSeComponentsEmptyState: page.getByText(/No Components Associated yet|There are no SE products included in this product/i).first(),
  };
}

export type ReleaseDetailLocators = ReturnType<typeof releaseDetailLocators>;
