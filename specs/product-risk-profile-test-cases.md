# Test Cases: Product Risk Profile Calculator (WF 3.6)

> **Feature:** Product Risk Profile Calculation (CRA - SDL Cadence Calculator)
> **Jira Feature:** PIC-7695
> **Confluence:** Page 576728755 (CRA - SDL Cadence Calculator)
> **Feature Area:** `products`
> **Workflow:** Product Management
> **Scenario Prefix:** `RISK-PROFILE-*`
> **Privilege:** `PRD_UPDATE` (Product update) — gates edit access to Risk Profile Calculator
> **Edit Roles:** Product Owner, Security Manager, Security Advisor (SDPA) — "Product team" group
> **Denied Role (RBAC negative):** Viewer Global / Viewer Product — "Viewer roles" group
> **Spec File:** `tests/products/risk-profile.spec.ts`
> **Page Objects:** `new-product.page.ts`, (future: `risk-profile-calculator.page.ts`)

---

## 1. Coverage Analysis

### Existing Scenarios (4)

| ID | Title | Priority | Auto State | Exec Status | Gap |
|----|-------|----------|------------|-------------|-----|
| RISK-PROFILE-001 | "Calculate Risk Profile" button on Security Summary tab | P1 | automated | passed | Shallow — only button visibility |
| RISK-PROFILE-002 | Calculator form shows Exposure, Likelihood, and Impact inputs | P1 | automated | passed | Shallow — only label visibility |
| RISK-PROFILE-003 | Submitting a calculation adds a row to history grid | P1 | pending | not-executed | FIXME — deferred as destructive |
| RISK-PROFILE-004 | Calculated risk level appears in grid | P1 | automated | passed | Shallow — grid headers only |

### Coverage Gap Table

| # | Dimension | Status | Gap |
|---|-----------|--------|-----|
| 1 | **Happy Path** | ⚠️ Partial | Button click + field labels tested. Missing: full 9-factor selection → calculation → save → redirect → Product Details verification |
| 2 | **Negative / Validation** | ❌ Missing | No tests: save without all factors, Notes 200-char limit, Cancel/Back with unsaved changes, comment 500-char limit |
| 3 | **Role-Based Access** | ❌ Missing | No tests: authorized roles (PO, SM, SA), denied roles (Viewer). Privilege: `PRD_UPDATE` |
| 4 | **State Transitions** | ❌ Missing | No tests: uncalculated → calculated, calculated → edited, calculated → overridden, override → deleted |
| 5 | **Data Integrity** | ❌ Missing | No tests: saved values appear on Product Details, override persists, comments persist after save |

---

## 2. New Scenario Inventory (39 scenarios: RISK-PROFILE-005 through RISK-PROFILE-043)

### By Subsection

| Subsection | New IDs | Count |
|------------|---------|-------|
| 3.6 Product Risk Profile Calculator | 005–020 | 16 |
| 3.6 Product Risk Profile — Details Section | 021–026 | 6 |
| 3.6 Product Risk Profile — Override | 027–032 | 6 |
| 3.6 Product Risk Profile — Factor Comments | 033–038 | 6 |
| 3.6 Product Risk Profile — History | 039–041 | 3 |
| 3.6 Product Risk Profile — RBAC | 042–043 | 2 |

### Priority Breakdown

| Priority | Count | Percentage |
|----------|-------|------------|
| P1 | 8 | 21% |
| P2 | 25 | 64% |
| P3 | 6 | 15% |

---

## 3. Deduplication Table

| Existing | New Candidate | Decision |
|----------|---------------|----------|
| RISK-PROFILE-001 (button visible) | RISK-PROFILE-024 (button navigates to calculator) | **Keep both** — 001 is visibility smoke, 024 is functional navigation |
| RISK-PROFILE-002 (Exposure/Likelihood/Impact labels) | RISK-PROFILE-005 (full page layout) | **Keep both** — 002 is quick smoke for 3 labels, 005 is comprehensive layout including all 9 factor dropdowns |
| RISK-PROFILE-003 (submit adds row) | RISK-PROFILE-010 (full factor selection + calculation) | **Keep both** — 003 tests grid row creation, 010 tests the calculation logic itself |
| RISK-PROFILE-004 (grid headers) | RISK-PROFILE-021 (all fields populated after calc) | **Keep both** — 004 tests column headers, 021 tests actual field values |

No true duplicates found. All existing scenarios test shallow visibility; new scenarios test full functional flows.

---

## 4. Test Case Specifications

### Subsection: 3.6 Product Risk Profile Calculator

---

#### `RISK-PROFILE-005` — Calculator page displays all sections and factor dropdowns

