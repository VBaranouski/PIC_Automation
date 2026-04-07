import { test } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage } from '../../src/pages';
import * as allure from 'allure-js-commons';
import { readProductState, writeProductState } from '../../src/helpers/product-state.helper';
import * as fs from 'fs';
import * as path from 'path';

async function findProductReadyForReleaseCreation(
  page: Page,
  landingPage: LandingPage,
  maxProductsToCheck = 100,
): Promise<{ productName: string; productUrl: string }> {
  // Navigate once, expand to 100 rows, collect all hrefs to avoid stale-locator issues
  await landingPage.goto();
  await landingPage.expectPageLoaded({ timeout: 60_000 });
  await landingPage.clickTab('My Products');
  await landingPage.changePerPage('100').catch(() => undefined);

  const grid = landingPage.grid;
  await grid.getByRole('row').nth(1).waitFor({ state: 'visible', timeout: 30_000 });

  const rows = grid.getByRole('row');
  const totalRows = await rows.count(); // row[0] = header
  const products: Array<{ href: string; name: string }> = [];

  for (let i = 1; i < Math.min(maxProductsToCheck + 1, totalRows); i++) {
    const link = rows.nth(i).getByRole('link').first();
    const href = await link.getAttribute('href').catch(() => null);
    const name = (await link.textContent().catch(() => null))?.trim() ?? `product-${i}`;
    if (href) products.push({ href, name });
  }

  for (const { href, name } of products) {
    await page.goto(href);

    await page.getByRole('button', { name: 'Edit Product' }).waitFor({ state: 'visible', timeout: 60_000 });
    // exact:true prevents strict mode violation — avoids matching "My Releases" tab on landing page
    await page.getByRole('tab', { name: 'Releases', exact: true }).click();
    await page.getByRole('button', { name: 'Create Release' }).waitFor({ state: 'visible', timeout: 30_000 });

    const hasNoReleasesMessage = await page.getByText('No releases were created yet!').isVisible().catch(() => false);
    if (!hasNoReleasesMessage) {
      continue;
    }

    return { productName: name, productUrl: page.url() };
  }

  throw new Error(`No product without releases was found in the first ${maxProductsToCheck} My Products rows.`);
}

