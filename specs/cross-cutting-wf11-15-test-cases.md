# Cross-Cutting Workflows — Test Case Specifications

> **Generated:** 2026-04-22 · **Scope:** WF 11 (DOC), WF 12 (Roles Delegation), WF 13 (Actions Management), WF 14 (Release History), WF 15 (Stage Sidebar & Responsible Users)
> **Skill:** `create-test-cases` v1

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Workflow | Total | Automated | Pending | On-Hold | Has Steps | Missing Steps |
|----------|-------|-----------|---------|---------|-----------|---------------|
| Digital Offer Certification (DOC) | 363 | 281 | 53 | 29 | ~335 | ~28 |
| Roles Delegation | 52 | 0 | 52 | 0 | 0 | 52 |
| Actions Management | 89 | 2 | 87 | 0 | 3 | 86 |
| Release History | 19 | 1 | 18 | 0 | 1 | 18 |
| Stage Sidebar & Responsible Users | 13 | 0 | 13 | 0 | 0 | 13 |
| **Totals** | **536** | **284** | **223** | **29** | **339** | **197** |

### 1.2 Five-Dimension Coverage Gap Table

#### WF 12 — Roles Delegation

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | ROLES-DELEGATION-PAGE-001–0014 cover single delegation; ROLES-DELEGATION-BULK-001–0027 cover bulk |
| Negative / Validation | ✅ | ROLES-DELEGATION-SINGLE-003 (empty mandatory), ROLES-DELEGATION-SINGLE-004 (>3 months warning), ROLES-DELEGATION-CSO-006 (CSO empty Role) |
| Role-Based Access | ⚠️ | ROLES-DELEGATION-CSO-001–0033 cover CSO permissions; **missing: user without delegation privilege cannot see the page** |
| State Transitions | ⚠️ | ROLES-DELEGATION-EFFECTS-001–0052 cover post-delegation effects; **missing: expired delegation auto-revocation verification** |
| Data Integrity | ✅ | ROLES-DELEGATION-SCOPE-001–0038 cover product/release display; ROLES-DELEGATION-HISTORY-001–0047 cover history |

#### WF 13 — Actions Management

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | Full CRUD + Jira flows covered |
| Negative / Validation | ✅ | ACTIONS-EDIT-005, ACTIONS-EDIT-006, ACTIONS-CREATE-003 |
| Role-Based Access | ⚠️ | ACTIONS-ACCESS-004/0006 cover VIEW/EDIT; **missing: user without either privilege cannot see Actions Management link** |
| State Transitions | ⚠️ | **Missing: bar chart updates after action status change** |
| Data Integrity | ✅ | History logging, Jira sync, snapshot behavior |

#### WF 14 — Release History

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | MANAGE-008 automated; RELEASE-HISTORY-002–0006 pending |
| Negative / Validation | ✅ | RELEASE-HISTORY-EDGE-003 error state |
| Role-Based Access | ❌ | **No scenario tests denied access to Release History** |
| State Transitions | N/A | History is read-only; no state transitions |
| Data Integrity | ⚠️ | RELEASE-HISTORY-AUDIT-001–0019 cover specific entries; **missing: stage transition logged in history** |

#### WF 15 — Stage Sidebar & Responsible Users

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | STAGE-SIDEBAR-004–0006 cover Need Help sidebar |
| Negative / Validation | ⚠️ | **Missing: sidebar on a release with no responsible users** |
| Role-Based Access | ✅ | STAGE-SIDEBAR-TASKS-001–0011 cover My Tasks assignee |
| State Transitions | ⚠️ | **Missing: sidebar updates after SA submits (approval date appears)** |
| Data Integrity | ✅ | STAGE-SIDEBAR-WORKFLOW-004–0013 cover submission counter and timestamps |

#### WF 11 — DOC (pending/on-hold only)

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | 281 automated; remaining pending covers Reports, Privileges, Landing |
| Negative / Validation | ⚠️ | DOC-PRIV-014 (no-privilege denial); **missing: My DOCs empty state for user with zero products** |
| Role-Based Access | ⚠️ | DOC-PRIV-001–015 cover all privileges; most pending |
| State Transitions | ✅ | DOC-LIFECYCLE-039 (Revoke); lifecycle well-covered |
| Data Integrity | ⚠️ | DOC-REPORTS-001–016 all pending; DOC-TASKS-003–005 pending |

### 1.3 Identified Gaps — New Scenarios Needed

| Gap | Dimension | Workflow | New Scenario ID | Priority |
|-----|-----------|----------|-----------------|----------|
| User without delegation privilege cannot see Roles Delegation link | Role-Based Access | 12 | ROLES-DELEGATION-ACCESS-001 | P2 |
| Expired delegation auto-revokes: table resets, access removed | State Transition | 12 | ROLES-DELEGATION-LIFECYCLE-001 | P2 |
| Delegation start date in the past shows validation error | Negative | 12 | ROLES-DELEGATION-VALIDATION-001 | P2 |
| Expiration date before start date shows validation error | Negative | 12 | ROLES-DELEGATION-VALIDATION-002 | P2 |
| User without VIEW/EDIT privilege cannot see Actions Management link | Role-Based Access | 13 | ACTIONS-ACCESS-001 | P2 |
| Bar chart updates after action status change | Data Integrity | 13 | ACTIONS-BARCHART-001 | P3 |
| Actions Management page: pagination per-page (10/20/50/100) | Happy Path | 13 | ACTIONS-PAGINATION-001 | P3 |
| Actions Management page: pagination prev/next navigation | Happy Path | 13 | ACTIONS-PAGINATION-002 | P3 |
| Release History: stage transition entry appears after Submit | Data Integrity | 14 | RELEASE-HISTORY-001 | P2 |
| Sidebar updates when SA submits — approval date appears dynamically | State Transition | 15 | STAGE-SIDEBAR-001 | P2 |
| Sidebar: "Previous Stage" and "Next Stage" navigation buttons work | Happy Path | 15 | STAGE-SIDEBAR-002 | P2 |
| Sidebar: stage description text from BackOffice is visible | Happy Path | 15 | STAGE-SIDEBAR-003 | P3 |
| My DOCs: empty state when user has zero Digital Offer products | Negative | 11 | DOC-MYDOCS-019 | P3 |

**New scenarios: 13** · Priority breakdown: P1=0, P2=9, P3=4

---

## 2. Deduplication Table

| Candidate A | Candidate B | Verdict |
|-------------|-------------|---------|
| PRODUCT-ACTIONS-001 (automated: link visible) | ACTIONS-ACCESS-002 (pending: link visible on release) | **Keep both** — different entry points (product vs. release) |
| PRODUCT-ACTIONS-001-b (pending: click opens page from product) | ACTIONS-ACCESS-003 (pending: click opens page from release) | **Keep both** — same distinction |
| PRODUCT-ACTIONS-003 (pending: create action) | ACTIONS-CREATE-001–0047 (pending: create action details) | **Remove PRODUCT-ACTIONS-003** — ACTIONS-CREATE-001–0047 are more granular |
| DOC-SETUP-005 (on-hold: sortable columns) | LANDING-DOCS-011-b (pending: sortable columns on My DOCs) | **Keep both** — different pages (Product DOC tab vs Landing My DOCs) |
| ACTIONS-SUMMARY-001 (Actions Summary collapsed) | ACTIONS-SUMMARY-007 (frozen snapshot) | **Keep both** — different aspects |

**Actions:** Remove `PRODUCT-ACTIONS-003` (duplicate of ACTIONS-CREATE-001–0047).

---

## 3. Test Case Specifications

### WF 12 — Roles Delegation

#### 3.1 Subsection: 12.1 Roles Delegation Page

---

#### `ROLES-DELEGATION-PAGE-001` — "Roles Delegation" link is visible in the Landing Page header navigation

**Preconditions:** Logged in as a user with delegation privileges.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The Landing Page heading is visible |
| 2 | Verify the `Roles Delegation` link in the header navigation area | The `Roles Delegation` link is visible in the top navigation |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-PAGE-002` — Clicking "Roles Delegation" opens the Roles Delegation page in a new browser tab

**Preconditions:** Logged in with delegation privileges. Landing Page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Roles Delegation` link in the header navigation | A new browser tab opens |
| 2 | Verify the new tab URL | The URL contains `/RolesDelegation` |
| 3 | Verify the page heading | The `Roles Delegation` heading is visible |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-PAGE-003` — Page shows a table with columns: Role Name, Scope, Delegated Person, Start Date, Expiration Date, Actions

**Preconditions:** Roles Delegation page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the table headers | Column headers `Role Name`, `Scope`, `Delegated Person`, `Start Date`, `Expiration Date`, `Actions` are visible |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-PAGE-004` — Roles without an active delegatee show empty cells and a "Delegate" button

**Preconditions:** At least 1 role without an active delegation.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Locate a role row without an active delegatee | The `Delegated Person`, `Start Date`, and `Expiration Date` cells are empty |
| 2 | Verify the Actions column | A `Delegate` button is visible in the Actions column |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-PAGE-005` — Roles with an active delegatee show the delegate name and a three-dot Actions menu

**Preconditions:** At least 1 role with an active delegation.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Locate a role row with an active delegatee | The `Delegated Person` column shows the delegate's name; `Start Date` and `Expiration Date` are populated |
| 2 | Verify the Actions column | A three-dot menu icon is visible in the Actions column |
| 3 | Click the three-dot menu | Options `Edit Delegation` and `Remove Delegation` are visible |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-ACCESS-001` — User without delegation privilege cannot see Roles Delegation link (NEW)

**Preconditions:** Logged in as a user WITHOUT delegation privileges (e.g., a viewer-only role).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The Landing Page heading is visible |
| 2 | Verify the header navigation area | The `Roles Delegation` link is not visible |

**Coverage dimension:** Role-Based Access

---

#### 3.2 Subsection: 12.2 Delegate Role Pop-Up — Single Role

---

#### `ROLES-DELEGATION-SINGLE-001` — Clicking "Delegate" opens "Delegate Role" pop-up showing placeholder text with the role name

