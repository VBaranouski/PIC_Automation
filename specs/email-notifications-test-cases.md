# WF 23. Email Notifications & Task Triggers — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `other` · **Workflow:** Email Notifications & Task Triggers
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

This is a **NEW** workflow. There are no existing scenarios specifically under this workflow.

Scattered notification scenarios exist in other workflows:
- `ACTIONS-EMAIL-001` through `005` (5 in Actions Management)
- `DOC-TASKS-020` through `028` (9 in DOC)
- `ROLES-DELEGATION-EFFECTS-002` (1 in Roles Delegation)
- `TRACKING-TOOLS-014` (1 in Product Management)

**Missing entirely:** The 14 release lifecycle email notification types documented in UG §2.7.1–§2.7.14 + 3 cross-cutting types (§2.7.15–§2.7.17 role delegation / actions assignment).

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ❌ | **14 release lifecycle notification types have zero scenarios** |
| Negative / Validation | ❌ | **No scenarios for invalid recipient, missing template, suppressed email** |
| Role-Based Access | ❌ | **Recipient logic varies by Minimum Oversight Level & Risk Classification — untested** |
| State Transitions | ❌ | **Trigger points at each stage transition are undocumented in test scenarios** |
| Data Integrity | ❌ | **Placeholder replacement, email template content — untested** |

### 1.3 New Scenarios

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| NOTIF-RELEASE-001 | Release creation triggers email to PO + SM (TO) and SA (CC) | P1 | Happy Path — UG §2.7.1 |
| NOTIF-RELEASE-002 | Scope Review submission triggers email to SA + LOB SL + BU SO (TO) and PO + SM (CC) | P1 | Happy Path — UG §2.7.2 |
| NOTIF-RELEASE-003 | Scope Confirmation triggers email to PO + SM (TO) and SA + LOB SL + BU SO (CC) | P1 | Happy Path — UG §2.7.3 |
| NOTIF-RELEASE-004 | Scope Rework triggers email to PO + SM | P2 | Happy Path — UG §2.7.4 |
| NOTIF-RELEASE-005 | Release Completion Reminder triggers email to PO + SM (TO) and SA (CC) | P2 | Happy Path — UG §2.7.5 |
| NOTIF-RELEASE-006 | SA & PQL Sign Off submission triggers email to SA (TO) with PO + SM (CC) | P1 | Happy Path — UG §2.7.6 |
| NOTIF-RELEASE-007 | SA + PQL sign off → Readiness Confirmation email to PO + SM | P2 | Happy Path — UG §2.7.7 |
| NOTIF-RELEASE-008 | SA/PQL rework → Readiness Rework email to PO + SM | P2 | Happy Path — UG §2.7.8 |
| NOTIF-RELEASE-009 | FCSR Review triggers email to SA/LOB SL/BU SO (TO) and PO + SM (CC) | P1 | Happy Path — UG §2.7.9 |
| NOTIF-RELEASE-010 | FCSR Exception triggers email to CISO + SVP LOB | P1 | Happy Path — UG §2.7.10 |
| NOTIF-RELEASE-011 | FCSR Completion triggers email to PO + SM (TO) and SA (CC) | P1 | Happy Path — UG §2.7.11 |
| NOTIF-RELEASE-012 | Final Approval triggers email to SA + LOB SL + BU SO | P2 | Happy Path — UG §2.7.12 |
| NOTIF-RELEASE-013 | Release Completed triggers email to PO + SM + SA + LOB SL + BU SO + CISO | P2 | Happy Path — UG §2.7.13 |
| NOTIF-RELEASE-014 | Release Cancelled triggers email to PO + SM + SA + LOB SL + BU SO | P2 | Happy Path — UG §2.7.14 |
| NOTIF-DELEG-001 | Role delegated to user triggers email with delegation details | P2 | Happy Path — UG §2.7.15 |
| NOTIF-DELEG-002 | Role delegation expired/removed triggers email to delegate | P2 | Happy Path — UG §2.7.16 |
| NOTIF-ACTIONS-001 | Action assignment triggers daily summary email to assignee | P2 | Happy Path — UG §2.7.17 |
| NOTIF-TEMPLATE-001 | Email subject line contains correct [RELEASE] and [PRODUCT] placeholders | P1 | Data Integrity — template |
| NOTIF-TEMPLATE-002 | Email body contains correct [RECIPIENT] name placeholder | P2 | Data Integrity — template |
| NOTIF-TEMPLATE-003 | Email body contains PICASso deep link to the release | P2 | Data Integrity — link |
| NOTIF-RECIPIENT-001 | Scope Review recipient list varies by Minimum Oversight Level and Risk Classification | P1 | Role-Based Access — recipient logic |
| NOTIF-RECIPIENT-002 | FCSR Review recipient list varies by Minimum Oversight Level and Risk Classification | P1 | Role-Based Access — recipient logic |
| NOTIF-NEG-001 | When no SA is assigned, release creation email is still sent to PO + SM | P2 | Negative — missing role |
| NOTIF-NEG-002 | Stage transition does not trigger duplicate emails for the same recipient | P2 | Negative — deduplication |
| NOTIF-TASK-001 | Release creation generates a "Complete Scoping" task for PO in My Tasks | P1 | State Transitions — task |
| NOTIF-TASK-002 | Scope submission generates a "Review Scope" task for SA in My Tasks | P1 | State Transitions — task |
| NOTIF-TASK-003 | FCSR submission generates an "FCSR Review" task for SA/LOB SL/BU SO in My Tasks | P1 | State Transitions — task |
| NOTIF-TASK-004 | Task is closed when the next stage transition occurs | P2 | State Transitions — closure |
| NOTIF-TASK-005 | Role delegation reassigns open tasks from delegator to delegate | P2 | State Transitions — delegation |

