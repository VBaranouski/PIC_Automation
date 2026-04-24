# Test Cases: Software Composition Analysis — Scan & Component Management (WF 6.4)

> **Feature:** Software Composition Details — Scan & Component Management
> **Jira Feature:** PIC-9520 (BDBA Integration)
> **Confluence:** Page 688765053
> **Feature Area:** `releases`
> **Workflow:** Release — Stage 3: Manage
> **Scenario Prefix:** `RELEASE-SCA-*`
> **Feature ID:** `releases.sca.component-management`
> **Import Privilege:** `IMPORTBDBA` — Product Owner, Security Manager, Security Advisor (SDPA), Global, SuperUser
> **BackOffice Privilege:** `MANAGE_REF_DATA` — TechAdmin, SuperUser, Content Admin
> **Denied Role (RBAC):** Viewer Global / Viewer Product — "Viewer roles" group (no `IMPORTBDBA`)
> **Spec File:** `tests/releases/sca-scan-component.spec.ts` (future)
> **Jira Stories:** PIC-9440, PIC-9445, PIC-9466, PIC-9476, PIC-9478, PIC-9483, PIC-9500, PIC-9763, PIC-9964, PIC-10354, PIC-9441, PIC-9765

---

## 1. Coverage Analysis

### Existing Scenarios (relevant)

| ID | Title | Auto State | Exec Status | Gap |
|----|-------|------------|-------------|-----|
| RELEASE-CSRR-010 | Software Composition Analysis — SCA tools section, results, Residual Risk and Actions render | pending | not-executed | Extremely shallow — only section visibility |

No `RELEASE-SCA-*` scenarios exist yet.

### Coverage Gap Table

| # | Dimension | Status | Gap |
|---|-----------|--------|-----|
| 1 | **Happy Path** | ❌ Missing | No tests: BDBA import flow, manual scan entry, add/view/edit imported scan, component table display, save flow |
| 2 | **Negative / Validation** | ❌ Missing | No tests: duplicate Scan ID, import errors (404, 401, 403, access denied), numeric-only Scan ID, empty mandatory fields |
| 3 | **Role-Based Access** | ❌ Missing | No tests: `IMPORTBDBA` privilege gate, users without privilege see only manual entry, Viewer cannot edit |
| 4 | **State Transitions** | ❌ Missing | No tests: import → re-import, refresh → scan-not-found → delete, collapse/expand state, edit mode toggle |
| 5 | **Data Integrity** | ❌ Missing | No tests: imported fields read-only, manual fields editable, saved values persist, refresh clears manual fields, delete removes scan |

---

## 2. New Scenario Inventory (55 scenarios: RELEASE-SCA-001 through RELEASE-SCA-055)

### By Subsection

| Subsection | New IDs | Count |
|------------|---------|-------|
| 6.4.1 SCA — Add Scan Results Modal | 001–005 | 5 |
| 6.4.2 SCA — BDBA Import Flow | 006–014 | 9 |
| 6.4.3 SCA — Manual Scan Entry | 015–021 | 7 |
| 6.4.4 SCA — Imported Scan View | 022–027 | 6 |
| 6.4.5 SCA — Refresh Imported Scan | 028–033 | 6 |
| 6.4.6 SCA — Edit & Delete Scan | 034–039 | 6 |
| 6.4.7 SCA — Collapse & Expand | 040–043 | 4 |
| 6.4.8 SCA — 3rd Party Components Table | 044–049 | 6 |
| 6.4.9 SCA — CVSS Version Toggle | 050–052 | 3 |
| 6.4.10 SCA — RBAC & Privilege | 053–054 | 2 |
| 6.4.11 SCA — Release History Logging | 055 | 1 |

### Priority Breakdown

| Priority | Count | Percentage |
|----------|-------|------------|
| P1 | 10 | 18% |
| P2 | 36 | 66% |
| P3 | 9 | 16% |

---

## 3. Deduplication Table

| Existing | New Candidate | Decision |
|----------|---------------|----------|
| RELEASE-CSRR-010 (SCA section renders) | RELEASE-SCA-022 (imported scan view) | **Keep both** — CSRR-010 is high-level section visibility; SCA-022 tests detailed imported scan block content |

No true duplicates found.

---

## 4. Test Case Specifications

### Subsection: 6.4.1 SCA — Add Scan Results Modal

---

#### `RELEASE-SCA-001` — Add Scan Results modal opens with tool dropdown

**Preconditions:** Logged in as Product Owner. Release is at Creation & Scoping, Review & Confirm, or Manage stage. Navigated to the Cybersecurity Residual Risks tab, Software Composition Analysis section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release detail page and click the `Cybersecurity Residual Risks` tab | The `Cybersecurity Residual Risks` tab has `aria-selected="true"` |
| 2 | Scroll to the `Software Composition Analysis` section | The `Software Composition Analysis` section heading is visible |
| 3 | Click the `Add Scan Results` button | The `Add Scan Results` modal opens |
| 4 | Verify the `Software Composition Analysis (SCA) Tool` dropdown is visible and required | The dropdown is visible with a required indicator |
| 5 | Verify the `Add` button is disabled by default | The `Add` button is disabled |
| 6 | Verify the `Cancel` button is visible and enabled | The `Cancel` button is visible and enabled |

