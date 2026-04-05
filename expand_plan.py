"""
Expand automation-testing-plan.md for WF4-WF10 + add WF14/WF15.
Based on 42 Confluence pages from Release Management Flow (1.3.x).
"""

PLAN_PATH = "/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/automation-testing-plan.md"

with open(PLAN_PATH, encoding='utf-8') as f:
    content = f.read()

# ─── WF4 additions ─────────────────────────────────────────────────────────────
# 1. Expand 4.1 Create Release Dialog with Pen Test fields
OLD_41_END = """- [ ] Cannot create a release with the same name as a cancelled release (error is shown)
- [ ] Creating a release with the same name as an inactivated release is allowed"""

NEW_41_END = """- [ ] Cannot create a release with the same name as a cancelled release (error is shown)
- [ ] Creating a release with the same name as an inactivated release is allowed
- [ ] "Existing Product Release" radio shows extra field "Was pen test performed? (Yes/No)"
- [ ] Selecting "Yes" reveals "Last Pen Test Type" (Full/Partial/Continuous) and "Last Pen Test Date" fields
- [ ] Selecting "No" reveals a mandatory "Justification" field; creating without it shows validation error
- [ ] Second+ release: Create Release button shows two options — "Clone from existing release" or "Create as new" radio"""

# 2. Expand 4.3 Clone Release
OLD_43 = """### 4.3 Clone Release

**Spec:** `releases/clone-release.spec.ts`

- [ ] "Clone" option in release Actions column opens the Clone Release dialog
- [ ] Clone dialog requires a unique Release Version — duplicate name shows error
- [ ] Target Release Date in clone dialog cannot be set in the past
- [ ] Successfully cloned release inherits Release Details dates (Cont. Pen Test Contract Date, Last Full Pen Test Date, Last BU SO FCSR Date)
- [ ] Cloned release inherits Roles & Responsibilities Product Team assignments
- [ ] Cloned release inherits Questionnaire answers from the source release
- [ ] Cloned release inherits Process and Product Requirements with their statuses, evidence links, and justifications
- [ ] Cloned release FCSR Review tab contains no data
- [ ] Cloned release Review & Confirm tab contains no data
- [ ] Warning icon is shown on Questionnaire tab if new/updated questions exist in the cloned release"""

NEW_43 = """### 4.3 Clone Release

**Spec:** `releases/clone-release.spec.ts`

- [ ] "Clone" option in release Actions column opens the Clone Release dialog with "Clone from existing release" pre-selected
- [ ] Clone dialog dropdown defaults to the latest release for the product
- [ ] Clone dialog requires a unique Release Version — duplicate name shows validation error
- [ ] Target Release Date in clone dialog cannot be set in the past
- [ ] "Reset Form" button restores clone dialog to default values
- [ ] Successfully cloned release inherits Release Details dates (Cont. Pen Test Contract Date, Last Full Pen Test Date, Last BU SO FCSR Date)
- [ ] Cloned release inherits Roles & Responsibilities Product Team assignments
- [ ] Cloned release inherits Questionnaire answers from the source release
- [ ] Cloned Questionnaire tab shows warning: "Some answers were inherited during cloning... Please review and update if needed"
- [ ] Cloned release inherits Process Requirements (Planned, Done, In Progress, Not Applicable, Partial, Postponed statuses all preserved)
- [ ] Requirements inherited with Done status are hidden by default; visible when "Show All Requirements" toggle is ON
- [ ] Cloned release inherits Product Requirements with their statuses, evidence links, and justifications
- [ ] Cloned release inherits all CSRR section data (SDL Process Summary, Product Req Summary, System Design, Threat Model, 3rd Party, SCA, Static CA, FOSS, Security Defects, External Vulnerabilities)
- [ ] Cloned release FCSR Decision tab contains no data (no previous participants or decision)
- [ ] Cloned release Review & Confirm tab contains no Scope Review Participants or Discussion Topics
- [ ] Cloned release does NOT inherit any Action Items from the source"""

# 3. Expand 4.4 Release Detail Header with sidebar and orange dot
OLD_44_END = """- [ ] After questionnaire submission, workflow popup updates responsible users if Risk Classification changes
- [ ] "Need Help" button is present and clickable"""

NEW_44_END = """- [ ] After questionnaire submission, workflow popup updates responsible users if Risk Classification changes
- [ ] "Need Help" button opens the Stage Sidebar panel
- [ ] Stage Sidebar shows: current stage name, responsible users table (User/Role/Approval Date columns), stage description text, and Close (X) button
- [ ] When release is on Rework, orange dot indicator appears on "View Flow" link with tooltip "On Rework. Click here for more details"
- [ ] Workflow popup shows submission counter (e.g., "1 from 2 submissions") for multi-approver stages
- [ ] Completed workflow stages show username and completion date in the popup"""

# 4. Add new section 4.10 after 4.9 Product Requirements
OLD_410_INSERT = """- [ ] "Requirements Status Summary" link opens the pie chart popup with Category filter
- [ ] Export XLSX button downloads the product requirements file with all current data

---

## WORKFLOW 5"""

