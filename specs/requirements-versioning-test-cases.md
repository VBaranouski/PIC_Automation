# WF 19. Requirements Versioning: BackOffice Administration — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `backoffice` · **Workflow:** Requirements Versioning: BackOffice Administration
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 30 |
| Automated | 0 |
| Pending | 30 |
| On-Hold | 0 |
| Has Steps | 0 |
| Missing Steps | 30 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | CONFIRM-001–008 cover versioning popup; HISTORY-001–006 cover version history |
| Negative / Validation | ✅ | EXPORT-002/003 cover invalid import values |
| Role-Based Access | ❌ | **Missing: non-admin user cannot access BackOffice versioning** |
| State Transitions | ✅ | HISTORY-001/002 cover version creation; RESTORE-001–005 cover restore flow |
| Data Integrity | ✅ | CHANGELOG-001/002, CODE-001–003, FIELDS-001/002 |

### 1.3 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| BACKOFFICE-VERSION-ROLE-001 | Non-admin user cannot access BackOffice requirements page | P2 | Role-Based Access — denied |
| BACKOFFICE-VERSION-ROLE-002 | BackOffice admin can create and version requirements | P2 | Role-Based Access — allowed |

---

## 2. Test Case Specifications

### 2.1 Version Confirmation Popup

#### `BACKOFFICE-VERSION-CONFIRM-001` — Confirmation popup appears when a requirement is updated

**Preconditions:** User is logged in as BackOffice admin. A Product or Process requirement exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the requirement detail page in BackOffice | The requirement form loads |
| 2 | Click `Edit` and modify any field (e.g., Description) | The field value changes |
| 3 | Click `Save` | A confirmation popup appears with versioning options |

**Coverage dimension:** Happy Path
**Subsection:** Version Confirmation Popup

---

#### `BACKOFFICE-VERSION-CONFIRM-002` — Popup text: "Added changes for this requirement/sub-requirements would be stored as new version."

**Preconditions:** Versioning confirmation popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the popup text content | The text "Added changes for this requirement/sub-requirements would be stored as new version." is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Version Confirmation Popup

---

#### `BACKOFFICE-VERSION-CONFIRM-003` — Popup shows 3 radio button options for version timing

**Preconditions:** Versioning confirmation popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify radio option "Do not trigger change on specific date" is visible and selected by default | The radio is visible and checked |
| 2 | Verify radio option "Add change in N days" is visible | The radio is visible |
| 3 | Verify radio option "Add change on date" is visible | The radio is visible |

**Coverage dimension:** Happy Path
**Subsection:** Version Confirmation Popup

---

#### `BACKOFFICE-VERSION-CONFIRM-004` — "Do not trigger change on specific date" — change added only after re-scoping

**Preconditions:** Versioning confirmation popup open. Default option selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify "Do not trigger change on specific date" is selected | The radio is checked |
| 2 | Click `Save` | The requirement saves |
| 3 | Navigate to a release at Scoping stage and check requirements | The new version is NOT automatically applied; it requires re-scoping to appear |

**Coverage dimension:** Data Integrity
**Subsection:** Version Confirmation Popup

---

#### `BACKOFFICE-VERSION-CONFIRM-005` — "Add change in N days" accepts integer >= 0

**Preconditions:** Versioning confirmation popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select the "Add change in N days" radio option | An input field for N appears |
| 2 | Type `7` into the days input | The value is accepted |
| 3 | Click `Save` | The requirement saves; the change is scheduled to be pushed after 7 days |

**Coverage dimension:** Happy Path
**Subsection:** Version Confirmation Popup

---

#### `BACKOFFICE-VERSION-CONFIRM-006` — "Add change on date" accepts only future dates

**Preconditions:** Versioning confirmation popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select the "Add change on date" radio option | A date picker appears |
| 2 | Select a future date | The date is accepted |
| 3 | Click `Save` | The requirement saves; the change is scheduled for the selected date |

**Coverage dimension:** Happy Path
**Subsection:** Version Confirmation Popup

---

#### `BACKOFFICE-VERSION-CONFIRM-007` — "Save" saves with selected option; "Cancel" closes without saving

**Preconditions:** Versioning confirmation popup open with a non-default option selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select "Add change in N days" and enter `5` | The option is configured |
| 2 | Click `Cancel` | The popup closes; the requirement is NOT saved |
| 3 | Verify the requirement still shows the original field values | No changes were persisted |

**Coverage dimension:** Negative / Validation
**Subsection:** Version Confirmation Popup

