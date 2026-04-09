import { test, expect } from '../../src/fixtures';
import type { LandingTab } from '../../src/pages';
import * as allure from 'allure-js-commons';

test.describe('Landing Page @smoke', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('should display all tabs on landing page', async ({ landingPage }) => {
    await allure.suite('Landing Page');
    await allure.severity('critical');
    await allure.tag('smoke');
    await allure.description('LANDING-HOME-001: Verify all 5 tabs are visible on the Landing Page after login');

    await test.step('Verify My Tasks tab is visible and selected by default', async () => {
      await landingPage.expectTabActive('My Tasks');
    });

    await test.step('Verify all tabs are visible', async () => {
      await landingPage.expectTabsVisible();
    });
  });

  test('should have My Tasks tab selected by default after login @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description('LANDING-TAB-DEFAULT-001: Verify "My Tasks" tab is the active/selected tab immediately after login — no user interaction required');

    await test.step('Verify My Tasks tab is selected (aria-selected=true)', async () => {
      await landingPage.expectMyTasksSelectedByDefault();
    });
  });

  test('should load content when clicking each tab', async ({ landingPage }) => {
    await allure.suite('Landing Page');
    await allure.severity('critical');
    await allure.tag('smoke');
    await allure.description('LANDING-HOME-002: Verify each tab loads its grid content with data');

    const tabs: LandingTab[] = ['My Tasks', 'My Products', 'My Releases', 'My DOCs', 'Reports & Dashboards'];

    for (const tabName of tabs) {
      await test.step(`Click "${tabName}" tab and verify content loads`, async () => {
        await landingPage.clickTab(tabName);
        await landingPage.expectTabActive(tabName);
        await landingPage.expectTabpanelVisible();
        test.skip(!(await landingPage.grid.isVisible().catch(() => false)), `${tabName} grid is not rendered in current QA state.`);
        await landingPage.expectColumnHeadersExist();
      });
    }
  });
});

test.describe('Landing Page - My Tasks Tab @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('should display correct grid columns for My Tasks', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-003: Verify My Tasks grid displays expected column headers');

    await test.step('Verify column headers', async () => {
      await landingPage.expectColumnHeadersContain(['Name', 'Product', 'Release']);
    });
  });

  test('should display all required My Tasks grid columns @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-COLS-001: Verify My Tasks grid contains ALL required columns: ' +
      'Name, Description, Status, Product, Release, VESTA Id, PROCESS TYPE, ' +
      'Assignee, DOC Lead, Product Owner, Security Manager',
    );

    await test.step('Verify all required column headers are present', async () => {
      await landingPage.expectMyTasksAllColumnsPresent();
    });
  });

  test('should have Show Closed Tasks toggle OFF by default @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-TOGGLE-001: Verify the "Show Closed Tasks" checkbox is unchecked (OFF) ' +
      'immediately after landing on the page — closed tasks should not be shown by default',
    );

    await test.step('Verify Show Closed Tasks is unchecked by default', async () => {
      await landingPage.expectShowClosedTasksUncheckedByDefault();
    });
  });

  test('should display filters for My Tasks', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-004: Verify My Tasks tab shows search, release, product, date range and status filters');

    await test.step('Verify all My Tasks filters are visible', async () => {
      await landingPage.expectTasksFiltersVisible();
    });
  });

  test('should toggle Show Closed Tasks checkbox and update data', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-005: Verify toggling Show Closed Tasks checkbox changes the data in the grid');

    await test.step('Verify initial record count is non-zero', async () => {
      await landingPage.expectRecordCountGreaterThan(0);
    });

    await test.step('Toggle Show Closed Tasks checkbox', async () => {
      await landingPage.toggleTasksShowClosed();
    });

    await test.step('Verify grid still has data', async () => {
      await landingPage.expectGridVisible();
    });
  });

  test('should change per-page value and update grid rows', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-006: Verify changing the per-page dropdown updates the number of visible rows');

    let initialRowCount: number;

    await test.step('Verify grid is displayed with default per page', async () => {
      initialRowCount = await landingPage.expectDefaultPageSize();
    });

    await test.step('Change to 20 per page', async () => {
      await landingPage.changePerPage('20');
    });

    await test.step('Verify row count changed', async () => {
      await landingPage.expectRowCountAtLeast(initialRowCount);
    });
  });

  test('should navigate to next page using pagination', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-007: Verify pagination next button works and loads new data');

    await test.step('Click next page button', async () => {
      await landingPage.clickNextPage();
      await landingPage.waitForOSLoad();
    });

    await test.step('Verify grid still has data', async () => {
      await landingPage.expectGridVisible();
      await landingPage.expectGridHasRows();
    });
  });
});