**Coverage dimension:** Happy Path (modal layout)
**Note:** P1 — entry point for the entire SCA scan addition flow.

---

#### `RELEASE-SCA-002` — Tool dropdown contains expected options

**Preconditions:** The `Add Scan Results` modal is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Software Composition Analysis (SCA) Tool` dropdown | The dropdown options are visible |
| 2 | Verify the following options are present: `Black Duck Binary Analysis`, `Black Duck Hub`, `JFrog Xray`, `Other` | All 4 tool options are visible in the dropdown |

**Coverage dimension:** Data Integrity (dropdown content)
**Note:** P2.

---

#### `RELEASE-SCA-003` — Selecting BDBA shows Import from BlackDuck and Manual Entry tabs

**Preconditions:** The `Add Scan Results` modal is open. User has `IMPORTBDBA` privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Black Duck Binary Analysis` from the `Software Composition Analysis (SCA) Tool` dropdown | Two options/tabs are displayed: `Import from BlackDuck` (default selected) and `Manual Entry` |
| 2 | Verify `Import from BlackDuck` is selected by default | The `Import from BlackDuck` option/tab is active |

**Coverage dimension:** Happy Path (BDBA tool selection)
**Note:** P2.

---

#### `RELEASE-SCA-004` — Selecting Black Duck Hub / JFrog Xray shows manual entry form directly

**Preconditions:** The `Add Scan Results` modal is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Black Duck Hub` from the tool dropdown | The manual entry form is displayed directly (no Import/Manual toggle) |
| 2 | Verify the `Scan Name` field is visible and required | The `Scan Name` field is visible with a required indicator |

**Coverage dimension:** Happy Path (non-BDBA tool selection)
**Note:** P2.

---

#### `RELEASE-SCA-005` — Cancel button closes modal without saving

**Preconditions:** The `Add Scan Results` modal is open with some data entered.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a tool from the dropdown | A tool is selected |
| 2 | Click the `Cancel` button | The modal closes; no new scan appears in the SCA section |

**Coverage dimension:** Negative / Validation (cancel discard)
**Note:** P2.

---

### Subsection: 6.4.2 SCA — BDBA Import Flow

---

#### `RELEASE-SCA-006` — Import from BlackDuck — Scan ID input form layout

**Preconditions:** The `Add Scan Results` modal is open. `Black Duck Binary Analysis` is selected. `Import from BlackDuck` tab is active. User has `IMPORTBDBA` privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Scan ID` input field is visible with instruction text | The `Scan ID` field is visible; instruction text about finding the Scan ID in the BlackDuck URL is displayed |
| 2 | Verify the `Scan ID` field placeholder contains guidance text | The placeholder is visible |
| 3 | Verify the `Import Scan Results` button is visible | The `Import Scan Results` button is visible |
| 4 | Verify the `Add` button is disabled | The `Add` button is disabled |

**Coverage dimension:** Happy Path (import form layout)
**Note:** P2.

---

#### `RELEASE-SCA-007` — Successful BDBA import auto-fills read-only fields

**Preconditions:** The import form is displayed. A valid Scan ID is available in the BlackDuck system.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a valid Scan ID into the `Scan ID` field | The `Scan ID` field contains the entered value |
| 2 | Click the `Import Scan Results` button | The button enters a loading state; the `Scan ID` field and action buttons are disabled during import |
| 3 | Wait for the import to complete | The `Scan Name` field is auto-filled and read-only (grey background) |
| 4 | Verify the `Link to SCA Tool Output` field is auto-filled and read-only | The field contains a URL and is not editable |
| 5 | Verify the manual fields remain editable: `Trajectory of number of vulnerable components remaining since last FCSR` and `Have SCA findings been reviewed and triaged?` | Both dropdowns are editable |
| 6 | Verify the `Add` button is now enabled | The `Add` button is enabled |

**Coverage dimension:** Happy Path (BDBA import E2E)
**Note:** P1 — core import flow.

---

#### `RELEASE-SCA-008` — Import error: Scan not found (404)

**Preconditions:** The import form is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a non-existent Scan ID into the `Scan ID` field | The `Scan ID` field contains the entered value |
| 2 | Click the `Import Scan Results` button | An inline error "Scan not found. Please check the Scan ID." is visible below the `Scan ID` field |
| 3 | Verify the `Import Scan Results` button is active again after the error resolves | The `Import Scan Results` button is enabled |

**Coverage dimension:** Negative / Validation (API error 404)
**Note:** P2.

---

#### `RELEASE-SCA-009` — Import error: User does not have access to the scan

**Preconditions:** The import form is displayed. A valid Scan ID exists but the user is not in the scan's group.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a Scan ID the user does not have access to | The `Scan ID` field contains the entered value |
| 2 | Click the `Import Scan Results` button | An inline error "You don't have access to these Scan Results in BDBA. Please check your group permissions." is visible |

**Coverage dimension:** Negative / Validation (access denied)
**Note:** P2.

---

#### `RELEASE-SCA-010` — Import error: Duplicate Scan ID already exists

**Preconditions:** The import form is displayed. A scan with a specific Scan ID has already been added to this release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type the same Scan ID that was previously imported | The `Scan ID` field contains the entered value |
| 2 | Click the `Import Scan Results` button | An inline error "Scan results for this Scan ID have already been added." is visible |

**Coverage dimension:** Negative / Validation (duplicate check)
**Note:** P2.

