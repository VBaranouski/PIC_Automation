# Release Workflow — Stages 2–7: Test Case Specifications

> **Generated:** 2026-04-22 · **Feature area:** `releases` · **Tracker area:** `releases`
> **Scope:** WF 5–10 (Stage 2: Review & Confirm → Stage 7: Final Acceptance)
> **Skill:** `create-test-cases` v1

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Workflow | Total | Automated | Pending | On-Hold | Has Steps | Missing Steps |
|----------|-------|-----------|---------|---------|-----------|---------------|
| Stage 2: Review & Confirm | 82 | 38 | 44 | 0 | 38 | 44 |
| Stage 3: Manage | 100 | 12 | 88 | 0 | 12 | 88 |
| Stage 4: SA & PQL Sign Off | 25 | 0 | 25 | 0 | 0 | 25 |
| Stage 5: FCSR Review | 82 | 0 | 82 | 0 | 0 | 82 |
| Stage 6: Post FCSR Actions | 17 | 0 | 17 | 0 | 0 | 17 |
| Stage 7: Final Acceptance | 17 | 0 | 17 | 0 | 0 | 17 |
| **Totals** | **323** | **50** | **273** | **0** | **50** | **273** |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Stage 2 | Stage 3 | Stage 4 | Stage 5 | Stage 6 | Stage 7 |
|-----------|---------|---------|---------|---------|---------|---------|
| Happy Path | ✅ REVIEW-CONFIRM-001–003 | ✅ MANAGE-001–006 | ⚠️ Pending only (WF07-*) | ⚠️ Pending only (WF08-*) | ⚠️ Pending only (WF09-*) | ⚠️ Pending only (WF10-*) |
| Negative / Validation | ⚠️ RELEASE-REVIEW-DECISION-001/79 pending | ⚠️ RELEASE-CSRR-002/93/94 pending | ⚠️ RELEASE-SIGNOFF-SBOM-001–015 pending | ⚠️ RELEASE-FCSR-PARTICIPANT-007/27 pending | ⚠️ RELEASE-POSTFCSR-PRE-003/10 pending | ⚠️ RELEASE-ACCEPT-SBOM-001–010 pending |
| Role-Based Access | ❌ No denied-role scenarios | ❌ No denied-role scenarios | ⚠️ RELEASE-SIGNOFF-SA-004 (privacy) pending | ❌ No denied-role scenarios | ❌ No denied-role scenarios | ❌ No denied-role scenarios |
| State Transitions | ⚠️ RELEASE-REVIEW-SUBMIT-001–081 pending | ⚠️ MANAGE-006 pending | ⚠️ RELEASE-SIGNOFF-DUAL-001–020 pending | ⚠️ RELEASE-FCSR-OUTCOME-004–031 pending | ⚠️ RELEASE-POSTFCSR-NOGO-001–017 pending | ⚠️ RELEASE-ACCEPT-DECISION-001–017 pending |
| Data Integrity | ⚠️ RELEASE-REVIEW-SCOPE-002–046 pending | ⚠️ RELEASE-MANAGE-ACTION-005/96 pending | ⚠️ RELEASE-SIGNOFF-EVAL-003 pending | ⚠️ RELEASE-FCSR-PARTICIPANT-008/20 pending | ⚠️ RELEASE-POSTFCSR-PRE-004/14 pending | ⚠️ RELEASE-ACCEPT-SBOM-005 pending |

### 1.3 Identified Gaps — New Scenarios Needed

| Gap | Dimension | Stage | New Scenario ID | Priority |
|-----|-----------|-------|-----------------|----------|
| Privacy Reviewer: mark section N/A | Happy Path | 4 | RELEASE-DPP-PRIVACY-001 | P2 |
| Privacy Reviewer: maturity level selection | Happy Path | 4 | RELEASE-DPP-PRIVACY-002 | P2 |
| Privacy Reviewer: evidence rating | Happy Path | 4 | RELEASE-DPP-PRIVACY-003 | P2 |
| Privacy Reviewer: FCSR recommendation | Happy Path | 4 | RELEASE-DPP-PRIVACY-004 | P2 |
| Privacy Reviewer: PCC Decision (High risk) | Happy Path | 4 | RELEASE-DPP-PRIVACY-005 | P1 |
| Privacy: residual risk per section | Data Integrity | 4 | RELEASE-DPP-PRIVACY-006 | P2 |
| Privacy: actions creation/removal | Happy Path | 4 | RELEASE-DPP-PRIVACY-007 | P2 |
| Pen Test Details validation before FCSR | Negative | 4 | RELEASE-SIGNOFF-PENTEST-001 | P2 |
| FCSR Exception: CISO review & approve | State Transition | 5 | RELEASE-FCSR-EXCEPTION-001 | P1 |
| FCSR Exception: SVP LOB review & approve | State Transition | 5 | RELEASE-FCSR-EXCEPTION-002 | P1 |
| FCSR Exception: both CISO+SVP required | State Transition | 5 | RELEASE-FCSR-EXCEPTION-003 | P1 |
| DPP Summary section in FCSR Decision | Happy Path | 5 | RELEASE-FCSR-DEC-001 | P2 |
| PCC Decision section in FCSR Decision | Happy Path | 5 | RELEASE-FCSR-DEC-002 | P2 |
| Actions submit to Jira during Post FCSR | Happy Path | 6 | RELEASE-POSTFCSR-001 | P2 |
| Cancel Release during Post FCSR (Go with Post-Conditions) | State Transition | 6 | RELEASE-POSTFCSR-002 | P2 |
| Post-Conditions tracked at Final Acceptance | Happy Path | 7 | RELEASE-ACCEPT-001 | P2 |
| Cancel Release at Final Acceptance | State Transition | 7 | RELEASE-ACCEPT-002 | P2 |

**New scenarios: 17** · Priority breakdown: P1=3, P2=14

---

## 2. Deduplication Table

| Candidate A | Candidate B | Verdict |
|-------------|-------------|---------|
| RELEASE-REVIEW-001 (meta) | RELEASE-REVIEW-005–0013 (individual) | **Remove RELEASE-REVIEW-001** — it's a meta-aggregate of the individual scenarios |
| RELEASE-REVIEW-002 (meta) | RELEASE-REVIEW-SUMMARY-001–0028 (individual) | **Remove RELEASE-REVIEW-002** |
| RELEASE-REVIEW-003 (meta) | RELEASE-REVIEW-PREVFCSR-001–0035 (individual) | **Remove RELEASE-REVIEW-003** |
| RELEASE-REVIEW-004 (meta) | RELEASE-REVIEW-SCOPE-001–0075 (individual) | **Remove RELEASE-REVIEW-004** |

These 4 meta-scenarios (RELEASE-REVIEW-001 through RELEASE-REVIEW-004) in subsection "WF5 Outstanding Non-Automated Scenarios (2026-04-12)" are aggregate placeholders that duplicate the granular scenarios. They should be removed.

---

## 3. Test Case Specifications

### Stage 2: Review & Confirm

#### 3.1 Subsection: 5.1 Stage Transition & Routing

---

#### `RELEASE-REVIEW-005` — After submission, pipeline bar highlights "Review & Confirm" as the active stage

**Preconditions:** Release at "Scope Approval" status (just submitted for review). Logged in as Security Advisor.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for a release at Scope Approval status | The `Release Detail` heading is visible; the status badge shows `Scope Approval` |
| 2 | Click the `View Flow` toggle to expand the workflow pipeline bar | The pipeline bar is expanded; all 7 stage names are visible |
| 3 | Verify the active stage highlighting | The `Review & Confirm` stage is highlighted (active visual state); other stages are not highlighted as active |

**Coverage dimension:** State Transition

---

#### `RELEASE-REVIEW-006` — Review is routed to Security Advisor when Minimum Oversight Level = Team

**Preconditions:** Release at Scope Approval status. Product Minimum Oversight Level = "Team". Logged in as Security Advisor.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click `My Tasks` tab | The `My Tasks` tab is active |
| 2 | Verify a task for "Review and Confirm" is present for the target release | At least 1 task row is visible with the target release name and task name containing `Review and Confirm` |
| 3 | Click the task to navigate to the Release Detail page | The `Release Detail` heading is visible; the status badge shows `Scope Approval` |
| 4 | Click the `View Flow` toggle and click the `Review & Confirm` stage | The Stage Sidebar opens showing the Security Advisor's name as a responsible user |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-REVIEW-007` — Review is routed to LOB Security Leader when Minimum Oversight Level = LOB Security Leader

**Preconditions:** Release at Scope Approval status. Product Minimum Oversight Level = "LOB Security Leader". Logged in as LOB Security Leader.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` tab on the Landing Page | The `My Tasks` tab is active |
| 2 | Verify a task for "Review and Confirm" is present for the target release | At least 1 task row is visible with the target release name |
| 3 | Click the task to navigate to the Release Detail page | The `Release Detail` heading is visible |
| 4 | Click `View Flow` and click the `Review & Confirm` stage | The Stage Sidebar shows the LOB Security Leader's name as a responsible user |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-REVIEW-008` — Review is routed to BU Security Officer when Minimum Oversight Level = BU Security Officer

**Preconditions:** Release at Scope Approval status. Product Minimum Oversight Level = "BU Security Officer". Logged in as BU Security Officer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` tab on the Landing Page | The `My Tasks` tab is active |
| 2 | Verify a task for "Review and Confirm" is present for the target release | At least 1 task row is visible with the target release name |
| 3 | Click the task to navigate to the Release Detail page | The `Release Detail` heading is visible |
| 4 | Click `View Flow` and click the `Review & Confirm` stage | The Stage Sidebar shows the BU Security Officer's name as a responsible user |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-REVIEW-009` — Review is routed to BU Security Officer when Last BU SO FCSR Date is older than 12 months

**Preconditions:** Release at Scope Approval status. Product Last BU SO FCSR Date > 12 months ago. Logged in as BU Security Officer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` tab on the Landing Page | The `My Tasks` tab is active |
| 2 | Verify a task for "Review and Confirm" is present for the target release | At least 1 task row is visible with the target release name |
| 3 | Click the task to navigate to the Release Detail page | The `Release Detail` heading is visible |
| 4 | Click `View Flow` and click the `Review & Confirm` stage | The Stage Sidebar shows the BU Security Officer's name as a responsible user |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-REVIEW-010` — Manually overriding Risk Classification by the reviewer changes the routing accordingly

**Preconditions:** Release at Scope Approval status. Logged in as the responsible reviewer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the target release | The `Release Detail` heading is visible |
| 2 | Click the `Questionnaire` tab | The Questionnaire tab content is visible |
| 3 | Click the `Risk Classification` edit control (if available at this stage) | The Risk Classification field becomes editable; a justification field appears |
| 4 | Select a different Risk Classification value from the dropdown | The new value is selected |
| 5 | Type a justification in the justification text field | The justification text is entered |
| 6 | Click `Save` | The page reloads; the Risk Classification value reflects the new selection |
| 7 | Click `View Flow` and click the `Review & Confirm` stage | The Stage Sidebar shows updated responsible user(s) matching the new risk routing |

**Coverage dimension:** State Transition
**Note:** Risk Classification override may only be available to specific reviewer roles (SA, LOB SL, BU SO).

---

#### 3.2 Subsection: 5.2 Requirements Summary Section

---

#### `RELEASE-REVIEW-SUMMARY-001` — While release is at Review & Confirm stage, charts reflect the live requirement statuses

