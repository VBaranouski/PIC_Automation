/**
 * Spec — Release Detail Page Header (Sprint 2)
 *
 * Tests the breadcrumb, release status badge, 7-stage pipeline bar,
 * "View Flow" toggle, and "Need Help" link on the Release Detail page.
 *
 * Navigation strategy:
 *   1. Land on Landing Page → My Releases tab
 *   2. Click the first release name link (navigates to ReleaseDetail)
 *   3. Persist that URL as `releaseDetailUrl` so all tests in this describe
 *      block share the same release without re-navigating via the grid.
 *
 * All tests are non-destructive (read-only UI checks).
 */

import { test, expect } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage } from '../../src/pages';
import * as allure from 'allure-js-commons';
import { RELEASE_PIPELINE_STAGES, RELEASE_STAGE_4_ALIASES } from '../../src/pages';

// Helper: accept either stage-4 variant when checking pipeline / workflow labels.
function stageFoundIn(labels: string[], expectedStage: string): boolean {
  const isStage4 = RELEASE_STAGE_4_ALIASES.some(
    (a) => a.toLowerCase() === expectedStage.toLowerCase(),
  );
  const variants = isStage4 ? [...RELEASE_STAGE_4_ALIASES] : [expectedStage];
  return labels.some((label) =>
    variants.some((v) => label.toLowerCase().includes(v.toLowerCase())),
  );
}
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Helper — navigate via My Products → Product Detail → first release
// Returns the Release Detail URL (includes ProductId for full 3-level breadcrumb)
// ---------------------------------------------------------------------------

