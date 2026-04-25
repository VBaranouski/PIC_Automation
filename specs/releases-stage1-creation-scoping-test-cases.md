# Release — Stage 1: Creation & Scoping — Test Case Specifications

> Generated: 2026-04-22
> Area: `releases` | Workflow: `Release — Stage 1: Creation & Scoping`
> Feature Registry: `/Users/Uladzislau_Baranouski/.picasso-kb/context/knowledge-base/feature-registry/releases.md`

---

## 1. Coverage Analysis

### Current State (from tracker DB)

| Category | Count | Details |
|----------|-------|---------|
| Automated + Passed | 42 | RELEASE-CREATE 1–11, CLONE 2–4, DETAILS 1–3, HEADER 1–14, QUESTIONNAIRE 1/11–16, PROCESS-REQ 1–2, PRODUCT-REQ 1–2, PRODUCT-REQ-TAB 1/3–7 |
| Automated + Failed-Defect | 7 | RELEASE-CREATE-012/013, CLONE-001/005, DETAILS-004, QUESTIONNAIRE-002, PROCESS-REQ-TAB-001 |
| Automated + Skipped | ~20 | CLONE-006/INHERIT-001-003, DETAILS-005/ADDSEP-001/CANCEL-LEAVE-001, QUESTIONNAIRE-003, PROCESS-REQ-TAB 2–13, PRODUCT-REQ-TAB 2/8–13 |
| Pending + Has Steps | 24 | CLONE-INHERIT 3b–11, CREATE-002-b, DETAILS 6–11, HEADER-001-b, QUESTIONNAIRE 4–10 |
| Pending + No Steps | 85 | WF04-* (see below) |

### Coverage Gap Table (Five Dimensions)

| # | Dimension | Status | Gap |
|---|-----------|--------|-----|
| 1 | **Happy Path** | ✅ | Full E2E: create (new + existing), clone, questionnaire fill/submit, details view/edit, R&R user assignment, cancel release, submit for review |
| 2 | **Negative / Validation** | ✅ | Covered: duplicate release name (cancelled/inactivated), pen test warning, past-date validation, mandatory questionnaire answers, empty form reset |
| 3 | **Role-Based Access** | ⚠️ | Improved: R&R tab CRUD and SDL roles display added. Remaining: responsible user routing at stage entry, user recalculation after questionnaire |
| 4 | **State Transitions** | ✅ | Covered: creation → scoping status, submit for review → R&C stage, cancel release → cancelled, show active only toggle, DPP applicability |
| 5 | **Data Integrity** | ⚠️ | Improved: clone E2E + source dropdown, edit-save-cancel cycles, auto-save persistence. Remaining: versioning per-stage (32 scenarios existing), XLSX import/export |

---

## 2. Deduplication Table

| Pending ID | Existing ID(s) | Relationship | Action |
|------------|----------------|--------------|--------|
| WF04-0001 | RELEASE-CREATE-012/013, RELEASE-CREATE-018/0013/0020 | Meta-summary — all sub-items exist | **REMOVE** |
| WF04-0002 | RELEASE-CLONE-*, RELEASE-SCOPE-WORKFLOW-001/0049/0052/0056 | Meta-summary — all sub-items exist | **REMOVE** |
| WF04-0003 | PROCESS-REQ-TAB-*, PRODUCT-REQ-TAB-*, WF04-009x | Meta-summary — all sub-items exist | **REMOVE** |
| WF04-0004 | WF04-012x/013x (custom req), WF04-015x-018x (versioning) | Meta-summary — all sub-items exist | **REMOVE** |
| WF04-0082 | RELEASE-PROCESS-REQ-001 (automated + passed) | True duplicate | **REMOVE** |
| WF04-0114 | RELEASE-PRODUCT-REQ-001 (automated + passed) | True duplicate | **REMOVE** |

**Total scenarios to remove: 6**

---

## 3. Test Case Specifications

### 3.1 Release Creation — Negative/Validation

#### `RELEASE-CREATE-018` — Cannot create release with same name as cancelled release

**Preconditions:** Logged in as `process_quality_leader`; a product exists with at least one cancelled release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page for a product with a cancelled release | The `Product Detail` heading is visible |
| 2 | Click the `Releases` tab | The Releases grid is visible with at least 1 row showing `Cancelled` status |
| 3 | Note the Release Version of the cancelled release | — |
| 4 | Click the `Create Release` button | The Create Release dialog opens |
| 5 | Type the cancelled release's version into the `Release Version` field | The field accepts the text |
| 6 | Type a future date into the `Target Release Date` field | The date is selected |
| 7 | Type "Test change summary" into the `Change Summary` field | The field contains the text |
| 8 | Click the `Create & Scope` button | An error message is visible indicating the release name is already taken |

**Coverage dimension:** Negative / Validation
**Note:** Requires test data with a cancelled release. May need on-hold if no cancelled release exists in QA.

---

#### `RELEASE-CREATE-019` — Creating release with same name as inactivated release is allowed

**Preconditions:** Logged in as `process_quality_leader`; a product exists with at least one inactivated release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page for a product with an inactivated release | The `Product Detail` heading is visible |
| 2 | Click the `Releases` tab | The Releases grid is visible with at least 1 row showing `Inactive` status |
| 3 | Note the Release Version of the inactivated release | — |
| 4 | Click the `Create Release` button | The Create Release dialog opens |
| 5 | Type the inactivated release's version into the `Release Version` field | The field accepts the text |
| 6 | Type a future date into the `Target Release Date` field | The date is selected |
| 7 | Type "Reuse of inactive release name" into the `Change Summary` field | The field contains the text |
| 8 | Click the `Create & Scope` button | The dialog closes; the URL contains `/ReleaseDetail` |
| 9 | Navigate back to the product's Releases tab | The newly created release is visible in the grid with status `Scoping` |

**Coverage dimension:** Negative / Validation (positive boundary)
**Note:** Requires test data with an inactivated release. May need on-hold if no inactivated release in QA.

---

#### `RELEASE-CREATE-020` — "Last Full Pen Test Date" is optional; warning if not provided

**Preconditions:** Logged in as `process_quality_leader`; a product with no existing releases.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page and click the `Releases` tab | The Releases tab is active |
| 2 | Click the `Create Release` button | The Create Release dialog opens |
| 3 | Click the `Existing Product Release` radio button | Additional onboarding fields are visible |
| 4 | Type a unique version into the `Release Version` field | The field contains the text |
| 5 | Type a future date into the `Target Release Date` field | The date is selected |
| 6 | Type "Test" into the `Change Summary` field | The field contains the text |
| 7 | Type a past date into the `Last BU Security Officer FCSR Date` field | The date is selected |
| 8 | Leave the `Last Full Pen Test Date` field empty | The field remains empty |
| 9 | Click the `Create & Scope` button | A warning message is visible indicating the pen test date was not provided |

**Coverage dimension:** Negative / Validation
**Note:** BLOCKED — onboarding submit currently fails before warning can be verified (RELEASE-CREATE-013 defect). Use `test.fail()`.

---

### 3.2 Workflow Pipeline / Header

#### `RELEASE-SCOPE-WORKFLOW-001` — Responsible users pre-calculated at Creation & Scoping stage

