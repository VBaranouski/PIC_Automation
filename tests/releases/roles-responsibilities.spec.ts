/**
 * Spec — Release Detail: Roles & Responsibilities Tab
 *
 * Covers structural / read-only checks for the Roles & Responsibilities tab
 * at the Creation & Scoping stage of a release.
 *
 * All tests are non-destructive (no add/remove/edit of users or roles).
 */

import { test, expect } from '../../src/fixtures';
import type { Page } from '@playwright/test';
import type { LandingPage } from '../../src/pages';
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
});