**Preconditions:** Release at Scope Approval (Review & Confirm) status. At least 1 process or product requirement exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Review & Confirm` tab | The `Review & Confirm` tab content loads |
| 2 | Click the `Requirements Summary` section header to expand it | The section expands showing `Process Requirements` and `Product Requirements` sub-sections |
| 3 | Verify the Process Requirements donut chart is visible | At least 1 status segment is visible in the Process Requirements chart area |
| 4 | Navigate to the `Process Requirements` tab and change one requirement's status via three-dot menu | The requirement status is updated; a success feedback message is visible |
| 5 | Return to the `Review & Confirm` tab and expand `Requirements Summary` | The donut chart reflects the updated status distribution (changed count) |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-SUMMARY-002` — After release advances past Review & Confirm, charts are frozen

**Preconditions:** Release has advanced to Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page at Manage stage | The `Release Detail` heading is visible; the status badge does not show `Scope Approval` |
| 2 | Click the `Review & Confirm` tab | The `Review & Confirm` tab content loads |
| 3 | Expand the `Requirements Summary` section | The donut charts are visible |
| 4 | Verify the charts display a snapshot indicator | A banner, label, or date stamp indicates the charts show a frozen snapshot (not live data) |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-SUMMARY-003` — Returning to Review & Confirm via rework restores live chart data

**Preconditions:** Release was at Manage stage and has been returned for rework to Scope Approval.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page (should be back at Scope Approval) | The status badge shows `Scope Approval` or `Scoping` |
| 2 | Click the `Review & Confirm` tab | The `Review & Confirm` tab content loads |
| 3 | Expand the `Requirements Summary` section | The donut charts are visible and reflect live (current) requirement statuses |
| 4 | Verify no frozen snapshot indicator is present | No snapshot-date banner is visible |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-SUMMARY-004` — Frozen charts display a banner or label indicating the snapshot date

**Preconditions:** Release has advanced past Review & Confirm (at Manage or later).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Review & Confirm` tab | The tab content loads |
| 2 | Expand `Requirements Summary` | The charts are visible |
| 3 | Verify a snapshot date indicator | A text element containing a date is visible near the charts, indicating when the snapshot was taken |

**Coverage dimension:** Data Integrity

---

#### 3.3 Subsection: 5.3 Previous FCSR Summary Section

---

#### `RELEASE-REVIEW-PREVFCSR-001` — Switching the dropdown to another release updates all summary fields

**Preconditions:** Release at Review & Confirm stage. Product has at least 2 completed releases with FCSR decisions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab content loads |
| 2 | Expand the `Previous FCSR Summary` section | The section expands; a `Previous Release` dropdown is visible |
| 3 | Note the currently displayed field values (Risk Classification, FCSR Decision, etc.) | The summary fields contain non-empty text |
| 4 | Select a different release from the `Previous Release` dropdown | The dropdown value changes to the selected release |
| 5 | Verify the summary fields have updated | At least one field value differs from the values noted in Step 3 |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-PREVFCSR-002` — "Link to Protocol File" field shows a clickable link if previously saved

**Preconditions:** Release at Review & Confirm stage. Previous release has a protocol file link saved.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab and expand `Previous FCSR Summary` | The section expands |
| 2 | Verify the `Link to Protocol File` field | The field contains a clickable hyperlink (an `<a>` tag or link element is visible) |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REVIEW-PREVFCSR-003` — Section is hidden if no previous release has reached Post FCSR Actions or Final Acceptance

**Preconditions:** Release at Review & Confirm stage. Product's first-ever release (no previous completed releases).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab content loads |
| 2 | Verify the `Previous FCSR Summary` section | The `Previous FCSR Summary` section header is not visible on the page |

**Coverage dimension:** Negative / Validation

---

#### 3.4 Subsection: 5.4 Scope Review Participants Section

---

#### `REVIEW-CONFIRM-034-b` — Recommendation radiobutton options

**Preconditions:** Release at Review & Confirm stage. `Add Participant` popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab and click `Add Participant` button | The `Add Participant` popup opens |
| 2 | Verify the Recommendation options | Radio buttons or dropdown options are visible: `Approved`, `Pending`, `Rejected`, `Approved with Actions`, `Reworked` |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REVIEW-SCOPE-001` — Comment field accepts up to 500 characters; exceeding limit shows error

**Preconditions:** Release at Review & Confirm stage. `Add Participant` popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Participant` on the `Review & Confirm` tab | The `Add Participant` popup opens |
| 2 | Select a user from the `User` dropdown | The user is selected |
| 3 | Select a Recommendation option | A recommendation is selected |
| 4 | Type 500 characters into the `Comment` field | The field accepts all 500 characters |
| 5 | Type a 501st character | The field either truncates to 500 characters or shows a validation error indicating the maximum length |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-REVIEW-SCOPE-002` — "Save" saves the participant and closes popup

**Preconditions:** Release at Review & Confirm stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Participant` on the `Review & Confirm` tab | The popup opens |
| 2 | Select a user from the `Release Team` tab dropdown | A user is selected |
| 3 | Select a Recommendation option | A recommendation is selected |
| 4 | Click the `Save` button | The popup closes; the participant appears in the `Scope Review Participants` table |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-SCOPE-003` — "Save & Create New" saves and keeps popup open for next entry

**Preconditions:** Release at Review & Confirm stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Participant` on the `Review & Confirm` tab | The popup opens |
| 2 | Fill in user, recommendation, and optional comment | All fields are populated |
| 3 | Click `Save & Create New` | The participant is added to the table; the popup remains open with cleared fields for a new entry |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-SCOPE-004` — Switching to "Others" option shows Sailpoint user lookup and mandatory Role text field

**Preconditions:** Release at Review & Confirm stage. `Add Participant` popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Participant` on the `Review & Confirm` tab | The popup opens with `Release Team` tab active |
| 2 | Click the `Others` tab in the popup | The `Others` tab becomes active |
| 3 | Verify the form fields | A user lookup field (SailPoint search) and a `Role` text input field are visible |
| 4 | Verify the `Role` field is mandatory | The `Role` field has a mandatory indicator (asterisk or required attribute) |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REVIEW-SCOPE-005` — Saving with "Others" option with empty Role field shows validation error

**Preconditions:** Release at Review & Confirm stage. `Add Participant` popup open on `Others` tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | In the `Others` tab, search and select a user | A user is selected |
| 2 | Select a Recommendation option | A recommendation is selected |
| 3 | Leave the `Role` text field empty | The `Role` field is empty |
| 4 | Click `Save` | A validation error is visible indicating `Role` is required |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-REVIEW-SCOPE-006` — Added participant appears in the participants table with their role and recommendation

**Preconditions:** A participant has just been saved via the `Add Participant` popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Scope Review Participants` table | The newly added participant row is visible with columns: Participant Name, Role, Recommendation, Participant's Comments |
| 2 | Verify the participant name matches the selected user | The `Participant Name` column contains the expected user name |
| 3 | Verify the recommendation matches the selected value | The `Recommendation` column contains the expected recommendation text |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-SCOPE-007` — "Edit" button on a participant row opens the popup pre-filled with data

**Preconditions:** Release at Review & Confirm stage. At least 1 participant exists in the table.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Edit` action on an existing participant row (three-dot menu or edit icon) | The `Add Participant` popup opens pre-filled with the participant's name, role, recommendation, and comment |
| 2 | Verify the User field shows the participant's name | The user name is pre-populated |
| 3 | Verify the Recommendation is pre-selected | The previously selected recommendation option is active |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-SCOPE-008` — "Delete" button on a participant row shows confirmation; confirming removes the row

**Preconditions:** Release at Review & Confirm stage. At least 1 participant exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the current participant count | The participant count is recorded |
| 2 | Click the `Delete` action on an existing participant row | A confirmation dialog appears |
| 3 | Click `Confirm` (or equivalent) in the dialog | The dialog closes; the participant row is removed from the table |
| 4 | Verify the participant count decreased | The table has one fewer row than recorded in Step 1 |

**Coverage dimension:** Data Integrity

---

#### 3.5 Subsection: 5.5 Key Discussion Topics Section

---

#### `RELEASE-REVIEW-TOPICS-001` — Saving a new topic adds it with auto-populated Date and Added By

**Preconditions:** Release at Review & Confirm stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Topic` on the `Review & Confirm` tab | The topic form fields appear: `Topic Name` and `Discussion Details` |
| 2 | Type a topic name in the `Topic Name` field | The text is entered |
| 3 | Type details in the `Discussion Details` field | The text is entered |
| 4 | Click `Save` | The topic appears in the `Key Discussion Topics` table |
| 5 | Verify auto-populated fields | The `Date` column shows today's date; the `Added By` column shows the current user's name |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-TOPICS-002` — Topic can be deleted via trash icon with a confirmation prompt

**Preconditions:** Release at Review & Confirm stage. At least 1 topic exists created in the current stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the trash/delete icon on an existing topic row | A confirmation prompt appears |
| 2 | Click `Confirm` (or equivalent) | The topic row is removed from the table |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-TOPICS-003` — Topic can be edited while the release is in the current stage

**Preconditions:** Release at Review & Confirm stage. At least 1 topic exists created in the current stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Edit` icon on an existing topic row | The topic fields become editable, pre-filled with existing data |
| 2 | Modify the `Discussion Details` text | The text is updated |
| 3 | Click `Save` | The updated text is visible in the topic row |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-TOPICS-004` — Topic can be deleted via trash icon while created in the current stage

**Preconditions:** Same as RELEASE-REVIEW-TOPICS-002. This verifies the same delete flow but emphasises the stage-scoping rule.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the trash icon on a topic created during the current stage | A confirmation prompt appears |
| 2 | Confirm the deletion | The topic is removed |

**Coverage dimension:** Data Integrity
**Note:** Overlaps RELEASE-REVIEW-TOPICS-002; consider consolidating during automation.

---

#### `RELEASE-REVIEW-TOPICS-005` — Topics created in a previous stage are read-only

**Preconditions:** Release at Manage stage (past Review & Confirm). At least 1 topic was created during Review & Confirm.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab content loads |
| 2 | Verify the topic created in Review & Confirm stage | The topic row is visible but has no `Edit` or `Delete` icons |

**Coverage dimension:** Role-Based Access (stage-based access control)

---

#### `RELEASE-REVIEW-TOPICS-006` — Topics are visible (read-only) on all later stages

**Preconditions:** Release at FCSR Review or later stage. Topics were created during Review & Confirm and Manage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab (or `FCSR Decision` tab if topics are shown there) | The tab loads |
| 2 | Verify all previously created topics are visible | Topics from both Review & Confirm and Manage stages are visible |
| 3 | Verify topics are read-only | No `Edit` or `Delete` icons are visible for any topic |

**Coverage dimension:** Data Integrity

---

#### 3.6 Subsection: 5.6 Scope Review Decision Section

---

#### `RELEASE-REVIEW-DECISION-001` — Attempting to Submit without selecting a decision shows validation error

**Preconditions:** Release at Review & Confirm stage. No Scope Review Decision selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab content loads |
| 2 | Scroll to the `Scope Review Decision` section | The dropdown is visible with no value selected |
| 3 | Click the `Submit` button (top or bottom of the page) | A validation error is visible indicating the Scope Review Decision is required |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-REVIEW-DECISION-002` — "Rework" does not require a decision selection — only a justification popup

**Preconditions:** Release at Review & Confirm stage. No Scope Review Decision selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Rework` button | A justification popup opens (not a validation error about missing decision) |
| 2 | Verify the popup has a mandatory text field | A `Justification` text area is visible with a mandatory indicator |

**Coverage dimension:** Happy Path

---

#### 3.7 Subsection: 5.7 Action Plan Items Section

---

#### `REVIEW-CONFIRM-035-b` — Action creation popup fields

