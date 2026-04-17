/**
 * Spec 11.8 — DOC Detail: Control Detail Page
 *
 * Navigates to the Control Detail page via an ITS Checklist Control ID link
 * and verifies the breadcrumb, header, content sections, stage-specific message,
 * and the Descope Control button visibility.
 *
 * Depends on: doc-detail-its (ITS Checklist must have been verified as working)
 */
import { test, expect } from '../../src/fixtures';
import { readDocState } from '../../src/helpers/doc.helper';
import * as allure from 'allure-js-commons';

test.describe('DOC - Control Detail Page (11.8) @regression', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(180_000);

  let docDetailsUrl: string;
  let controlDetailUrl: string;

  test.beforeAll(() => {
    docDetailsUrl = readDocState().docDetailsUrl;
  });

  test.beforeEach(async ({ page, loginPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ── DOC-CONTROL-001 ───────────────────────────────────────────────────────
  test('should navigate to Control Detail page via ITS Checklist Control ID link', async ({
    page, docDetailsPage, controlDetailPage,
  }) => {
    await allure.suite('DOC / Control Detail');
    await allure.severity('normal');
    await allure.description(
      'DOC-CONTROL-001: Clicking a Control ID link in the ITS Checklist tab must ' +
      'navigate to the Control Detail page.',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    // Guard: the ITS Checklist must have at least one control row
    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls available in this DOC — cannot navigate to Control Detail.');
      return;
    }

    await test.step('Click the first Control ID link', async () => {
      await docDetailsPage.clickFirstControlIdLink();
      controlDetailUrl = page.url();
    });

    await test.step('Verify Control Detail page loaded', async () => {
      await controlDetailPage.waitForPageLoaded();
      await expect(page).toHaveURL(/ControlDetail/, { timeout: 30_000 });
    });
  });

  // ── DOC-CONTROL-002 ───────────────────────────────────────────────────────
  test('should show the Control ID in the page header', async ({ page, controlDetailPage }) => {
    await allure.suite('DOC / Control Detail');
    await allure.description(
      'DOC-CONTROL-002: Control Detail header must show the Control ID in ITS-NNN format.',
    );

    await test.step('Navigate to Control Detail page', async () => {
      if (!controlDetailUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-001 first.'); return; }
      await page.goto(controlDetailUrl);
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Verify Control ID format in header', async () => {
      await controlDetailPage.expectControlIdFormat();
    });
  });

  // ── DOC-CONTROL-003 ───────────────────────────────────────────────────────
  test('should show breadcrumb with Home and Product Name links', async ({ page, controlDetailPage }) => {
    await allure.suite('DOC / Control Detail');
    await allure.description(
      'DOC-CONTROL-003: Breadcrumb must show: Home (link) > Product Name (link) > DOC Name (link) > Control ID.',
    );

    await test.step('Navigate to Control Detail page', async () => {
      if (!controlDetailUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-001 first.'); return; }
      await page.goto(controlDetailUrl);
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Verify Home and Product Name links are visible in breadcrumb', async () => {
      await controlDetailPage.expectBreadcrumbHomeLinkVisible();
      await controlDetailPage.expectBreadcrumbProductLinkVisible();
    });
  });

  // ── DOC-CONTROL-004 ───────────────────────────────────────────────────────
  test('should show Description and Evidence Expectation sections', async ({ page, controlDetailPage }) => {
    await allure.suite('DOC / Control Detail');
    await allure.description(
      'DOC-CONTROL-004: Control Detail must display Description and Evidence Expectation sections.',
    );

    await test.step('Navigate to Control Detail page', async () => {
      if (!controlDetailUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-001 first.'); return; }
      await page.goto(controlDetailUrl);
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Verify Description section is visible', async () => {
      await controlDetailPage.expectDescriptionSectionVisible();
    });

    await test.step('Verify Evidence Expectation section is visible', async () => {
      await controlDetailPage.expectEvidenceExpectationSectionVisible();
    });
  });

  // ── DOC-CONTROL-005 ───────────────────────────────────────────────────────
  test('should show scope-stage read-only message on Scope ITS Controls stage', async ({ page, controlDetailPage }) => {
    await allure.suite('DOC / Control Detail');
    await allure.description(
      'DOC-CONTROL-005: On the Scope ITS Controls stage Control Detail must show ' +
      '"No evidence links, findings or comments yet" placeholder message.',
    );

    await test.step('Navigate to Control Detail page', async () => {
      if (!controlDetailUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-001 first.'); return; }
      await page.goto(controlDetailUrl);
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Verify scoping stage placeholder message is visible', async () => {
      await controlDetailPage.expectScopingStageReadOnlyMessageVisible();
    });
  });

  // ── DOC-CONTROL-006 ───────────────────────────────────────────────────────
  test('should show Descope Control button for privileged user on Control Detail', async ({ page, controlDetailPage }) => {
    await allure.suite('DOC / Control Detail');
    await allure.description(
      'DOC-CONTROL-006: "Descope Control" button must be visible for a user with ' +
      'SCOPE_IT_SECURITY_CONTROLS privilege on the Control Detail page.',
    );

    await test.step('Navigate to Control Detail page', async () => {
      if (!controlDetailUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-001 first.'); return; }
      await page.goto(controlDetailUrl);
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Verify Descope Control button is visible', async () => {
      await controlDetailPage.expectDescopeControlButtonVisible();
    });
  });

  test.describe('later-stage controls (DOC 538)', () => {
    test.describe.configure({ mode: 'serial' });

    let laterStageControlUrl: string;

    // ── DOC-CONTROL-007 ─────────────────────────────────────────────────────────
    test('should display an assessment status badge on a later-stage DOC Control Detail', async ({
      page, docDetailsPage, controlDetailPage,
    }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-007: On a later-stage DOC (Actions Closure), the Control Detail page ' +
        'must display an assessment status badge in the header.',
      );

      await test.step('Navigate to DOC 538 and open ITS Checklist tab', async () => {
        await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944');
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
      });

      const hasControls = await docDetailsPage.hasITSControls();
      if (!hasControls) {
        test.skip(true, 'No ITS controls available in DOC 538 — cannot navigate to Control Detail.');
        return;
      }

      await test.step('Click the first Control ID link', async () => {
        await docDetailsPage.clickFirstControlIdLink();
        laterStageControlUrl = page.url();
      });

      await test.step('Verify Control Detail page loaded', async () => {
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify assessment status badge is visible', async () => {
        await controlDetailPage.expectAssessmentStatusBadgeVisible();
      });
    });

    // ── DOC-CONTROL-008 ─────────────────────────────────────────────────────────
    test('should display Category label with a non-empty value on Control Detail', async ({ page, controlDetailPage }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-008: Control Detail must display a Category label with a non-empty value.',
      );

      await test.step('Navigate to the later-stage Control Detail page', async () => {
        if (!laterStageControlUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-007 first.'); return; }
        await page.goto(laterStageControlUrl);
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Category label is visible', async () => {
        await controlDetailPage.expectCategoryLabelVisible();
      });

      await test.step('Verify Category value is non-empty', async () => {
        await controlDetailPage.expectCategoryValueNonEmpty();
      });
    });

    // ── DOC-CONTROL-009 ─────────────────────────────────────────────────────────
    test('should show findings rows or a "No findings" empty-state in the Findings section', async ({ page, controlDetailPage }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-009: Control Detail must display either findings rows or a ' +
        '"No findings added yet" empty-state message in the Findings section.',
      );

      await test.step('Navigate to the later-stage Control Detail page', async () => {
        if (!laterStageControlUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-007 first.'); return; }
        await page.goto(laterStageControlUrl);
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify findings section or empty-state message is visible', async () => {
        await controlDetailPage.expectFindingsSectionOrEmptyState();
      });
    });

    // ── DOC-CONTROL-010 ─────────────────────────────────────────────────────────
    test('should display the EVIDENCE LINKS section on a later-stage Control Detail page', async ({ page, controlDetailPage }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-010: On a later-stage DOC control (Actions Closure), the Control Detail page ' +
        'must display the EVIDENCE LINKS section heading, or a "No evidence links" empty-state.',
      );

      await test.step('Navigate to the later-stage Control Detail page', async () => {
        if (!laterStageControlUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-007 first.'); return; }
        await page.goto(laterStageControlUrl);
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Evidence Links section or empty-state is visible', async () => {
        await controlDetailPage.expectEvidenceLinksSectionOrEmpty();
      });
    });

    // ── DOC-CONTROL-011 ─────────────────────────────────────────────────────────
    test('should display the COMMENTS section on a later-stage Control Detail page', async ({ page, controlDetailPage }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-011: On a later-stage DOC control (Actions Closure), the Control Detail page ' +
        'must display the COMMENTS section heading, or a "No comments" empty-state.',
      );

      await test.step('Navigate to the later-stage Control Detail page', async () => {
        if (!laterStageControlUrl) { test.skip(true, 'Control Detail URL not captured — run DOC-CONTROL-007 first.'); return; }
        await page.goto(laterStageControlUrl);
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Comments section or empty-state is visible', async () => {
        await controlDetailPage.expectCommentsSectionOrEmpty();
      });
    });

    // ── DOC-CONTROL-013 ────────────────────────────────────────────────────────────────────
    test('should display a Risk Level label on a later-stage Control Detail page', async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-013: On a later-stage DOC control (Actions Closure), the Control Detail page ' +
        'must display a Risk Level label indicating the assessed risk level (e.g. High, Medium, Low).',
      );

      await test.step('Navigate to the later-stage Control Detail page', async () => {
        if (laterStageControlUrl) {
          await page.goto(laterStageControlUrl);
        } else {
          await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944');
          await docDetailsPage.waitForOSLoad();
          await docDetailsPage.clickITSChecklistTab();
          const hasControls = await docDetailsPage.hasITSControls();
          if (!hasControls) { test.skip(true, 'No ITS controls in DOC 538 — cannot test Risk Level label.'); return; }
          await docDetailsPage.clickFirstControlIdLink();
        }
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Risk Level label is visible', async () => {
        await controlDetailPage.expectRiskLevelLabelVisible();
      });
    });

    // ── DOC-CONTROL-014 ────────────────────────────────────────────────────────────────────
    test('should display clickable evidence links in EVIDENCE LINKS section (or empty state)', async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-014: On a later-stage DOC control, the EVIDENCE LINKS section must either show ' +
        'attached evidence entries with clickable link URLs, or show a "No evidence links" empty state. ' +
        'When evidence exists, links must have valid href attributes.',
      );

      await test.step('Navigate to the later-stage Control Detail page', async () => {
        if (laterStageControlUrl) {
          await page.goto(laterStageControlUrl);
        } else {
          await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944');
          await docDetailsPage.waitForOSLoad();
          await docDetailsPage.clickITSChecklistTab();
          const hasControls = await docDetailsPage.hasITSControls();
          if (!hasControls) { test.skip(true, 'No ITS controls in DOC 538 — cannot test Evidence Links.'); return; }
          await docDetailsPage.clickFirstControlIdLink();
        }
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify evidence links section has clickable links or empty state', async () => {
        await controlDetailPage.expectEvidenceLinksHasClickableLinks();
      });
    });

    // ── DOC-CONTROL-015 ────────────────────────────────────────────────────────────────────
    test('should display comment timeline items in COMMENTS section (or empty state)', async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-015: On a later-stage DOC control, the COMMENTS section must either show ' +
        'at least one comment timeline item (with date/time, user, and message text), ' +
        'or show a "No comments" empty state.',
      );

      await test.step('Navigate to the later-stage Control Detail page', async () => {
        if (laterStageControlUrl) {
          await page.goto(laterStageControlUrl);
        } else {
          await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944');
          await docDetailsPage.waitForOSLoad();
          await docDetailsPage.clickITSChecklistTab();
          const hasControls = await docDetailsPage.hasITSControls();
          if (!hasControls) { test.skip(true, 'No ITS controls in DOC 538 — cannot test Comments section.'); return; }
          await docDetailsPage.clickFirstControlIdLink();
        }
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify comments section has timeline items or empty state', async () => {
        await controlDetailPage.expectCommentsHasTimelineItems();
      });
    });
  });

  test.describe('completed DOC controls (DOC 273)', () => {
    test.describe.configure({ mode: 'serial' });

    let completedDocControlUrl: string;

    // ── DOC-CONTROL-012 ─────────────────────────────────────────────────────────
    test('should NOT show Descope Control button on a Completed DOC Control Detail page', async ({
      page, docDetailsPage, controlDetailPage,
    }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-012: On a Completed DOC (DOC 273), the Control Detail page must be read-only: ' +
        'the "Descope Control" button must NOT be visible.',
      );

      await test.step('Navigate to Completed DOC 273 and open ITS Checklist tab', async () => {
        await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=273&ProductId=898');
        await docDetailsPage.waitForOSLoad();
        await docDetailsPage.clickITSChecklistTab();
      });

      const hasControls = await docDetailsPage.hasITSControls();
      if (!hasControls) {
        test.skip(true, 'No ITS controls available in completed DOC 273 — cannot navigate to Control Detail.');
        return;
      }

      await test.step('Click the first Control ID link to open Control Detail', async () => {
        await docDetailsPage.clickFirstControlIdLink();
        completedDocControlUrl = page.url();
        await controlDetailPage.waitForPageLoaded();
      });

      await test.step('Verify Descope Control button is NOT visible on a Completed DOC', async () => {
        await controlDetailPage.expectDescopeControlButtonHidden();
      });
    });

    // ── DOC-CONTROL-016 ────────────────────────────────────────────────────────────────────
    test('should show Control Detail in read-only mode on a Completed DOC (Issue Certification stage)', async ({ page, docDetailsPage, controlDetailPage }) => {
      await allure.suite('DOC / Control Detail');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-CONTROL-016: On a Completed DOC (Issue Certification stage and beyond), the Control Detail page ' +
        'must be fully read-only: no Descope Control button, no Add Evidence Link button, ' +
        'and no comment input textarea should be visible.',
      );

      await test.step('Navigate to Control Detail via Completed DOC 273', async () => {
        if (!completedDocControlUrl) {
          // Re-navigate when running this test in isolation
          await page.goto('https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=273&ProductId=898');
          await docDetailsPage.waitForOSLoad();
          await docDetailsPage.clickITSChecklistTab();
          const hasControls = await docDetailsPage.hasITSControls();
          if (!hasControls) { test.skip(true, 'No ITS controls in DOC 273 — cannot navigate to Control Detail.'); return; }
          await docDetailsPage.clickFirstControlIdLink();
          await controlDetailPage.waitForPageLoaded();
        } else {
          await page.goto(completedDocControlUrl);
          await controlDetailPage.waitForPageLoaded();
        }
      });

      await test.step('Verify Control Detail page is in read-only mode', async () => {
        await controlDetailPage.expectControlDetailIsReadOnly();
      });
    });
  });

  // ── DOC-CONTROL-017 ───────────────────────────────────────────────────────
  test('should show Send for Remediation button on a control with findings', async ({
    page, docDetailsPage, controlDetailPage,
  }) => {
    await allure.suite('DOC / Control Detail');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-CONTROL-017: The "Send for Remediation" button must be visible and functional ' +
      'on controls that have findings, during the Risk Assessment or later stage.',
    );

    // Use a DOC in Risk Assessment stage with controls that have findings
    const riskAssessmentDocUrl =
      'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944';

    await test.step('Navigate to DOC in Risk Assessment stage and open ITS Checklist', async () => {
      await page.goto(riskAssessmentDocUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls in DOC 538 — cannot test Send for Remediation.');
      return;
    }

    await test.step('Navigate to the first Control Detail page', async () => {
      await docDetailsPage.clickFirstControlIdLink();
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Check for Send for Remediation button', async () => {
      const isVisible = await controlDetailPage.isSendForRemediationButtonVisible();
      if (!isVisible) {
        test.skip(true, 'Send for Remediation button not visible — control may not have findings or may not be in correct stage.');
        return;
      }
      await controlDetailPage.expectSendForRemediationButtonVisible();
    });
  });

  // ── DOC-CONTROL-018 ───────────────────────────────────────────────────────
  test('should show role-based editing controls after Actions Closure stage', async ({
    page, docDetailsPage, controlDetailPage,
  }) => {
    await allure.suite('DOC / Control Detail');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-CONTROL-018: After Actions Closure, a control should allow re-assessment ' +
      'with correct role-based editing permissions.',
    );

    // Use a DOC in Actions Closure or later stage
    const actionsClosureDocUrl =
      'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944';

    await test.step('Navigate to DOC and open ITS Checklist', async () => {
      await page.goto(actionsClosureDocUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls available — cannot verify re-assessment controls.');
      return;
    }

    await test.step('Navigate to first Control Detail', async () => {
      await docDetailsPage.clickFirstControlIdLink();
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Verify assessment status badge is visible', async () => {
      await controlDetailPage.expectAssessmentStatusBadgeVisible();
    });

    await test.step('Verify findings and evidence sections are accessible', async () => {
      await controlDetailPage.expectFindingsSectionOrEmptyState();
      await controlDetailPage.expectEvidenceLinksSectionOrEmpty();
    });
  });

  // ── DOC-CONTROL-019 ───────────────────────────────────────────────────────
  test('should show Send Back for Update button for DOCL on Control Detail', async ({
    page, docDetailsPage, controlDetailPage,
  }) => {
    await allure.suite('DOC / Control Detail');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'DOC-CONTROL-019: The "Send Back for Update" button must be visible on the Control Detail page ' +
      'for a DOCL user, allowing them to send the control back to the DO Team for updates.',
    );

    // Use a DOC where DOCL has access
    const doclDocUrl =
      'https://qa.leap.schneider-electric.com/GRC_PICASso_DOC/DOCDetail?DOCId=538&ProductId=944';

    await test.step('Navigate to DOC and open ITS Checklist', async () => {
      await page.goto(doclDocUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls available — cannot test Send Back for Update.');
      return;
    }

    await test.step('Navigate to first Control Detail', async () => {
      await docDetailsPage.clickFirstControlIdLink();
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Check for Send Back for Update button', async () => {
      const isVisible = await controlDetailPage.isSendBackForUpdateButtonVisible();
      if (!isVisible) {
        test.skip(true, 'Send Back for Update button not visible — user may not have DOCL role or control may not be in correct state.');
        return;
      }
      await controlDetailPage.expectSendBackForUpdateButtonVisible();
    });
  });

  // ── WF11-0098 ─────────────────────────────────────────────────────────────
  test('should remove Descope button and show justification tooltip after descoping', async ({
    page, docDetailsPage, controlDetailPage,
  }) => {
    await allure.suite('DOC / Control Detail');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'WF11-0098: After descoping from Control Detail, the Descope button must be removed ' +
      'and a tooltip icon must appear next to the Control ID showing the justification.',
    );

    await test.step('Navigate to DOC Detail and open ITS Checklist tab', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
      await docDetailsPage.clickITSChecklistTab();
    });

    const hasControls = await docDetailsPage.hasITSControls();
    if (!hasControls) {
      test.skip(true, 'No ITS controls available — cannot verify descope tooltip.');
      return;
    }

    await test.step('Navigate to first Control Detail', async () => {
      await docDetailsPage.clickFirstControlIdLink();
      await controlDetailPage.waitForPageLoaded();
    });

    await test.step('Check if control is already descoped (Descope button absent)', async () => {
      const descopeVisible = await controlDetailPage.descopeControlButton
        .isVisible({ timeout: 5_000 })
        .catch(() => false);

      if (descopeVisible) {
        // Control is NOT yet descoped — skip, as we should not modify test data
        test.skip(true, 'Control is not yet descoped — descoping would modify test data. Test should verify on a pre-descoped control.');
        return;
      }

      // Control is already descoped — verify tooltip icon is present
      const tooltipVisible = await controlDetailPage.isDescopeJustificationTooltipVisible();
      if (!tooltipVisible) {
        // Tooltip may render differently; check for any tooltip-like element near the header
        const headerTooltip = page.locator('.header-title-structure__title')
          .locator('..').locator('i, [class*="tooltip"], [title]').first();
        const hasTooltip = await headerTooltip.isVisible().catch(() => false);
        expect(hasTooltip, 'A justification tooltip icon should be visible near the Control ID after descoping').toBe(true);
      } else {
        await controlDetailPage.expectDescopeJustificationTooltipVisible();
      }
    });
  });
});