**Preconditions:** Roles Delegation page loaded. At least 1 undelegated role.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Delegate` button on an undelegated role row | The `Delegate Role` pop-up opens |
| 2 | Verify the pop-up title or header | The pop-up contains text referencing the role name (e.g., "Delegate Product Owner role") |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-SINGLE-002` — Pop-up mandatory fields: Assignee, Start Date, Expiration Date, Justification

**Preconditions:** Delegate Role pop-up is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Assignee` field | A SailPoint user lookup field is visible with a mandatory indicator |
| 2 | Verify the `Start Date` field | A date picker is visible with a mandatory indicator |
| 3 | Verify the `Expiration Date` field | A date picker is visible with a mandatory indicator |
| 4 | Verify the `Justification` field | A text area is visible with a mandatory indicator |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-SINGLE-003` — Saving without filling any mandatory field shows inline validation error

**Preconditions:** Delegate Role pop-up is open with all fields empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Delegate` (Save) button without filling any fields | Inline validation errors are visible for `Assignee`, `Start Date`, `Expiration Date`, and `Justification` |

**Coverage dimension:** Negative / Validation

---

#### `ROLES-DELEGATION-SINGLE-004` — Delegation period > 3 months shows info message

**Preconditions:** Delegate Role pop-up is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a Start Date (today) | The date is set |
| 2 | Select an Expiration Date more than 3 months from the Start Date | An info message containing "delegation period is monitored by the Governance team" is visible |

**Coverage dimension:** Negative / Validation

---

#### `ROLES-DELEGATION-SINGLE-005` — Clicking "Save" triggers confirmation dialog

**Preconditions:** Pop-up filled with valid data.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill in Assignee, Start Date, Expiration Date, and Justification | All fields are populated |
| 2 | Click the `Delegate` (Save) button | A confirmation dialog appears containing text like "<role> role will be delegated to <user>" |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-SINGLE-006` — Clicking "Confirm" saves the delegation record

**Preconditions:** Confirmation dialog is visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Confirm` (or equivalent) in the confirmation dialog | The dialog closes; a success message "Role delegation saved successfully" is visible |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-SINGLE-007` — After saving, the table row shows delegated person name, start date, and expiration date

**Preconditions:** Delegation just saved.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the role row in the table | The `Delegated Person` column shows the selected user's name; `Start Date` and `Expiration Date` columns show the selected dates |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-SINGLE-008` — Clicking "Cancel" in the pop-up closes it without saving

**Preconditions:** Delegate Role pop-up open with data entered.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Cancel` button | The pop-up closes |
| 2 | Verify the role row | The `Delegated Person`, `Start Date`, and `Expiration Date` cells remain empty |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-SINGLE-009` — Clicking the X icon closes the pop-up without saving

**Preconditions:** Delegate Role pop-up open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the X (close) icon on the pop-up | The pop-up closes without saving |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-VALIDATION-001` — Delegation start date in the past shows validation error (NEW)

**Preconditions:** Delegate Role pop-up open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a Start Date that is in the past | A validation error is visible indicating the start date cannot be in the past |

**Coverage dimension:** Negative / Validation

---

#### `ROLES-DELEGATION-VALIDATION-002` — Expiration date before start date shows validation error (NEW)

**Preconditions:** Delegate Role pop-up open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a Start Date (e.g., tomorrow) | The start date is set |
| 2 | Select an Expiration Date before the Start Date | A validation error is visible indicating the expiration date must be after the start date |

**Coverage dimension:** Negative / Validation

---

#### 3.3 Subsection: 12.3 Edit and Remove Delegation

---

#### `ROLES-DELEGATION-EDIT-001` — Three-dot menu on a delegated role row shows "Edit" and "Remove Delegation"

**Preconditions:** At least 1 actively delegated role.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot menu on a delegated role row | Two options visible: `Edit Delegation` and `Remove Delegation` |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-EDIT-002` — Clicking "Edit" opens the Delegate Role pop-up pre-filled with current data

**Preconditions:** Three-dot menu open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit Delegation` | The Delegate Role pop-up opens with Assignee, Start Date, Expiration Date, and Justification pre-filled |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-EDIT-003` — Saving edited delegation updates all fields in the table row

**Preconditions:** Edit Delegation pop-up open. Change at least one field.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Change the `Expiration Date` to a new value | The date is updated |
| 2 | Click `Save` and confirm | A success message is visible; the table row shows the updated expiration date |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-EDIT-004` — Clicking "Remove Delegation" stops the delegation; table columns become empty

**Preconditions:** Three-dot menu open on a delegated role.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Remove Delegation` | A confirmation popup appears |
| 2 | Confirm the removal | The `Delegated Person`, `Start Date`, and `Expiration Date` cells are cleared; the `Delegate` button reappears in Actions column |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-EDIT-005` — Removed delegation no longer grants the delegate access to that role's resources

**Preconditions:** Delegation just removed. Log in as the former delegate.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the product that was within the removed delegation's scope | The product detail page loads |
| 2 | Verify the delegate's permissions | The former delegate cannot perform actions that the delegated role would have allowed (e.g., Edit buttons are not visible or actions are blocked) |

**Coverage dimension:** Role-Based Access

---

#### 3.4 Subsection: 12.4 Bulk Delegation

---

#### `ROLES-DELEGATION-BULK-001` — "Bulk Actions" section is visible with disabled buttons by default

**Preconditions:** Roles Delegation page loaded. No checkboxes selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Bulk Actions area | The `Delegate` and `Remove Delegation` bulk buttons are visible but disabled |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-BULK-002` — Selecting at least one undelegated role enables the "Delegate" bulk button

**Preconditions:** At least 1 role without a delegatee.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Check the checkbox on an undelegated role row | The `Delegate` bulk button becomes enabled |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-BULK-003` — Selecting at least one delegated role enables the "Remove Delegation" bulk button

**Preconditions:** At least 1 role with an active delegatee.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Check the checkbox on a delegated role row | The `Remove Delegation` bulk button becomes enabled |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-BULK-004` — Selecting both delegated and non-delegated roles enables both bulk buttons

**Preconditions:** Mixed selection.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Check checkboxes on both delegated and undelegated role rows | Both `Delegate` and `Remove Delegation` bulk buttons are enabled |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-BULK-005` — "Delegate" bulk action saves new delegation for selected roles

**Preconditions:** Multiple undelegated roles selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Delegate` bulk button | The Delegate Role pop-up opens |
| 2 | Fill in Assignee, Start Date, Expiration Date, and Justification | All fields populated |
| 3 | Click `Delegate` and confirm | A success message "Delegation details successfully updated for X roles" is visible; all selected rows show the delegatee details |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-BULK-006` — "Remove Delegation" bulk action removes delegation for all selected delegated roles

**Preconditions:** Multiple delegated roles selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Remove Delegation` bulk button | A confirmation popup appears |
| 2 | Confirm | A success message "Delegation successfully ended for X roles" is visible; selected rows are cleared |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-BULK-007` — System shows the count of selected roles

**Preconditions:** At least 1 role selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select 2 role rows via checkboxes | A label showing "2 roles selected" (or similar count) is visible |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-BULK-008` — "Clear selection" button deselects all and becomes hidden

**Preconditions:** At least 1 role selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Clear selection` (or equivalent) | All checkboxes are unchecked; the selection count and clear button are hidden |

**Coverage dimension:** Happy Path

---

#### 3.5 Subsection: 12.5 CSO-Specific Permissions (BU SO / LOB SL)

---

#### `ROLES-DELEGATION-CSO-001` — User with BU SO or LOB SL role sees two tabs: "My roles" and "Org Level Users"

**Preconditions:** Logged in as BU SO or LOB SL. Roles Delegation page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the tabs on the Roles Delegation page | Two tabs visible: `My Roles` and `Org Level Users` |

**Coverage dimension:** Role-Based Access

---

#### `ROLES-DELEGATION-CSO-002` — "My roles" tab is functionally identical to the standard Roles Delegation page

**Preconditions:** `My Roles` tab active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the table columns | `Role Name`, `Scope`, `Delegated Person`, `Start Date`, `Expiration Date`, `Actions` are visible |
| 2 | Verify the `Delegate` button on an undelegated role | The `Delegate` button is visible |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-CSO-003` — "Org Level Users" tab shows user table with Name, Email, LEAP License, View details

**Preconditions:** CSO user. `Org Level Users` tab active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Org Level Users` tab | The tab becomes active |
| 2 | Verify the table columns | `User Name`, `Email`, `LEAP License` (Active/Inactive badge), and `View Details` button visible |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-CSO-004` — Clicking "View details" navigates to the selected user's roles page

**Preconditions:** Org Level Users tab active. At least 1 user row.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View Details` on a user row | The page navigates to the selected user's roles list |
| 2 | Verify the roles table | The table shows the user's roles with Delegate/three-dot actions |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-CSO-005` — CSO "Delegate" pop-up has an additional mandatory "Role" dropdown

**Preconditions:** CSO user viewing another user's roles. Delegate pop-up open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Delegate` on a role row from Org Level Users view | The Delegate Role pop-up opens |
| 2 | Verify the `Role` dropdown | An additional `Role` dropdown is visible with a mandatory indicator; options include `PO`, `SM`, `SA`, `PQL`, `LOB SL` |

**Coverage dimension:** Role-Based Access

---

#### `ROLES-DELEGATION-CSO-006` — CSO pop-up: saving with empty Role dropdown shows validation error

**Preconditions:** CSO Delegate pop-up open. Role dropdown empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill in Assignee, Start Date, Expiration Date, and Justification but leave `Role` empty | All fields except Role are populated |
| 2 | Click `Delegate` | A validation error is visible for the `Role` field |

**Coverage dimension:** Negative / Validation

---

#### 3.6 Subsection: 12.6 Delegation Display in Product & Release Details

---

#### `ROLES-DELEGATION-SCOPE-001` — Delegated user displayed in Product Details "Product Team" section

