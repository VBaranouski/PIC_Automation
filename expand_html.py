"""
Update automation-testing-plan.html with expanded WF4-WF10 and add WF14/WF15.
"""

HTML_PATH = "/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/automation-testing-plan.html"

with open(HTML_PATH, encoding='utf-8') as f:
    content = f.read()

# ─── WF4: expand 4.1, 4.3, 4.4, add 4.10/4.11/4.12 ─────────────────────────

OLD_41 = '''      { title:"4.1 Create Release Dialog", items:[
        [false, "\\"Create Release\\" button on Product Releases tab opens the Create Release dialog"],
        [false, "Dialog shows Release Type radio buttons (New Product Release / Existing Product Release)"],
        [false, "Release Version field is required — submitting empty shows a validation error"],
        [false, "Target Release Date field is required — past date selection is prevented"],
        [false, "\\"Continuous Penetration Testing\\" checkbox reveals the Cont. Pen Test Contract Date field"],
        [false, "\\"Create & Scope\\" button creates the release and redirects to Release Detail page"],
        [false, "Newly created release appears in the product's Releases tab list"],
        [false, "Cannot create a release with the same name as a cancelled release (error is shown)"],
        [false, "Creating a release with the same name as an inactivated release is allowed"],
      ]},'''

NEW_41 = '''      { title:"4.1 Create Release Dialog", items:[
        [false, "\\"Create Release\\" button on Product Releases tab opens the Create Release dialog"],
        [false, "Dialog shows Release Type radio buttons (New Product Release / Existing Product Release)"],
        [false, "Release Version field is required — submitting empty shows a validation error"],
        [false, "Target Release Date field is required — past date selection is prevented"],
        [false, "\\"Continuous Penetration Testing\\" checkbox reveals the Cont. Pen Test Contract Date field"],
        [false, "\\"Create & Scope\\" button creates the release and redirects to Release Detail page"],
        [false, "Newly created release appears in the product's Releases tab list"],
        [false, "Cannot create a release with the same name as a cancelled release (error is shown)"],
        [false, "Creating a release with the same name as an inactivated release is allowed"],
        [false, "\\"Existing Product Release\\" radio shows extra field \\"Was pen test performed? (Yes/No)\\""],
        [false, "Selecting \\"Yes\\" for pen test reveals \\"Last Pen Test Type\\" (Full/Partial/Continuous) and \\"Last Pen Test Date\\" fields"],
        [false, "Selecting \\"No\\" for pen test reveals a mandatory \\"Justification\\" field; creating without it shows validation error"],
        [false, "Second+ release: Create Release button shows two options — \\"Clone from existing release\\" or \\"Create as new\\" radio"],
      ]},'''

OLD_43 = '''      { title:"4.3 Clone Release", items:[
        [false, "\\"Clone\\" option in release Actions column opens the Clone Release dialog"],
        [false, "Clone dialog requires a unique Release Version — duplicate name shows error"],
        [false, "Target Release Date in clone dialog cannot be set in the past"],
        [false, "Successfully cloned release inherits Release Details dates (Cont. Pen Test Contract Date, Last Full Pen Test Date, Last BU SO FCSR Date)"],
        [false, "Cloned release inherits Roles & Responsibilities Product Team assignments"],
        [false, "Cloned release inherits Questionnaire answers from the source release"],
        [false, "Cloned release inherits Process and Product Requirements with their statuses, evidence links, and justifications"],
        [false, "Cloned release FCSR Review tab contains no data"],
        [false, "Cloned release Review & Confirm tab contains no data"],
        [false, "Warning icon is shown on Questionnaire tab if new/updated questions exist in the cloned release"],
      ]},'''

NEW_43 = '''      { title:"4.3 Clone Release", items:[
        [false, "\\"Clone\\" option in release Actions column opens the Clone Release dialog with \\"Clone from existing release\\" pre-selected"],
        [false, "Clone dialog dropdown defaults to the latest release for the product"],
        [false, "Clone dialog requires a unique Release Version — duplicate name shows validation error"],
        [false, "Target Release Date in clone dialog cannot be set in the past"],
        [false, "\\"Reset Form\\" button restores clone dialog to default values"],
        [false, "Successfully cloned release inherits Release Details dates (Cont. Pen Test Contract Date, Last Full Pen Test Date, Last BU SO FCSR Date)"],
        [false, "Cloned release inherits Roles & Responsibilities Product Team assignments"],
        [false, "Cloned release inherits Questionnaire answers from the source release"],
        [false, "Cloned Questionnaire tab shows warning: \\"Some answers were inherited during cloning... Please review and update if needed\\""],
        [false, "Cloned release inherits Process Requirements (Planned, Done, In Progress, Not Applicable, Partial, Postponed statuses all preserved)"],
        [false, "Requirements inherited with Done status are hidden by default; visible when \\"Show All Requirements\\" toggle is ON"],
        [false, "Cloned release inherits Product Requirements with their statuses, evidence links, and justifications"],
        [false, "Cloned release inherits all CSRR section data (SDL Process Summary, Product Req Summary, System Design, Threat Model, 3rd Party, SCA, Static CA, FOSS, Security Defects, External Vulnerabilities)"],
        [false, "Cloned release FCSR Decision tab contains no data (no previous participants or decision)"],
        [false, "Cloned release Review & Confirm tab contains no Scope Review Participants or Discussion Topics"],
        [false, "Cloned release does NOT inherit any Action Items from the source"],
      ]},'''

OLD_44 = '''      { title:"4.4 Release Detail Page — Header & Workflow Pipeline", items:[
        [false, "Release Detail page loads from My Releases grid or from a product's Releases tab"],
        [false, "Breadcrumb shows Home > Product Name > Release Version"],
        [false, "Release status badge (Active, green) is visible in the header"],
        [false, "Release pipeline bar shows all 7 stage names (Creation & Scoping, Review & Confirm, Manage, Security & Privacy Readiness Sign Off, FCSR Review, Post FCSR Actions, Final Acceptance)"],
        [false, "Current active stage is highlighted in the pipeline bar"],
        [false, "\\"View Flow\\" button opens the workflow progress popup"],
        [false, "Workflow popup shows submission counts, responsible usernames, and completion dates for completed stages"],
        [false, "At Creation & Scoping stage, responsible users are pre-calculated based on Minimum Oversight Level and Last BU SO FCSR Date"],
        [false, "After questionnaire submission, workflow popup updates responsible users if Risk Classification changes"],
        [false, "\\"Need Help\\" button is present and clickable"],
      ]},'''

