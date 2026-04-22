# WF 18. Maintenance Mode — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `other` · **Workflow:** Maintenance Mode
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 21 |
| Automated | 0 |
| Pending | 21 |
| On-Hold | 0 |
| Has Steps | 0 |
| Missing Steps | 21 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | CONFIG-001–013 cover BackOffice configuration; USER-001–004 cover user experience |
| Negative / Validation | ⚠️ | **Missing: invalid date range (end before start), empty required fields** |
| Role-Based Access | ✅ | ADMIN-001–003 cover privileged access; USER-001 covers blocked access |
| State Transitions | ✅ | CONFIG-011/013 cover activation/deactivation transitions |
| Data Integrity | ⚠️ | **Missing: maintenance message persistence after edit** |

### 1.3 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| MAINTENANCE-NEG-001 | End date before start date shows validation error | P2 | Negative — date validation |
| MAINTENANCE-NEG-002 | Saving configuration with empty required fields shows validation errors | P2 | Negative — empty fields |
| MAINTENANCE-DATA-001 | Maintenance message text persists correctly after edit and save | P3 | Data Integrity — persistence |

---

## 2. Test Case Specifications

### 2.1 BackOffice Configuration

#### `MAINTENANCE-CONFIG-001` — BackOffice shows "Maintenance Mode Configuration" link

**Preconditions:** User is logged in as BackOffice admin.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → Notification Configuration section | The section loads |
| 2 | Verify the `Maintenance Mode Configuration` link is visible | The link is visible with URL containing `/GRC_BackOffice/MaintenanceConfig` |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-002` — Maintenance Mode Configuration page breadcrumb

**Preconditions:** BackOffice admin. Maintenance Mode Configuration page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Maintenance Mode Configuration` link | The page loads |
| 2 | Verify the breadcrumb shows "BACKOFFICE > Maintenance Mode Configuration" | The breadcrumb text matches |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-003` — Page shows current status label: "INACTIVE" or "ACTIVE"

**Preconditions:** Maintenance Mode Configuration page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the status label is visible on the page | A label showing "INACTIVE" or "ACTIVE" is visible |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-004` — Configuration fields: Start Date and Time, End Date and Time (datetime pickers)

**Preconditions:** Maintenance Mode Configuration page is open in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Start Date and Time` datetime picker is visible | The picker is visible with a required indicator (*) |
| 2 | Verify the `End Date and Time` datetime picker is visible | The picker is visible with a required indicator (*) |
| 3 | Click the `Start Date and Time` picker | A date/time selection control opens |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-005` — "Placeholders instructions" tooltip explains placeholder syntax

**Preconditions:** Maintenance Mode Configuration page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hover over or click the `Placeholders instructions` tooltip/link | A tooltip or info panel appears |
| 2 | Verify the tooltip mentions `[START_DATE_AND_TIME]` and `[END_DATE_AND_TIME]` | Both placeholder names are visible in the text |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-006` — "Text to be displayed" section has Header and Body fields

**Preconditions:** Configuration page in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Header` text field is visible | The Header input supports placeholder syntax |
| 2 | Verify the `Body` rich text field is visible | The Body field has rich text editing controls |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-007` — "Preview" link shows rendered maintenance message

**Preconditions:** Header and Body fields have content.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type text with placeholders into the Header field (e.g., "Maintenance until [END_DATE_AND_TIME]") | The text is entered |
| 2 | Click the `Preview` link | A preview panel or popup shows the rendered message with placeholders replaced by actual date/time values |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-008` — "Is Active" checkbox and "Edit" button control activation

**Preconditions:** Configuration page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Is Active` checkbox is visible | The checkbox is visible |
| 2 | Verify the `Edit` button is visible | The `Edit` button is visible |
| 3 | Click the `Edit` button | The form fields become editable |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-009` — "Updated On" and "Updated By" metadata fields show last edit info

