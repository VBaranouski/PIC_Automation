#!/usr/bin/env python3
"""
expand_html_v3.py  ·  PICASso Automation Testing Plan — v1.9.0 HTML update
Regenerates automation-testing-plan.html by updating the JavaScript WF data
array and metadata fields within the existing file structure.

Strategy: targeted string replacements on the existing HTML.
Preserves all CSS, layout, and rendering JS unchanged.
"""

from pathlib import Path
import re

HTML_PATH = Path("/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/automation-testing-plan.html")

def read() -> str:
    return HTML_PATH.read_text(encoding="utf-8")

def write(text: str) -> None:
    HTML_PATH.write_text(text, encoding="utf-8")

# ────────────────────────────────────────────────────────────────
# PATCH 1 — Update top bar metadata
# ────────────────────────────────────────────────────────────────
META_OLD = "    <span>Updated: 2026-03-30</span>"
META_NEW = "    <span>Updated: 2026-03-31</span>"

# ────────────────────────────────────────────────────────────────
# PATCH 2 — Footer data sources
# ────────────────────────────────────────────────────────────────
FOOTER_OLD = """  <strong>Data sources:</strong> Jira user story URLs · <code>user-guide.md</code> · 42 Confluence pages (1.3.x Release Management Flow) ·
  <code>docs/ai/application-map.json</code> v1.8.0 (39 nodes · 58 links)"""

FOOTER_NEW = """  <strong>Data sources:</strong> Jira user story URLs · <code>user-guide.md</code> · 54 Confluence pages (1.3.x Release Management Flow + v1.9.0 features) ·
  <code>docs/ai/application-map.json</code> v1.9.0 (44 nodes · 63 links)"""

# ────────────────────────────────────────────────────────────────
# PATCH 3 — WF 2 — add two test cases in section 2.6 Header Global Actions
# ────────────────────────────────────────────────────────────────
WF2_SEC26_OLD = """      { title:"2.6 Header Global Actions", items:[
        [false, "\\"New Product\\" button in page header navigates to New Product form"],
        [false, "\\"Roles Delegation\\" link opens Roles Delegation page (new tab)"],
      ]},"""

WF2_SEC26_NEW = """      { title:"2.6 Header Global Actions", items:[
        [false, "\\"New Product\\" button in page header navigates to New Product form"],
        [false, "\\"Roles Delegation\\" link opens Roles Delegation page (new browser tab)"],
        [false, "\\"My Reports\\" shortcut link in header opens the My Reports page (if applicable)"],
      ]},"""

# ────────────────────────────────────────────────────────────────
# PATCH 4 — WF 3 — add LEAP License tests, product change history section,
#           product inactivation section, cross-org section
#           Insert after 3.2 block and expand 3.7, 3.8
# ────────────────────────────────────────────────────────────────
WF3_SEC32_OLD = """      { title:"3.2 Product Detail — View Mode", items:[
        [true,  "Product Detail page opens when clicking a product name in My Products grid"],
        [true,  "Product name and product ID (PIC-XXXX format) are visible in the page header"],
        [false, "Active/Inactive status badge is displayed correctly in the header"],
        [false, "Product Details section shows all read-only fields (Product Name, State, Definition, Type, Digital Offer, Commercial Reference Number, DPP, Brand Label)"],
        [false, "Bottom tabs load: Product Organization, Product Team, Security Summary, Product Configuration"],
        [false, "Releases tab shows the list of releases for the product (or empty state message \\"No releases were created yet!\\")"],
        [false, "\\"Create Release\\" button is present on the Releases tab"],
        [false, "Digital Offer Certification tab appears only when Digital Offer = Yes AND Product Owner is assigned"],
        [false, "Digital Offer Certification tab shows empty state message when no DOC exists yet"],
      ]},
      { title:"3.3 Product Change History", items:["""

