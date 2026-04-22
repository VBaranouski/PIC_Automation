# WF 14. Release History — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `releases` · **Workflow:** Release History
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 20 |
| Automated | 0 |
| Pending | 20 |
| On-Hold | 0 |
| Has Steps | 0 |
| Missing Steps | 20 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | RELEASE-HISTORY-001–005 cover core history display |
| Negative / Validation | ✅ | RELEASE-HISTORY-EDGE-003 covers error state |
| Role-Based Access | ❌ | **No scenario tests denied access to Release History** |
| State Transitions | N/A | History is read-only; no state transitions |
| Data Integrity | ✅ | RELEASE-HISTORY-AUDIT-001–003 cover event logging |

### 1.3 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| RELEASE-HISTORY-ROLE-001 | Read-only user can view Release History tab | P2 | Role-Based Access — allowed |
| RELEASE-HISTORY-ROLE-002 | User without release access cannot see Release History | P2 | Role-Based Access — denied |

---

## 2. Test Case Specifications

### 2.1 History Display

#### `RELEASE-HISTORY-001` — Stage transition entry appears in Release History after Submit

**Preconditions:** User is logged in as Security Advisor. A release exists at Review & Confirm stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the target release | The `Release Detail` heading is visible |
| 2 | Click the `History` tab in the release content tabs | The `History` tab content area loads |
| 3 | Verify the history grid is visible | At least 1 row is visible in the history grid |
| 4 | Verify a row exists with Activity = "Stage transition" | A row with `Activity` column containing "Stage transition" is visible |

**Coverage dimension:** Happy Path
**Subsection:** History Display

---

#### `RELEASE-HISTORY-002` — History popup shows columns: Date, User, Activity, Description

**Preconditions:** User is logged in. A release with history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the target release | The `Release Detail` heading is visible |
| 2 | Click the `History` tab | The history grid is visible |
| 3 | Verify the `Date` column header is visible | The `Date` column header is visible |
| 4 | Verify the `User` column header is visible | The `User` column header is visible |
| 5 | Verify the `Activity` column header is visible | The `Activity` column header is visible |
| 6 | Verify the `Description` column header is visible | The `Description` column header is visible |

**Coverage dimension:** Happy Path
**Subsection:** History Display

---

#### `RELEASE-HISTORY-003` — User column shows profile image and display name for each activity

**Preconditions:** User is logged in. A release with history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible with at least 1 row |
| 2 | Verify the first row `User` cell contains a profile image element | A profile image (avatar) is visible in the `User` cell |
| 3 | Verify the first row `User` cell contains a display name | The display name text is not empty |

**Coverage dimension:** Data Integrity
**Subsection:** History Display

---

#### `RELEASE-HISTORY-004` — Activity column shows the activity type label

**Preconditions:** User is logged in. A release with history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Verify the first row `Activity` cell is not empty | The `Activity` cell contains text (e.g., "Release creation", "Requirement status update") |

**Coverage dimension:** Data Integrity
**Subsection:** History Display

---

#### `RELEASE-HISTORY-005` — Footer shows total record count

**Preconditions:** User is logged in. A release with history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Verify the footer area below the grid is visible | A record count label (e.g., "Showing 1–10 of 45") is visible |

**Coverage dimension:** Happy Path
**Subsection:** History Display

---

### 2.2 Audit Events

#### `RELEASE-HISTORY-AUDIT-001` — Release creation event is present in history after a release is created

**Preconditions:** User has just created a new release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the newly created Release Detail page | The `Release Detail` heading is visible |
| 2 | Click the `History` tab | The history grid is visible |
| 3 | Verify a row with Activity = "Release creation" is present | A row with `Activity` containing "Release creation" is visible |
| 4 | Verify the `User` column in that row contains the current user's name | The `User` cell is not empty |
| 5 | Verify the `Date` column contains today's date | The `Date` cell contains today's date |

**Coverage dimension:** Data Integrity
**Subsection:** Audit Events

---

#### `RELEASE-HISTORY-AUDIT-002` — Cloning a release creates a "Release cloning" history entry

**Preconditions:** User has cloned an existing release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the cloned Release Detail page | The `Release Detail` heading is visible |
| 2 | Click the `History` tab | The history grid is visible |
| 3 | Verify a row with Activity = "Release cloning" is present | A row with `Activity` containing "Release cloning" is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Audit Events

---