**Preconditions:** Configuration has been previously saved.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Updated On` field is visible with a date/time value | The field is not empty |
| 2 | Verify the `Updated By` field is visible with a user name | The field is not empty |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-010` — "Edit" button enables field editing; changes saved via Save button

**Preconditions:** Configuration page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Edit` button | The form fields become editable |
| 2 | Modify the Header text | The field accepts new text |
| 3 | Click the `Save` button | The changes are saved; the form returns to read-only mode |
| 4 | Verify the Header field shows the updated text | The new text persists |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-011` — Toggling "Is Active" ON immediately redirects non-privileged users

**Preconditions:** BackOffice admin has the configuration open. At least one non-privileged user is active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit` and check the `Is Active` checkbox | The checkbox is checked |
| 2 | Set valid Start/End dates and click `Save` | The configuration saves with status "ACTIVE" |
| 3 | In a separate browser session, log in as a non-privileged user | The user is redirected to the Maintenance Page |

**Coverage dimension:** State Transitions
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-012` — Maintenance message Header and Body text appears verbatim on the Maintenance Page

**Preconditions:** Maintenance mode is active with custom Header and Body text.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to PICASso as a non-privileged user | The Maintenance Page is displayed |
| 2 | Verify the Header text matches the configured value (with placeholders resolved) | The header text is visible and matches |
| 3 | Verify the Body text matches the configured value | The body text is visible and matches |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-013` — Toggling "Is Active" OFF restores normal access for all users immediately

**Preconditions:** Maintenance mode is currently active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | As BackOffice admin, uncheck the `Is Active` checkbox and save | The status changes to "INACTIVE" |
| 2 | In a separate session, navigate to PICASso as a non-privileged user | The Landing Page loads normally (no Maintenance Page) |

**Coverage dimension:** State Transitions
**Subsection:** BackOffice Configuration

---

#### `MAINTENANCE-CONFIG-014` — Nearby configuration links are visible (Custom Banners, Release Notes)

**Preconditions:** BackOffice admin. Notification Configuration section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → Notification Configuration | The section loads |
| 2 | Verify the `Custom Banners Configuration` link is visible | The link with URL containing `/GRC_BackOffice/CustomBannerConfig` is visible |
| 3 | Verify the `Release Notes Configuration` link is visible | The link with URL containing `/GRC_BackOffice/ReleaseNotesConfiguration` is visible |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

### 2.2 Privileged User Access

#### `MAINTENANCE-ADMIN-001` — Privileged users can access PICASso normally during maintenance

**Preconditions:** Maintenance mode is active. User has "System Access during Maintenance" privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to PICASso | The Landing Page loads (not the Maintenance Page) |
| 2 | Verify the user can navigate to product/release pages | The pages load normally |

**Coverage dimension:** Role-Based Access — allowed
**Subsection:** Privileged User Access

---

#### `MAINTENANCE-ADMIN-002` — Privileged users see a maintenance warning banner

**Preconditions:** Maintenance mode is active. User has the maintenance privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to PICASso | The Landing Page loads |
| 2 | Verify a maintenance warning banner is visible within PICASso | A banner indicating maintenance mode is active is visible at the top of the page |

**Coverage dimension:** Happy Path
**Subsection:** Privileged User Access

---

#### `MAINTENANCE-ADMIN-003` — Privileged users can perform all standard PICASso actions during maintenance

**Preconditions:** Maintenance mode is active. User has the maintenance privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a product detail page | The page loads |
| 2 | Click the `Edit` button and modify a field | The field is editable |
| 3 | Click `Save` | The save completes successfully |

**Coverage dimension:** Role-Based Access — allowed
**Subsection:** Privileged User Access

---

### 2.3 Non-Privileged User Experience

#### `MAINTENANCE-USER-001` — Non-privileged users are redirected to the Maintenance Page

**Preconditions:** Maintenance mode is active. User does NOT have the maintenance privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to any PICASso URL | The user is redirected to the Maintenance Page |
| 2 | Verify the Maintenance Page is displayed | The maintenance message is visible |

**Coverage dimension:** Role-Based Access — denied
**Subsection:** Non-Privileged User Experience

---

#### `MAINTENANCE-USER-002` — Maintenance Page displays the configured maintenance message

**Preconditions:** Maintenance mode is active with configured message.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to PICASso as a non-privileged user | The Maintenance Page is displayed |
| 2 | Verify the maintenance message text is visible | The message content is not empty |

**Coverage dimension:** Data Integrity
**Subsection:** Non-Privileged User Experience

---

#### `MAINTENANCE-USER-003` — Maintenance Page does not show any PICASso navigation

**Preconditions:** Maintenance mode is active. User on the Maintenance Page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to PICASso as a non-privileged user | The Maintenance Page is displayed |
| 2 | Verify no PICASso header navigation is visible | The main navigation bar is absent |
| 3 | Verify no sidebar menu is visible | The sidebar is absent |

**Coverage dimension:** Happy Path
**Subsection:** Non-Privileged User Experience

---

#### `MAINTENANCE-USER-004` — Attempting to navigate to any PICASso route returns the Maintenance Page

**Preconditions:** Maintenance mode is active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate directly to a product detail URL | The Maintenance Page is displayed |
| 2 | Navigate directly to a release detail URL | The Maintenance Page is displayed |
| 3 | Navigate directly to the BackOffice URL (without privilege) | The Maintenance Page is displayed |

**Coverage dimension:** Negative / Validation
**Subsection:** Non-Privileged User Experience

---

### 2.4 Negative / Validation (NEW)

#### `MAINTENANCE-NEG-001` — End date before start date shows validation error

**Preconditions:** BackOffice admin. Maintenance configuration in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Set the `Start Date and Time` to tomorrow | The date is set |
| 2 | Set the `End Date and Time` to yesterday | The date is set |
| 3 | Click `Save` | A validation error message is visible indicating the end date must be after the start date |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `MAINTENANCE-NEG-002` — Saving with empty required fields shows validation errors

**Preconditions:** BackOffice admin. Maintenance configuration in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Clear the `Start Date and Time` field | The field is empty |
| 2 | Clear the `End Date and Time` field | The field is empty |
| 3 | Click `Save` | Validation error messages appear for the required date fields |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

### 2.5 Data Integrity (NEW)

#### `MAINTENANCE-DATA-001` — Maintenance message text persists correctly after edit and save

**Preconditions:** BackOffice admin. Configuration has existing message text.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit` and modify the Header text to a new value | The field accepts the new text |
| 2 | Click `Save` | The save completes |
| 3 | Refresh the page | The page reloads |
| 4 | Verify the Header text shows the updated value | The new text persists correctly |

**Coverage dimension:** Data Integrity
**Subsection:** Data Integrity

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| BackOffice Configuration | MAINTENANCE-CONFIG-001 through 014 |
| Privileged User Access | MAINTENANCE-ADMIN-001 through 003 |
| Non-Privileged User Experience | MAINTENANCE-USER-001 through 004 |
| Negative / Validation | MAINTENANCE-NEG-001, 002 |
| Data Integrity | MAINTENANCE-DATA-001 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms | ✅ |
| 4 | UI element names match DOM snapshot | ✅ |
| 5 | Negative cases | ✅ (NEG-001, NEG-002, USER-004) |
| 6 | Role-based access tested | ✅ (ADMIN-001/003, USER-001) |
| 7 | State transitions | ✅ (CONFIG-011, CONFIG-013) |
| 8 | Data integrity | ✅ (CONFIG-009, CONFIG-010, CONFIG-012, DATA-001) |
| 9 | Cross-feature side effects | ✅ (Maintenance blocks all app access) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 21 |
| New scenarios | 3 (NEG-001, NEG-002, DATA-001) |
| Total scenarios | 24 |
| P1 | 4 |
| P2 | 14 |
| P3 | 6 |
