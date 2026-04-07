import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { releaseDetailLocators } from '../locators/release-detail.locators';
import type { ReleaseDetailLocators } from '../locators/release-detail.locators';
import { BasePage } from './base.page';

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
    await this.waitForOSLoad();
    // Wait for network to settle so AJAX-rendered widgets (status badge, pipeline) finish loading
    await this.page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
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

  // ── Need Help ──────────────────────────────────────────────────────────────

  /** Asserts the "Need Help" anchor link is visible in the header. */
  async expectNeedHelpLinkVisible(): Promise<void> {
    await expect(this.l.needHelpLink).toBeVisible({ timeout: 15_000 });
  }
}