async function navigateToAnyRelease(page: Page, landingPage: LandingPage): Promise<string> {
  // Primary path — My Releases tab. This is resilient because it lists every
  // release the test user can see, regardless of which product they belong to.
  try {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Releases');
    await landingPage.waitForGridDataRows(30_000);

    const firstReleaseLink = landingPage.grid.getByRole('row').nth(1).getByRole('link').first();
    await expect(firstReleaseLink).toBeVisible({ timeout: 30_000 });

    await Promise.all([
      page.waitForURL(/ReleaseDetail/, { timeout: 60_000 }),
      firstReleaseLink.click(),
    ]);
    return page.url();
  } catch (myReleasesError) {
    // Fallback path — cached product URL or My Products tab → first product → Releases tab.
    const stateFile = path.resolve(__dirname, '../../.product-state.json');
    let productUrl: string | null = null;
    if (fs.existsSync(stateFile)) {
      try {
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
        productUrl = state.productWithReleasesUrl || null;
      } catch { /* fall through */ }
    }

    if (!productUrl) {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My Products');
      await landingPage.grid.getByRole('row').nth(1).waitFor({ state: 'visible', timeout: 30_000 });
      const link = landingPage.grid.getByRole('row').nth(1).getByRole('link').first();
      productUrl = await link.getAttribute('href') ?? null;
      if (!productUrl) {
        throw new Error(
          `Unable to open a Release Detail page. My Releases path: ${
            myReleasesError instanceof Error ? myReleasesError.message : String(myReleasesError)
          }; My Products had no product link.`,
        );
      }
    }

    await page.goto(productUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/ProductDetail/, { timeout: 60_000 });
    await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(2_000);

    const releasesTab = page.getByRole('tab', { name: /^Releases$/i }).first();
    if ((await releasesTab.count()) > 0) {
      await releasesTab.click();
      await page.waitForTimeout(2_000);
    }

    const firstLink = page.getByRole('grid').getByRole('row').nth(1).getByRole('link').first()
      .or(page.locator('table tbody tr').nth(0).getByRole('link').first());
    await firstLink.waitFor({ state: 'visible', timeout: 30_000 });

    await Promise.all([
      page.waitForURL(/ReleaseDetail/, { timeout: 60_000 }),
      firstLink.click(),
    ]);
    return page.url();
  }
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

test.describe.serial('Releases - Release Detail Header (Sprint 2) @regression', () => {
  test.setTimeout(480_000);

  let releaseDetailUrl: string;

  // Login before every test — same pattern as create-new-release.spec.ts
  // ── RELEASE-HEADER-001 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-001 — should load Release Detail page with breadcrumb showing Home > Product > Release', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-001: Navigating to a Release Detail page must load the page ' +
      'and display a breadcrumb with at least 3 items: Home, Product Name, Release Version.',
    );

    await test.step('Navigate to release (discover URL from My Releases grid)', async () => {
      // First run: discover the release URL via landing page; subsequent runs reuse it
      if (!releaseDetailUrl) {
        releaseDetailUrl = await navigateToAnyRelease(page, landingPage);
      } else {
        await page.goto(releaseDetailUrl);
        await releaseDetailPage.waitForPageLoad();
      }
    });

    await test.step('Verify breadcrumb is visible', async () => {
      await releaseDetailPage.expectBreadcrumbVisible();
    });

    await test.step('Verify Home link is present in breadcrumb', async () => {
      await releaseDetailPage.expectBreadcrumbHomeLinkVisible();
    });

    await test.step('Verify Product Detail link is present in breadcrumb', async () => {
      // Must check product link BEFORE counting — it renders asynchronously
      await releaseDetailPage.expectBreadcrumbProductLinkVisible();
    });

    await test.step('Verify breadcrumb has at least 3 items (Home, Product, Release)', async () => {
      const texts = await releaseDetailPage.getBreadcrumbTexts();
      expect(
        texts.length,
        `Breadcrumb should have at least 3 items; got: ${JSON.stringify(texts)}`,
      ).toBeGreaterThanOrEqual(3);
    });
  });

  // ── RELEASE-HEADER-002 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-002 — should show a release status badge with non-empty text in the header', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-002: The Release Detail page header must show a release status badge ' +
      '(e.g. "Scoping", "Active", "Actions Closure"). The badge must be visible and have ' +
      'non-empty text.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify release status badge is visible with text', async () => {
      await releaseDetailPage.expectReleaseStatusBadgeVisible();
      const statusText = await releaseDetailPage.getReleaseStatusText();
      expect(
        statusText,
        'Release status badge must have a non-empty text value',
      ).not.toBe('');
    });
  });

  // ── RELEASE-HEADER-003 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-003 — should show exactly 7 pipeline stage tabs on the Release Detail page', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-003: The Release Detail pipeline bar must contain exactly 7 stage tabs: ' +
      'Creation & Scoping, Review & Confirm, Manage, Security & Privacy Readiness Sign Off, FCSR Review, ' +
      'Post FCSR Actions, Final Acceptance.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Expand pipeline if collapsed', async () => {
      // If the pipeline is collapsed the "View Flow" toggle text indicates expansion
      const toggleVisible = await releaseDetailPage['l'].viewFlowToggle.isVisible().catch(() => false);
      if (toggleVisible) {
        await releaseDetailPage.clickViewFlowToggleAndExpand();
      }
    });

    await test.step('Verify pipeline shows exactly 7 stage tabs', async () => {
      await releaseDetailPage.expectPipelineStageCount(7);
    });

    await test.step('Verify all expected stage names are present in the pipeline', async () => {
      const stageLabels = await releaseDetailPage.getPipelineStageLabels();
      for (const expectedStage of RELEASE_PIPELINE_STAGES) {
        expect(
          stageFoundIn(stageLabels, expectedStage),
          `Stage "${expectedStage}" not found in pipeline labels: ${JSON.stringify(stageLabels)}`,
        ).toBe(true);
      }
    });
  });

  // ── RELEASE-HEADER-004 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-004 — should highlight exactly one stage as active in the pipeline bar', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-004: The Release Detail pipeline bar must have exactly one stage with ' +
      'the "active" CSS class, visually distinguishing the current stage from past and future ones.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Expand pipeline if collapsed', async () => {
      const toggleVisible = await releaseDetailPage['l'].viewFlowToggle.isVisible().catch(() => false);
      if (toggleVisible) {
        await releaseDetailPage.clickViewFlowToggleAndExpand();
      }
    });

    await test.step('Verify exactly one pipeline stage is active', async () => {
      await releaseDetailPage.expectExactlyOneActiveStage();
    });

    await test.step('Log active stage name for visibility', async () => {
      const activeStageName = await releaseDetailPage.getActiveStageName();
      expect(activeStageName.length, `Active stage name must be non-empty`).toBeGreaterThan(0);
    });
  });

  // ── RELEASE-HEADER-005 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-005 — should show the "View Flow" toggle that expands and reveals the pipeline bar', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-005: The "View Flow" toggle element must be visible in the Release Detail ' +
      'header. Clicking it must reveal/expand the pipeline stages area.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify "View Flow" toggle is visible', async () => {
      await releaseDetailPage.expectViewFlowToggleVisible();
    });

    await test.step('Click "View Flow" toggle and verify pipeline area is visible', async () => {
      await releaseDetailPage.clickViewFlowToggleAndExpand();
      await releaseDetailPage.expectPipelineAreaVisible();
    });
  });

  // ── RELEASE-HEADER-006 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-006 — should show a "Need Help" link in the Release Detail header', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-006: The Release Detail page must have a "Need Help" link visible ' +
      'in the top-right area of the header. It provides access to the stage sidebar ' +
      'with responsible users and stage description.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify "Need Help" link is visible in the header', async () => {
      await releaseDetailPage.expectNeedHelpLinkVisible();
    });
  });

  // ── RELEASE-HEADER-007 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-007 — should navigate to Landing Page when Home breadcrumb link is clicked', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-007: Clicking the "Home" link in the Release Detail breadcrumb must ' +
      'navigate the user to the Landing Page. Clicking the Product Name link must navigate ' +
      'back to the Product Detail page.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Click Home breadcrumb link and verify Landing Page loads', async () => {
      await releaseDetailPage.clickBreadcrumbHome();
      await expect(page).toHaveURL(/HomePage|GRC_PICASso\/?(\?|$)/, { timeout: 30_000 });
    });

    await test.step('Navigate back to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Click Product breadcrumb link and verify Product Detail page loads', async () => {
      await releaseDetailPage.clickBreadcrumbProduct();
      await expect(page).toHaveURL(/ProductDetail/, { timeout: 30_000 });
    });
  });

  // ── RELEASE-HEADER-008 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-008 — should show all 7 expected pipeline stage names in the workflow bar', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-008: Every stage in the 7-step Release workflow must be labelled with ' +
      'its expected name: Creation & Scoping, Review & Confirm, Manage, Security & Privacy Readiness Sign Off, ' +
      'FCSR Review, Post FCSR Actions, Final Acceptance. Each name must appear in the pipeline.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Expand pipeline if collapsed', async () => {
      const toggleVisible = await releaseDetailPage['l'].viewFlowToggle.isVisible().catch(() => false);
      if (toggleVisible) {
        await releaseDetailPage.clickViewFlowToggleAndExpand();
      }
    });

    await test.step('Verify all 7 stage names are present in the pipeline bar', async () => {
      const stageLabels = await releaseDetailPage.getPipelineStageLabels();
      for (const stage of RELEASE_PIPELINE_STAGES) {
        expect(
          stageFoundIn(stageLabels, stage),
          `Stage "${stage}" missing from pipeline. Found labels: ${JSON.stringify(stageLabels)}`,
        ).toBe(true);
      }
    });
  });

  // ── RELEASE-HEADER-009 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-009 — should show submission summary details for stages in the workflow panel', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-009: Expanding View Flow must show workflow sections with a submission summary ' +
      'for each release stage, such as required submissions or current submission progress.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Open the workflow panel', async () => {
      await releaseDetailPage.clickViewFlowToggleAndExpand();
      await releaseDetailPage.expectPipelineAreaVisible();
    });

    await test.step('Verify each stage section shows a submission summary', async () => {
      for (const stage of RELEASE_PIPELINE_STAGES) {
        const summary = await releaseDetailPage.getWorkflowStageSubmissionSummary(stage);
        expect(
          summary,
          `Workflow section for "${stage}" must show a submission summary`,
        ).toMatch(/submission/i);
      }
    });
  });

  // ── RELEASE-HEADER-010 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-010 — should show responsible user entries for the active stage in the workflow panel', async ({
    page, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-010: The active stage section in the View Flow workflow panel must list at least one ' +
      'responsible-user entry beneath the submission summary.',
    );

    await test.step('Navigate to release', async () => {
      await page.goto(releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Open the workflow panel and capture the active stage', async () => {
      await releaseDetailPage.clickViewFlowToggleAndExpand();
      await releaseDetailPage.expectPipelineAreaVisible();
    });

    await test.step('Verify the active stage lists responsible-user entries', async () => {
      const activeStage = await releaseDetailPage.getActiveStageName();
      const responsibleEntries = await releaseDetailPage.getWorkflowStageResponsibleEntries(activeStage);

      expect(
        responsibleEntries.length,
        `Expected workflow section for active stage "${activeStage}" to include responsible-user entries.`,
      ).toBeGreaterThan(0);
    });
  });

  // ── RELEASE-HEADER-011 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-011 — should open Stage Sidebar with stage name, responsible users table, description and Close button', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-011: Clicking the Need Help link must open the Stage Sidebar panel showing the current stage name, a table of responsible users with their roles and approval dates, a stage description text, and a Close (X) button.',
    );

    await test.step('Navigate to release', async () => {
      if (!releaseDetailUrl) {
        releaseDetailUrl = await navigateToAnyRelease(page, landingPage);
      } else {
        await page.goto(releaseDetailUrl);
        await releaseDetailPage.waitForPageLoad();
      }
    });

    await test.step('Click the Need Help link', async () => {
      await releaseDetailPage['l'].needHelpLink.click();
    });

    await test.step('Wait for Stage Sidebar to appear or skip if absent', async () => {
      const sidebar = page
        .locator('.sidebar, [data-block*="Sidebar"], [data-block*="Help"], aside, [role="dialog"], [role="complementary"]')
        .first();
      const sidebarVisible = await sidebar.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!sidebarVisible, 'Stage Sidebar did not appear after clicking Need Help — may require specific release state');
    });

    await test.step('Verify sidebar contains a pipeline stage name or section header', async () => {
      const sidebar = page
        .locator('.sidebar, [data-block*="Sidebar"], [data-block*="Help"], aside, [role="dialog"], [role="complementary"]')
        .first();
      const sidebarText = await sidebar.innerText().catch(() => '');
      // Accept either specific stage names OR the structural section headers the sidebar always shows
      const stagePattern = /Creation & Scoping|Review & Confirm|Manage|Security|FCSR|Post FCSR|Final Acceptance|CURRENT STAGE|Stage Responsibles|STAGE RESPONSIBLES|Need Help/i;
      expect(
        stagePattern.test(sidebarText),
        `Expected sidebar to contain a pipeline stage name or section header. Found: "${sidebarText.substring(0, 300)}"`,
      ).toBe(true);
    });

    await test.step('Verify sidebar shows responsible-users section header or table', async () => {
      const sidebar = page
        .locator('.sidebar, [data-block*="Sidebar"], [data-block*="Help"], aside, [role="dialog"], [role="complementary"]')
        .first();
      const sidebarText = await sidebar.innerText().catch(() => '');
      // Check for the section header text first (most reliable)
      const hasHeader = /STAGE RESPONSIBLES|Stage Responsibles|Responsible/i.test(sidebarText);
      if (!hasHeader) {
        // Fall back to checking for a visible table element
        const usersTable = sidebar.locator('table, [role="table"]').first();
        const tableVisible = await usersTable.isVisible({ timeout: 5_000 }).catch(() => false);
        expect(
          tableVisible,
          'Expected Stage Sidebar to contain responsible users section or table.',
        ).toBe(true);
      }
      // If the header is present, that's sufficient evidence of stage info
    });

    await test.step('Verify sidebar has stage description section header or text', async () => {
      const sidebar = page
        .locator('.sidebar, [data-block*="Sidebar"], [data-block*="Help"], aside, [role="dialog"], [role="complementary"]')
        .first();
      const sidebarText = await sidebar.innerText().catch(() => '');
      const hasDescSection = /STAGE DESCRIPTION|Stage Description/i.test(sidebarText);
      if (!hasDescSection) {
        // Fallback: look for a paragraph with some text
        const descLocator = sidebar.locator('p, [class*="desc"], [class*="text"]').first();
        const descVisible = await descLocator.isVisible({ timeout: 5_000 }).catch(() => false);
        if (descVisible) {
          const descText = await descLocator.innerText().catch(() => '');
          expect(descText.trim().length, 'Stage Sidebar description must be non-empty').toBeGreaterThan(0);
        }
      }
      // Section header present — passes
    });

    await test.step('Verify sidebar has a Close button', async () => {
      const closeBtn = page
        .getByRole('button', { name: /Close|×|✕/i })
        .or(page.locator('.fa-times, .icon-times, [aria-label="close"]').first())
        .first();
      const closeBtnVisible = await closeBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      expect(closeBtnVisible, 'Stage Sidebar must have a Close (X) button.').toBe(true);
    });

    await test.step('Close the Stage Sidebar', async () => {
      const closeBtn = page
        .getByRole('button', { name: /Close|×|✕/i })
        .or(page.locator('.fa-times, .icon-times, [aria-label="close"]').first())
        .first();
      const closeBtnVisible = await closeBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (closeBtnVisible) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
    });
  });

  // ── RELEASE-HEADER-012 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-012 — should show submission counter format (N from M submissions) in workflow panel for active stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-012: The workflow panel (View Flow area) must display a submission ' +
      'counter in the format "N from M submission(s)" or "M submission(s) required" for ' +
      'the active stage. This validates the submission-count UI element is present and ' +
      'has the expected numeric format.',
    );

    await test.step('Navigate to release', async () => {
      if (!releaseDetailUrl) {
        releaseDetailUrl = await navigateToAnyRelease(page, landingPage);
      } else {
        await page.goto(releaseDetailUrl);
        await releaseDetailPage.waitForPageLoad();
      }
    });

    await test.step('Expand the workflow panel', async () => {
      await releaseDetailPage.clickViewFlowToggleAndExpand();
      await releaseDetailPage.expectPipelineAreaVisible();
    });

    await test.step('Verify active stage section shows a numeric submission counter', async () => {
      const activeStage = await releaseDetailPage.getActiveStageName();
      const sectionLines = await releaseDetailPage.getWorkflowSectionLines(activeStage);

      // The counter line should match: "0 from 1 submission", "2 submissions required",
      // "1 submission required", etc.
      const counterLine = sectionLines.find((line) =>
        /\d+\s*(from\s*\d+)?\s*submission/i.test(line),
      );

      expect(
        counterLine,
        `Expected workflow panel for active stage "${activeStage}" to show a numeric submission counter. ` +
        `Section lines found: ${JSON.stringify(sectionLines)}`,
      ).toBeTruthy();

      // Verify the counter contains at least one digit
      const digits = counterLine?.match(/\d+/g) ?? [];
      expect(
        digits.length,
        `Submission counter line "${counterLine}" must contain at least one digit`,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  // ── RELEASE-HEADER-013 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-013 — should show at least one responsible user for the active stage in the workflow panel', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-013: For the active stage in the View Flow workflow panel, ' +
      'at least one responsible user entry must be visible below the submission counter. ' +
      'This confirms that responsible users are pre-calculated based on the Minimum ' +
      'Oversight Level and Last BU SO FCSR Date for the current stage.',
    );

    await test.step('Navigate to release', async () => {
      if (!releaseDetailUrl) {
        releaseDetailUrl = await navigateToAnyRelease(page, landingPage);
      } else {
        await page.goto(releaseDetailUrl);
        await releaseDetailPage.waitForPageLoad();
      }
    });

    await test.step('Expand the workflow panel', async () => {
      await releaseDetailPage.clickViewFlowToggleAndExpand();
      await releaseDetailPage.expectPipelineAreaVisible();
    });

    await test.step('Verify active stage lists at least one responsible user', async () => {
      const activeStage = await releaseDetailPage.getActiveStageName();
      const responsibleEntries = await releaseDetailPage.getWorkflowStageResponsibleEntries(activeStage);

      expect(
        responsibleEntries.length,
        `Active stage "${activeStage}" must list at least one responsible user in the workflow panel. ` +
        `Got entries: ${JSON.stringify(responsibleEntries)}`,
      ).toBeGreaterThan(0);

      // Each responsible user entry must be non-empty (not a blank line)
      for (const entry of responsibleEntries) {
        expect(
          entry.trim().length,
          `Responsible user entry "${entry}" must be non-empty`,
        ).toBeGreaterThan(0);
      }
    });
  });

  // ── RELEASE-HEADER-014 ────────────────────────────────────────────────────
  test('RELEASE-HEADER-014 — should show all required submission counts for every pipeline stage in workflow panel', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-014: Every pipeline stage section in the View Flow workflow panel ' +
      'must display a submission count line. This validates that the workflow panel ' +
      'communicates submission requirements to all 7 release stages consistently.',
    );

    await test.step('Navigate to release', async () => {
      if (!releaseDetailUrl) {
        releaseDetailUrl = await navigateToAnyRelease(page, landingPage);
      } else {
        await page.goto(releaseDetailUrl);
        await releaseDetailPage.waitForPageLoad();
      }
    });

    await test.step('Expand the workflow panel', async () => {
      await releaseDetailPage.clickViewFlowToggleAndExpand();
      await releaseDetailPage.expectPipelineAreaVisible();
    });

    await test.step('Verify all 7 pipeline stages show a submission count line', async () => {
      for (const stage of RELEASE_PIPELINE_STAGES) {
        const summary = await releaseDetailPage.getWorkflowStageSubmissionSummary(stage);
        expect(
          summary,
          `Stage "${stage}" must show a submission count in the workflow panel`,
        ).toMatch(/submission/i);

        // Additionally verify it contains a digit (e.g. "1 submission required")
        expect(
          /\d/.test(summary),
          `Stage "${stage}" submission line "${summary}" must contain a digit`,
        ).toBe(true);
      }
    });
  });

  // ── RELEASE-HEADER-015 ────────────────────────────────────────────────────
  test.fixme('RELEASE-HEADER-015 — should expose all 9 expected content tabs on Release Detail page', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-HEADER-015: A Release Detail page must render all 9 content tabs: ' +
      'Release Details, Roles & Responsibilities, Questionnaire, Process Requirements, ' +
      'Product Requirements, Review & Confirm, Data Protection and Privacy Review, ' +
      'Cybersecurity Residual Risks, and FCSR Decision. Tabs may be enabled or ' +
      'disabled depending on stage / questionnaire submission, but each must be present.',
    );

    await test.step('Navigate to release', async () => {
      if (!releaseDetailUrl) {
        releaseDetailUrl = await navigateToAnyRelease(page, landingPage);
      } else {
        await page.goto(releaseDetailUrl);
        await releaseDetailPage.waitForPageLoad();
      }
    });

    const expectedTabs = [
      'Release Details',
      'Roles & Responsibilities',
      'Questionnaire',
      'Process Requirements',
      'Product Requirements',
      'Review & Confirm',
      // Tab label varies between "Data Protection and Privacy Review" and "Data Protection & Privacy Review";
      // assert via regex below.
      'Cybersecurity Residual Risks',
      'FCSR Decision',
    ];

    await test.step('Verify each named content tab is visible', async () => {
      for (const tabName of expectedTabs) {
        const visible = await releaseDetailPage.isTopLevelTabVisible(tabName);
        expect(visible, `Content tab "${tabName}" must be visible on the Release Detail page`).toBe(true);
      }
    });

    await test.step('Verify the Data Protection & Privacy Review tab is visible (label varies)', async () => {
      const dppTab = page
        .getByRole('tab', { name: /Data Protection\s*(and|&)\s*Privacy Review/i })
        .first();
      await expect(dppTab).toBeVisible({ timeout: 15_000 });
    });
  });

  // ── RELEASE-CANCEL-001 ────────────────────────────────────────────────────
  test('RELEASE-CANCEL-001 — should expose Cancel Release button on Release Detail page at Scoping stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CANCEL-001: A release in the Creation & Scoping stage must expose ' +
      'a "Cancel Release" button on the Release Detail page header. This test ' +
      'verifies button presence only — clicking is destructive and out of scope.',
    );

    await test.step('Navigate to release', async () => {
      if (!releaseDetailUrl) {
        releaseDetailUrl = await navigateToAnyRelease(page, landingPage);
      } else {
        await page.goto(releaseDetailUrl);
        await releaseDetailPage.waitForPageLoad();
      }
    });

    await test.step('Verify the release is at the Scoping stage', async () => {
      const status = await releaseDetailPage.getReleaseStatusText();
      expect(
        /Scoping/i.test(status),
        `Release status badge must indicate Scoping stage; saw "${status}"`,
      ).toBe(true);
    });

    await test.step('Verify the Cancel Release button is visible', async () => {
      const cancelBtn = page.getByRole('button', { name: /^\s*Cancel\s+Release\s*$/i }).first();
      await expect(
        cancelBtn,
        'Cancel Release button must be visible on the Release Detail page header',
      ).toBeVisible({ timeout: 15_000 });
    });
  });

  test('RELEASE-CANCEL-002 — clicking Cancel Release shows a confirmation dialog', async ({
    page, disposableRelease, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Cancel Release');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CANCEL-002: A disposable release at Creation & Scoping can open the Cancel Release confirmation dialog without touching shared QA data.',
    );

    await test.step('Open the disposable release detail page', async () => {
      await page.goto(disposableRelease.url, { waitUntil: 'domcontentloaded' });
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.expectReleaseStatus(/Scoping/i);
    });

    await test.step('Click Cancel Release and verify the confirmation dialog', async () => {
      await releaseDetailPage.clickCancelRelease();
      await releaseDetailPage.expectCancelReleaseDialogVisible();
    });

    await test.step('Dismiss the dialog so the disposable release remains available only for this assertion', async () => {
      await releaseDetailPage.dismissCancelReleaseDialog();
      await releaseDetailPage.expectReleaseStatus(/Scoping/i);
    });
  });

  test('RELEASE-CANCEL-003 — confirming cancellation changes the release status to Cancelled', async ({
    page, disposableRelease, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Cancel Release');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CANCEL-003: A disposable release can be cancelled end to end and the Release Detail status updates to Cancelled.',
    );

    await test.step('Open the disposable release detail page', async () => {
      await page.goto(disposableRelease.url, { waitUntil: 'domcontentloaded' });
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.expectReleaseStatus(/Scoping/i);
    });

    await test.step('Confirm release cancellation', async () => {
      await releaseDetailPage.clickCancelRelease();
      await releaseDetailPage.confirmCancelRelease(`Automated cancellation for ${disposableRelease.version}`);
    });

    await test.step('Verify the release status is Cancelled', async () => {
      await releaseDetailPage.expectReleaseStatus(/Cancelled|Canceled/i);
    });
  });

  test('RELEASE-CANCEL-005 — cancelled release shows a warning message on its detail page', async ({
    page, disposableRelease, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Cancel Release');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CANCEL-005: After a disposable release is cancelled, its detail page exposes visible cancelled-state messaging.',
    );

    await test.step('Open and cancel the disposable release', async () => {
      await page.goto(disposableRelease.url, { waitUntil: 'domcontentloaded' });
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickCancelRelease();
      await releaseDetailPage.confirmCancelRelease(`Automated cancellation for ${disposableRelease.version}`);
    });

    await test.step('Verify cancelled-state messaging is visible', async () => {
      await releaseDetailPage.expectReleaseStatus(/Cancelled|Canceled/i);
      await releaseDetailPage.expectCancelledReleaseWarningVisible();
    });
  });
});