---

#### `RELEASE-SCA-011` — Re-import with changed Scan ID shows confirmation

**Preconditions:** A successful import has been completed in the modal. `Scan ID` field is editable again.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Clear the `Scan ID` field and type a different valid Scan ID | The `Import Scan Results` button becomes active |
| 2 | Click the `Import Scan Results` button | A confirmation dialog "You're about to update imported Scan Results. Are you sure you want to proceed?" is visible with `Yes, Re-import` and `No, Cancel` buttons |
| 3 | Click `No, Cancel` | The confirmation closes; the previously imported data remains unchanged |
| 4 | Click the `Import Scan Results` button again | The confirmation dialog appears again |
| 5 | Click `Yes, Re-import` | The import loading state begins; imported fields are replaced with new values; manual fields are cleared |

**Coverage dimension:** State Transitions (import → re-import)
**Note:** P1 — re-import with data replacement.

---

#### `RELEASE-SCA-012` — Scan ID field accepts numeric input only

**Preconditions:** The import form is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type alphabetic characters "abc" into the `Scan ID` field | The characters are rejected or the field remains empty; the `Import Scan Results` button remains disabled |
| 2 | Type a valid numeric value "12345" | The field contains "12345"; the `Import Scan Results` button becomes enabled |

**Coverage dimension:** Negative / Validation (input type)
**Note:** P3 — field type validation.

---

#### `RELEASE-SCA-013` — Import button disabled when Scan ID is empty or zero

**Preconditions:** The import form is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Import Scan Results` button with empty `Scan ID` field | The `Import Scan Results` button is disabled |
| 2 | Type "0" into the `Scan ID` field | The `Import Scan Results` button remains disabled |

**Coverage dimension:** Negative / Validation (empty/zero guard)
**Note:** P3.

---

#### `RELEASE-SCA-014` — Add button persists scan and shows success toast

**Preconditions:** A successful import has been completed. The `Add` button is enabled.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Add` button | The modal closes; a toast "Scan results have been added successfully." is visible |
| 2 | Verify the new scan block appears in the `Software Composition Analysis` section | A scan block with title "Black Duck Binary Analysis – {Scan Name}" is visible |
| 3 | Verify the `IMPORTED` badge is shown in the scan header | The `IMPORTED` badge is visible |

**Coverage dimension:** Happy Path (add imported scan)
**Note:** P1 — confirms the full import-to-add cycle.

---

### Subsection: 6.4.3 SCA — Manual Scan Entry

---

#### `RELEASE-SCA-015` — Manual entry form shows all required fields

**Preconditions:** The `Add Scan Results` modal is open. `Black Duck Binary Analysis` is selected. `Manual Entry` tab is active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Scan Name` field is visible and required | The `Scan Name` field is visible with a required indicator |
| 2 | Verify the `Link to SCA tool output for the release` field is visible | The field is visible |
| 3 | Verify the `Total number of Vulnerable Components` field is visible | The numeric field is visible |
| 4 | Verify the `Trajectory of number of vulnerable components remaining since last FCSR` dropdown is visible | The dropdown is visible with LOV: Yes, No, In Progress |
| 5 | Verify the `Have SCA findings been reviewed and triaged?` dropdown is visible | The dropdown is visible with LOV: N/A, Static, Down, Up |

**Coverage dimension:** Happy Path (manual form layout)
**Note:** P2.

---

#### `RELEASE-SCA-016` — Add manual scan with all fields filled

**Preconditions:** Manual entry form is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a scan name into the `Scan Name` field | The field contains the typed name |
| 2 | Type a URL into the `Link to SCA tool output for the release` field | The field contains the typed URL |
| 3 | Type a numeric value into the `Total number of Vulnerable Components` field | The field contains the number |
| 4 | Select a value from the `Trajectory` dropdown | A value is selected |
| 5 | Select a value from the `Have SCA findings been reviewed and triaged?` dropdown | A value is selected |
| 6 | Click the `Add` button | The modal closes; a toast "Scan results have been added successfully." is visible |
| 7 | Verify the new scan block appears with `MANUAL` badge | The scan block with title and `MANUAL` badge is visible |

**Coverage dimension:** Happy Path (manual scan add E2E)
**Note:** P1 — core manual entry flow.

---

#### `RELEASE-SCA-017` — Manual entry for "Other" tool shows SCA Tool Name field

**Preconditions:** The `Add Scan Results` modal is open. `Other` is selected from the tool dropdown.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `SCA Tool Name` field is visible and required | The `SCA Tool Name` field is visible with a required indicator (only for "Other") |
| 2 | Type a tool name into the `SCA Tool Name` field | The field contains the typed name |
| 3 | Fill in the `Scan Name` field | The field contains the typed name |
| 4 | Click the `Add` button | The modal closes; a toast is visible; the scan block shows the custom tool name |

**Coverage dimension:** Happy Path ("Other" tool variant)
**Note:** P2.

---

#### `RELEASE-SCA-018` — Mandatory field validation on manual entry

**Preconditions:** Manual entry form is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave the `Scan Name` field empty | The field shows a required validation indicator |
| 2 | Verify the `Add` button is disabled | The `Add` button is disabled while required fields are empty |
| 3 | Type a scan name into the `Scan Name` field | The validation error clears; the `Add` button becomes enabled |

**Coverage dimension:** Negative / Validation (required fields)
**Note:** P2.

---

#### `RELEASE-SCA-019` — Edit manual scan — all fields are editable

**Preconditions:** A manual scan has been added to the release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Edit` action on the manual scan block | The `Edit Scan Results` modal opens |
| 2 | Verify the `Scan Name` field is editable | The field is enabled and contains the previously saved value |
| 3 | Verify the `Link to SCA tool output` field is editable | The field is enabled |
| 4 | Verify the `Total number of Vulnerable Components` field is editable | The field is enabled |
| 5 | Verify the `Trajectory` and `Have SCA findings been reviewed and triaged?` dropdowns are editable | Both dropdowns are enabled |
| 6 | Clear and type a new scan name | The field contains the new name |
| 7 | Click the `Save Changes` button | The modal closes; the scan block shows the updated scan name |

