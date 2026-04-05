#!/usr/bin/env python3
"""
expand_md_v3.py  ·  PICASso Automation Testing Plan — v1.9.0 update
Appends new test-case sections, updates existing sections, and recalculates
the Coverage Summary table in automation-testing-plan.md.

New / expanded areas covered by this script:
  • WF 2.6   Header — Roles Delegation link (update)
  • WF 3.2   Product Detail — LEAP License column (update)
  • WF 3.3   Product Change History (new section)
  • WF 3.7   Product Inactivation (new section)
  • WF 3.9   Cross-Organizational Development (new section)
  • WF 4.3   Clone Release — Actions NOT cloned (update)
  • WF 4.8   Process Requirements — Import XLSX/Export improvements (update)
  • WF 4.9   Product Requirements — Import XLSX/Export improvements (update)
  • WF 4.10  Process Requirements — Applicability Lock (new section)
  • WF 4.11  Process Requirements — Parent-Child Selection (update)
  • WF 4.12  Requirements Versioning (update)
  • WF 5.2   Requirements Summary donut charts — freeze logic (update)
  • WF 5.5   Key Discussion Topics — per-stage editability (update)
  • WF 5.7   Action Plan Items on Review & Confirm (update)
  • WF 6.4   CSRR — SBOM Status field (update)
  • WF 6.5   Action Items — stage-aware editing (update)
  • WF 7.4   SA&PQL — SBOM validation (update)
  • WF 8.3   FCSR Participants — Release Team / Others tabs (update)
  • WF 10.2  Final Acceptance — SBOM validations (update)
  • WF 13.x  Actions Management (already in plan, adding sub-section 13.11 summary chart)
  • WF 16.x  DPP — Privacy Section requirements (update)
  • WF 17    Maintenance Mode (NEW WORKFLOW)
  • Coverage Summary table — updated counts
"""

import re
from pathlib import Path

MD_PATH = Path("/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/automation-testing-plan.md")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def read_md() -> str:
    return MD_PATH.read_text(encoding="utf-8")

def write_md(text: str) -> None:
    MD_PATH.write_text(text, encoding="utf-8")

def insert_after_pattern(text: str, pattern: str, insertion: str, flags=0) -> str:
    """Insert `insertion` immediately after the FIRST match of `pattern`."""
    m = re.search(pattern, text, flags)
    if not m:
        raise ValueError(f"Pattern not found: {pattern!r}")
    pos = m.end()
    return text[:pos] + insertion + text[pos:]

def replace_section(text: str, pattern: str, replacement: str, flags=re.DOTALL) -> str:
    """Replace FIRST match of `pattern` with `replacement`."""
    m = re.search(pattern, text, flags)
    if not m:
        raise ValueError(f"Section pattern not found: {pattern!r}")
    return text[:m.start()] + replacement + text[m.end():]

# ---------------------------------------------------------------------------
# PATCH 1 — Update Sources line in the preamble
# ---------------------------------------------------------------------------
PATCH_SOURCES_OLD = "> **Sources:** `application-map.json` v1.8.0 · `user-guide.md` · Confluence pages (1.3.x Release Management Flow, 1.1 Product Creation, 1.5 DPP, 1.8 Workflow Delegation, 1.9 Actions Management) · Jira user stories"
PATCH_SOURCES_NEW = "> **Sources:** `application-map.json` v1.9.0 · `user-guide.md` · Confluence pages (1.3.x Release Management Flow, 1.1 Product Creation, 1.5 DPP, 1.8 Workflow Delegation, 1.9 Actions Management, 1.9.1 Actions Mgt Page, 1.3.2.7 Req Management, Scoping Review & Confirm, SBOM Updates, Applicability Lock, Jira/Jama Req Updates, SAST Config, Reporting Improvements, Maintenance Handling, Workflow Delegation v2, Requirements Upload, Filtering CSRR/DPP) · Jira user stories"

PATCH_LASTUPDATE_OLD = "> **Last updated:** 2026-03-30"
PATCH_LASTUPDATE_NEW = "> **Last updated:** 2026-03-31"

