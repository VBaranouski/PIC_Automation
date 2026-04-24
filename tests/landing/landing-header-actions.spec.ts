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

  test('LANDING-HEADER-001 — should display New Product button in page header @regression', async ({ landingPage }) => {
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

  test('LANDING-HEADER-002 — should navigate to New Product form when clicking New Product button @regression', async ({ landingPage, page }) => {
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

  test('LANDING-HEADER-003 — should display Roles Delegation link in page header @regression', async ({ landingPage }) => {
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

  test('LANDING-HEADER-004 — should navigate to Roles Delegation page when clicking link @regression', async ({ landingPage, page }) => {
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

  test('LANDING-HEADER-005 — should navigate back to Landing Page when clicking header logo @regression', async ({ landingPage, page }) => {
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

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW 2.1 / 2.6 — Header logo from non-landing page & rapid tab switching
// ────────────────────────────────────────────────────────────────────────────

test.describe('Landing Page - Logo Navigation & Tab Switching @regression', () => {
  test.setTimeout(180_000);

  test('LANDING-HEADER-LOGO-001 — PICASso header logo navigates to Landing Page from a non-landing page @regression', async ({ landingPage, page }) => {
    await allure.suite('Landing Page - Header');
    await allure.severity('critical');
    await allure.tag('regression');
    await allure.description(
      'LANDING-HEADER-LOGO-001: Verify that clicking the PICASso header logo from a non-landing page (e.g. Product Detail) navigates back to the Landing Page.',
    );

    await test.step('Navigate to My Releases tab and click the first release link', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
      await landingPage.clickTab('My Releases');
      await landingPage.waitForGridDataRows();

      // Click the first clickable release link to land on a non-landing page
      const firstLink = landingPage.grid.getByRole('row').nth(1).getByRole('link').first();
      const hasLink = await firstLink.isVisible({ timeout: 10_000 }).catch(() => false);
      test.skip(!hasLink, 'No release link found in My Releases grid — cannot test logo navigation from non-landing page.');
      await firstLink.click();
      await page.waitForURL(/ReleaseDetail|DOCDetail|ProductDetail/, { timeout: 30_000 });
    });

    await test.step('Verify we are NOT on the landing page', async () => {
      expect(page.url()).not.toMatch(/GRC_PICASso\/$/);
    });

    await test.step('Click the PICASso header logo', async () => {
      await landingPage.clickHeaderLogo();
    });

    await test.step('Verify navigation to Landing Page', async () => {
      await page.waitForURL(/GRC_PICASso/, { timeout: 30_000 });
      await landingPage.expectPageLoaded({ timeout: 30_000 });
    });
  });

  test('LANDING-TABS-SWITCH-001 — rapid tab switching does not break grid rendering @regression', async ({ landingPage }) => {
    await allure.suite('Landing Page - Tabs');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'LANDING-TABS-SWITCH-001: Verify that rapidly switching through all 5 tabs in sequence does not break grid rendering — all tabs should remain accessible.',
    );

    const tabs = ['My Tasks', 'My Products', 'My Releases', 'My DOCs', 'Reports & Dashboards'] as const;

    await test.step('Navigate to Landing Page', async () => {
      await landingPage.goto();
      await landingPage.expectPageLoaded({ timeout: 60_000 });
    });

    await test.step('Rapidly switch through all 5 tabs without waiting for full load', async () => {
      for (const tabName of tabs) {
        const tab = landingPage.getTab(tabName);
        await tab.waitFor({ state: 'visible', timeout: 30_000 });
        await tab.click();
      }
    });

    await test.step('Verify the last active tab (Reports & Dashboards) is selected', async () => {
      await landingPage.expectTabActive('Reports & Dashboards');
    });

    await test.step('Verify grid or content is still rendered after rapid switching', async () => {
      await landingPage.expectTabpanelVisible();
    });
  });
});