**Coverage dimension:** Data Integrity (edit manual scan)
**Note:** P2.

---

#### `RELEASE-SCA-020` — Edit manual scan for "Other" tool — SCA Tool Name is editable

**Preconditions:** A manual scan with tool type "Other" has been added.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Edit` action on the "Other" scan block | The `Edit Scan Results` modal opens |
| 2 | Verify the `Software Composition Analysis (SCA)` field is editable | The SCA tool field/dropdown is enabled for "Other" |
| 3 | Verify the `SCA Tool Name` field is editable | The custom tool name field is enabled |

**Coverage dimension:** Data Integrity (Other tool edit)
**Note:** P3.

---

#### `RELEASE-SCA-021` — Edit manual scan for BDBA/Hub/Xray — SCA Tool field is NOT editable

**Preconditions:** A manual scan with tool type "Black Duck Hub" has been added.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Edit` action on the "Black Duck Hub" scan block | The `Edit Scan Results` modal opens |
| 2 | Verify the `Software Composition Analysis (SCA)` field is NOT editable | The SCA tool field/dropdown is disabled or read-only |

**Coverage dimension:** Negative / Validation (tool field lock)
**Note:** P3.

---

### Subsection: 6.4.4 SCA — Imported Scan View

---

#### `RELEASE-SCA-022` — Imported scan block displays all header and read-only fields

**Preconditions:** An imported BDBA scan has been added to the release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the scan header shows "Black Duck Binary Analysis – {Scan Name}" | The title text matches the pattern |
| 2 | Verify the `IMPORTED` badge is visible | The `IMPORTED` badge is displayed |
| 3 | Verify the CVSS Version tag (e.g., `CVSS v3`) is visible | A CVSS version tag is displayed |
| 4 | Verify action icons are visible: `Refresh Data`, `Edit`, `Delete`, collapse/expand icon | At least 3 action icons/buttons are visible in the header |
| 5 | Verify the following read-only fields are visible: `Scan ID`, `Scan Name`, `Link to SCA Tool Output`, `Vulnerable Components (Total)`, `Triaged Vulnerabilities`, `Vulnerabilities by Severity`, `Exploitable Vulnerabilities`, `Trajectory`, `Have SCA findings been reviewed and triaged?`, `Created`, `Last Updated` | At least 8 of these field labels are visible |

**Coverage dimension:** Happy Path (imported scan view layout)
**Note:** P1 — validates the complete imported scan display.

---

#### `RELEASE-SCA-023` — Imported fields have grey background and are read-only

**Preconditions:** An imported BDBA scan is displayed in expanded state.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Scan Name` field is read-only | The `Scan Name` field is not editable |
| 2 | Verify the `Link to SCA Tool Output` field is read-only | The field is not editable |
| 3 | Verify the `Vulnerable Components (Total)` field is read-only | The field is not editable |

**Coverage dimension:** Data Integrity (read-only enforcement)
**Note:** P2.

---

#### `RELEASE-SCA-024` — Vulnerabilities by Severity shows C/H/M/L aggregated counts

**Preconditions:** An imported scan with components is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Vulnerabilities by Severity` field is visible | The field shows severity counts |
| 2 | Verify the severity labels include C (Critical), H (High), M (Medium), L (Low) | At least 4 severity indicators are visible with numeric values |

**Coverage dimension:** Data Integrity (aggregated data)
**Note:** P2.

---

#### `RELEASE-SCA-025` — Exploitable Vulnerabilities shows Fixable and Unfixable counts

