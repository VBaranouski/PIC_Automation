import { type Page, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '@helpers/wait.helper';
import type { DocDetailsLocators } from '@locators/doc-details.locators';

export class ItsTab {
  constructor(
    private readonly page: Page,
    private readonly l: DocDetailsLocators,
  ) {}

  private async waitForOSLoad(): Promise<void> {
    await waitForOSScreenLoad(this.page);
  }

  async clickITSChecklistTab(): Promise<void> {
    await this.waitForOSLoad();

    const itsVisible = await this.l.itsChecklistPanel.isVisible().catch(() => false);
    if (itsVisible) {
      return;
    }

    await this.l.itsChecklistTab.waitFor({ state: 'visible', timeout: 30_000 });
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.l.itsChecklistTab.click({ force: true });
      await this.waitForOSLoad();

      if (await this.l.itsChecklistPanel.isVisible().catch(() => false)) {
        return;
      }
    }

    await this.l.itsChecklistPanel.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async expectITSChecklistTabClickable(): Promise<void> {
    await expect(this.l.itsChecklistTab).toBeVisible({ timeout: 30_000 });
    await expect(this.l.itsChecklistTab).toBeEnabled();
  }

  async expectITSSecurityControlsTitleVisible(): Promise<void> {
    await expect(this.l.itsSecurityControlsTitle).toBeVisible({ timeout: 30_000 });
  }

  async expectITSGridColumnHeaders(): Promise<void> {
    const expected = ['CONTROL ID', 'DESCRIPTION', 'EVIDENCE EXPECTATION', 'CATEGORY'];
    for (const header of expected) {
      await expect(
        this.l.itsGrid.locator('th').filter({ hasText: header }),
      ).toBeVisible({ timeout: 15_000 });
    }
  }

  async hasITSControls(): Promise<boolean> {
    const noControlsMsg = await this.l.itsNoControlsAddedMessage.isVisible().catch(() => false);
    const noActiveMsg = await this.l.itsNoActiveControlsMessage.isVisible().catch(() => false);
    return !noControlsMsg && !noActiveMsg;
  }

  async expectITSFilterControlsVisible(): Promise<void> {
    await expect(this.l.itsCategoryFilter).toBeVisible({ timeout: 15_000 });
    await expect(this.l.itsSearchInput).toBeVisible({ timeout: 15_000 });
    await expect(this.l.itsResetButton).toBeVisible({ timeout: 15_000 });
  }

  async hasControlsInAddControlPopup(): Promise<boolean> {
    return this.l.addControlTable.locator('tbody tr').first().isVisible().catch(() => false);
  }

  async searchITSControls(query: string): Promise<void> {
    await this.l.itsSearchInput.fill(query);
    await this.waitForOSLoad();
  }

  async hasITSNoResultsMessage(): Promise<boolean> {
    return this.l.itsNoResultsMessage.isVisible().catch(() => false);
  }

  async getITSGridDataRowCount(): Promise<number> {
    return this.l.itsGrid.locator('tbody tr').count();
  }

  async clickITSReset(): Promise<void> {
    await this.l.itsResetButton.click();
    await this.waitForOSLoad();
  }

  async expectITSSecurityControlsTitleLoaded(): Promise<void> {
    await expect(this.l.itsSecurityControlsTitle).toBeVisible({ timeout: 15_000 });
  }

  async expectITSGridVisible(): Promise<void> {
    await expect(this.l.itsGrid).toBeVisible({ timeout: 15_000 });
  }

  async expectITSGridColumnHeadersVisible(): Promise<void> {
    await expect(this.l.itsGrid.locator('thead tr').first()).toBeVisible({ timeout: 15_000 });
  }

  async expectITSNoResultsMessageVisible(): Promise<void> {
    await expect(this.l.itsNoResultsMessage).toBeVisible({ timeout: 15_000 });
  }

  async clickITSGridColumnHeader(headerText: string | RegExp): Promise<void> {
    const header = this.l.itsGrid.locator('th').filter({ hasText: headerText });
    await header.waitFor({ state: 'visible', timeout: 15_000 });
    await header.click();
    await this.waitForOSLoad();
  }

  async expectAddControlButtonVisible(): Promise<void> {
    await expect(this.l.itsAddControlButton).toBeVisible({ timeout: 15_000 });
  }

  async clickAddControl(): Promise<void> {
    await this.l.itsAddControlButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.itsAddControlButton.click();
    await this.waitForOSLoad();
  }

  async expectAddControlPopupVisible(): Promise<void> {
    await expect(this.l.addControlPopup).toBeVisible({ timeout: 30_000 });
  }

  async expectAddControlPopupElements(): Promise<void> {
    await expect(this.l.addControlSearchInput).toBeVisible({ timeout: 15_000 });
    await expect(this.l.addControlCategoryFilter).toBeVisible({ timeout: 15_000 });
    await expect(this.l.addControlTable).toBeVisible({ timeout: 15_000 });
    await expect(this.l.addSelectedButton).toBeVisible({ timeout: 15_000 });
  }

  async selectFirstControlInPopup(): Promise<void> {
    const firstRow = this.l.addControlTable.locator('tbody tr').first();
    await firstRow.waitFor({ state: 'visible', timeout: 15_000 });
    await firstRow.locator('input[type="checkbox"]').click();
    await this.waitForOSLoad();
  }

  async expectAddSelectedButtonEnabled(): Promise<void> {
    await expect(this.l.addSelectedButton).toBeEnabled({ timeout: 15_000 });
  }

  async expectSelectedCountVisible(): Promise<void> {
    await expect(this.l.addControlSelectedCount).toBeVisible({ timeout: 15_000 });
  }

  async closeAddControlPopup(): Promise<void> {
    await this.l.addControlCloseButton.click();
    await this.waitForOSLoad();
  }

  async clickFirstControlDescopeButton(): Promise<void> {
    const firstRow = this.l.itsGridDataRow(0);
    await firstRow.waitFor({ state: 'visible', timeout: 15_000 });
    await firstRow.locator('td:last-child a').click();
    await this.waitForOSLoad();
  }

  async clickFirstControlIdLink(): Promise<void> {
    const firstRow = this.l.itsGridDataRow(0);
    await firstRow.waitFor({ state: 'visible', timeout: 15_000 });
    const controlLink = firstRow.locator('td:first-child a').first();
    const href = await controlLink.getAttribute('href');

    if (href) {
      await this.page.goto(new URL(href, this.page.url()).toString(), {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
    } else {
      await controlLink.click({ force: true });
    }

    await this.page.waitForURL(/ControlDetail/, { timeout: 30_000, waitUntil: 'domcontentloaded' }).catch(async () => {
      await expect.poll(() => this.page.url(), { timeout: 30_000 }).toMatch(/ControlDetail/);
    });
    await this.waitForOSLoad();
  }

  async expectUnscopePopupVisible(): Promise<void> {
    await expect(this.l.unscopePopupHeading).toBeVisible({ timeout: 15_000 });
  }

  async fillUnscopeJustification(text: string): Promise<void> {
    await this.l.unscopeJustificationInput.fill(text);
  }

  async expectUnscopeDescoperButtonEnabled(): Promise<void> {
    await expect(this.l.unscopeDescoperButton).toBeEnabled({ timeout: 15_000 });
  }

  async expectUnscopeDescoperButtonDisabled(): Promise<void> {
    await expect(this.l.unscopeDescoperButton).toBeDisabled({ timeout: 15_000 });
  }

  async cancelUnscopePopup(): Promise<void> {
    await this.l.unscopePopupCancelButton.click();
    await this.waitForOSLoad();
  }

  async expectITSDefaultSortedByControlId(): Promise<void> {
    const row0 = this.l.itsGridDataRow(0);
    const row1 = this.l.itsGridDataRow(1);

    const hasRow1 = await row1.isVisible({ timeout: 10_000 }).catch(() => false);
    if (!hasRow1) return;

    const id0 = ((await row0.locator('td').first().textContent()) ?? '').trim();
    const id1 = ((await row1.locator('td').first().textContent()) ?? '').trim();
    expect(
      id0 <= id1,
      `ITS grid row[0] Control ID "${id0}" should be ≤ row[1] "${id1}" (default ascending sort)`,
    ).toBe(true);
  }

  async expectAddControlPopupNoResultsWithCountPreserved(): Promise<void> {
    const addBtnVisible = await this.l.itsAddControlButton
      .isVisible({ timeout: 10_000 })
      .catch(() => false);
    if (!addBtnVisible) return;

    await this.l.itsAddControlButton.click();
    await this.waitForOSLoad();
    await this.l.addControlPopup.waitFor({ state: 'visible', timeout: 15_000 });

    const hasControls = await this.hasControlsInAddControlPopup();

    if (hasControls) {
      await this.selectFirstControlInPopup();
      await this.expectSelectedCountVisible();
    }

    await this.l.addControlSearchInput.fill('ZZZNOMATCH_9999');
    await this.waitForOSLoad();

    await expect(this.l.addControlNoResultsMessage).toBeVisible({ timeout: 10_000 });

    if (hasControls) {
      await this.expectSelectedCountVisible();
      await this.expectAddSelectedButtonEnabled();
    }

    await this.l.addControlCloseButton.click();
    await this.waitForOSLoad();
  }
}