NEW_410_INSERT = """- [ ] "Requirements Status Summary" link opens the pie chart popup with Category filter
- [ ] Export XLSX button downloads the product requirements file with all current data

### 4.10 Process Requirements — Applicability Lock

**Spec:** `releases/process-requirements.spec.ts` (applicability lock)

- [ ] Requirements configured as "Can be marked as Not Applicable = No" show "Not Applicable" option disabled in the status dropdown
- [ ] Hovering over the disabled "Not Applicable" option shows a tooltip explaining the restriction
- [ ] Bulk edit popup: selecting locked requirements and attempting to set status to "Not Applicable" shows an error message
- [ ] Importing an XLSX file with "Not Applicable" status for a locked requirement shows a row-level validation error
- [ ] Locked requirement indicator is visible in the requirement row (icon or label)

### 4.11 Process Requirements — Parent-Child Selection

**Spec:** `releases/process-requirements.spec.ts` (parent-child)

- [ ] Clicking a parent requirement checkbox opens a dropdown popup with "Select parent only" and "Select parent with sub-requirements" options
- [ ] "Select parent only" selects only the parent row; sub-requirements remain unaffected
- [ ] "Select parent with sub-requirements" selects the parent and all its visible sub-requirements
- [ ] Deselecting a parent opens popup with "De-select parent only" and "De-select parent and sub-requirements" options
- [ ] "Select All" checkbox triggers popup with "Select parent requirements only" and "Select parents with sub-requirements" options
- [ ] Parent-child popup is disabled (no popup shown) when "Show sub-requirements" toggle is OFF in Product Configuration

### 4.12 Requirements Versioning

**Spec:** `releases/req-versioning.spec.ts`

- [ ] When a newer requirement version is available in BackOffice, a warning banner appears on Process/Product Requirements tab
- [ ] Warning banner lists all changed requirements (field updated, new requirement added, or requirement deactivated)
- [ ] "Keep previous version" button closes the warning without making changes; warning reappears on next visit
- [ ] "Change version" button opens a sub-dialog with options: "Update status to Planned" or "Keep existing status"
- [ ] Choosing "Update status to Planned" resets all changed requirements to Planned status
- [ ] Choosing "Keep existing status" applies new requirement version without changing statuses
- [ ] After applying a version change, the warning banner is replaced by an informational message
- [ ] Requirements versioning warning is NOT shown for releases at FCSR Readiness/FCSR Review/Final Acceptance stages

---

## WORKFLOW 5"""

# ─── WF5 full replacement ──────────────────────────────────────────────────────
OLD_WF5 = """## WORKFLOW 5 — Release: Stage 2 — Review & Confirm

**Spec:** `releases/review-confirm.spec.ts` · **Map node:** `scope-review-tab`

- [ ] "Submit for Review" action button is available on Creation & Scoping stage and submits the release
- [ ] After submission, pipeline bar shows "Review & Confirm" as the active stage
- [ ] Review & Confirm tab becomes fully visible (previously a disabled tab)
- [ ] Tab loads: requirements summary, previous FCSR/PCC decisions section, recommendations field, actions summary bar chart, scope review decision section
- [ ] Scope review decision options are available to the responsible reviewer (SA/LOB SL/BU SO)
- [ ] "Submit" button on Review & Confirm stage advances release to Manage stage
- [ ] "Rework" button returns the release to Creation & Scoping stage
- [ ] Delegated Requirements Traceability dialog is accessible from this stage

---"""

