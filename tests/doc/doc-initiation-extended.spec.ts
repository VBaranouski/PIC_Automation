/**
 * WF11.2 — DOC Initiation (extended coverage)
 *
 * Covers the scenarios from WF11.2 that go beyond the serial DOC-INIT-001 – 007 chain
 * already automated in initiate-doc.spec.ts.
 *
 * Covered scenarios
 * ─────────────────
 * DOC-INIT-008  DOC Detail header shows VESTA ID, DOC ID (DOC-NNN format), and
 *               populated Target Release Date
 * DOC-INIT-020  "Required field!" validation errors shown for empty mandatory fields
 *               when the Initiate DOC modal is submitted
 * DOC-INIT-021  Cancel button on the Initiate DOC popup closes the form without saving
 * DOC-INIT-023  Cancel DOC popup shows mandatory Comment field; popup can be dismissed
 *               without actually cancelling the DOC
 *
 * Skipped / on-hold scenarios (also tracked in config/scenarios.db)
 * ────────────────────────────────────────────────────────────────────
 * DOC-INIT-001-b / 001-c / 001-d  Covered by initiate-doc.spec.ts (DOC-INIT-001)
 * DOC-INIT-009 – 014              Auto-created DOC triggers via BackOffice / date logic
 *                                 (on-hold — cannot be triggered deterministically in automation)
 * DOC-INIT-015 – 017              Require a product with 2+ VESTA IDs, one of which has an active DOC
 * DOC-INIT-018 – 019              Require a user with CREATE_DIGITAL_OFFER_CERTIFICATION (not INITIATE)
 * DOC-INIT-022                    Requires CANCEL_DIGITAL_OFFER_CERTIFICATION_REQUEST privilege
 *                                 on a user account not used in the current credential set
 * DOC-INIT-024 – 025              Auto-created DOC fields populated by BackOffice (on-hold)
 */
import { test, expect } from '../../src/fixtures';
import type { LandingPage, NewProductPage } from '../../src/pages';
import * as allure from 'allure-js-commons';
import { readDocState } from '../../src/helpers/doc.helper';

// ─── Shared product-creation helper (DOC-INIT-020, 021) ─────────────────────
//
// Creates a minimal Digital Offer product and leaves the browser on the
// Product Detail page with the Digital Offer Certification tab open and the
// "Initiate DOC" button visible.
//
// Note: This replicates the helper in initiate-doc.spec.ts by design —
// extracting it to a shared helper would couple unrelated test suites.
async function createProductForModalTesting(
  landingPage: LandingPage,
  newProductPage: NewProductPage,
): Promise<void> {
  const productName = `Surge Protector - DOC Modal ${Date.now()}`;
  const vestaId    = `${Math.floor(Math.random() * 90_000) + 10_000}`;

  await landingPage.goto();
  await landingPage.expectPageLoaded({ timeout: 60_000 });
  await newProductPage.goto();
  await newProductPage.expectNewProductFormLoaded();

  await newProductPage.fillProductInformation({
    name:        productName,
    state:       'Under development (not yet released)',
    definition:  'System',
    type:        'Embedded Device',
    description: 'Automation product for DOC modal validation testing.',
  });

  await newProductPage.toggleDigitalOffer();
  await newProductPage.fillDigitalOfferDetails({
    vestaId,
    searchQuery:            'Ulad',
    itOwnerFullName:        'Uladzislau Baranouski',
    projectManagerFullName: 'Uladzislau Baranouski',
  });

  await newProductPage.fillProductOrganization({
    level1: 'Energy Management',
    level2: 'Home & Distribution',
    level3: 'Connected Offers',
  });

  await newProductPage.fillProductTeam({
    searchQuery: 'Ulad',
    fullName:    'Uladzislau Baranouski',
  });

  await newProductPage.fillProductOrganization({
    level1: 'Energy Management',
    level2: 'Home & Distribution',
    level3: 'Connected Offers',
  });

  await newProductPage.fillProductTeam({
    searchQuery: 'Ulad',
    fullName:    'Uladzislau Baranouski',
  });

  await newProductPage.fillProductInformation({
    name:        productName,
    state:       'Under development (not yet released)',
    definition:  'System',
    type:        'Embedded Device',
    description: 'Automation product for DOC modal validation testing.',
  });

  await newProductPage.clickSave();
  await newProductPage.expectProductSaved();
  await newProductPage.expectDigitalOfferCertificationTabVisible();
  await newProductPage.clickDigitalOfferCertificationTab();
  await newProductPage.waitForOSLoad();
}

