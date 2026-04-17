import { expect, type Page } from '@playwright/test';
import type { LandingPage } from '../../../src/pages';
import * as fs from 'fs';
import * as path from 'path';

import { buildUrl } from '../../../src/helpers/url.helper';

async function waitForHealthyReleaseDetail(page: Page, timeout = 60_000): Promise<string> {
  await page.waitForURL(/ReleaseDetail/, { timeout });
  await page.waitForFunction(
    "() => !document.body?.innerText?.includes('JavaScript is required')",
    undefined,
    { timeout },
  ).catch(() => undefined);
  await expect(page.getByRole('tab', { name: /^Release Details\b/i }).first()).toBeVisible({ timeout: 20_000 });

  if (page.url().includes('/_error.html')) {
    throw new Error(`Release navigation landed on OutSystems error page: ${page.url()}`);
  }

  return page.url();
}

async function isTabDisabled(tab: ReturnType<Page['getByRole']>): Promise<boolean> {
  return tab.evaluate((element) => {
    const className = (element.getAttribute('class') ?? '').toLowerCase();
    return element.getAttribute('aria-disabled') === 'true'
      || element.hasAttribute('disabled')
      || className.includes('disabled');
  }).catch(() => false);
}

async function isPreQuestionnaireRelease(page: Page): Promise<boolean> {
  const questionnaireTab = page.getByRole('tab', { name: /^Questionnaire\b/i }).first();
  const questionnaireVisible = await questionnaireTab.isVisible().catch(() => false);
  if (!questionnaireVisible) {
    return false;
  }

  await questionnaireTab.click();
  await page.waitForTimeout(1_500);

  const startQuestionnaireButton = page.getByRole('button', { name: /Start Questionnaire/i }).first();
  const startVisible = await startQuestionnaireButton.isVisible().catch(() => false);
  if (!startVisible) {
    return false;
  }

  const processRequirementsTab = page.getByRole('tab', { name: /^Process Requirements\b/i }).first();
  const processRequirementsVisible = await processRequirementsTab.isVisible().catch(() => false);
  if (!processRequirementsVisible) {
    return false;
  }

  return isTabDisabled(processRequirementsTab);
}

async function openSpecificReleaseDetail(page: Page, releaseDetailUrl: string): Promise<string> {
  await page.goto(releaseDetailUrl, { waitUntil: 'domcontentloaded' });
  return waitForHealthyReleaseDetail(page);
}

async function navigateFromMyReleases(page: Page, landingPage: LandingPage): Promise<string> {
  await landingPage.expectPageLoaded({ timeout: 60_000 });
  await landingPage.clickTab('My Releases');
  await landingPage.waitForGridDataRows(30_000);

  const firstReleaseLink = landingPage.grid.getByRole('row').nth(1).getByRole('link').first();
  await expect(firstReleaseLink).toBeVisible({ timeout: 30_000 });

  await Promise.all([
    page.waitForURL(/ReleaseDetail/, { timeout: 60_000 }),
    firstReleaseLink.click(),
  ]);

  return waitForHealthyReleaseDetail(page);
}

