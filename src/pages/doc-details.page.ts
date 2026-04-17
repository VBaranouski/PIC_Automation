import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { docDetailsLocators, type DocDetailsLocators } from '@locators/doc-details.locators';
import { OfferTab, RolesTab, ItsTab, ActionsTab, RiskSummaryTab, HistoryTab, CertificationTab } from './doc-details/tabs';

export class DocDetailsPage extends BasePage {
  // DOC Detail URL — note module is GRC_PICASso_DOC, not GRC_PICASso
  readonly url = '/GRC_PICASso_DOC/DOCDetail';

  private readonly l: DocDetailsLocators;

  // ── Lazy tab instances ────────────────────────────────────────────────────
  private _offer?: OfferTab;
  private _roles?: RolesTab;
  private _its?: ItsTab;
  private _actions?: ActionsTab;
  private _riskSummary?: RiskSummaryTab;
  private _history?: HistoryTab;
  private _certification?: CertificationTab;

  constructor(page: Page) {
    super(page);
    this.l = docDetailsLocators(page);
  }

  // ── Tab accessors (lazy init) ─────────────────────────────────────────────
  get offer(): OfferTab { return (this._offer ??= new OfferTab(this.page, this.l)); }
  get roles(): RolesTab { return (this._roles ??= new RolesTab(this.page, this.l)); }
  get its(): ItsTab { return (this._its ??= new ItsTab(this.page, this.l)); }
  get actions(): ActionsTab { return (this._actions ??= new ActionsTab(this.page, this.l)); }
  get riskSummary(): RiskSummaryTab { return (this._riskSummary ??= new RiskSummaryTab(this.page, this.l)); }
  get history(): HistoryTab { return (this._history ??= new HistoryTab(this.page, this.l)); }
  get certification(): CertificationTab { return (this._certification ??= new CertificationTab(this.page, this.l)); }

  // ==================== Public locator accessors ====================

  get initiateDOCButton(): Locator { return this.l.initiateDOCButton; }

  get saveRolesChangesButton(): Locator { return this.l.saveRolesChangesButton; }

  // ==================== Core actions ====================

  async clickInitiateDOC(options: {
    docName: string;
    docReason: string;
    release?: string;
    releaseVersion?: string;
    targetReleaseDate?: { year: number; month: number; day: number };
  }): Promise<void> {
    await this.l.initiateDOCButton.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.initiateDOCButton.click();
    await this.l.initiateDocModal.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.modalDocNameInput.fill(options.docName);
    if (options.release) {
      await this.l.modalReleaseCombobox.selectOption({ label: options.release });
    }
    if (options.releaseVersion) {
      await this.l.modalReleaseVersionInput.fill(options.releaseVersion);
    }
    if (options.targetReleaseDate) {
      await this.l.modalTargetReleaseDateInput.click();
      await this.selectCalendarDate(
        options.targetReleaseDate.year,
        options.targetReleaseDate.month,
        options.targetReleaseDate.day,
      );
    }
    await this.l.modalDocReasonInput.fill(options.docReason);
    await this.l.modalInitiateButton.click();
  }

  async waitForInitiation(): Promise<void> {
    await this.waitForOSLoad();
    await this.l.productTableStatusCell.waitFor({ state: 'visible', timeout: 60_000 });
    await this.l.firstDocTableLink.waitFor({ state: 'visible', timeout: 60_000 });
  }

