"""
Expand automation-testing-plan.md with:
  - WF3: new section 3.8 Tracking Tools (17 cases)
  - WF12: full rewrite (10 → 44 cases)
  - WF13: full rewrite (11 → 84 cases)
  - WF16: new DPP Review workflow (28 cases)
  - Coverage Summary: recomputed from actual item counts
Sources: Confluence 450757858 (Product Creation), 576721748 (Delegation),
         576721762 (Actions Management), 483812177 (DPP)
"""
import re

MD_PATH = "/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/automation-testing-plan.md"

with open(MD_PATH, encoding='utf-8') as f:
    content = f.read()

# ─── 1. Update sources line ───────────────────────────────────────────────────
OLD_SOURCES = "> **Sources:** `application-map.json` v1.8.0 · `user-guide.md` · 42 Confluence pages (1.3.x Release Management Flow) · Jira user stories"
NEW_SOURCES = "> **Sources:** `application-map.json` v1.8.0 · `user-guide.md` · Confluence pages (1.3.x Release Management Flow, 1.1 Product Creation, 1.5 DPP, 1.8 Workflow Delegation, 1.9 Actions Management) · Jira user stories"

# ─── 2. WF3 — add section 3.8 after 3.7, before WORKFLOW 4 ──────────────────
OLD_WF3_END = """### 3.7 Product Inactivation

- [ ] Three-dot Actions menu in My Products grid offers "Inactivate" for eligible products (requires Product Admin role)
- [ ] After inactivation, product status changes to Inactive
- [ ] Inactive product is hidden when "Show Active Only" toggle is ON
- [ ] Inactive product is visible when "Show Active Only" toggle is OFF

---

## WORKFLOW 4"""

NEW_WF3_END = """### 3.7 Product Inactivation

- [ ] Three-dot Actions menu in My Products grid offers "Inactivate" for eligible products (requires Product Admin role)
- [ ] After inactivation, product status changes to Inactive
- [ ] Inactive product is hidden when "Show Active Only" toggle is ON
- [ ] Inactive product is visible when "Show Active Only" toggle is OFF

### 3.8 Product Configuration — Tracking Tools (Jira & Jama)

**Spec:** `products/product-configuration.spec.ts`

- [ ] Activating Jira toggle reveals "Jira Source Link" (mandatory) and "Jira Project Key" (mandatory) fields below the toggle
- [ ] "Test Connection" button appears next to the Jira toggle after activation
- [ ] Jira Test Connection — success shows green message "Jira connection is valid"
- [ ] Jira Test Connection — invalid credentials/URL shows a red error message
- [ ] Activating Jira toggle sets "Process requirements and issues tracking tool" radio to "Jira" automatically
- [ ] Activating Jira toggle also sets "Product requirements tracking tool" radio to "Jira" (only if Jama is not active)
- [ ] Activating Jama toggle reveals "Jama Project ID" (mandatory, alphanumeric) field
- [ ] Activating Jama toggle reveals "Email Notifications Recipients" field pre-filled with Product Owner and Security Manager
- [ ] Email Notifications Recipients — users can be removed and new users added via SailPoint lookup
- [ ] "Test Connection" button appears next to the Jama toggle after activation
- [ ] Jama Test Connection — success shows green: "Specified project is registered in Jama."
- [ ] Jama Test Connection — project not found shows red: "Specified project is not available in Jama or it is hidden from the public view..."
- [ ] Jama Test Connection — invalid characters shows red: "Jama Project ID contains invalid characters."
- [ ] Jama Test Connection — not authorized shows red: "PICASso is not authorised to connect to this project."
- [ ] Activating Jama toggle sets "Product requirements tracking tool" radio to "Jama" automatically
- [ ] After activating Jira or Jama, an informational message and "Status Mapping Configuration" button appear below the tracking tool radio buttons
- [ ] Saving product with Jira activated but empty Jira Source Link or Jira Project Key shows validation error

---

## WORKFLOW 4"""

