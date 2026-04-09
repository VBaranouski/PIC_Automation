import { expect, type Page } from '@playwright/test';
import type { LandingPage } from '../../../src/pages';
import * as fs from 'fs';
import * as path from 'path';

const QA_BASE_URL = 'https://qa.leap.schneider-electric.com';

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
      productUrl = `${QA_BASE_URL}${productUrl}`;
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

    candidateUrls.push(href.startsWith('http') ? href : `${QA_BASE_URL}${href}`);
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