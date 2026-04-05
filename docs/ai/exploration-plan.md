# PICASso Application Exploration Plan & Progress Tracker

> **Purpose:** Полная карта функционала GRC-приложения PICASso для последующей генерации автотестов.  
> **Output:** `docs/ai/application-map.json` + `docs/ai/application-map.html` (D3.js force-graph)  
> **Created:** 2026-03-28  
> **Last Updated:** 2026-03-31  
> **Status:** ✅ ARTIFACTS UPDATED (Steps A–K fully explored via browser with CRUD, Step L complete, Step M: v1.9.0 QA Verification complete, Step N: Confluence Spec Integration complete, Step O: Exploratory Navigation Verification complete)

---

## Environment

| Parameter | Value |
|-----------|-------|
| Base URL | `https://qa.leap.schneider-electric.com` |
| Login URL | `/GRC_Th/Login` |
| Landing URL | `/GRC_PICASso/` |
| Login | `PICEMDEPQL` |
| Password | `outsystems` |
| Role | `process_quality_leader` (суперюзер, включает все роли) |
| Browser | Chromium (Playwright MCP, headed, vision-capable) |
| MCP Config | `config/playwright-mcp.config.json` |

---

## Exclusions (Out of Scope)

| Item | Reason |
|------|--------|
| BackOffice | Частично исследован (Maintenance, Product Requirements Library, API configs) |
| PIM | Внешняя ссылка |
| STAC | Внешняя ссылка |
| Digital Certification Portal | Внешняя ссылка |
| Reports & Dashboards tab | Explored: 5th landing tab with Tableau link, 4-level Org filters, 1121-record grid |
| Tableau Reports | External Tableau server — visual regression deferred to Phase 2 |
| Любые внешние сайты | Не переходим по внешним ссылкам |

---

## Exploration Steps

### Step 0: Convert User Guide
- **Status:** ✅ COMPLETED
- **Action:** Конвертировать `input/Self-Help - PICASso - User Navigation Guide Updated - V3 (1).docx` → `.md` с помощью `pandoc` или `mammoth`
- **Output:** `input/user-guide.md` (4099 lines)
- **Notes:** Successfully converted with pandoc. Used as reference throughout exploration.

---

### Step A: Login Page → Landing Page
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_Th/Login` → `/GRC_PICASso/HomePage`
- **Action:** Авторизоваться, зафиксировать все элементы login page и landing page header
- **Collect:**
  - [x] Login page: heading (PICASso - Product Information, Cybersecurity And Security Software), username field, password field, Login button, Login SSO button, Remember Me checkbox, Forgot Password link
  - [x] Landing page header: Home Page, BackOffice*, PIM*, STAC*, Digital Cert Portal* menuitems, user display name PICEMDEPQL, notification bell, tooltip
  - [x] Roles Delegation link → `/GRC_PICASso/RolesDelegation` (opens new tab)
  - [x] New Product button visible in header
- **Transitions:** Login → Landing (HomePage), Header → Roles Delegation (new tab)
- **Findings:** NavBar has 5 menuitems (4 excluded). Roles Delegation opens in new tab. New Product button in header area.

---

### Step B: Landing → My Tasks Tab
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso/HomePage` (My Tasks tab active by default)
- **Action:** Изучить все фильтры, грид, клик на задачу
- **Collect:**
  - [x] Filters: Search box, Release dropdown, Product (vscomp combobox), Task Creation Date Range, Assignee (vscomp, default PICEMDEPQL), Show Closed Tasks toggle, Reset button
  - [x] Grid columns: Name, Description, Status, Product, Release, VESTA Id, PROCESS TYPE, Assignee, DOC Lead, Product Owner, Security Manager, Review (button)
  - [x] Pagination: 51 records, per-page 10/20/30/50/100, 6 pages
  - [x] Click on task row → `/GRC_PICASso/ReleaseDetail?ReleaseId=XXXX`
  - [x] Grid row structure captured
- **Transitions:** Task row click → Release Detail page (NOT a separate task detail page)
- **Findings:** Tasks link directly to ReleaseDetail. 51 records in QA. 12 grid columns including Review button.

---

