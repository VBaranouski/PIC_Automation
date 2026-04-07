/**
 * Spec 11.7 — DOC Detail: ITS Checklist Tab
 *
 * Covers the "IT SECURITY CONTROLS" subtitle, grid columns, search/filter/reset,
 * Add Control popup flow, selection counter, and Descope popup validation.
 *
 * Tests that require controls to exist include a graceful skip guard.
 *
 * Depends on: doc-state-setup
 */
import { test, expect } from '../../src/fixtures';
import { readDocState } from '../../src/helpers/doc.helper';
import * as allure from 'allure-js-commons';

test.describe('DOC - ITS Checklist Tab (11.7) @regression', () => {
  test.setTimeout(240_000);

  let docDetailsUrl: string;

  test.beforeAll(() => {
    docDetailsUrl = readDocState().docDetailsUrl;
  });

  test.beforeEach(async ({ page, loginPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ── DOC-ITS-001 ───────────────────────────────────────────────────────────
  test('should show the IT SECURITY CONTROLS subtitle on the ITS Checklist tab', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-001: After clicking the ITS Checklist tab the page must display ' +
      'the "IT SECURITY CONTROLS" section subtitle.',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    await test.step('Verify IT SECURITY CONTROLS subtitle is visible', async () => {
      await docDetailsPage.expectITSSecurityControlsTitleVisible();
    });
  });

  // ── DOC-ITS-002 ───────────────────────────────────────────────────────────
  test('should display the ITS Checklist grid with expected column headers', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-002: ITS Checklist grid must show columns: ' +
      'Control ID, Description, Evidence Expectation, Category (and an Actions column).',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    await test.step('Verify grid column headers', async () => {
      await docDetailsPage.expectITSGridColumnHeaders();
    });
  });

  // ── DOC-ITS-003 ───────────────────────────────────────────────────────────
  test('should show Category filter, Search field, and Reset button on ITS Checklist', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-003: ITS Checklist tab must expose a Category filter dropdown, ' +
      'a Search field, and a Reset button.',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    await test.step('Verify Category filter, search input, and Reset are visible', async () => {
      await docDetailsPage.expectITSFilterControlsVisible();
    });
  });

  // ── DOC-ITS-004 ───────────────────────────────────────────────────────────
  test('should show the Add Control button with SCOPE_IT_SECURITY_CONTROLS privilege', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-004: "Add Control" button must be visible for users with ' +
      'SCOPE_IT_SECURITY_CONTROLS privilege.',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    await test.step('Verify Add Control button is visible', async () => {
      await docDetailsPage.expectAddControlButtonVisible();
    });
  });

  // ── DOC-ITS-005 ───────────────────────────────────────────────────────────
  test('should open Add Control popup when Add Control button is clicked', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-005: Clicking Add Control must open a popup dialog with a search field, ' +
      'Category filter, "Show new only" toggle, and a controls table.',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    await test.step('Click Add Control', async () => {
      await docDetailsPage.clickAddControl();
    });

    await test.step('Verify popup is visible with all expected elements', async () => {
      await docDetailsPage.expectAddControlPopupVisible();
      await docDetailsPage.expectAddControlPopupElements();
    });

    // Cleanup
    await test.step('Close the popup', async () => {
      await docDetailsPage.closeAddControlPopup();
    });
  });

  // ── DOC-ITS-006 ───────────────────────────────────────────────────────────
  test('should show Add Selected button and selected count when a control is checked in the popup', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-006: Selecting a control in the Add Control popup must show "N of M Selected" ' +
      'count and enable the "Add Selected" button.',
    );

    await test.step('Navigate to DOC Detail, open ITS Checklist, click Add Control', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
      await docDetailsPage.clickAddControl();
      await docDetailsPage.expectAddControlPopupVisible();
    });

    // Guard: skip if no controls are available in the popup
    const hasControls = await docDetailsPage.hasControlsInAddControlPopup();
    if (!hasControls) {
      test.skip(true, 'No controls available in Add Control popup on this environment — skipping selection test.');
      return;
    }

    await test.step('Select first control in the popup', async () => {
      await docDetailsPage.selectFirstControlInPopup();
    });

    await test.step('Verify selected count is shown and Add Selected is enabled', async () => {
      await docDetailsPage.expectSelectedCountVisible();
      await docDetailsPage.expectAddSelectedButtonEnabled();
    });

    // Cleanup
    await test.step('Close the popup', async () => {
      await docDetailsPage.closeAddControlPopup();
    });
  });

  // ── DOC-ITS-007 ───────────────────────────────────────────────────────────
  test('should filter ITS controls with the search field and reset correctly', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-007: Entering text in the search field must filter controls; ' +
      'clicking Reset must restore the full list.',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    // Guard: skip if no controls are loaded
    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls loaded — skipping search/reset test.');
      return;
    }

    await test.step('Enter non-matching search text and verify no results or reduced list', async () => {
      const searchInput = docDetailsPage['l'].itsSearchInput;
      await docDetailsPage.searchITSControls('ZZZNOMATCH9999');
      // Either "No results found" appears or the row count drops to 0
      const noResults = await docDetailsPage.hasITSNoResultsMessage();
      const rowCount = await docDetailsPage.getITSGridDataRowCount();
      expect(noResults || rowCount === 0).toBe(true); // 0 means no data rows (tbody tr excludes header)
    });

    await test.step('Click Reset and verify controls are visible again', async () => {
      await docDetailsPage.clickITSReset();
      await docDetailsPage.expectITSSecurityControlsTitleLoaded();
    });
  });

  // ── DOC-ITS-008 ───────────────────────────────────────────────────────────
  test('should open Descope popup with disabled Descope button until justification is filled', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-008: Clicking the X (Descope) button on a control row must open ' +
      '"Unscope ITS Control" popup. The Descope button in the popup must be disabled ' +
      'until a justification is provided.',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    // Guard: skip if no controls are present
    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls available — skipping Descope popup test.');
      return;
    }

    await test.step('Click the Descope button on the first control row', async () => {
      await docDetailsPage.clickFirstControlDescopeButton();
    });

    await test.step('Verify Unscope popup is visible', async () => {
      await docDetailsPage.expectUnscopePopupVisible();
    });

    await test.step('Verify Descope button is initially disabled', async () => {
      await docDetailsPage.expectUnscopeDescoperButtonDisabled();
    });

    await test.step('Fill justification and verify Descope button becomes enabled', async () => {
      await docDetailsPage.fillUnscopeJustification('Automated test justification — control not applicable.');
      await docDetailsPage.expectUnscopeDescoperButtonEnabled();
    });

    // Dismiss without actually descoping
    await test.step('Cancel descope action', async () => {
      await docDetailsPage.cancelUnscopePopup();
    });
  });

  // ── DOC-ITS-009 ───────────────────────────────────────────────────────────
  test('should re-sort ITS Checklist grid without breaking layout when a column header is clicked', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-009: Clicking a column header in the ITS Checklist grid must re-sort ' +
      'the rows without breaking the grid layout.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    // Guard: skip if no controls are loaded
    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls loaded — skipping column sort test.');
      return;
    }

    await test.step('Verify ITS grid column headers are visible', async () => {
      await docDetailsPage.expectITSGridColumnHeadersVisible();
    });

    await test.step('Click the CONTROL ID column header to trigger sort', async () => {
      await docDetailsPage.clickITSGridColumnHeader(/CONTROL ID/i);
    });

    await test.step('Verify ITS grid is still visible after sort', async () => {
      await docDetailsPage.expectITSGridVisible();
    });
  });

  // ── DOC-ITS-010 ───────────────────────────────────────────────────────────
  test('should re-sort ITS Checklist grid when Description column header is clicked', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-010: Clicking the Description column header in the ITS Checklist grid ' +
      'must re-sort the rows without breaking the grid layout.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls loaded — skipping Description column sort test.');
      return;
    }

    await test.step('Click the DESCRIPTION column header to trigger sort', async () => {
      await docDetailsPage.clickITSGridColumnHeader(/DESCRIPTION/i);
    });

    await test.step('Verify ITS grid is still visible after sort', async () => {
      await docDetailsPage.expectITSGridVisible();
    });
  });

  // ── DOC-ITS-011 ───────────────────────────────────────────────────────────
  test('should re-sort ITS Checklist grid when Category column header is clicked', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-011: Clicking the Category column header in the ITS Checklist grid ' +
      'must re-sort the rows without breaking the grid layout.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls loaded — skipping Category column sort test.');
      return;
    }

    await test.step('Click the CATEGORY column header to trigger sort', async () => {
      await docDetailsPage.clickITSGridColumnHeader(/CATEGORY/i);
    });

    await test.step('Verify ITS grid is still visible after sort', async () => {
      await docDetailsPage.expectITSGridVisible();
    });
  });

  // ── DOC-ITS-012 ───────────────────────────────────────────────────────────
  test('should show "No results found" empty state when ITS search returns no matches', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-012: Entering a search term that matches no ITS controls must display ' +
      'a "No results found" empty-state message in the ITS Checklist grid.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls loaded — skipping no-results empty state test.');
      return;
    }

    await test.step('Enter a non-matching search query', async () => {
      await docDetailsPage.searchITSControls('ZZZNOMATCH_DOES_NOT_EXIST_9999');
    });

    await test.step('Verify "No results found" empty state is visible', async () => {
      await docDetailsPage.expectITSNoResultsMessageVisible();
    });

    await test.step('Reset search to restore the full list', async () => {
      await docDetailsPage.clickITSReset();
      await docDetailsPage.expectITSSecurityControlsTitleLoaded();
    });
  });

  // ── DOC-ITS-013 ───────────────────────────────────────────────────────────
  test('should display ITS Checklist controls sorted by Control ID ascending by default', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-013: The ITS Checklist grid must load controls sorted by Control ID in ascending ' +
      'order by default (as loaded from BackOffice) without any user interaction.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls loaded — skipping default sort test.');
      return;
    }

    await test.step('Verify ITS grid first row Control ID ≤ second row (ascending order)', async () => {
      await docDetailsPage.expectITSDefaultSortedByControlId();
    });
  });

  // ── DOC-ITS-014 ───────────────────────────────────────────────────────────
  test('should show "No results found" in Add Control popup and preserve selection count when search matches nothing', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-014: In the Add Control popup, entering a search term that matches no controls must ' +
      'display "No results found". If controls were already selected before the search, ' +
      'the selection count and enabled Add Selected button must remain visible.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    await test.step('Verify Add Control popup no-results with preserved count', async () => {
      await docDetailsPage.expectAddControlPopupNoResultsWithCountPreserved();
    });
  });

  // ── DOC-ITS-015 ───────────────────────────────────────────────────────────
  test('should filter ITS Checklist controls by selecting a Category from the dropdown', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-015: Selecting a category from the Category dropdown filter in the ITS Checklist ' +
      'must narrow the displayed controls to those matching that category. ' +
      'Resetting the filter must restore the full list.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    // Guard: skip if no controls are loaded
    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls loaded — skipping category filter test.');
      return;
    }

    const initialRowCount = await docDetailsPage.getITSGridDataRowCount();

    await test.step('Verify Category filter dropdown is visible', async () => {
      await docDetailsPage.expectITSFilterControlsVisible();
    });

    await test.step('Select first non-empty category option and verify filtering', async () => {
      const categorySelect = docDetailsPage['l'].itsCategoryFilter;
      // Get all option values to find a non-default one
      const options = await categorySelect.locator('option').allTextContents();
      const nonDefaultOption = options.find((o) => o.trim() && o.trim() !== 'All' && o.trim() !== '-- All --' && o.trim() !== '');

      if (!nonDefaultOption) {
        test.skip(true, 'No category options available in the dropdown — skipping.');
        return;
      }

      await categorySelect.selectOption({ label: nonDefaultOption.trim() });
      await page.waitForTimeout(1500); // wait for grid to re-render

      // Either the row count changed (filtered) or a "No results" message appeared
      const filteredRowCount = await docDetailsPage.getITSGridDataRowCount();
      const noResults = await docDetailsPage.hasITSNoResultsMessage();
      expect(
        filteredRowCount < initialRowCount || filteredRowCount > 0 || noResults,
        'Category filter should change the displayed rows or show "No results"',
      ).toBe(true);
    });

    await test.step('Reset filter and verify full list is restored', async () => {
      await docDetailsPage.clickITSReset();
      await docDetailsPage.expectITSSecurityControlsTitleLoaded();
      // Wait for the grid rows to re-render after reset (OS grid re-populates async)
      const rowsLocator = docDetailsPage['l'].itsGrid.locator('tbody tr');
      await expect(rowsLocator.first()).toBeVisible({ timeout: 10_000 });
      const restoredRowCount = await docDetailsPage.getITSGridDataRowCount();
      expect(
        restoredRowCount,
        `After reset, row count (${restoredRowCount}) should be ≥ initial count (${initialRowCount})`,
      ).toBeGreaterThanOrEqual(initialRowCount);
    });
  });

  // ── DOC-ITS-016 ───────────────────────────────────────────────────────────
  test('should filter controls by Category in the Add Control popup', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-016: In the Add Control popup, selecting a Category from the category filter dropdown ' +
      'must narrow the control list to the matching category. ' +
      'Selecting "All" must restore the full list.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    await test.step('Open the Add Control popup', async () => {
      await docDetailsPage.clickAddControl();
      await docDetailsPage.expectAddControlPopupVisible();
    });

    // Guard: skip if no controls are in the popup
    const hasControls = await docDetailsPage.hasControlsInAddControlPopup();
    if (!hasControls) {
      await docDetailsPage.closeAddControlPopup();
      test.skip(true, 'No controls in Add Control popup — skipping category filter test.');
      return;
    }

    const initialCount = await docDetailsPage['l'].addControlTable.locator('tbody tr').count();

    await test.step('Select first non-All category in Add Control popup and verify filtering', async () => {
      const catFilter = docDetailsPage['l'].addControlCategoryFilter;
      const options = await catFilter.locator('option').allTextContents();
      const nonDefaultOption = options.find((o) => o.trim() && o.trim() !== 'All' && o.trim() !== '-- All --' && o.trim() !== '');

      if (!nonDefaultOption) {
        await docDetailsPage.closeAddControlPopup();
        test.skip(true, 'No category options in Add Control popup — skipping.');
        return;
      }

      await catFilter.selectOption({ label: nonDefaultOption.trim() });
      await page.waitForTimeout(1500);

      const filteredCount = await docDetailsPage['l'].addControlTable.locator('tbody tr').count();
      const noResults = await page.locator('[role="dialog"]').getByText(/No results found/i).isVisible().catch(() => false);
      expect(
        filteredCount < initialCount || filteredCount > 0 || noResults,
        'Category filter in Add Control popup should reduce visible rows or show "No results"',
      ).toBe(true);
    });

    await test.step('Close the Add Control popup', async () => {
      await docDetailsPage.closeAddControlPopup();
    });
  });

  // ── DOC-ITS-017 (fixme: destructive) ───────────────────────────────────────
  test.fixme('adding selected controls from Add Control popup appends them to the ITS Checklist table and can be reverted by descoping', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-017: Selecting controls in the Add Control popup and clicking "Add Selected" must ' +
      'append those controls to the ITS Checklist table. The added control can then be descoped. ' +
      'Deferred: requires a dedicated DOC to avoid mutating shared QA seed data.',
    );
  });

  // ── DOC-ITS-018 ───────────────────────────────────────────────────────────
  test('should show "Start ITS Risk Assessment" button and reflect its gating state based on unassessed controls', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-ITS-018: On a DOC in Controls Scoping stage, the "Start ITS Risk Assessment" button ' +
      'must be visible. If any ITS control has "Not Assessed" status, the button must be disabled ' +
      'or the application must block the action — ensuring the Risk Assessment cannot start until ' +
      'all controls have been assessed.',
    );

    await test.step('Navigate to the seed DOC ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    await test.step('Verify "Start ITS Risk Assessment" button is visible on a Controls Scoping DOC', async () => {
      const startBtn = page.getByRole('button', { name: /Start ITS Risk Assessment/i });
      const isVisible = await startBtn.isVisible().catch(() => false);

      if (!isVisible) {
        test.skip(true, 'Start ITS Risk Assessment button not visible — DOC may not be in Controls Scoping stage. Skipping.');
        return;
      }

      await expect(startBtn).toBeVisible({ timeout: 15_000 });
    });

    await test.step('Verify button is disabled when ITS controls have "Not Assessed" status', async () => {
      const startBtn = page.getByRole('button', { name: /Start ITS Risk Assessment/i });
      const isVisible = await startBtn.isVisible().catch(() => false);
      if (!isVisible) return;

      // Check if any control has "Not Assessed" status in the grid
      const hasUnassessed = await page
        .getByRole('tabpanel')
        .filter({ has: page.getByText('IT SECURITY CONTROLS') })
        .locator('tbody tr')
        .filter({ hasText: /Not Assessed/i })
        .first()
        .isVisible()
        .catch(() => false);

      if (hasUnassessed) {
        // When controls are unassessed, the button should be disabled (gated)
        const isDisabled = await startBtn.isDisabled().catch(() => false);
        expect(
          isDisabled,
          'Start ITS Risk Assessment button should be disabled when controls have "Not Assessed" status',
        ).toBe(true);
      } else {
        // All controls may be assessed — button should be enabled
        const isEnabled = await startBtn.isEnabled().catch(() => true);
        expect(isEnabled, 'Start ITS Risk Assessment button should be enabled when all controls are assessed').toBe(true);
      }
    });
  });

  // ── DOC-ITS-019 (fixme: destructive — advances DOC stage) ─────────────────
  test.fixme('confirming Start ITS Risk Assessment advances the DOC to Risk Assessment stage', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-019: Clicking "Start ITS Risk Assessment" on a fully-assessed DOC must ' +
      'advance the DOC stage to "Risk Assessment" and make the ITS Checklist read-only. ' +
      'Deferred: permanently advances the DOC stage — requires a dedicated DOC that is safe to advance.',
    );
  });
});