NEW_WF5 = """## WORKFLOW 5 — Release: Stage 2 — Review & Confirm

**Spec:** `releases/review-confirm.spec.ts` · **Map node:** `scope-review-tab`

### 5.1 Stage Transition & Routing

- [ ] "Submit for Review" action button is enabled on Creation & Scoping stage and submits the release
- [ ] After submission, pipeline bar highlights "Review & Confirm" as the active stage
- [ ] Review & Confirm tab becomes fully accessible (was greyed out during Creation & Scoping)
- [ ] Review is routed to Security Advisor when Minimum Oversight Level = Team
- [ ] Review is routed to LOB Security Leader when Minimum Oversight Level = LOB Security Leader
- [ ] Review is routed to BU Security Officer when Minimum Oversight Level = BU Security Officer
- [ ] Review is routed to BU Security Officer when Last BU SO FCSR Date is older than 12 months
- [ ] Manually overriding Risk Classification by the reviewer (if permitted) changes the routing accordingly

### 5.2 Requirements Summary Section

- [ ] "Requirements Summary" section is collapsed by default
- [ ] Expanding the section shows two sub-sections: Process Requirements and Product Requirements
- [ ] Process Requirements donut chart loads and reflects current requirement status distribution
- [ ] "SDL Practice" dropdown filter on Process Requirements chart updates the chart data
- [ ] "Include Sub-Requirements" toggle on Process Requirements chart updates total count
- [ ] Product Requirements donut chart loads correctly with status distribution
- [ ] "Category" and "Source" dropdown filters on Product Requirements chart update the chart
- [ ] "Include Sub-Requirements" toggle on Product Requirements chart updates the data
- [ ] Chart burger menu offers: View Full Screen, Print, Download PNG, Download JPEG, Download SVG
- [ ] "View Full Screen" expands the donut chart to full screen mode
- [ ] "Download PNG" downloads the chart as a PNG file

### 5.3 Previous FCSR Summary Section

- [ ] "Previous FCSR Summary" section is collapsed by default
- [ ] Section shows a "Previous Release" dropdown pre-selected to the latest completed release
- [ ] Switching the dropdown to another release updates all summary fields
- [ ] All read-only fields populate correctly: Status, Privacy Risk, Risk Classification, FCSR Decision Date, PCC Decision, FCSR Approval Decision, Exception Required, FCSR Approver
- [ ] "Link to Protocol File" field shows a clickable link if previously saved
- [ ] Section is hidden if no previous release has reached Post FCSR Actions or Final Acceptance stage

### 5.4 Scope Review Participants Section

- [ ] Scope Review Participants section is visible and expanded on the Review & Confirm tab
- [ ] "Add Participant" button opens the Add Participant popup
- [ ] Popup defaults to "Release Team" option; shows User dropdown (from Roles & Responsibilities)
- [ ] Recommendation radiobutton options: Approved / Pending / Rejected / Approved with Actions / Reworked
- [ ] Comment field accepts up to 500 characters; exceeding limit shows error
- [ ] "Save" saves the participant and closes popup
- [ ] "Save & Create New" saves and keeps popup open for next entry
- [ ] Switching to "Others" option shows Sailpoint user lookup field and mandatory Role text field
- [ ] Saving with "Others" option with empty Role field shows validation error
- [ ] Added participant appears in the participants table with their role and recommendation
- [ ] "Edit" button on a participant row opens the popup pre-filled with that participant's data
- [ ] "Delete" button on a participant row shows confirmation dialog; confirming removes the row
- [ ] Participants section becomes read-only when release advances past Review & Confirm stage

### 5.5 Key Discussion Topics Section

- [ ] Key Discussion Topics section is visible on the Review & Confirm tab
- [ ] "Add Topic" button opens inline/popup form with Topic Name and Discussion Details fields
- [ ] Saving a new topic adds it to the list with auto-populated Date and Added By fields
- [ ] Topic can be deleted via trash icon with a confirmation prompt
- [ ] Topics added in previous stages cannot be edited or deleted
- [ ] Topics are visible (read-only) on all later stages

### 5.6 Scope Review Decision Section

- [ ] Scope Review Decision dropdown is editable for the responsible reviewer during Review & Confirm stage
- [ ] Dropdown options come from BackOffice configuration (e.g., Approved, Approved with Actions, Rework)
- [ ] Attempting to Submit without selecting a decision shows a mandatory field validation error
- [ ] "Rework" does not require a decision selection — only a justification popup

### 5.7 Action Plan Items Section

- [ ] Action Plan Items section is visible; "Add Action" button opens the action creation popup
- [ ] Action creation popup fields: Name (mandatory), Description (mandatory), State (dropdown, mandatory), Category (dropdown, mandatory), Assignee (lookup), Due Date, Evidence, Closure Comment
- [ ] Saving an action without mandatory fields shows inline validation errors
- [ ] Saved action appears in the Action Plan Items table
- [ ] "Submit Actions to Jira" button submits all unsynchronised actions to Jira as Feature-type items
- [ ] After Jira submission, a Jira link appears on each submitted action row
- [ ] "Refresh Data from Jira" button updates action statuses from Jira

### 5.8 Submit & Rework

- [ ] "Submit" button advances the release to Manage stage when Scope Review Decision is selected
- [ ] "Rework" button opens a rework justification popup (mandatory justification text)
- [ ] Submitting empty justification in rework popup shows validation error
- [ ] After rework: release returns to Creation & Scoping stage; orange dot appears on "View Flow" link
- [ ] Rework justification is visible in the Stage Sidebar

---"""

# ─── WF6 full replacement ──────────────────────────────────────────────────────
OLD_WF6 = """## WORKFLOW 6 — Release: Stage 3 — Manage

**Spec:** `releases/manage-stage.spec.ts`

- [ ] Release at Manage stage shows "Submit for SA & PQL" action button
- [ ] Process Requirements tab is fully editable at the Manage stage
- [ ] Product Requirements tab is fully editable at the Manage stage
- [ ] Requirements Traceability View dialog is accessible (shows linked Jira/Jama items per requirement)
- [ ] Requirements Update pop-up dialog allows per-requirement status update with evidence and justification

### 6.1 Cybersecurity Residual Risks (CSRR) Tab

**Spec:** `releases/csrr.spec.ts` · **Map node:** 10 sub-sections under `release-detail`

- [ ] CSRR tab loads and shows navigation to all 10 sub-sections
- [ ] **SDL Processes Summary** — SDL Details, SBOM Status/ID, SDL Artifacts Repository Link, SDL Gap Found, Process Requirements list, Evaluation Status, Residual Risk, and Actions fields all render and are editable
- [ ] **Product Requirements Summary** — Cybersecurity Roadmap Link, applicable/expected/essential percentage breakdowns, Evaluation Status, Residual Risk, and Actions all render
- [ ] **System Design** — section is visible only when Product Definition = System; Architecture Link, Add Component, Add Countermeasure, Residual Risk, and Actions are functional
- [ ] **Threat Model** — Threat Model Link field is mandatory; Severity/Status matrix, Threat Mitigations table, Accepted Threats table, Residual Risk, and Actions render correctly
- [ ] **3rd Party Suppliers & SE Bricks** — TPS Products grid with "Add TPS Product" button, SE Bricks/Libraries/Platforms grid with "Add SE Brick" button, Residual Risk, and Actions all render
- [ ] **Static Code Analysis** — SCA tools section, scan results section, Residual Risk, and Actions all render
- [ ] **Software Composition Analysis** — SCA tools section, results, Residual Risk, and Actions render
- [ ] **FOSS Check** — all FOSS fields render; save persists data
- [ ] **Security Defects** — SVV Test Issues section, Pen Test Details (Last Full Pen Test Date), Residual Risk, and Actions all render
- [ ] **External Vulnerabilities** — External Vulnerability Issues grid, Residual Risk, and Actions all render

---"""