async function navigateFromProductReleases(page: Page, landingPage: LandingPage): Promise<string> {
  const stateFile = path.resolve(__dirname, '../../../.product-state.json');
  let productUrl: string | null = null;

  if (fs.existsSync(stateFile)) {
    try {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8')) as { productWithReleasesUrl?: string };
      productUrl = state.productWithReleasesUrl || null;
    } catch {
      productUrl = null;
    }
  }

  await landingPage.expectPageLoaded({ timeout: 60_000 });

  if (!productUrl) {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Products');
    await landingPage.waitForGridDataRows(30_000);

    const productLink = landingPage.grid.getByRole('row').nth(1).getByRole('link').first();
    productUrl = await productLink.getAttribute('href');

    if (!productUrl) {
      throw new Error('No product link found while locating a release detail page.');
    }

    if (!productUrl.startsWith('http')) {
      productUrl = buildUrl(productUrl);
    }
  }

  await page.goto(productUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/ProductDetail/, { timeout: 60_000 });
  await page.waitForFunction(
    "() => !document.body?.innerText?.includes('JavaScript is required')",
    undefined,
    { timeout: 60_000 },
  ).catch(() => undefined);

  const releasesTab = page.getByRole('tab', { name: /^Releases$/i }).first();
  await releasesTab.waitFor({ state: 'visible', timeout: 30_000 });
  await releasesTab.click();
  await expect(releasesTab).toHaveAttribute('aria-selected', 'true', { timeout: 30_000 });

  const visibleReleaseLinks = page.locator('a[href*="ReleaseDetail?ReleaseId="]:visible, a[href*="/ReleaseDetail?"]:visible');
  await expect(visibleReleaseLinks.first()).toBeVisible({ timeout: 30_000 });

  await Promise.all([
    page.waitForURL(/ReleaseDetail/, { timeout: 60_000 }),
    visibleReleaseLinks.first().click(),
  ]);

  return waitForHealthyReleaseDetail(page);
}

