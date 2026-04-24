# WF 20. SAST Tools Configuration: BackOffice — Test Case Specifications

> **Generated:** 2026-04-24 · **Feature Area:** `backoffice` · **Workflow:** SAST Tools Configuration: BackOffice
> **Confluence:** https://confluence.se.com/spaces/PIC/pages/493626639
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios (BackOffice SAST config) | 0 |
| Related coverage (integration / release) | INT-INGEST-SCA-001, INT-INGEST-SCA-002, RELEASE-SCA-001–038 |
| **Gap** | BackOffice severity input configuration is NOT tested |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ❌ | No BackOffice SAST config scenarios — Add/Edit severity input, list layout |
| Negative / Validation | ❌ | Missing: empty Label, empty Prompt, max 20 limit |
| Role-Based Access | ⚠️ | INT-INGEST-SCA-001 covers API auth; BackOffice UI RBAC not tested |
| State Transitions | ❌ | Missing: active → deactivated → not shown in CSRR; reactivation |
| Data Integrity | ❌ | Missing: configured names and prompts reflect in CSRR UI |

---

## 2. Test Case Specifications

### 2.1 Add SCA Tool — Severity Inputs Table

#### `BACKOFFICE-SAST-SEVERITY-001` — Add SCA Tool page shows Severity Issues section with expected elements

**Preconditions:** User is logged in as `TechAdmin` (holds `MANAGE_REF_DATA` privilege). Navigate to BackOffice → Cybersecurity Residual Risks → SCA Tools → Add/Edit SCA Tool page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → Cybersecurity Residual Risks → SCA Tools | The SCA Tools list page is visible |
| 2 | Click `Add SCA Tool` or open an existing SCA Tool for editing | The Add/Edit SCA Tool page opens |
| 3 | Scroll to the Severity Issues section | The section is visible and contains: `Lock` icon, `Move` icon, `Order No` column, `Label` column, `Prompt` column, `Tooltip` column, three-dot icon column, `Add Issue Input` button, `Search` field, `Show inactive` toggle |

**Coverage dimension:** Happy Path — severity issues section layout  
**Note:** If no severity inputs exist, the empty state message "There are no severity inputs" and "Add severity input" button are shown instead of the table.

---

#### `BACKOFFICE-SAST-SEVERITY-002` — No severity inputs shows empty state with Add severity input button

**Preconditions:** User is logged in as `TechAdmin`. A SCA Tool with no severity inputs is open in Edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Add/Edit SCA Tool page for a tool with no severity inputs | The Severity Issues section shows the empty state message "There are no severity inputs" and an `Add severity input` button |

**Coverage dimension:** Happy Path — empty state

---

#### `BACKOFFICE-SAST-SEVERITY-003` — Add Issue Input button opens Add Severity Input popup with required fields