// ─── DOC-INIT-008 ────────────────────────────────────────────────────────────
test.describe('DOC — Initiation extended: header & validation @regression', () => {
  test.setTimeout(360_000);

  test.beforeEach(async ({ loginPage, userCredentials, page }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // DOC-INIT-008 (smoke) — DOC header: VESTA ID, DOC ID format, Target Release Date
  // ─────────────────────────────────────────────────────────────────────────
  test('DOC-INIT-008 — DOC Detail header shows VESTA ID, DOC ID in DOC-NNN format, and Target Release Date @smoke',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC');
      await allure.severity('critical');
      await allure.tag('smoke');
      await allure.description(
        'DOC-INIT-008: The DOC Detail page header must display the VESTA ID entered during ' +
        'product creation, a DOC ID that follows the DOC-NNN format, and a populated ' +
        'Target Release Date value.',
      );

      await test.step('Navigate to a Controls Scoping DOC via persisted state', async () => {
        const { docDetailsUrl } = readDocState();
        await page.goto(docDetailsUrl, { waitUntil: 'domcontentloaded' });
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Verify DOC ID follows DOC-NNN format', async () => {
        await docDetailsPage.expectDocIdFormat();
      });

      await test.step('Verify VESTA ID is visible in the header', async () => {
        await expect(
          page.getByText(/VESTA ID/).locator('..').getByText(/\d+/).first(),
        ).toBeVisible({ timeout: 30_000 });
      });

      await test.step('Verify Target Release Date is populated', async () => {
        await docDetailsPage.expectTargetReleaseDatePopulated();
      });
    });

  // ─────────────────────────────────────────────────────────────────────────
  // DOC-INIT-023 — Cancel DOC popup has mandatory Comment field
  // ─────────────────────────────────────────────────────────────────────────
  test('DOC-INIT-023 — Cancel DOC popup shows mandatory Comment field and can be dismissed safely',
    async ({ page, docDetailsPage }) => {
      await allure.suite('DOC');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-INIT-023: Clicking "Cancel DOC" in the DOC Detail header opens a popup that ' +
        'contains a mandatory Comment field.  The popup can be dismissed (Cancel) without ' +
        'actually cancelling the DOC.',
      );

      await test.step('Navigate to a Controls Scoping DOC via persisted state', async () => {
        const { docDetailsUrl } = readDocState();
        await page.goto(docDetailsUrl, { waitUntil: 'domcontentloaded' });
        await docDetailsPage.waitForOSLoad();
      });

      await test.step('Open the Cancel DOC popup', async () => {
        await docDetailsPage.openCancelDocDialog();
        await docDetailsPage.expectCancelDocPopupVisible();
      });

      await test.step('Verify the Comment field is present inside the popup', async () => {
        await docDetailsPage.expectCancelDocCommentFieldVisible();
      });

      await test.step('Dismiss the popup without cancelling the DOC', async () => {
        await docDetailsPage.dismissCancelDocDialog();
      });
    });
});