WF3_SEC32_NEW = """      { title:"3.2 Product Detail — View Mode", items:[
        [true,  "Product Detail page opens when clicking a product name in My Products grid"],
        [true,  "Product name and product ID (PIC-XXXX format) are visible in the page header"],
        [false, "Active/Inactive status badge is displayed correctly in the header"],
        [false, "Product Details section shows all read-only fields (Product Name, State, Definition, Type, Digital Offer, Commercial Reference Number, DPP, Brand Label)"],
        [false, "Bottom tabs load: Product Organization, Product Team, Security Summary, Product Configuration"],
        [false, "Releases tab shows the list of releases for the product (or empty state message \\"No releases were created yet!\\")"],
        [false, "\\"Create Release\\" button is present on the Releases tab"],
        [false, "Digital Offer Certification tab appears only when Digital Offer = Yes AND Product Owner is assigned"],
        [false, "Digital Offer Certification tab shows empty state message when no DOC exists yet"],
        [false, "LEAP License column in Users Management grid shows \\"Active\\" for users with an assigned role and auto-activated LEAP License"],
        [false, "Users without LEAP License show \\"No License\\" in the LEAP License column; role assignment triggers automatic activation"],
      ]},
      { title:"3.3 Product Change History", items:["""

# ────────────────────────────────────────────────────────────────
# PATCH 5 — WF 3.7 Inactivation — already in HTML, update to match MD
# ────────────────────────────────────────────────────────────────
# No change needed — already 4 items in the HTML

# ────────────────────────────────────────────────────────────────
# PATCH 6 — WF 3.8 — add Cross-Org section after existing 3.8 block
# ────────────────────────────────────────────────────────────────
WF3_XORG_MARKER_OLD = """        [false, "Saving with Jira activated but empty Jira Source Link or Jira Project Key shows validation error"],
        [false, "Deactivating a tracking tool resets related fields and tracking tool radio selections to Not Applicable"],
      ]},
    ]
  },
  {
    n:4,"""

WF3_XORG_MARKER_NEW = """        [false, "Saving with Jira activated but empty Jira Source Link or Jira Project Key shows validation error"],
        [false, "Deactivating a tracking tool resets related fields and tracking tool radio selections to Not Applicable"],
      ]},
      { title:"3.9 Cross-Organizational Development", items:[
        [false, "\\"Cross-Organizational Development\\" toggle is visible on the Product Details form in edit mode"],
        [false, "Enabling the toggle reveals three fields: Development Org Level 1, Development Org Level 2, Development Org Level 3"],
        [false, "Dev Org Level dropdowns cascade: selecting L1 populates L2 options; selecting L2 populates L3 options"],
        [false, "Saving the product with all Dev Org Level fields filled persists the values and shows them in read-only mode"],
        [false, "Toggling Cross-Org Development back OFF hides the Dev Org Level fields and clears their values on save"],
        [false, "Dev Org Level fields are displayed in read-only view on the Product Information section when toggle is ON"],
        [false, "Data Extraction API exports include Cross-Org fields when the toggle is enabled (Phase 2 — deferred)"],
      ]},
    ]
  },
  {
    n:4,"""

# ────────────────────────────────────────────────────────────────
# PATCH 7 — WF 4.3 Clone — add Actions not cloned test
# ────────────────────────────────────────────────────────────────
WF43_OLD = """        [false, "Cloned release does NOT inherit any Action Items from the source"],
      ]},
      { title:"4.4"""

WF43_NEW = """        [false, "Cloned release does NOT inherit any Action Items from the source"],
        [false, "Cloned release does NOT inherit Actions Management items; Actions Management page for the cloned release is empty at creation"],
      ]},
      { title:"4.4"""

# ────────────────────────────────────────────────────────────────
# PATCH 8 — WF 4.8 Process Requirements — Import XLSX improvements
# ────────────────────────────────────────────────────────────────
WF48_OLD = """        [false, "Export XLSX button downloads the requirements file"],
        [false, "Importing a valid XLSX file updates requirement statuses and refreshes the page"],
        [false, "Importing an invalid XLSX file shows an error link; clicking it opens row-level error details"],
      ]},
      { title:"4.9"""

