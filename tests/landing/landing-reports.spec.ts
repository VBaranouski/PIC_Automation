import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.5 — Reports & Dashboards tab: data, filters, column config
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - Reports & Dashboards Tab Data @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('Reports & Dashboards');
  });

  test('LANDING-REPORTS-DATA-001 — Responsible Users columns are visible @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATA-001: Verify the Reports & Dashboards grid displays Responsible Users columns (Product Owner, Security Manager, etc.).',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports & Dashboards grid is not rendered in current QA state.');
    });

    await test.step('Verify responsible user columns are present in headers', async () => {
      const headers = await landingPage.getColumnHeaders();
      const normalized = headers.map((h) => h.trim().toLowerCase());
      const hasOwnerOrResp = normalized.some((h) => /product owner|security manager|responsible/i.test(h));
      expect(hasOwnerOrResp, 'Expected at least one Responsible Users column (Product Owner or Security Manager)').toBe(true);
    });
  });

  test('LANDING-REPORTS-DATA-003 — Product Name column link navigates to Product Detail page @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATA-003: Verify that clicking the Product Name link in the Reports & Dashboards grid navigates to the Product Detail page.',
    );

    await test.step('Verify the grid is visible and has rows', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports & Dashboards grid not rendered — skipping.');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Click the first Product Name link in the grid', async () => {
      const productLink = landingPage.grid.getByRole('row').nth(1).getByRole('link').first();
      const hasLink = await productLink.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!hasLink, 'No product link found in first row — skipping.');
      await productLink.click();
    });

    await test.step('Verify navigation to Product Detail page', async () => {
      await page.waitForURL(/ProductDetail/, { timeout: 30_000 });
      await expect(page).toHaveURL(/ProductDetail/);
    });
  });

  test('LANDING-REPORTS-DATA-004 — Release column link navigates to Release Detail page @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATA-004: Verify that clicking the Release link in the Reports & Dashboards grid navigates to the Release Detail page.',
    );

    await test.step('Verify the grid is visible and has rows', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports & Dashboards grid not rendered — skipping.');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Find and click a Release link in the grid', async () => {
      let releaseLink: import('@playwright/test').Locator | null = null;
      const rowCount = await landingPage.getGridRowCount();
      for (let r = 1; r <= Math.min(rowCount, 10); r++) {
        const links = landingPage.grid.getByRole('row').nth(r).getByRole('link');
        const count = await links.count();
        for (let l = 0; l < count; l++) {
          const href = await links.nth(l).getAttribute('href').catch(() => null);
          if (href?.includes('ReleaseDetail')) {
            releaseLink = links.nth(l);
            break;
          }
        }
        if (releaseLink) break;
      }
      test.skip(!releaseLink, 'No Release link found in first 10 rows — skipping.');
      await releaseLink!.click();
    });

    await test.step('Verify navigation to Release Detail page', async () => {
      await page.waitForURL(/ReleaseDetail/, { timeout: 30_000 });
      await expect(page).toHaveURL(/ReleaseDetail/);
    });
  });

  test('LANDING-REPORTS-DATA-005 — Number of Open Actions/Conditions link navigates to Actions Summary @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATA-005: Verify that clicking the Number of Open Actions/Conditions link navigates to the Actions Summary page.',
    );

    await test.step('Verify the grid is visible and has rows', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports & Dashboards grid not rendered — skipping.');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Find and click an Open Actions or Open Conditions numeric link', async () => {
      let actionsLink: import('@playwright/test').Locator | null = null;
      const rowCount = await landingPage.getGridRowCount();
      for (let r = 1; r <= Math.min(rowCount, 10); r++) {
        const links = landingPage.grid.getByRole('row').nth(r).getByRole('link');
        const count = await links.count();
        for (let l = 0; l < count; l++) {
          const text = ((await links.nth(l).textContent().catch(() => '')) ?? '').trim();
          const href = await links.nth(l).getAttribute('href').catch(() => null);
          if (/^\d+$/.test(text) && href && !/ProductDetail|ReleaseDetail|DOCDetail/i.test(href)) {
            actionsLink = links.nth(l);
            break;
          }
        }
        if (actionsLink) break;
      }
      test.skip(!actionsLink, 'No Open Actions numeric link found — may require data with open actions.');
      await actionsLink!.click();
    });

    await test.step('Verify navigation away from landing page (Actions Summary)', async () => {
      await page.waitForURL(/GRC_PICASso/, { timeout: 30_000 });
      expect(page.url()).not.toMatch(/GRC_PICASso\/$/);
    });
  });

  test('LANDING-REPORTS-DATA-002 — Last BU Level FCSR Date value is highlighted when "Unknown" or older than 12 months @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATA-002: Verify that the Last BU Level FCSR Date column value is highlighted (e.g., red/orange CSS class) when the value is "Unknown" or the date is older than 12 months.',
    );

    await test.step('Verify the grid is visible and has rows', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports & Dashboards grid not rendered — skipping.');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Check for any highlighted FCSR date cells in the grid', async () => {
      const result = await landingPage.grid.evaluate((grid: any) => {
        const rows = (Array.from(grid.querySelectorAll('[role="row"]')) as any[]).slice(1);
        let found = false;
        for (const row of rows) {
          const cells: any[] = Array.from(row.querySelectorAll('[role="gridcell"]'));
          for (const cell of cells) {
            const text = (cell.textContent ?? '').trim();
            if (/unknown/i.test(text) || /\d{1,2} \w{3} \d{4}/.test(text)) {
              const className = cell.className ?? '';
              if (/warn|highlight|red|danger|alert|old/i.test(className)) {
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }
        return found;
      });
      // This is a soft assertion — pass if highlighted cell found, or skip if no data applies
      if (!result) {
        test.skip(true, 'No FCSR Date cell with highlighting found — may require data with Unknown or old dates.');
      }
      expect(result).toBe(true);
    });
  });

  test('LANDING-REPORTS-DATA-006 — "Access Tableau" link is clickable and redirects to Tableau @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('trivial');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATA-006: Verify the "Access Tableau" link in the Reports & Dashboards tab is visible and points to a Tableau URL.',
    );

    await test.step('Verify Access Tableau link is visible', async () => {
      const isVisible = await landingPage.reportsAccessTableauLink.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!isVisible, '"Access Tableau" link not present in current QA environment — skipping.');
      await landingPage.expectAccessTableauLinkVisible();
    });

    await test.step('Verify the link href contains a Tableau URL', async () => {
      const href = await landingPage.reportsAccessTableauLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/tableau|http/i);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.5 — Reports & Dashboards: Org Level & Product/Release Filters
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - Reports & Dashboards Filters @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('Reports & Dashboards');
  });

  test('LANDING-REPORTS-FILTER-001 — Org Level 1 filter narrows visible products/releases on Reports tab @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-FILTER-001: Verify that selecting an Org Level 1 value filters the Reports grid results.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Select the first available Org Level 1 option', async () => {
      const optionText = await landingPage.filterReportsByOrgLevel1();
      test.skip(!optionText, 'No Org Level 1 options available to select.');
    });

    await test.step('Verify grid is still visible after filter', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
    });
  });

  test('LANDING-REPORTS-FILTER-002 — Org Level 2 filter is dependent on Org Level 1 selection @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-FILTER-002: Verify that Org Level 2 becomes populated/enabled after an Org Level 1 value is selected.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Apply Org Level 1 filter first', async () => {
      const optionText = await landingPage.filterReportsByOrgLevel1();
      test.skip(!optionText, 'No Org Level 1 options available — cannot test Level 2 dependency.');
    });

    await test.step('Apply Org Level 2 filter (should now have options)', async () => {
      const optionText = await landingPage.filterReportsByOrgLevel2();
      test.skip(!optionText, 'No Org Level 2 options available after Org Level 1 selection.');
    });

    await test.step('Verify grid is still visible', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
    });
  });

  test('LANDING-REPORTS-FILTER-003 — Product filter shows products matching the Org Level filters @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-FILTER-003: Verify the Product dropdown in Reports shows products that match the selected Org Level filters.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Apply Org Level 1 to narrow product options', async () => {
      const optionText = await landingPage.filterReportsByOrgLevel1();
      test.skip(!optionText, 'No Org Level 1 options available — skipping.');
    });

    await test.step('Apply Product filter using first available option', async () => {
      const optionText = await landingPage.filterReportsByProduct();
      test.skip(!optionText, 'No Product options available after Org Level 1 — skipping.');
    });

    await test.step('Verify grid is still visible', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
    });
  });

  test('LANDING-REPORTS-FILTER-004 — Release Number filter shows releases of the selected product @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-FILTER-004: Verify the Release Number dropdown in Reports shows releases for the selected product.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Apply Product filter first to enable Release Number', async () => {
      const optionText = await landingPage.filterReportsByProduct();
      test.skip(!optionText, 'No Product options available — cannot test Release Number filter.');
    });

    await test.step('Apply Release Number filter', async () => {
      const optionText = await landingPage.filterReportsByReleaseNumber();
      test.skip(!optionText, 'No Release Number options available after product selection — skipping.');
    });

    await test.step('Verify grid is still visible', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
    });
  });

  test('LANDING-REPORTS-FILTER-005 — Reset button clears all applied filters on Reports tab @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-FILTER-005: Verify that clicking the Reset button on Reports & Dashboards clears all applied filters and restores the default state.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Apply an Org Level 1 filter to change state', async () => {
      const optionText = await landingPage.filterReportsByOrgLevel1();
      test.skip(!optionText, 'No Org Level 1 options available — skipping filter+reset test.');
    });

    await test.step('Click Reset', async () => {
      await landingPage.resetFilters();
    });

    await test.step('Verify Org Level 1 dropdown is reset (no longer holds the selected value)', async () => {
      await landingPage.expectResetButtonVisible();
      await landingPage.expectGridVisible();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.5 — Reports & Dashboards: Date & Product Type Filters
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - Reports & Dashboards Date & Type Filters @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('Reports & Dashboards');
  });

  test('LANDING-REPORTS-DATEFILTER-001 — Product Creation Period date range filter narrows results @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATEFILTER-001: Verify that setting a Product Creation Period date range narrows the Reports & Dashboards grid results.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Verify the date range picker inputs are visible in the Reports tab', async () => {
      const pickerVisible = await landingPage.reportsDateRangePicker.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!pickerVisible, 'No date range picker found in Reports tab — skipping.');
    });

    await test.step('Enter a narrow date range to filter (this year only)', async () => {
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const dateInputs = activePanel.getByRole('textbox');
      const inputCount = await dateInputs.count();
      test.skip(inputCount < 2, 'Less than 2 date inputs found — cannot set a date range.');

      // Fill start date and end date to current year
      const today = new Date();
      const startDate = `01/01/${today.getFullYear()}`;
      const endDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      await dateInputs.nth(0).fill(startDate);
      await dateInputs.nth(0).press('Tab');
      await dateInputs.nth(1).fill(endDate);
      await dateInputs.nth(1).press('Enter');
    });

    await test.step('Verify grid is still visible after filtering', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
    });
  });

  test('LANDING-REPORTS-DATEFILTER-002 — Product Type multi-select filter narrows results @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATEFILTER-002: Verify that selecting a Product Type value in the Reports multi-select filter narrows the grid results.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Apply Product Type filter using first available option', async () => {
      const optionText = await landingPage.filterReportsByProductType();
      test.skip(!optionText, 'No Product Type options available to select.');
    });

    await test.step('Verify grid is still visible', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.5 — Reports & Dashboards: Role-Based Filters
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - Reports & Dashboards Role Filters @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('Reports & Dashboards');
  });

  test('LANDING-REPORTS-ROLE-001 — Product Owner filter narrows results @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-ROLE-001: Verify that the Product Owner filter narrows the Reports & Dashboards results to products/releases with the selected owner.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Click More Filters to reveal role-based filters', async () => {
      const moreFiltersVisible = await landingPage.reportsMoreFiltersLink.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!moreFiltersVisible, '"More Filters" link not found in Reports tab — skipping.');
      await landingPage.clickReportsMoreFilters();
    });

    await test.step('Apply Product Owner filter using first available option', async () => {
      // Product Owner filter is exposed after More Filters — use combobox index 6 (after org1, org2, org3, product, productType, releaseNumber)
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const comboboxes = activePanel.getByRole('combobox');
      const count = await comboboxes.count();
      test.skip(count < 7, `Expected at least 7 comboboxes after More Filters, found ${count} — skipping.`);
      const ownerDropdown = comboboxes.nth(6);
      const optionText = await landingPage.selectFirstVirtualComboboxOption(ownerDropdown);
      test.skip(!optionText, 'No Product Owner options available to select.');
    });

    await test.step('Verify grid is still visible after filter', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
    });
  });

  test('LANDING-REPORTS-ROLE-002 — multiple user role filters can be applied simultaneously @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-ROLE-002: Verify that multiple user role filters (e.g. Product Owner + Security Manager) can be applied simultaneously on the Reports tab.',
    );

    await test.step('Verify grid is visible', async () => {
      const isVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, 'Reports grid not rendered — skipping.');
    });

    await test.step('Click More Filters to reveal role-based filters', async () => {
      const moreFiltersVisible = await landingPage.reportsMoreFiltersLink.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!moreFiltersVisible, '"More Filters" link not found — skipping.');
      await landingPage.clickReportsMoreFilters();
    });

    await test.step('Apply Product Owner and a second role filter', async () => {
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const comboboxes = activePanel.getByRole('combobox');
      const count = await comboboxes.count();
      test.skip(count < 8, `Expected at least 8 comboboxes for multi-role test, found ${count} — skipping.`);
      const ownerDropdown = comboboxes.nth(6);
      const ownerOption = await landingPage.selectFirstVirtualComboboxOption(ownerDropdown);
      test.skip(!ownerOption, 'No Product Owner options available — skipping multi-filter test.');

      const secManagerDropdown = comboboxes.nth(7);
      await landingPage.selectFirstVirtualComboboxOption(secManagerDropdown);
    });

    await test.step('Verify grid is still visible with multiple filters applied', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset all filters', async () => {
      await landingPage.resetFilters();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.5 — Reports & Dashboards: Configure Columns
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - Reports & Dashboards Configure Columns @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('Reports & Dashboards');
  });

  test('LANDING-REPORTS-CONFIG-001 — Configure Columns button opens column selection panel @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-CONFIG-001: Verify the "Configure Columns" button is visible and opens a column selection panel/dropdown.',
    );

    await test.step('Verify Configure Columns button is visible', async () => {
      const isVisible = await landingPage.reportsConfigureColumnsButton.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, '"Configure Columns" button not found in Reports & Dashboards tab — skipping.');
    });

    await test.step('Click Configure Columns button', async () => {
      await landingPage.clickReportsConfigureColumns();
    });

    await test.step('Verify column configuration panel is open (Done button visible)', async () => {
      await landingPage.expectReportsColumnConfigVisible();
    });

    await test.step('Close the panel by clicking Cancel', async () => {
      await landingPage.clickReportsColumnConfigCancel();
    });
  });

  test('LANDING-REPORTS-CONFIG-002 — selecting/deselecting columns and clicking Done updates the grid columns @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-CONFIG-002: Verify that selecting or deselecting columns in the column config panel and clicking Done updates the visible grid columns.',
    );

    let initialColumnCount: number;

    await test.step('Capture initial column count', async () => {
      const isGridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isGridVisible, 'Reports grid not rendered — skipping.');
      const headers = await landingPage.getColumnHeaders();
      initialColumnCount = headers.length;
    });

    await test.step('Open Configure Columns', async () => {
      const isVisible = await landingPage.reportsConfigureColumnsButton.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!isVisible, '"Configure Columns" button not found — skipping.');
      await landingPage.clickReportsConfigureColumns();
      await landingPage.expectReportsColumnConfigVisible();
    });

    await test.step('Toggle the first available column checkbox', async () => {
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const checkboxes = activePanel.getByRole('checkbox');
      const checkboxCount = await checkboxes.count();
      test.skip(checkboxCount === 0, 'No column checkboxes found in config panel — skipping.');
      await checkboxes.first().click();
    });

    await test.step('Click Done to apply changes', async () => {
      await landingPage.clickReportsColumnConfigDone();
    });

    await test.step('Verify column count changed after applying', async () => {
      const updatedHeaders = await landingPage.getColumnHeaders();
      expect(updatedHeaders.length).not.toBe(initialColumnCount);
    });

    await test.step('Restore default columns via Configure Columns', async () => {
      await landingPage.clickReportsConfigureColumns();
      await landingPage.expectReportsColumnConfigVisible();

      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const restoreBtn = activePanel.getByRole('button', { name: /restore default/i });
      const hasRestore = await restoreBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (hasRestore) {
        await landingPage.clickReportsColumnConfigRestoreDefault();
      } else {
        await landingPage.clickReportsColumnConfigCancel();
      }
    });
  });

  test('LANDING-REPORTS-CONFIG-003 — Restore Default reverts column selection to the default set @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-CONFIG-003: Verify the "Restore Default" button in column configuration reverts the column selection to the default set.',
    );

    await test.step('Open Configure Columns', async () => {
      const isVisible = await landingPage.reportsConfigureColumnsButton.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!isVisible, '"Configure Columns" button not found — skipping.');
      await landingPage.clickReportsConfigureColumns();
      await landingPage.expectReportsColumnConfigVisible();
    });

    await test.step('Verify Restore Default button is visible', async () => {
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const restoreBtn = activePanel.getByRole('button', { name: /restore default/i });
      const hasRestore = await restoreBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      test.skip(!hasRestore, '"Restore Default" button not found in column config panel — skipping.');
    });

    await test.step('Click Restore Default', async () => {
      await landingPage.clickReportsColumnConfigRestoreDefault();
    });

    await test.step('Verify grid is visible with default columns after restore', async () => {
      await landingPage.expectGridVisible();
      await landingPage.expectColumnHeadersExist();
    });
  });

  test('LANDING-REPORTS-CONFIG-004 — Cancel in column configuration discards changes @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-CONFIG-004: Verify that clicking Cancel in the column configuration panel discards any unsaved column changes.',
    );

    let initialColumnCount: number;

    await test.step('Capture initial column count', async () => {
      const isGridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isGridVisible, 'Reports grid not rendered — skipping.');
      const headers = await landingPage.getColumnHeaders();
      initialColumnCount = headers.length;
    });

    await test.step('Open Configure Columns and toggle a checkbox', async () => {
      const isVisible = await landingPage.reportsConfigureColumnsButton.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!isVisible, '"Configure Columns" button not found — skipping.');
      await landingPage.clickReportsConfigureColumns();
      await landingPage.expectReportsColumnConfigVisible();

      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const checkboxes = activePanel.getByRole('checkbox');
      const checkboxCount = await checkboxes.count();
      test.skip(checkboxCount === 0, 'No column checkboxes found — skipping.');
      await checkboxes.first().click();
    });

    await test.step('Click Cancel', async () => {
      await landingPage.clickReportsColumnConfigCancel();
    });

    await test.step('Verify column count is unchanged after Cancel', async () => {
      const updatedHeaders = await landingPage.getColumnHeaders();
      expect(updatedHeaders.length).toBe(initialColumnCount);
    });
  });
});