**Preconditions:** Logged in as Product Owner. Product exists with `PRD_UPDATE` privilege. Risk Profile not yet calculated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page for the test product | The `Product Details` heading is visible |
| 2 | Click the `Security Summary` tab | The `Security Summary` tab has `aria-selected="true"` |
| 3 | Click the `Calculate Risk Profile` button | The URL contains `RiskProfile` or `Calculator`; the `Product Risk Profile` heading is visible |
| 4 | Verify the `Likelihood Factors` section is visible | The `Likelihood Factors (L)` section heading is visible |
| 5 | Verify all 4 Likelihood factor dropdowns are visible | The `Connectivity`, `Functionality`, `Operational Environment`, and `Attacker Persona` dropdowns are visible |
| 6 | Verify the `Impact Factors` section is visible | The `Impact Factors (I)` section heading is visible; the subtitle "A cyberattack on this product in its typical use, could have the following worst-case impacts:" is visible |
| 7 | Verify all 5 Impact factor dropdowns are visible | The `Health & Safety`, `Compliance`, `Operational`, `Sustainability`, and `Data Protection` dropdowns are visible |
| 8 | Verify calculated fields are visible | The `Exposure`, `Likelihood`, `Impact`, `Risk Vector`, `Risk Profile Number`, and `Risk Profile Threshold` fields are visible |
| 9 | Verify the `Notes` text field is visible | The `Notes` input field is visible |
| 10 | Verify the `Product Risk Assessment` link field is visible | The `Product Risk Assessment` input field is visible |
| 11 | Verify `Save` and `Cancel` buttons are visible | The `Save` button and `Cancel` button are visible |
| 12 | Verify breadcrumbs show product name and "Product Risk Profile" | The breadcrumb contains the product name followed by "Product Risk Profile" |

**Coverage dimension:** Happy Path (layout verification)
**Note:** P2 — validates the complete calculator page structure before functional tests.

---

#### `RISK-PROFILE-006` — Cancel button with unsaved changes shows confirmation dialog

**Preconditions:** Logged in as Product Owner. Navigated to Risk Profile Calculator page in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Risk Profile Calculator page for the test product | The `Product Risk Profile` heading is visible |
| 2 | Select a value from the `Connectivity` dropdown | The `Connectivity` dropdown shows the selected value |
| 3 | Click the `Cancel` button | The confirmation dialog is visible with `Keep Editing` and `Discard Changes` options |
| 4 | Click the `Keep Editing` button in the dialog | The dialog closes; the calculator page is still visible with the previously selected `Connectivity` value |
| 5 | Click the `Cancel` button again | The confirmation dialog is visible |
| 6 | Click the `Discard Changes` button in the dialog | The URL no longer contains `RiskProfile`; the Product Details page is visible |

**Coverage dimension:** Negative / Validation (unsaved changes guard)
**Note:** P2 — tests both "stay" and "leave" paths of the cancel confirmation.

---

#### `RISK-PROFILE-007` — Back button with unsaved changes shows confirmation dialog

**Preconditions:** Logged in as Product Owner. Navigated to Risk Profile Calculator page in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Risk Profile Calculator page for the test product | The `Product Risk Profile` heading is visible |
| 2 | Select a value from the `Functionality` dropdown | The `Functionality` dropdown shows the selected value |
| 3 | Click the `Back` button (or breadcrumb back link) | The confirmation dialog is visible with `Cancel` and `Leave` options |
| 4 | Click `Cancel` in the dialog | The dialog closes; the calculator page is still visible |
| 5 | Click the `Back` button again | The confirmation dialog is visible |
| 6 | Click `Leave` in the dialog | The URL returns to the Product Details page |

**Coverage dimension:** Negative / Validation (navigation guard)
**Note:** P2.

---

#### `RISK-PROFILE-008` — Edit mode pre-populates previously saved factor values

**Preconditions:** Logged in as Product Owner. Product has an existing calculated Risk Profile (all 9 factors previously saved).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page, click `Security Summary` tab | The Risk Profile section shows calculated values (not dashes) |
| 2 | Click the `Edit` button on the Risk Profile section (or `View Details` → `Edit`) | The calculator page opens in edit mode |
| 3 | Verify the `Connectivity` dropdown shows the previously saved value | The `Connectivity` dropdown is not set to "Select" placeholder |
| 4 | Verify the `Functionality` dropdown shows the previously saved value | The `Functionality` dropdown is not set to "Select" placeholder |
| 5 | Verify the `Operational Environment` dropdown shows the previously saved value | The `Operational Environment` dropdown is not set to "Select" placeholder |
| 6 | Verify the `Attacker Persona` dropdown shows the previously saved value | The `Attacker Persona` dropdown is not set to "Select" placeholder |
| 7 | Verify all 5 Impact factor dropdowns show previously saved values | None of the Impact factor dropdowns show the "Select" placeholder |
| 8 | Verify all calculated fields (Exposure, Likelihood, Impact, Risk Vector, Risk Profile Number, Risk Profile Threshold) are populated | None of the calculated fields show "-" or placeholder text |

**Coverage dimension:** Data Integrity (edit mode preserves state)
**Note:** P2 — requires a product with pre-existing Risk Profile data.

---

#### `RISK-PROFILE-009` — View mode shows read-only calculated values

**Preconditions:** Logged in as Product Owner. Product has an existing calculated Risk Profile.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page, click `Security Summary` tab | The Risk Profile section is visible |
| 2 | Click the `View Details` button | The calculator page opens in view mode |
| 3 | Verify all factor dropdowns are disabled or read-only | The `Connectivity`, `Functionality`, `Operational Environment`, `Attacker Persona`, and all 5 Impact factor fields are not editable |
| 4 | Verify calculated fields show values (not placeholders) | `Exposure`, `Likelihood`, `Impact`, `Risk Vector`, `Risk Profile Number`, and `Risk Profile Threshold` are not empty and do not show "-" |
| 5 | Verify the `Save` and `Cancel` buttons are NOT visible | No `Save` or `Cancel` button is present on the page |
| 6 | Verify the `Edit` button is visible | The `Edit` button is visible (for authorized roles) |

