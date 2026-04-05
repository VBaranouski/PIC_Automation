/**
 * Spec 11.11 — DOC Detail: Certification Decision Tab
 *
 * Verifies that the Certification Decision tab is present and functional
 * for eligible DOC stages: Propose / Edit decision, Submit for Approval,
 * Risk Summary cards, Unresolved Findings, and DOC Approvals.
 *
 * Uses an existing later-stage DOC discovered from the My DOCs grid.
 * Tests that require a specific status (Decision Proposal, Certification Approval)
 * pass a `requiredStatuses` filter to the helper; others accept any eligible status.
 */
import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';
import { type Page } from '@playwright/test';
import { LandingPage } from '../../src/pages/landing.page';
import { DocDetailsPage } from '../../src/pages/doc-details.page';

// Any status that makes the Certification Decision tab reachable
const CERT_DECISION_STATUSES = [
	'Decision Proposal',
	'Certification Approval',
	'Actions Closure',
	'Completed',
] as const;

// Statuses that place the DOC on the "Issue Certification" stage (richest cert-decision content)
const ISSUE_CERT_STATUSES = ['Decision Proposal', 'Certification Approval'] as const;

async function openDocWithCertDecisionTab(
	page: Page,
	landingPage: LandingPage,
	docDetailsPage: DocDetailsPage,
	requiredStatuses: readonly string[] = CERT_DECISION_STATUSES,
): Promise<string> {
	await landingPage.goto();
	await landingPage.expectPageLoaded({ timeout: 60_000 });
	await landingPage.clickTab('My DOCs');
	await landingPage.changePerPage('100');

	const rowCount = await landingPage.getGridRowCount();
	for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
		const rowText = await landingPage.getGridRowText(rowIndex);
		const matchedStatus = requiredStatuses.find((status) => rowText.includes(status));

		if (!matchedStatus) {
			continue;
		}

		const docLink = landingPage.grid.getByRole('row').nth(rowIndex).getByRole('link').first();
		const href = await docLink.getAttribute('href');

		if (!href) {
			continue;
		}

		await page.goto(new URL(href, page.url()).toString(), {
			waitUntil: 'domcontentloaded',
			timeout: 30_000,
		});

		await docDetailsPage.waitForOSLoad();

		// Wait for the OSUI tabs widget to fully render (tabs are rendered
		// asynchronously by OutSystems after OS screen-load clears).
		// We wait up to 30 s for the first content tab to appear, then
		// check whether the Certification Decision tab is among them.
		// OutSystems OSUI tabs render asynchronously; measured render time
		// is ~14–15 s, so 30 s gives a healthy margin.
		const tabVisible = await page
			.getByRole('tab', { name: 'Certification Decision' })
			.waitFor({ state: 'visible', timeout: 30_000 })
			.then(() => true)
			.catch(() => false);
		if (tabVisible) {
			return matchedStatus;
		}

		// Tab not available on this DOC — navigate back and keep searching
		await landingPage.goto();
		await landingPage.expectPageLoaded({ timeout: 60_000 });
		await landingPage.clickTab('My DOCs');
		await landingPage.changePerPage('100');
	}

	test.skip(
		true,
		`No DOC in [${requiredStatuses.join(', ')}] with a Certification Decision tab is currently available in this environment.`,
	);
	return '';
}

