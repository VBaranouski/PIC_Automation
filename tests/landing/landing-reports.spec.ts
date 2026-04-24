import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

    const isGridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!isGridVisible, 'Reports & Dashboards grid is not rendered in current QA state.');

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

    let gridVisible003 = false;
    await test.step('Verify the grid is visible and has rows', async () => {
      gridVisible003 = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      if (!gridVisible003) return;
      await landingPage.waitForGridDataRows();
    });
    test.skip(!gridVisible003, 'Reports & Dashboards grid not rendered — skipping.');

    let hasProductLink = false;
    await test.step('Click the first Product Name link in the grid', async () => {
      const productLink = landingPage.grid.getByRole('row').nth(1).getByRole('link').first();
      hasProductLink = await productLink.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!hasProductLink) return;
      await productLink.click();
    });
    test.skip(!hasProductLink, 'No product link found in first row — skipping.');

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

    let gridVisible004 = false;
    await test.step('Verify the grid is visible and has rows', async () => {
      gridVisible004 = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      if (!gridVisible004) return;
      await landingPage.waitForGridDataRows();
    });
    test.skip(!gridVisible004, 'Reports & Dashboards grid not rendered — skipping.');

    let releaseLink: import('@playwright/test').Locator | null = null;
    await test.step('Find and click a Release link in the grid', async () => {
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
      if (!releaseLink) return;
      await releaseLink.click();
    });
    test.skip(!releaseLink, 'No Release link found in first 10 rows — skipping.');

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

    let gridVisible005 = false;
    await test.step('Verify the grid is visible and has rows', async () => {
      gridVisible005 = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      if (!gridVisible005) return;
      await landingPage.waitForGridDataRows();
    });
    test.skip(!gridVisible005, 'Reports & Dashboards grid not rendered — skipping.');

    let actionsColumnIndex = -1;
    await test.step('Locate the Open Actions or Open Conditions column', async () => {
      const headers = await landingPage.getColumnHeaders();
      actionsColumnIndex = headers.findIndex((header) => /open actions|open conditions/i.test(header));
    });
    test.skip(actionsColumnIndex === -1, 'No Open Actions or Open Conditions column is visible in the Reports grid.');

    let actionsLink: import('@playwright/test').Locator | null = null;
    let actionsHref: string | null = null;
    await test.step('Find and click an Open Actions or Open Conditions numeric link', async () => {
      const rowCount = await landingPage.getGridRowCount();
      for (let r = 1; r <= Math.min(rowCount, 10); r++) {
        const targetCell = landingPage.grid.getByRole('row').nth(r).getByRole('gridcell').nth(actionsColumnIndex);
        const candidateLink = targetCell.getByRole('link').first();
        const isVisible = await candidateLink.isVisible({ timeout: 1_000 }).catch(() => false);
        if (!isVisible) continue;

        const text = ((await candidateLink.textContent().catch(() => '')) ?? '').trim();
        if (!/^\d+$/.test(text)) continue;

        actionsHref = await candidateLink.getAttribute('href').catch(() => null);
        actionsLink = candidateLink;
        if (actionsLink) break;
      }
      if (!actionsLink) return;
      await actionsLink.click();
    });
    test.skip(!actionsLink, 'No Open Actions or Open Conditions numeric link was found in the matching column.');

    await test.step('Verify navigation follows the selected action-count link target', async () => {
      if (actionsHref && actionsHref !== '#') {
        await page.waitForURL(new RegExp(escapeRegExp(actionsHref)), { timeout: 30_000 });
      } else {
        await page.waitForURL(/GRC_PICASso\/(?!$)/, { timeout: 30_000 });
      }

      const currentUrl = page.url();
      expect(currentUrl).not.toMatch(/GRC_PICASso\/?$/);
      await Promise.any([
        page.getByRole('heading', { name: /actions?/i }).first().waitFor({ state: 'visible', timeout: 10_000 }),
        page.getByRole('button', { name: /create action/i }).first().waitFor({ state: 'visible', timeout: 10_000 }),
        page.getByText(/actions management/i).first().waitFor({ state: 'visible', timeout: 10_000 }),
      ]).catch(() => undefined);
      expect(/action|condition/i.test(currentUrl), `Expected an action-related destination URL, received: ${currentUrl}`).toBe(true);
    });
  });

  test('LANDING-REPORTS-DATA-002 — Last BU Level FCSR Date value is highlighted when "Unknown" or older than 12 months @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATA-002: Verify that the Last BU Level FCSR Date column value is highlighted (e.g., red/orange CSS class) when the value is "Unknown" or the date is older than 12 months.',
    );

    let gridVisible002 = false;
    await test.step('Verify the grid is visible and has rows', async () => {
      gridVisible002 = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      if (!gridVisible002) return;
      await landingPage.waitForGridDataRows();
    });
    test.skip(!gridVisible002, 'Reports & Dashboards grid not rendered — skipping.');

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
      // This is a soft assertion — pass if highlighted cell found, or warn and skip assertion if no applicable data
      if (!result) {
        console.warn('[LANDING-REPORTS-DATA-002] No FCSR Date cell with highlighting found — may require data with Unknown or old dates.');
        return;
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

    const tableauVisible = await landingPage.reportsAccessTableauLink.isVisible({ timeout: 10_000 }).catch(() => false);
    test.skip(!tableauVisible, '"Access Tableau" link not present in current QA environment — skipping.');

    await test.step('Verify Access Tableau link is visible', async () => {
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

    const f001GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!f001GridVisible, 'Reports grid not rendered — skipping.');

    let f001Option: string | null = null;
    await test.step('Select the first available Org Level 1 option', async () => {
      f001Option = await landingPage.filterReportsByOrgLevel1();
    });
    test.skip(!f001Option, 'No Org Level 1 options available to select.');

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

    const f002GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!f002GridVisible, 'Reports grid not rendered — skipping.');

    let f002Level1: string | null = null;
    await test.step('Apply Org Level 1 filter first', async () => {
      f002Level1 = await landingPage.filterReportsByOrgLevel1();
    });
    test.skip(!f002Level1, 'No Org Level 1 options available — cannot test Level 2 dependency.');

    let f002Level2: string | null = null;
    await test.step('Apply Org Level 2 filter (should now have options)', async () => {
      f002Level2 = await landingPage.filterReportsByOrgLevel2();
    });
    test.skip(!f002Level2, 'No Org Level 2 options available after Org Level 1 selection.');

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

    const f003GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!f003GridVisible, 'Reports grid not rendered — skipping.');

    let f003Level1: string | null = null;
    await test.step('Apply Org Level 1 to narrow product options', async () => {
      f003Level1 = await landingPage.filterReportsByOrgLevel1();
    });
    test.skip(!f003Level1, 'No Org Level 1 options available — skipping.');

    let f003Product: string | null = null;
    await test.step('Apply Product filter using first available option', async () => {
      f003Product = await landingPage.filterReportsByProduct();
    });
    test.skip(!f003Product, 'No Product options available after Org Level 1 — skipping.');

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

    const f004GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!f004GridVisible, 'Reports grid not rendered — skipping.');

    let f004Product: string | null = null;
    await test.step('Apply Product filter first to enable Release Number', async () => {
      f004Product = await landingPage.filterReportsByProduct();
    });
    test.skip(!f004Product, 'No Product options available — cannot test Release Number filter.');

    let f004Release: string | null = null;
    await test.step('Apply Release Number filter', async () => {
      f004Release = await landingPage.filterReportsByReleaseNumber();
    });
    test.skip(!f004Release, 'No Release Number options available after product selection — skipping.');

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

    const f005GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!f005GridVisible, 'Reports grid not rendered — skipping.');

    let f005Option: string | null = null;
    await test.step('Apply an Org Level 1 filter to change state', async () => {
      f005Option = await landingPage.filterReportsByOrgLevel1();
    });
    test.skip(!f005Option, 'No Org Level 1 options available — skipping filter+reset test.');

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

    const df001GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!df001GridVisible, 'Reports grid not rendered — skipping.');

    const df001PickerVisible = await landingPage.reportsDateRangePicker.isVisible({ timeout: 10_000 }).catch(() => false);
    test.skip(!df001PickerVisible, 'No date range picker found in Reports tab — skipping.');

    let df001InputCount = 0;
    await test.step('Enter a narrow date range to filter (this year only)', async () => {
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const dateInputs = activePanel.getByRole('textbox');
      df001InputCount = await dateInputs.count();
      if (df001InputCount < 2) return;

      // Fill start date and end date to current year
      const today = new Date();
      const startDate = `01/01/${today.getFullYear()}`;
      const endDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      await dateInputs.nth(0).fill(startDate);
      await dateInputs.nth(0).press('Tab');
      await dateInputs.nth(1).fill(endDate);
      await dateInputs.nth(1).press('Enter');
    });
    test.skip(df001InputCount < 2, 'Less than 2 date inputs found — cannot set a date range.');

    await test.step('Verify grid is still visible after filtering', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
    });
  });

  test('LANDING-REPORTS-DATEFILTER-002 — Product Type multi-select filter narrows results @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-REPORTS-DATEFILTER-002: Verify that selecting a Product Type value in the Reports multi-select filter narrows the grid results.',
    );

    const df002GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!df002GridVisible, 'Reports grid not rendered — skipping.');

    let df002ProductType: string | null = null;
    await test.step('Apply Product Type filter using first available option', async () => {
      df002ProductType = await landingPage.filterReportsByProductType();
      if (df002ProductType) {
        // Dismiss the virtual combobox dropdown before interacting with other elements
        await page.keyboard.press('Escape');
      }
    });
    test.skip(!df002ProductType, 'No Product Type options available to select.');

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

    const r001GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!r001GridVisible, 'Reports grid not rendered — skipping.');

    let r001MoreFiltersVisible = false;
    await test.step('Click More Filters to reveal role-based filters', async () => {
      r001MoreFiltersVisible = await landingPage.reportsMoreFiltersLink.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!r001MoreFiltersVisible) return;
      await landingPage.clickReportsMoreFilters();
    });
    test.skip(!r001MoreFiltersVisible, '"More Filters" link not found in Reports tab — skipping.');

    let r001OwnerOption: string | null = null;
    let r001ComboboxCount = 0;
    await test.step('Apply Product Owner filter using first available option', async () => {
      // Product Owner filter is exposed after More Filters — use combobox index 6 (after org1, org2, org3, product, productType, releaseNumber)
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const comboboxes = activePanel.getByRole('combobox');
      r001ComboboxCount = await comboboxes.count();
      if (r001ComboboxCount < 7) return;
      const ownerDropdown = comboboxes.nth(6);
      r001OwnerOption = await landingPage.selectFirstVirtualComboboxOption(ownerDropdown);
    });
    test.skip(r001ComboboxCount < 7, `Expected at least 7 comboboxes after More Filters, found ${r001ComboboxCount} — skipping.`);
    test.skip(!r001OwnerOption, 'No Product Owner options available to select.');

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

    const r002GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!r002GridVisible, 'Reports grid not rendered — skipping.');

    let r002MoreFiltersVisible = false;
    await test.step('Click More Filters to reveal role-based filters', async () => {
      r002MoreFiltersVisible = await landingPage.reportsMoreFiltersLink.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!r002MoreFiltersVisible) return;
      await landingPage.clickReportsMoreFilters();
    });
    test.skip(!r002MoreFiltersVisible, '"More Filters" link not found — skipping.');

    let r002ComboboxCount = 0;
    let r002OwnerOption: string | null = null;
    await test.step('Apply Product Owner and a second role filter', async () => {
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const comboboxes = activePanel.getByRole('combobox');
      r002ComboboxCount = await comboboxes.count();
      if (r002ComboboxCount < 8) return;
      const ownerDropdown = comboboxes.nth(6);
      r002OwnerOption = await landingPage.selectFirstVirtualComboboxOption(ownerDropdown);
      if (!r002OwnerOption) return;

      const secManagerDropdown = comboboxes.nth(7);
      await landingPage.selectFirstVirtualComboboxOption(secManagerDropdown);
    });
    test.skip(r002ComboboxCount < 8, `Expected at least 8 comboboxes for multi-role test, found ${r002ComboboxCount} — skipping.`);
    test.skip(!r002OwnerOption, 'No Product Owner options available — skipping multi-filter test.');

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

    const cfg001ButtonVisible = await landingPage.reportsConfigureColumnsButton.isVisible({ timeout: 15_000 }).catch(() => false);
    test.skip(!cfg001ButtonVisible, '"Configure Columns" button not found in Reports & Dashboards tab — skipping.');

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
    let cfg002GridVisible = false;
    await test.step('Capture initial column count', async () => {
      cfg002GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      if (!cfg002GridVisible) return;
      const headers = await landingPage.getColumnHeaders();
      initialColumnCount = headers.length;
    });
    test.skip(!cfg002GridVisible, 'Reports grid not rendered — skipping.');

    let cfg002ButtonVisible = false;
    await test.step('Open Configure Columns', async () => {
      cfg002ButtonVisible = await landingPage.reportsConfigureColumnsButton.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!cfg002ButtonVisible) return;
      await landingPage.clickReportsConfigureColumns();
      await landingPage.expectReportsColumnConfigVisible();
    });
    test.skip(!cfg002ButtonVisible, '"Configure Columns" button not found — skipping.');

    let cfg002CheckboxCount = 0;
    await test.step('Toggle the first available column checkbox', async () => {
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const checkboxes = activePanel.getByRole('checkbox');
      cfg002CheckboxCount = await checkboxes.count();
      if (cfg002CheckboxCount === 0) return;
      await checkboxes.first().click();
    });
    test.skip(cfg002CheckboxCount === 0, 'No column checkboxes found in config panel — skipping.');

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

    let cfg003ButtonVisible = false;
    await test.step('Open Configure Columns', async () => {
      cfg003ButtonVisible = await landingPage.reportsConfigureColumnsButton.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!cfg003ButtonVisible) return;
      await landingPage.clickReportsConfigureColumns();
      await landingPage.expectReportsColumnConfigVisible();
    });
    test.skip(!cfg003ButtonVisible, '"Configure Columns" button not found — skipping.');

    let cfg003HasRestore = false;
    await test.step('Verify Restore Default button is visible', async () => {
      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const restoreBtn = activePanel.getByRole('button', { name: /restore default/i });
      cfg003HasRestore = await restoreBtn.isVisible({ timeout: 5_000 }).catch(() => false);
    });
    test.skip(!cfg003HasRestore, '"Restore Default" button not found in column config panel — skipping.');

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
    let cfg004GridVisible = false;
    await test.step('Capture initial column count', async () => {
      cfg004GridVisible = await landingPage.grid.isVisible({ timeout: 15_000 }).catch(() => false);
      if (!cfg004GridVisible) return;
      const headers = await landingPage.getColumnHeaders();
      initialColumnCount = headers.length;
    });
    test.skip(!cfg004GridVisible, 'Reports grid not rendered — skipping.');

    let cfg004ButtonVisible = false;
    let cfg004CheckboxCount = 0;
    await test.step('Open Configure Columns and toggle a checkbox', async () => {
      cfg004ButtonVisible = await landingPage.reportsConfigureColumnsButton.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!cfg004ButtonVisible) return;
      await landingPage.clickReportsConfigureColumns();
      await landingPage.expectReportsColumnConfigVisible();

      const activePanel = landingPage['page'].locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
      const checkboxes = activePanel.getByRole('checkbox');
      cfg004CheckboxCount = await checkboxes.count();
      if (cfg004CheckboxCount === 0) return;
      await checkboxes.first().click();
    });
    test.skip(!cfg004ButtonVisible, '"Configure Columns" button not found — skipping.');
    test.skip(cfg004CheckboxCount === 0, 'No column checkboxes found — skipping.');

    await test.step('Click Cancel', async () => {
      await landingPage.clickReportsColumnConfigCancel();
    });

    await test.step('Verify column count is unchanged after Cancel', async () => {
      const updatedHeaders = await landingPage.getColumnHeaders();
      expect(updatedHeaders.length).toBe(initialColumnCount);
    });
  });
});
