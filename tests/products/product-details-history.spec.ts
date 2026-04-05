import { test } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

/**
 * Product Detail — View History
 *
 * Stories: PIC-110
 *
 * These scenarios cover the View History feature accessible from the Product Detail header.
 */

test.describe('Product Details - View History @regression', () => {
  test.setTimeout(240_000);

  test.beforeEach(async ({ loginPage, userCredentials, page }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  test('should open View History dialog when clicking View History link @regression', async ({ newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-001: On Product Detail page, click the "View History" link and verify ' +
      'that a history dialog opens showing product change history.',
    );

    await test.step('Navigate to product detail page', async () => {
      await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso/ProductDetail?ProductId=1162');
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Click View History link', async () => {
      await newProductPage.clickViewHistory();
    });

    await test.step('Verify history dialog is visible', async () => {
      await newProductPage.expectHistoryDialogVisible();
    });

    await test.step('Verify history grid is visible', async () => {
      await newProductPage.expectHistoryGridVisible();
    });

    await test.step('Close history dialog', async () => {
      await newProductPage.closeHistoryDialog();
    });
  });

  test('should display history entries with dates, users and change descriptions @regression', async ({ newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-002: Open View History and verify entries contain Date, User, Activity, ' +
      'and Description columns with at least one row of data.',
    );

    await test.step('Navigate to product detail page', async () => {
      await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso/ProductDetail?ProductId=1162');
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Open View History dialog', async () => {
      await newProductPage.clickViewHistory();
      await newProductPage.expectHistoryDialogVisible();
    });

    await test.step('Verify history grid column headers', async () => {
      await newProductPage.expectHistoryGridColumnHeaders();
    });

    await test.step('Verify history grid has at least one record', async () => {
      await newProductPage.expectHistoryGridHasRows();
    });

    await test.step('Close history dialog', async () => {
      await newProductPage.closeHistoryDialog();
    });
  });
});
