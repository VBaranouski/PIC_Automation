import { test, expect } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage } from '../../src/pages';
import type { NewProductPage } from '../../src/pages';
import type { ReleaseDetailPage } from '../../src/pages';
import * as allure from 'allure-js-commons';
import { readProductState } from '../../src/helpers/product-state.helper';
import { readWF3ProductState } from '../../src/helpers/wf3-product-state.helper';
import { createDisposableProduct } from '../../src/helpers/disposable-test-data.helper';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Product Detail — Releases Tab
 *
 * Stories: PIC-108, PIC-110
 *
 * These scenarios cover Releases tab behaviour on the Product Detail page:
 * - Viewing existing releases in the grid
 * - Empty-state for a product without releases
 * - Required-field validation when opening the Create Release dialog
 * - Release creation from the WF3 pre-req product
 *
 * Pre-req: Run the `wf3-pre-req` Playwright project before release creation
 * coverage that reads .wf3-product-state.json.
 */

function uniqueWF3ReleaseVersion(): string {
  return `WF3-REL-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

function futureDate(daysFromToday: number): Date {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysFromToday);
  return targetDate;
}

async function returnToProductReleasesTabIfOnReleaseDetail(
  page: Page,
  newProductPage: NewProductPage,
  releaseDetailPage: ReleaseDetailPage,
  productUrl: string,
): Promise<void> {
  if (!/ReleaseDetail/i.test(page.url())) {
    return;
  }

  await releaseDetailPage.waitForPageLoad();
  await page.goto(productUrl, { waitUntil: 'domcontentloaded' });
  await newProductPage.expectProductDetailLoaded();
  await newProductPage.clickReleasesTab();
}

/**
 * Dynamically scans My Products to find the first product that HAS at least one
 * release listed in its Releases tab (i.e. "No releases were created yet!" is absent).
 * Used as a fallback when .product-state.json has not been written yet.
 */
/** Collect all product { href, name } pairs from the landing page grid (up to maxRows). */
async function collectProductLinks(
  landingPage: LandingPage,
  maxRows = 100,
): Promise<Array<{ href: string; name: string }>> {
  await landingPage.goto();
  await landingPage.expectPageLoaded({ timeout: 60_000 });
  await landingPage.clickTab('My Products');
  await landingPage.changePerPage('100').catch(() => undefined);

  const grid = landingPage.grid;
  await grid.getByRole('row').nth(1).waitFor({ state: 'visible', timeout: 30_000 });

  const rows = grid.getByRole('row');
  const totalRows = await rows.count(); // row[0] = header
  const result: Array<{ href: string; name: string }> = [];

  for (let i = 1; i < Math.min(maxRows + 1, totalRows); i++) {
    const link = rows.nth(i).getByRole('link').first();
    const href = await link.getAttribute('href').catch(() => null);
    const name = (await link.textContent().catch(() => null))?.trim() ?? `product-${i}`;
    if (href) result.push({ href, name });
  }
  return result;
}

async function findProductWithReleases(
  page: Page,
  landingPage: LandingPage,
  newProductPage: NewProductPage,
  maxProductsToCheck = 100,
): Promise<string> {
  const products = await collectProductLinks(landingPage, maxProductsToCheck);

  for (const { href } of products) {
    await page.goto(href);
    await page.getByRole('button', { name: 'Edit Product' }).waitFor({ state: 'visible', timeout: 60_000 });
    // exact:true prevents matching "My Releases" tab
    await page.getByRole('tab', { name: 'Releases', exact: true }).click();
    await page.getByRole('button', { name: 'Create Release' }).waitFor({ state: 'visible', timeout: 30_000 });

    const hasNoReleases = await newProductPage.isNoReleasesMessageVisible();
    if (!hasNoReleases) {
      return page.url();
    }
  }
  throw new Error(`No product with releases found in the first ${maxProductsToCheck} My Products rows.`);
}

async function resolveProductWithReleasesUrl(
  page: Page,
  landingPage: LandingPage,
  newProductPage: NewProductPage,
): Promise<string> {
  try {
    return readWF3ProductState().productUrl;
  } catch {
    const PRODUCT_STATE_FILE = path.resolve(__dirname, '../../.product-state.json');
    return fs.existsSync(PRODUCT_STATE_FILE)
      ? readProductState().productWithReleasesUrl
      : await findProductWithReleases(page, landingPage, newProductPage);
  }
}

async function resolveReleaseCreationProductUrl(
  page: Page,
  newProductPage: NewProductPage,
): Promise<string> {
  const wf3State = readWF3ProductState();
  const candidateUrl = wf3State.releaseCreationProduct?.productUrl;

  if (candidateUrl) {
    await page.goto(candidateUrl, { waitUntil: 'domcontentloaded' });
    await newProductPage.expectProductDetailLoaded();
    await newProductPage.clickReleasesTab();

    if (await newProductPage.isNoReleasesMessageVisible()) {
      return candidateUrl;
    }
  }

  const product = await createDisposableProduct(page, newProductPage, {
    prefix: 'WF3 Release Creation Product Fallback',
  });
  return product.url;
}

async function findProductWithoutReleases(
  page: Page,
  landingPage: LandingPage,
  newProductPage: NewProductPage,
  maxProductsToCheck = 100,
): Promise<{ productName: string; productUrl: string }> {
  const products = await collectProductLinks(landingPage, maxProductsToCheck);

  for (const { href, name } of products) {
    await page.goto(href);
    await page.getByRole('button', { name: 'Edit Product' }).waitFor({ state: 'visible', timeout: 60_000 });
    await newProductPage.clickReleasesTab();

    const hasNoReleases = await newProductPage.isNoReleasesMessageVisible();
    if (hasNoReleases) {
      return { productName: name, productUrl: page.url() };
    }
  }

  throw new Error(`No product without releases found in the first ${maxProductsToCheck} My Products rows.`);
}

test.describe('Product Details - Releases Tab @regression', () => {
  test.setTimeout(300_000);

  test('PRODUCT-RELEASES-001 — should display releases grid with at least one row for a product with existing releases', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Products - Releases');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-RELEASES-001: Navigate to a product that has releases (URL persisted by ' +
      'RELEASE-CREATE-002 in .product-state.json), switch to the Releases tab, and verify ' +
      'the releases grid shows at least one row with a clickable release version link.',
    );

    await test.step('Navigate to the product with known releases (from persisted state or dynamic scan)', async () => {
      // Prefer the URL written by create-new-release.spec.ts (RELEASE-CREATE-002).
      // Fall back to a dynamic scan of My Products when the state file does not exist.
      const productUrl = await resolveProductWithReleasesUrl(page, landingPage, newProductPage);
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Switch to Releases tab', async () => {
      await newProductPage.clickReleasesTab();
      await newProductPage.expectReleasesTabActive();
    });

    await test.step('Verify Releases tab shows grid (no empty-state message)', async () => {
      await newProductPage.expectNoReleasesStateHidden();
    });

    await test.step('Verify releases grid has at least one data row', async () => {
      await expect(newProductPage.releasesGrid).toBeVisible({ timeout: 30_000 });
      const rows = newProductPage.releasesGrid.getByRole('row');
      expect(await rows.count()).toBeGreaterThanOrEqual(2);
    });

    await test.step('Verify the first data row contains a clickable release version link', async () => {
      const firstDataRow = newProductPage.releasesGrid.getByRole('row').nth(1);
      await expect(firstDataRow.getByRole('link').first()).toBeVisible({ timeout: 15_000 });
    });
  });

  test('PRODUCT-RELEASES-002 — should show no-releases empty state for a product without releases', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Products - Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-RELEASES-002: Navigate to a product without releases, switch to the Releases tab, ' +
      'and verify the "No releases were created yet!" message and Create Release button are displayed.',
    );

    await test.step('Find a product without releases from My Products', async () => {
      await findProductWithoutReleases(page, landingPage, newProductPage);
    });

    await test.step('Verify the no-releases empty state and Create Release button are visible', async () => {
      await newProductPage.expectNoReleasesStateVisible();
    });
  });

  test('PRODUCT-RELEASES-003 — should show required-field validation when Create Release is submitted without mandatory fields', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Products - Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-RELEASES-003: Open the Create Release dialog on a product without releases, ' +
      'click Create & Scope without filling any fields, and verify validation feedback appears ' +
      'for the three mandatory fields: Release Version, Target Date, and Change Summary.',
    );

    await test.step('Find a product without releases and open its Releases tab', async () => {
      await findProductWithoutReleases(page, landingPage, newProductPage);
    });

    await test.step('Open the Create Release popup', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.expectCreateReleaseDialogVisible();
    });

    await test.step('Click Create & Scope without filling mandatory fields', async () => {
      await newProductPage.clickCreateAndScope();
    });

    await test.step('Verify validation messages appear for all required fields', async () => {
      await newProductPage.expectCreateReleaseValidation();
    });
  });

  test('PRODUCT-RELEASES-004 — should create a new release and verify it appears in the grid', async ({
    page, newProductPage, releaseDetailPage,
  }) => {
    await allure.suite('Products - Releases');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-RELEASES-004: Create a new release with valid data and verify it appears in the releases grid ' +
      'with the correct version and an appropriate initial status. Pre-req: run the wf3-pre-req Playwright ' +
      'project first so .wf3-product-state.json contains the reusable WF3 release-creation product URL. ' +
      'If that product was already consumed by a prior run, the test creates a fresh disposable fallback product.',
    );

    const releaseVersion = uniqueWF3ReleaseVersion();
    let releaseCreationProductUrl = '';

    await test.step('Navigate to the WF3 release-creation product Releases tab', async () => {
      releaseCreationProductUrl = await resolveReleaseCreationProductUrl(page, newProductPage);
      await page.goto(releaseCreationProductUrl, { waitUntil: 'domcontentloaded' });
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();
      await newProductPage.expectReleasesTabActive();
    });

    await test.step('Create a unique release from the Product Releases tab', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.expectCreateReleaseDialogVisible();
      await newProductPage.createFirstRelease({
        releaseVersion,
        targetDate: futureDate(21),
        changeSummary: `WF3 pre-req release creation coverage: ${releaseVersion}`,
      });
    });

    await test.step('Return to the WF3 release-creation product Releases tab when creation navigates to Release Detail', async () => {
      await returnToProductReleasesTabIfOnReleaseDetail(
        page,
        newProductPage,
        releaseDetailPage,
        releaseCreationProductUrl,
      );
    });

    await test.step('Verify the newly created release is visible in the releases grid', async () => {
      await expect(newProductPage.releasesGrid).toBeVisible({ timeout: 30_000 });
      const releaseRow = newProductPage.releasesGrid.getByRole('row').filter({ hasText: releaseVersion }).first();
      await expect(releaseRow).toBeVisible({ timeout: 30_000 });
      await expect(releaseRow).toContainText(/Scoping|Creation|Active|In Progress/i);
    });
  });

  // ── PRODUCT-RELEASES-005 ──────────────────────────────────────────────────
  test('PRODUCT-RELEASES-005 — should navigate to Release Detail page when clicking a release name link', async ({
    page, landingPage, newProductPage,
  }) => {
    await allure.suite('Products - Releases');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-RELEASES-005: Clicking the release name link in the Releases tab grid must ' +
      'navigate to the Release Detail page for that release.',
    );

    await test.step('Navigate to a product with releases', async () => {
      const productUrl = await resolveProductWithReleasesUrl(page, landingPage, newProductPage);
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Switch to Releases tab and verify at least one release row', async () => {
      await newProductPage.clickReleasesTab();
      await newProductPage.expectNoReleasesStateHidden();
      await expect(newProductPage.releasesGrid).toBeVisible({ timeout: 30_000 });
    });

    await test.step('Click the first release name link', async () => {
      await newProductPage.clickFirstReleaseLinkAndNavigate();
    });

    await test.step('Verify navigation reached a Release-related page', async () => {
      await expect(page).toHaveURL(/ReleaseDetail|GRC_PICASso/, { timeout: 30_000 });
      // The URL must have changed from the product detail URL
      expect(page.url()).not.toMatch(/ProductDetail/);
    });
  });

  // ── PRODUCT-RELEASES-006 ──────────────────────────────────────────────────
  test('PRODUCT-RELEASES-006 — should display a release status badge on each Releases grid row', async ({
    page, landingPage, newProductPage,
  }) => {
    await allure.suite('Products - Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-RELEASES-006: Each row in the Releases tab grid must display a release status ' +
      '(e.g. "Scoping", "Active", "Closed") — confirming the status column is populated.',
    );

    await test.step('Navigate to a product with releases', async () => {
      const productUrl = await resolveProductWithReleasesUrl(page, landingPage, newProductPage);
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Switch to Releases tab', async () => {
      await newProductPage.clickReleasesTab();
      await newProductPage.expectNoReleasesStateHidden();
    });

    await test.step('Verify first release row contains a recognisable status value', async () => {
      const rowText = await newProductPage.getReleasesGridFirstRowText();
      expect(rowText).toMatch(/Scoping|Active|Closed|Cancelled|In Progress|Approved/i);
    });
  });

  // ── PRODUCT-RELEASES-007 ──────────────────────────────────────────────────
  test('PRODUCT-RELEASES-007 — should show correct column headers in the Releases tab grid', async ({
    page, landingPage, newProductPage,
  }) => {
    await allure.suite('Products - Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-RELEASES-007: The Releases tab grid must show the current release-list columns, ' +
      'including Release Status, Target Release Date, Created By, Release Creation, Validation Date, and Actions.',
    );

    await test.step('Navigate to a product with releases', async () => {
      const productUrl = await resolveProductWithReleasesUrl(page, landingPage, newProductPage);
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Switch to Releases tab', async () => {
      await newProductPage.clickReleasesTab();
      await newProductPage.expectNoReleasesStateHidden();
    });

    await test.step('Verify expected column headers are present', async () => {
      const headers = await newProductPage.getReleasesGridColumnHeaders();
      const headersJoined = headers.join(' ');
      expect(headersJoined).toMatch(/Release Status/i);
      expect(headersJoined).toMatch(/Target Release Date/i);
      expect(headersJoined).toMatch(/Created By|Created/i);
      expect(headersJoined).toMatch(/Release Creation/i);
      expect(headersJoined).toMatch(/Validation Date/i);
      expect(headersJoined).toMatch(/Actions/i);
    });
  });

  // ── PRODUCT-RELEASES-008 ──────────────────────────────────────────────────
  test('PRODUCT-RELEASES-008 — should update visible row count when the per-page selector is changed', async ({
    page, landingPage, newProductPage,
  }) => {
    await allure.suite('Products - Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-RELEASES-008: The per-page selector in the Releases tab pagination must be ' +
      'present and interactive. Changing the value must not cause an error, and the visible ' +
      'row count must remain within the newly selected page-size limit.',
    );

    await test.step('Navigate to a product with releases', async () => {
      const productUrl = await resolveProductWithReleasesUrl(page, landingPage, newProductPage);
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Switch to Releases tab and wait for grid', async () => {
      await newProductPage.clickReleasesTab();
      await newProductPage.expectNoReleasesStateHidden();
      await expect(newProductPage.releasesGrid).toBeVisible({ timeout: 30_000 });
    });

    await test.step('Change per-page selector to 20 and verify row count ≤ 20', async () => {
      await newProductPage.changeReleasesTabPerPage('20');
      const rowCount = await newProductPage.getReleasesGridDataRowCount();
      expect(rowCount).toBeLessThanOrEqual(20);
      expect(rowCount).toBeGreaterThanOrEqual(1);
    });
  });
});
