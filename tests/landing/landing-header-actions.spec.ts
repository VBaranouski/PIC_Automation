import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.6 — Header Global Actions
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - Header Global Actions @regression', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('should display New Product button in page header @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-001: Verify the "New Product" button is visible in the page header on the Landing Page',
    );

    await test.step('Verify New Product button is visible', async () => {
      await landingPage.expectNewProductButtonVisible();
    });
  });

  test('should navigate to New Product form when clicking New Product button @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-002: Verify clicking "New Product" button navigates to the New Product creation form',
    );

    await test.step('Click New Product button', async () => {
      await landingPage.clickNewProductButton();
    });

    await test.step('Verify navigation to New Product form', async () => {
      await page.waitForURL(/ProductDetail/, { timeout: 30_000 });
    });
  });

  test('should display Roles Delegation link in page header @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-003: Verify the "Roles Delegation" link is visible in the page header on the Landing Page',
    );

    await test.step('Verify Roles Delegation link is visible', async () => {
      await landingPage.expectRolesDelegationLinkVisible();
    });
  });

  test('should navigate to Roles Delegation page when clicking link @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-004: Verify clicking "Roles Delegation" link navigates to the Roles Delegation page (opens in a new browser tab)',
    );

    await test.step('Click Roles Delegation link and wait for new tab', async () => {
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page', { timeout: 15_000 }),
        landingPage.rolesDelegationLink.click(),
      ]);
      await newPage.waitForLoadState('domcontentloaded', { timeout: 30_000 });
      expect(newPage.url()).toMatch(/RolesDelegation/i);
      await newPage.close();
    });
  });

  test('should navigate back to Landing Page when clicking header logo @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-005: Verify clicking the PICASso header logo navigates to the Landing Page (HomePage)',
    );

    await test.step('Verify header logo link is visible', async () => {
      await landingPage.expectHeaderLogoVisible();
    });

    await test.step('Click header logo', async () => {
      await landingPage.clickHeaderLogo();
    });

    await test.step('Verify navigation back to Landing Page', async () => {
      await page.waitForURL(/GRC_PICASso/, { timeout: 30_000 });
      await landingPage.expectPageLoaded({ timeout: 30_000 });
    });
  });
});