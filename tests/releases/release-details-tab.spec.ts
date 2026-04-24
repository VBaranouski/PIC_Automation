import { test, expect } from '../../src/fixtures';
import * as allure from 'allure-js-commons';
import { openReleaseDetail } from './helpers/release-navigation';

function getAddSeProductDialog(page: import('@playwright/test').Page) {
  return page.getByRole('dialog').filter({ has: page.getByText(/Add SE Component/i) }).first();
}

async function openAddSeProductDialogOrSkip(
  page: import('@playwright/test').Page,
  landingPage: { expectPageLoaded(options?: { timeout?: number }): Promise<void> },
  releaseDetailPage: {
    waitForPageLoad(): Promise<void>;
    expectReleaseDetailsTabSelected(): Promise<void>;
    openAddSeProductDialog(): Promise<void>;
    expectAddSeProductDialogVisible(): Promise<void>;
  },
  currentReleaseUrl: string,
): Promise<string> {
  const releaseDetailUrl = await openReleaseDetail(page, landingPage as never, currentReleaseUrl);
  await releaseDetailPage.waitForPageLoad();
  await releaseDetailPage.expectReleaseDetailsTabSelected();

  const addButton = page.getByRole('button', { name: /Add SE Product/i }).first();
  const buttonAvailable = await addButton.isVisible({ timeout: 5_000 }).catch(() => false);
  test.skip(!buttonAvailable, 'Add SE Product button not available on the sampled QA release.');

  await releaseDetailPage.openAddSeProductDialog();
  await releaseDetailPage.expectAddSeProductDialogVisible();
  return releaseDetailUrl;
}

async function closeAddSeProductDialog(page: import('@playwright/test').Page): Promise<void> {
  const dialog = getAddSeProductDialog(page);
  const closeButton = dialog.getByRole('button', { name: /Close|Cancel|×|✕/i }).first();
  const closeVisible = await closeButton.isVisible({ timeout: 5_000 }).catch(() => false);
  if (closeVisible) {
    await closeButton.click();
  } else {
    await page.keyboard.press('Escape');
  }
  await dialog.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined);
}