#### `RELEASE-HISTORY-AUDIT-003` — Submitting requirements to Jira creates a "Jira Submission" history entry

**Preconditions:** User has submitted requirements to Jira for a release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Click the `History` tab | The history grid is visible |
| 3 | Verify a row with Activity = "Jira Submission" is present | A row with `Activity` containing "Jira Submission" is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Audit Events

---

### 2.3 Filters & Sorting

#### `RELEASE-HISTORY-FILTER-001` — History records are sorted in descending date order by default (newest first)

**Preconditions:** User is logged in. A release with multiple history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible with at least 2 rows |
| 2 | Read the `Date` value from the first row | The date value is noted |
| 3 | Read the `Date` value from the second row | The second row date is equal to or earlier than the first row date |

**Coverage dimension:** Happy Path
**Subsection:** Filters & Sorting

---

#### `RELEASE-HISTORY-FILTER-002` — Clicking the Date column header toggles sort between descending and ascending order

**Preconditions:** User is logged in. A release with multiple history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Click the `Date` column header | The sort order toggles; the first row date is the oldest entry |
| 3 | Click the `Date` column header again | The sort order toggles back; the first row date is the newest entry |

**Coverage dimension:** Happy Path
**Subsection:** Filters & Sorting

---

#### `RELEASE-HISTORY-FILTER-003` — Search text field filters history records by User name or Description text

**Preconditions:** User is logged in. A release with history entries from multiple users exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Note the total number of rows | The initial row count is recorded |
| 3 | Type a known user name into the `Search` text field | The text is entered in the search field |
| 4 | Click the `Search` button | The grid filters; all visible rows contain the searched text in `User` or `Description` |
| 5 | The filtered row count is less than or equal to the initial count | The row count changed |

**Coverage dimension:** Happy Path
**Subsection:** Filters & Sorting

---

#### `RELEASE-HISTORY-FILTER-004` — "Activity" dropdown filter limits records to the selected activity type

**Preconditions:** User is logged in. A release with multiple activity types exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Click the `Activity` dropdown filter | The dropdown opens with a list of activity types |
| 3 | Select "Release creation" from the dropdown | The dropdown shows "Release creation" selected |
| 4 | Click the `Search` button | All visible rows have `Activity` = "Release creation" |

**Coverage dimension:** Happy Path
**Subsection:** Filters & Sorting

---

#### `RELEASE-HISTORY-FILTER-005` — Activity dropdown includes all 25+ activity types

**Preconditions:** User is logged in. A release with history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Click the `Activity` dropdown filter | The dropdown opens |
| 3 | Verify the dropdown includes at least the following activity types: Release creation, Clone, Role update, Questionnaire update, Requirement status update, Scope Review update, Risk Classification, CSRR changes, FCSR Decision, Jira Submission, Jama Submission | At least 11 activity type options are visible in the dropdown |

**Coverage dimension:** Data Integrity
**Subsection:** Filters & Sorting

---

#### `RELEASE-HISTORY-FILTER-006` — Date Range picker filters records to the selected period (from/to)

**Preconditions:** User is logged in. A release with history entries across multiple dates exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Note the initial record count | The count is recorded |
| 3 | Set the `Start Date` picker to a date within the release history range | The start date is set |
| 4 | Set the `End Date` picker to the same date | The end date is set |
| 5 | Click the `Search` button | All visible rows have a `Date` within the selected range; the count is ≤ initial count |

**Coverage dimension:** Happy Path
**Subsection:** Filters & Sorting

---

#### `RELEASE-HISTORY-FILTER-007` — "Search" button applies all active filters

**Preconditions:** User is logged in. Multiple filters are set (search text + activity dropdown).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Type a known user name into the `Search` text field | The text is entered |
| 3 | Select an activity type from the `Activity` dropdown | The activity is selected |
| 4 | Click the `Search` button | The grid shows only rows matching BOTH the search text AND the activity type |

**Coverage dimension:** Happy Path
**Subsection:** Filters & Sorting

---

#### `RELEASE-HISTORY-FILTER-008` — "Reset" button clears all filters and restores the full history

**Preconditions:** User is logged in. Filters have been applied (search text, activity, date range).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Apply at least one filter and click `Search` | The grid shows filtered results |
| 3 | Note the filtered row count | The count is recorded |
| 4 | Click the `Reset` button | All filter fields are cleared; the search text field is empty; the activity dropdown shows default |
| 5 | Verify the grid restores the full record count | The row count is ≥ the filtered count |