**Coverage dimension:** State Transitions (view mode vs. edit mode)
**Note:** P2.

---

#### `RISK-PROFILE-010` — Select all 9 factors and verify all calculated fields populate

**Preconditions:** Logged in as Product Owner. Navigated to Risk Profile Calculator in edit mode with no factors selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Risk Profile Calculator page (new calculation) | All factor dropdowns show "Select" placeholder; all calculated fields show default placeholders or "-" |
| 2 | Select a value from the `Connectivity` dropdown | The `Connectivity` field shows the selected value with Level and Vector Substring |
| 3 | Select a value from the `Functionality` dropdown | The `Functionality` field shows the selected value; the `Exposure` field now shows a calculated value in "Level - Description" format |
| 4 | Select a value from the `Operational Environment` dropdown | The `Operational Environment` field shows the selected value |
| 5 | Select a value from the `Attacker Persona` dropdown | The `Attacker Persona` field shows the selected value; the `Likelihood` field now shows a calculated value in "Level - Description" format |
| 6 | Select a value from the `Health & Safety` dropdown | The `Health & Safety` field shows the selected value; the `Impact` field now shows a calculated value |
| 7 | Select a value from the `Compliance` dropdown | The `Compliance` field shows the selected value |
| 8 | Select a value from the `Operational` dropdown | The `Operational` field shows the selected value |
| 9 | Select a value from the `Sustainability` dropdown | The `Sustainability` field shows the selected value |
| 10 | Select a value from the `Data Protection` dropdown | The `Data Protection` field shows the selected value |
| 11 | Verify the `Risk Vector` field shows all 9 vector substrings separated by "/" | The `Risk Vector` field contains exactly 8 "/" separators (9 segments) |
| 12 | Verify `Risk Profile Number` is populated | The `Risk Profile Number` field shows a numeric value (not "-") |
| 13 | Verify `Risk Profile Threshold` is populated | The `Risk Profile Threshold` field shows a text value (not "Unknown") |

**Coverage dimension:** Happy Path (core calculation E2E)
**Note:** P1 — this is the primary happy path for the entire feature.

---

#### `RISK-PROFILE-011` — Exposure auto-calculates after Connectivity and Functionality are selected

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode, no factors selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Exposure` field shows the placeholder "Based on connectivity and functionality factors." | The `Exposure` field contains the placeholder text |
| 2 | Select a value from the `Connectivity` dropdown | The `Exposure` field still shows the placeholder (only 1 of 2 required factors selected) |
| 3 | Select a value from the `Functionality` dropdown | The `Exposure` field now shows a calculated value in "Level - Description" format (no longer shows placeholder) |

**Coverage dimension:** Happy Path (incremental calculation logic)
**Note:** P2 — tests the Exposure dependency on exactly 2 factors.

---

#### `RISK-PROFILE-012` — Likelihood auto-calculates after all 4 Likelihood factors are selected

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode, no factors selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Likelihood` field shows the placeholder "Based on all likelihood factors." | The `Likelihood` field contains the placeholder text |
| 2 | Select a value from the `Connectivity` dropdown | The `Likelihood` field still shows the placeholder |
| 3 | Select a value from the `Functionality` dropdown | The `Likelihood` field still shows the placeholder |
| 4 | Select a value from the `Operational Environment` dropdown | The `Likelihood` field still shows the placeholder |
| 5 | Select a value from the `Attacker Persona` dropdown | The `Likelihood` field now shows a calculated value in "Level - Description" format |

**Coverage dimension:** Happy Path (incremental calculation — all 4 L factors required)
**Note:** P2.

---

#### `RISK-PROFILE-013` — Impact is calculated as the maximum of all selected Impact factors

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode with all Likelihood factors already selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Impact` field shows the placeholder "Based on all impact factors." | The `Impact` field contains the placeholder text |
| 2 | Select the lowest-level value from `Health & Safety` dropdown | The `Impact` field now shows a value matching the selected level |
| 3 | Select a higher-level value from `Compliance` dropdown | The `Impact` field updates to the higher level (MAX logic) |
| 4 | Select values for `Operational`, `Sustainability`, and `Data Protection` all at or below the Compliance level | The `Impact` field remains at the Compliance level (MAX unchanged) |

**Coverage dimension:** Happy Path (MAX calculation logic)
**Note:** P2 — verifies Impact = MAX(I1..I5).

---

#### `RISK-PROFILE-014` — Risk Vector builds incrementally as factors are selected

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode, no factors selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Risk Vector` field shows "-" | The `Risk Vector` field contains "-" |
| 2 | Select a value from the `Connectivity` dropdown (e.g., Vector Substring = "R") | The `Risk Vector` field is no longer "-" and contains at least one character segment |
| 3 | Select values for all remaining 8 factor dropdowns | The `Risk Vector` field shows 9 segments separated by "/" in format: `C/F/OE/AP/HS/CO/OP/SU/DP` |

**Coverage dimension:** Data Integrity (Risk Vector composition)
**Note:** P3 — verifies the concatenation format with "/" separators.