  async navigateToFirstDoc(): Promise<void> {
    await this.l.firstDocTableLink.waitFor({ state: 'visible', timeout: 30_000 });

    const href = await this.l.firstDocTableLink.getAttribute('href');
    const targetUrl = href
      ? new URL(href, this.page.url()).toString()
      : null;

    if (targetUrl) {
      await this.page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
    } else {
      await this.l.firstDocTableLink.click();
      await this.page.waitForURL(/GRC_PICASso_DOC\/DOCDetail/, { timeout: 60_000 });
    }

    for (let attempt = 1; attempt <= 5; attempt++) {
      await this.waitForOSLoad().catch(() => undefined);

      const hasDocHeader = await this.l.docIdHeader.isVisible().catch(() => false);
      const hasCancelButton = await this.l.cancelDocButton.isVisible().catch(() => false);
      const hasDigitalOfferTab = await this.l.digitalOfferDetailsTab.isVisible().catch(() => false);

      if (hasDocHeader || hasCancelButton || hasDigitalOfferTab) {
        break;
      }

      const hasProcessingError = await this.page.getByText('There was an error processing your request.').isVisible().catch(() => false);
      const hasTimeoutAlert = await this.page.getByRole('alert').filter({ hasText: /The connection has timed out/i }).isVisible().catch(() => false);
      const reloadButtonVisible = await this.page.getByRole('button', { name: 'RELOAD' }).isVisible().catch(() => false);

      if (attempt < 5) {
        if (reloadButtonVisible) {
          await this.page.getByRole('button', { name: 'RELOAD' }).click();
          await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
        } else if (hasProcessingError || hasTimeoutAlert || targetUrl) {
          if (targetUrl) {
            await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => undefined);
          } else {
            await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => undefined);
          }
        }

        await this.page.waitForTimeout(2_000);
        continue;
      }