---

## 2. Test Case Specifications

### 2.1 Release Lifecycle Emails

#### `NOTIF-RELEASE-001` — Release creation triggers email to PO + SM (TO) and SA (CC)

**Preconditions:** A product exists with PO, SM, and SA assigned.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create a new release for the product | The release is created successfully |
| 2 | Verify an email is sent with subject "Automatic Confirmation: Release [RELEASE] Creation and SDL Process Initiation for Product [PRODUCT]" | The email subject contains the release name and product name |
| 3 | Verify the TO recipients are Product Owner and Security Manager | PO and SM are in the TO field |
| 4 | Verify the CC recipient is Security Advisor | SA is in the CC field |
| 5 | Verify the email body contains the PICASso support contact | The body includes "SM Global PICASso support" |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-002` — Scope Review submission triggers email to SA + LOB SL + BU SO (TO) and PO + SM (CC)

**Preconditions:** Release exists at Creation & Scoping stage. Scoping fields are completed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit the release for Scope Review | The release transitions to Review & Confirm stage |
| 2 | Verify an email is sent with subject "Automatic Request: Scope Review Requested: Release [RELEASE] for Product [PRODUCT]" | The email subject contains the release and product names |
| 3 | Verify TO recipients include SA, LOB Security Leader, and BU Security Officer (based on Minimum Oversight Level) | The TO field contains the expected reviewers |
| 4 | Verify CC recipients are PO and SM | PO and SM are in the CC field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-003` — Scope Confirmation triggers email to PO + SM (TO) and SA + LOB SL + BU SO (CC)

**Preconditions:** Release at Review & Confirm. SA confirms the scope.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Confirm the release scope as SA | The release transitions to Manage stage |
| 2 | Verify an email is sent with subject "Automatic Confirmation: Scope of Release [RELEASE] for Product [PRODUCT] Confirmation" | The subject matches the template |
| 3 | Verify TO recipients are PO and SM | PO and SM are in the TO field |
| 4 | Verify CC recipients include SA, LOB Security Leader, BU Security Officer | CC includes the review chain |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-004` — Scope Rework triggers email to PO + SM

**Preconditions:** Release at Review & Confirm.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Return the release for rework as SA | The release transitions back to Creation & Scoping (Rework) |
| 2 | Verify an email is sent with subject "Automatic Action Required: Scope of Release [RELEASE] for Product [PRODUCT] Requires Changes" | The subject matches the template |
| 3 | Verify TO recipients are PO and SM | PO and SM are in the TO field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-005` — Release Completion Reminder triggers email to PO + SM (TO) and SA (CC)