---

#### `RISK-PROFILE-015` — Risk Vector copy to clipboard

**Preconditions:** Logged in as Product Owner. All 9 factors selected on the calculator page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Risk Vector` field shows a value with 8 "/" separators | The `Risk Vector` field is populated |
| 2 | Click the copy icon/button near the `Risk Vector` field | The Risk Vector value is copied to the clipboard (or a "Copied" tooltip/toast appears) |

**Coverage dimension:** Happy Path (clipboard copy)
**Note:** P3 — clipboard testing may require Playwright `browserContext.grantPermissions(['clipboard-read'])`.

---

#### `RISK-PROFILE-016` — Save all factors successfully redirects to Product Details with toast

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode with all 9 factors selected, calculated fields populated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify all 9 factors are selected and all calculated fields are populated | `Risk Profile Number` and `Risk Profile Threshold` fields are not empty |
| 2 | Click the `Save` button | A toast message "Product risk profile has been applied successfully." is visible |
| 3 | Verify redirect to Product Details page | The URL contains `ProductDetail`; the `Product Details` heading is visible |
| 4 | Click the `Security Summary` tab | The `Security Summary` tab has `aria-selected="true"` |
| 5 | Verify the Risk Profile section shows the saved values | The `Risk Profile Threshold` field does not show "Unknown"; the `Date` field does not show "-" |

**Coverage dimension:** Happy Path (save + redirect + data integrity)
**Note:** P1 — core save flow; critical path for the entire feature.

---

#### `RISK-PROFILE-017` — Notes field accepts up to 200 characters

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Notes` input field | The `Notes` field is focused |
| 2 | Type exactly 200 characters into the `Notes` field | The `Notes` field contains exactly 200 characters |
| 3 | Type 1 additional character | The `Notes` field still contains exactly 200 characters (additional character is rejected or truncated) |

**Coverage dimension:** Negative / Validation (character limit)
**Note:** P3 — boundary value test for the 200-char limit.

---

#### `RISK-PROFILE-018` — Product Risk Assessment link field accepts free text

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Product Risk Assessment` field shows the placeholder "Enter Product Risk Assessment Link" | The placeholder text is visible |
| 2 | Type a URL into the `Product Risk Assessment` field | The field contains the typed URL |

**Coverage dimension:** Happy Path (optional field)
**Note:** P3 — verifies the optional free text field.

---

#### `RISK-PROFILE-019` — Factor dropdowns show Level and Vector Substring for each option

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Connectivity` dropdown to expand options | The dropdown shows at least 1 option |
| 2 | Verify each option shows a code/name format | Each dropdown option contains identifiable text (code and name) |
| 3 | Select an option | The selected value shows in the `Connectivity` field; the `Level` read-only field shows a numeric value; the `Vector Substring` read-only field shows a text code |

**Coverage dimension:** Data Integrity (dropdown option format)
**Note:** P2 — verifies that each factor dropdown exposes Level and Vector Substring.

---

#### `RISK-PROFILE-020` — Save without selecting all factors is prevented or shows validation

**Preconditions:** Logged in as Product Owner. Calculator page in edit mode with only 2 of 9 factors selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select values for `Connectivity` and `Functionality` only | Only 2 factors are selected; remaining 7 show "Select" placeholder |
| 2 | Click the `Save` button | Either: the `Save` button is disabled, OR a validation message appears indicating all factors are required, OR the save proceeds with partial data (document actual behavior) |

**Coverage dimension:** Negative / Validation (incomplete form submission)
**Note:** P2 — documents whether partial saves are allowed or blocked.

---

### Subsection: 3.6 Product Risk Profile — Details Section

---

#### `RISK-PROFILE-021` — Risk Profile section is visible on Product Details page with all fields

**Preconditions:** Logged in as Product Owner. Product exists (active).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page | The `Product Details` heading is visible |
| 2 | Click the `Security Summary` tab | The `Security Summary` tab has `aria-selected="true"` |
| 3 | Verify the `Product Risk Profile` section heading is visible | The `Product Risk Profile` text is visible |
| 4 | Verify the following fields are present: Date, Submitted by, Risk Profile Number, Risk Profile Threshold, Exposure, Likelihood, Impact | At least 5 of these field labels are visible in the Risk Profile section |

**Coverage dimension:** Happy Path (section layout)
**Note:** P1 — validates the Product Details section structure.

---

#### `RISK-PROFILE-022` — Before calculation all fields show default values

**Preconditions:** Logged in as Product Owner. Product has NO calculated Risk Profile yet.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page, click `Security Summary` tab | The `Product Risk Profile` section is visible |
| 2 | Verify the `Date` field shows "-" | The `Date` field contains "-" |
| 3 | Verify the `Submitted by` field shows "-" | The `Submitted by` field contains "-" |
| 4 | Verify the `Risk Profile Number` field shows "-" | The `Risk Profile Number` field contains "-" |
| 5 | Verify the `Risk Profile Threshold` field shows "Unknown" | The `Risk Profile Threshold` field contains "Unknown" |
| 6 | Verify the `Exposure` field shows "-" | The `Exposure` field contains "-" |
| 7 | Verify the `Likelihood` field shows "-" | The `Likelihood` field contains "-" |
| 8 | Verify the `Impact` field shows "-" | The `Impact` field contains "-" |

