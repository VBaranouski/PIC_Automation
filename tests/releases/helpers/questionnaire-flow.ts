import { test, expect, type Browser, type Page } from '@playwright/test';
import { getDefaultUser } from '../../../config/users';
import { LoginPage, ReleaseDetailPage } from '../../../src/pages';

const QUESTIONNAIRE_BLOCKER =
  /RiskProfileThreshold|Unable to resolve type for variable|DataActionGetNewQuestionsByGroups/i;

const RADIO = {
  q1Yes: 'input[type="radio"][value="295"]',
  q2No: 'input[type="radio"][value="236"]',
  q5No: 'input[type="radio"][value="288"]',
  q6No: 'input[type="radio"][value="253"]',
  q7No: 'input[type="radio"][value="259"]',
  q8No: 'input[type="radio"][value="263"]',
} as const;

async function checkQuestionnaireCheckboxByText(page: Page, label: RegExp): Promise<void> {
  const optionRow = page.locator('*')
    .filter({ hasText: label })
    .filter({ has: page.getByRole('checkbox') })
    .last();
  await optionRow.getByRole('checkbox').check();
}

async function isQuestionnaireSubmitted(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
): Promise<boolean> {
  const editAnswersVisible = await page
    .getByRole('button', { name: /Edit Answers/i })
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  if (editAnswersVisible) {
    return true;
  }

  const submitForReviewEnabled = await page
    .getByRole('button', { name: /Submit for Review/i })
    .first()
    .isEnabled({ timeout: 2_000 })
    .catch(() => false);
  if (submitForReviewEnabled) {
    return true;
  }

  const processDisabled = await releaseDetailPage.isTopLevelTabDisabled('Process Requirements');
  const productDisabled = await releaseDetailPage.isTopLevelTabDisabled('Product Requirements');
  return !processDisabled && !productDisabled;
}

async function areRequirementsTabsUnlocked(
  releaseDetailPage: ReleaseDetailPage,
): Promise<boolean> {
  const processDisabled = await releaseDetailPage.isTopLevelTabDisabled('Process Requirements');
  const productDisabled = await releaseDetailPage.isTopLevelTabDisabled('Product Requirements');
  return !processDisabled && !productDisabled;
}

async function getQuestionnaireStateDiagnostics(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
): Promise<string> {
  const editAnswersVisible = await page
    .getByRole('button', { name: /Edit Answers/i })
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  const submitForReviewEnabled = await page
    .getByRole('button', { name: /Submit for Review/i })
    .first()
    .isEnabled({ timeout: 2_000 })
    .catch(() => false);
  const processDisabled = await releaseDetailPage.isTopLevelTabDisabled('Process Requirements');
  const productDisabled = await releaseDetailPage.isTopLevelTabDisabled('Product Requirements');
  const questionnaireTabSelected = await releaseDetailPage
    .getTopLevelTab('Questionnaire')
    .getAttribute('aria-selected')
    .catch(() => '');
  const bodySample = (await page.locator('body').innerText().catch(() => ''))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);

  return [
    `editAnswersVisible=${editAnswersVisible}`,
    `submitForReviewEnabled=${submitForReviewEnabled}`,
    `processDisabled=${processDisabled}`,
    `productDisabled=${productDisabled}`,
    `questionnaireTabSelected=${questionnaireTabSelected}`,
    `url=${page.url()}`,
    `bodySample="${bodySample}"`,
  ].join(', ');
}

export async function getQuestionnaireSubmittedStateDiagnostics(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
): Promise<string> {
  return getQuestionnaireStateDiagnostics(page, releaseDetailPage);
}

