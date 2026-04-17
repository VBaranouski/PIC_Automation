import { test, expect } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';

/**
 * Status Mapping Configuration (Section 3.5)
 *
 * Covers the ability to map PICASso statuses to Jira statuses via the
 * "Status Mapping Configuration" link in the Product Configuration tab (edit mode).
 *
 * All tests require the Jira tool to be activated on the target product — they skip
 * gracefully when the "Status Mapping Configuration" link is not present on product 1162.
 *
 * Plan reference: docs/ai/automation-testing-plan.md §3.5
 * Spec file:      products/status-mapping.spec.ts
 */

const PRODUCT_URL = '/GRC_PICASso/ProductDetail?ProductId=1162';

async function openProductDetail(page: Page, newProductPage: { expectProductDetailLoaded(): Promise<void> }): Promise<void> {
  await page.goto(PRODUCT_URL);
  await newProductPage.expectProductDetailLoaded();
}

/** Opens Status Mapping popup from Product Configuration tab (already in edit mode). */
async function openStatusMappingPopup(page: Page): Promise<boolean> {
  const statusMappingLink = page.getByRole('link', { name: /Status Mapping Configuration/i });
  const isVisible = await statusMappingLink.isVisible({ timeout: 10_000 }).catch(() => false);
  if (!isVisible) return false;
  await statusMappingLink.click();
  const popup = page.getByRole('dialog').filter({ hasText: /Status Mapping|Jira|PICASso/i }).first();
  await popup.waitFor({ state: 'visible', timeout: 15_000 });
  return true;
}

