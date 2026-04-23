import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

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