      await Promise.any([
        this.l.docIdHeader.waitFor({ state: 'visible', timeout: 20_000 }),
        this.l.cancelDocButton.waitFor({ state: 'visible', timeout: 20_000 }),
        this.l.digitalOfferDetailsTab.waitFor({ state: 'visible', timeout: 20_000 }),
      ]);
    }

    await this.l.cancelDocButton.waitFor({ state: 'visible', timeout: 60_000 });
  }

  // ==================== Core assertions ====================

  async expectDocStatus(status: string): Promise<void> {
    await this.l.docIdHeader.waitFor({ state: 'visible', timeout: 30_000 });
    await expect(this.l.docStatusBadge).toHaveText(status, { timeout: 30_000 });
  }

  async expectDocStage(stageName: string): Promise<void> {
    await expect(this.l.docStageLabel).toBeVisible({ timeout: 30_000 });
    await expect(this.l.docStageLabel).toContainText(stageName);
  }

  async expectInitiatorNameVisible(username: string): Promise<void> {
    const initiateContainer = this.l.initiateStageContainer;
    await expect(initiateContainer.getByText(username, { exact: true })).toBeVisible({ timeout: 30_000 });
  }

  async expectInitiationDateVisible(year: string): Promise<void> {
    const initiateContainer = this.l.initiateStageContainer;
    await expect(initiateContainer.getByText(new RegExp(year))).toBeVisible({ timeout: 30_000 });
  }

  async expectCancelOptionVisibleInScopeStage(): Promise<void> {
    await expect(this.l.cancelDocButton).toBeVisible({ timeout: 30_000 });
  }

  async expectCancelOptionNotVisibleInScopeStage(): Promise<void> {
    await expect(this.l.cancelDocButton).toBeHidden();
  }

  async expectDocIdFormat(): Promise<void> {
    await expect(this.l.docIdHeader).toBeVisible({ timeout: 30_000 });
    await expect(this.l.docIdHeader).toHaveText(/^DOC-\d+/);
  }

  async expectVestaIdInHeader(vestaId: string): Promise<void> {
    await expect(this.page.getByText(vestaId)).toBeVisible({ timeout: 30_000 });
  }

  async expectReleaseIsLink(): Promise<void> {
    await expect(this.l.releaseHeaderLink).toBeVisible({ timeout: 30_000 });
  }

  async expectReleaseIsPlainText(releaseValue: string): Promise<void> {
    await expect(this.l.releaseHeaderText).toContainText(releaseValue);
    await expect(this.l.releaseHeaderLink).toBeHidden();
  }

  async expectTargetReleaseDatePopulated(): Promise<void> {
    const cell = this.l.targetReleaseDateHeader;
    await expect(cell).not.toHaveText('');
    await expect(cell).toContainText(/\d/);
  }

  // ── Cancel DOC popup ────────────────────────────────────────────────────────

  async openCancelDocDialog(): Promise<void> {
    await this.l.cancelDocButton.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.cancelDocButton.click();
    await this.l.cancelDocPopup.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async expectCancelDocPopupVisible(): Promise<void> {
    await expect(this.l.cancelDocPopup).toBeVisible({ timeout: 30_000 });
  }

  async expectCancelDocCommentFieldVisible(): Promise<void> {
    await expect(this.l.cancelDocCommentInput).toBeVisible({ timeout: 30_000 });
  }

  async dismissCancelDocDialog(): Promise<void> {
    await this.l.cancelDocPopupDismiss.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.cancelDocPopupDismiss.click();
    await this.l.cancelDocPopup.waitFor({ state: 'hidden', timeout: 15_000 });
  }

  // ── Initiate DOC modal helpers ──────────────────────────────────────────────

  async openInitiateDocModal(): Promise<void> {
    await this.l.initiateDOCButton.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.initiateDOCButton.click();
    await this.l.initiateDocModal.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async expectInitiateDocModalVisible(): Promise<void> {
    await expect(this.l.initiateDocModal).toBeVisible({ timeout: 30_000 });
  }

  async expectInitiateDocModalClosed(): Promise<void> {
    await this.l.initiateDocModal.waitFor({ state: 'hidden', timeout: 15_000 });
  }

  async clickInitiateDocModalCancel(): Promise<void> {
    await this.l.modalCancelButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.modalCancelButton.click();
  }

  async submitInitiateDocModalEmpty(): Promise<void> {
    await this.l.modalInitiateButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.modalInitiateButton.click();
  }

  async expectInitiateDocModalValidationErrors(): Promise<void> {
    await expect(this.l.modalFieldRequiredError).toBeVisible({ timeout: 15_000 });
  }

  async hasRevokeDocButton(): Promise<boolean> {
    return this.l.revokeDocButton.isVisible().catch(() => false);
  }

  async expectRevokeDocButtonVisible(): Promise<void> {
    await expect(this.l.revokeDocButton).toBeVisible({ timeout: 15_000 });
  }

  // ── Breadcrumb ──────────────────────────────────────────────────────────────

  async expectBreadcrumbHomeLinkVisible(): Promise<void> {
    await expect(this.l.breadcrumbHomeLink).toBeVisible({ timeout: 30_000 });
  }

  async expectBreadcrumbProductLinkVisible(): Promise<void> {
    await expect(this.l.breadcrumbProductLink).toBeVisible({ timeout: 30_000 });
  }

  // ── Pipeline stages ─────────────────────────────────────────────────────────

  async expectAllPipelineStagesVisible(): Promise<void> {
    await expect(this.l.initiateStageContainer).toBeVisible({ timeout: 30_000 });
    await expect(this.l.docStageLabel).toBeVisible({ timeout: 30_000 });
    await expect(this.l.docPipelineTab3).toBeVisible({ timeout: 30_000 });
    await expect(this.l.docPipelineTab4).toBeVisible({ timeout: 30_000 });
    await expect(this.l.docPipelineTab5).toBeVisible({ timeout: 30_000 });
  }

  async isPipelineStageActive(stageName: string): Promise<boolean> {
    const stageTab = this.page.getByRole('tab', { name: stageName });
    const ariaSelected = await stageTab.getAttribute('aria-selected');
    return ariaSelected === 'true';
  }

  async expectPipelineStageActive(stageName: string): Promise<void> {
    const stageTab = this.page.getByRole('tab', { name: stageName });
    await expect(stageTab).toHaveAttribute('aria-selected', 'true', { timeout: 15_000 });
  }

  async clickHideShowFlowButton(): Promise<void> {
    await this.l.hideShowFlowButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.hideShowFlowButton.click();
    await this.waitForOSLoad();
  }

  async expectPipelineHidden(): Promise<void> {
    await expect(this.l.hideShowFlowButton).toContainText('Show Flow', { timeout: 15_000 });
  }

  async expectPipelineVisible(): Promise<void> {
    await expect(this.l.hideShowFlowButton).toContainText('Hide Flow', { timeout: 15_000 });
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private async selectCalendarDate(year: number, month: number, day: number): Promise<void> {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const monthName = monthNames[month - 1];

    await this.l.calendarMonthSelect.selectOption({ label: monthName });

    const yearInput = this.l.calendarYearSpinbutton;
    await yearInput.fill(year.toString());
    await yearInput.press('Enter');

    const dateLabel = `${monthName} ${day}, ${year}`;
    const dayCell = this.page.locator(`[aria-label="${dateLabel}"]`).first();
    await dayCell.waitFor({ state: 'visible', timeout: 10_000 });
    await dayCell.click();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Backward-compatible delegation — Digital Offer Details tab
  // ═══════════════════════════════════════════════════════════════════════════

  async clickDigitalOfferDetailsTab(): Promise<void> { return this.offer.clickDigitalOfferDetailsTab(); }
  async clickEditDetails(): Promise<void> { return this.offer.clickEditDetails(); }
  async fillOfferDocName(name: string): Promise<void> { return this.offer.fillOfferDocName(name); }
  async fillOfferDocReason(text: string): Promise<void> { return this.offer.fillOfferDocReason(text); }
  async selectOfferRelease(label: string): Promise<void> { return this.offer.selectOfferRelease(label); }
  async clickSaveChanges(): Promise<void> { return this.offer.clickSaveChanges(); }
  async clickCancelEdit(): Promise<void> { return this.offer.clickCancelEdit(); }
  async expectEditDetailsButtonVisible(): Promise<void> { return this.offer.expectEditDetailsButtonVisible(); }
  async expectSaveChangesButtonVisible(): Promise<void> { return this.offer.expectSaveChangesButtonVisible(); }
  async expectCancelEditButtonVisible(): Promise<void> { return this.offer.expectCancelEditButtonVisible(); }
  async expectDocNameInputEditable(): Promise<void> { return this.offer.expectDocNameInputEditable(); }
  async expectDocReasonCharCountVisible(): Promise<void> { return this.offer.expectDocReasonCharCountVisible(); }
  async expectReleaseVersionInputVisible(): Promise<void> { return this.offer.expectReleaseVersionInputVisible(); }
  async expectDigitalOfferDetailsTabClickable(): Promise<void> { return this.offer.expectDigitalOfferDetailsTabClickable(); }
  async expectDigitalOfferDetailsTabPanelVisible(): Promise<void> { return this.offer.expectDigitalOfferDetailsTabPanelVisible(); }
  async expectReleaseHeaderLabelAndValue(): Promise<void> { return this.offer.expectReleaseHeaderLabelAndValue(); }
  async getOfferReleaseOptions(): Promise<string[]> { return this.offer.getOfferReleaseOptions(); }
  async selectFirstNamedRelease(): Promise<string | null> { return this.offer.selectFirstNamedRelease(); }
  async expectTargetReleaseDateHasValue(): Promise<void> { return this.offer.expectTargetReleaseDateHasValue(); }
  async expectReleaseVersionInputHidden(): Promise<void> { return this.offer.expectReleaseVersionInputHidden(); }
  async navigateToLinkedProduct(): Promise<void> { return this.offer.navigateToLinkedProduct(); }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Backward-compatible delegation — Roles & Responsibilities tab
  // ═══════════════════════════════════════════════════════════════════════════

  async clickRolesResponsibilitiesTab(): Promise<void> { return this.roles.clickRolesResponsibilitiesTab(); }
  async expectRolesResponsibilitiesTabClickable(): Promise<void> { return this.roles.expectRolesResponsibilitiesTabClickable(); }
  async expectRolesGridVisible(): Promise<void> { return this.roles.expectRolesGridVisible(); }
  async expectRolesGridColumnHeaders(): Promise<void> { return this.roles.expectRolesGridColumnHeaders(); }
  async expectRolesRowPresent(roleName: string | RegExp): Promise<void> { return this.roles.expectRolesRowPresent(roleName); }
  async expectAllRoleRowsPresent(): Promise<void> { return this.roles.expectAllRoleRowsPresent(); }
  async expectEditRolesButtonVisible(): Promise<void> { return this.roles.expectEditRolesButtonVisible(); }
  async clickEditRoles(): Promise<void> { return this.roles.clickEditRoles(); }
  async expectSaveRolesChangesButtonDisabled(): Promise<void> { return this.roles.expectSaveRolesChangesButtonDisabled(); }
  async clickCancelRoles(): Promise<void> { return this.roles.clickCancelRoles(); }
  async expectEditModeUserLookupVisible(): Promise<void> { return this.roles.expectEditModeUserLookupVisible(); }
  async expectRolesGridColumnsVisible(): Promise<void> { return this.roles.expectRolesGridColumnsVisible(); }
  async isEditRolesButtonVisible(): Promise<boolean> { return this.roles.isEditRolesButtonVisible(); }
  async isSaveRolesChangesDisabled(): Promise<boolean> { return this.roles.isSaveRolesChangesDisabled(); }
  async expectSaveRolesChangesButtonVisible(): Promise<void> { return this.roles.expectSaveRolesChangesButtonVisible(); }
  async getRolesTeamMembersText(roleName: string): Promise<string> { return this.roles.getRolesTeamMembersText(roleName); }
  async clickSaveRoles(): Promise<void> { return this.roles.clickSaveRoles(); }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Backward-compatible delegation — ITS Checklist tab
  // ═══════════════════════════════════════════════════════════════════════════

  async clickITSChecklistTab(): Promise<void> { return this.its.clickITSChecklistTab(); }
  async expectITSChecklistTabClickable(): Promise<void> { return this.its.expectITSChecklistTabClickable(); }
  async expectITSSecurityControlsTitleVisible(): Promise<void> { return this.its.expectITSSecurityControlsTitleVisible(); }
  async expectITSGridColumnHeaders(): Promise<void> { return this.its.expectITSGridColumnHeaders(); }
  async hasITSControls(): Promise<boolean> { return this.its.hasITSControls(); }
  async expectITSFilterControlsVisible(): Promise<void> { return this.its.expectITSFilterControlsVisible(); }
  async hasControlsInAddControlPopup(): Promise<boolean> { return this.its.hasControlsInAddControlPopup(); }
  async searchITSControls(query: string): Promise<void> { return this.its.searchITSControls(query); }
  async hasITSNoResultsMessage(): Promise<boolean> { return this.its.hasITSNoResultsMessage(); }
  async getITSGridDataRowCount(): Promise<number> { return this.its.getITSGridDataRowCount(); }
  async clickITSReset(): Promise<void> { return this.its.clickITSReset(); }
  async expectITSSecurityControlsTitleLoaded(): Promise<void> { return this.its.expectITSSecurityControlsTitleLoaded(); }
  async expectITSGridVisible(): Promise<void> { return this.its.expectITSGridVisible(); }
  async expectITSGridColumnHeadersVisible(): Promise<void> { return this.its.expectITSGridColumnHeadersVisible(); }
  async expectITSNoResultsMessageVisible(): Promise<void> { return this.its.expectITSNoResultsMessageVisible(); }
  async clickITSGridColumnHeader(headerText: string | RegExp): Promise<void> { return this.its.clickITSGridColumnHeader(headerText); }
  async expectAddControlButtonVisible(): Promise<void> { return this.its.expectAddControlButtonVisible(); }
  async clickAddControl(): Promise<void> { return this.its.clickAddControl(); }
  async expectAddControlPopupVisible(): Promise<void> { return this.its.expectAddControlPopupVisible(); }
  async expectAddControlPopupElements(): Promise<void> { return this.its.expectAddControlPopupElements(); }
  async selectFirstControlInPopup(): Promise<void> { return this.its.selectFirstControlInPopup(); }
  async expectAddSelectedButtonEnabled(): Promise<void> { return this.its.expectAddSelectedButtonEnabled(); }
  async expectSelectedCountVisible(): Promise<void> { return this.its.expectSelectedCountVisible(); }
  async closeAddControlPopup(): Promise<void> { return this.its.closeAddControlPopup(); }
  async clickFirstControlDescopeButton(): Promise<void> { return this.its.clickFirstControlDescopeButton(); }
  async clickFirstControlIdLink(): Promise<void> { return this.its.clickFirstControlIdLink(); }
  async expectUnscopePopupVisible(): Promise<void> { return this.its.expectUnscopePopupVisible(); }
  async fillUnscopeJustification(text: string): Promise<void> { return this.its.fillUnscopeJustification(text); }
  async expectUnscopeDescoperButtonEnabled(): Promise<void> { return this.its.expectUnscopeDescoperButtonEnabled(); }
  async expectUnscopeDescoperButtonDisabled(): Promise<void> { return this.its.expectUnscopeDescoperButtonDisabled(); }
  async cancelUnscopePopup(): Promise<void> { return this.its.cancelUnscopePopup(); }
  async expectITSDefaultSortedByControlId(): Promise<void> { return this.its.expectITSDefaultSortedByControlId(); }
  async expectAddControlPopupNoResultsWithCountPreserved(): Promise<void> { return this.its.expectAddControlPopupNoResultsWithCountPreserved(); }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Backward-compatible delegation — Action Plan tab
  // ═══════════════════════════════════════════════════════════════════════════

  async clickActionPlanTab(): Promise<void> { return this.actions.clickActionPlanTab(); }
  async expectActionPlanTitleVisible(): Promise<void> { return this.actions.expectActionPlanTitleVisible(); }
  async expectActionPlanControlsVisible(): Promise<void> { return this.actions.expectActionPlanControlsVisible(); }
  async expectActionPlanGridColumnHeaders(): Promise<void> { return this.actions.expectActionPlanGridColumnHeaders(); }
  async hasActionPlanRows(): Promise<boolean> { return this.actions.hasActionPlanRows(); }
  async getActionPlanRowCount(): Promise<number> { return this.actions.getActionPlanRowCount(); }
  async getActionPlanRowText(rowIndex = 0): Promise<string> { return this.actions.getActionPlanRowText(rowIndex); }
  async expectFirstActionNameLinkVisible(): Promise<void> { return this.actions.expectFirstActionNameLinkVisible(); }
  async expectAnyFindingLinkVisible(): Promise<void> { return this.actions.expectAnyFindingLinkVisible(); }
  async searchActionPlan(query: string): Promise<void> { return this.actions.searchActionPlan(query); }
  async toggleActionPlanShowOpenOnly(enable: boolean): Promise<void> { return this.actions.toggleActionPlanShowOpenOnly(enable); }
  async resetActionPlanFilters(): Promise<void> { return this.actions.resetActionPlanFilters(); }
  async hasActionPlanNoResultsMessage(): Promise<boolean> { return this.actions.hasActionPlanNoResultsMessage(); }
  async isAddActionButtonVisible(): Promise<boolean> { return this.actions.isAddActionButtonVisible(); }
  async expectAddActionButtonVisible(): Promise<void> { return this.actions.expectAddActionButtonVisible(); }
  async clickAddActionButton(): Promise<void> { return this.actions.clickAddActionButton(); }
  async hasActionPlanNoActionsMessage(): Promise<boolean> { return this.actions.hasActionPlanNoActionsMessage(); }
  async expectActionPlanNoActionsMessageVisible(): Promise<void> { return this.actions.expectActionPlanNoActionsMessageVisible(); }
  async clickFirstActionNameLink(): Promise<void> { return this.actions.clickFirstActionNameLink(); }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Backward-compatible delegation — Risk Summary tab
  // ═══════════════════════════════════════════════════════════════════════════

  async clickRiskSummaryTab(): Promise<void> { return this.riskSummary.clickRiskSummaryTab(); }
  async expectRiskSummarySectionsVisible(): Promise<void> { return this.riskSummary.expectRiskSummarySectionsVisible(); }
  async expectRiskSummarySdlFcsrContentVisible(): Promise<void> { return this.riskSummary.expectRiskSummarySdlFcsrContentVisible(); }
  async expectRiskSummaryPrivacyContentVisible(): Promise<void> { return this.riskSummary.expectRiskSummaryPrivacyContentVisible(); }
  async expectRiskSummaryItsControlSummaryVisible(): Promise<void> { return this.riskSummary.expectRiskSummaryItsControlSummaryVisible(); }
  async hasRiskSummaryNoResultsMessage(): Promise<boolean> { return this.riskSummary.hasRiskSummaryNoResultsMessage(); }
  async getRiskSummaryPanelText(): Promise<string> { return this.riskSummary.getRiskSummaryPanelText(); }
  async hasRiskSummaryControlsGrid(): Promise<boolean> { return this.riskSummary.hasRiskSummaryControlsGrid(); }
  async expectRiskSummaryControlsGridColumnHeaders(): Promise<void> { return this.riskSummary.expectRiskSummaryControlsGridColumnHeaders(); }
  async getRiskSummaryControlsRowCount(): Promise<number> { return this.riskSummary.getRiskSummaryControlsRowCount(); }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Backward-compatible delegation — View History dialog
  // ═══════════════════════════════════════════════════════════════════════════

  async clickViewHistory(): Promise<void> { return this.history.clickViewHistory(); }
  async expectHistoryDialogVisible(): Promise<void> { return this.history.expectHistoryDialogVisible(); }
  async expectHistoryGridVisible(): Promise<void> { return this.history.expectHistoryGridVisible(); }
  async expectHistoryGridHasRows(): Promise<void> { return this.history.expectHistoryGridHasRows(); }
  async expectHistoryGridColumnHeaders(): Promise<void> { return this.history.expectHistoryGridColumnHeaders(); }
  async expectHistoryFiltersVisible(): Promise<void> { return this.history.expectHistoryFiltersVisible(); }
  async expectHistoryDateRangeInputsVisible(): Promise<void> { return this.history.expectHistoryDateRangeInputsVisible(); }
  async getHistoryRowCount(): Promise<number> { return this.history.getHistoryRowCount(); }
  async getHistoryDateTexts(limit = 5): Promise<string[]> { return this.history.getHistoryDateTexts(limit); }
  async clickHistorySearchButton(): Promise<void> { return this.history.clickHistorySearchButton(); }
  async selectHistoryActivityFilter(activityLabel: string): Promise<void> { return this.history.selectHistoryActivityFilter(activityLabel); }
  async clickHistoryResetFilters(): Promise<void> { return this.history.clickHistoryResetFilters(); }
  async getHistorySearchInputValue(): Promise<string> { return this.history.getHistorySearchInputValue(); }
  async getSelectedHistoryActivityFilterLabel(): Promise<string> { return this.history.getSelectedHistoryActivityFilterLabel(); }
  async closeHistoryDialog(): Promise<void> { return this.history.closeHistoryDialog(); }
  async fillHistorySearchInput(text: string): Promise<void> { return this.history.fillHistorySearchInput(text); }
  async selectHistoryDateRange(fromDate: Date, toDate: Date): Promise<void> { return this.history.selectHistoryDateRange(fromDate, toDate); }
  async getHistoryActivityFilterOptionCount(): Promise<number> { return this.history.getHistoryActivityFilterOptionCount(); }
  async getHistoryActivityFilterOptions(): Promise<string[]> { return this.history.getHistoryActivityFilterOptions(); }
  async getHistoryTotalRecordCount(): Promise<number> { return this.history.getHistoryTotalRecordCount(); }
  async changeHistoryPerPage(value: '10' | '20' | '30' | '50' | '100'): Promise<void> { return this.history.changeHistoryPerPage(value); }
  async getCurrentHistoryPageNumber(): Promise<number> { return this.history.getCurrentHistoryPageNumber(); }
  async goToHistoryPage(pageNumber: number): Promise<void> { return this.history.goToHistoryPage(pageNumber); }
  async expectHistoryNoDataMessageVisible(): Promise<void> { return this.history.expectHistoryNoDataMessageVisible(); }
  async getHistoryFirstRowDateText(): Promise<string> { return this.history.getHistoryFirstRowDateText(); }

  // ═══════════════════════════════════════════════════════════════════════════
  //  Backward-compatible delegation — Certification Decision tab
  // ═══════════════════════════════════════════════════════════════════════════

  async clickCertificationDecisionTab(): Promise<void> { return this.certification.clickCertificationDecisionTab(); }
  async hasProposeDecisionButton(): Promise<boolean> { return this.certification.hasProposeDecisionButton(); }
  async hasCertDecisionWarning(): Promise<boolean> { return this.certification.hasCertDecisionWarning(); }
  async expectProposeOrEditDecisionButtonVisible(): Promise<void> { return this.certification.expectProposeOrEditDecisionButtonVisible(); }
  async expectSubmitForApprovalButtonVisible(): Promise<void> { return this.certification.expectSubmitForApprovalButtonVisible(); }
  async expectCertRiskSummaryCardsVisible(): Promise<void> { return this.certification.expectCertRiskSummaryCardsVisible(); }
  async expectUnresolvedFindingsSectionVisible(): Promise<void> { return this.certification.expectUnresolvedFindingsSectionVisible(); }
  async hasUnresolvedFindingsGrid(): Promise<boolean> { return this.certification.hasUnresolvedFindingsGrid(); }
  async expectDocApprovalsSectionVisible(): Promise<void> { return this.certification.expectDocApprovalsSectionVisible(); }
  async hasDocApprovalsSection(): Promise<boolean> { return this.certification.hasDocApprovalsSection(); }
  async expectDocSignaturesTableVisible(): Promise<void> { return this.certification.expectDocSignaturesTableVisible(); }
  async hasProvideSignatureButton(): Promise<boolean> { return this.certification.hasProvideSignatureButton(); }
  async expectUnresolvedFindingsControlIdClickable(): Promise<void> { return this.certification.expectUnresolvedFindingsControlIdClickable(); }
  async hasClosedActionsLink(): Promise<boolean> { return this.certification.hasClosedActionsLink(); }
  async expectClosedActionsLinkVisible(): Promise<void> { return this.certification.expectClosedActionsLinkVisible(); }
  async expectDocIdHeaderVisible(): Promise<void> { return this.certification.expectDocIdHeaderVisible(); }
  async expectVestaIdHeaderVisible(): Promise<void> { return this.certification.expectVestaIdHeaderVisible(); }
  async expectMonitorActionClosureStageVisible(): Promise<void> { return this.certification.expectMonitorActionClosureStageVisible(); }
  async expectUnresolvedFindingsEmptyState(): Promise<void> { return this.certification.expectUnresolvedFindingsEmptyState(); }
  async expectCertEditDecisionButtonVisible(): Promise<void> { return this.certification.expectCertEditDecisionButtonVisible(); }
  async getApproverDataRowCount(): Promise<number> { return this.certification.getApproverDataRowCount(); }
  async expectMonitorActionClosureStageHidden(): Promise<void> { return this.certification.expectMonitorActionClosureStageHidden(); }
  async clickSubmitForApprovalAndExpectPopup(): Promise<boolean> { return this.certification.clickSubmitForApprovalAndExpectPopup(); }
  async expectSubmitForApprovalPopupVisible(): Promise<void> { return this.certification.expectSubmitForApprovalPopupVisible(); }
  async dismissSubmitForApprovalPopup(): Promise<void> { return this.certification.dismissSubmitForApprovalPopup(); }
  async expectProvideSignatureButtonVisible(): Promise<void> { return this.certification.expectProvideSignatureButtonVisible(); }
  async openProposeDecisionPopup(): Promise<boolean> { return this.certification.openProposeDecisionPopup(); }
  async expectProposeDecisionPopupBaseFieldsVisible(): Promise<void> { return this.certification.expectProposeDecisionPopupBaseFieldsVisible(); }
  async getProposedDecisionOptions(): Promise<string[]> { return this.certification.getProposedDecisionOptions(); }
  async selectProposedDecisionOption(optionLabel: string): Promise<void> { return this.certification.selectProposedDecisionOption(optionLabel); }
  async hasValidityEndDateField(): Promise<boolean> { return this.certification.hasValidityEndDateField(); }
  async hasActionsClosureDueDateField(): Promise<boolean> { return this.certification.hasActionsClosureDueDateField(); }
  async closeProposeDecisionPopup(): Promise<void> { return this.certification.closeProposeDecisionPopup(); }
}