WF48_NEW = """        [false, "Export XLSX button downloads the requirements file; XLSX contains Instructions tab and Data tab with current requirement data"],
        [false, "\\"Import XLSX\\" button replaces legacy \\"Download Template\\" + \\"Select file\\" separate controls"],
        [false, "Clicking \\"Import XLSX\\" opens file-picker for XLSX files only; selecting a non-XLSX file shows validation error"],
        [false, "Importing a valid XLSX file updates requirement statuses and refreshes the page"],
        [false, "Import validation: incorrect file format shows format error row in validation table"],
        [false, "Import validation: missing mandatory columns shows column-level error in validation table"],
        [false, "Import validation: invalid requirement code shows code-level error row"],
        [false, "Import validation: invalid status value shows status-level error row"],
        [false, "Import validation: locked requirement with \\"Not Applicable\\" status shows row-level error"],
        [false, "Clicking an error link in the validation popup opens row-level detail with affected rows listed"],
      ]},
      { title:"4.9"""

# ────────────────────────────────────────────────────────────────
# PATCH 9 — WF 4.9 Product Requirements — Import XLSX improvements
# ────────────────────────────────────────────────────────────────
WF49_OLD = """        [false, "Download template from Custom Requirements popup downloads the XLSX template file"],
        [false, "Bulk upload via Import XLSX for custom requirements — valid file creates all requirements"],
        [false, "Bulk upload for custom requirements — invalid file shows an errors popup with row-level details"],
        [false, "\\"Requirements Status Summary\\" link opens the pie chart popup with Category filter"],
        [false, "Export XLSX button downloads the product requirements file with all current data"],
      ]},
      { title:"4.10"""

WF49_NEW = """        [false, "\\"Import XLSX\\" button (replaces legacy Download Template + Select file) is available on Product Requirements tab"],
        [false, "Export XLSX downloads product requirements with Instructions tab (color-coded mandatory fields) and Data tab"],
        [false, "Custom Requirements \\"Import XLSX\\" button replaces legacy Download Template + Select file workflow"],
        [false, "Bulk upload via Import XLSX for custom requirements — valid file creates all requirements"],
        [false, "Bulk upload for custom requirements — file format validation: non-XLSX shows error"],
        [false, "Bulk upload for custom requirements — duplicate Code validation: error shown per row with duplicate code"],
        [false, "Bulk upload for custom requirements — invalid Source Link shows row-level error in validation table"],
        [false, "Bulk upload for custom requirements — invalid Justification for removed req shows row-level error"],
        [false, "\\"Requirements Status Summary\\" link opens the pie chart popup with Category filter"],
        [false, "Export XLSX button downloads the product requirements file with all current data"],
      ]},
      { title:"4.10"""

# ────────────────────────────────────────────────────────────────
# PATCH 10 — WF 4.10 Applicability Lock — expand test list
# ────────────────────────────────────────────────────────────────
WF410_OLD = """      { title:"4.10 Process Requirements — Applicability Lock", items:[
        [false, "Requirements configured as \\"Can be marked as Not Applicable = No\\" show \\"Not Applicable\\" option disabled in the status dropdown"],
        [false, "Hovering over the disabled \\"Not Applicable\\" option shows a tooltip explaining the restriction"],
        [false, "Bulk edit popup: selecting locked requirements and attempting to set status to \\"Not Applicable\\" shows an error message"],
        [false, "Importing an XLSX file with \\"Not Applicable\\" status for a locked requirement shows a row-level validation error"],
        [false, "Locked requirement indicator is visible in the requirement row (icon or label)"],
      ]},"""