// ─── DOC-INIT-020 & 021 (serial — create product once, test modal twice) ─────
test.describe.serial('DOC — Initiate DOC modal: validation and cancel @regression', () => {
  test.setTimeout(360_000);

  test.beforeEach(async ({ loginPage, userCredentials, page }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // DOC-INIT-020 — validation errors for empty mandatory fields
  // ─────────────────────────────────────────────────────────────────────────
  test('DOC-INIT-020 — "Required field!" errors shown when Initiate DOC modal submitted empty',
    async ({ landingPage, newProductPage, docDetailsPage }) => {
      await allure.suite('DOC');
      await allure.severity('normal');
      await allure.tag('regression');
      await allure.description(
        'DOC-INIT-020: Clicking the Initiate DOC button inside the Create DOC popup without ' +
        'filling any mandatory fields must show "Required field!" validation messages.',
      );

      await test.step('Create a Digital Offer product and open DOC Certification tab', async () => {
        await createProductForModalTesting(landingPage, newProductPage);
      });

      await test.step('Open the Initiate DOC modal', async () => {
        await docDetailsPage.openInitiateDocModal();
        await docDetailsPage.expectInitiateDocModalVisible();
      });

      await test.step('Submit the modal without filling any fields', async () => {
        await docDetailsPage.submitInitiateDocModalEmpty();
      });

      await test.step('Verify required-field validation messages appear', async () => {
        await docDetailsPage.expectInitiateDocModalValidationErrors();
      });
    });

  // ─────────────────────────────────────────────────────────────────────────
  // DOC-INIT-021 — Cancel button closes the modal without saving
  // ─────────────────────────────────────────────────────────────────────────
  test('DOC-INIT-021 — Cancel button on the Initiate DOC popup closes the form without saving',
    async ({ landingPage, newProductPage, docDetailsPage }) => {
      await allure.suite('DOC');
      await allure.severity('minor');
      await allure.tag('regression');
      await allure.description(
        'DOC-INIT-021: The Cancel button inside the Initiate DOC popup must close the modal ' +
        'without creating a DOC or navigating away from the product page.',
      );

      await test.step('Create a Digital Offer product and open DOC Certification tab', async () => {
        await createProductForModalTesting(landingPage, newProductPage);
      });

      await test.step('Open the Initiate DOC modal', async () => {
        await docDetailsPage.openInitiateDocModal();
        await docDetailsPage.expectInitiateDocModalVisible();
      });

      await test.step('Click Cancel to close the modal', async () => {
        await docDetailsPage.clickInitiateDocModalCancel();
      });

      await test.step('Verify the modal is closed and DOC Certification tab is still shown', async () => {
        await docDetailsPage.expectInitiateDocModalClosed();
        await newProductPage.expectDigitalOfferCertificationTabActive();
      });
    });

  // ─────────────────────────────────────────────────────────────────────────
  // Skipped — require a different user role or special product state
  // ─────────────────────────────────────────────────────────────────────────
  test('DOC-INIT-015 — VESTA ID with active DOC is disabled in Create DOC popup',
    async () => {
      test.skip(true, 'Requires a product with 2+ VESTA IDs, one of which has an active DOC');
    });

  test('DOC-INIT-016 — Single-VESTA-ID product: VESTA ID auto-selected in Create DOC popup',
    async () => {
      test.skip(true, 'Requires deterministic product setup with exactly one VESTA ID and no active DOC');
    });

  test('DOC-INIT-017 — Multi-VESTA-ID product: VESTA ID field empty, user must select',
    async () => {
      test.skip(true, 'Requires a product pre-configured with 2+ VESTA IDs');
    });

  test('DOC-INIT-018 — Request DOC popup for CREATE privilege user has no DOC Reason field',
    async () => {
      test.skip(true, 'Requires a user with CREATE_DIGITAL_OFFER_CERTIFICATION (not INITIATE) privilege');
    });

  test('DOC-INIT-019 — Submit Request creates DOC with status "Pending Initiation"',
    async () => {
      test.skip(true, 'Requires a user with CREATE_DIGITAL_OFFER_CERTIFICATION (not INITIATE) privilege');
    });

  test('DOC-INIT-022 — CANCEL_DIGITAL_OFFER_CERTIFICATION_REQUEST privilege grants Cancel DOC button',
    async () => {
      test.skip(true, 'Requires a user with CANCEL_DIGITAL_OFFER_CERTIFICATION_REQUEST privilege');
    });
});
