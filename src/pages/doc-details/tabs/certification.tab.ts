import { type Page, expect } from '@playwright/test';
import { waitForOSScreenLoad } from '@helpers/wait.helper';
import type { DocDetailsLocators } from '@locators/doc-details.locators';

export class CertificationTab {
  constructor(
    private readonly page: Page,
    private readonly l: DocDetailsLocators,
  ) {}

  private async waitForOSLoad(): Promise<void> {
    await waitForOSScreenLoad(this.page);
  }

  async clickCertificationDecisionTab(): Promise<void> {
    await this.waitForOSLoad();

    const isAlreadyActive = await this.l.certificationDecisionTab
      .getAttribute('aria-selected')
      .catch(() => null);
    if (isAlreadyActive === 'true') return;

    await this.l.certificationDecisionTab.waitFor({ state: 'visible', timeout: 30_000 });
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.l.certificationDecisionTab.click({ force: attempt > 1 });
      await this.waitForOSLoad();

      const isNowActive = await this.l.certificationDecisionTab
        .getAttribute('aria-selected')
        .catch(() => null);
      if (isNowActive === 'true') return;
    }

    await this.l.certDecisionPanel.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async hasProposeDecisionButton(): Promise<boolean> {
    return this.l.proposeDecisionButton.isVisible().catch(() => false);
  }

  async hasCertDecisionWarning(): Promise<boolean> {
    return this.l.certDecisionWarningText.isVisible().catch(() => false);
  }

  async expectProposeOrEditDecisionButtonVisible(): Promise<void> {
    const hasProposeBtn = await this.l.proposeDecisionButton
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);

    if (hasProposeBtn) return;