WF410_NEW = """      { title:"4.10 Process Requirements — Applicability Lock", items:[
        [false, "Requirements configured as \\"Can be marked as Not Applicable = No\\" show \\"Not Applicable\\" option disabled in the status dropdown"],
        [false, "Hovering over the disabled \\"Not Applicable\\" option shows a tooltip explaining the restriction"],
        [false, "Bulk edit popup: selecting locked requirements and attempting to set status to \\"Not Applicable\\" shows an error message listing locked requirements"],
        [false, "Importing an XLSX file with \\"Not Applicable\\" status for a locked requirement shows a row-level validation error in import validation table"],
        [false, "Locked requirement indicator is visible in the requirement row (icon or label)"],
        [false, "BackOffice \\"Can be marked as Not Applicable\\" field for a process requirement has options: Yes (default) and No"],
        [false, "Setting the BackOffice field to \\"No\\" propagates to all releases that include this requirement on next page load"],
        [false, "Jira submission error for a locked requirement attempting Not Applicable: error shown inline on the requirement row"],
      ]},"""

# ────────────────────────────────────────────────────────────────
# PATCH 11 — WF 5.2 Requirements Summary — freeze logic
# ────────────────────────────────────────────────────────────────
WF52_OLD = """        [false, "Chart burger menu offers: View Full Screen, Print, Download PNG, Download JPEG, Download SVG"],
        [false, "\\"Download PNG\\" downloads the chart as a PNG file"],
      ]},
      { title:"5.3"""

WF52_NEW = """        [false, "Chart burger menu offers: View Full Screen, Print, Download PNG, Download JPEG, Download SVG"],
        [false, "\\"Download PNG\\" downloads the chart as a PNG file"],
        [false, "While release is at Review & Confirm stage, charts reflect the live (current) requirement statuses"],
        [false, "After release advances past Review & Confirm, charts are frozen (show snapshot from stage-advance time)"],
        [false, "Returning to Review & Confirm via rework restores live chart data (un-freezes)"],
        [false, "Frozen charts display a banner or label indicating the snapshot date"],
      ]},
      { title:"5.3"""

# ────────────────────────────────────────────────────────────────
# PATCH 12 — WF 5.5 Key Discussion Topics — stage-aware editing
# ────────────────────────────────────────────────────────────────
WF55_OLD = """        [false, "Topics added in previous stages cannot be edited or deleted"],
      ]},
      { title:"5.6"""

WF55_NEW = """        [false, "Topic can be edited while the release is in the current stage it was created"],
        [false, "Topic can be deleted via trash icon while created in the current stage"],
        [false, "Topics created in a previous stage are read-only — no edit or delete icons shown"],
        [false, "After advancing to Manage stage, all Review & Confirm topics remain visible as read-only"],
        [false, "Topics added in Manage stage appear alongside earlier topics"],
        [false, "Topics are visible (read-only) on all later stages (FCSR Review, Final Acceptance etc.)"],
      ]},
      { title:"5.6"""

# ────────────────────────────────────────────────────────────────
# PATCH 13 — WF 5.7 Action Plan — updated label and creation flow
# ────────────────────────────────────────────────────────────────
WF57_OLD = """      { title:"5.7 Action Plan Items Section", items:[
        [false, "Action Plan Items section is visible; \\"Add Action\\" button opens the action creation popup"],
        [false, "Action creation popup fields: Name (mandatory), Description (mandatory), State (dropdown, mandatory), Category (dropdown, mandatory), Assignee (lookup), Due Date, Evidence, Closure Comment"],
        [false, "Saving an action without mandatory fields shows inline validation errors"],
        [false, "Saved action appears in the Action Plan Items table"],"""

WF57_NEW = """      { title:"5.7 Action Plan Items Section", items:[
        [false, "\\"Actions Summary\\" header on Review & Confirm tab reads \\"Action Plan for Scope Review Decisions\\""],
        [false, "Actions section is always visible even when no actions exist (\\"No Actions added yet\\" message shown)"],
        [false, "\\"Add Action\\" button opens the action creation popup"],
        [false, "Action creation popup fields: Name (mandatory), Description (mandatory), Category (dropdown, mandatory), Assignee (lookup), Due Date — Status is auto-set to Open (not selectable at creation)"],
        [false, "Saving an action without mandatory fields shows inline validation errors"],
        [false, "Saved action appears in the Action Plan Items table"],"""

