import { type Page, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '@helpers/wait.helper';
import type { DocDetailsLocators } from '@locators/doc-details.locators';

export class OfferTab {
  constructor(
    private readonly page: Page,
    private readonly l: DocDetailsLocators,
  ) {}

  private async waitForOSLoad(): Promise<void> {
    await waitForOSScreenLoad(this.page);
  }

  async clickDigitalOfferDetailsTab(): Promise<void> {
    await this.waitForOSLoad();

    const panelAlreadyVisible = await this.l.digitalOfferDetailsPanel.isVisible().catch(() => false);
    const editButtonVisible = await this.l.editDetailsButton.isVisible().catch(() => false);
    const saveButtonVisible = await this.l.saveChangesButton.isVisible().catch(() => false);
    if (panelAlreadyVisible && (editButtonVisible || saveButtonVisible)) {
      return;
    }

    await this.l.digitalOfferDetailsTab.waitFor({ state: 'visible', timeout: 30_000 });

    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.l.digitalOfferDetailsTab.click({ force: attempt > 1 });
      await this.waitForOSLoad();

      const panelVisible = await this.l.digitalOfferDetailsPanel.isVisible().catch(() => false);
      if (panelVisible) {
        return;
      }
    }

    await this.l.digitalOfferDetailsPanel.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async clickEditDetails(): Promise<void> {
    await this.l.editDetailsButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.editDetailsButton.click();
    await this.waitForOSLoad();
  }

  async fillOfferDocName(name: string): Promise<void> {
    await this.l.offerDocNameInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.offerDocNameInput.fill(name);
  }

  async fillOfferDocReason(text: string): Promise<void> {
    await this.l.offerDocReasonTextarea.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.offerDocReasonTextarea.fill(text);
  }

  async selectOfferRelease(label: string): Promise<void> {
    await this.l.offerReleaseDropdown.waitFor({ state: 'visible', timeout: 15_000 });

    try {
      await this.l.offerReleaseDropdown.selectOption({ label });
      await this.waitForOSLoad();
      return;
    } catch {
      await this.l.offerReleaseDropdown.click();
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const option = this.page.getByRole('option', { name: new RegExp(`^${escapedLabel}$`, 'i') }).first();
      await option.waitFor({ state: 'visible', timeout: 15_000 });
      await option.click();
      await this.waitForOSLoad();
    }
  }

  async clickSaveChanges(): Promise<void> {
    await expect(this.l.saveChangesButton).toBeVisible({ timeout: 15_000 });
    await expect(this.l.saveChangesButton).toBeEnabled({ timeout: 15_000 });

    const activeTagName = await this.page.evaluate(() => (globalThis as any).document?.activeElement?.tagName ?? '');
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTagName)) {
      await this.page.keyboard.press('Tab');
      await this.waitForOSLoad();
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.l.saveChangesButton.click({ force: attempt > 1 });
      await this.waitForOSLoad();

      const returnedToReadOnly = await this.l.editDetailsButton.isVisible().catch(() => false);
      if (returnedToReadOnly) {
        return;
      }

      const canRetrySave = await this.l.saveChangesButton.isVisible().catch(() => false);
      if (!canRetrySave || attempt === 3) {
        break;
      }
    }
  }

  async clickCancelEdit(): Promise<void> {
    await this.l.cancelEditButton.click();
    await this.waitForOSLoad();
  }

  async expectEditDetailsButtonVisible(): Promise<void> {
    await expect(this.l.editDetailsButton).toBeVisible({ timeout: 30_000 });
  }

  async expectSaveChangesButtonVisible(): Promise<void> {
    await expect(this.l.saveChangesButton).toBeVisible({ timeout: 15_000 });
  }

  async expectCancelEditButtonVisible(): Promise<void> {
    await expect(this.l.cancelEditButton).toBeVisible({ timeout: 15_000 });
  }

  async expectDocNameInputEditable(): Promise<void> {
    await expect(this.l.offerDocNameInput).toBeVisible({ timeout: 15_000 });
    await expect(this.l.offerDocNameInput).toBeEditable();
  }

  async expectDocReasonCharCountVisible(): Promise<void> {
    await expect(this.l.offerDocReasonCharCount).toBeVisible({ timeout: 15_000 });
  }

  async expectReleaseVersionInputVisible(): Promise<void> {
    await expect(this.l.offerReleaseVersionInput).toBeVisible({ timeout: 15_000 });
  }

  async expectDigitalOfferDetailsTabClickable(): Promise<void> {
    await expect(this.l.digitalOfferDetailsTab).toBeVisible({ timeout: 30_000 });
    await expect(this.l.digitalOfferDetailsTab).toBeEnabled();
  }

  async expectDigitalOfferDetailsTabPanelVisible(): Promise<void> {
    await expect(this.l.digitalOfferDetailsPanel).toBeVisible({ timeout: 30_000 });
  }

  // ── WF 11.16 — Release Linkage helpers ─────────────────────────────────────

  async expectReleaseHeaderLabelAndValue(): Promise<void> {
    const releaseContainer = this.page.locator('#Release_Con');
    await expect(releaseContainer).toBeVisible({ timeout: 30_000 });
    const link = releaseContainer.getByRole('link').first();
    const isLink = await link.isVisible().catch(() => false);
    if (isLink) {
      const linkText = (await link.textContent() ?? '').trim();
      expect(linkText.length, 'Release link text should not be empty').toBeGreaterThan(0);
    } else {
      const containerText = (await releaseContainer.textContent() ?? '').trim();
      expect(
        containerText.replace(/^Release\s*/i, '').trim().length,
        'Release header container should contain a non-empty release value',
      ).toBeGreaterThan(0);
    }
  }

  async getOfferReleaseOptions(): Promise<string[]> {
    await this.l.offerReleaseDropdown.waitFor({ state: 'visible', timeout: 15_000 });

    const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim();

    const readNativeOptions = async (): Promise<string[]> => {
      const nativeOptions = await this.l.offerReleaseDropdown
        .locator('option')
        .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ''))
        .catch(() => [] as string[]);

      return [...new Set(nativeOptions.map(normalize).filter(Boolean))];
    };

    let options = await readNativeOptions();

    if (options.length <= 1) {
      await expect
        .poll(async () => {
          const values = await readNativeOptions();
          return values.length > 1;
        }, {
          timeout: 10_000,
          message: 'Waiting for Release dropdown options to populate',
        })
        .toBeTruthy()
        .catch(() => undefined);

      options = await readNativeOptions();
    }

    return options;
  }

  async selectFirstNamedRelease(): Promise<string | null> {
    const options = await this.getOfferReleaseOptions();
    const named = options.filter(
      (option) =>
        option &&
        !/^select release$/i.test(option) &&
        option !== 'Other Release' &&
        option !== '-' &&
        option !== '--',
    );
    if (named.length === 0) return null;
    await this.selectOfferRelease(named[0]);
    return named[0];
  }

  async expectTargetReleaseDateHasValue(): Promise<void> {
    const tabpanel = this.page.getByRole('tabpanel').first();
    const dateInput = tabpanel
      .getByLabel(/Target Release Date/i)
      .or(tabpanel.getByRole('textbox', { name: /Target Release Date/i }))
      .first();

    const inputCount = await dateInput.count();
    if (inputCount > 0) {
      const value = await dateInput.inputValue().catch(() => '');
      expect(value.trim(), 'Target Release Date should have a non-empty value').not.toBe('');
    } else {
      await expect(this.l.targetReleaseDateHeader).toContainText(/\d/, { timeout: 15_000 });
    }
  }

  async expectReleaseVersionInputHidden(): Promise<void> {
    await expect(this.l.offerReleaseVersionInput).toBeHidden({ timeout: 10_000 });
  }

  async navigateToLinkedProduct(): Promise<void> {
    await this.l.breadcrumbProductLink.waitFor({ state: 'visible', timeout: 30_000 });
    await Promise.all([
      this.page.waitForURL(/ProductDetail/, { timeout: 60_000 }),
      this.l.breadcrumbProductLink.click(),
    ]);
  }
}