NEW_44 = '''      { title:"4.4 Release Detail Page — Header & Workflow Pipeline", items:[
        [false, "Release Detail page loads from My Releases grid or from a product's Releases tab"],
        [false, "Breadcrumb shows Home > Product Name > Release Version"],
        [false, "Release status badge (Active, green) is visible in the header"],
        [false, "Release pipeline bar shows all 7 stage names (Creation & Scoping, Review & Confirm, Manage, Security & Privacy Readiness Sign Off, FCSR Review, Post FCSR Actions, Final Acceptance)"],
        [false, "Current active stage is highlighted in the pipeline bar"],
        [false, "\\"View Flow\\" button opens the workflow progress popup"],
        [false, "Workflow popup shows submission counts, responsible usernames, and completion dates for completed stages"],
        [false, "At Creation & Scoping stage, responsible users are pre-calculated based on Minimum Oversight Level and Last BU SO FCSR Date"],
        [false, "After questionnaire submission, workflow popup updates responsible users if Risk Classification changes"],
        [false, "\\"Need Help\\" button opens the Stage Sidebar panel"],
        [false, "Stage Sidebar shows: current stage name, responsible users table (User/Role/Approval Date columns), stage description text, and Close (X) button"],
        [false, "When release is on Rework, orange dot indicator appears on \\"View Flow\\" link with tooltip \\"On Rework. Click here for more details\\""],
        [false, "Workflow popup shows submission counter (e.g., \\"1 from 2 submissions\\") for multi-approver stages"],
        [false, "Completed workflow stages show username and completion date in the popup"],
      ]},'''

# Add 4.10, 4.11, 4.12 before end of WF4
OLD_WF4_END = '''        [false, "\\"Requirements Status Summary\\" link opens the pie chart popup with Category filter"],
        [false, "Export XLSX button downloads the product requirements file with all current data"],
      ]},
    ]
  },
  {
    n:5,'''

NEW_WF4_END = '''        [false, "\\"Requirements Status Summary\\" link opens the pie chart popup with Category filter"],
        [false, "Export XLSX button downloads the product requirements file with all current data"],
      ]},
      { title:"4.10 Process Requirements — Applicability Lock", items:[
        [false, "Requirements configured as \\"Can be marked as Not Applicable = No\\" show \\"Not Applicable\\" option disabled in the status dropdown"],
        [false, "Hovering over the disabled \\"Not Applicable\\" option shows a tooltip explaining the restriction"],
        [false, "Bulk edit popup: selecting locked requirements and attempting to set status to \\"Not Applicable\\" shows an error message"],
        [false, "Importing an XLSX file with \\"Not Applicable\\" status for a locked requirement shows a row-level validation error"],
        [false, "Locked requirement indicator is visible in the requirement row (icon or label)"],
      ]},
      { title:"4.11 Process Requirements — Parent-Child Selection", items:[
        [false, "Clicking a parent requirement checkbox opens a dropdown popup with \\"Select parent only\\" and \\"Select parent with sub-requirements\\" options"],
        [false, "\\"Select parent only\\" selects only the parent row; sub-requirements remain unaffected"],
        [false, "\\"Select parent with sub-requirements\\" selects the parent and all its visible sub-requirements"],
        [false, "Deselecting a parent opens popup with \\"De-select parent only\\" and \\"De-select parent and sub-requirements\\" options"],
        [false, "\\"Select All\\" checkbox triggers popup with \\"Select parent requirements only\\" and \\"Select parents with sub-requirements\\" options"],
        [false, "Parent-child popup is disabled (no popup shown) when \\"Show sub-requirements\\" toggle is OFF in Product Configuration"],
      ]},
      { title:"4.12 Requirements Versioning", items:[
        [false, "When a newer requirement version is available, a warning banner appears on Process/Product Requirements tab"],
        [false, "Warning banner lists all changed requirements (field updated, new requirement added, or requirement deactivated)"],
        [false, "\\"Keep previous version\\" button closes the warning without making changes"],
        [false, "\\"Change version\\" button opens a sub-dialog with options: \\"Update status to Planned\\" or \\"Keep existing status\\""],
        [false, "Choosing \\"Update status to Planned\\" resets all changed requirements to Planned status"],
        [false, "Choosing \\"Keep existing status\\" applies new requirement version without changing statuses"],
        [false, "After applying a version change, the warning banner is replaced by an informational message"],
        [false, "Requirements versioning warning is NOT shown for releases at FCSR Readiness/FCSR Review/Final Acceptance stages"],
      ]},
    ]
  },
  {
    n:5,'''

# ─── WF5 full replacement ──────────────────────────────────────────────────────
OLD_WF5 = '''    n:5, title:"Release — Stage 2: Review & Confirm", icon:"🔍", color:"#ffa657",
    spec:"releases/review-confirm.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "\\"Submit for Review\\" action button is available on Creation & Scoping stage and submits the release"],
      [false, "After submission, pipeline bar shows \\"Review & Confirm\\" as the active stage"],
      [false, "Review & Confirm tab becomes fully visible (previously a disabled tab)"],
      [false, "Tab loads: requirements summary, previous FCSR/PCC decisions section, recommendations field, actions summary bar chart, scope review decision section"],
      [false, "Scope review decision options are available to the responsible reviewer (SA/LOB SL/BU SO)"],
      [false, "\\"Submit\\" button on Review & Confirm stage advances release to Manage stage"],
      [false, "\\"Rework\\" button returns the release to Creation & Scoping stage"],
      [false, "Delegated Requirements Traceability dialog is accessible from this stage"],
    ]}]
  },'''

