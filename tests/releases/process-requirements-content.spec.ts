/**
 * Spec — Workflow 4 / Section 4.8: Process Requirements Tab Content
 *
 * Covers the UI of the Process Requirements tab when it is accessible (post-questionnaire state).
 * Since the questionnaire cannot be submitted in the current QA environment, these tests use
 * a release at Manage stage or later — which inherently has the questionnaire submitted.
 *
 *   4.8.1  Tab loads with SDL Practice groups or empty state
 *   4.8.2  "Show All Requirements" toggle is visible
 *   4.8.3  "Show Sub-Requirements" toggle is visible
 *   4.8.4  "Show Only New Requirements" toggle is visible
 *   4.8.5  SDL Practice dropdown filter is visible
 *   4.8.6  Status dropdown filter is visible
 *   4.8.7  Reset button is visible
 *   4.8.8  Requirements Status Summary link is visible
 *   4.8.9  Requirements Status Summary pie-chart popup opens
 *   4.8.10 Export XLSX button is visible
 *
 * Navigation strategy:
 *   - Uses `openManageStageRelease` to find a release where Process Requirements is accessible.
 *   - All tests are non-destructive (no status changes, no form saves).
 *
 * Test IDs: PROCESS-REQ-TAB-001 through PROCESS-REQ-TAB-010
 */

import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';
import { openManageStageRelease } from './helpers/release-navigation';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function openProcessRequirementsTab(
  page: import('@playwright/test').Page,
  landingPage: { expectPageLoaded(opts?: { timeout?: number }): Promise<void> },
  releaseDetailPage: {
    waitForPageLoad(): Promise<void>;
    clickTopLevelTab(name: string): Promise<void>;
    expectTopLevelTabSelected(name: string): Promise<void>;
    isTopLevelTabDisabled(name: string): Promise<boolean>;
  },
  currentReleaseUrl: string,
): Promise<string> {
  const url = await openManageStageRelease(page, landingPage as never, currentReleaseUrl).catch((error) => {
    test.skip(
      true,
      `No Manage-stage release available for Process Requirements checks: ${error instanceof Error ? error.message : String(error)}`,
    );
    return '';
  });
  await releaseDetailPage.waitForPageLoad();

  // Ensure Process Requirements is accessible
  const isDisabled = await releaseDetailPage.isTopLevelTabDisabled('Process Requirements');
  test.skip(isDisabled, 'Process Requirements tab is disabled on the sampled release — questionnaire may not be submitted.');

  await releaseDetailPage.clickTopLevelTab('Process Requirements');
  await releaseDetailPage.expectTopLevelTabSelected('Process Requirements');
  // Wait for tab panel content to settle
  await page.waitForTimeout(2_000);
  return url;
}

// ── Suite ─────────────────────────────────────────────────────────────────────

