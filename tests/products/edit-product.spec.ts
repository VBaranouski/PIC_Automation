import { test, expect } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage, NewProductPage } from '../../src/pages';
import * as allure from 'allure-js-commons';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function createEditableProduct(
  newProductPage: NewProductPage,
): Promise<{
  productName: string;
  originalProductName: string;
  originalCommercialRef: string;
  productState: string;
  productDefinition: string;
  productType: string;
}> {
  const productState = 'Under development (not yet released)';
  const productDefinition = 'System';
  const productType = 'Embedded Device';
  const productName = `Power Switch - Edit Flow ${Date.now()}`;
  const originalCommercialRef = `AUTO-BASE-${Date.now()}`;

  await newProductPage.goto();
  await newProductPage.expectNewProductFormLoaded();

  await newProductPage.fillProductInformation({
    name: productName,
    state: productState,
    definition: productDefinition,
    type: productType,
    description: 'Automation-created product for PIC-108 and PIC-109 edit coverage.',
  });
  await newProductPage.fillCommercialRefNumber(originalCommercialRef);

  await newProductPage.fillProductOrganization({
    level1: 'Energy Management',
    level2: 'Home & Distribution',
    level3: 'Connected Offers',
  });

  await newProductPage.fillProductTeam({
    searchQuery: 'Ulad',
    fullName: 'Uladzislau Baranouski',
  });

  await newProductPage.fillProductInformation({
    name: productName,
    state: productState,
    definition: productDefinition,
    type: productType,
    description: 'Automation-created product for PIC-108 and PIC-109 edit coverage.',
  });

  await newProductPage.clickSave();
  await newProductPage.expectProductSaved();

  return {
    productName,
    originalProductName: productName,
    originalCommercialRef,
    productState,
    productDefinition,
    productType,
  };
}

async function openCreatedProductFromMyProducts(
  landingPage: LandingPage,
  newProductPage: NewProductPage,
  productName: string,
): Promise<void> {
  await landingPage.openMyProductsTab();
  await landingPage.searchAndSelectProductByName(productName, new RegExp(escapeRegExp(productName)));
  await landingPage.expectGridHasRows();
  await landingPage.clickProductAtRow(1);
  await newProductPage.expectProductDetailLoaded();
}