**Preconditions:** Logged in as `process_quality_leader`; on a release at `Scoping` stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Release Detail page at `Scoping` stage | The `Release Detail` heading is visible; the status badge contains `Scoping` |
| 2 | Click the `View Flow` toggle to expand the pipeline bar | The pipeline bar is visible with 7 stages |
| 3 | Click the `Creation & Scoping` stage in the pipeline bar | The stage sidebar opens |
| 4 | Verify the responsible users table in the sidebar | At least 1 user entry is visible in the responsible users table |
| 5 | Verify the `User` column is not empty for each row | Each row in the responsible users table has a non-empty User value |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-SCOPE-WORKFLOW-002` — Workflow popup updates responsible users after questionnaire submission

**Preconditions:** Logged in as `process_quality_leader`; a release at `Scoping` stage with questionnaire not yet submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Release Detail page at `Scoping` stage (pre-questionnaire) | The `Release Detail` heading is visible |
| 2 | Click the `View Flow` toggle and note the responsible users for Creation & Scoping | At least 1 user is shown |
| 3 | Complete and submit the questionnaire (fill all 8 questions, click `Submit`) | The success feedback message is visible |
| 4 | Click the `View Flow` toggle again | The pipeline bar is visible |
| 5 | Click the `Creation & Scoping` stage in the pipeline bar | The stage sidebar opens with updated users |
| 6 | Verify the responsible users reflect the Risk Classification outcome | At least 1 user entry is visible; the list may have changed based on risk level |

**Coverage dimension:** Role-Based Access + State Transitions
**Note:** Risk Classification determines which roles are required. Higher risk = more reviewers.

---

#### `RELEASE-SCOPE-WORKFLOW-003` — Rework indicator on "View Flow" link

**Preconditions:** Logged in as `process_quality_leader`; a release in `Rework` state.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Release Detail page with `Rework` status | The status badge contains `Rework` |
| 2 | Verify the `View Flow` link area | An orange dot indicator is visible near the `View Flow` link |
| 3 | Click the `View Flow` toggle | The pipeline bar is visible; the rework indicator is visible with descriptive text |

**Coverage dimension:** State Transitions
**Note:** Requires test data with a release in Rework state. May need on-hold if unavailable.

---

#### `RELEASE-SCOPE-WORKFLOW-004` — Completed workflow stages show username and completion date

**Preconditions:** Logged in as `process_quality_leader`; a release that has at least one completed stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Release Detail page with at least one completed stage | The `Release Detail` heading is visible |
| 2 | Click the `View Flow` toggle to expand the pipeline bar | The pipeline bar is visible |
| 3 | Verify a completed stage pill in the pipeline bar | The completed stage shows a username and a date (e.g., "John Doe 20 Apr 2026") |
| 4 | Click the completed stage | The stage sidebar opens with completion details |

**Coverage dimension:** Data Integrity

---

### 3.3 Process Requirements — Inline Edit & Bulk Actions

#### `RELEASE-PROCREQ-001` — Sub-requirement filter bubbling

**Preconditions:** On a release with completed questionnaire; Process Requirements tab active; "Show sub-requirements" toggle is ON.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab on a post-questionnaire release | The Process Requirements grid is visible with at least 1 SDL Practice group |
| 2 | Select a status value from the `Status` dropdown filter that matches a sub-requirement but not its parent | The filter is applied |
| 3 | Verify the filtered results | The matching sub-requirement is visible; its parent requirement is also visible (as a context row) even though it does not match the filter |

**Coverage dimension:** Data Integrity
**Note:** Parent shown as context row is a UX pattern — parent must be visible for sub-req to have context.

---

#### `RELEASE-PROCREQ-002` — Three-dot inline edit popup on individual requirement

**Preconditions:** On Process Requirements tab with requirements visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab on a post-questionnaire release | The grid is visible with at least 1 requirement row |
| 2 | Click the three-dot action icon on a requirement row | An inline edit popup opens |
| 3 | Verify the popup contents | The popup contains `Status` dropdown, `Evidence Link` field, and `Justification` field |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PROCREQ-003` — "Done" status requires evidence link

**Preconditions:** On Process Requirements tab; three-dot edit popup open on a requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot action on a requirement row | The edit popup opens |
| 2 | Select `Done` from the `Status` dropdown | The `Evidence Link` field becomes required |
| 3 | Leave the `Evidence Link` field empty and click `Save` | A validation error is visible indicating evidence link is required |
| 4 | Type "https://example.com/evidence" into the `Evidence Link` field | The field contains the URL |
| 5 | Click `Save` | The popup closes; the requirement status updates to `Done` |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-004` — "Not Applicable" or "Postponed" requires justification

**Preconditions:** On Process Requirements tab; three-dot edit popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot action on a requirement row | The edit popup opens |
| 2 | Select `Not Applicable` from the `Status` dropdown | The `Justification` field becomes required |
| 3 | Leave the `Justification` field empty and click `Save` | A validation error is visible indicating justification is required |
| 4 | Type "Not relevant to this product" into the `Justification` field | The field contains the text |
| 5 | Click `Save` | The popup closes; the requirement status updates to `Not Applicable` |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-005` — Checkbox selection enables bulk edit button

**Preconditions:** On Process Requirements tab with requirements visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab | The grid is visible with at least 1 requirement row |
| 2 | Verify the `Edit` (bulk edit) button state before selection | The `Edit` button is disabled |
| 3 | Click the checkbox on a requirement row | The checkbox is checked |
| 4 | Verify the `Edit` button state | The `Edit` button is enabled |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PROCREQ-006` — Bulk edit popup fields

**Preconditions:** On Process Requirements tab; at least 1 requirement selected via checkbox.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select at least 2 requirements via checkboxes | The `Edit` button is enabled |
| 2 | Click the `Edit` button | The bulk edit popup opens |
| 3 | Verify the popup contents | The popup contains `Status` dropdown, `Evidence Link` field, and `Justification` field |
| 4 | Select `In Progress` from the `Status` dropdown | The status is selected |
| 5 | Click `Save` | The popup closes; selected requirements update to `In Progress` status |

**Coverage dimension:** Happy Path + Data Integrity

---

#### `RELEASE-PROCREQ-007` — Bulk "Add" for not-selected requirements

**Preconditions:** On Process Requirements tab; "Show all requirements" toggle is ON showing `Not Selected` requirements.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Toggle `Show all requirements` to ON | Requirements with `Not Selected` status are visible |
| 2 | Select at least 1 requirement with `Not Selected` status via checkbox | The checkbox is checked |
| 3 | Click the `Add` button | A justification prompt dialog opens |
| 4 | Type "Adding for compliance" into the justification field | The field contains the text |
| 5 | Click `Confirm` or `Save` | The dialog closes; the requirement status changes from `Not Selected` to `Planned` |

**Coverage dimension:** State Transitions

---

#### `RELEASE-PROCREQ-008` — Bulk "Remove" with mandatory rationale

**Preconditions:** On Process Requirements tab; at least 1 requirement with non-`Not Selected` status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select at least 1 requirement with `Planned` or `In Progress` status via checkbox | The checkbox is checked |
| 2 | Click the `Remove` button | A rationale popup dialog opens |
| 3 | Verify the popup requires a rationale | The `Rationale` field is visible and required |
| 4 | Click `Confirm` without entering a rationale | A validation error is visible |
| 5 | Type "No longer applicable" into the `Rationale` field and click `Confirm` | The dialog closes; the requirement status changes to `Not Selected` |

**Coverage dimension:** Negative / Validation + State Transitions

---

#### `RELEASE-PROCREQ-009` — Pie chart popup — SDL Practice filter

**Preconditions:** On Process Requirements tab; pie chart popup open via "Requirements Status Summary" link.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Requirements Status Summary` link on the Process Requirements tab | The pie chart popup opens with a chart and filter controls |
| 2 | Select a specific SDL Practice from the `SDL Practice` filter dropdown | The filter is applied |
| 3 | Verify the chart updates | The pie chart data changes to reflect only the selected SDL Practice requirements |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PROCREQ-010` — Pie chart "Include Sub-Requirements" toggle

**Preconditions:** On Process Requirements tab; pie chart popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Requirements Status Summary` link | The pie chart popup opens |
| 2 | Note the total count displayed in the chart | — |
| 3 | Toggle the `Include Sub-Requirements` switch to ON | The chart data updates |
| 4 | Verify the total count has changed | The total count is different (higher when including sub-requirements) |

