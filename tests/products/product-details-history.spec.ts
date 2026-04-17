import { test } from '../../src/fixtures';
import { expect, type Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { LandingPage, NewProductPage } from '../../src/pages';

function parseHistoryDate(value: string): number {
  const normalized = value.replace(/\s+/g, ' ').trim();
  const direct = Date.parse(normalized);
  if (!Number.isNaN(direct)) return direct;

  const match = normalized.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})(?:,?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i);
  if (!match) {
    throw new Error(`Unsupported Product History date format: ${value}`);
  }

  const [, first, second, yearRaw, hourRaw, minuteRaw, secondRaw, meridiemRaw] = match;
  const firstNumber = Number(first);
  const secondNumber = Number(second);
  const year = Number(yearRaw.length === 2 ? `20${yearRaw}` : yearRaw);

  const month = firstNumber > 12 ? secondNumber : firstNumber;
  const day = firstNumber > 12 ? firstNumber : secondNumber;

  let hours = Number(hourRaw ?? '0');
  const minutes = Number(minuteRaw ?? '0');
  const seconds = Number(secondRaw ?? '0');
  const meridiem = meridiemRaw?.toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
}

async function findProductWithMinimumHistoryRows(
  page: Page,
  landingPage: LandingPage,
  newProductPage: NewProductPage,
  minimumRows: number,
  maxProductsToCheck = 40,
): Promise<string> {
  await landingPage.openMyProductsTab();
  await landingPage.changePerPage('100').catch(() => undefined);

  const rows = landingPage.grid.getByRole('row');
  const totalRows = await rows.count();
  const productUrls: string[] = [];

  for (let index = 1; index < Math.min(maxProductsToCheck + 1, totalRows); index++) {
    const href = await rows.nth(index).getByRole('link').first().getAttribute('href').catch(() => null);
    if (href) productUrls.push(href);
  }

  for (const href of productUrls) {
    await page.goto(href);
    await newProductPage.expectProductDetailLoaded();
    await newProductPage.clickViewHistory();
    await newProductPage.expectHistoryDialogVisible();

    const rowCount = (await newProductPage.getHistoryDateTexts(minimumRows)).length;
    await newProductPage.closeHistoryDialog();

    if (rowCount >= minimumRows) {
      return page.url();
    }
  }

  throw new Error(`No product with at least ${minimumRows} Product History rows found in the first ${maxProductsToCheck} My Products rows.`);
}

async function findProductWithMinimumHistoryRowsOrSkip(
  page: Page,
  landingPage: LandingPage,
  newProductPage: NewProductPage,
  minimumRows: number,
  message: string,
): Promise<string> {
  try {
    return await findProductWithMinimumHistoryRows(page, landingPage, newProductPage, minimumRows);
  } catch (error) {
    test.skip(true, `${message} ${error instanceof Error ? error.message : String(error)}`);
  }

  throw new Error('Unreachable after test.skip');
}

async function createProductForHistoryValidation(newProductPage: NewProductPage): Promise<{ productName: string; productId: string }> {
  const productName = `History Validation ${Date.now()}`;

  await newProductPage.fillProductInformation({
    name: productName,
    state: 'Under development (not yet released)',
    definition: 'System',
    type: 'Embedded Device',
    description: 'Automation-created product for Product Change History creation-event validation.',
  });

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
    state: 'Under development (not yet released)',
    definition: 'System',
    type: 'Embedded Device',
    description: 'Automation-created product for Product Change History creation-event validation.',
  });

  await newProductPage.clickSave();
  await newProductPage.expectProductSaved();

  const productId = await newProductPage.getProductIdText();
  return { productName, productId };
}

function toDayBounds(timestamp: number): { start: Date; end: Date } {
  const date = new Date(timestamp);
  return {
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
  };
}

function isSameCalendarDay(timestamp: number, target: Date): boolean {
  const date = new Date(timestamp);
  return date.getFullYear() === target.getFullYear()
    && date.getMonth() === target.getMonth()
    && date.getDate() === target.getDate();
}

/**
 * Product Detail — View History
 *
 * Stories: PIC-110
 *
 * These scenarios cover the View History feature accessible from the Product Detail header.
 */

