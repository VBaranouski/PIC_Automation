import { test } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage, NewProductPage } from '../../src/pages';
import * as allure from 'allure-js-commons';

/**
 * Scans My Products rows until it finds a product where the DPP checkbox
 * is editable in edit mode (i.e. the product has no active release)
 * AND all required Org Levels (L1, L2, L3) are filled.
 * Leaves the browser in edit mode on the found product.
 * Uses changePerPage('100') so we can check up to 100 products per scan.
 */
async function openProductWithEditableDPP(
  page: Page,
  landingPage: LandingPage,
  newProductPage: NewProductPage,
  maxRows = 100,
): Promise<void> {
  const isBlank = (v: string) => !v || v === '- Select -' || v.trim() === '-';

  // Navigate once and collect all product hrefs so locators don't go stale
  await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  await landingPage.clickTab('My Products');
  await landingPage.changePerPage('100').catch(() => undefined);

  const grid = landingPage.grid;
  await grid.getByRole('row').nth(1).waitFor({ state: 'visible', timeout: 30_000 });
  const rows = grid.getByRole('row');
  const totalRows = await rows.count();
  const productHrefs: string[] = [];
  for (let i = 1; i < Math.min(maxRows + 1, totalRows); i++) {
    const href = await rows.nth(i).getByRole('link').first().getAttribute('href').catch(() => null);
    if (href) productHrefs.push(href);
  }

  for (const href of productHrefs) {
    await page.goto(href);
    await newProductPage.expectProductDetailLoaded();
    // Use clickEditProduct (lighter, no networkidle) for scanner iteration speed
    await newProductPage.clickEditProduct();
    await newProductPage.expectEditModeVisible();
    await newProductPage.waitForOSLoad();

    // Check DPP is editable (not disabled by active release)
    const isEditable = await newProductPage.dataProtectionCheckbox.isEnabled().catch(() => false);
    if (!isEditable) {
      await page.getByRole('button', { name: 'Cancel' }).click();
      const leave = page.getByRole('button', { name: 'Leave' });
      if (await leave.isVisible({ timeout: 3_000 }).catch(() => false)) await leave.click();
      await newProductPage.expectProductDetailLoaded();
      continue;
    }

    // Also verify org levels are all filled AND enabled (products with locked/disabled
    // org levels or blank required L3 cannot be saved and should be skipped).
    await newProductPage.clickProductOrganizationTab();
    await newProductPage.orgLevel1Select.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);
    const l1 = await newProductPage.getSelectedOrgLevel1().catch(() => '');
    const l2 = await newProductPage.getSelectedOrgLevel2().catch(() => '');
    const l3 = await newProductPage.getSelectedOrgLevel3().catch(() => '');
    const l1Enabled = await newProductPage.orgLevel1Select.isEnabled({ timeout: 3_000 }).catch(() => false);
    const l2Enabled = await newProductPage.orgLevel2Select.isEnabled({ timeout: 3_000 }).catch(() => false);
    if (isBlank(l1) || isBlank(l2) || isBlank(l3) || !l1Enabled || !l2Enabled) {
      await page.getByRole('button', { name: 'Cancel' }).click();
      const leave = page.getByRole('button', { name: 'Leave' });
      if (await leave.isVisible({ timeout: 3_000 }).catch(() => false)) await leave.click();
      await newProductPage.expectProductDetailLoaded();
      continue;
    }

    return; // Stay on this product in edit mode — DPP is editable and org levels are complete + enabled
  }
  throw new Error(`Could not find a product with editable DPP checkbox and valid org levels in the first ${maxRows} rows.`);
}