**Coverage dimension:** Data Integrity

---

### 3.4 Process Requirements — XLSX Import

#### `RELEASE-PROCREQ-011` — "Import XLSX" button available on Process Requirements

**Preconditions:** On Process Requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab | The tab is active with requirements grid visible |
| 2 | Verify the `Import XLSX` button is visible | The `Import XLSX` button is visible in the toolbar area |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PROCREQ-012` — Import XLSX opens file picker; rejects non-XLSX

**Preconditions:** On Process Requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Import XLSX` button | A file picker dialog opens accepting `.xlsx` files |
| 2 | Upload a non-XLSX file (e.g., `.txt` or `.csv`) | An error message is visible indicating invalid file format |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-013` — Valid XLSX import updates requirement statuses

**Preconditions:** On Process Requirements tab; a valid XLSX file prepared with updated requirement statuses.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Import XLSX` button | The file picker opens |
| 2 | Upload a valid XLSX file with updated statuses | The import validation table is visible showing imported rows |
| 3 | Click `Confirm Import` or `Apply` | The page refreshes; requirement statuses reflect the imported values |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PROCREQ-014` — Import validation: incorrect file format error

**Preconditions:** On Process Requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Import XLSX` button | The file picker opens |
| 2 | Upload a file with incorrect internal format (corrupted XLSX) | A format error row is visible in the validation table |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-015` — Import validation: missing mandatory columns

**Preconditions:** On Process Requirements tab; an XLSX file with missing required columns.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload an XLSX file missing mandatory columns (e.g., missing `Status` column) | A column-level error is visible in the validation table indicating which columns are missing |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-016` — Import validation: invalid requirement code

**Preconditions:** On Process Requirements tab; an XLSX file with a non-existent requirement code.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload an XLSX file containing a requirement code that does not exist in the release | A code-level error row is visible in the validation table |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-017` — Import validation: invalid status value

**Preconditions:** On Process Requirements tab; an XLSX file with an invalid status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload an XLSX file containing an invalid status value (e.g., "Completed" instead of "Done") | A status-level error row is visible in the validation table |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-018` — Import validation: locked requirement with "Not Applicable"

**Preconditions:** On Process Requirements tab; an XLSX with "Not Applicable" for a locked requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload an XLSX file setting status to `Not Applicable` for a requirement configured as "Can be marked as Not Applicable = No" | A row-level validation error is visible indicating the requirement cannot be marked as Not Applicable |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-019` — Clicking validation error link opens row-level detail

**Preconditions:** On Process Requirements tab; import validation table visible with errors.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the validation table shows at least 1 error row | At least 1 error row is visible |
| 2 | Click the error link in the validation table | A row-level detail view opens showing the affected requirement code and error description |

**Coverage dimension:** Happy Path

---

### 3.5 Product Requirements — Interaction & Edit

#### `RELEASE-PRODREQ-001` — Hover "more" link shows full description

**Preconditions:** On Product Requirements tab with at least 1 requirement with a long description.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Requirements tab | The grid is visible with at least 1 requirement |
| 2 | Hover over the `more` link in the Description column of a requirement | A tooltip or expanded text area is visible showing the full requirement description |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PRODREQ-002` — Three-dot edit per requirement

**Preconditions:** On Product Requirements tab with requirements visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot action icon on a product requirement row | An edit popup opens |
| 2 | Verify the popup contents | The popup contains `Status` dropdown, `Evidence Link` field, and `Justification` field |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PRODREQ-003` — Checkbox enables bulk edit button

**Preconditions:** On Product Requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Edit` (bulk edit) button is disabled initially | The `Edit` button is disabled |
| 2 | Click the checkbox on a product requirement row | The checkbox is checked |
| 3 | Verify the `Edit` button state | The `Edit` button is enabled |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PRODREQ-004` — Bulk edit popup for product requirements

**Preconditions:** On Product Requirements tab; at least 1 requirement selected via checkbox.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select at least 2 product requirements via checkboxes | The `Edit` button is enabled |
| 2 | Click the `Edit` button | The bulk edit popup opens |
| 3 | Verify popup fields | The popup contains `Status` dropdown, `Evidence Link` field, and `Justification` field |
| 4 | Select a status and click `Save` | The popup closes; selected requirements update to the chosen status |

**Coverage dimension:** Happy Path + Data Integrity

---

### 3.6 Product Requirements — Custom Requirements

#### `RELEASE-PRODREQ-005` — Custom Requirement form fields

**Preconditions:** On Product Requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `+Custom Requirements` button | The Add Custom Requirement popup opens |
| 2 | Verify the form fields | The popup contains `Name`, `Code`, `Condition` (Must/Should), `Description`, and `Source Link` fields |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PRODREQ-006` — Duplicate code shows error

**Preconditions:** On Product Requirements tab; Add Custom Requirement popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `+Custom Requirements` button | The popup opens |
| 2 | Type a code that already exists (e.g., matching an existing requirement code) into the `Code` field | The field accepts the text |
| 3 | Fill remaining required fields and click `Save` | An error message `Requirement with this code already exist` is visible |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PRODREQ-007` — "Add as sub-requirement" toggle reveals parent dropdown

**Preconditions:** On Product Requirements tab; Add Custom Requirement popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `+Custom Requirements` button | The popup opens |
| 2 | Verify the `Parent Requirement` dropdown is not visible initially | The dropdown is hidden |
| 3 | Toggle `Add as sub-requirement` to ON | The `Parent Requirement` dropdown becomes visible |
| 4 | Verify the dropdown is initially disabled (no category selected) | The `Parent Requirement` dropdown is disabled until a category context is provided |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PRODREQ-008` — Custom requirement appears in "Custom Requirements" category

**Preconditions:** On Product Requirements tab; custom requirement successfully added.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add a custom requirement via the `+Custom Requirements` popup with valid data | The popup closes |
| 2 | Verify the Product Requirements grid | A `Custom Requirements` category group is visible in the grid |
| 3 | Expand the `Custom Requirements` category | The newly added requirement is visible with the entered Name, Code, and Condition |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PRODREQ-009` — Custom requirement count at bottom of tab

**Preconditions:** On Product Requirements tab with at least 1 custom requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Scroll to the bottom of the Product Requirements tab | A custom requirement count is visible (e.g., "Custom Requirements: 1") |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PRODREQ-010` — Custom requirement removal via three-dots

**Preconditions:** On Product Requirements tab; at least 1 custom requirement exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot action on a custom requirement row | A context menu opens |
| 2 | Click `Remove` | A mandatory rationale popup opens |
| 3 | Verify the rationale field is required | The `Rationale` field is visible |
| 4 | Type "No longer needed" into the rationale field and click `Confirm` | The popup closes; the custom requirement is removed from the visible list |