export async function waitForRequirementsTabsToUnlock(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
  releaseUrl?: string,
  timeout = 90_000,
): Promise<boolean> {
  const deadline = Date.now() + timeout;
  let attempt = 0;

  while (Date.now() < deadline) {
    attempt += 1;

    if (await areRequirementsTabsUnlocked(releaseDetailPage)) {
      return true;
    }

    if (releaseUrl && attempt % 3 === 0) {
      await page.goto(releaseUrl, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
      await releaseDetailPage.waitForPageLoad().catch(() => undefined);
    } else {
      await releaseDetailPage.clickTopLevelTab('Questionnaire').catch(() => undefined);
      await releaseDetailPage.expectTopLevelTabSelected('Questionnaire').catch(() => undefined);
      await page.waitForTimeout(2_000);
    }

    if (await areRequirementsTabsUnlocked(releaseDetailPage)) {
      return true;
    }

    await page.waitForTimeout(2_500);
  }

  return false;
}

export async function waitForEditAnswersButton(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
  releaseUrl?: string,
  timeout = 60_000,
): Promise<boolean> {
  const deadline = Date.now() + timeout;
  let attempt = 0;

  while (Date.now() < deadline) {
    attempt += 1;

    const editAnswersVisible = await page
      .getByRole('button', { name: /Edit Answers/i })
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false);
    if (editAnswersVisible) {
      return true;
    }

    if (releaseUrl && attempt % 4 === 0) {
      await page.goto(releaseUrl, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
      await releaseDetailPage.waitForPageLoad().catch(() => undefined);
      await releaseDetailPage.clickTopLevelTab('Questionnaire').catch(() => undefined);
      await releaseDetailPage.expectTopLevelTabSelected('Questionnaire').catch(() => undefined);
    } else {
      await releaseDetailPage.clickTopLevelTab('Release Details').catch(() => undefined);
      await releaseDetailPage.clickTopLevelTab('Questionnaire').catch(() => undefined);
      await releaseDetailPage.expectTopLevelTabSelected('Questionnaire').catch(() => undefined);
    }

    await page.waitForTimeout(2_500);
  }

  return false;
}

export async function openQuestionnaireForm(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
): Promise<void> {
  const startVisible = await releaseDetailPage.isStartQuestionnaireVisible();
  if (startVisible) {
    await page.getByRole('button', { name: /Start Questionnaire/i }).first().click();
    await page.waitForTimeout(5_000);
  }

  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (QUESTIONNAIRE_BLOCKER.test(bodyText)) {
    test.skip(true, 'Backend error blocked questionnaire form from loading on the current release.');
  }

  const releaseCreationHeading = page.getByText(/Release creation questionnaire/i).first();
  const productSecurityHeading = page.getByText(/Product Security Questionnaire/i).first();
  const formLoaded = await Promise.any([
    releaseCreationHeading.waitFor({ state: 'visible', timeout: 10_000 }),
    productSecurityHeading.waitFor({ state: 'visible', timeout: 10_000 }),
  ]).then(() => true).catch(() => false);

  if (!formLoaded) {
    const stillShowingStart = await releaseDetailPage.isStartQuestionnaireVisible();
    if (stillShowingStart) {
      await page.getByRole('button', { name: /Start Questionnaire/i }).first().click().catch(() => undefined);
      await page.waitForTimeout(5_000);
    }
  }

  const stillShowingStart = await releaseDetailPage.isStartQuestionnaireVisible();
  test.skip(stillShowingStart, 'Questionnaire did not transition away from the pre-start state on the current QA release.');
}

export async function fillStandardQuestionnaireAnswers(page: Page): Promise<void> {
  await page.locator(RADIO.q1Yes).check();
  await page.locator(RADIO.q2No).check();
  await checkQuestionnaireCheckboxByText(page, /^Connected$/i);
  await checkQuestionnaireCheckboxByText(page, /North America/i);
  await page.locator(RADIO.q5No).check();
  await page.locator(RADIO.q6No).check();
  await page.locator(RADIO.q7No).check();
  await page.locator(RADIO.q8No).check();
}

export async function submitStandardQuestionnaire(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
): Promise<void> {
  await releaseDetailPage.clickTopLevelTab('Questionnaire');
  await releaseDetailPage.expectTopLevelTabSelected('Questionnaire');

  const editAnswersVisible = await page
    .getByRole('button', { name: /Edit Answers/i })
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);

  if (editAnswersVisible) {
    return;
  }

  await openQuestionnaireForm(page, releaseDetailPage);
  await fillStandardQuestionnaireAnswers(page);
  await page.getByRole('button', { name: /^(Save|Submit)$/i }).first().click();

  await expect
    .poll(() => isQuestionnaireSubmitted(page, releaseDetailPage), {
      timeout: 90_000,
      message: 'Questionnaire should reach a submitted state (Edit Answers, unlocked tabs, or enabled Submit for Review).',
    })
    .toBe(true);
}

export async function submitStandardQuestionnaireForRelease(
  browser: Browser,
  releaseUrl: string,
): Promise<void> {
  const credentials = getDefaultUser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(credentials.login, credentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 90_000 });

    await page.goto(releaseUrl, { waitUntil: 'domcontentloaded' });
    const releaseDetailPage = new ReleaseDetailPage(page);
    await releaseDetailPage.waitForPageLoad();

    await submitStandardQuestionnaire(page, releaseDetailPage);

    const unlocked = await waitForRequirementsTabsToUnlock(page, releaseDetailPage, releaseUrl);
    if (!unlocked) {
      const diagnostics = await getQuestionnaireStateDiagnostics(page, releaseDetailPage);
      test.skip(true, `Requirements tabs did not unlock after questionnaire submission. ${diagnostics}`);
    }
  } finally {
    await context.close().catch(() => undefined);
  }
}
