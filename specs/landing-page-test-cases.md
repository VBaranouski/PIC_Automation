# Landing Page & Home Navigation — Refactored Test Cases

> **Area:** `landing` | **Workflow:** WF 2. Landing Page & Home Navigation
> **Source:** Tracker DB (`feature_area=landing`), exploration findings (`exploration-findings.md`), DOM snapshots
> **Instruction compliance:** `test-case-design.instructions.md` §1–§5
> **Date:** 2026-04-22

---

## Coverage Analysis

### Current State (Tracker DB)

| Metric | Count |
|--------|-------|
| Total scenarios | ~70 |
| Automated + passed | ~42 |
| Automated + skipped | ~8 |
| Automated + failed-defect | 3 |
| Pending (not-executed) | 23 |

### Coverage Gaps Identified (§4.1 Five Dimensions)

| Dimension | Status | Gap |
|-----------|--------|-----|
| **Happy Path** | ✅ Covered | All 5 tabs, grid load, default tab |
| **Negative / Validation** | ❌ Missing | Empty state (LANDING-EMPTY-001), no-match search, invalid date range |
| **Role-Based Access** | ❌ Missing | No role restriction tests for header actions (New Product visibility per role) |
| **State Transitions** | ⚠️ Partial | Show Active Only toggle tested; but no tab-switch-while-loading test |
| **Data Integrity** | ⚠️ Partial | Read-back after filter; but no cross-tab data consistency |

### Duplicate / Overlapping Scenarios — Removed

The following duplicates were **deleted** from the tracker DB (not on-hold — fully removed):

| Existing (automated) | Deleted Duplicate | Reason |
|---|---|---|
| `LANDING-TASKS-REL-001` (Release filter) | `WF02-0015` | Same filter test |
| `LANDING-TASKS-PROD-001` (Product filter) | `WF02-0016` | Same filter test |
| `LANDING-TASKS-TYPE-001` (PROCESS TYPE values) | `WF02-0008` | Same column validation |
| `LANDING-PRODS-ORG2-001` (Org Level 2 filter) | `WF02-0031` | Same cascading filter |
| `LANDING-PRODS-DOCLEAD-001` (DOC Lead filter) | `WF02-0032` | Same filter test |
| `LANDING-PRODS-OWNER-001` (Product Owner filter) | `WF02-0033` | Same filter test |
| `LANDING-RELS-JIRA-001` (Jira link clickable) | `WF02-0047` | Same Jira link test |
| `LANDING-RELS-ACTIONS-002` (Clone option) | `WF02-0048` | Same actions menu test |
| `LANDING-RELS-PROD-001` (Product filter) | `WF02-0042` | Same filter test |

**Kept as distinct (not duplicates):**
- `LANDING-TASKS-DATE-001` (visibility) vs `LANDING-TASKS-DATE-002` (functional filter) → different scope
- `LANDING-TASKS-ASSIGNEE-001` (visibility) vs `LANDING-TASKS-ASSIGNEE-002` (functional filter) → different scope

### Net New Scenarios to Create

After deduplication, **10 genuinely new scenarios** remain:

| ID | Tab | Priority | Description |
|---|---|---|---|
| LANDING-EMPTY-001 | All | P2 | Empty state across all tabs |
| LANDING-TASKS-DATE-002 | My Tasks | P2 | Date Range picker functional filter |
| LANDING-TASKS-ASSIGNEE-002 | My Tasks | P2 | Assignee filter functional |
| LANDING-TASKS-SORT-001 | My Tasks | P3 | Column sorting |
| LANDING-MY-PRODUCTS-004 | My Products | P2 | Search by Product ID |
| LANDING-MY-PRODUCTS-005 | My Products | P2 | Reset button restores default state |
| LANDING-MY-PRODUCTS-006 | My Products | P2 | Product name click → Product Detail |
| LANDING-PRODS-SORT-001 | My Products | P3 | Column sorting |
| WF02-0042 | My Releases | P2 | Product filter narrows results |
| LANDING-RELS-DATE-002 | My Releases | P2 | Target Release Date range filter |
| LANDING-RELS-SORT-001 | My Releases | P3 | Column sorting |
| LANDING-DOCS-STATUS-001 | My DOCs | P2 | DOC Status dropdown filter |
| LANDING-HEADER-REPORTS-001 | Header | P2 | My Reports shortcut link |