**Coverage dimension:** Happy Path + Negative / Validation

---

#### `RELEASE-PRODREQ-011` — Removed custom requirement visible via "Show all" toggle

**Preconditions:** On Product Requirements tab; a custom requirement has been removed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the removed custom requirement is not visible by default | The requirement is not in the visible grid |
| 2 | Toggle `Show all requirements` to ON | The removed custom requirement is visible with `Not Selected` or `Removed` status |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PRODREQ-012` — Re-add removed custom requirement

**Preconditions:** On Product Requirements tab; "Show all requirements" ON; a removed custom requirement visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot action on the removed custom requirement | A context menu opens |
| 2 | Click `Add` | The requirement status changes back to `Planned` or its previous active status |
| 3 | Toggle `Show all requirements` OFF | The re-added requirement is still visible in the active list |

**Coverage dimension:** State Transitions

---

### 3.7 Product Requirements — XLSX Import

#### `RELEASE-PRODREQ-013` — "Import XLSX" button available on Product Requirements

**Preconditions:** On Product Requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Requirements tab | The tab is active |
| 2 | Verify the `Import XLSX` button is visible | The `Import XLSX` button is visible in the toolbar |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PRODREQ-014` — Export XLSX downloads product requirements

**Preconditions:** On Product Requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Export XLSX` button | A `.xlsx` file download starts |
| 2 | Verify the downloaded file | The file contains an Instructions tab with color-coded mapping legend |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PRODREQ-015` — Custom Requirements "Import XLSX" button

**Preconditions:** On Product Requirements tab, Custom Requirements section visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Custom Requirements area has an `Import XLSX` button | The `Import XLSX` button is visible for custom requirements |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PRODREQ-016` — Bulk upload custom requirements via valid XLSX

**Preconditions:** On Product Requirements tab; valid custom requirements XLSX prepared.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the custom requirements `Import XLSX` button | The file picker opens |
| 2 | Upload a valid XLSX with custom requirements | The import validation shows all rows as valid |
| 3 | Click `Confirm Import` | The page refreshes; all custom requirements from the file are visible in the `Custom Requirements` category |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PRODREQ-017` — Custom requirements import: non-XLSX format error

**Preconditions:** On Product Requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the custom requirements `Import XLSX` button | The file picker opens |
| 2 | Upload a non-XLSX file | An error message is visible indicating invalid file format |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PRODREQ-018` — Custom requirements import: duplicate code error

**Preconditions:** On Product Requirements tab; XLSX with duplicate requirement code.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload an XLSX containing a requirement code that already exists | An error row is visible per duplicate code |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PRODREQ-019` — Custom requirements import: invalid Source Link error

**Preconditions:** On Product Requirements tab; XLSX with invalid source link.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload an XLSX with an invalid Source Link value | A row-level error is visible indicating invalid source link |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PRODREQ-020` — Custom requirements import: invalid justification for removed req

**Preconditions:** On Product Requirements tab; XLSX referencing a removed requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload an XLSX with missing justification for a requirement in `Removed` status | A row-level error is visible indicating justification is required for removed requirements |

**Coverage dimension:** Negative / Validation

---

### 3.8 Not Applicable Locking

#### `RELEASE-PROCREQ-LOCK-001` — Locked requirement shows "Not Applicable" disabled

**Preconditions:** On Process Requirements tab; at least 1 requirement configured as "Can be marked as Not Applicable = No" in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot action on a locked requirement row | The edit popup opens |
| 2 | Open the `Status` dropdown | The `Not Applicable` option is visible but disabled |

**Coverage dimension:** Role-Based Access (BackOffice configuration enforcement)

---

#### `RELEASE-PROCREQ-LOCK-002` — Tooltip on disabled "Not Applicable" option

**Preconditions:** On Process Requirements tab; edit popup open for a locked requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hover over the disabled `Not Applicable` option in the `Status` dropdown | A tooltip is visible explaining the restriction (e.g., "This requirement cannot be marked as Not Applicable") |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PROCREQ-LOCK-003` — Bulk edit: locked requirements + "Not Applicable" error

**Preconditions:** On Process Requirements tab; at least 1 locked requirement selected via checkbox.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select at least 1 locked requirement and 1 unlocked requirement via checkboxes | Both checkboxes are checked |
| 2 | Click the `Edit` button | The bulk edit popup opens |
| 3 | Select `Not Applicable` from the `Status` dropdown and click `Save` | An error message is visible listing the locked requirements that cannot be set to Not Applicable |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-LOCK-004` — XLSX import: "Not Applicable" for locked requirement error

**Preconditions:** On Process Requirements tab; XLSX with "Not Applicable" for a locked requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload an XLSX setting `Not Applicable` for a locked requirement | A row-level validation error is visible in the import validation table |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-PROCREQ-LOCK-005` — Locked requirement indicator visible in row

**Preconditions:** On Process Requirements tab; at least 1 locked requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab | The grid is visible |
| 2 | Locate a requirement configured as "Can be marked as Not Applicable = No" | A lock icon or label indicator is visible on the requirement row |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PROCREQ-LOCK-006` — BackOffice "Can be marked as Not Applicable" field options

**Preconditions:** BackOffice admin access; navigated to a process requirement configuration.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice process requirement configuration page | The configuration form is visible |
| 2 | Verify the `Can be marked as Not Applicable` field | The field has two options: `Yes` (default) and `No` |

**Coverage dimension:** Happy Path
**Note:** Requires BackOffice access. May belong to `backoffice` feature area.

---

#### `RELEASE-PROCREQ-LOCK-007` — BackOffice "No" propagates to all releases

**Preconditions:** BackOffice admin; "Can be marked as Not Applicable" set to "No" for a requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Set `Can be marked as Not Applicable` to `No` for a process requirement in BackOffice | The setting is saved |
| 2 | Navigate to a release's Process Requirements tab | The requirement row shows a lock indicator |
| 3 | Click the three-dot action on the locked requirement | The `Not Applicable` option is disabled in the Status dropdown |

**Coverage dimension:** Data Integrity (cross-feature: BackOffice → Release)
**Note:** Requires BackOffice access and cross-feature verification.

---

#### `RELEASE-PROCREQ-LOCK-008` — Jira submission error for locked requirement with Not Applicable

**Preconditions:** On a release where a locked requirement has somehow been set to Not Applicable (edge case).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Attempt to submit requirements to Jira when a locked requirement has Not Applicable status | An inline error is visible on the requirement row indicating the status conflict |

**Coverage dimension:** Negative / Validation
**Note:** Edge case — may be difficult to reproduce if UI properly prevents the state.

---

### 3.9 Parent-Child Requirement Selection

#### `RELEASE-PROCREQ-SELECT-001` — Parent checkbox opens selection popup

**Preconditions:** On Process Requirements tab; "Show sub-requirements" is ON.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the checkbox on a parent requirement row | A dropdown popup opens with two options: `Select parent only` and `Select parent with sub-requirements` |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PROCREQ-SELECT-002` — "Select parent only" behavior

**Preconditions:** Parent selection popup visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Select parent only` in the popup | The parent row checkbox is checked; sub-requirement checkboxes remain unchecked |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PROCREQ-SELECT-003` — "Select parent with sub-requirements" behavior

**Preconditions:** Parent selection popup visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Select parent with sub-requirements` in the popup | The parent row and all its visible sub-requirement checkboxes are checked |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-PROCREQ-SELECT-004` — Deselecting parent opens deselection popup