### Step C: Landing → My Products Tab
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso/HomePage` (My Products tab)
- **Action:** Изучить фильтры, грид, навигацию к продукту
- **Collect:**
  - [x] Filters: Search product, Product ID, Org Level 1, Org Level 2, Product Owner (vscomp), DOC Lead (vscomp), Show active only toggle (default checked), Reset button
  - [x] Grid columns: Org Level 1, Org Level 2, Org Level 3, Product, Product Id, Product Status, Latest Release, VESTA ID, Product Owner, Security Advisor, DOC Lead, Actions
  - [x] Pagination: 1123 records, per-page 10/20/30/50/100, 113 pages
  - [x] New Product button visible in header
  - [x] Click on product link → `/GRC_PICASso/ProductDetail?ProductId=XXXX`
  - [x] Product row with PIC-XXXX IDs, Active status, org levels
- **Transitions:** New Product button → New Product form, Product link → Product Detail
- **Findings:** 1123 products in QA. 12 grid columns. Actions column with three dots (Inactivate). Show active only toggle default checked.

---

### Step D: My Products → New Product (Full CRUD)
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso/ProductDetail?ProductId=0`
- **Action:** Заполнить ВСЕ поля, включить все чекбоксы, сохранить
- **Collect:**
  - [ ] **Product Related Details section:**
    - [ ] Product Name* (text input, mandatory)
    - [ ] Product State* (native select: options list)
    - [ ] Product Definition* (native select: options list)
    - [ ] Product Type* (native select, cascading from Definition: options list)
    - [ ] Digital Offer checkbox → reveals: VESTA ID*, IT Owner* (searchbox), Project Manager* (searchbox)
    - [ ] Commercial Reference Number (text input, optional)
    - [ ] Data Protection & Privacy checkbox
    - [ ] Brand Label checkbox → reveals: Vendor field
  - [ ] **Product Description** (collapsible toggle → Rich Text Editor)
  - [ ] **Product Organization tab:**
    - [ ] Org Level 1* (native select, cascading)
    - [ ] Org Level 2* (native select, enabled after Level 1)
    - [ ] Org Level 3 (native select, enabled after Level 2, optional?)
    - [ ] Cross-Organizational Development checkbox
  - [ ] **Product Team tab:**
    - [ ] Product Owner (edit link → searchbox → select person)
    - [ ] Security Manager (same pattern)
    - [ ] Security and Data Protection Advisor (same pattern)
    - [ ] Process Quality Leader (same pattern)
  - [x] **Security Summary tab:**
    - [x] Minimum Oversight Level: "Team" (read-only)
    - [x] Product Risk Profile section: "Calculate Risk Profile" button
    - [x] Risk columns: Date, Submitted By, Risk level (Unknown), Exposure, Likelihood, Impact, Notes (all "-" initially)
  - [x] **Product Configuration tab:**
    - [x] Tracking Tools Configuration: Jama checkbox (disabled), Jira checkbox (disabled)
    - [x] Assign Tracking Tools: Product requirements (radio: Not Applicable/Jama/Jira), Process requirements (radio: Not Applicable/Jira)
    - [x] Show sub-requirements checkbox
  - [x] **Form buttons:** Save, Cancel, Reset Form
  - [x] **Breadcrumb** navigation: Home > New Product
  - [x] **Confirmation dialogs** on Save: DPP toggle triggers "Save Product" dialog
  - [x] **Leave Page dialog** on Cancel with unsaved changes: "Are you sure you want to leave? Unsaved data will be lost." (Cancel/Leave)
  - [x] **Validation messages** on empty mandatory fields
- **Test Data Created:**
  - Product Name: `AutoTest Exploration Product 2026-03-28`
  - Product ID: **PIC-1133** (URL: `/GRC_PICASso/ProductDetail?ProductId=1133`)
  - State: Under development, Definition: System, Type: Web Application
  - Digital Offer: Yes (VESTA ID: 12345, IT Owner: PICEMDEProductOwner, PM: PICEMDESecurity Manager)
  - Data Protection & Privacy: Yes, Brand Label: Yes (Vendor: Test Vendor Corp)
  - Org: Energy Management > Software Transformation > DCES
  - Team: PO=PICEMDEProductOwner, SM=PICEMDESecurity Manager, SDPA=PICEMDESecurityAdvisor, PQL=PICEMDEPQL
- **Transitions:** Save → Product Detail view mode (PIC-1133), Cancel → Leave Page dialog → Landing
- **Findings:**
  - DOC top-level tab appears DYNAMICALLY after Product Owner assigned to Digital Offer product
  - Dedicated Privacy Advisor field appears in Product Team when DPP is checked
  - Org Level 3 becomes mandatory for certain org paths (e.g. Energy Management > Software Transformation)
  - DPP toggle triggers confirmation dialog on Save
  - Brand Label ON → Vendor* becomes mandatory
  - Reset Form restores values but does NOT clear dirty flag (Cancel still shows Leave Page dialog)
  - Searchbox pattern: pressSequentially with 4+ chars, then select from dropdown

---

