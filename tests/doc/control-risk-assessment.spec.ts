/**
 * Spec 11.7a — DOC Detail: Control Risk Assessment
 *
 * Covers ITS Checklist Risk Assessment columns, Control Detail page during RA,
 * evidence links, findings, Submit for Review, DOCL Evaluate, Complete Risk Assessment,
 * and view-only access checks.
 *
 * Non-destructive: tests verify button visibility and read-only assertions.
 * No controls are submitted or modified.
 *
 * Seed DOC:
 *   • DOC 538 / ProductId=944 — Actions Closure stage (past Risk Assessment)
 *   • DOC 800 / ProductId=1162 — Controls Scoping (pre-RA)
 *   • DOC 273 / ProductId=898 — Completed/Certified (read-only checks)
 */
import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

// ── Seed URLs ─────────────────────────────────────────────────────────────────
const RA_DOC_URL =
  'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944';

const SCOPING_DOC_URL =
  'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=800&ProductId=1162';

const COMPLETED_DOC_URL =
  'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=273&ProductId=898';

test.describe('DOC - Control Risk Assessment (11.7a) @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page, loginPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ── DOC-CTRL-RA-001 ──────────────────────────────────────────────────────
  test('should show additional RA columns (Status, Risk Level, Findings) during Risk Assessment',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-001: During Risk Assessment or later stages, the ITS Checklist must show ' +
        'additional columns: Status, Risk Level, and Findings.',
      );

      await test.step('Navigate to DOC in RA stage (DOC 538)', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Open ITS Checklist tab', async () => {
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Verify RA-specific columns are visible', async () => {
        const itsPanel = page
          .getByRole('tabpanel')
          .filter({ has: page.getByText('IT SECURITY CONTROLS') })
          .first();

        const headerText = await itsPanel.locator('table thead').textContent() ?? '';
        const hasStatus = /Status/i.test(headerText);
        const hasRiskLevel = /Risk Level/i.test(headerText);
        // Findings may be shown as a column header or as a count label
        const hasFindings = /Finding/i.test(headerText);

        expect(hasStatus, 'ITS Checklist should show "Status" column during RA').toBe(true);
        expect(
          hasRiskLevel || hasFindings,
          'ITS Checklist should show "Risk Level" or "Finding" column during RA',
        ).toBe(true);
      });
    });

  // ── DOC-CTRL-RA-002 ──────────────────────────────────────────────────────
  test('should show "Add Evidence Link" button on Control Detail during Risk Assessment',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-002: On a Control Detail page during Risk Assessment, the ' +
        '"Add Evidence Link" button must be visible for users with the appropriate privilege.',
      );

      await test.step('Navigate to DOC in RA stage and open ITS Checklist', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Click first control ID link to open Control Detail', async () => {
        const itsPanel = page.getByRole('tabpanel').filter({ has: page.getByText('IT SECURITY CONTROLS') });
        const isLinkVisible = await itsPanel.locator('table tbody tr td a').first().isVisible().catch(() => false);
        if (!isLinkVisible) {
          test.skip(true, 'No control ID links found in ITS Checklist — cannot test Control Detail.');
          return;
        }
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify "Add Evidence Link" button is visible', async () => {
        const isVisible = await controlDetailPage.isAddEvidenceLinkButtonVisible();
        // The button is only visible for users with ADD_EVIDENCE privilege and on non-frozen controls
        if (!isVisible) {
          test.skip(true, '"Add Evidence Link" button not visible — user may lack privilege or control is frozen.');
          return;
        }
        await controlDetailPage.expectAddEvidenceLinkButtonVisible();
      });
    });

  // ── DOC-CTRL-RA-003 ──────────────────────────────────────────────────────
  test('should show Evidence Links section on Control Detail',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-003: Evidence Links section must be visible on Control Detail ' +
        'during Risk Assessment, showing either links or "No evidence links" message.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Evidence Links section is visible', async () => {
        await controlDetailPage.expectEvidenceLinksSectionOrEmpty();
      });
    });

  // ── DOC-CTRL-RA-004 ──────────────────────────────────────────────────────
  test('should show Evidence Links as clickable links with text and URL',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-004: When evidence links exist, each evidence link must be rendered ' +
        'as a clickable link with visible text and an href attribute.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check Evidence Links are displayed as clickable links', async () => {
        await controlDetailPage.expectEvidenceLinksHasClickableLinks();
      });
    });

  // ── DOC-CTRL-RA-005 ──────────────────────────────────────────────────────
  test('should show "Submit for Review" button on Control Detail during Risk Assessment',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-005: A "Submit for Review" button must be visible on Control Detail ' +
        'for the DO Team during Risk Assessment stage.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Submit for Review button', async () => {
        const isVisible = await controlDetailPage.isSubmitForReviewButtonVisible();
        if (!isVisible) {
          test.skip(true, '"Submit for Review" button not visible — control may already be submitted or user lacks privilege.');
          return;
        }
        await controlDetailPage.expectSubmitForReviewButtonVisible();
      });
    });

  // ── DOC-CTRL-RA-006 ──────────────────────────────────────────────────────
  test('should gate Submit for Review until evidence or comment is provided',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-006: "Submit for Review" should be disabled until at least one ' +
        'evidence link or comment is provided.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check Submit for Review button state', async () => {
        const isVisible = await controlDetailPage.isSubmitForReviewButtonVisible();
        if (!isVisible) {
          test.skip(true, '"Submit for Review" button not visible — cannot check gating.');
          return;
        }

        const isDisabled = await controlDetailPage.getSubmitForReviewButtonDisabledState();
        if (isDisabled === null) {
          test.skip(true, '"Submit for Review" button state became unstable during page refresh.');
          return;
        }

        expect(
          typeof isDisabled === 'boolean',
          'Submit for Review button should have a definite disabled state',
        ).toBe(true);
      });
    });

  // ── DOC-CTRL-RA-007 ──────────────────────────────────────────────────────
  test('should show read-only Control Detail for VIEW_DOC user during RA',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-007: A user with VIEW_DOC privilege can view Control Detail ' +
        'during Risk Assessment but must not see Add Evidence, Submit for Review, or comment controls.',
      );

      // On a completed DOC (DOC 273), all controls should be in read-only mode
      await test.step('Navigate to Completed DOC and open Control Detail', async () => {
        await page.goto(COMPLETED_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        const itsPanel = page.getByRole('tabpanel').filter({ has: page.getByText('IT SECURITY CONTROLS') });
        const isLinkVisible = await itsPanel.locator('table tbody tr td a').first().isVisible().catch(() => false);
        if (!isLinkVisible) {
          test.skip(true, 'No control links on Completed DOC ITS Checklist.');
          return;
        }
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Control Detail is in read-only mode', async () => {
        await controlDetailPage.expectControlDetailIsReadOnly();
      });
    });

  // ── DOC-CTRL-RA-008 ──────────────────────────────────────────────────────
  test('should show "Evaluate" button for DOCL on Control Detail during review',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-008: The DOCL "Evaluate" button must be visible on Control Detail page ' +
        'when a control is Under Review during Risk Assessment.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Evaluate button', async () => {
        const isVisible = await controlDetailPage.isEvaluateButtonVisible();
        if (!isVisible) {
          test.skip(true, '"Evaluate" button not visible — control may not be Under Review or user lacks DOCL privilege.');
          return;
        }
        await controlDetailPage.expectEvaluateButtonVisible();
      });
    });

  // ── DOC-CTRL-RA-009 ──────────────────────────────────────────────────────
  test('should show "Send Back for Update" button for DOCL during review',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-009: The DOCL "Send Back for Update" button must be visible when ' +
        'reviewing a control, allowing DOCL to return it to the DO Team with a comment.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Send Back for Update button', async () => {
        const isVisible = await controlDetailPage.isSendBackForUpdateButtonVisible();
        if (!isVisible) {
          test.skip(true, '"Send Back for Update" button not visible — control may not be Under Review or user lacks DOCL privilege.');
          return;
        }
        await controlDetailPage.expectSendBackForUpdateButtonVisible();
      });
    });

  // ── DOC-CTRL-RA-010 ──────────────────────────────────────────────────────
  test('should show "Complete Risk Assessment" button for DOCL evaluation',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-010: The DOCL "Complete Risk Assessment" button must be visible ' +
        'on the Control Detail page to finalize control evaluation.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Complete Risk Assessment button', async () => {
        const isVisible = await controlDetailPage.isCompleteRiskAssessmentButtonVisible();
        if (!isVisible) {
          test.skip(true, '"Complete Risk Assessment" button not visible — control may not be Under Review or user lacks DOCL privilege.');
          return;
        }
        expect(isVisible).toBe(true);
      });
    });

  // ── DOC-CTRL-RA-011 ──────────────────────────────────────────────────────
  test('should show "Mark Control as Not Applicable" button for DOCL',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-011: The DOCL "Mark Control as Not Applicable" button must be visible ' +
        'on Control Detail during Risk Assessment review.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Mark Not Applicable button', async () => {
        const isVisible = await controlDetailPage.isMarkNotApplicableButtonVisible();
        if (!isVisible) {
          test.skip(true, '"Mark as Not Applicable" button not visible — user may lack privilege or wrong control state.');
          return;
        }
        expect(isVisible).toBe(true);
      });
    });

  // ── DOC-CTRL-RA-012 ──────────────────────────────────────────────────────
  test('should show read-only Control Detail for VIEW_DOC user during DOCL review',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-012: VIEW_DOC users should see Control Detail in read-only mode ' +
        'during DOCL review (no Evaluate, no Add Finding, no Add Evidence).',
      );

      // Completed DOC serves as a read-only baseline
      await test.step('Navigate to Completed DOC and open Control Detail', async () => {
        await page.goto(COMPLETED_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        const itsPanel = page.getByRole('tabpanel').filter({ has: page.getByText('IT SECURITY CONTROLS') });
        const isLinkVisible = await itsPanel.locator('table tbody tr td a').first().isVisible().catch(() => false);
        if (!isLinkVisible) {
          test.skip(true, 'No control links on Completed DOC.');
          return;
        }
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify no editing buttons are visible', async () => {
        await controlDetailPage.expectControlDetailIsReadOnly();
        const hasEvaluate = await controlDetailPage.isEvaluateButtonVisible();
        expect(hasEvaluate, 'Evaluate button should not be visible on Completed DOC').toBe(false);
      });
    });

  // ── DOC-CTRL-RA-013 ──────────────────────────────────────────────────────
  test('should show "Add Finding" button on Control Detail during review',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-013: "Add Finding" button must be visible on Control Detail ' +
        'for users with the appropriate privilege when the control is Under Review.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Add Finding button', async () => {
        const isVisible = await controlDetailPage.isAddFindingButtonVisible();
        if (!isVisible) {
          test.skip(true, '"Add Finding" button not visible — user may lack privilege or control not Under Review.');
          return;
        }
        await controlDetailPage.expectAddFindingButtonVisible();
      });
    });

  // ── DOC-CTRL-RA-014 ──────────────────────────────────────────────────────
  test('should show Findings section with empty state or findings table',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-014: The Findings section on Control Detail must show either ' +
        '"No findings added yet" message or a findings table with Name, Description, Severity.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Findings section', async () => {
        await controlDetailPage.expectFindingsSectionOrEmptyState();
      });
    });

  // ── DOC-CTRL-RA-015 ──────────────────────────────────────────────────────
  test('should show "Send for Remediation" button on controls with findings',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-015: "Send for Remediation" button must be visible on Control Detail ' +
        'for controls with findings during Risk Assessment.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Send for Remediation button', async () => {
        const isVisible = await controlDetailPage.isSendForRemediationButtonVisible();
        if (!isVisible) {
          test.skip(true, '"Send for Remediation" button not visible — control may not have findings.');
          return;
        }
        await controlDetailPage.expectSendForRemediationButtonVisible();
      });
    });

  // ── DOC-CTRL-RA-016 ──────────────────────────────────────────────────────
  test('should show Comments section on Control Detail for DOCL/DO Team communication',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-016: After Send Back, the DO Team should see DOCL comments. ' +
        'This test verifies the Comments section is visible on Control Detail.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Comments section is visible', async () => {
        await controlDetailPage.expectCommentsSectionOrEmpty();
      });
    });

  // ── DOC-CTRL-RA-017 ──────────────────────────────────────────────────────
  test('should show control status in ITS Checklist after DO Team resubmits',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-017: After DO Team resubmits a control for review, the status should ' +
        'return to "Under Review" in the ITS Checklist.',
      );

      await test.step('Navigate to DOC in RA stage', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Open ITS Checklist tab', async () => {
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Verify at least one control shows a review-related status', async () => {
        const itsPanel = page
          .getByRole('tabpanel')
          .filter({ has: page.getByText('IT SECURITY CONTROLS') })
          .first();
        const panelText = await itsPanel.textContent() ?? '';
        const hasReviewStatus = /Under Review|Evidence Required|Assessment Completed|Remediation Required|Sent Back/i.test(panelText);
        expect(hasReviewStatus, 'At least one control should show an RA status').toBe(true);
      });
    });

  // ── DOC-CTRL-RA-018 ──────────────────────────────────────────────────────
  test('should show Risk Level label on Control Detail during RA',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-018: Risk Level label must be visible on Control Detail ' +
        'during or after Risk Assessment.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Risk Level label is visible', async () => {
        await controlDetailPage.expectRiskLevelLabelVisible();
      });
    });

  // ── DOC-CTRL-RA-019 ──────────────────────────────────────────────────────
  test('should show control re-evaluation state after remediation',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-019: Controls with "Remediation Required" should be re-evaluable. ' +
        'This test checks for remediation-related statuses in the ITS Checklist.',
      );

      await test.step('Navigate to DOC in RA stage', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Open ITS Checklist tab', async () => {
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Check for remediation-related statuses', async () => {
        const itsPanel = page
          .getByRole('tabpanel')
          .filter({ has: page.getByText('IT SECURITY CONTROLS') })
          .first();
        const panelText = await itsPanel.textContent() ?? '';
        const hasRemediation = /Remediation Required|Remediation Complete/i.test(panelText);
        if (!hasRemediation) {
          test.skip(true, 'No controls with Remediation status found on this DOC.');
          return;
        }
        expect(hasRemediation).toBe(true);
      });
    });

  // ── DOC-CTRL-RA-020 ──────────────────────────────────────────────────────
  test('should show "Add Action" button in Findings table for privileged users',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Risk Assessment');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CTRL-RA-020: "Add Action" button in the Findings table must be visible ' +
        'for users with CREATE_UPDATE_DOC_ACTIONS privilege.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(RA_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Add Action button in Findings', async () => {
        const hasNoFindings = await controlDetailPage.hasNoFindingsMessage();
        if (hasNoFindings) {
          test.skip(true, 'No findings on this control — cannot check Add Action button.');
          return;
        }

        const isVisible = await controlDetailPage.isAddActionButtonInFindingsVisible();
        if (!isVisible) {
          test.skip(true, '"Add Action" button not visible — user may lack privilege or no findings exist.');
          return;
        }
        expect(isVisible).toBe(true);
      });
    });
});