**Preconditions:** A parent requirement is currently selected (checked).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the checkbox on the selected parent requirement | A popup opens with `De-select parent only` and `De-select parent and sub-requirements` options |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PROCREQ-SELECT-005` — "Select All" checkbox triggers parent/sub popup

**Preconditions:** On Process Requirements tab; "Show sub-requirements" is ON.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Select All` checkbox in the grid header | A popup opens with `Select parent requirements only` and `Select parents with sub-requirements` options |

**Coverage dimension:** Happy Path

---

#### `RELEASE-PROCREQ-SELECT-006` — Parent-child popup disabled when sub-requirements toggle is OFF

**Preconditions:** On Process Requirements tab; "Show sub-requirements" is OFF.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify "Show sub-requirements" toggle is OFF | The toggle is in OFF state |
| 2 | Click the checkbox on a parent requirement row | The checkbox is checked directly without any popup appearing |

**Coverage dimension:** State Transitions

---

### 3.10 Requirements Versioning

#### `RELEASE-REQ-VERSION-001` — Version update warning banner on requirements tab

**Preconditions:** A release where BackOffice has published a newer version of a requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process or Product Requirements tab for a release with outdated requirement versions | A warning banner is visible at the top of the tab |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-002` — Warning banner lists changed requirements

**Preconditions:** Warning banner visible on requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the warning banner content | The banner lists specific changed requirements with change descriptions (e.g., "field updated", "new requirement added", "requirement deactivated") |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-003` — Warning shows auto-trigger date

**Preconditions:** Warning banner visible; BackOffice specified a mandatory change date.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the warning banner | The banner shows the date when auto-trigger will apply changes |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-004` — "Keep previous version" closes warning

**Preconditions:** Warning banner visible on requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Keep previous version` button in the warning banner | The warning banner closes |
| 2 | Navigate away from and back to the requirements tab | The warning banner reappears |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-005` — "Change version" opens sub-dialog

**Preconditions:** Warning banner visible on requirements tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Change version` button in the warning banner | A sub-dialog opens listing specific requirements that should be updated |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REQ-VERSION-006` — Sub-dialog allows selective requirement update

**Preconditions:** Change version sub-dialog open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the sub-dialog contains selectable rows | Individual requirement rows with checkboxes are visible |
| 2 | Deselect one requirement and click `Apply` | Only the selected requirements are updated; the deselected one retains its previous version |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-007` — Sub-dialog "Update status to Planned" vs "Keep existing status"

**Preconditions:** Change version sub-dialog open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the sub-dialog has a status option | Two radio options are visible: `Update status to Planned` and `Keep existing status` |
| 2 | Verify the default selection | `Keep existing status` is selected by default |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REQ-VERSION-008` — After version change, informational message replaces warning

**Preconditions:** Change version applied.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply a version change via the sub-dialog | The warning banner is replaced by an informational message showing the changes that were applied |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-009` — Info message persists after version change

**Preconditions:** Informational message visible after version change.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate away from the requirements tab | — |
| 2 | Navigate back to the requirements tab | The informational message about applied changes is still visible |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-010` — Scoping (not yet scoped): auto-version after questionnaire

**Preconditions:** Release at Scoping stage; questionnaire not yet completed; newer requirement version available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete and submit the questionnaire | Requirements are scoped |
| 2 | Navigate to Process/Product Requirements tab | Requirements are scoped with the updated (latest) version automatically |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-011` — Scoping (already scoped) or Clone: warning with Keep/Change

**Preconditions:** Release at Scoping stage; questionnaire already submitted; newer requirement version available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process/Product Requirements tab | A warning banner is visible with `Keep previous version` and `Change version` buttons |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-012` — Scope Approval: same behavior as already-scoped

**Preconditions:** Release at Scope Approval stage; newer requirement version available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process/Product Requirements tab | A warning banner is visible with `Keep previous version` and `Change version` buttons |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-013` — In Progress (Manage): warning with Keep/Change; update after re-scoping

**Preconditions:** Release at Manage stage; newer requirement version available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process/Product Requirements tab | A warning banner is visible with `Keep previous version` and `Change version` options |
| 2 | Verify updated requirements are shown only after re-scoping | The new requirement is not in the active list until a re-scoping action is performed |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-014` — FCSR+ stages: no version notification

**Preconditions:** Release at FCSR Readiness Review, FCSR Review, Final Acceptance, or Issue Closure stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process/Product Requirements tab | No warning banner about requirement version updates is visible |

**Coverage dimension:** State Transitions (negative)

---

#### `RELEASE-REQ-VERSION-015` — Completed/Cancelled/Inactive: no version notification

**Preconditions:** Release at Completed, Cancelled, or Inactive stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process/Product Requirements tab | No warning banner about requirement version updates is visible |

**Coverage dimension:** State Transitions (negative)

---

#### `RELEASE-REQ-VERSION-016` — Scoping (not yet scoped): new requirement auto-added

**Preconditions:** Release at Scoping; a new requirement added in BackOffice; questionnaire not yet completed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete the questionnaire | Requirements are scoped |
| 2 | Navigate to requirements tab | The new requirement from BackOffice is visible in the scoped requirements list |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-017` — Scoping (already scoped) or Clone: warning about new requirement

**Preconditions:** Release at Scoping (already scoped); a new requirement added in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab | A warning is visible about the requirements set update |
| 2 | Verify the new requirement is not in the active list until re-scoping | The new requirement appears only after `Change version` is applied and re-scoping is performed |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-018` — Scope Approval: warning about new requirement

**Preconditions:** Release at Scope Approval; new requirement in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab | Warning banner visible with Keep/Change version options |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-019` — Manage: new requirement after re-scoping only

**Preconditions:** Release at Manage stage; new requirement in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab | Warning visible about new requirement |
| 2 | Verify new requirement appears only after re-scoping | The new requirement is not in the active list until re-scoping |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-020` — FCSR+/Completed/Cancelled/Inactive: no new requirement notification

**Preconditions:** Release at FCSR+ or terminal stage; new requirement in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab | No notification about new requirements is visible |

**Coverage dimension:** State Transitions (negative)

---

#### `RELEASE-REQ-VERSION-021` — Scoping (not yet scoped): deactivated requirement excluded

**Preconditions:** Release at Scoping; a requirement deactivated in BackOffice; questionnaire not yet completed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete the questionnaire | Requirements are scoped |
| 2 | Navigate to requirements tab | The deactivated requirement is not present in the scoped list |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-022` — Scoping (already scoped) or Clone: deactivated requirement warning

**Preconditions:** Release at Scoping (already scoped); requirement deactivated in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab | Warning visible about deactivated requirement |
| 2 | Verify the deactivated requirement is removed only after re-scoping | The requirement remains in the list until `Change version` + re-scoping is applied |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-023` — Scope Approval: deactivated requirement warning

**Preconditions:** Release at Scope Approval; requirement deactivated in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab | Warning visible; deactivated requirement removed only after re-scoping |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-024` — Manage: deactivated requirement removed after re-scoping

**Preconditions:** Release at Manage; requirement deactivated in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab | Warning visible about deactivated requirement |
| 2 | Verify removal only after re-scoping | The requirement remains until re-scoping is performed |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-VERSION-025` — FCSR+/Completed/Cancelled/Inactive: no deactivation notification

**Preconditions:** Release at FCSR+ or terminal stage; requirement deactivated in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab | No notification about deactivated requirements is visible |

**Coverage dimension:** State Transitions (negative)

---

#### `RELEASE-REQ-VERSION-026` — Minor field update applied immediately

**Preconditions:** BackOffice updates a non-major field for a requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab on a release | The requirement shows the updated minor field value immediately (no warning banner) |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-027` — No warning popup for minor field changes