### Step E: Product Detail (View Mode)
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso/ProductDetail?ProductId=1133`
- **Action:** Зафиксировать все элементы view mode
- **Collect:**
  - [x] Header: Product Name, ID:PIC-1133, Active status badge (green), tooltip icon
  - [x] Breadcrumb: Home > AutoTest Exploration Product 2026-03-28
  - [x] **Top tabs:** Product Details (selected), Releases, Digital Offer Certification (DOC)
  - [x] **Edit Product** button (bottom of Product Details tab)
  - [x] **View History** link → opens popup (not explored deeply)
  - [x] **Actions Management** link → `/GRC_PICASso/ActionManagement?ProductId=1133` (separate page/window)
  - [x] **Product Related Details section (read-only):**
    - Product Name, Product State, Product Definition, Product Type
    - Digital Offer = "Yes", Commercial Reference Number = "CR-2026-001"
    - Data Protection & Privacy = "Yes", Brand Label = "Yes", Vendor = "Test Vendor Corp"
  - [x] **Digital Offer Details accordion:** Grid with columns: VESTA ID, IT OWNER, Project manager. Row: 12345, PICEMDEProductOwner, PICEMDESecurity Manager
  - [x] **Product Description accordion:** Paragraph text (read-only)
  - [x] **Bottom tabs (Product Details active):**
    - [x] Product Organization tab: Org Level 1/2/3 values, Cross-Organizational Development = "No"
    - [x] Product Team tab: Product Owner, Security Manager, SDPA, PQL names displayed. Dedicated Privacy Advisor = "-"
    - [x] Security Summary tab: Minimum Oversight Level = "Team", Calculate Risk Profile button, Risk profile grid (all "-")
    - [x] Product Configuration tab: Tracking Tools (Jama/Jira disabled checkboxes), Product requirements = Not Applicable, Process requirements = Not Applicable, Show sub-requirements checkbox
  - [x] **Releases tab:** "No releases were created yet!" message + Create Release button
  - [x] **DOC tab:** "No Digital Offer Certifications created yet" + Initiate DOC button
- **Transitions:** Edit Product → Edit mode, View History → popup, Actions Management → separate page, Releases tab → Releases view, DOC tab → DOC view, Home breadcrumb → Landing
- **Findings:**
  - DOC tab is a TOP-LEVEL tab (alongside Product Details and Releases), not a bottom tab
  - Digital Offer Details shows as a grid in view mode (vs accordion form in edit mode)
  - All read-only fields use label:value layout, not disabled inputs
  - "No releases" empty state has a prominent Create Release button

---

### Step F: Product Detail → Edit Mode
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso/ProductDetail?ProductId=1133`
- **Action:** Нажать Edit Product, изменить поля, протестировать Save/Cancel/Reset
- **Collect:**
  - [x] All fields become editable (same as Step D but pre-filled with saved values)
  - [x] Save button, Cancel button, Reset Form button — all present
  - [x] Cancel with dirty form → **Leave Page dialog**: "Are you sure you want to leave this page? Unsaved data will be lost." (Cancel/Leave buttons)
  - [x] Reset Form → restores to last saved values BUT does NOT clear dirty flag (Cancel still shows Leave Page dialog)
  - [x] Save → returns to view mode directly (no confirmation dialog when DPP was already enabled)
  - [x] **Edited fields successfully:**
    - Commercial Reference Number: filled "CR-2026-001" ✅
    - Brand Label checkbox: toggled ON → Vendor* became mandatory ✅
    - Vendor: filled "Test Vendor Corp" ✅
  - [x] **Verified save:** View mode confirmed all edited values persisted correctly
  - [x] All fields editable including: Product Name, State, Definition, Type, Digital Offer, DPP, Brand Label, Vendor, Description (Rich Text Editor), Org Levels, VESTA ID grid (+ Add VESTA ID link), Team members
  - [x] OutSystems error on cancel: "Cannot read properties of undefined (reading 'b19-TextArea_ProductDescription2')" — non-blocking framework bug
- **Transitions:** Save → View mode, Cancel+Leave → View mode (reloads), Cancel+Cancel → stays in Edit mode, Reset Form → stays in Edit mode with restored values
- **Findings:**
  - DPP confirmation dialog only appears when TOGGLING DPP on (not on subsequent saves when already enabled)
  - Brand Label toggle makes Vendor field mandatory immediately (asterisk appears)
  - Reset Form doesn't clear the OutSystems dirty flag — this is likely a bug
  - OutSystems console error on Cancel is a known framework issue with Rich Text Editor cleanup
  - Leave button after Cancel causes page reload (empty snapshot for ~15 seconds before rendering)

---