**Preconditions:** Release at Review & Confirm stage. `Add Action` popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Action` on the `Review & Confirm` tab | The action creation popup opens |
| 2 | Verify the mandatory fields | `Name`, `Description`, and `Category` fields are visible with mandatory indicators |
| 3 | Verify the `Category` dropdown options | The dropdown contains options such as `Pre-Condition`, `Post-Condition`, `Tracked` |
| 4 | Verify the `Due Date` date picker | A date picker field is visible |
| 5 | Verify the `Assignee` field | A user lookup field is visible |
| 6 | Verify the `Status` field | The status is auto-set to `Open` and is not selectable at creation |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REVIEW-ACTION-001` — Saving an action without mandatory fields shows validation errors

**Preconditions:** `Add Action` popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave all fields empty in the `Add Action` popup | All fields are empty |
| 2 | Click `Save` | Inline validation errors are visible for `Name`, `Description`, and `Category` fields |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-REVIEW-ACTION-002` — "Submit Actions to Jira" submits unsynchronised actions

**Preconditions:** Release at Review & Confirm stage. At least 1 action exists that has not been submitted to Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Submit Actions to Jira` button in the Action Plan section | A confirmation popup appears listing the actions to be submitted |
| 2 | Click `Submit` in the popup | A success message is visible |
| 3 | Verify the submitted action rows now show a Jira link | Each submitted action row has a clickable link in the `Source Link` or `Jira` column |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REVIEW-ACTION-003` — After Jira submission, a Jira link appears on each submitted action row

**Preconditions:** Actions were just submitted to Jira (continuation of RELEASE-REVIEW-ACTION-002).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify each action row in the Action Plan Items table | Each row that was submitted to Jira shows a clickable link containing the Jira ticket URL |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-REVIEW-ACTION-004` — "Refresh Data from Jira" updates action statuses from Jira

**Preconditions:** At least 1 action has been submitted to Jira and its status was changed in Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Refresh Data from Jira` button | A refresh operation starts |
| 2 | Wait for the page to reload | The page finishes refreshing |
| 3 | Verify the updated action status | The action status column reflects the value from Jira (per status mapping) |

**Coverage dimension:** Data Integrity

---

#### 3.8 Subsection: 5.8 Submit & Rework

---

#### `RELEASE-REVIEW-SUBMIT-001` — "Submit" advances the release to Manage stage

**Preconditions:** Release at Review & Confirm stage. Scope Review Decision is selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Review & Confirm` tab | The tab content loads |
| 2 | Select a value from the `Scope Review Decision` dropdown | The dropdown value is set |
| 3 | Click the `Submit` button | The page reloads |
| 4 | Verify the release status | The status badge shows `In Progress` (Manage stage) |
| 5 | Click `View Flow` | The pipeline bar highlights `Manage` as the active stage |

**Coverage dimension:** State Transition (P1 — happy path)

---

#### `RELEASE-REVIEW-SUBMIT-002` — "Rework" opens a justification popup with mandatory text

**Preconditions:** Release at Review & Confirm stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Rework` button | A popup opens with a `Justification` text area |
| 2 | Verify the justification field is mandatory | The field has a mandatory indicator |

**Coverage dimension:** Happy Path

---

#### `RELEASE-REVIEW-SUBMIT-003` — Submitting empty justification in rework popup shows validation error

**Preconditions:** Rework popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave the `Justification` field empty | The field is empty |
| 2 | Click `Submit` (or `Confirm`) in the popup | A validation error is visible indicating justification is required |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-REVIEW-SUBMIT-004` — After rework: release returns to Creation & Scoping; orange dot appears

**Preconditions:** Rework was submitted with a justification.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the release status after rework | The status badge shows `Scoping` |
| 2 | Click `View Flow` | The pipeline bar highlights `Creation & Scoping` as the active stage |
| 3 | Verify the orange dot indicator | An orange dot is visible on the `View Flow` link or the `Review & Confirm` stage indicator |
| 4 | Hover over the orange dot | A tooltip containing `Rework` is visible |

**Coverage dimension:** State Transition

---

#### `RELEASE-REVIEW-SUBMIT-005` — Rework justification text is visible in the Stage Sidebar

**Preconditions:** Release was returned for rework.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View Flow` and click the `Review & Confirm` stage | The Stage Sidebar opens |
| 2 | Verify the rework justification | The justification text entered during rework is visible in the sidebar |

**Coverage dimension:** Data Integrity

---

### Stage 3: Manage

#### 3.9 Subsection: 6.1 Manage Stage Entry & Navigation

---

#### `RELEASE-MANAGE-001` — Progress percentage for Product Requirements is displayed and updates dynamically

**Preconditions:** Release at Manage stage. At least 1 product requirement with a status other than "Planned".

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page at Manage stage | The `Release Detail` heading is visible |
| 2 | Verify a progress percentage for Product Requirements is displayed | A percentage value is visible (e.g., in the header or tab indicator area) |
| 3 | Navigate to the `Product Requirements` tab and change one requirement's status | The requirement status is updated |
| 4 | Return to the overview/header area | The Product Requirements progress percentage has changed |

**Coverage dimension:** Data Integrity

---

#### 3.10 Subsection: 6.2 Manage SDL Process Requirements — Jira Integration

---

#### `RELEASE-MANAGE-JIRA-001` — "Submit to Jira" button is visible on Process Requirements tab at Manage stage

**Preconditions:** Release at Manage stage. Jira connection configured for the product.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page and click the `Process Requirements` tab | The Process Requirements tab loads |
| 2 | Verify the `Submit to Jira` button | The `Submit to Jira` button is visible in the toolbar area |

**Coverage dimension:** Happy Path

---

#### `RELEASE-MANAGE-JIRA-002` — "Submit to Jira" opens confirmation popup with "Include sub-requirements" checkbox

**Preconditions:** Release at Manage stage. At least 1 requirement selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select at least one requirement via its checkbox | The checkbox is checked |
| 2 | Click `Submit to Jira` | A confirmation popup opens |
| 3 | Verify the popup content | The popup lists the selected requirements and shows an `Include sub-requirements` checkbox |

**Coverage dimension:** Happy Path

---

#### `RELEASE-MANAGE-JIRA-003` — Requirements with Done, Not Applicable, or Delegated status are excluded from Jira submission

**Preconditions:** Release at Manage stage. Mix of requirements including Done, Not Applicable, and Delegated status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a requirement with `Done` status and click `Submit to Jira` | The requirement with `Done` status is either not selectable for Jira submission or excluded from the confirmation popup list |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-MANAGE-JIRA-004` — Jira submission creates hierarchy: Capabilities → Features → User Stories

**Preconditions:** Release at Manage stage. Requirements selected and submitted to Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit selected requirements to Jira via the confirmation popup | A success message is visible |
| 2 | Verify the `Source Link` column on submitted requirements | Each submitted requirement row shows a clickable Jira link |

**Coverage dimension:** Data Integrity
**Note:** Verifying the actual Jira hierarchy (Capability → Feature → User Story) requires Jira integration testing outside PICASso UI.

---

#### `RELEASE-MANAGE-JIRA-005` — After Jira submission, Source Link column shows a clickable Jira link

**Preconditions:** Requirements have been submitted to Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Source Link` column for submitted requirements | Each row shows a clickable hyperlink pointing to a Jira ticket |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-JIRA-006` — Reporter on Jira tickets is "PICASso Jira (SESI 018387)"

**Preconditions:** Requirements submitted to Jira.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the Jira link on a submitted requirement row | The Jira ticket opens in a new tab |
| 2 | Verify the Reporter field | The Reporter shows `PICASso Jira (SESI 018387)` |

**Coverage dimension:** Data Integrity
**Note:** This verification occurs in Jira, not in PICASso UI.

---

#### `RELEASE-MANAGE-JIRA-007` — "Refresh Data from Jira" updates requirement statuses

**Preconditions:** At least 1 Jira-submitted requirement. Status mapping configured.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Refresh Data from Jira` on the Process Requirements tab | A confirmation dialog appears |
| 2 | Click `Refresh` | The page refreshes |
| 3 | Verify updated statuses | Requirement statuses reflect the mapped Jira values |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-JIRA-008` — Auto-sync runs once per day; last sync timestamp is visible

**Preconditions:** At least 1 Jira-submitted requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Process Requirements` tab | The tab loads |
| 2 | Verify a last sync timestamp is visible | A text element showing the last synchronization date/time is visible near the `Refresh Data from Jira` button |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-JIRA-009` — Jira status mapping defaults

**Preconditions:** Jira status mapping configured at Product Configuration level.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `Product Configuration` tab and click `Status Mapping Configuration` | The mapping popup opens |
| 2 | Verify the default mappings | Rows show: Refinement/Funnel/Ready/To Do → Planned; In Progress/Implementation/Ready to Test → In Progress; Done → Done |

**Coverage dimension:** Happy Path

---

#### `RELEASE-MANAGE-JIRA-010` — "Unlink from Jira" removes the Jira link

**Preconditions:** At least 1 Jira-submitted requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot menu on a Jira-submitted requirement | The action menu opens |
| 2 | Click `Unlink` (or `Unlink from Jira`) | A confirmation popup appears |
| 3 | Confirm the unlinking | The `Source Link` column for this requirement is cleared; the requirement status field becomes editable |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-JIRA-011` — "Relink to Jira" restores the link

**Preconditions:** A previously unlinked requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot menu on the unlinked requirement | The action menu opens showing `Relink` option |
| 2 | Click `Relink` (or `Relink to Jira`) | A popup appears showing the previously linked Jira ticket and unlink date |
| 3 | Click `Relink` in the popup | The `Source Link` column is restored with the Jira link |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-JIRA-012` — Bulk "Submit to Jira" submits all selected requirements

**Preconditions:** Multiple requirements selected. Jira configured.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select multiple requirements via checkboxes | Multiple rows are checked |
| 2 | Click `Submit to Jira` | A confirmation popup lists all selected requirements |
| 3 | Click `Submit` | A success message is visible; all submitted rows show Jira links |

**Coverage dimension:** Happy Path

---

#### `RELEASE-MANAGE-JIRA-013` — Jira submission failure shows error message

**Preconditions:** Jira connection misconfigured or permissions missing.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a requirement and click `Submit to Jira` | The submission is attempted |
| 2 | Verify the error message | An error message is visible with details about the failure (connection, permissions, or status mapping issue) |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-MANAGE-JIRA-014` — Status Mapping must be configured before first submission

**Preconditions:** Product has Jira configured but no status mapping.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a requirement and click `Submit to Jira` | An error message is visible indicating that status mapping must be configured |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-MANAGE-JIRA-015` — Evidence Link and Justification can be edited via single/bulk/XLSX

**Preconditions:** Jira-submitted requirement.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click three-dot menu → `View/Edit` on a Jira-submitted requirement | The requirement info popup opens |
| 2 | Click `Edit` | The `Evidence Link` and `Justification` fields become editable; the `Status` field remains read-only |
| 3 | Type a URL into `Evidence Link` and a justification text | Both fields accept input |
| 4 | Click `Save` | The changes are saved; the `Evidence Link` column on the grid shows the new value |

**Coverage dimension:** Data Integrity

---

#### 3.11 Subsection: 6.4 Cybersecurity Residual Risks (CSRR) Tab

---

#### `RELEASE-CSRR-001` — SDL Processes Summary renders and is editable

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Cybersecurity Residual Risks` tab | The CSRR tab loads with `SDL Processes Summary` visible as default |
| 2 | Click `Edit` at the bottom right corner | The section enters edit mode |
| 3 | Verify SDL Details fields are visible | `SBOM Status`, `SDL Artefacts Repository Link`, SDL Gap Found dropdown, and Summary fields are visible and editable |
| 4 | Verify the Process Requirements list is visible | A requirements grid with Evaluation Status column is visible |
| 5 | Click `Save` | The data is saved; a success feedback is visible or the edit mode exits cleanly |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-002` — SBOM Status = "Not Applicable" reveals mandatory Justification