NEW_WF6 = """## WORKFLOW 6 — Release: Stage 3 — Manage

**Spec:** `releases/manage-stage.spec.ts` · **Map node:** `manage-release-progress`

### 6.1 Manage Stage — Entry & Navigation

- [ ] Release at Manage stage shows "Submit for SA & PQL Sign Off" action button
- [ ] Process Requirements tab is fully editable at Manage stage
- [ ] Product Requirements tab is fully editable at Manage stage
- [ ] CSRR tab is accessible and all 10 sections are editable
- [ ] FCSR Decision tab is accessible (for FCSR Recommendation provisioning)
- [ ] Progress percentage for SDL requirements is displayed and recalculates on status changes
- [ ] Progress percentage for Product Requirements is displayed and updates dynamically

### 6.2 Manage SDL Process Requirements — Jira Integration

**Spec:** `releases/manage-sdl-jira.spec.ts`

- [ ] "Submit to Jira" button on a Process Requirement creates a Jira Feature-type item and shows a confirmation
- [ ] After Jira submission, Jira link icon appears on the requirement row; clicking opens Jira
- [ ] Jira submission creates a Story-type item for each sub-requirement under the Feature
- [ ] Submitted Jira items reflect the Capability category (requirement group) as parent
- [ ] "Refresh Data from Jira" button updates requirement statuses based on current Jira status
- [ ] Jira status mapping: Refinement/Funnel/Ready/To Do → Planned; In Progress/Implementation/Ready to Test → In Progress; Done → Done
- [ ] "Unlink from Jira" action on a requirement removes the Jira link and allows manual status updates
- [ ] "Relink to Jira" restores the link to an existing Jira item using its identifier
- [ ] Bulk "Submit to Jira" submits all selected requirements and shows a batch result summary
- [ ] Daily auto-refresh of Jira statuses is reflected on next page load (last sync timestamp visible)

### 6.3 Manage Product Requirements — Jama/Orchestra Integration

**Spec:** `releases/manage-product-jama.spec.ts`

- [ ] "Submit to Jama" button sends selected product requirements to Jama via Orchestra integration
- [ ] Requirements with Postponed, Not Applicable, or Delegated status are excluded from Jama submission
- [ ] After successful Jama submission, a Jama link appears on each submitted requirement row
- [ ] Submit to Jama failure shows an error message with details from Orchestra
- [ ] "Refresh Jama Status" button fetches latest status from Jama and updates PICASso statuses
- [ ] Jama status mapped to PICASso using the Status Mapping Configuration on Product Details page
- [ ] "Unlink from Jama" removes the Jama link; requirement becomes manually editable
- [ ] "Relink to Jama" restores a previously unlinked requirement to its Jama counterpart
- [ ] Jira integration for Product Requirements works same as for Process Requirements (submit, refresh, unlink)

### 6.4 Cybersecurity Residual Risks (CSRR) Tab

**Spec:** `releases/csrr.spec.ts`

- [ ] CSRR tab loads and shows navigation to all 10 sub-sections
- [ ] **SDL Processes Summary** — SDL Details, SDL Artifacts Repository Link, SDL Gap Found, Process Requirements list, Evaluation Status, Residual Risk, and Actions all render and are editable
- [ ] **SBOM Status field** in SDL Processes Summary — dropdown shows In Progress / Submitted / N/A options
- [ ] Selecting SBOM Status = "N/A" reveals mandatory Justification field; saving without it shows validation error
- [ ] Selecting SBOM Status = "In Progress" or "Submitted" reveals SBOM ID text field
- [ ] **Product Requirements Summary** — Cybersecurity Roadmap Link, percentage breakdowns, Evaluation Status, Residual Risk, and Actions all render
- [ ] **System Design** — visible only when Product Definition = System; Architecture Link, Add Component, Add Countermeasure, Residual Risk, and Actions are functional
- [ ] **Threat Model** — Threat Model Link, Severity/Status matrix, Threat Mitigations table, Accepted Threats, Residual Risk, and Actions render correctly
- [ ] **3rd Party Suppliers & SE Bricks** — TPS Products grid with "Add TPS Product", SE Bricks grid with "Add SE Brick", Residual Risk and Actions render
- [ ] **Static Code Analysis** — SCA tools section, scan results, Residual Risk and Actions render
- [ ] **Software Composition Analysis** — SCA tools section, results, Residual Risk and Actions render
- [ ] **FOSS Check** — all FOSS fields render; save persists data
- [ ] **Security Defects** — SVV Test Issues section, Pen Test Details section, Residual Risk and Actions render
- [ ] Security Defects: "Pen Test Type" and "Internal SRD/Vendor Ref Number" are mandatory when pen test was performed
- [ ] Security Defects: "Justification" field appears and is mandatory when pen test was NOT performed, Delegated, or N/A
- [ ] **External Vulnerabilities** — External Vulnerability Issues grid, Residual Risk and Actions render
- [ ] If CSRR data was cloned from a previous release, it is pre-populated in all sections
- [ ] CSRR edits are preserved after navigating away and returning to the tab

### 6.5 Action Items — Create & Manage

**Spec:** `releases/action-items.spec.ts`

- [ ] CSRR tab or action panel shows an "Add Action" button to create a new action item
- [ ] Action creation popup requires: Name, Description, State (dropdown), Category (dropdown)
- [ ] Optional fields: Assignee (lookup), Due Date, Evidence (link), Closure Comment
- [ ] Attempting to save without mandatory fields shows inline validation errors
- [ ] Newly created action appears in the Action Plan Items table with correct fields
- [ ] Editing an existing action — clicking "Edit" pre-fills all fields; saving updates the record
- [ ] Changing action state to "Closed" makes "Closure Comment" field mandatory
- [ ] Saving a Closed action without Closure Comment shows validation error
- [ ] "Submit Actions to Jira" submits the action as a Jira Feature; Jira link appears after success
- [ ] "Refresh Data from Jira" updates action status from Jira using the configured status mapping

### 6.6 FCSR Recommendation (FCSR Decision Tab)

**Spec:** `releases/fcsr-recommendation.spec.ts`

- [ ] FCSR Decision tab at Manage stage allows PO/SM to add themselves as an FCSR participant
- [ ] "Add Participant" popup on FCSR Decision tab shows Recommendation dropdown (No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go)
- [ ] Selecting "Go with Pre-Conditions" requires at least one Pre-Condition action to exist; validation error if none
- [ ] Selecting "Go with Post-Conditions" requires at least one Post-Condition action to exist; validation error if none
- [ ] Comment field (up to 500 chars) is optional but recommended
- [ ] Saved recommendation appears in the FCSR Decision participants table
- [ ] Participant can delete their own recommendation via the Delete button (with confirmation)
- [ ] After submission to SA & PQL, the FCSR Decision tab participant section becomes read-only for PO/SM

---"""

