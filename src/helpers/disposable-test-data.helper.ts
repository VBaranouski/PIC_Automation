import type { Page } from '@playwright/test';
import type { NewProductPage, ReleaseDetailPage } from '../pages';

export interface DisposableProduct {
  name: string;
  url: string;
}

export interface DisposableRelease {
  product: DisposableProduct;
  version: string;
  url: string;
}

function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

export async function createDisposableProduct(
  page: Page,
  newProductPage: NewProductPage,
  options?: { dataProtection?: boolean; prefix?: string },
): Promise<DisposableProduct> {
  const suffix = uniqueSuffix();
  const name = `${options?.prefix ?? 'PW Disposable Product'} ${suffix}`;
  const description = 'Automation-created disposable product. Safe to mutate during destructive E2E coverage.';

  await newProductPage.goto();
  await newProductPage.expectNewProductFormLoaded();

  await newProductPage.fillProductInformation({
    name,
    state: 'Under development (not yet released)',
    definition: 'System',
    type: 'Embedded Device',
    description,
  });

  if (options?.dataProtection) {
    await newProductPage.toggleDataProtection();
  }

  await newProductPage.fillProductOrganization({
    level1: 'Energy Management',
    level2: 'Home & Distribution',
    level3: 'Connected Offers',
  });

  await newProductPage.fillProductTeam({
    searchQuery: 'Ulad',
    fullName: 'Uladzislau Baranouski',
  });

  await newProductPage.fillProductInformation({
    name,
    state: 'Under development (not yet released)',
    definition: 'System',
    type: 'Embedded Device',
    description,
  });

  await newProductPage.clickSaveWithOrgLevelRecovery();
  await newProductPage.expectProductSaved();

  return { name, url: page.url() };
}

export async function createDisposableRelease(
  page: Page,
  newProductPage: NewProductPage,
  releaseDetailPage: ReleaseDetailPage,
  product: DisposableProduct,
  options?: { prefix?: string },
): Promise<DisposableRelease> {
  const version = `${options?.prefix ?? 'PW-DISP'}-${uniqueSuffix()}`;
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 14);

  await page.goto(product.url, { waitUntil: 'domcontentloaded' });
  await newProductPage.expectProductDetailLoaded();
  await newProductPage.clickReleasesTab();
  await newProductPage.clickCreateRelease();
  await newProductPage.createFirstRelease({
    releaseVersion: version,
    targetDate,
    changeSummary: `Disposable release for automated destructive coverage: ${version}`,
  });

  if (!/ReleaseDetail/i.test(page.url())) {
    await page.goto(product.url, { waitUntil: 'domcontentloaded' });
    await newProductPage.expectProductDetailLoaded();
    await newProductPage.clickReleasesTab();
    await newProductPage.clickReleaseLinkByVersion(version);
  }

  await releaseDetailPage.waitForPageLoad();
  return { product, version, url: page.url() };
}