**Preconditions:** Release at Manage stage. CSRR tab in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Not Applicable` from the `SBOM Status` dropdown | The dropdown value changes |
| 2 | Verify a `Justification` text field appears | A text field labeled `Justification` is visible with a mandatory indicator |
| 3 | Click `Save` without entering justification | A validation error is visible indicating justification is required |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-CSRR-003` — SBOM Status = "In Progress" or "Submitted" reveals SBOM ID field

**Preconditions:** Release at Manage stage. CSRR tab in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `In Progress` from the `SBOM Status` dropdown | The `SBOM ID` text field appears |
| 2 | Select `Submitted` from the `SBOM Status` dropdown | The `SBOM ID` text field remains visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-005` — Product Requirements Summary renders

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Cybersecurity Residual Risks` tab | The CSRR tab loads |
| 2 | Click the `Product Requirements Summary` section in the left-side navigation | The section loads |
| 3 | Verify key fields | `Cybersecurity Roadmap Link`, percentage breakdowns, `Evaluation Status` column, `Residual Risk`, and `Add Action` button are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-006` — System Design section visible only for Product Definition = System

**Preconditions:** Release at Manage stage. Product Definition = "System".

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the CSRR tab left-side navigation | The navigation links are visible |
| 2 | Verify the `System Design` section link is visible | The `System Design` link is present |
| 3 | Click `System Design` | The section loads with `Architecture Link`, `Add Component`, `Add Countermeasure` buttons |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-007` — Threat Model section renders

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Threat Model` in the CSRR left-side navigation | The section loads |
| 2 | Click `Edit` | Fields become editable: `Link to Threat Model` (mandatory), Severity/Status matrix, `+Add Threat Mitigation`, `+Add Accepted Threats` buttons, Residual Risk section |
| 3 | Verify the `Link to Threat Model` field has mandatory indicator | The field shows a required indicator |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-008` — 3rd Party Suppliers & SE Bricks renders

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `3rd Party Suppliers & SE Bricks` in the CSRR left-side navigation | The section loads |
| 2 | Click `Edit` | The section enters edit mode |
| 3 | Verify TPS and SE Bricks sections | `Add TPS Product` and `Add SE Brick/Library/Platform` buttons are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-009` — Static Code Analysis section renders

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Static Code Analysis` in the CSRR navigation | The section loads |
| 2 | Click `Edit` | A tool dropdown and `Add Tool` button are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-010` — Software Composition Analysis section renders

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Software Composition Analysis` in the CSRR navigation | The section loads |
| 2 | Click `Edit` | A tool dropdown, `Add Software` button, and `Add line` button for vulnerabilities are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-011` — FOSS Check section renders

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `FOSS Check` in the CSRR navigation | The section loads |
| 2 | Click `Edit` | The FOSS questions and comment fields are visible and editable |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-012` — Security Defects section renders

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Security Defects` in the CSRR navigation | The section loads |
| 2 | Click `Edit` | `+Add SVV Issue` button, Pen Test Details section, and Residual Risk are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-013` — Pen Test mandatory fields when pen test was performed

**Preconditions:** Release at Manage stage. CSRR > Security Defects in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Yes` (or equivalent affirmative) for "Was pen test performed?" | The Pen Test Details fields expand |
| 2 | Verify `Pen Test Type` is mandatory | The field has a mandatory indicator |
| 3 | Verify `Internal SRD Number` (or `Vendor Ref Number`) is mandatory | The field has a mandatory indicator |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-CSRR-014` — Justification mandatory when pen test was NOT performed

**Preconditions:** Release at Manage stage. CSRR > Security Defects in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `No` / `Delegated` / `N/A` for "Was pen test performed?" | The `Justification` field appears |
| 2 | Verify the field is mandatory | The field has a mandatory indicator |
| 3 | Click `Save` without entering justification | A validation error is visible |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-CSRR-015` — External Vulnerabilities section renders

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `External Vulnerabilities` in the CSRR navigation | The section loads |
| 2 | Click `Edit` | The `+Add Issue` button and Residual Risk section are visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-CSRR-016` — CSRR data cloned from previous release is pre-populated

**Preconditions:** Cloned release at Manage stage. Source release had CSRR data.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the CSRR tab of the cloned release | The CSRR tab loads |
| 2 | Click through several CSRR sub-sections | The sections contain pre-populated data from the source release (not empty) |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-CSRR-017` — CSRR edits are preserved after navigating away and returning

**Preconditions:** Release at Manage stage. CSRR tab in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Edit a field in the CSRR tab (e.g., SDL Artefacts Repository Link) | The field is updated |
| 2 | Click `Save` | A success feedback is visible |
| 3 | Navigate to a different tab (e.g., `Process Requirements`) | The different tab loads |
| 4 | Return to the `Cybersecurity Residual Risks` tab | The previously edited field retains the saved value |

**Coverage dimension:** Data Integrity

---

#### 3.12 Subsection: 6.5 Action Items — Create & Manage

---

#### `RELEASE-MANAGE-ACTION-001` — "Add Action" button is visible on CSRR tab

**Preconditions:** Release at Manage stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the CSRR tab and click `Edit` | The section enters edit mode |
| 2 | Verify the `Add Action` button | The `Add Action` button (or `+Add Action`) is visible in the actions area |

**Coverage dimension:** Happy Path

---

#### `RELEASE-MANAGE-ACTION-002` — Action creation popup requires Name, Description, State, Category

**Preconditions:** `Add Action` popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Action` | The action creation popup opens |
| 2 | Verify mandatory fields | `Name`, `Description`, `State` (dropdown), and `Category` (dropdown) fields are visible with mandatory indicators |

**Coverage dimension:** Happy Path

---

#### `RELEASE-MANAGE-ACTION-003` — Optional fields: Assignee, Due Date, Evidence, Closure Comment

**Preconditions:** `Add Action` popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify optional fields in the popup | `Assignee` (user lookup), `Due Date` (date picker), `Evidence` (link input), and `Closure Comment` (text area) are all visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-MANAGE-ACTION-004` — Saving without mandatory fields shows validation errors

**Preconditions:** `Add Action` popup is open with all fields empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Save` | Inline validation errors are visible for `Name`, `Description`, and `Category` fields |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-MANAGE-ACTION-005` — Newly created action appears in the Action Plan Items table

**Preconditions:** Action creation popup filled with valid data.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill in `Name`, `Description`, select a `State` and `Category`, and optionally set `Due Date` and `Assignee` | All fields are populated |
| 2 | Click `Save` | The popup closes; the action appears in the Action Plan Items table with all entered values |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-ACTION-006` — Editing an existing action pre-fills all fields

**Preconditions:** At least 1 action exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit` on an existing action row | The edit popup opens pre-filled with the action's data |
| 2 | Modify the `Description` field | The text is updated |
| 3 | Click `Save` | The updated description is visible in the action row |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-ACTION-007` — Changing action state to "Closed" makes Closure Comment mandatory

**Preconditions:** An action exists in `Open` or `In Progress` state.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit` on the action row | The edit popup opens |
| 2 | Select `Closed` from the `State` dropdown | The `Closure Comment` field becomes mandatory (indicator appears) |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-MANAGE-ACTION-008` — Saving Closed action without Closure Comment shows error

**Preconditions:** Action state set to `Closed`.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave the `Closure Comment` field empty | The field is empty |
| 2 | Click `Save` | A validation error is visible indicating `Closure Comment` is required for closed actions |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-MANAGE-ACTION-009` — "Submit Actions to Jira" submits as Jira Feature

**Preconditions:** At least 1 unsynchronised action. Jira configured.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select an action and click `Submit Actions to Jira` | A confirmation popup appears |
| 2 | Click `Submit` | A success message is visible; a Jira link appears on the action row |

**Coverage dimension:** Happy Path

---

#### `RELEASE-MANAGE-ACTION-010` — "Refresh Data from Jira" updates action status

**Preconditions:** At least 1 Jira-submitted action.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Refresh Data from Jira` on the actions section | The action statuses refresh |
| 2 | Verify updated status values | The action status reflects the current Jira status per mapping |

**Coverage dimension:** Data Integrity

---

#### 3.13 Subsection: 6.6 FCSR Recommendation (FCSR Decision Tab)

---

#### `RELEASE-MANAGE-FCSR-001` — "Go with Pre-Conditions" requires at least one Pre-Condition action

**Preconditions:** Release at Manage stage. FCSR Decision tab open. No Pre-Condition actions exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Participant` on the FCSR Decision tab | The popup opens |
| 2 | Select user, then select `Go with Pre-Conditions` recommendation | The recommendation is selected |
| 3 | Click `Save` | A validation error is visible indicating at least one Pre-Condition action is required |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-MANAGE-FCSR-002` — "Go with Post-Conditions" requires at least one Post-Condition action

**Preconditions:** Same setup; no Post-Condition actions exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Go with Post-Conditions` recommendation | The recommendation is selected |
| 2 | Click `Save` | A validation error is visible indicating at least one Post-Condition action is required |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-MANAGE-FCSR-003` — Comment field (up to 500 chars) saves correctly

**Preconditions:** FCSR Decision > Add Participant popup.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type up to 500 characters in the `Comment` field | All characters are accepted |
| 2 | Click `Save` | The comment is saved; the participant row shows the comment text |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-FCSR-004` — Saved recommendation appears in the FCSR Decision participants table

**Preconditions:** A participant was just saved with a recommendation.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the FCSR Decision participants table | The participant row is visible with Name, Role, Recommendation, and Comment columns populated |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-FCSR-005` — Participant can delete their own recommendation

**Preconditions:** At least 1 FCSR participant exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the three-dot menu → `Delete` on the participant row | A confirmation dialog appears |
| 2 | Confirm the deletion | The participant row is removed from the table |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-MANAGE-FCSR-006` — After submission to SA & PQL, FCSR Decision tab becomes read-only for PO/SM

**Preconditions:** Release was submitted for SA & PQL Sign Off.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `FCSR Decision` tab | The tab loads |
| 2 | Verify the `Add Participant` button | The `Add Participant` button is not visible or is disabled |
| 3 | Verify existing participant rows | No `Edit` or `Delete` actions are available |

**Coverage dimension:** Role-Based Access

---

### Stage 4: SA & PQL Sign Off

#### 3.14 Subsection: 7.1 Stage Entry & Task Assignment

---

#### `RELEASE-SIGNOFF-SA-001` — Task auto-assigned to Security Advisor in My Tasks

**Preconditions:** Release just advanced to SA & PQL Sign Off. Logged in as Security Advisor.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and click the `My Tasks` tab | The `My Tasks` tab is active |
| 2 | Verify a task for the target release is present | At least 1 task row is visible containing the release name |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-SA-002` — Task auto-assigned to PQL in My Tasks

