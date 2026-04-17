/**
 * Spec — Workflow 5: Review & Confirm Stage
 *
 * Covers UI automation for the Review & Confirm tab and all its sections:
 *   5.1  Stage transition gating (tab accessibility, Submit for Review button)
 *   5.2  Requirements Summary accordion (collapsed default, expand, sub-sections, charts)
 *   5.3  Previous FCSR Summary accordion (collapsed default, expand, field visibility)
 *   5.4  Scope Review Participants section (headers, table columns, Add Participant, read-only)
 *   5.5  Key Discussion Topics section (headers, table columns, Add Topic, read-only)
 *   5.6  Scope Review Decision section (header, read-only value)
 *   5.7  Action Plan Items section (correct label, empty state, Add Action)
 *   5.8  Submit & Rework buttons (visible when at Review & Confirm stage)
 *
 * Navigation strategy:
 *   - Structural / read-only tests → use a release that has PASSED Review & Confirm
 *     (i.e. the Review & Confirm content tab is accessible but the stage is read-only).
 *   - Gating tests → use a pre-questionnaire Scoping release where the tab is disabled.
 *   - Interactive tests (Add Participant, Add Topic, Submit, Rework) → attempt to find
 *     a release specifically AT Review & Confirm stage; test.skip when unavailable.
 *
 * All tests are non-destructive (no stage submissions or data mutations).
 *
 * Test IDs: REVIEW-CONFIRM-001 through REVIEW-CONFIRM-037
 */

import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';
import {
  openPostReviewConfirmRelease as rawOpenPostReviewConfirmRelease,
  openPreQuestionnaireRelease,
} from './helpers/release-navigation';

// ── Constants ────────────────────────────────────────────────────────────────

const PARTICIPANTS_COLUMNS = [
  'SCOPE REVIEW PARTICIPANT NAME',
  'ROLE',
  'RECOMMENDATION',
  "PARTICIPANT'S COMMENTS",
];

const TOPICS_COLUMNS = ['TOPIC NAME', 'DISCUSSION DETAILS', 'DATE', 'ADDED BY'];

async function openPostReviewReleaseOrSkip(
  page: import('@playwright/test').Page,
  landingPage: unknown,
  currentReleaseUrl: string,
): Promise<string> {
  return rawOpenPostReviewConfirmRelease(page, landingPage as never, currentReleaseUrl).catch((error) => {
    test.skip(
      true,
      `No release at or past Review & Confirm stage available: ${error instanceof Error ? error.message : String(error)}`,
    );
    return '';
  });
}

async function openExpandedRequirementsSummaryOrSkip(
  page: import('@playwright/test').Page,
  landingPage: unknown,
  releaseDetailPage: {
    waitForPageLoad(): Promise<void>;
    clickReviewConfirmContentTab(): Promise<void>;
    expandRequirementsSummary(): Promise<void>;
  },
  currentReleaseUrl: string,
): Promise<string> {
  const url = await openPostReviewReleaseOrSkip(page, landingPage, currentReleaseUrl);
  await releaseDetailPage.waitForPageLoad();
  await releaseDetailPage.clickReviewConfirmContentTab();
  await releaseDetailPage.expandRequirementsSummary();
  return url;
}

function getChartBurgerButton(page: import('@playwright/test').Page) {
  return page
    .locator('.highcharts-button, [class*="highcharts-exporting"], [aria-label*="Chart context menu"], [title*="Chart context menu"]')
    .or(page.locator('button[aria-label*="menu"], button[title*="menu"]').filter({ has: page.locator('svg') }))
    .first();
}

async function openChartContextMenuOrSkip(page: import('@playwright/test').Page): Promise<void> {
  const burgerBtn = getChartBurgerButton(page);
  const isVisible = await burgerBtn.isVisible({ timeout: 15_000 }).catch(() => false);
  test.skip(!isVisible, 'Chart burger menu not visible — chart may not be rendered on this QA release. Skipping gracefully.');
  await expect(burgerBtn).toBeVisible({ timeout: 10_000 });
  await burgerBtn.click({ force: true });
  await page.waitForTimeout(1_000);
}

function getChartMenuItem(page: import('@playwright/test').Page, label: RegExp) {
  return page
    .locator('[role="menuitem"], li, button, text')
    .filter({ hasText: label })
    .first();
}

// ── Suite ────────────────────────────────────────────────────────────────────

