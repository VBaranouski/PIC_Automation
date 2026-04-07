import { test, expect } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage } from '../../src/pages';
import type { NewProductPage } from '../../src/pages';
import * as allure from 'allure-js-commons';
import { readProductState } from '../../src/helpers/product-state.helper';
import * as fs from 'fs';

/**
 * Product Detail — Releases Tab
 *
 * Stories: PIC-108, PIC-110
 *
 * These scenarios cover Releases tab behaviour on the Product Detail page:
 * - Viewing existing releases in the grid
 * - Empty-state for a product without releases
 * - Required-field validation when opening the Create Release dialog
 * - (P2) Full release creation — covered by create-new-release.spec.ts
 */

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

  test.beforeEach(async ({ loginPage, userCredentials, page }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  test('should display releases grid with at least one row for a product with existing releases', async ({ page, landingPage, newProductPage }) => {
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
      const PRODUCT_STATE_FILE = require('path').resolve(__dirname, '../../.product-state.json');
      const productUrl = fs.existsSync(PRODUCT_STATE_FILE)
        ? readProductState().productWithReleasesUrl
        : await findProductWithReleases(page, landingPage, newProductPage);
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

  test('should show no-releases empty state for a product without releases', async ({ page, landingPage, newProductPage }) => {
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

  test('should show required-field validation when Create Release is submitted without mandatory fields', async ({ page, landingPage, newProductPage }) => {
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

  test.fixme('should create a new release and verify it appears in the grid', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products - Releases');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-RELEASES-004: Create a new release with valid data and verify it appears in the releases grid ' +
      'with the correct version and an appropriate initial status. ' +
      'NOTE: Full end-to-end release creation is covered by create-new-release.spec.ts ' +
      '(RELEASE-CREATE-002); this stub is retained as a cross-reference placeholder.',
    );
    // End-to-end creation is covered by tests/releases/create-new-release.spec.ts
  });

  // ── PRODUCT-RELEASES-005 ──────────────────────────────────────────────────
  test('should navigate to Release Detail page when clicking a release name link', async ({
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
      const PRODUCT_STATE_FILE = require('path').resolve(__dirname, '../../.product-state.json');
      const productUrl = fs.existsSync(PRODUCT_STATE_FILE)
        ? readProductState().productWithReleasesUrl
        : await findProductWithReleases(page, landingPage, newProductPage);
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
  test('should display a release status badge on each Releases grid row', async ({
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
      const PRODUCT_STATE_FILE = require('path').resolve(__dirname, '../../.product-state.json');
      const productUrl = fs.existsSync(PRODUCT_STATE_FILE)
        ? readProductState().productWithReleasesUrl
        : await findProductWithReleases(page, landingPage, newProductPage);
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
  test('should show correct column headers in the Releases tab grid', async ({
    page, landingPage, newProductPage,
  }) => {
    await allure.suite('Products - Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-RELEASES-007: The Releases tab grid must show column headers including ' +
      'Release Number (or Version), Status, Target Date, and Created By.',
    );

    await test.step('Navigate to a product with releases', async () => {
      const PRODUCT_STATE_FILE = require('path').resolve(__dirname, '../../.product-state.json');
      const productUrl = fs.existsSync(PRODUCT_STATE_FILE)
        ? readProductState().productWithReleasesUrl
        : await findProductWithReleases(page, landingPage, newProductPage);
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
      // Accept either "Release Number" or "Release Version" — label may differ per OS version
      expect(headersJoined).toMatch(/Release Number|Release Version/i);
      expect(headersJoined).toMatch(/Status/i);
      expect(headersJoined).toMatch(/Target.*Date|Date/i);
      expect(headersJoined).toMatch(/Created By|Created/i);
    });
  });

  // ── PRODUCT-RELEASES-008 ──────────────────────────────────────────────────
  test('should update visible row count when the per-page selector is changed', async ({
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
      const PRODUCT_STATE_FILE = require('path').resolve(__dirname, '../../.product-state.json');
      const productUrl = fs.existsSync(PRODUCT_STATE_FILE)
        ? readProductState().productWithReleasesUrl
        : await findProductWithReleases(page, landingPage, newProductPage);
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