# ─── 3. WF12 — full replacement ───────────────────────────────────────────────
OLD_WF12 = """## WORKFLOW 12 — Roles Delegation

**Spec:** `roles-delegation/roles-delegation.spec.ts`

- [ ] "Roles Delegation" link in header opens Roles Delegation page in a new tab
- [ ] Page loads with "My Roles" tab and (for CSO role) "Org Level Users" tab
- [ ] "My Roles" tab shows the current user's active delegations list
- [ ] Delegating a role: selecting a role, choosing a delegate user, setting a date range, and confirming creates a delegation record
- [ ] Created delegation appears in the list with correct role, delegate name, and date range
- [ ] Removing a single delegation via the list removes it from active delegations
- [ ] Bulk delegation — selecting multiple roles and delegating in one action creates multiple records
- [ ] Bulk removal — selecting multiple delegation records and removing clears all selected items
- [ ] Delegation history section shows past (expired/removed) delegations
- [ ] Delegated Requirements Traceability dialog is accessible and shows requirements traceability for delegated roles

---

## WORKFLOW 13"""

NEW_WF12 = """## WORKFLOW 12 — Roles Delegation

**Spec:** `roles-delegation/roles-delegation.spec.ts` · `roles-delegation/delegation-history.spec.ts`
**Confluence:** 1.8. Workflow Delegation (PIC-5696, ER-2025-RC-8.0/9.0)

### 12.1 Roles Delegation Page

- [ ] "Roles Delegation" link is visible in the Landing Page header navigation
- [ ] Clicking "Roles Delegation" opens the Roles Delegation page in a new browser tab
- [ ] Page shows a table with columns: Role Name, Scope, Delegated Person, Start Date, Expiration Date, Actions
- [ ] Roles without an active delegatee show empty Delegated Person / Start Date / Expiration Date cells and a "Delegate" button in Actions column
- [ ] Roles with an active delegatee show the delegate name and a three-dot Actions menu (Edit / Remove Delegation)

### 12.2 Delegate Role Pop-Up — Single Role

- [ ] Clicking "Delegate" opens "Delegate Role" pop-up showing placeholder text with the role name: "Start the delegation of your <Role Name> role..."
- [ ] Pop-up mandatory fields: Assignee (SailPoint lookup), Start Date (date picker), Expiration Date (date picker), Justification (text)
- [ ] Saving without filling any mandatory field shows inline validation error for that field
- [ ] Delegation period > 3 months shows info message: "Please note, that delegation period is monitored by the Governance team."
- [ ] Clicking "Save" triggers confirmation dialog: "<role> role will be delegated to <user>. Do you wish to proceed?"
- [ ] Clicking "Confirm" in the confirmation dialog saves the delegation record
- [ ] After saving, the table row shows delegated person name, start date, and expiration date
- [ ] Clicking "Cancel" in the pop-up closes it without saving
- [ ] Clicking the X icon closes the pop-up without saving

### 12.3 Edit and Remove Delegation

- [ ] Three-dot menu on a delegated role row shows two options: "Edit" and "Remove Delegation"
- [ ] Clicking "Edit" opens the Delegate Role pop-up pre-filled with current delegation data (Assignee, Start Date, Expiration Date, Justification)
- [ ] Saving edited delegation updates all fields in the table row
- [ ] Clicking "Remove Delegation" stops the delegation; Delegated Person, Start Date, and Expiration Date columns become empty
- [ ] Removed delegation no longer grants the delegate access to that role's resources

### 12.4 Bulk Delegation

- [ ] "Bulk Actions" section is visible on the Roles Delegation page with "Delegate" and "Remove Delegation" buttons (disabled by default)
- [ ] Selecting at least one role without a delegatee enables the "Delegate" bulk button
- [ ] Selecting at least one role with an active delegatee enables the "Remove Delegation" bulk button
- [ ] Selecting both delegated and non-delegated roles enables both bulk buttons simultaneously
- [ ] Clicking "Delegate" bulk button opens a single pop-up; saving applies: new delegation for roles without delegatee, updated delegation for roles with existing delegatee
- [ ] Clicking "Remove Delegation" bulk button shows a confirmation popup; confirming removes delegation for all selected roles that have a delegatee (skipping those without)
- [ ] After selection, system shows the count of selected roles (e.g., "2 roles selected")
- [ ] "Clear selection" button (visible when ≥1 role selected) deselects all and becomes hidden

### 12.5 CSO-Specific Permissions (BU SO / LOB SL)

- [ ] User with BU SO or LOB SL role sees two tabs on Roles Delegation page: "My roles" and "Org Level Users"
- [ ] "My roles" tab is functionally identical to the standard Roles Delegation page
- [ ] "Org Level Users" tab shows a table with columns: User Name, Email, LEAP License (Active/Inactive), "View details" button
- [ ] Clicking "View details" navigates to the selected user's roles page listing all their delegatable roles
- [ ] CSO "Delegate" pop-up has an additional mandatory "Role" dropdown (LOV: PO, SM, SA, PQL, LOB SL)
- [ ] CSO pop-up: attempting to save with empty Role dropdown shows validation error

### 12.6 Delegation Display in Product & Release Details

- [ ] Delegated user is displayed in Product Details "Product Team" section alongside the delegator (read-only)
- [ ] Hovering over the delegatee name in Product Team shows a tooltip with the Justification text
- [ ] In Product edit mode, delegatees are hidden — only delegators are shown in the editable form
- [ ] Delegated user appears in Release "Roles & Responsibilities" tab → SDL Roles section
- [ ] Hovering over the delegatee name in Roles & Responsibilities shows the Justification tooltip

### 12.7 Delegation History

- [ ] "Roles delegation history" link on the Roles Delegation page opens the Delegation History popup
- [ ] Popup shows columns: Date (sortable, dd mmm yyyy hh mm), User (avatar + name), Activity, Description
- [ ] Records are sorted descending by date (newest first) by default; clicking Date header toggles sort
- [ ] Activity filter dropdown includes: Role Delegation Assignment, Role Delegation Removal, Roles Delegation Update, Roles Delegation Expiration
- [ ] Search text field filters by User name or Description content
- [ ] Date Range filter (Start Date / Expiration Date pickers) limits records to the selected period
- [ ] "Search" button applies all active filters; "Reset" clears them and restores full history
- [ ] Pagination with per-page options (10/20/50/100) and prev/next controls work correctly
- [ ] "No results" message shown when filters return no matching records

### 12.8 Post-Delegation Effects & Task Handover

- [ ] After delegation: delegate receives all delegator's currently open My Tasks items
- [ ] Delegate also receives email notifications for all releases they are part of via the delegation
- [ ] When delegation expires or is manually removed: tasks are cleared from the delegate's My Tasks
- [ ] Delegator retains full access to their products/releases throughout the delegation period
- [ ] Release History logs "Roles and Responsibilities Update" activity when a delegation change affects SDL Roles in a release

---

## WORKFLOW 13"""

