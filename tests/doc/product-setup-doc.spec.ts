/**
 * WF11.1 — Product Setup for DOC (extended coverage)
 *
 * Verifies Digital Offer Certification behaviour at the Product Detail level for a product
 * that already has an active (Controls Scoping) DOC.  All navigation tests derive the
 * ProductId from the persisted .doc-state.json written by the doc-state-setup project.
 *
 * Covered scenarios
 * ─────────────────
 * DOC-SETUP-004  "Show active only" toggle visible on Digital Offer Certification tab
 * DOC-SETUP-007  VESTA ID delete button absent from DOM in edit mode when active DOC exists
 * DOC-SETUP-008  "Digital Offer" checkbox disabled in edit mode when active DOC exists
 *
 * Skipped / on-hold scenarios (also tracked in config/scenarios.db)
 * ────────────────────────────────────────────────────────────────────
 * DOC-SETUP-001-b / 001-c / 001-d  Already covered by new-product-creation-digital-offer.spec.ts
 * DOC-SETUP-002 / 003              Require a separate user account with different privileges
 * DOC-SETUP-005                    P3 — column sorting, tracked for manual validation
 * DOC-SETUP-006                    Requires a product pre-configured with 2+ VESTA IDs
 * DOC-SETUP-009                    Requires a product in Inactive state
 * DOC-SETUP-010                    Requires a user with INACTIVATE_PRODUCT privilege (not PQL role)
 * DOC-SETUP-011 – 014              My Products column visibility; environment-state-dependent
 */
import { test } from '../../src/fixtures';
import * as allure from 'allure-js-commons';
import { readDocState } from '../../src/helpers/doc.helper';

/** Derives the Product Detail URL from the persisted DOC state JSON. */
function productUrlFromDocState(): string {
  const { docDetailsUrl } = readDocState();
  const url = new URL(docDetailsUrl);
  return `${url.origin}/GRC_PICASso/ProductDetail?ProductId=${url.searchParams.get('ProductId')}`;
}

test.describe('DOC — Product Setup for DOC (WF11.1 extended) @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ loginPage, userCredentials, page }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // DOC-SETUP-004 — "Show active only" toggle visible on DOC Certification tab
  // ───────────────────────────────────────────────────────────────────────────
  test('DOC-SETUP-004 — "Show active only" toggle is present on the Digital Offer Certification tab',
    async ({ page, newProductPage }) => {
      await allure.suite('DOC');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-SETUP-004: The Digital Offer Certification tab on the Product Detail page ' +
        'must display a "Show active only" toggle that can filter the DOC table.',
      );

      await test.step('Navigate to product that has an active DOC', async () => {
        await page.goto(productUrlFromDocState(), { waitUntil: 'domcontentloaded' });
        await newProductPage.expectProductDetailLoaded();
      });

      await test.step('Open the Digital Offer Certification tab', async () => {
        await newProductPage.clickDigitalOfferCertificationTab();
        await newProductPage.expectDigitalOfferCertificationTabActive();
      });

      await test.step('Verify the "Show active only" toggle is visible', async () => {
        await newProductPage.expectDOCShowActiveOnlyToggleVisible();
      });
    });

  // ───────────────────────────────────────────────────────────────────────────
  // DOC-SETUP-007 — VESTA ID delete button disabled when active DOC exists
  // ───────────────────────────────────────────────────────────────────────────
  test('DOC-SETUP-007 — VESTA ID delete button is disabled in edit mode when active DOC exists',
    async ({ page, newProductPage }) => {
      await allure.suite('DOC');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-SETUP-007: When a VESTA ID has an active DOC, the delete button for that ' +
        'VESTA ID row must be disabled (non-interactive) in product edit mode.',
      );

      await test.step('Navigate to product that has an active DOC', async () => {
        await page.goto(productUrlFromDocState(), { waitUntil: 'domcontentloaded' });
        await newProductPage.expectProductDetailLoaded();
      });

      await test.step('Enter product edit mode', async () => {
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Verify VESTA ID delete button is not present in the DOM', async () => {
        await newProductPage.expectVestaIdDeleteButtonNotPresent();
      });
    });

  // ───────────────────────────────────────────────────────────────────────────
  // DOC-SETUP-008 — "Digital Offer" checkbox disabled in edit mode when active DOC
  // ───────────────────────────────────────────────────────────────────────────
  test('DOC-SETUP-008 — "Digital Offer" checkbox is disabled in edit mode when active DOC exists',
    async ({ page, newProductPage }) => {
      await allure.suite('DOC');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-SETUP-008: The "Digital Offer" checkbox must be disabled (not interactable) in ' +
        'product edit mode when the product has one or more active DOCs, preventing the ' +
        'user from removing the Digital Offer flag while a certification is in progress.',
      );

      await test.step('Navigate to product that has an active DOC', async () => {
        await page.goto(productUrlFromDocState(), { waitUntil: 'domcontentloaded' });
        await newProductPage.expectProductDetailLoaded();
      });

      await test.step('Enter product edit mode', async () => {
        await newProductPage.clickEditProductAndWaitForForm();
      });

      await test.step('Verify Digital Offer checkbox is disabled', async () => {
        await newProductPage.expectDigitalOfferCheckboxDisabledInEditMode();
      });
    });

  // ───────────────────────────────────────────────────────────────────────────
  // DOC-SETUP-010 — Inactivate button disabled when product has active DOCs
  // ───────────────────────────────────────────────────────────────────────────
  test('DOC-SETUP-010 — Inactivate button is disabled when the product has active DOCs or releases',
    async () => {
      test.skip(true,
        'Requires a user with the INACTIVATE_PRODUCT privilege. ' +
        'The PQL role does not see this button. Use a product_owner credential set to automate.');
    });

  // ───────────────────────────────────────────────────────────────────────────
  // Skipped — require different role credentials
  // ───────────────────────────────────────────────────────────────────────────
  test('DOC-SETUP-002 — "Request DOC" button visible for CREATE_DIGITAL_OFFER_CERTIFICATION privilege user',
    async () => {
      test.skip(true, 'Requires a separate user account with CREATE_DIGITAL_OFFER_CERTIFICATION privilege');
    });

  test('DOC-SETUP-003 — User without INITIATE or CREATE privilege sees neither button',
    async () => {
      test.skip(true, 'Requires a separate user account without INITIATE or CREATE privilege');
    });

  // ───────────────────────────────────────────────────────────────────────────
  // Skipped — complex setup not available in current test environment
  // ───────────────────────────────────────────────────────────────────────────
  test('DOC-SETUP-006 — Multiple VESTA IDs produce separate DOC line per VESTA ID',
    async () => {
      test.skip(true, 'Requires a product pre-configured with 2+ VESTA IDs in the test environment');
    });

  test('DOC-SETUP-009 — Inactive product cannot have new DOCs created',
    async () => {
      test.skip(true, 'Requires a product in Inactive state to be present in the test environment');
    });
});
