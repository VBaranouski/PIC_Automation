import { test } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

/**
 * Product Detail — Actions Management
 *
 * Stories: PIC-110
 *
 * These scenarios cover the Actions Management page accessible from the Product Detail header.
 */

test.describe('Product Details - Actions Management @regression', () => {
  test.setTimeout(240_000);

  test.beforeEach(async ({ loginPage, userCredentials, page }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  test('should navigate to Actions Management page from Product Detail @regression', async ({ newProductPage, page }) => {
    await allure.suite('Products - Actions Management');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-ACTIONS-001: On Product Detail page, click the "Actions Management" link and verify ' +
      'navigation to the Actions Management page with the correct ProductId in URL.',
    );

    await test.step('Navigate to product detail page', async () => {
      await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso/ProductDetail?ProductId=1162');
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Click Actions Management link', async () => {
      await newProductPage.clickActionsManagement();
    });

    await test.step('Verify navigation to Actions Management page', async () => {
      await newProductPage.expectActionsManagementPageLoaded();
    });
  });

  test('should display Actions Management grid with action-related columns @regression', async ({ newProductPage, page }) => {
    await allure.suite('Products - Actions Management');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-ACTIONS-002: Navigate to Actions Management via the Product Detail link and verify the page ' +
      'shows a grid or empty state for actions.',
    );

    await test.step('Navigate to product detail and click Actions Management', async () => {
      await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso/ProductDetail?ProductId=1162');
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickActionsManagement();
    });

    await test.step('Verify Actions Management grid is visible', async () => {
      await newProductPage.expectActionsManagementGridVisible();
    });
  });

  test.fixme('should allow creating a new action from Actions Management page', async ({ newProductPage, page }) => {
    await allure.suite('Products - Actions Management');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-ACTIONS-003: On Actions Management page, verify the ability to create a new action ' +
      'and that it appears in the actions grid after creation.',
    );
    // TODO: Implement action creation flow (destructive test — deferred)
  });
});