**Preconditions:** An imported scan with components is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Exploitable Vulnerabilities` field is visible | The field is visible |
| 2 | Verify it shows separate `Fixable` and `Unfixable` counts | Both `Fixable` and `Unfixable` labels with numeric values are visible |

**Coverage dimension:** Data Integrity (exploitable breakdown)
**Note:** P2.

---

#### `RELEASE-SCA-026` — Empty import result shows placeholder message

**Preconditions:** An imported scan returns no unmitigated components.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the components section shows the placeholder | The text "No components with unmitigated vulnerabilities exist." is visible in the components area |

**Coverage dimension:** State Transitions (empty result state)
**Note:** P3.

---

#### `RELEASE-SCA-027` — Manual scan block shows MANUAL badge

**Preconditions:** A manual BDBA scan has been added to the release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the scan header shows "Black Duck Binary Analysis – {Scan Name}" | The title is visible |
| 2 | Verify the `MANUAL` badge is displayed in the header | The `MANUAL` badge is visible |

**Coverage dimension:** Data Integrity (badge distinction)
**Note:** P2.

---

### Subsection: 6.4.5 SCA — Refresh Imported Scan

---

#### `RELEASE-SCA-028` — Refresh shows confirmation dialog and succeeds

**Preconditions:** Logged in as Product Owner with `IMPORTBDBA` privilege. An imported BDBA scan exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Refresh Data` button/icon on the imported scan | A confirmation dialog "Refreshing will overwrite the current Scan Results and any manual inputs you have made. Are you sure you want to proceed?" is visible with `Yes, Refresh` and `No, Cancel` buttons |
| 2 | Click `No, Cancel` | The dialog closes; the scan data remains unchanged |
| 3 | Click the `Refresh Data` button again | The confirmation dialog appears |
| 4 | Click `Yes, Refresh` | The scan enters a loading state; upon completion, a success toast "Scan Results data has been refreshed successfully." is visible |
| 5 | Verify the imported fields are updated and manual fields are cleared | The `Trajectory` and `Have SCA findings been reviewed and triaged?` fields are reset to their default/empty state |

**Coverage dimension:** Happy Path (refresh E2E)
**Note:** P1 — core refresh flow.

---

#### `RELEASE-SCA-029` — Refresh — scan not found (404) shows delete confirmation

**Preconditions:** An imported BDBA scan exists but the scan has been deleted from BlackDuck.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Refresh Data` button and confirm | The refresh attempt fails with 404 |
| 2 | Verify a new confirmation modal appears: "Scan was not found in Black Duck Binary Analysis Tool. Refreshing will delete the imported data and manual inputs. Are you sure you want to proceed?" | The dialog shows `No, Keep Current Data` and `Yes, Delete Data` buttons |
| 3 | Click `No, Keep Current Data` | The dialog closes; the scan block remains with its current data |
| 4 | Click the `Refresh Data` button again and confirm the first dialog | The 404 dialog appears again |
| 5 | Click `Yes, Delete Data` | The entire scan block is removed from the SCA section |

**Coverage dimension:** State Transitions (refresh → not found → delete)
**Note:** P2.

---

#### `RELEASE-SCA-030` — Refresh concurrency — only one scan refreshes at a time

**Preconditions:** Two or more imported BDBA scans exist in the release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Refresh Data` button on the first scan and confirm | The first scan enters loading state |
| 2 | Verify the `Refresh Data` button on the second scan is disabled | The `Refresh Data` action for other scans is disabled during the refresh |

**Coverage dimension:** Negative / Validation (concurrency guard)
**Note:** P2.

---

#### `RELEASE-SCA-031` — Last Refresh date shown after successful refresh

**Preconditions:** A refresh has been completed successfully on an imported scan.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Last Refresh` date is shown next to the `Refresh Data` button | A date/timestamp is visible near the `Refresh Data` button |

**Coverage dimension:** Data Integrity (timestamp display)
**Note:** P3.

---

#### `RELEASE-SCA-032` — Refresh clears manual fields and reloads components

**Preconditions:** An imported scan has manually entered `Trajectory` and `Have SCA findings reviewed` values.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Trajectory` field has a previously saved value | The field shows a selected value (e.g., "Yes" or "No") |
| 2 | Click the `Refresh Data` button and confirm | The refresh completes successfully |
| 3 | Verify the `Trajectory` field is reset | The `Trajectory` field shows the default/empty state |
| 4 | Verify the `Have SCA findings been reviewed and triaged?` field is reset | The field shows the default/empty state |

**Coverage dimension:** Data Integrity (refresh clears manual data)
**Note:** P2.

---

#### `RELEASE-SCA-033` — Refresh error — API not reachable shows error banner

**Preconditions:** The BlackDuck API is unreachable (network issue or auth failure).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Refresh Data` button and confirm | An error banner "We couldn't reach BlackDuck. Please try again later." is visible |

**Coverage dimension:** Negative / Validation (API error)
**Note:** P3 — depends on simulating API failure; may need `test.skip()` if not reproducible in QA.

---

### Subsection: 6.4.6 SCA — Edit & Delete Scan

---

#### `RELEASE-SCA-034` — Edit imported scan — only manual fields are editable

**Preconditions:** An imported BDBA scan exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Edit` action on the imported scan | The `Edit Scan Results` modal opens |
| 2 | Verify `Scan ID` is read-only | The `Scan ID` field is not editable |
| 3 | Verify `Scan Name` is read-only | The `Scan Name` field is not editable |
| 4 | Verify `Link to SCA Tool Output` is read-only | The field is not editable |
| 5 | Verify `Trajectory` dropdown is editable | The dropdown is enabled |
| 6 | Verify `Have SCA findings been reviewed and triaged?` dropdown is editable | The dropdown is enabled |
| 7 | Select a new value from the `Trajectory` dropdown | The new value is selected |
| 8 | Click the `Save Changes` button | The modal closes; the updated value is reflected in the scan block |

**Coverage dimension:** Data Integrity (edit imported — field restrictions)
**Note:** P1.

---

#### `RELEASE-SCA-035` — Edit imported scan — Cancel discards changes

**Preconditions:** The `Edit Scan Results` modal is open for an imported scan.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a different value from the `Trajectory` dropdown | The new value is selected |
| 2 | Click the `Cancel` button | The modal closes; the `Trajectory` field on the scan block shows the original (unchanged) value |

