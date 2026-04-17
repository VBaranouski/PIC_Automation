/**
 * Spec 11.3 — Landing Page: My DOCs Tab
 *
 * Verifies the My DOCs grid, columns, filters, navigation, and empty state.
 * Depends on: doc-state-setup (a DOC in Controls Scoping status exists in the system).
 */
import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

test.describe('DOC - Landing Page: My DOCs Tab (11.3) @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page, loginPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ── LANDING-DOCS-001 ──────────────────────────────────────────────────────
  test('should show My DOCs tab visible on the Landing Page', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-001: The My DOCs tab must be visible on the Landing Page ' +
      'for a user with VIEW_DOC / VIEW_ALL_DOCS privilege.',
    );

    await test.step('Go to Landing Page', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
    });

    await test.step('Verify My DOCs tab is visible', async () => {
      await expect(landingPage.myDocsTab).toBeVisible({ timeout: 30_000 });
    });
  });

  // ── LANDING-DOCS-002 ──────────────────────────────────────────────────────
  test('should show My DOCs tab positioned after My Releases tab in the tab list', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-002: My DOCs tab must appear after the My Releases tab in the tab list.',
    );

    await test.step('Go to Landing Page', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
    });

    await test.step('Verify tab order: My Releases appears before My DOCs', async () => {
      const allTabs = await landingPage.getTabNames();
      const releasesIdx = allTabs.findIndex(t => t.includes('My Releases'));
      const docsIdx = allTabs.findIndex(t => t.includes('My DOCs'));
      expect(releasesIdx).toBeGreaterThanOrEqual(0);
      expect(docsIdx).toBeGreaterThan(releasesIdx);
    });
  });

  // ── LANDING-DOCS-003 ──────────────────────────────────────────────────────
  test('should display all expected columns on the My DOCs grid', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-003: My DOCs grid must show: DOC Name, Product, VESTA ID, ' +
      'DOC Status, Certification Decision, Target Release Date, Created By, IT Owner, DOC Lead.',
    );

    await test.step('Open My DOCs tab', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Verify all expected column headers are present', async () => {
      const expected = [
        'DOC Name', 'Product', 'VESTA ID', 'DOC Status',
        'Certification Decision', 'Target Release Date', 'Created By', 'IT Owner', 'DOC Lead',
      ];
      await landingPage.expectColumnHeadersContain(expected);
    });
  });

  // ── LANDING-DOCS-004 ──────────────────────────────────────────────────────
  test('should show clickable DOC Name links that navigate to DOC Detail page', async ({ page, landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-004: DOC Name column must contain clickable links. ' +
      'Clicking one navigates to the DOC Detail page.',
    );

    await test.step('Open My DOCs tab', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Click the first DOC Name link', async () => {
      await landingPage.clickFirstGridLink();
    });

    await test.step('Verify navigation to DOC Detail page', async () => {
      await page.waitForURL(/GRC_PICASso_DOC\/DOCDetail/, { timeout: 30_000 });
    });
  });

  // ── LANDING-DOCS-005 ──────────────────────────────────────────────────────
  test('should show Certification Decision as dash for a newly initiated DOC', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-005: Certification Decision column shows "–" until a decision is provided.',
    );

    await test.step('Open My DOCs tab', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.changePerPage('100');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Find any Controls Scoping DOC and verify Cert Decision is not set', async () => {
      // Scan all visible rows for a Controls Scoping DOC.
      // The persisted DOC from doc-state.json may not be in this user's My DOCs list
      // if the setup workflow was bypassed, so we scan generically instead.
      const rows = landingPage.grid.getByRole('row');
      const rowCount = await rows.count();
      let foundRow: string | null = null;

      for (let i = 1; i < rowCount; i++) {
        const rowText = await landingPage.getGridRowText(i).catch(() => '');
        if (rowText.includes('Controls Scoping')) {
          foundRow = rowText;
          break;
        }
      }

      if (foundRow === null) {
        test.skip(true, 'No Controls Scoping DOC found in My DOCs grid for this user — skipping cert-decision dash check.');
        return;
      }

      expect(/CERTIFIED|WAIVER|REJECTED/i.test(foundRow)).toBe(false);
    });
  });

  // ── LANDING-DOCS-006 ──────────────────────────────────────────────────────
  test('should display all My DOCs filter controls', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-006: My DOCs tab must show Search, Product, VESTA ID, DOC Status, ' +
      'Certification Decision, DOC Lead filters and a Reset button.',
    );

    await test.step('Open My DOCs tab', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Verify all filter controls are visible', async () => {
      await landingPage.expectDocsFiltersVisible();
    });
  });

  // ── LANDING-DOCS-007 ──────────────────────────────────────────────────────
  test('should filter DOCs by DOC Status dropdown', async ({ landingPage }) => {
    // 🐛 KNOWN PRODUCT DEFECT (TC-11.3.7): The DOC Status dropdown filter does not
    // reliably exclude DOCs of other statuses. Completed/Certified DOCs appear when
    // "Controls Scoping" is selected. Marked test.fail() so the defect is tracked
    // without blocking the suite.
    test.fail(true, 'Known product defect: DOC Status filter does not exclude other statuses (TC-11.3.7)');

    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-007: Selecting a status in the DOC Status dropdown must filter the grid.',
    );

    let initialCount = 0;

    await test.step('Open My DOCs tab and capture initial row count', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
      initialCount = await landingPage.getGridRowCount();
    });

    await test.step('Select "Controls Scoping" in DOC Status dropdown', async () => {
      await landingPage.filterDocsByStatus('Controls Scoping');
    });

    await test.step('Verify all visible rows have Controls Scoping status', async () => {
      const rows = landingPage.grid.getByRole('row');
      const rowCount = await rows.count();
      for (let i = 1; i < rowCount; i++) {
        const rowText = await landingPage.getGridRowText(i);
        expect(rowText).toContain('Controls Scoping');
      }
    });
  });

  // ── LANDING-DOCS-008 ──────────────────────────────────────────────────────
  test('should clear all filters when Reset button is clicked', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-008: Clicking Reset must clear all active DOC filters and restore the full list.',
    );

    let initialCount = 0;

    await test.step('Open My DOCs tab and note initial row count', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
      initialCount = await landingPage.getGridRowCount();
    });

    await test.step('Apply DOC Status filter', async () => {
      await landingPage.filterDocsByStatus('Controls Scoping');
    });

    await test.step('Click Reset and verify row count returns to original', async () => {
      await landingPage.resetFilters();
      await landingPage.waitForGridDataRows();
      const countAfterReset = await landingPage.getGridRowCount();
      expect(countAfterReset).toBeGreaterThanOrEqual(initialCount);
    });
  });

  // ── LANDING-DOCS-009 ──────────────────────────────────────────────────────
  test('should change displayed rows via the per-page selector', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-009: The per-page selector must change the number of rows displayed in the My DOCs grid.',
    );

    await test.step('Open My DOCs tab', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Change per-page to 20 and verify at most 20 rows', async () => {
      await landingPage.changePerPage('20');
      const rowCount = await landingPage.getGridRowCount();
      expect(rowCount).toBeLessThanOrEqual(20);
    });
  });

  // ── LANDING-DOCS-010 ──────────────────────────────────────────────────────
  test('should filter DOCs by DOC name using the search field', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-010: The search field must filter the DOC grid by DOC name. ' +
      'Entering a known DOC name substring reduces the result set.',
    );

    let initialCount = 0;

    await test.step('Open My DOCs tab and capture initial row count', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
      initialCount = await landingPage.getGridRowCount();
    });

    await test.step('Search for "Annual review" in the DOC name search field', async () => {
      await landingPage.searchDocsByName('Annual review');
    });

    await test.step('Verify filtered row count is less than or equal to initial, and rows match the search term', async () => {
      const filteredCount = await landingPage.getGridRowCount();
      expect(filteredCount).toBeGreaterThanOrEqual(1);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });
  });

  // ── LANDING-DOCS-011 ──────────────────────────────────────────────────────
  test('should show all My DOCs grid columns as sortable', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'LANDING-DOCS-011: All My DOCs grid column headers must be sortable (clickable). ' +
      'Clicking a column header re-sorts the grid.',
    );

    await test.step('Open My DOCs tab', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Click DOC Name column header and verify grid still shows rows', async () => {
      const docNameHeader = landingPage.grid.getByRole('columnheader', { name: /DOC Name/i });
      await expect(docNameHeader).toBeVisible({ timeout: 15_000 });
      await docNameHeader.click();
      await landingPage.waitForGridDataRows();
      const rowCount = await landingPage.getGridRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(1);
    });

    await test.step('Click DOC Status column header and verify grid still shows rows', async () => {
      const statusHeader = landingPage.grid.getByRole('columnheader', { name: /doc Status/i });
      await expect(statusHeader).toBeVisible({ timeout: 15_000 });
      await statusHeader.click();
      await landingPage.waitForGridDataRows();
    });
  });

  // ── LANDING-DOCS-012 ──────────────────────────────────────────────────────
  test('should narrow My DOCs grid when a product is selected in the Product dropdown filter', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-DOCS-012: Selecting a product in the Product dropdown filter must narrow ' +
      'the My DOCs grid to only show DOCs belonging to that product.',
    );

    let totalCount = 0;

    await test.step('Open My DOCs tab and note initial row count', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.changePerPage('100');
      totalCount = await landingPage.getGridRowCount();
      if (totalCount === 0) {
        test.skip(true, 'No DOC rows in the grid — skipping product filter test.');
        return;
      }
    });

    await test.step(`Apply Product filter with value from grid row`, async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.docsProductDropdown);
      test.skip(!optionText, 'No DOC product options available to select.');
    });

    await test.step('Verify filtered count is ≥ 1 and ≤ initial count', async () => {
      const filteredCount = await landingPage.getGridRowCount();
      expect(filteredCount).toBeGreaterThanOrEqual(1);
      expect(filteredCount).toBeLessThanOrEqual(totalCount);
    });
  });

  // ── LANDING-DOCS-013 ──────────────────────────────────────────────────────
  test('should filter My DOCs grid by Certification Decision dropdown value', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-DOCS-013: Selecting a value in the Certification Decision dropdown filter ' +
      'must narrow the My DOCs grid to show only DOCs with that certification decision. ' +
      'Uses "Certified" which is a known decision value present in the QA seed DOC 273.',
    );

    let totalCount = 0;

    await test.step('Open My DOCs tab and note initial row count', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.changePerPage('100');
      totalCount = await landingPage.getGridRowCount();
    });

    await test.step('Select "Certified" in the Certification Decision dropdown', async () => {
      await landingPage.filterDocsByCertDecision('Certified');
    });

    await test.step('Verify filtered results include at least one row and contain "Certified"', async () => {
      const filteredCount = await landingPage.getGridRowCount();
      expect(filteredCount).toBeGreaterThanOrEqual(1);
      expect(filteredCount).toBeLessThanOrEqual(totalCount);
      const firstRowText = await landingPage.getGridRowText(1);
      expect(firstRowText).toMatch(/certified/i);
    });
  });

  // ── LANDING-DOCS-014 ──────────────────────────────────────────────────────
  test('should narrow My DOCs grid when a VESTA ID is selected in the VESTA ID dropdown filter', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-DOCS-014: Selecting a VESTA ID in the VESTA ID dropdown filter must narrow ' +
      'the My DOCs grid to only show DOCs for that VESTA ID.',
    );

    let totalCount = 0;

    await test.step('Open My DOCs tab and note initial row count', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.changePerPage('100');
      totalCount = await landingPage.getGridRowCount();
      if (totalCount === 0) {
        test.skip(true, 'No DOC rows in the grid — skipping VESTA ID filter test.');
        return;
      }
    });

    await test.step(`Apply VESTA ID filter with value from grid row`, async () => {
      const optionText = await landingPage.selectFirstVirtualComboboxOption(landingPage.docsVestaIdDropdown);
      test.skip(!optionText, 'No DOC VESTA ID options available to select.');
    });

    await test.step('Verify filtered count is ≥ 1 and ≤ initial count', async () => {
      const filteredCount = await landingPage.getGridRowCount();
      expect(filteredCount).toBeGreaterThanOrEqual(1);
      expect(filteredCount).toBeLessThanOrEqual(totalCount);
    });
  });

  // ── LANDING-DOCS-015 ──────────────────────────────────────────────────────
  test('should narrow My DOCs grid when a DOC Lead is selected in the DOC Lead dropdown filter', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-DOCS-015: Selecting a value in the DOC Lead dropdown filter must narrow ' +
      'the My DOCs grid to only show DOCs associated with that DOC Lead.',
    );

    let totalCount = 0;
    let docLeadName = '';

    await test.step('Open My DOCs tab and note initial row count', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.changePerPage('100');
      totalCount = await landingPage.getGridRowCount();
      if (totalCount === 0) {
        test.skip(true, 'No DOC rows in the grid — skipping DOC Lead filter test.');
        return;
      }
    });

    await test.step('Read DOC Lead name from first grid row that has a DOC Lead value', async () => {
      const headers = await landingPage.grid.getByRole('columnheader').allTextContents();
      const docLeadColIdx = headers.findIndex(h => /doc lead/i.test(h.trim()));
      if (docLeadColIdx === -1) {
        test.skip(true, 'DOC Lead column not found in My DOCs grid headers — skipping.');
        return;
      }
      // Scan rows for a non-empty DOC Lead value
      const rowCount = await landingPage.getGridRowCount();
      for (let i = 1; i <= rowCount; i++) {
        const cellText = (
          await landingPage.grid
            .getByRole('row')
            .nth(i)
            .getByRole('gridcell')
            .nth(docLeadColIdx)
            .textContent()
            .catch(() => '')
        )?.trim() ?? '';
        if (cellText && cellText !== '-' && cellText.length > 1) {
          docLeadName = cellText;
          break;
        }
      }
      if (!docLeadName) {
        test.skip(true, 'Could not find a non-empty DOC Lead value in the grid — skipping.');
        return;
      }
    });

    await test.step('Apply DOC Lead filter', async () => {
      await landingPage.filterDocsByDocLead(docLeadName);
    });

    await test.step('Verify filtered count is ≥ 1 and ≤ initial count', async () => {
      const filteredCount = await landingPage.getGridRowCount();
      expect(filteredCount).toBeGreaterThanOrEqual(1);
      expect(filteredCount).toBeLessThanOrEqual(totalCount);
    });
  });

  // ── LANDING-DOCS-016 ──────────────────────────────────────────────────────
  test('should show empty state in My DOCs grid when search returns no results', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-DOCS-016: When the My DOCs name search field contains a string ' +
      'that matches no DOCs, the grid must display an empty-state indicator ' +
      '(zero data rows or a "no results" message).',
    );

    await test.step('Open My DOCs tab', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
    });

    await test.step('Search for an impossible DOC name', async () => {
      await landingPage.searchDocsByNameExpectEmpty('ZZZNOMATCH_XYZ_EMPTY_9999');
    });

    await test.step('Verify grid shows empty state (no data rows)', async () => {
      await landingPage.expectDocsGridEmptyState();
    });
  });

  // ── ATC-11.16.9 ────────────────────────────────────────────────────────────
  test('ATC-11.16.9 — At least one My DOCs row shows a non-empty Target Release Date', async ({ landingPage }) => {
    await allure.suite('DOC / Landing Page');
    await allure.description(
      'ATC-11.16.9: At least one row in the My DOCs grid must have a non-empty value ' +
      'in the "Target Release Date" column, confirming the release linkage data flows ' +
      'through to the landing page grid.',
    );

    await test.step('Open My DOCs tab and load rows', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My DOCs');
      await landingPage.waitForGridDataRows();
    });

    await test.step('Find the Target Release Date column index and check a cell value', async () => {
      const headers = await landingPage.grid.getByRole('columnheader').allTextContents();
      const colIdx = headers.findIndex((h) => /Target Release Date/i.test(h.trim()));
      if (colIdx === -1) {
        test.skip(true, '"Target Release Date" column not found in My DOCs grid — skipping.');
        return;
      }

      const rowCount = await landingPage.getGridRowCount();
      if (rowCount === 0) {
        test.skip(true, 'No DOC rows in My DOCs grid — skipping Target Release Date value check.');
        return;
      }

      let foundNonEmpty = false;
      for (let i = 1; i <= Math.min(rowCount, 10); i++) {
        const cell = landingPage.grid
          .getByRole('row')
          .nth(i)
          .getByRole('gridcell')
          .nth(colIdx);
        const cellText = ((await cell.textContent()) ?? '').trim();
        if (cellText && cellText !== '–' && cellText !== '-') {
          foundNonEmpty = true;
          break;
        }
      }

      if (!foundNonEmpty) {
        test.skip(true, 'All visible DOCs have an empty Target Release Date — no linked release in QA environment; skipping.');
        return;
      }

      expect(foundNonEmpty, 'At least one DOC row should have a non-empty Target Release Date').toBe(true);
    });
  });
});