test.describe.serial('Products - Edit Existing Product (PIC-108, PIC-109) @regression', () => {
  test.setTimeout(240_000);

  let productUrl: string;
  let originalProductName: string;
  let originalCommercialRef: string;
  let updatedProductName: string;
  let updatedCommercialRef: string;
  let productState: string;
  let productDefinition: string;
  let productType: string;
  test('PRODUCT-EDIT-001 — should edit an existing product from My Products and save changes', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-EDIT-001: Starting from Home Page > My Products, open an editable product, update core fields, save, and verify the changes persist.',
    );

    await test.step('Create a valid product that can be edited', async () => {
      const editableProduct = await createEditableProduct(newProductPage);
      originalProductName = editableProduct.originalProductName;
      originalCommercialRef = editableProduct.originalCommercialRef;
      productState = editableProduct.productState;
      productDefinition = editableProduct.productDefinition;
      productType = editableProduct.productType;

      updatedProductName = `${editableProduct.productName} - Edited ${Date.now()}`;
      updatedCommercialRef = `AUTO-EDIT-${Date.now()}`;
    });

    await test.step('Open the created product from Home Page > My Products', async () => {
      await openCreatedProductFromMyProducts(landingPage, newProductPage, originalProductName);
      productUrl = page.url();
      await newProductPage.clickEditProductAndWaitForForm();
    });

    await test.step('Update product fields in edit mode', async () => {
      await newProductPage.fillProductName(updatedProductName);
      await newProductPage.fillCommercialRefNumber(updatedCommercialRef);
      await newProductPage.fillProductTeam({
        searchQuery: 'Ulad',
        fullName: 'Uladzislau Baranouski',
      });
      await newProductPage.selectProductDropdowns({
        state: productState,
        definition: productDefinition,
        type: productType,
      });
    });

    await test.step('Save product changes', async () => {
      await newProductPage.clickSave();
      await newProductPage.expectProductSaved();
    });

    await test.step('Re-open edit mode and verify saved values persist', async () => {
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.expectProductNameValue(updatedProductName);
      await newProductPage.expectCommercialRefNumberValue(updatedCommercialRef);
    });
  });

  test('PRODUCT-EDIT-002 — should discard unsaved existing-product changes when canceling edit mode', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-109');
    await allure.description(
      'PRODUCT-EDIT-002: Starting from Home Page > My Products, open the same editable product, make temporary changes, cancel edit mode, and verify unsaved values are discarded.',
    );

    const unsavedProductName = `${updatedProductName} - Cancelled`;
    const unsavedCommercialRef = `${updatedCommercialRef}-TMP`;

    await test.step('Open the edited product again and enter edit mode', async () => {
      await openCreatedProductFromMyProducts(landingPage, newProductPage, updatedProductName);
      await newProductPage.clickEditProductAndWaitForForm();
    });

    await test.step('Apply temporary changes without saving', async () => {
      await newProductPage.fillProductName(unsavedProductName);
      await newProductPage.fillCommercialRefNumber(unsavedCommercialRef);
    });

    await test.step('Cancel edit mode and confirm leaving the page', async () => {
      await newProductPage.clickCancelAndConfirmLeave();
    });

    await test.step('Re-open the product and verify unsaved changes were discarded', async () => {
      await openCreatedProductFromMyProducts(landingPage, newProductPage, updatedProductName);
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.expectProductNameValue(updatedProductName);
      await newProductPage.expectCommercialRefNumberValue(updatedCommercialRef);
    });

    await test.step('Restore original product values as cleanup', async () => {
      await newProductPage.fillProductName(originalProductName);
      await newProductPage.fillCommercialRefNumber(originalCommercialRef);
      await newProductPage.fillProductTeam({
        searchQuery: 'Ulad',
        fullName: 'Uladzislau Baranouski',
      });
      await newProductPage.selectProductDropdowns({
        state: productState,
        definition: productDefinition,
        type: productType,
      });
      await newProductPage.clickSave();
      await newProductPage.expectProductSaved();
    });

    await test.step('Verify original values are restored', async () => {
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.expectProductNameValue(originalProductName);
      await newProductPage.expectCommercialRefNumberValue(originalCommercialRef);
    });
  });

  test('PRODUCT-EDIT-003 — should restore view mode (Edit Product button reappears, Save hidden) after saving an edit', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-EDIT-003: After saving an edit, the page must transition back to view mode — the "Edit Product" button reappears and the "Save" button is no longer present.',
    );

    const refreshedRef = `AUTO-EDIT3-${Date.now()}`;

    await test.step('Open the test product and enter edit mode', async () => {
      await openCreatedProductFromMyProducts(landingPage, newProductPage, originalProductName);
      await newProductPage.clickEditProductAndWaitForForm();
    });

    await test.step('Modify Commercial Reference Number and re-fill team/dropdowns', async () => {
      await newProductPage.fillCommercialRefNumber(refreshedRef);
      await newProductPage.fillProductTeam({
        searchQuery: 'Ulad',
        fullName: 'Uladzislau Baranouski',
      });
      await newProductPage.selectProductDropdowns({
        state: productState,
        definition: productDefinition,
        type: productType,
      });
    });

    await test.step('Save and verify view mode is restored', async () => {
      await newProductPage.clickSave();
      await newProductPage.expectProductSaved();
      await test.expect.poll(
        () => newProductPage.saveButton.isVisible().catch(() => false),
        { timeout: 15_000, intervals: [500, 1_000, 2_000] },
      ).toBe(false);
      // EDIT-003 mutates the saved ref. Update describe-scope state so later serial tests
      // (EDIT-006) assert against the actual persisted value.
      originalCommercialRef = refreshedRef;
    });
  });

  test('PRODUCT-EDIT-004 — should show Leave Page confirmation dialog when canceling edits with a dirty form', async ({ page, landingPage, newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-109');
    await allure.description(
      'PRODUCT-EDIT-004: Modifying a field and clicking Cancel must open the OutSystems "Leave Page" confirmation dialog with both "Leave" and "Cancel" buttons.',
    );

    await test.step('Open the test product and enter edit mode, then dirty the form', async () => {
      await openCreatedProductFromMyProducts(landingPage, newProductPage, originalProductName);
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.fillProductName(`${originalProductName} - Dirty ${Date.now()}`);
    });

    await test.step('Click Cancel and verify Leave Page dialog with both buttons', async () => {
      await newProductPage.clickCancel();
      const leaveButton = page.getByRole('button', { name: /^Leave$/ });
      const cancelButton = page.getByRole('dialog').getByRole('button', { name: /^Cancel$/ });
      await test.expect(leaveButton).toBeVisible({ timeout: 20_000 });
      await test.expect(cancelButton).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Dismiss the Leave Page dialog (Cancel) and stay in edit mode', async () => {
      const dialogCancel = page.getByRole('dialog').getByRole('button', { name: /^Cancel$/ });
      await dialogCancel.click();
      await newProductPage.expectEditModeVisible();
    });
  });

  test('PRODUCT-EDIT-005 — should discard unsaved changes and return to view mode when clicking Leave', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-109');
    await allure.description(
      'PRODUCT-EDIT-005: Clicking the "Leave" button in the Leave Page dialog must close the dialog, restore view mode, and discard the unsaved name change.',
    );

    const tempName = `${originalProductName} - Temporary ${Date.now()}`;

    await test.step('Open the test product and enter edit mode, then modify product name', async () => {
      await openCreatedProductFromMyProducts(landingPage, newProductPage, originalProductName);
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.fillProductName(tempName);
    });

    await test.step('Click Cancel then Leave and verify view mode with original name', async () => {
      await newProductPage.clickCancelAndConfirmLeave();
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.expectProductNameVisible(originalProductName);
    });
  });

  test('PRODUCT-EDIT-006 — should show previously saved values when reopening edit mode', async ({ landingPage, newProductPage }) => {
    await allure.suite('Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-108');
    await allure.description(
      'PRODUCT-EDIT-006: Re-opening edit mode after saved changes must show the previously saved values in the form fields.',
    );

    await test.step('Open the test product and enter edit mode', async () => {
      await openCreatedProductFromMyProducts(landingPage, newProductPage, originalProductName);
      await newProductPage.clickEditProductAndWaitForForm();
    });

    await test.step('Verify saved name and commercial reference are pre-populated', async () => {
      await newProductPage.expectProductNameValue(originalProductName);
      await newProductPage.expectCommercialRefNumberValue(originalCommercialRef);
    });

    await test.step('Cancel without changes — view mode is restored without leave dialog', async () => {
      await newProductPage.clickCancelAndReturnToViewMode();
    });
  });
});

test.describe('Products - Product Configuration @regression', () => {
  test.setTimeout(120_000);

  test('PRODUCT-CONFIG-001 — "Show Process sub-requirements" toggle is visible in Product Configuration section in edit mode', async ({ newProductPage, page }) => {
    await allure.suite('Products - Configuration');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-CONFIG-001: On Product Detail in edit mode, the "Show the Process sub-requirements within ' +
      'Release Management process" toggle is rendered in the Product Configuration section. Non-destructive — ' +
      'edit mode is cancelled without saving.',
    );

    await test.step('Navigate to Product Detail and enter edit mode', async () => {
      await page.goto('/GRC_PICASso/ProductDetail?ProductId=1162');
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickEditProductAndWaitForForm();
    });

    await test.step('Verify the Show Process sub-requirements toggle is visible', async () => {
      await newProductPage.productConfigurationTab.click();
      await page.waitForTimeout(1_000);
      await newProductPage.showProcessSubReqsCheckbox.scrollIntoViewIfNeeded();
      await expect(newProductPage.showProcessSubReqsCheckbox).toBeVisible({ timeout: 15_000 });
    });

    await test.step('Cancel edit without saving', async () => {
      await newProductPage.clickCancelAndReturnToViewMode();
    });
  });
});