**Coverage dimension:** Negative / Validation (cancel discard)
**Note:** P2.

---

#### `RELEASE-SCA-036` — Delete scan shows confirmation and removes scan block

**Preconditions:** A scan (imported or manual) exists in the SCA section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Delete` action on the scan block | A confirmation dialog "Do you want to delete Scan Results {Scan Name}?" is visible with `Cancel` and `Delete` buttons |
| 2 | Click `Cancel` | The dialog closes; the scan block remains |
| 3 | Click the `Delete` action again | The confirmation dialog appears |
| 4 | Click `Delete` | The scan block and its components are removed from the SCA section |

**Coverage dimension:** State Transitions (scan delete)
**Note:** P1.

---

#### `RELEASE-SCA-037` — Delete scan removes associated components

**Preconditions:** An imported scan with at least 1 component row exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify at least 1 row in the `3rd Party Components with Unmitigated Vulnerabilities` table | At least 1 component row is visible |
| 2 | Click the `Delete` action on the scan and confirm | The scan block is removed; no orphan component rows remain for this scan |

**Coverage dimension:** Data Integrity (cascade delete)
**Note:** P2.

---

#### `RELEASE-SCA-038` — Multiple scans — deleting one does not affect others

**Preconditions:** Two or more scans exist in the SCA section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the count of scan blocks (at least 2) | At least 2 scan blocks are visible |
| 2 | Click the `Delete` action on the first scan and confirm | The first scan block is removed |
| 3 | Verify the remaining scan blocks are still visible and intact | At least 1 scan block remains with its data unchanged |

**Coverage dimension:** Data Integrity (independent scans)
**Note:** P2.

---

#### `RELEASE-SCA-039` — Edit and Delete not available after Global Save in certain stages

**Preconditions:** A scan exists. Global Save has been completed or is in progress.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Edit` and `Delete` actions are disabled or not visible after Global Save completes | The `Edit` and `Delete` actions are not available |

**Coverage dimension:** Negative / Validation (post-save lock)
**Note:** P3 — documents stage-dependent behavior.

---

### Subsection: 6.4.7 SCA — Collapse & Expand

---

#### `RELEASE-SCA-040` — First scan is expanded by default, others are collapsed

**Preconditions:** Two or more scans exist in the SCA section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the first scan block is expanded (details and components visible) | The first scan block content is visible |
| 2 | Verify subsequent scan blocks are collapsed (only header visible) | The second scan block shows only the header row with tool name, scan name, badge, and action icons |

**Coverage dimension:** Happy Path (default collapse state)
**Note:** P2.

---

#### `RELEASE-SCA-041` — Collapse hides content, expand restores it

**Preconditions:** A scan block is in expanded state.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the collapse icon (chevron) on the expanded scan | The scan details and components table are hidden; only the header remains visible with tool name, scan name, badge, and action icons |
| 2 | Click the expand icon (chevron) on the collapsed scan | The scan details and components table are visible again |

**Coverage dimension:** State Transitions (collapse ↔ expand)
**Note:** P2.

---

#### `RELEASE-SCA-042` — Scans collapse/expand independently

**Preconditions:** Two or more scans exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Collapse the first scan | The first scan is collapsed; other scans retain their current state |
| 2 | Expand the second scan | The second scan is expanded; the first scan remains collapsed |

**Coverage dimension:** Data Integrity (independent state)
**Note:** P3.

---

#### `RELEASE-SCA-043` — Collapse state resets on page refresh

**Preconditions:** A scan has been manually collapsed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Collapse the first scan | The first scan is collapsed |
| 2 | Refresh the page | After page reload, the first scan returns to the default expanded state |

**Coverage dimension:** State Transitions (state reset)
**Note:** P3.

---

### Subsection: 6.4.8 SCA — 3rd Party Components Table

---

#### `RELEASE-SCA-044` — Component table displays expected columns for imported scan

**Preconditions:** An imported scan with at least 1 component is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the section title "3rd Party Components with Unmitigated Vulnerabilities" is visible | The section title is visible |
| 2 | Verify the following columns are present: `3rd Party Component`, `Version in Use`, `Latest Version`, `Vulnerabilities by Severity`, `Target Release for Update / Mitigation`, `Maintenance Status Risk` | At least 5 column headers are visible |

**Coverage dimension:** Happy Path (component table layout)
**Note:** P1 — validates the component table structure.

---

#### `RELEASE-SCA-045` — Vulnerability severity badges with color and tooltip

**Preconditions:** An imported scan with components is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Vulnerabilities by Severity` column shows colored severity badges (C/H/M/L) | Colored badges are visible in the vulnerability column |
| 2 | Hover over the tooltip icon near the `Vulnerabilities by Severity` column header | A tooltip shows: "C — Critical, H — High, M — Medium, L — Low" |

**Coverage dimension:** Data Integrity (severity display)
**Note:** P2.

---

#### `RELEASE-SCA-046` — Pagination on imported scan components

**Preconditions:** An imported scan with more than 10 components.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the pagination controls are visible below the component table | Page numbers and a page size selector are visible |
| 2 | Verify the page size selector options include 10, 25, 50 | The selector shows at least 2 page size options |
| 3 | Click the next page button | The component table shows the next set of rows; the page indicator updates |

**Coverage dimension:** Happy Path (pagination)
**Note:** P2.

---

#### `RELEASE-SCA-047` — Manual component add creates editable row

**Preconditions:** A manual scan is displayed in edit mode. User has clicked the add-component action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Add Component` button (or equivalent) in the manual scan's component section | A new empty editable row appears in the component table |
| 2 | Type a component name into the `3rd Party Component` field | The field contains the typed name |
| 3 | Type a version into the `Version in Use` field | The field contains the typed version |