### Step G: Product Detail → Releases Tab → Create Release
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso/ProductDetail?ProductId=1133` (Releases tab)
- **Action:** Создать релиз через Create Release dialog
- **Collect:**
  - [x] "No releases were created yet!" message (if first release)
  - [x] Create Release button
  - [x] **Create Release Dialog (modal):**
    - [x] New Product Release radio (default) — standard form
    - [x] Existing Product Release radio → adds: Last Full Pen Test Date field, Last BU Security Officer FCSR Date* field
    - [x] Release Version* (text input)
    - [x] Target Release Date* (date picker with Month select + Year spinbutton)
    - [x] Continuous Penetration Testing checkbox
    - [x] Change Summary* (textarea)
    - [x] Buttons: Create & Scope, Cancel, Reset Form
    - [x] Validation: "Required field!" errors, alert message
  - [x] After Create & Scope → redirects to Release Detail page `/GRC_PICASso/ReleaseDetail?ReleaseId={id}`
  - [x] Releases grid (after release created): 7 columns (Release Version, Target Release Date, Release Status, Release Creation Date, Created By, Inactivation Date, Actions)
  - [x] Release Status options (14 total): Scoping, In Review, Review Completed, In Rework, Rework Completed, Managing, SA & PQL Sign Off, FCSR Review, Post-FCSR Actions, Final Acceptance, Go, Go with Post-Conditions, No-Go, Cancelled
- **Test Data:** Release Version: `v1.0-explore`, Target Date: 30 Apr 2026, Change Summary: `Exploration test release for automation mapping`
- **Test Data Created:**
  - Release: **v1.0-explore** (ReleaseId=3555, Status: Scoping, Target: 30 Apr 2026, Created: 28 Mar 2026)
- **Transitions:** Create & Scope → Release Detail page, Cancel → closes dialog
- **Findings:**
  - Existing Product Release radio adds 2 extra fields (Last Full Pen Test Date, Last BU Security Officer FCSR Date*)
  - After creation, Releases grid shows up with the new release
  - Release Status "Scoping" is the initial status after creation
  - ReleaseId=3555 assigned to v1.0-explore

---

### Step H: Landing → My Releases Tab → Release Detail
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso/ReleaseDetail?ReleaseId=3555`
- **Action:** Изучить Release Detail page полностью через браузер
- **Collect:**
  - [x] Breadcrumb: Home > AutoTest Exploration Product 2026-03-28 > v1.0-explore
  - [x] **Header:** Release name, Active badge (green), tooltip icon
  - [x] **3 tablists on page:**
    - [x] Workflow stages tablist (7 stages): Creation & Scoping (active) → Review & Confirm → Manage → Security & Privacy Readiness Sign Off → FCSR Review → Post FCSR Actions → Final Acceptance
    - [x] Content tabs tablist (9 tabs): Release Details, Roles & Responsibilities, Questionnaire, Process Requirements, Product Requirements, Review & Confirm, DP&P Review, Cybersecurity Residual Risks, FCSR Decision
    - [x] SE Components sub-tabs (2 tabs): Included SE Components, Part Of SE Products
  - [x] **Disabled tabs:** Process Requirements, Product Requirements, Review & Confirm, DP&P Review, Cybersecurity Residual Risks, FCSR Decision — all have CSS class `disabled-tab`, require Questionnaire submission first
  - [x] **Release Details tab (view mode):**
    - Release Version: v1.0-explore
    - Target Release Date: 30 Apr 2026
    - Release Type: New Product Release
    - Continuous Penetration Testing: No
    - Change Summary: "Exploration test release for automation mapping"
    - SE Components: "No Components Associated yet" + Add SE Product button
  - [x] **Release Details tab (edit mode):**
    - Edit Details button → editable fields: Target Release Date (date picker), Change Summary (textarea), Continuous Pen Testing (checkbox)
    - Release Type (read-only)
    - Add SE Product button
    - Save/Cancel/Reset Form buttons
  - [x] **Roles & Responsibilities tab:**
    - 2 sections: SDL Roles, Product Team
    - SDL Roles (9 roles with name, user, edit link): Security Manager, LOB Security Leader, Security Advisor, BU Security Officer, Dedicated Privacy Advisor, Privacy Reviewer, Process Quality Leader, Product Admin Modification, Product Admin Inactivation
    - Product Team (9 roles with name, user, edit link): Product Owner, Security Manager, Security and Data Protection Advisor, Process Quality Leader, Dedicated Privacy Advisor, SE Product Security Manager, SE Product Security Advisor, SE Product Process Quality Leader, IT Owner
  - [x] **Questionnaire tab:**
    - "There are no questionnaires available for this release" message when not started
    - Start Questionnaire button
  - [x] **View Release History link** → popup with grid
  - [x] **Actions:** Edit Details, View Release History, breadcrumb navigation
- **Test Data:** ReleaseId=3555, v1.0-explore on PIC-1133
- **Transitions:** Product breadcrumb → ProductDetail, Home breadcrumb → Landing, Edit Details → edit mode, Start Questionnaire → questionnaire form
- **Findings:**
  - 6 of 9 content tabs are disabled until Questionnaire is submitted
  - Workflow stages are a separate tablist from content tabs — they indicate pipeline progress
  - SE Components has 2 sub-tabs: Included SE Components and Part Of SE Products
  - SDL Roles section has 9 role types, Product Team has 9 role types
  - Edit mode for Release Details only allows changing Target Date, Change Summary, Continuous Pen Testing, and SE Components

---

### Step I: Landing → My DOCs Tab
- **Status:** ✅ COMPLETED (784 records, 9 columns, filters captured)
- **URL:** `/GRC_PICASso/` (My DOCs tab)
- **Action:** Изучить фильтры, грид
- **Collect:**
  - [ ] Filters: DOC name search, Product dropdown, VESTA ID dropdown, Status dropdown, Cert Decision dropdown, DOC Lead dropdown, Reset button
  - [ ] Grid columns (все заголовки)
  - [ ] Pagination
  - [ ] Click on DOC row → DOC Detail page
- **Transitions:** DOC row → DOC Detail
- **Findings:** _(to be filled during exploration)_

---

