/**
 * Spec 11.16 — DOC–Release Linkage
 *
 * Covers the bi-directional connection between a DOC and its associated release:
 *   ATC-11.16.1  Header shows Release label + non-empty value
 *   ATC-11.16.10 Product Detail shows "Digital Offer Certification" tab after DOC initiation
 *   ATC-11.16.11 Digital Offer Certification tab shows DOC table with expected columns + data row
 *
 * Already covered by existing TCs (not duplicated here):
 *   ATC-11.16.2  → DOC-DETAIL-010 (doc-detail.spec.ts) — Release link navigates to Release Detail
 *   ATC-11.16.3  → ATC-11.16.3 (doc-detail-offer.spec.ts extension)
 *   ATC-11.16.4  → ATC-11.16.4 (doc-detail-offer.spec.ts extension)
 *   ATC-11.16.5  → DOC-OFFER-005 (doc-detail-offer.spec.ts) — Other Release reveals Version field
 *   ATC-11.16.6  → DOC-OFFER-009 (doc-detail-offer.spec.ts) — Target Release Date is disabled
 *   ATC-11.16.7  → ATC-11.16.7 (doc-detail-offer.spec.ts extension)
 *   ATC-11.16.8  → LANDING-DOCS-003 (my-docs-tab.spec.ts) — Target Release Date column header
 *   ATC-11.16.9  → ATC-11.16.9 (my-docs-tab.spec.ts extension)
 *
 * Depends on: doc-state-setup (a DOC in Controls Scoping status must exist).
 */
import { test, expect } from '../../src/fixtures';
import { readDocState } from '../../src/helpers/doc.helper';
import * as allure from 'allure-js-commons';

test.describe('DOC - Release Linkage (11.16) @regression', () => {
  test.setTimeout(120_000);

  let docDetailsUrl: string;

  test.beforeAll(() => {
    docDetailsUrl = readDocState().docDetailsUrl;
  });

  test.beforeEach(async ({ page, loginPage, userCredentials }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    await loginPage.login(userCredentials.login, userCredentials.password);
    await page.waitForURL(/GRC_PICASso/, { timeout: 60_000 });
  });

  // ── ATC-11.16.1 ──────────────────────────────────────────────────────────
  test('ATC-11.16.1 — DOC Detail header shows a Release label with non-empty value', async ({ page, docDetailsPage }) => {
    await allure.suite('DOC / Release Linkage');
    await allure.severity('normal');
    await allure.description(
      'ATC-11.16.1: The DOC Detail header must show a "Release" label and a non-empty ' +
      'release value (either a clickable link for a named release, or plain text for ' +
      '"Other Release" entries).',
    );

    await test.step('Navigate to DOC Detail page', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
    });

    await test.step('Verify Release label and non-empty value are visible in header', async () => {
      await docDetailsPage.expectReleaseHeaderLabelAndValue();
    });
  });

  // ── ATC-11.16.10 ─────────────────────────────────────────────────────────
  test('ATC-11.16.10 — Product Detail shows Digital Offer Certification tab after DOC initiation', async ({ page, docDetailsPage, newProductPage }) => {
    await allure.suite('DOC / Release Linkage');
    await allure.severity('normal');
    await allure.description(
      'ATC-11.16.10: Navigating from the DOC Detail breadcrumb to the associated ' +
      'Product Detail page must show a "Digital Offer Certification" tab, confirming ' +
      'the DOC is linked to the product.',
    );

    await test.step('Navigate to DOC Detail page', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
    });

    await test.step('Navigate to the linked Product Detail via breadcrumb', async () => {
      await docDetailsPage.navigateToLinkedProduct();
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Verify Digital Offer Certification tab is visible on Product Detail', async () => {
      await newProductPage.expectDigitalOfferCertificationTabVisible();
    });
  });

  // ── ATC-11.16.11 ─────────────────────────────────────────────────────────
  test('ATC-11.16.11 — Digital Offer Certification tab shows DOC table with expected columns and a data row', async ({ page, docDetailsPage, newProductPage }) => {
    await allure.suite('DOC / Release Linkage');
    await allure.severity('normal');
    await allure.description(
      'ATC-11.16.11: After clicking the Digital Offer Certification tab on Product Detail, ' +
      'the grid must show columns for DOC ID, Name, Status, and VESTA ID, ' +
      'and must contain at least one data row.',
    );

    await test.step('Navigate to DOC Detail page', async () => {
      await page.goto(docDetailsUrl);
      await docDetailsPage.waitForOSLoad();
    });

    await test.step('Navigate to the linked Product Detail via breadcrumb', async () => {
      await docDetailsPage.navigateToLinkedProduct();
      await newProductPage.expectProductDetailLoaded();
    });

    await test.step('Click the Digital Offer Certification tab', async () => {
      await newProductPage.clickDigitalOfferCertificationTab();
      await docDetailsPage.waitForOSLoad();
    });

    await test.step('Verify DOC table column headers are visible', async () => {
      // Actual grid columns (from live UI): NAME, DOC ID, VESTA ID, START DATE,
      // TARGET RELEASE DATE, CERTIFICATION DECISION, STATUS, PRODUCT
      const certGrid = page
        .getByRole('grid')
        .filter({ has: page.getByRole('columnheader', { name: /DOC ID/i }) })
        .first();

      await expect(certGrid).toBeVisible({ timeout: 30_000 });
      await expect(certGrid.getByRole('columnheader', { name: /DOC ID/i })).toBeVisible();
      await expect(certGrid.getByRole('columnheader', { name: /^NAME$/i })).toBeVisible();
      await expect(certGrid.getByRole('columnheader', { name: /^STATUS$/i })).toBeVisible();
      await expect(certGrid.getByRole('columnheader', { name: /VESTA/i })).toBeVisible();
    });

    await test.step('Verify at least one data row is present', async () => {
      const certGrid = page
        .getByRole('grid')
        .filter({ has: page.getByRole('columnheader', { name: /DOC ID/i }) })
        .first();
      // Row 0 is the header row; row 1+ are data rows
      const firstDataRow = certGrid.getByRole('row').nth(1);
      await expect(firstDataRow).toBeVisible({ timeout: 30_000 });
    });
  });
});