# ─── WF7 full replacement ──────────────────────────────────────────────────────
OLD_WF7 = """## WORKFLOW 7 — Release: Stage 4 — SA & PQL Sign Off

**Spec:** `releases/sa-pql-signoff.spec.ts`

- [ ] Release at SA & PQL Sign Off stage shows action buttons: "Submit for FCSR Review" and "Rework"
- [ ] SA evaluates requirements on CSRR tab; evaluation fields are editable by SA at this stage
- [ ] PQL reviews process requirements compliance
- [ ] Workflow popup shows N of M submissions dynamically as approvers submit
- [ ] A checkmark appears next to each approver who has already submitted
- [ ] "Submit for FCSR Review" is actionable only after all required sign-offs are received
- [ ] "Rework" button returns the release to Manage stage

---"""

NEW_WF7 = """## WORKFLOW 7 — Release: Stage 4 — SA & PQL Sign Off

**Spec:** `releases/sa-pql-signoff.spec.ts` · **Map node:** `sa-pql-signoff`

### 7.1 Stage Entry & Task Assignment

- [ ] When release reaches SA & PQL Sign Off, a task is auto-assigned to Security Advisor in My Tasks
- [ ] When release reaches SA & PQL Sign Off, a task is auto-assigned to PQL in My Tasks
- [ ] Release detail page shows "Submit for FCSR Review" and "Rework" action buttons
- [ ] Privacy Reviewer task is created if release has Data Protection & Privacy Review applicable

### 7.2 Evaluation Status Editing

- [ ] CSRR tab "Evaluation Status" dropdown on SDL Processes Summary is editable by SA at this stage
- [ ] Evaluation Status options: Not evaluated / Not met / Partially met / Fully met
- [ ] Changing Evaluation Status saves correctly and updates the auto-calculated summary
- [ ] Product Requirements Summary evaluation fields are also editable at this stage

### 7.3 Auto-Calculated Summaries

- [ ] SDL Processes Summary shows "Done Count / Total Count" auto-calculated from process requirements
- [ ] Product Requirements Summary shows percentage-based formula across all releases and current release
- [ ] Summary fields update automatically when evaluation statuses are changed
- [ ] "Fully Met" and "Partially Met" counts drive the Product Req completion % (Full + 0.5×Partial / Total)

### 7.4 SBOM Validation at SA & PQL Stage

- [ ] When SBOM Status = "Submitted", "SBOM ID" field is mandatory; submitting without it shows error
- [ ] When SBOM Status = "In Progress" or "N/A", SBOM ID is not required
- [ ] Validation error is shown inline on the CSRR tab SBOM fields

### 7.5 Dual Sign-Off Requirement

- [ ] Workflow popup shows "1 from 2 submissions" counter when only SA has submitted
- [ ] "Submit for FCSR Review" action is available to each approver independently
- [ ] When SA submits: My Tasks task is marked completed for SA but remains for PQL
- [ ] When both SA and PQL submit: release automatically advances to FCSR Review stage
- [ ] If one approver has submitted, the other can still "Rework" — which returns to Manage for both

### 7.6 Rework from SA & PQL Sign Off

- [ ] "Rework" button opens a justification popup (mandatory text field)
- [ ] Submitting empty justification shows validation error
- [ ] After rework is confirmed: release returns to Manage stage
- [ ] Orange dot appears on "View Flow" link with tooltip "On Rework. Click here for more details"
- [ ] Rework justification text is visible in the Stage Sidebar

---"""

# ─── WF8 full replacement ──────────────────────────────────────────────────────
OLD_WF8 = """## WORKFLOW 8 — Release: Stage 5 — FCSR Review

**Spec:** `releases/fcsr-review.spec.ts`

- [ ] FCSR Decision tab loads with: Participants section, Recommendations section, Discussion Topics section, Actions section, Approval Decision section
- [ ] Approval Decision options are visible: Go / Go with Pre-Conditions / Go with Post-Conditions / No-Go
- [ ] "Approve FCSR" records the decision and advances the release
- [ ] "Escalate" button allows escalating to a higher oversight level (LOB or BU)
- [ ] "Rework" button returns the release to SA & PQL Sign Off stage
- [ ] Exception required flow (CISO/SVP LOB) is triggered when applicable conditions are met
- [ ] Report Configurator dialog is accessible from the FCSR Review tab for generating scope approval and FCSR results reports
- [ ] After a "Go" decision — release moves to Post FCSR Actions stage
- [ ] After a "No-Go" decision — release moves to Post FCSR Actions (cancellation path)
- [ ] After "Go with Pre-Conditions" — pre-condition actions must be closed before Final Acceptance

---"""

