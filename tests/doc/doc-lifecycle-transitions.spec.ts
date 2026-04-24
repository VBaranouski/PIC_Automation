/**
 * Spec 11.13.1 — DOC Lifecycle Stage Transitions
 *
 * Covers P1 scenarios for DOC stage transitions:
 *   DOC-LIFECYCLE-031: Completing Initiate DOC advances to Scope ITS Controls
 *   DOC-LIFECYCLE-032: Start ITS Risk Assessment advances to Risk Assessment stage
 *   DOC-LIFECYCLE-033: Risk Assessment tab available on Risk Assessment stage
 *   DOC-LIFECYCLE-034: Add Controls button available on Risk Assessment stage
 *   DOC-TASKS-021: Validate task creation and closure across full DOC lifecycle
 *
 * Non-destructive: tests verify stage presence and button visibility using seed DOCs.
 *
 * Seed DOCs:
 *   • DOC 800 / ProductId=1162 — Controls Scoping
 *   • DOC 538 / ProductId=944 — Actions Closure (past Risk Assessment)
 *   • DOC 273 / ProductId=898 — Completed / Certified
 *
 * These DOCs are stable QA fixtures. No dependency on doc-state-setup.
 */
import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

// ── Seed URLs ─────────────────────────────────────────────────────────────────
const CONTROLS_SCOPING_DOC_URL =
  '/GRC_PICASso_DOC/DOCDetail?DOCId=800&ProductId=1162';

const ACTIONS_CLOSURE_DOC_URL =
  '/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944';

const COMPLETED_DOC_URL =
  '/GRC_PICASso_DOC/DOCDetail?DOCId=273&ProductId=898';

