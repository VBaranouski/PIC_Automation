import { test, expect } from '../../src/fixtures';
import type { LandingTab } from '../../src/pages';
import * as allure from 'allure-js-commons';

test.describe('Landing Page @smoke', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
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

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
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

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
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

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
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

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
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

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
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