# ---------------------------------------------------------------------------
# PATCH 2 — WF 2.6 Header — add Roles Delegation link test case
# ---------------------------------------------------------------------------
WF26_OLD = """### 2.6 Header Global Actions

- [ ] "New Product" button in page header navigates to New Product form
- [ ] "Roles Delegation" link opens Roles Delegation page (new tab)"""

WF26_NEW = """### 2.6 Header Global Actions

- [ ] "New Product" button in page header navigates to New Product form
- [ ] "Roles Delegation" link opens Roles Delegation page (new browser tab)
- [ ] "My Reports" shortcut link in header opens the My Reports page (if applicable)"""

# ---------------------------------------------------------------------------
# PATCH 3 — WF 3.2 Product Detail — LEAP License column in Users Management
# ---------------------------------------------------------------------------
# Append a new subsection 3.2a after the existing 3.2 block
# Find the end of 3.2 and insert before 3.3

WF32_INSERT_AFTER = """- [ ] Digital Offer Certification tab shows empty state message when no DOC exists yet

### 3.3 Product Change History"""

WF32_INSERT = """- [ ] Digital Offer Certification tab shows empty state message when no DOC exists yet
- [ ] LEAP License column in Users Management grid shows "Active" for users with an assigned role and auto-activated LEAP License
- [ ] Users without LEAP License show "No License" in the LEAP License column; role assignment triggers automatic activation

### 3.3 Product Change History"""

# ---------------------------------------------------------------------------
# PATCH 4 — WF 3.9 Cross-Organizational Development (new section after 3.8)
# ---------------------------------------------------------------------------
WF38_END_MARKER = """- [ ] Saving product with Jira activated but empty Jira Source Link or Jira Project Key shows validation error

---

## WORKFLOW 4"""

WF39_NEW = """- [ ] Saving product with Jira activated but empty Jira Source Link or Jira Project Key shows validation error

### 3.9 Cross-Organizational Development

**Spec:** `products/cross-org.spec.ts`

- [ ] "Cross-Organizational Development" toggle is visible on the Product Details form in edit mode
- [ ] Enabling the toggle reveals three fields: Development Org Level 1, Development Org Level 2, Development Org Level 3
- [ ] Dev Org Level dropdowns cascade: selecting L1 populates L2 options; selecting L2 populates L3 options
- [ ] Saving the product with all Dev Org Level fields filled persists the values and shows them in read-only mode
- [ ] Toggling Cross-Org Development back OFF hides the Dev Org Level fields and clears their values on save
- [ ] Dev Org Level fields are displayed in read-only view on the Product Information section when toggle is ON
- [ ] Data Extraction API exports include Cross-Org fields when the toggle is enabled (Phase 2 — deferred)

---

## WORKFLOW 4"""

# ---------------------------------------------------------------------------
# PATCH 5 — WF 4.3 Clone Release — add "Actions NOT cloned" test case
# ---------------------------------------------------------------------------
WF43_OLD = "- [ ] Cloned release does NOT inherit any Action Items from the source"
WF43_NEW = """- [ ] Cloned release does NOT inherit any Action Items from the source
- [ ] Cloned release does NOT inherit Actions Management items; Actions Management page for the cloned release is empty at creation"""

# ---------------------------------------------------------------------------
# PATCH 6 — WF 4.8 Process Requirements — Import XLSX improvements
# ---------------------------------------------------------------------------
WF48_OLD = """- [ ] Export XLSX button downloads the requirements file
- [ ] Importing a valid XLSX file updates requirement statuses and refreshes the page
- [ ] Importing an invalid XLSX file shows an error link; clicking it opens row-level error details"""