**Coverage dimension:** State Transitions (uncalculated default state)
**Note:** P2 — requires a product without any prior Risk Profile calculation.

---

#### `RISK-PROFILE-023` — After calculation all fields show computed values

**Preconditions:** Logged in as Product Owner. Product has a calculated Risk Profile (all 9 factors were saved).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page, click `Security Summary` tab | The `Product Risk Profile` section is visible |
| 2 | Verify the `Date` field does NOT show "-" | The `Date` field contains a date value (not "-") |
| 3 | Verify the `Submitted by` field does NOT show "-" | The `Submitted by` field contains a user name (not "-") |
| 4 | Verify the `Risk Profile Number` field does NOT show "-" | The `Risk Profile Number` field contains a numeric value |
| 5 | Verify the `Risk Profile Threshold` field does NOT show "Unknown" | The `Risk Profile Threshold` field contains a risk level text (e.g., "Critical", "High", "Medium", "Low") |
| 6 | Verify the `Exposure` field does NOT show "-" | The `Exposure` field contains a calculated value |
| 7 | Verify the `Likelihood` field does NOT show "-" | The `Likelihood` field contains a calculated value |
| 8 | Verify the `Impact` field does NOT show "-" | The `Impact` field contains a calculated value |

**Coverage dimension:** Data Integrity (calculated values persist to Product Details)
**Note:** P1 — critical data integrity check; depends on RISK-PROFILE-016 having run first.

---

#### `RISK-PROFILE-024` — Calculate Risk Profile button navigates to calculator in edit mode

**Preconditions:** Logged in as Product Owner. Product exists, Risk Profile not yet calculated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page, click `Security Summary` tab | The `Product Risk Profile` section is visible |
| 2 | Verify the `Calculate Risk Profile` button is visible | The `Calculate Risk Profile` button is visible |
| 3 | Click the `Calculate Risk Profile` button | The URL changes to the Risk Profile Calculator page; the factor dropdowns are editable (not read-only) |

**Coverage dimension:** Happy Path (navigation)
**Note:** P1 — validates the primary entry point to the calculator.

---

#### `RISK-PROFILE-025` — View Details button navigates to calculator in view mode

**Preconditions:** Logged in as Product Owner. Product has a calculated Risk Profile.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page, click `Security Summary` tab | The `Product Risk Profile` section shows calculated values |
| 2 | Click the `View Details` button | The calculator page opens; factor values are displayed but NOT editable |
| 3 | Verify the `Edit` button is visible on the view mode page | The `Edit` button is present |

**Coverage dimension:** State Transitions (view mode navigation)
**Note:** P2.

---

#### `RISK-PROFILE-026` — Create product page shows info icon with tooltip

**Preconditions:** Logged in as Product Owner. On the Create New Product page (before product is saved).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Create New Product page | The product creation form is visible |
| 2 | Scroll to the `Security Summary` section | The `Product Risk Profile` subsection heading is visible |
| 3 | Click or hover over the information icon near the `Product Risk Profile` title | A tooltip with "Product risk profile calculation will be available after product is created." is visible |

**Coverage dimension:** State Transitions (pre-creation info state)
**Note:** P3 — verifies the info tooltip on create page.

---

### Subsection: 3.6 Product Risk Profile — Override

---

#### `RISK-PROFILE-027` — Override Risk Profile happy path: select, justify, save

**Preconditions:** Logged in as Product Owner. Product has a calculated Risk Profile. No existing override.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Risk Profile Calculator page (view or edit mode) | The Risk Profile section is visible |
| 2 | Verify the message "Do you want to change the risk profile result?" is visible with the `Override` button | The override prompt and button are visible |
| 3 | Click the `Override` button | The `Override Risk Profile` popup opens |
| 4 | Select a value from the `New Risk Profile` dropdown | The dropdown shows options in "Number - Threshold" format; a value is selected |
| 5 | Type a justification in the `Justification` text field | The `Justification` field contains the typed text |
| 6 | Click the `Save` button in the popup | The popup closes; the toast message "Updated product risk profile has been added successfully." is visible |
| 7 | Verify the updated Risk Profile value is shown below the original | The updated Risk Profile value with the provided justification is visible on the calculator page |
| 8 | Verify the `Edit` and `Delete` buttons are visible near the updated Risk Profile | The `Edit` button and `Delete` button are visible |

**Coverage dimension:** Happy Path (override E2E)
**Note:** P1 — primary override workflow.

---

#### `RISK-PROFILE-028` — Override popup Cancel/X closes without changes