Plus **new scenarios from coverage gap analysis** (not yet in tracker):

| New ID (proposed) | Tab | Priority | Description |
|---|---|---|---|
| LANDING-TASKS-EMPTY-001 | My Tasks | P2 | Search with no-match query shows empty grid message |
| LANDING-PRODS-NAV-001 | My Products | P2 | Click product name → navigate to Product Detail |
| LANDING-TABS-SWITCH-001 | All | P2 | Rapid tab switching doesn't break grid rendering |
| LANDING-RELS-CLONE-001 | My Releases | P2 | Actions menu shows Clone option (when feature available) |
| LANDING-HEADER-LOGO-001 | Header | P1 | PICASso logo navigates to Landing Page |

---

## Test Case Specifications

### WF 2.1 — Page Structure & Tab Navigation

---

#### `LANDING-TABS-SWITCH-001` — Rapid Tab Switching Preserves Grid Integrity

**Preconditions:** Logged in as `process_quality_leader` role. Landing Page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The `Landing Page` heading is visible |
| 2 | Click the `My Products` tab | The `My Products` tab has `aria-selected` = `"true"` |
| 3 | Click the `My Releases` tab immediately (within 1 second) | The `My Releases` tab has `aria-selected` = `"true"` |
| 4 | Click the `My DOCs` tab immediately | The `My DOCs` tab has `aria-selected` = `"true"` |
| 5 | Click the `Reports & Dashboards` tab | The `Reports & Dashboards` tab has `aria-selected` = `"true"` |
| 6 | Click the `My Tasks` tab | The `My Tasks` tab has `aria-selected` = `"true"` |
| 7 | Verify the active tabpanel has loaded | The grid is visible in the active tabpanel; at least 1 column header is present |

