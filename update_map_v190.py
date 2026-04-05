"""
update_map_v190.py
------------------
Updates application-map.json from v1.8.0 → v1.9.0
Incorporates all 37 "02. Already in Prod" Confluence pages.
New nodes: actions-management-page, product-changes-history, scope-review-confirm-tab
Significantly updated: product-detail, req-management, clone-release, scope-review-tab,
  landing (my-tasks/my-reports), release-detail, questionnaire, fcsr-review-stage
"""

import json, copy
from datetime import datetime

MAP_PATH = "/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/application-map.json"

with open(MAP_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# ── helpers ──────────────────────────────────────────────────────────────────
def find_node(nid):
    for n in data["nodes"]:
        if n["id"] == nid:
            return n
    return None

def add_node(node):
    if not find_node(node["id"]):
        data["nodes"].append(node)
        return True
    return False

def add_link(link):
    for lk in data["links"]:
        if lk["source"] == link["source"] and lk["target"] == link["target"]:
            return False
    data["links"].append(link)
    return True

# ── 1. Update metadata ────────────────────────────────────────────────────────
data["meta"]["version"] = "1.9.0"
data["meta"]["generatedAt"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
data["meta"]["description"] = (
    "Full 'Already in Prod' coverage added (37 Confluence pages, v1.9.0). "
    "New nodes: actions-management-page, product-changes-history. "
    "Enhanced: scope-review-tab (full R&C spec), req-management (custom reqs, accountability, applicability lock, Jira/Jama edit), "
    "product-detail (attestation, cross-org, product type edit, inactivation), "
    "clone-release (clone/new-radio popup), fcsr-review-stage (extended participants), "
    "questionnaire (conditional, drag-drop, inherit), landing (my-reports columns, my-tasks assignee), "
    "release-detail (SBOM status, pen test fields), reporting (req status chart, my-reports improvements)."
)
data["meta"]["lastUpdated"] = datetime.utcnow().strftime("%Y-%m-%d")

# ── 2. Update existing nodes ──────────────────────────────────────────────────

# 2a. product-detail — attestation, cross-org, product type editable, inactivation, product-level history link
n = find_node("product-detail")
if n:
    n["description"] = (
        "Product Details page: Product Info / Organization / Team / Configuration / Security Summary / "
        "Attestation Details / Data Privacy Summary / DOC Summary tabs. "
        "NEW: Cross-Organizational Development toggle + Dev Org L1/L2/L3 (in Organization tab); "
        "Attestation Details tab (Software Attestation Date + Verifier, conditional mandatory); "
        "Product Type now editable after creation with confirmation popup; "
        "Product inactivation via 3-dots menu + Actions column (condition: no ongoing/completed releases, mandatory justification); "
        "Data Privacy Summary + DOC Summary (collapsable); "
        "Product Changes History link in header; "
        "Actions Management link in header (opens standalone page in new tab)."
    )
    # Ensure elements.tabs includes attestation-details
    tabs = n.get("elements", {}).get("tabs", [])
    tab_names = [t if isinstance(t, str) else t.get("name","") for t in tabs]
    if "Attestation Details" not in tab_names:
        tabs.append({
            "name": "Attestation Details",
            "fields": ["Software Attestation Date", "Verifier"],
            "rules": "Both fields conditional-mandatory: if one is filled, the other becomes required"
        })
    if "Security Summary" not in tab_names:
        tabs.append({
            "name": "Security Summary",
            "fields": ["Continuous Pen Testing", "Last Full Pen Test Date", "Last BU SO FCSR Date", "Minimum Oversight Level"]
        })
    n.setdefault("elements", {})["tabs"] = tabs

# 2b. landing — my-tasks: Assignee filter + column
n = find_node("landing")
if n:
    tabs = n.get("elements", {}).get("tabs", [])
    for t in tabs:
        if isinstance(t, dict) and t.get("name") == "My Tasks":
            t.setdefault("filters", [])
            if "Assignee" not in t["filters"]:
                t["filters"].append("Assignee")
            t.setdefault("columns", [])
            if "Assignee" not in t["columns"]:
                t["columns"].append("Assignee")
            t["note"] = "Default filtered to current user's name. Assignee column and filter added."
        if isinstance(t, dict) and t.get("name") == "My Reports":
            t["columns"] = [
                "Product", "Release (most recent, clickable)", "Release Status",
                "Product Owner", "Security Manager", "Security Advisor", "Privacy Advisor",
                "PQL", "SVP LoB", "LOB Security Leader",
                "Data Privacy Risk Level", "Cybersecurity Risk Level",
                "Last BU Level FCSR date (highlighted if Unknown/>12mo)",
                "Last Full Pen Test date (highlighted if Unknown/>12mo)",
                "Last completed release", "Last completed release FCSR decision",
                "Last completed release FCSR Exception Required flag (highlighted if Yes)",
                "Number of open actions/conditions (clickable → Action Summary)"
            ]
            t["filters"] = [
                "Org Level 1", "Org Level 2", "Org Level 3", "Product", "Release number",
                "Product Owner", "Security Manager", "Security Advisor", "Privacy Advisor",
                "PQL", "SVP LoB", "LOB Security Leader",
                "Product Creation Period", "Release Creation Period", "Product Type"
            ]
            t["features"] = [
                "Configure Columns button + dropdown (user-specific, saved preference)",
                "Restore Default columns button",
                "Filter by specific non-current release shows release-scoped data",
                "Multi-select on role-based filters (e.g., multiple Product Owners)"
            ]

# 2c. req-management — custom reqs, accountability, applicability lock, Jira/Jama submitted edit
n = find_node("req-management")
if n:
    n["description"] = (
        "Process Requirements + Product Requirements tabs within release. "
        "Hierarchy: SDL Practice/Category → Requirement → Sub-requirement. "
        "Sub-reqs collapsed by default; arrow to expand; 'Show All Sub-Requirements' toggle. "
        "Single table (no per-practice pagination); SDL Practice filter; Requirement Order Code (drag-drop reorder). "
        "Toggle 'Show Not Selected Requirements' (renamed from 'Show All Requirements'). "
        "Status filter + Reset; 'New' stamp (req creation > release creation date); 'Show Only New Requirements' filter. "
        "Columns: Requirement/Name, Description, Status, Backlog Link, Source Status, Evidence, Actions (mandatory) + "
        "Assignee (Jira only), Updated By, Update Date; Column configurator (Columns button). "
        "Bulk actions: Edit Selected Requirements, Submit to Jira (with Include sub-requirements checkbox), "
        "Refresh Jira Data, Add, Remove, Unlink, Relink. "
        "Jira actions per req (3-dots): View, Edit, Add, Remove, Unlink, Relink. "
        "Relink popup: shows Name, Unlinked Date, Previous Jira ticket (clickable). "
        "Evidence/Justification editable for Jira-submitted requirements (status greyed-out). "
        "Jama: Status, Evidence, Justification, Verification Status, Last Test Execution editable. "
        "CUSTOM REQUIREMENTS (Product Requirements tab only): 'Add Custom Requirements' button; "
        "popup: Name(m), Code/ID(m, unique), Condition, Category(read-only=Custom), Description(m), Source(m), "
        "'Add as sub-req' toggle, Parent req dropdown (custom parents only). "
        "Bulk import XLSX with Instructions+Data tabs; Edit/Remove custom reqs; "
        "Custom reqs cloned with release; privilege ADD_CUSTOM_REQUIREMENTS (PO, SM, SA, Superuser). "
        "ACCOUNTABILITY (Process Requirements only): Accountability Role + Accountability Person columns; "
        "filter dropdowns for both. "
        "APPLICABILITY LOCK: 'Not Applicable' status disabled per req if BackOffice 'Can be marked as Not Applicable'=No; "
        "tooltip shown; bulk and file upload validation errors; Jira mapping validation. "
        "PARTIAL/DELEGATED statuses: Partial(lime)=evidence+justification mandatory, Jira ticket created; "
        "Delegated(grey)=justification mandatory, NO Jira. "
        "PARENT-CHILD SELECTION: dropdown on select parent (Select parent only / Select parent with sub-requirements); "
        "dropdown on deselect (De-select parent only / De-select parent and sub-reqs); only when sub-reqs visible. "
        "REQUIREMENTS STATUS SUMMARY: '+ Requirements Status Summary' link → pie chart by status; "
        "SDL Practice/Category filter; Include sub-requirements toggle. "
        "CSRR/DPP SUMMARY: same hierarchical view, single table, Status+SDL Practice filters, Evaluation Status filter."
    )

# 2d. questionnaire node
n = find_node("questionnaire")
if n:
    n["description"] = (
        "Questionnaire tab in release Creation & Scoping stage. "
        "Single questionnaire triggers BOTH Process AND Product Requirements. "
        "Both req tabs disabled/greyed until questionnaire submitted. Re-answering allowed after submission. "
        "Questions ordered by 'Question Order' field (drag-drop on Edit Questionnaire page). "
        "Conditional questions: formula-based 'Selection criteria' (LEAP); 'Is Conditional' badge on list. "
        "No tree logic (Next Question / Is First Question removed). "
        "'Inherit from previous answer' setting per question (default ON = copied on clone). "
        "'Link for the question' field shown under question during completion. "
        "New question types: Radio button (single select), Multi-Select (checkboxes). "
        "REMOVED: Toggle button type, 'Is Multiple Choice' setting. "
        "Show Inactive Questions toggle in BackOffice. "
        "Formula-based requirement scoping: req added if expression evaluates TRUE after questionnaire. "
        "Warning if inherited answers on clone (shown on Questionnaire tab until R&C submitted). "
        "Answer Code: mandatory unique field per answer (letters/numbers/underscore only)."
    )

# 2e. clone-release node
n = find_node("clone-release")
if n:
    n["description"] = (
        "Create Release popup (button renamed from 'Create New Release' → 'Create Release'). "
        "If NOT first release: 2 radio options: "
        "(A) 'Clone from existing release' → Select release (latest default), Release Version(m), "
        "Target Release Date(m), Change Summary(m); Create&Scope button. "
        "(B) 'Create as new' → Release Version, Last Full Pen Test Date, Continuous Pen Testing toggle, "
        "Cont. Pen Test Contract Date (conditional), Change Summary; Create&Scope button. "
        "If FIRST release: 'New Product Release' (brand new) OR 'Existing Product Release' (onboarding). "
        "Clone button style: green → white+blue border. "
        "Cloning behavior: Process AND Product reqs cloned AS-IS (statuses/links/evidence). "
        "Clone status matrix: Planned→Planned, Delegated→Delegated, Done→Done(hidden), "
        "In Progress→In Progress, Not Applicable→Not Applicable, Partial→Partial, Postponed→Postponed. "
        "Warning on Questionnaire tab if inherited answers (until R&C submitted). "
        "Warning on Process/Product Req tabs (until R&C submitted). "
        "Confirmation checkbox before submitting to R&C (Submit disabled until checked). "
        "Actions NOT cloned (managed via Actions Management page going forward). "
        "Review & Confirm tab: no data cloned. "
        "Custom requirements: cloned with release."
    )

# 2f. fcsr-review-stage — extended participants
n = find_node("fcsr-review-stage")
if n:
    old_desc = n.get("description", "")
    if "Release Team" not in old_desc:
        n["description"] = (
            old_desc.rstrip(". ") +
            ". FCSR PARTICIPANTS EXTENDED: 'Add Participant' button → popup with "
            "'Release Team' tab (from R&R, format '<User>-<Role>') / 'Others' tab (Sailpoint UserLookup + free text Role); "
            "Both: Recommendation (Go/No-Go/Go With Pre-Conditions/Go With Post-Conditions), Comment (500 chars). "
            "Actions per participant: Edit (Recommendation+Comment only) / Delete (confirmation). "
            "Read-only after Post FCSR Actions or Final Acceptance stage. "
            "Release History logged for Add/Edit/Delete."
        )

# 2g. scope-review-tab — full R&C tab spec (now called Review & Confirm tab)
n = find_node("scope-review-tab")
if n:
    n["label"] = "Review & Confirm Tab (Scope Review)"
    n["description"] = (
        "New 'Review and Confirm' tab on release (between Product Requirements and DPP Review). "
        "Tab disabled at Creation&Scoping (first time); enabled from Review&Confirm stage onwards. "
        "SECTIONS: "
        "(1) Requirements Summary (collapsed by default): Process Req donut chart (SDL Practice filter, Include Sub-reqs toggle) + "
        "Product Req donut chart (Category filter, Source filter, Include Sub-reqs toggle). "
        "Snapshot frozen when moving to Manage; live again on rework. Highcharts donut; burger menu (full screen/print/download). "
        "(2) Previous FCSR Summary (collapsed): Previous Release dropdown → Status, Privacy Risk, Risk Classification, "
        "FCSR Decision date, PCC Decision, FCSR Approval decision, Exception Required, FCSR Approver, Comments, "
        "Cybersecurity Risk Summary, Data Privacy Risk Summary sections. "
        "(3) Scope Review Participants (open): Add Participant button; Participant Name (from R&R), Role (auto), "
        "Recommendation (Approved/Approved with Actions/Rework), Comments; Delete with confirmation. "
        "Read-only on Manage+ stages. "
        "(4) Key Discussion Topics (open): Add topic; Topic Name + Discussion Details; Date + Added By (auto). "
        "Editable on current stage; read-only on next stage. No delete after stage advance. "
        "(5) Scope Review Decision (open): dropdown (Approved/Approved with Actions/Rework); mandatory for submission to Manage. "
        "(6) Actions section (open): 'Action Plan for Scope Review Decisions' header; full action management; "
        "Submit to Jira; Refresh Data From Jira; Action Summary button. "
        "ROLES: SA, LOB SL, BU SO, Privacy Advisor, Superuser, Global = edit all; PO, SM = edit Actions only; others = view. "
        "Release History: 'Scope Review & Confirm Tab Update' (participants/topics/decision); 'Actions update'; 'Jira Submission'. "
        "API: new GetScopingReview method. "
        "Clone: no R&C data carried over. "
        "BackOffice: Scope Review Decision LoV (Approved, Approved with Actions, Rework)."
    )

# 2h. release-detail — SBOM status, pen test fields, associated products
n = find_node("release-detail")
if n:
    old_desc = n.get("description", "")
    additions = []
    if "SBOM" not in old_desc:
        additions.append(
            "SBOM STATUS: dropdown (In Progress/Submitted/N/A) in CSRR SDL Process Summary; "
            "N/A→Justification mandatory; In Progress/Submitted→SBOM ID field; "
            "editable at Post FCSR stage; immutable after Final Acceptance; "
            "validation at SA&PQL Sign Off (if Submitted, SBOM ID mandatory) and Final Acceptance."
        )
    if "Was pen test performed" not in old_desc:
        additions.append(
            "PEN TEST CONDITIONS (Existing Product Onboarding): 'Was pen test performed' (Yes/No) field; "
            "Yes→Last Pen Test Type (Full/Partial/Continuous)+Last Pen Test Date; No→Justification mandatory. "
            "CSRR Security Defects: validation per pen test answer. "
            "Fields immutable after release completion. "
            "Missing at FCSR Review→auto-creates action 'Review Penetration Testing Details fields'."
        )
    if additions:
        n["description"] = old_desc.rstrip(" .") + ". " + " ".join(additions)

# 2i. landing-my-releases — Show active only, Create Release rename
n = find_node("landing")
if n:
    for t in n.get("elements", {}).get("tabs", []):
        if isinstance(t, dict) and t.get("name") == "My Releases":
            t["note"] = (
                t.get("note", "") +
                " 'Create Release' button (renamed from 'Create New Release'). "
                "'Show Active Only' toggle (replaces 'Show Inactive/Completed')."
            )

# ── 3. Add new nodes ──────────────────────────────────────────────────────────

add_node({
    "id": "actions-management-page",
    "label": "Actions Management Page",
    "type": "page",
    "url": "/GRC_PICASso/ActionsManagement/{productId}",
    "description": (
        "Standalone Actions Management page, accessible via link in Product Details header and release header. "
        "Shows ALL actions for the product across all releases (and actions created outside releases). "
        "Table columns: Action Name (clickable), Action Description, Status, Assignee, "
        "Jira Link (if Jira used), Creation Date, Due Date, Release Number, Category, Origin, Actions (Edit/Submit to Jira). "
        "Filters: Search (name/description), Status, Release Number, Assignee, Category, Due Date Range, Include Closed (toggle). "
        "Create action button: Name(m), Due Date(m), Description(m), Assignee; "
        "default: Status=Open, Category=Tracked, Origin=Actions Management, Release Number=No release. "
        "View Action popup: all fields read-only + Edit/Close buttons (Edit hidden if submitted to Jira or Closed). "
        "Edit Action popup: Name(conditional), Description, Category, Due Date, Status, "
        "Closure Comment (when Closed, mandatory), Evidence (when Closed, mandatory), Assignee. "
        "Fields editable depend on stage: same-stage → all; different-stage → only State, Closure Comment, Evidence, Assignee. "
        "Submit to Jira: creates Feature ticket under 'SDL Actions - <Release number>' capability. "
        "Refresh Jira Data: updates status/assignee/dates from Jira; last update timestamp shown. "
        "Bar chart: total count + per-status breakdown + horizontal bar. "
        "Error states: orange exclamation on Jira errors; 'Unable to load data. Try again, please.' "
        "Actions Management History: Date, User, Activity, Description; filters: Search, Activity, Date Range. "
        "Privileges: VIEW_PRODUCT_ACTIONS (view), EDIT_PRODUCT_ACTIONS (edit). "
        "Actions not cloned with releases going forward."
    ),
    "elements": {
        "table": {
            "columns": ["Action Name", "Action Description", "Status", "Assignee", "Jira Link",
                        "Creation Date", "Due Date", "Release Number", "Category", "Origin", "Actions"],
            "sortable": ["Action Name", "Creation Date", "Due Date", "Status"]
        },
        "filters": ["Search", "Status", "Release Number", "Assignee", "Category", "Due Date Range", "Include Closed"],
        "buttons": ["Create action", "Refresh Jira Data", "Submit to Jira"],
        "chart": "Bar chart: total actions + per-status count + horizontal bars",
        "historySection": {
            "columns": ["Date", "User", "Activity", "Description"],
            "filters": ["Search", "Activity", "Date Range"],
            "pagination": "10/20/50/100"
        }
    },
    "automationCoverage": "none",
    "existingTests": []
})

add_node({
    "id": "product-changes-history",
    "label": "Product Changes History",
    "type": "component",
    "url": "/GRC_PICASso/ProductDetails/{productId}/History",
    "description": (
        "Product-level audit log page accessible from Product Details header. "
        "Logs all product field changes and action updates not tied to a specific active release. "
        "Table: Date (dd mmm yyyy hh mm, desc default), User (profile image), Activity, Description. "
        "Activities logged: product creation, name/state/commercial ref updates, DPP/Brand Label toggles, "
        "Vendor, Product Definition, Org L1/L2/L3, Development Org L1/L2/L3, PO, SM, SA, PQL, DPA, "
        "Minimum Oversight Level, tracking tool, Jira source link, Project Key, Status Mapping, "
        "Show sub-requirements toggle, action edits from product details. "
        "Filters: Search (User/Description), Activity dropdown, Date Range; Search + Reset buttons. "
        "Pagination: 10/20/50/100 per page. "
        "Error message: 'Unable to load data. Try again, please.'"
    ),
    "elements": {
        "table": {"columns": ["Date", "User", "Activity", "Description"]},
        "filters": ["Search", "Activity", "Date Range"],
        "pagination": "10/20/50/100"
    },
    "automationCoverage": "none",
    "existingTests": []
})

add_node({
    "id": "roles-delegation-page",
    "label": "Roles Delegation Page",
    "type": "page",
    "url": "/GRC_PICASso/RolesDelegation",
    "description": (
        "Roles Delegation page opened via 'Roles Delegation' button on Landing page (new tab). "
        "Table: Role Name, Scope, Delegated Person, Start Date, Expiration Date, Actions. "
        "Actions column: 'Delegate' button (no current delegate) or 3-dots: Edit / Remove Delegation. "
        "Delegate Role popup: Assignee (UserLookup, m), Start Date (m), Expiration Date (m; info if >3 months), "
        "Justification (m). Confirmation popup on Save. "
        "Edit: all popup fields editable. Remove Delegation: stops delegation, clears fields. "
        "Bulk Delegation: checkboxes + Bulk Actions (Delegate, Remove Delegation); Clear selection button; "
        "roles count shown when selected. "
        "CSO SPECIAL (BU SO + LOB SL): 'My Roles' + 'Org Level Users' tabs. "
        "'Org Level Users' tab: User Name, Roles, Delegated Roles (X of Y), View details button. "
        "Delegate effect: delegate gets 'Delegate <Role>'; delegator retains access; "
        "My Tasks updated (delegate gets delegator's open tasks); email notification sent. "
        "Expiration: delegate loses access; tasks reassigned to delegator; email sent. "
        "Display on Product Details (Product Team) + R&R tab (SDL Roles): delegatee name shown with tooltip (Justification). "
        "Roles Delegation History popup: link on page; table: Date, User, Role Holder, Activity, Description, Origin; "
        "filters: Search, Date Range, Activity; pagination 10/20/50/100. "
        "Activities logged: Assignment, Removal, Update, Expiration. "
        "Privileges: DELEGATE_ROLE (users), DELEGATE_ROLE_CSO (CSO). "
        "BackOffice: 'Can be delegated' checkbox on GRC Role edit page."
    ),
    "elements": {
        "table": {"columns": ["Role Name", "Scope", "Delegated Person", "Start Date", "Expiration Date", "Actions"]},
        "buttons": ["Roles Delegation History"],
        "bulkActions": ["Delegate", "Remove Delegation"],
        "popup": {
            "fields": ["Assignee", "Start Date", "Expiration Date", "Justification"],
            "buttons": ["Save", "Cancel"]
        }
    },
    "automationCoverage": "none",
    "existingTests": []
})

add_node({
    "id": "release-notes-viewer",
    "label": "PICASso Updates Popup (Release Notes Viewer)",
    "type": "component",
    "url": "inline-popup",
    "description": (
        "PICASso Updates popup accessed via '?' (question mark) icon in page header "
        "(replaces 'eye' icon). "
        "Click '?' → dropdown menu: 'PICASso Updates' + 'Privacy Notice'. "
        "PICASso Updates popup: Search by keyword (highlighted orange), "
        "Type filter (All Updates / Release / Content), "
        "collapsible sections sorted newest→oldest, newest expanded + 'New' stamp, timestamps. "
        "'View all updates' link → Spice+ page (BackOffice-configured URL). "
        "BackOffice: 'Release Notes Configuration' section under 'Notification Configuration'; "
        "Table: Notes Name, Notes Type (Release/Content), Release Date, New flag, Is Active, Actions (Edit/Deactivate); "
        "Create: Notes Name, Notes Type, Release Date, Body (rich text), New checkbox, Is Active; "
        "Source Link management: Add/Edit/Remove → 'View at SharePoint' link in popup; "
        "'Show Active Only' toggle; pagination 10/20/50/100."
    ),
    "elements": {
        "trigger": "? icon in page header",
        "menu": ["PICASso Updates", "Privacy Notice"],
        "popup": {
            "search": "Keyword search with orange highlight",
            "filter": "Type: All Updates / Release / Content",
            "items": "Sections collapsed by default; newest expanded with New stamp",
            "link": "View all updates → Spice+"
        }
    },
    "automationCoverage": "none",
    "existingTests": []
})

add_node({
    "id": "maintenance-page",
    "label": "Maintenance Mode Page",
    "type": "page",
    "url": "/GRC_PICASso/Maintenance",
    "description": (
        "Displayed when maintenance mode is ON and user does not have 'System Access during Maintenance' privilege. "
        "Shows header + body text configured in BackOffice 'Maintenance Mode Configuration' "
        "(under Notification Configuration). "
        "Header supports [START_DATE_AND_TIME] + [END_DATE_AND_TIME] placeholders. "
        "Superusers see both BackOffice and front office. Tech Admins see BackOffice only. "
        "Privileges: View/Edit Maintenance Mode Configuration (Superuser + Tech Admin), "
        "System Access during Maintenance (Superuser)."
    ),
    "automationCoverage": "none",
    "existingTests": []
})

# ── 4. Add new links ───────────────────────────────────────────────────────────
add_link({"source": "product-detail", "target": "actions-management-page",
          "label": "Actions Management link in header"})
add_link({"source": "product-detail", "target": "product-changes-history",
          "label": "Product Changes History link in header"})
add_link({"source": "landing", "target": "roles-delegation-page",
          "label": "Roles Delegation button in Landing header"})
add_link({"source": "landing", "target": "release-notes-viewer",
          "label": "? icon in page header → PICASso Updates popup"})
add_link({"source": "release-detail", "target": "actions-management-page",
          "label": "Actions Management link in release header"})
add_link({"source": "release-detail", "target": "scope-review-tab",
          "label": "Review and Confirm tab on release"})

# ── 5. Save updated JSON ──────────────────────────────────────────────────────
with open(MAP_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

node_count = len(data["nodes"])
link_count = len(data["links"])
print(f"✅ application-map.json updated to v1.9.0")
print(f"   Nodes: {node_count}  Links: {link_count}")
print(f"   New nodes added: actions-management-page, product-changes-history,")
print(f"                    roles-delegation-page (was: landing-only), release-notes-viewer, maintenance-page")
print(f"   Updated: product-detail, req-management, questionnaire, clone-release,")
print(f"            fcsr-review-stage, scope-review-tab, release-detail, landing")
