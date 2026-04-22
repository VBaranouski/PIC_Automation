# WF 15. Stage Sidebar & Responsible Users — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `releases` · **Workflow:** Stage Sidebar & Responsible Users
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 16 |
| Automated | 0 |
| Pending | 16 |
| On-Hold | 0 |
| Has Steps | 16 |
| Missing Steps | 0 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | STAGE-SIDEBAR-004–009 cover sidebar open/close/display |
| Negative / Validation | ⚠️ | **Missing: sidebar behavior when no responsible users are assigned** |
| Role-Based Access | ❌ | **No scenario tests role-specific sidebar visibility** |
| State Transitions | ✅ | STAGE-SIDEBAR-001 covers dynamic update after SA submit |
| Data Integrity | ✅ | STAGE-SIDEBAR-006 covers responsible users table |

### 1.3 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| STAGE-SIDEBAR-010 | Sidebar shows "No responsible users" when none are assigned | P3 | Negative — empty state |
| STAGE-SIDEBAR-ROLE-001 | All release-access roles can view the stage sidebar | P2 | Role-Based Access — allowed |
| STAGE-SIDEBAR-ROLE-002 | User without release access cannot open the sidebar | P2 | Role-Based Access — denied |

---

## 2. Test Case Specifications

### 2.1 Sidebar Display

#### `STAGE-SIDEBAR-004` — "Need Help" button on Release Detail page opens the Stage Sidebar panel

**Preconditions:** User is logged in. A release exists at any stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the target release | The `Release Detail` heading is visible |
| 2 | Click the `Need Help` button | The Stage Sidebar panel slides open on the right side of the page |
| 3 | Verify the sidebar is visible | The sidebar panel is visible with content |

**Coverage dimension:** Happy Path
**Subsection:** Sidebar Display

---

#### `STAGE-SIDEBAR-005` — Stage Sidebar shows the current stage name in the header

**Preconditions:** User is logged in. Sidebar is open via `Need Help` button.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Need Help` button | The Stage Sidebar panel is visible |
| 2 | Verify the sidebar header contains the current stage name | The header text matches the release's current stage (e.g., "Creation & Scoping", "Review & Confirm") |

**Coverage dimension:** Data Integrity
**Subsection:** Sidebar Display

---

#### `STAGE-SIDEBAR-006` — Sidebar displays a Responsible Users table with columns: User, Role, Approval Date

**Preconditions:** User is logged in. Sidebar is open. The release has responsible users assigned.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Need Help` button | The Stage Sidebar panel is visible |
| 2 | Verify the Responsible Users table is visible | A table with at least 1 row is visible |
| 3 | Verify the `User` column header is visible | The `User` column header is present |
| 4 | Verify the `Role` column header is visible | The `Role` column header is present |
| 5 | Verify the `Approval Date` column header is visible | The `Approval Date` column header is present |

**Coverage dimension:** Data Integrity
**Subsection:** Sidebar Display

---

#### `STAGE-SIDEBAR-007` — Stage description text (configured in BackOffice) is visible in the sidebar

**Preconditions:** User is logged in. Sidebar is open. BackOffice has configured a stage description.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Need Help` button | The Stage Sidebar panel is visible |
| 2 | Verify a stage description text block is visible below the header | The description text is not empty |

**Coverage dimension:** Data Integrity
**Subsection:** Sidebar Display

---

#### `STAGE-SIDEBAR-008` — Rework justification text is visible in the sidebar when release is on Rework

**Preconditions:** User is logged in. The release is in Rework status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the rework release | The `Release Detail` heading is visible |
| 2 | Click the `Need Help` button | The Stage Sidebar panel is visible |
| 3 | Verify the rework justification text is displayed in the sidebar | A justification text block is visible in the sidebar |

**Coverage dimension:** State Transitions
**Subsection:** Sidebar Display

---

#### `STAGE-SIDEBAR-009` — Closing the sidebar via the X button hides it without navigating away

**Preconditions:** User is logged in. Sidebar is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Need Help` button | The Stage Sidebar panel is visible |
| 2 | Click the `X` (close) button on the sidebar | The sidebar panel is no longer visible |
| 3 | Verify the URL has not changed | The URL still contains the release detail path |
| 4 | Verify the Release Detail page content is still visible | The release content tabs are visible |