**Coverage dimension:** Happy Path (manual component add)
**Note:** P2.

---

#### `RELEASE-SCA-048` — Global Save persists manual components and switches to view mode

**Preconditions:** Manual components have been added/edited in the table.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Global Save` button (or equivalent save action) | The table switches to view mode; all filled rows are persisted |
| 2 | Verify empty rows are removed after Global Save | No empty component rows remain in the table |

**Coverage dimension:** Data Integrity (save and cleanup)
**Note:** P2.

---

#### `RELEASE-SCA-049` — Component sorting by severity criticality (descending)

**Preconditions:** An imported scan with multiple components of different severity levels.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the component list is sorted by severity criticality in descending order | Components with higher Critical (C) counts appear before those with lower counts; then by High (H), Medium (M), Low (L) |

**Coverage dimension:** Data Integrity (default sort order)
**Note:** P2 — verifies AC7 from PIC-10354.

---

### Subsection: 6.4.9 SCA — CVSS Version Toggle

---

#### `RELEASE-SCA-050` — CVSS version selector shows v2 and v3 options

**Preconditions:** An imported BDBA scan is displayed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify a CVSS version selector is visible near the scan block | The CVSS version selector/toggle is visible |
| 2 | Verify options include `CVSS v2` and `CVSS v3` | Both version options are available |
| 3 | Verify `CVSS v3` is selected by default | The `CVSS v3` option is active/selected |

**Coverage dimension:** Happy Path (CVSS selector layout)
**Note:** P2.

---

#### `RELEASE-SCA-051` — Switching CVSS version updates severity counts

**Preconditions:** An imported scan with components is displayed. `CVSS v3` is selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the current `Vulnerabilities by Severity` values with `CVSS v3` selected | The severity counts are recorded |
| 2 | Switch to `CVSS v2` | The `Vulnerabilities by Severity` values update (may show different counts or severity categories) |
| 3 | Switch back to `CVSS v3` | The `Vulnerabilities by Severity` values return to the original counts |

**Coverage dimension:** Data Integrity (version toggle updates data)
**Note:** P2.

---

#### `RELEASE-SCA-052` — Editable fields preserved across CVSS version switch

**Preconditions:** An imported scan with components. `Target Release for Update / Mitigation` has been set for a component.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Target Release for Update / Mitigation` field has a value for a component | The field contains a value |
| 2 | Switch CVSS version from `CVSS v3` to `CVSS v2` | The CVSS version changes |
| 3 | Verify the `Target Release for Update / Mitigation` field retains its value | The field still contains the same value as before the switch |
| 4 | Verify the `Maintenance Status Risk` field retains its value | The field is preserved |

**Coverage dimension:** Data Integrity (cross-version field persistence)
**Note:** P2.

---

### Subsection: 6.4.10 SCA — RBAC & Privilege

---

#### `RELEASE-SCA-053` — User with IMPORTBDBA sees Import option; user without sees only Manual Entry

**Preconditions:** Two users: one Product Owner with `IMPORTBDBA` privilege, one Process Quality Leader without `IMPORTBDBA`.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as Product Owner (with `IMPORTBDBA`) | Login succeeds |
| 2 | Navigate to the SCA section on a release and click `Add Scan Results` | The modal opens; selecting `Black Duck Binary Analysis` shows both `Import from BlackDuck` and `Manual Entry` tabs |
| 3 | Log in as Process Quality Leader (without `IMPORTBDBA`) | Login succeeds |
| 4 | Navigate to the SCA section on the same release and click `Add Scan Results` | The modal opens; selecting `Black Duck Binary Analysis` shows only the `Manual Entry` option (no `Import from BlackDuck` tab) |

**Coverage dimension:** Role-Based Access (IMPORTBDBA privilege gate)
**Note:** P1 — validates the core privilege-based feature gating. Denied role: Process Quality Leader (Release Workflow group, does NOT have `IMPORTBDBA`).

---

#### `RELEASE-SCA-054` — User without IMPORTBDBA cannot see Refresh button

**Preconditions:** An imported BDBA scan exists. Logged in as Process Quality Leader (without `IMPORTBDBA`).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the SCA section on the release with the imported scan | The imported scan block is visible |
| 2 | Verify the `Refresh Data` button is NOT visible | No `Refresh Data` button/icon is present in the scan header |

**Coverage dimension:** Role-Based Access (refresh restricted)
**Note:** P2.

---

### Subsection: 6.4.11 SCA — Release History Logging

---

#### `RELEASE-SCA-055` — Scan add/remove and field changes logged in Release History

**Preconditions:** A scan has been added to the release. At least one editable field has been changed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release History popup | The Release History popup opens |
| 2 | Search or filter for "Cybersecurity Residual Risks" or "Software Composition" activities | At least 1 entry related to SCA changes is visible |
| 3 | Verify the scan addition is logged with activity "Cybersecurity Residual Risks Changes" | An entry with description mentioning the scan name and "has been added" is visible |
| 4 | Verify field change entries show old and new values | At least 1 entry with "has been changed from <old value> to <new value>" format is visible |