# ─── 4. WF13 — full replacement ───────────────────────────────────────────────
OLD_WF13 = """## WORKFLOW 13 — Actions Management

**Spec:** `actions/actions-management.spec.ts`

- [ ] "Actions Management" link on Product Detail page opens the Actions Management page
- [ ] Actions grid loads with actions from all releases for the product
- [ ] Grid shows correct columns (Name, Description, Status, Product, Release, VESTA Id, Assignee, etc.)
- [ ] Filter by action status narrows the list
- [ ] Filter by release narrows the list to actions for that release only
- [ ] Reset button clears all filters
- [ ] Creating a new action from the Actions Management page saves it and shows it in the grid
- [ ] Action details are viewable (name, description, status, assignee, due date)
- [ ] Updating an action's status saves the change and reflects in the grid
- [ ] Closing an action marks it as Closed in the list
- [ ] Pre-condition actions (from FCSR Review stage) are distinguished from post-condition actions

---

## Coverage Summary"""

NEW_WF13 = """## WORKFLOW 13 — Actions Management

**Spec:** `actions/actions-management.spec.ts` · `actions/actions-history.spec.ts` · `actions/actions-release-integration.spec.ts`
**Confluence:** 1.9. Actions Management (PIC-5970, ER-2025-RC-7.0/8.0)

### 13.1 Actions Management Access & Link

- [ ] "Actions Management" link is visible in the Product Details page header
- [ ] Clicking "Actions Management" from Product Details opens the Actions Management page in a new browser window
- [ ] "Actions Management" link is visible on Release Detail pages for the product
- [ ] Clicking "Actions Management" from a release opens the same Actions Management page in a new window
- [ ] Users with VIEW_PRODUCT_ACTIONS privilege see the page in view-only mode (Actions column is empty)
- [ ] Users with EDIT_PRODUCT_ACTIONS privilege see the full Actions column with Edit and Submit options

### 13.2 Actions Management Page — Table & Columns

- [ ] Table columns: Action Name, Description, Status, Assignee, Creation Date, Due Date, Release Number, Category, Origin, Actions
- [ ] "Jira Link" column appears only when at least one action in the list was submitted to Jira
- [ ] Clicking an Action Name opens the View Action Details pop-up
- [ ] Due Date column shows a red exclamation mark when the due date has already passed
- [ ] Empty state message "No Actions created for this product." is shown when no actions exist
- [ ] Actions column: three-dot menu shows "Edit" and "Submit to Jira" for editable unsubmitted actions (when product tracking tool = Jira)
- [ ] Actions column: edit icon only for editable unsubmitted actions (when tracking tool = N/A)
- [ ] Actions column is empty for actions that are Closed or already submitted to Jira

### 13.3 Filters on Actions Management Page

- [ ] Search field narrows actions by Name or Description text
- [ ] Status dropdown filter shows all configured action statuses and narrows list on selection
- [ ] Selecting "Closed" in the Status filter automatically activates the "Include Closed" toggle
- [ ] Release Number filter narrows list to actions from that specific release
- [ ] Assignee filter narrows list to actions assigned to the selected person
- [ ] Category filter narrows list by action category
- [ ] Due Date Range filter narrows actions to those with a due date in the specified range
- [ ] "Include Closed" toggle is OFF by default; turning it ON includes closed actions in the list
- [ ] "Reset" button clears all active filters and restores the full unfiltered list
- [ ] "No Actions to show" empty state message is displayed when filters return no results

### 13.4 View Action Details Pop-Up

- [ ] Clicking an action name opens "Action Details" pop-up
- [ ] Pop-up shows: Name, Status, Due Date, Category, Assignee, Origin, Description
- [ ] Overdue due date shows orange exclamation mark next to the date
- [ ] "Closure Comment" field is shown only when the action is in Closed status
- [ ] "Evidence" link field is shown when an evidence link was provided
- [ ] "Source Link" (Jira ticket hyperlink) is shown only when action was submitted to Jira
- [ ] "Updated by" and "on" (date/time) fields show who last modified the action and when
- [ ] "Edit" button is shown for actions that are not closed and not Jira-submitted
- [ ] Only the X (close) icon is shown when action is Closed or Jira-submitted (no Edit button)

### 13.5 Edit Actions

- [ ] Clicking "Edit" on View Action pop-up or from the three-dot menu opens "Edit Action" pop-up
- [ ] All fields (Name, Description, Category, Due Date, Status, Closure Comment, Evidence, Assignee) are editable when action was created in the same release stage as current
- [ ] Only Status, Closure Comment, Evidence, and Assignee are editable when action was created in a different release stage
- [ ] Name and Description are read-only when action was created in a previous stage
- [ ] "Due Date" only allows future dates — selecting a past date shows a validation error
- [ ] Changing Status to "Closed" makes "Closure Comment" mandatory; saving without it shows validation error
- [ ] Clicking "Save" persists changes; activity logged in Actions Management History (and Release History if release is still active)
- [ ] Clicking "Cancel" or X closes pop-up without saving

### 13.6 Create New Action from Actions Management

- [ ] "Create action" button is visible on the Actions Management page
- [ ] Create Action pop-up requires: Name, Due Date, Description; Assignee is optional
- [ ] Saving without mandatory fields shows inline validation errors
- [ ] Newly created action appears in the list with Status = Open, Category = Tracked, Origin = Actions Management, Release Number = No release
- [ ] "Updated by" and "on" are auto-populated from the creating user and current date/time
- [ ] Activity is logged in Actions Management History after creation

### 13.7 Submit Actions to Jira

- [ ] "Submit to Jira" is visible in the three-dot menu for non-closed, non-Jira-submitted actions (when product tracking tool = Jira)
- [ ] Clicking opens a confirmation pop-up; clicking "Submit" creates a Jira "Feature" ticket under "SDL Actions - <Release Number>" capability
- [ ] Jira ticket number appears in the "Jira Link" column after successful submission
- [ ] Submitted action no longer shows an "Edit" button — becomes read-only in PICASso
- [ ] Jira submission error: orange exclamation mark in Jira Link column; hovering shows error details
- [ ] Bulk "Submit to Jira" (if multiple actions selected) submits all and shows a batch result summary

### 13.8 Refresh Jira Data

- [ ] "Refresh Jira Data" button appears on the page when at least one action is Jira-submitted
- [ ] Clicking updates statuses of all Jira-linked actions from the linked Jira tickets
- [ ] "Last update from Jira" timestamp is updated after a successful refresh
- [ ] Status mapping follows the Product Details "Status Mapping Configuration" for Jira → PICASso conversion
- [ ] Refresh error: orange exclamation mark next to the button; last-update timestamp is not changed on error

### 13.9 Actions Management History

- [ ] Actions Management History section shows: Date (sortable, dd mmm yyyy hh mm), User (avatar), Activity, Description
- [ ] Records sorted descending by default; clicking Date header toggles sort direction
- [ ] Footer shows total record count; per-page dropdown (10/20/50/100) works correctly
- [ ] Pagination controls (prev/next page) work for large history sets
- [ ] Error state: "Unable to load data. Try again, please." shown when data fetch fails
- [ ] "No results" message shown when search/filter returns no matching records
- [ ] Search text field filters by User name or Description text
- [ ] Activity dropdown filter narrows records to the selected activity type
- [ ] Date Range filter narrows records to the selected start/end date period
- [ ] "Search" and "Reset" buttons apply and clear all filters
- [ ] Logged activities include: action creation, action details update, action state change, Jira Submission, Jira Refresh

### 13.10 Actions Editing in Release — Stage-Aware Behaviour

- [ ] Header on Review & Confirm tab shows "Action Plan for Scope Review Decisions" (updated from old "List Action Plan items FOR SCOPE REVIEW DECISIONS")
- [ ] Header on CSRR sub-tabs shows "Action Plan to address <Sub-tab name> Residual Risk"
- [ ] Header on FCSR Decision tab shows "Action Plan for FCSR Decisions"
- [ ] Header on DPP Review tab shows "Action Plan to address Residual Risks"
- [ ] Empty action section shows section header + "No Actions added yet" message (section no longer hidden when empty)
- [ ] Action creation in release shows only: Name, Category, Due Date, Assignee, Description — Status is NOT selectable (auto-set to Open)
- [ ] Existing action can be fully edited (all fields) when created in the same release stage as current
- [ ] Existing action allows only Status, Closure Comment, Evidence, Assignee edits when created in a different stage
- [ ] Action can be deleted only when it was created in the current release stage; deletion from Actions Management page removes it from all views

### 13.11 Actions Summary on Review & Confirm Tab

- [ ] "Actions Summary" section on Review & Confirm tab is collapsed by default
- [ ] Expanding section shows two donut charts: "Actions Statuses" and "Overdue Actions"
- [ ] Actions Statuses donut shows count per status with correct labels and color coding
- [ ] Total action count is displayed in the center of the Actions Statuses donut
- [ ] Overdue Actions donut shows count of not-closed overdue actions out of total actions
- [ ] When no overdue not-closed actions exist, value "0" is shown in the Overdue Actions donut center
- [ ] Donut chart burger menu offers: View Full Screen, Print chart, Download PNG, Download JPEG, Download SVG
- [ ] When release advances from Review & Confirm to Manage stage, Actions Summary data is frozen (snapshot)
- [ ] When release returns to rework on Review & Confirm, charts reflect the current actual state

---

## WORKFLOW 16 — Data Protection & Privacy (DPP) Review

**Spec:** `releases/dpp-review.spec.ts` · `products/dpp-configuration.spec.ts`
**Confluence:** 1.5 Data Protection & Privacy review process (PIC-2696 epic)

### 16.1 DPP Activation at Product Level

- [ ] "Data Protection & Privacy" toggle appears in Product Details form (Product Related Details section)
- [ ] Saving a product with the DPP toggle newly turned ON shows a confirmation dialog: "Please note that you toggled on 'Data Protection & Privacy' and this will activate the Data protection and privacy tasks in new release."
- [ ] Clicking "Save" in the confirmation dialog completes the save with DPP enabled
- [ ] Clicking "Cancel" in the confirmation dialog discards the save (DPP toggle reverts to OFF)
- [ ] When DPP = Yes, "Dedicated Privacy Advisor" lookup field appears in the Product Team tab
- [ ] Dedicated Privacy Advisor lookup supports SailPoint user search and selection

### 16.2 DPP Review Tab in Release

- [ ] When product has DPP = Yes, "DPP Review" tab appears as one of the 6 release content tabs
- [ ] DPP Review tab is disabled (greyed out) until questionnaire is submitted
- [ ] After questionnaire submission, DPP Review tab becomes fully accessible
- [ ] After questionnaire submission, Privacy Risk level (Low / Medium / High / Critical) is displayed on the Questionnaire tab
- [ ] DPP Review tab loads with 17 sections: Overview + 16 privacy subsections (Purpose, High Risk Processing, Data Minimization, IoT, Lawfulness of Processing, Sensitive Data, Retention, Individual Rights Management, Right Objection, User Access Management, Data Extracts, Contractual Requirement, Cookies, Transparency, Compliance Evidence, Personal Data Quality Assurance, Security Measures)
- [ ] Each privacy subsection shows fields for Evaluation Status (dropdown), Residual Risk, Actions (plan), and relevant description/evidence inputs
- [ ] DPP Review tab data is editable at Manage stage and read-only at earlier stages

### 16.3 PCC (Privacy Compliance Committee) Decision

- [ ] PCC Decision field appears in DPP Review Overview section when Privacy Risk = High or Critical
- [ ] PCC Decision dropdown options come from BackOffice configuration
- [ ] Saving PCC Decision persists the value correctly
- [ ] PCC Decision is shown as a read-only field in Review & Confirm tab "Previous FCSR Summary" section (for applicable releases)

### 16.4 Privacy Reviewer Task & Stage Integration

- [ ] When release reaches SA & PQL Sign Off stage and DPP is applicable, a task is auto-assigned to the Privacy Reviewer in My Tasks
- [ ] Privacy Reviewer task appears in My Tasks list with correct release and product references
- [ ] Privacy Reviewer can complete the DPP review by submitting their assessment
- [ ] DPP Review tab changes are preserved after navigating away and returning

### 16.5 DPP Section in PDF Report

- [ ] FCSR Results PDF report includes a "Data Protection & Privacy" section when DPP is applicable for the release
- [ ] DPP report section includes Overview and all 16 privacy subsections as separate report chapters
- [ ] "PCC Decision" subsection is included in the FCSR Results report when Privacy Risk = High or Critical
- [ ] Report Configurator UI shows the DPP section toggle available only when DPP is applicable

### 16.6 DPP Data in Release History

- [ ] Changes to DPP Review tab fields are logged in Release History
- [ ] Release History Activity filter dropdown includes "Data Privacy changes" activity type
- [ ] History entry for DPP shows the changed field and new value in the Description column

---

## Coverage Summary"""