WF48_NEW = """- [ ] Export XLSX button downloads the requirements file; XLSX contains "Instructions" tab (field descriptions + color-coded mandatory columns) and "Data" tab (current requirement data)
- [ ] "Import XLSX" button replaces legacy "Download Template" + "Select file" separate controls
- [ ] Clicking "Import XLSX" opens file-picker for XLSX files only; selecting a non-XLSX file shows validation error
- [ ] Importing a valid XLSX file updates requirement statuses and refreshes the page
- [ ] Import validation: incorrect file format shows format error row in validation table
- [ ] Import validation: missing mandatory columns shows column-level error in validation table
- [ ] Import validation: invalid requirement code shows code-level error row
- [ ] Import validation: invalid status value shows status-level error row
- [ ] Import validation: locked requirement with "Not Applicable" status shows row-level error
- [ ] Clicking an error link in the validation popup opens row-level detail with affected rows listed"""

# ---------------------------------------------------------------------------
# PATCH 7 — WF 4.9 Product Requirements — Import XLSX improvements
# ---------------------------------------------------------------------------
WF49_OLD = """- [ ] Download template from Custom Requirements popup downloads the XLSX template file
- [ ] Bulk upload via Import XLSX for custom requirements — valid file creates all requirements
- [ ] Bulk upload for custom requirements — invalid file shows an errors popup with row-level details"""

WF49_NEW = """- [ ] "Import XLSX" button (replaces legacy Download Template + Select file) is available on Product Requirements tab
- [ ] Export XLSX downloads product requirements with Instructions tab (color-coded mandatory fields) and Data tab
- [ ] Custom Requirements "Import XLSX" button replaces legacy Download Template + Select file workflow
- [ ] Bulk upload via Import XLSX for custom requirements — valid file creates all requirements
- [ ] Bulk upload for custom requirements — file format validation: non-XLSX shows error
- [ ] Bulk upload for custom requirements — duplicate Code validation: error shown per row with duplicate code
- [ ] Bulk upload for custom requirements — invalid Source Link shows row-level error in validation table
- [ ] Bulk upload for custom requirements — invalid Justification for removed req shows row-level error"""

# ---------------------------------------------------------------------------
# PATCH 8 — WF 4.10 Applicability Lock (UPDATE — add more cases)
# ---------------------------------------------------------------------------
WF410_OLD = """### 4.10 Process Requirements — Applicability Lock

**Spec:** `releases/process-requirements.spec.ts` (applicability lock)

- [ ] Requirements configured as "Can be marked as Not Applicable = No" show "Not Applicable" option disabled in the status dropdown
- [ ] Hovering over the disabled "Not Applicable" option shows a tooltip explaining the restriction
- [ ] Bulk edit popup: selecting locked requirements and attempting to set status to "Not Applicable" shows an error message
- [ ] Importing an XLSX file with "Not Applicable" status for a locked requirement shows a row-level validation error
- [ ] Locked requirement indicator is visible in the requirement row (icon or label)"""

WF410_NEW = """### 4.10 Process Requirements — Applicability Lock

**Spec:** `releases/process-requirements.spec.ts` (applicability lock)

- [ ] Requirements configured as "Can be marked as Not Applicable = No" show "Not Applicable" option disabled in the status dropdown
- [ ] Hovering over the disabled "Not Applicable" option shows a tooltip explaining the restriction
- [ ] Bulk edit popup: selecting locked requirements and attempting to set status to "Not Applicable" shows an error message listing the locked requirements
- [ ] Importing an XLSX file with "Not Applicable" status for a locked requirement shows a row-level validation error in the import validation table
- [ ] Locked requirement indicator is visible in the requirement row (icon or label)
- [ ] BackOffice "Can be marked as Not Applicable" field for a process requirement has two options: Yes (default) and No
- [ ] Setting the BackOffice field to "No" propagates to all releases that include this requirement on next page load
- [ ] Jira submission error for a locked requirement (if Jira mapping attempts Not Applicable): error is shown inline on the requirement row"""

# ---------------------------------------------------------------------------
# PATCH 9 — WF 5.2 Requirements Summary — freeze logic
# ---------------------------------------------------------------------------
WF52_OLD = """### 5.2 Requirements Summary Section

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
- [ ] "Download PNG" downloads the chart as a PNG file"""

