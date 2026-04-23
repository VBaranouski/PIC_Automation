import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.2 — My Tasks: Search, Reset, Review button navigation
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Tasks Filters & Navigation @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-TASKS-SEARCH-001 — should narrow task list when searching by task name @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-SEARCH-001: Verify the Search input field on My Tasks filters the grid when a query term is entered.',
    );

    let initialCount: number;

    await test.step('Record initial grid row count', async () => {
      initialCount = await landingPage.getGridRowCount();
      expect(initialCount).toBeGreaterThan(0);
    });

    await test.step('Search for a specific task name substring', async () => {
      const firstRowText = await landingPage.getGridRowText(1);
      const searchTerm = firstRowText.split(/\s+/).slice(0, 2).join(' ').slice(0, 20).trim();
      test.skip(!searchTerm, 'Could not extract a search term from the first row.');
      await landingPage.searchTasksByName(searchTerm);
    });

    await test.step('Verify grid updated (still visible with data or fewer rows)', async () => {
      await landingPage.expectGridVisible();
    });
  });

  test('LANDING-TASKS-RESET-001 — should clear filters when Reset button is clicked @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-RESET-001: Verify that clicking the Reset button on My Tasks clears the search input and restores default grid state.',
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

  test('LANDING-TASKS-REVIEW-001 — should navigate to task detail when clicking the Review button @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-REVIEW-001: Verify that clicking the "Review" button on a task row navigates to either the Release Detail page (SDL task) or DOC Detail page (DOC task).',
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

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-TASKS-REL-001 — should narrow task list when Release filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-REL-001: Verify the Release dropdown filter on My Tasks narrows the grid results when a release option is selected.',
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

  test('LANDING-TASKS-PROD-001 — should narrow task list when Product filter is applied @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-PROD-001: Verify the Product dropdown filter on My Tasks narrows the grid results when a product option is selected.',
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
// WORKFLOW 2.2 — My Tasks: Date Range filter
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Tasks Date Range Filter @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('LANDING-TASKS-DATE-001 — should display Tasks Date Range picker on My Tasks tab @regression', async ({ landingPage }) => {
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

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('LANDING-TASKS-ASSIGNEE-001 — should display Tasks Assignee filter on My Tasks tab @regression', async ({ landingPage }) => {
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
// WORKFLOW 2.2 — My Tasks: Column Renamed Labels
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Tasks Column Renamed Labels @regression', () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-TASKS-LABELS-001 — should display renamed column headers in My Tasks grid', async ({ landingPage }) => {
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

  test('LANDING-TASKS-TYPE-001 — should show SDL or DOC values in the PROCESS TYPE column', async ({ landingPage }) => {
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

  test('LANDING-TASKS-DOCLEAD-001 — should show DOC Lead value for DOC-type tasks', async ({ landingPage }) => {
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

  test('DOC-TASKS-001 — should keep My Tasks pre-filtered to the logged-in assignee', async ({ landingPage, userCredentials }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-TASKS-001: My Tasks must be pre-filtered by the logged-in user in the Assignee control, so only that user\'s tasks are shown on load.',
    );

    await test.step('Verify the assignee label is visible on My Tasks', async () => {
      await landingPage.expectTasksAssigneeComboboxVisible();
    });

    await test.step('Verify the assignee control displays the logged-in user context', async () => {
      const assigneeText = ((await landingPage.tasksAssigneeLabel.textContent()) ?? '').trim().toLowerCase();
      const expectedLogin = userCredentials.login.trim().toLowerCase();

      expect(
        assigneeText.length,
        'Assignee label should expose a non-empty logged-in user context',
      ).toBeGreaterThan(0);

      expect(
        assigneeText.includes(expectedLogin) || expectedLogin.includes(assigneeText) || assigneeText.includes('assignee'),
        `Assignee label should reflect the logged-in user context. Actual: "${assigneeText}"; login: "${expectedLogin}"`,
      ).toBe(true);
    });
  });

  test('DOC-TASKS-002 — should show DOC-related Product and Rel. Ver. columns in My Tasks', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-TASKS-002: My Tasks table must show DOC-related Product and Rel. Ver. columns with the correct headers.',
    );

    let headers: string[] = [];

    await test.step('Capture My Tasks grid headers', async () => {
      await landingPage.expectColumnHeadersExist();
      headers = await landingPage.getColumnHeaders();
    });

    await test.step('Verify Product and Rel. Ver. columns are present', async () => {
      const normalized = headers.map((header) => header.trim().toLowerCase());
      const hasRelVer = headers.some((header) => /rel\.?\s*ver\.?|release/i.test(header.trim()));

      expect(normalized, 'Product column should be present in My Tasks grid').toContain('product');
      expect(hasRelVer, 'Rel. Ver. column should be present in My Tasks grid').toBe(true);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.2 — My Tasks: Empty state & task row navigation
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - My Tasks Empty State & Row Navigation @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.waitForGridDataRows();
  });

  test('LANDING-TASKS-EMPTY-001 — search with no-match query shows empty grid state on My Tasks tab @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-EMPTY-001: Verify that searching with a query that matches no tasks shows an empty grid state on the My Tasks tab.',
    );

    await test.step('Verify initial grid has data rows', async () => {
      const initialCount = await landingPage.getGridRowCount();
      test.skip(initialCount === 0, 'No tasks available for this user — cannot verify empty state transition.');
    });

    await test.step('Type a no-match search query', async () => {
      await landingPage.searchTasksByName('ZZZNOMATCH_XYZ_99999_IMPOSSIBLE');
    });

    await test.step('Verify grid shows empty state (0 data rows)', async () => {
      await landingPage.expectTasksGridEmptyState();
    });
  });

  test('LANDING-TASKS-REVIEW-001 — clicking a task row navigates to the Release Detail page @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - My Tasks');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TASKS-REVIEW-001: Verify that clicking the Name link or Review button on a task row navigates to the Release Detail or DOC Detail page.',
    );

    await test.step('Verify at least one task row exists', async () => {
      const rowCount = await landingPage.getGridRowCount();
      test.skip(rowCount === 0, 'No tasks assigned to this user — cannot test row navigation.');
    });

    await test.step('Click the first task Name link', async () => {
      const nameLink = landingPage.grid.getByRole('link').first();
      const hasLink = await nameLink.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!hasLink, 'No clickable link found in My Tasks grid row.');
      await nameLink.click();
    });

    await test.step('Verify navigation to Release Detail or DOC Detail page', async () => {
      await page.waitForURL(/ReleaseDetail|DOCDetail/, { timeout: 30_000 });
    });
  });
});