NEW_WF5 = '''    n:5, title:"Release — Stage 2: Review & Confirm", icon:"🔍", color:"#ffa657",
    spec:"releases/review-confirm.spec.ts", po:"—",
    sections:[
      { title:"5.1 Stage Transition & Routing", items:[
        [false, "\\"Submit for Review\\" action button is enabled on Creation & Scoping stage and submits the release"],
        [false, "After submission, pipeline bar highlights \\"Review & Confirm\\" as the active stage"],
        [false, "Review & Confirm tab becomes fully accessible (was greyed out during Creation & Scoping)"],
        [false, "Review is routed to Security Advisor when Minimum Oversight Level = Team"],
        [false, "Review is routed to LOB Security Leader when Minimum Oversight Level = LOB Security Leader"],
        [false, "Review is routed to BU Security Officer when Minimum Oversight Level = BU Security Officer"],
        [false, "Review is routed to BU Security Officer when Last BU SO FCSR Date is older than 12 months"],
      ]},
      { title:"5.2 Requirements Summary Section", items:[
        [false, "\\"Requirements Summary\\" section is collapsed by default"],
        [false, "Expanding the section shows two sub-sections: Process Requirements and Product Requirements"],
        [false, "Process Requirements donut chart loads and reflects current requirement status distribution"],
        [false, "\\"SDL Practice\\" dropdown filter on Process Requirements chart updates the chart data"],
        [false, "\\"Include Sub-Requirements\\" toggle on Process Requirements chart updates total count"],
        [false, "Product Requirements donut chart loads correctly with status distribution"],
        [false, "\\"Category\\" and \\"Source\\" dropdown filters on Product Requirements chart update the chart"],
        [false, "\\"Include Sub-Requirements\\" toggle on Product Requirements chart updates the data"],
        [false, "Chart burger menu offers: View Full Screen, Print, Download PNG, Download JPEG, Download SVG"],
        [false, "\\"Download PNG\\" downloads the chart as a PNG file"],
      ]},
      { title:"5.3 Previous FCSR Summary Section", items:[
        [false, "\\"Previous FCSR Summary\\" section is collapsed by default"],
        [false, "Section shows a \\"Previous Release\\" dropdown pre-selected to the latest completed release"],
        [false, "Switching the dropdown to another release updates all summary fields"],
        [false, "All read-only fields populate: Status, Privacy Risk, Risk Classification, FCSR Decision Date, PCC Decision, FCSR Approval Decision, Exception Required, FCSR Approver"],
        [false, "\\"Link to Protocol File\\" field shows a clickable link if previously saved"],
        [false, "Section is hidden if no previous release has reached Post FCSR Actions or Final Acceptance stage"],
      ]},
      { title:"5.4 Scope Review Participants Section", items:[
        [false, "Scope Review Participants section is visible and expanded on the Review & Confirm tab"],
        [false, "\\"Add Participant\\" button opens the Add Participant popup"],
        [false, "Popup defaults to \\"Release Team\\" option with User dropdown (from Roles & Responsibilities)"],
        [false, "Recommendation radiobutton options: Approved / Pending / Rejected / Approved with Actions / Reworked"],
        [false, "Comment field accepts up to 500 characters; exceeding limit shows error"],
        [false, "\\"Save\\" saves the participant and closes popup"],
        [false, "\\"Save & Create New\\" saves and keeps popup open for next entry"],
        [false, "Switching to \\"Others\\" option shows Sailpoint user lookup field and mandatory Role text field"],
        [false, "Saving with \\"Others\\" option with empty Role field shows validation error"],
        [false, "Added participant appears in the participants table with their role and recommendation"],
        [false, "\\"Edit\\" button on a participant row opens the popup pre-filled with that participant's data"],
        [false, "\\"Delete\\" button on a participant row shows confirmation dialog; confirming removes the row"],
        [false, "Participants section becomes read-only when release advances past Review & Confirm stage"],
      ]},
      { title:"5.5 Key Discussion Topics Section", items:[
        [false, "Key Discussion Topics section is visible on the Review & Confirm tab"],
        [false, "\\"Add Topic\\" button opens form with Topic Name and Discussion Details fields"],
        [false, "Saving a new topic adds it to the list with auto-populated Date and Added By fields"],
        [false, "Topic can be deleted via trash icon with a confirmation prompt"],
        [false, "Topics added in previous stages cannot be edited or deleted"],
      ]},
      { title:"5.6 Scope Review Decision Section", items:[
        [false, "Scope Review Decision dropdown is editable for the responsible reviewer during Review & Confirm stage"],
        [false, "Dropdown options come from BackOffice configuration (e.g., Approved, Approved with Actions, Rework)"],
        [false, "Attempting to Submit without selecting a decision shows a mandatory field validation error"],
        [false, "\\"Rework\\" does not require a decision selection — only a justification popup"],
      ]},
      { title:"5.7 Action Plan Items Section", items:[
        [false, "Action Plan Items section is visible; \\"Add Action\\" button opens the action creation popup"],
        [false, "Action creation popup fields: Name (mandatory), Description (mandatory), State (dropdown, mandatory), Category (dropdown, mandatory), Assignee (lookup), Due Date, Evidence, Closure Comment"],
        [false, "Saving an action without mandatory fields shows inline validation errors"],
        [false, "Saved action appears in the Action Plan Items table"],
        [false, "\\"Submit Actions to Jira\\" button submits all unsynchronised actions to Jira as Feature-type items"],
        [false, "After Jira submission, a Jira link appears on each submitted action row"],
        [false, "\\"Refresh Data from Jira\\" button updates action statuses from Jira"],
      ]},
      { title:"5.8 Submit & Rework", items:[
        [false, "\\"Submit\\" button advances the release to Manage stage when Scope Review Decision is selected"],
        [false, "\\"Rework\\" button opens a rework justification popup (mandatory justification text)"],
        [false, "Submitting empty justification in rework popup shows validation error"],
        [false, "After rework: release returns to Creation & Scoping stage; orange dot appears on \\"View Flow\\" link"],
        [false, "Rework justification text is visible in the Stage Sidebar"],
      ]},
    ]
  },'''

