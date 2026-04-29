import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { test as setup } from '../../src/fixtures';
import {
  createDisposableProduct,
  createDisposableRelease,
} from '../../src/helpers/disposable-test-data.helper';
import { writeWF3ProductState } from '../../src/helpers/wf3-product-state.helper';

const JIRA_SOURCE_LINK = 'https://wf3-pre-req-jira.example.invalid';
const JIRA_PROJECT_KEY = 'WF3PREQ';
const JAMA_PROJECT_ID = 'WF3-PRE-REQ-JAMA';

setup.describe.serial('WF3 Product Management — Pre-Req Data Setup', () => {
  setup.setTimeout(360_000);

  setup('PRODUCT-PRE-REQ-001 — prepare reusable WF3 product and release data', async ({
    page,
    newProductPage,
    releaseDetailPage,
  }) => {
    await allure.suite('Products - WF3 Pre-Req');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'PRODUCT-PRE-REQ-001: Create a deterministic automation-owned product and release, ' +
      'verify Product Configuration tracking-tool fields are reachable, and persist URLs for downstream WF3 tests.',
    );

    const product = await setup.step('Create automation-owned WF3 product', async () => {
      const createdProduct = await createDisposableProduct(page, newProductPage, {
        dataProtection: true,
        prefix: 'WF3 Pre-Req Product',
      });

      expect(createdProduct.name).toMatch(/^WF3 Pre-Req Product/);
      expect(createdProduct.url).toContain('/GRC_PICASso/ProductDetail');
      return createdProduct;
    });

    const release = await setup.step('Create initial Scoping release for the WF3 product', async () => {
      const createdRelease = await createDisposableRelease(page, newProductPage, releaseDetailPage, product, {
        prefix: 'WF3-PRE-REQ',
      });

      expect(createdRelease.version).toMatch(/^WF3-PRE-REQ-/);
      expect(createdRelease.url).toContain('ReleaseDetail');
      return createdRelease;
    });

    const releaseCreationProduct = await setup.step('Create no-release WF3 product for release creation coverage', async () => {
      const createdProduct = await createDisposableProduct(page, newProductPage, {
        prefix: 'WF3 Release Creation Product',
      });

      expect(createdProduct.name).toMatch(/^WF3 Release Creation Product/);
      expect(createdProduct.url).toContain('/GRC_PICASso/ProductDetail');

      await page.goto(createdProduct.url, { waitUntil: 'domcontentloaded' });
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickReleasesTab();
      await newProductPage.expectNoReleasesStateVisible();

      return createdProduct;
    });

    await setup.step('Verify Jira configuration fields can be revealed and populated', async () => {
      await page.goto(product.url, { waitUntil: 'domcontentloaded' });
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.clickProductConfigurationTab();

      await newProductPage.enableJiraToggle();
      await newProductPage.expectJiraFieldsVisible();
      await newProductPage.jiraSourceLinkInput.fill(JIRA_SOURCE_LINK);
      await newProductPage.jiraProjectKeyInput.fill(JIRA_PROJECT_KEY);

      await expect(newProductPage.jiraSourceLinkInput).toHaveValue(JIRA_SOURCE_LINK);
      await expect(newProductPage.jiraProjectKeyInput).toHaveValue(JIRA_PROJECT_KEY);
      await expect(newProductPage.testConnectionButton).toBeVisible({ timeout: 10_000 });

      await newProductPage.clickCancelAndConfirmLeave();
      await newProductPage.expectProductDetailLoaded();
    });

    await setup.step('Verify Jama configuration fields can be revealed and populated', async () => {
      await page.goto(product.url, { waitUntil: 'domcontentloaded' });
      await newProductPage.expectProductDetailLoaded();
      await newProductPage.clickEditProductAndWaitForForm();
      await newProductPage.clickProductConfigurationTab();

      await newProductPage.enableJamaToggle();
      await newProductPage.expectJamaFieldsVisible();
      await newProductPage.jamaProjectIdInput.fill(JAMA_PROJECT_ID);

      await expect(newProductPage.jamaProjectIdInput).toHaveValue(JAMA_PROJECT_ID);
      await newProductPage.clickCancelAndConfirmLeave();
      await newProductPage.expectProductDetailLoaded();
    });

    await setup.step('Persist WF3 product state for downstream specs', async () => {
      writeWF3ProductState({
        dataProtectionEnabled: true,
        productName: product.name,
        productUrl: product.url,
        releaseCreationProduct: {
          productName: releaseCreationProduct.name,
          productUrl: releaseCreationProduct.url,
        },
        releaseVersion: release.version,
        releaseUrl: release.url,
        trackingTools: {
          jiraFieldsVerified: true,
          jiraProjectKey: JIRA_PROJECT_KEY,
          jiraSourceLink: JIRA_SOURCE_LINK,
          jamaFieldsVerified: true,
          jamaProjectId: JAMA_PROJECT_ID,
        },
      });
    });
  });
});