NEW_WF8 = """## WORKFLOW 8 — Release: Stage 5 — FCSR Review

**Spec:** `releases/fcsr-review.spec.ts` · **Map node:** `fcsr-review-stage`

### 8.1 Stage Entry & Routing

- [ ] Release reaches FCSR Review stage after both SA and PQL sign off
- [ ] FCSR Review is assigned to Security Advisor (when MOL = Team)
- [ ] FCSR Review is assigned to LOB Security Leader (when MOL = LOB Security Leader)
- [ ] FCSR Review is assigned to BU Security Officer (when MOL = BU SO or last BU SO FCSR > 12 months)
- [ ] Assigned reviewer receives a task in My Tasks

### 8.2 FCSR Decision Tab — Sections

- [ ] FCSR Decision tab loads with 5 sections: Recommendation, Cybersecurity Risk Summary, FCSR Participants, Key Discussion Topics, FCSR Decision
- [ ] "Instructions" link in Recommendation section opens relevant guidance (opens in new tab)
- [ ] Cybersecurity Risk Summary shows tiles for each CSRR group with residual risk levels
- [ ] Clicking a Cybersecurity Risk Summary tile opens the corresponding CSRR section in a new tab
- [ ] Key Discussion Topics section is editable during FCSR Review; topics can be added or existing deleted

### 8.3 FCSR Participants

- [ ] "Add Participant" button opens popup with "Release Team" and "Others" options
- [ ] Release Team option: User dropdown from Roles & Responsibilities, Recommendation radiobutton, Comment (500 chars)
- [ ] Others option: Sailpoint UserLookup field, Role text (mandatory), Recommendation radiobutton, Comment
- [ ] "Save" saves participant; "Save & Create New" keeps popup open
- [ ] Participant added by Release Team appears in table with their role and recommendation
- [ ] "Edit" on a participant row pre-fills popup with existing data
- [ ] "Delete" on a participant row shows confirmation dialog
- [ ] Once release moves to Post FCSR Actions or Final Acceptance, FCSR Participants become read-only
- [ ] Recommendation options visible: No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go

### 8.4 FCSR Decision & Outcomes

- [ ] FCSR Approval Decision dropdown options: No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go
- [ ] "Exception Required" toggle enables CISO checkbox and/or SVP LOB checkbox
- [ ] Comments field appears when Exception Required is toggled ON
- [ ] Selecting "Go" and confirming moves release to Completed status immediately
- [ ] Selecting "No-Go" triggers release cancellation; status changes to Cancelled
- [ ] Selecting "Go with Pre-Conditions" moves release to Post FCSR Actions (Actions Closure status)
- [ ] Selecting "Go with Post-Conditions" moves release to Final Acceptance stage

### 8.5 Escalation Chain

- [ ] "Escalate" button is available at FCSR Review stage
- [ ] Escalating from SA routes review to LOB Security Leader
- [ ] Escalating from LOB SL routes review to BU Security Officer
- [ ] Escalating from BU SO requires CISO or SVP LOB checkbox and Exception Required toggle
- [ ] Each escalation step records the escalating user and timestamp in the workflow popup
- [ ] "Rework" button returns release to SA & PQL Sign Off stage with mandatory justification

### 8.6 Reports

- [ ] Report Configurator dialog is accessible from the FCSR Review tab
- [ ] Generating a "Scope Approval" report downloads a PDF with scope details
- [ ] Generating an "FCSR Results" report downloads a PDF with FCSR decision details

---"""

# ─── WF9 full replacement ──────────────────────────────────────────────────────
OLD_WF9 = """## WORKFLOW 9 — Release: Stage 6 — Post FCSR Actions

**Spec:** `releases/post-fcsr-actions.spec.ts`

- [ ] Post FCSR Actions stage loads with "Submit" action button (and "Cancel" for No-Go path)
- [ ] Pre-condition and post-condition action items are listed
- [ ] Closing a pre-condition action updates its status in the list
- [ ] "Submit" button is enabled only after all pre-condition actions are closed
- [ ] "Submit" advances the release to Final Acceptance stage
- [ ] "Cancel" action (No-Go path) asks for confirmation and marks the release as Cancelled
- [ ] Cancelled release appears in Releases list only when "Show Active Only" is OFF

---"""

NEW_WF9 = """## WORKFLOW 9 — Release: Stage 6 — Post FCSR Actions

**Spec:** `releases/post-fcsr-actions.spec.ts` · **Map node:** `post-fcsr-stage`

### 9.1 No-Go Path

- [ ] When FCSR Decision = "No-Go", release status automatically changes to "Cancelled"
- [ ] A warning message is shown: "Release has been cancelled. Please create a new release."
- [ ] Cancelled release appears in Releases tab only when "Show Active Only" toggle is OFF
- [ ] Cancelled release shows "Cancelled" status badge in the release list

### 9.2 Go with Pre-Conditions Path — Action Closure

- [ ] Release at Actions Closure status shows "Edit Actions" button at bottom right of the page
- [ ] "Edit Actions" dialog lists all Pre-Condition actions with Status dropdown and Closure Comment field
- [ ] Changing an action state to "Closed" makes Closure Comment mandatory; saving without it shows error
- [ ] "Save Actions" button saves all changed action states; "Cancel" discards changes
- [ ] After closing all Pre-Condition actions, "Submit" button becomes active
- [ ] Attempting to submit without all Pre-Condition actions closed shows validation error listing open actions
- [ ] "Submit" moves release to Final Acceptance stage (when Pre-Conditions all closed)

### 9.3 SBOM & CSRR Editability During Post FCSR Actions

- [ ] SBOM Status field in CSRR → SDL Processes Summary remains editable during Post FCSR Actions
- [ ] SBOM ID field remains editable during Post FCSR Actions (for any status requiring ID)
- [ ] Saving SBOM changes during Post FCSR Actions persists correctly

### 9.4 Stage Routing — Go and Go with Post-Conditions

- [ ] When FCSR Decision = "Go", PO/SM submits the release → status transitions to Completed
- [ ] When FCSR Decision = "Go with Post-Conditions", release moves to Final Acceptance stage for FCSR approver sign-off
- [ ] Workflow popup shows Post FCSR Actions stage with submission counter and responsible users

---"""