**Coverage dimension:** Happy Path
**Subsection:** Sidebar Display

---

### 2.2 Stage Navigation

#### `STAGE-SIDEBAR-001` — Sidebar updates dynamically after SA submits — approval date appears

**Preconditions:** User is the Security Advisor. The release is at SA & PQL Sign Off.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Need Help` button | The Stage Sidebar panel is visible |
| 2 | Note the current approval date cells in the Responsible Users table | The SA approval date is empty |
| 3 | Close the sidebar and perform the SA submission | The submission succeeds |
| 4 | Click the `Need Help` button again | The Stage Sidebar reopens |
| 5 | Verify the SA row now shows an approval date | The `Approval Date` cell for the SA row is not empty and contains today's date |

**Coverage dimension:** State Transitions
**Subsection:** Stage Navigation

---

#### `STAGE-SIDEBAR-002` — Previous Stage and Next Stage navigation buttons work in sidebar

**Preconditions:** User is logged in. Sidebar is open. Release is at an intermediate stage (e.g., Manage).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Need Help` button | The Stage Sidebar shows the current stage |
| 2 | Click the `Previous Stage` button | The sidebar displays information for the previous stage |
| 3 | Click the `Next Stage` button | The sidebar displays information for the next stage |
| 4 | Click the `Next Stage` button again | The sidebar returns to the current stage information |

**Coverage dimension:** Happy Path
**Subsection:** Stage Navigation

---

#### `STAGE-SIDEBAR-003` — Stage description from BackOffice is visible in sidebar

**Preconditions:** User is logged in. BackOffice has configured descriptions for stages.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Need Help` button | The Stage Sidebar is visible |
| 2 | Verify the stage description is displayed | A non-empty description text block is visible |
| 3 | Click `Next Stage` | The next stage description differs from the current one |

**Coverage dimension:** Data Integrity
**Subsection:** Stage Navigation

---

### 2.3 Workflow Popup

#### `STAGE-SIDEBAR-WORKFLOW-001` — "View Flow" button on Release Detail page opens the Workflow popup

**Preconditions:** User is logged in. A release exists at any stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Click the `View Flow` button | A Workflow popup/dialog opens |
| 3 | Verify the popup shows the 7-stage workflow diagram | At least 7 stage labels are visible in the popup |

**Coverage dimension:** Happy Path
**Subsection:** Workflow Popup

---

#### `STAGE-SIDEBAR-WORKFLOW-002` — When release is on Rework: orange dot indicator appears next to "View Flow" link

**Preconditions:** User is logged in. The release is in Rework status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the rework release | The `Release Detail` heading is visible |
| 2 | Verify an orange dot indicator is visible next to the `View Flow` link | An orange-colored indicator element is visible adjacent to `View Flow` |

**Coverage dimension:** State Transitions
**Subsection:** Workflow Popup

---

#### `STAGE-SIDEBAR-WORKFLOW-003` — Hovering over the orange dot shows tooltip: "On Rework. Click here for more details"

**Preconditions:** User is logged in. The release is in Rework status. Orange dot is visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the rework release | The orange dot is visible next to `View Flow` |
| 2 | Hover over the orange dot indicator | A tooltip appears with text "On Rework. Click here for more details" |

**Coverage dimension:** Happy Path
**Subsection:** Workflow Popup

---

#### `STAGE-SIDEBAR-WORKFLOW-004` — Workflow popup shows submission counter for stages requiring multiple approvals

**Preconditions:** User is logged in. Release is at a stage that requires multiple submissions (e.g., SA & PQL Sign Off).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click `View Flow` | The Workflow popup opens |
| 2 | Verify the current stage shows a submission counter | A counter text (e.g., "1 from 2 submissions") is visible for the current stage |

**Coverage dimension:** Data Integrity
**Subsection:** Workflow Popup

---

#### `STAGE-SIDEBAR-WORKFLOW-005` — Completed stages show completion user and timestamp in the Workflow popup

**Preconditions:** User is logged in. The release has completed at least one stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click `View Flow` | The Workflow popup opens |
| 2 | Verify a completed stage shows a user name | The completion user name is visible for the completed stage |
| 3 | Verify the completed stage shows a timestamp | A date/time value is visible for the completed stage |

**Coverage dimension:** Data Integrity
**Subsection:** Workflow Popup

---

### 2.4 My Tasks Integration

#### `STAGE-SIDEBAR-TASKS-001` — My Tasks list: "Assignee" filter is available and narrows tasks to the selected user

**Preconditions:** User is logged in with tasks assigned. My Tasks tab is visible on landing page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My Tasks` tab | The My Tasks grid is visible |
| 2 | Click the `Assignee` filter dropdown | The filter dropdown opens with user options |
| 3 | Select a user from the dropdown | The grid filters to show only tasks assigned to the selected user |