**Preconditions:** Logged in as Product Owner. On the Override Risk Profile popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Override` button on the Risk Profile section | The `Override Risk Profile` popup opens |
| 2 | Select a value from the `New Risk Profile` dropdown | A value is selected |
| 3 | Click the `Cancel` button in the popup | The popup closes; no override value is shown on the page |
| 4 | Click the `Override` button again | The popup opens again |
| 5 | Click the `X` (close) button in the popup | The popup closes; no override value is shown on the page |

**Coverage dimension:** Negative / Validation (cancel discard)
**Note:** P2.

---

#### `RISK-PROFILE-029` — Edit existing override saves updated values

**Preconditions:** Logged in as Product Owner. Product has an existing Risk Profile override.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Risk Profile Calculator page | The overridden Risk Profile value and justification are visible |
| 2 | Click the `Edit` button near the updated Risk Profile | The `Edit Updated Risk Profile` popup opens with the previously saved override values pre-populated |
| 3 | Select a different value from the `New Risk Profile` dropdown | The new value is selected |
| 4 | Update the justification text | The `Justification` field contains the new text |
| 5 | Click the `Save` button | The popup closes; the toast message "Changes have been saved successfully." is visible |
| 6 | Verify the updated values are displayed | The newly selected Risk Profile and updated justification are visible |

**Coverage dimension:** Data Integrity (edit override)
**Note:** P2.

---

#### `RISK-PROFILE-030` — Delete override restores original Risk Profile

**Preconditions:** Logged in as Product Owner. Product has an existing Risk Profile override.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Risk Profile Calculator page | The overridden Risk Profile value is visible with `Edit` and `Delete` buttons |
| 2 | Click the `Delete` button near the updated Risk Profile | A confirmation popup appears with `Cancel` and `Delete` options |
| 3 | Click the `Cancel` button in the confirmation popup | The popup closes; the override is still visible |
| 4 | Click the `Delete` button again | The confirmation popup appears |
| 5 | Click the `Delete` button in the confirmation popup | The popup closes; the toast message "Updated product risk profile has been deleted successfully." is visible |
| 6 | Verify the override is removed | The updated Risk Profile section is no longer visible; only the original calculated values remain |

**Coverage dimension:** State Transitions (override → deleted → original restored)
**Note:** P2.

---

#### `RISK-PROFILE-031` — Orange icon appears when Updated Risk Profile is lower than Original

**Preconditions:** Logged in as Product Owner. Product has a calculated Risk Profile with a higher level (e.g., Critical or High).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create an override with a lower Risk Profile level than the original (e.g., override Critical → Low) | The override is saved successfully |
| 2 | Verify an orange warning icon is visible near the "Updated" label | An orange icon is visible next to the updated Risk Profile value |
| 3 | Hover over the orange icon | A tooltip with "Note: The original risk profile is at a higher level than the updated one." is visible |

**Coverage dimension:** Data Integrity (visual indicator for downgrade)
**Note:** P2 — tests the warning icon logic; depends on the override being a lower value.

---

#### `RISK-PROFILE-032` — Override values displayed on Product Details page

**Preconditions:** Logged in as Product Owner. Product has an active Risk Profile override with justification.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page, click `Security Summary` tab | The `Product Risk Profile` section is visible |
| 2 | Verify the updated (overridden) Risk Profile value is shown | The Risk Profile section displays the overridden value (not only the original) |
| 3 | Verify the `Justification` field is visible with the provided text | The `Justification` text from the override is displayed in the Product Details section |

**Coverage dimension:** Data Integrity (override persists to Product Details view)
**Note:** P2.

---

### Subsection: 3.6 Product Risk Profile — Factor Comments

---

#### `RISK-PROFILE-033` — Add comment to a Likelihood factor

**Preconditions:** Logged in as Product Owner. On the Risk Profile Calculator page in edit mode. A Likelihood factor is already selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Add Comment` button near the `Connectivity` factor | The comment section opens in edit mode with a text field showing the "Add Comment" placeholder |
| 2 | Type a comment (e.g., "This product connects via ethernet only") | The text field contains the typed comment |
| 3 | Click the `Save` button below the comment field | The comment section switches to read-only mode; the saved comment text is visible |
| 4 | Verify the `Edit` and `Delete` buttons are visible below the comment | The `Edit` button and `Delete` button are visible under the saved comment |

**Coverage dimension:** Happy Path (comment CRUD — create)
**Note:** P1 — primary add-comment flow.

---

#### `RISK-PROFILE-034` — Add Comment button is present for each factor

**Preconditions:** Logged in as Product Owner. On the Risk Profile Calculator page in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Add Comment` button is visible near the `Connectivity` factor | The button is visible |
| 2 | Verify the `Add Comment` button is visible near the `Functionality` factor | The button is visible |
| 3 | Verify the `Add Comment` button is visible near the `Operational Environment` factor | The button is visible |
| 4 | Verify the `Add Comment` button is visible near the `Attacker Persona` factor | The button is visible |
| 5 | Verify the `Add Comment` button is visible near the `Health & Safety` factor | The button is visible |
| 6 | Verify the `Add Comment` button is visible near the `Compliance` factor | The button is visible |
| 7 | Verify the `Add Comment` button is visible near the `Operational` (Impact) factor | The button is visible |
| 8 | Verify the `Add Comment` button is visible near the `Sustainability` factor | The button is visible |
| 9 | Verify the `Add Comment` button is visible near the `Data Protection` factor | The button is visible |

**Coverage dimension:** Happy Path (layout — all 9 factors have comment buttons)
**Note:** P2.

---

#### `RISK-PROFILE-035` — Comment field enforces 500 character limit

**Preconditions:** Logged in as Product Owner. Comment section open in edit mode for any factor.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Add Comment` button near any factor | The comment text field is visible |
| 2 | Type exactly 500 characters into the comment field | The comment field contains exactly 500 characters |
| 3 | Type 1 additional character | The comment field still contains exactly 500 characters (the extra character is rejected or truncated) |

