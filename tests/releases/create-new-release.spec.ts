import { test } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage } from '../../src/pages';
import * as allure from 'allure-js-commons';
import { writeProductState } from '../../src/helpers/product-state.helper';

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