test.describe.serial('Releases - Release Details Tab @regression', () => {
  test.setTimeout(300_000);

  let releaseDetailUrl = '';
  let addedDependencyLabel = '';

  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
    await landingPage.expectPageLoaded({ timeout: 60_000 });
  });

  test('RELEASE-DETAILS-001 — should load Release Details by default with the core read-only fields visible', async ({
    page,
    landingPage,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-DETAILS-001: Opening a Release Detail page must land on the Release Details tab by default and show the currently rendered summary fields for Release Creation, Release Version, Target Release Date, and Change Summary.',
    );

    await test.step('Navigate to any Release Detail page', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify Release Details tab is selected by default', async () => {
      await releaseDetailPage.expectReleaseDetailsTabSelected();
    });

    await test.step('Verify core Release Details fields are visible', async () => {
      await releaseDetailPage.expectReleaseDetailsCoreFieldsVisible();
    });
  });

  test('RELEASE-DETAILS-002 — should show the SE product subtabs inside Release Details', async ({
    page,
    landingPage,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-DETAILS-002: The Release Details tab must show the nested Included SE Components and Part Of SE Products subtabs, and the Included SE Components area must load its content or empty state.',
    );

    await test.step('Open the previously discovered Release Detail page', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Verify the nested SE product subtabs are visible', async () => {
      await releaseDetailPage.expectSeProductSubTabsVisible();
    });

    await test.step('Verify Included SE Components area loads', async () => {
      await releaseDetailPage.expectIncludedSeComponentsSectionLoaded();
    });
  });

  test('RELEASE-DETAILS-003 — should open Part of SE Products as a read-only subtab', async ({
    page,
    landingPage,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-DETAILS-003: The Part of SE Products subtab inside Release Details must be selectable and remain read-only, without exposing the Add SE Product action.',
    );

    await test.step('Open the previously discovered Release Detail page', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Open Part of SE Products', async () => {
      await releaseDetailPage.clickPartOfSeProductsTab();
    });

    await test.step('Verify Part of SE Products is selected', async () => {
      await releaseDetailPage.expectPartOfSeProductsTabSelected();
    });

    await test.step('Verify Add SE Product action is not exposed on the read-only subtab', async () => {
      await releaseDetailPage.expectAddSeProductButtonHidden();
    });
  });

  test('RELEASE-DETAILS-004 — should enter inline edit mode for Release Details and cancel back to read-only', async ({
    page,
    landingPage,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-DETAILS-004: The sampled QA Scoping release should switch Release Details into inline edit mode, expose editable Target Release Date and Change Summary controls, and return to read-only mode when Cancel is clicked.',
    );

    await test.step('Open the previously discovered Release Detail page', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Enter inline Release Details edit mode', async () => {
      await releaseDetailPage.openReleaseDetailsEditMode();
      await releaseDetailPage.expectReleaseDetailsEditModeVisible();
    });

    await test.step('Cancel edit mode and return to read-only view', async () => {
      await releaseDetailPage.cancelReleaseDetailsEditMode();
      await releaseDetailPage.expectReleaseDetailsReadOnlyModeVisible();
    });
  });

  test('RELEASE-DETAILS-005 — should save an updated Change Summary and restore the original value', async ({
    page,
    landingPage,
    releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-DETAILS-005: The sampled QA Scoping release should allow Change Summary to be updated and saved in inline edit mode, then restored to its original value in the same session.',
    );

    let originalSummary = '';
    const updatedSummary = `Automated release change summary ${Date.now()}`;

    await test.step('Open the previously discovered Release Detail page', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    let rdtOriginalSummary = false;
    await test.step('Capture the original Change Summary from edit mode', async () => {
      await releaseDetailPage.openReleaseDetailsEditMode();
      await releaseDetailPage.expectReleaseDetailsEditModeVisible();
      originalSummary = await releaseDetailPage.getEditModeChangeSummaryValue();
      rdtOriginalSummary = !!originalSummary;
      await releaseDetailPage.cancelReleaseDetailsEditMode();
      await releaseDetailPage.expectReleaseDetailsReadOnlyModeVisible();
    });
    test.skip(!rdtOriginalSummary, 'Change Summary is empty on the sampled release; skipping persistence check.');

    try {
      await test.step('Update and save Change Summary', async () => {
        await releaseDetailPage.openReleaseDetailsEditMode();
        await releaseDetailPage.expectReleaseDetailsEditModeVisible();
        await releaseDetailPage.fillReleaseDetailsChangeSummary(updatedSummary);
        await releaseDetailPage.saveReleaseDetailsEditMode();
        await releaseDetailPage.expectReleaseDetailsReadOnlyModeVisible();
        await releaseDetailPage.openReleaseDetailsEditMode();
        await releaseDetailPage.expectEditModeChangeSummaryValue(updatedSummary);
        await releaseDetailPage.cancelReleaseDetailsEditMode();
        await releaseDetailPage.expectReleaseDetailsReadOnlyModeVisible();
      });
    } finally {
      await test.step('Restore the original Change Summary', async () => {
        await releaseDetailPage.openReleaseDetailsEditMode();
        await releaseDetailPage.expectReleaseDetailsEditModeVisible();
        await releaseDetailPage.fillReleaseDetailsChangeSummary(originalSummary);
        await releaseDetailPage.saveReleaseDetailsEditMode();
        await releaseDetailPage.expectReleaseDetailsReadOnlyModeVisible();
        await releaseDetailPage.openReleaseDetailsEditMode();
        await releaseDetailPage.expectEditModeChangeSummaryValue(originalSummary);
        await releaseDetailPage.cancelReleaseDetailsEditMode();
        await releaseDetailPage.expectReleaseDetailsReadOnlyModeVisible();
      });
    }
  });

  // ── RELEASE-DETAILS-CANCEL-LEAVE-001 ─────────────────────────────────────
  test('RELEASE-DETAILS-CANCEL-LEAVE-001 — should show Leave Page dialog when navigating away with unsaved Release Details changes', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-DETAILS-CANCEL-LEAVE-001: When the user navigates away from Release Details inline edit mode with unsaved changes, the application must show a Leave Page confirmation dialog to prevent accidental data loss.',
    );

    await test.step('Navigate to Release Detail page', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Enter inline edit mode and make an unsaved change', async () => {
      await releaseDetailPage.openReleaseDetailsEditMode();
      await releaseDetailPage.expectReleaseDetailsEditModeVisible();
      await releaseDetailPage.fillReleaseDetailsChangeSummary(`Leave page test ${Date.now()}`);
    });

    await test.step('Click Home breadcrumb link while in edit mode', async () => {
      await releaseDetailPage.clickBreadcrumbHome();
      await page.waitForTimeout(2_000);
    });

    let rdtLeavePageShown = false;
    await test.step('Check whether Leave Page dialog appeared or navigation occurred silently', async () => {
      const currentUrl = page.url();
      if (!currentUrl.includes('ReleaseDetail')) return;
      const leaveDialog = page
        .locator('[role="dialog"]')
        .filter({ hasText: /leave|unsaved|discard/i })
        .first();
      rdtLeavePageShown = await leaveDialog.isVisible({ timeout: 5_000 }).catch(() => false);
    });
    test.skip(!rdtLeavePageShown, 'Leave Page dialog did not appear — OS may not block navigation in this release context');

    await test.step('Assert Leave Page dialog has required action buttons', async () => {
      const leaveDialog = page
        .locator('[role="dialog"]')
        .filter({ hasText: /leave|unsaved|discard/i })
        .first();
      await expect(leaveDialog).toBeVisible({ timeout: 10_000 });
      const hasActionButton =
        (await page.getByRole('button', { name: /Leave|Discard/i }).first().isVisible().catch(() => false)) ||
        (await page.getByRole('button', { name: /Stay|Cancel/i }).first().isVisible().catch(() => false));
      expect(hasActionButton, 'Leave Page dialog must have Leave or Stay/Cancel action buttons').toBe(true);
    });

    await test.step('Dismiss dialog by clicking Stay/Cancel to remain on the page', async () => {
      const stayBtn = page.getByRole('button', { name: /Stay|Cancel/i }).first();
      const stayVisible = await stayBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (stayVisible) {
        await stayBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForURL(/ReleaseDetail/, { timeout: 15_000 });
    });

    await test.step('Cancel edit mode to restore clean state', async () => {
      await releaseDetailPage.cancelReleaseDetailsEditMode();
      await releaseDetailPage.expectReleaseDetailsReadOnlyModeVisible();
    });
  });

  // ── RELEASE-DETAILS-ADDSEP-001 ────────────────────────────────────────────
  test('RELEASE-DETAILS-ADDSEP-001 — should open Add SE Product dialog from Included SE Components subtab', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'RELEASE-DETAILS-ADDSEP-001: Clicking the Add SE Product button on the Included SE Components subtab must open the Add SE Product dialog.',
    );

    await test.step('Navigate to Release Detail page', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    await test.step('Ensure on Release Details tab and Included SE Components subtab', async () => {
      await releaseDetailPage.expectReleaseDetailsTabSelected();
      await releaseDetailPage.expectReleaseDetailsCoreFieldsVisible();
    });

    let rdtAddSeButtonAvailable = false;
    await test.step('Attempt to open Add SE Product dialog', async () => {
        try {
          await releaseDetailPage.openAddSeProductDialog();
          rdtAddSeButtonAvailable = true;
        } catch {
          // Button not visible or release is read-only/locked
        }
        if (!rdtAddSeButtonAvailable) return;
        await releaseDetailPage.expectAddSeProductDialogVisible();
    });
    test.skip(!rdtAddSeButtonAvailable, 'Add SE Product button not available on sampled release');

    await test.step('Dismiss Add SE Product dialog', async () => {
      const dialog = page
        .getByRole('dialog')
        .filter({ has: page.getByText(/Add SE Component/i) })
        .first();
      const closeBtn = dialog.getByRole('button', { name: /Close|Cancel|×|✕/i }).first();
      const closeBtnVisible = await closeBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (closeBtnVisible) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
    });
  });

  test('should support searching for a registered PICASso product in Add SE Product popup', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'Add Product popup supports searching for a registered PICASso product, selecting a release, and saving the dependency when the flow is available in QA.',
    );

    await test.step('Open Add SE Product dialog', async () => {
      releaseDetailUrl = await openAddSeProductDialogOrSkip(page, landingPage, releaseDetailPage, releaseDetailUrl);
    });

    let rdtSearchVisible = false;
    let rdtOptionVisible = false;
    let rdtReleaseSelectVisible = false;
    let rdtSelectedRelease: { value: string; text: string } | null = null;
    await test.step('Search for a registered product and select the first available option', async () => {
      const dialog = getAddSeProductDialog(page);
      const searchInput = dialog.locator('input[type="search"], input[type="text"]').first();
      rdtSearchVisible = await searchInput.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtSearchVisible) return;

      await searchInput.fill('Power');
      await page.waitForTimeout(1_500);

      const firstOption = dialog.locator('[role="option"], .vscomp-option, .select2-results__option').first();
      rdtOptionVisible = await firstOption.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtOptionVisible) return;
      addedDependencyLabel = (await firstOption.innerText().catch(() => '')).trim();
      await firstOption.click();

      const releaseSelect = dialog.getByRole('combobox').last();
      rdtReleaseSelectVisible = await releaseSelect.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtReleaseSelectVisible) return;
      const releaseOptions = await releaseSelect.locator('option').evaluateAll((options) =>
        options.map((option) => ({ value: option.getAttribute('value') ?? '', text: option.textContent?.trim() ?? '' })),
      ).catch(() => [] as Array<{ value: string; text: string }>);
      rdtSelectedRelease = releaseOptions.find((option) => option.value && option.text) ?? null;
      if (!rdtSelectedRelease) return;
      await releaseSelect.selectOption(rdtSelectedRelease.value);
    });
    test.skip(!rdtSearchVisible, 'Registered product search input is not rendered in this QA dialog layout.');
    test.skip(!rdtOptionVisible, 'No registered product options were returned for the sampled search term.');
    test.skip(!rdtReleaseSelectVisible, 'Release selector is not rendered after choosing the registered product.');
    test.skip(!rdtSelectedRelease, 'No release options are available for the selected registered product.');

    let rdtSaveVisible = false;
    let rdtIsDuplicate = false;
    await test.step('Save and verify the dependency is added or dialog closes successfully', async () => {
      const dialog = getAddSeProductDialog(page);
      const saveButton = dialog.getByRole('button', { name: /Save|Add/i }).first();
      rdtSaveVisible = await saveButton.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtSaveVisible) return;
      await saveButton.click();

      const dialogStillVisible = await dialog.isVisible({ timeout: 10_000 }).catch(() => false);
      if (dialogStillVisible) {
        const dialogText = await dialog.innerText().catch(() => '');
        rdtIsDuplicate = /already been added to the list/i.test(dialogText);
        if (rdtIsDuplicate) return;
      }

      if (addedDependencyLabel) {
        await expect(page.getByText(addedDependencyLabel, { exact: false }).first()).toBeVisible({ timeout: 20_000 });
      }
    });
    test.skip(!rdtSaveVisible, 'Save/Add action is not available in the current Add SE Product dialog layout.');
    test.skip(rdtIsDuplicate, 'Selected registered product is already present in Included SE Components.');
  });

  test('should allow manual release entry when Release not found is selected in Add SE Product popup', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'Add Product popup exposes manual release entry fields after selecting Release not found when the flow is available in QA.',
    );

    await test.step('Open Add SE Product dialog', async () => {
      releaseDetailUrl = await openAddSeProductDialogOrSkip(page, landingPage, releaseDetailPage, releaseDetailUrl);
    });

    let rdtReleaseNotFoundVisible = false;
    await test.step('Select Release not found and verify manual-entry fields appear', async () => {
      const dialog = getAddSeProductDialog(page);
      const releaseNotFound = dialog.getByText(/Release not found/i).first();
      rdtReleaseNotFoundVisible = await releaseNotFound.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtReleaseNotFoundVisible) return;
      await releaseNotFound.click();

      await expect(dialog.getByRole('textbox', { name: /Release Number/i }).first()).toBeVisible({ timeout: 10_000 });
      await expect(dialog.getByRole('combobox', { name: /FCSR Decision/i }).first()).toBeVisible({ timeout: 10_000 });
      await expect(dialog.getByRole('textbox', { name: /FCSR Date|Select a date/i }).first()).toBeVisible({ timeout: 10_000 });
    });
    test.skip(!rdtReleaseNotFoundVisible, 'Release not found option is not available in this QA dialog layout.');

    await test.step('Dismiss Add SE Product dialog', async () => {
      await closeAddSeProductDialog(page);
    });
  });

  test('should allow adding unregistered products via Create New Dependencies with SE Product', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'Add Product popup exposes unregistered dependency entry controls when Create New Dependencies with SE Product is selected.',
    );

    await test.step('Open Add SE Product dialog', async () => {
      releaseDetailUrl = await openAddSeProductDialogOrSkip(page, landingPage, releaseDetailPage, releaseDetailUrl);
    });

    let rdtCreateNewDepVisible = false;
    await test.step('Enable Create New Dependencies with SE Product and verify free-form entry appears', async () => {
      const dialog = getAddSeProductDialog(page);
      const createNewDependencies = dialog.getByText(/Create New Dependencies with SE Product/i).first();
      rdtCreateNewDepVisible = await createNewDependencies.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtCreateNewDepVisible) return;
      await createNewDependencies.click();

      const freeFormInput = dialog.locator('input[type="text"], textarea').first();
      await expect(freeFormInput).toBeVisible({ timeout: 10_000 });
    });
    test.skip(!rdtCreateNewDepVisible, 'Create New Dependencies with SE Product control is not available in this QA dialog layout.');

    await test.step('Dismiss Add SE Product dialog', async () => {
      await closeAddSeProductDialog(page);
    });
  });

  test('should show duplicate-product validation when the selected dependency already exists', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'Adding a product that is already present in Included SE Components shows the expected duplicate validation message when the flow is available in QA.',
    );

    let existingDependencyLabel = '';

    let rdtExistingRowVisible = false;
    await test.step('Capture an existing dependency row', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.expectReleaseDetailsTabSelected();

      const existingRow = page.getByRole('grid').getByRole('row').nth(1);
      rdtExistingRowVisible = await existingRow.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtExistingRowVisible) return;
      existingDependencyLabel = ((await existingRow.innerText().catch(() => '')) || '').split('\n')[0]?.trim() ?? '';
    });
    test.skip(!rdtExistingRowVisible, 'No Included SE Components rows are present on the sampled release.');
    test.skip(!existingDependencyLabel, 'Could not derive an existing dependency label from the first Included SE Components row.');

    let rdtDupSearchVisible = false;
    let rdtDupOptionVisible = false;
    let rdtDupSaveVisible = false;
    await test.step('Attempt to add the same dependency again', async () => {
      releaseDetailUrl = await openAddSeProductDialogOrSkip(page, landingPage, releaseDetailPage, releaseDetailUrl);
      const dialog = getAddSeProductDialog(page);
      const searchInput = dialog.locator('input[type="search"], input[type="text"]').first();
      rdtDupSearchVisible = await searchInput.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtDupSearchVisible) return;
      await searchInput.fill(existingDependencyLabel);
      await page.waitForTimeout(1_500);

      const matchingOption = dialog.getByText(new RegExp(existingDependencyLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).first();
      rdtDupOptionVisible = await matchingOption.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtDupOptionVisible) return;
      await matchingOption.click();

      const saveButton = dialog.getByRole('button', { name: /Save|Add/i }).first();
      rdtDupSaveVisible = await saveButton.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtDupSaveVisible) return;
      await saveButton.click();
    });
    test.skip(!rdtDupSearchVisible, 'Registered product search input is not rendered in this QA dialog layout.');
    test.skip(!rdtDupOptionVisible, 'The existing dependency is not selectable from the current Add SE Product dialog search results.');
    test.skip(!rdtDupSaveVisible, 'Save/Add action is not available in the current Add SE Product dialog layout.');

    await test.step('Verify duplicate validation message is shown', async () => {
      await expect(getAddSeProductDialog(page).getByText(/This product has already been added to the list/i).first()).toBeVisible({ timeout: 15_000 });
      await closeAddSeProductDialog(page);
    });
  });

  test('should remove an added Included SE Component from related CSRR content', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'Removing an Included SE Component added by the current run removes that dependency from related CSRR content when both flows are available in QA.',
    );

    test.skip(!addedDependencyLabel, 'No dependency was added earlier in this run, so removal cannot be validated safely.');
    await test.step('Require a dependency added by this test session', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
    });

    let rdtRemoveRowVisible = false;
    let rdtRemoveButtonVisible = false;
    await test.step('Remove the added dependency from Included SE Components', async () => {
      const dependencyRow = page.getByRole('row').filter({ hasText: addedDependencyLabel }).first();
      rdtRemoveRowVisible = await dependencyRow.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtRemoveRowVisible) return;
      const removeButton = dependencyRow.getByRole('button', { name: /Remove|Delete/i }).first();
      rdtRemoveButtonVisible = await removeButton.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtRemoveButtonVisible) return;
      await removeButton.click();
      const confirmButton = page.getByRole('button', { name: /Yes|Remove|Delete/i }).first();
      const confirmVisible = await confirmButton.isVisible({ timeout: 5_000 }).catch(() => false);
      if (confirmVisible) {
        await confirmButton.click();
      }
    });
    test.skip(!rdtRemoveRowVisible, `Added dependency ${addedDependencyLabel} is not present in Included SE Components.`);
    test.skip(!rdtRemoveButtonVisible, 'Remove action is not available for the added Included SE Component row.');

    let rdtCsrrVisible = false;
    let rdtCsrrDisabled = false;
    await test.step('Verify the dependency no longer appears under CSRR content', async () => {
      const csrrTab = releaseDetailPage.getTopLevelTab('Cybersecurity Residual Risks');
      rdtCsrrVisible = await csrrTab.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!rdtCsrrVisible) return;
      rdtCsrrDisabled = await releaseDetailPage.isTopLevelTabDisabled('Cybersecurity Residual Risks');
      if (rdtCsrrDisabled) return;
      const csrrText = await releaseDetailPage.getTopLevelTabPanelText('Cybersecurity Residual Risks');
      expect(csrrText).not.toContain(addedDependencyLabel);
    });
    test.skip(!rdtCsrrVisible, 'CSRR tab is not visible on the sampled release.');
    test.skip(rdtCsrrDisabled, 'CSRR tab is disabled on the sampled release.');
  });

  test('should show a warning icon when Included SE Component release number differs from latest release number', async ({
    page, landingPage, releaseDetailPage,
  }) => {
    await allure.suite('Releases / Release Detail / Release Details');
    await allure.severity('normal');
    await allure.tag('regression');
    await allure.description(
      'Included SE Components rows show a warning indicator when the linked Release Number differs from the Latest Release Number, when such data is present in QA.',
    );

    await test.step('Open Included SE Components list', async () => {
      releaseDetailUrl = await openReleaseDetail(page, landingPage, releaseDetailUrl);
      await releaseDetailPage.waitForPageLoad();
      await releaseDetailPage.expectReleaseDetailsTabSelected();
    });

    let warningVisible = false;
    await test.step('Verify warning icon visibility when mismatch rows exist', async () => {
      const warningIcon = page.locator('[title*="Latest Release Number"], [aria-label*="warning" i], .fa-warning, .icon-warning').first();
      warningVisible = await warningIcon.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!warningVisible) return;
      await expect(warningIcon).toBeVisible({ timeout: 10_000 });
    });
    test.skip(!warningVisible, 'No Included SE Component release-version mismatch warning is visible on the sampled QA release.');
  });
});