# ─── 5. Apply all replacements ────────────────────────────────────────────────
replacements = [
    ("Sources line", OLD_SOURCES, NEW_SOURCES),
    ("WF3 end + 3.8", OLD_WF3_END, NEW_WF3_END),
    ("WF12 full", OLD_WF12, NEW_WF12),
    ("WF13 full + WF16", OLD_WF13, NEW_WF13),
]

print("Applying MD replacements...")
for label, old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        print(f"  OK: {label}")
    else:
        print(f"  MISS: {label}")
        print(f"       First 100 chars: {repr(old[:100])}")

# ─── 6. Recompute coverage table ─────────────────────────────────────────────
# Count [x] and [ ] items per WORKFLOW section
wf_pattern = re.compile(r'^## WORKFLOW (\d+)\s*[—–-]\s*(.+?)$', re.MULTILINE)
item_pattern = re.compile(r'^\s*- \[(x| )\] ', re.MULTILINE)

sections = list(wf_pattern.finditer(content))
wf_data = []
for i, m in enumerate(sections):
    wf_num = int(m.group(1))
    wf_title = m.group(2).strip()
    start = m.start()
    end = sections[i+1].start() if i+1 < len(sections) else len(content)
    block = content[start:end]
    items = item_pattern.findall(block)
    total = len(items)
    done = sum(1 for s in items if s == 'x')
    remaining = total - done
    wf_data.append((wf_num, wf_title, total, done, remaining))