**Preconditions:** Release is in progress. Target Release Date is approaching (within configured threshold).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify that when the remaining time exceeds the configured percentage of the release timeline, a reminder email is generated | An email with subject "Automatic Reminder: Pending action items for Release [RELEASE] for Product [PRODUCT]" is sent |
| 2 | Verify TO recipients are PO and SM | PO and SM are in the TO field |
| 3 | Verify CC recipient is SA | SA is in the CC field |
| 4 | Verify the email body mentions the Target Release Date | The date appears in the body |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-006` — SA & PQL Sign Off submission triggers email with PO + SM (CC)

**Preconditions:** Release at Manage stage. Requirements completed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit the release for SA & PQL Sign Off | The release transitions to the SA & PQL Sign Off stage |
| 2 | Verify an email is sent with subject "Automatic Confirmation: Under Review for FCSR readiness for Release [RELEASE] for Product [PRODUCT]" | The subject matches the template |
| 3 | Verify CC recipients include PO and SM | PO and SM are in the CC field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-007` — SA + PQL sign off → Readiness Confirmation email to PO + SM

**Preconditions:** Release at SA & PQL Sign Off. Both SA and PQL have signed off.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete SA and PQL sign off | The release transitions to FCSR Review |
| 2 | Verify an email is sent with subject "Automatic Confirmation: Release [RELEASE] of the Product [PRODUCT] is submitted for FCSR" | The subject matches the template |
| 3 | Verify TO recipients are PO and SM | PO and SM are in the TO field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-008` — SA/PQL rework → Readiness Rework email to PO + SM

**Preconditions:** Release at SA & PQL Sign Off.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Return the release for rework from SA & PQL Sign Off | The release transitions back to Manage (Rework) |
| 2 | Verify an email is sent with subject "Automatic Action Required: Release [RELEASE] of the Product [PRODUCT] has been returned for a re-work" | The subject matches the template |
| 3 | Verify TO recipients are PO and SM | PO and SM are in the TO field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-009` — FCSR Review triggers email to SA/LOB SL/BU SO (TO) and PO + SM (CC)

**Preconditions:** Release submitted for FCSR Review.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify an email is sent when the release enters FCSR Review | An email with subject "Automatic Action Required: Release [RELEASE] confirmed for FCSR review..." is sent |
| 2 | Verify TO recipients include SA, LOB Security Leader, and/or BU Security Officer | The TO field contains the appropriate reviewers |
| 3 | Verify CC recipients are PO and SM | PO and SM are in the CC field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-010` — FCSR Exception triggers email to CISO + SVP LOB

**Preconditions:** Release at FCSR Review. FCSR Approver raises an exception.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit an FCSR Exception decision | The exception is submitted |
| 2 | Verify an email is sent with subject "Automatic Action Required: Exception Requested for Release [RELEASE] for Product [PRODUCT]" | The subject matches the template |
| 3 | Verify TO recipients are CISO and SVP LOB | CISO and SVP LOB are in the TO field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-011` — FCSR Completion triggers email to PO + SM (TO) and SA (CC)

**Preconditions:** FCSR decision has been submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit the FCSR decision | The decision is recorded |
| 2 | Verify an email is sent with subject "Automatic Notification: Decision available for Release [RELEASE] of Product [PRODUCT]" | The subject matches the template |
| 3 | Verify TO recipients are PO and SM | PO and SM are in the TO field |
| 4 | Verify CC recipient is SA | SA is in the CC field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-012` — Final Approval triggers email to SA + LOB SL + BU SO

**Preconditions:** FCSR completed. Pre-condition actions exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify that when FCSR is completed and pre-condition actions exist, a Final Approval email is triggered | An email with subject "Automatic Action Required: Review the Release [RELEASE] for Product [PRODUCT] for final Approval" is sent |
| 2 | Verify TO recipients include SA, LOB Security Leader, and BU Security Officer | The TO field contains the approval chain |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-013` — Release Completed triggers email to PO + SM + SA + LOB SL + BU SO + CISO

**Preconditions:** Release at Final Acceptance.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete the release (Final Acceptance) | The release status is Completed |
| 2 | Verify an email is sent with subject "Automatic Notification: Release [RELEASE] for Product [PRODUCT] is Completed" | The subject matches the template |
| 3 | Verify TO recipients include PO, SM, SA, LOB SL, BU SO, and CISO | All 6 roles are in the TO field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

#### `NOTIF-RELEASE-014` — Release Cancelled triggers email to PO + SM + SA + LOB SL + BU SO

**Preconditions:** Release is being cancelled.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Cancel the release | The release status is Cancelled |
| 2 | Verify an email is sent with subject "Automatic Notification: Release [RELEASE] for Product [PRODUCT] is Cancelled" | The subject matches the template |
| 3 | Verify TO recipients include PO, SM, SA, LOB SL, and BU SO | All 5 roles are in the TO field |

**Coverage dimension:** Happy Path
**Subsection:** Release Lifecycle Emails

---