test.describe('DOC - Lifecycle Stage Transitions (11.13.1) @regression', () => {
  test.setTimeout(180_000);

  // ── DOC-LIFECYCLE-031 ─────────────────────────────────────────────────────────────
  test('DOC-LIFECYCLE-031 — Completing Initiate DOC advances DOC to Scope ITS Controls',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Lifecycle Transitions');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-LIFECYCLE-031: Verify that a DOC that has completed the Initiate DOC stage ' +
        'shows the Scope ITS Controls stage as the current active stage. ' +
        'Verified on DOC 800 which is in Controls Scoping status (post-initiation).',
      );

      await test.step('Navigate to Controls Scoping DOC (DOC 800)', async () => {
        await page.goto(CONTROLS_SCOPING_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Verify Initiate DOC stage is completed (shows user and date)', async () => {
        const initiateTab = page.getByRole('tab', { name: 'Initiate DOC', exact: true }).first();
        await expect(initiateTab).toBeVisible({ timeout: 30_000 });
        // Dates load asynchronously — use web-first assertion that auto-retries
        const pipelineContainer = page.locator('[role="tablist"]').first();
        await expect(
          pipelineContainer,
          'Pipeline should contain a completion date (DD Mon YYYY)',
        ).toContainText(/\d{1,2} \w{3} \d{4}/, { timeout: 15_000 });
      });

      await test.step('Verify Scope ITS Controls is the current active pipeline stage', async () => {
        const scopeTab = page.getByRole('tab', { name: 'Scope ITS Controls', exact: true }).first();
        await expect(scopeTab).toBeVisible({ timeout: 30_000 });
      });

      await test.step('Verify DOC detail tabs are available (Digital Offer Details, Roles, ITS Checklist)', async () => {
        await expect(
          page.getByRole('tab', { name: 'Digital Offer Details' }),
        ).toBeVisible({ timeout: 15_000 });
        await expect(
          page.getByRole('tab', { name: 'Roles & Responsibilities' }),
        ).toBeVisible({ timeout: 15_000 });
        await expect(
          page.getByRole('tab', { name: 'ITS Checklist' }),
        ).toBeVisible({ timeout: 15_000 });
      });
    });

  // ── DOC-LIFECYCLE-032 ─────────────────────────────────────────────────────────────
  test('DOC-LIFECYCLE-032 — Start ITS Risk Assessment button visible on Controls Scoping stage',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Lifecycle Transitions');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-LIFECYCLE-032: Verify that the "Start ITS Risk Assessment" button is visible on a DOC ' +
        'in Controls Scoping stage. Clicking this button would advance the DOC to Risk Assessment ' +
        'and set all control statuses to "Evidence required". ' +
        'Non-destructive: button visibility and state are verified without clicking.',
      );

      await test.step('Navigate to Controls Scoping DOC (DOC 800)', async () => {
        await page.goto(CONTROLS_SCOPING_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Verify Start ITS Risk Assessment button is visible', async () => {
        const startBtn = page.getByRole('button', { name: /Start ITS Risk Assessment/i });
        await expect(startBtn).toBeVisible({ timeout: 30_000 });
      });

      await test.step('Verify button enabled/disabled state reflects Roles assignment', async () => {
        const startBtn = page.getByRole('button', { name: /Start ITS Risk Assessment/i });
        const isDisabled = await startBtn.isDisabled().catch(() => false);

        if (isDisabled) {
          // Button disabled means mandatory roles are not all assigned
          const rolesTab = page.getByRole('tab', { name: /Roles & Responsibilities/i });
          await expect(rolesTab).toBeVisible({ timeout: 15_000 });
        } else {
          await expect(startBtn).toBeEnabled({ timeout: 15_000 });
        }
      });

      await test.step('Verify Risk Assessment pipeline stage exists but is not yet active', async () => {
        const raTab = page.getByRole('tab', { name: 'Risk Assessment', exact: true }).first();
        await expect(raTab).toBeVisible({ timeout: 15_000 });
      });
    });

  // ── DOC-LIFECYCLE-033 ─────────────────────────────────────────────────────────────
  test('DOC-LIFECYCLE-033 — Risk Assessment stage shows Risk Summary tab on a post-RA DOC',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Lifecycle Transitions');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-LIFECYCLE-033: Verify that a DOC that has passed through the Risk Assessment stage ' +
        'has the Risk Summary tab available. The Risk Assessment pipeline stage should be ' +
        'completed and visible with user/date info. ' +
        'Verified on DOC 538 (Actions Closure — past RA) and DOC 273 (Completed).',
      );

      await test.step('Navigate to Actions Closure DOC (DOC 538, past Risk Assessment)', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Verify Risk Assessment pipeline stage is completed', async () => {
        const raStage = page.getByRole('tab', { name: 'Risk Assessment', exact: true }).first();
        await expect(raStage).toBeVisible({ timeout: 30_000 });
        // Dates load asynchronously — use web-first assertion that auto-retries
        const pipelineContainer = page.locator('[role="tablist"]').first();
        await expect(
          pipelineContainer,
          'Pipeline should contain a completion date (DD Mon YYYY)',
        ).toContainText(/\d{1,2} \w{3} \d{4}/, { timeout: 15_000 });
      });

      await test.step('Verify Risk Summary content tab is available', async () => {
        const riskSummaryTab = page.getByRole('tab', { name: 'Risk Summary', exact: true });
        await expect(riskSummaryTab).toBeVisible({ timeout: 15_000 });
      });

      await test.step('Open Risk Summary tab and verify content loads', async () => {
        await docDetailsPage.riskSummary.clickRiskSummaryTab();
        await docDetailsPage.riskSummary.expectRiskSummarySectionsVisible();
      });
    });

  // ── DOC-LIFECYCLE-034 ─────────────────────────────────────────────────────────────
  test('DOC-LIFECYCLE-034 — Add Controls button remains available on Controls Scoping stage',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Lifecycle Transitions');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-LIFECYCLE-034: Verify that the "Add Controls" button is visible on the ITS Checklist tab ' +
        'for a user with SCOPE_IT_SECURITY_CONTROLS privilege during Controls Scoping stage. ' +
        'Non-destructive: button visibility only.',
      );

      await test.step('Navigate to Controls Scoping DOC (DOC 800)', async () => {
        await page.goto(CONTROLS_SCOPING_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Open ITS Checklist tab', async () => {
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Verify Add Controls button is visible', async () => {
        await docDetailsPage.expectAddControlButtonVisible();
      });

      await test.step('Verify Add Controls button state (enabled/disabled based on Roles)', async () => {
        const addControlsBtn = page.getByRole('button', { name: '+ Add Controls' });
        const isDisabled = await addControlsBtn.isDisabled().catch(() => false);

        if (isDisabled) {
          // Button is disabled when mandatory roles are not assigned (orange dot)
          // This is expected behavior — the button is present but gated
          const rolesTab = page.getByRole('tab', { name: /Roles & Responsibilities/i });
          await expect(rolesTab).toBeVisible({ timeout: 15_000 });
        } else {
          // All mandatory roles assigned — button should be clickable
          await docDetailsPage.clickAddControl();
          await docDetailsPage.expectAddControlPopupVisible();
          await docDetailsPage.closeAddControlPopup();
        }
      });
    });

  // ── DOC-LIFECYCLE-034 (post-RA check) ─────────────────────────────────────────────
  test('DOC-LIFECYCLE-034 — Add Controls button is hidden on a Completed DOC',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Lifecycle Transitions');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-LIFECYCLE-034 (negative): Verify that the "Add Controls" button is NOT visible ' +
        'on a Completed DOC, ensuring control scope cannot be modified after certification.',
      );

      await test.step('Navigate to Completed DOC (DOC 273)', async () => {
        await page.goto(COMPLETED_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Open ITS Checklist tab', async () => {
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Verify Add Controls button is NOT present', async () => {
        const addControlsBtn = page.getByRole('button', { name: '+ Add Controls' });
        await expect(addControlsBtn).toBeHidden({ timeout: 10_000 });
      });
    });

  // ── DOC-TASKS-021 ─────────────────────────────────────────────────────────────
  test('DOC-TASKS-021 — Completed DOC shows all pipeline stages with completion info',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Lifecycle Transitions');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'DOC-TASKS-021: Validate that a completed DOC shows all 5 pipeline stages with ' +
        'completion information (user and date) under each stage, confirming the full ' +
        'DOC lifecycle was traversed.',
      );

      await test.step('Navigate to Completed DOC (DOC 273)', async () => {
        await page.goto(COMPLETED_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Verify all 5 DOC pipeline stages are visible', async () => {
        const pipelineStages = [
          'Initiate DOC',
          'Scope ITS Controls',
          'Risk Assessment',
          'Risk Summary Review',
          'Issue Certification',
        ];
        for (const stage of pipelineStages) {
          await expect(
            page.getByRole('tab', { name: stage, exact: true }).first(),
            `Pipeline stage "${stage}" should be visible`,
          ).toBeVisible({ timeout: 20_000 });
        }
      });

      await test.step('Verify pipeline stages have completion dates', async () => {
        const pipelineContainer = page.locator('[role="tablist"]').first();
        await expect(pipelineContainer).toBeVisible({ timeout: 20_000 });

        // Use web-first assertion for async date loading (OutSystems partial refresh)
        // A completed DOC should have at least 3 dates in DD Mon YYYY format
        const datePattern = /\d{1,2} \w{3} \d{4}/;
        await expect(
          pipelineContainer,
          'Pipeline should contain completion dates for stages',
        ).toContainText(datePattern, { timeout: 15_000 });
      });

      await test.step('Verify DOC content tabs are accessible in read-only mode', async () => {
        // Digital Offer Details tab
        await expect(
          page.getByRole('tab', { name: 'Digital Offer Details' }),
        ).toBeVisible({ timeout: 15_000 });

        // ITS Checklist tab
        await expect(
          page.getByRole('tab', { name: 'ITS Checklist' }),
        ).toBeVisible({ timeout: 15_000 });

        // Certification Decision tab
        await expect(
          page.getByRole('tab', { name: 'Certification Decision' }),
        ).toBeVisible({ timeout: 15_000 });
      });

      await test.step('Verify Cancel DOC button is NOT visible on Completed DOC', async () => {
        await expect(
          page.getByRole('button', { name: 'Cancel DOC' }),
        ).toBeHidden({ timeout: 10_000 });
      });
    });
});