async function openProductWithToggleableDPP(
  page: Page,
  landingPage: LandingPage,
  newProductPage: NewProductPage,
  maxRows = 100,
): Promise<void> {
  await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  await landingPage.clickTab('My Products');
  await landingPage.changePerPage('100').catch(() => undefined);

  const grid = landingPage.grid;
  await grid.getByRole('row').nth(1).waitFor({ state: 'visible', timeout: 30_000 });
  const rows = grid.getByRole('row');
  const totalRows = await rows.count();
  const productHrefs: string[] = [];

  for (let i = 1; i < Math.min(maxRows + 1, totalRows); i++) {
    const href = await rows.nth(i).getByRole('link').first().getAttribute('href').catch(() => null);
    if (href) productHrefs.push(href);
  }

  for (const href of productHrefs) {
    await page.goto(href);
    await newProductPage.expectProductDetailLoaded();
    await newProductPage.clickEditProduct();
    await newProductPage.expectEditModeVisible();
    await newProductPage.waitForOSLoad();

    const isEditable = await newProductPage.dataProtectionCheckbox.isEnabled().catch(() => false);
    const isChecked = await newProductPage.isDataProtectionChecked().catch(() => true);
    if (isEditable && !isChecked) {
      return;
    }

    await page.getByRole('button', { name: 'Cancel' }).click();
    const leave = page.getByRole('button', { name: 'Leave' });
    if (await leave.isVisible({ timeout: 3_000 }).catch(() => false)) await leave.click();
    await newProductPage.expectProductDetailLoaded();
  }

  throw new Error(`Could not find a product with editable disabled-off DPP checkbox in the first ${maxRows} rows.`);
}

/**
 * Scans My Products rows until it finds a product where the Brand Label checkbox
 * is editable in edit mode AND all required Org Levels are filled.
 * Uses changePerPage('100') so we can check up to 100 products per scan.
 */
async function openProductWithEditableBrandLabel(
  page: Page,
  landingPage: LandingPage,
  newProductPage: NewProductPage,
  maxRows = 100,
): Promise<void> {
  const isBlank = (v: string) => !v || v === '- Select -' || v.trim() === '-';

  // Navigate once and collect all product hrefs so locators don't go stale
  await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  await landingPage.clickTab('My Products');
  await landingPage.changePerPage('100').catch(() => undefined);

  const grid = landingPage.grid;
  await grid.getByRole('row').nth(1).waitFor({ state: 'visible', timeout: 30_000 });
  const rows = grid.getByRole('row');
  const totalRows = await rows.count();
  const productHrefs: string[] = [];
  for (let i = 1; i < Math.min(maxRows + 1, totalRows); i++) {
    const href = await rows.nth(i).getByRole('link').first().getAttribute('href').catch(() => null);
    if (href) productHrefs.push(href);
  }

  for (const href of productHrefs) {
    await page.goto(href);
    await newProductPage.expectProductDetailLoaded();
    // Use clickEditProduct (lighter, no networkidle) for scanner iteration speed
    await newProductPage.clickEditProduct();
    await newProductPage.expectEditModeVisible();
    await newProductPage.waitForOSLoad();

    const isEditable = await newProductPage.brandLabelCheckbox.isEnabled().catch(() => false);
    if (!isEditable) {
      await page.getByRole('button', { name: 'Cancel' }).click();
      const leave = page.getByRole('button', { name: 'Leave' });
      if (await leave.isVisible({ timeout: 3_000 }).catch(() => false)) await leave.click();
      await newProductPage.expectProductDetailLoaded();
      continue;
    }

    // If Brand Label is currently OFF, toggling ON will make Vendor required.
    // Skip products where Brand Label is OFF but Vendor is blank (save would fail).
    const isBrandLabelChecked = await newProductPage.brandLabelCheckbox.isChecked().catch(() => false);
    if (!isBrandLabelChecked) {
      const vendorValue = await newProductPage.vendorInput.inputValue().catch(() => '');
      if (!vendorValue) {
        await page.getByRole('button', { name: 'Cancel' }).click();
        const leave = page.getByRole('button', { name: 'Leave' });
        if (await leave.isVisible({ timeout: 3_000 }).catch(() => false)) await leave.click();
        await newProductPage.expectProductDetailLoaded();
        continue;
      }
    }

    // Also verify org levels are all filled AND enabled
    await newProductPage.clickProductOrganizationTab();
    await newProductPage.orgLevel1Select.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);
    const l1 = await newProductPage.getSelectedOrgLevel1().catch(() => '');
    const l2 = await newProductPage.getSelectedOrgLevel2().catch(() => '');
    const l3 = await newProductPage.getSelectedOrgLevel3().catch(() => '');
    const l1Enabled = await newProductPage.orgLevel1Select.isEnabled({ timeout: 3_000 }).catch(() => false);
    const l2Enabled = await newProductPage.orgLevel2Select.isEnabled({ timeout: 3_000 }).catch(() => false);
    if (isBlank(l1) || isBlank(l2) || isBlank(l3) || !l1Enabled || !l2Enabled) {
      await page.getByRole('button', { name: 'Cancel' }).click();
      const leave = page.getByRole('button', { name: 'Leave' });
      if (await leave.isVisible({ timeout: 3_000 }).catch(() => false)) await leave.click();
      await newProductPage.expectProductDetailLoaded();
      continue;
    }

    return; // Stay on this product in edit mode — Brand Label is editable and org levels are complete + enabled
  }
  throw new Error(`Could not find a product with editable Brand Label checkbox and valid org levels in the first ${maxRows} rows.`);
}

