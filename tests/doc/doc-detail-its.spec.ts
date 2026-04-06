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

  // ── DOC-ITS-015 (fixme: data-state) ────────────────────────────────────────
  test.fixme('"No ITS Controls added yet" empty state appears with Add Control button when no controls are in scope', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-015: When a newly-initiated DOC has no controls in scope yet, the ITS Checklist tab ' +
      'must show "No ITS Controls added yet" message with an Add Control button. ' +
      'Blocked: requires a DOC with zero controls in scope — find or create such a DOC.',
    );
  });

  // ── DOC-ITS-016 (fixme: hard to automate reliably) ─────────────────────────
  test.fixme('lazy loading loads additional controls as the user scrolls down', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-016: Scrolling to the bottom of the ITS Checklist grid must trigger lazy loading ' +
      'and append additional controls. ' +
      'Blocked: requires a DOC with enough controls to exceed one page; scroll-based lazy loading is environment-dependent.',
    );
  });

  // ── DOC-ITS-017 (fixme: destructive) ───────────────────────────────────────
  test.fixme('adding selected controls from Add Control popup appends them to the ITS Checklist table', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-017: Selecting controls in the Add Control popup and clicking Add Selected must append ' +
      'those controls to the ITS Checklist table. ' +
      'Skipped: destructive action — changes DOC data permanently.',
    );
  });

  // ── DOC-ITS-018 (fixme: data-state) ────────────────────────────────────────
  test.fixme('previously descoped controls appear greyed in Add Control popup with tooltip showing justification', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-018: Controls that were previously descoped must appear greyed out in the Add Control ' +
      'popup with a tooltip icon showing the descope justification. ' +
      'Blocked: requires a DOC that has at least one descoped control — use test data with pre-descoped controls.',
    );
  });

  // ── DOC-ITS-019 (fixme: destructive) ───────────────────────────────────────
  test.fixme('confirming descope in Unscope popup removes the control from the ITS Checklist table', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / ITS Checklist');
    await allure.description(
      'DOC-ITS-019: Filling the Unscope ITS Control popup justification and clicking Descope must ' +
      'remove the control from the ITS Checklist table. ' +
      'Skipped: destructive action — permanently removes a control from the DOC.',
    );
  });
});