# ────────────────────────────────────────────────────────────────
# PATCH 14 — WF 6.4 CSRR — add Jira/Jama submitted req editing sub-section
# ────────────────────────────────────────────────────────────────
WF64_OLD = """        [false, "CSRR edits are preserved after navigating away and returning to the tab"],
      ]},
      { title:"6.5 Action Items"""

WF64_NEW = """        [false, "CSRR edits are preserved after navigating away and returning to the tab"],
      ]},
      { title:"6.4b Jira/Jama Submitted Requirements — Editable Fields", items:[
        [false, "Process Requirement submitted to Jira: Status field is greyed out (read-only); Evidence Link and Justification remain editable"],
        [false, "Saving Evidence Link update on a Jira-submitted process requirement persists the new value"],
        [false, "Saving Justification update on a Jira-submitted process requirement persists the new value"],
        [false, "Product Requirement submitted to Jama: Status, Evidence, Justification, Verification Status, and Last Test Execution are all editable"],
        [false, "Product Requirement submitted to Jama: Verification Status dropdown options: Passed / Failed / Not Run / Blocked"],
        [false, "Product Requirement submitted to Jama: Last Test Execution date-picker accepts dates correctly"],
        [false, "Bulk edit for Jira-submitted process requirements allows updating Evidence and Justification for multiple selected reqs simultaneously"],
        [false, "Bulk edit for Jama-submitted product requirements allows updating all editable fields for multiple selected requirements"],
        [false, "Saving via bulk edit for Jira/Jama submitted requirements shows success confirmation; changes persist on refresh"],
      ]},
      { title:"6.5 Action Items"""

# ────────────────────────────────────────────────────────────────
# PATCH 15 — WF 6.5 Action Items — add bar chart sub-section
# ────────────────────────────────────────────────────────────────
WF65_OLD = """        [false, "\\"Refresh Data from Jira\\" updates action status from Jira using the configured status mapping"],
      ]},
      { title:"6.6 FCSR Recommendation"""

WF65_NEW = """        [false, "\\"Refresh Data from Jira\\" updates action status from Jira using the configured status mapping"],
      ]},
      { title:"6.5b Actions Management Bar Chart (Stats)", items:[
        [false, "Actions Management page shows a bar chart summarising action statuses across all releases for the product"],
        [false, "Bar chart loads with correct total action count per status category"],
        [false, "Hovering over a bar segment shows count and status label tooltip"],
        [false, "Chart updates when a new action is created or an action status changes"],
        [false, "Bar chart reflects correct counts after filtering by release number"],
      ]},
      { title:"6.6 FCSR Recommendation"""

# ────────────────────────────────────────────────────────────────
# PATCH 16 — WF 8.3 FCSR Participants — Release Team / Others tabs
# ────────────────────────────────────────────────────────────────
WF83_OLD = """      { title:"8.3 FCSR Participants", items:[
        [false, "\\"Add Participant\\" button opens popup with \\"Release Team\\" and \\"Others\\" options"],
        [false, "Release Team option: User dropdown from Roles & Responsibilities, Recommendation radiobutton, Comment (500 chars)"],
        [false, "Others option: Sailpoint UserLookup field, Role text (mandatory), Recommendation radiobutton, Comment"],
        [false, "\\"Save\\" saves participant; \\"Save & Create New\\" keeps popup open"],
        [false, "Participant added by Release Team appears in table with their role and recommendation"],
        [false, "\\"Edit\\" on a participant row pre-fills popup with existing data"],
        [false, "\\"Delete\\" on a participant row shows confirmation dialog"],
        [false, "Once release moves to Post FCSR Actions or Final Acceptance, FCSR Participants become read-only"],
        [false, "Recommendation options visible: No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go"],
      ]},"""