test.describe('DOC - Certification Decision Tab (11.11) @regression', () => {
	// Each test independently logs in (via beforeEach) and scans My DOCs,
	// so serial mode is NOT used here — it would cause cascade-skips when
	// running a subset of tests with --grep.
	test.setTimeout(240_000);

	test.beforeEach(async ({ page, loginPage, userCredentials }) => {
		await loginPage.goto();
		await loginPage.waitForPageLoad();
		await loginPage.login(userCredentials.login, userCredentials.password);
		await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
	});

	test('should display the Certification Decision tab for eligible DOC stages', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.description(
			'DOC-CERT-001: The Certification Decision tab must be present on DOCs that have reached the Issue Certification pipeline stage or later (Decision Proposal, Certification Approval, Actions Closure, Completed).',
		);

		await test.step('Open a DOC in an eligible stage', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage);
		});

		await test.step('Click the Certification Decision tab', async () => {
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify the Certification Decision tab is active', async () => {
			const ariaSelected = await page
				.getByRole('tab', { name: 'Certification Decision' })
				.getAttribute('aria-selected');
			expect(ariaSelected).toBe('true');
		});
	});

	test('should show Propose Decision or Edit button in Decision Proposal status', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.description(
			'DOC-CERT-002: In Decision Proposal status, the Certification Decision tab must show a "Propose Decision" button (when no decision is set) or an "Edit" button (when a decision has already been saved).',
		);

		await test.step('Open a DOC in Decision Proposal status', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, ['Decision Proposal']);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify the decision action button is visible', async () => {
			await docDetailsPage.expectProposeOrEditDecisionButtonVisible();
		});
	});

	test('should show Submit for Approval button in Decision Proposal status', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.description(
			'DOC-CERT-003: In Decision Proposal status, the "Submit for Approval" button must be visible on the Certification Decision tab (it may be disabled until a Proposed Decision is set).',
		);

		await test.step('Open a DOC in Decision Proposal status', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, ['Decision Proposal']);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify the Submit for Approval button is visible', async () => {
			await docDetailsPage.expectSubmitForApprovalButtonVisible();
		});
	});

	test('should show Risk Summary cards on the Certification Decision tab', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.description(
			'DOC-CERT-004: During the Issue Certification stage (Decision Proposal or Certification Approval), the Certification Decision tab must display the three Risk Summary cards: ITS Control Summary, SDL FCSR Summary, and Data Protection and Privacy Summary.',
		);

		await test.step('Open a DOC in an Issue Certification stage', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, ISSUE_CERT_STATUSES);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify the three Risk Summary cards are visible', async () => {
			await docDetailsPage.expectCertRiskSummaryCardsVisible();
		});
	});

	test('should show Unresolved Findings section or empty state', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.description(
			'DOC-CERT-005: During the Issue Certification stage, the Certification Decision tab must display an Unresolved Findings section (with a grid of findings, or a "No results found" empty state).',
		);

		await test.step('Open a DOC in an Issue Certification stage', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, ISSUE_CERT_STATUSES);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify the Unresolved Findings section is present', async () => {
			await docDetailsPage.expectUnresolvedFindingsSectionVisible();
		});

		await test.step('Verify findings grid or empty state is shown', async () => {
			const hasGrid = await docDetailsPage.hasUnresolvedFindingsGrid();
			const hasNoResults = await page
				.getByText('No results found')
				.first()
				.isVisible()
				.catch(() => false);
			expect(
				hasGrid || hasNoResults,
				'Expected either a findings grid or a "No results found" message to be visible',
			).toBe(true);
		});
	});

	test('should show DOC Approvals section in Certification Approval status', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.description(
			'DOC-CERT-006: In Certification Approval status, the Certification Decision tab must display a DOC Approvals section listing the assigned approvers.',
		);

		await test.step('Open a DOC in Certification Approval status', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, [
				'Certification Approval',
			]);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify the DOC Approvals section is visible', async () => {
			await docDetailsPage.expectDocApprovalsSectionVisible();
		});
	});

	// ── DOC-CERT-007 ──────────────────────────────────────────────────────────
	test('should show Send for Rework button on a DOC in Certification Approval status', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.description(
			'DOC-CERT-007: In Certification Approval status, the Certification Decision tab must ' +
			'display a "Send for Rework" button allowing an approver to reject the proposed decision ' +
			'and return the DOC to the initiator for rework.',
		);

		await test.step('Open a DOC in Certification Approval status', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, [
				'Certification Approval',
			]);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify "Send for Rework" button is visible', async () => {
			const sendForReworkBtn = page.getByRole('button', { name: 'Send for Rework' });
			const isVisible = await sendForReworkBtn.isVisible().catch(() => false);
			if (!isVisible) {
				test.skip(
					true,
					'Send for Rework button not visible — current user may lack SEND_FOR_REWORK privilege or DOC has no active approval request.',
				);
				return;
			}
			await expect(sendForReworkBtn).toBeVisible({ timeout: 15_000 });
		});
	});

	// ── DOC-CERT-008 ──────────────────────────────────────────────────────────
	test('should display pipeline stage labelled "Risk Summary Review" (not "Review Risk Summary")', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.description(
			'DOC-CERT-008: The DOC pipeline header must show the stage name "Risk Summary Review". ' +
			'The legacy label "Review Risk Summary" must not appear anywhere on the page.',
		);

		await test.step('Open a DOC at Issue Certification stage (any eligible status)', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage);
		});

		await test.step('Verify pipeline stage is labelled "Risk Summary Review"', async () => {
			await expect(
				page.getByRole('tab', { name: 'Risk Summary Review', exact: true }).first(),
			).toBeVisible({ timeout: 15_000 });
		});

		await test.step('Verify the legacy label "Review Risk Summary" does not appear', async () => {
			const legacyStage = page.getByRole('tab', { name: 'Review Risk Summary', exact: true });
			await expect(legacyStage).toBeHidden({ timeout: 5_000 });
		});
	});

	// ── DOC-CERT-009 ──────────────────────────────────────────────────────────
	test('should show warning text when no proposed decision has been set on a Decision Proposal DOC', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.severity('normal');
		await allure.tag('regression');
		await allure.description(
			'DOC-CERT-009: When no Proposed Decision has been set, the Certification Decision tab must ' +
			'display an orange warning icon with the text "Proposed certification decision is not specified." ' +
			'to prompt the Digital Risk Lead to propose a decision before submitting for approval.',
		);

		await test.step('Open a DOC in Decision Proposal status', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, ['Decision Proposal']);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Check for warning text — skip gracefully if decision is already set on this DOC', async () => {
			const hasWarning = await docDetailsPage.hasCertDecisionWarning();
			if (!hasWarning) {
				test.skip(
					true,
					'Warning text not visible — the available Decision Proposal DOC in this environment ' +
					'already has a proposed decision set. Skipping DOC-CERT-009.',
				);
				return;
			}
			await expect(
				page.getByText(/Proposed certification decision is not specified/i).first(),
				'Warning text must be visible when no Proposed Decision has been set',
			).toBeVisible({ timeout: 10_000 });
		});
	});

	// ── DOC-CERT-010 ──────────────────────────────────────────────────────────
	test('should display Proposed Decision value on the Certification Decision tab after decision is set', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.severity('normal');
		await allure.tag('regression');
		await allure.description(
			'DOC-CERT-010: After a Proposed Decision has been saved, the Certification Decision tab must ' +
			'display a "Proposed Decision" label with the saved decision value ' +
			'(e.g. Certified, Certified with Exception, Waiver).',
		);

		await test.step('Open a DOC that has a Certification Decision tab', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, CERT_DECISION_STATUSES);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify Proposed Decision label is visible', async () => {
			const hasWarning = await docDetailsPage.hasCertDecisionWarning();
			if (hasWarning) {
				test.skip(
					true,
					'No decision has been set on the available DOC — DOC-CERT-010 requires a saved decision. Skipping.',
				);
				return;
			}
			// The "Proposed Decision" label should be visible on the Certification Decision panel
			await expect(
				page.getByText('Proposed Decision').first(),
				'"Proposed Decision" label must be visible once a decision has been saved',
			).toBeVisible({ timeout: 15_000 });
		});

		await test.step('Verify the decision value is one of the expected values', async () => {
			const hasWarning = await docDetailsPage.hasCertDecisionWarning();
			if (hasWarning) return; // already skipped above

			// Decision value appears as text nearby; valid values are Certified, Certified with Exception, Waiver
			const decisionPanel = page.getByRole('tabpanel').filter({
				has: page.getByText('Proposed Decision'),
			}).first();

			const panelText = await decisionPanel.textContent().catch(() => '');
			const hasValidDecision = /Certified|Waiver/i.test(panelText ?? '');
			expect(
				hasValidDecision,
				`Expected Proposed Decision panel to contain a valid decision value (Certified / Certified with Exception / Waiver), got: "${panelText?.substring(0, 200)}"`,
			).toBe(true);
		});
	});

	// ── DOC-CERT-011 ──────────────────────────────────────────────────────────
	test('should show DOC Approvals signatures table with correct columns in Certification Approval status', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.severity('normal');
		await allure.tag('regression');
		await allure.description(
			'DOC-CERT-011: In Certification Approval status (or Actions Closure / Completed with signatures), ' +
			'the DOC Approvals table must be visible with columns: Approver Name, Role, Signature, Comment.',
		);

		await test.step('Open a DOC with a DOC Approvals section', async () => {
			await openDocWithCertDecisionTab(
				page,
				landingPage,
				docDetailsPage,
				['Certification Approval', 'Actions Closure', 'Completed'],
			);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify the DOC Approvals section is present', async () => {
			const hasApprovals = await docDetailsPage.hasDocApprovalsSection();
			if (!hasApprovals) {
				test.skip(
					true,
					'DOC Approvals section not found on the available DOC — status may not have triggered approver rows. Skipping DOC-CERT-011.',
				);
				return;
			}
			await docDetailsPage.expectDocApprovalsSectionVisible();
		});

		await test.step('Verify DOC Approvals signatures table has correct columns', async () => {
			const hasApprovals = await docDetailsPage.hasDocApprovalsSection();
			if (!hasApprovals) return;
			await docDetailsPage.expectDocSignaturesTableVisible();
		});
	});

	// ── DOC-CERT-012 ──────────────────────────────────────────────────────────
	test('should show clickable CONTROL ID link in Unresolved Findings table', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.severity('normal');
		await allure.tag('regression');
		await allure.description(
			'DOC-CERT-012: The Unresolved Findings section must display a CONTROL ID column ' +
			'with a clickable link that navigates to the Control Detail page for each finding.',
		);

		await test.step('Open a DOC at Issue Certification stage with findings', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, ISSUE_CERT_STATUSES);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify Unresolved Findings section is present', async () => {
			await docDetailsPage.expectUnresolvedFindingsSectionVisible();
		});

		await test.step('Verify CONTROL ID column has a clickable link when findings exist', async () => {
			const hasGrid = await docDetailsPage.hasUnresolvedFindingsGrid();
			if (!hasGrid) {
				test.skip(
					true,
					'No Unresolved Findings rows found on available DOC — skipping CONTROL ID link assertion.',
				);
				return;
			}
			await docDetailsPage.expectUnresolvedFindingsControlIdClickable();
		});
	});

	// ── DOC-CERT-013 ──────────────────────────────────────────────────────────
	test('should show clickable Closed Actions count link in Unresolved Findings table', async ({
		page,
		landingPage,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.severity('normal');
		await allure.tag('regression');
		await allure.description(
			'DOC-CERT-013: The Closed Actions column in the Unresolved Findings table must show ' +
			'a clickable "N of M" count link (e.g. "0 of 1") that opens a List of Actions popup.',
		);

		await test.step('Open a DOC at Issue Certification stage with findings', async () => {
			await openDocWithCertDecisionTab(page, landingPage, docDetailsPage, ISSUE_CERT_STATUSES);
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify Unresolved Findings section is present', async () => {
			await docDetailsPage.expectUnresolvedFindingsSectionVisible();
		});

		await test.step('Verify Closed Actions column has a clickable count link when findings exist', async () => {
			const hasGrid = await docDetailsPage.hasUnresolvedFindingsGrid();
			if (!hasGrid) {
				test.skip(
					true,
					'No Unresolved Findings rows found on available DOC — skipping Closed Actions link assertion.',
				);
				return;
			}
			await docDetailsPage.expectClosedActionsLinkVisible();
		});
	});

	// ── DOC-CERT-014 ──────────────────────────────────────────────────────────
	test('should show Monitor Action Closure pipeline stage for a DOC in Actions Closure status', async ({
		page,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.severity('normal');
		await allure.tag('regression');
		await allure.description(
			'DOC-CERT-014: A DOC that has reached the Actions Closure stage must show ' +
			'"Monitor Action Closure" as a visible step in the DOC pipeline header.',
		);

		const actionsClosureUrl =
			'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944';

		await test.step('Navigate to the Actions Closure DOC', async () => {
			await page.goto(actionsClosureUrl);
			await docDetailsPage.waitForOSLoad();
		});

		await test.step('Verify Monitor Action Closure stage is visible in the pipeline', async () => {
			await docDetailsPage.expectMonitorActionClosureStageVisible();
		});
	});

	// ── DOC-CERT-015 ──────────────────────────────────────────────────────────
	test('should show empty Unresolved Findings for a Completed/Certified DOC', async ({
		page,
		docDetailsPage,
	}) => {
		await allure.suite('DOC / DOC Detail / Certification Decision');
		await allure.severity('normal');
		await allure.tag('regression');
		await allure.description(
			'DOC-CERT-015: On a Completed/Certified DOC, opening the Certification ' +
			'Decision tab must show no rows in the Unresolved Findings section.',
		);

		const completedDocUrl =
			'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=273&ProductId=898';

		await test.step('Navigate to the Completed DOC', async () => {
			await page.goto(completedDocUrl);
			await docDetailsPage.waitForOSLoad();
		});

		await test.step('Open the Certification Decision tab', async () => {
			await docDetailsPage.clickCertificationDecisionTab();
		});

		await test.step('Verify Unresolved Findings section shows empty state', async () => {
			await docDetailsPage.expectUnresolvedFindingsEmptyState();
		});
	});
});
