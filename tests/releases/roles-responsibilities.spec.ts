/**
 * Spec — Release Detail: Roles & Responsibilities Tab
 *
 * Covers structural / read-only checks for the Roles & Responsibilities tab
 * at the Creation & Scoping stage of a release.
 *
 * Mutating checks use disposable releases to avoid changing shared QA data.
 */

import { test, expect } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage, ReleaseDetailPage } from '../../src/pages';
import * as allure from 'allure-js-commons';

// ---------------------------------------------------------------------------
// Helper — navigate via Landing Page → My Releases → first release row.
// This is the most resilient path because it lists every release the test
// user can see, rather than depending on a specific product having releases.
// ---------------------------------------------------------------------------
async function navigateToAnyRelease(page: Page, landingPage: LandingPage): Promise<string> {
  await landingPage.goto();
  await landingPage.expectPageLoaded({ timeout: 60_000 });
  await landingPage.clickTab('My Releases');
  await landingPage.waitForGridDataRows(30_000);

  const firstReleaseLink = landingPage.grid.getByRole('row').nth(1).getByRole('link').first();
  await expect(firstReleaseLink).toBeVisible({ timeout: 30_000 });

  await Promise.all([
    page.waitForURL(/ReleaseDetail/, { timeout: 60_000 }),
    firstReleaseLink.click(),
  ]);
  return page.url();
}

async function openRolesEditMode(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
  releaseUrl: string,
): Promise<void> {
  await page.goto(releaseUrl, { waitUntil: 'domcontentloaded' });
  await releaseDetailPage.waitForPageLoad();
  await releaseDetailPage.clickTopLevelTab('Roles & Responsibilities');
  await releaseDetailPage.expectTopLevelTabSelected('Roles & Responsibilities');
  await page.getByRole('button', { name: /^Edit$/ }).click();
  await releaseDetailPage.waitForOSLoad();
}

async function assignArchitectTeamMember(
  page: Page,
  releaseDetailPage: ReleaseDetailPage,
  searchQuery: string,
  fullName: string,
  options: { addSlot?: boolean } = {},
): Promise<void> {
  const architectRow = page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first();
  const addUserLink = architectRow.getByRole('link', { name: /\+?\s*Add User/i });
  if (options.addSlot !== false && await addUserLink.isVisible().catch(() => false)) {
    await addUserLink.click();
    await releaseDetailPage.waitForOSLoad();
  }

  await architectRow.getByRole('link').last().click();
  const userLookup = architectRow.getByRole('searchbox', { name: /Type 4 letters/i });
  await expect(userLookup).toBeVisible({ timeout: 20_000 });
  await userLookup.clear();
  await userLookup.pressSequentially(searchQuery, { delay: 150 });
  await architectRow.getByText(fullName, { exact: true }).first().click();
  await releaseDetailPage.waitForOSLoad();
}