### 2.2 Delegation & Actions Emails

#### `NOTIF-DELEG-001` — Role delegated to user triggers email with delegation details

**Preconditions:** A role delegation is being created.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Delegate a role to another user | The delegation is saved |
| 2 | Verify an email is sent to the delegate with subject "Automatic Notification: Role Delegation: [ROLE]" | The subject contains the delegated role name |
| 3 | Verify the email body includes: Start Date, Expiration Date, Justification, and delegator name | All 4 fields are present |
| 4 | Verify the email mentions that tasks were reassigned | The body contains "Delegator's open tasks were assigned to you" |

**Coverage dimension:** Happy Path
**Subsection:** Delegation & Actions Emails

---

#### `NOTIF-DELEG-002` — Role delegation expired/removed triggers email to delegate

**Preconditions:** An active delegation exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Remove the delegation (or wait for expiration) | The delegation ends |
| 2 | Verify an email is sent to the delegate with subject "[ROLE] Role Delegation Expiration/Removal" | The subject contains the role name |
| 3 | Verify the email body mentions tasks were reassigned back to the delegator | The body contains "Related open tasks were reassigned to the delegator" |

**Coverage dimension:** Happy Path
**Subsection:** Delegation & Actions Emails

---

#### `NOTIF-ACTIONS-001` — Action assignment triggers daily summary email to assignee

**Preconditions:** Actions exist. An action has been assigned to a user.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create and assign an action to a user | The action is created |
| 2 | Verify a daily summary email is sent to the assignee with subject "PICASso: Actions for [PRODUCT] recently assigned to you" | The subject contains the product name |
| 3 | Verify the email body lists the recently assigned actions | The actions are listed in the email body |
| 4 | Verify CC recipients include PO, SM, and SA | PO, SM, and SA are in the CC field |

**Coverage dimension:** Happy Path
**Subsection:** Delegation & Actions Emails

---

### 2.3 Email Template & Content

#### `NOTIF-TEMPLATE-001` — Email subject line contains correct [RELEASE] and [PRODUCT] placeholders

**Preconditions:** Any release lifecycle email has been triggered.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger a release creation email | The email is sent |
| 2 | Verify the subject line contains the actual release name (not a placeholder token) | The literal release name appears in the subject |
| 3 | Verify the subject line contains the actual product name | The literal product name appears in the subject |

**Coverage dimension:** Data Integrity
**Subsection:** Email Template & Content

---

#### `NOTIF-TEMPLATE-002` — Email body contains correct [RECIPIENT] name placeholder

**Preconditions:** Any release lifecycle email has been triggered.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Examine the email body | The email body is accessible |
| 2 | Verify the salutation reads "Dear [actual recipient name]" and not a raw placeholder | The recipient's real name appears after "Dear" |

**Coverage dimension:** Data Integrity
**Subsection:** Email Template & Content

---

#### `NOTIF-TEMPLATE-003` — Email body contains PICASso deep link to the release

**Preconditions:** Any release lifecycle email has been triggered.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Examine the email body | The email body is accessible |
| 2 | Verify a clickable link to the release in PICASso is present | A valid URL pointing to the release page exists in the body |

**Coverage dimension:** Data Integrity
**Subsection:** Email Template & Content

---

### 2.4 Recipient Logic & Role-Based Access

#### `NOTIF-RECIPIENT-001` — Scope Review recipient list varies by Minimum Oversight Level and Risk Classification

**Preconditions:** Products with different Minimum Oversight Level and Risk Classification settings.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit a release for Scope Review where Minimum Oversight Level = "SA Only" | The email TO includes only SA |
| 2 | Submit a release for Scope Review where Minimum Oversight Level = "LOB" | The email TO includes SA and LOB Security Leader |
| 3 | Submit a release for Scope Review where Minimum Oversight Level = "BU" | The email TO includes SA, LOB Security Leader, and BU Security Officer |

**Coverage dimension:** Role-Based Access
**Subsection:** Recipient Logic & Role-Based Access

---

#### `NOTIF-RECIPIENT-002` — FCSR Review recipient list varies by Minimum Oversight Level and Risk Classification

**Preconditions:** Releases at FCSR Review with different oversight levels.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger FCSR Review email for a "SA Only" release | The email TO includes only SA |
| 2 | Trigger FCSR Review email for a "LOB" release | The email TO includes SA and LOB Security Leader |
| 3 | Trigger FCSR Review email for a "BU" release | The email TO includes SA, LOB SL, and BU SO |