export async function navigateToAnyRelease(page: Page, landingPage: LandingPage): Promise<string> {
  const failures: string[] = [];

  try {
    return await navigateFromMyReleases(page, landingPage);
  } catch (error) {
    failures.push(`My Releases path failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    return await navigateFromProductReleases(page, landingPage);
  } catch (error) {
    failures.push(`Product Releases path failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  throw new Error(`Unable to open a Release Detail page. ${failures.join(' | ')}`);
}

export async function openReleaseDetail(
  page: Page,
  landingPage: LandingPage,
  releaseDetailUrl?: string,
): Promise<string> {
  if (releaseDetailUrl) {
    try {
      return await openSpecificReleaseDetail(page, releaseDetailUrl);
    } catch {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
    }
  }

  return navigateToAnyRelease(page, landingPage);
}

export async function findPreQuestionnaireRelease(
  page: Page,
  landingPage: LandingPage,
  maxCandidates = 15,
): Promise<string> {
  await landingPage.expectPageLoaded({ timeout: 60_000 });
  await landingPage.clickTab('My Releases');
  await landingPage.waitForGridDataRows(30_000);

  const rows = landingPage.grid.getByRole('row');
  const rowCount = await rows.count();
  const candidateUrls: string[] = [];

  for (let index = 1; index < Math.min(rowCount, maxCandidates + 1); index += 1) {
    const href = await rows.nth(index).getByRole('link').first().getAttribute('href').catch(() => null);
    if (!href) {
      continue;
    }

    candidateUrls.push(href.startsWith('http') ? href : buildUrl(href));
  }

  const failures: string[] = [];

  for (const candidateUrl of candidateUrls) {
    try {
      await openSpecificReleaseDetail(page, candidateUrl);
      const matches = await isPreQuestionnaireRelease(page);
      if (!matches) {
        continue;
      }

      return page.url();
    } catch (error) {
      failures.push(`${candidateUrl} => ${error instanceof Error ? error.message : String(error)}`);
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My Releases');
      await landingPage.waitForGridDataRows(30_000);
    }
  }

  throw new Error(
    `No pre-questionnaire release found in the first ${Math.min(rowCount - 1, maxCandidates)} My Releases rows.`
    + (failures.length ? ` Failures: ${failures.join(' | ')}` : ''),
  );
}

export async function openPreQuestionnaireRelease(
  page: Page,
  landingPage: LandingPage,
  releaseDetailUrl?: string,
): Promise<string> {
  if (releaseDetailUrl) {
    try {
      await openSpecificReleaseDetail(page, releaseDetailUrl);
      if (await isPreQuestionnaireRelease(page)) {
        return page.url();
      }
    } catch {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
    }
  }

  return findPreQuestionnaireRelease(page, landingPage);
}

// ── Helpers for Workflow 5 — Review & Confirm ─────────────────────────────────

/**
 * Returns true if the release is at or past the Review & Confirm stage.
 * Detection: the Review & Confirm content tab does NOT have the 'disabled-tab' class.
 */
async function isReviewConfirmAccessible(page: Page): Promise<boolean> {
  const reviewTab = page.locator('.osui-tabs__header-item[role="tab"]').filter({ hasText: /Review\s*&\s*Confirm/i }).first();
  // Use waitFor so Playwright retries until the tab is in the DOM (React may still be rendering).
  const appeared = await reviewTab
    .waitFor({ state: 'visible', timeout: 15_000 })
    .then(() => true)
    .catch(() => false);
  if (!appeared) {
    return false;
  }

  const cls = await reviewTab.getAttribute('class').catch(() => '');
  return !cls?.includes('disabled-tab');
}

/**
 * Returns true if the release is specifically AT the Review & Confirm stage
 * (pipeline stage 2 is active, with Add Participant/Add Topic buttons visible).
 */
async function isAtReviewConfirmStage(page: Page): Promise<boolean> {
  const activeStage = page.locator('.wizard-wrapper-item.active[role="tab"]').first();
  const stageName = await activeStage.getAttribute('aria-label').catch(() => '');
  return /Review\s*&\s*Confirm/i.test(stageName ?? '');
}

/**
 * Scans My Releases for a release at or past Review & Confirm stage.
 * The Review & Confirm tab must be accessible (not disabled-tab).
 * Returns the Release Detail URL.
 * Throws if no matching release is found within maxCandidates rows.
 */
export async function findPostReviewConfirmRelease(
  page: Page,
  landingPage: LandingPage,
  maxCandidates = 20,
): Promise<string> {
  // Always navigate explicitly so we're on the landing page regardless of current location.
  // Retry twice if the server returns a transient error (OS error page / grid stays empty).
  let gridLoaded = false;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (attempt > 0) {
        // Short pause then reload before retrying
        await page.waitForTimeout(3_000);
        await page.goto(page.url(), { waitUntil: 'domcontentloaded' });
      } else {
        await landingPage.goto();
      }
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My Releases');
      await landingPage.waitForGridDataRows(30_000);
      gridLoaded = true;
      break;
    } catch {
      if (attempt === 1) {
        // Both attempts failed — surface a useful error
        throw new Error('Landing page "My Releases" grid did not load after retry.');
      }
      // Transient OS error page — will retry
    }
  }
  if (!gridLoaded) {
    throw new Error('Landing page "My Releases" grid did not load.');
  }

  const rows = landingPage.grid.getByRole('row');
  const rowCount = await rows.count();
  const candidateUrls: string[] = [];

  for (let index = 1; index < Math.min(rowCount, maxCandidates + 1); index += 1) {
    const href = await rows
      .nth(index)
      .getByRole('link')
      .first()
      .getAttribute('href')
      .catch(() => null);
    if (!href) {
      continue;
    }

    candidateUrls.push(href.startsWith('http') ? href : buildUrl(href));
  }

  for (const candidateUrl of candidateUrls) {
    try {
      await openSpecificReleaseDetail(page, candidateUrl);
      if (await isReviewConfirmAccessible(page)) {
        return page.url();
      }
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    `No release at or past Review & Confirm stage found in the first ${Math.min(rowCount - 1, maxCandidates)} My Releases rows.`,
  );
}

/**
 * Opens a release that is at or past Review & Confirm stage.
 * Re-uses the cached URL when provided; falls back to scanning My Releases.
 */
export async function openPostReviewConfirmRelease(
  page: Page,
  landingPage: LandingPage,
  releaseDetailUrl?: string,
): Promise<string> {
  if (releaseDetailUrl) {
    try {
      await openSpecificReleaseDetail(page, releaseDetailUrl);
      if (await isReviewConfirmAccessible(page)) {
        return page.url();
      }
    } catch {
      // navigation failed — will fall through to scan
    }
    // Tab is inaccessible or navigation failed.
    // findPostReviewConfirmRelease navigates to the landing page itself.
  }

  return findPostReviewConfirmRelease(page, landingPage);
}

/**
 * Navigates to the Review & Confirm content tab on the current release detail page.
 * The tab locator targets the osui-tabs header item (content tab), not the pipeline wizard item.
 */
export async function clickReviewConfirmContentTab(page: Page): Promise<void> {
  const reviewTab = page.locator('.osui-tabs__header-item[role="tab"]').filter({ hasText: /Review\s*&\s*Confirm/i }).first();
  await expect(reviewTab).toBeVisible({ timeout: 20_000 });
  await reviewTab.click();
  await page.waitForTimeout(1_500);
}

// ── Helpers for Workflow 6 — Manage Stage ─────────────────────────────────────

/**
 * Returns true if the release is at or past the Manage stage.
 * Detection: the active pipeline stage is "Manage" OR past stages include "Review & Confirm".
 */
async function isAtOrPastManageStage(page: Page): Promise<boolean> {
  // Check active stage first
  const activeStage = page.locator('.wizard-wrapper-item.active[role="tab"]').first();
  const appeared = await activeStage
    .waitFor({ state: 'visible', timeout: 15_000 })
    .then(() => true)
    .catch(() => false);
  if (!appeared) {
    return false;
  }

  const activeLabel = await activeStage.getAttribute('aria-label').catch(() => '');
  if (/^Manage$/i.test(activeLabel ?? '')) {
    return true;
  }

  // Also accept any stage AFTER Manage (SA & PQL Sign Off, FCSR Review, etc.)
  const laterStages = [
    /Security\s*&\s*Privacy\s*Readiness\s*Sign\s*Off/i,
    /SDPA\s*&\s*PQL\s*Sign\s*Off/i,
    /FCSR\s*Review/i,
    /Post\s*FCSR\s*Actions/i,
    /Final\s*Acceptance/i,
  ];
  return laterStages.some((pattern) => pattern.test(activeLabel ?? ''));
}

/**
 * Scans My Releases for a release at or past the Manage stage.
 * Returns the Release Detail URL.
 * Throws if no matching release is found within maxCandidates rows.
 */
export async function findManageStageRelease(
  page: Page,
  landingPage: LandingPage,
  maxCandidates = 20,
): Promise<string> {
  let gridLoaded = false;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (attempt > 0) {
        await page.waitForTimeout(3_000);
        await page.goto(page.url(), { waitUntil: 'domcontentloaded' });
      } else {
        await landingPage.goto();
      }
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My Releases');
      await landingPage.waitForGridDataRows(30_000);
      gridLoaded = true;
      break;
    } catch {
      if (attempt === 1) {
        throw new Error('Landing page "My Releases" grid did not load after retry.');
      }
    }
  }
  if (!gridLoaded) {
    throw new Error('Landing page "My Releases" grid did not load.');
  }

  const rows = landingPage.grid.getByRole('row');
  const rowCount = await rows.count();
  const candidateUrls: string[] = [];

  for (let index = 1; index < Math.min(rowCount, maxCandidates + 1); index += 1) {
    const href = await rows
      .nth(index)
      .getByRole('link')
      .first()
      .getAttribute('href')
      .catch(() => null);
    if (!href) {
      continue;
    }

    candidateUrls.push(href.startsWith('http') ? href : buildUrl(href));
  }

  for (const candidateUrl of candidateUrls) {
    try {
      await openSpecificReleaseDetail(page, candidateUrl);
      if (await isAtOrPastManageStage(page)) {
        return page.url();
      }
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    `No release at or past Manage stage found in the first ${Math.min(rowCount - 1, maxCandidates)} My Releases rows.`,
  );
}

/**
 * Opens a release that is at or past the Manage stage.
 * Re-uses the cached URL when provided; falls back to scanning My Releases.
 */
export async function openManageStageRelease(
  page: Page,
  landingPage: LandingPage,
  releaseDetailUrl?: string,
): Promise<string> {
  if (releaseDetailUrl) {
    try {
      await openSpecificReleaseDetail(page, releaseDetailUrl);
      if (await isAtOrPastManageStage(page)) {
        return page.url();
      }
    } catch {
      // navigation failed — fall through to scan
    }
  }

  return findManageStageRelease(page, landingPage);
}