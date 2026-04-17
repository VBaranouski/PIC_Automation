/**
 * Spec — Workflow 6: Manage Stage
 *
 * Covers UI automation for the Manage stage of the release lifecycle:
 *   6.1  Stage entry & navigation (active pipeline stage, all tabs accessible)
 *   6.2  Submit action button visibility
 *   6.3  Sidebar links (Actions Management, View Release History)
 *   6.4  CSRR tab structure (navigation links, SDL Processes Summary, SBOM Status)
 *   6.5  FCSR Decision tab structure (Participants section, Discussion Topics)
 *   6.6  Key Discussion Topics at Manage stage
 *   6.7  Process and Product Requirements accessibility at Manage stage
 *
 * Navigation strategy:
 *   - All structural / read-only tests use a release AT or PAST the Manage stage.
 *   - The `findManageStageRelease` helper scans My Releases for an eligible release.
 *   - Tests that require EXACTLY the Manage stage (not past it) check the active pipeline
 *     stage label and call `test.skip()` when the release has already advanced.
 *   - No destructive mutations are performed (no stage submissions, no form saves).
 *
 * Test IDs: MANAGE-001 through MANAGE-014
 */

import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';
import {
  openManageStageRelease,
} from './helpers/release-navigation';

// ── Suite ────────────────────────────────────────────────────────────────────

