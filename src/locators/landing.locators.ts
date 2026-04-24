import { type Page } from '@playwright/test';

export const landingLocators = (page: Page) => ({
  activeTabPanel:       page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first(),
  // Header
  pageTitle:           page.locator('text=PICASso - Landing Page').first(),
  rolesDelegationLink: page.getByRole('link', { name: 'Roles Delegation' }),
  homePageMenuItem:    page.getByRole('menuitem', { name: 'Home Page' }),
  newProductButton:    page.getByRole('button', { name: 'New Product' }),
  headerLogoLink:      page.locator('a[href*="PICASso/HomePage"], a[href*="PICASso/"]').first(),
  tabPanel:            page.getByRole('tabpanel'),

  // Tabs
  tabList:               page.getByRole('tablist'),
  myTasksTab:            page.getByRole('tab', { name: 'My Tasks' }),
  myProductsTab:         page.getByRole('tab', { name: 'My Products' }),
  myReleasesTab:         page.getByRole('tab', { name: 'My Releases' }),
  myDocsTab:             page.getByRole('tab', { name: 'My DOCs' }),
  reportsDashboardsTab:  page.getByRole('tab', { name: 'Reports & Dashboards' }),

  // Common grid elements (scoped to active tabpanel)
  // Note: the per-page <select> uses numeric values (0-4) for options (10/20/30/50/100).
  // Playwright's selectOption() matches by option label text, so passing '100' works.
  // We scope to the non-hidden tabpanel to avoid hitting the previously-active panel.
  grid:               page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('grid'),
  paginationStatus:   page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('status'),
  perPageCombobox:    page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('status').locator('select'),
  paginationNav:      page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('navigation', { name: 'Pagination' }),
  nextPageButton:     page.getByRole('button', { name: 'go to next page' }),
  resetButton:        page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('button', { name: 'Reset' }),
  previousPageButton: page.getByRole('button', { name: 'go to previous page' }),

  // My Tasks filters
  tasksSearchBox:          page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('searchbox', { name: 'Search' }),
  tasksReleaseDropdown:    page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').first(),
  tasksProductDropdown:    page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(1),
  tasksDateRangePicker:    page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('textbox', { name: 'Select a date.' }),
  tasksShowClosedCheckbox: page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('checkbox'),
  tasksAssigneeLabel:      page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByText('Assignee', { exact: true }).first(),

  // My Products filters
  productsSearchDropdown:          page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').first(),
  productsProductIdDropdown:       page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(1),
  productsOrgLevel1Dropdown:       page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(2),
  productsOrgLevel2Dropdown:       page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(3),
  productsProductOwnerDropdown:    page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(4),
  productsDocLeadDropdown:         page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(5),
  productsShowActiveOnlyCheckbox:  page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().locator('input[type="checkbox"][id*="ShowActiveOnly"]'),

  // My Releases filters
  releasesSearchDropdown:          page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').first(),
  releasesProductDropdown:         page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(1),
  releasesDateRangePicker:         page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByPlaceholder(''),
  releasesStatusDropdown:          page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(2),
  releasesShowActiveOnlyCheckbox:  page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().locator('input[type="checkbox"][id*="ShowActiveOnly"]'),

  // My DOCs filters
  docsSearchBox:            page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('searchbox', { name: 'Search by DOC name' }),
  docsProductDropdown:      page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').first(),
  docsVestaIdDropdown:      page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(1),
  docsStatusDropdown:       page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(2),
  docsCertDecisionDropdown: page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(3),
  docsDocLeadDropdown:      page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(4),
  // Empty-state row rendered by the grid when a search/filter returns no matches
  docsGridEmptyState:       page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('grid').locator('td, [class*="no-data"], [class*="empty"]').first(),

  // Reports & Dashboards filters
  reportsOrgLevel1Dropdown:     page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').first(),
  reportsOrgLevel2Dropdown:     page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(1),
  reportsOrgLevel3Dropdown:     page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(2),
  reportsProductDropdown:       page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(3),
  reportsProductTypeDropdown:   page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(4),
  reportsReleaseNumberDropdown: page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('combobox').nth(5),
  reportsMoreFiltersLink:           page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('link', { name: 'More Filters' }),
  reportsAccessTableauLink:         page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('link', { name: 'Access Tableau' }),
  reportsConfigureColumnsButton:    page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('button', { name: /configure columns/i }),
  reportsDateRangePicker:           page.locator('[role="tabpanel"]:not([aria-hidden="true"])').first().getByRole('textbox').first(),
});

export type LandingLocators = ReturnType<typeof landingLocators>;