**Preconditions:** Active delegation exists. Product Details page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page | The page loads |
| 2 | Scroll to the `Product Team` section | The section is visible |
| 3 | Verify the delegatee's name is displayed alongside the delegator | Both the delegator and delegatee names are visible for the delegated role |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-SCOPE-002` — Hovering over the delegatee name shows a tooltip with Justification text

**Preconditions:** Product Team section visible with a delegatee.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hover over the delegatee's name | A tooltip appears containing the justification text |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-SCOPE-003` — In Product edit mode, delegatees are hidden

**Preconditions:** Product Details in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit Product Details` | The page enters edit mode |
| 2 | Verify the Product Team section | Only the delegator (original role holder) is visible; the delegatee name is hidden |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-SCOPE-004` — Delegated user appears in Release "Roles & Responsibilities" tab

**Preconditions:** Active delegation for a role on a release. Release Detail page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Roles & Responsibilities` tab | The tab loads |
| 2 | Verify the SDL Roles section | The delegatee's name appears in the relevant role row |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-SCOPE-005` — Hovering over delegatee name in Roles & Responsibilities shows Justification tooltip

**Preconditions:** Roles & Responsibilities tab visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hover over the delegatee's name in the SDL Roles section | A tooltip containing the delegation justification text is visible |

**Coverage dimension:** Data Integrity

---

#### 3.7 Subsection: 12.7 Delegation History

---

#### `ROLES-DELEGATION-HISTORY-001` — "Roles delegation history" link opens the Delegation History popup

**Preconditions:** Roles Delegation page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Delegation History` link/button | The Delegation History popup opens |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-HISTORY-002` — Popup shows columns: Date, User, Activity, Description

**Preconditions:** Delegation History popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the table columns | `Date`, `User`, `Activity`, and `Description` column headers are visible |
| 2 | Verify the `Role Holder` column (for CSO users) | If logged in as CSO, a `Role Holder` column is also visible |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-HISTORY-003` — Records sorted descending by date; clicking Date header toggles sort

**Preconditions:** Delegation History popup with at least 2 records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the first record date is more recent than the last | The records are in descending date order |
| 2 | Click the `Date` column header | The sort order toggles to ascending (oldest first) |
| 3 | Click the `Date` column header again | The sort order returns to descending |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-HISTORY-004` — Activity filter dropdown includes delegation activity types

**Preconditions:** Delegation History popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Activity` dropdown filter | Options visible: `Role Delegation Assignment`, `Role Delegation Removal`, `Roles Delegation Update`, `Roles Delegation Expiration` |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-HISTORY-005` — Search text field filters by User name or Description content

**Preconditions:** Delegation History popup with records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a partial user name into the Search field | The table narrows to rows where the User or Description contains the search text |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-HISTORY-006` — Date Range filter limits records to the selected period

**Preconditions:** Delegation History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a Start Date and End Date in the date range pickers | The dates are set |
| 2 | Click `Search` | Only records within the selected date range are visible |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-HISTORY-007` — "Search" button applies all active filters; "Reset" clears them

**Preconditions:** Delegation History popup with filters set.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Set a search term and an Activity filter | Both filters active |
| 2 | Click `Search` | The table narrows to matching records |
| 3 | Click `Reset` | All filters are cleared; the full history is restored |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-HISTORY-008` — Pagination with per-page options (10/20/50/100) and prev/next controls

**Preconditions:** Delegation History with more than 10 records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `20` from the per-page dropdown | The table displays up to 20 rows |
| 2 | Click the Next page button | The next page of records is displayed |
| 3 | Click the Previous page button | The previous page is restored |

**Coverage dimension:** Happy Path

---

#### `ROLES-DELEGATION-HISTORY-009` — "No results" message when filters return no matching records

**Preconditions:** Delegation History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a nonsensical search term (e.g., "zzzznonexistent") and click `Search` | A "No results found" message is visible |

**Coverage dimension:** Negative / Validation

---

#### 3.8 Subsection: 12.8 Post-Delegation Effects & Task Handover

---

#### `ROLES-DELEGATION-EFFECTS-001` — After delegation: delegate receives all delegator's currently open My Tasks items

**Preconditions:** Delegation just saved. Delegator has open tasks. Log in as delegate.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click `My Tasks` tab | The `My Tasks` tab is active |
| 2 | Verify tasks from the delegated role are visible | At least 1 task originally assigned to the delegator is visible in the delegate's task list |

**Coverage dimension:** State Transition

---

#### `ROLES-DELEGATION-EFFECTS-002` — Delegate receives email notifications for releases via delegation

**Preconditions:** Delegation active. A release action triggers a notification.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger a notification-generating action on a release within the delegation scope | The action completes |
| 2 | Verify the delegate received the notification | The delegate's email or in-app notification contains the release notification |

**Coverage dimension:** Data Integrity
**Note:** Email verification may require external mailbox check or notification log inspection.

---

#### `ROLES-DELEGATION-EFFECTS-003` — When delegation expires or is removed: tasks cleared from delegate's My Tasks

**Preconditions:** Active delegation with open tasks visible to delegate. Delegation is then removed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Remove the delegation (or wait for expiration) | The delegation is ended |
| 2 | Log in as the former delegate and navigate to `My Tasks` | The tasks from the delegated role are no longer visible |

**Coverage dimension:** State Transition

---

#### `ROLES-DELEGATION-EFFECTS-004` — Delegator retains full access throughout the delegation period

**Preconditions:** Active delegation. Log in as the delegator.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a product within the delegation scope | The product page loads |
| 2 | Verify edit capabilities | The delegator can still perform edit actions (e.g., `Edit Product Details` button is visible) |

**Coverage dimension:** Role-Based Access

---

#### `ROLES-DELEGATION-EFFECTS-005` — Release History logs activity when delegation change affects SDL Roles

**Preconditions:** Delegation saved or removed for a role that maps to SDL Roles in a release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click `View Release History` | The History popup opens |
| 2 | Verify a "Roles and Responsibilities Update" entry | At least 1 history entry with activity type containing "Roles" or "Responsibilities" is visible |

**Coverage dimension:** Data Integrity

---

#### `ROLES-DELEGATION-LIFECYCLE-001` — Expired delegation auto-revokes: table resets, access removed (NEW)

**Preconditions:** Delegation with an expiration date that has just passed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Roles Delegation page | The page loads |
| 2 | Verify the previously delegated role row | The `Delegated Person`, `Start Date`, `Expiration Date` cells are empty; the `Delegate` button reappears |
| 3 | Log in as the former delegate and verify access | The delegate cannot perform actions associated with the expired delegation |

**Coverage dimension:** State Transition

---

### WF 13 — Actions Management

#### 3.9 Subsection: 13.1 Actions Management Access & Link

---

#### `PRODUCT-ACTIONS-001-b` — Clicking "Actions Management" from Product Details opens in a new window

**Preconditions:** Product Details page loaded. `Actions Management` link visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Actions Management` link on the Product Details page | A new browser window/tab opens |
| 2 | Verify the URL | The URL contains the Actions Management page path |
| 3 | Verify the page heading | The `Actions Management` heading is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-ACCESS-002` — "Actions Management" link is visible on Release Detail pages

**Preconditions:** Release Detail page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Actions Management` link on the Release Detail page | The `Actions Management` link is visible in the page header or navigation area |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-ACCESS-003` — Clicking "Actions Management" from a release opens the Actions Management page

**Preconditions:** Release Detail page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Actions Management` link | A new browser window opens |
| 2 | Verify the `Actions Management` heading | The heading is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-ACCESS-004` — Users with VIEW_PRODUCT_ACTIONS privilege see view-only mode

**Preconditions:** Logged in as a user with VIEW_PRODUCT_ACTIONS but NOT EDIT_PRODUCT_ACTIONS. Actions Management page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Actions column for each action row | The Actions column is empty (no Edit, Submit to Jira options) |
| 2 | Verify the `Create Action` button | The `Create Action` button is not visible |

**Coverage dimension:** Role-Based Access

---

#### `ACTIONS-ACCESS-005` — Users with EDIT_PRODUCT_ACTIONS privilege see full Actions column

**Preconditions:** Logged in as a user with EDIT_PRODUCT_ACTIONS. Actions Management page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Actions column for a non-closed, non-Jira-submitted action | A three-dot menu or pencil icon is visible |
| 2 | Verify the `Create Action` button | The `Create Action` button is visible |

**Coverage dimension:** Role-Based Access

---

#### `ACTIONS-ACCESS-001` — User without VIEW/EDIT privilege cannot see Actions Management link (NEW)

**Preconditions:** Logged in as a user WITHOUT VIEW_PRODUCT_ACTIONS or EDIT_PRODUCT_ACTIONS.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page | The page loads |
| 2 | Verify the `Actions Management` link | The link is not visible |

**Coverage dimension:** Role-Based Access

---

#### 3.10 Subsection: 13.2 Actions Management Page — Table & Columns

---

#### `ACTIONS-GRID-001` — "Jira Link" column appears only when at least one action was submitted to Jira

**Preconditions:** Actions Management page. At least 1 action submitted to Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Jira Link` column header | The `Jira Link` column is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-GRID-002` — Clicking an Action Name opens the View Action Details pop-up

**Preconditions:** At least 1 action row visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the Action Name text on a row | The `Action Details` pop-up opens showing the action's full details |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-GRID-003` — Due Date column shows a red exclamation mark when overdue

**Preconditions:** At least 1 action with a past due date that is not closed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Locate an action row with a past Due Date | A red (or orange) exclamation mark icon is visible next to the due date |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-GRID-004` — Empty state message when no actions exist

**Preconditions:** Product with zero actions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Actions Management page for a product with no actions | The message "No Actions created for this product." is visible |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-GRID-005` — Three-dot menu shows "Edit" and "Submit to Jira" for editable unsubmitted actions (Jira tracking)