---

#### `BACKOFFICE-VERSION-CONFIRM-008` — Same popup appears for requirement creation, activation, or deactivation

**Preconditions:** BackOffice admin.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create a new Product requirement and click `Save` | The versioning confirmation popup appears |
| 2 | Cancel and navigate to an existing requirement; toggle `Is Active` OFF | The toggle changes |
| 3 | Click `Save` | The versioning confirmation popup appears |

**Coverage dimension:** Happy Path
**Subsection:** Version Confirmation Popup

---

### 2.2 Code Field Behavior

#### `BACKOFFICE-VERSION-CODE-001` — Product Requirements "Code" field is editable only during creation

**Preconditions:** BackOffice admin creating a new Product requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the new Product Requirement creation form | The form loads |
| 2 | Verify the `Code` field is editable | The field accepts input |
| 3 | Fill in the Code and save the requirement | The requirement is created |
| 4 | Open the requirement in edit mode | The form loads in edit mode |
| 5 | Verify the `Code` field is disabled | The field is read-only / disabled |

**Coverage dimension:** Data Integrity
**Subsection:** Code Field Behavior

---

#### `BACKOFFICE-VERSION-CODE-002` — Process Requirements "Requirement Code" field is editable only during creation

**Preconditions:** BackOffice admin creating a new Process requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the new Process Requirement creation form | The form loads |
| 2 | Verify the `Requirement Code` field is editable | The field accepts input |
| 3 | Fill in the Code and save | The requirement is created |
| 4 | Open the requirement in edit mode | The `Requirement Code` field is disabled |

**Coverage dimension:** Data Integrity
**Subsection:** Code Field Behavior

---

#### `BACKOFFICE-VERSION-CODE-003` — Uploading a requirement with a different code via XLSX creates a new requirement

**Preconditions:** BackOffice admin. XLSX file contains a requirement with a code that doesn't exist in the DB.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Import the XLSX file with the new requirement code | The import completes |
| 2 | Verify a new requirement is created (not updating an existing one) | The requirement list shows the new entry with the imported code |
| 3 | Verify the original requirement with the old code still exists | Both requirements are present |

**Coverage dimension:** Data Integrity
**Subsection:** Code Field Behavior

---

### 2.3 Version History

#### `BACKOFFICE-VERSION-HISTORY-001` — Each update creates a new version with auto-incremented version number

**Preconditions:** BackOffice admin. A requirement with at least 1 version exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the current version number of the requirement | The version (e.g., v.1) is recorded |
| 2 | Edit the requirement and save with the versioning popup | The save completes |
| 3 | Verify the version number incremented | The new version shows v.2 (or one higher than before) |

**Coverage dimension:** Data Integrity
**Subsection:** Version History

---

#### `BACKOFFICE-VERSION-HISTORY-002` — Version importance is auto-classified: "Major" or "Minor"

**Preconditions:** BackOffice admin. A requirement has been updated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Edit the `Name` field of a Product requirement and save | The versioning popup appears; save with default option |
| 2 | View the version history | The new version is classified as "Major" (Name is a major field) |
| 3 | Edit the `Priority` field of the same requirement and save | Another version is created |
| 4 | View the version history | The new version is classified as "Minor" |

**Coverage dimension:** Data Integrity
**Subsection:** Version History

---

#### `BACKOFFICE-VERSION-HISTORY-003` — Product requirement major fields: Name, Description, Selection Criteria, Is Active

**Preconditions:** BackOffice admin.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Edit the `Name` field and save | Version classified as "Major" |
| 2 | Edit the `Description` field and save | Version classified as "Major" |
| 3 | Edit the `Selection Criteria` field and save | Version classified as "Major" |
| 4 | Toggle `Is Active` and save | Version classified as "Major" |

**Coverage dimension:** Data Integrity
**Subsection:** Version History
**Note:** May be split into separate atomic tests during automation.

---

#### `BACKOFFICE-VERSION-HISTORY-004` — Process requirement major fields: Requirement Name, Description, Selection Criteria, Is Active

**Preconditions:** BackOffice admin.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Edit the `Requirement Name` field and save | Version classified as "Major" |
| 2 | Edit the `Description` field and save | Version classified as "Major" |

**Coverage dimension:** Data Integrity
**Subsection:** Version History

---

#### `BACKOFFICE-VERSION-HISTORY-005` — Version record stores: version number, importance, timing fields, dates

