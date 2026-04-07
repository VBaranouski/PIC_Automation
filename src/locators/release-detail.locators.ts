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
  };
}

export type ReleaseDetailLocators = ReturnType<typeof releaseDetailLocators>;