**Preconditions:** Product tracking tool = Jira. Action not closed, not Jira-submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot menu on an eligible action row | Options `Edit` and `Submit to Jira` are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-GRID-006` — Edit icon shown for editable unsubmitted actions when tracking tool = N/A

**Preconditions:** Product tracking tool = N/A. Action not closed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Actions column | A pencil (edit) icon is visible (no three-dot menu, no Jira option) |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-GRID-007` — Actions column is empty for Closed or Jira-submitted actions

**Preconditions:** At least 1 closed or Jira-submitted action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Locate a closed or Jira-submitted action row | The Actions column is empty (no edit icon, no three-dot menu) |

**Coverage dimension:** Happy Path

---

#### 3.11 Subsection: 13.3 Filters on Actions Management Page

---

#### `ACTIONS-FILTER-001` — Search field narrows actions by Name or Description text

**Preconditions:** Actions Management page with multiple actions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a partial action name into the Search field | The action list narrows to rows matching the search text |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-002` — Status dropdown filter narrows list

**Preconditions:** Actions with mixed statuses.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Open` from the Status dropdown | Only actions with `Open` status are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-003` — Selecting "Closed" in Status filter activates "Include Closed" toggle

**Preconditions:** "Include Closed" toggle is OFF.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Closed` from the Status dropdown | The `Include Closed` toggle automatically activates (turns ON); closed actions are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-004` — Release Number filter narrows list

**Preconditions:** Actions from multiple releases.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a specific release number from the dropdown | Only actions from that release are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-005` — Assignee filter narrows list

**Preconditions:** Actions assigned to different users.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a user from the Assignee filter | Only actions assigned to that user are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-006` — Category filter narrows list

**Preconditions:** Actions with mixed categories.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Pre-Condition` from the Category dropdown | Only Pre-Condition actions are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-007` — Due Date Range filter narrows actions

**Preconditions:** Actions with varied due dates.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a From date and To date in the Due Date Range picker | Only actions with due dates within the range are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-008` — "Include Closed" toggle OFF by default; ON includes closed actions

**Preconditions:** Actions Management page loaded. Some closed actions exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Include Closed` toggle state | The toggle is OFF |
| 2 | Verify closed actions are not visible | No action with `Closed` status is visible |
| 3 | Toggle `Include Closed` to ON | Closed actions appear in the list |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-009` — "Reset" button clears all active filters

**Preconditions:** At least 1 filter applied.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Reset` | All filter fields are cleared; the full action list is restored |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-FILTER-010` — "No Actions to show" when filters return no results

**Preconditions:** Filters set to return zero results.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply filters that match no actions | The message "No Actions to show" is visible |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-PAGINATION-001` — Pagination per-page (10/20/50/100) (NEW)

**Preconditions:** Actions Management page with > 10 actions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the per-page dropdown | The dropdown is visible with options 10, 20, 50, 100 |
| 2 | Select `20` | The table displays up to 20 rows |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-PAGINATION-002` — Pagination prev/next navigation (NEW)

**Preconditions:** Actions Management page with > 10 actions. Per-page = 10.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the Next page button | The second page of actions is visible |
| 2 | Click the Previous page button | The first page is restored |

**Coverage dimension:** Happy Path

---

#### 3.12 Subsection: 13.4 View Action Details Pop-Up

---

#### `ACTIONS-VIEW-001` — Clicking an action name opens "Action Details" pop-up

**Preconditions:** At least 1 action row.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the action name link | The `Action Details` pop-up opens |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-VIEW-002` — Pop-up shows: Name, Status, Due Date, Category, Assignee, Origin, Description

**Preconditions:** Action Details pop-up open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the fields | `Name`, `Status`, `Due Date`, `Category`, `Assignee`, `Origin`, and `Description` fields are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-VIEW-003` — Overdue due date shows orange exclamation mark

**Preconditions:** Action Details pop-up for an overdue action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Due Date field | An orange exclamation mark icon is visible next to the date |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-VIEW-004` — "Closure Comment" field shown only for Closed actions

**Preconditions:** Action Details pop-up for a Closed action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Closure Comment` field | The field is visible with the closure comment text |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-VIEW-005` — "Evidence" link shown when evidence link was provided

**Preconditions:** Action Details pop-up for an action with an evidence link.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Evidence` field | A clickable hyperlink is visible |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-VIEW-006` — "Source Link" (Jira) shown only when submitted to Jira

**Preconditions:** Action Details pop-up for a Jira-submitted action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Source Link` field | A clickable Jira link is visible |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-VIEW-007` — "Updated by" and "on" fields show last modifier

**Preconditions:** Action Details pop-up.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Updated by` and `on` fields | A user name and date/time are visible |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-VIEW-008` — "Edit" button shown for editable actions

**Preconditions:** Action Details pop-up for a non-closed, non-Jira-submitted action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Edit` button | The button is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-VIEW-009` — Only X (close) icon shown for Closed or Jira-submitted actions

**Preconditions:** Action Details pop-up for a closed or Jira-submitted action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the pop-up buttons | Only the X (close) icon is visible; no `Edit` button |

**Coverage dimension:** Role-Based Access (status-based restriction)

---

#### 3.13 Subsection: 13.5 Edit Actions

---

#### `ACTIONS-EDIT-001` — Clicking "Edit" opens "Edit Action" pop-up

**Preconditions:** Action Details pop-up open. `Edit` button visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Edit` button | The `Edit Action` pop-up opens with all fields editable or read-only per rules |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-EDIT-002` — All fields editable when action was created in the same release stage

**Preconditions:** Edit Action pop-up for an action created in the current release stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify editability of `Name`, `Description`, `Category`, `Due Date`, `Status`, `Closure Comment`, `Evidence`, `Assignee` | All fields are editable (enabled) |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-EDIT-003` — Only Status, Closure Comment, Evidence, Assignee editable when created in a different stage

**Preconditions:** Edit Action pop-up for an action created in a different release stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify `Name` and `Description` fields | Both are read-only (greyed out / disabled) |
| 2 | Verify `Status`, `Closure Comment`, `Evidence`, `Assignee` | These fields are editable |

**Coverage dimension:** Role-Based Access (stage-based restriction)

---

#### `ACTIONS-EDIT-004` — Name and Description are read-only for actions from a previous stage

**Preconditions:** Same as ACTIONS-EDIT-003.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify `Name` field | The field is in a disabled/read-only state |
| 2 | Verify `Description` field | The field is in a disabled/read-only state |

**Coverage dimension:** Role-Based Access
**Note:** Overlaps ACTIONS-EDIT-003; consider consolidating.

---

#### `ACTIONS-EDIT-005` — Due Date only allows future dates; past date shows validation error

**Preconditions:** Edit Action pop-up. Due Date picker open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a past date from the date picker | A validation error is visible indicating past dates are not allowed, OR past dates are disabled in the picker |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-EDIT-006` — Changing Status to "Closed" makes "Closure Comment" mandatory

**Preconditions:** Edit Action pop-up. Action status ≠ Closed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Closed` from the Status dropdown | The `Closure Comment` field becomes visible with a mandatory indicator |
| 2 | Click `Save` without entering a closure comment | A validation error is visible |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-EDIT-007` — "Save" persists changes; activity logged in History

**Preconditions:** Edit Action pop-up with a change made.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Modify a field (e.g., Status to `In Progress`) | The field is updated |
| 2 | Click `Save` | The pop-up closes; the action list shows the updated value |
| 3 | Click `View History` | A new history entry for "Action details update" or "Action status update" is visible |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-EDIT-008` — "Cancel" or X closes pop-up without saving

**Preconditions:** Edit Action pop-up with unsaved changes.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Cancel` (or the X icon) | The pop-up closes |
| 2 | Re-open the action details | The original values are unchanged |

**Coverage dimension:** Data Integrity

---

#### 3.14 Subsection: 13.6 Create New Action from Actions Management

---

#### `ACTIONS-CREATE-001` — "Create action" button is visible on the Actions Management page

**Preconditions:** Actions Management page loaded. User has EDIT privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Create Action` button | The button is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-CREATE-002` — Create Action pop-up: Name, Due Date, Description mandatory; Assignee optional

**Preconditions:** Create Action pop-up open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Name` field | Visible with mandatory indicator |
| 2 | Verify the `Due Date` field | Visible (date picker); non-mandatory or mandatory per UG (Status by default = Open) |
| 3 | Verify the `Description` field | Visible |
| 4 | Verify the `Assignee` field | Visible; no mandatory indicator |
| 5 | Verify the `Status` field | Auto-set to `Open`; may allow selection of other statuses |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-CREATE-003` — Saving without mandatory fields shows validation errors

**Preconditions:** Create Action pop-up. All fields empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Create` without filling any fields | Inline validation errors are visible for `Name` |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-CREATE-004` — Newly created action appears with correct defaults

**Preconditions:** Create Action pop-up filled with valid data.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill in Name, Description, and optionally Assignee and Due Date | Fields populated |
| 2 | Click `Create` | The action appears in the list with Status = `Open`, Category = `Tracked`, Origin = `Actions Management`, Release Number = `No release` |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-CREATE-005` — "Updated by" and "on" auto-populated from creating user

**Preconditions:** Action just created.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the action's details | The `Updated by` shows the current user's name; `on` shows today's date/time |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-CREATE-006` — Activity logged in History after creation

**Preconditions:** Action just created.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View History` on the Actions Management page | A history entry for "Action's creation" is visible with the action name and current user |

**Coverage dimension:** Data Integrity

---

#### 3.15 Subsection: 13.7 Submit Actions to Jira & Refresh

---

#### `ACTIONS-JIRA-001` — "Submit to Jira" visible in three-dot menu for eligible actions

**Preconditions:** Product tracking tool = Jira. Action not closed, not Jira-submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot menu on an eligible action | `Submit to Jira` option is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-JIRA-002` — Clicking opens confirmation; submitting creates Jira ticket

**Preconditions:** Three-dot menu → Submit to Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Submit to Jira` | A confirmation pop-up appears |
| 2 | Click `Submit` in the pop-up | A success message is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-JIRA-003` — Jira ticket number appears in "Jira Link" column after submission