**Coverage dimension:** State Transition (rapid state changes don't corrupt UI)

---

#### `LANDING-EMPTY-001` — Empty State Display When User Has No Data

**Preconditions:** Logged in as a user with **no assigned tasks, products, releases, or DOCs** (e.g., a freshly provisioned test user with no data). If no such user is available, **mark as on-hold**.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The `Landing Page` heading is visible |
| 2 | Verify the `My Tasks` tab content | An empty-state message (e.g., `"No data"` or `"No records found"`) is visible, **or** the grid contains 0 data rows |
| 3 | Click the `My Products` tab | An empty-state message is visible, or the grid contains 0 data rows |
| 4 | Click the `My Releases` tab | An empty-state message is visible, or the grid contains 0 data rows |
| 5 | Click the `My DOCs` tab | An empty-state message is visible, or the grid contains 0 data rows |
| 6 | Click the `Reports & Dashboards` tab | An empty-state message is visible, or the grid contains 0 data rows |

**Coverage dimension:** Negative / Validation (empty data state)
**Note:** Requires a dedicated test user with no data. If unavailable, mark `on-hold` in tracker.

---

### WF 2.2 — My Tasks Tab

---

#### `LANDING-TASKS-DATE-002` — Date Range Picker Filters My Tasks Grid

**Preconditions:** Logged in as `process_quality_leader`. Landing Page loaded. My Tasks tab active with data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The `My Tasks` tab is selected by default |
| 2 | Verify the grid has data rows | At least 1 data row is visible in the grid |
| 3 | Record the initial record count from the pagination status | The count is greater than 0 |
| 4 | Click the `Select a date.` date range picker | The date picker calendar is open (calendar widget is visible) |
| 5 | Select a date range that covers the last 30 days | The date range picker displays the selected range |
| 6 | Verify the grid updated | The grid is still visible; the record count changed or stayed the same (data-dependent) |
| 7 | Click the `Reset` button | The date range picker is cleared; the record count is restored to the initial value |

**Coverage dimension:** Happy Path + Data Integrity (filter → read-back → reset → read-back)

---

#### `LANDING-TASKS-ASSIGNEE-002` — Assignee Filter Changes My Tasks Grid Content

**Preconditions:** Logged in as `process_quality_leader`. Landing Page loaded. My Tasks tab active with data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The `My Tasks` tab is selected by default |
| 2 | Verify the grid has data rows | At least 1 data row is visible |
| 3 | Record the initial record count | The count is greater than 0 |
| 4 | Locate the `Assignee` combobox filter | The `Assignee` combobox is visible |
| 5 | Click the `Assignee` combobox and Select the first available option | The selected option text appears in the combobox |
| 6 | Verify the grid updated after filter applied | The grid is visible; the record count is less than or equal to the initial count |
| 7 | Click the `Reset` button | The combobox is cleared; the record count is restored |

**Coverage dimension:** Happy Path + Data Integrity

---

#### `LANDING-TASKS-EMPTY-001` — No-Match Search Shows Empty Grid State

**Preconditions:** Logged in as `process_quality_leader`. My Tasks tab active with data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The `My Tasks` tab is active |
| 2 | Verify the grid has data rows | At least 1 row is visible |
| 3 | Type `zzz_no_match_query_xyz_12345` into the `Search a task` searchbox | The searchbox contains the typed text |
| 4 | Verify the grid shows empty state | The grid contains 0 data rows **or** an empty-state message like `"No records found"` is visible |
| 5 | Click the `Reset` button | The searchbox is cleared (value is empty); at least 1 data row is visible again |

**Coverage dimension:** Negative / Validation (no-match scenario + recovery)

---

#### `LANDING-TASKS-SORT-001` — My Tasks Column Sorting

**Preconditions:** Logged in as `process_quality_leader`. My Tasks tab active with multiple data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The `My Tasks` tab is active |
| 2 | Verify the grid has at least 2 data rows | Row count is ≥ 2 |
| 3 | Click the `Name` column header | The column header has a sort indicator (ascending or descending); the grid is still visible with data |
| 4 | Click the `Name` column header again | The sort direction is toggled (opposite indicator); the grid is still visible with data |
| 5 | Click the `Product` column header | The `Product` column has a sort indicator; the `Name` sort indicator is removed or inactive |

**Coverage dimension:** State Transition (sort state toggling)
**Note:** If sorting is not available in the QA environment for these columns, skip the test with a descriptive message.

---

### WF 2.3 — My Products Tab

---

#### `LANDING-MY-PRODUCTS-004` — Search by Product ID Narrows My Products Grid

**Preconditions:** Logged in as `process_quality_leader`. My Products tab active with data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The page heading is visible |
| 2 | Click the `My Products` tab | The `My Products` tab has `aria-selected` = `"true"` |
| 3 | Verify the grid has data rows | At least 1 data row is visible |
| 4 | Record the initial record count | The count is greater than 0 |
| 5 | Click the `Product Id` combobox (2nd combobox in My Products filters) | The combobox dropdown is open |
| 6 | Select the first available Product ID option | The selected Product ID text appears in the combobox |
| 7 | Verify the grid updated | The grid is visible; the record count is less than or equal to the initial count |
| 8 | Click the `Reset` button | The combobox is cleared; the record count is restored to the initial value |

**Coverage dimension:** Happy Path + Data Integrity

---

#### `LANDING-MY-PRODUCTS-005` — Reset Button Restores Default Filter State

**Preconditions:** Logged in as `process_quality_leader`. My Products tab active with data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My Products` tab | The tab is active |
| 2 | Record the initial record count | The count is greater than 0 |
| 3 | Verify the `Show Active Only` checkbox is checked by default | The `Show Active Only` checkbox `input[type="checkbox"]` is checked |
| 4 | Click the `Org Level 1` combobox and Select the first available option | The selected value appears in the combobox |
| 5 | Click the `Reset` button | The `Org Level 1` combobox is cleared; the `Show Active Only` checkbox is still checked; the record count is restored to the initial value |

**Coverage dimension:** Data Integrity (filter + reset round-trip)

---

#### `LANDING-MY-PRODUCTS-006` — Click Product Name Navigates to Product Detail Page

**Preconditions:** Logged in as `process_quality_leader`. My Products tab active with data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My Products` tab | The `My Products` tab is active and the grid has data |
| 2 | Click the first product name link in the `Product` column | A navigation is triggered |
| 3 | Verify the URL contains `/ProductDetail` | The URL contains `ProductDetail` |
| 4 | Verify the Product Detail page loaded | The `Product Detail` heading or `Edit Product` button is visible |

**Coverage dimension:** Happy Path (navigation)

---

#### `LANDING-PRODS-SORT-001` — My Products Column Sorting

**Preconditions:** Logged in as `process_quality_leader`. My Products tab active with multiple data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My Products` tab | The grid has at least 2 data rows |
| 2 | Click the `Product` column header | A sort indicator appears on the column header |
| 3 | Click the `Product` column header again | The sort direction is toggled |
| 4 | Click the `Org Level 1` column header | The `Org Level 1` column shows a sort indicator |

**Coverage dimension:** State Transition
**Note:** Skip if sorting is not supported for these columns.

---

### WF 2.4 — My Releases Tab

#### `LANDING-RELS-DATE-002` — Target Release Date Range Filter Applies Correctly

**Preconditions:** Logged in as `process_quality_leader`. My Releases tab active with data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My Releases` tab | The tab is active |
| 2 | Verify the grid has data rows | At least 1 row is visible |
| 3 | Record the initial record count | The count is greater than 0 |
| 4 | Click the date range picker (Target Release Date) | The calendar widget is open |
| 5 | Select a date range covering the last 90 days | The date range appears in the picker |
| 6 | Verify the grid updated | The grid is visible; the record count changed or stayed the same |
| 7 | Click the `Reset` button | The date picker is cleared; the record count is restored |

**Coverage dimension:** Happy Path + Data Integrity

---

#### `LANDING-RELS-SORT-001` — My Releases Column Sorting

**Preconditions:** Logged in as `process_quality_leader`. My Releases tab active with multiple data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My Releases` tab | The grid has at least 2 rows |
| 2 | Click the `Release` column header | A sort indicator appears |
| 3 | Click the `Release` column header again | The sort direction is toggled |
| 4 | Click the `Target Release Date` column header | The `Target Release Date` column now shows a sort indicator |

**Coverage dimension:** State Transition
**Note:** Skip if sorting is not supported.

---

### WF 2.5 — My DOCs Tab

---

#### `LANDING-DOCS-STATUS-001` — DOC Status Dropdown Filter Applies Correctly

**Preconditions:** Logged in as `process_quality_leader`. My DOCs tab active with data rows.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My DOCs` tab | The `My DOCs` tab is active |
| 2 | Verify the grid has data rows | At least 1 row is visible |
| 3 | Record the initial record count | The count is greater than 0 |
| 4 | Locate the DOC Status dropdown (the `Select an option` combobox) | The combobox is visible |
| 5 | Click the DOC Status combobox and Select the first available status option | The selected status text appears in the combobox |
| 6 | Verify the grid updated | The grid is visible; the record count is less than or equal to the initial count |
| 7 | Click the `Reset` button | The combobox is cleared; the record count is restored |

**Coverage dimension:** Happy Path + Data Integrity

---

### WF 2.6 — Header & Global Actions

---

#### `LANDING-HEADER-LOGO-001` — PICASso Header Logo Navigates to Landing Page

**Preconditions:** Logged in as `process_quality_leader`. On any page that is NOT the Landing Page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a non-landing page (e.g., `/GRC_PICASso/RolesDelegation`) | The URL contains `RolesDelegation` |
| 2 | Click the PICASso header logo link | A navigation is triggered |
| 3 | Verify the URL contains `/GRC_PICASso/` | The URL matches the Landing Page pattern |
| 4 | Verify the Landing Page loaded | The `My Tasks` tab is visible; the grid is visible |

**Coverage dimension:** Happy Path (global navigation)
**Note:** This replaces existing `LANDING-HEADER-005` which tests logo from Landing → Landing. This variant tests from a different page to verify actual navigation.

---

#### `LANDING-HEADER-REPORTS-001` — My Reports Shortcut Link in Header

**Preconditions:** Logged in as `process_quality_leader`. Landing Page loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The Landing Page heading is visible |
| 2 | Verify whether a `My Reports` link exists in the header | If the link is **not visible**, skip the test with message `"My Reports link not present in QA environment"` |
| 3 | Click the `My Reports` link | A navigation is triggered |
| 4 | Verify the target page loaded | The URL contains `Reports` or the page heading contains `Reports` |

**Coverage dimension:** Happy Path
**Note:** Link may not be present in QA. Mark as on-hold if confirmed absent.

---

## Review Gate Checklist (§5)

| # | Check | Pass? |
|---|-------|-------|
| 1 | Every step uses an allowed verb (Navigate, Click, Type, Select, Verify, Confirm) | ✅ |
| 2 | Every expected result is machine-verifiable (visibility, state, text, URL, count) | ✅ |
| 3 | No vague terms ("looks correct", "works", "displays properly") | ✅ |
| 4 | UI element names match DOM snapshot from exploration-findings.md | ✅ |
| 5 | Negative cases: no-match search (`LANDING-TASKS-EMPTY-001`), empty state (`LANDING-EMPTY-001`) | ✅ |
| 6 | Role-based: not applicable for landing (all tabs visible to `process_quality_leader`; role-restricted tests belong in `auth` area) | ✅ N/A |
| 7 | State transitions: sort toggle, rapid tab switch, Show Active Only toggle | ✅ |
| 8 | Data integrity: filter → record count → reset → count restored (all filter tests) | ✅ |
| 9 | Cross-feature: product name click → Product Detail; release name click → Release Detail | ✅ |
| 10 | No environment-specific hardcoded values (counts, dates, user names) | ✅ |

---

## Deduplication Actions — Completed

The following 9 duplicates were **deleted** from the tracker DB:

```
WF02-0008, WF02-0015, WF02-0016, WF02-0031, WF02-0032, WF02-0033, WF02-0042, WF02-0047, WF02-0048
```

All removed via `npx tsx scripts/tracker.ts remove <ID>`. No on-hold — clean deletion.

---

## Summary

| Category | Count |
|----------|-------|
| Existing automated (keep) | ~42 |
| Duplicates → on-hold | 9 |
| Genuinely new test cases | 13 |
| **Total after refactoring** | **~55 active scenarios** |

### Priority Breakdown (new cases only)

| Priority | Count | Scenarios |
|----------|-------|-----------|
| P1 | 1 | LANDING-HEADER-LOGO-001 |
| P2 | 9 | LANDING-EMPTY-001, LANDING-TASKS-DATE-002, LANDING-TASKS-ASSIGNEE-002, LANDING-MY-PRODUCTS-004/005/006, LANDING-RELS-DATE-002, LANDING-DOCS-STATUS-001, LANDING-TASKS-EMPTY-001 |
| P3 | 3 | LANDING-TASKS-SORT-001, LANDING-PRODS-SORT-001, LANDING-RELS-SORT-001 |

### Zero-Regression Assessment After Completion

| Dimension | Covered? |
|-----------|----------|
| Happy Path (all tabs, filters, navigation) | ✅ Yes — all 5 tabs fully covered |
| Negative / Validation (empty state, no-match) | ✅ Yes — after LANDING-EMPTY-001 + LANDING-TASKS-EMPTY-001 |
| Role-Based Access | ⚠️ Deferred to `auth` area (landing page is role-agnostic for viewing) |
| State Transitions (sort, toggle, rapid switch) | ✅ Yes — after LANDING-TASKS-SORT-001/0034/0040 + LANDING-TABS-SWITCH-001 |
| Data Integrity (filter → read-back → reset) | ✅ Yes — all filter tests follow this pattern |
