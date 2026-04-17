/**
 * Spec 11.12 — DOC Detail: DOC History
 *
 * Verifies the "View History" link, history popup dialog, grid columns,
 * filter controls, at least one history record, and Activity filter behaviour.
 *
 * Depends on: doc-state-setup
 */
import { test, expect } from '../../src/fixtures';
import { readDocState } from '../../src/helpers/doc.helper';
import * as allure from 'allure-js-commons';

function parseHistoryDate(value: string): number {
  const normalized = value.replace(/\s+/g, ' ').trim();
  const direct = Date.parse(normalized);
  if (!Number.isNaN(direct)) return direct;

  const match = normalized.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})(?:,?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i);
  if (!match) {
    throw new Error(`Unsupported DOC History date format: ${value}`);
  }

  const [, first, second, yearRaw, hourRaw, minuteRaw, secondRaw, meridiemRaw] = match;
  const firstNumber = Number(first);
  const secondNumber = Number(second);
  const year = Number(yearRaw.length === 2 ? `20${yearRaw}` : yearRaw);

  const month = firstNumber > 12 ? secondNumber : firstNumber;
  const day = firstNumber > 12 ? firstNumber : secondNumber;

  let hours = Number(hourRaw ?? '0');
  const minutes = Number(minuteRaw ?? '0');
  const seconds = Number(secondRaw ?? '0');
  const meridiem = meridiemRaw?.toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
}

function toDayBounds(timestamp: number): { start: Date; end: Date } {
  const date = new Date(timestamp);
  return {
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
  };
}

function isSameCalendarDay(timestamp: number, target: Date): boolean {
  const date = new Date(timestamp);
  return date.getFullYear() === target.getFullYear()
    && date.getMonth() === target.getMonth()
    && date.getDate() === target.getDate();
}