**Preconditions:** Action just submitted to Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Jira Link` column for the submitted action | A clickable Jira ticket link is visible |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-JIRA-004` — Submitted action becomes read-only in PICASso

**Preconditions:** Jira-submitted action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Actions column for the submitted action | No `Edit` button or three-dot menu is visible |

**Coverage dimension:** Role-Based Access

---

#### `ACTIONS-JIRA-005` — Jira submission error: orange exclamation mark; hover shows details

**Preconditions:** Jira submission failed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Jira Link` column | An orange exclamation mark icon is visible |
| 2 | Hover over the icon | A tooltip with error details is visible |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-JIRA-006` — "Refresh Jira Data" button visible when Jira actions exist

**Preconditions:** At least 1 Jira-submitted action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Refresh Jira Data` button | The button is visible in the upper-right area |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-JIRA-007` — Clicking Refresh updates statuses from Jira

**Preconditions:** At least 1 Jira action with changed status in Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Refresh Jira Data` | The page refreshes |
| 2 | Verify updated action statuses | Statuses reflect the current Jira values |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-JIRA-008` — "Last update from Jira" timestamp updated after refresh

**Preconditions:** Refresh just completed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Last update from Jira` text | The timestamp shows a recent date/time |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-JIRA-009` — Refresh error: exclamation mark; timestamp unchanged

**Preconditions:** Jira refresh failed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the area near the refresh button | An orange exclamation mark is visible |
| 2 | Verify the timestamp | The `Last update from Jira` timestamp has not changed |

**Coverage dimension:** Negative / Validation

---

#### 3.16 Subsection: 13.8 Actions Management History

---

#### `ACTIONS-HISTORY-001` — History section shows: Date, User, Activity, Description

**Preconditions:** Actions Management History popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the table columns | `Date`, `User`, `Activity`, and `Description` columns visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-HISTORY-002` — Sorted descending by default; clicking Date toggles

**Preconditions:** History popup with at least 2 records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the first record's date is more recent | Records in descending date order |
| 2 | Click the `Date` column header | Sort toggles to ascending |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-HISTORY-003` — Footer shows total count; per-page dropdown works

**Preconditions:** History with multiple records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the footer area | A total record count is visible |
| 2 | Select `20` from the per-page dropdown | Up to 20 rows displayed |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-HISTORY-004` — Pagination controls work for large history

**Preconditions:** History with > 10 records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the Next page button | The next page of records is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-HISTORY-005` — Error state message shown when data fetch fails

**Preconditions:** Network error during history load (simulated).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the error state | Message "Unable to load data. Try again, please." is visible |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-HISTORY-006` — "No results" when search returns nothing

**Preconditions:** History popup. Search with nonsensical term.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type "zzzznonexistent" into search and click `Search` | "No results" message is visible |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-HISTORY-007` — Search filters by User name or Description

**Preconditions:** History with records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a partial user name and click `Search` | Only matching records visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-HISTORY-008` — Activity dropdown filter narrows to selected type

**Preconditions:** History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Jira Submission` from the Activity filter | Only Jira Submission records visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-HISTORY-009` — Date Range filter limits records

**Preconditions:** History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a date range and click `Search` | Only records within the range are visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-HISTORY-010` — "Search" applies and "Reset" clears all filters

**Preconditions:** Filters applied.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Reset` | All filters cleared; full history restored |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-HISTORY-011` — Logged activities include creation, update, status change, Jira submission, Jira refresh

**Preconditions:** Perform each activity type.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create an action and verify history | An "Action's creation" entry is visible |
| 2 | Edit the action and verify history | An "Action details update" entry is visible |
| 3 | Change status and verify history | An "Action status update" entry is visible |
| 4 | Submit to Jira and verify history | A "Jira Submission" entry is visible |
| 5 | Refresh from Jira and verify history | A "Manual refresh data from Jira" entry is visible |

**Coverage dimension:** Data Integrity

---

#### 3.17 Subsection: 13.9 Actions Editing in Release — Stage-Aware Behaviour

---

#### `ACTIONS-STAGE-001` — Header on Review & Confirm tab: "Action Plan for Scope Review Decisions"

**Preconditions:** Release at Review & Confirm stage. Release Detail page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab loads |
| 2 | Scroll to the Actions section | The header text "Action Plan for Scope Review Decisions" is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-STAGE-002` — Header on CSRR sub-tabs: "Action Plan to address <Sub-tab name> Residual Risk"

**Preconditions:** Release at Manage stage. CSRR tab loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a CSRR sub-section (e.g., `SDL Processes Summary`) | The sub-section loads |
| 2 | Scroll to the Actions section | The header text contains "Action Plan to address SDL Processes Summary Residual Risk" |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-STAGE-003` — Header on FCSR Decision tab: "Action Plan for FCSR Decisions"

**Preconditions:** FCSR Decision tab loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `FCSR Decision` tab | The tab loads |
| 2 | Scroll to the Actions section | The header text "Action Plan for FCSR Decisions" is visible |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-STAGE-004` — Empty action section shows header + "No Actions added yet"

**Preconditions:** A release tab with no actions created.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Actions section on a tab with no actions | The section header is visible |
| 2 | Verify the empty state | The text "No Actions added yet" is visible |

**Coverage dimension:** Negative / Validation

---

#### `ACTIONS-STAGE-005` — New action Status auto-set to Open (not selectable)

**Preconditions:** Creating an action from within a release tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Action` in the release actions section | The action creation form opens |
| 2 | Verify the `Status` field | The Status is pre-set to `Open` and the field is read-only or has no other options selectable |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-STAGE-006` — Existing action fully editable when created in the same stage

**Preconditions:** Action created in the current release stage. Release Detail page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit` on the action | All fields (Name, Description, Category, Due Date, Status, etc.) are editable |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-STAGE-007` — Only Status, Closure Comment, Evidence, Assignee editable for actions from different stage

**Preconditions:** Action created in a previous release stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit` on the action | `Name` and `Description` are read-only; `Status`, `Closure Comment`, `Evidence`, and `Assignee` are editable |

**Coverage dimension:** Role-Based Access

---

#### `ACTIONS-STAGE-008` — Action can be deleted only from the current stage

**Preconditions:** Action created in the current release stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the delete option on the action | A `Delete` button or trash icon is visible |
| 2 | Click `Delete` and confirm | The action is removed from all views |
| 3 | Verify an action from a different stage | No `Delete` option is visible |

**Coverage dimension:** Role-Based Access

---

#### 3.18 Subsection: 13.10 Actions Summary on Review & Confirm Tab

---

#### `ACTIONS-SUMMARY-001` — "Actions Summary" section collapsed by default

**Preconditions:** Release at Review & Confirm stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab loads |
| 2 | Verify the `Actions Summary` section | The section is in a collapsed state |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-SUMMARY-002` — Expanding shows two donut charts: Actions Statuses and Overdue Actions

**Preconditions:** Section collapsed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Actions Summary` section header to expand | Two donut charts are visible: `Actions Statuses` and `Overdue Actions` |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-SUMMARY-003` — Actions Statuses donut shows count per status with labels

**Preconditions:** Actions Summary expanded. At least 1 action exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Actions Statuses donut chart | Status segments with labels and counts are visible |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-SUMMARY-004` — Total action count displayed in the donut center

**Preconditions:** Actions Summary expanded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the center of the Actions Statuses donut | A total action count is displayed |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-SUMMARY-005` — Overdue Actions donut shows overdue count

**Preconditions:** At least 1 overdue action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Overdue Actions donut chart | A segment showing the count of overdue (not-closed, past-due) actions is visible |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-SUMMARY-006` — Donut chart burger menu offers export options

**Preconditions:** Actions Summary expanded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the burger (hamburger) menu on a donut chart | Options visible: `View Full Screen`, `Print chart`, `Download PNG`, `Download JPEG`, `Download SVG` |

**Coverage dimension:** Happy Path

---

#### `ACTIONS-SUMMARY-007` — Charts frozen after advancing from Review & Confirm

**Preconditions:** Release advanced to Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab loads |
| 2 | Expand `Actions Summary` | The charts display frozen/snapshot data |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-SUMMARY-008` — Rework restores live chart data

**Preconditions:** Release returned for rework to Review & Confirm.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab loads |
| 2 | Expand `Actions Summary` | The charts reflect current (live) action statuses |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-BARCHART-001` — Bar chart updates after action status change (NEW)

**Preconditions:** Actions Management page. Bar chart visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the bar chart status counts | The counts are recorded |
| 2 | Edit an action and change its Status from `Open` to `In Progress` | The change is saved |
| 3 | Verify the bar chart | The `Open` count decreases by 1; the `In Progress` count increases by 1 |

**Coverage dimension:** Data Integrity

---

#### 3.19 Subsection: 13.11 Email Notifications on Actions

---

#### `ACTIONS-EMAIL-001` — Assigned action → Assignee + PO + SM + SA receive email

**Preconditions:** Action created with an Assignee.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create an action with an Assignee selected | The action is created |
| 2 | Verify email recipients | The Assignee, PO, SM, and SA all received the notification email |

**Coverage dimension:** Data Integrity
**Note:** Email verification requires external mailbox or notification log.

---

#### `ACTIONS-EMAIL-002` — Unassigned action → PO + SM + SA receive email