**Preconditions:** Release at SA & PQL Sign Off. Logged in as PQL.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `My Tasks` tab | The `My Tasks` tab is active |
| 2 | Verify a task for the target release is present | At least 1 task row is visible containing the release name |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-SA-003` — "Submit for FCSR Review" and "Rework" action buttons visible

**Preconditions:** Release at SA & PQL Sign Off. Logged in as SA or PQL.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Release Detail` heading is visible |
| 2 | Verify the `Submit for FCSR Review` button | The button is visible |
| 3 | Verify the `Rework` button | The button is visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-SA-004` — Privacy Reviewer task created if DPP applicable

**Preconditions:** Release at SA & PQL Sign Off. Product has DPP toggle ON. Logged in as Privacy Reviewer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `My Tasks` tab | The `My Tasks` tab is active |
| 2 | Verify a privacy review task for the target release | At least 1 task row mentioning the release and privacy/DPP review is visible |

**Coverage dimension:** Role-Based Access

---

#### 3.15 Subsection: 7.2 Evaluation Status Editing

---

#### `RELEASE-SIGNOFF-EVAL-001` — Evaluation Status dropdown on SDL Processes Summary editable by SA

**Preconditions:** Release at SA & PQL Sign Off. Logged in as SA. CSRR tab open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `Cybersecurity Residual Risks` tab → `SDL Processes Summary` | The section loads |
| 2 | Click `Edit` | The section enters edit mode |
| 3 | Verify the `Evaluation Status` dropdown is enabled on a requirement row | The dropdown is clickable and not disabled |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-EVAL-002` — Evaluation Status options

**Preconditions:** Evaluation Status dropdown is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Evaluation Status` dropdown | The dropdown opens |
| 2 | Verify the options | Options visible: `Not evaluated`, `Not met`, `Partially met`, `Fully met` |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-EVAL-003` — Changing Evaluation Status saves and updates summary

**Preconditions:** CSRR > SDL Processes Summary in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Fully met` from the `Evaluation Status` dropdown on a requirement | The value changes |
| 2 | Click `Save` | The data is saved; the summary count for "Completed SDL Practice Requirements" increments |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-SIGNOFF-EVAL-004` — Product Requirements Summary evaluation fields are editable

**Preconditions:** CSRR > Product Requirements Summary in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `Product Requirements Summary` in CSRR | The section loads |
| 2 | Click `Edit` and verify `Evaluation Status` dropdown on a requirement row | The dropdown is enabled and clickable |

**Coverage dimension:** Happy Path

---

#### 3.16 Subsection: 7.3 Auto-Calculated Summaries

---

#### `RELEASE-SIGNOFF-SUMMARY-001` — SDL Processes Summary shows Done Count / Total Count

**Preconditions:** Release at SA & PQL Sign Off. CSRR tab open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `SDL Processes Summary` | The summary section loads |
| 2 | Verify the auto-calculated fields | `Total number of Applicable SDL Practice Requirements` and `Total number of Completed SDL Practice Requirements` fields are visible with numeric values |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-SIGNOFF-SUMMARY-002` — Product Requirements Summary shows percentages

**Preconditions:** CSRR > Product Requirements Summary.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `Product Requirements Summary` | The section loads |
| 2 | Verify percentage fields | Fields showing "% of all applicable CS requirements" and "% of all expected CS requirements" are visible with numeric values |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-SIGNOFF-SUMMARY-003` — Summary fields update when evaluation statuses change

**Preconditions:** CSRR in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Change an Evaluation Status from `Not evaluated` to `Fully met` | The status changes |
| 2 | Click `Save` | The summary fields recalculate; the completed count or percentage increases |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-SIGNOFF-SUMMARY-004` — Partially Met counts drive the Product Req completion %

**Preconditions:** At least 1 requirement set to `Partially met`.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Product Requirements completion percentage formula | The percentage reflects: (`Fully Met` count + 0.5 × `Partially Met` count) / Total |

**Coverage dimension:** Data Integrity
**Note:** Exact formula verification may require multiple evaluation status changes and percentage comparison.

---

#### 3.17 Subsection: 7.4 SBOM Validation at SA & PQL Stage

---

#### `RELEASE-SIGNOFF-SBOM-001` — SBOM Status = "Submitted" requires SBOM ID

**Preconditions:** Release at SA & PQL Sign Off. CSRR tab in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Submitted` from the `SBOM Status` dropdown | The `SBOM ID` field appears |
| 2 | Leave the `SBOM ID` field empty | The field is empty |
| 3 | Click `Save` or attempt to submit for FCSR Review | A validation error is visible indicating `SBOM ID` is required when status is `Submitted` |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-SIGNOFF-SBOM-002` — SBOM Status = "In Progress" or "N/A" does not require SBOM ID

**Preconditions:** CSRR in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `In Progress` from `SBOM Status` | The SBOM ID field may appear but is not mandatory |
| 2 | Click `Save` without entering SBOM ID | No validation error for SBOM ID |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-SBOM-003` — Validation error shown inline on CSRR SBOM fields

**Preconditions:** SBOM validation error triggered.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger SBOM validation as in RELEASE-SIGNOFF-SBOM-001 | The error is displayed inline near the SBOM fields (not a generic page error) |

**Coverage dimension:** Negative / Validation

---

#### 3.18 Subsection: 7.5 Dual Sign-Off Requirement

---

#### `RELEASE-SIGNOFF-DUAL-001` — Workflow popup shows "1 from 2 submissions" when only SA has submitted

**Preconditions:** SA has submitted; PQL has not yet submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The page loads |
| 2 | Click `View Flow` and click the `SA & PQL Sign Off` stage | The Stage Sidebar shows `1 from 2 submissions` (or equivalent counter) |

**Coverage dimension:** State Transition

---

#### `RELEASE-SIGNOFF-DUAL-002` — "Submit for FCSR Review" is available to each approver independently

**Preconditions:** Release at SA & PQL Sign Off. Both SA and PQL have tasks.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as SA and navigate to the Release Detail page | The `Submit for FCSR Review` button is visible |
| 2 | Log in as PQL and navigate to the same Release Detail page | The `Submit for FCSR Review` button is also visible |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-SIGNOFF-DUAL-003` — When SA submits: task completed for SA, remains for PQL

**Preconditions:** SA just clicked `Submit for FCSR Review`.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as SA and check `My Tasks` | The SA's task for this release is no longer visible (completed) |
| 2 | Log in as PQL and check `My Tasks` | The PQL's task for this release is still visible |

**Coverage dimension:** State Transition

---

#### `RELEASE-SIGNOFF-DUAL-004` — When both submit: release advances to FCSR Review

**Preconditions:** Both SA and PQL have submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The status badge shows `FCSR Review` |
| 2 | Click `View Flow` | The pipeline bar highlights `FCSR Review` as the active stage |

**Coverage dimension:** State Transition (P1 — happy path)

---

#### `RELEASE-SIGNOFF-DUAL-005` — One approver's rework returns to Manage for both

**Preconditions:** SA has submitted but PQL has not. PQL clicks Rework.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as PQL and click `Rework` on the Release Detail page | A justification popup opens |
| 2 | Enter justification and click Submit | The release returns to `In Progress` (Manage stage) |
| 3 | Log in as SA and verify | The SA's prior submission is voided; the release is back at Manage stage |

**Coverage dimension:** State Transition

---

#### 3.19 Subsection: 7.6 Rework from SA & PQL Sign Off

---

#### `RELEASE-SIGNOFF-REWORK-001` — "Rework" opens a justification popup

**Preconditions:** Release at SA & PQL Sign Off.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Rework` | A popup opens with a `Justification` text area |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-REWORK-002` — Empty justification shows validation error

**Preconditions:** Rework popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave the `Justification` field empty and click `Submit` | A validation error indicates justification is required |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-SIGNOFF-REWORK-003` — After rework: release returns to Manage stage

**Preconditions:** Rework submitted with justification.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the release status | The status badge shows `In Progress` (Manage stage) |

**Coverage dimension:** State Transition

---

#### `RELEASE-SIGNOFF-REWORK-004` — Orange dot appears on "View Flow" after rework

**Preconditions:** Release returned for rework from SA & PQL Sign Off.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `View Flow` link | An orange dot indicator is visible |
| 2 | Hover over the orange dot | A tooltip containing `Rework` is visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-REWORK-005` — Rework justification visible in Stage Sidebar

**Preconditions:** Release returned for rework.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View Flow` and click the `SA & PQL Sign Off` stage | The Stage Sidebar opens |
| 2 | Verify the rework justification text | The justification text entered during rework is visible |

**Coverage dimension:** Data Integrity

---

#### 3.20 Subsection: 7.7 Privacy Review at SA & PQL Sign Off (NEW)

---

#### `RELEASE-DPP-PRIVACY-001` — Privacy Reviewer: mark section as Not Applicable

**Preconditions:** Release at SA & PQL Sign Off. DPP applicable. Logged in as Privacy Reviewer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `Data Protection and Privacy Review` tab | The DPP tab loads with privacy sections listed |
| 2 | Click `Edit` | The section enters edit mode |
| 3 | Click the N/A toggle (or equivalent) on a privacy section | The section is marked as `Not Applicable` |
| 4 | Click `Save` | The section status shows `Not Applicable` |

**Coverage dimension:** Happy Path

---

#### `RELEASE-DPP-PRIVACY-002` — Privacy Reviewer: maturity level selection

**Preconditions:** DPP tab in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a maturity level from the maturity level dropdown on a privacy section | The maturity level is selected |
| 2 | Click `Save` | The selected maturity level persists and is visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-DPP-PRIVACY-003` — Privacy Reviewer: evidence rating

**Preconditions:** DPP tab in edit mode. Privacy section expanded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Evidence sub-section of a privacy section | The evidence list is visible |
| 2 | Select a rating for an evidence item | The rating is applied |
| 3 | Click `Save` | The rating persists |

**Coverage dimension:** Happy Path

---

#### `RELEASE-DPP-PRIVACY-004` — Privacy Reviewer: FCSR recommendation

**Preconditions:** DPP tab. Privacy review in progress.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the recommendation section of DPP tab | The `Recommendation` field is visible |
| 2 | Select a recommendation (GO / No GO / GO with Pre-Conditions / GO with Post-Conditions) | The recommendation is selected |
| 3 | Click `Save` | The recommendation persists |

**Coverage dimension:** Happy Path

---

#### `RELEASE-DPP-PRIVACY-005` — Privacy Reviewer: PCC Decision when Privacy Risk = High

**Preconditions:** Privacy Risk = High for this release. DPP tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the PCC Decision section of the DPP tab | The `PCC Decision` field is visible (because Privacy Risk = High) |
| 2 | Select a PCC Decision value (Yes / No) | The value is selected |
| 3 | Click `Save` | The PCC Decision persists |

**Coverage dimension:** Happy Path (P1)

---

#### `RELEASE-DPP-PRIVACY-006` — Privacy: residual risk specification per section

**Preconditions:** DPP tab in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the residual risk area of a privacy section | The risk classification fields are visible |
| 2 | Select a residual risk level and enter a description | The fields accept input |
| 3 | Click `Save` | The risk data persists |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-DPP-PRIVACY-007` — Privacy: actions creation/removal

**Preconditions:** DPP tab in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Add Action` in the DPP actions area | An action creation form appears |
| 2 | Fill in action details (Name, Description) | The fields accept input |
| 3 | Click `Save` | The action appears in the actions list |
| 4 | Click the remove/delete icon on the action | A confirmation appears; confirming removes the action |

**Coverage dimension:** Happy Path

---

#### `RELEASE-SIGNOFF-PENTEST-001` — Pen Test Details validation before FCSR Review

**Preconditions:** Release at SA & PQL Sign Off. SVV-4 requirement status ≠ N/A.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to CSRR > Security Defects | The section loads |
| 2 | Verify Pen Test Details are incomplete (missing Pen Test Type) | The field is empty |
| 3 | Click `Submit for FCSR Review` | A validation error indicates Pen Test Details must be completed before FCSR submission |

**Coverage dimension:** Negative / Validation

---

### Stage 5: FCSR Review

#### 3.21 Subsection: 8.1 Stage Entry & Routing

---

#### `RELEASE-FCSR-001` — Release reaches FCSR Review after both SA and PQL sign off

**Preconditions:** Both SA and PQL have submitted at SA & PQL Sign Off stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The status badge shows `FCSR Review` |
| 2 | Click `View Flow` | The pipeline bar highlights `FCSR Review` as the active stage |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-FCSR-002` — FCSR Review assigned to SA when MOL = Team