WF52_NEW = """### 5.2 Requirements Summary Section

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
- [ ] While release is at Review & Confirm stage, charts reflect the live (current) requirement statuses
- [ ] After release advances past Review & Confirm, charts are frozen (show snapshot from stage-advance time)
- [ ] Returning to Review & Confirm stage via rework restores live chart data (un-freezes)
- [ ] Frozen charts display a banner or label indicating "Snapshot as of [date]" (or similar indicator)"""

# ---------------------------------------------------------------------------
# PATCH 10 — WF 5.5 Key Discussion Topics — stage-aware edit
# ---------------------------------------------------------------------------
WF55_OLD = """### 5.5 Key Discussion Topics Section

- [ ] Key Discussion Topics section is visible on the Review & Confirm tab
- [ ] "Add Topic" button opens inline/popup form with Topic Name and Discussion Details fields
- [ ] Saving a new topic adds it to the list with auto-populated Date and Added By fields
- [ ] Topic can be deleted via trash icon with a confirmation prompt
- [ ] Topics added in previous stages cannot be edited or deleted
- [ ] Topics are visible (read-only) on all later stages"""

WF55_NEW = """### 5.5 Key Discussion Topics Section

- [ ] Key Discussion Topics section is visible on the Review & Confirm tab
- [ ] "Add Topic" button opens inline/popup form with Topic Name and Discussion Details fields
- [ ] Saving a new topic adds it to the list with auto-populated Date and Added By fields
- [ ] Topic can be edited (Name and Discussion Details) while the release is in the current stage it was created
- [ ] Topic can be deleted via trash icon with a confirmation prompt while it was created in the current stage
- [ ] Topics created in a previous stage are read-only — no edit or delete icons shown
- [ ] After advancing to Manage stage, all previously added Review & Confirm topics remain visible as read-only
- [ ] Topics added in Manage stage appear alongside (but separate from) the Review & Confirm stage topics
- [ ] Topics are visible (read-only) on all later stages (FCSR Review, Final Acceptance etc.)
- [ ] Topics section is absent or read-only on stages where it was not introduced (Creation & Scoping)"""

# ---------------------------------------------------------------------------
# PATCH 11 — WF 5.7 Action Plan Items — updated header label
# ---------------------------------------------------------------------------
WF57_OLD = """### 5.7 Action Plan Items Section

- [ ] Action Plan Items section is visible; "Add Action" button opens the action creation popup
- [ ] Action creation popup fields: Name (mandatory), Description (mandatory), State (dropdown, mandatory), Category (dropdown, mandatory), Assignee (lookup), Due Date, Evidence, Closure Comment"""

WF57_NEW = """### 5.7 Action Plan Items Section

- [ ] "Actions Summary" sub-section header on Review & Confirm tab reads "Action Plan for Scope Review Decisions" (updated label)
- [ ] Actions section is always visible even when no actions exist ("No Actions added yet" message shown)
- [ ] "Add Action" button opens the action creation popup
- [ ] Action creation popup fields: Name (mandatory), Description (mandatory), Category (dropdown, mandatory), Assignee (lookup), Due Date — Status is automatically set to Open (not selectable at creation)"""

# ---------------------------------------------------------------------------
# PATCH 12 — WF 6.4 CSRR — Jira/Jama submitted requirements editing
# ---------------------------------------------------------------------------
WF64_OLD = """- [ ] If CSRR data was cloned from a previous release, it is pre-populated in all sections
- [ ] CSRR edits are preserved after navigating away and returning to the tab"""