**Preconditions:** User is logged in as `TechAdmin`. The Add/Edit SCA Tool page is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Add Issue Input` button (or `Add severity input` in empty state) | The Add Severity Input popup opens |
| 2 | Verify popup fields | The popup contains: `Input Label` (SK Editor, mandatory), `Issue Prompt` (free text, mandatory), `Add Tooltip Info` checkbox (unchecked by default), `Save` button, `Cancel` button |
| 3 | Check the `Add Tooltip Info` checkbox | The `Tooltip Info` free text field appears below the checkbox |

**Coverage dimension:** Happy Path — popup layout + conditional field

---

#### `BACKOFFICE-SAST-SEVERITY-004` — Saving severity input without Label shows validation error

**Preconditions:** User is logged in as `TechAdmin`. The Add Severity Input popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave `Input Label` empty | The Input Label field is empty |
| 2 | Fill `Issue Prompt` with valid text | The Prompt field is populated |
| 3 | Click `Save` | The popup remains open; an inline validation error is shown on the `Input Label` field |

**Coverage dimension:** Negative / Validation — required Label field empty

---

#### `BACKOFFICE-SAST-SEVERITY-005` — Saving severity input without Prompt shows validation error

**Preconditions:** User is logged in as `TechAdmin`. The Add Severity Input popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill `Input Label` with valid text | The Input Label is populated |
| 2 | Leave `Issue Prompt` empty | The Prompt field is empty |
| 3 | Click `Save` | The popup remains open; an inline validation error is shown on the `Issue Prompt` field |

**Coverage dimension:** Negative / Validation — required Prompt field empty

---

#### `BACKOFFICE-SAST-SEVERITY-006` — Saved severity input appears in the table with label, prompt, and tooltip column

**Preconditions:** User is logged in as `TechAdmin`. The Add Severity Input popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill `Input Label` with "Critical Issues" | The Label field contains "Critical Issues" |
| 2 | Fill `Issue Prompt` with "Enter the number of critical findings" | The Prompt field is populated |
| 3 | Click `Save` | The popup closes; the new severity input row appears in the Severity Issues table with the configured label and prompt |

**Coverage dimension:** Data Integrity — saved input appears in list

---

#### `BACKOFFICE-SAST-SEVERITY-007` — Maximum 20 severity inputs enforced

**Preconditions:** User is logged in as `TechAdmin`. A SCA Tool already has 20 severity inputs.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Add/Edit SCA Tool page that has 20 severity inputs | The Severity Issues table shows 20 rows |
| 2 | Verify the `Add Issue Input` button state | The `Add Issue Input` button is disabled (or not visible); the maximum limit is indicated |

**Coverage dimension:** Negative / Validation — maximum input limit

---

#### `BACKOFFICE-SAST-SEVERITY-008` — Three-dot → Edit opens Edit Severity Input popup pre-filled with existing data

**Preconditions:** User is logged in as `TechAdmin`. At least one severity input exists in the table.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot icon on any severity input row | The dropdown shows `Edit` and `Deactivate` options |
| 2 | Click `Edit` | The Edit Severity Input popup opens pre-filled with the existing Label, Prompt, and Tooltip Info (if previously set) |

**Coverage dimension:** Happy Path — edit flow

---

#### `BACKOFFICE-SAST-SEVERITY-009` — Three-dot → Deactivate removes input from active list

**Preconditions:** User is logged in as `TechAdmin`. At least one active severity input exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot icon on an active severity input row | The dropdown shows `Edit` and `Deactivate` options |
| 2 | Click `Deactivate` | The severity input row is removed from the active list (Show inactive toggle is OFF) |

**Coverage dimension:** State Transitions — deactivate severity input

---

#### `BACKOFFICE-SAST-SEVERITY-010` — Show inactive toggle reveals deactivated inputs

**Preconditions:** User is logged in as `TechAdmin`. At least one severity input has been deactivated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify that `Show inactive` toggle is OFF | Only active severity inputs are visible in the table |
| 2 | Enable the `Show inactive` toggle | Deactivated severity inputs are also visible in the table (visually distinguished) |

**Coverage dimension:** State Transitions — show/hide inactive

---

#### `BACKOFFICE-SAST-SEVERITY-011` — Search field narrows severity inputs by label

**Preconditions:** User is logged in as `TechAdmin`. At least two severity inputs exist with different labels.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a unique keyword from one severity input's label in the `Search` field | Only severity inputs whose label contains the keyword are displayed |
| 2 | Clear the search field | All active severity inputs are visible again |

**Coverage dimension:** Happy Path — filter by label

---

### 2.2 CSRR UI Reflection

#### `BACKOFFICE-SAST-REFLECT-001` — Configured severity label name appears in CSRR Static Code Analysis section

**Preconditions:** A SCA Tool is configured in BackOffice with a custom severity label (e.g., "Critical Issues" instead of "Critical"). A release with that SCA tool added in its CSRR tab exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a release in Scoping or Active stage that has the configured SCA Tool in CSRR | The CSRR tab is accessible |
| 2 | Navigate to CSRR → Static Code Analysis section | The severity issue input shows the configured label name "Critical Issues" (not the default) |

**Coverage dimension:** Data Integrity — BackOffice label reflects in CSRR UI

---

#### `BACKOFFICE-SAST-REFLECT-002` — Configured prompt text appears as hint in CSRR severity issue input

**Preconditions:** A SCA Tool severity input has a configured `Issue Prompt` (e.g., "Enter count of critical severity vulnerabilities"). A release with that tool added exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to CSRR → Static Code Analysis section in a release | The severity issue input is visible |
| 2 | Verify the prompt/placeholder text on the severity input field | The input shows the configured prompt text "Enter count of critical severity vulnerabilities" as a hint |

**Coverage dimension:** Data Integrity — configured prompt reflects in CSRR

---

#### `BACKOFFICE-SAST-REFLECT-003` — Deactivated severity input is not shown in CSRR for new releases

**Preconditions:** A severity input has been deactivated in BackOffice for a specific SCA Tool.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a release where the SCA Tool has been added to CSRR | The CSRR tab is accessible |
| 2 | Verify the deactivated severity input field | The deactivated severity input is NOT shown in the CSRR Static Code Analysis section for the SCA Tool |

**Coverage dimension:** State Transitions — deactivated input hidden in CSRR

---

#### `BACKOFFICE-SAST-REFLECT-004` — Completed releases retain original severity label names after BackOffice changes

**Preconditions:** A release with status Completed has SCA Tool scan data saved with the original severity labels. The BackOffice label for that tool has since been changed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Completed release | The release is in Completed status |
| 2 | Navigate to CSRR → Static Code Analysis section | The severity issue labels show the ORIGINAL names (at the time of completion), not the new BackOffice-configured names |

**Coverage dimension:** Data Integrity — completed releases are immutable

---

### 2.3 Role-Based Access

#### `BACKOFFICE-SAST-ACCESS-001` — Only TechAdmin / SuperUser can access SCA Tools configuration in BackOffice

**Preconditions:** User is logged in as `Security Manager` (does NOT hold `MANAGE_REF_DATA` privilege).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → Cybersecurity Residual Risks → SCA Tools URL directly | The page is not accessible; the user is redirected or shown an access-denied message |

**Coverage dimension:** Role-Based Access — denied role access  
**Note:** `Security Manager` is in the Product roles group and does not have `MANAGE_REF_DATA`.