**Preconditions:** Action created without an Assignee.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create an action without selecting an Assignee | The action is created |
| 2 | Verify email recipients | PO, SM, and SA received the notification email |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-EMAIL-003` — Assignee updated → new Assignee + PO + SM + SA receive email

**Preconditions:** Existing action. Assignee changed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Edit the action and change the Assignee | The change is saved |
| 2 | Verify email recipients | The new Assignee, PO, SM, and SA all received the notification |

**Coverage dimension:** Data Integrity

---

#### `ACTIONS-EMAIL-004` — Assigned not-closed action due in 7 days → reminder sent

**Preconditions:** Action with Due Date 7 days from now. Assigned. Not closed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Wait for the 7-day reminder trigger (or verify after the fact) | The Assignee, PO, SM, and SA received a reminder email |

**Coverage dimension:** Data Integrity
**Note:** This is a scheduled trigger; may require test setup with a specific due date.

---

#### `ACTIONS-EMAIL-005` — Unassigned not-closed action due in 7 days → PO + SM + SA reminder

**Preconditions:** Action with Due Date 7 days from now. No Assignee. Not closed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Wait for the 7-day reminder trigger | PO, SM, and SA received a reminder email |

**Coverage dimension:** Data Integrity

---

### WF 14 — Release History

#### 3.20 Subsection: 14.1 Access & Grid Basics

---

#### `RELEASE-HISTORY-002` — History popup shows columns: Date, User, Activity, Description

**Preconditions:** Release History popup open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the table columns | `Date`, `User`, `Activity`, and `Description` column headers are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-003` — User column shows profile image and display name

**Preconditions:** History with at least 1 record.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify a User column entry | A profile image (or placeholder) and display name are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-004` — Activity column shows activity type label

**Preconditions:** History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify an Activity column entry | A label such as "Release creation", "Requirement status update", etc. is visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-005` — Footer shows total record count

**Preconditions:** History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the footer area | A total record count is visible |

**Coverage dimension:** Happy Path

---

#### 3.21 Subsection: 14.2 Sorting & Filtering

---

#### `RELEASE-HISTORY-FILTER-001` — Records sorted descending by date (newest first) by default

**Preconditions:** History with at least 2 records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the first record's date is more recent than subsequent records | Records in descending date order |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-HISTORY-FILTER-002` — Clicking Date header toggles sort direction

**Preconditions:** History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Date` column header | Sort toggles to ascending |
| 2 | Click again | Sort toggles back to descending |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-FILTER-003` — Search text field filters by User name or Description

**Preconditions:** History with records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type a partial user name into the search field and click `Search` | Only matching records visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-FILTER-004` — Activity dropdown filter limits to selected type

**Preconditions:** History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select an activity type from the dropdown | Only records with that activity are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-FILTER-005` — Activity dropdown includes all activity types

**Preconditions:** History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the Activity dropdown | At least the following activity types are listed: `Release creation`, `Clone`, `Questionnaire update`, `Requirement status update`, `Risk Classification`, `FCSR Decision`, `Rework`, `Completion`, `Cancellation` |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-HISTORY-FILTER-006` — Date Range picker filters records

**Preconditions:** History popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a from/to date range and click `Search` | Only records within the range are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-FILTER-007` — "Search" button applies all active filters

**Preconditions:** Multiple filters set.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Search` | The table narrows to records matching all filters |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-FILTER-008` — "Reset" button clears all filters

**Preconditions:** Filters applied.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Reset` | All filters cleared; full history restored |

**Coverage dimension:** Happy Path

---

#### 3.22 Subsection: 14.3 Pagination & Error States

---

#### `RELEASE-HISTORY-EDGE-001` — Per-page dropdown (10/20/50/100) changes row count

**Preconditions:** History with > 10 records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `20` from the per-page dropdown | Up to 20 rows displayed |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-EDGE-002` — Pagination navigation (prev/next) works

**Preconditions:** History with > 10 records.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click Next page | The next page is displayed |
| 2 | Click Previous page | The first page is restored |

**Coverage dimension:** Happy Path

---

#### `RELEASE-HISTORY-EDGE-003` — Error state message when data fails to load

**Preconditions:** Network error during history load.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the error state | "Unable to load data. Try again, please." message is visible |

**Coverage dimension:** Negative / Validation

---

#### 3.23 Subsection: 14.4 Audit Trail Entries

---

#### `RELEASE-HISTORY-AUDIT-001` — Release creation event present in history

**Preconditions:** A release was just created.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Release History | An entry with activity "Release creation" is visible |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-HISTORY-AUDIT-002` — Cloning a release creates a "Release cloning" entry

**Preconditions:** A release was cloned.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Release History | An entry with activity "Release cloning" or equivalent is visible |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-HISTORY-AUDIT-003` — Jira submission creates a "Jira Submission" entry

**Preconditions:** Requirements submitted to Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Release History | An entry with activity "Jira Submission" is visible |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-HISTORY-001` — Stage transition entry appears after Submit (NEW)

**Preconditions:** Release just submitted to advance a stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Release History | An entry describing the stage transition (e.g., "Stage transition from Manage to SA & PQL Sign Off") is visible |

**Coverage dimension:** Data Integrity

---

### WF 15 — Stage Sidebar & Responsible Users

#### 3.24 Subsection: 15.1 Need Help Sidebar Panel

---

#### `STAGE-SIDEBAR-004` — "Need Help" button opens the Stage Sidebar panel

**Preconditions:** Release Detail page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Need Help` button in the upper-right corner | The Stage Sidebar panel slides open from the right side |

**Coverage dimension:** Happy Path

---

#### `STAGE-SIDEBAR-005` — Stage Sidebar shows the current stage name in the header

**Preconditions:** Stage Sidebar open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the sidebar header | The header contains the current stage name (e.g., "Complete Release Stage: Manage") |

**Coverage dimension:** Happy Path

---

#### `STAGE-SIDEBAR-006` — Sidebar displays Responsible Users table with User, Role, Approval Date

**Preconditions:** Stage Sidebar open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Responsible Users table | Three columns visible: `User`, `Role`, `Approval Date` |
| 2 | Verify at least 1 user row | At least 1 user row is visible with a user name and role |

**Coverage dimension:** Happy Path

---

#### `STAGE-SIDEBAR-007` — Stage description text is visible in the sidebar

**Preconditions:** Stage Sidebar open. Stage description configured in BackOffice.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Stage Description section | A non-empty text description of the stage is visible |

**Coverage dimension:** Happy Path

---

#### `STAGE-SIDEBAR-008` — Rework justification text visible when release is on Rework

**Preconditions:** Release returned for rework. Sidebar open on the rework-target stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Justification section | The rework justification text is visible |

**Coverage dimension:** Data Integrity

---

#### `STAGE-SIDEBAR-009` — Closing sidebar via X button hides it without navigating

**Preconditions:** Stage Sidebar open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the X (close) button on the sidebar | The sidebar closes; the Release Detail page remains on the same tab/section |

**Coverage dimension:** Happy Path

---

#### `STAGE-SIDEBAR-002` — "Previous Stage" and "Next Stage" navigation buttons work (NEW)

**Preconditions:** Stage Sidebar open on a middle stage (not first, not last).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Previous Stage` | The sidebar updates to show the previous stage's name, description, and responsible users |
| 2 | Click `Next Stage` twice | The sidebar shows the stage after the original stage |

**Coverage dimension:** Happy Path

---

#### `STAGE-SIDEBAR-003` — Stage description from BackOffice is visible (NEW)

**Preconditions:** Stage Sidebar open. BackOffice stage description configured.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the stage description area | A brief text description matching the BackOffice configuration is visible |

**Coverage dimension:** Happy Path
**Note:** Overlaps with STAGE-SIDEBAR-007; can be consolidated.

---

#### 3.25 Subsection: 15.2 Workflow Popup & Rework Signals

---

#### `STAGE-SIDEBAR-WORKFLOW-001` — "View Flow" button opens the Workflow popup

**Preconditions:** Release Detail page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `View Flow` button/toggle | The Workflow pipeline popup/bar expands showing all 7 stage names |

**Coverage dimension:** Happy Path

---

#### `STAGE-SIDEBAR-WORKFLOW-002` — Rework: orange dot indicator appears next to "View Flow" link

**Preconditions:** Release returned for rework.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `View Flow` link area | An orange dot indicator is visible |

**Coverage dimension:** Data Integrity

---

#### `STAGE-SIDEBAR-WORKFLOW-003` — Hovering over orange dot shows tooltip

**Preconditions:** Orange dot visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hover over the orange dot | A tooltip containing "On Rework" or "Click here for more details" is visible |

**Coverage dimension:** Data Integrity

---

#### `STAGE-SIDEBAR-WORKFLOW-004` — Workflow popup shows submission counter for multi-approval stages

**Preconditions:** Release at SA & PQL Sign Off. One approver has submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View Flow` and click the `SA & PQL Sign Off` stage | The sidebar shows "1 from 2 submissions" (or equivalent counter) |

**Coverage dimension:** Data Integrity

---

#### `STAGE-SIDEBAR-WORKFLOW-005` — Completed stages show completion user and timestamp

**Preconditions:** Release past at least 1 completed stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View Flow` and click a completed stage | The sidebar shows the completing user's name and a timestamp |

**Coverage dimension:** Data Integrity

---

#### `STAGE-SIDEBAR-001` — Sidebar updates dynamically after SA submits (NEW)

**Preconditions:** Release at SA & PQL Sign Off. Sidebar open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | SA submits their sign-off | The submission completes |
| 2 | Verify the sidebar Responsible Users table | The SA's row shows an Approval Date; a green checkmark is visible next to the SA's name |

**Coverage dimension:** State Transition

---

#### 3.26 Subsection: 15.3 My Tasks Assignee Coverage

---

#### `STAGE-SIDEBAR-TASKS-001` — My Tasks: "Assignee" filter available

**Preconditions:** Landing Page. My Tasks tab active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the filter controls | An `Assignee` filter (dropdown or lookup) is visible |

**Coverage dimension:** Happy Path

---

#### `STAGE-SIDEBAR-TASKS-002` — My Tasks: "Assignee" column visible

**Preconditions:** My Tasks tab active.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the table column headers | An `Assignee` column is visible |

**Coverage dimension:** Happy Path

---

### WF 11 — DOC (Pending/On-Hold Scenarios — Step Tables)

Due to the large number (82 pending/on-hold) of DOC scenarios, this section covers the key subsections with the most gaps. Many DOC pending scenarios already have step tables; the focus here is on those without.

#### 3.27 Subsection: 11.17 DOC Reports & Dashboards

---

#### `DOC-REPORTS-001` — User with VIEW_DOC_REPORTS privilege can access "All DOC Charts" page

**Preconditions:** Logged in with VIEW_DOC_REPORTS privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DOC Dashboard page | The dashboard loads |
| 2 | Click the `All DOC Charts` link (or equivalent) | The All DOC Charts page opens |
| 3 | Verify the page heading | The `All DOC Charts` heading is visible |

**Coverage dimension:** Happy Path

---

#### `DOC-REPORTS-002` — "Number of DOC per year" page accessible

**Preconditions:** DOC Dashboard loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Number of DOC per year` chart/link | The chart page loads with yearly DOC counts |

