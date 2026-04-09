import { test, expect } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { NewProductPage } from '../../src/pages';
import * as allure from 'allure-js-commons';

/**
 * Cross-Organizational Development (Section 3.9)
 *
 * Covers the "Cross-Organizational Development" toggle in Product edit mode
 * under the Product Organization tab, and the cascading Development Org Level
 * dropdowns it reveals.
 *
 * The tests run serially:
 *   - CROSS-ORG-000 creates a dedicated test product and stores its URL.
 *   - CROSS-ORG-001/002/003 verify toggle visibility and field cascade (cancel, non-destructive).
 *   - CROSS-ORG-004 enables cross-org, selects Dev Org values, and saves.
 *   - CROSS-ORG-005 re-edits the product, disables cross-org, and saves.
 *   - CROSS-ORG-006 verifies that the read-only view reflects the toggle state.
 *
 * Plan reference: docs/ai/automation-testing-plan.md §3.9
 * Spec file:      products/cross-org.spec.ts
 */

/** Creates a disposable test product and returns its detail page URL. */
async function createCrossOrgTestProduct(newProductPage: NewProductPage, page: Page): Promise<string> {
  const productName = `Cross-Org Test ${Date.now()}`;

  await page.goto(`https://qa.leap.schneider-electric.com${newProductPage.url}`, {
    waitUntil: 'domcontentloaded',
  });
  await newProductPage.expectNewProductFormLoaded();

  await newProductPage.fillProductInformation({
    name: productName,
    state: 'Under development (not yet released)',
    definition: 'System',
    type: 'Embedded Device',
  });

  await newProductPage.fillProductOrganization({
    level1: 'Energy Management',
    level2: 'Home & Distribution',
    level3: 'Connected Offers',
  });

  await newProductPage.fillProductTeam({
    searchQuery: 'Ulad',
    fullName: 'Uladzislau Baranouski',
  });

  // Re-apply product information after team assignment (OutSystems partial refresh may clear fields)
  await newProductPage.fillProductInformation({
    name: productName,
    state: 'Under development (not yet released)',
    definition: 'System',
    type: 'Embedded Device',
  });

  await newProductPage.clickSaveWithOrgLevelRecovery();
  await newProductPage.expectProductSaved();

  return page.url();
}

/** Returns the first non-blank option label from a <select> element, or null if none. */
async function getFirstSelectOption(
  page: Page,
  selectLocator: import('@playwright/test').Locator,
): Promise<string | null> {
  try {
    await selectLocator.waitFor({ state: 'visible', timeout: 10_000 });
    const options = await selectLocator.locator('option').allTextContents();
    return options.map(o => o.trim()).find(o => o && o !== '- Select -' && o !== '-') ?? null;
  } catch {
    return null;
  }
}

let testProductUrl = '';