**Preconditions:** BackOffice admin. A requirement has multiple versions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the requirement's version history | The version history view loads |
| 2 | Verify each version row shows: version number, importance label, "Add change in days" / "Add change on date", Start date, End date | All fields are visible for each version entry |

**Coverage dimension:** Data Integrity
**Subsection:** Version History

---

#### `BACKOFFICE-VERSION-HISTORY-006` — Previous version End date is set to the day before the update

**Preconditions:** BackOffice admin. A requirement has been updated today.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the requirement's version history | The history loads |
| 2 | Check the End date of the previous version | The End date is yesterday (day before the update) |
| 3 | Check the Start date of the new version | The Start date is today |

**Coverage dimension:** Data Integrity
**Subsection:** Version History

---

### 2.4 Version Restore

#### `BACKOFFICE-VERSION-RESTORE-001` — "View previous" link opens a dropdown to select previous versions

**Preconditions:** BackOffice admin. A requirement has ≥ 2 versions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the requirement detail page | The page loads |
| 2 | Click the `View previous` link | A dropdown appears listing previous version numbers |

**Coverage dimension:** Happy Path
**Subsection:** Version Restore

---

#### `BACKOFFICE-VERSION-RESTORE-002` — Previous version opens in read-only format

**Preconditions:** "View previous" dropdown is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a previous version from the dropdown | The previous version data loads |
| 2 | Verify all fields show the historical values | Field values match the previous version |
| 3 | Verify the form is in read-only mode | No `Edit` or `Save` buttons for field modifications are visible |

**Coverage dimension:** Data Integrity
**Subsection:** Version Restore

---

#### `BACKOFFICE-VERSION-RESTORE-003` — "Restore this version" button is shown on the read-only view

**Preconditions:** A previous version is being viewed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Restore this version` button is visible | The button is visible |

**Coverage dimension:** Happy Path
**Subsection:** Version Restore

---

#### `BACKOFFICE-VERSION-RESTORE-004` — Restoring a version requires justification text and creates a new version

**Preconditions:** Viewing a previous version.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Restore this version` button | A justification input or dialog appears |
| 2 | Type a justification text | The text is entered |
| 3 | Confirm the restore | A new version is created matching the restored version's field values |
| 4 | Verify the version number incremented | The new version number is higher than all previous ones |

**Coverage dimension:** Data Integrity
**Subsection:** Version Restore

---

#### `BACKOFFICE-VERSION-RESTORE-005` — Restoring adds End date to the current (replaced) version

**Preconditions:** A version has just been restored.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the version history | The history loads |
| 2 | Verify the previously current version now has an End date set | The End date is populated |
| 3 | Verify the restored (new) version has no End date | The End date is empty (current version) |

**Coverage dimension:** Data Integrity
**Subsection:** Version Restore

---

### 2.5 XLSX Export/Import

#### `BACKOFFICE-VERSION-EXPORT-001` — Exported XLSX includes versioning columns

**Preconditions:** BackOffice admin. Requirements with versioning data exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Export requirements via BackOffice XLSX export | A .xlsx file downloads |
| 2 | Open the file and verify columns include "Add change in days" and "Add change on date" | Both columns are present |
| 3 | Verify the columns contain the values from the last update | The values match the DB records |

**Coverage dimension:** Data Integrity
**Subsection:** XLSX Export/Import

---

#### `BACKOFFICE-VERSION-EXPORT-002` — Import: "Add change in days" invalid value shows error

**Preconditions:** BackOffice admin. XLSX file with invalid "Add change in days" value (e.g., "abc").

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Import the XLSX file with an invalid "Add change in days" value | The import runs |
| 2 | Verify an error message appears | The error "Row N - Add change in days can be only integer which is 0 or higher" is visible |

**Coverage dimension:** Negative / Validation
**Subsection:** XLSX Export/Import

---

#### `BACKOFFICE-VERSION-EXPORT-003` — Import: "Add change on date" invalid value shows error

**Preconditions:** BackOffice admin. XLSX file with invalid date format (e.g., "13/01/2026").

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Import the XLSX file with an invalid "Add change on date" value | The import runs |
| 2 | Verify an error message appears | The error "Row N - Add change on date can be only date in format YYYYMMDD" is visible |

**Coverage dimension:** Negative / Validation
**Subsection:** XLSX Export/Import

---

#### `BACKOFFICE-VERSION-EXPORT-004` — Import: both columns empty = non-mandatory change

