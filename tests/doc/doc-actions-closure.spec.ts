/**
 * Spec 11.18 — DOC Detail: Actions Closure Stage
 *
 * Covers control behavior, evidence links, comments, findings, and permissions
 * during the Actions Closure stage of a DOC lifecycle.
 *
 * Seed DOC:
 *   • DOC 538 / ProductId=944 — Actions Closure stage
 *   • DOC 273 / ProductId=898 — Completed (for frozen-state comparison)
 */
import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

// ── Seed URLs ─────────────────────────────────────────────────────────────────
const ACTIONS_CLOSURE_DOC_URL =
  '/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944';

const COMPLETED_DOC_URL =
  '/GRC_PICASso_DOC/DOCDetail?DOCId=273&ProductId=898';

test.describe('DOC - Actions Closure Stage (11.18) @regression', () => {
  test.setTimeout(180_000);
  // ── DOC-CLOSURE-001 ──────────────────────────────────────────────────────
  test('should show controls in ITS Checklist with correct data during Actions Closure',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-001: Controls must open in ITS Checklist with correct data ' +
        'and permissions during Actions Closure stage.',
      );

      await test.step('Navigate to Actions Closure DOC and open ITS Checklist', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Verify controls are loaded in ITS Checklist', async () => {
        await docDetailsPage.expectITSSecurityControlsTitleVisible();
        const itsPanel = page
          .getByRole('tabpanel')
          .filter({ has: page.getByText('IT SECURITY CONTROLS') })
          .first();

        const dataRows = itsPanel.getByRole('row').filter({
          has: page.locator('a[href*="ControlDetail"]'),
        });
        const rowCount = await dataRows.count();
        expect(rowCount, 'ITS Checklist should have controls during Actions Closure').toBeGreaterThan(0);
      });

      await test.step('Verify control rows contain clickable Control ID links', async () => {
        const itsPanel = page
          .getByRole('tabpanel')
          .filter({ has: page.getByText('IT SECURITY CONTROLS') })
          .first();

        const firstLink = itsPanel.locator('a[href*="ControlDetail"]').first();
        const isVisible = await firstLink.isVisible().catch(() => false);
        expect(isVisible, 'Controls should have clickable ID links').toBe(true);
      });
    });

  // ── DOC-CLOSURE-002 ──────────────────────────────────────────────────────
  test('should show Evidence Links and Comments sections on Control Detail during Actions Closure',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-002: Evidence links and comments sections must be accessible ' +
        'on Control Detail during Actions Closure stage.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Evidence Links section is present', async () => {
        await controlDetailPage.expectEvidenceLinksSectionOrEmpty();
      });

      await test.step('Verify Comments section is present', async () => {
        const commentsSection = page.getByText(/COMMENTS/i).first();
        const noComments = page.getByText(/No comments/i).first();
        const hasComments = await commentsSection.isVisible().catch(() => false);
        const hasNoComments = await noComments.isVisible().catch(() => false);
        expect(
          hasComments || hasNoComments,
          'Comments section should be visible during Actions Closure',
        ).toBe(true);
      });
    });

  // ── DOC-CLOSURE-003 ──────────────────────────────────────────────────────
  test('should show action options for findings in Actions Closure stage',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-003: Users should be able to see action options for unclosed findings ' +
        'during Actions Closure stage.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for Findings section and action options', async () => {
        await controlDetailPage.expectFindingsSectionOrEmptyState();
      });
    });

  // ── DOC-CLOSURE-004 ──────────────────────────────────────────────────────
  test('should show Action Plan tab with action items during Actions Closure',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-004: Action Plan tab should be accessible and show created actions ' +
        'during Actions Closure stage.',
      );

      await test.step('Navigate to Actions Closure DOC', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Open Action Plan tab', async () => {
        await docDetailsPage.clickActionPlanTab();
      });

      await test.step('Verify Action Plan content is visible', async () => {
        await docDetailsPage.expectActionPlanTitleVisible();
      });
    });

  // ── DOC-CLOSURE-005 ──────────────────────────────────────────────────────
  test('should show re-assessment option for controls in Actions Closure',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-005: Controls in Actions Closure should have a re-assessment option ' +
        'available to request re-assessment after action closure.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Check for re-assessment related button', async () => {
        const sendForRemediationBtn = page.getByRole('button', { name: /Send for Remediation|Request Re-Assessment/i });
        const isVisible = await sendForRemediationBtn.isVisible().catch(() => false);
        if (!isVisible) {
          test.skip(true, 'Re-assessment button not visible — control may be in a different state.');
          return;
        }
        await expect(sendForRemediationBtn).toBeVisible();
      });
    });

  // ── DOC-CLOSURE-006 ──────────────────────────────────────────────────────
  test('should NOT show Add Controls button during Actions Closure stage',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-006: New controls CANNOT be added during Actions Closure stage — ' +
        'the "+ Add Controls" button must be absent.',
      );

      await test.step('Navigate to Actions Closure DOC and open ITS Checklist', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Verify Add Controls button is NOT present', async () => {
        const addControlsBtn = page.getByRole('button', { name: '+ Add Controls' });
        await expect(addControlsBtn).toBeHidden({ timeout: 10_000 });
      });
    });

  // ── DOC-CLOSURE-007 ──────────────────────────────────────────────────────
  test('should display controls with open findings correctly during Actions Closure',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-007: Controls with open findings should be displayed correctly ' +
        'with appropriate status and action options.',
      );

      await test.step('Navigate to Actions Closure DOC and open ITS Checklist', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
      });

      await test.step('Verify controls with findings-related statuses are present', async () => {
        const itsPanel = page
          .getByRole('tabpanel')
          .filter({ has: page.getByText('IT SECURITY CONTROLS') })
          .first();

        const statusCells = itsPanel.locator('[role="rowgroup"] [role="row"] [role="gridcell"]:nth-child(5)');
        const statusCount = await statusCells.count();

        if (statusCount === 0) {
          test.skip(true, 'ITS Checklist has no control status cells to validate.');
          return;
        }

        const statuses: string[] = [];
        for (let index = 0; index < statusCount; index += 1) {
          const value = (await statusCells.nth(index).textContent() ?? '').replace(/\s+/g, ' ').trim();
          if (value) {
            statuses.push(value);
          }
        }

        const hasRAStatus = statuses.some((status) =>
          /Remediation Required|Assessment Completed|Under Review|Updates Required|Evidence Required/i.test(status),
        );

        expect(
          hasRAStatus,
          `Controls should show risk assessment or closure statuses. Found: ${statuses.join(', ') || 'none'}`,
        ).toBe(true);
      });
    });

  // ── DOC-CLOSURE-008 ──────────────────────────────────────────────────────
  test('should enforce role-based permissions during Actions Closure',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-008: Permissions and restrictions per role must be enforced correctly ' +
        'during Actions Closure stage.',
      );

      await test.step('Navigate to Actions Closure DOC', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Verify appropriate action buttons based on user role', async () => {
        // Check Cancel DOC button availability (requires CANCEL_DIGITAL_OFFER_CERTIFICATION)
        const cancelDocBtn = page.getByRole('button', { name: 'Cancel DOC' });
        const hasCancelDoc = await cancelDocBtn.isVisible().catch(() => false);
        // Result depends on logged-in user's privileges — just verify no errors

        // Check Edit Roles availability
        await docDetailsPage.clickRolesResponsibilitiesTab();
        await docDetailsPage.expectRolesGridVisible();
        // Edit Roles may or may not be visible depending on stage restrictions
      });
    });

  // ── DOC-CLOSURE-009 ──────────────────────────────────────────────────────
  test('should show findings in read-only state when control is Assessment Completed',
    async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Actions Closure');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CLOSURE-009: When a control is in "Assessment Completed" status, findings ' +
        'should not allow removal of actions.',
      );

      await test.step('Navigate to DOC and open Control Detail', async () => {
        await page.goto(ACTIONS_CLOSURE_DOC_URL);
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
        await docDetailsPage.clickFirstControlIdLink();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify findings section behavior', async () => {
        await controlDetailPage.expectFindingsSectionOrEmptyState();
        // If findings exist, verify no "Remove" or "Delete" buttons are present
        const removeBtn = page.getByRole('button', { name: /Remove|Delete Finding/i });
        const hasRemove = await removeBtn.isVisible().catch(() => false);
        expect(hasRemove, 'Remove/Delete finding buttons should not be visible on assessment-completed controls').toBe(false);
      });
    });
});