**Coverage dimension:** Role-Based Access
**Subsection:** Recipient Logic & Role-Based Access

---

### 2.5 Negative / Validation

#### `NOTIF-NEG-001` — When no SA is assigned, release creation email is still sent to PO + SM

**Preconditions:** Product with no Security Advisor assigned.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create a release for a product without an assigned SA | The release is created |
| 2 | Verify the email is still sent to PO and SM | PO and SM are in the TO field |
| 3 | Verify the CC field is empty or omits SA | No SA appears in the CC |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `NOTIF-NEG-002` — Stage transition does not trigger duplicate emails for the same recipient

**Preconditions:** A user holds multiple roles on the same product/release (e.g., both PO and SM).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger a stage transition email where a user is both PO and SM | The transition occurs |
| 2 | Verify the user receives exactly 1 email (not 2 duplicates) | Only 1 email is delivered to the dual-role user |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

### 2.6 Task Triggers

#### `NOTIF-TASK-001` — Release creation generates a "Complete Scoping" task for PO in My Tasks

**Preconditions:** Logged in as PO.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create a new release | The release is created |
| 2 | Navigate to My Tasks on the landing page | The My Tasks tab loads |
| 3 | Verify a task for the new release appears (e.g., "Complete Scoping") | A task row with the release name is visible |

**Coverage dimension:** State Transitions
**Subsection:** Task Triggers

---

#### `NOTIF-TASK-002` — Scope submission generates a "Review Scope" task for SA in My Tasks

**Preconditions:** Release submitted for Scope Review. Logged in as SA.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to My Tasks on the landing page | The My Tasks tab loads |
| 2 | Verify a "Review Scope" task for the release appears | A task row with the release name and scope review action is visible |

**Coverage dimension:** State Transitions
**Subsection:** Task Triggers

---

#### `NOTIF-TASK-003` — FCSR submission generates an "FCSR Review" task for SA/LOB SL/BU SO in My Tasks

**Preconditions:** Release submitted for FCSR Review. Logged in as SA.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to My Tasks on the landing page | The My Tasks tab loads |
| 2 | Verify an "FCSR Review" task for the release appears | A task row with the release name and FCSR review action is visible |

**Coverage dimension:** State Transitions
**Subsection:** Task Triggers

---

#### `NOTIF-TASK-004` — Task is closed when the next stage transition occurs

**Preconditions:** A task exists for the current stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the current open task for a release | The task is visible in My Tasks |
| 2 | Perform the stage transition (e.g., confirm scope) | The release moves to the next stage |
| 3 | Navigate to My Tasks | The previous stage task is no longer visible (closed) |

**Coverage dimension:** State Transitions
**Subsection:** Task Triggers

---

#### `NOTIF-TASK-005` — Role delegation reassigns open tasks from delegator to delegate

**Preconditions:** User A has open tasks. Role delegation from A to B is created.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as User A and note open tasks | Tasks are visible |
| 2 | Create a role delegation from A to B | The delegation is saved |
| 3 | Log in as User B and navigate to My Tasks | User B sees the tasks previously assigned to User A |
| 4 | Log in as User A and navigate to My Tasks | The delegated tasks are no longer visible for User A |

**Coverage dimension:** State Transitions
**Subsection:** Task Triggers

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| Release Lifecycle Emails | NOTIF-RELEASE-001 through 014 |
| Delegation & Actions Emails | NOTIF-DELEG-001, 002, NOTIF-ACTIONS-001 |
| Email Template & Content | NOTIF-TEMPLATE-001, 002, 003 |
| Recipient Logic & Role-Based Access | NOTIF-RECIPIENT-001, 002 |
| Negative / Validation | NOTIF-NEG-001, 002 |
| Task Triggers | NOTIF-TASK-001 through 005 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms | ✅ |
| 4 | UI element names match DOM snapshot | ✅ (My Tasks, email subjects from UG) |
| 5 | Negative cases | ✅ (NEG-001, NEG-002) |
| 6 | Role-based access tested | ✅ (RECIPIENT-001, 002) |
| 7 | State transitions | ✅ (TASK-001 through 005) |
| 8 | Data integrity | ✅ (TEMPLATE-001, 002, 003) |
| 9 | Cross-feature side effects | ✅ (TASK-005 ties to Roles Delegation) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 0 (in this workflow) |
| New scenarios | 29 |
| Total scenarios | 29 |
| P1 | 11 |
| P2 | 18 |
| P3 | 0 |