# ─── WF6 full replacement ──────────────────────────────────────────────────────
OLD_WF6 = '''    n:6, title:"Release — Stage 3: Manage", icon:"⚙️", color:"#ff7b72",
    spec:"releases/manage-stage.spec.ts · releases/csrr.spec.ts", po:"—",
    sections:[
      { title:"6.0 Manage Stage Actions", items:[
        [false, "Release at Manage stage shows \\"Submit for SA & PQL\\" action button"],
        [false, "Process Requirements tab is fully editable at the Manage stage"],
        [false, "Product Requirements tab is fully editable at the Manage stage"],
        [false, "Requirements Traceability View dialog is accessible (shows linked Jira/Jama items per requirement)"],
        [false, "Requirements Update pop-up dialog allows per-requirement status update with evidence and justification"],
      ]},
      { title:"6.1 Cybersecurity Residual Risks (CSRR) Tab — 10 sub-sections", items:[
        [false, "CSRR tab loads and shows navigation to all 10 sub-sections"],
        [false, "SDL Processes Summary — SDL Details, SBOM Status/ID, SDL Artifacts Repository Link, SDL Gap Found, Process Requirements list, Evaluation Status, Residual Risk, and Actions fields all render and are editable"],
        [false, "Product Requirements Summary — Cybersecurity Roadmap Link, applicable/expected/essential percentage breakdowns, Evaluation Status, Residual Risk, and Actions all render"],
        [false, "System Design — section is visible only when Product Definition = System; Architecture Link, Add Component, Add Countermeasure, Residual Risk, and Actions are functional"],
        [false, "Threat Model — Threat Model Link field is mandatory; Severity/Status matrix, Threat Mitigations table, Accepted Threats table, Residual Risk, and Actions render correctly"],
        [false, "3rd Party Suppliers & SE Bricks — TPS Products grid with \\"Add TPS Product\\" button, SE Bricks/Libraries/Platforms grid with \\"Add SE Brick\\" button, Residual Risk, and Actions all render"],
        [false, "Static Code Analysis — SCA tools section, scan results section, Residual Risk, and Actions all render"],
        [false, "Software Composition Analysis — SCA tools section, results, Residual Risk, and Actions render"],
        [false, "FOSS Check — all FOSS fields render; save persists data"],
        [false, "Security Defects — SVV Test Issues section, Pen Test Details (Last Full Pen Test Date), Residual Risk, and Actions all render"],
        [false, "External Vulnerabilities — External Vulnerability Issues grid, Residual Risk, and Actions all render"],
      ]},
    ]
  },'''

