import type { Locator, Page } from '@playwright/test';

import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';

import type { DisposableRelease } from '../../src/helpers/disposable-test-data.helper';
import type { NewProductPage } from '../../src/pages';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function openDisposableReleaseRow(
  page: Page,
  newProductPage: NewProductPage,
  disposableRelease: DisposableRelease,
): Promise<Locator> {
  await page.goto(disposableRelease.product.url, { waitUntil: 'domcontentloaded' });
  await newProductPage.expectProductDetailLoaded();
  await newProductPage.clickReleasesTab();
  await newProductPage.expectReleasesTabActive();
  await expect(newProductPage.releasesGrid).toBeVisible({ timeout: 30_000 });

  const releaseRow = newProductPage.releasesGrid
    .getByRole('row')
    .filter({ hasText: new RegExp(escapeRegExp(disposableRelease.version), 'i') })
    .first();
  await expect(releaseRow).toBeVisible({ timeout: 30_000 });

  return releaseRow;
}

async function openDisposableReleaseRowActions(
  page: Page,
  newProductPage: NewProductPage,
  disposableRelease: DisposableRelease,
): Promise<Locator> {
  const releaseRow = await openDisposableReleaseRow(page, newProductPage, disposableRelease);

  const actionsButton = releaseRow.locator('.popover-top, button:has(.fa-ellipsis-v), .fa-ellipsis-v').last();
  await actionsButton.waitFor({ state: 'visible', timeout: 15_000 });
  await actionsButton.click();

  const actionsMenu = page.locator('.popover-content:visible, .popover:visible, [class*="popover"]:visible, [role="menu"]:visible')
    .filter({ hasText: /Inactivate|Clone/i })
    .last();
  await expect(actionsMenu).toBeVisible({ timeout: 10_000 });
  return actionsMenu;
}

function releaseActionOption(actionsMenu: Locator, optionName: RegExp): Locator {
  return actionsMenu.getByText(optionName).first();
}

function inactivateReleaseDialog(page: Page): Locator {
  return page.getByRole('dialog').filter({ hasText: /Inactivate Release/i }).first();
}

async function openInactivateReleaseDialog(
  page: Page,
  newProductPage: NewProductPage,
  disposableRelease: DisposableRelease,
): Promise<Locator> {
  const actionsMenu = await openDisposableReleaseRowActions(page, newProductPage, disposableRelease);
  const inactivateOption = releaseActionOption(actionsMenu, /^\s*Inactivate\s*$/i);
  await expect(inactivateOption).toBeVisible({ timeout: 10_000 });
  await inactivateOption.click();

  const dialog = inactivateReleaseDialog(page);
  await expect(dialog).toBeVisible({ timeout: 10_000 });
  return dialog;
}

/**
 * Release Inactivation (Section 3.10)
 *
 * Covers the ability to inactivate a release from either the Product Releases tab
 * or the My Releases tab, RBAC enforcement, and visual indicators (greyed-out
 * Inactivate button, status badge tooltip).
 *
 * Status: P1 non-destructive entry-point checks use disposable releases. Remaining
 * deferred scenarios require either:
 *   (a) destructively inactivating a real shared QA release,
 *   (b) a release in a specific pre-existing state (Creation & Scoping, completed,
 *       manually cancelled, No-Go FCSR, or already inactive),
 *   (c) an authenticated session for a non-default user role (Product Owner RBAC).
 *
 * Each scenario will be lifted as soon as disposable releases / RBAC fixtures are
 * available, or non-destructive observation-only paths are confirmed by QA.
 *
 * Plan reference: docs/ai/automation-testing-plan.md §3.10
 * Spec file:      products/release-inactivation.spec.ts
 */
