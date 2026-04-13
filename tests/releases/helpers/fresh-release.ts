import { type Browser, expect, type Page } from '@playwright/test';
import { getDefaultUser } from '../../../config/users';
import type { UserCredentials } from '../../../config/users';
import { LoginPage, NewProductPage, ReleaseDetailPage } from '../../../src/pages';

type ProductOrganization = {
  level1: string;
  level2: string;
  level3?: string;
};

type FreshReleaseOptions = {
  credentials?: UserCredentials;
  productNamePrefix?: string;
  releaseVersionPrefix?: string;
  changeSummary?: string;
  targetDate?: Date;
  teamSearchQuery?: string;
  teamFullName?: string;
  productState?: string;
  productDefinition?: string;
  productType?: string;
  organization?: ProductOrganization;
};

export type FreshReleaseContext = {
  productName: string;
  productUrl: string;
  releaseVersion: string;
  releaseUrl: string;
};

const DEFAULT_ORGANIZATION: ProductOrganization = {
  level1: 'Energy Management',
  level2: 'Home & Distribution',
  level3: 'Connected Offers',
};

async function loginToQa(page: Page, credentials: UserCredentials): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.waitForPageLoad();
  await loginPage.login(credentials.login, credentials.password);
  await page.waitForURL(/GRC_PICASso/, { timeout: 90_000 });
}

async function waitForReleaseDetailReady(page: Page): Promise<void> {
  await page.waitForURL(/ReleaseDetail/, { timeout: 120_000 });
  await page.waitForFunction(
    "() => !document.body?.innerText?.includes('JavaScript is required')",
    undefined,
    { timeout: 60_000 },
  ).catch(() => undefined);
  await expect(page.getByRole('tab', { name: /^Release Details\b/i }).first()).toBeVisible({ timeout: 20_000 });
}

async function openCreatedReleaseFromProduct(
  page: Page,
  newProductPage: NewProductPage,
  productUrl: string,
  releaseVersion: string,
): Promise<void> {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await page.goto(productUrl, { waitUntil: 'domcontentloaded' });
    await newProductPage.expectProductDetailLoaded();
    await newProductPage.clickReleasesTab();

    const releaseLink = page.getByRole('link', { name: releaseVersion }).first();
    const linkVisible = await releaseLink.isVisible({ timeout: 15_000 }).catch(() => false);

    if (linkVisible) {
      await releaseLink.click();
      return;
    }

    const emptyStateVisible = await newProductPage.isNoReleasesMessageVisible();
    if (!emptyStateVisible) {
      await newProductPage.expectReleaseListed(releaseVersion, 'Scoping');
      await releaseLink.click();
      return;
    }

    if (attempt < 3) {
      await page.waitForTimeout(3_000);
    }
  }

  throw new Error(
    `Fresh release "${releaseVersion}" was not visible in the product Releases tab after Create & Scope completed.`,
  );
}

export async function createFreshRelease(
  browser: Browser,
  options: FreshReleaseOptions = {},
): Promise<FreshReleaseContext> {
  const credentials = options.credentials ?? getDefaultUser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const suffix = Date.now();
    const targetDate = options.targetDate ?? (() => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    })();
    const productName = `${options.productNamePrefix ?? 'AutoTest Release'} ${suffix}`;
    const releaseVersion = `${options.releaseVersionPrefix ?? '1.0.0-q'}${suffix}`;
    const organization = options.organization ?? DEFAULT_ORGANIZATION;
    const productState = options.productState ?? 'Under development (not yet released)';
    const productDefinition = options.productDefinition ?? 'System';
    const productType = options.productType ?? 'Embedded Device';
    const teamSearchQuery = options.teamSearchQuery ?? 'Ulad';
    const teamFullName = options.teamFullName ?? 'Uladzislau Baranouski';
    const changeSummary = options.changeSummary ?? 'Automated fresh release setup';

    await loginToQa(page, credentials);

    const newProductPage = new NewProductPage(page);
    await newProductPage.goto();
    await newProductPage.expectNewProductFormLoaded();

    await newProductPage.fillProductInformation({
      name: productName,
      state: productState,
      definition: productDefinition,
      type: productType,
    });
    await newProductPage.fillProductOrganization(organization);
    await newProductPage.fillProductTeam({
      searchQuery: teamSearchQuery,
      fullName: teamFullName,
    });

    await newProductPage.productDetailsTab.click();
    await newProductPage.waitForOSLoad();

    await newProductPage.fillProductInformation({
      name: productName,
      state: productState,
      definition: productDefinition,
      type: productType,
    });

    await newProductPage.clickSaveWithOrgLevelRecovery();
    await newProductPage.expectProductSaved();
    const productUrl = page.url();

    await newProductPage.clickReleasesTab();
    await newProductPage.clickCreateRelease();
    await newProductPage.createFirstRelease({
      releaseVersion,
      targetDate,
      changeSummary,
    });

    if (!/ReleaseDetail/.test(page.url())) {
      await openCreatedReleaseFromProduct(page, newProductPage, productUrl, releaseVersion);
    }

    await waitForReleaseDetailReady(page);
    const releaseDetailPage = new ReleaseDetailPage(page);
    await releaseDetailPage.waitForPageLoad();

    return {
      productName,
      productUrl,
      releaseVersion,
      releaseUrl: page.url(),
    };
  } finally {
    await context.close().catch(() => undefined);
  }
}