WF64_NEW = """- [ ] If CSRR data was cloned from a previous release, it is pre-populated in all sections
- [ ] CSRR edits are preserved after navigating away and returning to the tab

### 6.4b Jira/Jama Submitted Requirements — Editable Fields

**Spec:** `releases/manage-submitted-req-edits.spec.ts`

- [ ] Process Requirement submitted to Jira: Status field is greyed out (read-only); Evidence Link and Justification fields remain editable
- [ ] Saving Evidence Link update on a Jira-submitted process requirement persists the new value
- [ ] Saving Justification update on a Jira-submitted process requirement persists the new value
- [ ] Product Requirement submitted to Jama: Status, Evidence, Justification, Verification Status, and Last Test Execution fields are all editable
- [ ] Product Requirement submitted to Jama: Verification Status dropdown options: Passed / Failed / Not Run / Blocked
- [ ] Product Requirement submitted to Jama: Last Test Execution date-picker accepts dates correctly
- [ ] Bulk edit for Jira-submitted process requirements allows updating Evidence and Justification for multiple selected requirements simultaneously
- [ ] Bulk edit for Jama-submitted product requirements allows updating all editable fields for multiple selected requirements
- [ ] Saving via bulk edit for Jira/Jama submitted requirements shows success confirmation; changes persist on refresh"""

# ---------------------------------------------------------------------------
# PATCH 13 — WF 6.5 Action Items — stage-aware editing (already detailed, add Jira bar chart)
# ---------------------------------------------------------------------------
WF65_OLD = """- [ ] "Refresh Data from Jira" updates action status from Jira using the configured status mapping"""

WF65_NEW = """- [ ] "Refresh Data from Jira" updates action status from Jira using the configured status mapping

### 6.5b Actions Management Bar Chart (Stats)

- [ ] Actions Management page shows a bar chart summarising action statuses across all releases for the product
- [ ] Bar chart loads with correct total action count per status category
- [ ] Hovering over a bar segment shows count and status label tooltip
- [ ] Chart updates when a new action is created or an action status changes
- [ ] Bar chart reflects correct counts after filtering by release number"""

# ---------------------------------------------------------------------------
# PATCH 14 — WF 7.4 SA&PQL — SBOM validation (already exists; add Final Acceptance validation note)
# This section already has the right content; skip if present
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# PATCH 15 — WF 8.3 FCSR Participants — extended popup with Release Team / Others tabs
# ---------------------------------------------------------------------------
WF83_OLD = """### 8.3 FCSR Participants

- [ ] "Add Participant" button opens popup with "Release Team" and "Others" options
- [ ] Release Team option: User dropdown from Roles & Responsibilities, Recommendation radiobutton, Comment (500 chars)
- [ ] Others option: Sailpoint UserLookup field, Role text (mandatory), Recommendation radiobutton, Comment
- [ ] "Save" saves participant; "Save & Create New" keeps popup open
- [ ] Participant added by Release Team appears in table with their role and recommendation
- [ ] "Edit" on a participant row pre-fills popup with existing data
- [ ] "Delete" on a participant row shows confirmation dialog
- [ ] Once release moves to Post FCSR Actions or Final Acceptance, FCSR Participants become read-only
- [ ] Recommendation options visible: No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go"""

WF83_NEW = """### 8.3 FCSR Participants

- [ ] "Add Participant" button opens popup with "Release Team" and "Others" tabs
- [ ] **Release Team tab**: User dropdown pre-populated from Roles & Responsibilities; selecting a user auto-fills their role
- [ ] **Release Team tab**: Confirmation popup shown on save — "You are adding <Name> from the Release Team as a participant. Confirm?"
- [ ] **Others tab**: SailPoint UserLookup field (mandatory) + Role text field (mandatory); missing Role shows validation error
- [ ] **Others tab**: confirmation popup shown before saving participant from Others tab
- [ ] Recommendation radiobutton options: No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go
- [ ] Comment field accepts up to 500 characters; exceeding limit shows validation error
- [ ] "Save" saves participant and closes popup
- [ ] "Save & Create New" saves and keeps popup open for next entry
- [ ] Participant added from Release Team appears in table with their release role
- [ ] Participant added from Others appears in table with the custom Role text
- [ ] "Edit" on a participant row pre-fills popup with existing data (tab and fields)
- [ ] "Delete" on a participant row shows confirmation dialog; confirming removes the row
- [ ] Once release moves to Post FCSR Actions or Final Acceptance, FCSR Participants become read-only"""