grand_total = sum(x[2] for x in wf_data)
grand_done  = sum(x[3] for x in wf_data)
grand_rem   = sum(x[4] for x in wf_data)

table_rows = []
for wf_num, wf_title, total, done, rem in wf_data:
    table_rows.append(f"| {wf_num} | {wf_title} | {total} | {done} | {rem} |")

table_rows.append(f"| **Total** | | **{grand_total}** | **{grand_done}** | **{grand_rem}** |")

new_table = (
    "| Workflow | Description | Cases | `[x]` Done | `[ ]` Remaining |\n"
    "| -------- | ----------- | -----:| ----------:| ---------------:|\n"
    + "\n".join(table_rows)
)

# Find and replace coverage table
cov_start = content.find("## Coverage Summary")
cov_end   = content.find("\n---\n", cov_start)
if cov_end == -1:
    cov_end = len(content)

old_table_block = content[cov_start:cov_end]

# Find the actual table within the section
table_start = old_table_block.find("| Workflow")
if table_start != -1:
    # find end of table (first blank line after table)
    table_end_local = old_table_block.find("\n\n", table_start)
    if table_end_local == -1:
        table_end_local = len(old_table_block)
    old_table = old_table_block[table_start:table_end_local]
    content = content.replace(old_table, new_table)
    print(f"\n  OK: Coverage table recomputed ({grand_total} total, {grand_done} done)")
else:
    print("  MISS: Coverage table not found")

# ─── 7. Write result ──────────────────────────────────────────────────────────
with open(MD_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

lines = content.count('\n')
print(f"\nDONE. automation-testing-plan.md: {lines} lines, {grand_total} total cases across {len(wf_data)} workflows.")
print("\nPer-WF breakdown:")
for wf_num, wf_title, total, done, rem in wf_data:
    print(f"  WF{wf_num:>2}: {total:>4} cases  ({done} done)")