**Coverage dimension:** Happy Path
**Subsection:** My Tasks Integration

---

#### `STAGE-SIDEBAR-TASKS-002` — My Tasks list: "Assignee" column is visible showing the assigned user for each task

**Preconditions:** User is logged in. My Tasks tab has at least 1 task.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My Tasks` tab | The My Tasks grid is visible |
| 2 | Verify the `Assignee` column header is visible | The `Assignee` column header is present |
| 3 | Verify the first row has a non-empty `Assignee` value | The `Assignee` cell contains a user name |

**Coverage dimension:** Data Integrity
**Subsection:** My Tasks Integration

---

### 2.5 Empty State (NEW)

#### `STAGE-SIDEBAR-010` — Sidebar shows "No responsible users" when none are assigned

**Preconditions:** User is logged in. The release stage has no responsible users assigned.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Need Help` button | The Stage Sidebar panel is visible |
| 2 | Verify the Responsible Users section displays an empty state message | A message such as "No responsible users" or an empty table is visible |

**Coverage dimension:** Negative / Validation
**Subsection:** Empty State

---

### 2.6 Role-Based Access (NEW)

#### `STAGE-SIDEBAR-ROLE-001` — All release-access roles can view the stage sidebar

**Preconditions:** User is logged in with any role that has release access (PO, SA, SM, PQL).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Click the `Need Help` button | The Stage Sidebar panel is visible with stage information |

**Coverage dimension:** Role-Based Access — allowed
**Subsection:** Role-Based Access

---

#### `STAGE-SIDEBAR-ROLE-002` — User without release access cannot open the sidebar

**Preconditions:** User is logged in with a role that has no release access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release URL directly | The user is redirected or an access-denied message is visible |
| 2 | Verify the `Need Help` button is not present | The `Need Help` button is not visible |

**Coverage dimension:** Role-Based Access — denied
**Subsection:** Role-Based Access

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| Sidebar Display | STAGE-SIDEBAR-004, 005, 006, 007, 008, 009 |
| Stage Navigation | STAGE-SIDEBAR-001, 002, 003 |
| Workflow Popup | STAGE-SIDEBAR-WORKFLOW-001 through 005 |
| My Tasks Integration | STAGE-SIDEBAR-TASKS-001, 002 |
| Empty State | STAGE-SIDEBAR-010 |
| Role-Based Access | STAGE-SIDEBAR-ROLE-001, 002 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms from the banned list | ✅ |
| 4 | UI element names match latest DOM snapshot | ✅ |
| 5 | Negative cases | ✅ (SIDEBAR-010 empty state) |
| 6 | Role-based access tested | ✅ (ROLE-001, ROLE-002) |
| 7 | State transitions | ✅ (SIDEBAR-001, WORKFLOW-002) |
| 8 | Data integrity | ✅ (SIDEBAR-005, 006, WORKFLOW-004, 005) |
| 9 | Cross-feature side effects | ✅ (Tasks integration) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 16 |
| New scenarios | 3 (SIDEBAR-010, ROLE-001, ROLE-002) |
| Total scenarios | 19 |
| P1 | 2 |
| P2 | 13 |
| P3 | 4 |