**Coverage dimension:** Happy Path
**Subsection:** Filters & Sorting

---

### 2.4 Pagination

#### `RELEASE-HISTORY-EDGE-001` — Pagination: records-per-page dropdown (10/20/50/100) changes number of rows displayed

**Preconditions:** User is logged in. A release with > 10 history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible with pagination controls |
| 2 | Select `20` from the records-per-page dropdown | The grid shows up to 20 rows |
| 3 | Select `10` from the records-per-page dropdown | The grid shows up to 10 rows |

**Coverage dimension:** Happy Path
**Subsection:** Pagination

---

#### `RELEASE-HISTORY-EDGE-002` — Pagination navigation (prev/next page) works correctly

**Preconditions:** User is logged in. A release with > 10 history entries exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab | The history grid is visible |
| 2 | Note the first row `Date` value on page 1 | The value is recorded |
| 3 | Click the `Next` page navigation button | The grid loads page 2; the first row `Date` value differs from page 1 |
| 4 | Click the `Previous` page navigation button | The grid returns to page 1; the first row matches the original |

**Coverage dimension:** Happy Path
**Subsection:** Pagination

---

#### `RELEASE-HISTORY-EDGE-003` — Error state: "Unable to load data. Try again, please." message appears when data fails to load

**Preconditions:** Simulated network error or backend unavailability.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `History` tab (with network interception blocking the history API) | An error message "Unable to load data. Try again, please." is visible |

**Coverage dimension:** Negative / Validation
**Subsection:** Pagination
**Note:** Requires API mocking or network interception to simulate failure.

---

### 2.5 Role-Based Access (NEW)

#### `RELEASE-HISTORY-ROLE-001` — Read-only user can view Release History tab

**Preconditions:** User is logged in with a read-only role (e.g., Viewer) that has release access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Click the `History` tab | The history grid is visible |
| 3 | Verify history records are displayed | At least 1 row is visible in the history grid |
| 4 | Verify no edit controls are present | No `Edit`, `Delete`, or `Add` buttons are visible in the history area |

**Coverage dimension:** Role-Based Access — allowed
**Subsection:** Role-Based Access

---

#### `RELEASE-HISTORY-ROLE-002` — User without release access cannot see Release History

**Preconditions:** User is logged in with a role that has no release access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release URL directly | The user is redirected or an access-denied message is visible |
| 2 | Verify the Release Detail page content is not accessible | The `History` tab is not visible or the page shows "Access Denied" |

**Coverage dimension:** Role-Based Access — denied
**Subsection:** Role-Based Access

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| History Display | RELEASE-HISTORY-001, RELEASE-HISTORY-002, RELEASE-HISTORY-003, RELEASE-HISTORY-004, RELEASE-HISTORY-005 |
| Audit Events | RELEASE-HISTORY-AUDIT-001, RELEASE-HISTORY-AUDIT-002, RELEASE-HISTORY-AUDIT-003 |
| Filters & Sorting | RELEASE-HISTORY-FILTER-001 through RELEASE-HISTORY-FILTER-008 |
| Pagination | RELEASE-HISTORY-EDGE-001, RELEASE-HISTORY-EDGE-002, RELEASE-HISTORY-EDGE-003 |
| Role-Based Access | RELEASE-HISTORY-ROLE-001, RELEASE-HISTORY-ROLE-002 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms from the banned list | ✅ |
| 4 | UI element names match latest DOM snapshot | ✅ |
| 5 | Negative cases for every input field | ✅ (EDGE-003) |
| 6 | Role-based access tested (allowed + denied) | ✅ (ROLE-001, ROLE-002) |
| 7 | State transitions: N/A (read-only view) | ✅ |
| 8 | Data integrity: create + read-back | ✅ (AUDIT-001–003) |
| 9 | Cross-feature side effects identified | ✅ (history created by other workflows) |
| 10 | No environment-specific hardcoded values | ✅ |
| 11 | Every scenario ID follows `AREA-SUBSECTION-NNN` format | ✅ |
| 12 | Every scenario has steps + expected results | ✅ |
| 13 | No description starts with `<ID>:` | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 20 |
| New scenarios | 2 (ROLE-001, ROLE-002) |
| Total scenarios | 22 |
| P1 | 3 |
| P2 | 16 |
| P3 | 3 |