# ─── WF10 full replacement ──────────────────────────────────────────────────────
OLD_WF10 = """## WORKFLOW 10 — Release: Stage 7 — Final Acceptance

**Spec:** `releases/final-acceptance.spec.ts`

- [ ] Final Acceptance stage shows the "Final Acceptance" action button for the responsible reviewer
- [ ] Reviewer can verify that all pre-condition closures are confirmed
- [ ] "Final Acceptance" action marks the release status as Completed
- [ ] Completed release appears in Releases list with Completed status label
- [ ] Completed release is hidden when "Show Active Only" toggle is ON
- [ ] Completed release is visible when "Show Active Only" toggle is OFF

---"""

NEW_WF10 = """## WORKFLOW 10 — Release: Stage 7 — Final Acceptance

**Spec:** `releases/final-acceptance.spec.ts`

### 10.1 Stage Entry

- [ ] Final Acceptance stage is entered from Post FCSR Actions (Go with Post-Conditions path)
- [ ] FCSR approver (SA/LOB SL/BU SO) receives a task in My Tasks for this stage
- [ ] Release detail page shows "Final Acceptance" and "Return to Rework" action buttons for the approver

### 10.2 SBOM Validations at Final Acceptance

- [ ] Attempting to complete without SBOM Status set shows validation error "SBOM Status required"
- [ ] Attempting to complete with SBOM Status = "In Progress" but empty SBOM ID shows validation error
- [ ] Completing the release with SBOM Status = "Submitted" and non-empty SBOM ID succeeds
- [ ] Completing the release with SBOM Status = "N/A" and a Justification provided succeeds
- [ ] SBOM Status and SBOM ID fields become immutable once release status = Completed

### 10.3 Pen Test Validation at Final Acceptance

- [ ] If SVV-4 (Pen Test) requirement status ≠ Not Applicable and ≠ Postponed, Pen Test Details must be complete
- [ ] Missing Pen Test Type or SRD/Vendor Ref Number shows validation error
- [ ] When Pen Test Details are complete, Final Acceptance can proceed

### 10.4 Final Acceptance & Return to Rework

- [ ] "Final Acceptance" button completes the release — status changes to "Completed"
- [ ] Completed release shows "Completed" status badge in Releases tab
- [ ] Completed release is hidden from My Releases when "Show Active Only" is ON
- [ ] Completed release is visible when "Show Active Only" toggle is OFF
- [ ] "Return to Rework" button sends release back to PO/SM with mandatory justification popup
- [ ] Justification is visible in the Stage Sidebar after rework is triggered

---"""

# ─── Add WF14 (Release History) and WF15 (Stage Sidebar) before Coverage Summary ─
OLD_WF12_START = """## WORKFLOW 12 — Roles Delegation"""

NEW_WF_ADDITIONS = """## WORKFLOW 14 — Release History

**Spec:** `releases/release-history.spec.ts` · **Map node:** `release-detail` (release-history-popup dialog)

- [ ] "View History" link on Release Detail page opens the Release History popup
- [ ] History popup shows columns: Date, User, Activity, Description
- [ ] History records are sorted in descending date order by default (newest first)
- [ ] Clicking the Date column header toggles sort between descending and ascending order
- [ ] User column shows profile image and display name for each activity
- [ ] Activity column shows the activity type label (e.g., "Release creation", "Requirement status update")
- [ ] Search text field filters history records by User name or Description text
- [ ] "Activity" dropdown filter limits records to the selected activity type
- [ ] Activity dropdown includes all 25+ activity types (Release creation, Clone, Role update, Questionnaire update, Requirement status update, Scope Review update, Risk Classification, CSRR changes, FCSR Decision, Jira Submission, Jama Submission, Rework, Escalation, Completion, Cancellation, Data Privacy changes, Report Generation, Inactivation)
- [ ] Date Range picker filters records to the selected period (from/to)
- [ ] "Search" button applies all active filters
- [ ] "Reset" button clears all filters and restores the full history
- [ ] Pagination: records-per-page dropdown (10/20/50/100) changes number of rows displayed
- [ ] Pagination navigation (prev/next page) works correctly
- [ ] Footer shows total record count
- [ ] Error state: "Unable to load data. Try again, please." message appears when data fails to load
- [ ] Release creation event is present in history after a release is created
- [ ] Cloning a release creates a "Release cloning" history entry
- [ ] Submitting requirements to Jira creates a "Jira Submission" history entry

---

## WORKFLOW 15 — Stage Sidebar & Responsible Users

**Spec:** `releases/stage-sidebar.spec.ts`

- [ ] "Need Help" button on Release Detail page opens the Stage Sidebar panel
- [ ] Stage Sidebar shows the current stage name in the header
- [ ] Sidebar displays a Responsible Users table with columns: User, Role, Approval Date
- [ ] Stage description text (configured in BackOffice) is visible in the sidebar
- [ ] Rework justification text is visible in the sidebar when release is on Rework
- [ ] Closing the sidebar via the X button hides it without navigating away
- [ ] "View Flow" button on Release Detail page opens the Workflow popup
- [ ] When release is on Rework: orange dot indicator appears next to "View Flow" link
- [ ] Hovering over the orange dot shows tooltip: "On Rework. Click here for more details"
- [ ] My Tasks list: "Assignee" filter is available and narrows tasks to the selected user
- [ ] My Tasks list: "Assignee" column is visible showing the assigned user for each task
- [ ] Workflow popup shows submission counter (e.g., "1 from 2 submissions") for stages requiring multiple approvals
- [ ] Completed stages show completion user and timestamp in the Workflow popup

---

## WORKFLOW 12 — Roles Delegation"""