**Coverage dimension:** Negative / Validation (boundary value)
**Note:** P3 — character limit boundary test.

---

#### `RISK-PROFILE-036` — Cancel comment returns to read-only without saving

**Preconditions:** Logged in as Product Owner. Comment section open in edit mode for a factor (no saved comment yet).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Add Comment` button near a factor | The comment edit section opens |
| 2 | Type some text in the comment field | The text field contains the typed text |
| 3 | Click the `Cancel` button below the comment field | The comment section returns to read-only mode; the `Add Comment` button is visible again; no comment text is displayed |

**Coverage dimension:** Negative / Validation (cancel discard)
**Note:** P2.

---

#### `RISK-PROFILE-037` — Edit an existing comment

**Preconditions:** Logged in as Product Owner. A factor already has a saved comment.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the saved comment text is visible under the factor in read-only mode | The comment text is visible with `Edit` and `Delete` buttons |
| 2 | Click the `Edit` button | The comment section switches to edit mode with the existing comment text pre-populated |
| 3 | Clear the text and type a new comment | The field contains the new comment text |
| 4 | Click the `Save` button | The comment section returns to read-only mode; the updated comment text is visible |

**Coverage dimension:** Data Integrity (edit comment)
**Note:** P2.

---

#### `RISK-PROFILE-038` — Delete comment shows confirmation and removes comment

**Preconditions:** Logged in as Product Owner. A factor already has a saved comment.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the saved comment is visible with `Edit` and `Delete` buttons | The comment and buttons are visible |
| 2 | Click the `Delete` button | A confirmation popup appears with `Cancel` and `Delete` options |
| 3 | Click `Cancel` in the confirmation popup | The popup closes; the comment is still visible |
| 4 | Click the `Delete` button again | The confirmation popup appears |
| 5 | Click `Delete` in the confirmation popup | The popup closes; the comment is removed; the `Add Comment` button reappears for this factor |

**Coverage dimension:** State Transitions (comment → deleted → add-comment restored)
**Note:** P2.

---

### Subsection: 3.6 Product Risk Profile — History

---

#### `RISK-PROFILE-039` — Risk Profile calculation is logged in Product History

**Preconditions:** Logged in as Product Owner. Product Risk Profile has just been calculated and saved.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page | The `Product Details` heading is visible |
| 2 | Open the Product History popup (click the `History` button or link) | The Product History popup opens |
| 3 | Verify a "Product Risk Profile Calculation calculated" activity entry exists | At least 1 row with Activity = "Product Risk Profile Calculation calculated" is visible |
| 4 | Verify the Description shows "Product Risk Profile is calculated as <Number - Threshold>" | The Description column contains "Product Risk Profile is calculated as" followed by a risk profile value |
| 5 | Verify the Date and User columns are populated | The Date shows a recent timestamp; the User shows the name of the Product Owner who performed the calculation |

**Coverage dimension:** Data Integrity (history audit trail)
**Note:** P1 — validates that the critical calculation action is logged.

---

#### `RISK-PROFILE-040` — Factor update is logged in Product History with old and new values

**Preconditions:** Logged in as Product Owner. An existing Risk Profile has been edited — at least one factor changed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page and open Product History popup | The Product History popup opens |
| 2 | Verify a "Product Risk Profile Calculation edited" activity entry exists | At least 1 row with Activity = "Product Risk Profile Calculation edited" is visible |
| 3 | Verify the Description contains the factor name and old/new values | The Description contains text like "<Factor name> factor is updated from <old value> to <new value>" |

**Coverage dimension:** Data Integrity (history tracks changes)
**Note:** P2 — verifies factor change audit trail.

---

#### `RISK-PROFILE-041` — Override create/edit/delete actions are logged in Product History

**Preconditions:** Logged in as Product Owner. An override has been created, edited, or deleted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page and open Product History popup | The Product History popup opens |
| 2 | Search or filter for "Risk Profile" activities | Override-related activity entries are visible |
| 3 | Verify the override action is logged with appropriate activity type | At least 1 entry describing the override action is present in the history |

**Coverage dimension:** Data Integrity (override audit trail)
**Note:** P2 — verifies override CRUD is logged.

---

### Subsection: 3.6 Product Risk Profile — RBAC

---

#### `RISK-PROFILE-042` — Product Owner, Security Manager, and Security Advisor can access the calculator

**Preconditions:** Three test users with roles: Product Owner, Security Manager, Security Advisor (SDPA). All assigned to the same product. Product has `PRD_UPDATE` privilege for these roles.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as Product Owner | Login succeeds |
| 2 | Navigate to Product Detail page, click `Security Summary` tab | The `Calculate Risk Profile` button (or `Edit` / `View Details` button if already calculated) is visible |
| 3 | Click the `Calculate Risk Profile` (or `Edit`) button | The Risk Profile Calculator page opens; factor dropdowns are editable |
| 4 | Repeat steps 1–3 for Security Manager | The calculator page opens with editable factor dropdowns |
| 5 | Repeat steps 1–3 for Security Advisor (SDPA) | The calculator page opens with editable factor dropdowns |

**Coverage dimension:** Role-Based Access (authorized roles)
**Note:** P2 — tests all 3 authorized roles from the "Product team" group. Privilege: `PRD_UPDATE`.

---

#### `RISK-PROFILE-043` — Viewer role cannot edit the Risk Profile

**Preconditions:** Logged in as Viewer Global / Viewer Product. The product has a calculated Risk Profile.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail page, click `Security Summary` tab | The `Product Risk Profile` section is visible (read-only) |
| 2 | Verify the `Calculate Risk Profile` button is NOT visible | No `Calculate Risk Profile` button is present |
| 3 | Verify the `Edit` button is NOT visible in the Risk Profile section | No `Edit` button is visible for the Risk Profile |
| 4 | If a `View Details` button is visible, click it | The calculator page opens in view-only mode; all fields are read-only; no `Save`, `Cancel`, or `Edit` buttons are present |

**Coverage dimension:** Role-Based Access (denied role — different group: Viewer roles)
**Note:** P2 — Viewer Global is from the "Viewer roles" group, which does NOT have `PRD_UPDATE`. This tests the negative path.

---

## 5. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| 3.6 Product Risk Profile Calculator | RISK-PROFILE-001 through RISK-PROFILE-020 |
| 3.6 Product Risk Profile — Details Section | RISK-PROFILE-021 through RISK-PROFILE-026 |
| 3.6 Product Risk Profile — Override | RISK-PROFILE-027 through RISK-PROFILE-032 |
| 3.6 Product Risk Profile — Factor Comments | RISK-PROFILE-033 through RISK-PROFILE-038 |
| 3.6 Product Risk Profile — History | RISK-PROFILE-039 through RISK-PROFILE-041 |
| 3.6 Product Risk Profile — RBAC | RISK-PROFILE-042, RISK-PROFILE-043 |

---

## 6. Review Gate Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Every step uses an allowed verb (Navigate, Click, Type, Select, Hover, Verify) | ✅ |
| 2 | Every expected result is machine-verifiable (observable state) | ✅ |
| 3 | No banned vague terms ("should", "ensure", "check", "validate", "looks correct") | ✅ |
| 4 | UI element names use backtick formatting with widget type | ✅ |
| 5 | Negative cases for input fields (Notes 200-char, Comment 500-char, Cancel/Back dialogs, incomplete form) | ✅ |
| 6 | Role-based access tested: authorized (PO, SM, SA) + denied (Viewer Global) | ✅ |
| 7 | State transitions: uncalculated→calculated, view→edit, override→delete | ✅ |
| 8 | Data integrity: save→read back on Product Details, override persists, history logs | ✅ |
| 9 | Cross-feature side effects identified (Product Details section, Product History, Approvals — noted as out-of-scope) | ✅ |
| 10 | No environment-specific hardcoded values (no absolute URLs, user names, or fixed counts) | ✅ |
| 11 | Every scenario ID follows `AREA-SUBSECTION-NNN` format | ✅ (all `RISK-PROFILE-NNN`) |
| 12 | Every scenario will have steps + expected results populated (via backfill) | ⏳ Pending DB insert |
| 13 | No description starts with `<ID>: ` | ✅ |
| 14 | All role names match `access-privileges.md` canonical list | ✅ (Product Owner, Security Manager, Security Advisor (SDPA), Viewer Global / Viewer Product) |

---

## 7. Out-of-Scope for This Spec (Cross-Cutting / Other Areas)

The following stories are related to the CRA feature but belong to other feature areas:

| Story | Feature | Recommended Area |
|-------|---------|-----------------|
| PIC-8010 — Approvals logic updates | Approvals logic based on Risk Profile level + review cadence | `releases` (Scope/FCSR approver assignment) |
| PIC-9976 — Factor/Risk Score changes | BackOffice change notification + snapshot logic | `products` × `backoffice` (cross-cutting) |
| PIC-7948 — Factors table changes | BackOffice Factors CRUD | `backoffice` |
| PIC-7950 — Risk Score table changes | BackOffice Risk Scores CRUD | `backoffice` |
| PIC-7952 — Add Risk Profile to formula | BackOffice selection formula | `backoffice` |
| PIC-8012 — Data Extraction API | API endpoint updates | `integrations` |

These should be covered in separate spec files for their respective feature areas.

---

## 8. Summary

| Metric | Value |
|--------|-------|
| **Existing scenarios** | 4 (3 automated, 1 pending) |
| **New scenarios** | 39 (RISK-PROFILE-005 through RISK-PROFILE-043) |
| **Total scenarios** | 43 |
| **P1 scenarios** | 8 (19%) — core happy paths and critical verifications |
| **P2 scenarios** | 25 (58%) — validation, RBAC, state transitions, data integrity |
| **P3 scenarios** | 6 (14%) — edge cases, boundary values, cosmetic checks |
| **Existing (unchanged)** | 4 (9%) |
| **Coverage dimensions filled** | All 5 (Happy Path ✅, Negative ✅, RBAC ✅, State Transitions ✅, Data Integrity ✅) |
| **Jira stories covered** | PIC-7954, PIC-8009, PIC-7981, PIC-7978, PIC-8011 (5 of 11 active stories — UI-facing) |
| **Jira stories out-of-scope** | PIC-8010, PIC-9976, PIC-7948, PIC-7950, PIC-7952, PIC-8012 (cross-cutting/backoffice/API) |
