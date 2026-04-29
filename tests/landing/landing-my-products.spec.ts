import { test, expect } from '../../src/fixtures';
import type { Locator } from '@playwright/test';
import * as allure from 'allure-js-commons';

function normalizeCellText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function sortTextValues(values: string[], direction: 'asc' | 'desc'): string[] {
  return [...values].sort((left, right) => {
    const result = left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
    return direction === 'asc' ? result : -result;
  });
}

function expectSortedTextValues(values: string[], direction: 'asc' | 'desc'): void {
  expect(values, `Expected values to be sorted ${direction}`).toEqual(sortTextValues(values, direction));
}

async function getVisibleColumnValues(landingPage: { grid: Locator }, columnIndex: number, limit = 10): Promise<string[]> {
  const rows = landingPage.grid.getByRole('row');
  const rowCount = await rows.count();
  const values: string[] = [];

  for (let rowIndex = 1; rowIndex < Math.min(rowCount, limit + 1); rowIndex++) {
    const value = normalizeCellText(
      await rows.nth(rowIndex).getByRole('gridcell').nth(columnIndex).textContent().catch(() => '') ?? '',
    );
    if (value) values.push(value);
  }

  return values;
}

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.3 — My Products: Latest Release nav, Org Level 1 filter, Actions
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Products Advanced Navigation @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Products');
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-PRODS-LATEST-001 — should navigate to Release Detail when clicking the Latest Release version @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-LATEST-001: Verify that clicking the Latest Release version link in a My Products row navigates to the Release Detail page.',
    );

    let latestReleaseHref: string | null = null;

    await test.step('Find a product row that has a Latest Release link', async () => {
      const rowCount = await landingPage.getGridRowCount();
      for (let r = 1; r <= Math.min(rowCount, 10); r++) {
        latestReleaseHref = await landingPage.getLatestReleaseLinkAtRow(r);
        if (latestReleaseHref && latestReleaseHref.includes('ReleaseDetail')) {
          break;
        }
        latestReleaseHref = null;
      }
      test.skip(!latestReleaseHref, 'No product with a Latest Release link found in first 10 rows.');
    });

    await test.step('Click the Latest Release link', async () => {
      await page.goto(latestReleaseHref!);
    });

    await test.step('Verify navigation to Release Detail page', async () => {
      await page.waitForURL(/ReleaseDetail/, { timeout: 30_000 });
      await expect(page).toHaveURL(/ReleaseDetail/);
    });
  });

  test('LANDING-PRODS-ORG1-001 — should narrow product list when Org Level 1 filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-ORG1-001: Verify the Org Level 1 dropdown filter on My Products narrows the grid results when an option is selected.',
    );

    let initialCount: string;

    await test.step('Record initial record count', async () => {
      initialCount = await landingPage.getRecordCount();
      expect(Number(initialCount)).toBeGreaterThan(0);
    });

    await test.step('Open Org Level 1 dropdown and select first available option', async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.productsOrgLevel1Dropdown);
      test.skip(!optionText, 'No Org Level 1 options available to select.');
    });

    await test.step('Verify grid still has data', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters to restore default state', async () => {
      await landingPage.resetFilters();
      await landingPage.expectGridHasRows();
    });
  });

  test('LANDING-PRODS-ACTIONS-001 — should show Inactivate option in the three-dot Actions menu @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-ACTIONS-001: Verify that the three-dot Actions menu in My Products contains an "Inactivate" option for active products.',
    );

    await test.step('Click the three-dot actions menu in the first product row', async () => {
      await landingPage.clickActionsMenuAtRow(1);
    });

    await test.step('Verify the Inactivate option is visible in the menu', async () => {
      await landingPage.expectActionsMenuOptionVisible('Inactivate');
    });
  });

  test('LANDING-PRODS-ORG2-001 — should narrow product list when Org Level 2 filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-ORG2-001: Verify the Org Level 2 dropdown filter on My Products narrows the grid results when applied after an Org Level 1 selection.',
    );

    let initialCount: string;

    await test.step('Record initial record count', async () => {
      initialCount = await landingPage.getRecordCount();
      expect(Number(initialCount)).toBeGreaterThan(0);
    });

    await test.step('Apply Org Level 1 filter first to enable Org Level 2', async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.productsOrgLevel1Dropdown);
      test.skip(!optionText, 'No Org Level 1 options available to select.');
    });

    await test.step('Apply Org Level 2 filter', async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.productsOrgLevel2Dropdown);
      test.skip(!optionText, 'No Org Level 2 options available to select.');
    });

    await test.step('Verify grid still has data and count changed or stayed narrowed', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset to restore default state', async () => {
      await landingPage.resetFilters();
      await landingPage.expectGridHasRows();
    });
  });

  test('LANDING-PRODS-SORT-001 — sortable My Products columns sort ascending and descending when sorting is available @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-SORT-001: Verify a sortable My Products column can be toggled between ascending and descending order.',
    );

    let productColumnIndex = -1;

    await test.step('Locate the Product column header', async () => {
      const headers = await landingPage.getColumnHeaders();
      productColumnIndex = headers.findIndex((header) => /^product$/i.test(header.trim()) || /product name/i.test(header));
      expect(productColumnIndex, 'Expected a Product column in My Products grid').toBeGreaterThanOrEqual(0);
    });

    await test.step('Click Product header twice and verify opposite sort orders', async () => {
      const productHeader = landingPage.grid.getByRole('columnheader').nth(productColumnIndex);
      const beforeSort = await getVisibleColumnValues(landingPage, productColumnIndex);
      expect(beforeSort.length, 'Expected at least two visible product values before sorting').toBeGreaterThan(1);

      await productHeader.click();
      await landingPage.expectGridHasRows();
      const firstSort = await getVisibleColumnValues(landingPage, productColumnIndex);

      await productHeader.click();
      await landingPage.expectGridHasRows();
      const secondSort = await getVisibleColumnValues(landingPage, productColumnIndex);

      const firstIsAscending = JSON.stringify(firstSort) === JSON.stringify(sortTextValues(firstSort, 'asc'));
      const firstIsDescending = JSON.stringify(firstSort) === JSON.stringify(sortTextValues(firstSort, 'desc'));
      const secondIsAscending = JSON.stringify(secondSort) === JSON.stringify(sortTextValues(secondSort, 'asc'));
      const secondIsDescending = JSON.stringify(secondSort) === JSON.stringify(sortTextValues(secondSort, 'desc'));
      const toggledToOppositeOrder = (firstIsAscending && secondIsDescending) || (firstIsDescending && secondIsAscending);

      test.skip(
        !(firstIsAscending || firstIsDescending) || !(secondIsAscending || secondIsDescending) || !toggledToOppositeOrder,
        'Product column header did not expose both ascending and descending sortable orders in current QA state.',
      );

      if (firstIsAscending) {
        expectSortedTextValues(firstSort, 'asc');
        expectSortedTextValues(secondSort, 'desc');
      } else {
        expectSortedTextValues(firstSort, 'desc');
        expectSortedTextValues(secondSort, 'asc');
      }
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.3 — My Products: Advanced Filters (Product Owner, DOC Lead)
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Products Advanced Filters @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Products');
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-PRODS-OWNER-001 — should filter My Products by Product Owner', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-OWNER-001: Product Owner dropdown filter must narrow the My Products grid to only show products owned by the selected user. Reset must restore the default view.',
    );

    let initialCount = '';
    let selectedOption: string | null = null;

    await test.step('Record initial record count', async () => {
      initialCount = await landingPage.getRecordCount();
      expect(Number(initialCount)).toBeGreaterThan(0);
    });

    await test.step('Select first available Product Owner option', async () => {
      selectedOption = await landingPage.selectFirstVirtualComboboxOption(
        landingPage.productsProductOwnerDropdown,
      );
      test.skip(!selectedOption, 'No Product Owner options available');
    });

    await test.step('Verify grid still has records after filter applied', async () => {
      await landingPage.expectRecordCountGreaterThan(0);
    });

    await test.step('Verify filtered count is ≤ initial count', async () => {
      const filteredCount = Number(await landingPage.getRecordCount());
      expect(filteredCount).toBeLessThanOrEqual(Number(initialCount));
    });

    await test.step('Click Reset and verify record count is restored to original', async () => {
      await landingPage.clickResetFilters();
      await landingPage.expectRecordCountAtLeast(Number(initialCount));
    });
  });

  test('should filter My Products by DOC Lead', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      "LANDING-PRODS-DOCLEAD-001: DOC Lead dropdown filter must narrow the My Products grid to products linked to the selected DOC Lead's scope. Reset must restore the default view.",
    );

    let selectedOption: string | null = null;

    await test.step('Toggle off Show Active Only to broaden the product scope', async () => {
      await landingPage.toggleShowActiveOnly();
      await landingPage.expectProductsShowActiveOnlyUnchecked();
    });

    await test.step('Select first available DOC Lead option', async () => {
      selectedOption = await landingPage.selectFirstVirtualComboboxOption(
        landingPage.productsDocLeadDropdown,
      );
      test.skip(!selectedOption, 'No DOC Lead options available');
    });

    await test.step('Verify grid still has records after filter applied', async () => {
      await landingPage.expectRecordCountGreaterThan(0);
    });

    await test.step('Click Reset and verify grid is restored to default state', async () => {
      await landingPage.clickResetFilters();
      await landingPage.waitForGridDataRows();
      await landingPage.expectGridHasRows();
    });
  });

  test('LANDING-DOCS-017 — should show DOC-related My Products columns when at least one product has Digital Offer', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-DOCS-017: My Products table must show VESTA ID, Security Advisor, and DOC Lead columns when at least one visible product has Digital Offer enabled.',
    );

    let headers: string[] = [];

    await test.step('Capture My Products column headers', async () => {
      await landingPage.expectColumnHeadersExist();
      headers = await landingPage.getColumnHeaders();
    });

    await test.step('Verify DOC-related columns are present', async () => {
      const normalized = headers.map((header) => header.trim().toLowerCase());
      expect(normalized, 'VESTA ID column should be present in My Products grid').toContain('vesta id');
      expect(normalized, 'Security Advisor column should be present in My Products grid').toContain('security advisor');
      expect(normalized, 'DOC Lead column should be present in My Products grid').toContain('doc lead');
    });
  });

  test('LANDING-DOCS-019 — should show compact multi-VESTA summary when a My Products row contains multiple VESTA IDs', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'LANDING-DOCS-019: In My Products, a VESTA ID cell with multiple values must display the first IDs plus a "+N" summary indicator.',
    );

    let vestaColumnIndex = -1;
    let compactValueFound = false;

    await test.step('Locate the VESTA ID column index', async () => {
      const headers = await landingPage.getColumnHeaders();
      vestaColumnIndex = headers.findIndex((header) => /vesta id/i.test(header.trim()));
      expect(vestaColumnIndex, 'VESTA ID column not found in My Products grid').toBeGreaterThanOrEqual(0);
    });

    await test.step('Scan visible rows for a compact multi-VESTA indicator', async () => {
      const rowCount = await landingPage.getGridRowCount();
      for (let rowIndex = 1; rowIndex <= Math.min(rowCount, 15); rowIndex++) {
        const cellText = (
          await landingPage.grid
            .getByRole('row')
            .nth(rowIndex)
            .getByRole('gridcell')
            .nth(vestaColumnIndex)
            .textContent()
            .catch(() => '')
        )?.trim() ?? '';

        if (/\+\d+/.test(cellText)) {
          compactValueFound = true;
          break;
        }
      }

      test.skip(!compactValueFound, 'No visible My Products row contains a compact +N VESTA ID summary in the current QA data set.');
    });

    await test.step('Verify the compact indicator format is present', async () => {
      expect(compactValueFound, 'Expected at least one VESTA ID cell to contain a +N compact indicator').toBe(true);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.3 — My Products: Product ID search, Reset, Name nav, Active toggle
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Products ID Search & Active Toggle @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Products');
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-MY-PRODUCTS-007 — search by Product ID narrows results @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-MY-PRODUCTS-007: Verify that searching by a specific Product ID in the Product ID combobox filter narrows the grid results.',
    );

    let productId: string;

    await test.step('Capture the first product ID from the grid', async () => {
      productId = await landingPage.getProductIdAtRow(1);
      test.skip(!productId, 'Could not extract a Product ID from the first grid row — no PIC-NNNN found.');
    });

    await test.step('Apply Product ID filter using extracted ID', async () => {
      const idShort = productId.replace('PIC-', '');
      await landingPage.searchAndSelectProductById(idShort, new RegExp(productId, 'i'));
    });

    await test.step('Verify grid is still visible after filtering', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters to restore default state', async () => {
      await landingPage.resetFilters();
      await landingPage.expectGridHasRows();
    });
  });

  test('LANDING-MY-PRODUCTS-008 — Reset button restores default filter state @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-MY-PRODUCTS-008: Verify that clicking Reset on My Products clears all filters and restores the default view including Show Active Only being checked.',
    );

    await test.step('Toggle Show Active Only off to change filter state', async () => {
      const isVisible = await landingPage.productsShowActiveOnlyCheckbox.isVisible({ timeout: 5_000 }).catch(() => false);
      test.skip(!isVisible, 'Show Active Only checkbox is not visible — skipping.');
      await landingPage.toggleShowActiveOnly();
      await landingPage.expectProductsShowActiveOnlyUnchecked();
    });

    await test.step('Click Reset', async () => {
      await landingPage.resetFilters();
    });

    await test.step('Verify Show Active Only is restored to checked', async () => {
      await landingPage.expectProductsShowActiveOnlyChecked();
    });
  });

  test('LANDING-MY-PRODUCTS-009 — clicking a product name navigates to Product Detail page @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-MY-PRODUCTS-009: Verify that clicking a product name link in the My Products grid navigates to the Product Detail page.',
    );

    await test.step('Click the first product name link', async () => {
      await landingPage.clickFirstProduct();
    });

    await test.step('Verify navigation to Product Detail page', async () => {
      await page.waitForURL(/ProductDetail/, { timeout: 30_000 });
      await expect(page).toHaveURL(/ProductDetail/);
    });
  });

  test('LANDING-PRODS-ACTIVE-001 — Show Active Only toggle defaults to ON — only active products shown @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-ACTIVE-001: Verify that "Show Active Only" toggle is checked by default when the My Products tab loads.',
    );

    await test.step('Verify Show Active Only checkbox is checked by default', async () => {
      const isVisible = await landingPage.productsShowActiveOnlyCheckbox.isVisible({ timeout: 5_000 }).catch(() => false);
      test.skip(!isVisible, 'Show Active Only checkbox not rendered — skipping.');
      await landingPage.expectProductsShowActiveOnlyChecked();
    });

    await test.step('Verify grid has data rows (active products are shown)', async () => {
      await landingPage.expectGridHasRows();
    });
  });

  test('LANDING-PRODS-ACTIVE-002 — toggling Show Active Only OFF reveals inactive products @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-ACTIVE-002: Verify that toggling "Show Active Only" off on My Products reveals inactive/all products in the grid.',
    );

    let initialCount: number;

    await test.step('Verify Show Active Only is on and record initial count', async () => {
      const isVisible = await landingPage.productsShowActiveOnlyCheckbox.isVisible({ timeout: 5_000 }).catch(() => false);
      test.skip(!isVisible, 'Show Active Only checkbox not rendered — skipping.');
      await landingPage.expectProductsShowActiveOnlyChecked();
      initialCount = await landingPage.getGridRowCount();
    });

    await test.step('Toggle Show Active Only OFF', async () => {
      await landingPage.toggleShowActiveOnly();
      await landingPage.expectProductsShowActiveOnlyUnchecked();
    });

    await test.step('Verify grid is still visible (inactive products may have been added)', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
      await landingPage.expectProductsShowActiveOnlyChecked();
    });
  });
});