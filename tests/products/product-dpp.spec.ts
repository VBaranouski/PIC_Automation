import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

import { readWF3ProductState } from '../../src/helpers/wf3-product-state.helper';

/**
 * Product Data Protection & Privacy controls.
 *
 * Pre-req: Run the `wf3-pre-req` Playwright project first so
 * .wf3-product-state.json contains a product with at least one active release.
 */

test.describe('Product Data Protection & Privacy @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('PRODUCT-DPP-001 — DPP toggle cannot be changed when an active release exists', async ({
    page, newProductPage,
  }) => {
    await allure.suite('Products - Data Protection & Privacy');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-DPP-001: Open the WF3 pre-req product, which has an active release, ' +
      'and verify the Data Protection & Privacy checkbox is disabled in edit mode with the active-release warning.',
    );

    const wf3State = readWF3ProductState();

    await test.step('Open the WF3 pre-req product detail page', async () => {
      await page.goto(wf3State.productUrl, { waitUntil: 'domcontentloaded' });
      await newProductPage.expectProductDetailLoaded();
      await expect(page).toHaveURL(/ProductDetail/);
    });

    await test.step('Enter edit mode', async () => {
      await newProductPage.clickEditProductAndWaitForForm();
    });

    await test.step('Verify DPP cannot be changed while an active release exists', async () => {
      await expect(newProductPage.dataProtectionCheckbox).toBeVisible({ timeout: 15_000 });
      await newProductPage.expectDataProtectionCheckboxDisabledInEditMode();
      await newProductPage.expectDataProtectionActiveReleaseWarningVisible();
    });

    await test.step('Cancel edit mode without changes', async () => {
      await newProductPage.clickCancelAndReturnToViewMode();
    });
  });
});