# ─── Update Coverage Summary ───────────────────────────────────────────────────
OLD_COVERAGE = """## Coverage Summary

| Workflow | Description | Cases | `[x]` Done | `[ ]` Remaining |
| -------- | ----------- | -----:| ----------:| ---------------:|
| 1 | Authentication | 6 | 6 | 0 |
| 2 | Landing Page & Home Navigation | 32 | 10 | 22 |
| 3 | Product Management | 36 | 6 | 30 |
| 4 | Release: Creation & Scoping | 63 | 0 | 63 |
| 5 | Release: Review & Confirm | 7 | 0 | 7 |
| 6 | Release: Manage + CSRR | 15 | 0 | 15 |
| 7 | Release: SA & PQL Sign Off | 7 | 0 | 7 |
| 8 | Release: FCSR Review | 9 | 0 | 9 |
| 9 | Release: Post FCSR Actions | 7 | 0 | 7 |
| 10 | Release: Final Acceptance | 5 | 0 | 5 |
| 11 | DOC Workflow | 93 | 14 | 79 |
| 12 | Roles Delegation | 10 | 0 | 10 |
| 13 | Actions Management | 10 | 0 | 10 |
| **Total** | | **300** | **36** | **264** |

---

> **Phase 2 (deferred):** Jira/Jama sync verification, Data Ingestion API (OAuth 2.0 + 11 data domains), Data Extraction API (3 auth modes + PowerQuery), Intel DS / Informatica integration, email notification assertions.
>
> **Data sources for test implementation:** Jira user story URLs · `user-guide.md` · Confluence pages · `docs/ai/application-map.json` v1.6.0 (31 nodes, 42 links)"""

NEW_COVERAGE = """## Coverage Summary

| Workflow | Description | Cases | `[x]` Done | `[ ]` Remaining |
| -------- | ----------- | -----:| ----------:| ---------------:|
| 1 | Authentication | 6 | 6 | 0 |
| 2 | Landing Page & Home Navigation | 32 | 10 | 22 |
| 3 | Product Management | 36 | 6 | 30 |
| 4 | Release: Creation & Scoping | 85 | 0 | 85 |
| 5 | Release: Review & Confirm | 35 | 0 | 35 |
| 6 | Release: Manage + CSRR + Jira/Jama | 60 | 0 | 60 |
| 7 | Release: SA & PQL Sign Off | 20 | 0 | 20 |
| 8 | Release: FCSR Review | 25 | 0 | 25 |
| 9 | Release: Post FCSR Actions | 18 | 0 | 18 |
| 10 | Release: Final Acceptance | 15 | 0 | 15 |
| 11 | DOC Workflow | 93 | 14 | 79 |
| 12 | Roles Delegation | 10 | 0 | 10 |
| 13 | Actions Management | 10 | 0 | 10 |
| 14 | Release History | 20 | 0 | 20 |
| 15 | Stage Sidebar & Responsible Users | 13 | 0 | 13 |
| **Total** | | **478** | **36** | **442** |

---

> **Phase 2 (deferred):** Jira/Jama sync verification, Data Ingestion API (OAuth 2.0 + 11 data domains), Data Extraction API (3 auth modes + PowerQuery), Intel DS / Informatica integration, email notification assertions.
>
> **Data sources for test implementation:** Jira user story URLs · `user-guide.md` · 42 Confluence pages (1.3.x Release Management Flow) · `docs/ai/application-map.json` v1.8.0 (39 nodes, 58 links)"""

# ─── Also update the header meta line ──────────────────────────────────────────
content = content.replace(
    "> **Sources:** `application-map.json` v1.6.0 · `user-guide.md` · Confluence pages · Jira user stories",
    "> **Sources:** `application-map.json` v1.8.0 · `user-guide.md` · 42 Confluence pages (1.3.x Release Management Flow) · Jira user stories"
)
content = content.replace(
    "> **Last updated:** 2026-03-29",
    "> **Last updated:** 2026-03-30"
)

# Apply all replacements
replacements = [
    (OLD_41_END, NEW_41_END),
    (OLD_43, NEW_43),
    (OLD_44_END, NEW_44_END),
    (OLD_410_INSERT, NEW_410_INSERT),
    (OLD_WF5, NEW_WF5),
    (OLD_WF6, NEW_WF6),
    (OLD_WF7, NEW_WF7),
    (OLD_WF8, NEW_WF8),
    (OLD_WF9, NEW_WF9),
    (OLD_WF10, NEW_WF10),
    (OLD_WF12_START, NEW_WF_ADDITIONS),
    (OLD_COVERAGE, NEW_COVERAGE),
]

print("Applying replacements...")
for i, (old, new) in enumerate(replacements):
    if old in content:
        content = content.replace(old, new)
        print(f"  [{i+1}] OK: replaced {repr(old[:60])}...")
    else:
        print(f"  [{i+1}] MISS: could not find {repr(old[:80])}")

with open(PLAN_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

lines = content.count('\n')
print(f"\nDONE. automation-testing-plan.md now has {lines} lines.")