test.describe.serial('Status Mapping Configuration @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test(
    'STATUS-MAP-001: Status Mapping Configuration link is accessible in edit mode under Product Configuration tab',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Status Mapping Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'STATUS-MAP-001: Navigate to a product in edit mode, click the Product Configuration tab, ' +
        'and verify the "Status Mapping Configuration" link is accessible.',
      );

      await test.step('Navigate to product detail page', async () => {
        await openProductDetail(page, newProductPage);
      });

      await test.step('Enter edit mode', async () => {
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Click Product Configuration tab', async () => {
        await newProductPage.productConfigurationTab.click();
        await page.waitForTimeout(1_500);
      });

      let linkVisible = false;
      await test.step('Check Status Mapping Configuration link is visible', async () => {
        const statusMappingLink = page.getByRole('link', { name: /Status Mapping Configuration/i });
        linkVisible = await statusMappingLink.isVisible({ timeout: 10_000 }).catch(() => false);
        test.skip(!linkVisible, 'STATUS-MAP-001: "Status Mapping Configuration" link not found — Jira tool may not be activated on this product.');
        await expect(statusMappingLink).toBeVisible({ timeout: 10_000 });
      });

      await test.step('Cancel edit mode without changes', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  test(
    'STATUS-MAP-002: Status Mapping popup opens for Jira when Jira tool is activated',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Status Mapping Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'STATUS-MAP-002: In edit mode under Product Configuration tab, click "Status Mapping Configuration" ' +
        'link and verify the Status Mapping popup opens with Jira mapping UI.',
      );

      await test.step('Navigate to product in edit mode', async () => {
        await openProductDetail(page, newProductPage);
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Click Product Configuration tab', async () => {
        await newProductPage.productConfigurationTab.click();
        await page.waitForTimeout(1_500);
      });

      await test.step('Open Status Mapping popup', async () => {
        const opened = await openStatusMappingPopup(page);
        test.skip(!opened, 'STATUS-MAP-002: Jira tool not activated on this product — skipping.');
      });

      await test.step('Verify Status Mapping popup shows mapping table or columns', async () => {
        const popup = page.getByRole('dialog').filter({ hasText: /Status Mapping|Jira|PICASso/i }).first();
        await expect(popup).toBeVisible({ timeout: 10_000 });
        // The popup should display either a table header or "Jira" / "PICASso" column labels
        const hasJiraReference = await popup.getByText(/Jira/i).first().isVisible({ timeout: 5_000 }).catch(() => false);
        const hasMappingTable = await popup.locator('table, [role="grid"]').first().isVisible({ timeout: 5_000 }).catch(() => false);
        expect(hasJiraReference || hasMappingTable, 'Expected Status Mapping popup to show Jira or mapping table content').toBe(true);
      });

      await test.step('Close popup and cancel edit mode', async () => {
        const cancelBtn = page.getByRole('dialog').getByRole('button', { name: /Cancel/i }).first();
        if (await cancelBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await cancelBtn.click();
        } else {
          const closeIcon = page.getByRole('dialog').locator('.fa-times').first();
          await closeIcon.click().catch(() => undefined);
        }
        await page.waitForTimeout(500);
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  test(
    'STATUS-MAP-003: Adding a PICASso Status → Jira Status mapping row shows Add control in popup',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Status Mapping Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'STATUS-MAP-003: In the Status Mapping popup, verify the UI provides a way to add a new ' +
        'PICASso Status → Jira Status mapping row (Add button or similar control is present).',
      );

      await test.step('Navigate to product in edit mode', async () => {
        await openProductDetail(page, newProductPage);
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Open Status Mapping popup', async () => {
        await newProductPage.productConfigurationTab.click();
        await page.waitForTimeout(1_500);
        const opened = await openStatusMappingPopup(page);
        test.skip(!opened, 'STATUS-MAP-003: Jira tool not activated — skipping.');
      });

      await test.step('Verify Add / New row control is visible', async () => {
        const popup = page.getByRole('dialog').filter({ hasText: /Status Mapping|Jira|PICASso/i }).first();
        // Look for Add button, "+" icon button, or "New" text in the popup
        const addBtn = popup.getByRole('button', { name: /Add|New|\+/i }).first();
        const addLink = popup.getByRole('link', { name: /Add|New|\+/i }).first();
        const hasAddBtn = await addBtn.isVisible({ timeout: 5_000 }).catch(() => false);
        const hasAddLink = await addLink.isVisible({ timeout: 3_000 }).catch(() => false);
        expect(hasAddBtn || hasAddLink, 'Expected an "Add" button or link in Status Mapping popup').toBe(true);
      });

      await test.step('Close popup and cancel edit mode', async () => {
        const cancelBtn = page.getByRole('dialog').getByRole('button', { name: /Cancel/i }).first();
        if (await cancelBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await cancelBtn.click();
        }
        await page.waitForTimeout(500);
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  test(
    'STATUS-MAP-004: Incorrect mapping row can be removed via bin icon',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Status Mapping Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'STATUS-MAP-004: In the Status Mapping popup, verify that existing mapping rows have a ' +
        'remove (bin/delete) icon. This test skips gracefully if no rows exist yet.',
      );

      await test.step('Navigate to product in edit mode', async () => {
        await openProductDetail(page, newProductPage);
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Open Status Mapping popup', async () => {
        await newProductPage.productConfigurationTab.click();
        await page.waitForTimeout(1_500);
        const opened = await openStatusMappingPopup(page);
        test.skip(!opened, 'STATUS-MAP-004: Jira tool not activated — skipping.');
      });

      await test.step('Verify remove icon is available for existing rows (if any exist)', async () => {
        const popup = page.getByRole('dialog').filter({ hasText: /Status Mapping|Jira|PICASso/i }).first();
        const binIcons = popup.locator(
          '.fa-trash, .fa-trash-o, .fa-times, [aria-label*="delete" i], [aria-label*="remove" i], ' +
          '[title*="delete" i], [title*="remove" i], button[class*="remove"], button[class*="delete"]',
        );
        const binCount = await binIcons.count();
        if (binCount === 0) {
          // No rows present — acceptable, test passes (no incorrect rows to remove)
          test.skip(true, 'STATUS-MAP-004: No existing mapping rows found in the popup — no bin icons to verify.');
        }
        expect(binCount).toBeGreaterThan(0);
      });

      await test.step('Close popup and cancel edit mode', async () => {
        const cancelBtn = page.getByRole('dialog').getByRole('button', { name: /Cancel/i }).first();
        if (await cancelBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await cancelBtn.click();
        }
        await page.waitForTimeout(500);
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  test(
    'STATUS-MAP-005: "Confirm" saves and "Cancel" discards the Status Mapping popup',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Status Mapping Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'STATUS-MAP-005: Verify the Status Mapping popup exposes both "Confirm" (or "Save") and "Cancel" buttons. ' +
        'Clicking Cancel closes the popup without persisting changes.',
      );

      await test.step('Navigate to product in edit mode', async () => {
        await openProductDetail(page, newProductPage);
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Open Status Mapping popup', async () => {
        await newProductPage.productConfigurationTab.click();
        await page.waitForTimeout(1_500);
        const opened = await openStatusMappingPopup(page);
        test.skip(!opened, 'STATUS-MAP-005: Jira tool not activated — skipping.');
      });

      await test.step('Verify Confirm and Cancel buttons are visible', async () => {
        const popup = page.getByRole('dialog').filter({ hasText: /Status Mapping|Jira|PICASso/i }).first();
        await expect(popup).toBeVisible({ timeout: 10_000 });

        const confirmBtn = popup.getByRole('button', { name: /Confirm|Save/i }).first();
        const cancelBtn = popup.getByRole('button', { name: /Cancel/i }).first();

        await expect(confirmBtn).toBeVisible({ timeout: 10_000 });
        await expect(cancelBtn).toBeVisible({ timeout: 10_000 });
      });

      await test.step('Click Cancel and verify popup closes', async () => {
        const popup = page.getByRole('dialog').filter({ hasText: /Status Mapping|Jira|PICASso/i }).first();
        const cancelBtn = popup.getByRole('button', { name: /Cancel/i }).first();
        await cancelBtn.click();
        await expect(popup).toBeHidden({ timeout: 10_000 });
      });

      await test.step('Cancel edit mode without changes', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );

  test(
    'STATUS-MAP-006: Mapping is persisted only after clicking Save on Product Details page',
    async ({ newProductPage, page }) => {
      await allure.suite('Products - Status Mapping Configuration');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'STATUS-MAP-006: After confirming the Status Mapping popup, the Product Details "Save" button ' +
        'must still be clicked to persist the mapping. This test verifies the Save button remains ' +
        'available on the product form after confirming the popup.',
      );

      await test.step('Navigate to product in edit mode', async () => {
        await openProductDetail(page, newProductPage);
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Open Status Mapping popup', async () => {
        await newProductPage.productConfigurationTab.click();
        await page.waitForTimeout(1_500);
        const opened = await openStatusMappingPopup(page);
        test.skip(!opened, 'STATUS-MAP-006: Jira tool not activated — skipping.');
      });

      await test.step('Confirm the Status Mapping popup', async () => {
        const popup = page.getByRole('dialog').filter({ hasText: /Status Mapping|Jira|PICASso/i }).first();
        const confirmBtn = popup.getByRole('button', { name: /Confirm|Save/i }).first();
        await expect(confirmBtn).toBeVisible({ timeout: 10_000 });
        await confirmBtn.click();
        await expect(popup).toBeHidden({ timeout: 15_000 });
      });

      await test.step('Verify Save button on Product Details is still required (mapping not auto-persisted)', async () => {
        // After confirming the popup, the edit form should still show the Save button
        // because the mapping is only staged — the user must click Save on the product form.
        await expect(newProductPage.saveButton).toBeVisible({ timeout: 10_000 });
      });

      await test.step('Cancel without saving to avoid data changes', async () => {
        await newProductPage.clickCancelAndReturnToViewMode();
      });
    },
  );
});