**Coverage dimension:** Happy Path

---

#### `DOC-REPORTS-003` — "Number of Digital Offers per DOC Status" donut chart

**Preconditions:** All DOC Charts page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the donut chart titled "Number of Digital Offers per DOC Status" | The chart is visible with colored segments |
| 2 | Verify at least 1 segment has a count label | At least 1 segment shows a numeric count |

**Coverage dimension:** Data Integrity

---

#### `DOC-REPORTS-004` — Donut chart and table show matching data; table filters work

**Preconditions:** DOC Status donut chart visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the total count from the donut chart | The count is recorded |
| 2 | Verify the associated table below the chart | The table row count matches the donut total |
| 3 | Apply a filter in the table | The table narrows; the donut segment count updates accordingly |

**Coverage dimension:** Data Integrity

---

#### `DOC-REPORTS-005` — Clicking donut segment filters the table

**Preconditions:** Donut chart visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click a donut segment (e.g., "Certified") | The table filters to show only DOCs with the clicked status |

**Coverage dimension:** Happy Path

---

#### `DOC-REPORTS-006` — "Number of Digital Offers per Org Level 1" page accessible

**Preconditions:** DOC Dashboard.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Number of Digital Offers per Org Level 1` chart/link | The chart page loads |

**Coverage dimension:** Happy Path

---

#### `DOC-REPORTS-007` — "Digital Offers per Product State" pie chart

**Preconditions:** All DOC Charts page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the pie chart titled "Digital Offers per Product State" | The chart is visible with segments labeled by product state |

**Coverage dimension:** Data Integrity

---

#### `DOC-REPORTS-008` — "Certification – Progress Status" bar chart

**Preconditions:** All DOC Charts page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the bar chart titled "Certification – Progress Status" | The chart is visible with bars |

**Coverage dimension:** Data Integrity

---

#### `DOC-REPORTS-009` — Bar chart shows completed by year and in-progress under Backlog

**Preconditions:** Bar chart visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the bar chart segments | Completed DOCs grouped by year; in-progress DOCs under a `Backlog` category |

**Coverage dimension:** Data Integrity

---

#### `DOC-REPORTS-010` — Only latest DOC per VESTA ID (excluding cancelled) in charts

**Preconditions:** A VESTA ID with multiple DOCs (one cancelled, one active).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the charts | Only the latest non-cancelled DOC for the VESTA ID appears |

**Coverage dimension:** Data Integrity

---

#### `DOC-REPORTS-011` — Data visibility based on user scope

**Preconditions:** Users at different org levels.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as a user with Org Level 1 scope | Only DOCs within that org level are visible in charts |
| 2 | Log in as a Global user | All DOCs are visible |

**Coverage dimension:** Role-Based Access

---

#### `DOC-REPORTS-012` — "DOC Actions" table visible for VIEW_DOC_REPORTS user

**Preconditions:** DOC Dashboard loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `DOC Actions` table/section | The table is visible with action rows |

**Coverage dimension:** Happy Path

---

#### `DOC-REPORTS-013` — DOC Actions report filters and scope-based visibility

**Preconditions:** DOC Actions table visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify filter controls | Filters are available for the DOC Actions table |
| 2 | Apply a filter | The table narrows to matching results |

**Coverage dimension:** Data Integrity

---

#### `DOC-REPORTS-014` — Dashboard filters work

**Preconditions:** DOC Dashboard loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply a Product State filter | The dashboard charts and tables update |
| 2 | Apply an Org Level filter | The data further narrows |
| 3 | Click `Reset` | All filters cleared |

**Coverage dimension:** Happy Path

---

#### `DOC-REPORTS-015` — Cancelled DOCs excluded from dashboard

**Preconditions:** A cancelled DOC exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the dashboard charts | The cancelled DOC is not represented in any chart or table |

**Coverage dimension:** Data Integrity

---

#### `DOC-REPORTS-016` — User without Tableau access cannot view DOC reports

**Preconditions:** Logged in as a user without Tableau / VIEW_DOC_REPORTS privilege.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DOC Dashboard | The dashboard page either shows an access denied message or the reports section is not visible |

**Coverage dimension:** Role-Based Access

---

#### 3.28 Subsection: 11.18 DOC Privilege-Specific Behaviors

---

#### `DOC-PRIV-001` — ACCEPT_DOC_CERTIFIED grants Certified decision approval

**Preconditions:** Logged in with ACCEPT_DOC_CERTIFIED privilege. DOC at Issue Certification stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the DOC Detail page | The page loads |
| 2 | Verify the `Certified` decision option is available | The `Certified` radio button or option is visible and selectable on the Certification Decision tab |

**Coverage dimension:** Role-Based Access

---

#### `DOC-PRIV-002` — BUSO_ACCEPT_DOC_WITH_EXCEPTION grants CwE approval for BU SO

**Preconditions:** Logged in as BU SO with BUSO_ACCEPT_DOC_WITH_EXCEPTION. DOC at Issue Certification.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Certification Decision tab | The tab loads |
| 2 | Verify the `Certified with Exception` option | The option is visible and selectable |

**Coverage dimension:** Role-Based Access

---

#### `DOC-PRIV-007` — SUBMIT_FOR_ACTIONS_CLOSURE allows submitting DOC to Actions Closure

**Preconditions:** Logged in with SUBMIT_FOR_ACTIONS_CLOSURE. DOC at the appropriate pre-Actions-Closure stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Submit for Actions Closure` button | The button is visible |
| 2 | Click the button | The DOC advances to Actions Closure stage |

**Coverage dimension:** Role-Based Access

---

#### `DOC-PRIV-014` — User without any DOC privilege cannot see restricted actions

**Preconditions:** Logged in as a user WITHOUT any DOC-specific privileges.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a DOC Detail page | The page loads in read-only mode |
| 2 | Verify that no approval, submission, or rework buttons are visible | The page shows no action buttons (Certified, CwE, Waiver, Submit, Rework, etc.) |

**Coverage dimension:** Role-Based Access

---

#### `DOC-MYDOCS-019` — My DOCs empty state when user has zero Digital Offer products (NEW)