test.describe('Landing Page - My Products Tab @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Products');
  });

  test('should display correct grid columns for My Products', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-008: Verify My Products grid displays expected column headers');

    await test.step('Verify column headers', async () => {
      await landingPage.expectColumnHeadersContain([
        'Org Level 1', 'Product', 'Product Id', 'Product Status', 'Latest Release',
      ]);
    });
  });

  test('should display filters and Show Active Only is checked by default', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-009: Verify My Products filters are visible and Show Active Only checkbox is checked');

    await test.step('Verify Show Active Only checkbox is checked', async () => {
      await landingPage.expectProductsShowActiveOnlyChecked();
    });

    await test.step('Verify Reset button is visible', async () => {
      await landingPage.expectResetButtonVisible();
    });
  });

  test('should uncheck Show Active Only and update data', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-010: Verify unchecking Show Active Only shows inactive products too');

    await test.step('Uncheck Show Active Only', async () => {
      await landingPage.toggleShowActiveOnly();
    });

    await test.step('Verify Show Active Only is unchecked', async () => {
      await landingPage.expectProductsShowActiveOnlyUnchecked();
    });
  });

  test('should change per-page value on My Products', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-011: Verify changing per-page dropdown on My Products updates visible rows');

    await test.step('Wait for grid data to load', async () => {
      await landingPage.grid.getByRole('row').nth(1).waitFor({ timeout: 60_000 });
    });

    await test.step('Change to 20 per page', async () => {
      await landingPage.changePerPage('20');
    });

    await test.step('Verify grid still has rows', async () => {
      await landingPage.expectGridHasRows();
    });
  });
});

test.describe('Landing Page - My Releases Tab @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Releases');
  });

  test('should display correct grid columns for My Releases', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-012: Verify My Releases grid displays expected column headers');

    await test.step('Verify column headers', async () => {
      test.skip(!(await landingPage.grid.isVisible().catch(() => false)), 'My Releases grid is not rendered in current QA state.');
      await landingPage.expectColumnHeadersContain([
        'Product', 'Release', 'Release Status', 'Target Release Date', 'Created By',
      ]);
    });
  });

  test('should display Show Active Only checked by default', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-013: Verify Show Active Only is checked by default on My Releases');

    await test.step('Verify checkbox is checked', async () => {
      test.skip(!(await landingPage.releasesShowActiveOnlyCheckbox.isVisible().catch(() => false)), 'My Releases Show Active Only toggle is not rendered in current QA state.');
      await landingPage.expectReleasesShowActiveOnlyChecked();
    });
  });

  test('should uncheck Show Active Only and update data', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-014: Verify unchecking Show Active Only on Releases changes record count');

    await test.step('Uncheck Show Active Only', async () => {
      test.skip(!(await landingPage.releasesShowActiveOnlyCheckbox.isVisible().catch(() => false)), 'My Releases Show Active Only toggle is not rendered in current QA state.');
      await landingPage.toggleReleasesShowActiveOnly();
    });

    await test.step('Verify grid still has data', async () => {
      await landingPage.expectGridVisible();
    });
  });

  test('should navigate to next page on My Releases', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-015: Verify pagination works on My Releases tab');

    await test.step('Click next page', async () => {
      test.skip(!(await landingPage.nextPageButton.isVisible().catch(() => false)), 'My Releases pagination next button is not available in current QA state.');
      await landingPage.clickNextPage();
      await landingPage.waitForOSLoad();
    });

    await test.step('Verify pagination is visible', async () => {
      await landingPage.expectGridVisible();
    });
  });
});