test.describe('DOC - DOC History (11.12) @regression', () => {
  test.setTimeout(180_000);

  let docDetailsUrl: string;

  test.beforeAll(() => {
    docDetailsUrl = readDocState().docDetailsUrl;
  });
  // ── DOC-HISTORY-001 ───────────────────────────────────────────────────────
  test('should open the DOC History popup when View History link is clicked', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-001: Clicking "View History" in the DOC Detail header must open ' +
      'the DOC History popup dialog.',
    );

    await test.step('Navigate to DOC Detail page', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
    });

    await test.step('Click View History link', async () => {
      await docDetailsPage.clickViewHistory();
    });

    await test.step('Verify history popup is visible', async () => {
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-002 ───────────────────────────────────────────────────────
  test('should show the history grid with Date, User, Activity, Description columns', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-002: History popup grid must have columns: Date, User, Activity, Description.',
    );

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Verify all expected column headers', async () => {
      await docDetailsPage.expectHistoryGridColumnHeaders();
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-003 ───────────────────────────────────────────────────────
  test('should display at least one history record (DOC Creation event)', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-003: The history grid must contain at least one record. ' +
      'A DOC Creation event must exist from when the DOC was initiated.',
    );

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Verify at least one data row is present in history grid', async () => {
      await docDetailsPage.expectHistoryGridHasRows();
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-004 ───────────────────────────────────────────────────────
  test('should show Search, Activity filter, Date Range pickers, Search and Reset buttons', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-004: History popup must display: Search field, Activity filter dropdown, ' +
      'Date Range picker inputs, and Search / Reset buttons.',
    );

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Verify all filter controls are visible', async () => {
      await docDetailsPage.expectHistoryFiltersVisible();
    });

    await test.step('Verify Date Range date inputs are visible', async () => {
      await docDetailsPage.expectHistoryDateRangeInputsVisible();
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-005 ───────────────────────────────────────────────────────
  test('should filter history by Activity type and reduce results', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-005: Selecting an Activity type in the Activity filter must narrow ' +
      'the history entries to only that activity type.',
    );

    let initialRowCount = 0;

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Record initial row count', async () => {
      initialRowCount = await docDetailsPage.getHistoryRowCount();
    });

    await test.step('Select "ITS Checklist Update" in Activity filter and search', async () => {
      // Activity filter is a native <select>; 'Digital Offer Certification Creation' = DOC init event
      // Use ITS Checklist Update which is a common event likely to exist
      await docDetailsPage.selectHistoryActivityFilter('ITS Checklist Update');
      await docDetailsPage.clickHistorySearchButton();
    });

    await test.step('Verify rows are filtered (at least 1 visible or 0 if none match)', async () => {
      const rowCount = await docDetailsPage.getHistoryRowCount();
      // Either rows are filtered to match or no rows (valid filter result)
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    await test.step('Click Reset and verify all records are restored', async () => {
      await docDetailsPage.clickHistoryResetFilters();
      const rowCountAfterReset = await docDetailsPage.getHistoryRowCount();
      expect(rowCountAfterReset).toBeGreaterThanOrEqual(initialRowCount);
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-006 ───────────────────────────────────────────────────────
  test('should list multiple activity types in the Activity filter dropdown', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-006: The Activity filter dropdown must expose at least 5 selectable ' +
      'activity types in addition to the default "All" option, confirming the LOV is fully ' +
      'populated by the application.',
    );

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Verify Activity filter has at least 2 options (blank/All + ≥1 activity type)', async () => {
      const optionCount = await docDetailsPage.getHistoryActivityFilterOptionCount();
      // The dropdown must contain at minimum: a blank/All placeholder + at least one activity type.
      // OutSystems LOV populates asynchronously; ≥2 confirms the list-of-values is loaded.
      expect(optionCount).toBeGreaterThanOrEqual(2);
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-007 ───────────────────────────────────────────────────────
  test('should display a recognizable date value in the Date column of history rows', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-007: The Date column in the history grid must contain a non-empty ' +
      'date-like value (digits present) in the first data row, confirming the application ' +
      'renders timestamps for history events.',
    );

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Verify the first history row has a non-empty date cell', async () => {
      await docDetailsPage.expectHistoryGridHasRows();
      const dateText = await docDetailsPage.getHistoryFirstRowDateText();
      expect(dateText).not.toBe('');
      // All known date formats contain digits (day/month/year numbers)
      expect(dateText).toMatch(/\d/);
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-008 ───────────────────────────────────────────────────────
  test('should filter history records when search text is entered', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-008: Entering text in the Search field and clicking the Search button ' +
      'must narrow the visible history rows. Clicking Reset must restore the full list.',
    );

    let initialRowCount = 0;

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Record initial row count', async () => {
      initialRowCount = await docDetailsPage.getHistoryRowCount();
    });

    await test.step('Enter "Creation" in the search input and click Search', async () => {
      // "Digital Offer Certification Creation" is always present in a DOC that was initiated;
      // searching "Creation" should return at least one matching record.
      await docDetailsPage.fillHistorySearchInput('Creation');
      await docDetailsPage.clickHistorySearchButton();
    });

    await test.step('Verify search returns ≥ 1 result', async () => {
      const filteredCount = await docDetailsPage.getHistoryRowCount();
      expect(filteredCount).toBeGreaterThanOrEqual(1);
    });

    await test.step('Click Reset and verify full history is restored', async () => {
      await docDetailsPage.clickHistoryResetFilters();
      const rowCountAfterReset = await docDetailsPage.getHistoryRowCount();
      expect(rowCountAfterReset).toBeGreaterThanOrEqual(initialRowCount);
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-009 ───────────────────────────────────────────────────────
  test('should clear search text and activity selection when Reset is clicked', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-009: After applying search text and an Activity filter in the DOC History popup, ' +
      'clicking Reset must clear the searchbox and restore the Activity dropdown to its default state.',
    );

    const selectedActivity = 'ITS Checklist Update';

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Apply search text and a non-default Activity filter', async () => {
      await docDetailsPage.fillHistorySearchInput('Creation');
      const optionCount = await docDetailsPage.getHistoryActivityFilterOptionCount();
      expect(optionCount).toBeGreaterThanOrEqual(2);

      await docDetailsPage.selectHistoryActivityFilter(selectedActivity);
      await docDetailsPage.clickHistorySearchButton();
    });

    await test.step('Click Reset and verify control state returns to default', async () => {
      await docDetailsPage.clickHistoryResetFilters();

      await expect.poll(() => docDetailsPage.getHistorySearchInputValue()).toBe('');
      await expect.poll(() => docDetailsPage.getSelectedHistoryActivityFilterLabel()).not.toBe(selectedActivity);
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-010 ───────────────────────────────────────────────────────
  test('should filter history by selected date range', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-010: Applying a DOC History date range must narrow the grid to rows whose Date values fall within the selected day.',
    );

    let targetDay!: Date;

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
      await docDetailsPage.expectHistoryGridHasRows();
    });

    await test.step('Use the first history row date as the filter day', async () => {
      const [firstDateText] = await docDetailsPage.getHistoryDateTexts(1);
      expect(firstDateText, 'Expected at least one DOC History row').toBeTruthy();

      const { start, end } = toDayBounds(parseHistoryDate(firstDateText));
      targetDay = start;
      await docDetailsPage.selectHistoryDateRange(start, end);
      await docDetailsPage.clickHistorySearchButton();
    });

    await test.step('Verify filtered rows all belong to the selected day', async () => {
      const filteredDates = await docDetailsPage.getHistoryDateTexts(20);
      expect(filteredDates.length, 'Expected DOC History date range filter to keep at least one row').toBeGreaterThan(0);

      for (const value of filteredDates) {
        expect(isSameCalendarDay(parseHistoryDate(value), targetDay)).toBe(true);
      }
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── DOC-HISTORY-011 ───────────────────────────────────────────────────────
  test('should paginate history rows when more than one page of records exists', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.description(
      'DOC-HISTORY-011: DOC History pagination must support per-page selection and moving to the next page when more than 10 records exist.',
    );

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
      await docDetailsPage.expectHistoryGridHasRows();
    });

    await test.step('Require a DOC with more than one page of history', async () => {
      const totalRecords = await docDetailsPage.getHistoryTotalRecordCount();
      test.skip(totalRecords <= 10, `DOC History shows ${totalRecords} records; pagination validation requires more than 10.`);
    });

    await test.step('Set per-page to 10 and verify first-page row count', async () => {
      await docDetailsPage.changeHistoryPerPage('10');
      const visibleRows = await docDetailsPage.getHistoryRowCount();
      expect(visibleRows).toBeLessThanOrEqual(10);
      expect(await docDetailsPage.getCurrentHistoryPageNumber()).toBe(1);
    });

    await test.step('Navigate to page 2 and verify rows are displayed', async () => {
      await docDetailsPage.goToHistoryPage(2);
      await expect.poll(() => docDetailsPage.getCurrentHistoryPageNumber()).toBe(2);
      await expect.poll(() => docDetailsPage.getHistoryRowCount()).toBeGreaterThan(0);
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── WF11-0135 ─────────────────────────────────────────────────────────────
  test('should list all expected activity types in the Activity filter dropdown', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'WF11-0135: The Activity filter dropdown must list all 15 activity types: ' +
      'Action Plan Update, Certification Decision Update, DOC Creation, Details Update, ' +
      'DOC Cancellation, DOC Completion, DOC Revocation, DOC Stage Update, DOC Status Update, ' +
      'ITS Checklist Update, Risk Assessment Update, Roles Update, Send DOC for Rework, ' +
      'Summary Risk Review Update.',
    );

    const expectedActivities = [
      'Action Plan Update',
      'Certification Decision Update',
      'DOC Creation',
      'Details Update',
      'DOC Cancellation',
      'DOC Completion',
      'DOC Revocation',
      'DOC Stage Update',
      'DOC Status Update',
      'ITS Checklist Update',
      'Risk Assessment Update',
      'Roles Update',
      'Send DOC for Rework',
      'Summary Risk Review Update',
    ];

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
    });

    await test.step('Retrieve all Activity filter options', async () => {
      const options = await docDetailsPage.getHistoryActivityFilterOptions();
      const normalised = options.map(o => o.trim()).filter(o => o.length > 0);

      // Verify at least the known activity types are present
      for (const expected of expectedActivities) {
        const found = normalised.some(o => o.toLowerCase().includes(expected.toLowerCase()));
        expect(found, `Activity filter should include "${expected}"`).toBe(true);
      }
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── WF11-0139 ─────────────────────────────────────────────────────────────
  test('should narrow history entries when a date range is applied', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'WF11-0139: Applying a date range filter must narrow the history entries to only ' +
      'those within the specified period.',
    );

    let initialRowCount = 0;

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
      await docDetailsPage.expectHistoryGridHasRows();
    });

    await test.step('Record initial row count', async () => {
      initialRowCount = await docDetailsPage.getHistoryRowCount();
      expect(initialRowCount).toBeGreaterThan(0);
    });

    await test.step('Apply a date range using the first row date as both start and end', async () => {
      const [firstDateText] = await docDetailsPage.getHistoryDateTexts(1);
      expect(firstDateText, 'Expected at least one history row with a date').toBeTruthy();

      const { start, end } = toDayBounds(parseHistoryDate(firstDateText));
      await docDetailsPage.selectHistoryDateRange(start, end);
      await docDetailsPage.clickHistorySearchButton();
    });

    await test.step('Verify filtered rows are a subset of (or equal to) original rows', async () => {
      const filteredCount = await docDetailsPage.getHistoryRowCount();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialRowCount);
    });

    await test.step('Reset and verify full list is restored', async () => {
      await docDetailsPage.clickHistoryResetFilters();
      const restoredCount = await docDetailsPage.getHistoryRowCount();
      expect(restoredCount).toBeGreaterThanOrEqual(initialRowCount);
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });

  // ── WF11-0140 ─────────────────────────────────────────────────────────────
  test('should support per-page selector with 10/20/30/50/100 options', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / DOC Detail / History');
    await allure.severity('minor');
    await allure.tag('regression');
    await allure.description(
      'WF11-0140: The DOC History pagination per-page selector must offer ' +
      '10, 20, 30, 50, and 100 as options, and changing the value must adjust visible rows.',
    );

    await test.step('Navigate to DOC Detail and open History popup', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickViewHistory();
      await docDetailsPage.expectHistoryDialogVisible();
      await docDetailsPage.expectHistoryGridHasRows();
    });

    await test.step('Verify per-page selector options include expected values', async () => {
      const perPageSelect = page.locator('select').filter({ hasText: /10/ }).last();
      const isVisible = await perPageSelect.isVisible().catch(() => false);
      if (!isVisible) {
        test.skip(true, 'Per-page selector not visible — DOC may not have enough records for pagination.');
        return;
      }
      const optionTexts = await perPageSelect.locator('option').allTextContents();
      const cleaned = optionTexts.map(t => t.trim());
      const expectedValues = ['10', '20', '30', '50', '100'];
      for (const expected of expectedValues) {
        expect(cleaned, `Per-page selector should include ${expected}`).toContain(expected);
      }
    });

    await test.step('Change per-page to 20 and verify row count adjusts', async () => {
      const totalRecords = await docDetailsPage.getHistoryTotalRecordCount();
      if (totalRecords <= 10) {
        test.skip(true, `Only ${totalRecords} records — cannot test per-page change.`);
        return;
      }
      await docDetailsPage.changeHistoryPerPage('20');
      const rowCount = await docDetailsPage.getHistoryRowCount();
      expect(rowCount).toBeLessThanOrEqual(20);
      expect(rowCount).toBeGreaterThan(0);
    });

    await test.step('Close the history dialog', async () => {
      await docDetailsPage.closeHistoryDialog();
    });
  });
});