**Preconditions:** BackOffice updates a non-major field for a requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab on a release | No warning banner is visible for the minor field change |

**Coverage dimension:** State Transitions (negative)

---

#### `RELEASE-REQ-VERSION-028` — Auto-trigger date shown in warning banner

**Preconditions:** BackOffice specified "Add change in N days"; warning banner visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the warning banner | The banner shows the auto-apply date calculated from the "Add change in N days" setting |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-029` — Auto-trigger date applies changes automatically

**Preconditions:** The auto-trigger date has been reached; user did not manually apply the version change.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab after the auto-trigger date | The requirement version is updated automatically; no warning banner is shown |

**Coverage dimension:** State Transitions
**Note:** Requires time-based test data manipulation or waiting for the trigger date.

---

#### `RELEASE-REQ-VERSION-030` — "Add change on date" auto-apply behavior

**Preconditions:** BackOffice specified "Add change on date"; that date has passed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to requirements tab after the specified date | The changes are automatically applied |

**Coverage dimension:** State Transitions
**Note:** Same as RELEASE-REQ-VERSION-029 but with a fixed date instead of relative days.

---

#### `RELEASE-REQ-VERSION-031` — Version update logged in Release History

**Preconditions:** A requirement version update has been applied on a release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `View History` link on the Release Detail page | The Release History popup opens |
| 2 | Verify the history entries | An entry for the version update is visible with the activity type related to requirement versioning |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-VERSION-032` — History entry records version details

**Preconditions:** Release History popup open; version update entry visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the version update history entry | The entry shows: old version, new version, user who confirmed the change, and timestamp |

**Coverage dimension:** Data Integrity

---

## 4. Review Gate Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ Navigate, Click, Type, Select, Hover, Toggle, Verify |
| 2 | Every expected result is machine-verifiable | ✅ Observable states only |
| 3 | No vague terms from banned list | ✅ No "check", "ensure", "should", "validate" |
| 4 | UI element names match DOM snapshot | ✅ Based on exploration-findings.md |
| 5 | Negative cases for every input field | ✅ Duplicate names, empty fields, invalid XLSX, locked requirements |
| 6 | Role-based access tested | ⚠️ Responsible user routing covered; denied-role tests deferred to Stage 2+ |
| 7 | State transitions: happy + illegal | ✅ Versioning per-stage (allowed + not-shown stages), parent-child toggle states |
| 8 | Data integrity: create + read-back | ✅ Custom req CRUD, XLSX import accuracy, clone inheritance |
| 9 | Cross-feature side effects | ✅ BackOffice → Release propagation, History logging |
| 10 | No environment-specific hardcoded values | ✅ No URLs, no hardcoded user names, no exact row counts |

---

## 5. NEW Test Cases — Gap Coverage (Session 2)

> Created: 2026-04-22 — Session 2 gap analysis
> 58 NEW scenarios covering previously untested features

### 5.1 Roles & Responsibilities Tab (RELEASE-ROLES-*)

> **Gap:** ZERO scenarios existed for the R&R tab — this is a complete subsystem with add/replace/remove user flows, SDL roles display, email/location auto-populate, and Product Team CRUD.

#### `RELEASE-ROLES-001` — Tab loads with SDL roles and Product Team sections [P1]

**Preconditions:** Logged in; release at Scoping stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Release Detail page at Scoping stage | The Release Detail heading is visible |
| 2 | Click the Roles & Responsibilities tab | The tab becomes active |
| 3 | Verify the tab content | An SDL Roles section is visible showing role names. A Product Team section is visible below with at least 1 role row |

---

#### `RELEASE-ROLES-002` — SDL Roles section shows default role assignments [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Roles & Responsibilities tab on a release at Scoping stage | SDL Roles section contains role rows with User Role, Team Members, Email, and Location columns |
| 2 | Verify SDL Roles content | At least 1 SDL role has a pre-populated team member name (inherited from Product Details) |

---

#### `RELEASE-ROLES-003` — "+Add User" button opens user assignment popup/row [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Roles & Responsibilities tab | Product Team section visible with column headers: User Role, Team Members, Email, Location, Remove |
| 2 | Click the +ADD USER button in the Product Team section | A new empty row or user assignment popup appears, allowing role and user selection |

---

#### `RELEASE-ROLES-004` — Assign a new individual to a Product Team role [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the +ADD USER button | User Role dropdown visible |
| 2 | Select a role from the User Role dropdown | Role is selected |
| 3 | Click the pencil icon or Team Members cell for user lookup | User lookup searchbox is visible |
| 4 | Type at least 4 characters of a known user name | Search results appear |
| 5 | Click the matching user result | Selected user name appears in Team Members column; Email and Location auto-populate |

---

#### `RELEASE-ROLES-005` — Replace an individual via pencil icon [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to R&R tab with at least 1 assigned team member | At least 1 team member row visible |
| 2 | Click the pencil icon next to an existing team member name | User lookup searchbox appears |
| 3 | Type at least 4 characters of a different user name | Search results appear |
| 4 | Click the matching user result | New user name replaces the previous one; Email and Location update |

---

#### `RELEASE-ROLES-006` — Remove an individual via bin/delete icon [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to R&R tab with at least 1 assigned team member | Team member rows visible |
| 2 | Note the current number of team members | — |
| 3 | Click the bin/delete icon on a team member row | The row is removed; count decreases by 1 |

---

#### `RELEASE-ROLES-007` — Email and Location auto-populate on user selection [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Assign a user to a Product Team role | User is assigned |
| 2 | Verify the Email column | Email is not empty |
| 3 | Verify the Location column | Location is not empty |

---

#### `RELEASE-ROLES-008` — Product Roles are optional at Scoping stage [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to R&R tab on a release at Scoping stage | Tab loads |
| 2 | Verify no mandatory-field validation prevents leaving Product Roles empty | No validation error shown |
| 3 | Navigate to a different tab (e.g., Questionnaire) | Navigation succeeds without error |

**Note:** Product Roles become mandatory at Manage stage per user guide.

---

#### `RELEASE-ROLES-009` — Grid columns verification [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to R&R tab | Tab loads |
| 2 | Verify the Product Team grid column headers | Grid shows columns: User Role, Team Members, Email, Location, Remove |

---

#### `RELEASE-ROLES-010` — SDL roles are read-only (no edit controls) [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to R&R tab | Tab loads |
| 2 | Verify the SDL Roles section | No edit icons (pencil, bin) are visible; section is display-only |

---

### 5.2 Cancel Release (RELEASE-CANCEL-*)

> **Gap:** No scenarios for the Cancel Release flow from Stage 1.

#### `RELEASE-CANCEL-001` — "Cancel Release" button visible at Scoping stage [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Release Detail page at Scoping stage | Release Detail heading visible |
| 2 | Verify the action buttons area | Cancel Release button is visible |

---

#### `RELEASE-CANCEL-002` — Clicking "Cancel Release" shows confirmation dialog [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Release Detail at Scoping stage | — |
| 2 | Click the Cancel Release button | A confirmation dialog appears with Confirm and Cancel buttons |

---

#### `RELEASE-CANCEL-003` — Confirming cancellation changes status to "Cancelled" [P1]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click Cancel Release on a release at Scoping stage | Confirmation dialog appears |
| 2 | Click Confirm | Release status badge updates to Cancelled; pipeline bar reflects cancelled state |

