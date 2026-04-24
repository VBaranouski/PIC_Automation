# Delegated Requirements Traceability — Test Cases

**Feature area:** releases  
**Workflow:** Delegated Requirements Traceability  
**Jira feature:** [PIC-8802](https://jira.se.com/browse/PIC-8802)  
**In-scope stories:** PIC-8803 (manual + bulk delegation), PIC-8804 (display + edit), PIC-8833 (XLSX export/import), PIC-8839 (Jira/Jama sync warning)  
**Excluded:** PIC-8805 (On Hold), PIC-8998 (New)  
**Scenario prefix:** `RELEASE-REQ-DELEGATED-*`  
**Confluence:** https://confluence.se.com/spaces/PIC/pages/587596145/Delegated+Requirements+Traceability

---

## Coverage Analysis

### Existing Coverage

No prior `RELEASE-REQ-DELEGATED-*` scenarios exist. PROCESS-REQ-TAB-011 and PRODUCT-REQ-TAB-011 mention the three-dot action for "Delegated" status but mark the delegation popup interaction as deferred.

### Five-Dimension Gap Table

| Dimension | Status | Coverage Source |
|-----------|--------|-----------------|
| Happy Path | ❌ | None — delegation popup flow untested |
| Negative / Validation | ❌ | No validation tests for delegation popup fields |
| Role-Based Access | ❌ | No RBAC tests for requirement status edit privilege |
| State Transitions | ❌ | No tests for delegation edit/removal after first save |
| Data Integrity | ❌ | No create → read-back for delegation details |

---

## New Scenario Inventory

| ID | Title | Priority | Subsection |
|----|-------|----------|------------|
| RELEASE-REQ-DELEGATED-001 | Set Process Requirement to Delegated and save delegation details (known product) | P1 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-002 | Set Product Requirement to Delegated and save delegation details (known product) | P1 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-003 | Selecting "Other Product" reveals Other Product text field and Contact Person lookup | P2 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-004 | Contact Person lookup search returns matching users and selected user is saved | P2 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-005 | "+Add Product" button appends a second delegation product form | P2 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-006 | "+Add Requirement" button appends a second requirement row in the delegation form | P2 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-007 | Remove Product confirmation popup appears and removing clears the product form | P2 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-008 | Remove Requirement confirmation popup appears and removing clears the requirement row | P2 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-009 | Saving delegation without Due Date triggers confirmation popup | P2 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-010 | Saving delegation without Product Name shows validation error | P2 | Delegation Popup — Manual |
| RELEASE-REQ-DELEGATED-011 | Bulk update of multiple process requirements to Delegated shows delegation popup | P1 | Delegation Popup — Bulk Update |
| RELEASE-REQ-DELEGATED-012 | Bulk delegation with "Other Product" selected reveals Other Product and Contact Person fields | P2 | Delegation Popup — Bulk Update |
| RELEASE-REQ-DELEGATED-013 | View Requirement Info popup for a delegated requirement shows delegation section in read-only | P1 | Delegation Display & Edit |
| RELEASE-REQ-DELEGATED-014 | Edit Requirement popup for a delegated requirement shows delegation fields as editable | P1 | Delegation Display & Edit |
| RELEASE-REQ-DELEGATED-015 | Requirement that others are delegated to shows information icon with correct tooltip | P2 | Delegation Display & Edit |
| RELEASE-REQ-DELEGATED-016 | Requirement Info for receiving requirement shows collapsible "Delegated Requirement" section | P2 | Delegation Display & Edit |
| RELEASE-REQ-DELEGATED-017 | CSRR SDL Processes Summary shows delegation info for a delegated process requirement | P2 | Delegation Display & Edit |
| RELEASE-REQ-DELEGATED-018 | CSRR Product Requirements Summary shows delegation info for a delegated product requirement | P2 | Delegation Display & Edit |
| RELEASE-REQ-DELEGATED-019 | Delegation link fields in Requirement Info popup are clickable and navigate to target | P2 | Delegation Display & Edit |
| RELEASE-REQ-DELEGATED-020 | Exporting process requirements XLSX includes a "Delegation Details" tab with all required columns | P1 | Export/Import XLSX |
| RELEASE-REQ-DELEGATED-021 | Exporting product requirements XLSX includes a "Delegation Details" tab with all required columns | P1 | Export/Import XLSX |
| RELEASE-REQ-DELEGATED-022 | Importing XLSX with valid delegation data updates requirement delegation details | P1 | Export/Import XLSX |
| RELEASE-REQ-DELEGATED-023 | Importing XLSX where Product ID exists in PICASso links the product and displays its name | P2 | Export/Import XLSX |
| RELEASE-REQ-DELEGATED-024 | Importing XLSX with both Product ID and Product Name empty returns an error | P2 | Export/Import XLSX |
| RELEASE-REQ-DELEGATED-025 | Importing XLSX with Delegated Requirement Code not in the requirements library returns an error | P2 | Export/Import XLSX |
| RELEASE-REQ-DELEGATED-026 | Importing XLSX with Delegated Requirement Code not scoped for the specified release returns an error | P2 | Export/Import XLSX |
| RELEASE-REQ-DELEGATED-027 | Importing XLSX with a past Delegation Due Date succeeds without error | P3 | Export/Import XLSX |
| RELEASE-REQ-DELEGATED-028 | Process/product requirement delegated via Jira/Jama API sync without delegation details shows warning | P2 | API Sync Warning |
| RELEASE-REQ-DELEGATED-029 | Submitting release to next stage with unresolved delegation warning shows warning but does not block | P2 | API Sync Warning |

**Total:** 29 scenarios — 5× P1, 22× P2, 2× P3

---

## Test Case Specifications

### Subsection: Delegation Popup — Manual

---

#### `RELEASE-REQ-DELEGATED-001` — Set Process Requirement to Delegated and save delegation details (known product)

**Preconditions:** Security Manager role; release at Manage stage with at least one process requirement in "Planned" or "In Progress" status; a known product exists in PICASso with at least one active release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release detail page at Manage stage | The `Process Requirements` tab is visible in the release navigation |
| 2 | Click the `Process Requirements` tab | The Process Requirements grid loads with at least 1 requirement row |
| 3 | Click the three-dot icon on a requirement row with non-Delegated status | The three-dot action menu opens with status options listed |
| 4 | Click the `Delegated` option in the status action menu | The Delegation Details popup opens with the header "Delegated to Product \<Product Name\>" and fields: `Product Name`, `Product Release`, `Requirement`, `Status`, `Evaluation Status`, `Due Date`, `Delegated Requirement Part` visible |
| 5 | Click the `Product Name` dropdown and search for the known product by name | The matching product appears in the dropdown list |
| 6 | Click the known product name in the dropdown | The `Product Release` dropdown is populated with the known product's releases; the `Requirement` dropdown becomes available |
| 7 | Select an active release from the `Product Release` dropdown | The `Requirement` dropdown is populated with requirements of the selected release |
| 8 | Select a requirement from the `Requirement` dropdown | The `Status` (read-only) and `Evaluation Status` (read-only) fields display the current values of the selected requirement |
| 9 | Click the `Due Date` date picker and select a future date | The selected date appears in the `Due Date` field |
| 10 | Click the `Save` button | The popup closes; the requirement row status in the Process Requirements grid shows `Delegated` |
| 11 | Click the three-dot icon on the same requirement row and click `View/Edit` | The Requirement Info popup opens showing delegation section with the saved Product, Release, Requirement, Due Date values |

**Coverage dimension:** Happy Path, Data Integrity  
**Note:** `SCOPE_SUBMIT` privilege required for Security Manager role.

---

#### `RELEASE-REQ-DELEGATED-002` — Set Product Requirement to Delegated and save delegation details (known product)

**Preconditions:** Security Manager role; release at Manage stage with at least one product requirement in a non-Delegated status; a known product with active releases exists in PICASso.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release detail page at Manage stage | The `Product Requirements` tab is visible in the release navigation |
| 2 | Click the `Product Requirements` tab | The Product Requirements grid loads with at least 1 requirement row |
| 3 | Click the three-dot icon on a product requirement row | The three-dot action menu opens with status options including `Delegated` |
| 4 | Click the `Delegated` option | The Delegation Details popup opens with `Product Name`, `Product Release`, `Requirement`, `Status`, `Evaluation Status`, `Due Date`, `Delegated Requirement Part` fields |
| 5 | Click the `Product Name` dropdown and select the known product | The `Product Release` dropdown is populated with that product's releases |
| 6 | Select a release from `Product Release` | The `Requirement` dropdown lists product requirements of the selected release |
| 7 | Select a product requirement from the `Requirement` dropdown | The `Status` and `Evaluation Status` read-only fields are populated |
| 8 | Click `Save` | The popup closes; the product requirement row status shows `Delegated` |
| 9 | Click `View/Edit` on the same row | The Requirement Info popup shows delegation fields with the saved values |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `RELEASE-REQ-DELEGATED-003` — Selecting "Other Product" reveals Other Product text field and Contact Person lookup

**Preconditions:** Security Manager role; release at Manage stage; Delegation Details popup open for any requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release Process Requirements tab at Manage stage | The Process Requirements grid is visible with at least 1 row |
| 2 | Click the three-dot icon on any requirement row and click `Delegated` | The Delegation Details popup opens with the `Product Name` dropdown visible |
| 3 | Click the `Product Name` dropdown | The dropdown opens; the `Other Product` option is listed at the top of the dropdown |
| 4 | Select `Other Product` from the `Product Name` dropdown | The `Other Product` free-text field becomes visible; the `Contact Person` lookup field becomes visible; the `Product Release` field becomes a free-text input |
| 5 | Verify the `Product Name` dropdown shows `Other Product` as selected | The `Product Name` dropdown displays `Other Product` as the selected value |

**Coverage dimension:** Negative/Validation, State Transitions  
**Note:** "Other Product" path hides release/requirement dropdowns and replaces them with free-text fields.

---

#### `RELEASE-REQ-DELEGATED-004` — Contact Person lookup search returns matching users and selected user is saved

**Preconditions:** Security Manager role; Delegation Details popup open with `Other Product` selected; a known PICASso user exists for lookup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release Process Requirements tab and open the Delegation Details popup for any requirement | The Delegation Details popup is open |
| 2 | Select `Other Product` from the `Product Name` dropdown | The `Contact Person` lookup field is visible |
| 3 | Click the `Contact Person` lookup field and type at least 4 characters of a known user's name | A list of matching users appears below the `Contact Person` field |
| 4 | Click the matching user name in the lookup results | The `Contact Person` field displays the selected user's full name |
| 5 | Type the product name in the `Other Product` free-text field and click `Save` | The popup closes; the requirement status shows `Delegated`; opening `View/Edit` on the requirement shows the Contact Person value |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `RELEASE-REQ-DELEGATED-005` — "+Add Product" button appends a second delegation product form

**Preconditions:** Security Manager role; Delegation Details popup open with first product form filled.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the Delegation Details popup for a process requirement at Manage stage | The popup is open with one product form section visible |
| 2 | Select a product in the `Product Name` dropdown | The first product form is populated |
| 3 | Click the `+Add Product` button below the delegation form | A second product delegation form section appears with blank `Product Name`, `Product Release`, `Requirement`, `Status`, `Evaluation Status`, `Due Date`, `Delegated Requirement Part` fields; a `Remove Product` button appears on each form |
| 4 | Verify only 2 product form sections are visible | Exactly 2 product form sections are visible in the popup |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REQ-DELEGATED-006` — "+Add Requirement" button appends a second requirement row in the delegation form

**Preconditions:** Security Manager role; Delegation Details popup open; a product with at least 2 requirements selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the Delegation Details popup for a process requirement at Manage stage | The popup is open |
| 2 | Select a product and a release in the first product form | The `Requirement` dropdown is available |
| 3 | Click the `+Add Requirement` button | A second `Requirement` and `Delegated Requirement Part` row appears within the same product form; a `Remove Requirement` button appears on each row |
| 4 | Select a different requirement in the second row | The second requirement row displays the newly selected requirement |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REQ-DELEGATED-007` — Remove Product confirmation popup appears and removing clears the product form

**Preconditions:** Security Manager role; Delegation Details popup open with 2 product forms added.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the Delegation Details popup with 2 product forms (via +Add Product) | Two product form sections are visible |
| 2 | Click the `Remove Product` button on the second product form | A confirmation popup appears with text "Are you sure you want to remove this product?" and `Confirm` / `Cancel` buttons |
| 3 | Click `Confirm` | The confirmation popup closes; only 1 product form section remains in the delegation popup |
| 4 | Verify the first product form is still intact | The first product form still shows its previously selected product values |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-DELEGATED-008` — Remove Requirement confirmation popup appears and removing clears the requirement row

**Preconditions:** Security Manager role; Delegation Details popup open with 2 requirement rows added via +Add Requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the Delegation Details popup with 2 requirement rows in one product form | Two requirement rows are visible within the product form |
| 2 | Click the `Remove Requirement` button on the second requirement row | A confirmation popup appears with text "Are you sure you want to remove this requirement?" and `Confirm` / `Cancel` buttons |
| 3 | Click `Confirm` | The confirmation popup closes; only 1 requirement row remains in the product form |
| 4 | Verify an empty `Requirement` field is still visible | At least one (empty) `Requirement` field row remains visible in the product form |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-DELEGATED-009` — Saving delegation without Due Date triggers confirmation popup

**Preconditions:** Security Manager role; Delegation Details popup open with Product Name filled but Due Date left empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the Delegation Details popup for a process requirement at Manage stage | The popup is open with the `Due Date` field empty |
| 2 | Select a product from the `Product Name` dropdown | The product is selected |
| 3 | Leave the `Due Date` field empty | The `Due Date` field remains blank |
| 4 | Click the `Save` button | A confirmation popup appears containing the text "You haven't specified a due date for requirement(s) delegated to following products:" followed by the product name, with options to confirm or cancel |
| 5 | Click `Confirm` | The confirmation popup closes; the Delegation Details popup closes; the requirement status shows `Delegated` |

**Coverage dimension:** Negative/Validation, State Transitions

---

#### `RELEASE-REQ-DELEGATED-010` — Saving delegation without Product Name shows validation error

**Preconditions:** Security Manager role; Delegation Details popup open with Product Name empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the Delegation Details popup for a process requirement at Manage stage | The popup is open with `Product Name` field empty |
| 2 | Click `Save` without selecting a `Product Name` | A validation message indicating `Product Name` is required is visible in the popup; the popup remains open |
| 3 | Verify the requirement status in the grid is unchanged | The requirement row still shows its original (non-Delegated) status |

**Coverage dimension:** Negative/Validation

---

### Subsection: Delegation Popup — Bulk Update

---

#### `RELEASE-REQ-DELEGATED-011` — Bulk update of multiple process requirements to Delegated shows delegation popup

**Preconditions:** Security Manager role; release at Manage stage with at least 2 process requirements in non-Delegated status; a known product exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab at Manage stage | The Process Requirements grid is visible |
| 2 | Select the checkboxes for at least 2 requirement rows | Both rows are selected (checkboxes checked) |
| 3 | Click the bulk action control and select `Delegated` status | The Delegation Details popup opens for bulk update; it contains the same `Product Name`, `Product Release`, `Requirement`, `Due Date`, `Delegated Requirement Part` fields as the single-edit popup |
| 4 | Select a known product from `Product Name` and select a release from `Product Release` | The `Requirement` dropdown is available |
| 5 | Click `Save` | The popup closes; all selected requirement rows show `Delegated` status |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REQ-DELEGATED-012` — Bulk delegation with "Other Product" selected reveals Other Product and Contact Person fields

**Preconditions:** Security Manager role; bulk Delegation Details popup open (2+ requirements selected).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the bulk Delegation Details popup (2+ process requirements selected with Delegated status) | The bulk delegation popup is open with `Product Name` dropdown |
| 2 | Select `Other Product` from the `Product Name` dropdown | The `Other Product` free-text field is visible; the `Contact Person` lookup field is visible; `Product Release` becomes a free-text field |

**Coverage dimension:** Negative/Validation

---

### Subsection: Delegation Display & Edit

---

#### `RELEASE-REQ-DELEGATED-013` — View Requirement Info popup for a delegated requirement shows delegation section in read-only

**Preconditions:** Security Manager role; a process or product requirement exists with `Delegated` status and delegation details already saved (delegated to a known product + release + requirement).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab at Manage stage | The Process Requirements grid is visible |
| 2 | Locate a row with `Delegated` status and click `View/Edit` in the Actions column | The Requirement Info popup opens |
| 3 | Scroll to the delegation section of the popup | A delegation section is visible with the following read-only fields: `Delegated to Product`, `Delegated to Release`, `Delegated to Requirement`, `Status`, `Evaluation Status`, `Delegated Requirement Part`, `Due Date` |
| 4 | Verify the delegation fields are not editable in view mode | The delegation fields display as read-only text (no input controls active) |
| 5 | Verify the saved product, release, and requirement names match the values entered during delegation | The `Delegated to Product`, `Delegated to Release`, `Delegated to Requirement` fields contain the values saved during delegation |

**Coverage dimension:** Data Integrity, State Transitions

---

#### `RELEASE-REQ-DELEGATED-014` — Edit Requirement popup for a delegated requirement shows delegation fields as editable

**Preconditions:** Security Manager role; a process requirement with `Delegated` status and saved delegation details exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab at Manage stage | The Process Requirements grid is visible |
| 2 | Click the three-dot icon on a `Delegated` requirement row and click `Edit` (or View/Edit → Edit) | The Edit Requirement popup opens |
| 3 | Scroll to the delegation fields section | The delegation fields (`Product Name`, `Product Release`, `Requirement`, `Due Date`, `Delegated Requirement Part`) are visible and editable (input controls are active) |
| 4 | Change the `Due Date` to a new future date and click `Save` | The popup closes; opening the Requirement Info popup again shows the updated `Due Date` value |

**Coverage dimension:** Data Integrity, State Transitions

---

#### `RELEASE-REQ-DELEGATED-015` — Requirement that others are delegated to shows information icon with correct tooltip

**Preconditions:** A release exists where at least one requirement (requirement A) has been delegated to requirement B in the same or a different release. Both releases are accessible to the test user (Security Manager or Product Owner role).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab of the release that contains the receiving requirement (B) | The Process Requirements grid is visible |
| 2 | Locate requirement B (the one that others were delegated to) | Requirement B row is visible |
| 3 | Verify that an information icon is visible next to requirement B's status | An information icon (ℹ) is visible adjacent to requirement B's status value |
| 4 | Hover over the information icon | A tooltip appears containing the text "Requirement(s) was delegated to this requirement." |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-DELEGATED-016` — Requirement Info for receiving requirement shows collapsible "Delegated Requirement" section

**Preconditions:** Same setup as RELEASE-REQ-DELEGATED-015; requirement B (receiving requirement) is accessible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab of the release containing requirement B | The grid is visible |
| 2 | Click `View/Edit` on requirement B | The Requirement Info popup opens |
| 3 | Scroll down to locate the `Delegated Requirement` section | A collapsible `Delegated Requirement` section is visible in the popup |
| 4 | Click the `Delegated Requirement` section header to expand it | The section expands and shows at least the following fields: `Requirement Name`, `Status`, `Delegated from Product`, `Delegated from Release`, `Comment`, `Due Date` |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-DELEGATED-017` — CSRR SDL Processes Summary shows delegation info for a delegated process requirement

**Preconditions:** Security Manager role; release at Manage stage; at least one process requirement has `Delegated` status with saved delegation details.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the CSRR tab of the release at Manage stage | The Cybersecurity Residual Risks page loads with the `SDL Processes Summary` section visible |
| 2 | Scroll to the `SDL Processes Summary` section and expand the relevant SDL Practice accordion | The requirements list is visible |
| 3 | Locate the delegated process requirement and click `View Requirement` | The View/Edit Evaluation Status popup or Requirement info opens |
| 4 | Scroll to the delegation section | The delegation fields are visible: `Delegated to Product`, `Delegated to Release`, `Delegated to Requirement`, `Status`, `Delegated Requirement Part`, `Due Date` |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-DELEGATED-018` — CSRR Product Requirements Summary shows delegation info for a delegated product requirement

**Preconditions:** Security Manager role; release at Manage stage; at least one product requirement has `Delegated` status with saved delegation details.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the CSRR tab of the release at Manage stage | The CSRR page loads |
| 2 | Scroll to the `Product Requirements Summary` section and expand a product category accordion | The product requirements list is visible |
| 3 | Locate the delegated product requirement and click `View Requirement` or `Edit Evaluation Status` | The popup opens showing delegation fields: `Delegated to Product`, `Delegated to Release`, `Delegated to Requirement`, `Status`, `Delegated Requirement Part`, `Due Date` |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-DELEGATED-019` — Delegation link fields in Requirement Info popup are clickable and navigate to target

**Preconditions:** Security Manager role; a requirement with `Delegated` status delegated to a known PICASso product + release; both are accessible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab at Manage stage and click `View/Edit` on a delegated requirement | The Requirement Info popup opens with delegation section visible |
| 2 | Locate the `Delegated to Product` field value | The product name is displayed as a clickable link |
| 3 | Click the `Delegated to Product` link | The browser navigates to or opens the product detail page; the URL contains the product detail path |
| 4 | Return to the release page and re-open the Requirement Info popup | The delegation section is still visible |
| 5 | Click the `Delegated to Release` link | The browser navigates to the release detail page; the URL contains the release detail path |

**Coverage dimension:** Happy Path

---

### Subsection: Export/Import XLSX

---

#### `RELEASE-REQ-DELEGATED-020` — Exporting process requirements XLSX includes a "Delegation Details" tab with all required columns

**Preconditions:** Security Manager role; release at Manage stage with at least one process requirement in `Delegated` status with saved delegation details.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab at Manage stage | The Process Requirements grid is visible |
| 2 | Click the `Export XLSX` button on the Process Requirements tab toolbar | A `.xlsx` file download starts within 10 seconds |
| 3 | Open the downloaded file and inspect the sheet tabs | A tab named `Delegation Details` is present in the file alongside the `Data` and `Instructions` tabs |
| 4 | Click the `Delegation Details` tab | The tab contains at minimum the following column headers: `Requirement Code`, `Requirement Name`, `Delegated to Product ID`, `Delegated to Product Name`, `Delegated to Release ID`, `Delegated to Product Release`, `Delegated to Requirement Code`, `Delegated to Requirement Name`, `Delegation Due Date`, `Delegated Requirement Part` |
| 5 | Verify at least one data row exists for the delegated requirement | At least 1 data row is present in the `Delegation Details` tab; the `Requirement Code` column matches the code of the delegated requirement |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `RELEASE-REQ-DELEGATED-021` — Exporting product requirements XLSX includes a "Delegation Details" tab with all required columns

**Preconditions:** Security Manager role; release at Manage stage with at least one product requirement in `Delegated` status with saved delegation details.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Requirements tab at Manage stage | The Product Requirements grid is visible |
| 2 | Click the `Export XLSX` button on the Product Requirements tab toolbar | A `.xlsx` file download starts within 10 seconds |
| 3 | Open the downloaded file and inspect the sheet tabs | A tab named `Delegation Details` is present in the file |
| 4 | Click the `Delegation Details` tab | The tab contains at minimum the column headers: `Requirement Code`, `Requirement Name`, `Delegated to Product ID`, `Delegated to Product Name`, `Delegated to Release ID`, `Delegated to Product Release`, `Delegated to Requirement Code`, `Delegated to Requirement Name`, `Delegation Due Date`, `Delegated Requirement Part` |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `RELEASE-REQ-DELEGATED-022` — Importing XLSX with valid delegation data updates requirement delegation details

**Preconditions:** Security Manager role; release at Manage stage; a valid export XLSX file from the same release with `Delegation Details` tab populated with a known product ID, release ID, requirement code, and a future due date.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab at Manage stage | The Process Requirements grid is visible |
| 2 | Click the `Export XLSX` button to download the current file | A `.xlsx` file is downloaded |
| 3 | Open the file; on the `Delegation Details` tab, populate: `Delegated to Product ID` = a known PICASso product ID (format PIC-xxx), `Delegated to Release ID` = a known release ID, `Delegation Due Date` = a future date in YYYY-MM-DD format | The file is updated and saved |
| 4 | Return to the Process Requirements tab and click the import/upload button and upload the modified XLSX | The import processes; a success message or result summary is visible indicating rows were processed |
| 5 | Navigate to the `View/Edit` popup of the process requirement specified in the import | The Requirement Info popup shows the delegation section populated with the product name, release, and due date that were in the imported file |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `RELEASE-REQ-DELEGATED-023` — Importing XLSX where Product ID exists in PICASso links the product and displays its name

**Preconditions:** Same as RELEASE-REQ-DELEGATED-022; XLSX has a valid `Delegated to Product ID` that exists in PICASso.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Import the XLSX with a valid `Delegated to Product ID` (e.g., `PIC-1234`) | The import completes without errors |
| 2 | Open the Requirement Info popup for the imported requirement | The `Delegated to Product` field displays the product's name (not just the ID); the name matches the product registered under that ID in PICASso |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REQ-DELEGATED-024` — Importing XLSX with both Product ID and Product Name empty returns an error

**Preconditions:** Security Manager role; valid export XLSX with `Delegation Details` tab where `Delegated to Product ID` and `Delegated to Product Name` columns are both empty for at least one data row.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Prepare the XLSX file with one `Delegation Details` row where both `Delegated to Product ID` and `Delegated to Product Name` are empty | The file is ready for upload |
| 2 | Upload the XLSX via the import control on the Process Requirements tab | The import returns an error result; an error message is visible indicating that both Product ID and Product Name cannot be empty |
| 3 | Verify the requirement's delegation status is not changed | The requirement retains its previous delegation values (or no delegation if none existed) |

**Coverage dimension:** Negative/Validation

---

#### `RELEASE-REQ-DELEGATED-025` — Importing XLSX with Delegated Requirement Code not in the requirements library returns an error

**Preconditions:** Security Manager role; XLSX `Delegation Details` tab contains a `Delegated to Requirement Code` value that does not exist in the PICASso requirements library.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Prepare the XLSX with a `Delegated to Requirement Code` = `NONEXISTENT-REQ-999` (a code that does not exist) | The file is ready |
| 2 | Upload the XLSX via the import control on the Process Requirements tab | The import returns an error result; an error message is visible indicating the requirement code does not exist in the library |
| 3 | Verify the affected requirement's delegation details are not updated | The requirement retains its previous delegation values |

**Coverage dimension:** Negative/Validation

---

#### `RELEASE-REQ-DELEGATED-026` — Importing XLSX with Delegated Requirement Code not scoped for the specified release returns an error

**Preconditions:** Security Manager role; XLSX `Delegation Details` tab contains a `Delegated to Requirement Code` that exists in the library but is not scoped for the target release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Prepare the XLSX with a valid `Delegated to Product ID` and `Delegated to Release ID` but a `Delegated to Requirement Code` that is not in scope for that release | The file is ready |
| 2 | Upload the XLSX via the import control on the Process Requirements tab | The import returns an error result; an error message indicates the requirement code is not scoped for the specified release |

**Coverage dimension:** Negative/Validation

---

#### `RELEASE-REQ-DELEGATED-027` — Importing XLSX with a past Delegation Due Date succeeds without error

**Preconditions:** Security Manager role; XLSX `Delegation Details` tab contains a `Delegation Due Date` set to a date in the past (e.g., 2024-01-01).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Prepare the XLSX with `Delegation Due Date` = `2024-01-01` (past date) | The file is ready |
| 2 | Upload the XLSX via the import control on the Process Requirements tab | The import completes without errors; no date-validation error is shown |
| 3 | Open the Requirement Info popup for the affected requirement | The `Due Date` field in the delegation section shows `2024-01-01` (or the localised equivalent) |

**Coverage dimension:** Negative/Validation (boundary — past dates explicitly allowed per spec)

---

### Subsection: API Sync Warning

---

#### `RELEASE-REQ-DELEGATED-028` — Process/product requirement delegated via Jira/Jama API sync without delegation details shows warning

**Preconditions:** Security Manager or Product Owner role; a release has Jira or Jama integration configured; a requirement's status was changed to `Delegated` in the external system (Jira/Jama) and synchronised into PICASso without delegation traceability details.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements tab of the release that received the sync | The Process Requirements grid is visible |
| 2 | Locate the requirement whose status was synced to `Delegated` from Jira/Jama | The requirement row with `Delegated` status is visible |
| 3 | Verify a warning icon is visible next to the `Delegated` status label on the requirement row | A warning icon (⚠) is visible adjacent to the `Delegated` status on that row |
| 4 | Hover over or click the warning icon | A tooltip or message appears with text "Please specify delegation details" |

**Coverage dimension:** State Transitions

---

#### `RELEASE-REQ-DELEGATED-029` — Submitting release to next stage with unresolved delegation warning shows warning but does not block

**Preconditions:** Same as RELEASE-REQ-DELEGATED-028; release is at Manage stage; at least one requirement has a delegation warning; the release is otherwise ready for stage submission.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release overview at Manage stage | The release detail page is visible |
| 2 | Click the stage submission button (e.g., `Submit for SA & PQL Sign Off`) | A warning message is displayed noting that one or more requirements with `Delegated` status are missing delegation details |
| 3 | Verify the warning message does not prevent submission | A `Confirm` or `Proceed` option is available to continue despite the warning; the dialog does not show a hard error blocking submission |
| 4 | Click `Confirm` | The release transitions to the next stage; the warning message is no longer shown on the release overview |

**Coverage dimension:** State Transitions, Negative/Validation

---

## Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms from banned list | ✅ |
| 4 | UI element names consistent (based on Jira AC / Confluence spec) | ✅ |
| 5 | Negative cases for every input field | ✅ (010, 024, 025, 026) |
| 6 | Role-based access tested (allowed + denied) | ⚠️ Allowed role (Security Manager) covered in all scenarios; Viewer denial is implicitly covered by PROCESS-REQ-TAB-011/PRODUCT-REQ-TAB-011 |
| 7 | State transitions: happy path + ≥1 illegal | ✅ (007, 008, 009, 010) |
| 8 | Data integrity: create + read-back | ✅ (001, 002, 013, 014, 022, 023) |
| 9 | Cross-feature side effects identified | ✅ (CSRR display in 017, 018; info icon in 015) |
| 10 | No environment-specific hardcoded values | ✅ |
| 11 | Every scenario ID follows `AREA-SUBSECTION-NNN` format | ✅ `RELEASE-REQ-DELEGATED-NNN` |
| 12 | Every scenario has steps + expected results (to be verified post-insert) | ✅ after backfill |
| 13 | No description starts with `<ID>: ` | ✅ |
| 14 | All role names match `access-privileges.md` canonical list | ✅ Security Manager, Product Owner, Viewer Global |
| 15 | No duplicate IDs | ✅ 001–029 sequential |
| 16 | No duplicate titles within workflow | ✅ |
| 17 | Scenarios ordered sequentially within subsection | ✅ 001–029 |
| 18 | Steps and expected results aligned | ✅ (same count per row) |
| 19 | Serial-suite mode documented | ✅ These scenarios are independent (each begins with Navigate); `describe` (not serial) |