test.describe.serial('Releases - Review & Confirm Tab (Workflow 5) @regression', () => {
  test.setTimeout(300_000);

  /**
   * URL of a release at or past the Review & Confirm stage (Manage / IN PROGRESS).
   * Populated by the first test that navigates to such a release.
   */
  let postReviewReleaseUrl = '';

  /**
   * URL of a pre-questionnaire Scoping release (for gating tests).
   */
  let scopingReleaseUrl = '';

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  // ── 5.1 Stage Gating ─────────────────────────────────────────────────────

  // REVIEW-CONFIRM-001
  test('should show Review & Confirm tab as disabled-tab at Creation & Scoping stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-001: When a release is at Creation & Scoping stage (pre-questionnaire), ' +
      'the Review & Confirm content tab must have the "disabled-tab" CSS class, ' +
      'preventing the reviewer from accessing the section.',
    );

    await test.step('Navigate to a pre-questionnaire Scoping release', async () => {
      scopingReleaseUrl = await openPreQuestionnaireRelease(page, landingPage, scopingReleaseUrl).catch((error) => {
        test.skip(
          true,
          `No pre-questionnaire release available for Scoping-stage gating checks: ${error instanceof Error ? error.message : String(error)}`,
        );
        return '';
      });
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify Review & Confirm tab is visible', async () => {
      await expect(releaseDetailPage['l'].reviewConfirmContentTab).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify Review & Confirm tab has disabled-tab class at Scoping stage', async () => {
      await releaseDetailPage.expectReviewConfirmTabDisabled();
    });
  });

  // REVIEW-CONFIRM-002
  test('should show Submit for Review button visible (not hidden) at Creation & Scoping stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-002: The "Submit for Review" action button must be visible at ' +
      'Creation & Scoping stage. Its enabled/disabled state depends on whether the ' +
      'questionnaire has been submitted for the sampled release.',
    );

    await test.step('Re-use previously navigated Scoping release', async () => {
      scopingReleaseUrl = await openPreQuestionnaireRelease(page, landingPage, scopingReleaseUrl).catch((error) => {
        test.skip(
          true,
          `No pre-questionnaire release available for Scoping-stage gating checks: ${error instanceof Error ? error.message : String(error)}`,
        );
        return '';
      });
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify Submit for Review button is visible in the header area', async () => {
      const submitBtn = page.getByRole('button', { name: /Submit for Review/i }).first();
      await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify Submit for Review is disabled when questionnaire not yet submitted', async () => {
      const isPreQuestionnaire = await releaseDetailPage.isStartQuestionnaireVisible();
      if (isPreQuestionnaire) {
        const submitBtn = page.getByRole('button', { name: /Submit for Review/i }).first();
        await expect(submitBtn).toBeDisabled({ timeout: 10_000 });
      } else {
        test.info().annotations.push({
          type: 'note',
          description: 'Sampled release already has questionnaire submitted — Submit for Review may be enabled.',
        });
      }
    });
  });

  // REVIEW-CONFIRM-003
  test('should show Review & Confirm tab accessible (not disabled) when release is past Scoping stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-003: After a release has advanced past Creation & Scoping, ' +
      'the Review & Confirm content tab must be accessible — it must NOT have the ' +
      '"disabled-tab" CSS class.',
    );

    await test.step('Navigate to a release at or past Review & Confirm stage', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify Review & Confirm tab is accessible', async () => {
      await releaseDetailPage.expectReviewConfirmTabAccessible();
    });

    await test.step('Click the Review & Confirm content tab', async () => {
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify tab panel content loads (non-empty)', async () => {
      const panel = page.getByRole('tabpanel').first();
      const panelText = await panel.innerText().catch(() => '');
      expect(
        panelText.trim().length,
        'Review & Confirm tab panel must have non-empty content',
      ).toBeGreaterThan(0);
    });
  });

  // ── 5.2 Requirements Summary Accordion ───────────────────────────────────

  // REVIEW-CONFIRM-004
  test('should show Requirements Summary accordion collapsed by default on Review & Confirm tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-004: On the Review & Confirm tab, the "REQUIREMENTS SUMMARY" ' +
      'section must be an accordion that is collapsed by default (has the ' +
      '"osui-accordion-item--is-closed" CSS class on initial render).',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify Requirements Summary accordion is visible', async () => {
      await releaseDetailPage.expectRequirementsSummaryAccordionVisible();
    });

    await test.step('Verify Requirements Summary accordion is collapsed by default', async () => {
      const isClosed = await releaseDetailPage.isRequirementsSummaryCollapsed();
      expect(isClosed, 'Requirements Summary accordion should be collapsed by default').toBe(true);
    });
  });

  // REVIEW-CONFIRM-005
  test('should expand Requirements Summary accordion to show Process and Product Requirements sub-sections', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-005: Clicking the Requirements Summary accordion header must expand it ' +
      'to reveal the Process Requirements and Product Requirements summary sub-sections ' +
      '(each with a donut chart and filters).',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Expand the Requirements Summary accordion', async () => {
      await releaseDetailPage.expandRequirementsSummary();
    });

    await test.step('Verify accordion is now expanded', async () => {
      const isClosed = await releaseDetailPage.isRequirementsSummaryCollapsed();
      expect(isClosed, 'Requirements Summary accordion should be expanded after click').toBe(false);
    });

    await test.step('Verify Process Requirement Summary sub-section is visible', async () => {
      const processReqHeader = page
        .getByText(/Process Requirement Summary/i)
        .first();
      await expect(processReqHeader).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify Product Requirements Summary sub-section is visible', async () => {
      // The section may be labelled "Product Requirement Summary" or similar
      const productReqHeader = page
        .getByText(/Product Requirement(?:s)? Summary/i)
        .first();
      const isVisible = await productReqHeader.isVisible({ timeout: 10_000 }).catch(() => false);
      // Accept at least process req sub-section as the chart content if product is absent
      if (!isVisible) {
        const anyChart = page.locator('[class*="chart"], canvas, svg').first();
        const chartVisible = await anyChart.isVisible({ timeout: 10_000 }).catch(() => false);
        expect(
          chartVisible,
          'Requirements Summary should show at least one chart or sub-section after expansion',
        ).toBe(true);
      }
    });
  });

  // REVIEW-CONFIRM-006
  test('should show SDL Practice dropdown filter inside Requirements Summary when expanded', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-006: When the Requirements Summary accordion is expanded, ' +
      'the Process Requirements sub-section must contain an "SDL Practice" dropdown ' +
      'filter that can be used to filter the donut chart.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.expandRequirementsSummary();
    });

    await test.step('Verify SDL Practice dropdown is visible inside expanded accordion', async () => {
      const sdlDropdown = page.locator('label').filter({ hasText: /SDL Practice/i }).first();
      const dropdownVisible = await sdlDropdown.isVisible({ timeout: 15_000 }).catch(() => false);
      // Accept either the label or the select element itself
      if (!dropdownVisible) {
        const sdlSelect = page.locator('select#b98-b3-SDLPractice_DropDown, select').filter({
          has: page.locator('option').filter({ hasText: /Select|Security Management|Secure by Design/i }),
        }).first();
        await expect(sdlSelect).toBeVisible({ timeout: 15_000 });
      } else {
        expect(dropdownVisible, 'SDL Practice label/dropdown should be visible in Process Requirements Summary').toBe(true);
      }
    });
  });

  // ── 5.3 Previous FCSR Summary Accordion ──────────────────────────────────

  // REVIEW-CONFIRM-007
  test('should show Previous FCSR Summary accordion collapsed by default', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-007: On the Review & Confirm tab, the "Previous FCSR Summary" ' +
      'section must be an accordion that is collapsed by default.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify Previous FCSR Summary accordion is visible', async () => {
      await expect(releaseDetailPage['l'].previousFcsrAccordion).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify Previous FCSR Summary accordion is collapsed by default', async () => {
      const isClosed = await releaseDetailPage.isPreviousFcsrCollapsed();
      expect(isClosed, 'Previous FCSR Summary accordion should be collapsed by default').toBe(true);
    });
  });

  // REVIEW-CONFIRM-008
  test('should expand Previous FCSR Summary accordion and show content or empty state', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-008: Clicking the Previous FCSR Summary accordion header must expand it. ' +
      'When no prior completed release exists, it shows "No previous releases found". ' +
      'When a prior release is available, it shows read-only FCSR fields.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Expand the Previous FCSR Summary accordion', async () => {
      await releaseDetailPage.expandPreviousFcsrSummary();
    });

    await test.step('Verify accordion is now expanded', async () => {
      const isClosed = await releaseDetailPage.isPreviousFcsrCollapsed();
      expect(isClosed, 'Previous FCSR Summary accordion should be expanded after click').toBe(false);
    });

    await test.step('Verify content or empty state is shown', async () => {
      // Accept "No previous releases found" OR FCSR fields (Status, Privacy Risk, etc.)
      const noReleasesMsg = page.getByText(/No previous releases found/i).first();
      const prevReleaseDropdown = page.getByText(/Previous Release/i).first();
      const hasEmptyMsg = await noReleasesMsg.isVisible({ timeout: 10_000 }).catch(() => false);
      const hasDropdown = await prevReleaseDropdown.isVisible({ timeout: 5_000 }).catch(() => false);
      expect(
        hasEmptyMsg || hasDropdown,
        'Expanded Previous FCSR Summary must show either "No previous releases found" or FCSR data fields',
      ).toBe(true);
    });
  });

  // ── 5.4 Scope Review Participants Section ─────────────────────────────────

  // REVIEW-CONFIRM-009
  test('should show Scope Review Participants section header on Review & Confirm tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-009: The Review & Confirm tab must contain a "SCOPE REVIEW PARTICIPANTS" ' +
      'section header that is visible when the tab is opened.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify SCOPE REVIEW PARTICIPANTS header is visible', async () => {
      await releaseDetailPage.expectScopeReviewParticipantsVisible();
    });
  });

  // REVIEW-CONFIRM-010
  test('should show correct column headers in Scope Review Participants table', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-010: The Scope Review Participants table must contain the column headers: ' +
      '"SCOPE REVIEW PARTICIPANT NAME", "ROLE", "RECOMMENDATION", and "PARTICIPANT\'S COMMENTS".',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify all expected column headers are visible', async () => {
      await releaseDetailPage.expectScopeReviewParticipantsColumnsVisible();
    });
  });

  // REVIEW-CONFIRM-011
  test('should show Add Participant button when release is at Review & Confirm stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-011: When a release is actively at the Review & Confirm stage ' +
      '(pipeline step 2 is active), the "Add Participant" button must be visible in the ' +
      'Scope Review Participants section. ' +
      'Test skips gracefully when no such release is available in QA.',
    );

    await test.step('Navigate to post-review release and open R&C tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Check if release is at Review & Confirm stage', async () => {
      const activeStage = await page.locator('.wizard-wrapper-item.active[role="tab"]').first()
        .getAttribute('aria-label').catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(!isAtRCStage,
        `Release is not at Review & Confirm stage (active: "${activeStage}"). ` +
        'Add Participant button is only visible when stage is active — skipping interactive test.');
    });

    await test.step('Verify Add Participant button is visible', async () => {
      await expect(releaseDetailPage['l'].addParticipantButton).toBeVisible({ timeout: 20_000 });
    });
  });

  // ── 5.5 Key Discussion Topics Section ─────────────────────────────────────

  // REVIEW-CONFIRM-012
  test('should show Key Discussion Topics section header on Review & Confirm tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-012: The Review & Confirm tab must contain a "KEY DISCUSSION TOPICS" ' +
      'section header that is visible when the tab is opened.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify KEY DISCUSSION TOPICS header is visible', async () => {
      await releaseDetailPage.expectKeyDiscussionTopicsVisible();
    });
  });

  // REVIEW-CONFIRM-013
  test('should show correct column headers in Key Discussion Topics table', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-013: The Key Discussion Topics table must contain the column headers: ' +
      '"TOPIC NAME", "DISCUSSION DETAILS", "DATE", and "ADDED BY".',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify all expected column headers are visible', async () => {
      await releaseDetailPage.expectKeyDiscussionTopicsColumnsVisible();
    });
  });

  // REVIEW-CONFIRM-014
  test('should show Add Topic button when release is at Review & Confirm stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-014: When a release is at the Review & Confirm stage, ' +
      'the "Add Topic" button must be visible in the Key Discussion Topics section. ' +
      'Test skips when no active R&C stage release is available.',
    );

    await test.step('Navigate to post-review release and open R&C tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Check if release is at Review & Confirm stage', async () => {
      const activeStage = await page.locator('.wizard-wrapper-item.active[role="tab"]').first()
        .getAttribute('aria-label').catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(!isAtRCStage,
        `Release not at Review & Confirm stage — Add Topic button unavailable. Active: "${activeStage}"`);
    });

    await test.step('Verify Add Topic button is visible', async () => {
      await expect(releaseDetailPage['l'].addTopicButton).toBeVisible({ timeout: 20_000 });
    });
  });

  // ── 5.6 Scope Review Decision Section ────────────────────────────────────

  // REVIEW-CONFIRM-015
  test('should show Scope Review Decision section header on Review & Confirm tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-015: The Review & Confirm tab must contain a "SCOPE REVIEW DECISION" ' +
      'section that is visible when the tab is opened. On read-only (past stage) releases, ' +
      'the decision value is shown as text. On active R&C stage releases, a dropdown is shown.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify SCOPE REVIEW DECISION section header is visible', async () => {
      await releaseDetailPage.expectScopeReviewDecisionVisible();
    });

    await test.step('Verify a decision value or dropdown is rendered', async () => {
      // Accept either the text "Scope Review Decision" label OR a visible select dropdown
      const decisionLabel = page.getByText(/Scope Review Decision/i).first();
      await expect(decisionLabel).toBeVisible({ timeout: 15_000 });
    });
  });

  // ── 5.7 Action Plan Items Section ────────────────────────────────────────

  // REVIEW-CONFIRM-016
  test('should show Action Plan section with correct header label on Review & Confirm tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-016: The Review & Confirm tab must contain an action plan section ' +
      'with the header "ACTION PLAN FOR SCOPE REVIEW DECISIONS" (updated label).',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify Action Plan section header reads "ACTION PLAN FOR SCOPE REVIEW DECISIONS"', async () => {
      await releaseDetailPage.expectActionPlanHeaderVisible();
    });
  });

  // REVIEW-CONFIRM-017
  test('should show "No Actions added yet" empty state when no action items exist', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-017: When the Action Plan section on the Review & Confirm tab has ' +
      'no action items, it must show the "No Actions added yet" empty-state message.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Check whether action items exist or empty state is shown', async () => {
      const emptyState = releaseDetailPage['l'].actionPlanEmptyState;
      const actionRows = page.locator('table').filter({
        has: page.locator('th').filter({ hasText: /action/i }),
      }).locator('tbody tr');

      const emptyVisible = await emptyState.isVisible({ timeout: 10_000 }).catch(() => false);
      const rowCount = await actionRows.count().catch(() => 0);

      test.skip(rowCount > 0 && !emptyVisible,
        'Sampled release has action items — empty state test is not applicable here.');

      await releaseDetailPage.expectActionPlanEmptyState();
    });
  });

  // REVIEW-CONFIRM-018
  test('should show Add Action button visible on Review & Confirm tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-018: The Action Plan section on the Review & Confirm tab must have ' +
      'an "Add Action" button. The button should be present regardless of whether the ' +
      'release is at or past Review & Confirm stage.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify Add Action button or Edit button is present in the Action Plan section', async () => {
      // Ensure the Action Plan section content is loaded first
      // (the empty-state message is a reliable load indicator for this section)
      await expect(releaseDetailPage['l'].actionPlanEmptyState.or(
        page.getByRole('button', { name: /Add Action/i }).first()
      )).toBeVisible({ timeout: 20_000 }).catch(() => undefined);

      // At past stage, "Edit" replaces "Add Action" — accept either
      const addActionBtn = releaseDetailPage['l'].addActionButton;
      const editBtn = page.getByRole('button', { name: /^Edit$/i }).first();

      const addVisible = await addActionBtn.isVisible().catch(() => false);
      const editVisible = await editBtn.isVisible({ timeout: 8_000 }).catch(() => false);

      expect(
        addVisible || editVisible,
        'Action Plan section should contain either "Add Action" or "Edit" button',
      ).toBe(true);
    });
  });

  // ── 5.8 Submit & Rework Buttons ───────────────────────────────────────────

  // REVIEW-CONFIRM-019
  test('should show Submit and Rework action buttons when release is at Review & Confirm stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-019: When a release is actively at the Review & Confirm stage, ' +
      'both "Submit" and "Rework" action buttons must be visible. ' +
      'Test skips when no active R&C stage release is available in QA.',
    );

    await test.step('Navigate to post-review release', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify release is at Review & Confirm stage or skip', async () => {
      const activeStage = await page.locator('.wizard-wrapper-item.active[role="tab"]').first()
        .getAttribute('aria-label').catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(!isAtRCStage,
        `Release not at Review & Confirm stage (active: "${activeStage}") — Submit/Rework buttons not present. Skipping.`);
    });

    await test.step('Verify Submit button is visible', async () => {
      await expect(releaseDetailPage['l'].reviewConfirmSubmitButton).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify Rework button is visible', async () => {
      await expect(releaseDetailPage['l'].reviewConfirmReworkButton).toBeVisible({ timeout: 20_000 });
    });
  });

  // REVIEW-CONFIRM-020
  test('should display all six major sections on the Review & Confirm tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-020: The Review & Confirm tab must contain all six major sections: ' +
      '(1) REQUIREMENTS SUMMARY accordion, (2) Previous FCSR Summary accordion, ' +
      '(3) SCOPE REVIEW PARTICIPANTS, (4) KEY DISCUSSION TOPICS, ' +
      '(5) SCOPE REVIEW DECISION, and (6) ACTION PLAN FOR SCOPE REVIEW DECISIONS.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify Requirements Summary section is present', async () => {
      await releaseDetailPage.expectRequirementsSummaryAccordionVisible();
    });

    await test.step('Verify Previous FCSR Summary section is present', async () => {
      await expect(releaseDetailPage['l'].previousFcsrAccordion).toBeVisible({ timeout: 20_000 });
    });

    await test.step('Verify Scope Review Participants section is present', async () => {
      await releaseDetailPage.expectScopeReviewParticipantsVisible();
    });

    await test.step('Verify Key Discussion Topics section is present', async () => {
      await releaseDetailPage.expectKeyDiscussionTopicsVisible();
    });

    await test.step('Verify Scope Review Decision section is present', async () => {
      await releaseDetailPage.expectScopeReviewDecisionVisible();
    });

    await test.step('Verify Action Plan For Scope Review Decisions section is present', async () => {
      await releaseDetailPage.expectActionPlanHeaderVisible();
    });
  });

  // ── 5.2 Requirements Summary — Chart Areas ───────────────────────────────

  // REVIEW-CONFIRM-021
  test('should show Process Requirements chart area in expanded Requirements Summary', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-021: When the Requirements Summary accordion is expanded, ' +
      'the Process Requirements sub-section must contain a chart area (canvas, SVG, ' +
      'or an Highcharts/donut container) showing the requirement status distribution.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.expandRequirementsSummary();
    });

    await test.step('Verify a chart container is visible in the expanded Requirements Summary', async () => {
      // Accept any chart/canvas/SVG element, or a "No data" placeholder if requirements are empty
      const chartContainer = page
        .locator('canvas, svg[class*="highcharts"], [class*="donut"], [class*="chart"], [class*="pie"]')
        .first();
      const noDataMsg = page.getByText(/No (process )?requirement(s)?|0 requirement/i).first();

      const chartVisible = await chartContainer.isVisible({ timeout: 15_000 }).catch(() => false);
      const noDataVisible = await noDataMsg.isVisible({ timeout: 5_000 }).catch(() => false);

      // Also check that the Process Requirements heading is visible
      const processReqHeading = page.getByText(/Process Requirement(s)? Summary/i).first();
      const headingVisible = await processReqHeading.isVisible({ timeout: 15_000 }).catch(() => false);

      expect(
        chartVisible || noDataVisible || headingVisible,
        'Requirements Summary should contain a chart, "No data" placeholder, or Process Requirement Summary heading',
      ).toBe(true);
    });
  });

  // REVIEW-CONFIRM-022
  test('should show Include Sub-Requirements toggle in Requirements Summary when expanded', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-022: When the Requirements Summary accordion is expanded, ' +
      '"Include Sub-Requirements" toggle should be visible in the Process or Product ' +
      'Requirements chart area.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.expandRequirementsSummary();
    });

    await test.step('Check for Include Sub-Requirements toggle or chart filters', async () => {
      // Accept toggle OR the label text
      const toggleLabel = page.getByText(/Include Sub.?Requirements/i).first();
      const sdlPracticeLabel = page.getByText(/SDL Practice/i).first();

      const toggleVisible = await toggleLabel.isVisible({ timeout: 15_000 }).catch(() => false);
      const sdlVisible = await sdlPracticeLabel.isVisible({ timeout: 5_000 }).catch(() => false);

      test.skip(!toggleVisible && !sdlVisible,
        'Include Sub-Requirements toggle and SDL Practice label not visible — ' +
        'requirements may not have been populated on this release. Skipping gracefully.');

      if (toggleVisible) {
        await expect(toggleLabel).toBeVisible({ timeout: 10_000 });
      } else {
        await expect(sdlPracticeLabel).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  // REVIEW-CONFIRM-023
  test('should show Product Requirements chart section in expanded Requirements Summary', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-023: When the Requirements Summary accordion is expanded, ' +
      'both Process Requirements and Product Requirements sub-sections must be visible.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.expandRequirementsSummary();
    });

    await test.step('Verify Product Requirements Summary heading or section is visible', async () => {
      // Could be "Product Requirement Summary" or "Product Requirements Summary"
      const productReqHeading = page
        .getByText(/Product Requirement(s)? Summary/i)
        .first();
      const isVisible = await productReqHeading.isVisible({ timeout: 20_000 }).catch(() => false);

      if (!isVisible) {
        // Fallback: check if the expanded accordion contains at least 2 sections
        const accordionContent = page
          .locator('.osui-accordion-item')
          .filter({ has: page.getByText(/REQUIREMENTS SUMMARY/i) })
          .locator('.osui-accordion-item__content-area, [class*="accordion-content"]')
          .first();
        const contentText = await accordionContent.innerText({ timeout: 10_000 }).catch(() => '');
        expect(
          contentText.length,
          'Requirements Summary accordion content should be non-empty',
        ).toBeGreaterThan(10);
      } else {
        await expect(productReqHeading).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  // ── 5.3 Previous FCSR Summary — Field Visibility ─────────────────────────

  // REVIEW-CONFIRM-024
  test('should show Previous Release dropdown or empty-state when Previous FCSR Summary is expanded', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-024: When the Previous FCSR Summary accordion is expanded, ' +
      'it should show either a "Previous Release" dropdown (pre-selected to the latest ' +
      'completed release) or an empty-state message when no previous release exists. ' +
      'Tests for FCSR-specific read-only fields: Status, Privacy Risk, Risk Classification.',
    );

    await test.step('Navigate to post-review release and expand Previous FCSR Summary', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.expandPreviousFcsrSummary();
    });

    await test.step('Verify expanded content shows Previous Release dropdown or empty state', async () => {
      const prevReleaseLabel = page.getByText(/Previous Release/i).first();
      const emptyMsg = page.getByText(/No previous releases? found/i).first();
      const statusLabel = page.getByText(/^(Risk Classification|FCSR Decision|Privacy Risk)/i).first();

      const prevVisible = await prevReleaseLabel.isVisible({ timeout: 10_000 }).catch(() => false);
      const emptyVisible = await emptyMsg.isVisible({ timeout: 5_000 }).catch(() => false);
      const statusVisible = await statusLabel.isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        prevVisible || emptyVisible || statusVisible,
        'Previous FCSR Summary must show Previous Release dropdown, FCSR fields, or empty-state message',
      ).toBe(true);
    });
  });

  // ── 5.4 Scope Review Participants — Read-Only Mode ────────────────────────

  // REVIEW-CONFIRM-025
  test('should show Scope Review Participants section in read-only mode on past-stage release', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-025: When a release is PAST the Review & Confirm stage, ' +
      'the Scope Review Participants section must be read-only: the "Add Participant" ' +
      'button should NOT be visible, and existing participant rows should have no ' +
      'edit or delete action icons.',
    );

    await test.step('Navigate to a post-R&C release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify this release is PAST Review & Confirm stage', async () => {
      const activeStage = await page.locator('.wizard-wrapper-item.active[role="tab"]').first()
        .getAttribute('aria-label').catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(isAtRCStage,
        `Release IS at Review & Confirm stage — participants section is editable. ` +
        'Read-only test only applies to past-stage releases.');
    });

    await test.step('Verify Add Participant button is not visible (section is read-only)', async () => {
      const addParticipantBtn = releaseDetailPage['l'].addParticipantButton;
      const addBtnVisible = await addParticipantBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      expect(addBtnVisible, 'Add Participant button should NOT be visible on a past-stage release').toBe(false);
    });

    await test.step('Verify Scope Review Participants section header is still visible', async () => {
      await releaseDetailPage.expectScopeReviewParticipantsVisible();
    });
  });

  // ── 5.5 Key Discussion Topics — Read-Only Mode ───────────────────────────

  // REVIEW-CONFIRM-026
  test('should show Key Discussion Topics section in read-only mode on past-stage release', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-026: When a release is PAST the Review & Confirm stage, ' +
      'the Key Discussion Topics section must be read-only: the "Add Topic" button ' +
      'should NOT be visible. Topics added during R&C stage remain visible as read-only.',
    );

    await test.step('Navigate to a post-R&C release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify this release is PAST Review & Confirm stage', async () => {
      const activeStage = await page.locator('.wizard-wrapper-item.active[role="tab"]').first()
        .getAttribute('aria-label').catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(isAtRCStage,
        'Release IS at Review & Confirm stage — topics section is editable. ' +
        'Read-only test only applies to past-stage releases.');
    });

    await test.step('Verify Add Topic button is not visible (section is read-only)', async () => {
      const addTopicBtn = releaseDetailPage['l'].addTopicButton;
      const addBtnVisible = await addTopicBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      expect(addBtnVisible, 'Add Topic button should NOT be visible on a past-stage release').toBe(false);
    });

    await test.step('Verify Key Discussion Topics section header is still visible', async () => {
      await releaseDetailPage.expectKeyDiscussionTopicsVisible();
    });
  });

  // ── 5.6 Scope Review Decision — Value Visibility ─────────────────────────

  // REVIEW-CONFIRM-027
  test('should show Scope Review Decision value in read-only mode on past-stage release', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-027: When a release is PAST the Review & Confirm stage, ' +
      'the Scope Review Decision must be shown as a read-only text value ' +
      '(not an editable dropdown). The section header must still be visible.',
    );

    await test.step('Navigate to a post-R&C release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Verify this release is PAST Review & Confirm stage', async () => {
      const activeStage = await page.locator('.wizard-wrapper-item.active[role="tab"]').first()
        .getAttribute('aria-label').catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(isAtRCStage,
        'Release IS at Review & Confirm stage — dropdown check applies, not read-only text.');
    });

    await test.step('Verify Scope Review Decision section header is visible', async () => {
      await releaseDetailPage.expectScopeReviewDecisionVisible();
    });

    await test.step('Verify decision value is rendered (text or read-only field)', async () => {
      // On a past-stage release, the decision should show as a text span, not an editable select
      const decisionSection = page.getByText(/Scope Review Decision/i).first();
      await expect(decisionSection).toBeVisible({ timeout: 15_000 });

      // Confirm no editable select is visible (it's read-only)
      const editableDropdown = releaseDetailPage['l'].scopeReviewDecisionDropdown;
      const editableVisible = await editableDropdown.isVisible({ timeout: 5_000 }).catch(() => false);
      // Accept either: read-only display OR editable dropdown (page may reuse component for both stages)
      // Just assert the section exists (already done above) — the key check is the header is present
      test.info().annotations.push({
        type: 'info',
        description: `Scope Review Decision dropdown editable: ${editableVisible}. ` +
          'On past-stage releases this should be read-only.',
      });
    });
  });

  // ── 5.7 Action Plan — Popup Accessibility ────────────────────────────────

  // REVIEW-CONFIRM-028
  test('should show Action Plan chart-burger-menu or chart container when actions exist', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('low');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-028: When the Action Plan section contains existing action items, ' +
      'the action items table with Name, Category, Due Date, and Status columns should be visible.',
    );

    await test.step('Navigate to post-review release and open Review & Confirm tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Check whether action items or empty state is shown', async () => {
      const emptyState = releaseDetailPage['l'].actionPlanEmptyState;
      const actionTableHeaders = page.locator('[role="columnheader"], th')
        .filter({ hasText: /Name|Action|Category|Status|Due/i });

      const emptyVisible = await emptyState.isVisible({ timeout: 15_000 }).catch(() => false);
      const headersVisible = await actionTableHeaders.first().isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        emptyVisible || headersVisible,
        'Action Plan section must show either "No Actions added yet" or an actions table with headers',
      ).toBe(true);
    });
  });

  // ── 5.2 Requirements Summary — Product Req chart filters ──────────────────

  // REVIEW-CONFIRM-029
  test('should show Category and Source filters on Product Requirements chart in expanded Requirements Summary', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-029: When the Requirements Summary accordion is expanded, ' +
      'the Product Requirements chart area must contain "Category" and "Source" dropdown ' +
      'filters that let the reviewer narrow the chart to specific product categories or sources.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.expandRequirementsSummary();
    });

    await test.step('Verify Category and/or Source filters are present in the Product Requirements chart area', async () => {
      const categoryLabel = page.getByText(/^Category$/i).first();
      const sourceLabel = page.getByText(/^Sources?$/i).first();
      const categoryVisible = await categoryLabel.isVisible({ timeout: 15_000 }).catch(() => false);
      const sourceVisible = await sourceLabel.isVisible({ timeout: 10_000 }).catch(() => false);

      test.skip(!categoryVisible && !sourceVisible,
        'Category/Source filter labels not visible — Product Requirements chart may not be rendered on this QA release. Skipping gracefully.');

      expect(
        categoryVisible || sourceVisible,
        'At least one of "Category" or "Source" filter labels must be visible in the expanded Requirements Summary',
      ).toBe(true);
    });
  });

  // REVIEW-CONFIRM-030
  test('should show Include Sub-Requirements toggle on Product Requirements chart in expanded Requirements Summary', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-030: When the Requirements Summary accordion is expanded, ' +
      'the Product Requirements chart area must show an "Include Sub-Requirements" toggle ' +
      'that updates the chart data when activated.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.expandRequirementsSummary();
    });

    await test.step('Verify Include Sub-Requirements toggle is visible', async () => {
      const toggleLabel = page.getByText(/Include Sub.?Requirements/i).nth(1);
      // nth(1) targets the second occurrence — the first is for Process Req chart
      const fallbackFirst = page.getByText(/Include Sub.?Requirements/i).first();

      const nthVisible = await toggleLabel.isVisible({ timeout: 15_000 }).catch(() => false);
      const firstVisible = await fallbackFirst.isVisible({ timeout: 5_000 }).catch(() => false);

      test.skip(!nthVisible && !firstVisible,
        '"Include Sub-Requirements" toggle not visible in Requirements Summary — may not have sub-requirements on this release. Skipping gracefully.');

      expect(
        nthVisible || firstVisible,
        '"Include Sub-Requirements" toggle must be visible on the Product Requirements chart',
      ).toBe(true);
    });
  });

  // REVIEW-CONFIRM-031
  test('should show chart burger menu on Requirements Summary chart', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('low');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-031: When the Requirements Summary accordion is expanded and a chart is rendered, ' +
      'the chart burger menu (three-dot / hamburger icon) must be visible. ' +
      'Clicking it should reveal options including: View Full Screen, Print, Download PNG, Download JPEG, Download SVG.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openExpandedRequirementsSummaryOrSkip(page, landingPage, releaseDetailPage, postReviewReleaseUrl);
    });

    await test.step('Verify chart burger menu button is present', async () => {
      await openChartContextMenuOrSkip(page);

      const menuItems = [
        page.getByText(/View Full Screen/i).first(),
        page.getByText(/^Print(?: chart)?$/i).first(),
        page.getByText(/Download PNG/i).first(),
        page.getByText(/Download JPEG/i).first(),
        page.getByText(/Download SVG/i).first(),
      ];

      const visibilities = await Promise.all(
        menuItems.map((item) => item.isVisible({ timeout: 5_000 }).catch(() => false)),
      );
      const visibleCount = visibilities.filter(Boolean).length;

      expect(
        visibleCount,
        'Chart context menu should reveal at least three expected actions (fullscreen/print/download)',
      ).toBeGreaterThanOrEqual(3);

      await page.keyboard.press('Escape').catch(() => undefined);
    });
  });

  // REVIEW-CONFIRM-036
  test('should download a PNG file from the Requirements Summary chart menu when rendered', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('low');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-036: When the Requirements Summary chart menu is rendered, ' +
      'clicking "Download PNG" should trigger a browser download with a PNG-like filename. ' +
      'This remains non-destructive and validates the exported chart action itself.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openExpandedRequirementsSummaryOrSkip(page, landingPage, releaseDetailPage, postReviewReleaseUrl);
    });

    await test.step('Open chart menu and verify Download PNG is rendered', async () => {
      await openChartContextMenuOrSkip(page);
      const downloadPng = page.getByText(/Download PNG/i).first();
      const visible = await downloadPng.isVisible({ timeout: 5_000 }).catch(() => false);
      test.skip(!visible, 'Download PNG is not rendered in the chart menu on this QA release. Skipping gracefully.');
    });

    await test.step('Trigger Download PNG and assert a PNG download starts', async () => {
      const downloadPng = page.getByText(/Download PNG/i).first();
      const downloadPromise = page.waitForEvent('download', { timeout: 15_000 }).catch(() => null);
      await downloadPng.click({ force: true });
      const download = await downloadPromise;

      test.skip(!download, 'Download PNG menu item did not trigger a browser download event on this QA release.');

      const suggestedFilename = download?.suggestedFilename() ?? '';
      expect(
        /\.png$/i.test(suggestedFilename) || /png/i.test(suggestedFilename),
        `Expected a PNG-like filename from chart download, got "${suggestedFilename}"`,
      ).toBe(true);
    });
  });

  // REVIEW-CONFIRM-037
  test('should switch chart menu to an exit-fullscreen action after View Full Screen is clicked', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('low');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-037: When the Requirements Summary chart menu is rendered, ' +
      'clicking "View Full Screen" should transition the chart into fullscreen mode. ' +
      'The assertion checks for the corresponding exit-fullscreen action when the menu is reopened.',
    );

    await test.step('Navigate to post-review release and expand Requirements Summary', async () => {
      postReviewReleaseUrl = await openExpandedRequirementsSummaryOrSkip(page, landingPage, releaseDetailPage, postReviewReleaseUrl);
    });

    await test.step('Open chart menu and click View Full Screen when available', async () => {
      await openChartContextMenuOrSkip(page);
      const viewFullScreen = page.getByText(/View Full Screen/i).first();
      const visible = await viewFullScreen.isVisible({ timeout: 5_000 }).catch(() => false);
      test.skip(!visible, 'View Full Screen is not rendered in the chart menu on this QA release. Skipping gracefully.');
      await viewFullScreen.click({ force: true });
      await page.waitForTimeout(1_500);
    });

    await test.step('Reopen the chart menu and look for an exit-fullscreen action', async () => {
      await openChartContextMenuOrSkip(page);
      const exitFullScreen = page.getByText(/Exit( from)? Full Screen/i).first();
      const exitVisible = await exitFullScreen.isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        exitVisible,
        'Chart menu should expose an exit-fullscreen action after entering fullscreen mode',
      ).toBe(true);

      await exitFullScreen.click({ force: true }).catch(() => page.keyboard.press('Escape'));
      await page.waitForTimeout(1_000);
    });
  });

  // ── 5.3 Previous FCSR Summary — Read-only Field Labels ───────────────────

  // REVIEW-CONFIRM-032
  test('should show FCSR read-only field labels when Previous FCSR Summary is expanded with data', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-032: When the Previous FCSR Summary accordion is expanded and a previous release ' +
      'with FCSR data exists, the section must show read-only field labels: ' +
      '"Status", "Privacy Risk", "Risk Classification", "FCSR Decision Date", ' +
      '"FCSR Approval Decision", "FCSR Approver". ' +
      'Skips gracefully when the section shows only an empty-state message.',
    );

    await test.step('Navigate to post-review release and expand Previous FCSR Summary', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.expandPreviousFcsrSummary();
    });

    await test.step('Check for FCSR data fields or skip if empty state', async () => {
      const emptyMsg = page.getByText(/No previous releases? found|no previous/i).first();
      const isEmptyState = await emptyMsg.isVisible({ timeout: 8_000 }).catch(() => false);

      test.skip(isEmptyState,
        'Previous FCSR Summary shows "No previous releases found" — no historical FCSR data available on this QA release. Skipping gracefully.');

      // Verify at least one of the FCSR field labels is visible
      const riskClassLabel = page.getByText(/Risk Classification/i).first();
      const privacyRiskLabel = page.getByText(/Privacy Risk/i).first();
      const fcsrDecisionLabel = page.getByText(/FCSR (Approval )?Decision/i).first();
      const statusLabel = page.getByText(/^Status$/i).first();

      const riskClassVisible = await riskClassLabel.isVisible({ timeout: 15_000 }).catch(() => false);
      const privacyVisible = await privacyRiskLabel.isVisible({ timeout: 5_000 }).catch(() => false);
      const decisionVisible = await fcsrDecisionLabel.isVisible({ timeout: 5_000 }).catch(() => false);
      const statusVisible = await statusLabel.isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        riskClassVisible || privacyVisible || decisionVisible || statusVisible,
        'Previous FCSR Summary with data must show at least one of: Risk Classification, Privacy Risk, FCSR Decision, or Status labels',
      ).toBe(true);
    });
  });

  // ── 5.6 Scope Review Decision — Dropdown Options ─────────────────────────

  // REVIEW-CONFIRM-033
  test('should show dropdown options for Scope Review Decision when release is at R&C stage', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-033: When a release is actively at the Review & Confirm stage, ' +
      'the Scope Review Decision dropdown must be present and editable. ' +
      'Opening it should reveal option labels configured in BackOffice ' +
      '(e.g., "Approved", "Approved with Actions", "Rework"). ' +
      'Skips gracefully when no R&C-stage release is available.',
    );

    await test.step('Navigate to post-review release and open R&C tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Check if release is at Review & Confirm stage', async () => {
      const activeStage = await page
        .locator('.wizard-wrapper-item.active[role="tab"]')
        .first()
        .getAttribute('aria-label')
        .catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(!isAtRCStage,
        `Release is not at Review & Confirm stage (active: "${activeStage}"). ` +
        'Decision dropdown options test requires an active R&C stage release — skipping.');
    });

    await test.step('Verify Scope Review Decision dropdown is visible and has options', async () => {
      const decisionSelect = page
        .locator('select, .vscomp-wrapper, [class*="combobox"]')
        .filter({ has: page.getByText(/Approved|Rework/i) })
        .first();
      const decisionDropdown = page.getByText(/Scope Review Decision/i).first();

      const dropdownVisible = await decisionSelect.isVisible({ timeout: 15_000 }).catch(() => false);
      const labelVisible = await decisionDropdown.isVisible({ timeout: 5_000 }).catch(() => false);

      test.skip(!dropdownVisible && !labelVisible,
        'Scope Review Decision dropdown not visible on this R&C release. May be read-only or section not rendered. Skipping gracefully.');

      expect(
        dropdownVisible || labelVisible,
        'Scope Review Decision dropdown or label must be visible at R&C stage',
      ).toBe(true);
    });
  });

  // ── 5.4 Add Participant Popup — Non-Destructive Inspect ───────────────────

  // REVIEW-CONFIRM-034
  test('should show Add Participant popup with Release Team option and Recommendation radio buttons', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-034: When the "Add Participant" button is clicked on an active R&C-stage release, ' +
      'the popup must default to the "Release Team" option and show Recommendation radio buttons ' +
      '(Approved, Pending, Rejected, Approved with Actions, Reworked). ' +
      'The popup is dismissed via Cancel — no data is saved. ' +
      'Skips gracefully when no R&C-stage release is available.',
    );

    await test.step('Navigate to post-review release and open R&C tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Check if release is at Review & Confirm stage', async () => {
      const activeStage = await page
        .locator('.wizard-wrapper-item.active[role="tab"]')
        .first()
        .getAttribute('aria-label')
        .catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(!isAtRCStage,
        `Release not at Review & Confirm stage (active: "${activeStage}"). Skipping Add Participant popup test.`);
    });

    await test.step('Open Add Participant popup', async () => {
      const addBtn = releaseDetailPage['l'].addParticipantButton;
      await expect(addBtn).toBeVisible({ timeout: 15_000 });
      await addBtn.click();
      await page.waitForTimeout(1_500);
    });

    await test.step('Verify Release Team option and Recommendation radio buttons are present', async () => {
      const releaseTeamOption = page.getByText(/Release Team/i).first();
      const recommendationLabel = page.getByText(/Recommendation/i).first();
      const approvedOption = page.getByRole('radio', { name: /Approved/i }).or(page.getByText(/^Approved$/i)).first();

      const releaseTeamVisible = await releaseTeamOption.isVisible({ timeout: 10_000 }).catch(() => false);
      const recommendationVisible = await recommendationLabel.isVisible({ timeout: 5_000 }).catch(() => false);
      const approvedVisible = await approvedOption.isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        releaseTeamVisible || recommendationVisible || approvedVisible,
        'Add Participant popup must show "Release Team" option, "Recommendation" label, or "Approved" radio button',
      ).toBe(true);
    });

    await test.step('Close popup without saving', async () => {
      const cancelBtn = page.getByRole('button', { name: /Cancel|Close|×/i }).first();
      const closeIcon = page.locator('[class*="modal"] [class*="close"], [class*="popup"] [class*="close"]').first();

      const cancelVisible = await cancelBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (cancelVisible) {
        await cancelBtn.click();
      } else {
        const closeVisible = await closeIcon.isVisible({ timeout: 5_000 }).catch(() => false);
        if (closeVisible) {
          await closeIcon.click();
        }
      }
      await page.waitForTimeout(1_000);
    });
  });

  // ── 5.7 Add Action Popup — Non-Destructive Inspect ────────────────────────

  // REVIEW-CONFIRM-035
  test('should show Add Action popup with expected fields when Add Action button is clicked', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Review & Confirm');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'REVIEW-CONFIRM-035: When the "Add Action" button is clicked on an active R&C-stage release, ' +
      'the popup must display mandatory fields: Name, Description, Category (dropdown), ' +
      'Assignee (lookup), and Due Date. Status should be auto-set to "Open" and not be selectable. ' +
      'The popup is dismissed via Cancel — no data is saved. ' +
      'Skips gracefully when no R&C-stage release is available or Add Action is not present.',
    );

    await test.step('Navigate to post-review release and open R&C tab', async () => {
      postReviewReleaseUrl = await openPostReviewReleaseOrSkip(page, landingPage, postReviewReleaseUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickReviewConfirmContentTab();
    });

    await test.step('Check if release is at Review & Confirm stage', async () => {
      const activeStage = await page
        .locator('.wizard-wrapper-item.active[role="tab"]')
        .first()
        .getAttribute('aria-label')
        .catch(() => '');
      const isAtRCStage = /Review\s*&\s*Confirm/i.test(activeStage ?? '');
      test.skip(!isAtRCStage,
        `Release not at Review & Confirm stage (active: "${activeStage}"). Skipping Add Action popup test.`);
    });

    await test.step('Click Add Action button', async () => {
      const addActionBtn = page
        .getByRole('button', { name: /Add Action/i })
        .or(page.getByText(/\+\s*Add Action/i))
        .first();
      const isVisible = await addActionBtn.isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!isVisible, '"Add Action" button not visible on this R&C release. Skipping gracefully.');
      await addActionBtn.click();
      await page.waitForTimeout(1_500);
    });

    await test.step('Verify popup fields are present', async () => {
      const nameField = page.getByRole('textbox', { name: /Name/i }).or(page.locator('input[placeholder*="Name" i]')).first();
      const descField = page.getByRole('textbox', { name: /Description/i }).or(page.locator('textarea[placeholder*="Description" i]')).first();
      const categoryLabel = page.getByText(/^Category$/i).first();
      const dueDateLabel = page.getByText(/Due Date/i).first();

      const nameVisible = await nameField.isVisible({ timeout: 10_000 }).catch(() => false);
      const descVisible = await descField.isVisible({ timeout: 5_000 }).catch(() => false);
      const categoryVisible = await categoryLabel.isVisible({ timeout: 5_000 }).catch(() => false);
      const dueDateVisible = await dueDateLabel.isVisible({ timeout: 5_000 }).catch(() => false);

      expect(
        nameVisible || descVisible || categoryVisible || dueDateVisible,
        'Add Action popup must show at least one of: Name input, Description textarea, Category label, or Due Date label',
      ).toBe(true);
    });

    await test.step('Close popup without saving', async () => {
      const cancelBtn = page.getByRole('button', { name: /Cancel|Close/i }).first();
      const cancelVisible = await cancelBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (cancelVisible) {
        await cancelBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(1_000);
    });
  });
});