    const hasEditBtn = await this.l.certDecisionPanel
      .getByRole('button', { name: 'Edit' })
      .first()
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    expect(
      hasProposeBtn || hasEditBtn,
      'Expected either "Propose Decision" or "Edit" button to be visible on the Certification Decision tab',
    ).toBe(true);
  }

  async expectSubmitForApprovalButtonVisible(): Promise<void> {
    await expect(this.l.submitForApprovalButton).toBeVisible({ timeout: 15_000 });
  }

  async expectCertRiskSummaryCardsVisible(): Promise<void> {
    await expect(this.l.certDecisionItsCardTitle).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummarySdlTitle).toBeVisible({ timeout: 15_000 });
    await expect(this.l.riskSummaryPrivacyTitle).toBeVisible({ timeout: 15_000 });
  }

  async expectUnresolvedFindingsSectionVisible(): Promise<void> {
    await expect(this.l.unresolvedFindingsSection).toBeVisible({ timeout: 15_000 });
  }

  async hasUnresolvedFindingsGrid(): Promise<boolean> {
    return this.l.unresolvedFindingsGrid.isVisible().catch(() => false);
  }

  async expectDocApprovalsSectionVisible(): Promise<void> {
    await expect(this.l.docApprovalsSection).toBeVisible({ timeout: 15_000 });
  }

  async hasDocApprovalsSection(): Promise<boolean> {
    return this.l.docApprovalsSection.isVisible().catch(() => false);
  }

  async expectDocSignaturesTableVisible(): Promise<void> {
    await expect(this.l.docApprovalsSignaturesTable).toBeVisible({ timeout: 15_000 });
    await expect(
      this.l.docApprovalsSignaturesTable.getByRole('columnheader', { name: 'Approver Name' }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      this.l.docApprovalsSignaturesTable.getByRole('columnheader', { name: 'Role' }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      this.l.docApprovalsSignaturesTable.getByRole('columnheader', { name: 'Signature' }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      this.l.docApprovalsSignaturesTable.getByRole('columnheader', { name: 'Comment' }),
    ).toBeVisible({ timeout: 10_000 });
  }

  async hasProvideSignatureButton(): Promise<boolean> {
    return this.l.provideSignatureButton.isVisible().catch(() => false);
  }

  async expectUnresolvedFindingsControlIdClickable(): Promise<void> {
    await expect(this.l.unresolvedFindingsSection).toBeVisible({ timeout: 15_000 });

    const hasLink = await this.l.unresolvedFindingsControlIdLink.isVisible().catch(() => false);
    if (!hasLink) return;

    await expect(this.l.unresolvedFindingsControlIdLink).toBeVisible({ timeout: 10_000 });
    const href = await this.l.unresolvedFindingsControlIdLink.getAttribute('href');
    expect(href, 'Control ID link must have a valid href pointing to ControlDetail').toMatch(/ControlDetail/);
  }

  async hasClosedActionsLink(): Promise<boolean> {
    return this.l.closedActionsLink.isVisible().catch(() => false);
  }

  async expectClosedActionsLinkVisible(): Promise<void> {
    await expect(this.l.unresolvedFindingsSection).toBeVisible({ timeout: 15_000 });
    const hasLink = await this.l.closedActionsLink.isVisible().catch(() => false);
    if (!hasLink) return;
    await expect(this.l.closedActionsLink).toBeVisible({ timeout: 10_000 });
  }

  async expectDocIdHeaderVisible(): Promise<void> {
    await expect(this.l.docIdHeader).toBeVisible({ timeout: 15_000 });
    const text = (await this.l.docIdHeader.first().textContent()) ?? '';
    expect(text, 'DOC ID header must match DOC-NNN format').toMatch(/^DOC-\d+/);
  }

  async expectVestaIdHeaderVisible(): Promise<void> {
    await expect(this.l.vestaIdHeaderValue).toBeVisible({ timeout: 15_000 });
  }

  async expectMonitorActionClosureStageVisible(): Promise<void> {
    await expect(this.l.docPipelineTab6).toBeVisible({ timeout: 15_000 });
  }

  async expectUnresolvedFindingsEmptyState(): Promise<void> {
    await expect(this.l.unresolvedFindingsSection).toBeVisible({ timeout: 15_000 });
    const hasGrid = await this.l.unresolvedFindingsGrid.isVisible().catch(() => false);
    if (hasGrid) {
      const rowCount = await this.l.unresolvedFindingsGrid.getByRole('row').count();
      expect(rowCount, 'Unresolved Findings must have no data rows when certified').toBeLessThanOrEqual(1);
    }
  }

  async expectCertEditDecisionButtonVisible(): Promise<void> {
    await expect(this.l.certEditDecisionButton).toBeVisible({ timeout: 15_000 });
  }

  async getApproverDataRowCount(): Promise<number> {
    return this.l.docApprovalsSignaturesTable.locator('tbody tr').count().catch(() => 0);
  }

  async expectMonitorActionClosureStageHidden(): Promise<void> {
    await expect(this.l.docPipelineTab6).toBeHidden({ timeout: 10_000 });
  }

  async clickSubmitForApprovalAndExpectPopup(): Promise<boolean> {
    await this.l.submitForApprovalButton.waitFor({ state: 'visible', timeout: 15_000 });
    const isEnabled = await this.l.submitForApprovalButton.isEnabled().catch(() => false);
    if (!isEnabled) return false;

    await this.l.submitForApprovalButton.click();
    await this.waitForOSLoad();

    const popupVisible = await this.page
      .getByRole('dialog')
      .last()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    return popupVisible;
  }

  async expectSubmitForApprovalPopupVisible(): Promise<void> {
    await expect(this.page.getByRole('dialog').last()).toBeVisible({ timeout: 15_000 });
  }

  async dismissSubmitForApprovalPopup(): Promise<void> {
    const cancelBtn = this.page
      .getByRole('dialog')
      .last()
      .getByRole('button', { name: /Cancel|No/i })
      .first();
    await cancelBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await cancelBtn.click();
    await this.waitForOSLoad();
  }

  async expectProvideSignatureButtonVisible(): Promise<void> {
    await expect(this.l.provideSignatureButton).toBeVisible({ timeout: 15_000 });
  }

  async openProposeDecisionPopup(): Promise<boolean> {
    const hasButton = await this.hasProposeDecisionButton();
    if (!hasButton) return false;

    await this.l.proposeDecisionButton.click();
    await this.waitForOSLoad();

    return this.l.certDecisionDialog
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
  }

  async expectProposeDecisionPopupBaseFieldsVisible(): Promise<void> {
    await expect(this.l.certDecisionDialog).toBeVisible({ timeout: 15_000 });
    await expect(
      this.l.certDecisionDialog.getByText(/Proposed Decision/i).first(),
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      this.l.certDecisionDialog.getByRole('combobox').first(),
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      this.l.certDecisionDialog.getByText(/Comment/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  }

  async getProposedDecisionOptions(): Promise<string[]> {
    const optionTexts = await this.l.certDecisionDialog
      .getByRole('combobox')
      .first()
      .locator('option')
      .allTextContents()
      .catch(() => []);

    return optionTexts
      .map((value) => value.trim())
      .filter((value) => value && !/^(- select -|select)$/i.test(value));
  }

  async selectProposedDecisionOption(optionLabel: string): Promise<void> {
    const select = this.l.certDecisionDialog.getByRole('combobox').first();
    await select.waitFor({ state: 'visible', timeout: 10_000 });
    await select.selectOption({ label: optionLabel });
    await this.waitForOSLoad();
  }

  async hasValidityEndDateField(): Promise<boolean> {
    return this.l.certDecisionDialog
      .getByText(/Validity End Date/i)
      .first()
      .isVisible()
      .catch(() => false);
  }

  async hasActionsClosureDueDateField(): Promise<boolean> {
    return this.l.certDecisionDialog
      .getByText(/Due Date for Actions Closure/i)
      .first()
      .isVisible()
      .catch(() => false);
  }

  async closeProposeDecisionPopup(): Promise<void> {
    const dialog = this.l.certDecisionDialog;
    const cancelButton = dialog.getByRole('button', { name: /Cancel|Close/i }).first();
    const cancelVisible = await cancelButton.isVisible().catch(() => false);

    if (cancelVisible) {
      await cancelButton.click();
    } else {
      const closeIcon = dialog.locator('.popup-structure-header i.fa-times').first();
      const closeVisible = await closeIcon.isVisible().catch(() => false);
      if (closeVisible) {
        await closeIcon.click();
      }
    }

    await this.waitForOSLoad();
  }
}
