import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';
import { openPreQuestionnaireRelease } from './helpers/release-navigation';

test.describe.serial('Releases - Product Requirements gating @regression', () => {
  test.setTimeout(300_000);

  let releaseDetailUrl = '';

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('should keep Product Requirements disabled until questionnaire submission', async ({
    page,
    landingPage,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Product Requirements');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-PRODUCT-REQ-001: Before questionnaire submission, the Product Requirements tab remains disabled and Submit for Review stays unavailable.',
    );

    await test.step('Navigate to a pre-questionnaire Release Detail page', async () => {
      releaseDetailUrl = await openPreQuestionnaireRelease(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Open the Questionnaire tab and verify pre-questionnaire state', async () => {
      await releaseDetailPage.clickTopLevelTab('Questionnaire');
      await releaseDetailPage.expectTopLevelTabSelected('Questionnaire');
      await releaseDetailPage.expectStartQuestionnaireVisible();
      await expect(page.getByRole('button', { name: /Submit for Review/i }).first()).toBeDisabled();
    });

    await test.step('Verify Product Requirements remains disabled', async () => {
      await releaseDetailPage.expectTabDisabled('Product Requirements');
    });
  });

  test('should not allow Product Requirements to become the active tab before questionnaire submission', async ({
    page,
    landingPage,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Product Requirements');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-PRODUCT-REQ-002: While the release is still pre-questionnaire, Product Requirements remains disabled and never becomes the selected tab.',
    );

    await test.step('Navigate to a pre-questionnaire Release Detail page', async () => {
      releaseDetailUrl = await openPreQuestionnaireRelease(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Stay on Questionnaire and verify Product Requirements is not active', async () => {
      await releaseDetailPage.clickTopLevelTab('Questionnaire');
      await releaseDetailPage.expectTopLevelTabSelected('Questionnaire');
      await releaseDetailPage.expectTabDisabled('Product Requirements');
      await releaseDetailPage.expectTopLevelTabNotSelected('Product Requirements');
    });
  });
});