**Coverage dimension:** Data Integrity (audit trail)
**Note:** P1 — validates that SCA changes are captured in Release History.

---

## 5. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| 6.4.1 SCA — Add Scan Results Modal | RELEASE-SCA-001 through RELEASE-SCA-005 |
| 6.4.2 SCA — BDBA Import Flow | RELEASE-SCA-006 through RELEASE-SCA-014 |
| 6.4.3 SCA — Manual Scan Entry | RELEASE-SCA-015 through RELEASE-SCA-021 |
| 6.4.4 SCA — Imported Scan View | RELEASE-SCA-022 through RELEASE-SCA-027 |
| 6.4.5 SCA — Refresh Imported Scan | RELEASE-SCA-028 through RELEASE-SCA-033 |
| 6.4.6 SCA — Edit & Delete Scan | RELEASE-SCA-034 through RELEASE-SCA-039 |
| 6.4.7 SCA — Collapse & Expand | RELEASE-SCA-040 through RELEASE-SCA-043 |
| 6.4.8 SCA — 3rd Party Components Table | RELEASE-SCA-044 through RELEASE-SCA-049 |
| 6.4.9 SCA — CVSS Version Toggle | RELEASE-SCA-050 through RELEASE-SCA-052 |
| 6.4.10 SCA — RBAC & Privilege | RELEASE-SCA-053, RELEASE-SCA-054 |
| 6.4.11 SCA — Release History Logging | RELEASE-SCA-055 |

---

## 6. Review Gate Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Every step uses an allowed verb (Navigate, Click, Type, Select, Hover, Verify, Wait, Clear, Scroll) | ✅ |
| 2 | Every expected result is machine-verifiable (observable state) | ✅ |
| 3 | No banned vague terms ("should", "ensure", "check", "validate", "looks correct") | ✅ |
| 4 | UI element names use backtick formatting with widget type | ✅ |
| 5 | Negative cases for input fields (empty Scan ID, zero, non-numeric, duplicate, access denied, API errors) | ✅ |
| 6 | Role-based access tested: authorized (`IMPORTBDBA` holders) + denied (Process Quality Leader) | ✅ |
| 7 | State transitions: import→re-import, refresh→not-found→delete, collapse↔expand, edit/view toggle | ✅ |
| 8 | Data integrity: imported fields read-only, manual fields persist, refresh clears, delete cascades | ✅ |
| 9 | Cross-feature side effects: Release History logging documented | ✅ |
| 10 | No environment-specific hardcoded values | ✅ |
| 11 | Every scenario ID follows `AREA-SUBSECTION-NNN` format (`RELEASE-SCA-NNN`) | ✅ |
| 12 | Every scenario will have steps + expected results populated (via backfill) | ⏳ Pending DB insert |
| 13 | No description starts with `<ID>: ` | ✅ |
| 14 | All role names match `access-privileges.md` canonical list (Product Owner, Security Manager, Security Advisor (SDPA), Process Quality Leader, Viewer Global / Viewer Product) | ✅ |

---

## 7. Out-of-Scope for This Spec

| Story | Feature | Recommended Area / Spec |
|-------|---------|------------------------|
| PIC-9441 — BackOffice CVSS Severity Levels | BackOffice CRUD for CVSS Severity Levels table | `backoffice` (separate spec) |
| PIC-9765 — Data Extraction API Improvements | API response field additions | `integrations` (API tests) |
| PIC-9763 — Legacy SCA Data Mapping | Cloned/historical release data migration | Partially covered by collapse/badge tests; full legacy UI test is out of scope |
| PIC-9964 — SCA Logging (AC5 Software Composition Analysis risk) | Risk field change logging | RELEASE-SCA-055 covers basic logging; deep AC coverage deferred |
| PIC-10354 — CVSS v2/v3/Auto selectors | Full CVSS version matrix testing | Partially covered by RELEASE-SCA-050–052; "Auto" selector deferred pending Dev completion |

---

## 8. Summary

| Metric | Value |
|--------|-------|
| **Existing scenarios (directly relevant)** | 1 (RELEASE-CSRR-010, pending) |
| **New scenarios** | 55 (RELEASE-SCA-001 through RELEASE-SCA-055) |
| **Total scenarios** | 56 |
| **P1 scenarios** | 10 (18%) — core import, manual add, view, edit, delete, refresh, components, RBAC, history |
| **P2 scenarios** | 36 (65%) — validation, error handling, field restrictions, collapse/expand, CVSS toggle |
| **P3 scenarios** | 9 (16%) — edge cases, state persistence, "Other" tool variants |
| **Coverage dimensions filled** | All 5 (Happy Path ✅, Negative ✅, RBAC ✅, State Transitions ✅, Data Integrity ✅) |
| **Jira stories covered** | PIC-9440, PIC-9445, PIC-9466, PIC-9476, PIC-9478, PIC-9483, PIC-9500, PIC-9964, PIC-10354 (9 of 12 stories — UI-facing) |
| **Jira stories out-of-scope** | PIC-9441 (BackOffice), PIC-9765 (API), PIC-9763 (Legacy mapping) |