NEW_WF6 = '''    n:6, title:"Release — Stage 3: Manage", icon:"⚙️", color:"#ff7b72",
    spec:"releases/manage-stage.spec.ts · releases/manage-sdl-jira.spec.ts · releases/manage-product-jama.spec.ts · releases/csrr.spec.ts · releases/action-items.spec.ts · releases/fcsr-recommendation.spec.ts", po:"—",
    sections:[
      { title:"6.1 Manage Stage Entry & Navigation", items:[
        [false, "Release at Manage stage shows \\"Submit for SA & PQL Sign Off\\" action button"],
        [false, "Process Requirements tab is fully editable at Manage stage"],
        [false, "Product Requirements tab is fully editable at Manage stage"],
        [false, "CSRR tab is accessible and all 10 sections are editable"],
        [false, "FCSR Decision tab is accessible for FCSR Recommendation provisioning"],
        [false, "Progress percentage for SDL requirements is displayed and recalculates on status changes"],
        [false, "Progress percentage for Product Requirements is displayed and updates dynamically"],
      ]},
      { title:"6.2 Manage SDL Process Requirements — Jira Integration", items:[
        [false, "\\"Submit to Jira\\" button on a Process Requirement creates a Jira Feature-type item and shows a confirmation"],
        [false, "After Jira submission, Jira link icon appears on the requirement row; clicking opens Jira"],
        [false, "Jira submission creates a Story-type item for each sub-requirement under the Feature"],
        [false, "Submitted Jira items reflect the Capability category as parent"],
        [false, "\\"Refresh Data from Jira\\" button updates requirement statuses based on current Jira status"],
        [false, "Jira status mapping: Refinement/Funnel/Ready/To Do → Planned; In Progress → In Progress; Done → Done"],
        [false, "\\"Unlink from Jira\\" action removes the Jira link and allows manual status updates"],
        [false, "\\"Relink to Jira\\" restores the link to an existing Jira item using its identifier"],
        [false, "Bulk \\"Submit to Jira\\" submits all selected requirements and shows a batch result summary"],
        [false, "Daily auto-refresh of Jira statuses is reflected on next page load (last sync timestamp visible)"],
      ]},
      { title:"6.3 Manage Product Requirements — Jama/Orchestra Integration", items:[
        [false, "\\"Submit to Jama\\" button sends selected product requirements to Jama via Orchestra integration"],
        [false, "Requirements with Postponed, Not Applicable, or Delegated status are excluded from Jama submission"],
        [false, "After successful Jama submission, a Jama link appears on each submitted requirement row"],
        [false, "Submit to Jama failure shows an error message with details from Orchestra"],
        [false, "\\"Refresh Jama Status\\" button fetches latest status from Jama and updates PICASso statuses"],
        [false, "Jama status is mapped to PICASso using the Status Mapping Configuration on Product Details"],
        [false, "\\"Unlink from Jama\\" removes the Jama link; requirement becomes manually editable"],
        [false, "\\"Relink to Jama\\" restores a previously unlinked requirement to its Jama counterpart"],
        [false, "Jira integration for Product Requirements: submit, refresh, unlink work same as for SDL Process Reqs"],
      ]},
      { title:"6.4 Cybersecurity Residual Risks (CSRR) Tab", items:[
        [false, "CSRR tab loads and shows navigation to all 10 sub-sections"],
        [false, "SDL Processes Summary — SDL Details, SDL Artifacts Repository Link, SDL Gap Found, Process Requirements list, Evaluation Status, Residual Risk, and Actions all render and are editable"],
        [false, "SBOM Status field in SDL Processes Summary — dropdown shows In Progress / Submitted / N/A options"],
        [false, "Selecting SBOM Status = \\"N/A\\" reveals mandatory Justification field; saving without it shows validation error"],
        [false, "Selecting SBOM Status = \\"In Progress\\" or \\"Submitted\\" reveals SBOM ID text field"],
        [false, "Product Requirements Summary — percentage breakdowns, Evaluation Status, Residual Risk, and Actions all render"],
        [false, "System Design — visible only when Product Definition = System; Architecture Link, Add Component, Add Countermeasure, Residual Risk, Actions are functional"],
        [false, "Threat Model — Threat Model Link, Severity/Status matrix, Threat Mitigations table, Accepted Threats, Residual Risk, Actions render correctly"],
        [false, "3rd Party Suppliers & SE Bricks — TPS Products grid with \\"Add TPS Product\\", SE Bricks grid with \\"Add SE Brick\\", Residual Risk and Actions render"],
        [false, "Static Code Analysis — SCA tools section, scan results, Residual Risk and Actions render"],
        [false, "Software Composition Analysis — SCA tools, results, Residual Risk and Actions render"],
        [false, "FOSS Check — all FOSS fields render; save persists data"],
        [false, "Security Defects — SVV Test Issues section, Pen Test Details section, Residual Risk and Actions render"],
        [false, "Security Defects: \\"Pen Test Type\\" and \\"Internal SRD/Vendor Ref Number\\" are mandatory when pen test was performed"],
        [false, "Security Defects: \\"Justification\\" field appears and is mandatory when pen test was NOT performed, Delegated, or N/A"],
        [false, "External Vulnerabilities — External Vulnerability Issues grid, Residual Risk and Actions render"],
        [false, "If CSRR data was cloned from a previous release, it is pre-populated in all sections"],
      ]},
      { title:"6.5 Action Items — Create & Manage", items:[
        [false, "CSRR tab or action panel shows an \\"Add Action\\" button to create a new action item"],
        [false, "Action creation popup requires: Name, Description, State (dropdown), Category (dropdown)"],
        [false, "Optional fields: Assignee (lookup), Due Date, Evidence (link), Closure Comment"],
        [false, "Attempting to save without mandatory fields shows inline validation errors"],
        [false, "Newly created action appears in the Action Plan Items table with correct fields"],
        [false, "Editing an existing action — clicking \\"Edit\\" pre-fills all fields; saving updates the record"],
        [false, "Changing action state to \\"Closed\\" makes \\"Closure Comment\\" field mandatory"],
        [false, "Saving a Closed action without Closure Comment shows validation error"],
        [false, "\\"Submit Actions to Jira\\" submits the action as a Jira Feature; Jira link appears after success"],
        [false, "\\"Refresh Data from Jira\\" updates action status from Jira using the configured status mapping"],
      ]},
      { title:"6.6 FCSR Recommendation (FCSR Decision Tab)", items:[
        [false, "FCSR Decision tab at Manage stage allows PO/SM to add themselves as an FCSR participant"],
        [false, "\\"Add Participant\\" popup on FCSR Decision tab shows Recommendation dropdown (No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go)"],
        [false, "Selecting \\"Go with Pre-Conditions\\" requires at least one Pre-Condition action; validation error if none"],
        [false, "Selecting \\"Go with Post-Conditions\\" requires at least one Post-Condition action; validation error if none"],
        [false, "Comment field (up to 500 chars) is optional but saves correctly"],
        [false, "Saved recommendation appears in the FCSR Decision participants table"],
        [false, "Participant can delete their own recommendation via the Delete button (with confirmation)"],
        [false, "After submission to SA & PQL, the FCSR Decision tab participant section becomes read-only for PO/SM"],
      ]},
    ]
  },'''

# ─── WF7 full replacement ──────────────────────────────────────────────────────
OLD_WF7 = '''    n:7, title:"Release — Stage 4: SA & PQL Sign Off", icon:"✍️", color:"#bc8cff",
    spec:"releases/sa-pql-signoff.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "Release at SA & PQL Sign Off stage shows action buttons: \\"Submit for FCSR Review\\" and \\"Rework\\""],
      [false, "SA evaluates requirements on CSRR tab; evaluation fields are editable by SA at this stage"],
      [false, "PQL reviews process requirements compliance"],
      [false, "Workflow popup shows N of M submissions dynamically as approvers submit"],
      [false, "A checkmark appears next to each approver who has already submitted"],
      [false, "\\"Submit for FCSR Review\\" is actionable only after all required sign-offs are received"],
      [false, "\\"Rework\\" button returns the release to Manage stage"],
    ]}]
  },'''

