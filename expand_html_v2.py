"""
Expand automation-testing-plan.html with:
  - WF3 (n:3): add section 3.8 Jira/Jama Tracking Tools (17 items)
  - WF12 (n:12): full rewrite — 8 sections, 52 items
  - WF13 (n:13): full rewrite — 11 sections, 87 items
  - WF16 (n:16): NEW — DPP Review, 6 sections, 28 items
"""

HTML_PATH = "/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/automation-testing-plan.html"

with open(HTML_PATH, encoding='utf-8') as f:
    content = f.read()

# ─── 1. WF3 — add section 3.8 before n:4 ─────────────────────────────────────
OLD_WF3_END = '''      { title:"3.7 Product Inactivation", items:[
        [false, "Three-dot Actions menu in My Products grid offers \\"Inactivate\\" for eligible products (requires Product Admin role)"],
        [false, "After inactivation, product status changes to Inactive"],
        [false, "Inactive product is hidden when \\"Show Active Only\\" toggle is ON"],
        [false, "Inactive product is visible when \\"Show Active Only\\" toggle is OFF"],
      ]},
    ]
  },
  {
    n:4,'''

NEW_WF3_END = '''      { title:"3.7 Product Inactivation", items:[
        [false, "Three-dot Actions menu in My Products grid offers \\"Inactivate\\" for eligible products (requires Product Admin role)"],
        [false, "After inactivation, product status changes to Inactive"],
        [false, "Inactive product is hidden when \\"Show Active Only\\" toggle is ON"],
        [false, "Inactive product is visible when \\"Show Active Only\\" toggle is OFF"],
      ]},
      { title:"3.8 Product Configuration — Tracking Tools (Jira & Jama)", items:[
        [false, "Activating Jira toggle reveals \\"Jira Source Link\\" (mandatory) and \\"Jira Project Key\\" (mandatory) fields"],
        [false, "\\"Test Connection\\" button appears next to the Jira toggle after activation"],
        [false, "Jira Test Connection — success shows green confirmation message"],
        [false, "Jira Test Connection — invalid credentials or URL shows a red error message"],
        [false, "Activating Jira toggle sets \\"Process requirements and issues tracking tool\\" radio to \\"Jira\\" automatically"],
        [false, "Activating Jira toggle also sets \\"Product requirements tracking tool\\" radio to \\"Jira\\" when Jama is not active"],
        [false, "Activating Jama toggle reveals \\"Jama Project ID\\" (mandatory, alphanumeric) field"],
        [false, "Activating Jama toggle reveals \\"Email Notifications Recipients\\" pre-filled with PO and SM; additional users can be added/removed"],
        [false, "\\"Test Connection\\" button appears next to the Jama toggle after activation"],
        [false, "Jama Test Connection — success shows: \\"Specified project is registered in Jama.\\""],
        [false, "Jama Test Connection — project not found shows: \\"Specified project is not available in Jama or it is hidden from the public view...\\""],
        [false, "Jama Test Connection — invalid characters shows: \\"Jama Project ID contains invalid characters.\\""],
        [false, "Jama Test Connection — not authorized shows: \\"PICASso is not authorised to connect to this project.\\""],
        [false, "Activating Jama toggle sets \\"Product requirements tracking tool\\" radio to \\"Jama\\" automatically"],
        [false, "After activating Jira or Jama, an informational message and \\"Status Mapping Configuration\\" button appear below the tracking tool radio buttons"],
        [false, "Saving with Jira activated but empty Jira Source Link or Jira Project Key shows validation error"],
        [false, "Deactivating a tracking tool resets related fields and tracking tool radio selections to Not Applicable"],
      ]},
    ]
  },
  {
    n:4,'''

# ─── 2. WF12 — full replacement ───────────────────────────────────────────────
OLD_WF12 = '''  {
    n:12, title:"Roles Delegation", icon:"🤝", color:"#d29922",
    spec:"roles-delegation/roles-delegation.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "\\"Roles Delegation\\" link in header opens Roles Delegation page in a new tab"],
      [false, "Page loads with \\"My Roles\\" tab and (for CSO role) \\"Org Level Users\\" tab"],
      [false, "\\"My Roles\\" tab shows the current user's active delegations list"],
      [false, "Delegating a role: selecting a role, choosing a delegate user, setting a date range, and confirming creates a delegation record"],
      [false, "Created delegation appears in the list with correct role, delegate name, and date range"],
      [false, "Removing a single delegation via the list removes it from active delegations"],
      [false, "Bulk delegation — selecting multiple roles and delegating in one action creates multiple records"],
      [false, "Bulk removal — selecting multiple delegation records and removing clears all selected items"],
      [false, "Delegation history section shows past (expired/removed) delegations"],
      [false, "Delegated Requirements Traceability dialog is accessible and shows requirements traceability for delegated roles"],
    ]}]
  },'''