**Preconditions:** XLSX file with both "Add change in days" and "Add change on date" empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Import the XLSX file | The import succeeds |
| 2 | Verify the requirement is updated without a scheduled trigger | The version is created with default option (no specific date trigger) |

**Coverage dimension:** Data Integrity
**Subsection:** XLSX Export/Import

---

### 2.6 Field Presence Validation

#### `BACKOFFICE-VERSION-FIELDS-001` — "Applicability Code" field is NOT present on Product Requirement forms

**Preconditions:** BackOffice admin. Product Requirement detail page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Product Requirement detail/edit page | The form loads |
| 2 | Verify no `Applicability Code` field exists on the form | The field label is not visible |

**Coverage dimension:** Negative / Validation
**Subsection:** Field Presence Validation

---

#### `BACKOFFICE-VERSION-FIELDS-002` — "Triggers" field is NOT present on Process Requirement forms

**Preconditions:** BackOffice admin. Process Requirement detail page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a Process Requirement detail/edit page | The form loads |
| 2 | Verify no `Triggers` field exists on the form | The field label is not visible |

**Coverage dimension:** Negative / Validation
**Subsection:** Field Presence Validation

---

### 2.7 Change History Log

#### `BACKOFFICE-VERSION-CHANGELOG-001` — BackOffice Change History table logs all requirement version changes

**Preconditions:** BackOffice admin. A requirement has been updated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the requirement's Change History section | The change history table loads |
| 2 | Verify at least 1 entry is visible | A change log row is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Change History Log

---

#### `BACKOFFICE-VERSION-CHANGELOG-002` — Table records: date, user (SESA ID), version number, old/new values

**Preconditions:** Change History has at least 1 entry.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the change history row shows a date column | The date value is visible |
| 2 | Verify the user column shows a SESA ID or username | The user identifier is visible |
| 3 | Verify the version number is shown | The version number is visible |
| 4 | Verify old and new values are shown for the changed field | Both old and new values are visible |

**Coverage dimension:** Data Integrity
**Subsection:** Change History Log

---

### 2.8 Role-Based Access (NEW)

#### `BACKOFFICE-VERSION-ROLE-001` — Non-admin user cannot access BackOffice requirements page

**Preconditions:** User is logged in without BackOffice admin privileges.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate directly to the BackOffice requirements URL | The user is redirected or an access-denied page is shown |
| 2 | Verify the requirements management page is not accessible | No requirement form or list is visible |

**Coverage dimension:** Role-Based Access — denied
**Subsection:** Role-Based Access

---

#### `BACKOFFICE-VERSION-ROLE-002` — BackOffice admin can create and version requirements

**Preconditions:** User is logged in as BackOffice admin.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the BackOffice requirements section | The requirements list loads |
| 2 | Click `Create` to add a new requirement | The creation form opens |
| 3 | Fill in required fields and save | The versioning confirmation popup appears; save completes |
| 4 | Verify the new requirement appears in the list | The requirement is visible with v.1 |

**Coverage dimension:** Role-Based Access — allowed
**Subsection:** Role-Based Access

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| Version Confirmation Popup | BACKOFFICE-VERSION-CONFIRM-001 through 008 |
| Code Field Behavior | BACKOFFICE-VERSION-CODE-001 through 003 |
| Version History | BACKOFFICE-VERSION-HISTORY-001 through 006 |
| Version Restore | BACKOFFICE-VERSION-RESTORE-001 through 005 |
| XLSX Export/Import | BACKOFFICE-VERSION-EXPORT-001 through 004 |
| Field Presence Validation | BACKOFFICE-VERSION-FIELDS-001, 002 |
| Change History Log | BACKOFFICE-VERSION-CHANGELOG-001, 002 |
| Role-Based Access | BACKOFFICE-VERSION-ROLE-001, 002 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms | ✅ |
| 4 | UI element names match DOM snapshot | ✅ |
| 5 | Negative cases | ✅ (CONFIRM-007, EXPORT-002/003, FIELDS-001/002) |
| 6 | Role-based access tested | ✅ (ROLE-001, ROLE-002) |
| 7 | State transitions | ✅ (HISTORY-001/002, RESTORE-004/005) |
| 8 | Data integrity | ✅ (CHANGELOG-001/002, CODE-001/002, HISTORY-005/006) |
| 9 | Cross-feature side effects | ✅ (Versioning affects release-level requirements) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 30 |
| New scenarios | 2 (ROLE-001, ROLE-002) |
| Total scenarios | 32 |
| P1 | 5 |
| P2 | 18 |
| P3 | 9 |