NEW_WF7 = '''    n:7, title:"Release — Stage 4: SA & PQL Sign Off", icon:"✍️", color:"#bc8cff",
    spec:"releases/sa-pql-signoff.spec.ts", po:"—",
    sections:[
      { title:"7.1 Stage Entry & Task Assignment", items:[
        [false, "When release reaches SA & PQL Sign Off, a task is auto-assigned to Security Advisor in My Tasks"],
        [false, "When release reaches SA & PQL Sign Off, a task is auto-assigned to PQL in My Tasks"],
        [false, "Release detail page shows \\"Submit for FCSR Review\\" and \\"Rework\\" action buttons"],
        [false, "Privacy Reviewer task is created if release has Data Protection & Privacy Review applicable"],
      ]},
      { title:"7.2 Evaluation Status Editing", items:[
        [false, "CSRR tab \\"Evaluation Status\\" dropdown on SDL Processes Summary is editable by SA at this stage"],
        [false, "Evaluation Status options: Not evaluated / Not met / Partially met / Fully met"],
        [false, "Changing Evaluation Status saves correctly and updates the auto-calculated summary"],
        [false, "Product Requirements Summary evaluation fields are also editable at this stage"],
      ]},
      { title:"7.3 Auto-Calculated Summaries", items:[
        [false, "SDL Processes Summary shows \\"Done Count / Total Count\\" auto-calculated from process requirements"],
        [false, "Product Requirements Summary shows percentage-based formula across all releases and current release"],
        [false, "Summary fields update automatically when evaluation statuses are changed"],
        [false, "\\"Fully Met\\" and \\"Partially Met\\" counts drive the Product Req completion % (Full + 0.5×Partial / Total)"],
      ]},
      { title:"7.4 SBOM Validation at SA & PQL Stage", items:[
        [false, "When SBOM Status = \\"Submitted\\", \\"SBOM ID\\" field is mandatory; submitting without it shows error"],
        [false, "When SBOM Status = \\"In Progress\\" or \\"N/A\\", SBOM ID is not required"],
        [false, "Validation error is shown inline on the CSRR tab SBOM fields"],
      ]},
      { title:"7.5 Dual Sign-Off Requirement", items:[
        [false, "Workflow popup shows \\"1 from 2 submissions\\" counter when only SA has submitted"],
        [false, "\\"Submit for FCSR Review\\" action is available to each approver independently"],
        [false, "When SA submits: My Tasks task is marked completed for SA but remains for PQL"],
        [false, "When both SA and PQL submit: release automatically advances to FCSR Review stage"],
        [false, "If one approver has submitted, the other can still \\"Rework\\" — which returns to Manage for both"],
      ]},
      { title:"7.6 Rework from SA & PQL Sign Off", items:[
        [false, "\\"Rework\\" button opens a justification popup (mandatory text field)"],
        [false, "Submitting empty justification shows validation error"],
        [false, "After rework: release returns to Manage stage"],
        [false, "Orange dot appears on \\"View Flow\\" link with tooltip \\"On Rework. Click here for more details\\""],
        [false, "Rework justification text is visible in the Stage Sidebar"],
      ]},
    ]
  },'''

# ─── WF8 full replacement ──────────────────────────────────────────────────────
OLD_WF8 = '''    n:8, title:"Release — Stage 5: FCSR Review", icon:"⚖️", color:"#f0883e",
    spec:"releases/fcsr-review.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "FCSR Decision tab loads with: Participants section, Recommendations section, Discussion Topics section, Actions section, Approval Decision section"],
      [false, "Approval Decision options are visible: Go / Go with Pre-Conditions / Go with Post-Conditions / No-Go"],
      [false, "\\"Approve FCSR\\" records the decision and advances the release"],
      [false, "\\"Escalate\\" button allows escalating to a higher oversight level (LOB or BU)"],
      [false, "\\"Rework\\" button returns the release to SA & PQL Sign Off stage"],
      [false, "Exception required flow (CISO/SVP LOB) is triggered when applicable conditions are met"],
      [false, "Report Configurator dialog is accessible from the FCSR Review tab for generating scope approval and FCSR results reports"],
      [false, "After a \\"Go\\" decision — release moves to Post FCSR Actions stage"],
      [false, "After a \\"No-Go\\" decision — release moves to Post FCSR Actions (cancellation path)"],
      [false, "After \\"Go with Pre-Conditions\\" — pre-condition actions must be closed before Final Acceptance"],
    ]}]
  },'''

NEW_WF8 = '''    n:8, title:"Release — Stage 5: FCSR Review", icon:"⚖️", color:"#f0883e",
    spec:"releases/fcsr-review.spec.ts", po:"—",
    sections:[
      { title:"8.1 Stage Entry & Routing", items:[
        [false, "Release reaches FCSR Review stage after both SA and PQL sign off"],
        [false, "FCSR Review is assigned to Security Advisor (when MOL = Team)"],
        [false, "FCSR Review is assigned to LOB Security Leader (when MOL = LOB Security Leader)"],
        [false, "FCSR Review is assigned to BU Security Officer (when MOL = BU SO or last BU SO FCSR > 12 months)"],
        [false, "Assigned reviewer receives a task in My Tasks"],
      ]},
      { title:"8.2 FCSR Decision Tab Sections", items:[
        [false, "FCSR Decision tab loads with 5 sections: Recommendation, Cybersecurity Risk Summary, FCSR Participants, Key Discussion Topics, FCSR Decision"],
        [false, "\\"Instructions\\" link in Recommendation section opens relevant guidance in a new tab"],
        [false, "Cybersecurity Risk Summary shows tiles for each CSRR group with residual risk levels"],
        [false, "Clicking a Cybersecurity Risk Summary tile opens the corresponding CSRR section in a new tab"],
        [false, "Key Discussion Topics section is editable during FCSR Review; topics can be added or existing deleted"],
      ]},
      { title:"8.3 FCSR Participants", items:[
        [false, "\\"Add Participant\\" button opens popup with \\"Release Team\\" and \\"Others\\" options"],
        [false, "Release Team option: User dropdown from Roles & Responsibilities, Recommendation radiobutton, Comment (500 chars)"],
        [false, "Others option: Sailpoint UserLookup field, Role text (mandatory), Recommendation radiobutton, Comment"],
        [false, "\\"Save\\" saves participant; \\"Save & Create New\\" keeps popup open"],
        [false, "Participant added by Release Team appears in table with their role and recommendation"],
        [false, "\\"Edit\\" on a participant row pre-fills popup with existing data"],
        [false, "\\"Delete\\" on a participant row shows confirmation dialog"],
        [false, "Once release moves to Post FCSR Actions or Final Acceptance, FCSR Participants become read-only"],
        [false, "Recommendation options: No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go"],
      ]},
      { title:"8.4 FCSR Decision & Outcomes", items:[
        [false, "FCSR Approval Decision dropdown options: No-Go / Go with Pre-Conditions / Go with Post-Conditions / Go"],
        [false, "\\"Exception Required\\" toggle enables CISO checkbox and/or SVP LOB checkbox"],
        [false, "Comments field appears when Exception Required is toggled ON"],
        [false, "Selecting \\"Go\\" and confirming moves release to Completed status immediately"],
        [false, "Selecting \\"No-Go\\" triggers release cancellation; status changes to Cancelled"],
        [false, "Selecting \\"Go with Pre-Conditions\\" moves release to Post FCSR Actions (Actions Closure status)"],
        [false, "Selecting \\"Go with Post-Conditions\\" moves release to Final Acceptance stage"],
      ]},
      { title:"8.5 Escalation Chain", items:[
        [false, "\\"Escalate\\" button is available at FCSR Review stage"],
        [false, "Escalating from SA routes review to LOB Security Leader"],
        [false, "Escalating from LOB SL routes review to BU Security Officer"],
        [false, "Escalating from BU SO requires CISO or SVP LOB checkbox and Exception Required toggle"],
        [false, "Each escalation step records the escalating user and timestamp in the workflow popup"],
        [false, "\\"Rework\\" button returns release to SA & PQL Sign Off stage with mandatory justification"],
      ]},
      { title:"8.6 Reports", items:[
        [false, "Report Configurator dialog is accessible from the FCSR Review tab"],
        [false, "Generating a \\"Scope Approval\\" report downloads a PDF with scope details"],
        [false, "Generating an \\"FCSR Results\\" report downloads a PDF with FCSR decision details"],
      ]},
    ]
  },'''