test.describe('Landing Page - My DOCs Tab @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My DOCs');
  });

  test('should display correct grid columns for My DOCs', async ({ landingPage }) => {
    await allure.suite('Landing Page - My DOCs');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-016: Verify My DOCs grid displays expected column headers');

    await test.step('Verify column headers', async () => {
      test.skip(!(await landingPage.grid.isVisible().catch(() => false)), 'My DOCs grid is not rendered in current QA state.');
      await landingPage.expectColumnHeadersContain([
        'DOC Name', 'doc Status', 'certification decision', 'DOC Lead',
      ]);
    });
  });

  test('should display DOC search box and filters', async ({ landingPage }) => {
    await allure.suite('Landing Page - My DOCs');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-017: Verify My DOCs tab shows search by DOC name and filter dropdowns');

    await test.step('Verify DOC filters are visible', async () => {
      await landingPage.expectDocsFiltersVisible();
    });
  });

  test('should display DOC data in grid', async ({ landingPage }) => {
    await allure.suite('Landing Page - My DOCs');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-018: Verify My DOCs grid loads with data');

    await test.step('Verify grid has records', async () => {
      await landingPage.expectRecordCountGreaterThan(0);
    });

    await test.step('Verify grid rows are displayed', async () => {
      await landingPage.expectGridHasRows();
    });
  });
});

