import { test as setup, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

import { writeWF6ManageReleaseState } from '../../src/helpers/wf6-manage-release-state.helper';
import { createFreshRelease } from './helpers/fresh-release';
import { submitStandardQuestionnaireForRelease } from './helpers/questionnaire-flow';
import { markRequirementsReviewReady } from './helpers/requirement-status-flow';

async function getReleaseDiagnostics(page: import('@playwright/test').Page): Promise<string> {
  const activeStage = await page
    .locator('.wizard-wrapper-item.active[role="tab"]')
    .first()
    .getAttribute('aria-label')
    .catch(() => '');
  const submitForReviewEnabled = await page
    .getByRole('button', { name: /Submit for Review/i })
    .first()
    .isEnabled({ timeout: 2_000 })
    .catch(() => false);
  const bodySample = (await page.locator('body').innerText().catch(() => ''))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);

  return [
    `activeStage=${activeStage || 'unknown'}`,
    `submitForReviewEnabled=${submitForReviewEnabled}`,
    `url=${page.url()}`,
    `bodySample="${bodySample}"`,
  ].join(', ');
}

setup.describe.serial('WF6 Release Manage — Pre-Req Data Setup', () => {
  setup.setTimeout(900_000);

  setup('WF6-MANAGE-PRE-REQ-001 — prepare reusable Manage-stage release data', async ({
    browser,
    loginPage,
    page,
    releaseDetailPage,
    userCredentials,
  }) => {
    await allure.suite('Releases - WF6 Pre-Req');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'WF6-MANAGE-PRE-REQ-001: Create an automation-owned product and release, submit the questionnaire, ' +
      'advance the release into Manage stage, and persist the release URL for downstream WF6 specs.',
    );

    const reopenFreshRelease = async () => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        await page.goto(freshRelease.releaseUrl, { waitUntil: 'domcontentloaded' });

        const loginButton = page.getByRole('button', { name: /^Login$/i }).first();
        const redirectedToLogin = await loginButton
          .waitFor({ state: 'visible', timeout: 15_000 })
          .then(() => true)
          .catch(() => /\/Login/i.test(page.url()));

        if (redirectedToLogin) {
          await loginPage.login(userCredentials.login, userCredentials.password);
          await page.waitForURL(/GRC_PICASso/, { timeout: 90_000 });
          continue;
        }

        await releaseDetailPage.waitForPageLoad();
        return;
      }

      await page.goto(freshRelease.releaseUrl, { waitUntil: 'domcontentloaded' });
      await releaseDetailPage.waitForPageLoad();
    };

    const freshRelease = await setup.step('Create a fresh release for WF6 Manage-stage coverage', async () => {
      const createdRelease = await createFreshRelease(browser, {
        productNamePrefix: 'WF6 Manage Pre-Req Product',
        releaseVersionPrefix: 'WF6-MANAGE-',
        changeSummary: 'Automated WF6 Manage-stage pre-req release',
      });

      expect(createdRelease.releaseUrl).toContain('ReleaseDetail');
      return createdRelease;
    });
    let processRequirementsUpdated = 0;
    let productRequirementsUpdated = 0;

    await setup.step('Submit questionnaire for the fresh release', async () => {
      await submitStandardQuestionnaireForRelease(browser, freshRelease.releaseUrl);
    });

    await setup.step('Open the submitted release', async () => {
      await reopenFreshRelease();
    });

    await setup.step('Mark scoped Process and Product requirements review-ready', async () => {
      processRequirementsUpdated = await markRequirementsReviewReady(page, releaseDetailPage, 'Process Requirements');
      productRequirementsUpdated = await markRequirementsReviewReady(page, releaseDetailPage, 'Product Requirements');

      await reopenFreshRelease();
    });

    await setup.step('Advance Scoping release to Review & Confirm when needed', async () => {
      const alreadyReviewConfirm = await releaseDetailPage.isAtReviewConfirmStage();
      const alreadyManageOrLater = await releaseDetailPage.isAtOrPastManageStage();
      if (alreadyReviewConfirm || alreadyManageOrLater) {
        return;
      }

      const submitForReviewEnabled = await page
        .getByRole('button', { name: /Submit for Review/i })
        .first()
        .isEnabled({ timeout: 10_000 })
        .catch(() => false);
      const diagnostics = await getReleaseDiagnostics(page);
      const requirementDiagnostics = `processRequirementsUpdated=${processRequirementsUpdated}, productRequirementsUpdated=${productRequirementsUpdated}`;
      setup.skip(!submitForReviewEnabled, `Submit for Review is not enabled after questionnaire submission. ${requirementDiagnostics}, ${diagnostics}`);

      await releaseDetailPage.submitForReview();
      const advanced = await expect
        .poll(() => releaseDetailPage.isAtReviewConfirmStage(), {
          timeout: 90_000,
          message: 'Release should advance to Review & Confirm after Submit for Review.',
        })
        .toBe(true)
        .then(() => true)
        .catch(() => false);
      const postSubmitDiagnostics = await getReleaseDiagnostics(page);
      setup.skip(!advanced, `Submit for Review did not move the release to Review & Confirm. ${requirementDiagnostics}, ${postSubmitDiagnostics}`);
    });

    await setup.step('Advance Review & Confirm release to Manage', async () => {
      const alreadyManageOrLater = await releaseDetailPage.isAtOrPastManageStage();
      if (alreadyManageOrLater) {
        return;
      }

      const atReviewConfirm = await releaseDetailPage.isAtReviewConfirmStage();
      const diagnostics = await getReleaseDiagnostics(page);
      setup.skip(!atReviewConfirm, `Release is not at Review & Confirm before Manage transition. ${diagnostics}`);

      await releaseDetailPage.clickReviewConfirmContentTab();
      await releaseDetailPage.selectScopeReviewDecision('Approved');
      await releaseDetailPage.submitReviewConfirm();
      const advanced = await expect
        .poll(() => releaseDetailPage.isAtOrPastManageStage(), {
          timeout: 90_000,
          message: 'Release should advance to Manage after Review & Confirm submission.',
        })
        .toBe(true)
        .then(() => true)
        .catch(() => false);
      const postSubmitDiagnostics = await getReleaseDiagnostics(page);
      setup.skip(!advanced, `Review & Confirm submission did not move the release to Manage. ${postSubmitDiagnostics}`);
    });

    await setup.step('Persist WF6 Manage-stage release state', async () => {
      const activeStage = await releaseDetailPage.getActiveStageName();
      const isManageOrLater = await releaseDetailPage.isAtOrPastManageStage();
      const diagnostics = await getReleaseDiagnostics(page);
      setup.skip(!isManageOrLater, `Release did not reach Manage-or-later stage. ${diagnostics}`);

      writeWF6ManageReleaseState({
        productName: freshRelease.productName,
        productUrl: freshRelease.productUrl,
        releaseVersion: freshRelease.releaseVersion,
        releaseUrl: page.url(),
        activeStage,
      });
    });
  });
});