test.describe('Product Details Page (PIC-108, PIC-109, PIC-110) @regression', () => {
  test.setTimeout(600_000);

  let productName: string;
  let productUrl: string;
  test('PRODUCT-DETAIL-001 — should display product detail header with name, ID, status, and action links', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-DETAIL-001: Verify Product Detail page header shows product name, PIC-ID, Active status badge, ' +
      'Edit Product button, View History link, and Actions Management link.',
    );

    await test.step('Navigate to My Products and open first product', async () => {
      await landingPage.openMyProductsTab();
      productName = await landingPage.getFirstProductName();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
      productUrl = page.url();
    });

    await test.step('Verify product name in header', async () => {
      await newProductPage.expectProductNameVisible(productName);
    });

    await test.step('Verify product ID format (PIC-XXXX)', async () => {
      await newProductPage.expectProductIdVisible();
    });

    await test.step('Verify Active status badge is displayed', async () => {
      await newProductPage.expectProductStatusBadge('Active');
    });

    await test.step('Verify Edit Product button is visible', async () => {
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Verify View History link is visible', async () => {
      await newProductPage.expectViewHistoryLinkVisible();
    });

    await test.step('Verify Actions Management link is visible', async () => {
      await newProductPage.expectActionsManagementLinkVisible();
    });
  });

  test('PRODUCT-DETAIL-002 — should display Product Details and bottom section tabs in view mode', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-DETAIL-002: Verify view mode shows Product Related Details section, Product Description, ' +
      'and bottom section tabs (Organization, Team, Security Summary, Configuration).',
    );

    await test.step('Navigate to first product detail', async () => {
      await landingPage.openMyProductsTab();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Verify Product Related Details section title', async () => {
      await newProductPage.sectionTitle.waitFor({ state: 'visible', timeout: 30_000 });
    });

    await test.step('Verify Product Description accordion is visible', async () => {
      await newProductPage.productDescriptionToggle.waitFor({ state: 'visible', timeout: 30_000 });
    });

    await test.step('Verify bottom section tabs are visible', async () => {
      await newProductPage.expectBottomTabsVisible();
    });

    await test.step('Verify Product Details and Releases top tabs exist', async () => {
      await newProductPage.productDetailsTab.waitFor({ state: 'visible', timeout: 30_000 });
      await newProductPage.releasesTab.waitFor({ state: 'visible', timeout: 30_000 });
    });
  });

  test('PRODUCT-DETAIL-003 — should show required field validation when clearing Product Name in edit mode', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-DETAIL-003: In edit mode, clear the mandatory Product Name field and attempt to save. ' +
      'Verify that the form stays visible and does not navigate away.',
    );

    await test.step('Navigate to first product and enter edit mode', async () => {
      await landingPage.openMyProductsTab();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickEditProductAndWaitForForm();
    });

    let originalName: string;

    await test.step('Record original product name and clear it', async () => {
      originalName = await newProductPage.getProductNameValue();
      await newProductPage.fillProductName('');
    });

    await test.step('Attempt to save with empty product name', async () => {
      await newProductPage.clickSave();
    });

    await test.step('Verify form remains visible (save blocked)', async () => {
      await newProductPage.expectFormVisible();
    });

    await test.step('Restore original product name and cancel', async () => {
      await newProductPage.fillProductName(originalName);
      await newProductPage.clickCancelAndConfirmLeave();
    });
  });

  test('PRODUCT-DETAIL-004 — should restore original values when clicking Reset Form in edit mode', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-109');
    await allure.description(
      'PRODUCT-DETAIL-004: In edit mode, change the product name, click Reset Form, and verify the original ' +
      'value is restored without saving.',
    );

    await test.step('Navigate to first product and enter edit mode', async () => {
      await landingPage.openMyProductsTab();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickEditProductAndWaitForForm();
    });

    let originalName: string;

    await test.step('Record original product name', async () => {
      originalName = await newProductPage.getProductNameValue();
    });

    await test.step('Change product name to a temporary value', async () => {
      await newProductPage.fillProductName(`Temp Reset Test ${Date.now()}`);
    });

    await test.step('Click Reset Form', async () => {
      await newProductPage.clickResetForm();
    });

    await test.step('Verify product name reverted to original value', async () => {
      await newProductPage.expectProductNameValue(originalName);
    });

    await test.step('Cancel edit mode to clean up', async () => {
      await newProductPage.clickCancel();
    });
  });

  test('PRODUCT-DETAIL-005 — should persist updated product description after save', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-DETAIL-005: Update the product description in edit mode, save the product, and verify the ' +
      'updated description persists in view mode.',
    );

    const newDescription = `Updated description for automation test - ${Date.now()}`;

    await test.step('Navigate to first product and enter edit mode', async () => {
      await landingPage.openMyProductsTab();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickEditProductAndWaitForForm();
    });

    let originalDescription: string;
    let orgLevels: { l1: string; l2: string; l3: string };

    await test.step('Record original description and org levels', async () => {
      originalDescription = await newProductPage.getDescriptionText();
      // Record org levels BEFORE the CKEditor interaction — the CKEditor focus/input
      // events trigger OS partial refreshes that reset the L1 DOM value to "- Select -".
      // Passing the pre-refresh values to clickSaveWithOrgLevelRecovery allows it to
      // correctly rebind the server-side variables if the save fails.
      orgLevels = {
        l1: await newProductPage.getSelectedOrgLevel1().catch(() => ''),
        l2: await newProductPage.getSelectedOrgLevel2().catch(() => ''),
        l3: await newProductPage.getSelectedOrgLevel3().catch(() => ''),
      };
    });

    await test.step('Update product description', async () => {
      // CKEditor requires click + selectAll + type approach instead of fill()
      const editor = newProductPage.productDescriptionEditor;
      await editor.click();
      await editor.press('Meta+a');
      await editor.pressSequentially(newDescription, { delay: 20 });
    });

    await test.step('Save product', async () => {
      await newProductPage.clickSaveWithOrgLevelRecovery(orgLevels);
      await newProductPage.expectProductSaved();
    });

    await test.step('Verify updated description in view mode', async () => {
      await newProductPage.expectProductDescriptionContains(newDescription);
    });

    await test.step('Restore original description', async () => {
      await newProductPage.clickEditProductAndWaitForForm();
      // Re-record org levels after re-entering edit mode (fresh page load)
      const restoreLevels = {
        l1: await newProductPage.getSelectedOrgLevel1().catch(() => ''),
        l2: await newProductPage.getSelectedOrgLevel2().catch(() => ''),
        l3: await newProductPage.getSelectedOrgLevel3().catch(() => ''),
      };
      const editor = newProductPage.productDescriptionEditor;
      await editor.click();
      await editor.press('Meta+a');
      await editor.pressSequentially(originalDescription, { delay: 20 });
      await newProductPage.clickSaveWithOrgLevelRecovery(restoreLevels);
      await newProductPage.expectProductSaved();
    });
  });

  test('PRODUCT-DETAIL-006 — should toggle and persist Data Protection & Privacy checkbox', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-DETAIL-006: Toggle the Data Protection & Privacy checkbox in edit mode, save, and verify ' +
      'the change persists. Then restore the original value.',
    );

    await test.step('Find a product with editable DPP checkbox and enter edit mode', async () => {
      // Row 1 (PIC-1198) may have an active release which disables the DPP switch.
      // Scan up to 15 rows to find a product where DPP is editable.
      try {
        await openProductWithEditableDPP(page, landingPage, newProductPage);
      } catch (error) {
        test.skip(true, `QA data does not currently expose a product with editable DPP and valid org levels. ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    let wasChecked: boolean;

    await test.step('Record original Data Protection checkbox state', async () => {
      wasChecked = await newProductPage.isDataProtectionChecked();
    });

    await test.step('Toggle Data Protection checkbox', async () => {
      await newProductPage.toggleDataProtection();
    });

    await test.step('Save product', async () => {
      await newProductPage.clickSaveWithOrgLevelRecovery();
      await newProductPage.expectProductSaved();
    });

    await test.step('Verify Data Protection value changed in view mode', async () => {
      const expectedValue = wasChecked ? 'No' : 'Yes';
      await newProductPage.expectDataProtectionValue(expectedValue);
    });

    await test.step('Restore original Data Protection state', async () => {
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.toggleDataProtection();
      await newProductPage.clickSaveWithOrgLevelRecovery();
      await newProductPage.expectProductSaved();
    });
  });

  test('PRODUCT-DETAIL-011 — should show Save Product confirmation dialog when enabling Data Protection & Privacy', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-DETAIL-011: Enabling Data Protection & Privacy in edit mode must trigger the Save Product confirmation dialog before the change is committed.',
    );

    let originalState = false;

    await test.step('Find a product with editable DPP checkbox and enter edit mode', async () => {
      try {
        await openProductWithToggleableDPP(page, landingPage, newProductPage);
      } catch (error) {
        test.skip(true, `QA data does not currently expose a product with toggleable DPP in the OFF state. ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    await test.step('Record original DPP state and enable it when currently off', async () => {
      originalState = await newProductPage.isDataProtectionChecked();
      await newProductPage.toggleDataProtection();
    });

    await test.step('Click Save and verify confirmation dialog is shown', async () => {
      await newProductPage.clickSave();
      await newProductPage.expectSaveConfirmDialogVisible();
    });

    await test.step('Cancel confirmation and leave edit mode without saving', async () => {
      await newProductPage.cancelSaveConfirmDialog();
      await newProductPage.expectEditModeVisible();
      await newProductPage.clickCancelAndConfirmLeave();
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.expectDataProtectionValue('No');
    });
  });

  test('PRODUCT-DETAIL-007 — should toggle and persist Brand Label checkbox', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-DETAIL-007: Toggle the Brand Label checkbox in edit mode, save, and verify ' +
      'the change persists. Then restore the original value.',
    );

    await test.step('Find a product with editable Brand Label checkbox and enter edit mode', async () => {
      try {
        await openProductWithEditableBrandLabel(page, landingPage, newProductPage);
      } catch (error) {
        test.skip(true, `QA data does not currently expose a product with editable Brand Label and valid org levels. ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    let wasChecked: boolean;

    await test.step('Record original Brand Label checkbox state', async () => {
      wasChecked = await newProductPage.isBrandLabelChecked();
    });

    await test.step('Toggle Brand Label checkbox', async () => {
      await newProductPage.toggleBrandLabel();
    });

    await test.step('Save product', async () => {
      await newProductPage.clickSaveAndHandleConfirmDialog();
      await newProductPage.expectProductSaved();
    });

    await test.step('Verify Brand Label value changed in view mode', async () => {
      const expectedValue = wasChecked ? 'No' : 'Yes';
      await newProductPage.expectBrandLabelValue(expectedValue);
    });

    await test.step('Restore original Brand Label state', async () => {
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.toggleBrandLabel();
      await newProductPage.clickSaveAndHandleConfirmDialog();
      await newProductPage.expectProductSaved();
    });
  });

  test('PRODUCT-DETAIL-008 — should display product organization info in view mode', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-DETAIL-008: Verify product organization levels and Cross-Org flag are displayed in view mode ' +
      'under the Product Organization tab.',
    );

    await test.step('Navigate to first product detail', async () => {
      await landingPage.openMyProductsTab();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Verify Product Organization tab is visible and selected', async () => {
      await newProductPage.productOrganizationTab.waitFor({ state: 'visible', timeout: 30_000 });
    });

    await test.step('Verify Org Level values are displayed', async () => {
      await newProductPage.expectOrgLevelValues({
        level1: 'Energy Management',
        level2: 'Home & Distribution',
        level3: 'Connected Offers',
      });
    });
  });

  test('PRODUCT-DETAIL-012 — should display key product fields in read-only view mode', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-DETAIL-012: Product Detail view mode must show the saved values for Product Name, State, Definition, Type, Commercial Reference Number, Data Protection & Privacy, and Brand Label.',
    );

    const details = {
      name: '',
      state: '',
      definition: '',
      type: '',
      commercialRef: '',
      dpp: 'No' as 'Yes' | 'No',
      brandLabel: 'No' as 'Yes' | 'No',
    };

    await test.step('Navigate to first product and capture current values from edit mode', async () => {
      await landingPage.openMyProductsTab();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickEditProductAndWaitForForm();

      details.name = await newProductPage.getProductNameValue();
      details.state = await newProductPage.getSelectedProductState();
      details.definition = await newProductPage.getSelectedProductDefinition();
      details.type = await newProductPage.getSelectedProductType();
      details.commercialRef = await newProductPage.getCommercialRefNumberValue();
      details.dpp = await newProductPage.isDataProtectionChecked() ? 'Yes' : 'No';
      details.brandLabel = await newProductPage.isBrandLabelChecked() ? 'Yes' : 'No';

      await newProductPage.clickCancelAndReturnToViewMode();
    });

    await test.step('Verify view mode shows the same saved values', async () => {
      await newProductPage.expectProductDetailViewMode({
        name: details.name,
        state: details.state,
        definition: details.definition,
        type: details.type,
      });
      if (details.commercialRef) {
        await newProductPage.expectCommercialReferenceValue(details.commercialRef);
      }
      await newProductPage.expectDataProtectionValue(details.dpp);
      await newProductPage.expectBrandLabelValue(details.brandLabel);
    });
  });

  test('PRODUCT-DETAIL-009 — should show Releases tab with Create Release button and list or empty state', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-DETAIL-009: Verify that the Releases top tab is visible on Product Detail ' +
      'page and shows either a releases list or the "No releases were created yet!" empty ' +
      'state message together with a "Create Release" button.',
    );

    await test.step('Navigate to first product detail', async () => {
      await landingPage.openMyProductsTab();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Click the Releases tab', async () => {
      await newProductPage.clickReleasesTab();
    });

    await test.step('Verify Create Release button is always present', async () => {
      await newProductPage.expectCreateReleaseButtonVisible();
    });

    await test.step('Verify Releases tab shows list or empty-state message', async () => {
      const hasNoReleases = await newProductPage.isNoReleasesMessageVisible();
      if (hasNoReleases) {
        await newProductPage.expectNoReleasesStateVisible();
      } else {
        // At least one release row is present — tab remains active
        await newProductPage.expectReleasesTabActive();
      }
    });
  });

  test('PRODUCT-DETAIL-010 — should display all bottom tabs in view mode', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products - Product Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-DETAIL-010: Verify that the four bottom section tabs (Product Organization, ' +
      'Product Team, Security Summary, Product Configuration) are all visible on the ' +
      'Product Detail page in view mode.',
    );

    await test.step('Navigate to first product detail', async () => {
      await landingPage.openMyProductsTab();
      await landingPage.clickProductAtRow(1);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Verify all four bottom tabs are visible', async () => {
      await newProductPage.expectBottomTabsVisible();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 3.2 — Product Detail: Digital Offer Certification Tab
// ────────────────────────────────────────────────────────────────────────────
test.describe('Product Details - Digital Offer Certification Tab @regression', () => {
  test.setTimeout(180_000);
  test('PROD-DOC-CERT-001 — should display Digital Offer Certification tab on a Digital Offer product @regression', async ({ newProductPage, page }) => {
    await allure.suite('Products - Digital Offer Certification');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PROD-DOC-CERT-001: Navigate to a product with Digital Offer enabled and verify ' +
      'the Digital Offer Certification bottom tab is visible.',
    );

    await test.step('Navigate to Digital Offer product', async () => {
      await page.goto('/GRC_PICASso/ProductDetail?ProductId=1162');
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Verify Digital Offer Certification tab is visible', async () => {
      await newProductPage.expectDigitalOfferCertificationTabVisible();
    });
  });

  test('PROD-DOC-CERT-002 — should show Digital Offer Certification content when tab is clicked @regression', async ({ newProductPage, page }) => {
    await allure.suite('Products - Digital Offer Certification');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PROD-DOC-CERT-002: Click the Digital Offer Certification tab and verify ' +
      'the tab becomes active.',
    );

    await test.step('Navigate to Digital Offer product', async () => {
      await page.goto('/GRC_PICASso/ProductDetail?ProductId=1162');
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Click Digital Offer Certification tab', async () => {
      await newProductPage.clickDigitalOfferCertificationTab();
    });

    await test.step('Verify tab is active', async () => {
      await newProductPage.expectDigitalOfferCertificationTabActive();
    });
  });
});
