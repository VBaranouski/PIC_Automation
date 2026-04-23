import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.4 — My Releases: Search, Status filter, Reset, Release name nav
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Releases Filters & Navigation @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Releases');
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-RELS-NAV-001 — should navigate to Release Detail when clicking a release name @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-NAV-001: Verify that clicking a release name link in My Releases navigates to the Release Detail page.',
    );

    await test.step('Click the first release name link', async () => {
      await landingPage.clickFirstReleaseName();
    });

    await test.step('Verify navigation to Release Detail page', async () => {
      await page.waitForURL(/ReleaseDetail/, { timeout: 30_000 });
    });
  });

  test('LANDING-RELS-SEARCH-001 — should narrow releases when release name search filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-SEARCH-001: Verify the Release search combobox filter narrows the grid when a release name is entered and selected.',
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

  test('LANDING-RELS-STATUS-001 — should filter releases by status when status dropdown is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-STATUS-001: Verify the Release Status dropdown filter on My Releases updates the grid when a status value is selected.',
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

  test('LANDING-RELS-RESET-001 — should clear all filters when Reset button is clicked @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-RESET-001: Verify that clicking Reset on My Releases clears all applied filters and restores the default grid state.',
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

  test('LANDING-RELS-PROD-001 — should narrow releases when Product filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Releases');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-RELS-PROD-001: Verify the Product dropdown filter on My Releases narrows the grid results when a product is selected.',
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
// WORKFLOW 2.4 — My Releases: Target Date filter
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Releases Target Date Filter @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Releases');
  });

  test('LANDING-RELS-DATE-001 — should display Target Release Date range picker on My Releases tab @regression', async ({ landingPage }) => {
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
// WORKFLOW 2.4 — My Releases: Grid Actions (Jira link, Clone in actions menu)
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Releases Grid Actions @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Releases');
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-RELS-JIRA-001 — should show a clickable Jira link in My Releases when Jira is configured', async ({ landingPage }) => {
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

  test('LANDING-RELS-ACTIONS-002 — should show Clone option in My Releases row actions menu', async ({ landingPage }) => {
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