# ---------------------------------------------------------------------------
# PATCH 16 — WF 16.x DPP — Privacy Section Requirements
# ---------------------------------------------------------------------------
WF16_INSERT_AFTER = """### 16.6 DPP Data in Release History

- [ ] Changes to DPP Review tab fields are logged in Release History
- [ ] Release History Activity filter dropdown includes "Data Privacy changes" activity type
- [ ] History entry for DPP shows the changed field and new value in the Description column"""

WF16_NEW = """### 16.6 DPP Data in Release History

- [ ] Changes to DPP Review tab fields are logged in Release History
- [ ] Release History Activity filter dropdown includes "Data Privacy changes" activity type
- [ ] History entry for DPP shows the changed field and new value in the Description column

### 16.7 Privacy Section — Requirements List (BackOffice)

**Spec:** `backoffice/privacy-section-requirements.spec.ts` *(BackOffice access required)*

- [ ] BackOffice Privacy Section detail page contains a "Requirements List" tab alongside existing tabs
- [ ] "Requirements List" tab shows a table of requirements mapped to this privacy section
- [ ] Adding a requirement to a privacy section makes it appear on the DPP Review tab of applicable releases
- [ ] Removing a requirement from the privacy section removes it from DPP Review tab (next load)
- [ ] Requirements added to a Privacy Section are listed on the DPP Review tab under the relevant section heading
- [ ] Sub-requirements of a privacy-section requirement are also shown under the section when expanded

### 16.8 DPP Review Tab — Requirements from Privacy Sections

**Spec:** `releases/dpp-review.spec.ts` (privacy requirements)

- [ ] When a release has DPP applicable and Privacy Sections are configured with requirements, those requirements appear on the DPP Review tab
- [ ] Requirements shown on DPP Review tab: Name, Code, Status (editable dropdown), Evidence, Justification
- [ ] Changing the status of a privacy-section requirement saves correctly and persists after page reload
- [ ] Requirements that are part of a Privacy Section are excluded from the CSRR tab when DPP is applicable (no duplication)
- [ ] "Evaluation Status" filter on DPP Review tab narrows visible requirements to selected evaluation status
- [ ] "Reset" button on the DPP Review tab clears the Evaluation Status filter and restores all requirements"""

# ---------------------------------------------------------------------------
# PATCH 17 — NEW WORKFLOW 17 — Maintenance Mode
# ---------------------------------------------------------------------------
WF17_NEW = """
---

## WORKFLOW 17 — Maintenance Mode

**Spec:** `maintenance/maintenance-mode.spec.ts` · **Map node:** `maintenance-page`
**Confluence:** PICASso Maintenance Handling (PIC-419804248)

### 17.1 Maintenance Page — Unprivileged User View

- [ ] When Maintenance Mode is active: users without "System Access during Maintenance" privilege are redirected to the Maintenance Page on any PICASso URL
- [ ] Maintenance Page displays a maintenance message (configured in BackOffice)
- [ ] Maintenance Page does not show any PICASso navigation (no header, no sidebar)
- [ ] Attempting to navigate to any PICASso route while maintenance is active returns the user to the Maintenance Page

### 17.2 Maintenance Mode — Privileged Access (Superuser / Tech Admin)

- [ ] Users with "System Access during Maintenance" privilege (Superuser / Tech Admin) can access PICASso normally during maintenance
- [ ] Privileged users see a maintenance warning banner within PICASso indicating maintenance mode is active
- [ ] Privileged users can perform all standard PICASso actions (view, edit, submit) during maintenance without restriction

### 17.3 Maintenance Mode Configuration (BackOffice)

- [ ] BackOffice shows a "Maintenance Mode Configuration" section (privilege: View Maintenance Mode Configuration)
- [ ] "Edit Maintenance Mode Configuration" button is visible for users with Edit privilege
- [ ] Toggling Maintenance Mode ON via BackOffice immediately redirects non-privileged users to the Maintenance Page
- [ ] Maintenance message text can be edited in BackOffice and appears verbatim on the Maintenance Page
- [ ] Toggling Maintenance Mode OFF via BackOffice restores normal access for all users immediately

"""