NEW_WF12 = '''  {
    n:12, title:"Roles Delegation", icon:"🤝", color:"#d29922",
    spec:"roles-delegation/roles-delegation.spec.ts · roles-delegation/delegation-history.spec.ts", po:"—",
    sections:[
      { title:"12.1 Roles Delegation Page", items:[
        [false, "\\"Roles Delegation\\" link is visible in the Landing Page header navigation"],
        [false, "Clicking \\"Roles Delegation\\" opens the Roles Delegation page in a new browser tab"],
        [false, "Page shows a table with columns: Role Name, Scope, Delegated Person, Start Date, Expiration Date, Actions"],
        [false, "Roles without an active delegatee show empty Delegated Person / Start Date / Expiration Date cells and a \\"Delegate\\" button in Actions column"],
        [false, "Roles with an active delegatee show the delegate name and a three-dot Actions menu (Edit / Remove Delegation)"],
      ]},
      { title:"12.2 Delegate Role Pop-Up — Single Role", items:[
        [false, "Clicking \\"Delegate\\" opens \\"Delegate Role\\" pop-up showing placeholder text with the role name"],
        [false, "Pop-up mandatory fields: Assignee (SailPoint lookup), Start Date (date picker), Expiration Date (date picker), Justification (text)"],
        [false, "Saving without filling any mandatory field shows inline validation error for that field"],
        [false, "Delegation period > 3 months shows info message: \\"Please note, that delegation period is monitored by the Governance team.\\""],
        [false, "Clicking \\"Save\\" triggers confirmation dialog: \\"<role> role will be delegated to <user>. Do you wish to proceed?\\""],
        [false, "Clicking \\"Confirm\\" in the confirmation dialog saves the delegation record"],
        [false, "After saving, the table row shows delegated person name, start date, and expiration date"],
        [false, "Clicking \\"Cancel\\" in the pop-up closes it without saving"],
        [false, "Clicking the X icon closes the pop-up without saving"],
      ]},
      { title:"12.3 Edit and Remove Delegation", items:[
        [false, "Three-dot menu on a delegated role row shows two options: \\"Edit\\" and \\"Remove Delegation\\""],
        [false, "Clicking \\"Edit\\" opens the Delegate Role pop-up pre-filled with current delegation data"],
        [false, "Saving edited delegation updates all fields in the table row"],
        [false, "Clicking \\"Remove Delegation\\" stops the delegation; table columns become empty"],
        [false, "Removed delegation no longer grants the delegate access to that role's resources"],
      ]},
      { title:"12.4 Bulk Delegation", items:[
        [false, "\\"Bulk Actions\\" section is visible on the Roles Delegation page with disabled \\"Delegate\\" and \\"Remove Delegation\\" buttons by default"],
        [false, "Selecting at least one role without a delegatee enables the \\"Delegate\\" bulk button"],
        [false, "Selecting at least one role with an active delegatee enables the \\"Remove Delegation\\" bulk button"],
        [false, "Selecting both delegated and non-delegated roles enables both bulk buttons simultaneously"],
        [false, "\\"Delegate\\" bulk action: saves new delegation for roles without delegatee, updates delegation for roles with existing delegatee"],
        [false, "\\"Remove Delegation\\" bulk action: confirms in popup, then removes delegation for all selected roles that have a delegatee"],
        [false, "After selection, system shows the count of selected roles (e.g., \\"2 roles selected\\")"],
        [false, "\\"Clear selection\\" button (visible when ≥1 role selected) deselects all and becomes hidden"],
      ]},
      { title:"12.5 CSO-Specific Permissions (BU SO / LOB SL)", items:[
        [false, "User with BU SO or LOB SL role sees two tabs: \\"My roles\\" and \\"Org Level Users\\""],
        [false, "\\"Org Level Users\\" tab shows a table with columns: User Name, Email, LEAP License (Active/Inactive), \\"View details\\" button"],
        [false, "Clicking \\"View details\\" navigates to the selected user's roles page listing all their delegatable roles"],
        [false, "CSO \\"Delegate\\" pop-up has an additional mandatory \\"Role\\" dropdown (LOV: PO, SM, SA, PQL, LOB SL)"],
        [false, "CSO pop-up: attempting to save with empty Role dropdown shows validation error"],
      ]},
      { title:"12.6 Delegation Display in Product & Release Details", items:[
        [false, "Delegated user is displayed in Product Details \\"Product Team\\" section alongside the delegator (read-only)"],
        [false, "Hovering over the delegatee name in Product Team shows a tooltip with the Justification text"],
        [false, "In Product edit mode, delegatees are hidden — only delegators are shown in the editable form"],
        [false, "Delegated user appears in Release \\"Roles & Responsibilities\\" tab → SDL Roles section"],
        [false, "Hovering over the delegatee name in Roles & Responsibilities shows the Justification tooltip"],
      ]},
      { title:"12.7 Delegation History", items:[
        [false, "\\"Roles delegation history\\" link on the Roles Delegation page opens the Delegation History popup"],
        [false, "Popup shows columns: Date (sortable, dd mmm yyyy hh mm), User (avatar + name), Activity, Description"],
        [false, "Records are sorted descending by date (newest first) by default; clicking Date header toggles sort"],
        [false, "Activity filter dropdown includes: Role Delegation Assignment, Role Delegation Removal, Roles Delegation Update, Roles Delegation Expiration"],
        [false, "Search text field filters by User name or Description content"],
        [false, "Date Range filter (Start Date / Expiration Date pickers) limits records to the selected period"],
        [false, "\\"Search\\" button applies all active filters; \\"Reset\\" clears them and restores full history"],
        [false, "Pagination with per-page options (10/20/50/100) and prev/next controls work correctly"],
        [false, "\\"No results\\" message shown when filters return no matching records"],
      ]},
      { title:"12.8 Post-Delegation Effects & Task Handover", items:[
        [false, "After delegation: delegate receives all delegator's currently open My Tasks items"],
        [false, "Delegate receives email notifications for all releases they are part of via the delegation"],
        [false, "When delegation expires or is manually removed: tasks are cleared from the delegate's My Tasks"],
        [false, "Delegator retains full access to their products/releases throughout the delegation period"],
        [false, "Release History logs \\"Roles and Responsibilities Update\\" activity when a delegation change affects SDL Roles in a release"],
      ]},
    ]
  },'''

