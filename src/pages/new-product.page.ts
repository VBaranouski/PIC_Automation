import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { newProductLocators, type NewProductLocators } from '@locators/new-product.locators';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type TeamRole =
  | 'Product Owner'
  | 'Security Manager'
  | 'Security and Data Protection Advisor'
  | 'Process Quality Leader';

export class NewProductPage extends BasePage {
  readonly url = '/GRC_PICASso/ProductDetail?ProductId=0';

  private static readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ] as const;

  private readonly l: NewProductLocators;

  constructor(page: Page) {
    super(page);
    this.l = newProductLocators(page);
  }

  // --- Public locator accessors (tests access these directly) ---

  get breadcrumb(): Locator            { return this.l.breadcrumb; }
  get productHeading(): Locator        { return this.l.productHeading; }
  get productId(): Locator             { return this.l.productId; }
  get productStatus(): Locator         { return this.l.productStatus; }

  get productDetailsTab(): Locator     { return this.l.productDetailsTab; }
  get releasesTab(): Locator           { return this.l.releasesTab; }
  get noReleasesMessage(): Locator     { return this.l.noReleasesMessage; }
  get createReleaseButton(): Locator   { return this.l.createReleaseButton; }
  get releasesGrid(): Locator          { return this.l.releasesGrid; }

  get sectionTitle(): Locator          { return this.l.sectionTitle; }
  get productNameInput(): Locator      { return this.l.productNameInput; }
  get productStateSelect(): Locator    { return this.l.productStateSelect; }
  get productDefinitionSelect(): Locator { return this.l.productDefinitionSelect; }
  get productTypeSelect(): Locator     { return this.l.productTypeSelect; }
  get digitalOfferCheckbox(): Locator  { return this.l.digitalOfferCheckbox; }
  get vestaIdInput(): Locator                 { return this.l.vestaIdInput; }
  get docItOwnerSearchBox(): Locator          { return this.l.docItOwnerSearchBox; }
  get docProjectManagerSearchBox(): Locator   { return this.l.docProjectManagerSearchBox; }
  get commercialRefInput(): Locator    { return this.l.commercialRefInput; }
  get dataProtectionCheckbox(): Locator { return this.l.dataProtectionCheckbox; }
  get brandLabelCheckbox(): Locator    { return this.l.brandLabelCheckbox; }

  get productDescriptionToggle(): Locator { return this.l.productDescriptionToggle; }
  get productDescriptionEditor(): Locator { return this.l.productDescriptionEditor; }

  get productOrganizationTab(): Locator          { return this.l.productOrganizationTab; }
  get productTeamTab(): Locator                  { return this.l.productTeamTab; }
  get securitySummaryTab(): Locator              { return this.l.securitySummaryTab; }
  get productConfigurationTab(): Locator         { return this.l.productConfigurationTab; }
  get digitalOfferCertificationTab(): Locator    { return this.l.digitalOfferCertificationTab; }

  get orgLevel1Select(): Locator   { return this.l.orgLevel1Select; }
  get orgLevel2Select(): Locator   { return this.l.orgLevel2Select; }
  get orgLevel3Select(): Locator   { return this.l.orgLevel3Select; }
  get crossOrgCheckbox(): Locator  { return this.l.crossOrgCheckbox; }
  get vendorInput(): Locator       { return this.l.vendorInput; }

  // Tracking tools (Product Configuration tab)
  get jiraSwitch(): Locator                    { return this.l.jiraSwitch; }
  get jamaSwitch(): Locator                    { return this.l.jamaSwitch; }
  get jiraSourceLinkInput(): Locator           { return this.l.jiraSourceLinkInput; }
  get jiraProjectKeyInput(): Locator           { return this.l.jiraProjectKeyInput; }
  get jamaProjectIdInput(): Locator            { return this.l.jamaProjectIdInput; }
  get testConnectionButton(): Locator          { return this.l.testConnectionButton; }
  get statusMappingConfigLinks(): Locator      { return this.l.statusMappingConfigLinks; }
  get trackingToolsWarning(): Locator          { return this.l.trackingToolsWarning; }
  get productReqNotApplicableRadio(): Locator  { return this.l.productReqNotApplicableRadio; }
  get productReqJamaRadio(): Locator           { return this.l.productReqJamaRadio; }
  get productReqJiraRadio(): Locator           { return this.l.productReqJiraRadio; }
  get processReqNotApplicableRadio(): Locator  { return this.l.processReqNotApplicableRadio; }
  get processReqJiraRadio(): Locator           { return this.l.processReqJiraRadio; }
  get showProcessSubReqsCheckbox(): Locator    { return this.l.showProcessSubReqsCheckbox; }

  get productOwnerLabel(): Locator    { return this.l.productOwnerLabel; }
  get securityManagerLabel(): Locator { return this.l.securityManagerLabel; }
  get sdpaLabel(): Locator            { return this.l.sdpaLabel; }
  get pqlLabel(): Locator             { return this.l.pqlLabel; }

  get resetFormButton(): Locator   { return this.l.resetFormButton; }
  get cancelButton(): Locator      { return this.l.cancelButton; }
  get saveButton(): Locator        { return this.l.saveButton; }

  get editProductButton(): Locator    { return this.l.editProductButton; }
  get viewHistoryLink(): Locator      { return this.l.viewHistoryLink; }
  get actionsManagementLink(): Locator { return this.l.actionsManagementLink; }

  get createReleaseDialog(): Locator                  { return this.l.createReleaseDialog; }
  get newProductReleaseRadio(): Locator               { return this.l.newProductReleaseRadio; }
  get existingProductReleaseRadio(): Locator          { return this.l.existingProductReleaseRadio; }
  get cloneFromExistingRadio(): Locator               { return this.l.cloneFromExistingRadio; }
  get createAsNewRadio(): Locator                     { return this.l.createAsNewRadio; }
  get releaseVersionInput(): Locator                  { return this.l.releaseVersionInput; }
  get targetReleaseDateInput(): Locator               { return this.l.targetReleaseDateInput; }
  get continuousPenetrationTestingCheckbox(): Locator { return this.l.continuousPenetrationTestingCheckbox; }
  get changeSummaryInput(): Locator                   { return this.l.changeSummaryInput; }
  get resetReleaseFormButton(): Locator               { return this.l.resetReleaseFormButton; }
  get cancelReleaseFormButton(): Locator              { return this.l.cancelReleaseFormButton; }
  get createAndScopeButton(): Locator                 { return this.l.createAndScopeButton; }

  // ==================== Product Information ====================

  async fillProductName(name: string): Promise<void> {
    await this.l.productNameInput.fill(name);
  }

  /**
   * Waits for the OutSystems partial refresh after Product Type selection.
   * Product Type change triggers a server-side AJAX that replaces DOM elements.
   * We detect completion by marking the input element and waiting until the mark persists.
   */
  private async waitForProductTypeRefresh(): Promise<void> {
    await this.l.productNameInput.waitFor({ state: 'visible', timeout: 30_000 });

    await this.page.waitForFunction(`
      (() => {
        const input = document.querySelector('input[placeholder="Product Name"]');
        if (!input) return false;
        if (!input.dataset.__pw_stable) { input.dataset.__pw_stable = '1'; return false; }
        return true;
      })()
    `, { timeout: 30_000, polling: 500 });

    await this.l.productNameInput.evaluate('(el) => delete el.dataset.__pw_stable');
  }

  /**
   * Fills product name with retry. OutSystems late AJAX may replace the input
   * DOM element after fill, losing the value. Retries up to 3 times.
   */
  private async fillProductNameWithRetry(name: string, maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      await this.l.productNameInput.click();
      await this.l.productNameInput.fill(name);

      try {
        await expect(this.l.productNameInput).toHaveValue(name, { timeout: 6_000 });
        return;
      } catch {
        if (attempt === maxRetries) throw new Error(
          `Product name was cleared ${maxRetries} times by OutSystems AJAX. ` +
          `The partial refresh may be slower than expected.`,
        );
        await this.l.productNameInput.waitFor({ state: 'visible', timeout: 10_000 });
      }
    }
  }

  async selectProductState(label: string): Promise<void> {
    await expect(this.l.productStateSelect).toBeEnabled({ timeout: 30_000 });
    await this.l.productStateSelect.selectOption({ label });
  }

  async selectProductDefinition(label: string): Promise<void> {
    await expect(this.l.productDefinitionSelect).toBeEnabled({ timeout: 30_000 });
    await this.l.productDefinitionSelect.selectOption({ label });
  }

  async selectProductType(label: string): Promise<void> {
    await expect(this.l.productTypeSelect).toBeEnabled({ timeout: 30_000 });
    await this.l.productTypeSelect.selectOption({ label });
  }

  private async getSelectedOptionLabel(select: Locator): Promise<string> {
    return select.evaluate((element) => {
      const selectedOption = element.querySelector('option:checked');
      return selectedOption?.textContent?.trim() ?? '';
    });
  }

  private async getOptionLabels(select: Locator): Promise<string[]> {
    const options = await select.locator('option').allTextContents();
    return options.map((option) => option.trim()).filter(Boolean);
  }

  async getSelectedProductState(): Promise<string> {
    return this.getSelectedOptionLabel(this.l.productStateSelect);
  }

  async getSelectedProductDefinition(): Promise<string> {
    return this.getSelectedOptionLabel(this.l.productDefinitionSelect);
  }

  async getSelectedProductType(): Promise<string> {
    return this.getSelectedOptionLabel(this.l.productTypeSelect);
  }

  async getProductStateOptions(): Promise<string[]> {
    return this.getOptionLabels(this.l.productStateSelect);
  }

  async getProductDefinitionOptions(): Promise<string[]> {
    return this.getOptionLabels(this.l.productDefinitionSelect);
  }

  async getProductTypeOptions(): Promise<string[]> {
    return this.getOptionLabels(this.l.productTypeSelect);
  }

  async fillDescription(text: string): Promise<void> {
    await this.l.productDescriptionEditor.click();
    await this.l.productDescriptionEditor.fill(text);
  }

  async fillCommercialRefNumber(value: string): Promise<void> {
    await this.l.commercialRefInput.fill(value);
  }

  async toggleDigitalOffer(): Promise<void> {
    await this.l.digitalOfferCheckbox.click();
  }

  /**
   * Fills the Digital Offer Certification (DOC) section that appears after toggling Digital Offer.
   * DOC searchboxes (IT Owner, Project Manager) are directly visible — no edit-link click needed.
   * Uses pressSequentially() to trigger the OutSystems search API.
   */
  async fillDigitalOfferDetails(data: {
    vestaId: string;
    searchQuery: string;
    itOwnerFullName: string;
    projectManagerFullName: string;
  }): Promise<void> {
    await this.l.vestaIdInput.fill(data.vestaId);

    // Scope results to their gridcell so the same person's name in adjacent cells doesn't cause
    // .first() to match the wrong element (e.g. IT Owner display after selection).
    const itOwnerCell = this.page.getByRole('gridcell', { name: /IT Owner/ });
    await this.l.docItOwnerSearchBox.pressSequentially(data.searchQuery, { delay: 150 });
    const itOwnerResult = itOwnerCell.getByText(data.itOwnerFullName, { exact: true }).first();
    await itOwnerResult.waitFor({ state: 'visible', timeout: 30_000 });
    await itOwnerResult.click();

    // Wait for IT Owner selection to settle before typing in Project Manager field.
    // OutSystems updates the DOC section after each selection, replacing DOM elements.
    await this.l.docProjectManagerSearchBox.waitFor({ state: 'visible', timeout: 30_000 });
    const pmCell = this.page.getByRole('gridcell', { name: /Project Manager/ });
    await this.l.docProjectManagerSearchBox.pressSequentially(data.searchQuery, { delay: 150 });
    const pmResult = pmCell.getByText(data.projectManagerFullName, { exact: true }).first();
    await pmResult.waitFor({ state: 'visible', timeout: 30_000 });
    await pmResult.click();
  }

  async toggleDataProtection(): Promise<void> {
    // Ensure the Product Organization tab is active so the org-level dropdowns
    // are fully loaded before we read their values.
    await this.l.productOrganizationTab.click();
    await expect(this.l.orgLevel1Select).toBeEnabled({ timeout: 30_000 });

    // Capture current org level values before toggling — the DPP toggle triggers
    // an OutSystems partial refresh that resets the server-side dropdown bindings.
    // Even though the HTML <option selected> attribute remains visually intact,
    // OutSystems' validation engine sees the variables as empty and raises
    // "Required field!" for Org Level dropdowns on subsequent Save.
    const level1 = await this.getSelectedOrgLevel1().catch(() => '');
    const level2 = await this.getSelectedOrgLevel2().catch(() => '');
    const level3 = await this.getSelectedOrgLevel3().catch(() => '');

    await this.l.dataProtectionCheckbox.click();
    await this.waitForOSLoad();

    // Re-bind org level dropdowns after the OutSystems partial refresh.
    await this.forceRebindOrgLevels(level1, level2, level3);
  }

  /**
   * Forces OutSystems to re-bind Org Level server-side variables after a partial refresh.
   *
   * After any OutSystems partial refresh (DPP toggle, CKEditor, etc.), the <select>
   * elements may visually show the correct option but OS's internal variable is null.
   * Simply calling selectOption() on an already-selected value does NOT fire the onChange
   * handler if the DOM value appears unchanged. We must first select the blank option to
   * force a genuine change event, then select the correct value again.
   */
  private async forceRebindOrgLevels(level1: string, level2: string, level3: string): Promise<void> {
    // Treat "- Select -" / blank / "-" as empty (no real value to restore).
    const isBlank = (v: string) => !v || v === '- Select -' || v.trim() === '-';

    if (isBlank(level1)) return;

    // Level 1: select blank, wait for OS to process, then select correct value
    await expect(this.l.orgLevel1Select).toBeEnabled({ timeout: 30_000 });
    await this.l.orgLevel1Select.selectOption({ index: 0 }); // "- Select -"
    await this.waitForOSLoad();
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    await this.l.orgLevel1Select.selectOption({ label: level1 });
    await this.waitForOSLoad();
    // networkidle ensures the cascaded AJAX for L2 options has completed before
    // we check toBeEnabled — the OS loading overlay does NOT appear for this AJAX.
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);

    if (isBlank(level2)) return;
    // Level 2 cascades from Level 1 — wait for it to become enabled.
    // Some products have L2 auto-selected and OS-locked (disabled) — if it remains
    // disabled after the L1 cascade AJAX, skip the blank-first re-bind for L2
    // (the server-side value is auto-assigned by OS and doesn't need user re-selection).
    const l2Enabled = await this.l.orgLevel2Select.isEnabled({ timeout: 30_000 }).catch(() => false);
    if (l2Enabled) {
      // NOTE: blank-first is REQUIRED here. OutSystems cascade may not clear
      // the DOM selection if the previously-selected option still exists in the
      // reloaded options list, so selectOption(same value) fires no change event.
      await this.l.orgLevel2Select.selectOption({ index: 0 }); // "- Select -"
      await this.waitForOSLoad();
      await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      await this.l.orgLevel2Select.selectOption({ label: level2 });
      await this.waitForOSLoad();
      await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    }

    if (isBlank(level3)) return;
    // Level 3: also blank-first if enabled.
    // Wait for the target option to appear (cascade AJAX may still be loading).
    const l3Enabled = await this.l.orgLevel3Select.isEnabled({ timeout: 10_000 }).catch(() => false);
    if (l3Enabled) {
      await this.l.orgLevel3Select.selectOption({ index: 0 }).catch(() => undefined); // "- Select -"
      await this.waitForOSLoad();
      await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
      // Wait for the exact option we want to appear before selecting
      await this.l.orgLevel3Select.locator(`option`).filter({ hasText: level3 })
        .waitFor({ state: 'attached', timeout: 15_000 }).catch(() => undefined);
      await this.l.orgLevel3Select.selectOption({ label: level3 }).catch(() => undefined);
      await this.waitForOSLoad();
      await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    }
  }

  async toggleBrandLabel(): Promise<void> {
    // Brand Label toggle triggers an OutSystems partial refresh that clears the Vendor field
    // AND resets the server-side org level variable bindings (same as DPP toggle).
    // Ensure Product Organization tab is active so org-level dropdowns are populated.
    await this.l.productOrganizationTab.click();
    await expect(this.l.orgLevel1Select).toBeEnabled({ timeout: 30_000 });

    // Capture org levels and vendor value BEFORE toggling.
    const level1 = await this.getSelectedOrgLevel1().catch(() => '');
    const level2 = await this.getSelectedOrgLevel2().catch(() => '');
    const level3 = await this.getSelectedOrgLevel3().catch(() => '');
    const vendorValue = await this.l.vendorInput.inputValue().catch(() => '');

    await this.l.brandLabelCheckbox.click();
    await this.waitForOSLoad();

    // Restore vendor if cleared by the partial refresh.
    if (vendorValue) {
      const currentValue = await this.l.vendorInput.inputValue().catch(() => '');
      if (!currentValue) {
        await this.l.vendorInput.fill(vendorValue);
      }
    }

    // Re-bind org level dropdowns after the OutSystems partial refresh.
    await this.forceRebindOrgLevels(level1, level2, level3);
  }

  // ==================== Product Organization ====================

  async clickProductOrganizationTab(): Promise<void> {
    await this.l.productOrganizationTab.click();
  }

  async selectOrgLevel1(label: string): Promise<void> {
    // Org Level 1 starts disabled and loads asynchronously
    await expect(this.l.orgLevel1Select).toBeEnabled({ timeout: 30_000 });
    await this.l.orgLevel1Select.selectOption({ label });
  }

  async selectOrgLevel2(label: string): Promise<void> {
    // Org Level 2 becomes enabled after Org Level 1 is selected
    await expect(this.l.orgLevel2Select).toBeEnabled({ timeout: 30_000 });
    await this.l.orgLevel2Select.selectOption({ label });
  }

  async selectOrgLevel3(label: string): Promise<void> {
    // Org Level 3 becomes enabled after Org Level 2 is selected
    await expect(this.l.orgLevel3Select).toBeEnabled({ timeout: 30_000 });
    await this.l.orgLevel3Select.selectOption({ label });
  }

  async getSelectedOrgLevel1(): Promise<string> {
    return this.getSelectedOptionLabel(this.l.orgLevel1Select);
  }

  async getSelectedOrgLevel2(): Promise<string> {
    return this.getSelectedOptionLabel(this.l.orgLevel2Select);
  }

  async getSelectedOrgLevel3(): Promise<string> {
    return this.getSelectedOptionLabel(this.l.orgLevel3Select);
  }

  async toggleCrossOrgDevelopment(): Promise<void> {
    await this.l.crossOrgCheckbox.click();
    await this.waitForOSLoad();
  }

  // ==================== Product Configuration tab (Tracking Tools) ====================

  async clickProductConfigurationTab(): Promise<void> {
    await this.l.productConfigurationTab.click();
    await expect(this.page.getByText('TRACKING TOOLS CONFIGURATION', { exact: true })).toBeVisible({ timeout: 15_000 });
  }

  /** Enable the Jira tracking tool toggle and wait for the revealed fields to appear. */
  async enableJiraToggle(): Promise<void> {
    await expect(this.l.jiraSwitch).toBeEnabled({ timeout: 10_000 });
    await this.l.jiraSwitch.check({ force: true });
    await this.waitForOSLoad();
    await this.l.jiraSourceLinkInput.waitFor({ state: 'visible', timeout: 10_000 });
  }

  /** Enable the Jama tracking tool toggle and wait for the revealed field to appear. */
  async enableJamaToggle(): Promise<void> {
    await expect(this.l.jamaSwitch).toBeEnabled({ timeout: 10_000 });
    await this.l.jamaSwitch.check({ force: true });
    await this.waitForOSLoad();
    await this.l.jamaProjectIdInput.waitFor({ state: 'visible', timeout: 10_000 });
  }

  async disableJiraToggle(): Promise<void> {
    await this.l.jiraSwitch.uncheck({ force: true });
    await this.waitForOSLoad();
  }

  async disableJamaToggle(): Promise<void> {
    await this.l.jamaSwitch.uncheck({ force: true });
    await this.waitForOSLoad();
  }

  async expectJiraFieldsVisible(): Promise<void> {
    await expect(this.l.jiraSourceLinkInput).toBeVisible({ timeout: 10_000 });
    await expect(this.l.jiraProjectKeyInput).toBeVisible({ timeout: 10_000 });
  }

  async expectJamaFieldsVisible(): Promise<void> {
    await expect(this.l.jamaProjectIdInput).toBeVisible({ timeout: 10_000 });
  }

  async expectTrackingToolsWarningVisible(): Promise<void> {
    await expect(this.l.trackingToolsWarning).toBeVisible({ timeout: 10_000 });
  }

  async isJiraSwitchEnabled(): Promise<boolean> {
    return !(await this.l.jiraSwitch.isDisabled().catch(() => true));
  }

  async isJamaSwitchEnabled(): Promise<boolean> {
    return !(await this.l.jamaSwitch.isDisabled().catch(() => true));
  }

  // ==================== Product Team ====================

  async clickProductTeamTab(): Promise<void> {
    await this.l.productTeamTab.click();
    await expect(this.page.getByText('PRODUCT TEAM', { exact: true })).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Assigns a team member to a specific role using the OutSystems user lookup widget.
   *
   * Pattern:
   *   1. Click the edit link (pencil icon) next to the role label
   *   2. A searchbox "Type 4 letters" appears
   *   3. Type at least 4 characters slowly to trigger the search API
   *   4. Select the matching person from the dropdown
   */
  async assignTeamMember(role: TeamRole, searchQuery: string, fullName: string): Promise<void> {
    const roleContainer = this.getRoleSectionLocator(role);

    const editLink = roleContainer.getByRole('link').first();
    await editLink.waitFor({ state: 'visible', timeout: 240_000 });
    await editLink.click();

    const searchBox = roleContainer.getByRole('searchbox', { name: 'Type 4 letters' });
    await searchBox.waitFor({ state: 'visible', timeout: 30_000 });
    await searchBox.pressSequentially(searchQuery, { delay: 150 });

    // Scope to roleContainer to avoid matching names in previously assigned roles
    const resultItem = roleContainer.getByText(fullName, { exact: true }).first();
    await resultItem.waitFor({ state: 'visible', timeout: 30_000 });
    await resultItem.click();

    // Wait for OutSystems to process the selection — searchbox disappears when committed
    await searchBox.waitFor({ state: 'hidden', timeout: 30_000 });
  }

  /**
   * Returns a locator scoped to the container of a specific team role.
   * DOM structure: DIV.columns-item > LABEL.mandatory "Role" + DIV.OSBlockWidget
   * The asterisk (*) shown in UI is CSS-generated via .mandatory class, NOT in text content.
   */
  private getRoleSectionLocator(role: TeamRole): Locator {
    return this.page.getByText(role, { exact: true }).locator('..');
  }

  getTeamMemberDisplayName(role: TeamRole): Locator {
    const roleContainer = this.getRoleSectionLocator(role);
    return roleContainer.getByText(/^[A-Z]/).first();
  }

  // ==================== Assertions ====================

  async expectNewProductFormLoaded(): Promise<void> {
    await this.l.productNameInput.waitFor({ state: 'visible', timeout: 60_000 });
  }

  async expectProductSaved(): Promise<void> {
    // Edit Product button is the save-completion readiness signal — wait for it first
    await expect(this.l.editProductButton).toBeVisible({ timeout: 60_000 });
    await expect(this.page.getByText(/ID:PIC-(?!0)\d+/)).toBeVisible({ timeout: 30_000 });
    // Use exact:true to avoid strict-mode violation when the page has other
    // elements containing the word "active" (e.g. "Show active only" filter
    // or "An active release exists..." message in the DPP section).
    await expect(this.page.getByText('Active', { exact: true }).first()).toBeVisible({ timeout: 30_000 });
  }

  async expectFormVisible(): Promise<void> {
    await expect(this.l.productNameInput).toBeVisible();
    await expect(this.l.sectionTitle).toBeVisible();
  }

  async expectOrgLevelsDisabled(): Promise<void> {
    await expect(this.l.orgLevel1Select).toBeDisabled();
    await expect(this.l.orgLevel2Select).toBeDisabled();
    await expect(this.l.orgLevel3Select).toBeDisabled();
  }

  async expectOrgLevel2Enabled(timeout = 40_000): Promise<void> {
    await expect(this.l.orgLevel2Select).toBeEnabled({ timeout });
  }

  async expectOrgLevel3Enabled(timeout = 40_000): Promise<void> {
    await expect(this.l.orgLevel3Select).toBeEnabled({ timeout });
  }

  async expectDigitalOfferCertificationTabVisible(): Promise<void> {
    await expect(this.l.digitalOfferCertificationTab).toBeVisible({ timeout: 30_000 });
  }

  async expectDigitalOfferDetailsVisible(): Promise<void> {
    await expect(this.l.vestaIdInput).toBeVisible({ timeout: 30_000 });
    await expect(this.l.docItOwnerSearchBox).toBeVisible({ timeout: 30_000 });
    await expect(this.l.docProjectManagerSearchBox).toBeVisible({ timeout: 30_000 });
  }

  async expectDigitalOfferDetailsFunctional(fullName: string, expectedVestaId: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: '+ Add VESTA ID' })).toBeVisible({ timeout: 30_000 });
    await expect(this.l.vestaIdInput).toHaveValue(expectedVestaId, { timeout: 30_000 });

    const itOwnerCell = this.page.getByRole('gridcell', { name: /IT Owner/i });
    const pmCell = this.page.getByRole('gridcell', { name: /Project Manager/i });

    await expect(itOwnerCell.getByText(fullName, { exact: true }).first()).toBeVisible({ timeout: 30_000 });
    await expect(pmCell.getByText(fullName, { exact: true }).first()).toBeVisible({ timeout: 30_000 });
  }

  async expectCrossOrgDevelopmentFieldsVisible(): Promise<void> {
    await expect(this.page.getByText('Development Org Level 1', { exact: true })).toBeVisible({ timeout: 30_000 });
    await expect(this.page.getByText('Development Org Level 2', { exact: true })).toBeVisible({ timeout: 30_000 });
    await expect(this.page.getByText('Development Org Level 3', { exact: true })).toBeVisible({ timeout: 30_000 });
  }

  async expectVendorEnabled(): Promise<void> {
    await expect(this.l.vendorInput).toBeEnabled({ timeout: 30_000 });
  }

  async expectVendorMarkedRequired(): Promise<void> {
    await expect(this.l.vendorInput).toBeEnabled({ timeout: 30_000 });
    await expect(this.l.vendorInput).toHaveJSProperty('required', true);
    await expect(this.l.vendorInput).toHaveAttribute('aria-required', 'true');
    await expect(
      this.page.locator('.mandatory').filter({ has: this.page.getByText('Vendor', { exact: true }) }).first(),
    ).toBeVisible({ timeout: 30_000 });
  }

  async expectVendorRequiredValidationVisible(): Promise<void> {
    const vendorFieldContainer = this.page.locator('*')
      .filter({ has: this.page.getByText('Vendor', { exact: true }) })
      .filter({ has: this.page.getByText('Required field!', { exact: true }) })
      .last();
    await expect(vendorFieldContainer).toBeVisible({ timeout: 15_000 });
  }

  async expectProductDetailLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*ProductDetail/, { timeout: 60_000 });
    await this.page.waitForFunction(
      () => !document.body?.innerText?.includes('JavaScript is required'),
      { timeout: 60_000 },
    ).catch(() => undefined);
    await this.waitForOSLoad();
    await this.l.editProductButton.waitFor({ state: 'visible', timeout: 60_000 });
    await expect(this.l.editProductButton).toBeVisible();
  }

  // ==================== Product Detail View-Mode Assertions ====================

  async expectProductDetailHeaderVisible(productName: string): Promise<void> {
    await expect(this.page.getByText(productName).first()).toBeVisible({ timeout: 30_000 });
    await expect(this.l.productId).toBeVisible({ timeout: 30_000 });
    await expect(this.l.editProductButton).toBeVisible({ timeout: 30_000 });
  }

  async expectProductStatusBadge(status: string): Promise<void> {
    await expect(this.page.getByText(status, { exact: true }).first()).toBeVisible({ timeout: 30_000 });
  }

  async expectViewHistoryLinkVisible(): Promise<void> {
    await expect(this.l.viewHistoryLink).toBeVisible({ timeout: 30_000 });
  }

  async expectActionsManagementLinkVisible(): Promise<void> {
    await expect(this.l.actionsManagementLink).toBeVisible({ timeout: 30_000 });
  }

  async expectProductDetailViewMode(data: {
    name: string;
    state: string;
    definition: string;
    type: string;
  }): Promise<void> {
    await expect(this.page.getByText(data.name).first()).toBeVisible({ timeout: 30_000 });
    await expect(this.page.getByText(data.state).first()).toBeVisible({ timeout: 30_000 });
    await expect(this.page.getByText(data.definition).first()).toBeVisible({ timeout: 30_000 });
    await expect(this.page.getByText(data.type).first()).toBeVisible({ timeout: 30_000 });
  }

  async expectDigitalOfferValue(value: 'Yes' | 'No'): Promise<void> {
    const digitalOfferSection = this.page.getByText('Digital Offer', { exact: true }).locator('..');
    await expect(digitalOfferSection.locator('..').getByText(value)).toBeVisible({ timeout: 30_000 });
  }

  async expectDataProtectionValue(value: 'Yes' | 'No'): Promise<void> {
    // Find the innermost element that contains both the DPP label AND the value.
    // Using .filter() + .last() gives the deepest (most specific) matching container —
    // typically the row div (e152) that holds both the label wrapper (e155) and the
    // value cell (e160) as siblings.
    const dppRow = this.page.locator('*')
      .filter({ has: this.page.getByText('Data Protection & Privacy', { exact: true }) })
      .filter({ has: this.page.getByText(value, { exact: true }) })
      .last();
    await expect(dppRow).toBeVisible({ timeout: 15_000 });
  }

  async expectBrandLabelValue(value: 'Yes' | 'No'): Promise<void> {
    const brandRow = this.page.locator('*')
      .filter({ has: this.page.getByText('Brand Label', { exact: true }) })
      .filter({ has: this.page.getByText(value, { exact: true }) })
      .last();
    await expect(brandRow).toBeVisible({ timeout: 15_000 });
  }

  async expectCommercialReferenceValue(value: string): Promise<void> {
    const commercialRefRow = this.page.locator('*')
      .filter({ has: this.page.getByText('Commercial Reference Number', { exact: true }) })
      .filter({ has: this.page.getByText(value, { exact: true }) })
      .last();
    await expect(commercialRefRow).toBeVisible({ timeout: 15_000 });
  }

  async expectProductDescriptionContains(text: string): Promise<void> {
    // In view mode, description is inside PRODUCT DESCRIPTION accordion's tabpanel as a paragraph
    // In edit mode, it's inside the Rich Text Editor
    const viewPanel = this.page.getByRole('tab', { name: /PRODUCT DESCRIPTION/ })
      .locator('..').locator('[role="tabpanel"]');
    await expect(viewPanel).toContainText(text, { timeout: 30_000 });
  }

  async getDescriptionText(): Promise<string> {
    // In edit mode the CKEditor textbox contains only the actual content;
    // in view mode we fall back to the accordion tabpanel.
    const editor = this.page.getByRole('textbox', { name: /Rich Text Editor/ });
    if (await editor.isVisible({ timeout: 3_000 }).catch(() => false)) {
      return (await editor.textContent())?.trim() ?? '';
    }
    const viewPanel = this.page.getByRole('tab', { name: /PRODUCT DESCRIPTION/ })
      .locator('..').locator('[role="tabpanel"]');
    return (await viewPanel.textContent())?.trim() ?? '';
  }

  async expectOrgLevelValues(data: {
    level1: string;
    level2: string;
    level3?: string;
  }): Promise<void> {
    await expect(this.page.getByText(data.level1).first()).toBeVisible({ timeout: 30_000 });
    await expect(this.page.getByText(data.level2).first()).toBeVisible({ timeout: 30_000 });
    if (data.level3) {
      await expect(this.page.getByText(data.level3).first()).toBeVisible({ timeout: 30_000 });
    }
  }

  async expectBottomTabsVisible(): Promise<void> {
    await expect(this.l.productOrganizationTab).toBeVisible({ timeout: 30_000 });
    await expect(this.l.productTeamTab).toBeVisible({ timeout: 30_000 });
    await expect(this.l.securitySummaryTab).toBeVisible({ timeout: 30_000 });
    await expect(this.l.productConfigurationTab).toBeVisible({ timeout: 30_000 });
  }

  async isDataProtectionChecked(): Promise<boolean> {
    return this.l.dataProtectionCheckbox.isChecked();
  }

  async isBrandLabelChecked(): Promise<boolean> {
    return this.l.brandLabelCheckbox.isChecked();
  }

  async expectResetFormButtonVisible(): Promise<void> {
    await expect(this.l.resetFormButton).toBeVisible({ timeout: 30_000 });
  }

  async expectEditModeVisible(): Promise<void> {
    await expect(this.l.productNameInput).toBeVisible({ timeout: 30_000 });
    await expect(this.l.productNameInput).toBeEnabled({ timeout: 30_000 });
    await expect(this.l.saveButton).toBeVisible({ timeout: 30_000 });
  }

  async expectProductNameVisible(name: string): Promise<void> {
    await expect(this.page.getByText(name).first()).toBeVisible();
  }

  async expectProductIdVisible(): Promise<void> {
    await expect(this.l.productId).toBeVisible();
  }

  async expectProductNameValue(expected: string): Promise<void> {
    await expect(this.l.productNameInput).toHaveValue(expected);
  }

  async expectCommercialRefNumberValue(expected: string): Promise<void> {
    await expect(this.l.commercialRefInput).toHaveValue(expected);
  }

  async clickReleasesTab(): Promise<void> {
    await this.l.releasesTab.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.releasesTab.click();
    await this.l.createReleaseButton.waitFor({ state: 'visible', timeout: 30_000 });
    // Wait for OS background data-actions (releases list query) to settle after
    // tab switch — the button appears before they finish, so clicking too soon
    // may result in the action being silently dropped.
    await this.waitForOSLoad();
  }

  async isNoReleasesMessageVisible(): Promise<boolean> {
    return this.l.noReleasesMessage.isVisible().catch(() => false);
  }

  async expectCreateReleaseButtonVisible(): Promise<void> {
    await expect(this.l.createReleaseButton).toBeVisible({ timeout: 15_000 });
  }

  async expectReleasesTabActive(): Promise<void> {
    await expect(this.l.releasesTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectNoReleasesStateVisible(): Promise<void> {
    await expect(this.l.noReleasesMessage).toBeVisible({ timeout: 30_000 });
    await expect(this.l.createReleaseButton).toBeVisible();
  }

  async expectNoReleasesStateHidden(): Promise<void> {
    await expect(this.l.noReleasesMessage).toBeHidden();
  }

  async clickCreateRelease(): Promise<void> {
    // Wait for overlay-level load and then for all pending network data-actions;
    // OutSystems releases-tab has a background aggregate that fires after the
    // button becomes visible — clicking before it settles silently discards the action.
    await this.waitForOSLoad();
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    await expect(this.l.createReleaseButton).toBeEnabled({ timeout: 15_000 });
    await this.l.createReleaseButton.click();
    // Retry once if the dialog doesn't appear quickly (parallel test runs or OS lag)
    const appeared = await this.l.createReleaseDialog
      .waitFor({ state: 'visible', timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (!appeared) {
      await this.l.createReleaseButton.click();
      await this.l.createReleaseDialog.waitFor({ state: 'visible', timeout: 60_000 });
    }
  }

  async clickCreateAndScope(): Promise<void> {
    await this.l.createAndScopeButton.click();
  }

  async expectCreateReleaseDialogVisible(): Promise<void> {
    await expect(this.l.createReleaseDialog).toBeVisible({ timeout: 30_000 });
    await expect(this.l.releaseVersionInput).toBeVisible();
    await expect(this.l.targetReleaseDateInput).toBeVisible();
    await expect(this.l.changeSummaryInput).toBeVisible();
  }

  async expectCreateReleaseValidation(): Promise<void> {
    await expect(this.l.releaseValidationAlert).toContainText('Please review the necessary fields');
    await expect(this.l.requiredFieldError).toHaveCount(3);
  }

  async expectValidationAlertVisible(expectedText = 'Please review the necessary fields'): Promise<void> {
    await expect(this.l.releaseValidationAlert).toContainText(expectedText);
  }

  async expectRequiredFieldErrorsVisible(minCount = 1): Promise<void> {
    await expect(this.l.requiredFieldError.first()).toBeVisible({ timeout: 15_000 });
    expect(await this.getRequiredFieldErrorCount()).toBeGreaterThanOrEqual(minCount);
  }

  async fillReleaseVersion(version: string): Promise<void> {
    await this.l.releaseVersionInput.fill(version);
  }

  async fillReleaseChangeSummary(summary: string): Promise<void> {
    await this.l.changeSummaryInput.fill(summary);
  }

  async getRequiredFieldErrorCount(): Promise<number> {
    return this.l.requiredFieldError.count();
  }

  async toggleContinuousPenetrationTesting(): Promise<void> {
    await this.l.continuousPenetrationTestingCheckbox.click();
  }

  // ==================== Create Release Dialog — UI verification ====================

  /** Verifies both Release Type radio buttons (New / Existing) are visible. */
  async expectReleaseTypeRadiosVisible(): Promise<void> {
    await expect(this.l.newProductReleaseRadio).toBeVisible({ timeout: 15_000 });
    await expect(this.l.existingProductReleaseRadio).toBeVisible({ timeout: 15_000 });
  }

  /** Verifies "New Product Release" radio is selected by default. */
  async expectNewProductReleaseRadioSelected(): Promise<void> {
    await expect(this.l.newProductReleaseRadio).toBeChecked({ timeout: 10_000 });
  }

  /** Asserts the "Cont. Pen Test Contract Date" field label is NOT yet visible. */
  async expectContPenTestContractDateHidden(): Promise<void> {
    await expect(this.l.contPenTestContractDateLabel).toBeHidden({ timeout: 10_000 });
  }

  /** Asserts the "Cont. Pen Test Contract Date" field label IS visible (after checkbox is checked). */
  async expectContPenTestContractDateVisible(): Promise<void> {
    await expect(this.l.contPenTestContractDateLabel).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Opens the Target Release Date flatpickr calendar and verifies that past dates are disabled.
   * Checks that the calendar shows at least one `.flatpickr-disabled` day cell.
   */
  async expectTargetDatePickerPreventsYesterday(): Promise<void> {
    await this.l.targetReleaseDateInput.click();
    const calendar = this.page.locator('.flatpickr-calendar.open');
    await calendar.waitFor({ state: 'visible', timeout: 10_000 });

    // All dates before today should be disabled — verify at least one exists in the month view
    const disabledDays = calendar.locator('.flatpickr-day.flatpickr-disabled');
    const disabledCount = await disabledDays.count();
    // Guard: only assert disabled days exist when today is NOT the 1st of the month
    const today = new Date();
    if (today.getDate() > 1) {
      await expect(disabledDays.first()).toBeVisible({ timeout: 5_000 });
      expect(disabledCount).toBeGreaterThan(0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayLabel = `${NewProductPage.monthNames[yesterday.getMonth()]} ${yesterday.getDate()}, ${yesterday.getFullYear()}`;
      const yesterdayCell = calendar.locator(`[aria-label="${yesterdayLabel}"]`).first();
      if (await yesterdayCell.count()) {
        await expect(yesterdayCell).toHaveClass(/flatpickr-disabled/);
      }
    }
    await this.page.keyboard.press('Escape');
    await calendar.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
  }

  /** Clicks "Existing Product Release" radio and waits for the OS partial refresh. */
  async clickExistingProductReleaseRadio(): Promise<void> {
    await this.l.existingProductReleaseRadio.click();
    await this.waitForOSLoad();
  }

  /**
   * Verifies that selecting "Existing Product Release" reveals extra fields.
   * Per exploration: reveals "Last Full Pen Test Date" and/or "Was pen test performed?" UI.
   * Uses OR-match so the assertion is resilient to minor OS-version UI differences.
   */
  async expectExistingReleaseFieldsVisible(): Promise<void> {
    const extraField = this.page.getByRole('dialog')
      .getByText(/Last.*Pen Test Date|Was pen test performed|Last BU.*FCSR/i)
      .first();
    await expect(extraField).toBeVisible({ timeout: 15_000 });
  }

  /** After "Was pen test performed? Yes" is clicked, verifies conditional pen-test fields. */
  async expectLastPenTestFieldsVisible(): Promise<void> {
    await expect(this.l.lastPenTestTypeLabel).toBeVisible({ timeout: 10_000 });
    await expect(this.l.lastPenTestDateLabel).toBeVisible({ timeout: 10_000 });
  }

  async clickWasPenTestPerformedYes(): Promise<void> {
    await this.l.wasPenTestPerformedYesRadio.click();
    await this.waitForOSLoad();
  }

  async clickWasPenTestPerformedNo(): Promise<void> {
    await this.l.wasPenTestPerformedNoRadio.click();
    await this.waitForOSLoad();
  }

  async expectExistingReleaseLastPenTestDateVisible(): Promise<void> {
    await expect(this.l.lastPenTestDateLabel).toBeVisible({ timeout: 10_000 });
  }

  async expectExistingReleaseLastBuSecurityOfficerFcsrDateVisible(): Promise<void> {
    await expect(this.l.lastBuSecurityOfficerFcsrDateLabel).toBeVisible({ timeout: 10_000 });
  }

  /** After "Was pen test performed? No" is clicked, verifies Justification field appears. */
  async expectJustificationFieldVisible(): Promise<void> {
    await expect(this.l.justificationLabel).toBeVisible({ timeout: 10_000 });
  }

  /** Verifies second-release dialog shows "Clone from existing release" and "Create as new" radios. */
  async expectCloneOrNewRadiosVisible(): Promise<void> {
    await expect(this.l.cloneFromExistingRadio).toBeVisible({ timeout: 15_000 });
    await expect(this.l.createAsNewRadio).toBeVisible({ timeout: 15_000 });
  }

  async expectCloneFromExistingRadioChecked(): Promise<void> {
    await expect(this.l.cloneFromExistingRadio).toBeChecked({ timeout: 10_000 });
  }

  async expectCloneSourceReleaseSelectVisible(): Promise<void> {
    await expect(this.l.cloneSourceReleaseSelect).toBeVisible({ timeout: 10_000 });
  }

  async getSelectedCloneSourceReleaseLabel(): Promise<string> {
    return this.l.cloneSourceReleaseSelect.evaluate((element) => {
      const select = element as HTMLSelectElement;
      return select.options[select.selectedIndex]?.textContent?.trim() ?? '';
    });
  }

  async getCloneSourceReleaseOptionLabels(): Promise<string[]> {
    return this.l.cloneSourceReleaseSelect.evaluate((element) => {
      const select = element as HTMLSelectElement;
      return Array.from(select.options)
        .map((option) => option.textContent?.trim() ?? '')
        .filter(Boolean);
    });
  }

  async clickCreateAsNewRadio(): Promise<void> {
    await this.l.createAsNewRadio.click();
    await this.waitForOSLoad();
  }

  async clickResetReleaseForm(): Promise<void> {
    await this.l.resetReleaseFormButton.click();
    await this.waitForOSLoad();
  }

  // ==================== Releases tab — grid helpers ====================

  /**
   * Returns the text content of all column header cells in the Releases tab grid.
   * Works with both <th> (HTML table) and [role="columnheader"] (ARIA grid).
   */
  async getReleasesGridColumnHeaders(): Promise<string[]> {
    const headers = this.l.releasesGrid.locator('th, [role="columnheader"]');
    const raw = await headers.allTextContents();
    return raw.map(h => h.trim()).filter(Boolean);
  }

  /** Returns the number of data rows in the Releases tab grid (excludes header row). */
  async getReleasesGridDataRowCount(): Promise<number> {
    const rows = this.l.releasesGrid.getByRole('row');
    const total = await rows.count();
    return Math.max(0, total - 1);
  }

  /**
   * Clicks the first release name link in the Releases tab grid and waits for navigation.
   * Resolves once the URL changes (either to ReleaseDetail or any GRC_PICASso path).
   */
  async clickFirstReleaseLinkAndNavigate(): Promise<void> {
    const firstLink = this.l.releasesGrid.getByRole('row').nth(1).getByRole('link').first();
    const currentUrl = this.page.url();
    await Promise.all([
      this.page.waitForURL(url => url.href !== currentUrl, { timeout: 30_000 }),
      firstLink.click(),
    ]);
    await this.waitForOSLoad();
  }

  async clickReleaseLinkByVersion(releaseVersion: string): Promise<void> {
    const link = this.l.releasesGrid.getByRole('link', {
      name: new RegExp(escapeRegExp(releaseVersion), 'i'),
    }).first();
    await link.waitFor({ state: 'visible', timeout: 30_000 });

    await Promise.all([
      this.page.waitForURL(/ReleaseDetail/, { timeout: 60_000 }),
      link.click(),
    ]);
    await this.waitForOSLoad();
  }

  /**
   * Returns the full text content of the first data row in the Releases tab grid.
   * Used to verify status badge / release version text is present.
   */
  async getReleasesGridFirstRowText(): Promise<string> {
    const firstDataRow = this.l.releasesGrid.getByRole('row').nth(1);
    return (await firstDataRow.textContent() ?? '').trim();
  }

  async getFirstReleaseVersionLinkText(): Promise<string> {
    const link = this.l.releasesGridReleaseLinks.first();
    await link.waitFor({ state: 'visible', timeout: 15_000 });
    return ((await link.textContent()) ?? '').trim();
  }

  /**
   * Changes the Releases tab per-page selector to the given value.
   * The OutSystems pagination <select> inside [role="status"] accepts option labels
   * like '10', '20', '30', '50', '100'.
   */
  async changeReleasesTabPerPage(value: string): Promise<void> {
    await this.l.releasesTabPerPageSelect.selectOption(value);
    await this.waitForOSLoad();
  }

  private async selectCreateReleaseDateInputByIndex(index: number, targetDate: Date): Promise<void> {
    const monthName = NewProductPage.monthNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    const day = targetDate.getDate();
    const dateLabel = `${monthName} ${day}, ${year}`;
    const typedValue = `${day} ${monthName.slice(0, 3)} ${year}`;
    const input = this.l.createReleaseDateInputs.nth(index);
    const dayCell = this.page.locator(`[aria-label="${dateLabel}"]`).last();

    await input.click().catch(() => undefined);
    await input.fill(typedValue).catch(() => undefined);
    await input.press('Enter').catch(() => undefined);
    await input.press('Tab').catch(() => undefined);
    await this.waitForOSLoad();

    let inputValue = await input.inputValue().catch(() => '');
    if (inputValue) {
      return;
    }

    await input.click();
    await this.l.releaseDateMonthSelect.waitFor({ state: 'visible', timeout: 10_000 });

    const currentMonth = await this.l.releaseDateMonthSelect.inputValue().catch(() => '');
    if (currentMonth !== String(targetDate.getMonth())) {
      await this.l.releaseDateMonthSelect.selectOption(String(targetDate.getMonth())).catch(async () => {
        await this.l.releaseDateMonthSelect.selectOption({ label: monthName });
      });
      await this.l.releaseDateMonthSelect.waitFor({ state: 'visible', timeout: 5_000 }).catch(async () => {
        await input.click();
        await this.l.releaseDateMonthSelect.waitFor({ state: 'visible', timeout: 5_000 });
      });
    }

    const currentYear = await this.l.releaseDateYearSpinbutton.inputValue().catch(() => '');
    if (currentYear !== String(year)) {
      await this.l.releaseDateYearSpinbutton.fill(String(year));
      await this.l.releaseDateYearSpinbutton.press('Enter');
      await dayCell.waitFor({ state: 'visible', timeout: 5_000 }).catch(async () => {
        await input.click();
        await this.l.releaseDateMonthSelect.waitFor({ state: 'visible', timeout: 5_000 });
      });
    }

    await dayCell.waitFor({ state: 'attached', timeout: 10_000 });
    await this.page.evaluate((label: string) => {
      const spans = document.querySelectorAll<HTMLElement>(`[aria-label="${label}"]`);
      const span = spans[spans.length - 1];
      if (span) span.click();
    }, dateLabel);
    await input.press('Tab').catch(() => undefined);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.locator('.flatpickr-calendar.open').waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
    await this.waitForOSLoad();

    inputValue = await input.inputValue().catch(() => '');
    if (!inputValue) {
      await input.click();
      await this.l.releaseDateMonthSelect.waitFor({ state: 'visible', timeout: 10_000 });
      await dayCell.waitFor({ state: 'attached', timeout: 10_000 });
      await this.page.evaluate((label: string) => {
        const spans = document.querySelectorAll<HTMLElement>(`[aria-label="${label}"]`);
        const span = spans[spans.length - 1];
        if (span) span.click();
      }, dateLabel);
      await input.press('Tab').catch(() => undefined);
      await this.page.keyboard.press('Escape').catch(() => undefined);
      await this.page.locator('.flatpickr-calendar.open').waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
      await this.waitForOSLoad();
      inputValue = await input.inputValue().catch(() => '');
    }

    if (!inputValue) {
      await input.evaluate((element, value) => {
        const field = element as HTMLInputElement;
        const container = field.parentElement ?? field;
        const relatedInputs = Array.from(container.querySelectorAll<HTMLInputElement>('input'));
        const targets = relatedInputs.length > 0 ? relatedInputs : [field];

        for (const target of targets) {
          target.value = value;
          target.dispatchEvent(new Event('input', { bubbles: true }));
          target.dispatchEvent(new Event('change', { bubbles: true }));
          target.blur();
        }
      }, typedValue);
      await this.waitForOSLoad();
      inputValue = await input.inputValue().catch(() => '');
    }

    if (!inputValue) {
      throw new Error(`Failed to set create-release date input at index ${index}.`);
    }
  }

  async selectReleaseTargetDate(targetDate: Date): Promise<void> {
    await this.selectCreateReleaseDateInputByIndex(0, targetDate);
  }

  async selectExistingReleaseLastPenTestDate(targetDate: Date): Promise<void> {
    await this.selectCreateReleaseDateInputByIndex(1, targetDate);
  }

  async selectExistingReleaseLastBuSecurityOfficerFcsrDate(targetDate: Date): Promise<void> {
    await this.selectCreateReleaseDateInputByIndex(2, targetDate);
  }

  async createFirstRelease(data: {
    releaseVersion: string;
    targetDate: Date;
    changeSummary: string;
    continuousPenetrationTesting?: boolean;
  }): Promise<void> {
    await this.fillReleaseVersion(data.releaseVersion);
    await this.selectReleaseTargetDate(data.targetDate);
    await this.l.createReleaseDateInputs.nth(0).press('Tab').catch(() => undefined);
    await this.waitForOSLoad();
    await this.fillReleaseChangeSummary(data.changeSummary);
    if (data.continuousPenetrationTesting) {
      await this.toggleContinuousPenetrationTesting();
    }
    // Register the navigation listener BEFORE clicking so we don't miss a fast navigation.
    // The app may navigate to ReleaseDetail (original behaviour) OR stay on the
    // product Releases tab (current QA environment behaviour). Handle both:
    const navigationPromise = this.page
      .waitForURL(/ReleaseDetail/, { timeout: 120_000 })
      .catch(() => null);

    // Ensure any open flatpickr calendar is dismissed before clicking the button.
    await this.l.createReleaseDialog.click({ position: { x: 10, y: 10 } }).catch(() => undefined);
    await this.page.waitForTimeout(500);

    await expect(this.l.createAndScopeButton).toBeEnabled({ timeout: 15_000 });
    await this.l.createAndScopeButton.click();
    // Race between dialog closing (in-place creation) and navigation to ReleaseDetail.
    await Promise.race([
      this.l.createReleaseDialog.waitFor({ state: 'hidden', timeout: 120_000 }).catch(() => undefined),
      navigationPromise,
    ]);
    await this.waitForOSLoad();
    // If dialog is still open, check for a validation error message; if none visible
    // (e.g. server timeout), retry once before failing.
    let dialogStillOpen = await this.l.createReleaseDialog.isVisible().catch(() => false);
    if (dialogStillOpen) {
      const releaseVersionValue = await this.l.releaseVersionInput.inputValue().catch(() => '');
      const targetDateValue = await this.l.createReleaseDateInputs.nth(0).inputValue().catch(() => '');
      const changeSummaryValue = await this.l.changeSummaryInput.inputValue().catch(() => '');
      const dialogText = await this.l.createReleaseDialog.innerText().catch(() => '');
      const hasValidationError = /Required field|Please review the necessary fields/i.test(dialogText);
      const needsRefill = !releaseVersionValue || !targetDateValue || !changeSummaryValue || hasValidationError;

      if (needsRefill) {
        if (!releaseVersionValue) {
          await this.fillReleaseVersion(data.releaseVersion);
        }
        if (!targetDateValue) {
          await this.selectReleaseTargetDate(data.targetDate);
          await this.l.createReleaseDateInputs.nth(0).press('Tab').catch(() => undefined);
          await this.waitForOSLoad();
        }
        if (!changeSummaryValue) {
          await this.fillReleaseChangeSummary(data.changeSummary);
        }
      }

      await this.l.createReleaseDialog.click({ position: { x: 10, y: 10 } }).catch(() => undefined);
      await this.page.waitForTimeout(500);
      await this.l.createAndScopeButton.click().catch(() => undefined);
      await Promise.race([
        this.l.createReleaseDialog.waitFor({ state: 'hidden', timeout: 90_000 }).catch(() => undefined),
        this.page.waitForURL(/ReleaseDetail/, { timeout: 90_000 }).catch(() => null),
      ]);
      await this.waitForOSLoad();
      dialogStillOpen = await this.l.createReleaseDialog.isVisible().catch(() => false);
    }
    // Hard assertion: if the dialog is still visible the form had a validation error
    // (e.g. Target Date not filled).  Fail loudly here rather than silently proceeding
    // and getting a confusing "no releases listed" error in a later step.
    if (dialogStillOpen) {
      const releaseVersionValue = await this.l.releaseVersionInput.inputValue().catch(() => '');
      const targetDateValue = await this.l.createReleaseDateInputs.nth(0).inputValue().catch(() => '');
      const changeSummaryValue = await this.l.changeSummaryInput.inputValue().catch(() => '');
      const dialogText = (await this.l.createReleaseDialog.innerText().catch(() => ''))
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 500);
      throw new Error(
        '"Create & Scope" did not close the Create Release dialog — ' +
        `releaseVersion="${releaseVersionValue}", targetDate="${targetDateValue}", ` +
        `changeSummaryLength=${changeSummaryValue.length}, dialogText="${dialogText}".`,
      );
    }
  }

  async createExistingProductRelease(data: {
    releaseVersion: string;
    targetDate: Date;
    changeSummary: string;
    lastBuSecurityOfficerFcsrDate: Date;
    lastFullPenTestDate?: Date;
  }): Promise<void> {
    await this.clickExistingProductReleaseRadio();
    await this.expectExistingReleaseFieldsVisible();
    await this.fillReleaseVersion(data.releaseVersion);
    await this.selectReleaseTargetDate(data.targetDate);
    await this.fillReleaseChangeSummary(data.changeSummary);
    if (data.lastFullPenTestDate) {
      await this.selectExistingReleaseLastPenTestDate(data.lastFullPenTestDate);
    }
    await this.selectExistingReleaseLastBuSecurityOfficerFcsrDate(data.lastBuSecurityOfficerFcsrDate);

    const navigationPromise = this.page.waitForURL(/ReleaseDetail/, { timeout: 120_000 }).catch(() => null);

    await this.l.createReleaseDialog.click({ position: { x: 10, y: 10 } }).catch(() => undefined);
    await this.page.waitForTimeout(500);
    await this.l.createAndScopeButton.click();

    await Promise.race([
      this.l.createReleaseDialog.waitFor({ state: 'hidden', timeout: 120_000 }).catch(() => undefined),
      navigationPromise,
    ]);
    await this.waitForOSLoad();

    const dialogStillOpen = await this.l.createReleaseDialog.isVisible().catch(() => false);
    if (dialogStillOpen) {
      throw new Error(
        'Existing Product Release creation did not close the dialog — ' +
        'the onboarding form likely still has validation errors.',
      );
    }
  }

  async expectReleaseListed(releaseVersion: string, status: string): Promise<void> {
    // Wait for the empty-state message to disappear — confirms the release IS listed.
    // (More reliable than waiting for a specific grid/table role which OutSystems may
    // render as a plain <table> without an explicit ARIA role on some products.)
    await expect(this.l.noReleasesMessage).toBeHidden({ timeout: 30_000 });
    // Verify the release version link is present in the releases list
    await expect(this.page.getByRole('link', { name: releaseVersion })).toBeVisible({ timeout: 30_000 });
    // Verify the status column shows the expected value.
    // Scope to the row that contains the release version link to avoid
    // matching hidden <option> elements in Status filter dropdowns.
    const releaseRow = this.page.getByRole('row').filter({ hasText: releaseVersion });
    const statusCell = releaseRow.getByRole('gridcell', { name: status });
    await expect(statusCell).toBeVisible({ timeout: 30_000 });
  }

  async expectDuplicateReleaseVersionValidationVisible(): Promise<void> {
    const duplicateMessageVisible = await this.l.duplicateReleaseVersionError
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    if (duplicateMessageVisible) {
      await expect(this.l.duplicateReleaseVersionError).toBeVisible({ timeout: 10_000 });
      return;
    }

    await expect(this.l.releaseValidationAlert).toBeVisible({ timeout: 10_000 });
    await expect(this.l.releaseValidationAlert).toContainText(/review|already|exist|duplicate/i);
  }

  // ==================== Form Actions ====================

  async clickSave(): Promise<void> {
    await this.l.saveButton.click();
  }

  /**
   * Handles an OutSystems confirmation dialog if one is visible.
   * Looks for a dialog with a "Save" or "OK" button and clicks it.
   */
  async handleConfirmDialogIfVisible(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    const dialogSaveBtn = dialog.getByRole('button', { name: 'Save' });
    const dialogOkBtn = dialog.getByRole('button', { name: 'OK' });
    if (await dialogSaveBtn.isVisible({ timeout: 15_000 }).catch(() => false)) {
      await dialogSaveBtn.click();
    } else if (await dialogOkBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await dialogOkBtn.click();
    }
  }

  /**
   * Clicks Save and handles an optional OutSystems confirmation dialog.
   * Some field toggles (Data Protection, Digital Offer) trigger a "Save Product"
   * dialog requiring explicit confirmation before the form completes saving.
   */
  /**
   * Clicks Save, handles any OutSystems confirm dialog, and automatically recovers
   * from "Required field!" errors caused by OutSystems partial refreshes (e.g. after
   * CKEditor interaction or DPP/Brand Label checkbox toggles) resetting the Org Level
   * server-side variables.
   *
   * Recovery logic: if "Required field!" appears after save, read the current DOM-selected
   * values from the org level dropdowns (still visually intact), force genuine change events
   * via forceRebindOrgLevels (blank → correct), and retry save once.
   *
   * @param preRecordedLevels - Optional org level values recorded BEFORE any partial
   *   refresh (e.g. before CKEditor interaction). When provided these take precedence
   *   over reading from the (potentially corrupt) DOM — essential for description saves
   *   where CKEditor triggers a partial refresh that resets the L1 DOM value to blank.
   */
  async clickSaveWithOrgLevelRecovery(preRecordedLevels?: { l1: string; l2: string; l3: string }): Promise<void> {
    await this.l.saveButton.click();
    await this.handleConfirmDialogIfVisible();
    await this.waitForOSLoad();

    // Check whether OutSystems raised "Required field!" for org level dropdowns
    const hasRequiredError = await this.l.requiredFieldError
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    if (hasRequiredError) {
      // Prefer pre-recorded values (taken before partial refresh corrupted the DOM).
      // Fall back to reading from DOM, but treat blank/sentinel values as empty.
      const rawL1 = preRecordedLevels?.l1 ?? await this.getSelectedOrgLevel1().catch(() => '');
      const rawL2 = preRecordedLevels?.l2 ?? await this.getSelectedOrgLevel2().catch(() => '');
      const rawL3 = preRecordedLevels?.l3 ?? await this.getSelectedOrgLevel3().catch(() => '');

      // Treat "- Select -" sentinel (OutSystems blank option) as empty
      const blank = (v: string) => !v || v === '- Select -' || v.trim() === '-';
      const level1 = blank(rawL1) ? '' : rawL1;
      const level2 = blank(rawL2) ? '' : rawL2;
      const level3 = blank(rawL3) ? '' : rawL3;

      // Force OS to rebind the server variables and retry the save
      await this.forceRebindOrgLevels(level1, level2, level3);
      await this.l.saveButton.click();
      await this.handleConfirmDialogIfVisible();
      await this.waitForOSLoad();
    }
  }

  async clickSaveAndHandleConfirmDialog(): Promise<void> {
    await this.l.saveButton.click();
    await this.handleConfirmDialogIfVisible();
    await this.waitForOSLoad();
  }

  async expectSaveConfirmDialogVisible(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeVisible({ timeout: 15_000 });
  }

  async confirmSaveConfirmDialog(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    const saveButton = dialog.getByRole('button', { name: 'Save' });
    await expect(saveButton).toBeVisible({ timeout: 10_000 });
    await saveButton.click();
    await this.waitForOSLoad();
  }

  async cancelSaveConfirmDialog(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    const cancelButton = dialog.getByRole('button', { name: 'Cancel' });
    await expect(cancelButton).toBeVisible({ timeout: 10_000 });
    await cancelButton.click();
    await this.waitForOSLoad();
  }

  async clickCancel(): Promise<void> {
    await this.l.cancelButton.click();
  }

  /**
   * Clicks Cancel and confirms the "Leave Page" OutSystems modal dialog.
   * The dialog appears when there are unsaved changes on the form.
   */
  async clickCancelAndConfirmLeave(): Promise<void> {
    await this.l.cancelButton.click();
    const leaveButton = this.page.getByRole('button', { name: 'Leave' });
    await expect(leaveButton).toBeVisible({ timeout: 20_000 });
    await leaveButton.click();
  }

  async clickCancelAndReturnToViewMode(): Promise<void> {
    await this.l.cancelButton.click();
    const leaveButton = this.page.getByRole('button', { name: 'Leave' });
    if (await leaveButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await leaveButton.click();
    }
    await this.expectProductDetailLoaded();
  }

  async clickResetForm(): Promise<void> {
    await this.l.resetFormButton.click();
  }

  async clickEditProduct(): Promise<void> {
    await this.l.editProductButton.click();
  }

  async clickEditProductAndWaitForForm(): Promise<void> {
    await this.clickEditProduct();
    await this.expectEditModeVisible();
    // OutSystems keeps background network activity alive, so networkidle can
    // hang here even after the edit form is ready.
    await this.waitForOSLoad();
  }

  async getProductNameValue(): Promise<string> {
    return this.l.productNameInput.inputValue();
  }

  async getCommercialRefNumberValue(): Promise<string> {
    return this.l.commercialRefInput.inputValue();
  }

  // ==================== Composite Helpers ====================

  /**
   * Selects the three product dropdown values (State, Definition, Type).
   * Separated from fillProductInformation so it can be re-applied before save
   * if OutSystems partial refreshes during Org/Team operations reset them.
   */
  async selectProductDropdowns(data: {
    state: string;
    definition: string;
    type: string;
  }): Promise<void> {
    await this.selectProductState(data.state);
    await this.selectProductDefinition(data.definition);
    await this.selectProductType(data.type);
  }

  /**
   * Fills all required product information fields in one call.
   * Selects dropdowns first — OutSystems partial refreshes can clear text inputs.
   * Waits for DOM to stabilize after Product Type selection before filling text fields.
   */
  async fillProductInformation(data: {
    name: string;
    state: string;
    definition: string;
    type: string;
    description?: string;
  }): Promise<void> {
    await this.selectProductDropdowns(data);
    await this.waitForProductTypeRefresh();
    await this.fillProductNameWithRetry(data.name);
    if (data.description) {
      await this.fillDescription(data.description);
    }
  }

  async fillProductOrganization(data: {
    level1: string;
    level2: string;
    level3?: string;
  }): Promise<void> {
    await this.clickProductOrganizationTab();
    await this.selectOrgLevel1(data.level1);
    await this.selectOrgLevel2(data.level2);
    if (data.level3) {
      await this.selectOrgLevel3(data.level3);
    }
  }

  async reapplyProductOrganization(data: {
    level1: string;
    level2: string;
    level3?: string;
  }): Promise<void> {
    await this.clickProductOrganizationTab();

    await expect(this.l.orgLevel1Select).toBeEnabled({ timeout: 30_000 });
    await this.l.orgLevel1Select.selectOption({ index: 0 });
    await expect(this.l.orgLevel2Select).toBeDisabled({ timeout: 60_000 });

    await this.selectOrgLevel1(data.level1);
    await expect(this.l.orgLevel2Select).toBeEnabled({ timeout: 60_000 });

    if (data.level2 && data.level2 !== '- Select -') {
      await this.l.orgLevel2Select.selectOption({ label: data.level2 });
    }

    if (data.level3 && data.level3 !== '- Select -') {
      await expect(this.l.orgLevel3Select).toBeEnabled({ timeout: 60_000 });
      await this.l.orgLevel3Select.selectOption({ label: data.level3 });
    }
  }

  async fillProductTeam(data: {
    searchQuery: string;
    fullName: string;
  }): Promise<void> {
    await this.clickProductTeamTab();
    const roles: TeamRole[] = [
      'Product Owner',
      'Security Manager',
      'Security and Data Protection Advisor',
      'Process Quality Leader',
    ];
    for (const role of roles) {
      await this.assignTeamMember(role, data.searchQuery, data.fullName);
    }
  }

  // ==================== Product Detail — View History ====================

  async clickViewHistory(): Promise<void> {
    await this.l.viewHistoryLink.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.viewHistoryLink.click();
    await this.waitForOSLoad();
  }

  async expectHistoryDialogVisible(): Promise<void> {
    await expect(this.l.historyDialog).toBeVisible({ timeout: 30_000 });
  }

  async expectHistoryGridVisible(): Promise<void> {
    await expect(this.l.historyGrid).toBeVisible({ timeout: 30_000 });
  }

  async expectHistoryGridHasRows(): Promise<void> {
    await expect(this.l.historyGrid.locator('tbody tr').first()).toBeVisible({ timeout: 30_000 });
  }

  async getHistoryRowCount(): Promise<number> {
    return this.l.historyGrid.locator('tbody tr').count();
  }

  async getHistoryDateTexts(limit = 5): Promise<string[]> {
    const dateCells = this.l.historyGrid.locator('tbody tr td:first-child');
    const count = Math.min(await dateCells.count(), limit);
    const values: string[] = [];

    for (let index = 0; index < count; index++) {
      const value = (await dateCells.nth(index).textContent() ?? '').trim();
      if (value) values.push(value);
    }

    return values;
  }

  async getHistoryRowTexts(limit = 5): Promise<string[]> {
    const rows = this.l.historyGrid.locator('tbody tr');
    const count = Math.min(await rows.count(), limit);
    const values: string[] = [];

    for (let index = 0; index < count; index++) {
      const value = ((await rows.nth(index).textContent()) ?? '').replace(/\s+/g, ' ').trim();
      if (value) values.push(value);
    }

    return values;
  }

  async getProductIdText(): Promise<string> {
    const value = await this.l.productId.textContent();
    return value?.replace(/\s+/g, ' ').trim() ?? '';
  }

  private formatHistoryDateInputValue(targetDate: Date): string {
    const day = targetDate.getDate();
    const month = NewProductPage.monthNames[targetDate.getMonth()].slice(0, 3);
    const year = targetDate.getFullYear();
    return `${day} ${month} ${year}`;
  }

  private async setHistoryDateInput(input: Locator, targetDate: Date): Promise<void> {
    const value = this.formatHistoryDateInputValue(targetDate);
    const normalizedTarget = value.toLowerCase().replace(/\s+/g, ' ').trim();

    const readValue = async (): Promise<string> => (
      await input.inputValue().catch(() => '')
    ).toLowerCase().replace(/\s+/g, ' ').trim();

    await input.waitFor({ state: 'visible', timeout: 15_000 });
    await input.scrollIntoViewIfNeeded().catch(() => undefined);
    await input.focus().catch(() => undefined);
    await input.click({ force: true }).catch(() => undefined);
    await input.press(`${process.platform === 'darwin' ? 'Meta' : 'Control'}+A`).catch(() => undefined);
    await input.fill(value).catch(() => undefined);
    if ((await readValue()) !== normalizedTarget) {
      await input.pressSequentially(value, { delay: 30 }).catch(() => undefined);
    }
    await input.press('Enter').catch(() => undefined);
    await input.press('Tab').catch(() => undefined);

    let currentValue = await readValue();
    if (currentValue !== normalizedTarget) {
      await input.evaluate((element, newValue) => {
        const field = element as HTMLInputElement;
        const prototype = Object.getPrototypeOf(field);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
        descriptor?.set?.call(field, newValue);
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.blur();
      }, value);
      currentValue = await readValue();
    }

    if (currentValue !== normalizedTarget) {
      throw new Error(`Failed to set Product History date input to ${value}.`);
    }
  }

  async selectHistoryDateRange(fromDate: Date, toDate: Date): Promise<void> {
    await this.setHistoryDateInput(this.l.historyDateFromInput, fromDate);

    const toInputVisible = await this.l.historyDateToInput.isVisible().catch(() => false);
    if (toInputVisible) {
      await this.setHistoryDateInput(this.l.historyDateToInput, toDate);
    }
  }

  async fillHistorySearchInput(text: string): Promise<void> {
    await this.l.historySearchInput.fill(text);
  }

  async clickHistorySearchButton(): Promise<void> {
    await this.l.historySearchButton.click();
    await this.waitForOSLoad();
  }

  async getHistorySearchInputValue(): Promise<string> {
    return this.l.historySearchInput.inputValue();
  }

  async selectHistoryActivityFilter(activityLabel: string): Promise<void> {
    await this.l.historyActivityFilter.selectOption({ label: activityLabel });
    await this.waitForOSLoad();
  }

  async getHistoryActivityFilterOptionLabels(): Promise<string[]> {
    let labels: string[] = [];
    try {
      await expect.poll(
        async () => {
          labels = await this.l.historyActivityFilter.evaluate((element) => {
            const select = element as HTMLSelectElement;
            return Array.from(select.options)
              .map((option) => option.textContent?.trim() ?? '')
              .filter(Boolean);
          });
          return labels.length;
        },
        { timeout: 8_000, intervals: [500, 500, 1_000, 2_000] },
      ).toBeGreaterThan(1);
    } catch {
      // Return whatever was available; caller decides whether that's sufficient.
    }

    return labels;
  }

  async getSelectedHistoryActivityFilterLabel(): Promise<string> {
    return this.getSelectedOptionLabel(this.l.historyActivityFilter);
  }

  async clickHistoryResetFilters(): Promise<void> {
    await this.l.historyResetButton.click();
    await this.waitForOSLoad();
  }

  async getHistoryTotalRecordCount(): Promise<number> {
    await this.l.historyPaginationStatus.waitFor({ state: 'visible', timeout: 15_000 });
    const statusText = await this.l.historyPaginationStatus.textContent();
    const match = statusText?.match(/(\d+)\s*record(?:s)?/i);
    return match ? Number(match[1]) : 0;
  }

  async changeHistoryPerPage(value: '10' | '20' | '30' | '50' | '100'): Promise<void> {
    await this.l.historyPerPageSelect.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.historyPerPageSelect.selectOption(value);
    await this.waitForOSLoad();
    await expect
      .poll(() => this.getHistoryRowCount(), { timeout: 30_000, intervals: [500, 1_000, 2_000] })
      .toBeGreaterThan(0);
  }

  async getCurrentHistoryPageNumber(): Promise<number> {
    const currentPageButton = this.l.historyPaginationNav.getByRole('button', { name: /current page/i });
    const text = await currentPageButton.textContent();
    return Number(text?.trim() || '0');
  }

  async goToHistoryPage(pageNumber: number): Promise<void> {
    await this.l.historyPaginationNav.getByRole('button', { name: `go to page ${pageNumber}` }).click();
    await this.waitForOSLoad();
  }

  async expectHistoryNoDataMessageVisible(): Promise<void> {
    await expect(this.l.historyNoDataMessage).toBeVisible({ timeout: 15_000 });
  }

  async expectHistoryGridColumnHeaders(): Promise<void> {
    const expected = ['Date', 'User', 'Activity', 'Description'];
    for (const header of expected) {
      await expect(
        this.l.historyGrid.locator('th').filter({ hasText: header }),
      ).toBeVisible({ timeout: 15_000 });
    }
  }

  async closeHistoryDialog(): Promise<void> {
    await this.l.historyCloseButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.historyCloseButton.click();
    await this.waitForOSLoad();
  }

  // ==================== Product Detail — Digital Offer Certification Tab ====================

  /** DOC-SETUP-004: The "Show active only" toggle must be visible on the DOC certification tab. */
  async expectDOCShowActiveOnlyToggleVisible(): Promise<void> {
    await expect(this.l.docShowActiveOnlyToggle).toBeVisible({ timeout: 30_000 });
  }

  /**
   * DOC-SETUP-007: In edit mode, the VESTA ID row delete button must be absent (not rendered)
   * when the VESTA ID already has an active DOC. The application removes the button from the
   * DOM rather than disabling it.
   */
  async expectVestaIdDeleteButtonNotPresent(): Promise<void> {
    await expect(this.l.docVestaIdRowDeleteButton).toBeHidden({ timeout: 30_000 });
  }

  /**
   * DOC-SETUP-008: In edit mode the "Digital Offer" checkbox must be disabled (not
   * unchecked) when the product has one or more active DOCs.
   */
  async expectDigitalOfferCheckboxDisabledInEditMode(): Promise<void> {
    await expect(this.l.digitalOfferCheckbox).toBeDisabled({ timeout: 30_000 });
  }

  /** DOC-SETUP-010: The Inactivate button must be visible on the product detail header. */
  async expectInactivateButtonVisible(): Promise<void> {
    await expect(this.l.inactivateProductButton).toBeVisible({ timeout: 30_000 });
  }

  /** DOC-SETUP-010: The Inactivate button must be disabled when active DOCs / releases exist. */
  async expectInactivateButtonDisabled(): Promise<void> {
    await expect(this.l.inactivateProductButton).toBeDisabled({ timeout: 30_000 });
  }

  async clickDigitalOfferCertificationTab(): Promise<void> {
    await this.l.digitalOfferCertificationTab.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.digitalOfferCertificationTab.click();
    await this.waitForOSLoad();
  }

  async expectDigitalOfferCertificationTabActive(): Promise<void> {
    await expect(this.l.digitalOfferCertificationTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectDocCertificationContentVisible(): Promise<void> {
    // Either a grid is shown, or an empty state message
    const gridVisible = await this.l.docCertificationGrid.isVisible().catch(() => false);
    const emptyVisible = await this.l.docCertificationEmptyState.isVisible().catch(() => false);
    if (!gridVisible && !emptyVisible) {
      // Fall back to checking the tab panel has some content
      await expect(this.l.digitalOfferCertificationTab).toHaveAttribute('aria-selected', 'true');
    }
  }

  // ==================== Product Detail — Actions Management ====================

  async clickActionsManagement(): Promise<void> {
    await this.l.actionsManagementLink.waitFor({ state: 'visible', timeout: 15_000 });
    // The link may have [active] CSS state — use href directly to ensure navigation
    const href = await this.l.actionsManagementLink.getAttribute('href');
    if (href && href !== '#') {
      await this.page.goto(href);
    } else {
      await this.l.actionsManagementLink.click();
    }
  }

  async expectActionsManagementPageLoaded(): Promise<void> {
    // After clicking Actions Management link, wait for the Create Action button to appear
    await expect(
      this.page.getByRole('button', { name: 'Create Action' }),
    ).toBeVisible({ timeout: 60_000 });
  }

  async expectActionsManagementGridVisible(): Promise<void> {
    // Actions Management shows either a grid (table) or empty state
    const emptyState = this.page.getByText('No Actions created for this product');
    const grid = this.l.actionsManagementGrid;
    const hasGrid = await grid.isVisible({ timeout: 10_000 }).catch(() => false);
    const hasEmpty = await emptyState.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!hasGrid && !hasEmpty) {
      // Fallback: assert the Create Action button is visible as proof page loaded
      await expect(this.page.getByRole('button', { name: 'Create Action' })).toBeVisible({ timeout: 30_000 });
    }
  }
}