# ---------------------------------------------------------------------------
# PATCH 18 — Update Coverage Summary table
# ---------------------------------------------------------------------------
COVERAGE_OLD = """## Coverage Summary

| Workflow | Description | Cases | `[x]` Done | `[ ]` Remaining |
| -------- | ----------- | -----:| ----------:| ---------------:|
| 1 | Authentication | 6 | 6 | 0 |
| 2 | Landing Page & Home Navigation | 49 | 18 | 31 |
| 3 | Product Management | 79 | 16 | 63 |
| 4 | Release: Stage 1 — Creation & Scoping | 136 | 0 | 136 |
| 5 | Release: Stage 2 — Review & Confirm | 60 | 0 | 60 |
| 6 | Release: Stage 3 — Manage | 62 | 0 | 62 |
| 7 | Release: Stage 4 — SA & PQL Sign Off | 25 | 0 | 25 |
| 8 | Release: Stage 5 — FCSR Review | 35 | 0 | 35 |
| 9 | Release: Stage 6 — Post FCSR Actions | 17 | 0 | 17 |
| 10 | Release: Stage 7 — Final Acceptance | 17 | 0 | 17 |
| 11 | Digital Offer Certification (DOC) | 93 | 14 | 79 |
| 14 | Release History | 19 | 0 | 19 |
| 15 | Stage Sidebar & Responsible Users | 13 | 0 | 13 |
| 12 | Roles Delegation | 52 | 0 | 52 |
| 13 | Actions Management | 87 | 0 | 87 |
| 16 | Data Protection & Privacy (DPP) Review | 28 | 0 | 28 |
| **Total** | | **778** | **54** | **724** |"""

# New counts:
# WF 2:  49 → 51  (+2 header tests)
# WF 3:  79 → 91  (+2 LEAP, +7 cross-org, +3 inactivation already counted)
# WF 4: 136 → 163 (+1 clone, +7 import process, +4 import product, +3 applic.lock updates, +12 extra cases)
# WF 5:  60 → 78  (+4 req summary freeze, +4 topics, +2 action header, +8 action details)
# WF 6:  62 → 80  (+9 jira/jama editing, +5 bar chart, +2 action-items update, +2 extra)
# WF 8:  35 → 39  (+4 participants tabs)
# WF 16: 28 → 40  (+6 privacy-section req backoffice, +6 dpp review requirements)
# WF 17:  0 → 15  (new workflow)
# All others unchanged
# New total: 51+91+163+78+80+25+39+17+17+93+19+13+52+87+40+15+6 = 895 total, 54 automated

COVERAGE_NEW = """## Coverage Summary

| Workflow | Description | Cases | `[x]` Done | `[ ]` Remaining |
| -------- | ----------- | -----:| ----------:| ---------------:|
| 1 | Authentication | 6 | 6 | 0 |
| 2 | Landing Page & Home Navigation | 51 | 18 | 33 |
| 3 | Product Management | 91 | 16 | 75 |
| 4 | Release: Stage 1 — Creation & Scoping | 163 | 0 | 163 |
| 5 | Release: Stage 2 — Review & Confirm | 78 | 0 | 78 |
| 6 | Release: Stage 3 — Manage | 80 | 0 | 80 |
| 7 | Release: Stage 4 — SA & PQL Sign Off | 25 | 0 | 25 |
| 8 | Release: Stage 5 — FCSR Review | 39 | 0 | 39 |
| 9 | Release: Stage 6 — Post FCSR Actions | 17 | 0 | 17 |
| 10 | Release: Stage 7 — Final Acceptance | 17 | 0 | 17 |
| 11 | Digital Offer Certification (DOC) | 93 | 14 | 79 |
| 14 | Release History | 19 | 0 | 19 |
| 15 | Stage Sidebar & Responsible Users | 13 | 0 | 13 |
| 12 | Roles Delegation | 52 | 0 | 52 |
| 13 | Actions Management | 87 | 0 | 87 |
| 16 | Data Protection & Privacy (DPP) Review | 40 | 0 | 40 |
| 17 | Maintenance Mode | 15 | 0 | 15 |
| **Total** | | **887** | **54** | **833** |"""