WF83_NEW = """      { title:"8.3 FCSR Participants", items:[
        [false, "\\"Add Participant\\" button opens popup with \\"Release Team\\" and \\"Others\\" tabs"],
        [false, "Release Team tab: User dropdown pre-populated from Roles & Responsibilities; selecting user auto-fills their role"],
        [false, "Release Team tab: Confirmation popup shown on save — \\"You are adding <Name> from the Release Team as a participant. Confirm?\\""],
        [false, "Others tab: SailPoint UserLookup field (mandatory) + Role text field (mandatory); missing Role shows validation error"],
        [false, "Others tab: confirmation popup shown before saving participant"],
        [false, "Recommendation radiobutton options: No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go"],
        [false, "Comment field accepts up to 500 characters; exceeding limit shows validation error"],
        [false, "\\"Save\\" saves participant and closes popup"],
        [false, "\\"Save & Create New\\" saves and keeps popup open for next entry"],
        [false, "Participant added from Release Team appears in table with their release role"],
        [false, "Participant added from Others appears in table with the custom Role text"],
        [false, "\\"Edit\\" on a participant row pre-fills popup with existing data (tab and fields)"],
        [false, "\\"Delete\\" on a participant row shows confirmation dialog; confirming removes the row"],
        [false, "Once release moves to Post FCSR Actions or Final Acceptance, FCSR Participants become read-only"],
      ]},"""

# ────────────────────────────────────────────────────────────────
# PATCH 17 — WF 16 — add DPP Privacy Section Requirements sections
# ────────────────────────────────────────────────────────────────
# Find end of WF 16 data block and insert two new sections
WF16_OLD = """        [false, "History entry for DPP shows the changed field and new value in the Description column"],
      ]},
    ]
  },
];"""

WF16_NEW = """        [false, "History entry for DPP shows the changed field and new value in the Description column"],
      ]},
      { title:"16.7 Privacy Section — Requirements List (BackOffice)", items:[
        [false, "BackOffice Privacy Section detail page contains a \\"Requirements List\\" tab alongside existing tabs"],
        [false, "\\"Requirements List\\" tab shows a table of requirements mapped to this privacy section"],
        [false, "Adding a requirement to a privacy section makes it appear on the DPP Review tab of applicable releases"],
        [false, "Removing a requirement from the privacy section removes it from DPP Review tab (next load)"],
        [false, "Requirements added to a Privacy Section are listed on the DPP Review tab under the relevant section heading"],
        [false, "Sub-requirements of a privacy-section requirement are also shown under the section when expanded"],
      ]},
      { title:"16.8 DPP Review Tab — Requirements from Privacy Sections", items:[
        [false, "When a release has DPP applicable and Privacy Sections are configured with requirements, those requirements appear on the DPP Review tab"],
        [false, "Requirements shown on DPP Review tab: Name, Code, Status (editable dropdown), Evidence, Justification"],
        [false, "Changing the status of a privacy-section requirement saves correctly and persists after page reload"],
        [false, "Requirements that are part of a Privacy Section are excluded from the CSRR tab when DPP is applicable (no duplication)"],
        [false, "\\"Evaluation Status\\" filter on DPP Review tab narrows visible requirements to selected evaluation status"],
        [false, "\\"Reset\\" button on the DPP Review tab clears the Evaluation Status filter and restores all requirements"],
      ]},
    ]
  },
  {
    n:17, title:"Maintenance Mode", icon:"🔧", color:"#8b949e",
    spec:"maintenance/maintenance-mode.spec.ts", po:"—",
    sections:[
      { title:"17.1 Maintenance Page — Unprivileged User View", items:[
        [false, "When Maintenance Mode is active: users without privilege are redirected to the Maintenance Page on any PICASso URL"],
        [false, "Maintenance Page displays a maintenance message (configured in BackOffice)"],
        [false, "Maintenance Page does not show any PICASso navigation (no header, no sidebar)"],
        [false, "Attempting to navigate to any PICASso route while maintenance is active returns the user to the Maintenance Page"],
      ]},
      { title:"17.2 Maintenance Mode — Privileged Access", items:[
        [false, "Users with \\"System Access during Maintenance\\" privilege can access PICASso normally during maintenance"],
        [false, "Privileged users see a maintenance warning banner within PICASso indicating maintenance mode is active"],
        [false, "Privileged users can perform all standard PICASso actions during maintenance without restriction"],
      ]},
      { title:"17.3 Maintenance Mode Configuration (BackOffice)", items:[
        [false, "BackOffice shows a \\"Maintenance Mode Configuration\\" section (privilege: View Maintenance Mode Configuration)"],
        [false, "\\"Edit Maintenance Mode Configuration\\" button is visible for users with Edit privilege"],
        [false, "Toggling Maintenance Mode ON via BackOffice immediately redirects non-privileged users to the Maintenance Page"],
        [false, "Maintenance message text can be edited in BackOffice and appears verbatim on the Maintenance Page"],
        [false, "Toggling Maintenance Mode OFF via BackOffice restores normal access for all users immediately"],
        [false, "Maintenance mode state (on/off) is persisted across page reloads (not reset on server restart)"],
        [false, "Audit log in BackOffice records when Maintenance Mode was enabled and disabled (user + timestamp)"],
        [false, "Maintenance Mode toggle is only visible to users with the appropriate BackOffice admin role"],
      ]},
    ]
  },
];"""