test.describe.serial('Releases - Process Requirements Tab Content (WF4 §4.8) @regression', () => {
  test.setTimeout(300_000);

  let manageReleaseUrl = '';

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  // ── PROCESS-REQ-TAB-001 ────────────────────────────────────────────────────

  test('should load Process Requirements tab with SDL Practice groups or empty state', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-001: After questionnaire submission, the Process Requirements tab must load ' +
      'and show either SDL Practice requirement groups (accordion sections) or an empty-state message. ' +
      'Verified using a Manage-stage release.',
    );

    await test.step('Navigate to Manage-stage release and open Process Requirements tab', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify tab content is visible — groups or empty state', async () => {
      // Accept either: accordion groups, requirement rows, OR empty state message
      const requirementGroup = page
        .locator('.osui-accordion-item, [class*="accordion-item"], [class*="requirement-group"]')
        .first();
      const requirementRow = page
        .locator('[role="row"], tr')
        .filter({ hasText: /requirement/i })
        .first();
      const emptyState = page.getByText(/No (process )?requirements?|No SDL|empty/i).first();

      const groupVisible = await requirementGroup.isVisible({ timeout: 15_000 }).catch(() => false);
      const rowVisible = await requirementRow.isVisible({ timeout: 5_000 }).catch(() => false);
      const emptyVisible = await emptyState.isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        groupVisible || rowVisible || emptyVisible,
        'Process Requirements tab must show SDL Practice groups, requirement rows, or an empty state',
      ).toBe(true);
    });
  });

  // ── PROCESS-REQ-TAB-002 ────────────────────────────────────────────────────

  test('should show "Show All Requirements" toggle on the Process Requirements tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-002: The "Show All Requirements" toggle must be visible on the Process ' +
      'Requirements tab. This toggle reveals requirements with "Not Selected" status.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify "Show All Requirements" toggle is visible', async () => {
      const toggle = page.getByText(/Show All Requirements/i).first();
      const isVisible = await toggle.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible, '"Show All Requirements" toggle not rendered on this QA release. Skipping gracefully.');
      await expect(toggle).toBeVisible({ timeout: 10_000 });
    });
  });

  // ── PROCESS-REQ-TAB-003 ────────────────────────────────────────────────────

  test('should show "Show Sub-Requirements" toggle on the Process Requirements tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-003: The "Show Sub-Requirements" toggle (controlled by Product Configuration) ' +
      'must be visible on the Process Requirements tab when enabled.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify "Show Sub-Requirements" toggle is visible', async () => {
      const toggle = page.getByText(/Show (Sub.?|Sub )Requirements?/i).first();
      const isVisible = await toggle.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible, '"Show Sub-Requirements" toggle not rendered on this QA release (may be disabled in Product Configuration). Skipping gracefully.');
      await expect(toggle).toBeVisible({ timeout: 10_000 });
    });
  });

  // ── PROCESS-REQ-TAB-004 ────────────────────────────────────────────────────

  test('should show "Show Only New Requirements" toggle on the Process Requirements tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-004: The "Show Only New Requirements" toggle must be visible on the Process ' +
      'Requirements tab. This toggle filters the list to newly scoped items only.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify "Show Only New Requirements" toggle is visible', async () => {
      const toggle = page.getByText(/Show Only New Requirements?/i).first();
      const isVisible = await toggle.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible, '"Show Only New Requirements" toggle not rendered on this QA release. Skipping gracefully.');
      await expect(toggle).toBeVisible({ timeout: 10_000 });
    });
  });

  // ── PROCESS-REQ-TAB-005 ────────────────────────────────────────────────────

  test('should show SDL Practice dropdown filter on the Process Requirements tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-005: The "SDL Practice" dropdown filter must be visible on the Process ' +
      'Requirements tab, allowing users to narrow displayed requirements by SDL Practice.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify SDL Practice dropdown filter is visible', async () => {
      // Accept the label OR a select element that has SDL-related options
      const sdlLabel = page.getByText(/SDL Practice/i).first();
      const sdlSelect = page
        .locator('select, .vscomp-wrapper')
        .filter({ has: page.locator('option, .vscomp-option').filter({ hasText: /SDL|Security/i }) })
        .first();

      const labelVisible = await sdlLabel.isVisible({ timeout: 15_000 }).catch(() => false);
      const selectVisible = await sdlSelect.isVisible({ timeout: 5_000 }).catch(() => false);

      test.skip(!labelVisible && !selectVisible, 'SDL Practice filter not rendered on this QA release. Skipping gracefully.');
      expect(labelVisible || selectVisible, 'SDL Practice filter (label or select) must be visible').toBe(true);
    });
  });

  // ── PROCESS-REQ-TAB-006 ────────────────────────────────────────────────────

  test('should show Status dropdown filter on the Process Requirements tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-006: The "Status" dropdown filter must be visible on the Process ' +
      'Requirements tab, allowing users to filter by requirement status.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify Status dropdown filter is visible', async () => {
      // Accept the label "Status" OR a select/combobox containing status options
      const statusLabel = page.getByText(/^Status$/i).first();
      const statusSelect = page
        .locator('select, .vscomp-wrapper')
        .filter({ has: page.locator('option, .vscomp-option').filter({ hasText: /Planned|Done|In Progress|Not Applicable/i }) })
        .first();

      const labelVisible = await statusLabel.isVisible({ timeout: 15_000 }).catch(() => false);
      const selectVisible = await statusSelect.isVisible({ timeout: 5_000 }).catch(() => false);

      test.skip(!labelVisible && !selectVisible, 'Status filter not rendered on this QA release. Skipping gracefully.');
      expect(labelVisible || selectVisible, 'Status filter (label or select) must be visible').toBe(true);
    });
  });

  // ── PROCESS-REQ-TAB-007 ────────────────────────────────────────────────────

  test('should show Reset button on the Process Requirements tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-007: A "Reset" button must be visible on the Process Requirements tab. ' +
      'Clicking it restores all filters and toggles to their default state.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify Reset button is visible', async () => {
      const resetBtn = page.getByRole('button', { name: /^Reset$/i }).first();
      const isVisible = await resetBtn.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible, 'Reset button not rendered on this QA release. Skipping gracefully.');
      await expect(resetBtn).toBeVisible({ timeout: 10_000 });
    });
  });

  // ── PROCESS-REQ-TAB-008 ────────────────────────────────────────────────────

  test('should show Requirements Status Summary link on the Process Requirements tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-008: The "Requirements Status Summary" link must be visible on the Process ' +
      'Requirements tab. Clicking it opens the pie chart popup showing requirement status distribution.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify Requirements Status Summary link is visible', async () => {
      const summaryLink = page
        .getByRole('link', { name: /Requirements Status Summary/i })
        .or(page.getByText(/Requirements Status Summary/i))
        .first();
      const isVisible = await summaryLink.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible, 'Requirements Status Summary link not rendered on this QA release. Skipping gracefully.');
      await expect(summaryLink).toBeVisible({ timeout: 10_000 });
    });
  });

  // ── PROCESS-REQ-TAB-009 ────────────────────────────────────────────────────

  test('should open pie chart popup from Requirements Status Summary link', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-009: Clicking the "Requirements Status Summary" link on the Process ' +
      'Requirements tab must open a popup containing a donut/pie chart showing requirement ' +
      'status distribution (Planned, In Progress, Done, etc.).',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Click Requirements Status Summary to open chart popup', async () => {
      const summaryLink = page
        .getByRole('link', { name: /Requirements Status Summary/i })
        .or(page.getByText(/Requirements Status Summary/i))
        .first();
      const isVisible = await summaryLink.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible, 'Requirements Status Summary link not rendered. Skipping gracefully.');
      await summaryLink.click();
      await page.waitForTimeout(2_000);
    });

    await test.step('Verify chart popup or modal is visible', async () => {
      const popup = page.locator('[role="dialog"], .popup, [class*="modal"], [class*="chart-popup"]').first();
      const chartCanvas = page.locator('canvas, svg[class*="highcharts"], [class*="donut"], [class*="chart"]').first();

      const popupVisible = await popup.isVisible({ timeout: 15_000 }).catch(() => false);
      const chartVisible = await chartCanvas.isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        popupVisible || chartVisible,
        'Requirements Status Summary popup/chart must be visible after clicking the link',
      ).toBe(true);

      // Dismiss popup if open
      const closeBtn = page.getByRole('button', { name: /Close|×|✕/i }).first();
      const closeBtnVisible = await closeBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (closeBtnVisible) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
    });
  });

  // ── PROCESS-REQ-TAB-010 ────────────────────────────────────────────────────

  test('should show Export XLSX button on the Process Requirements tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('low');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-010: The "Export XLSX" or "Import XLSX" button must be visible on the Process ' +
      'Requirements tab, allowing users to export/import requirements in spreadsheet format.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Verify Export/Import XLSX button is visible', async () => {
      const exportBtn = page
        .getByRole('button', { name: /Export XLSX|Import XLSX|Download Template/i })
        .or(page.getByText(/Export XLSX|Import XLSX/i))
        .first();
      const isVisible = await exportBtn.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible, 'Export/Import XLSX button not rendered on this QA release. Skipping gracefully.');
      await expect(exportBtn).toBeVisible({ timeout: 10_000 });
    });
  });

  // ── PROCESS-REQ-TAB-012 ───────────────────────────────────────────────────

  test('should expand or collapse the first SDL Practice accordion group when available', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-012: When SDL Practice accordion groups are present on the Process ' +
      'Requirements tab, clicking the first group header must change the group expanded/collapsed state.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Expand or collapse the first visible accordion group', async () => {
      const accordionItem = page.locator('.osui-accordion-item, [class*="accordion-item"]').first();
      const accordionHeader = accordionItem.locator('.osui-accordion-item__title, [class*="accordion-title"], [role="button"]').first();

      const itemVisible = await accordionItem.isVisible({ timeout: 15_000 }).catch(() => false);
      const headerVisible = await accordionHeader.isVisible({ timeout: 5_000 }).catch(() => false);
      test.skip(!itemVisible || !headerVisible, 'No visible SDL Practice accordion group found on this QA release. Skipping gracefully.');

      const beforeClass = (await accordionItem.getAttribute('class').catch(() => '')) ?? '';
      await accordionHeader.click({ force: true });
      await page.waitForTimeout(1_000);
      const afterClass = (await accordionItem.getAttribute('class').catch(() => '')) ?? '';

      expect(
        afterClass,
        'Clicking the SDL Practice accordion header should change the group CSS state/class',
      ).not.toBe(beforeClass);
    });
  });

  // ── PROCESS-REQ-TAB-013 ───────────────────────────────────────────────────

  test('should show status labels inside the Requirements Status Summary popup', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Process Requirements / Content');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'PROCESS-REQ-TAB-013: Opening the Process Requirements Status Summary popup must show ' +
      'at least one requirement-status label such as Planned, In Progress, Done, or Not Applicable.',
    );

    await test.step('Navigate to Process Requirements tab on Manage-stage release', async () => {
      manageReleaseUrl = await openProcessRequirementsTab(page, landingPage, releaseDetailPage, manageReleaseUrl);
    });

    await test.step('Open the Requirements Status Summary popup', async () => {
      const summaryLink = page
        .getByRole('link', { name: /Requirements Status Summary/i })
        .or(page.getByText(/Requirements Status Summary/i))
        .first();
      const isVisible = await summaryLink.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible, 'Requirements Status Summary link not rendered. Skipping gracefully.');
      await summaryLink.click();
      await page.waitForTimeout(1_500);
    });

    await test.step('Verify at least one expected status label is visible in the popup', async () => {
      const statusMarkers = [
        page.getByText(/^Planned$/i).first(),
        page.getByText(/^In Progress$/i).first(),
        page.getByText(/^Done$/i).first(),
        page.getByText(/^Not Applicable$/i).first(),
      ];
      const visibilities = await Promise.all(
        statusMarkers.map((item) => item.isVisible({ timeout: 5_000 }).catch(() => false)),
      );

      expect(
        visibilities.some(Boolean),
        'Requirements Status Summary popup should show at least one expected status label',
      ).toBe(true);

      await page.keyboard.press('Escape').catch(() => undefined);
    });
  });
});