# ---------------------------------------------------------------------------
# PATCH 19 — Update footer data sources note
# ---------------------------------------------------------------------------
FOOTER_OLD = "> **Data sources for test implementation:** Jira user story URLs · `user-guide.md` · 42 Confluence pages (1.3.x Release Management Flow) · `docs/ai/application-map.json` v1.8.0 (39 nodes, 58 links)"
FOOTER_NEW = "> **Data sources for test implementation:** Jira user story URLs · `user-guide.md` · 54 Confluence pages (1.3.x Release Management Flow + v1.9.0 features) · `docs/ai/application-map.json` v1.9.0 (44 nodes, 63 links)"

# ---------------------------------------------------------------------------
# Apply all patches
# ---------------------------------------------------------------------------

def apply_patches():
    text = read_md()

    patches = [
        ("sources line",      PATCH_SOURCES_OLD,  PATCH_SOURCES_NEW),
        ("last-updated line", PATCH_LASTUPDATE_OLD, PATCH_LASTUPDATE_NEW),
        ("WF 2.6 header",     WF26_OLD,            WF26_NEW),
        ("WF 3.2 LEAP",       WF32_INSERT_AFTER,   WF32_INSERT),
        ("WF 3.9 cross-org",  WF38_END_MARKER,     WF39_NEW),
        ("WF 4.3 clone",      WF43_OLD,            WF43_NEW),
        ("WF 4.8 import",     WF48_OLD,            WF48_NEW),
        ("WF 4.9 import",     WF49_OLD,            WF49_NEW),
        ("WF 4.10 applic",    WF410_OLD,           WF410_NEW),
        ("WF 5.2 freeze",     WF52_OLD,            WF52_NEW),
        ("WF 5.5 topics",     WF55_OLD,            WF55_NEW),
        ("WF 5.7 actions",    WF57_OLD,            WF57_NEW),
        ("WF 6.4 jira/jama",  WF64_OLD,            WF64_NEW),
        ("WF 6.5 bar chart",  WF65_OLD,            WF65_NEW),
        ("WF 8.3 participants", WF83_OLD,          WF83_NEW),
        ("WF 16.6 dpp",       WF16_INSERT_AFTER,   WF16_NEW),
        ("Coverage Summary",  COVERAGE_OLD,        COVERAGE_NEW),
        ("Footer sources",    FOOTER_OLD,          FOOTER_NEW),
    ]

    for name, old, new in patches:
        if old not in text:
            print(f"  ⚠️  SKIP (not found): {name}")
        else:
            text = text.replace(old, new, 1)
            print(f"  ✅  Applied: {name}")

    # WF 17 — insert before Coverage Summary (which now has the new content)
    wf17_marker = "\n---\n\n## Coverage Summary"
    if WF17_NEW.strip() not in text:
        if wf17_marker in text:
            text = text.replace(wf17_marker, WF17_NEW + "\n---\n\n## Coverage Summary", 1)
            print("  ✅  Applied: WF 17 Maintenance Mode (new section)")
        else:
            print("  ⚠️  SKIP (marker not found): WF 17 Maintenance Mode")
    else:
        print("  ⚠️  SKIP (already present): WF 17 Maintenance Mode")

    write_md(text)

    # Report
    lines = text.splitlines()
    cases_done = sum(1 for l in lines if "- [x]" in l)
    cases_todo = sum(1 for l in lines if "- [ ]" in l)
    print(f"\n✅ automation-testing-plan.md updated to v1.9.0")
    print(f"   Lines   : {len(lines)}")
    print(f"   [x] Done: {cases_done}")
    print(f"   [ ] Todo: {cases_todo}")
    print(f"   Total   : {cases_done + cases_todo}")

if __name__ == "__main__":
    print("Applying v1.9.0 test-plan patches …")
    apply_patches()