test.describe.serial('Releases - Create New Release (PIC-100) @regression', () => {
  test.setTimeout(360_000);

  let productUrl: string;
  let productName: string;

  test.beforeEach(async ({ page, loginPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  test('should show required validation when trying to create the first release without mandatory fields', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CREATE-001: Verify that a product with no releases shows the empty releases state and that the create release popup validates mandatory fields.',
    );

    await test.step('Find a product with no releases from My Products', async () => {
      const product = await findProductReadyForReleaseCreation(page, landingPage);
      productUrl = product.productUrl;
      productName = product.productName;
    });

    await test.step('Verify Releases tab shows the empty state', async () => {
      await newProductPage.expectNoReleasesStateVisible();
    });

    await test.step('Open Create Release popup', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.expectCreateReleaseDialogVisible();
    });

    await test.step('Submit without filling mandatory fields', async () => {
      await newProductPage.clickCreateAndScope();
    });

    await test.step('Verify popup validation feedback appears', async () => {
      await newProductPage.expectCreateReleaseValidation();
    });
  });

  test('should create the first release for a product without releases', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Releases');
    await allure.severity('critical');
    await allure.tag('smoke');
    await allure.description(
      'RELEASE-CREATE-002: Verify that a first release can be created from the Releases tab for a product that currently has no releases.',
    );

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    const releaseVersion = `PIC100-${Date.now()}`;

    await test.step('Navigate back to the product Releases tab', async () => {
      if (!productUrl) {
        const product = await findProductReadyForReleaseCreation(page, landingPage);
        productUrl = product.productUrl;
        productName = product.productName;
      }

      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();

      // Guard: the product found by test 1 may have had releases created by a
      // prior diagnostic or test run.  If so, scan for a fresh product.
      const stillEmpty = await newProductPage.isNoReleasesMessageVisible();
      if (!stillEmpty) {
        const product = await findProductReadyForReleaseCreation(page, landingPage);
        productUrl = product.productUrl;
        productName = product.productName;
        await page.goto(productUrl);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickReleasesTab();
      }

      await newProductPage.expectNoReleasesStateVisible();
    });

    await test.step('Open Create Release popup and fill mandatory fields', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.createFirstRelease({
        releaseVersion,
        targetDate,
        changeSummary: `Automated release creation for ${productName}`,
      });
    });

    await test.step('Verify the new release is listed in Releases grid with Scoping status', async () => {
      // "Create & Scope" navigates to the Release Scoping page.
      // Navigate back to the Product Detail Releases tab to confirm the release is listed.
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();
      await newProductPage.expectReleaseListed(releaseVersion, 'Scoping');
    });

    await test.step('Persist product URL so PRODUCT-RELEASES-001 can reuse it', async () => {
      writeProductState({ productWithReleasesUrl: productUrl, productName });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RELEASE-CREATE-003 → 007   Create Release Dialog — UI Checks
//
// These tests verify the dialog UI rather than performing a full release
// creation.  Each test independently finds a suitable product so the suite
// can run in any order without shared-state coupling.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Finds a product with at least one existing release, preferring the URL
 * persisted by RELEASE-CREATE-002 in .product-state.json.
 */
async function findProductWithAnyRelease(
  page: Page,
  landingPage: LandingPage,
): Promise<string> {
  const stateFile = path.resolve(__dirname, '../../.product-state.json');
  if (fs.existsSync(stateFile)) {
    const url = readProductState().productWithReleasesUrl;
    if (url) return url;
  }

  // Fallback: scan My Products for a product that has at least one release listed
  await landingPage.goto();
  await landingPage.expectPageLoaded({ timeout: 60_000 });
  await landingPage.clickTab('My Products');
  await landingPage.changePerPage('100').catch(() => undefined);

  const grid = landingPage.grid;
  await grid.getByRole('row').nth(1).waitFor({ state: 'visible', timeout: 30_000 });
  const rows = grid.getByRole('row');
  const total = await rows.count();

  for (let i = 1; i < Math.min(101, total); i++) {
    const link = rows.nth(i).getByRole('link').first();
    const href = await link.getAttribute('href').catch(() => null);
    if (!href) continue;

    await page.goto(href);
    await page.getByRole('button', { name: 'Edit Product' }).waitFor({ state: 'visible', timeout: 60_000 });
    await page.getByRole('tab', { name: 'Releases', exact: true }).click();
    await page.getByRole('button', { name: 'Create Release' }).waitFor({ state: 'visible', timeout: 30_000 });

    const hasNoReleases = await page.getByText('No releases were created yet!').isVisible().catch(() => false);
    if (!hasNoReleases) return page.url();
  }
  throw new Error('No product with existing releases found in the first 100 My Products rows.');
}

test.describe.serial('Releases - Create Release Dialog UI (PIC-100) @regression', () => {
  test.setTimeout(400_000);

  // Shared product URL — discovered once by the first test in the serial block
  let noReleaseProductUrl = '';

  test.beforeEach(async ({ page, loginPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ── RELEASE-CREATE-003 ────────────────────────────────────────────────────
  test('should show Release Type radio buttons with "New Product Release" selected by default', async ({
    page, landingPage, newProductPage,
  }) => {
    await allure.suite('Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CREATE-003: Open the Create Release dialog for a product with no releases. ' +
      'Verify both "New Product Release" and "Existing Product Release" radios are visible, ' +
      'and "New Product Release" is selected by default.',
    );

    await test.step('Find a product without releases', async () => {
      if (!noReleaseProductUrl) {
        const p = await findProductReadyForReleaseCreation(page, landingPage);
        noReleaseProductUrl = p.productUrl;
      }
      await page.goto(noReleaseProductUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();
    });

    await test.step('Open Create Release dialog', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.expectCreateReleaseDialogVisible();
    });

    await test.step('Verify both Release Type radios are visible', async () => {
      await newProductPage.expectReleaseTypeRadiosVisible();
    });

    await test.step('Verify "New Product Release" is selected by default', async () => {
      await newProductPage.expectNewProductReleaseRadioSelected();
    });

    await test.step('Close dialog', async () => {
      await newProductPage.cancelReleaseFormButton.click();
      await newProductPage.createReleaseDialog.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => undefined);
    });
  });

  // ── RELEASE-CREATE-004 ────────────────────────────────────────────────────
  test('should reveal "Cont. Pen Test Contract Date" field when Continuous Pen Testing is checked', async ({
    page, newProductPage,
  }) => {
    await allure.suite('Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CREATE-004: In the Create Release dialog, checking the "Continuous Penetration Testing" ' +
      'checkbox must reveal the "Cont. Pen Test Contract Date" date picker.',
    );

    await test.step('Navigate to product Releases tab', async () => {
      await page.goto(noReleaseProductUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();
    });

    await test.step('Open Create Release dialog', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.expectCreateReleaseDialogVisible();
    });

    await test.step('Verify Cont. Pen Test Contract Date is hidden initially', async () => {
      await newProductPage.expectContPenTestContractDateHidden();
    });

    await test.step('Check the Continuous Penetration Testing checkbox', async () => {
      await newProductPage.toggleContinuousPenetrationTesting();
    });

    await test.step('Verify Cont. Pen Test Contract Date field is now visible', async () => {
      await newProductPage.expectContPenTestContractDateVisible();
    });

    await test.step('Close dialog', async () => {
      await newProductPage.cancelReleaseFormButton.click();
      await newProductPage.createReleaseDialog.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => undefined);
    });
  });

  // ── RELEASE-CREATE-005 ────────────────────────────────────────────────────
  test('should prevent selecting a past date in Target Release Date picker', async ({
    page, newProductPage,
  }) => {
    await allure.suite('Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CREATE-005: In the Create Release dialog, the Target Release Date flatpickr calendar ' +
      'must have past dates disabled so users cannot select a date before today.',
    );

    await test.step('Navigate to product Releases tab', async () => {
      await page.goto(noReleaseProductUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();
    });

    await test.step('Open Create Release dialog', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.expectCreateReleaseDialogVisible();
    });

    await test.step('Open Target Release Date picker and verify past dates are disabled', async () => {
      await newProductPage.expectTargetDatePickerPreventsYesterday();
    });

    await test.step('Close dialog', async () => {
      await newProductPage.cancelReleaseFormButton.click();
      await newProductPage.createReleaseDialog.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => undefined);
    });
  });

  // ── RELEASE-CREATE-006 ────────────────────────────────────────────────────
  test('should reveal extra fields when "Existing Product Release" radio is selected', async ({
    page, newProductPage,
  }) => {
    await allure.suite('Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CREATE-006: Selecting "Existing Product Release" in the Create Release dialog ' +
      'must reveal additional pen-test related fields (e.g. "Was pen test performed?", ' +
      '"Last Full Pen Test Date", or "Last BU SO FCSR Date").',
    );

    await test.step('Navigate to product Releases tab', async () => {
      await page.goto(noReleaseProductUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();
    });

    await test.step('Open Create Release dialog', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.expectCreateReleaseDialogVisible();
    });

    await test.step('Select "Existing Product Release" radio', async () => {
      await newProductPage.clickExistingProductReleaseRadio();
    });

    await test.step('Verify extra fields appear for existing release onboarding', async () => {
      await newProductPage.expectExistingReleaseFieldsVisible();
    });

    await test.step('Close dialog', async () => {
      await newProductPage.cancelReleaseFormButton.click();
      await newProductPage.createReleaseDialog.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => undefined);
    });
  });

  // ── RELEASE-CREATE-007 ────────────────────────────────────────────────────
  test('should show Clone / Create-as-new options when product already has a release', async ({
    page, landingPage, newProductPage,
  }) => {
    await allure.suite('Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-CREATE-007: For a product that already has at least one release, opening the ' +
      'Create Release dialog must present two radio options: ' +
      '"Clone from existing release" and "Create as new".',
    );

    await test.step('Navigate to a product that already has at least one release', async () => {
      const withReleaseUrl = await findProductWithAnyRelease(page, landingPage);
      await page.goto(withReleaseUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();
    });

    await test.step('Open Create Release dialog', async () => {
      await newProductPage.clickCreateRelease();
      await newProductPage.expectCreateReleaseDialogVisible();
    });

    await test.step('Verify "Clone from existing release" and "Create as new" radios are visible', async () => {
      await newProductPage.expectCloneOrNewRadiosVisible();
    });

    await test.step('Close dialog', async () => {
      await newProductPage.cancelReleaseFormButton.click();
      await newProductPage.createReleaseDialog.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => undefined);
    });
  });
});