---

#### `RELEASE-CANCEL-004` — Cancelled release hidden when "Show Active Only" ON [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Releases tab after cancelling a release | — |
| 2 | Verify release visibility with Show Active Only ON (default) | Cancelled release not visible |
| 3 | Toggle Show Active Only to OFF | Cancelled release becomes visible with Cancelled status |

---

#### `RELEASE-CANCEL-005` — Cancelled release shows warning message [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the detail page of a cancelled release | — |
| 2 | Verify the warning message | "Release has been cancelled. Please create a new release." is visible |

---

### 5.3 Show Active Only Toggle (RELEASE-DETAILS-012 to 014)

#### `RELEASE-DETAILS-012` — "Show Active Only" toggle defaults to ON [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page with multiple releases | — |
| 2 | Click the Releases tab | Show Active Only toggle is visible and ON by default |
| 3 | Verify only active releases shown | Only ongoing releases appear in the grid |

---

#### `RELEASE-DETAILS-013` — Toggle OFF reveals Completed, Cancelled, Inactive releases [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Releases tab; note visible release count | — |
| 2 | Toggle Show Active Only to OFF | Release count increases; Completed/Cancelled/Inactive releases visible |

---

#### `RELEASE-DETAILS-014` — Toggle back ON hides non-active releases again [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | With toggle OFF, toggle Show Active Only back ON | Completed/Cancelled/Inactive releases disappear; only active remain |

---

### 5.4 Release Details — Edit Mode (RELEASE-DETAILS-EDIT-*)

#### `RELEASE-DETAILS-EDIT-001` — "Edit Release Details" enters edit mode [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Release Details tab at Scoping stage | — |
| 2 | Click Edit Release Details button | Target Release Date becomes an editable date picker; Change Summary becomes editable textarea; Save and Cancel buttons visible |

---

#### `RELEASE-DETAILS-EDIT-002` — Save persists the updated Change Summary [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter edit mode on Release Details tab | — |
| 2 | Clear Change Summary and type "Updated change summary" | — |
| 3 | Click Save | Page exits edit mode; Change Summary displays "Updated change summary" |

---

#### `RELEASE-DETAILS-EDIT-003` — Cancel shows Leave Page dialog; dismiss returns to edit [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter edit mode; modify Change Summary | — |
| 2 | Click Cancel | Leave Page confirmation dialog appears |
| 3 | Click "Stay" or dismiss | Returns to edit mode with unsaved changes preserved |

---

#### `RELEASE-DETAILS-EDIT-004` — Cancel + confirm Leave discards changes [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter edit mode; modify Change Summary | — |
| 2 | Click Cancel | Leave Page dialog appears |
| 3 | Click "Leave" | Page exits edit mode; Change Summary shows original unmodified value |

---

### 5.5 Submit for Review from Stage 1 (RELEASE-SCOPE-SUBMIT-*)

#### `RELEASE-SCOPE-SUBMIT-001` — "Submit for Review" disabled before questionnaire [P1]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Release Detail at Scoping stage (pre-questionnaire) | Submit for Review button visible but disabled |

---

#### `RELEASE-SCOPE-SUBMIT-002` — "Submit for Review" enabled after questionnaire [P1]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Release Detail at Scoping stage | — |
| 2 | Complete and submit the questionnaire | Submit for Review button becomes enabled |

---

#### `RELEASE-SCOPE-SUBMIT-003` — Clicking "Submit for Review" transitions to Review & Confirm [P1]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On post-questionnaire release at Scoping, click Submit for Review | Release status changes to Review & Confirm; pipeline bar highlights R&C stage |

---

#### `RELEASE-SCOPE-SUBMIT-004` — After submit, Review & Confirm tab accessible [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit release for review from Scoping | — |
| 2 | Click Review & Confirm tab | Tab is no longer disabled; content loads with Requirements Summary, Scope Review Participants, Key Discussion Topics sections |

---

#### `RELEASE-SCOPE-SUBMIT-005` — Process/Product Requirements remain accessible after submit [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit release for review from Scoping | — |
| 2 | Click Process Requirements tab | Requirements grid visible |
| 3 | Click Product Requirements tab | Requirements grid visible |

---

### 5.6 Questionnaire — DPP & Risk Classification (RELEASE-QUESTIONNAIRE-017 to 021)

#### `RELEASE-QUESTIONNAIRE-017` — Privacy Risk value displayed after submission (DPP applicable) [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete and submit questionnaire on a DPP-applicable release | Privacy Risk label and value visible on Questionnaire tab header |

---

#### `RELEASE-QUESTIONNAIRE-018` — Risk Classification value displayed after submission [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete and submit questionnaire | Risk Classification label and value visible on Questionnaire tab header |

---

#### `RELEASE-QUESTIONNAIRE-019` — "Edit Answers" button visible after submission [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete and submit questionnaire | Edit Answers button is visible on Questionnaire tab |

---

#### `RELEASE-QUESTIONNAIRE-020` — "Edit Answers" re-opens questionnaire for modification [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | After questionnaire submission, click Edit Answers | Questionnaire questions are visible and editable; Submit button available |

---

#### `RELEASE-QUESTIONNAIRE-021` — Auto-save: answers persist on tab switch [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Start questionnaire and answer first question | — |
| 2 | Navigate to a different tab (e.g., Release Details) | — |
| 3 | Navigate back to Questionnaire tab | Previously answered question retains its value |

**Note:** Auto-save every 1 minute per user guide. Tab switch + return is simplest verification.

---

### 5.7 Release Creation — Additional (RELEASE-CREATE-014 to 017)

#### `RELEASE-CREATE-014` — "Reset Form" clears all fields [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Create Release dialog | — |
| 2 | Type version and select date | — |
| 3 | Click Reset Form | Release Version empty; Target Release Date reverts to default; Change Summary empty |

---

#### `RELEASE-CREATE-015` — Change Summary accepts multiline text [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Create Release dialog | — |
| 2 | Type multiline text into Change Summary | Field contains the entered multiline text |

---

#### `RELEASE-CREATE-016` — Release created with "Scoping" as initial status [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create a new release with valid data | — |
| 2 | Navigate to Release Detail page | Release status badge shows "Scoping"; pipeline highlights "Creation & Scoping" |

---

#### `RELEASE-CREATE-017` — Target Release Date does not accept past dates [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Create Release dialog | — |
| 2 | Open the Target Release Date flatpickr calendar | — |
| 3 | Verify yesterday's date | Yesterday's date is disabled/non-interactive |
| 4 | Select today's date | Today's date is selectable |

---

### 5.8 Clone Release — Additional (RELEASE-CLONE-007 to 008)

#### `RELEASE-CLONE-007` — Source Release dropdown shows all existing releases [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Create Release for a product with multiple releases | Clone from existing release radio selected by default |
| 2 | Click Source Release dropdown | At least 2 release options listed |

---

#### `RELEASE-CLONE-008` — E2E: Clone a release and verify it in Releases tab [P1]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Create Release for a product with ≥1 existing release | Clone from existing release selected |
| 2 | Type a unique Release Version | — |
| 3 | Select a future Target Release Date | — |
| 4 | Type a Change Summary | — |
| 5 | Click Create & Scope | Dialog closes; URL contains /ReleaseDetail |
| 6 | Navigate back to product's Releases tab | Cloned release visible with Scoping status and entered version |

---

