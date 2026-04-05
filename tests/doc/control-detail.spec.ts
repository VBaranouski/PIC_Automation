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
  });
});