test.describe('Releases - Inactivation @regression', () => {
  test.setTimeout(180_000);

  const FIXME_NOTE_DESTRUCTIVE =
    'Destructive — would inactivate a shared QA release. Deferred until disposable test releases are available.';
  const FIXME_NOTE_DATA =
    'Requires a known QA release in a specific state (e.g., already inactive, manually cancelled, No-Go FCSR, completed, or past Creation & Scoping). Awaiting stable test data fixtures.';
  const FIXME_NOTE_RBAC =
    'RBAC scenario — requires an authenticated session for a non-default user role. Awaiting RBAC fixture / additional storageState.';

  test('RELEASE-INACTIVATE-001 — Actions column on Product Releases tab shows Inactivate and Clone for Creation and Scoping release', async ({
    disposableRelease, newProductPage, page,
  }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('critical');
    await allure.tag('regression');

    const actionsMenu = await test.step('Open actions menu for a disposable Creation and Scoping release', async () => {
      return openDisposableReleaseRowActions(page, newProductPage, disposableRelease);
    });

    await test.step('Verify Inactivate and Clone are visible in the release actions menu', async () => {
      await expect(actionsMenu).toBeVisible({ timeout: 10_000 });
      await expect(releaseActionOption(actionsMenu, /^\s*Inactivate\s*$/i)).toBeVisible();
      await expect(releaseActionOption(actionsMenu, /^\s*Clone\s*$/i)).toBeVisible();
    });
  });

  test('RELEASE-INACTIVATE-002 — My Releases tab shows Inactivate option for eligible releases', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-002: ${FIXME_NOTE_DATA}`);
    await page.goto('/');
  });

  test('RELEASE-INACTIVATE-003 — Inactivate button is greyed out with tooltip for releases past Creation and Scoping stage', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-003: ${FIXME_NOTE_DATA}`);
    await page.goto('/');
  });

  test('RELEASE-INACTIVATE-004 — Completed releases: only Clone shown in Actions (Inactivate absent)', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-004: ${FIXME_NOTE_DATA}`);
    await page.goto('/');
  });

  test('RELEASE-INACTIVATE-005 — Manually cancelled release shows Inactivate option in Actions', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-005: ${FIXME_NOTE_DATA}`);
    await page.goto('/');
  });

  test('RELEASE-INACTIVATE-006 — No-Go FCSR cancelled release: Inactivate button is greyed out with tooltip', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-006: ${FIXME_NOTE_DATA}`);
    await page.goto('/');
  });

  test('RELEASE-INACTIVATE-007 — Clicking Inactivate on a release opens confirmation modal', async ({
    disposableRelease, newProductPage, page,
  }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('critical');
    await allure.tag('regression');

    await test.step('Open the Inactivate Release confirmation modal', async () => {
      await openInactivateReleaseDialog(page, newProductPage, disposableRelease);
    });

    await test.step('Verify the confirmation modal contents', async () => {
      const dialog = inactivateReleaseDialog(page);
      await expect(dialog).toBeVisible({ timeout: 10_000 });
      await expect(dialog.getByText(/Are you sure you want to inactivate this Release\? This action is irreversible\./i))
        .toBeVisible();
      await expect(dialog.getByRole('textbox', { name: /Justification/i })).toBeVisible();
      await expect(dialog.getByRole('button', { name: /^Cancel$/i })).toBeVisible();
      await expect(dialog.getByRole('button', { name: /^Inactivate Release$/i })).toBeVisible();
    });

    await test.step('Cancel the modal without inactivating the release', async () => {
      const dialog = inactivateReleaseDialog(page);
      await dialog.getByRole('button', { name: /^Cancel$/i }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(page).toHaveURL(/ProductDetail/);
    });
  });

  test('RELEASE-INACTIVATE-008 — Justification field is mandatory in release inactivation modal', async ({
    disposableRelease, newProductPage, page,
  }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');

    const dialog = await test.step('Open the Inactivate Release confirmation modal', async () => {
      return openInactivateReleaseDialog(page, newProductPage, disposableRelease);
    });

    await test.step('Verify justification is mandatory before release inactivation can submit', async () => {
      const justificationInput = dialog.getByRole('textbox', { name: /Justification/i });
      const submitButton = dialog.getByRole('button', { name: /^Inactivate Release$/i });
      await expect(justificationInput).toBeVisible();
      await expect(justificationInput).toHaveValue('');
      if (await submitButton.isDisabled().catch(() => false)) {
        await expect(submitButton).toBeDisabled();
        return;
      }

      await submitButton.click();
      await expect(dialog).toBeVisible({ timeout: 10_000 });
      await expect(dialog.getByText(/required|mandatory|enter.*justification|justification.*required/i).first())
        .toBeVisible({ timeout: 10_000 });
    });
  });

  test('RELEASE-INACTIVATE-009 — Cancel closes release inactivation modal without status change', async ({
    disposableRelease, newProductPage, page,
  }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');

    const dialog = await test.step('Open the Inactivate Release confirmation modal', async () => {
      return openInactivateReleaseDialog(page, newProductPage, disposableRelease);
    });

    await test.step('Enter justification and cancel without submitting', async () => {
      await dialog.getByRole('textbox', { name: /Justification/i }).fill('Automation cancel path verification');
      await dialog.getByRole('button', { name: /^Cancel$/i }).click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
      await expect(page).toHaveURL(/ProductDetail/);
    });

    await test.step('Verify the release row remains active after cancel', async () => {
      const releaseRow = await openDisposableReleaseRow(page, newProductPage, disposableRelease);
      await expect(releaseRow).toContainText(/Scoping|Creation/i);
      await expect(releaseRow).not.toContainText(/Inactive/i);
    });
  });

  test('RELEASE-INACTIVATE-010 — Full E2E: submitting inactivation changes release status to Inactive', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('critical');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-010: ${FIXME_NOTE_DESTRUCTIVE}`);
    await page.goto('/');
  });

  test('RELEASE-INACTIVATE-011 — Show Active Only toggle on Product Releases tab hides Inactive releases when ON', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-011: ${FIXME_NOTE_DATA}`);
    await page.goto('/');
  });

  test('RELEASE-INACTIVATE-012 — Tooltip on Inactive release status badge shows justification', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-012: ${FIXME_NOTE_DATA}`);
    await page.goto('/');
  });

  test('RELEASE-INACTIVATE-013 — RBAC: Product Owner sees only Clone in Actions and no Inactivate', async ({ page }) => {
    await allure.suite('Releases - Inactivation');
    await allure.severity('normal');
    await allure.tag('regression');
    test.fixme(true, `RELEASE-INACTIVATE-013: ${FIXME_NOTE_RBAC}`);
    await page.goto('/');
  });
});