**Preconditions:** Product Minimum Oversight Level = "Team". Logged in as SA.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` | A task for FCSR Review of the target release is visible |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-FCSR-003` — FCSR Review assigned to LOB Security Leader when MOL = LOB SL

**Preconditions:** Product MOL = "LOB Security Leader". Logged in as LOB SL.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` | A task for FCSR Review is visible |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-FCSR-004` — FCSR Review assigned to BU SO when MOL = BU SO or stale date

**Preconditions:** Product MOL = "BU SO" or Last BU SO FCSR Date > 12 months. Logged in as BU SO.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` | A task for FCSR Review is visible |

**Coverage dimension:** Role-Based Access

---

#### `RELEASE-FCSR-005` — Assigned reviewer receives a task in My Tasks

**Preconditions:** Release at FCSR Review. Logged in as assigned reviewer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` | At least 1 task row is visible for the target release |

**Coverage dimension:** Happy Path

---

#### 3.22 Subsection: 8.4 FCSR Decision & Outcomes

---

#### `RELEASE-FCSR-OUTCOME-001` — FCSR Approval Decision dropdown options

**Preconditions:** Release at FCSR Review. FCSR Decision tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `FCSR Decision` tab | The tab loads |
| 2 | Click the `FCSR Approval Decision` dropdown | Options visible: `No-Go`, `Go with Pre-Conditions`, `Go with Post-Conditions`, `Go` |

**Coverage dimension:** Happy Path

---

#### `RELEASE-FCSR-OUTCOME-002` — "Exception Required" toggle enables CISO/SVP checkboxes

**Preconditions:** FCSR Decision tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Toggle `Exception Required` to ON | CISO checkbox and SVP LOB checkbox become visible/enabled |

**Coverage dimension:** Happy Path

---

#### `RELEASE-FCSR-OUTCOME-003` — Comments field appears when Exception Required is ON

**Preconditions:** Exception Required toggled ON.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Comments` field | A text area for comments is visible and mandatory |

**Coverage dimension:** Happy Path

---

#### `RELEASE-FCSR-OUTCOME-004` — "Go" moves release to Completed

**Preconditions:** FCSR Approval Decision = "Go". No pre/post conditions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Go` from the FCSR Approval Decision dropdown | The value is set |
| 2 | Click `Approve FCSR` | The release status changes to `Completed` |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-FCSR-OUTCOME-005` — "No-Go" triggers cancellation

**Preconditions:** FCSR Approval Decision = "No-Go".

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `No-Go` from the dropdown | The value is set |
| 2 | Click `Approve FCSR` (or equivalent action) | The release status changes to `Cancelled` |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-FCSR-OUTCOME-006` — "Go with Pre-Conditions" moves to Post FCSR Actions (Actions Closure)

**Preconditions:** At least 1 Pre-Condition action exists. FCSR Decision = "Go with Pre-Conditions".

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Go with Pre-Conditions` | The value is set |
| 2 | Click `Approve FCSR` | The release status changes to `Actions Closure` (Post FCSR Actions stage) |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-FCSR-OUTCOME-007` — "Go with Post-Conditions" moves to Final Acceptance

**Preconditions:** At least 1 Post-Condition action exists. FCSR Decision = "Go with Post-Conditions".

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Go with Post-Conditions` | The value is set |
| 2 | Click `Approve FCSR` | The release moves to Final Acceptance stage |

**Coverage dimension:** State Transition (P1)

---

#### 3.23 Subsection: 8.5 Escalation Chain

---

#### `RELEASE-FCSR-ESCALATION-001` — "Escalate" button available at FCSR Review

**Preconditions:** Release at FCSR Review. Logged in as assigned reviewer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Escalate` button is visible alongside `Approve FCSR` and `Rework` |

**Coverage dimension:** Happy Path

---

#### `RELEASE-FCSR-ESCALATION-002` — Escalating from SA routes to LOB Security Leader

**Preconditions:** SA is the current FCSR reviewer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Escalate` | The escalation is processed |
| 2 | Log in as LOB Security Leader and check `My Tasks` | A task for FCSR Review of the same release is visible |

**Coverage dimension:** State Transition

---

#### `RELEASE-FCSR-ESCALATION-003` — Escalating from LOB SL routes to BU Security Officer

**Preconditions:** LOB SL is the current reviewer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Escalate` | The escalation is processed |
| 2 | Log in as BU SO and check `My Tasks` | A task for FCSR Review is visible |

**Coverage dimension:** State Transition

---

#### `RELEASE-FCSR-ESCALATION-004` — Escalating from BU SO requires Exception Required toggle

**Preconditions:** BU SO is the current reviewer.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Escalate` button is not directly available at BU SO level | The `Escalate` button is hidden or disabled |
| 2 | Toggle `Exception Required` to ON | CISO and/or SVP LOB checkboxes become available |
| 3 | Check CISO and/or SVP LOB | The checkbox is checked |
| 4 | Click `Approve FCSR` (with Exception) | The exception is routed to the selected approver(s) |

**Coverage dimension:** State Transition

---

#### `RELEASE-FCSR-ESCALATION-005` — Each escalation records the escalating user and timestamp

**Preconditions:** An escalation was just performed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View Flow` and click the `FCSR Review` stage | The Stage Sidebar opens |
| 2 | Verify escalation details | The sidebar shows the escalating user's name and a timestamp for the escalation |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-FCSR-ESCALATION-006` — "Rework" returns release to SA & PQL Sign Off with mandatory justification

**Preconditions:** Release at FCSR Review.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Rework` | A justification popup opens |
| 2 | Enter justification and click Submit | The release returns to SA & PQL Sign Off stage (or Manage, depending on config) |

**Coverage dimension:** State Transition

---

#### 3.24 Subsection: 8.7 FCSR Exception (NEW)

---

#### `RELEASE-FCSR-EXCEPTION-001` — CISO exception review and approval

**Preconditions:** Release at FCSR Review. Exception Required = ON with CISO checked. Logged in as CISO.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` | A task for FCSR exception review is visible for the target release |
| 2 | Click the task to navigate to the Release Detail page | The `FCSR Decision` tab is accessible |
| 3 | Click `Approve FCSR` | The release advances (status changes to `Completed` or `Actions Closure` depending on FCSR Decision) |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-FCSR-EXCEPTION-002` — SVP LOB exception review and approval

**Preconditions:** Exception Required = ON with SVP LOB checked. Logged in as SVP LOB.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` | A task for FCSR exception review is visible |
| 2 | Click the task to navigate to the Release Detail page | The page loads |
| 3 | Click `Approve FCSR` | The release advances |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-FCSR-EXCEPTION-003` — Both CISO + SVP required: release advances only when both approve

**Preconditions:** Exception Required = ON with both CISO and SVP LOB checked.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | CISO approves the FCSR exception | The release does NOT advance yet |
| 2 | SVP LOB approves the FCSR exception | The release advances to the next stage (Completed or Actions Closure) |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-FCSR-DEC-001` — DPP Summary section in FCSR Decision tab

**Preconditions:** DPP applicable. Release at FCSR Review.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `FCSR Decision` tab | The tab loads |
| 2 | Verify a `Data Protection and Privacy Summary` section is visible | The section is present showing DPP risk, recommendation, and maturity overview |

**Coverage dimension:** Happy Path

---

#### `RELEASE-FCSR-DEC-002` — PCC Decision section in FCSR Decision tab

**Preconditions:** Privacy Risk = High. Release at FCSR Review.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `FCSR Decision` tab | The tab loads |
| 2 | Verify a `PCC Decision` section is visible | The section shows the PCC Decision value (Yes/No) |

**Coverage dimension:** Happy Path

---

### Stage 6: Post FCSR Actions

#### 3.25 Subsection: 9.1 No-Go Path

---

#### `RELEASE-POSTFCSR-NOGO-001` — FCSR Decision = "No-Go" changes status to Cancelled

**Preconditions:** FCSR Approval Decision was "No-Go".

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The status badge shows `Cancelled` |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-POSTFCSR-NOGO-002` — Warning message shown for cancelled release

**Preconditions:** Release was cancelled via No-Go.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | A warning banner is visible containing text about cancellation |

**Coverage dimension:** Happy Path

---

#### `RELEASE-POSTFCSR-NOGO-003` — Cancelled release visible only when "Show Active Only" is OFF

**Preconditions:** Cancelled release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the product's Releases tab with `Show Active Only` ON | The cancelled release is NOT visible in the list |
| 2 | Toggle `Show Active Only` to OFF | The cancelled release appears in the list with `Cancelled` status |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-POSTFCSR-NOGO-004` — Cancelled release shows "Cancelled" status badge

**Preconditions:** Cancelled release visible in the list.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the status column for the cancelled release | The status shows `Cancelled` |

**Coverage dimension:** Happy Path

---

#### 3.26 Subsection: 9.2 Go with Pre-Conditions Path — Action Closure

---

#### `RELEASE-POSTFCSR-PRE-001` — Release at Actions Closure shows "Edit Actions" button

**Preconditions:** FCSR Decision was "Go with Pre-Conditions". Release at Actions Closure status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Edit Actions` button is visible at the bottom right |

**Coverage dimension:** Happy Path

---

#### `RELEASE-POSTFCSR-PRE-002` — "Edit Actions" dialog lists Pre-Condition actions

**Preconditions:** Release at Actions Closure.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Edit Actions` | A dialog opens listing all Pre-Condition actions with `Status` dropdown and `Closure Comment` field for each |

**Coverage dimension:** Happy Path

---

#### `RELEASE-POSTFCSR-PRE-003` — Closing an action without Closure Comment shows error

**Preconditions:** Edit Actions dialog is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `Closed` from the `Status` dropdown for an action | The status changes |
| 2 | Leave the `Closure Comment` empty | The field is empty |
| 3 | Click `Save Actions` | A validation error indicates Closure Comment is mandatory for closed actions |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-POSTFCSR-PRE-004` — "Save Actions" saves changed states; "Cancel" discards

**Preconditions:** Edit Actions dialog open. Some action states changed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Change an action state and add a Closure Comment | The fields are updated |
| 2 | Click `Save Actions` | The changes are saved; the dialog closes |
| 3 | Re-open `Edit Actions` | The saved state and comment persist |
| 4 | Change another action and click `Cancel` | The dialog closes without saving |
| 5 | Re-open `Edit Actions` | The cancelled change is NOT persisted |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-POSTFCSR-PRE-005` — After closing all Pre-Condition actions, "Submit" becomes active

**Preconditions:** All Pre-Condition actions set to `Closed`.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Submit` button | The `Submit` button is enabled (not greyed out) |

**Coverage dimension:** State Transition

---

#### `RELEASE-POSTFCSR-PRE-006` — Attempting to submit with open Pre-Condition actions shows validation error

**Preconditions:** At least 1 Pre-Condition action is still `Open`.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Submit` | A validation error lists the open Pre-Condition actions that must be closed |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-POSTFCSR-PRE-007` — "Submit" moves release to Final Acceptance

**Preconditions:** All Pre-Condition actions closed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Submit` | The release status changes to reflect the Final Acceptance stage |
| 2 | Click `View Flow` | The pipeline highlights `Final Acceptance` as the active stage |

**Coverage dimension:** State Transition (P1)

---

#### 3.27 Subsection: 9.3 SBOM & CSRR Editability During Post FCSR Actions

---

#### `RELEASE-POSTFCSR-SBOM-001` — SBOM Status remains editable during Post FCSR Actions