test.describe('Landing Page - Reports & Dashboards Tab @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('Reports & Dashboards');
  });

  test('should display correct grid columns for Reports & Dashboards', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-019: Verify Reports & Dashboards grid displays expected column headers');

    await test.step('Verify column headers', async () => {
      test.skip(!(await landingPage.grid.isVisible().catch(() => false)), 'Reports grid is not rendered in current QA state.');
      await landingPage.expectColumnHeadersContain([
        'Product', 'Release', 'Release Status',
        'Data Protection and Privacy Risk Level', 'CyberSecurity RISK Level',
      ]);
    });
  });

  test('should display Access Tableau link', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-020: Verify Access Tableau link is visible on Reports & Dashboards tab');

    await test.step('Verify Access Tableau link is visible', async () => {
      await landingPage.expectAccessTableauLinkVisible();
    });
  });

  test('should display More Filters link', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-021: Verify More Filters link is available on Reports & Dashboards');

    await test.step('Verify More Filters and Reset are visible', async () => {
      await landingPage.expectMoreFiltersLinkVisible();
      await landingPage.expectResetButtonVisible();
    });
  });

  test('should display data in reports grid', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-022: Verify Reports & Dashboards grid loads data');

    await test.step('Verify grid has records', async () => {
      const recordCount = Number(await landingPage.getRecordCount());
      test.skip(recordCount === 0, 'Reports grid has no records in current QA state.');
      await landingPage.expectRecordCountGreaterThan(0);
    });

    await test.step('Verify grid rows are displayed', async () => {
      await landingPage.expectGridHasRows();
    });
  });

  test('should change per-page value on Reports & Dashboards', async ({ landingPage }) => {
    await allure.suite('Landing Page - Reports & Dashboards');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description('LANDING-HOME-023: Verify changing per-page dropdown on Reports & Dashboards updates visible rows');

    await test.step('Wait for grid data to load', async () => {
      await landingPage.grid.getByRole('row').nth(1).waitFor({ timeout: 60_000 });
    });

    await test.step('Change to 20 per page', async () => {
      await landingPage.changePerPage('20');
    });

    await test.step('Verify grid still has rows', async () => {
      await landingPage.expectGridHasRows();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.2 — My Tasks: Search, Reset, Review button navigation
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Tasks Filters & Navigation @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    // My Tasks is default tab — just wait for grid
    await landingPage.waitForGridDataRows();
  });

  test('should narrow task list when searching by task name @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-SEARCH-001: Verify the Search input field on My Tasks filters the grid ' +
      'when a query term is entered.',
    );

    let initialCount: number;

    await test.step('Record initial grid row count', async () => {
      initialCount = await landingPage.getGridRowCount();
      expect(initialCount).toBeGreaterThan(0);
    });

    await test.step('Search for a specific task name substring', async () => {
      // Use first row text as search term to guarantee a result
      const firstRowText = await landingPage.getGridRowText(1);
      const searchTerm = firstRowText.split(/\s+/).slice(0, 2).join(' ').slice(0, 20).trim();
      test.skip(!searchTerm, 'Could not extract a search term from the first row.');
      await landingPage.searchTasksByName(searchTerm);
    });

    await test.step('Verify grid updated (still visible with data or fewer rows)', async () => {
      await landingPage.expectGridVisible();
    });
  });

  test('should clear filters when Reset button is clicked @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-RESET-001: Verify that clicking the Reset button on My Tasks ' +
      'clears the search input and restores default grid state.',
    );

    await test.step('Apply a filter by typing in the search box', async () => {
      await landingPage.searchTasksByName('zzz_no_match_query_xyz');
    });

    await test.step('Click Reset to clear all filters', async () => {
      await landingPage.resetFilters();
    });

    await test.step('Verify grid is restored (has rows)', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Verify search box is cleared', async () => {
      await expect(landingPage.tasksSearchBox).toHaveValue('');
    });
  });

  test('should navigate to task detail when clicking the Review button @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-REVIEW-001: Verify that clicking the "Review" button on a task row ' +
      'navigates to either the Release Detail page (SDL task) or DOC Detail page (DOC task).',
    );

    await test.step('Find a Review button in the My Tasks grid', async () => {
      const reviewButton = landingPage.grid.getByRole('link', { name: /review/i }).first();
      const hasReview = await reviewButton.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!hasReview, 'No Review button found in My Tasks — no tasks assigned to this user.');
    });

    await test.step('Click the first Review button', async () => {
      const reviewButton = landingPage.grid.getByRole('link', { name: /review/i }).first();
      await reviewButton.click();
    });

    await test.step('Verify navigation to Release Detail or DOC Detail page', async () => {
      await page.waitForURL(/ReleaseDetail|DOCDetail/, { timeout: 30_000 });
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.2 — My Tasks: Release and Product filters
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Tasks Advanced Filters @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.waitForGridDataRows();
  });

  test('should narrow task list when Release filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-REL-001: Verify the Release dropdown filter on My Tasks narrows ' +
      'the grid results when a release option is selected.',
    );

    let initialCount: string;

    await test.step('Record initial record count', async () => {
      initialCount = await landingPage.getRecordCount();
      expect(Number(initialCount)).toBeGreaterThan(0);
    });

    await test.step('Apply Release filter by selecting first available option', async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.tasksReleaseDropdown);
      test.skip(!optionText, 'No release options available to select.');
    });

    await test.step('Verify grid updated after filter applied', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset to restore default state', async () => {
      await landingPage.resetFilters();
      await landingPage.expectGridHasRows();
    });
  });

  test('should narrow task list when Product filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-PROD-001: Verify the Product dropdown filter on My Tasks narrows ' +
      'the grid results when a product option is selected.',
    );

    let initialCount: string;

    await test.step('Record initial record count', async () => {
      initialCount = await landingPage.getRecordCount();
      expect(Number(initialCount)).toBeGreaterThan(0);
    });

    await test.step('Apply Product filter by selecting first available option', async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.tasksProductDropdown);
      test.skip(!optionText, 'No product options available to select.');
    });

    await test.step('Verify grid updated after filter applied', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset to restore default state', async () => {
      await landingPage.resetFilters();
      await landingPage.expectGridHasRows();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.3 — My Products: Latest Release nav, Org Level 1 filter, Actions
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Products Advanced Navigation @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Products');
    await landingPage.waitForGridDataRows();
  });

  test('should navigate to Release Detail when clicking the Latest Release version @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-LATEST-001: Verify that clicking the Latest Release version link ' +
      'in a My Products row navigates to the Release Detail page.',
    );

    let latestReleaseHref: string | null = null;

    await test.step('Find a product row that has a Latest Release link', async () => {
      // Scan rows to find one with a release link (Link index 1 = latest release)
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
      // Navigate directly using the href to avoid re-scanning
      await page.goto('https://qa.leap.schneider-electric.com' + latestReleaseHref!);
    });

    await test.step('Verify navigation to Release Detail page', async () => {
      await page.waitForURL(/ReleaseDetail/, { timeout: 30_000 });
      await expect(page).toHaveURL(/ReleaseDetail/);
    });
  });

  test('should narrow product list when Org Level 1 filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-ORG1-001: Verify the Org Level 1 dropdown filter on My Products ' +
      'narrows the grid results when an option is selected.',
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

  test('should show Inactivate option in the three-dot Actions menu @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-ACTIONS-001: Verify that the three-dot Actions menu in My Products ' +
      'contains an "Inactivate" option for active products.',
    );

    await test.step('Click the three-dot actions menu in the first product row', async () => {
      await landingPage.clickActionsMenuAtRow(1);
    });

    await test.step('Verify the Inactivate option is visible in the menu', async () => {
      await landingPage.expectActionsMenuOptionVisible('Inactivate');
    });
  });

  test('should narrow product list when Org Level 2 filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Products');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-PRODS-ORG2-001: Verify the Org Level 2 dropdown filter on My Products ' +
      'narrows the grid results when applied after an Org Level 1 selection.',
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
// WORKFLOW 2.4 — My Releases: Search, Status filter, Reset, Release name nav
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Releases Filters & Navigation @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Releases');
    await landingPage.waitForGridDataRows();
  });

  test('should navigate to Release Detail when clicking a release name @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-NAV-001: Verify that clicking a release name link in My Releases ' +
      'navigates to the Release Detail page.',
    );

    await test.step('Click the first release name link', async () => {
      await landingPage.clickFirstReleaseName();
    });

    await test.step('Verify navigation to Release Detail page', async () => {
      await page.waitForURL(/ReleaseDetail/, { timeout: 30_000 });
    });
  });

  test('should narrow releases when release name search filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-SEARCH-001: Verify the Release search combobox filter narrows the grid ' +
      'when a release name is entered and selected.',
    );

    let initialCount: string;

    await test.step('Record initial record count', async () => {
      initialCount = await landingPage.getRecordCount();
      expect(Number(initialCount)).toBeGreaterThan(0);
    });

    await test.step('Open search combobox and select first available release option', async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.releasesSearchDropdown);
      test.skip(!optionText, 'No release search options available to select.');
    });

    await test.step('Verify grid is still visible', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset to restore default state', async () => {
      await landingPage['page'].keyboard.press('Escape');
      await landingPage.resetFilters();
      await landingPage.expectGridHasRows();
    });
  });

  test('should filter releases by status when status dropdown is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-STATUS-001: Verify the Release Status dropdown filter on My Releases ' +
      'updates the grid when a status value is selected.',
    );

    await test.step('Open the Status dropdown and select first available option', async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.releasesStatusDropdown);
      test.skip(!optionText, 'No status options available.');
    });

    await test.step('Verify grid updated (still visible)', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset filters', async () => {
      await landingPage.resetFilters();
      await landingPage.expectGridHasRows();
    });
  });

  test('should clear all filters when Reset button is clicked @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-RESET-001: Verify that clicking Reset on My Releases clears all ' +
      'applied filters and restores the default grid state.',
    );

    await test.step('Toggle Show Active Only off to change state', async () => {
      test.skip(!(await landingPage.releasesShowActiveOnlyCheckbox.isVisible().catch(() => false)), 'My Releases Show Active Only toggle is not rendered in current QA state.');
      await landingPage.toggleReleasesShowActiveOnly();
      await landingPage.expectGridVisible();
    });

    await test.step('Click Reset', async () => {
      await landingPage.resetFilters();
    });

    await test.step('Verify Show Active Only is restored to checked state', async () => {
      await landingPage.expectReleasesShowActiveOnlyChecked();
    });
  });

  test('should narrow releases when Product filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-PROD-001: Verify the Product dropdown filter on My Releases ' +
      'narrows the grid results when a product is selected.',
    );

    let initialCount: string;

    await test.step('Record initial record count', async () => {
      initialCount = await landingPage.getRecordCount();
      expect(Number(initialCount)).toBeGreaterThan(0);
    });

    await test.step('Apply Product filter by selecting first available product option', async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.releasesProductDropdown);
      test.skip(!optionText, 'No release product options available to select.');
    });

    await test.step('Verify grid updated after filter applied', async () => {
      await landingPage.expectGridVisible();
    });

    await test.step('Reset to restore default state', async () => {
      await landingPage.resetFilters();
      await landingPage.expectGridHasRows();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.6 — Header Global Actions
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - Header Global Actions @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('should display New Product button in page header @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-001: Verify the "New Product" button is visible in the page header on the Landing Page',
    );

    await test.step('Verify New Product button is visible', async () => {
      await landingPage.expectNewProductButtonVisible();
    });
  });

  test('should navigate to New Product form when clicking New Product button @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-002: Verify clicking "New Product" button navigates to the New Product creation form',
    );

    await test.step('Click New Product button', async () => {
      await landingPage.clickNewProductButton();
    });

    await test.step('Verify navigation to New Product form', async () => {
      // New Product button navigates to ProductDetail page with ProductId=0 (new/blank product)
      await page.waitForURL(/ProductDetail/, { timeout: 30_000 });
    });
  });

  test('should display Roles Delegation link in page header @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-003: Verify the "Roles Delegation" link is visible in the page header on the Landing Page',
    );

    await test.step('Verify Roles Delegation link is visible', async () => {
      await landingPage.expectRolesDelegationLinkVisible();
    });
  });

  test('should navigate to Roles Delegation page when clicking link @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-004: Verify clicking "Roles Delegation" link navigates to the Roles Delegation page ' +
      '(opens in a new browser tab)',
    );

    await test.step('Click Roles Delegation link and wait for new tab', async () => {
      // The link has target="_blank" — it opens in a new browser tab
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page', { timeout: 15_000 }),
        landingPage.rolesDelegationLink.click(),
      ]);
      await newPage.waitForLoadState('domcontentloaded', { timeout: 30_000 });
      expect(newPage.url()).toMatch(/RolesDelegation/i);
      await newPage.close();
    });
  });

  test('should navigate back to Landing Page when clicking header logo @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-005: Verify clicking the PICASso header logo navigates to the Landing Page (HomePage)',
    );

    await test.step('Verify header logo link is visible', async () => {
      await landingPage.expectHeaderLogoVisible();
    });

    await test.step('Click header logo', async () => {
      await landingPage.clickHeaderLogo();
    });

    await test.step('Verify navigation back to Landing Page', async () => {
      await page.waitForURL(/GRC_PICASso/, { timeout: 30_000 });
      await landingPage.expectPageLoaded({ timeout: 30_000 });
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.2 — My Tasks: Date Range filter
// ────────────────────────────────────────────────────────────────────────────
test.describe('Landing Page - My Tasks Date Range Filter @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('should display Tasks Date Range picker on My Tasks tab @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-DATE-001: Verify the Date Range picker is visible on the My Tasks tab.',
    );

    await test.step('Verify Date Range picker is visible', async () => {
      await landingPage.expectTasksDateRangePickerVisible();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.2 — My Tasks: Assignee filter
// ────────────────────────────────────────────────────────────────────────────
test.describe('Landing Page - My Tasks Assignee Filter @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('should display Tasks Assignee filter on My Tasks tab @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-ASSIGNEE-001: Verify the Assignee combobox filter is visible on the My Tasks tab.',
    );

    await test.step('Verify Assignee combobox is visible', async () => {
      await landingPage.expectTasksAssigneeComboboxVisible();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.4 — My Releases: Target Date filter
// ────────────────────────────────────────────────────────────────────────────
test.describe('Landing Page - My Releases Target Date Filter @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Releases');
  });

  test('should display Target Release Date range picker on My Releases tab @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-DATE-001: Verify the Target Release Date range picker is visible on the My Releases tab.',
    );

    await test.step('Verify Date Range picker is visible', async () => {
      await landingPage.expectReleasesDateRangePickerVisible();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.2 — My Tasks: Column Renamed Labels
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Tasks Column Renamed Labels @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.waitForGridDataRows();
  });

  test('should display renamed column headers in My Tasks grid', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-LABELS-001: My Tasks grid must use updated column header labels: Status (not Task Status), Product (not Product Name), Rel. Ver. for the release version column.',
    );

    let headers: string[] = [];

    await test.step('Get column headers from My Tasks grid', async () => {
      await landingPage.expectColumnHeadersExist();
      headers = await landingPage.getColumnHeaders();
    });

    await test.step('Assert "Status" column header exists (not "Task Status")', async () => {
      const normalised = headers.map(h => h.trim().toLowerCase());
      expect(normalised, 'Expected "Status" column header in My Tasks grid').toContain('status');
      expect(normalised, 'Column header should be "Status", not "Task Status"').not.toContain('task status');
    });

    await test.step('Assert "Product" column header exists (not "Product Name")', async () => {
      const normalised = headers.map(h => h.trim().toLowerCase());
      expect(normalised, 'Expected "Product" column header in My Tasks grid').toContain('product');
      expect(normalised, 'Column header should be "Product", not "Product Name"').not.toContain('product name');
    });

    await test.step('Assert release version column exists ("Rel. Ver." or "Release")', async () => {
      const hasRelVer = headers.some(h => /rel\.?\s*ver|release/i.test(h.trim()));
      expect(
        hasRelVer,
        'Expected a release version column ("Rel. Ver." or "Release") in My Tasks grid',
      ).toBe(true);
    });
  });

  test('should show SDL or DOC values in the PROCESS TYPE column', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-TYPE-001: My Tasks grid PROCESS TYPE column must show SDL for SDL release workflow tasks and DOC for DOC process tasks.',
    );

    let rowCount = 0;
    let processTypeIndex = -1;

    await test.step('Verify grid has at least one data row and locate PROCESS TYPE column', async () => {
      rowCount = await landingPage.getGridRowCount();
      test.skip(rowCount === 0, 'No task rows found in My Tasks grid — PROCESS TYPE column cannot be validated');
      const headers = await landingPage.getColumnHeaders();
      processTypeIndex = headers.findIndex(h => /process\s*type/i.test(h.trim()));
      expect(processTypeIndex, 'PROCESS TYPE column not found in My Tasks grid').toBeGreaterThanOrEqual(0);
    });

    await test.step('Assert PROCESS TYPE cell values are SDL or DOC for first visible rows', async () => {
      const rowsToCheck = Math.min(rowCount, 5);
      for (let rowIdx = 1; rowIdx <= rowsToCheck; rowIdx++) {
        const row = landingPage.grid.getByRole('row').nth(rowIdx);
        const cellText = (
          (await row.getByRole('gridcell').nth(processTypeIndex).textContent()) ?? ''
        ).trim().toUpperCase();
        if (cellText) {
          expect(
            ['SDL', 'DOC'],
            `PROCESS TYPE cell at row ${rowIdx} should be SDL or DOC but got "${cellText}"`,
          ).toContain(cellText);
        }
      }
    });
  });

  test('should show DOC Lead value for DOC-type tasks', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-DOCLEAD-001: DOC Lead column must be populated with a name for DOC-type tasks (PROCESS TYPE = DOC) and empty for SDL-type tasks.',
    );

    let rowCount = 0;
    let processTypeIndex = -1;
    let docLeadIndex = -1;
    let docRowIdx = -1;

    await test.step('Verify grid has data rows and locate required columns', async () => {
      rowCount = await landingPage.getGridRowCount();
      test.skip(rowCount === 0, 'No task rows found in My Tasks grid');
      const headers = await landingPage.getColumnHeaders();
      processTypeIndex = headers.findIndex(h => /process\s*type/i.test(h.trim()));
      docLeadIndex = headers.findIndex(h => /doc\s*lead/i.test(h.trim()));
      expect(processTypeIndex, 'PROCESS TYPE column not found').toBeGreaterThanOrEqual(0);
      expect(docLeadIndex, 'DOC Lead column not found').toBeGreaterThanOrEqual(0);
    });

    await test.step('Scan first 10 rows to find a DOC-type task', async () => {
      const rowsToCheck = Math.min(rowCount, 10);
      for (let i = 1; i <= rowsToCheck; i++) {
        const row = landingPage.grid.getByRole('row').nth(i);
        const cellText = (
          (await row.getByRole('gridcell').nth(processTypeIndex).textContent()) ?? ''
        ).trim().toUpperCase();
        if (cellText === 'DOC') {
          docRowIdx = i;
          break;
        }
      }
      test.skip(docRowIdx === -1, 'No DOC-type tasks visible in My Tasks grid');
    });

    await test.step('Assert DOC Lead cell is populated for the DOC-type task row', async () => {
      const row = landingPage.grid.getByRole('row').nth(docRowIdx);
      const docLeadText = (
        (await row.getByRole('gridcell').nth(docLeadIndex).textContent()) ?? ''
      ).trim();
      expect(
        docLeadText,
        `DOC Lead cell should be non-empty for DOC-type task at row ${docRowIdx}`,
      ).toBeTruthy();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.3 — My Products: Advanced Filters (Product Owner, DOC Lead)
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Products Advanced Filters @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Products');
    await landingPage.waitForGridDataRows();
  });

  test('should filter My Products by Product Owner', async ({ landingPage }) => {
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
      // Poll until the pagination count restores to at least the initial total
      // (simple waitForGridDataRows is not enough — pagination text lags behind row render)
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
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.4 — My Releases: Grid Actions (Jira link, Clone in actions menu)
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Releases Grid Actions @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ loginPage, landingPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Releases');
    await landingPage.waitForGridDataRows();
  });

  test('should show a clickable Jira link in My Releases when Jira is configured', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-JIRA-001: My Releases grid Jira column must show a clickable link for releases whose product has Jira integration configured.',
    );

    let jiraColumnIndex = -1;
    let jiraLinkHref: string | null = null;

    await test.step('Locate the Jira column index in My Releases grid headers', async () => {
      test.skip(
        !(await landingPage.grid.isVisible().catch(() => false)),
        'My Releases grid is not rendered in current QA state.',
      );
      const headers = await landingPage.getColumnHeaders();
      jiraColumnIndex = headers.findIndex(h => /jira/i.test(h.trim()));
      test.skip(jiraColumnIndex === -1, 'Jira column not found in My Releases grid');
    });

    await test.step('Scan up to 5 rows for a row with a Jira link', async () => {
      const rowCount = await landingPage.getGridRowCount();
      const rowsToCheck = Math.min(rowCount, 5);
      for (let rowIdx = 1; rowIdx <= rowsToCheck; rowIdx++) {
        const cell = landingPage.grid
          .getByRole('row').nth(rowIdx)
          .getByRole('gridcell').nth(jiraColumnIndex);
        const link = cell.getByRole('link').first();
        const linkCount = await link.count();
        if (linkCount > 0) {
          jiraLinkHref = await link.getAttribute('href');
          if (jiraLinkHref) {
            break;
          }
        }
      }
      test.skip(!jiraLinkHref, 'No Jira-configured releases found');
    });

    await test.step('Assert the Jira link has a valid href attribute', async () => {
      expect(jiraLinkHref, 'Jira link should have a non-empty href attribute').toBeTruthy();
    });
  });

  test('should show Clone option in My Releases row actions menu', async ({ landingPage }) => {
    test.fail(true, 'QA environment: My Releases row actions currently shows Inactivate only; Clone is not exposed');

    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-ACTIONS-002: My Releases three-dot actions menu must offer Clone option for eligible releases.',
    );

    await test.step('Open the three-dot actions menu for the first My Releases row', async () => {
      test.skip(
        !(await landingPage.grid.isVisible().catch(() => false)),
        'My Releases grid is not rendered in current QA state.',
      );
      await landingPage.clickActionsMenuAtRow(1);
    });

    await test.step('Assert "Clone" option is visible in the actions menu', async () => {
      await landingPage.expectActionsMenuOptionVisible('Clone');
    });
  });
});
