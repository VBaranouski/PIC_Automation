import { type Page } from '@playwright/test';

export const newProductLocators = (page: Page) => ({
  // Page header
  breadcrumb:     page.getByRole('navigation', { name: 'breadcrumb' }),
  productHeading: page.locator('main').getByText('Product Name').first(),
  productId:      page.getByText(/ID:PIC-\d+/),
  productStatus:  page.getByText('Draft'),

  // Top-level tabs
  productDetailsTab: page.getByRole('tab', { name: 'Product Details', exact: true }),
  releasesTab:       page.getByRole('tab', { name: 'Releases', exact: true }),

  // Releases tab
  noReleasesMessage:      page.getByText('No releases were created yet!'),
  createReleaseButton:    page.getByRole('button', { name: 'Create Release' }),
  // Match both ARIA grid (role="grid") and plain HTML tables — OutSystems renders
  // the releases list as a standard <table> on products with existing releases.
  releasesGrid:           page.getByRole('tabpanel').locator('[role="grid"], table').first(),
  releaseValidationAlert: page.getByRole('alert'),
  requiredFieldError:     page.getByText(/Required field!?|Field is required/i),

  // Create Release dialog
  createReleaseDialog:                  page.getByRole('dialog'),
  newProductReleaseRadio:               page.getByRole('radio', { name: 'New Product Release' }),
  existingProductReleaseRadio:          page.getByRole('radio', { name: 'Existing Product Release' }),
  releaseVersionInput:                  page.getByRole('dialog').getByRole('textbox', { name: 'Release Version*' }),
  targetReleaseDateInput:               page.getByRole('dialog').getByRole('textbox', { name: 'Select a date.' }),
  continuousPenetrationTestingCheckbox: page.getByRole('dialog').getByRole('checkbox', { name: 'Continuous Penetration Testing' }),
  changeSummaryInput:                   page.getByRole('dialog').getByPlaceholder('Enter here a release change summary'),
  resetReleaseFormButton:               page.getByRole('dialog').getByRole('button', { name: 'Reset Form' }),
  cancelReleaseFormButton:              page.getByRole('dialog').getByRole('button', { name: 'Cancel' }),
  createAndScopeButton:                 page.getByRole('dialog').getByRole('button', { name: 'Create & Scope' }),
  createReleaseDateInputs:              page.getByRole('dialog').getByRole('textbox', { name: 'Select a date.' }),
  releaseDateMonthSelect:               page.getByRole('combobox', { name: 'Month' }).last(),
  releaseDateYearSpinbutton:            page.getByRole('spinbutton', { name: 'Year' }).last(),

  // Conditional fields revealed by Create Release dialog interactions.
  // These only appear after specific radio/checkbox selections.
  // NOTE: OutSystems flatpickr date inputs all share the aria-label "Select a date." so we
  //       identify the revealed date field positionally (nth 1 = second date picker in dialog).
  contPenTestContractDateLabel: page.getByRole('dialog').getByText(/Cont\.? Pen Test Contract Date/i).first(),
  wasPenTestPerformedLabel:     page.getByRole('dialog').getByText(/Was pen test performed/i).first(),
  wasPenTestPerformedYesRadio:  page.getByRole('dialog').getByRole('radio', { name: 'Yes' }),
  wasPenTestPerformedNoRadio:   page.getByRole('dialog').getByRole('radio', { name: 'No' }),
  lastPenTestTypeLabel:         page.getByRole('dialog').getByText(/Last Pen Test Type/i).first(),
  lastPenTestDateLabel:         page.getByRole('dialog').getByText(/Last.*Pen Test Date/i).first(),
  lastBuSecurityOfficerFcsrDateLabel: page.getByRole('dialog').getByText(/Last BU Security Officer FCSR Date/i).first(),
  justificationLabel:           page.getByRole('dialog').getByText(/Justification/i).first(),
  // Second-release dialog: "Clone from existing release" / "Create as new" radios
  cloneFromExistingRadio:       page.getByRole('radio', { name: /Clone from existing release/i }),
  createAsNewRadio:             page.getByRole('radio', { name: /Create as new/i }),
  cloneSourceReleaseSelect:     page.getByRole('dialog').getByRole('combobox').first(),
  duplicateReleaseVersionError: page.getByRole('dialog').getByText(/already exist|already exists|already been used|duplicate/i).first(),

  // Releases tab pagination — scoped to the active tabpanel.
  // The OutSystems pagination widget wraps the per-page <select> inside [role="status"].
  releasesTabPerPageSelect:     page.getByRole('tabpanel').getByRole('status').locator('select').first(),
  releasesGridReleaseLinks:     page.getByRole('tabpanel').locator('[role="grid"], table').first().getByRole('link'),

  // Product Related Details section
  sectionTitle:            page.getByText('PRODUCT RELATED DETAILS'),
  productNameInput:        page.getByRole('textbox', { name: 'Product Name*' }),
  productStateSelect:      page.getByRole('combobox', { name: 'Product State*' }),
  productDefinitionSelect: page.getByRole('combobox', { name: 'Product Definition*' }),
  productTypeSelect:       page.getByRole('combobox', { name: 'Product Type*' }),
  // { exact: true } prevents partial match against the tooltip text: "Digital Offer is a commercial offering solution..."
  digitalOfferCheckbox:    page.getByText('Digital Offer', { exact: true }).locator('..').getByRole('checkbox'),
  commercialRefInput:      page.getByRole('textbox', { name: 'Commercial Reference Number' }),
  dataProtectionCheckbox:  page.getByText('Data Protection & Privacy').locator('..').getByRole('checkbox'),
  brandLabelCheckbox:      page.getByText('Brand Label').locator('..').getByRole('checkbox'),

  // Digital Offer Certification (DOC) section — visible only when Digital Offer checkbox is checked
  // Searchboxes are directly exposed in the grid (no edit-link click required, unlike Product Team)
  vestaIdInput:               page.getByRole('textbox', { name: 'VESTA ID*' }),
  docItOwnerSearchBox:        page.getByRole('gridcell', { name: /IT Owner/ }).getByRole('searchbox'),
  docProjectManagerSearchBox: page.getByRole('gridcell', { name: /Project Manager/ }).getByRole('searchbox'),

  // Product Description accordion
  productDescriptionToggle: page.getByRole('button', { name: /PRODUCT DESCRIPTION/ }),
  productDescriptionEditor: page.getByRole('textbox', { name: /Rich Text Editor/ }),

  // Bottom section tabs
  productOrganizationTab:           page.getByRole('tab', { name: /Product Organization/ }),
  productTeamTab:                   page.getByRole('tab', { name: /Product Team/ }),
  securitySummaryTab:               page.getByRole('tab', { name: /Security Summary/ }),
  productConfigurationTab:          page.getByRole('tab', { name: /Product Configuration/ }),
  digitalOfferCertificationTab:     page.getByRole('tab', { name: /Digital Offer Certification/ }),

  // Digital Offer Certification tab content
  docCertificationGrid:       page.getByRole('tabpanel').locator('table').first(),
  docCertificationEmptyState: page.getByText(/No DOC|no certification|No Digital/i).first(),

  // Digital Offer Certification tab — "Show active only" toggle (view mode)
  // Filters out Completed / Cancelled DOC rows when checked (DOC-SETUP-004)
  // The checkbox has no aria-label; scoped by the label text next to it.
  docShowActiveOnlyToggle:    page.getByRole('tabpanel').locator('label').filter({ hasText: /show active only/i }).first(),

  // Digital Offer Certification (DOC) grid in edit mode — delete button per VESTA ID row
  // The button is REMOVED from the DOM (not just disabled) when the VESTA ID has an active DOC
  // (DOC-SETUP-007). Use not.toBeVisible() assertion, not toBeDisabled().
  docVestaIdRowDeleteButton:  page.getByRole('grid').filter({
    has: page.getByRole('textbox', { name: /VESTA ID/i }),
  }).getByRole('button').first(),

  // Product Detail header — Inactivate action button
  // Only visible to users with INACTIVATE_PRODUCT privilege (DOC-SETUP-010)
  inactivateProductButton:    page.getByRole('button', { name: 'Inactivate' }),

  // Product Organization fields
  orgLevel1Select:  page.getByRole('combobox', { name: 'Org Level 1*' }),
  orgLevel2Select:  page.getByRole('combobox', { name: 'Org Level 2*' }),
  orgLevel3Select:  page.getByRole('combobox', { name: /Org Level 3/ }),
  crossOrgCheckbox: page.getByText('Cross-Organizational Development').locator('..').getByRole('checkbox'),

  // Product Team display labels (visible after a person is selected)
  // Note: asterisk is CSS-generated (.mandatory class), not in text content
  productOwnerLabel:    page.getByText('Product Owner', { exact: true }).locator('..').getByText(/^[A-Z][a-z]+ [A-Z]/),
  securityManagerLabel: page.getByText('Security Manager', { exact: true }).locator('..').getByText(/^[A-Z][a-z]+ [A-Z]/),
  sdpaLabel:            page.getByText('Security and Data Protection Advisor', { exact: true }).locator('..').getByText(/^[A-Z][a-z]+ [A-Z]/),
  pqlLabel:             page.getByText('Process Quality Leader', { exact: true }).locator('..').getByText(/^[A-Z][a-z]+ [A-Z]/),

  // Form action buttons
  resetFormButton: page.getByRole('button', { name: 'Reset Form' }),
  cancelButton:    page.getByRole('button', { name: 'Cancel' }),
  saveButton:      page.getByRole('button', { name: 'Save' }),

  // Post-save elements
  editProductButton:    page.getByRole('button', { name: 'Edit Product' }),
  viewHistoryLink:      page.getByRole('link', { name: /View History/ }),
  actionsManagementLink: page.getByRole('link', { name: 'Actions Management' }),

  // Actions Management page
  actionsManagementGrid:    page.locator('table').first(),
  actionsManagementHeading: page.getByRole('heading', { name: /Actions Management/i }).first(),

  // View History popup dialog
  historyDialog:         page.getByRole('dialog').filter({ has: page.getByText('Product Change History') }).first(),
  historyGrid:           page.getByRole('dialog').locator('table').first(),
  historySearchInput:    page.getByRole('dialog').getByRole('searchbox').first(),
  historyActivityFilter: page.getByRole('dialog').getByRole('combobox', { name: 'Activity' }).first(),
  historyDateFromInput:  page.getByRole('dialog').getByRole('textbox', { name: 'Select a date.' }).first(),
  historyDateToInput:    page.getByRole('dialog').getByRole('textbox', { name: 'Select a date.' }).nth(1),
  historySearchButton:   page.getByRole('dialog').getByRole('button', { name: 'Search' }).first(),
  historyResetButton:    page.getByRole('dialog').getByRole('button', { name: 'Reset' }),
  historyPaginationStatus: page.getByRole('dialog').getByRole('status').first(),
  historyPaginationNav:    page.getByRole('dialog').getByRole('navigation', { name: 'Pagination' }).first(),
  historyPerPageSelect:    page.getByRole('dialog').getByRole('status').locator('select').first(),
  historyNoDataMessage:  page.getByRole('dialog').getByText(/No data matching selected filter/i).first(),
  historyCloseButton:    page.getByRole('dialog').locator('.popup-structure-header i.fa-times').first(),

  // Vendor display (disabled in edit mode, text in view mode)
  vendorInput:  page.getByRole('textbox', { name: 'Vendor' }),

  // ── Product Configuration tab — Tracking Tools (Section 3.8) ────────────────
  // Toggle switches for Jira/Jama (IDs are stable OutSystems widget IDs)
  jiraSwitch:              page.locator('#b19-Jira_Switch'),
  jamaSwitch:              page.locator('#b19-Jama_Switch'),

  // Fields that appear after Jira toggle is enabled
  jiraSourceLinkInput:     page.locator('#b19-Input_JiraSourceLink'),
  jiraProjectKeyInput:     page.locator('#b19-Input_JiraAuthenticationKey2'),

  // Field that appears after Jama toggle is enabled
  jamaProjectIdInput:      page.locator('#b19-Input_JamaProjectID'),

  // "Test Connection" button — appears next to whichever toggle is active
  testConnectionButton:    page.getByRole('button', { name: 'Test Connection' }),

  // "Status Mapping Configuration" link — appears next to each active tracking tool
  statusMappingConfigLinks: page.getByText(/Status Mapping Configuration/i),

  // Warning message shown when any tracking tool is enabled without mapping configured
  trackingToolsWarning:    page.getByText(/Please update the mapping configuration/i),

  // Assign Tracking Tools — radio groups (Product requirements)
  productReqNotApplicableRadio: page.locator('#b19-NotApplicable-input'),
  productReqJamaRadio:          page.locator('#b19-Jama-input'),
  productReqJiraRadio:          page.locator('#b19-Jira-input'),

  // Assign Tracking Tools — radio groups (Process requirements)
  processReqNotApplicableRadio: page.locator('#b19-NotApplicable_Process-input'),
  processReqJiraRadio:          page.locator('#b19-Jira_Process-input'),

  // Show Process sub-requirements checkbox
  showProcessSubReqsCheckbox:   page.locator('#b19-SwitchShowProcessReq3'),
});

export type NewProductLocators = ReturnType<typeof newProductLocators>;
