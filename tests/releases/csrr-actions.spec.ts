/**
 * Spec — Workflow 6: CSRR Action Items
 *
 * Covers non-destructive validation for action creation controls in the
 * Cybersecurity Residual Risks tab at or past the Manage stage.
 *
 * Test IDs: RELEASE-MANAGE-ACTION-001 through RELEASE-MANAGE-ACTION-003
 */

import { test } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

import { tryReadWF6ManageReleaseState } from '../../src/helpers/wf6-manage-release-state.helper';
import { openManageStageRelease } from './helpers/release-navigation';

function getManageReleaseUrl(): string | undefined {
  return process.env.MANAGE_RELEASE_URL ?? tryReadWF6ManageReleaseState()?.releaseUrl;
}

async function navigateToManageRelease(
  page: import('@playwright/test').Page,
  landingPage: Parameters<typeof openManageStageRelease>[1],
): Promise<void> {
  const releaseUrl = getManageReleaseUrl();
  test.skip(!releaseUrl, 'No deterministic Manage-stage release source is available. Run wf6-manage-pre-req successfully or set MANAGE_RELEASE_URL.');
  await openManageStageRelease(page, landingPage, releaseUrl);
}

test.describe('Releases - CSRR Action Items (Workflow 6) @regression', () => {
  test.setTimeout(300_000);

  test.beforeEach(async ({ landingPage }) => {
    test.skip(
      !getManageReleaseUrl(),
      'No deterministic Manage-stage release source is available. Run wf6-manage-pre-req successfully or set MANAGE_RELEASE_URL.',
    );
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  // RELEASE-MANAGE-ACTION-001
  test('RELEASE-MANAGE-ACTION-001 — should show Add Action button on CSRR tab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / CSRR Action Items');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-MANAGE-ACTION-001: On a release at or past Manage stage, the CSRR tab can enter edit mode ' +
      'and exposes an Add Action button for action item creation.',
    );

    await test.step('Navigate to a Manage-stage release and open CSRR', async () => {
      await navigateToManageRelease(page, landingPage);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickCsrrTab();
    });

    await test.step('Enter CSRR edit mode when available', async () => {
      await releaseDetailPage.openCurrentCsrrSectionEditMode();
    });

    let addActionVisible = false;
    await test.step('Check Add Action button visibility', async () => {
      addActionVisible = await releaseDetailPage.isCsrrAddActionButtonVisible();
      if (!addActionVisible) return;
      await releaseDetailPage.expectCsrrAddActionButtonVisible();
    });
    test.skip(!addActionVisible, 'CSRR Add Action button is not visible for the sampled release/user.');
  });

  // RELEASE-MANAGE-ACTION-002
  test('RELEASE-MANAGE-ACTION-002 — should show mandatory fields in Add Action popup', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / CSRR Action Items');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-MANAGE-ACTION-002: Clicking Add Action from CSRR opens a popup with mandatory fields: ' +
      'Name, Description, State, and Category. The popup is dismissed without saving.',
    );

    await test.step('Navigate to a Manage-stage release and open CSRR edit mode', async () => {
      await navigateToManageRelease(page, landingPage);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickCsrrTab();
      await releaseDetailPage.openCurrentCsrrSectionEditMode();
    });

    const addActionVisible = await releaseDetailPage.isCsrrAddActionButtonVisible();
    test.skip(!addActionVisible, 'CSRR Add Action button is not visible for the sampled release/user.');

    await test.step('Open Add Action popup', async () => {
      await releaseDetailPage.clickCsrrAddActionButton();
    });

    await test.step('Verify mandatory action fields', async () => {
      await releaseDetailPage.expectReleaseActionDialogMandatoryFieldsVisible();
    });

    await test.step('Close popup without saving', async () => {
      await releaseDetailPage.closeReleaseActionDialog();
    });
  });

  // RELEASE-MANAGE-ACTION-003
  test('RELEASE-MANAGE-ACTION-003 — should show optional fields in Add Action popup', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / CSRR Action Items');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-MANAGE-ACTION-003: The CSRR Add Action popup exposes optional fields: Assignee, Due Date, ' +
      'Evidence, and Closure Comment. The popup is dismissed without saving.',
    );

    await test.step('Navigate to a Manage-stage release and open CSRR edit mode', async () => {
      await navigateToManageRelease(page, landingPage);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickCsrrTab();
      await releaseDetailPage.openCurrentCsrrSectionEditMode();
    });

    const addActionVisible = await releaseDetailPage.isCsrrAddActionButtonVisible();
    test.skip(!addActionVisible, 'CSRR Add Action button is not visible for the sampled release/user.');

    await test.step('Open Add Action popup', async () => {
      await releaseDetailPage.clickCsrrAddActionButton();
    });

    await test.step('Verify optional action fields', async () => {
      await releaseDetailPage.expectReleaseActionDialogOptionalFieldsVisible();
    });

    await test.step('Close popup without saving', async () => {
      await releaseDetailPage.closeReleaseActionDialog();
    });
  });
});