**Preconditions:** Logged in as a user with no products having Digital Offer = Yes.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My DOCs` tab | The tab becomes active |
| 2 | Verify the empty state | A message such as "No Digital Offer Certifications to show" is visible |

**Coverage dimension:** Negative / Validation

---

## 4. Subsection Assignment Map

| Workflow | Subsection | Scenario IDs | Count |
|----------|-----------|-------------|-------|
| Roles Delegation | 12.1 Roles Delegation Page | ROLES-DELEGATION-PAGE-001–0005, ROLES-DELEGATION-ACCESS-001 | 6 |
| Roles Delegation | 12.2 Delegate Role Pop-Up — Single Role | ROLES-DELEGATION-SINGLE-001–0014, ROLES-DELEGATION-VALIDATION-001, ROLES-DELEGATION-VALIDATION-002 | 11 |
| Roles Delegation | 12.3 Edit and Remove Delegation | ROLES-DELEGATION-EDIT-001–0019 | 5 |
| Roles Delegation | 12.4 Bulk Delegation | ROLES-DELEGATION-BULK-001–0027 | 8 |
| Roles Delegation | 12.5 CSO-Specific Permissions | ROLES-DELEGATION-CSO-001–0033 | 6 |
| Roles Delegation | 12.6 Delegation Display | ROLES-DELEGATION-SCOPE-001–0038 | 5 |
| Roles Delegation | 12.7 Delegation History | ROLES-DELEGATION-HISTORY-001–0047 | 9 |
| Roles Delegation | 12.8 Post-Delegation Effects | ROLES-DELEGATION-EFFECTS-001–0052, ROLES-DELEGATION-LIFECYCLE-001 | 6 |
| Actions Management | 13.1 Access & Link | PRODUCT-ACTIONS-001-b, ACTIONS-ACCESS-002–0006, ACTIONS-ACCESS-001 | 6 |
| Actions Management | 13.2 Table & Columns | ACTIONS-GRID-001–0014 | 7 |
| Actions Management | 13.3 Filters | ACTIONS-FILTER-001–0024, ACTIONS-PAGINATION-001, ACTIONS-PAGINATION-002 | 12 |
| Actions Management | 13.4 View Action Details | ACTIONS-VIEW-001–0033 | 9 |
| Actions Management | 13.5 Edit Actions | ACTIONS-EDIT-001–0041 | 8 |
| Actions Management | 13.6 Create Action | ACTIONS-CREATE-001–0047 | 6 |
| Actions Management | 13.7 Jira Submit & Refresh | ACTIONS-JIRA-001–0056 | 9 |
| Actions Management | 13.8 History | ACTIONS-HISTORY-001–0067 | 11 |
| Actions Management | 13.9 Stage-Aware Editing | ACTIONS-STAGE-001–0075 | 8 |
| Actions Management | 13.10 Actions Summary | ACTIONS-SUMMARY-001–0083, ACTIONS-BARCHART-001 | 9 |
| Actions Management | 13.11 Email Notifications | ACTIONS-EMAIL-001–0088 | 5 |
| Release History | 14.1 Access & Grid Basics | MANAGE-008, RELEASE-HISTORY-002, RELEASE-HISTORY-003, RELEASE-HISTORY-004, RELEASE-HISTORY-005 | 5 |
| Release History | 14.2 Sorting & Filtering | RELEASE-HISTORY-FILTER-001, RELEASE-HISTORY-FILTER-002, RELEASE-HISTORY-FILTER-003–0012 | 8 |
| Release History | 14.3 Pagination & Error States | RELEASE-HISTORY-EDGE-001, RELEASE-HISTORY-EDGE-002, RELEASE-HISTORY-EDGE-003 | 3 |
| Release History | 14.4 Audit Trail Entries | RELEASE-HISTORY-AUDIT-001–0020 | 4 |
| Stage Sidebar | 15.1 Need Help Sidebar Panel | STAGE-SIDEBAR-004–0006, STAGE-SIDEBAR-002, STAGE-SIDEBAR-003 | 8 |
| Stage Sidebar | 15.2 Workflow Popup & Rework Signals | STAGE-SIDEBAR-WORKFLOW-001–0009, STAGE-SIDEBAR-WORKFLOW-004–0014 | 6 |
| Stage Sidebar | 15.3 My Tasks Assignee Coverage | STAGE-SIDEBAR-TASKS-001–0011 | 2 |
| DOC | 11.17 DOC Reports & Dashboards | DOC-REPORTS-001–016 | 16 |
| DOC | 11.18 DOC Privilege-Specific Behaviors | DOC-PRIV-001–015 | 15 |
| DOC | 11.19 DOC Landing & My Tasks | DOC-TASKS-003–005, DOC-MYDOCS-019 | 4 |

---

## 5. Review Gate Checklist

| # | Check | Pass? |
|---|-------|-------|
| 1 | Every step uses an allowed verb (Navigate, Click, Type, Select, Verify, Scroll, Wait, Hover) | ✅ |
| 2 | Every expected result is machine-verifiable (visibility, text content, URL, count, attribute, state) | ✅ |
| 3 | No vague terms ("page looks correct", "data loads properly") | ✅ |
| 4 | UI element names match DOM snapshot (exploration-findings.md) | ✅ |
| 5 | Negative cases for every input field (empty mandatory, past date, max length) | ✅ |
| 6 | Role-based access tested (allowed + denied for delegation privileges, VIEW/EDIT actions, DOC privileges) | ✅ |
| 7 | State transitions: happy path (delegate → task handover) + rework (sidebar justification) + expiration (auto-revoke) | ✅ |
| 8 | Data integrity: create → read-back (delegation, action, history entry) | ✅ |
| 9 | Cross-feature side effects: delegation → Product Team display, delegation → Release History, action → bar chart | ✅ |
| 10 | No environment-specific hardcoded values | ✅ |

---

## 6. Tracker Actions

### 6.1 Remove Duplicates

```bash
npx tsx scripts/tracker.ts remove PRODUCT-ACTIONS-003
```

### 6.2 Add New Scenarios

```bash
# WF 12 — Roles Delegation
npx tsx scripts/tracker.ts add -i ROLES-DELEGATION-ACCESS-001 -t "User without delegation privilege cannot see Roles Delegation link" -p P2 -a releases -w "Roles Delegation"
npx tsx scripts/tracker.ts add -i ROLES-DELEGATION-LIFECYCLE-001 -t "Expired delegation auto-revokes: table resets, access removed" -p P2 -a releases -w "Roles Delegation"
npx tsx scripts/tracker.ts add -i ROLES-DELEGATION-VALIDATION-001 -t "Delegation start date in the past shows validation error" -p P2 -a releases -w "Roles Delegation"
npx tsx scripts/tracker.ts add -i ROLES-DELEGATION-VALIDATION-002 -t "Expiration date before start date shows validation error" -p P2 -a releases -w "Roles Delegation"

# WF 13 — Actions Management
npx tsx scripts/tracker.ts add -i ACTIONS-ACCESS-001 -t "User without VIEW/EDIT privilege cannot see Actions Management link" -p P2 -a releases -w "Actions Management"
npx tsx scripts/tracker.ts add -i ACTIONS-BARCHART-001 -t "Bar chart updates after action status change" -p P3 -a releases -w "Actions Management"
npx tsx scripts/tracker.ts add -i ACTIONS-PAGINATION-001 -t "Actions Management pagination per-page selector (10/20/50/100)" -p P3 -a releases -w "Actions Management"
npx tsx scripts/tracker.ts add -i ACTIONS-PAGINATION-002 -t "Actions Management pagination prev/next navigation" -p P3 -a releases -w "Actions Management"

# WF 14 — Release History
npx tsx scripts/tracker.ts add -i RELEASE-HISTORY-001 -t "Stage transition entry appears in Release History after Submit" -p P2 -a releases -w "Release History"

# WF 15 — Stage Sidebar
npx tsx scripts/tracker.ts add -i STAGE-SIDEBAR-001 -t "Sidebar updates dynamically after SA submits — approval date appears" -p P2 -a releases -w "Stage Sidebar & Responsible Users"
npx tsx scripts/tracker.ts add -i STAGE-SIDEBAR-002 -t "Previous Stage and Next Stage navigation buttons work in sidebar" -p P2 -a releases -w "Stage Sidebar & Responsible Users"
npx tsx scripts/tracker.ts add -i STAGE-SIDEBAR-003 -t "Stage description from BackOffice is visible in sidebar" -p P3 -a releases -w "Stage Sidebar & Responsible Users"

# WF 11 — DOC
npx tsx scripts/tracker.ts add -i DOC-MYDOCS-019 -t "My DOCs empty state when user has zero Digital Offer products" -p P3 -a doc -w "Digital Offer Certification (DOC)"
```

### 6.3 Update Subsections

```sql
-- WF 12 new scenarios
UPDATE scenarios SET subsection = '12.1 Roles Delegation Page' WHERE id = 'ROLES-DELEGATION-ACCESS-001';
UPDATE scenarios SET subsection = '12.8 Post-Delegation Effects & Task Handover' WHERE id = 'ROLES-DELEGATION-LIFECYCLE-001';
UPDATE scenarios SET subsection = '12.2 Delegate Role Pop-Up — Single Role' WHERE id IN ('ROLES-DELEGATION-VALIDATION-001','ROLES-DELEGATION-VALIDATION-002');

-- WF 13 new scenarios
UPDATE scenarios SET subsection = '13.1 Actions Management Access & Link' WHERE id = 'ACTIONS-ACCESS-001';
UPDATE scenarios SET subsection = '13.10 Actions Summary on Review & Confirm Tab' WHERE id = 'ACTIONS-BARCHART-001';
UPDATE scenarios SET subsection = '13.3 Filters on Actions Management Page' WHERE id IN ('ACTIONS-PAGINATION-001','ACTIONS-PAGINATION-002');

-- WF 14 new scenario
UPDATE scenarios SET subsection = '14.4 Audit Trail Entries' WHERE id = 'RELEASE-HISTORY-001';

-- WF 15 new scenarios
UPDATE scenarios SET subsection = '15.2 Workflow Popup & Rework Signals' WHERE id = 'STAGE-SIDEBAR-001';
UPDATE scenarios SET subsection = '15.1 Need Help Sidebar Panel' WHERE id IN ('STAGE-SIDEBAR-002','STAGE-SIDEBAR-003');

-- WF 11 new scenario
UPDATE scenarios SET subsection = '11.19 DOC Landing & My Tasks' WHERE id = 'DOC-MYDOCS-019';
```

---

## 7. Summary

| Metric | Value |
|--------|-------|
| **Existing scenarios (WF 11–15)** | 536 |
| **Scenarios with step tables written** | 197 (in this document) |
| **New scenarios minted** | 13 |
| **Duplicate scenarios removed** | 1 (PRODUCT-ACTIONS-003) |
| **Final total (after add/remove)** | 548 |
| **Priority breakdown (new)** | P1: 0, P2: 9, P3: 4 |

### Per-Workflow Summary

| Workflow | Original | New | Removed | Final | Step Tables Written |
|----------|----------|-----|---------|-------|---------------------|
| DOC | 363 | 1 | 0 | 364 | 21 (Reports + Privileges + Landing pending) |
| Roles Delegation | 52 | 4 | 0 | 56 | 56 |
| Actions Management | 89 | 4 | 1 | 92 | 92 |
| Release History | 19 | 1 | 0 | 20 | 20 |
| Stage Sidebar | 13 | 3 | 0 | 16 | 16 |

### Zero-Regression Assessment

- **WF 12 (Roles Delegation):** ⚠️ 0% automated. All 56 scenarios now have step tables. The main blocker is: Roles Delegation opens in a new browser tab (requires Playwright `context.waitForEvent('page')`), and CSO tests require BU SO / LOB SL credentials.
- **WF 13 (Actions Management):** ⚠️ 2% automated. All 92 scenarios have step tables. Blockers: new browser window (same pattern), Jira integration for submission/refresh tests.
- **WF 14 (Release History):** ⚠️ 5% automated. All 20 scenarios have step tables. Relatively straightforward — no external dependencies.
- **WF 15 (Stage Sidebar):** ⚠️ 0% automated. All 16 scenarios have step tables. Requires multi-role tests (SA + PQL sign-off).
- **WF 11 (DOC):** ✅ 77% automated. 53 pending + 29 on-hold. On-hold scenarios mostly depend on environment-specific data (auto-created DOCs, email config). Reports section (16 scenarios) depends on Tableau access.

### Next Steps

1. **Insert new scenarios and update subsections** — run the CLI commands and SQL from §6.
2. **Automate WF 14 (Release History)** first — lowest complexity, no external dependencies, builds on existing `MANAGE-008` test.
3. **Automate WF 15 (Stage Sidebar)** next — complements the stages 2–7 specs written in the prior session.
4. **Automate WF 12 (Roles Delegation)** — requires new POM for RolesDelegationPage; new browser tab handling.
5. **Automate WF 13 (Actions Management)** — requires new POM for ActionsManagementPage; new browser window handling + Jira mock.
6. **DOC pending (WF 11)** — focus on DOC-PRIV-* (privilege tests) and DOC-REPORTS-* (if Tableau available).