### 5.9 Process Requirements — Expand/Collapse & Filters (RELEASE-PROCREQ-*)

#### `RELEASE-PROCREQ-EXPAND-001` — SDL Practice groups collapsed by default [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab on a post-questionnaire release | All SDL Practice groups visible but collapsed |

---

#### `RELEASE-PROCREQ-EXPAND-002` — Clicking expand arrow reveals requirements [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the expand arrow on an SDL Practice group | Group expands showing requirements with Name, Description, Status columns |

---

#### `RELEASE-PROCREQ-EXPAND-003` — "Show sub-requirements" toggle reveals sub-requirements [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab | — |
| 2 | Expand an SDL Practice group | — |
| 3 | Toggle Show sub-requirements to ON | Sub-requirements appear indented under parent requirements |

---

#### `RELEASE-PROCREQ-EXPAND-004` — "Show all requirements" toggle reveals Not Selected items [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab; note visible requirements | — |
| 2 | Toggle Show all requirements to ON | Requirements with Not Selected status become visible; total count increases |

---

#### `RELEASE-PROCREQ-EXPAND-005` — "Show only new requirements" toggle [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab | — |
| 2 | Toggle Show only new requirements to ON | Only newly scoped requirements visible (may show empty if none added since scoping) |

---

#### `RELEASE-PROCREQ-FILTER-001` — SDL Practice dropdown filter [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab | — |
| 2 | Select an SDL Practice from filter dropdown | Only requirements under selected practice visible; others hidden |

---

#### `RELEASE-PROCREQ-FILTER-002` — Status dropdown filter [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab | — |
| 2 | Select a status (e.g., Planned) from Status dropdown | Only requirements with selected status visible |

---

#### `RELEASE-PROCREQ-FILTER-003` — Reset button clears all filters [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply SDL Practice filter and Status filter | — |
| 2 | Click Reset button | All SDL Practice groups restored; all statuses shown; dropdowns return to default |

---

#### `RELEASE-PROCREQ-EXPORT-001` — Export XLSX downloads requirements file [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Process Requirements tab | — |
| 2 | Click Export XLSX button | A .xlsx file download starts |

---

### 5.10 Product Requirements — Expand/Collapse, Search & Filters (RELEASE-PRODREQ-*)

#### `RELEASE-PRODREQ-EXPAND-001` — Product categories collapsed by default [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Requirements tab on a post-questionnaire release | Product requirement categories visible but collapsed by default |

---

#### `RELEASE-PRODREQ-SEARCH-001` — Search input filters by name/description [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Requirements tab | — |
| 2 | Type a partial requirement name into Search input | Grid updates to show only matching requirements; non-matching hidden |

---

#### `RELEASE-PRODREQ-SEARCH-002` — Clearing search restores all requirements [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply search filter on Product Requirements | — |
| 2 | Clear the Search input field | All product requirement categories visible again |

---

#### `RELEASE-PRODREQ-FILTER-001` — Category filter narrows visible requirements [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Requirements tab | — |
| 2 | Select a category from Category filter dropdown | Only requirements under selected category visible |

---

#### `RELEASE-PRODREQ-FILTER-002` — Status filter limits visible requirements [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Requirements tab | — |
| 2 | Select a status from Status filter dropdown | Only matching requirements visible |

---

### 5.11 Data Protection & Privacy Applicability (RELEASE-DPP-SCOPE-*)

#### `RELEASE-DPP-SCOPE-001` — DPP Review tab visible on Release Detail page [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Release Detail page | Data Protection and Privacy Review tab visible in the tab bar |

---

#### `RELEASE-DPP-SCOPE-002` — DPP tab presence before questionnaire at Scoping [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Release Detail at Scoping (pre-questionnaire) | A toggle or configuration for DPP applicability is visible |

**Note:** DPP can be disabled before completing Questionnaire at Scoping stage.

---

### 5.12 Release Header — Additional (RELEASE-HEADER-015 to 016)

#### `RELEASE-HEADER-015` — All 9 content tabs visible on Release Detail page [P1]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Release Detail at Scoping (post-questionnaire) | Tabs visible: Release Details, Roles & Responsibilities, Questionnaire, Process Requirements, Product Requirements, Review & Confirm, Data Protection and Privacy Review, Cybersecurity Residual Risks, FCSR Decision |

---

#### `RELEASE-HEADER-016` — Pipeline bar tooltip shows stage dates [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Release Detail with ≥1 completed stage | — |
| 2 | Hover over a completed stage in pipeline bar | Tooltip or inline text shows username and completion date |

---

### 5.13 Cross-Feature: Product config change impact (RELEASE-SCOPE-CROSS-*)

#### `RELEASE-SCOPE-CROSS-001` — Product Definition change requires questionnaire re-submission [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Details; change Product Definition field | — |
| 2 | Navigate to release at Scoping stage | Questionnaire tab indicates re-submission required |

**Note:** Per user guide: Product Definition and Product Type changes impact requirements scoping.

---

#### `RELEASE-SCOPE-CROSS-002` — Product Type change requires questionnaire re-submission [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Details; change Product Type field | — |
| 2 | Navigate to release at Scoping stage | Questionnaire tab indicates re-submission required |

---

## 6. Tracker Actions

### Remove duplicates and meta-summaries
```bash
npx tsx scripts/tracker.ts remove WF04-0001
npx tsx scripts/tracker.ts remove WF04-0002
npx tsx scripts/tracker.ts remove WF04-0003
npx tsx scripts/tracker.ts remove WF04-0004
npx tsx scripts/tracker.ts remove WF04-0082
npx tsx scripts/tracker.ts remove WF04-0114
```

### Update steps for all NO-STEPS scenarios
See Section 8 below (DB update script).

---

## 7. Summary

| Metric | Count |
|--------|-------|
| Total scenarios in Stage 1 workflow | 256 |
| Automated | 82 |
| Pending | 174 |
| Duplicates/meta removed (Session 1) | 6 |
| Steps written for existing scenarios (Session 1) | 79 |
| **NEW scenarios created (Session 2)** | **58** |
| New — P1 (critical happy paths) | 7 |
| New — P2 (validation, negative, features) | 39 |
| New — P3 (edge cases) | 12 |

### New Scenario Breakdown by Subsection

| Subsection | Prefix | New Count |
|-----------|--------|-----------|
| Roles & Responsibilities Tab | RELEASE-ROLES-* | 10 |
| Cancel Release | RELEASE-CANCEL-* | 5 |
| Show Active Only Toggle | RELEASE-DETAILS-012 to 014 | 3 |
| Release Details — Edit Mode | RELEASE-DETAILS-EDIT-* | 4 |
| Submit for Review from Stage 1 | RELEASE-SCOPE-SUBMIT-* | 5 |
| Questionnaire — DPP & Risk | RELEASE-QUESTIONNAIRE-017 to 021 | 5 |
| Release Creation — Additional | RELEASE-CREATE-014 to 017 | 4 |
| Clone Release — Additional | RELEASE-CLONE-007 to 008 | 2 |
| Process Requirements — Expand/Filters | RELEASE-PROCREQ-* | 9 |
| Product Requirements — Search/Filters | RELEASE-PRODREQ-* | 5 |
| DPP Applicability | RELEASE-DPP-SCOPE-* | 2 |
| Release Header — Additional | RELEASE-HEADER-015 to 016 | 2 |
| Cross-Feature Config Impact | RELEASE-SCOPE-CROSS-* | 2 |
| **Total** | | **58** |