# ────────────────────────────────────────────────────────────────
# PATCH 18 — Release pipeline — add stage 17 to pipeline array if referenced
# The pipeline only includes stages 1-7 (Creation→Final Acceptance), keep as-is
# ────────────────────────────────────────────────────────────────


# ────────────────────────────────────────────────────────────────
# Apply all patches
# ────────────────────────────────────────────────────────────────

def apply_patches():
    text = read()

    patches = [
        ("meta updated date",     META_OLD,         META_NEW),
        ("footer data sources",   FOOTER_OLD,       FOOTER_NEW),
        ("WF2 section 2.6",       WF2_SEC26_OLD,    WF2_SEC26_NEW),
        ("WF3 section 3.2 LEAP",  WF3_SEC32_OLD,    WF3_SEC32_NEW),
        ("WF3 cross-org section", WF3_XORG_MARKER_OLD, WF3_XORG_MARKER_NEW),
        ("WF4.3 clone actions",   WF43_OLD,         WF43_NEW),
        ("WF4.8 import XLSX",     WF48_OLD,         WF48_NEW),
        ("WF4.9 import XLSX",     WF49_OLD,         WF49_NEW),
        ("WF4.10 applic lock",    WF410_OLD,        WF410_NEW),
        ("WF5.2 req summary",     WF52_OLD,         WF52_NEW),
        ("WF5.5 topics",          WF55_OLD,         WF55_NEW),
        ("WF5.7 action plan",     WF57_OLD,         WF57_NEW),
        ("WF6.4 jira/jama edits", WF64_OLD,         WF64_NEW),
        ("WF6.5 bar chart",       WF65_OLD,         WF65_NEW),
        ("WF8.3 participants",    WF83_OLD,         WF83_NEW),
        ("WF16 privacy sections", WF16_OLD,         WF16_NEW),
    ]

    for name, old, new in patches:
        if old not in text:
            print(f"  ⚠️  SKIP (not found): {name}")
        else:
            text = text.replace(old, new, 1)
            print(f"  ✅  Applied: {name}")

    write(text)

    lines = text.splitlines()
    done_count = text.count("[true,")
    todo_count = text.count("[false,")
    print(f"\n✅ automation-testing-plan.html updated to v1.9.0")
    print(f"   Lines     : {len(lines)}")
    print(f"   [true,]   : {done_count}  (automated)")
    print(f"   [false,]  : {todo_count}  (remaining)")
    print(f"   Total cases: {done_count + todo_count}")


if __name__ == "__main__":
    print("Applying v1.9.0 HTML patches …")
    apply_patches()