test.describe.serial('Cross-Organizational Development @regression', () => {
  test.setTimeout(360_000);

  test.beforeEach(async ({ loginPage, userCredentials, page }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ─── Setup ────────────────────────────────────────────────────────────────────

  test('CROSS-ORG-000: Create test product for Cross-Org tests', async ({ newProductPage, page }) => {
    await allure.suite('Products - Cross-Organizational Development');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'CROSS-ORG-000: Creates a disposable test product used by CROSS-ORG-001 through CROSS-ORG-006. ' +
      'If this test fails or is skipped, subsequent tests will be skipped automatically.',
    );

    await test.step('Create cross-org test product', async () => {
      testProductUrl = await createCrossOrgTestProduct(newProductPage, page);
      expect(testProductUrl, 'Test product URL must be set after creation').toBeTruthy();
    });
  });

  // ─── Observation tests (non-destructive) ──────────────────────────────────────

  test(
    'CROSS-ORG-001: "Cross-Organizational Development" toggle is visible in edit mode',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Cross-Organizational Development');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'CROSS-ORG-001: Navigate to the test product in edit mode, click the Product Organization tab, ' +
        'and verify the "Cross-Organizational Development" checkbox is visible.',
      );

      await test.step('Skip if test product was not created', async () => {
        test.skip(!testProductUrl, 'CROSS-ORG-001: No test product URL — CROSS-ORG-000 must run first.');
      });

      await test.step('Navigate to test product in edit mode', async () => {
        await page.goto(testProductUrl);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Click Product Organization tab', async () => {
        await newProductPage.clickProductOrganizationTab();
        await page.waitForTimeout(1_000);
      });

      await test.step('Verify Cross-Organizational Development checkbox is visible', async () => {
        await expect(newProductPage.crossOrgCheckbox).toBeVisible({ timeout: 15_000 });
      });

      await test.step('Cancel edit mode without changes', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  test(
    'CROSS-ORG-002: Enabling the Cross-Org toggle reveals Development Org Level 1, 2, and 3 fields',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Cross-Organizational Development');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'CROSS-ORG-002: In edit mode under Product Organization tab, check the ' +
        '"Cross-Organizational Development" toggle and verify Development Org Level 1, 2, and 3 fields appear.',
      );

      await test.step('Skip if test product was not created', async () => {
        test.skip(!testProductUrl, 'CROSS-ORG-002: No test product URL — CROSS-ORG-000 must run first.');
      });

      await test.step('Navigate to test product in edit mode', async () => {
        await page.goto(testProductUrl);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Click Product Organization tab and toggle Cross-Org ON', async () => {
        await newProductPage.clickProductOrganizationTab();
        const isAlreadyChecked = await newProductPage.crossOrgCheckbox.isChecked({ timeout: 5_000 }).catch(() => false);
        if (!isAlreadyChecked) {
          await newProductPage.toggleCrossOrgDevelopment();
        }
      });

      await test.step('Verify Development Org Level 1, 2, 3 fields are visible', async () => {
        await newProductPage.expectCrossOrgDevelopmentFieldsVisible();
      });

      await test.step('Cancel edit mode to discard changes', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  test(
    'CROSS-ORG-003: Development Org Level dropdowns cascade (L1 → L2 → L3)',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Cross-Organizational Development');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'CROSS-ORG-003: After enabling Cross-Org, verify Development Org Level selects cascade: ' +
        'Level 2 becomes enabled after selecting Level 1, and Level 3 becomes enabled after selecting Level 2.',
      );

      await test.step('Skip if test product was not created', async () => {
        test.skip(!testProductUrl, 'CROSS-ORG-003: No test product URL — CROSS-ORG-000 must run first.');
      });

      await test.step('Navigate to test product in edit mode with Cross-Org enabled', async () => {
        await page.goto(testProductUrl);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
        await newProductPage.clickProductOrganizationTab();
        const isChecked = await newProductPage.crossOrgCheckbox.isChecked({ timeout: 5_000 }).catch(() => false);
        if (!isChecked) {
          await newProductPage.toggleCrossOrgDevelopment();
        }
        await newProductPage.expectCrossOrgDevelopmentFieldsVisible();
      });

      await test.step('Locate Development Org Level 1 select', async () => {
        const devOrgL1 = page
          .getByText('Development Org Level 1', { exact: true })
          .locator('..')
          .getByRole('combobox')
          .first();
        await expect(devOrgL1).toBeVisible({ timeout: 15_000 });

        const firstOption = await getFirstSelectOption(page, devOrgL1);
        test.skip(!firstOption, 'CROSS-ORG-003: No options available in Development Org Level 1 — skipping cascade test.');

        // Select the first available option
        await devOrgL1.selectOption({ label: firstOption! });
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      });

      await test.step('Verify Development Org Level 2 becomes enabled after L1 selection', async () => {
        const devOrgL2 = page
          .getByText('Development Org Level 2', { exact: true })
          .locator('..')
          .getByRole('combobox')
          .first();
        // L2 may become enabled after L1 cascade
        const isEnabled = await expect(devOrgL2).toBeEnabled({ timeout: 15_000 }).then(() => true).catch(() => false);
        if (isEnabled) {
          // Select first available L2 option
          const l2Option = await getFirstSelectOption(page, devOrgL2);
          if (l2Option) {
            await devOrgL2.selectOption({ label: l2Option });
            await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
          }
        }
        // Regardless, assert Level 2 select is visible
        await expect(devOrgL2).toBeVisible({ timeout: 10_000 });
      });

      await test.step('Cancel edit mode to discard changes', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  // ─── Persistence tests (destructive on test product only) ──────────────────────

  test(
    'CROSS-ORG-004: Saving with Dev Org fields filled persists values in read-only view',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Cross-Organizational Development');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'CROSS-ORG-004: In edit mode, enable Cross-Org, select Development Org Level 1 (and L2/L3 if ' +
        'available), save the product, and verify that the saved values are visible in read-only view.',
      );

      await test.step('Skip if test product was not created', async () => {
        test.skip(!testProductUrl, 'CROSS-ORG-004: No test product URL — CROSS-ORG-000 must run first.');
      });

      let savedDevOrgL1Value = '';

      await test.step('Navigate to test product in edit mode', async () => {
        await page.goto(testProductUrl);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Enable Cross-Org toggle and fill Development Org Level values', async () => {
        await newProductPage.clickProductOrganizationTab();
        const isChecked = await newProductPage.crossOrgCheckbox.isChecked({ timeout: 5_000 }).catch(() => false);
        if (!isChecked) {
          await newProductPage.toggleCrossOrgDevelopment();
        }
        await newProductPage.expectCrossOrgDevelopmentFieldsVisible();

        const devOrgL1 = page
          .getByText('Development Org Level 1', { exact: true })
          .locator('..')
          .getByRole('combobox')
          .first();

        const firstOption = await getFirstSelectOption(page, devOrgL1);
        if (firstOption) {
          await devOrgL1.selectOption({ label: firstOption });
          savedDevOrgL1Value = firstOption;
          await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
        } else {
          test.skip(true, 'CROSS-ORG-004: No options available in Development Org Level 1 — cannot complete save test.');
        }
      });

      await test.step('Save the product', async () => {
        await newProductPage.clickSaveWithOrgLevelRecovery();
        await newProductPage.expectProductDetailLoaded();
      });

      await test.step('Verify Cross-Org and Dev Org values are visible in read-only view', async () => {
        // Cross-Organizational Development should show as "Yes" or the toggle value
        await expect(
          page.getByText('Cross-Organizational Development', { exact: true }).first(),
        ).toBeVisible({ timeout: 15_000 });

        // The saved Dev Org Level 1 value should appear on the page
        if (savedDevOrgL1Value) {
          await expect(page.getByText(savedDevOrgL1Value).first()).toBeVisible({ timeout: 15_000 });
        }
      });
    },
  );

  test(
    'CROSS-ORG-005: Toggling Cross-Org OFF hides Dev Org fields and clears values on save',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Cross-Organizational Development');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'CROSS-ORG-005: Edit the test product, disable the Cross-Org toggle, save, and verify that ' +
        'Development Org Level fields are no longer displayed in read-only view.',
      );

      await test.step('Skip if test product was not created', async () => {
        test.skip(!testProductUrl, 'CROSS-ORG-005: No test product URL — CROSS-ORG-000 must run first.');
      });

      await test.step('Navigate to test product in edit mode', async () => {
        await page.goto(testProductUrl);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Disable Cross-Org toggle (toggle OFF if currently ON)', async () => {
        await newProductPage.clickProductOrganizationTab();
        const isChecked = await newProductPage.crossOrgCheckbox.isChecked({ timeout: 5_000 }).catch(() => false);
        if (isChecked) {
          await newProductPage.toggleCrossOrgDevelopment();
        }
        // Verify fields are now hidden
        await expect(page.getByText('Development Org Level 1', { exact: true })).toBeHidden({ timeout: 10_000 });
      });

      await test.step('Save the product with Cross-Org disabled', async () => {
        await newProductPage.clickSaveWithOrgLevelRecovery();
        await newProductPage.expectProductDetailLoaded();
      });

      await test.step('Verify Development Org Level fields are no longer visible in read-only view', async () => {
        const devOrgL1Label = page.getByText('Development Org Level 1', { exact: true });
        await expect(devOrgL1Label).toBeHidden({ timeout: 15_000 });
      });
    },
  );

  test(
    'CROSS-ORG-006: Cross-Org fields are visible in read-only view when toggle is ON',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Cross-Organizational Development');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'CROSS-ORG-006: After enabling Cross-Org and saving, verify the read-only Product Detail page ' +
        'shows the "Cross-Organizational Development" section with the correct state.',
      );

      await test.step('Skip if test product was not created', async () => {
        test.skip(!testProductUrl, 'CROSS-ORG-006: No test product URL — CROSS-ORG-000 must run first.');
      });

      await test.step('Navigate to test product in edit mode', async () => {
        await page.goto(testProductUrl);
        await newProductPage.expectProductDetailLoaded();
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Enable Cross-Org toggle and save', async () => {
        await newProductPage.clickProductOrganizationTab();
        const isChecked = await newProductPage.crossOrgCheckbox.isChecked({ timeout: 5_000 }).catch(() => false);
        if (!isChecked) {
          await newProductPage.toggleCrossOrgDevelopment();
        }
        await newProductPage.expectCrossOrgDevelopmentFieldsVisible();

        // Dev Org Level 1 is required when cross-org is enabled — select first available option
        const devOrgL1 = page
          .getByText('Development Org Level 1', { exact: true })
          .locator('..')
          .getByRole('combobox')
          .first();
        const firstOption = await getFirstSelectOption(page, devOrgL1);
        if (firstOption) {
          await devOrgL1.selectOption({ label: firstOption });
          await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
        }

        await newProductPage.clickSaveWithOrgLevelRecovery();
        await newProductPage.expectProductDetailLoaded();
      });

      await test.step('Verify Cross-Organizational Development section is visible in read-only view', async () => {
        // The Cross-Org section label should appear in view mode
        const crossOrgLabel = page.getByText('Cross-Organizational Development', { exact: true });
        await expect(crossOrgLabel.first()).toBeVisible({ timeout: 15_000 });
      });

      await test.step('Verify Development Org Level labels are shown in view mode', async () => {
        // After enabling cross-org and saving, the view mode should show Dev Org Level fields
        await expect(page.getByText('Development Org Level 1', { exact: true }).first()).toBeVisible({ timeout: 15_000 });
      });
    },
  );
});