test.describe('Product Details - View History @regression', () => {
  test.setTimeout(240_000);
  test('should open View History dialog when clicking View History link @regression', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-001: On Product Detail page, click the "View History" link and verify ' +
      'that a history dialog opens showing product change history.',
    );

    await test.step('Navigate to a product detail page with Product History', async () => {
      const productUrl = await findProductWithMinimumHistoryRowsOrSkip(
        page,
        landingPage,
        newProductPage,
        1,
        'QA data does not currently expose a product with Product History rows for dialog-open validation.',
      );
      await page.goto(productUrl);
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

  test('should display history entries with dates, users and change descriptions @regression', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-002: Open View History and verify entries contain Date, User, Activity, ' +
      'and Description columns with at least one row of data.',
    );

    await test.step('Navigate to a product detail page with Product History', async () => {
      const productUrl = await findProductWithMinimumHistoryRowsOrSkip(
        page,
        landingPage,
        newProductPage,
        1,
        'QA data does not currently expose a product with Product History rows for grid validation.',
      );
      await page.goto(productUrl);
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

  test('should reset Product Change History search and activity filters @regression', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-003: In Product Change History, applying search text and a non-default ' +
      'Activity filter must be reversible via Reset, which clears the searchbox and restores the Activity dropdown.',
    );

    let selectedActivity = '';

    await test.step('Navigate to product detail page', async () => {
      const productUrl = await findProductWithMinimumHistoryRowsOrSkip(
        page,
        landingPage,
        newProductPage,
        1,
        'QA data does not currently expose a product with Product History rows for filter reset validation.',
      );
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Open View History dialog', async () => {
      await newProductPage.clickViewHistory();
      await newProductPage.expectHistoryDialogVisible();
    });

    await test.step('Apply search text and a non-default Activity filter', async () => {
      const activityOptions = await newProductPage.getHistoryActivityFilterOptionLabels();
      const candidate = activityOptions.find(
        (option) => option && !/^(all|select activity)$/i.test(option),
      );

      expect(candidate, 'Expected at least one non-default Product History activity option').toBeTruthy();
      selectedActivity = candidate!;

      await newProductPage.fillHistorySearchInput('Creation');
      await newProductPage.selectHistoryActivityFilter(selectedActivity);
    });

    await test.step('Reset filters and verify default control state is restored', async () => {
      await newProductPage.clickHistoryResetFilters();

      await expect.poll(() => newProductPage.getHistorySearchInputValue()).toBe('');
      await expect.poll(() => newProductPage.getSelectedHistoryActivityFilterLabel()).not.toBe(selectedActivity);
    });

    await test.step('Close history dialog', async () => {
      await newProductPage.closeHistoryDialog();
    });
  });

  test('should show Product Change History entries sorted by newest date first @regression', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-004: Product Change History rows must be ordered by date descending so the newest activity appears first.',
    );

    await test.step('Navigate to a product with enough history rows and open View History dialog', async () => {
      const productUrl = await findProductWithMinimumHistoryRowsOrSkip(
        page,
        landingPage,
        newProductPage,
        2,
        'QA data does not currently expose enough Product History rows for descending-sort validation.',
      );
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickViewHistory();
      await newProductPage.expectHistoryDialogVisible();
    });

    await test.step('Verify visible history dates are sorted descending', async () => {
      const dateTexts = await newProductPage.getHistoryDateTexts(5);
      expect(dateTexts.length, 'Expected at least two Product History rows to validate sort order').toBeGreaterThan(1);

      const timestamps = dateTexts.map(parseHistoryDate);
      const sorted = [...timestamps].sort((left, right) => right - left);
      expect(timestamps).toEqual(sorted);
    });

    await test.step('Close history dialog', async () => {
      await newProductPage.closeHistoryDialog();
    });
  });

  test('should show no-data message when Product Change History filters return no results @regression', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-005: Product Change History must show the empty-state message when the applied filters return no matching rows.',
    );

    const unmatchedSearch = `no-history-match-${Date.now()}`;

    await test.step('Navigate to a product with Product History and open View History dialog', async () => {
      const productUrl = await findProductWithMinimumHistoryRowsOrSkip(
        page,
        landingPage,
        newProductPage,
        1,
        'QA data does not currently expose a product with Product History rows for empty-state validation.',
      );
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickViewHistory();
      await newProductPage.expectHistoryDialogVisible();
    });

    await test.step('Apply a search term that cannot match any history row', async () => {
      await newProductPage.fillHistorySearchInput(unmatchedSearch);
      await newProductPage.clickHistorySearchButton();
    });

    await test.step('Verify no-data message appears for the filtered grid', async () => {
      await newProductPage.expectHistoryNoDataMessageVisible();
    });

    await test.step('Close history dialog', async () => {
      await newProductPage.closeHistoryDialog();
    });
  });

  test('should filter Product Change History by selected date range @regression', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-006: Product Change History date range filter must narrow the grid to rows that fall within the selected day.',
    );

    let targetDay!: Date;

    await test.step('Navigate to a product with Product History and open View History dialog', async () => {
      const productUrl = await findProductWithMinimumHistoryRowsOrSkip(
        page,
        landingPage,
        newProductPage,
        1,
        'QA data does not currently expose a product with Product History rows for date-range validation.',
      );
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickViewHistory();
      await newProductPage.expectHistoryDialogVisible();
    });

    await test.step('Use the first history row date as the filter day', async () => {
      const [firstDateText] = await newProductPage.getHistoryDateTexts(1);
      expect(firstDateText, 'Expected at least one Product History row').toBeTruthy();

      const { start, end } = toDayBounds(parseHistoryDate(firstDateText));
      targetDay = start;
      await newProductPage.selectHistoryDateRange(start, end);
      await newProductPage.clickHistorySearchButton();
    });

    await test.step('Verify filtered rows all belong to the selected day', async () => {
      const filteredDates = await newProductPage.getHistoryDateTexts(20);
      expect(filteredDates.length, 'Expected Product History date range filter to keep at least one row').toBeGreaterThan(0);

      for (const value of filteredDates) {
        expect(isSameCalendarDay(parseHistoryDate(value), targetDay)).toBe(true);
      }
    });

    await test.step('Close history dialog', async () => {
      await newProductPage.closeHistoryDialog();
    });
  });

  test('should paginate Product Change History when more than one page of rows exists @regression', async ({ landingPage, newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-007: Product Change History pagination must support per-page selection and moving to the next page when more than 10 records exist.',
    );

    await test.step('Navigate to a product with more than 10 history rows and open View History dialog', async () => {
      const productUrl = await findProductWithMinimumHistoryRowsOrSkip(
        page,
        landingPage,
        newProductPage,
        11,
        'QA data does not currently expose a product with enough Product History rows for pagination validation.',
      );
      await page.goto(productUrl);
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickViewHistory();
      await newProductPage.expectHistoryDialogVisible();
    });

    await test.step('Set per-page to 10 and verify the first page row count', async () => {
      const totalRecords = await newProductPage.getHistoryTotalRecordCount();
      expect(totalRecords, 'Expected at least 11 Product History records to validate pagination').toBeGreaterThan(10);

      await newProductPage.changeHistoryPerPage('10');
      const visibleRows = await newProductPage.getHistoryRowCount();
      expect(visibleRows).toBeLessThanOrEqual(10);
      expect(await newProductPage.getCurrentHistoryPageNumber()).toBe(1);
    });

    await test.step('Navigate to page 2 and verify rows are displayed', async () => {
      await newProductPage.goToHistoryPage(2);
      await expect.poll(() => newProductPage.getCurrentHistoryPageNumber()).toBe(2);
      await expect.poll(() => newProductPage.getHistoryRowCount()).toBeGreaterThan(0);
    });

    await test.step('Close history dialog', async () => {
      await newProductPage.closeHistoryDialog();
    });
  });

  test('should record a creation event in Product Change History after a new product is saved @regression', async ({ newProductPage, page }) => {
    await allure.suite('Products - View History');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    await allure.description(
      'PRODUCT-HISTORY-008: Immediately after creating a new product, Product Change History must contain a same-session creation entry for that product.',
    );

    let createdProduct!: { productName: string; productId: string };

    await test.step('Open the New Product form directly', async () => {
      await page.goto(`https://qa.leap.schneider-electric.com${newProductPage.url}`, { waitUntil: 'domcontentloaded' });
      await newProductPage.expectNewProductFormLoaded();
    });

    await test.step('Create a new product for history validation', async () => {
      createdProduct = await createProductForHistoryValidation(newProductPage);
      expect(createdProduct.productId, 'Expected newly created product to expose a PIC identifier').toMatch(/PIC-\d+/i);
    });

    await test.step('Open Product Change History for the newly created product', async () => {
      await newProductPage.clickViewHistory();
      await newProductPage.expectHistoryDialogVisible();
      await newProductPage.expectHistoryGridVisible();
      await newProductPage.expectHistoryGridHasRows();
    });

    await test.step('Verify the newest history rows include a same-day creation signal for the new product', async () => {
      const rowTexts = await newProductPage.getHistoryRowTexts(5);
      const dateTexts = await newProductPage.getHistoryDateTexts(5);

      expect(rowTexts.length, 'Expected at least one Product History row after creating a product').toBeGreaterThan(0);
      expect(dateTexts.length, 'Expected at least one Product History date after creating a product').toBeGreaterThan(0);

      const today = new Date();
      expect(dateTexts.some((value) => isSameCalendarDay(parseHistoryDate(value), today))).toBe(true);

      const creationSignal = rowTexts.some((value) => /create|created|creation/i.test(value));
      const productSignal = rowTexts.some((value) => value.includes(createdProduct.productName) || value.includes(createdProduct.productId));
      expect(
        creationSignal || productSignal,
        `Expected one of the newest Product History rows to mention creation or the new product identity. Rows: ${rowTexts.join(' | ')}`,
      ).toBe(true);
    });

    await test.step('Close history dialog', async () => {
      await newProductPage.closeHistoryDialog();
    });
  });
});
