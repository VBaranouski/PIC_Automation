import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { landingLocators, type LandingLocators } from '@locators/landing.locators';
import { waitForOSScreenLoad } from '../helpers/wait.helper';

export type LandingTab = 'My Tasks' | 'My Products' | 'My Releases' | 'My DOCs' | 'Reports & Dashboards';

export class LandingPage extends BasePage {
  readonly url = '/GRC_PICASso/';

  private readonly l: LandingLocators;

  constructor(page: Page) {
    super(page);
    this.l = landingLocators(page);
  }

  // --- Public locator accessors (tests access these directly) ---

  get pageTitle(): Locator            { return this.l.pageTitle; }
  get rolesDelegationLink(): Locator  { return this.l.rolesDelegationLink; }
  get headerLogoLink(): Locator       { return this.l.headerLogoLink; }
  get newProductButton(): Locator     { return this.l.newProductButton; }

  get tabList(): Locator              { return this.l.tabList; }
  get myTasksTab(): Locator           { return this.l.myTasksTab; }
  get myProductsTab(): Locator        { return this.l.myProductsTab; }
  get myReleasesTab(): Locator        { return this.l.myReleasesTab; }
  get myDocsTab(): Locator            { return this.l.myDocsTab; }
  get reportsDashboardsTab(): Locator { return this.l.reportsDashboardsTab; }

  get grid(): Locator               { return this.l.grid; }
  get paginationStatus(): Locator   { return this.l.paginationStatus; }
  get perPageCombobox(): Locator    { return this.l.perPageCombobox; }
  get paginationNav(): Locator      { return this.l.paginationNav; }
  get nextPageButton(): Locator     { return this.l.nextPageButton; }
  get resetButton(): Locator        { return this.l.resetButton; }
  get previousPageButton(): Locator { return this.l.previousPageButton; }

  get tasksSearchBox(): Locator          { return this.l.tasksSearchBox; }
  get tasksReleaseDropdown(): Locator    { return this.l.tasksReleaseDropdown; }
  get tasksProductDropdown(): Locator    { return this.l.tasksProductDropdown; }
  get tasksDateRangePicker(): Locator    { return this.l.tasksDateRangePicker; }
  get tasksShowClosedCheckbox(): Locator { return this.l.tasksShowClosedCheckbox; }
  get tasksAssigneeLabel(): Locator      { return this.l.tasksAssigneeLabel; }

  get productsSearchDropdown(): Locator          { return this.l.productsSearchDropdown; }
  get productsProductIdDropdown(): Locator       { return this.l.productsProductIdDropdown; }
  get productsOrgLevel1Dropdown(): Locator       { return this.l.productsOrgLevel1Dropdown; }
  get productsOrgLevel2Dropdown(): Locator       { return this.l.productsOrgLevel2Dropdown; }
  get productsProductOwnerDropdown(): Locator    { return this.l.productsProductOwnerDropdown; }
  get productsDocLeadDropdown(): Locator         { return this.l.productsDocLeadDropdown; }
  get productsShowActiveOnlyCheckbox(): Locator  { return this.l.productsShowActiveOnlyCheckbox; }

  get releasesSearchDropdown(): Locator          { return this.l.releasesSearchDropdown; }
  get releasesProductDropdown(): Locator         { return this.l.releasesProductDropdown; }
  get releasesDateRangePicker(): Locator         { return this.l.releasesDateRangePicker; }
  get releasesStatusDropdown(): Locator          { return this.l.releasesStatusDropdown; }
  get releasesShowActiveOnlyCheckbox(): Locator  { return this.l.releasesShowActiveOnlyCheckbox; }

  get docsSearchBox(): Locator            { return this.l.docsSearchBox; }
  get docsProductDropdown(): Locator      { return this.l.docsProductDropdown; }
  get docsVestaIdDropdown(): Locator      { return this.l.docsVestaIdDropdown; }
  get docsStatusDropdown(): Locator       { return this.l.docsStatusDropdown; }
  get docsCertDecisionDropdown(): Locator { return this.l.docsCertDecisionDropdown; }
  get docsDocLeadDropdown(): Locator      { return this.l.docsDocLeadDropdown; }