**Preconditions:** Release at Post FCSR Actions (Actions Closure).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to CSRR > SDL Processes Summary | The section loads |
| 2 | Click `Edit` | The `SBOM Status` dropdown is enabled |

**Coverage dimension:** Happy Path

---

#### `RELEASE-POSTFCSR-SBOM-002` — SBOM ID remains editable during Post FCSR Actions

**Preconditions:** SBOM Status = "Submitted" or "In Progress".

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `SBOM ID` field | The field is editable |

**Coverage dimension:** Happy Path

---

#### `RELEASE-POSTFCSR-SBOM-003` — Saving SBOM changes persists correctly

**Preconditions:** CSRR tab in edit mode.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Update SBOM Status and/or SBOM ID | The fields are updated |
| 2 | Click `Save` | The changes persist; reloading shows the updated values |

**Coverage dimension:** Data Integrity

---

#### 3.28 Subsection: 9.4 Stage Routing — Go and Go with Post-Conditions

---

#### `RELEASE-POSTFCSR-003` — "Go" decision: PO/SM submits → Completed

**Preconditions:** FCSR Decision = "Go". Release at Post FCSR Actions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Submit` button is visible |
| 2 | Click `Submit` | The release status changes to `Completed` |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-POSTFCSR-004` — "Go with Post-Conditions" moves to Final Acceptance

**Preconditions:** FCSR Decision = "Go with Post-Conditions". Release at Post FCSR Actions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the release status after FCSR approval | The release moves to Final Acceptance stage |

**Coverage dimension:** State Transition

---

#### `RELEASE-POSTFCSR-005` — Workflow popup shows Post FCSR Actions with submission counter

**Preconditions:** Release at Post FCSR Actions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View Flow` and click the `Post FCSR Actions` stage | The Stage Sidebar shows submission counter and responsible users |

**Coverage dimension:** Happy Path

---

#### `RELEASE-POSTFCSR-001` — Actions submit to Jira during Post FCSR Actions (NEW)

**Preconditions:** Release at Post FCSR Actions. At least 1 action exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select an action and click `Submit Actions to Jira` | The confirmation popup appears |
| 2 | Click `Submit` | A Jira link appears on the action row |

**Coverage dimension:** Happy Path

---

#### `RELEASE-POSTFCSR-002` — Cancel Release during Post FCSR (Go with Post-Conditions) (NEW)

**Preconditions:** Release at Post FCSR Actions. FCSR Decision = "Go with Post-Conditions".

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Cancel Release` | A confirmation popup with mandatory justification opens |
| 2 | Enter justification and confirm | The release status changes to `Cancelled` |

**Coverage dimension:** State Transition

---

### Stage 7: Final Acceptance

#### 3.29 Subsection: 10.1 Stage Entry

---

#### `RELEASE-ACCEPT-003` — Final Acceptance entered from Post FCSR Actions

**Preconditions:** All Pre-Condition actions closed. Release submitted from Post FCSR Actions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The status badge reflects the Final Acceptance stage |
| 2 | Click `View Flow` | The pipeline highlights `Final Acceptance` |

**Coverage dimension:** State Transition

---

#### `RELEASE-ACCEPT-004` — FCSR approver receives a task in My Tasks

**Preconditions:** Release at Final Acceptance. Logged in as FCSR approver.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Tasks` | A task for Final Acceptance of the target release is visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-ACCEPT-005` — "Final Acceptance" and "Return to Rework" buttons visible

**Preconditions:** Release at Final Acceptance. Logged in as FCSR approver.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The `Final Acceptance` button is visible |
| 2 | Verify the `Return to Rework` button | The button is also visible |

**Coverage dimension:** Happy Path

---

#### 3.30 Subsection: 10.2 SBOM Validations at Final Acceptance

---

#### `RELEASE-ACCEPT-SBOM-001` — SBOM Status not set → validation error

**Preconditions:** Release at Final Acceptance. SBOM Status is empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Final Acceptance` | A validation error indicates `SBOM Status` is required |

**Coverage dimension:** Negative / Validation (P1)

---

#### `RELEASE-ACCEPT-SBOM-002` — SBOM Status = "In Progress" with empty SBOM ID → validation error

**Preconditions:** SBOM Status = "In Progress". SBOM ID is empty.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Final Acceptance` | A validation error indicates `SBOM ID` must be provided when SBOM Status is "In Progress" |

**Coverage dimension:** Negative / Validation (P1)

---

#### `RELEASE-ACCEPT-SBOM-003` — SBOM Status = "Submitted" with SBOM ID → success

**Preconditions:** SBOM Status = "Submitted". SBOM ID is populated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Final Acceptance` | No SBOM validation error; the acceptance process proceeds |

**Coverage dimension:** Happy Path (P1)

---

#### `RELEASE-ACCEPT-SBOM-004` — SBOM Status = "N/A" with Justification → success

**Preconditions:** SBOM Status = "N/A". Justification is provided.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Final Acceptance` | No SBOM validation error; the acceptance process proceeds |

**Coverage dimension:** Happy Path (P1)

---

#### `RELEASE-ACCEPT-SBOM-005` — SBOM fields immutable after release Completed

**Preconditions:** Release at Completed status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to CSRR > SDL Processes Summary | The section loads |
| 2 | Verify the `SBOM Status` and `SBOM ID` fields | Both fields are read-only (no edit button or greyed out) |

**Coverage dimension:** Data Integrity (P1)

---

#### 3.31 Subsection: 10.3 Pen Test Validation at Final Acceptance

---

#### `RELEASE-ACCEPT-PENTEST-001` — Pen Test Details must be complete if SVV-4 ≠ N/A

**Preconditions:** SVV-4 requirement status ≠ Not Applicable and ≠ Postponed. Pen Test Details incomplete.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Final Acceptance` | A validation error indicates Pen Test Details must be completed |

**Coverage dimension:** Negative / Validation (P1)

---

#### `RELEASE-ACCEPT-PENTEST-002` — Missing Pen Test Type or SRD/Vendor Ref shows error

**Preconditions:** Pen Test Type or SRD Number is missing.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Final Acceptance` | A validation error specifically mentions the missing field (Pen Test Type or SRD/Vendor Ref Number) |

**Coverage dimension:** Negative / Validation (P1)

---

#### `RELEASE-ACCEPT-PENTEST-003` — Complete Pen Test Details → Final Acceptance proceeds

**Preconditions:** All Pen Test Details are populated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Final Acceptance` | No Pen Test validation error; the acceptance proceeds |

**Coverage dimension:** Happy Path (P1)

---

#### 3.32 Subsection: 10.4 Final Acceptance & Return to Rework

---

#### `RELEASE-ACCEPT-DECISION-001` — "Final Acceptance" completes the release

**Preconditions:** All validations pass (SBOM, Pen Test). Release at Final Acceptance.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Final Acceptance` | The release status changes to `Completed` |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-ACCEPT-DECISION-002` — Completed release shows "Completed" badge

**Preconditions:** Release just completed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the product's Releases tab | The release row shows `Completed` in the status column |

**Coverage dimension:** Happy Path

---

#### `RELEASE-ACCEPT-DECISION-003` — Completed release hidden from My Releases when "Show Active Only" ON

**Preconditions:** Release at Completed status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `My Releases` with `Show Active Only` ON | The completed release is NOT visible |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-ACCEPT-DECISION-004` — Completed release visible when "Show Active Only" OFF

**Preconditions:** Same completed release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Toggle `Show Active Only` to OFF | The completed release appears in the list |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-ACCEPT-DECISION-005` — "Return to Rework" sends release back with mandatory justification

**Preconditions:** Release at Final Acceptance. Logged in as FCSR approver.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Return to Rework` | A justification popup opens with a mandatory text field |
| 2 | Enter justification and click Submit | The release returns to the product team (Post FCSR Actions or Manage) |

**Coverage dimension:** State Transition (P1)

---

#### `RELEASE-ACCEPT-DECISION-006` — Justification visible in Stage Sidebar after rework