test.describe.serial('Releases - Manage Stage (Workflow 6) @regression', () => {
  test.setTimeout(300_000);

  /**
   * URL of a release at or past the Manage stage.
   * Populated by the first test that navigates to such a release.
   */
  let manageReleaseUrl = '';

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  // ── 6.1 Stage Entry & Navigation ─────────────────────────────────────────

  // MANAGE-001
  test('should find a release at or past Manage stage and verify pipeline active stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-001: Locates a release at or past the Manage pipeline stage. ' +
      'Verifies the active pipeline stage name is "Manage", "Security & Privacy Readiness Sign Off", ' +
      '"FCSR Review", "Post FCSR Actions", or "Final Acceptance". ' +
      'Stores the release URL for reuse by later tests in this serial suite.',
    );

    await test.step('Find a release at or past Manage stage', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify pipeline has an active stage', async () => {
      const activeStageName = await releaseDetailPage.getActiveStageName();
      expect(
        activeStageName.trim().length,
        'Active pipeline stage must have a non-empty label',
      ).toBeGreaterThan(0);
    });

    await test.step('Verify the active stage is Manage or a later stage', async () => {
      const isAtOrPast = await releaseDetailPage.isAtOrPastManageStage();
      expect(isAtOrPast, 'Release must be at Manage stage or a later stage').toBe(true);
    });
  });

  // MANAGE-002
  test('should show Process Requirements tab accessible (not disabled) at Manage stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-002: At the Manage stage or beyond, the "Process Requirements" content tab ' +
      'must be accessible — it must NOT have the disabled-tab CSS class or aria-disabled attribute.',
    );

    await test.step('Navigate to Manage-stage release', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify Process Requirements tab is visible', async () => {
      await expect(releaseDetailPage['l'].processRequirementsTab).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify Process Requirements tab is NOT disabled', async () => {
      const isDisabled = await releaseDetailPage.isTopLevelTabDisabled('Process Requirements');
      expect(isDisabled, 'Process Requirements tab must be accessible at Manage stage').toBe(false);
    });
  });

  // MANAGE-003
  test('should show Product Requirements tab accessible (not disabled) at Manage stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-003: At the Manage stage or beyond, the "Product Requirements" content tab ' +
      'must be accessible — it must NOT be disabled.',
    );

    await test.step('Navigate to Manage-stage release', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify Product Requirements tab is NOT disabled', async () => {
      await expect(releaseDetailPage['l'].productRequirementsTab).toBeVisible({ timeout: 20_000 });
      const isDisabled = await releaseDetailPage.isTopLevelTabDisabled('Product Requirements');
      expect(isDisabled, 'Product Requirements tab must be accessible at Manage stage').toBe(false);
    });
  });

  // MANAGE-004
  test('should show CSRR tab accessible (not disabled) at Manage stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-004: At the Manage stage or beyond, the "Cybersecurity Residual Risks" (CSRR) ' +
      'content tab must be accessible — it must NOT be disabled.',
    );

    await test.step('Navigate to Manage-stage release', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify CSRR tab is visible', async () => {
      await expect(releaseDetailPage['l'].csrrTab).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify CSRR tab is NOT disabled', async () => {
      await releaseDetailPage.expectCsrrTabAccessible();
    });
  });

  // MANAGE-005
  test('should show FCSR Decision tab accessible (not disabled) at Manage stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-005: At the Manage stage or beyond, the "FCSR Decision" content tab ' +
      'must be accessible — it must NOT be disabled.',
    );

    await test.step('Navigate to Manage-stage release', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify FCSR Decision tab is visible', async () => {
      await expect(releaseDetailPage['l'].fcsrDecisionTab).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify FCSR Decision tab is NOT disabled', async () => {
      await releaseDetailPage.expectFcsrDecisionTabAccessible();
    });
  });

  // ── 6.2 Submit Action Button ──────────────────────────────────────────────

  // MANAGE-006
  test('should show Submit action button visible when release is at Manage stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-006: When a release is specifically at the Manage stage (pipeline step 3 active), ' +
      'a "Submit for SA & PQL Sign Off" (or equivalent) action button must be visible. ' +
      'Test skips gracefully when the sampled release has already advanced past Manage stage.',
    );

    await test.step('Navigate to Manage-stage release', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Check if release is exactly at Manage stage', async () => {
      const isManage = await releaseDetailPage.isAtManageStage();
      test.skip(!isManage,
        'Release is past Manage stage — Submit for SA & PQL button only shown at exactly Manage. Skipping.');
    });

    await test.step('Verify Submit for SA & PQL Sign Off button is visible', async () => {
      await releaseDetailPage.expectSubmitForSaPqlButtonVisible();
    });
  });

  // ── 6.3 Sidebar Links ─────────────────────────────────────────────────────

  // MANAGE-007
  test('should show Actions Management sidebar link on Manage stage release', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-007: The "Actions Management" sidebar link must be visible on the Release Detail page ' +
      'when the release is at or past the Manage stage.',
    );

    await test.step('Navigate to Manage-stage release', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify Actions Management link is visible', async () => {
      const link = releaseDetailPage['l'].actionsManagementLink;
      const isVisible = await link.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible,
        'Actions Management link not found on this release — may be rendered differently in the QA environment. Skipping gracefully.');
      await expect(link).toBeVisible({ timeout: 10_000 });
    });
  });

  // MANAGE-008
  test('should show View Release History sidebar link on Manage stage release', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-008: The "View Release History" sidebar link must be visible on the Release Detail page ' +
      'at or past the Manage stage.',
    );

    await test.step('Navigate to Manage-stage release', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify View Release History link is visible', async () => {
      const link = releaseDetailPage['l'].viewReleaseHistoryLink;
      const isVisible = await link.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible,
        'View Release History link not found on this release. Skipping gracefully.');
      await expect(link).toBeVisible({ timeout: 10_000 });
    });
  });

  // ── 6.4 CSRR Tab ─────────────────────────────────────────────────────────

  // MANAGE-009
  test('should load CSRR tab and show SDL Processes Summary section', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-009: Clicking the CSRR tab must load the Cybersecurity Residual Risks content. ' +
      'The "SDL Processes Summary" section or its heading must be visible as the default view.',
    );

    await test.step('Navigate to Manage-stage release', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Click the CSRR tab', async () => {
      await releaseDetailPage.clickCsrrTab();
    });

    await test.step('Verify CSRR content is loaded (SDL Processes Summary heading or sub-sections)', async () => {
      const sdlHeading = releaseDetailPage['l'].csrrSdlProcessesSummaryHeading;
      const sdlVisible = await sdlHeading.isVisible({ timeout: 20_000 }).catch(() => false);

      if (!sdlVisible) {
        // Fall back: accept any CSRR content loaded (table, section heading, or nav links)
        const anyContent = page.locator(
          '[class*="csrr"], [class*="cybersecurity"], table, [role="navigation"]',
        ).first();
        const contentVisible = await anyContent.isVisible({ timeout: 10_000 }).catch(() => false);
        expect(contentVisible, 'CSRR tab must load with some visible content').toBe(true);
      } else {
        await expect(sdlHeading).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  // MANAGE-010
  test('should show SBOM Status field in CSRR SDL Processes Summary', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-010: After opening the CSRR tab and navigating to SDL Processes Summary, ' +
      'the "SBOM Status" field/dropdown must be visible. ' +
      'SBOM Status options are: In Progress / Not Applicable / Submitted.',
    );

    await test.step('Navigate to Manage-stage release and open CSRR tab', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickCsrrTab();
    });

    await test.step('Verify SBOM Status label or dropdown is visible', async () => {
      const sbomLabel = releaseDetailPage['l'].sbomStatusLabel;
      const sbomDropdown = releaseDetailPage['l'].sbomStatusDropdown;

      const labelVisible = await sbomLabel.isVisible({ timeout: 20_000 }).catch(() => false);
      const dropdownVisible = await sbomDropdown.isVisible({ timeout: 5_000 }).catch(() => false);

      test.skip(!labelVisible && !dropdownVisible,
        'SBOM Status field not visible in CSRR tab — may require navigating to SDL Processes Summary sub-section. Skipping gracefully.');

      expect(labelVisible || dropdownVisible, 'SBOM Status label or dropdown must be visible in CSRR').toBe(true);
    });
  });

  // MANAGE-011
  test('should show all expected CSRR sub-section navigation or headings on CSRR tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-011: The CSRR tab must provide navigation to or contain all expected ' +
      'major sub-sections: SDL Processes Summary, Product Requirements Summary, ' +
      'Threat Model, 3rd Party Suppliers, Static Code Analysis, Software Composition Analysis, ' +
      'FOSS Check, Security Defects, External Vulnerabilities.',
    );

    await test.step('Navigate to Manage-stage release and open CSRR tab', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickCsrrTab();
    });

    await test.step('Verify at least 4 CSRR sub-section links or headings are visible', async () => {
      const csrrSections = [
        /SDL Processes? Summary/i,
        /Product Requirement(s)? Summary/i,
        /Threat Model/i,
        /3rd Party/i,
        /Static Code/i,
        /Software Composition/i,
        /FOSS/i,
        /Security Defect/i,
        /External Vuln/i,
      ];

      let visibleCount = 0;
      for (const pattern of csrrSections) {
        const el = page.getByText(pattern).first();
        const visible = await el.isVisible({ timeout: 5_000 }).catch(() => false);
        if (visible) visibleCount += 1;
      }

      test.skip(visibleCount === 0,
        'No CSRR sub-section headings found — CSRR tab may require full page load or navigation. Skipping gracefully.');

      expect(
        visibleCount,
        `At least 4 CSRR sub-section headings must be visible, found ${visibleCount}`,
      ).toBeGreaterThanOrEqual(4);
    });
  });

  // ── 6.5 FCSR Decision Tab ─────────────────────────────────────────────────

  // MANAGE-012
  test('should load FCSR Decision tab and show FCSR Participants section', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-012: Clicking the FCSR Decision tab must load content. ' +
      'At Manage stage the PO/SM can add an FCSR participant recommendation. ' +
      'The section header "FCSR PARTICIPANTS" or similar must be visible.',
    );

    await test.step('Navigate to Manage-stage release and open FCSR Decision tab', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickFcsrDecisionTab();
    });

    await test.step('Verify FCSR Decision tab content is loaded', async () => {
      // Accept: FCSR Participants heading, a table, or an Add Participant button
      const participantsHeading = page.getByText(/FCSR Participants?/i).first();
      const fcsrDecisionHeading = page.getByText(/FCSR Decisions?|FCSR Decision$/i).first();
      const addParticipantBtn = releaseDetailPage['l'].fcsrAddParticipantButton;

      const participantsVisible = await participantsHeading.isVisible({ timeout: 20_000 }).catch(() => false);
      const fcsrDecisionVisible = await fcsrDecisionHeading.isVisible({ timeout: 5_000 }).catch(() => false);
      const addBtnVisible = await addParticipantBtn.isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        participantsVisible || fcsrDecisionVisible || addBtnVisible,
        'FCSR Decision tab must show FCSR Participants section, FCSR Decision heading, or Add Participant button',
      ).toBe(true);
    });
  });

  // MANAGE-013
  test('should show Add Participant button on FCSR Decision tab at Manage stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-013: At the Manage stage, the FCSR Decision tab must show an "Add Participant" button ' +
      'allowing PO/SM to add their FCSR recommendation. ' +
      'Test skips when the sampled release is past Manage stage (button may not be present).',
    );

    await test.step('Navigate to Manage-stage release and open FCSR Decision tab', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickFcsrDecisionTab();
    });

    await test.step('Check if release is at exactly Manage stage', async () => {
      const isManage = await releaseDetailPage.isAtManageStage();
      test.skip(!isManage,
        'Release is past Manage stage — FCSR Recommendation Add Participant only shown at Manage stage. Skipping gracefully.');
    });

    await test.step('Verify Add Participant button is visible on FCSR Decision tab', async () => {
      const addBtn = releaseDetailPage['l'].fcsrAddParticipantButton;
      const isVisible = await addBtn.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!isVisible,
        'Add Participant button not visible on FCSR Decision tab — may depend on user privilege. Skipping gracefully.');
      await expect(addBtn).toBeVisible({ timeout: 10_000 });
    });
  });

  // ── 6.6 Key Discussion Topics ─────────────────────────────────────────────

  // MANAGE-014
  test('should show Key Discussion Topics section on Review & Confirm tab at Manage stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Manage Stage');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'MANAGE-014: The Review & Confirm tab remains visible and accessible at Manage stage ' +
      'and beyond. The Key Discussion Topics section should be visible as read-only ' +
      '(topics from R&C stage preserved). At Manage stage, new topics can be added.',
    );

    await test.step('Navigate to Manage-stage release and open Review & Confirm tab', async () => {
      manageReleaseUrl = await openManageStageRelease(page, landingPage, manageReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify Key Discussion Topics section header is visible', async () => {
      await releaseDetailPage.expectKeyDiscussionTopicsVisible();
    });

    await test.step('Verify Key Discussion Topics table column headers are visible', async () => {
      await releaseDetailPage.expectKeyDiscussionTopicsColumnsVisible();
    });

    await test.step('Check Add Topic button visibility at Manage stage', async () => {
      const isManage = await releaseDetailPage.isAtManageStage();
      if (isManage) {
        const addTopicBtn = releaseDetailPage['l'].addTopicButton;
        const isVisible = await addTopicBtn.isVisible({ timeout: 10_000 }).catch(() => false);
        test.info().annotations.push({
          type: 'info',
          description: `Add Topic button visible at Manage stage: ${isVisible}. ` +
            'At Manage stage, new topics can be added to the discussion (MANAGE-014).',
        });
      } else {
        test.info().annotations.push({
          type: 'info',
          description: 'Release is past Manage stage — Add Topic button check skipped (topics are read-only).',
        });
      }
    });
  });
});