# ─── WF9 full replacement ──────────────────────────────────────────────────────
OLD_WF9 = '''    n:9, title:"Release — Stage 6: Post FCSR Actions", icon:"📋", color:"#ff9966",
    spec:"releases/post-fcsr-actions.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "Post FCSR Actions stage loads with \\"Submit\\" action button (and \\"Cancel\\" for No-Go path)"],
      [false, "Pre-condition and post-condition action items are listed"],
      [false, "Closing a pre-condition action updates its status in the list"],
      [false, "\\"Submit\\" button is enabled only after all pre-condition actions are closed"],
      [false, "\\"Submit\\" advances the release to Final Acceptance stage"],
      [false, "\\"Cancel\\" action (No-Go path) asks for confirmation and marks the release as Cancelled"],
      [false, "Cancelled release appears in Releases list only when \\"Show Active Only\\" is OFF"],
    ]}]
  },'''

NEW_WF9 = '''    n:9, title:"Release — Stage 6: Post FCSR Actions", icon:"📋", color:"#ff9966",
    spec:"releases/post-fcsr-actions.spec.ts", po:"—",
    sections:[
      { title:"9.1 No-Go Path", items:[
        [false, "When FCSR Decision = \\"No-Go\\", release status automatically changes to \\"Cancelled\\""],
        [false, "A warning message is shown: \\"Release has been cancelled. Please create a new release.\\""],
        [false, "Cancelled release appears in Releases tab only when \\"Show Active Only\\" toggle is OFF"],
        [false, "Cancelled release shows \\"Cancelled\\" status badge in the release list"],
      ]},
      { title:"9.2 Go with Pre-Conditions Path — Action Closure", items:[
        [false, "Release at Actions Closure status shows \\"Edit Actions\\" button at bottom right of the page"],
        [false, "\\"Edit Actions\\" dialog lists all Pre-Condition actions with Status dropdown and Closure Comment field"],
        [false, "Changing an action state to \\"Closed\\" makes Closure Comment mandatory; saving without it shows error"],
        [false, "\\"Save Actions\\" button saves all changed action states; \\"Cancel\\" discards changes"],
        [false, "After closing all Pre-Condition actions, \\"Submit\\" button becomes active"],
        [false, "Attempting to submit without all Pre-Condition actions closed shows validation error listing open actions"],
        [false, "\\"Submit\\" moves release to Final Acceptance stage (when Pre-Conditions all closed)"],
      ]},
      { title:"9.3 SBOM & CSRR Editability During Post FCSR Actions", items:[
        [false, "SBOM Status field in CSRR → SDL Processes Summary remains editable during Post FCSR Actions"],
        [false, "SBOM ID field remains editable during Post FCSR Actions"],
        [false, "Saving SBOM changes during Post FCSR Actions persists correctly"],
      ]},
      { title:"9.4 Stage Routing — Go and Go with Post-Conditions", items:[
        [false, "When FCSR Decision = \\"Go\\", PO/SM submits the release → status transitions to Completed"],
        [false, "When FCSR Decision = \\"Go with Post-Conditions\\", release moves to Final Acceptance stage for FCSR approver sign-off"],
        [false, "Workflow popup shows Post FCSR Actions stage with submission counter and responsible users"],
      ]},
    ]
  },'''

# ─── WF10 full replacement ──────────────────────────────────────────────────────
OLD_WF10 = '''    n:10, title:"Release — Stage 7: Final Acceptance", icon:"🏁", color:"#3fb950",
    spec:"releases/final-acceptance.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "Final Acceptance stage shows the \\"Final Acceptance\\" action button for the responsible reviewer"],
      [false, "Reviewer can verify that all pre-condition closures are confirmed"],
      [false, "\\"Final Acceptance\\" action marks the release status as Completed"],
      [false, "Completed release appears in Releases list with Completed status label"],
      [false, "Completed release is hidden when \\"Show Active Only\\" toggle is ON"],
      [false, "Completed release is visible when \\"Show Active Only\\" toggle is OFF"],
    ]}]
  },'''