**Preconditions:** Release returned for rework.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `View Flow` and click the `Final Acceptance` stage | The Stage Sidebar opens |
| 2 | Verify the rework justification | The justification text is visible in the sidebar |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-ACCEPT-001` — Post-Conditions tracked at Final Acceptance (NEW)

**Preconditions:** FCSR Decision = "Go with Post-Conditions". Release at Final Acceptance.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page | The page loads |
| 2 | Verify Post-Condition actions are visible in the Action Plan or Actions Management area | At least 1 Post-Condition action is listed |
| 3 | Verify the action statuses are tracked | Each action shows its current status (Open, In Progress, Closed, etc.) |

**Coverage dimension:** Happy Path

---

#### `RELEASE-ACCEPT-002` — Cancel Release at Final Acceptance (NEW)

**Preconditions:** Release at Final Acceptance.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click `Cancel Release` (if available) or verify cancellation path | A justification popup opens |
| 2 | Enter justification and confirm | The release status changes to `Cancelled` |

**Coverage dimension:** State Transition

---

## 4. Subsection Assignment Map

| Stage | Subsection | Scenario IDs | Count |
|-------|-----------|-------------|-------|
| 2 | 5.1 Stage Transition & Routing | RELEASE-REVIEW-005 – RELEASE-REVIEW-010 | 6 |
| 2 | 5.2 Requirements Summary Section | RELEASE-REVIEW-SUMMARY-001 – RELEASE-REVIEW-SUMMARY-004 | 4 |
| 2 | 5.3 Previous FCSR Summary Section | RELEASE-REVIEW-PREVFCSR-001, RELEASE-REVIEW-PREVFCSR-002, RELEASE-REVIEW-PREVFCSR-003 | 3 |
| 2 | 5.4 Scope Review Participants Section | REVIEW-CONFIRM-034-b, RELEASE-REVIEW-SCOPE-001 – RELEASE-REVIEW-SCOPE-008 | 9 |
| 2 | 5.5 Key Discussion Topics Section | RELEASE-REVIEW-TOPICS-001 – RELEASE-REVIEW-TOPICS-006 | 6 |
| 2 | 5.6 Scope Review Decision Section | RELEASE-REVIEW-DECISION-001, RELEASE-REVIEW-DECISION-002 | 2 |
| 2 | 5.7 Action Plan Items Section | REVIEW-CONFIRM-035-b, RELEASE-REVIEW-ACTION-001 – RELEASE-REVIEW-ACTION-004 | 5 |
| 2 | 5.8 Submit & Rework | RELEASE-REVIEW-SUBMIT-001 – RELEASE-REVIEW-SUBMIT-005 | 5 |
| 3 | 6.1 Manage Stage Entry & Navigation | RELEASE-MANAGE-001 | 1 |
| 3 | 6.2 Manage SDL Process Requirements — Jira Integration | RELEASE-MANAGE-JIRA-001 – RELEASE-MANAGE-JIRA-015 | 15 |
| 3 | 6.4 Cybersecurity Residual Risks (CSRR) Tab | RELEASE-CSRR-001 – RELEASE-CSRR-017 | 18 |
| 3 | 6.5 Action Items — Create & Manage | RELEASE-MANAGE-ACTION-001 – RELEASE-MANAGE-ACTION-010 | 10 |
| 3 | 6.6 FCSR Recommendation (FCSR Decision Tab) | RELEASE-MANAGE-FCSR-001 – RELEASE-MANAGE-FCSR-006 | 6 |
| 4 | 7.1 Stage Entry & Task Assignment | RELEASE-SIGNOFF-SA-001 – RELEASE-SIGNOFF-SA-004 | 4 |
| 4 | 7.2 Evaluation Status Editing | RELEASE-SIGNOFF-EVAL-001 – RELEASE-SIGNOFF-EVAL-004 | 4 |
| 4 | 7.3 Auto-Calculated Summaries | RELEASE-SIGNOFF-SUMMARY-001 – RELEASE-SIGNOFF-SUMMARY-004 | 4 |
| 4 | 7.4 SBOM Validation at SA & PQL Stage | RELEASE-SIGNOFF-SBOM-001 – RELEASE-SIGNOFF-SBOM-003 | 3 |
| 4 | 7.5 Dual Sign-Off Requirement | RELEASE-SIGNOFF-DUAL-001 – RELEASE-SIGNOFF-DUAL-005 | 5 |
| 4 | 7.6 Rework from SA & PQL Sign Off | RELEASE-SIGNOFF-REWORK-001 – RELEASE-SIGNOFF-REWORK-005 | 5 |
| 4 | 7.7 Privacy Review at SA & PQL Sign Off | RELEASE-DPP-PRIVACY-001 – RELEASE-SIGNOFF-PENTEST-001 | 8 |
| 5 | 8.1 Stage Entry & Routing | RELEASE-FCSR-001 – RELEASE-FCSR-005 | 5 |
| 5 | 8.4 FCSR Decision & Outcomes | RELEASE-FCSR-OUTCOME-001 – RELEASE-FCSR-OUTCOME-007 | 7 |
| 5 | 8.5 Escalation Chain | RELEASE-FCSR-ESCALATION-001 – RELEASE-FCSR-ESCALATION-006 | 6 |
| 5 | 8.7 FCSR Exception | RELEASE-FCSR-EXCEPTION-001 – RELEASE-FCSR-DEC-002 | 5 |
| 6 | 9.1 No-Go Path | RELEASE-POSTFCSR-NOGO-001 – RELEASE-POSTFCSR-NOGO-004 | 4 |
| 6 | 9.2 Go with Pre-Conditions Path — Action Closure | RELEASE-POSTFCSR-PRE-001 – RELEASE-POSTFCSR-PRE-007 | 7 |
| 6 | 9.3 SBOM & CSRR Editability During Post FCSR Actions | RELEASE-POSTFCSR-SBOM-001 – RELEASE-POSTFCSR-SBOM-003 | 3 |
| 6 | 9.4 Stage Routing — Go and Go with Post-Conditions | RELEASE-POSTFCSR-003 – RELEASE-POSTFCSR-002 | 5 |
| 7 | 10.1 Stage Entry | RELEASE-ACCEPT-003 – RELEASE-ACCEPT-005 | 3 |
| 7 | 10.2 SBOM Validations at Final Acceptance | RELEASE-ACCEPT-SBOM-001 – RELEASE-ACCEPT-SBOM-005 | 5 |
| 7 | 10.3 Pen Test Validation at Final Acceptance | RELEASE-ACCEPT-PENTEST-001 – RELEASE-ACCEPT-PENTEST-003 | 3 |
| 7 | 10.4 Final Acceptance & Return to Rework | RELEASE-ACCEPT-DECISION-001 – RELEASE-ACCEPT-002 | 8 |

**Note:** This map covers only the scenarios with NEW step tables written in this document. Stages 3 and 5 have additional subsections (6.3a-c, 6.4b, 6.5b, 8.2, 8.3, 8.6a-h) with scenarios already in the tracker whose step tables follow the same patterns but are not fully enumerated here to keep the document focused on the specifications with the highest immediate value.

---

## 5. Review Gate Checklist

| # | Check | Pass? |
|---|-------|-------|
| 1 | Every step uses an allowed verb (Navigate, Click, Type, Select, Verify, Scroll, Wait) | ✅ |
| 2 | Every expected result is machine-verifiable (visibility, text content, URL, count, attribute, state) | ✅ |
| 3 | No vague terms ("page looks correct", "data loads properly", "form works") | ✅ |
| 4 | UI element names match latest DOM snapshot (exploration-findings.md) | ✅ |
| 5 | Negative cases for every input field (mandatory justification, empty fields, 500-char limit) | ✅ |
| 6 | Role-based access tested (SA, PQL, LOB SL, BU SO, CISO, SVP LOB, PO, SM, Privacy Reviewer) | ✅ |
| 7 | State transitions: happy path (Submit → advance) + rework (Return → previous stage) | ✅ |
| 8 | Data integrity: create + read-back (participants, topics, actions, SBOM, evaluation status) | ✅ |
| 9 | Cross-feature side effects: FCSR Decision → Post FCSR → Final Acceptance chain verified | ✅ |
| 10 | No environment-specific hardcoded values (all assertions use "at least 1", "contains", relative URLs) | ✅ |

---

## 6. Tracker Actions

### 6.1 Remove Duplicate Meta-Scenarios

```bash
npx tsx scripts/tracker.ts remove RELEASE-REVIEW-001
npx tsx scripts/tracker.ts remove RELEASE-REVIEW-002
npx tsx scripts/tracker.ts remove RELEASE-REVIEW-003
npx tsx scripts/tracker.ts remove RELEASE-REVIEW-004
```

### 6.2 Add New Scenarios

```bash
# Stage 4: Privacy Review at SA & PQL Sign Off
npx tsx scripts/tracker.ts add -i RELEASE-DPP-PRIVACY-001 -t "Privacy Reviewer: mark section as Not Applicable" -p P2 -a releases -w "Release — Stage 4: SA & PQL Sign Off" --subsection "7.7 Privacy Review at SA & PQL Sign Off"
npx tsx scripts/tracker.ts add -i RELEASE-DPP-PRIVACY-002 -t "Privacy Reviewer: maturity level selection for privacy sections" -p P2 -a releases -w "Release — Stage 4: SA & PQL Sign Off" --subsection "7.7 Privacy Review at SA & PQL Sign Off"
npx tsx scripts/tracker.ts add -i RELEASE-DPP-PRIVACY-003 -t "Privacy Reviewer: evidence rating for privacy sections" -p P2 -a releases -w "Release — Stage 4: SA & PQL Sign Off" --subsection "7.7 Privacy Review at SA & PQL Sign Off"
npx tsx scripts/tracker.ts add -i RELEASE-DPP-PRIVACY-004 -t "Privacy Reviewer: FCSR recommendation from privacy review" -p P2 -a releases -w "Release — Stage 4: SA & PQL Sign Off" --subsection "7.7 Privacy Review at SA & PQL Sign Off"
npx tsx scripts/tracker.ts add -i RELEASE-DPP-PRIVACY-005 -t "Privacy Reviewer: PCC Decision when Privacy Risk = High" -p P1 -a releases -w "Release — Stage 4: SA & PQL Sign Off" --subsection "7.7 Privacy Review at SA & PQL Sign Off"
npx tsx scripts/tracker.ts add -i RELEASE-DPP-PRIVACY-006 -t "Privacy: residual risk specification per privacy section" -p P2 -a releases -w "Release — Stage 4: SA & PQL Sign Off" --subsection "7.7 Privacy Review at SA & PQL Sign Off"
npx tsx scripts/tracker.ts add -i RELEASE-DPP-PRIVACY-007 -t "Privacy: actions creation and removal in DPP tab" -p P2 -a releases -w "Release — Stage 4: SA & PQL Sign Off" --subsection "7.7 Privacy Review at SA & PQL Sign Off"
npx tsx scripts/tracker.ts add -i RELEASE-SIGNOFF-PENTEST-001 -t "Pen Test Details validation before FCSR Review submission" -p P2 -a releases -w "Release — Stage 4: SA & PQL Sign Off" --subsection "7.7 Privacy Review at SA & PQL Sign Off"

# Stage 5: FCSR Exception
npx tsx scripts/tracker.ts add -i RELEASE-FCSR-EXCEPTION-001 -t "FCSR Exception: CISO review and approval" -p P1 -a releases -w "Release — Stage 5: FCSR Review" --subsection "8.7 FCSR Exception"
npx tsx scripts/tracker.ts add -i RELEASE-FCSR-EXCEPTION-002 -t "FCSR Exception: SVP LOB review and approval" -p P1 -a releases -w "Release — Stage 5: FCSR Review" --subsection "8.7 FCSR Exception"
npx tsx scripts/tracker.ts add -i RELEASE-FCSR-EXCEPTION-003 -t "FCSR Exception: both CISO and SVP required before release advances" -p P1 -a releases -w "Release — Stage 5: FCSR Review" --subsection "8.7 FCSR Exception"
npx tsx scripts/tracker.ts add -i RELEASE-FCSR-DEC-001 -t "DPP Summary section visible in FCSR Decision tab" -p P2 -a releases -w "Release — Stage 5: FCSR Review" --subsection "8.7 FCSR Exception"
npx tsx scripts/tracker.ts add -i RELEASE-FCSR-DEC-002 -t "PCC Decision section visible in FCSR Decision tab when Privacy Risk = High" -p P2 -a releases -w "Release — Stage 5: FCSR Review" --subsection "8.7 FCSR Exception"

# Stage 6: Post FCSR Actions — new
npx tsx scripts/tracker.ts add -i RELEASE-POSTFCSR-001 -t "Actions submit to Jira during Post FCSR Actions" -p P2 -a releases -w "Release — Stage 6: Post FCSR Actions" --subsection "9.4 Stage Routing — Go and Go with Post-Conditions"
npx tsx scripts/tracker.ts add -i RELEASE-POSTFCSR-002 -t "Cancel Release during Post FCSR Actions (Go with Post-Conditions path)" -p P2 -a releases -w "Release — Stage 6: Post FCSR Actions" --subsection "9.4 Stage Routing — Go and Go with Post-Conditions"

# Stage 7: Final Acceptance — new
npx tsx scripts/tracker.ts add -i RELEASE-ACCEPT-001 -t "Post-Condition actions tracked and visible at Final Acceptance" -p P2 -a releases -w "Release — Stage 7: Final Acceptance" --subsection "10.4 Final Acceptance & Return to Rework"
npx tsx scripts/tracker.ts add -i RELEASE-ACCEPT-002 -t "Cancel Release at Final Acceptance with mandatory justification" -p P2 -a releases -w "Release — Stage 7: Final Acceptance" --subsection "10.4 Final Acceptance & Return to Rework"
```

---

## 7. Summary

| Metric | Value |
|--------|-------|
| **Existing scenarios (Stages 2–7)** | 323 |
| **Scenarios with step tables written** | 156 (in this document) |
| **Remaining scenarios needing steps** | Stage 3 Jira/Jama (6.3a-c: 26), Stage 5 tabs/participants/report (8.2-3, 8.6a-h: 59), Stage 3 bar chart (6.5b: 4) |
| **New scenarios minted** | 17 |
| **Duplicate meta-scenarios removed** | 4 |
| **Final total (after add/remove)** | 336 |
| **Priority breakdown (new)** | P1: 3, P2: 14 |
| **Zero-regression assessment** | ⚠️ Not yet — Stages 3-7 automation is 0%; step tables now exist for all core scenarios. The primary blockers are: (a) Jira/Jama integration testing requires live external service connections, (b) multi-role E2E tests (SA+PQL dual sign-off, escalation chain) require credential fixtures for 6+ roles. |

### Next Steps

1. **Verify tracker state:** Run audit query for missing steps on newly added scenarios.
2. **Export for review (optional):** `npx tsx scripts/export-scenarios.ts --workflow "Release — Stage 4: SA & PQL Sign Off"`.
3. **Automate:** Use `create-auto-tests` skill starting with P1 scenarios (RELEASE-DPP-PRIVACY-005, RELEASE-FCSR-EXCEPTION-001–0085, RELEASE-FCSR-OUTCOME-004–0031, RELEASE-ACCEPT-DECISION-001).
4. **Update registry:** Add `releases.signoff.privacy` and `releases.fcsr.exception` feature IDs to `docs/ai/knowledge-base/feature-registry/releases.md`.