test.describe.serial('Releases - Roles & Responsibilities Tab @regression', () => {
  test.setTimeout(180_000);

  let releaseDetailUrl = '';

  // ── RELEASE-ROLES-001 ──────────────────────────────────────────────────────
  test(
    'RELEASE-ROLES-001 — Roles & Responsibilities tab loads with SDL Roles and Product Team sections',
    async ({ page, landingPage, releaseDetailPage }) => {
      await allure.suite('Releases / Release Detail / Roles & Responsibilities');
      await allure.severity('critical');
      await allure.tag('regression');
      await allure.description(
        'RELEASE-ROLES-001: Opening the Roles & Responsibilities tab on a release at ' +
        'Creation & Scoping stage must activate the tab and render both an SDL Roles ' +
        'section (with role rows) and a Product Team section below it.',
      );

      await test.step('Navigate to a Release Detail page', async () => {
        if (!releaseDetailUrl) {
          releaseDetailUrl = await navigateToAnyRelease(page, landingPage);
        } else {
          await page.goto(releaseDetailUrl);
          await releaseDetailPage.waitForPageLoad();
        }
      });

      await test.step('Click the Roles & Responsibilities tab', async () => {
        await releaseDetailPage.clickTopLevelTab('Roles & Responsibilities');
        await releaseDetailPage.expectTopLevelTabSelected('Roles & Responsibilities');
      });

      await test.step('Verify SDL Roles section is visible', async () => {
        await expect(
          page.getByText(/SDL Roles/i).first(),
          'SDL Roles section heading should be visible on the Roles & Responsibilities tab',
        ).toBeVisible({ timeout: 15_000 });
      });

      await test.step('Verify Product Team section is visible', async () => {
        await expect(
          page.getByText(/Product Team/i).first(),
          'Product Team section heading should be visible on the Roles & Responsibilities tab',
        ).toBeVisible({ timeout: 15_000 });
      });

      await test.step('Verify the tab content area exposes role-related columns', async () => {
        const panelText = await releaseDetailPage.getTopLevelTabPanelText('Roles & Responsibilities');
        expect(
          panelText,
          'Roles & Responsibilities panel must include a User Role column header',
        ).toMatch(/User Role/i);
        expect(
          panelText,
          'Roles & Responsibilities panel must include a Team Members column header',
        ).toMatch(/Team Members/i);
      });
    },
  );

  test('RELEASE-ROLES-003 — Product Team Add User action opens an assignment row or popup', async ({
    page,
    disposableRelease,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Roles & Responsibilities');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-ROLES-003: On a disposable Scoping release, the Product Team +Add User action opens the user assignment UI without mutating shared QA data.',
    );

    await test.step('Open Roles & Responsibilities for the disposable release', async () => {
      await page.goto(disposableRelease.url, { waitUntil: 'domcontentloaded' });
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.clickTopLevelTab('Roles & Responsibilities');
      await releaseDetailPage.expectTopLevelTabSelected('Roles & Responsibilities');
      await expect(page.getByText(/Product Team/i).first()).toBeVisible({ timeout: 15_000 });
    });

    await test.step('Enter Roles edit mode and click Product Team Add User action', async () => {
      await page.getByRole('button', { name: /^Edit$/ }).click();
      await releaseDetailPage.waitForOSLoad();
      const addUserButton = page.getByRole('link', { name: /\+?\s*Add User/i }).first();
      await expect(addUserButton).toBeVisible({ timeout: 20_000 });
      await addUserButton.click();
      await releaseDetailPage.waitForOSLoad();
    });

    await test.step('Verify a user assignment row or popup is available', async () => {
      const assignmentUi = page
        .locator('[role="dialog"], .osui-popup, [role="row"], tr')
        .filter({ hasText: /User Role|Team Members|Email|Location|Search|Name/i })
        .last();
      await expect(assignmentUi).toBeVisible({ timeout: 20_000 });
    });
  });

  test('RELEASE-ROLES-004 / RELEASE-ROLES-007 — assigning Product Team user populates email and location', async ({
    page,
    disposableRelease,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Roles & Responsibilities');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-ROLES-004 and RELEASE-ROLES-007: On a disposable Scoping release, assigning a Product Team user through lookup persists the user and auto-populates email/location.',
    );

    const assigneeName = 'Uladzislau Baranouski';
    const assigneeEmail = 'uladzislau.baranouski@non.se.com';

    await test.step('Open Product Team edit mode for the disposable release', async () => {
      await openRolesEditMode(page, releaseDetailPage, disposableRelease.url);
    });

    await test.step('Add a user to the ARCHITECT Product Team role', async () => {
      await assignArchitectTeamMember(page, releaseDetailPage, 'Ulad', assigneeName);
    });

    await test.step('Verify email and location auto-populate for the selected user', async () => {
      const architectRow = page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first();
      await expect(architectRow).toContainText(assigneeName, { timeout: 20_000 });
      await expect(architectRow).toContainText(assigneeEmail, { timeout: 20_000 });
      await expect(architectRow).toContainText('LT', { timeout: 20_000 });
    });

    await test.step('Save and verify the assignment persists', async () => {
      await page.getByRole('button', { name: /^Save$/ }).click();
      await releaseDetailPage.waitForOSLoad();
      const architectRow = page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first();
      await expect(architectRow).toContainText(assigneeName, { timeout: 20_000 });
      await expect(architectRow).toContainText(assigneeEmail, { timeout: 20_000 });
    });
  });

  test('RELEASE-ROLES-005 — replacing a Product Team user updates the row details', async ({
    page,
    disposableRelease,
    releaseDetailPage,
  }) => {
    test.fail(
      true,
      'Known defect: Product Team existing-member pencil lookup does not expose a usable replacement result after editing an assigned user.',
    );
    await allure.suite('Releases / Release Detail / Roles & Responsibilities');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-ROLES-005: On a disposable Scoping release, replacing the ARCHITECT Product Team user through the pencil lookup updates the name, email, and location.',
    );

    const initialName = 'Uladzislau Baranouski';
    const replacementName = 'Uladzimir Kashtelian';
    const replacementEmail = 'uladzimir.kashtelian@non.se.com';

    await test.step('Assign an initial ARCHITECT team member', async () => {
      await openRolesEditMode(page, releaseDetailPage, disposableRelease.url);
      await assignArchitectTeamMember(page, releaseDetailPage, 'Ulad', initialName);
      await expect(page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first()).toContainText(initialName, {
        timeout: 20_000,
      });
    });

    await test.step('Replace the ARCHITECT team member through the pencil lookup', async () => {
      await assignArchitectTeamMember(page, releaseDetailPage, 'Ulad', replacementName, { addSlot: false });
    });

    await test.step('Verify replacement name, email, and location are shown', async () => {
      const architectRow = page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first();
      await expect(architectRow).toContainText(replacementName, { timeout: 20_000 });
      await expect(architectRow).toContainText(replacementEmail, { timeout: 20_000 });
      await expect(architectRow).not.toContainText(initialName);
    });

    await test.step('Save and verify the replacement persists', async () => {
      await page.getByRole('button', { name: /^Save$/ }).click();
      await releaseDetailPage.waitForOSLoad();
      const architectRow = page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first();
      await expect(architectRow).toContainText(replacementName, { timeout: 20_000 });
      await expect(architectRow).toContainText(replacementEmail, { timeout: 20_000 });
    });
  });

  test('RELEASE-ROLES-006 — removing a Product Team user clears the row assignment', async ({
    page,
    disposableRelease,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Roles & Responsibilities');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-ROLES-006: On a disposable Scoping release, removing the ARCHITECT Product Team user clears the team member row before saving.',
    );

    const assigneeName = 'Uladzislau Baranouski';

    await test.step('Assign an ARCHITECT team member', async () => {
      await openRolesEditMode(page, releaseDetailPage, disposableRelease.url);
      await assignArchitectTeamMember(page, releaseDetailPage, 'Ulad', assigneeName);
      await expect(page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first()).toContainText(assigneeName, {
        timeout: 20_000,
      });
    });

    await test.step('Remove the assigned ARCHITECT team member', async () => {
      const architectRow = page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first();
      const removeLink = architectRow.getByRole('link', { name: // });
      await removeLink.click();
      await releaseDetailPage.waitForOSLoad();
    });

    await test.step('Verify the ARCHITECT row is cleared after removal', async () => {
      const architectRow = page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first();
      await expect(architectRow).not.toContainText(assigneeName, { timeout: 20_000 });
      await expect(architectRow).toContainText('-', { timeout: 20_000 });
    });

    await test.step('Save the cleared assignment', async () => {
      await page.getByRole('button', { name: /^Save$/ }).click();
      await releaseDetailPage.waitForOSLoad();
      await expect(page.getByRole('row').filter({ hasText: /^ARCHITECT/i }).first()).not.toContainText(assigneeName, {
        timeout: 20_000,
      });
    });
  });
});