NEW_WF10 = '''    n:10, title:"Release — Stage 7: Final Acceptance", icon:"🏁", color:"#3fb950",
    spec:"releases/final-acceptance.spec.ts", po:"—",
    sections:[
      { title:"10.1 Stage Entry", items:[
        [false, "Final Acceptance stage is entered from Post FCSR Actions (Go with Post-Conditions path)"],
        [false, "FCSR approver receives a task in My Tasks for this stage"],
        [false, "Release detail page shows \\"Final Acceptance\\" and \\"Return to Rework\\" action buttons for the approver"],
      ]},
      { title:"10.2 SBOM Validations at Final Acceptance", items:[
        [false, "Attempting to complete without SBOM Status set shows validation error \\"SBOM Status required\\""],
        [false, "Attempting to complete with SBOM Status = \\"In Progress\\" but empty SBOM ID shows validation error"],
        [false, "Completing the release with SBOM Status = \\"Submitted\\" and non-empty SBOM ID succeeds"],
        [false, "Completing the release with SBOM Status = \\"N/A\\" and a Justification provided succeeds"],
        [false, "SBOM Status and SBOM ID fields become immutable once release status = Completed"],
      ]},
      { title:"10.3 Pen Test Validation at Final Acceptance", items:[
        [false, "If SVV-4 (Pen Test) requirement status ≠ Not Applicable and ≠ Postponed, Pen Test Details must be complete"],
        [false, "Missing Pen Test Type or SRD/Vendor Ref Number shows validation error"],
        [false, "When Pen Test Details are complete, Final Acceptance can proceed"],
      ]},
      { title:"10.4 Final Acceptance & Return to Rework", items:[
        [false, "\\"Final Acceptance\\" button completes the release — status changes to \\"Completed\\""],
        [false, "Completed release shows \\"Completed\\" status badge in Releases tab"],
        [false, "Completed release is hidden from My Releases when \\"Show Active Only\\" is ON"],
        [false, "Completed release is visible when \\"Show Active Only\\" toggle is OFF"],
        [false, "\\"Return to Rework\\" button sends release back to PO/SM with mandatory justification popup"],
        [false, "Justification is visible in the Stage Sidebar after rework is triggered"],
      ]},
    ]
  },'''

# ─── Add WF14 and WF15 before WF12 ────────────────────────────────────────────
OLD_WF12_START = '''    n:12, title:"Roles Delegation",'''

NEW_WF14_15_AND_12 = '''    n:14, title:"Release History", icon:"📅", color:"#6e7681",
    spec:"releases/release-history.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "\\"View History\\" link on Release Detail page opens the Release History popup"],
      [false, "History popup shows columns: Date, User, Activity, Description"],
      [false, "History records are sorted in descending date order by default (newest first)"],
      [false, "Clicking the Date column header toggles sort between descending and ascending order"],
      [false, "User column shows profile image and display name for each activity"],
      [false, "Activity column shows the activity type label (e.g., \\"Release creation\\", \\"Requirement status update\\")"],
      [false, "Search text field filters history records by User name or Description text"],
      [false, "\\"Activity\\" dropdown filter limits records to the selected activity type"],
      [false, "Activity dropdown includes all 25+ activity types (Release creation, Clone, Role update, Questionnaire update, Requirement status update, Scope Review update, Risk Classification, CSRR changes, FCSR Decision, Jira Submission, Jama Submission, Rework, Escalation, Completion, Cancellation, Data Privacy changes, Report Generation, Inactivation)"],
      [false, "Date Range picker filters records to the selected period (from/to)"],
      [false, "\\"Search\\" button applies all active filters"],
      [false, "\\"Reset\\" button clears all filters and restores the full history"],
      [false, "Pagination: records-per-page dropdown (10/20/50/100) changes number of rows displayed"],
      [false, "Pagination navigation (prev/next page) works correctly"],
      [false, "Footer shows total record count"],
      [false, "Error state: \\"Unable to load data. Try again, please.\\" message appears when data fails to load"],
      [false, "Release creation event is present in history after a release is created"],
      [false, "Cloning a release creates a \\"Release cloning\\" history entry"],
      [false, "Submitting requirements to Jira creates a \\"Jira Submission\\" history entry"],
      [false, "Sending release to rework creates a \\"Sending to rework\\" history entry"],
    ]}]
  },
  {
    n:15, title:"Stage Sidebar & Responsible Users", icon:"🗂️", color:"#6e7681",
    spec:"releases/stage-sidebar.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "\\"Need Help\\" button on Release Detail page opens the Stage Sidebar panel"],
      [false, "Stage Sidebar shows the current stage name in the header"],
      [false, "Sidebar displays a Responsible Users table with columns: User, Role, Approval Date"],
      [false, "Stage description text (configured in BackOffice) is visible in the sidebar"],
      [false, "Rework justification text is visible in the sidebar when release is on Rework"],
      [false, "Closing the sidebar via the X button hides it without navigating away"],
      [false, "\\"View Flow\\" button on Release Detail page opens the Workflow popup"],
      [false, "When release is on Rework: orange dot indicator appears next to \\"View Flow\\" link"],
      [false, "Hovering over the orange dot shows tooltip: \\"On Rework. Click here for more details\\""],
      [false, "My Tasks list: \\"Assignee\\" filter is available and narrows tasks to the selected user"],
      [false, "My Tasks list: \\"Assignee\\" column is visible showing the assigned user for each task"],
      [false, "Workflow popup shows submission counter (e.g., \\"1 from 2 submissions\\") for stages requiring multiple approvals"],
      [false, "Completed stages show completion user and timestamp in the Workflow popup"],
    ]}]
  },
  {
    n:12, title:"Roles Delegation",'''

# ─── Apply all replacements ────────────────────────────────────────────────────
replacements = [
    ("WF4 4.1 pen test", OLD_41, NEW_41),
    ("WF4 4.3 clone release", OLD_43, NEW_43),
    ("WF4 4.4 sidebar", OLD_44, NEW_44),
    ("WF4 4.10-4.12 new sections", OLD_WF4_END, NEW_WF4_END),
    ("WF5 full replacement", OLD_WF5, NEW_WF5),
    ("WF6 full replacement", OLD_WF6, NEW_WF6),
    ("WF7 full replacement", OLD_WF7, NEW_WF7),
    ("WF8 full replacement", OLD_WF8, NEW_WF8),
    ("WF9 full replacement", OLD_WF9, NEW_WF9),
    ("WF10 full replacement", OLD_WF10, NEW_WF10),
    ("Add WF14/WF15", OLD_WF12_START, NEW_WF14_15_AND_12),
]

print("Applying HTML replacements...")
for label, old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        print(f"  OK: {label}")
    else:
        print(f"  MISS: {label}")
        # Debug: print first 80 chars of old
        print(f"       Looking for: {repr(old[:80])}")

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

lines = content.count('\n')
print(f"\nDONE. automation-testing-plan.html now has {lines} lines.")