# ─── 3. WF13 — full replacement + WF16 appended ──────────────────────────────
OLD_WF13 = '''  {
    n:13, title:"Actions Management", icon:"⚡", color:"#8b949e",
    spec:"actions/actions-management.spec.ts", po:"—",
    sections:[{ title:null, items:[
      [false, "\\"Actions Management\\" link on Product Detail page opens the Actions Management page"],
      [false, "Actions grid loads with actions from all releases for the product"],
      [false, "Grid shows correct columns (Name, Description, Status, Product, Release, VESTA Id, Assignee, etc.)"],
      [false, "Filter by action status narrows the list"],
      [false, "Filter by release narrows the list to actions for that release only"],
      [false, "Reset button clears all filters"],
      [false, "Creating a new action from the Actions Management page saves it and shows it in the grid"],
      [false, "Action details are viewable (name, description, status, assignee, due date)"],
      [false, "Updating an action's status saves the change and reflects in the grid"],
      [false, "Closing an action marks it as Closed in the list"],
      [false, "Pre-condition actions (from FCSR Review stage) are distinguished from post-condition actions"],
    ]}]
  },
];'''

NEW_WF13_AND_WF16 = '''  {
    n:13, title:"Actions Management", icon:"⚡", color:"#8b949e",
    spec:"actions/actions-management.spec.ts · actions/actions-history.spec.ts · actions/actions-release-integration.spec.ts", po:"—",
    sections:[
      { title:"13.1 Actions Management Access & Link", items:[
        [false, "\\"Actions Management\\" link is visible in the Product Details page header"],
        [false, "Clicking \\"Actions Management\\" from Product Details opens the Actions Management page in a new browser window"],
        [false, "\\"Actions Management\\" link is visible on Release Detail pages for the product"],
        [false, "Clicking \\"Actions Management\\" from a release opens the same Actions Management page in a new window"],
        [false, "Users with VIEW_PRODUCT_ACTIONS privilege see the page in view-only mode (Actions column is empty)"],
        [false, "Users with EDIT_PRODUCT_ACTIONS privilege see the full Actions column with Edit and Submit options"],
      ]},
      { title:"13.2 Actions Management Page — Table & Columns", items:[
        [false, "Table columns: Action Name, Description, Status, Assignee, Creation Date, Due Date, Release Number, Category, Origin, Actions"],
        [false, "\\"Jira Link\\" column appears only when at least one action in the list was submitted to Jira"],
        [false, "Clicking an Action Name opens the View Action Details pop-up"],
        [false, "Due Date column shows a red exclamation mark when the due date has already passed"],
        [false, "Empty state message \\"No Actions created for this product.\\" is shown when no actions exist"],
        [false, "Actions column: three-dot menu shows \\"Edit\\" and \\"Submit to Jira\\" for editable unsubmitted actions (tracking tool = Jira)"],
        [false, "Actions column: edit icon shown for editable unsubmitted actions when tracking tool = N/A"],
        [false, "Actions column is empty for actions that are Closed or already submitted to Jira"],
      ]},
      { title:"13.3 Filters on Actions Management Page", items:[
        [false, "Search field narrows actions by Name or Description text"],
        [false, "Status dropdown filter shows all configured action statuses and narrows list on selection"],
        [false, "Selecting \\"Closed\\" in Status filter automatically activates the \\"Include Closed\\" toggle"],
        [false, "Release Number filter narrows list to actions from that specific release"],
        [false, "Assignee filter narrows list to actions assigned to the selected person"],
        [false, "Category filter narrows list by action category"],
        [false, "Due Date Range filter narrows actions to those with a due date in the specified range"],
        [false, "\\"Include Closed\\" toggle is OFF by default; turning it ON includes closed actions in the list"],
        [false, "\\"Reset\\" button clears all active filters and restores the full unfiltered list"],
        [false, "\\"No Actions to show\\" empty state message is displayed when filters return no results"],
      ]},
      { title:"13.4 View Action Details Pop-Up", items:[
        [false, "Clicking an action name opens \\"Action Details\\" pop-up"],
        [false, "Pop-up shows: Name, Status, Due Date, Category, Assignee, Origin, Description"],
        [false, "Overdue due date shows orange exclamation mark next to the date"],
        [false, "\\"Closure Comment\\" field is shown only when the action is in Closed status"],
        [false, "\\"Evidence\\" link field is shown when an evidence link was provided"],
        [false, "\\"Source Link\\" (Jira ticket hyperlink) is shown only when action was submitted to Jira"],
        [false, "\\"Updated by\\" and \\"on\\" (date/time) fields show who last modified the action and when"],
        [false, "\\"Edit\\" button is shown for actions that are not closed and not Jira-submitted"],
        [false, "Only the X (close) icon is shown when action is Closed or Jira-submitted"],
      ]},
      { title:"13.5 Edit Actions", items:[
        [false, "Clicking \\"Edit\\" on View Action pop-up or from the three-dot menu opens \\"Edit Action\\" pop-up"],
        [false, "All fields (Name, Description, Category, Due Date, Status, Closure Comment, Evidence, Assignee) are editable when action was created in the same release stage as current"],
        [false, "Only Status, Closure Comment, Evidence, and Assignee are editable when action was created in a different release stage"],
        [false, "Name and Description are read-only when action was created in a previous stage"],
        [false, "\\"Due Date\\" only allows future dates — selecting a past date shows a validation error"],
        [false, "Changing Status to \\"Closed\\" makes \\"Closure Comment\\" mandatory; saving without it shows validation error"],
        [false, "Clicking \\"Save\\" persists changes; activity logged in Actions Management History (and Release History if release is still active)"],
        [false, "Clicking \\"Cancel\\" or X closes pop-up without saving"],
      ]},
      { title:"13.6 Create New Action from Actions Management", items:[
        [false, "\\"Create action\\" button is visible on the Actions Management page"],
        [false, "Create Action pop-up requires: Name, Due Date, Description; Assignee is optional"],
        [false, "Saving without mandatory fields shows inline validation errors"],
        [false, "Newly created action appears in the list with Status = Open, Category = Tracked, Origin = Actions Management, Release Number = No release"],
        [false, "\\"Updated by\\" and \\"on\\" are auto-populated from the creating user and current date/time"],
        [false, "Activity is logged in Actions Management History after creation"],
      ]},
      { title:"13.7 Submit Actions to Jira & Refresh", items:[
        [false, "\\"Submit to Jira\\" is visible in the three-dot menu for non-closed, non-Jira-submitted actions (when product tracking tool = Jira)"],
        [false, "Clicking opens a confirmation pop-up; clicking \\"Submit\\" creates a Jira \\"Feature\\" ticket under \\"SDL Actions - <Release Number>\\" capability"],
        [false, "Jira ticket number appears in the \\"Jira Link\\" column after successful submission"],
        [false, "Submitted action no longer shows an \\"Edit\\" button — becomes read-only in PICASso"],
        [false, "Jira submission error: orange exclamation mark in Jira Link column; hovering shows error details"],
        [false, "\\"Refresh Jira Data\\" button appears on the page when at least one action is Jira-submitted"],
        [false, "Clicking Refresh updates statuses of all Jira-linked actions from the linked Jira tickets"],
        [false, "\\"Last update from Jira\\" timestamp is updated after a successful refresh"],
        [false, "Refresh error: orange exclamation mark next to the button; last-update timestamp is not changed"],
      ]},
      { title:"13.8 Actions Management History", items:[
        [false, "Actions Management History section shows: Date (sortable), User (avatar), Activity, Description"],
        [false, "Records sorted descending by default; clicking Date header toggles sort direction"],
        [false, "Footer shows total record count; per-page dropdown (10/20/50/100) works correctly"],
        [false, "Pagination controls (prev/next page) work for large history sets"],
        [false, "Error state: \\"Unable to load data. Try again, please.\\" shown when data fetch fails"],
        [false, "\\"No results\\" message shown when search/filter returns no matching records"],
        [false, "Search text field filters by User name or Description text"],
        [false, "Activity dropdown filter narrows records to the selected activity type"],
        [false, "Date Range filter narrows records to the selected start/end date period"],
        [false, "\\"Search\\" and \\"Reset\\" buttons apply and clear all filters"],
        [false, "Logged activities include: action creation, action details update, action state change, Jira Submission, Jira Refresh"],
      ]},
      { title:"13.9 Actions Editing in Release — Stage-Aware Behaviour", items:[
        [false, "Header on Review & Confirm tab shows \\"Action Plan for Scope Review Decisions\\""],
        [false, "Header on CSRR sub-tabs shows \\"Action Plan to address <Sub-tab name> Residual Risk\\""],
        [false, "Header on FCSR Decision tab shows \\"Action Plan for FCSR Decisions\\""],
        [false, "Empty action section shows section header + \\"No Actions added yet\\" message (section no longer hidden when empty)"],
        [false, "Action creation in release: new action Status is auto-set to Open (not selectable)"],
        [false, "Existing action can be fully edited when created in the same release stage as current"],
        [false, "Existing action allows only Status, Closure Comment, Evidence, Assignee edits when created in a different stage"],
        [false, "Action can be deleted only when it was created in the current release stage; deletion removes it from all views"],
      ]},
      { title:"13.10 Actions Summary on Review & Confirm Tab", items:[
        [false, "\\"Actions Summary\\" section on Review & Confirm tab is collapsed by default"],
        [false, "Expanding section shows two donut charts: \\"Actions Statuses\\" and \\"Overdue Actions\\""],
        [false, "Actions Statuses donut shows count per status with correct labels and color coding"],
        [false, "Total action count is displayed in the center of the Actions Statuses donut"],
        [false, "Overdue Actions donut shows count of not-closed overdue actions out of total actions"],
        [false, "Donut chart burger menu offers: View Full Screen, Print chart, Download PNG, Download JPEG, Download SVG"],
        [false, "When release advances from Review & Confirm to Manage stage, Actions Summary data is frozen (snapshot)"],
        [false, "When release returns to rework on Review & Confirm, charts reflect the current actual state"],
      ]},
      { title:"13.11 Email Notifications on Actions", items:[
        [false, "Action created and assigned → Assignee + PO + SM + SA receive an email notification"],
        [false, "Action created and NOT assigned → PO + SM + SA receive an email notification"],
        [false, "Action assignee updated → new Assignee + PO + SM + SA receive an email notification"],
        [false, "Assigned not-closed action due in 7 days → Assignee + PO + SM + SA receive a reminder"],
        [false, "Not-assigned not-closed action due in 7 days → PO + SM + SA receive a reminder"],
      ]},
    ]
  },
  {
    n:16, title:"Data Protection & Privacy (DPP) Review", icon:"🔐", color:"#79c0ff",
    spec:"releases/dpp-review.spec.ts · products/dpp-configuration.spec.ts", po:"—",
    sections:[
      { title:"16.1 DPP Activation at Product Level", items:[
        [false, "\\"Data Protection & Privacy\\" toggle appears in Product Details form (Product Related Details section)"],
        [false, "Saving a product with the DPP toggle newly turned ON shows a confirmation dialog warning about DPP tasks activation"],
        [false, "Clicking \\"Save\\" in the confirmation dialog completes the save with DPP enabled"],
        [false, "Clicking \\"Cancel\\" in the confirmation dialog discards the save (DPP toggle reverts to OFF)"],
        [false, "When DPP = Yes, \\"Dedicated Privacy Advisor\\" lookup field appears in the Product Team tab"],
        [false, "Dedicated Privacy Advisor lookup supports SailPoint user search and selection"],
      ]},
      { title:"16.2 DPP Review Tab in Release", items:[
        [false, "When product has DPP = Yes, \\"DPP Review\\" tab appears as one of the release content tabs"],
        [false, "DPP Review tab is disabled (greyed out) until questionnaire is submitted"],
        [false, "After questionnaire submission, DPP Review tab becomes fully accessible"],
        [false, "After questionnaire submission, Privacy Risk level (Low / Medium / High / Critical) is displayed on the Questionnaire tab"],
        [false, "DPP Review tab loads with Overview + 16 privacy subsections (Purpose, High Risk Processing, Data Minimization, IoT, Lawfulness of Processing, Sensitive Data, Retention, Individual Rights Management, Right Objection, User Access Management, Data Extracts, Contractual Requirement, Cookies, Transparency, Compliance Evidence, Personal Data Quality Assurance, Security Measures)"],
        [false, "Each privacy subsection shows fields for Evaluation Status, Residual Risk, and Actions"],
        [false, "DPP Review tab data is editable at Manage stage; read-only at earlier stages"],
      ]},
      { title:"16.3 PCC (Privacy Compliance Committee) Decision", items:[
        [false, "PCC Decision field appears in DPP Review Overview section when Privacy Risk = High or Critical"],
        [false, "PCC Decision dropdown options are configurable via BackOffice"],
        [false, "Saving PCC Decision persists the value correctly"],
        [false, "PCC Decision is shown as a read-only field in Review & Confirm tab \\"Previous FCSR Summary\\" section"],
      ]},
      { title:"16.4 Privacy Reviewer Task & Stage Integration", items:[
        [false, "When release reaches SA & PQL Sign Off stage and DPP is applicable, a task is auto-assigned to the Privacy Reviewer in My Tasks"],
        [false, "Privacy Reviewer task appears in My Tasks list with correct release and product references"],
        [false, "Privacy Reviewer can complete the DPP review by submitting their assessment"],
        [false, "DPP Review tab changes are preserved after navigating away and returning"],
      ]},
      { title:"16.5 DPP Section in PDF Report", items:[
        [false, "FCSR Results PDF report includes a \\"Data Protection & Privacy\\" section when DPP is applicable for the release"],
        [false, "DPP report section includes Overview and all 16 privacy subsections as separate report chapters"],
        [false, "\\"PCC Decision\\" subsection is included in the FCSR Results report when Privacy Risk = High or Critical"],
        [false, "Report Configurator UI shows the DPP section toggle available only when DPP is applicable"],
      ]},
      { title:"16.6 DPP Data in Release History", items:[
        [false, "Changes to DPP Review tab fields are logged in Release History"],
        [false, "Release History Activity filter dropdown includes \\"Data Privacy changes\\" activity type"],
        [false, "History entry for DPP shows the changed field and new value in the Description column"],
      ]},
    ]
  },
];'''

# ─── Apply replacements ───────────────────────────────────────────────────────
replacements = [
    ("WF3 section 3.8", OLD_WF3_END, NEW_WF3_END),
    ("WF12 full",       OLD_WF12,    NEW_WF12),
    ("WF13 full + WF16", OLD_WF13,  NEW_WF13_AND_WF16),
]

print("Applying HTML replacements...")
for label, old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        print(f"  OK: {label}")
    else:
        print(f"  MISS: {label}")
        print(f"       First 120 chars of search: {repr(old[:120])}")

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

lines = content.count('\n')
print(f"\nDONE. automation-testing-plan.html: {lines} lines")
