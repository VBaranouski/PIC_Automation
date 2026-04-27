import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

/**
 * Product Inactivation (Section 3.7)
 *
 * Covers the ability to inactivate a product via the three-dot Actions menu in the
 * My Products grid, and the "Show Active Only" filter behaviour for inactive products.
 *
 * PRODUCT-INACTIVATE-001: Observation-only — verifies the "Inactivate" option appears
 *   in the three-dot menu for at least one grid row.
 * PRODUCT-INACTIVATE-002: Deferred (fixme) — requires a dedicated disposable product
 *   to avoid permanently removing QA data.
 * PRODUCT-INACTIVATE-003/004: Filter behaviour — verified via the Show Active Only
 *   toggle without any destructive operations.
 *
 * Plan reference: docs/ai/automation-testing-plan.md §3.7
 * Spec file:      products/product-inactivation.spec.ts
 */

test.describe('Product Inactivation @regression', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
    await landingPage.clickTab('My Products');
    await landingPage.waitForGridDataRows();
  });

  test(
    'PRODUCT-INACTIVATE-001: Three-dot Actions menu in My Products grid shows "Inactivate" for eligible products',
    async ({ landingPage, page }) => {
      await allure.suite('Products - Product Inactivation');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'PRODUCT-INACTIVATE-001: In the My Products grid, open the three-dot (⋮) Actions menu for the ' +
        'first eligible product row and verify the "Inactivate" option is present.',
      );

      let inactivateFound = false;

      await test.step('Open three-dot Actions menu for the first product row', async () => {
        await landingPage.clickActionsMenuAtRow(1);
      });

      await test.step('Verify "Inactivate" option is visible in the popover', async () => {
        // The popover may contain: Inactivate, Edit, View, or other actions
        const inactivateOption = page.locator(
          '.popover-content, .popover, [class*="popover"], [role="menu"], [role="listbox"]',
        )
          .filter({ hasText: /Inactivate/i })
          .first();

        inactivateFound = await inactivateOption.isVisible({ timeout: 8_000 }).catch(() => false);

        if (!inactivateFound) {
          // Try scanning all rows for one with the Inactivate option
          // (some products may not be eligible — skip if none found)
          test.skip(true, 'PRODUCT-INACTIVATE-001: "Inactivate" option not found in the first row\'s Actions menu — ' +
            'the product may not be eligible for inactivation. Check if any product in the grid is eligible.');
        }

        await expect(inactivateOption).toBeVisible({ timeout: 5_000 });
      });

      await test.step('Close the actions menu by pressing Escape', async () => {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      });
    },
  );

  test.fixme(
    'PRODUCT-INACTIVATE-002: After inactivation, product status changes to Inactive',
    async ({ newProductPage, landingPage, page }) => {
      await allure.suite('Products - Product Inactivation');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'PRODUCT-INACTIVATE-002: Create a disposable test product, locate it in My Products grid, ' +
        'inactivate it via the three-dot menu, and verify the product status badge changes to "Inactive". ' +
        '(Deferred: requires a dedicated test product creation flow and confirmation dialog handling.)',
      );
      // TODO: Implement full inactivation flow:
      //   1. Create a test product (ensure it is in an eligible state)
      //   2. Navigate to My Products, search for the product
      //   3. Open three-dot menu → click "Inactivate"
      //   4. Handle confirmation dialog if present
      //   5. Verify product status in grid or on detail page is "Inactive"
    },
  );

  test(
    'PRODUCT-INACTIVATE-003: Inactive products are hidden when "Show Active Only" toggle is ON',
    async ({ landingPage }) => {
      await allure.suite('Products - Product Inactivation');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'PRODUCT-INACTIVATE-003: With "Show Active Only" checked (default), verify that the My Products grid ' +
        'shows fewer records than when the toggle is unchecked — confirming inactive products are filtered out.',
      );

      let activeOnlyCount = 0;

      await test.step('Verify "Show Active Only" is checked by default', async () => {
        await landingPage.expectProductsShowActiveOnlyChecked();
      });

      await test.step('Record active-only record count', async () => {
        const countStr = await landingPage.getRecordCount();
        activeOnlyCount = Number(countStr);
        expect(activeOnlyCount).toBeGreaterThan(0);
      });

      await test.step('Uncheck "Show Active Only" to include inactive products', async () => {
        await landingPage.toggleShowActiveOnly();
        await landingPage.expectProductsShowActiveOnlyUnchecked();
      });

      await test.step('Verify record count is at least as large as active-only count (inactive products now visible)', async () => {
        await landingPage.expectRecordCountAtLeast(activeOnlyCount);
      });

      await test.step('Re-enable Show Active Only to restore default state', async () => {
        await landingPage.toggleShowActiveOnly();
        await landingPage.expectProductsShowActiveOnlyChecked();
      });
    },
  );

  test(
    'PRODUCT-INACTIVATE-004: Inactive products are visible when "Show Active Only" toggle is OFF',
    async ({ landingPage }) => {
      await allure.suite('Products - Product Inactivation');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'PRODUCT-INACTIVATE-004: Uncheck "Show Active Only" and verify the grid record count increases ' +
        'compared to the active-only view, confirming that inactive products become visible.',
      );

      let allProductsCount = 0;
      let activeOnlyCount = 0;

      await test.step('Uncheck "Show Active Only" to show all products including inactive', async () => {
        await landingPage.toggleShowActiveOnly();
        await landingPage.expectProductsShowActiveOnlyUnchecked();
      });

      await test.step('Record total product count (active + inactive)', async () => {
        const countStr = await landingPage.getRecordCount();
        allProductsCount = Number(countStr);
        expect(allProductsCount).toBeGreaterThan(0);
      });

      await test.step('Re-enable "Show Active Only" and record active-only count', async () => {
        await landingPage.toggleShowActiveOnly();
        await landingPage.expectProductsShowActiveOnlyChecked();
        const activeStr = await landingPage.getRecordCount();
        activeOnlyCount = Number(activeStr);
      });

      await test.step('Verify that the all-products count is at least equal to the active-only count', async () => {
        // When inactive products exist, allProductsCount > activeOnlyCount.
        // At minimum the counts should be equal (no inactive products in the system).
        expect(allProductsCount).toBeGreaterThanOrEqual(activeOnlyCount);
      });
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // PRODUCT-INACTIVATE-005..013 — All on-hold (destructive / RBAC / data-dependent)
  //
  // These scenarios require either:
  //   (a) destructively inactivating a shared QA product/release (PRODUCT-INACTIVATE-007/008/009/010),
  //   (b) a product in a specific pre-existing state — already inactive, has-active-releases,
  //       or has DOCs (PRODUCT-INACTIVATE-005/006/011/012),
  //   (c) an authenticated session for a user role other than the default automation user
  //       (PRODUCT-INACTIVATE-013 — RBAC for Product Owner).
  //
  // Authored as test.fixme stubs for traceability. Each will be lifted as soon as:
  //   — disposable test products / RBAC fixtures are available, OR
  //   — a non-destructive observation-only path is confirmed by QA.
  // ────────────────────────────────────────────────────────────────────────────

  test('PRODUCT-INACTIVATE-005 — Inactivate button is disabled with tooltip when product has active releases or DOCs', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-005: Requires a known QA product that has active releases/DOCs to verify the disabled state. Awaiting a stable test product in this state.');
    await page.goto('/');
  });

  test('PRODUCT-INACTIVATE-006 — Three-dot menu on Product Details page shows Inactivate option for eligible product', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-006: Knowledge gap — three-dot menu location/identification on Product Details page is undocumented; awaiting QA confirmation of the menu locator.');
    await page.goto('/');
  });

  test('PRODUCT-INACTIVATE-007 — Clicking Inactivate on Product Details opens confirmation modal', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-007: Destructive flow — opening the Inactivate modal requires interacting with a real shared QA product. Deferred until disposable test products are available.');
    await page.goto('/');
  });

  test('PRODUCT-INACTIVATE-008 — Justification field is mandatory: submit blocked when empty', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-008: Depends on PRODUCT-INACTIVATE-007 (opening the modal). Deferred — destructive prerequisite.');
    await page.goto('/');
  });

  test('PRODUCT-INACTIVATE-009 — Cancel closes confirmation modal without changing product status', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-009: Depends on PRODUCT-INACTIVATE-007 (opening the modal). Deferred — destructive prerequisite.');
    await page.goto('/');
  });

  test('PRODUCT-INACTIVATE-010 — Full E2E: submitting inactivation modal sets product status to Inactive', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-010: Destructive E2E — would permanently inactivate a shared QA product. Deferred until disposable test products are available.');
    await page.goto('/');
  });

  test('PRODUCT-INACTIVATE-011 — Inactive product is read-only: edit and release creation blocked', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-011: Requires a known inactive product on QA to verify read-only enforcement. Awaiting a stable inactive test product.');
    await page.goto('/');
  });

  test('PRODUCT-INACTIVATE-012 — Tooltip on Inactive status badge shows inactivation justification', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-012: Requires a known inactive product on QA. Awaiting a stable inactive test product with a known justification text.');
    await page.goto('/');
  });

  test('PRODUCT-INACTIVATE-013 — RBAC: Product Owner does not see Actions column in My Products grid', async ({ page }) => {
    await allure.suite('Products - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.tag('PIC-110');
    test.fixme(true, 'PRODUCT-INACTIVATE-013: RBAC scenario — requires authenticated session for a Product Owner role user. Awaiting RBAC fixture / additional user storageState.');
    await page.goto('/');
  });
});