  get reportsOrgLevel1Dropdown(): Locator     { return this.l.reportsOrgLevel1Dropdown; }
  get reportsOrgLevel2Dropdown(): Locator     { return this.l.reportsOrgLevel2Dropdown; }
  get reportsOrgLevel3Dropdown(): Locator     { return this.l.reportsOrgLevel3Dropdown; }
  get reportsProductDropdown(): Locator       { return this.l.reportsProductDropdown; }
  get reportsProductTypeDropdown(): Locator   { return this.l.reportsProductTypeDropdown; }
  get reportsReleaseNumberDropdown(): Locator { return this.l.reportsReleaseNumberDropdown; }
  get reportsMoreFiltersLink(): Locator            { return this.l.reportsMoreFiltersLink; }
  get reportsAccessTableauLink(): Locator           { return this.l.reportsAccessTableauLink; }
  get reportsConfigureColumnsButton(): Locator      { return this.l.reportsConfigureColumnsButton; }
  get reportsDateRangePicker(): Locator             { return this.l.reportsDateRangePicker; }

  // --- Tab navigation ---

  async clickTab(tabName: LandingTab): Promise<void> {
    const tab = this.getTab(tabName);
    // OutSystems renders tabs after AJAX hydration — wait before clicking
    await tab.waitFor({ state: 'visible', timeout: 60_000 });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 30_000 });
    await waitForOSScreenLoad(this.page).catch(() => undefined);

    const panelId = await tab.getAttribute('aria-controls');
    const panel = panelId ? this.page.locator(`#${panelId}`) : this.l.tabPanel.first();

    const gridHeader = panel.getByRole('grid').getByRole('columnheader').first();
    const panelStatus = panel.getByRole('status').first();
    const panelSearchbox = panel.getByRole('searchbox').first();
    const panelCombobox = panel.getByRole('combobox').first();

    await Promise.any([
      gridHeader.waitFor({ state: 'visible', timeout: 30_000 }),
      panelStatus.waitFor({ state: 'visible', timeout: 30_000 }),
      panelSearchbox.waitFor({ state: 'visible', timeout: 30_000 }),
      panelCombobox.waitFor({ state: 'visible', timeout: 30_000 }),
    ]).catch(() => undefined);

    if (await gridHeader.isVisible().catch(() => false)) {
      await this.waitForGridDataRows(30_000).catch(() => undefined);
    }
  }

  getTab(tabName: LandingTab): Locator {
    switch (tabName) {
      case 'My Tasks':              return this.l.myTasksTab;
      case 'My Products':           return this.l.myProductsTab;
      case 'My Releases':           return this.l.myReleasesTab;
      case 'My DOCs':               return this.l.myDocsTab;
      case 'Reports & Dashboards':  return this.l.reportsDashboardsTab;
    }
  }

  // --- Grid helpers ---

  async getRecordCount(): Promise<string> {
    await this.l.paginationStatus.waitFor({ state: 'visible', timeout: 30_000 });
    const statusText = await this.l.paginationStatus.textContent();
    const match = statusText?.match(/(\d+)\s*record(?:s)?/i);
    return match ? match[1] : '0';
  }

  async getGridRowCount(): Promise<number> {
    const total = await this.l.grid.getByRole('row').count();
    return total - 1; // subtract header row
  }

  async changePerPage(value: '10' | '20' | '30' | '50' | '100'): Promise<void> {
    const targetCount = parseInt(value, 10);

    // Wait for the per-page select to be available before interacting
    await this.l.perPageCombobox.waitFor({ state: 'visible', timeout: 15_000 });
    // Allow all pending OutSystems Data Actions to settle before triggering the select.
    // OutSystems wires change-event handlers asynchronously during screen hydration;
    // waiting for network idle ensures the listener is bound before we fire selectOption.
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    // Always call selectOption to ensure OutSystems re-fetches data with the desired page size.
    // The DOM value may already show the target value from a prior session, but the server
    // may not have applied it — forcing selectOption re-triggers the OutSystems Data Action.
    await this.l.perPageCombobox.selectOption(value);
    await waitForOSScreenLoad(this.page);
    // Always wait for the grid to be visible with data after the change.
    await expect(this.l.grid).toBeVisible({ timeout: 30_000 });
    await this.waitForGridDataRows(30_000);
    // Wait for OutSystems to finish loading the full page of data. We poll
    // until the data row count is >= targetCount (or the total record count
    // is smaller than targetCount, meaning all records are shown).
    await expect
      .poll(
        async () => {
          const dataRows = (await this.l.grid.getByRole('row').count()) - 1; // minus header
          const statusText = await this.l.paginationStatus.textContent().catch(() => '');
          const totalMatch = statusText?.match(/(\d+)\s*record/i);
          const total = totalMatch ? parseInt(totalMatch[1], 10) : Infinity;
          // Ready when grid shows expected rows OR all available records are shown
          return dataRows >= Math.min(targetCount, total);
        },
        { timeout: 60_000, intervals: [500, 1000, 2000, 3000] },
      )
      .toBe(true);
  }

  async clickNextPage(): Promise<void> {
    await this.l.nextPageButton.click();
  }

  async clickResetFilters(): Promise<void> {
    await this.l.resetButton.click();
  }

  async getColumnHeaders(): Promise<string[]> {
    const headers = this.l.grid.getByRole('columnheader');
    return headers.allTextContents();
  }

  async getTabNames(): Promise<string[]> {
    return this.l.tabList.getByRole('tab').allTextContents();
  }

  async getGridRowText(rowNumber: number): Promise<string> {
    const row = this.l.grid.getByRole('row').nth(rowNumber);
    await expect(row).toBeVisible({ timeout: 30_000 });
    return (await row.textContent())?.trim() ?? '';
  }

  async clickFirstGridLink(): Promise<void> {
    const link = this.l.grid.getByRole('row').nth(1).getByRole('link').first();
    await expect(link).toBeVisible({ timeout: 15_000 });
    await link.click();
  }

  async clickPreviousPage(): Promise<void> {
    await this.l.previousPageButton.click();
  }

  async getCurrentPageNumber(): Promise<number> {
    const currentPageButton = this.l.paginationNav.getByRole('button', { name: /current page/ });
    const text = await currentPageButton.textContent();
    return Number(text?.trim() || '0');
  }

  async goToPage(pageNumber: number): Promise<void> {
    await this.l.paginationNav.getByRole('button', { name: `go to page ${pageNumber}` }).click();
  }

  // --- My Products — vscomp combobox search helpers ---
  // OutSystems vscomp dropdown renders its listbox at the root DOM level (outside tabpanel).
  // After clicking the combobox, the active search input gets focus.

  async searchAndSelectProductByName(query: string, optionPattern: RegExp): Promise<void> {
    await this.l.productsSearchDropdown.click();
    const searchInput = this.page.locator('.vscomp-search-input:focus');
    await searchInput.waitFor({ timeout: 30_000 });
    await searchInput.pressSequentially(query, { delay: 150 });
    const option = this.page.getByRole('option', { name: optionPattern }).first();
    await option.waitFor({ timeout: 30_000 });
    await option.click();
    await waitForOSScreenLoad(this.page);
  }

  async searchAndSelectProductById(query: string, optionPattern: RegExp): Promise<void> {
    await this.l.productsProductIdDropdown.click();
    const searchInput = this.page.locator('.vscomp-search-input:focus');
    await searchInput.waitFor({ timeout: 30_000 });
    await searchInput.pressSequentially(query, { delay: 150 });
    const option = this.page.getByRole('option', { name: optionPattern }).first();
    await option.waitFor({ timeout: 60_000 });
    await option.click();
    await waitForOSScreenLoad(this.page);
  }

  private async getVirtualComboboxContainer(combobox: Locator): Promise<Locator> {
    const controlsId = await combobox.getAttribute('aria-controls');
    expect(controlsId, 'Virtual combobox should expose aria-controls').toBeTruthy();
    return this.page.locator(`#${controlsId!}`);
  }

  private normalizeVirtualOptionText(text: string | null): string {
    return (text ?? '').replace(/\s+/g, ' ').trim();
  }

  private async evaluateVirtualOptionSelection(
    combobox: Locator,
    matcher?: string | RegExp,
  ): Promise<string | null> {
    await combobox.click().catch(() => undefined);

    const matcherPayload = matcher == null
      ? null
      : typeof matcher === 'string'
        ? { type: 'string' as const, value: matcher }
        : { type: 'regex' as const, source: matcher.source, flags: matcher.flags };

    return combobox.evaluate((element, payload) => {
      const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();
      const controlsId = element.getAttribute('aria-controls');
      if (!controlsId) {
        return null;
      }

      const container = document.getElementById(controlsId);
      if (!container) {
        return null;
      }

      const options = Array.from(container.querySelectorAll<HTMLElement>('.vscomp-option'))
        .map((option) => ({ option, text: normalize(option.textContent) }))
        .filter(({ text, option }) => text && text !== '-' && !/^select all$/i.test(text) && !option.classList.contains('disabled') && !option.classList.contains('group-title'));

      const match = options.find(({ text }) => {
        if (!payload) {
          return true;
        }
        if (payload.type === 'string') {
          return text.toLowerCase().includes(payload.value.toLowerCase());
        }
        return new RegExp(payload.source, payload.flags).test(text);
      });

      if (!match) {
        return null;
      }

      match.option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return match.text;
    }, matcherPayload);
  }

  private async clickVirtualOption(option: Locator): Promise<void> {
    try {
      await option.click({ force: true, timeout: 5_000 });
    } catch {
      await option.evaluate((element) => {
        (element as HTMLElement).click();
      });
    }
  }

  private async findVirtualOption(container: Locator, optionLabel: string | RegExp): Promise<{ option: Locator; text: string } | null> {
    const options = container.locator('.vscomp-option:not(.disabled):not(.group-title)');
    const optionCount = await options.count();

    for (let index = 0; index < optionCount; index++) {
      const option = options.nth(index);
      const optionText = this.normalizeVirtualOptionText(await option.textContent());
      if (!optionText || optionText === '-' || /^select all$/i.test(optionText)) {
        continue;
      }

      const matches = typeof optionLabel === 'string'
        ? optionText.toLowerCase().includes(optionLabel.toLowerCase())
        : optionLabel.test(optionText);

      if (matches) {
        return { option, text: optionText };
      }
    }

    return null;
  }

  async selectVirtualComboboxOption(combobox: Locator, optionLabel: string | RegExp): Promise<void> {
    await combobox.waitFor({ state: 'visible', timeout: 30_000 });
    const matchText = await this.evaluateVirtualOptionSelection(combobox, optionLabel);
    expect(matchText, `No virtual combobox option matched ${String(optionLabel)}`).toBeTruthy();
    await waitForOSScreenLoad(this.page);
  }

  async selectFirstVirtualComboboxOption(combobox: Locator): Promise<string | null> {
    await combobox.waitFor({ state: 'visible', timeout: 30_000 });
    const optionText = await this.evaluateVirtualOptionSelection(combobox);
    await waitForOSScreenLoad(this.page);
    return optionText;
  }

  async filterDocsByStatus(status: string): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.docsStatusDropdown, status);
    await this.waitForGridDataRows();
  }

  async filterDocsByProduct(option: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.docsProductDropdown, option);
    await this.waitForGridDataRows();
  }

  async filterDocsByCertDecision(decision: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.docsCertDecisionDropdown, decision);
    await this.waitForGridDataRows();
  }

  async filterDocsByVestaId(option: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.docsVestaIdDropdown, option);
    await this.waitForGridDataRows();
  }

  async filterDocsByDocLead(option: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.docsDocLeadDropdown, option);
    await this.waitForGridDataRows();
  }

  async searchDocsByName(query: string): Promise<void> {
    await this.l.docsSearchBox.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.docsSearchBox.fill(query);
    await this.l.docsSearchBox.press('Enter');
    await waitForOSScreenLoad(this.page);
    await this.waitForGridDataRows();
  }

  /**
   * Types a query that is expected to return no results, then waits for the
   * grid to stabilise. Returns the visible empty-state cell text.
   */
  async searchDocsByNameExpectEmpty(query: string): Promise<void> {
    await this.l.docsSearchBox.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.docsSearchBox.fill(query);
    await this.l.docsSearchBox.press('Enter');
    await waitForOSScreenLoad(this.page);
  }

  /** Asserts the My DOCs grid shows an empty-state message (no matching records). */
  async expectDocsGridEmptyState(): Promise<void> {
    const emptyState = await this.l.docsSearchBox.evaluate((searchbox) => {
      const panel = searchbox.closest('[role="tabpanel"]');
      const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();
      const panelText = normalize(panel?.textContent);
      const grid = panel?.querySelector('[role="grid"]');
      const rowCount = grid?.querySelectorAll('[role="row"]').length ?? 0;
      const emptyCellText = normalize(
        Array.from(grid?.querySelectorAll('td') ?? [])
          .map((cell) => cell.textContent)
          .find((text) => /no .*(found|results|data|certifications)/i.test(text ?? '')),
      );

      return {
        hasPanel: !!panel,
        hasGrid: !!grid,
        rowCount,
        panelText,
        emptyCellText,
      };
    });

    expect(emptyState.hasPanel, 'My DOCs search box should be inside a tabpanel').toBe(true);

    if (!emptyState.hasGrid || emptyState.rowCount <= 1) {
      return;
    }

    if (/no digital offer certifications created yet|no .*(found|results|data|certifications)/i.test(emptyState.panelText)) {
      return;
    }

    expect(
      /no .*(found|results|data|certifications)/i.test(emptyState.emptyCellText),
      'Expected My DOCs empty state banner or no-results grid cell',
    ).toBe(true);
  }

  async searchTasksByName(query: string): Promise<void> {
    await this.l.tasksSearchBox.waitFor({ state: 'visible', timeout: 30_000 });
    await this.l.tasksSearchBox.fill(query);
    await this.l.tasksSearchBox.press('Enter');
    await waitForOSScreenLoad(this.page);
    await expect(this.l.grid).toBeVisible({ timeout: 30_000 });
  }

  async clearTasksSearch(): Promise<void> {
    await this.l.tasksSearchBox.fill('');
    await this.l.tasksSearchBox.press('Enter');
    await waitForOSScreenLoad(this.page);
  }

  async filterReleasesBySearch(query: string, optionPattern: RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.releasesSearchDropdown, optionPattern);
    await this.waitForGridDataRows();
  }

  async filterReleasesByStatus(status: string): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.releasesStatusDropdown, status);
    await this.waitForGridDataRows();
  }

  async filterProductsByOrgLevel1(option: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.productsOrgLevel1Dropdown, option);
    await this.waitForGridDataRows();
  }

  async filterProductsByOrgLevel2(option: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.productsOrgLevel2Dropdown, option);
    await this.waitForGridDataRows();
  }

  async filterReleasesByProduct(option: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.releasesProductDropdown, option);
    await this.waitForGridDataRows();
  }

  async filterTasksByRelease(option: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.tasksReleaseDropdown, option);
    await waitForOSScreenLoad(this.page);
    await expect(this.l.grid).toBeVisible({ timeout: 30_000 });
  }

  async filterTasksByProduct(option: string | RegExp): Promise<void> {
    await this.selectVirtualComboboxOption(this.l.tasksProductDropdown, option);
    await waitForOSScreenLoad(this.page);
    await expect(this.l.grid).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Click the "Latest Release" link in the given My Products grid row.
   * Products grid: Link 0 = product name, Link 1 = latest release version.
   */
  async clickLatestReleaseAtRow(rowNumber = 1): Promise<void> {
    const link = this.getProductRow(rowNumber).getByRole('link').nth(1);
    await link.waitFor({ state: 'visible', timeout: 30_000 });
    await link.click();
    await waitForOSScreenLoad(this.page);
  }

  /**
   * Return the href of the Latest Release link at a given row, or null if not present.
   */
  async getLatestReleaseLinkAtRow(rowNumber = 1): Promise<string | null> {
    const link = this.getProductRow(rowNumber).getByRole('link').nth(1);
    const count = await link.count();
    if (count === 0) return null;
    return link.getAttribute('href');
  }

  /**
   * Open the 3-dot actions popover for the given My Products / My Releases grid row.
   * The popover button uses class `.popover-top` (renders with `.fa-ellipsis-v` icon).
   */
  async clickActionsMenuAtRow(rowNumber = 1): Promise<void> {
    const popoverBtn = this.l.grid.getByRole('row').nth(rowNumber).locator('.popover-top').first();
    await popoverBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await popoverBtn.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * After opening the actions popover, verify the given option text is visible.
   */
  async expectActionsMenuOptionVisible(optionText: string): Promise<void> {
    const option = this.page.locator('.popover-content, .popover, [class*="popover"]')
      .filter({ hasText: optionText })
      .first();
    await expect(option).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Click the first release-name link in My Releases grid (navigates to Release Detail).
   * Release grid: Link 0 = release name → ReleaseDetail?ReleaseId=...
   */
  async clickFirstReleaseName(): Promise<void> {
    await this.clickFirstGridLink();
  }

  // --- My Products — grid row helpers ---

  async waitForGridDataRows(timeout = 30_000): Promise<void> {
    await this.l.grid.getByRole('row').nth(1).waitFor({ state: 'visible', timeout });
  }

  async openMyProductsTab(timeout = 60_000): Promise<void> {
    await this.goto();
    await this.expectPageLoaded({ timeout });
    await this.clickTab('My Products');
    await this.waitForGridDataRows();
  }

  getProductRow(rowNumber = 1): Locator {
    return this.l.grid.getByRole('row').nth(rowNumber);
  }

  getProductLink(rowNumber = 1): Locator {
    return this.getProductRow(rowNumber).getByRole('link').first();
  }

  getFirstProductLink(): Locator {
    return this.getProductLink(1);
  }

  async getProductNameAtRow(rowNumber = 1): Promise<string> {
    const link = this.getProductLink(rowNumber);
    await link.waitFor({ state: 'visible', timeout: 30_000 });
    const linkText = (await link.innerText()).trim();
    if (linkText) {
      return linkText;
    }

    return (await this.getProductRow(rowNumber).getByRole('gridcell').nth(3).innerText()).trim();
  }

  async getProductIdAtRow(rowNumber = 1): Promise<string> {
    const rowText = await this.getProductRow(rowNumber).textContent();
    return rowText?.match(/PIC-\d+/)?.[0] ?? '';
  }

  async getFirstProductName(): Promise<string> {
    return this.getProductNameAtRow(1);
  }

  async clickProductAtRow(rowNumber = 1): Promise<void> {
    const link = this.getProductLink(rowNumber);
    await link.click();
    await waitForOSScreenLoad(this.page);
  }

  async clickFirstProduct(): Promise<void> {
    await this.clickProductAtRow(1);
  }

  async toggleShowActiveOnly(): Promise<void> {
    const isChecked = await this.l.productsShowActiveOnlyCheckbox.isChecked();
    await this.l.productsShowActiveOnlyCheckbox.setChecked(!isChecked);
    await waitForOSScreenLoad(this.page);
    await expect(this.l.grid).toBeVisible({ timeout: 30_000 });
  }

  async toggleTasksShowClosed(): Promise<void> {
    await this.l.tasksShowClosedCheckbox.click();
    await waitForOSScreenLoad(this.page);
    await expect(this.l.grid).toBeVisible({ timeout: 30_000 });
  }

  async toggleReleasesShowActiveOnly(): Promise<void> {
    await this.l.releasesShowActiveOnlyCheckbox.click();
    await waitForOSScreenLoad(this.page);
    await expect(this.l.grid).toBeVisible({ timeout: 30_000 });
  }

  async resetFilters(): Promise<void> {
    await this.l.resetButton.click();
    await waitForOSScreenLoad(this.page);

    const activePanel = this.page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
    await Promise.any([
      this.l.grid.waitFor({ state: 'visible', timeout: 30_000 }),
      activePanel.getByRole('status').first().waitFor({ state: 'visible', timeout: 30_000 }),
      activePanel.getByRole('searchbox').first().waitFor({ state: 'visible', timeout: 30_000 }),
      activePanel.getByRole('combobox').first().waitFor({ state: 'visible', timeout: 30_000 }),
    ]).catch(() => undefined);
  }

  async clickNewProduct(): Promise<void> {
    for (let attempt = 1; attempt <= 5; attempt++) {
      await this.page.waitForURL(/GRC_PICASso|_error\.html/, { timeout: 30_000 }).catch(() => undefined);
      await waitForOSScreenLoad(this.page).catch(() => undefined);

      if (this.page.url().includes('/_error.html')) {
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(2_000);
        continue;
      }

      const buttonVisible = await this.l.newProductButton
        .isVisible({ timeout: 10_000 })
        .catch(() => false);

      if (buttonVisible) {
        await this.l.newProductButton.click();
        return;
      }

      await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
      await this.page.waitForTimeout(2_000);
    }

    throw new Error(`New Product button did not become available from landing page. Current URL: ${this.page.url()}`);
  }

  // --- Assertions ---

  async expectPageLoaded(options?: { timeout?: number }): Promise<void> {
    const timeout = options?.timeout ?? 60_000;
    await this.l.pageTitle.waitFor({ timeout });
    await expect(this.page).toHaveURL(/.*GRC_PICASso/, { timeout });
  }

  async expectUserDisplayed(login: string): Promise<void> {
    await expect(this.page.getByText(login, { exact: true }).first()).toBeVisible();
  }

  async expectNavigationMenuVisible(): Promise<void> {
    await expect(this.l.homePageMenuItem).toBeVisible();
  }

  async expectTabsPresent(): Promise<void> {
    await expect(this.l.myTasksTab).toBeVisible();
    await expect(this.l.myProductsTab).toBeVisible();
    await expect(this.l.myReleasesTab).toBeVisible();
  }

  async expectTabsVisible(): Promise<void> {
    await expect(this.l.myTasksTab).toBeVisible();
    await expect(this.l.myProductsTab).toBeVisible();
    await expect(this.l.myReleasesTab).toBeVisible();
    await expect(this.l.myDocsTab).toBeVisible();
    await expect(this.l.reportsDashboardsTab).toBeVisible();
  }

  async expectTabActive(tab: LandingTab): Promise<void> {
    await expect(this.getTab(tab)).toHaveAttribute('aria-selected', 'true');
  }

  async expectTabpanelVisible(): Promise<void> {
    await expect(this.l.tabPanel).toBeVisible();
  }

  async expectGridVisible(): Promise<void> {
    await expect(this.l.grid).toBeVisible();
  }

  async expectColumnHeadersExist(): Promise<void> {
    await expect(this.l.grid.getByRole('columnheader').first()).toBeVisible();
  }

  async expectColumnHeadersContain(expected: string[]): Promise<void> {
    const headers = await this.getColumnHeaders();
    const normalizedHeaders = headers.map((header) => header.trim().toLowerCase());
    for (const header of expected) {
      expect(normalizedHeaders).toContain(header.trim().toLowerCase());
    }
  }

  async expectGridHasRows(): Promise<void> {
    await this.waitForGridDataRows();
  }

  async expectRecordCountGreaterThan(n: number): Promise<void> {
    await expect.poll(async () => Number(await this.getRecordCount())).toBeGreaterThan(n);
  }

  async expectRecordCountLessThan(n: number, timeout = 30_000): Promise<void> {
    await expect.poll(
      async () => Number(await this.getRecordCount()),
      { timeout },
    ).toBeLessThan(n);
  }

  async expectRecordCountAtLeast(n: number, timeout = 30_000): Promise<void> {
    await expect.poll(
      async () => Number(await this.getRecordCount()),
      { timeout },
    ).toBeGreaterThanOrEqual(n);
  }

  async expectDefaultPageSize(): Promise<number> {
    // Wait for at least one data row before reading count
    await this.waitForGridDataRows();
    const rowCount = await this.getGridRowCount();
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(10);
    return rowCount;
  }

  async expectRowCountAtLeast(n: number): Promise<void> {
    // nth(n) checks that at least n data rows exist (header is at index 0)
    await expect(this.l.grid.getByRole('row').nth(n)).toBeVisible();
  }

  async expectCurrentPageNumber(expected: number): Promise<void> {
    // The active pagination button has "current page" in its accessible name
    await expect(
      this.l.paginationNav.getByRole('button', { name: /current page/ }),
    ).toContainText(String(expected));
  }

  async expectTasksFiltersVisible(): Promise<void> {
    await expect(this.l.tasksSearchBox).toBeVisible();
    await expect(this.l.tasksDateRangePicker).toBeVisible();
    await expect(this.l.tasksShowClosedCheckbox).toBeVisible();
    await expect(this.l.resetButton).toBeVisible();
  }

  async expectProductsShowActiveOnlyChecked(): Promise<void> {
    await expect(this.l.productsShowActiveOnlyCheckbox).toBeChecked();
  }

  async expectProductsShowActiveOnlyUnchecked(): Promise<void> {
    await expect(this.l.productsShowActiveOnlyCheckbox).not.toBeChecked();
  }

  async expectReleasesShowActiveOnlyChecked(): Promise<void> {
    await expect(this.l.releasesShowActiveOnlyCheckbox).toBeChecked();
  }

  async expectReleasesShowActiveOnlyUnchecked(): Promise<void> {
    await expect(this.l.releasesShowActiveOnlyCheckbox).not.toBeChecked();
  }

  async expectDocsFiltersVisible(): Promise<void> {
    await expect(this.l.docsSearchBox).toBeVisible();
    await expect(this.l.docsProductDropdown).toBeVisible();
    await expect(this.l.docsVestaIdDropdown).toBeVisible();
    await expect(this.l.docsStatusDropdown).toBeVisible();
    await expect(this.l.docsCertDecisionDropdown).toBeVisible();
    await expect(this.l.docsDocLeadDropdown).toBeVisible();
    await expect(this.l.resetButton).toBeVisible();
  }

  async expectAccessTableauLinkVisible(): Promise<void> {
    await expect(this.l.reportsAccessTableauLink).toBeVisible();
  }

  async clickReportsConfigureColumns(): Promise<void> {
    await this.l.reportsConfigureColumnsButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.reportsConfigureColumnsButton.click();
    await waitForOSScreenLoad(this.page).catch(() => undefined);
  }

  async expectReportsColumnConfigVisible(): Promise<void> {
    const activePanel = this.page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
    const doneBtn = activePanel.getByRole('button', { name: /^done$/i });
    await expect(doneBtn).toBeVisible({ timeout: 15_000 });
  }

  async clickReportsColumnConfigDone(): Promise<void> {
    const activePanel = this.page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
    await activePanel.getByRole('button', { name: /^done$/i }).click();
    await waitForOSScreenLoad(this.page).catch(() => undefined);
    await expect(this.l.grid).toBeVisible({ timeout: 30_000 });
  }

  async clickReportsColumnConfigCancel(): Promise<void> {
    const activePanel = this.page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
    await activePanel.getByRole('button', { name: /^cancel$/i }).click();
    await waitForOSScreenLoad(this.page).catch(() => undefined);
  }

  async clickReportsColumnConfigRestoreDefault(): Promise<void> {
    const activePanel = this.page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first();
    await activePanel.getByRole('button', { name: /restore default/i }).click();
    await waitForOSScreenLoad(this.page).catch(() => undefined);
  }

  async clickReportsMoreFilters(): Promise<void> {
    await this.l.reportsMoreFiltersLink.waitFor({ state: 'visible', timeout: 15_000 });
    await this.l.reportsMoreFiltersLink.click();
    await waitForOSScreenLoad(this.page).catch(() => undefined);
  }

  async filterReportsByOrgLevel1(option?: string | RegExp): Promise<string | null> {
    return this.selectFirstVirtualComboboxOption(this.l.reportsOrgLevel1Dropdown);
  }

  async filterReportsByOrgLevel2(option?: string | RegExp): Promise<string | null> {
    return this.selectFirstVirtualComboboxOption(this.l.reportsOrgLevel2Dropdown);
  }

  async filterReportsByProduct(option?: string | RegExp): Promise<string | null> {
    return this.selectFirstVirtualComboboxOption(this.l.reportsProductDropdown);
  }

  async filterReportsByProductType(option?: string | RegExp): Promise<string | null> {
    return this.selectFirstVirtualComboboxOption(this.l.reportsProductTypeDropdown);
  }

  async filterReportsByReleaseNumber(option?: string | RegExp): Promise<string | null> {
    return this.selectFirstVirtualComboboxOption(this.l.reportsReleaseNumberDropdown);
  }

  async expectTasksGridEmptyState(): Promise<void> {
    await expect
      .poll(
        async () => {
          const rowCount = (await this.l.grid.getByRole('row').count()) - 1; // minus header
          return rowCount;
        },
        { timeout: 30_000, intervals: [500, 1000, 2000] },
      )
      .toBeLessThanOrEqual(0);
  }

  async expectMoreFiltersLinkVisible(): Promise<void> {
    await expect(this.l.reportsMoreFiltersLink).toBeVisible();
  }

  async expectResetButtonVisible(): Promise<void> {
    await expect(this.l.resetButton).toBeVisible();
  }

  async expectMyTasksSelectedByDefault(): Promise<void> {
    await expect(this.l.myTasksTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectShowClosedTasksUncheckedByDefault(): Promise<void> {
    await expect(this.l.tasksShowClosedCheckbox).not.toBeChecked();
  }

  async expectMyTasksAllColumnsPresent(): Promise<void> {
    const requiredColumns = [
      'Name', 'Description', 'Product', 'Release', 'VESTA Id', 'PROCESS TYPE',
      'Assignee', 'DOC Lead', 'product owner', 'security manager',
    ];
    await this.expectColumnHeadersContain(requiredColumns);
    // Verify Status column present (case-insensitive, may render as "STatus")
    const headers = await this.getColumnHeaders();
    const hasStatus = headers.some(h => h.trim().toLowerCase() === 'status' || h.trim().toLowerCase() === 'status');
    expect(hasStatus, 'Expected a "Status" column to be visible in My Tasks grid').toBe(true);
  }

  async expectNewProductButtonVisible(): Promise<void> {
    await expect(this.l.newProductButton).toBeVisible();
  }

  async clickNewProductButton(): Promise<void> {
    await this.l.newProductButton.click();
  }

  async expectRolesDelegationLinkVisible(): Promise<void> {
    await expect(this.l.rolesDelegationLink).toBeVisible();
  }

  async expectHeaderLogoVisible(): Promise<void> {
    await expect(this.l.headerLogoLink).toBeVisible();
  }

  async clickHeaderLogo(): Promise<void> {
    await this.l.headerLogoLink.click();
  }

  // ==================== Tasks Date Range ====================

  async expectTasksDateRangePickerVisible(): Promise<void> {
    await expect(this.l.tasksDateRangePicker).toBeVisible({ timeout: 15_000 });
  }

  // ==================== Releases Date Range ====================

  async expectReleasesDateRangePickerVisible(): Promise<void> {
    await expect(this.l.releasesDateRangePicker).toBeVisible({ timeout: 15_000 });
  }

  // ==================== Tasks Assignee ====================

  async expectTasksAssigneeComboboxVisible(): Promise<void> {
    // The "Assignee" on My Tasks is a read-only label showing the current user — not an interactive combobox
    await expect(this.l.tasksAssigneeLabel).toBeVisible({ timeout: 15_000 });
  }
}