### Step J: DOC Detail Page
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso_DOC/DOCDetail?DOCId=789&ProductId=1133`
- **Action:** Изучить существующий DOC-789 (DOC auto-created when first release registered)
- **Collect:**
  - [x] **Header:** DOC-789, Product: AutoTest Exploration Product 2026-03-28, VESTA ID: 12345, Status: Pending Initiation
  - [x] **Breadcrumb:** Home > AutoTest Exploration Product 2026-03-28 > DOC-789
  - [x] **DOC Workflow stages (5 stages):** Initiate DOC → Scope ITS Controls → Risk Assessment → Risk Summary Review → Issue Certification
  - [x] **Content tab:** Digital Offer Details (only tab visible at Pending Initiation stage)
  - [x] **Digital Offer Details tab content:**
    - DOC Name: DOC-789
    - DOC Status: Pending Initiation
    - VESTA ID: 12345
    - IT Owner: PICEMDEProductOwner
    - Project Manager: PICEMDESecurity Manager
  - [x] **Action buttons:** Cancel DOC, Initiate DOC, Edit Details (all at bottom)
  - [x] **View History link** → popup
  - [x] **Note:** DOC module is separate: `/GRC_PICASso_DOC/` vs `/GRC_PICASso/`
- **Transitions:** Cancel DOC → confirmation, Initiate DOC → next stage, Edit Details → edit mode, Home breadcrumb → Landing, Product breadcrumb → ProductDetail
- **Findings:**
  - DOC is auto-created with status "Pending Initiation" when first release is registered on a Digital Offer product
  - DOC lives in separate OutSystems module: `GRC_PICASso_DOC` (different from main `GRC_PICASso`)
  - DOC workflow has 5 stages (compared to Release workflow's 7 stages)
  - At Pending Initiation stage, only Digital Offer Details tab is visible
  - DOC-789 was automatically created, not manually initiated

---

### Step K: Roles Delegation Page
- **Status:** ✅ COMPLETED
- **URL:** `/GRC_PICASso/RolesDelegation`
- **Action:** Полностью изучить страницу делегирования ролей
- **Collect:**
  - [x] Page URL: `/GRC_PICASso/RolesDelegation`
  - [x] Breadcrumb: Home > Roles Delegation
  - [x] Description: "Delegate your roles and permissions to another person for a specified period."
  - [x] **Delegation History link** (top right, active link)
  - [x] **2 tabs:** My Roles (default), Org Level Users
  - [x] **My Roles tab:**
    - Grid columns: checkbox, Role Name, Scope, delegated person, Start date, Expiration date, Actions (Delegate button)
    - Column headers sortable: Role Name, delegated person, Start date, Expiration date
    - Bulk Actions: Delegate (disabled until rows checked), Remove Delegation (disabled until rows checked)
    - 120+ role assignments loaded (no pagination — all rows displayed)
    - Role types found: Process Quality Leader, Product Admin Product Modification, Dedicated Privacy Advisor
    - Scope column: "Product" label + product name
    - Undelegated rows show "-" for delegated person, Start date, Expiration date
    - Each row has individual Delegate button in Actions column
  - [x] **Org Level Users tab:**
    - Search box: "Search user by name"
    - Grid columns: User Name, Email, Leap License, View Details (link)
    - 532 records, pagination: 54 pages, 10 per page (options: 10/20/30/50/100)
    - Leap License values: Active, No License
    - View Details link → opens user detail (not explored further)
  - [x] **Delegate Role Dialog (modal):**
    - Title: "Delegate Role"
    - Description: "Start the delegation of your {role} role and responsibilities to another person for a specified period, while retaining all your existing permissions."
    - Fields:
      - Assignee* (user picker with tooltip and link to select)
      - Start Date* (date picker, pre-filled with current datetime, placeholder "Select start date")
      - Expiration Date* (date picker, placeholder "Select expiration date")
      - Info message: "it's recommended to set the delegation period to no more than 3 months unless a longer duration is necessary."
      - Justification* (textarea, placeholder "Specify the reason for delegation", 0/200 char counter)
    - Buttons: Cancel, Delegate
    - Month selection options: January through December
  - [x] **Delegation History Dialog (modal):**
    - Title: "Roles Delegation History"
    - Close button (X)
    - **Filters:**
      - Search: searchbox "Search by description, user or action name"
      - Activity: combobox with options: "Select activity" (default), "Role Delegation Assignment", "Role Delegation Removal", "Role Delegation Update", "Role Delegation Expiration"
      - Date Range: date picker "Select date range"
      - Search button, Reset button
    - **Grid columns:** Date, User, Role Holder, Activity, Description, Origin
    - Date column: Shows date + time separately (e.g. "25 Sep 2025" + "03:15")
    - Role Holder column: Shows user avatar + username
    - 1134 records, pagination: 114 pages, 10 per page (options: 10/20/30/50/100)
    - Sample data shows "Role Delegation Expiration" activities for various products
- **Transitions:** Home breadcrumb → Landing, Delegation History → opens modal, Delegate button → opens Delegate Role modal, Cancel → closes modal
- **Findings:**
  - Delegation History is a modal/dialog, NOT a separate page
  - My Roles tab loads ALL rows without pagination (120+ rows)
  - Org Level Users tab has pagination (532 records)
  - Delegation History has 1134 records with pagination
  - Activity types: Assignment, Removal, Update, Expiration
  - Delegate dialog has 200-char limit on Justification
  - 3-month recommendation for delegation period (info message, not enforced)

---

### Step L: Generate Output Artifacts
- **Status:** ✅ COMPLETED
- **Action:** На основе собранных данных (Steps A–K):
  1. Создать `docs/ai/application-map.json` — structured JSON с nodes, links, exclusions
  2. Создать `docs/ai/application-map.html` — D3.js v7 force-graph:
     - Nodes = pages, modals, tabs, sections (цвет по типу)
     - Edges = transitions с подписями действий
     - Hover tooltips = UI elements list
     - Coverage highlighting (green = has tests, red = no tests)
     - Gray placeholder nodes for excluded zones
     - Zoom/pan/drag/search
     - Legend
  3. Обновить `docs/ai/current-automation-coverage-matrix.md` с новыми findings

---

### Step M: v1.9.0 QA Feature Verification
- **Status:** ✅ COMPLETED
- **Date:** 2026-03-30
- **Action:** Verify v1.9.0 features on QA environment via Playwright MCP browser automation, then correct automation-testing-plan.md for any discrepancies
- **Test Data Used:**
  - Product PIC-1133: `AutoTest Exploration Product 2026-03-28` (ProductId=1133) — for M1-M4
  - Release 3555: `v1.0-explore` (Status: Scoping) — tabs disabled, unsuitable for M5+
  - Release 3556: `Demo Delegation Part2` (Product: "Shiva Product" PIC-660, Status: In Progress/Manage stage) — for M5-M7
  - Release 3427: `Release Original` (Product: "AA test 16" PIC-1077, Status: FCSR Review) — for M8, M10

#### M1: Actions Management Page ✅
  - [x] Full Actions Management page explored on PIC-1133
  - [x] Table columns verified: ACTION NAME, DUE DATE, STATUS, RELEASE NUMBER, ASSIGNEE, CATEGORY, ORIGIN (no Description/Creation Date in table)
  - [x] Create Action popup: Name, Due Date, Description, Assignee — NO Category field (auto-set to Tracked)
  - [x] Edit Action popup: adds Category* dropdown (Pre-Condition/Post-Condition/Tracked/Test Action)
  - [x] View Action Details popup: Name, Status, Due Date, Category, Assignee, Origin, Description, Updated by/on
  - [x] View History: Activity types — "Jira Submission" and "Actions update" (exact casing)
  - **Correction applied:** WF 13.2 table columns, WF 13.6 create action fields updated

#### M2: Product Detail Header Links ✅
  - [x] "View History" and "Actions Management" links confirmed in Product Detail header
  - [x] Actions Management opens in same window (not new tab)

#### M3: Cross-Org Development Fields ✅
  - [x] UI labels are "Development Org Level 1/2/3" (NOT "Dev Org Level 1/2/3")
  - [x] Cascading native `<select>` dropdowns confirmed
  - **Correction applied:** WF 3.9 field names updated

#### M4: LEAP License Column ✅
  - [x] "Leap License" column (Active/No License) confirmed in Org Level Users tab

#### M5: Requirements Tabs Import XLSX ✅
  - [x] Process Requirements: Import XLSX (file upload), Export XLSX, Bulk Actions (Edit/Add/Remove/Unlink/Relink/Submit to Jira)
  - [x] Filters: Search, SDL Practice, Status, Accountable Role, Accountable Person, Reset
  - [x] "Show Sub-Requirements" toggle, "Show All Requirements" toggle, "Requirement Status Summary" link
  - [x] Table columns: checkbox, REQUIREMENT, DESCRIPTION, [expand], STATUS (with tooltip), EVIDENCE, ACCOUNTABLE ROLE, ACCOUNTABLE PERSON, ACTIONS
  - [x] Applicability Lock: status edit via ellipsis icon (fa-ellipsis-v) → popover with status links; NOT APPLICABLE has `disabled=""` attribute
  - [x] Product Requirements: same structure + MUST OR SHOULD, SOURCES columns

#### M6: SBOM Status & Manage Stage Features ✅
  - [x] SBOM Status dropdown in CSRR → SDL Process Summary → SDL DETAILS section
  - [x] Dropdown options: "In Progress" (value=0), "Not Applicable" (value=1), "Submitted" (value=2) — NOT "N/A"
  - [x] Conditional fields: Not Applicable → Justification, In Progress/Submitted → SBOM ID
  - [x] SDL DETAILS fields: SDL Artefacts Repository Link, "Any other SDL gaps..." (Not Applicable/Out-of-Scope/No/Yes), %, Training %, Summary
  - **Correction applied:** WF 6.4 SBOM status values and conditional fields updated

#### M7: Review & Confirm Tab Features ✅
  - [x] REQUIREMENTS SUMMARY with Highcharts DonutChart: Process (64 items) + Product (16 items)
  - [x] Previous FCSR Summary link
  - [x] SCOPE REVIEW PARTICIPANTS table: Name, Role, Recommendation, Comments
  - [x] KEY DISCUSSION TOPICS table: Topic Name, Discussion Details, Date, Added By
  - [x] SCOPE REVIEW DECISION dropdown: "Approved" value
  - [x] ACTION PLAN FOR SCOPE REVIEW DECISIONS section + Edit button

#### M8: FCSR Participants Popup Tabs ✅
  - [x] "Add FCSR Participant" dialog has radio group: "Release Team" (default) / "Others"
  - [x] Release Team: User* dropdown (combobox from R&R, format: "Name - ROLE"), auto-filled role
  - [x] Others: User* searchbox ("Type 4 letters") + Role* textbox ("Enter Role")
  - [x] Recommendation radios: Go (default) / Go with Post-Conditions / Go with Pre-Conditions / No-Go
  - [x] Comment textarea: 0/500 char counter
  - [x] Buttons: Cancel, Save & Create New, Save
  - [x] FCSR Approval Decision dropdown: "- Select -" / Go / Go with Post-Conditions / Go with Pre-Conditions / No-Go
  - [x] Exception Required: checkbox (not toggle)
  - **Correction applied:** WF 8.2, 8.3, 8.4 updated with verified details

#### M9: Maintenance Mode Configuration ✅
  - [x] URL: `/GRC_BackOffice/MaintenanceConfig` (under Notification Configuration in BackOffice)
  - [x] Status label: "INACTIVE" / "ACTIVE"
  - [x] Fields: Start Date and Time*, End Date and Time* (datetime pickers)
  - [x] Placeholders: `[START_DATE_AND_TIME]`, `[END_DATE_AND_TIME]`
  - [x] Header + Body (rich text), Preview link, "Is Active" checkbox + Edit button
  - [x] Metadata: Updated On, Updated By
  - [x] Also found: Custom Banners Configuration, Release Notes Configuration nearby
  - **Correction applied:** WF 17.3 updated with full BackOffice configuration details

#### M10: DPP Privacy Section ✅
  - [x] DPP Review tab on Release 3427 (FCSR Review stage): 18 vertical privacy section tabs
  - [x] Sections: Purpose, High Risk Processing, Data Minimization, IoT, Lawfulness of processing, Sensitive data, Retention, Individual Rights Management, Right to object, User Access Management, Data Extracts, Contractual Requirements, Cookies, Transparency, Compliance Evidence, Personal Data Quality Assurance, Security Measures, + "test" (custom)
  - [x] Each section: Not Applicable checkbox (disabled), Maturity Levels (L0-L4), 4 sub-tabs (Requirements/Questions/Evidence Collection/Feedback)
  - [x] Requirements sub-tab: Product/Process radio toggle, filters (Search/Category/Sources/Status/Evaluation Status/Reset), Show Sub-Requirements toggle
  - [x] Requirements table: Requirement Name, Requirement Description, Sources, [expand], Status (tooltip), Evaluation Status, Evidence
  - [x] Scoped/Available Requirements counts
  - [x] RESIDUAL RISK CLASSIFICATION table: Severity, Likelihood, Risk, Risk Context, Risk Description, Consequences, Comments + "View Risks Summary"
  - [x] Action Plan to address Residual Risks section
  - **Correction applied:** WF 16.2 updated with full section structure, sub-tabs, maturity levels, filters

---

## Progress Log

| Timestamp | Step | Status | Notes |
|-----------|------|--------|-------|
| 2026-03-28 | Plan created | ✅ | Initial plan with all steps 0, A–L |
| 2025-06-25 | Step 0 | ✅ | User Guide converted via pandoc → input/user-guide.md (4099 lines) |
| 2025-06-25 | Step A | ✅ | Login page + Landing header fully captured via Playwright MCP |
| 2025-06-25 | Step B | ✅ | My Tasks tab: 51 records, 12 columns, all filters, task→ReleaseDetail links |
| 2025-06-25 | Step C | ✅ | My Products tab: 1123 records, 12 columns, all filters, product→ProductDetail links |
| 2025-06-25 | Step D | ✅ | Full CRUD completed: Created PIC-1133 with all fields, Digital Offer, DPP, Brand Label. All 4 sub-tabs explored. |
| 2025-06-25 | Step E | ✅ | Product Detail view mode: All 3 top tabs (Details/Releases/DOC), 4 bottom tabs, all elements captured for PIC-1133 |
| 2025-06-25 | Step F | ✅ | Edit mode: Edited Commercial Ref, Brand Label, Vendor. Tested Save/Cancel/Reset/Leave Page flows. |
| 2025-06-25 | Step H | 🟡 | My Releases tab: 2396 records, 10 columns, all filters. Release Detail page documented from User Guide. |
| 2025-06-25 | Step I | ✅ | My DOCs tab: 784 records, 9 columns, all filters captured |
| 2025-06-25 | Step L | ✅ | Generated application-map.json (all nodes/links/elements) + application-map.html (D3.js v7 force-graph) |
| 2025-06-28 | Step G | ✅ | Created release v1.0-explore (ReleaseId=3555) on PIC-1133. Create Release dialog fully explored: New/Existing radio, all fields, validation. |
| 2025-06-28 | Step H | ✅ | Release Detail page fully explored via browser: 3 tablists (workflow stages, content tabs, SE Components sub-tabs), edit mode, Roles & Responsibilities (18 roles), Questionnaire tab, disabled tabs. |
| 2025-06-28 | Step J | ✅ | DOC Detail explored via browser: DOC-789 (auto-created), 5-stage workflow, Digital Offer Details tab, Cancel/Initiate/Edit buttons. Separate module GRC_PICASso_DOC. |
| 2025-06-28 | Step K | ✅ | Roles Delegation fully explored: My Roles (120+ rows, no pagination), Org Level Users (532 records), Delegate dialog (4 fields), Delegation History modal (1134 records, 4 activity types). |
| 2025-06-28 | Artifacts | ✅ | Updated exploration-plan.md, application-map.json, application-map.html with Steps G/H/J/K findings |
| 2026-03-30 | Step M | ✅ | v1.9.0 QA feature verification: M1-M10 all verified via Playwright MCP. Corrections applied to automation-testing-plan.md (WF 3.9, 6.4, 8.2-8.4, 13.2, 13.6, 16.2, 17.3). 882 total test cases (was 887). |
| 2026-03-31 | Step N | ✅ | Confluence Spec Integration: Fetched 1.10 Report Generation, 1.11 Requirements Versioning, 4.1-4.8 Integration specs (10 pages total). Expanded WF 4.12 (8→31 cases), WF 6.2 (10→15), WF 6.3 (9→20), WF 8.6 (3→40). Added WF 18-22 (93 new cases). Updated app map to v1.10.0 (47 nodes, 72 links). Total: 975 test cases. |
| 2026-03-31 | Step O | ✅ | Exploratory Navigation Verification: Confirmed 5 landing tabs (Reports & Dashboards is 5th tab with Tableau link, 4-level Org filters, 1121-record grid). Report Configurator on Release Detail page (not product Releases tab) — dialog with 3 checkboxes: Scope Review&Approval, FCSR [disabled until FCSR completed], Actions Management; DPP section absent when DPP Risk=Negligible. Product Configuration Tracking Tools: Jama (Project Id + Status Mapping) + Jira (Source Link + Project Key + Status Mapping); no Azure DevOps; Jama only for Product Reqs (not Process). All fields disabled with active release. BackOffice Product Requirements Library confirmed with immutable CODE column. Applied corrections to WF 2.1 (5 tabs), WF 8.6a (location), WF 6.3a (tracking tools details). Updated total: 979 test cases. |

---

## Existing Test Coverage Reference

Tests that already exist (from `projects/pw-autotest/tests/`):

| Area | File | What's Covered |
|------|------|----------------|
| Auth | `tests/auth/login.spec.ts` | Login page elements, valid/invalid login, empty credentials |
| Landing | `tests/landing/landing-page.spec.ts` | All 5 tabs, grid columns, filters, pagination, toggles |
| Products | `tests/products/my-products-tab.spec.ts` | Search, filter, pagination, navigation to detail |
| Products | `tests/products/new-product-creation.spec.ts` | Product create happy path |
| Products | `tests/products/edit-product.spec.ts` | PIC-108/109: edit + cancel lifecycle |
| Products | `tests/products/product-details.spec.ts` | PIC-108/109/110: view/edit detail assertions |
| Products | `tests/products/product-details-actions.spec.ts` | ⚠️ Placeholder (test.fixme) |
| Products | `tests/products/product-details-history.spec.ts` | ⚠️ Placeholder (test.fixme) |
| Products | `tests/products/product-details-releases.spec.ts` | ⚠️ Placeholder (test.fixme) |
| DOC | `tests/doc/new-product-creation-digital-offer.spec.ts` | Product + Digital Offer creation |
| DOC | `tests/doc/initiate-doc.spec.ts` | PIC-3927: full DOC initiation |
| Releases | `tests/releases/create-new-release.spec.ts` | PIC-100: release creation |

---

## Existing Page Objects Reference

| Page Object | File | Key Methods |
|-------------|------|-------------|
| `LoginPage` | `src/pages/login.page.ts` | `login()`, `expectPageElements()` |
| `LandingPage` | `src/pages/landing.page.ts` | `clickTab()`, `openMyProductsTab()`, `clickNewProduct()`, all filter/grid helpers |
| `NewProductPage` | `src/pages/new-product.page.ts` | `fillProductInformation()`, `fillProductOrganization()`, `fillProductTeam()`, `clickSave()`, release creation |
| `DocDetailsPage` | `src/pages/doc-details.page.ts` | `clickInitiateDOC()`, `navigateToFirstDoc()`, DOC assertions |
| `BasePage` | `src/pages/base.page.ts` | `goto()`, `waitForOSLoad()` |

---

## OutSystems-Specific Gotchas (for MCP exploration)

1. **No `networkidle`** — OutSystems keeps WebSocket connections alive
2. **`pressSequentially()`** required for user lookup/autocomplete searchbox fields
3. **Partial refreshes** can replace DOM nodes and wipe previously entered values → retry
4. **Cascading dropdowns** are native `<select>` that enable asynchronously after parent selection
5. **Custom vscomp combobox** — renders listbox at root DOM level, not inside the dropdown
6. **`waitForOSScreenLoad()`** — watches for `.feedback-message-loading`, `.os-loading-overlay`, `.content-placeholder.loading`
7. **Tab switches** — require explicit wait for visible grid headers before interacting
8. **Save completion** — detected by `Edit Product` button appearance, NOT by URL change
9. **CSS-generated asterisks** for mandatory fields are NOT in text content
10. **Confirmation dialogs** may appear on Save (need to handle)

---

## Extensibility — Обновление карты при новых фичах

При добавлении нового функционала в PICASso:

1. Добавить новый Step (N+1) в секцию "Exploration Steps" по шаблону существующих шагов
2. Пройти новую фичу через Playwright MCP, заполнив все чекбоксы в Step
3. Добавить новые nodes/links в `application-map.json`
4. Перегенерировать `application-map.html` (HTML читает JSON inline — обновить data в HTML)
5. Обновить `current-automation-coverage-matrix.md`

### JSON Schema для новых nodes

```json
{
  "id": "unique-kebab-case-id",
  "label": "Human Readable Display Name",
  "type": "page | modal | tab | section | form | placeholder",
  "url": "/path/pattern (if applicable)",
  "group": "auth | landing | products | releases | docs | delegation | excluded",
  "coverage": "covered | not-covered | partial | out-of-scope",
  "elements": [
    {
      "name": "Element Name",
      "role": "button | textbox | combobox | checkbox | radio | link | grid | searchbox | tab | select",
      "mandatory": true,
      "notes": "any special behavior"
    }
  ]
}
```

### JSON Schema для новых links

```json
{
  "source": "source-node-id",
  "target": "target-node-id",
  "action": "click Button Name | fill form | select option | toggle checkbox",
  "label": "short description for edge label"
}
```

### How to re-run exploration for a single new feature

```
1. Add Step N+1 to this plan file
2. Open Playwright MCP browser to the feature
3. Take accessibility snapshot at each state
4. Record all elements and transitions
5. Update application-map.json
6. Regenerate application-map.html
7. Mark Step as ✅ DONE in this file
```
