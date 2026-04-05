"""
Update application-map.json to v1.8.0 with full Release Management Flow coverage
based on 42 Confluence pages fetched recursively.
"""
import json, copy

MAP_PATH = "/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/docs/ai/application-map.json"

with open(MAP_PATH) as f:
    data = json.load(f)

# ── Helper ─────────────────────────────────────────────────────────────────────
def get_node(node_id):
    for n in data['nodes']:
        if n['id'] == node_id:
            return n
    return None

def node_exists(node_id):
    return get_node(node_id) is not None

def link_exists(source, target):
    for lnk in data['links']:
        if lnk['source'] == source and lnk['target'] == target:
            return True
    return False

# ── 1. Bump version ────────────────────────────────────────────────────────────
data['meta']['version'] = "1.8.0"
data['meta']['lastUpdated'] = "2026-03-30"
data['meta']['description'] = (
    "Full Release Management Flow coverage added (42 Confluence pages, v1.8.0). "
    "New nodes: manage-release-progress, clone-release, req-versioning, "
    "sa-pql-signoff, fcsr-review-stage, post-fcsr-stage. "
    "Enhanced: scope-review-tab, release-detail (SBOM, Pen Test, Applicability Lock, parent-child)."
)

# ── 2. New node: manage-release-progress ──────────────────────────────────────
if not node_exists("manage-release-progress"):
    data['nodes'].append({
        "id": "manage-release-progress",
        "label": "Manage Release Progress",
        "type": "page",
        "url": "/GRC_PICASso/ReleaseDetail?ReleaseId={id}#Manage",
        "description": "The Manage stage of the release lifecycle where Product Owner or Security Manager works on SDL/Product requirements, CSRR, Action Items, Jira/Jama submissions and FCSR recommendation. Accessed via the Release Detail page when release status is 'In Progress'.",
        "stage": "Manage",
        "responsibleRoles": ["Product Owner", "Security Manager"],
        "subSections": [
            {
                "id": "manage-sdl-requirements",
                "name": "1.3.3.3.1 Manage SDL Process Requirements",
                "description": "Update SDL process requirements one-by-one, in bulk, or via XLSX import. Submit to Jira (Capability/Feature/Story hierarchy). Refresh data from Jira (daily auto + manual). Sub-requirements sent to Jira as User Stories under parent Feature.",
                "jiraHierarchy": {
                    "Capability": "groups requirements by type",
                    "Feature": "per SDL Process Requirement",
                    "Story": "per sub-requirement"
                },
                "jiraStatusMapping": {
                    "Refinement/Funnel/Ready/To Do": "Planned",
                    "In Progress/Implementation/Ready to Test/Testing": "In Progress",
                    "Done": "Done"
                },
                "actions": [
                    "Update status (per requirement)",
                    "Bulk status change",
                    "Import XLSX",
                    "Export XLSX",
                    "Submit to Jira (single / batch)",
                    "Refresh Data from Jira",
                    "Unlink from Jira",
                    "Relink to Jira",
                    "Add custom sub-requirement"
                ],
                "notApplicableLock": "Some requirements flagged 'Can be marked as Not Applicable = No' cannot be set to N/A via UI, bulk edit, file upload or Jira integration"
            },
            {
                "id": "manage-product-requirements",
                "name": "1.3.3.3.2 Manage Product Requirements",
                "description": "Update Product Requirements status via PICASso, Jira, or Jama. Submit to Jama via Orchestra integration. Refresh Jama status (daily 2am CET + manual).",
                "jamaIntegration": {
                    "submitToJama": "Select requirements → Submit Selected to Jama (excludes Postponed/N/A/Delegated)",
                    "orchestra": "Sends to Jama via Orchestra third-party tool",
                    "refreshJama": "Refresh Jama Status button + daily schedule",
                    "unlinkRelink": "Unlink from Jama / Relink to Jama actions",
                    "statusMapping": "PICASso SourceStatus mapped from Jama via config on Product Details",
                    "fieldsFromJama": ["BacklogLink", "SourceStatus", "UpdatedBy", "UpdatedOn", "LastTestExecution", "VerificationStatus"]
                },
                "jiraStatusMapping": {
                    "Refinement/To Do": "Planned",
                    "In Progress/Ready to Test/Testing": "In Progress",
                    "Done": "Done",
                    "Cancelled": "Postponed"
                },
                "actions": [
                    "Update status manually",
                    "Submit to Jira",
                    "Submit to Jama",
                    "Refresh Data from Jira",
                    "Refresh Jama Status",
                    "Unlink from Jama",
                    "Relink to Jama",
                    "Export XLSX",
                    "Import XLSX"
                ]
            },
            {
                "id": "manage-csrr",
                "name": "1.3.3.3.3 Manage Cybersecurity Residual Risks",
                "description": "Populate all 10 CSRR sections. Data pre-populated from previous release if cloned. Auto-calculations in SDL Process Summary and Product Requirements Summary.",
                "sections": [
                    "SDL Processes Summary (+ SBOM Status/ID, Evaluation Status)",
                    "Product Requirements Summary",
                    "System Design",
                    "Threat Model",
                    "3rd-Party Suppliers & SE Bricks",
                    "Static Code Analysis",
                    "Software Composition Analysis",
                    "FOSS Check",
                    "Security Defects (+ Pen Test Details)",
                    "External Vulnerabilities"
                ]
            },
            {
                "id": "manage-action-items-create",
                "name": "1.3.3.3.4 New Action Items Creation",
                "fields": [
                    {"name": "Action Name", "type": "text", "mandatory": True},
                    {"name": "Action Description", "type": "text", "mandatory": True},
                    {"name": "Action State", "type": "dropdown", "options": ["Open", "In Progress", "On-Hold", "Closed"], "mandatory": True},
                    {"name": "Category", "type": "dropdown", "options": ["Pre-Condition", "Post-Condition", "Tracked"], "mandatory": True},
                    {"name": "Assignee", "type": "lookup", "mandatory": False},
                    {"name": "Due Date", "type": "date-picker", "mandatory": False},
                    {"name": "Evidence", "type": "text", "mandatory": False},
                    {"name": "Closure Comment", "type": "text", "mandatory": False, "note": "Available when Action State = Closed"}
                ]
            },
            {
                "id": "manage-action-items-update",
                "name": "1.3.3.3.5 Manage Action Items",
                "description": "Update action items manually or submit to Jira. Status mapping configured on Product Details page.",
                "actions": [
                    "Edit action",
                    "Submit Actions to Jira",
                    "Refresh Data from Jira"
                ]
            },
            {
                "id": "fcsr-recommendation",
                "name": "1.3.3.3.6 FCSR Recommendation Provisioning",
                "description": "PO or SM adds themselves as FCSR participant and provides recommendation on release readiness. Done on FCSR Decision Tab.",
                "fields": [
                    {"name": "FCSR Participant Name", "type": "dropdown", "source": "Roles & Responsibilities users"},
                    {"name": "Role", "type": "text", "autoFilled": True},
                    {"name": "Recommendation", "type": "dropdown", "options": ["<<Select>>", "No-Go", "Go with Pre-Conditions", "Go with Post-Conditions", "Go"]},
                    {"name": "Comment", "type": "text", "note": "Must be factual, objective, non-offensive"}
                ],
                "validation": "If Go with Pre/Post-Conditions selected, at least one action of that category must exist"
            },
            {
                "id": "tracking-release-progress",
                "name": "1.3.3.3.7 Tracking Release Progress",
                "description": "Visual progress indicators for SDL Process Requirements and Product Requirements completion percentages.",
                "calculations": {
                    "sdlCompletionPct": "Count(SDL reqs with status Done) / Count(all applicable SDL reqs)",
                    "productReqCompletionPct": "(Count(FullyMet) + 0.5 * Count(PartiallyMet)) / Count(all applicable product reqs)"
                }
            }
        ],
        "accessibleFrom": ["release-detail"],
        "automationCoverage": "none",
        "confluenceRef": "450758277"
    })
    print("+ Added node: manage-release-progress")

# ── 3. New node: clone-release ─────────────────────────────────────────────────
if not node_exists("clone-release"):
    data['nodes'].append({
        "id": "clone-release",
        "label": "Clone Release Dialog",
        "type": "dialog",
        "parentNode": "release-detail",
        "description": "Clone Release popup available from Releases tab (three-dots menu) or Create Release button for non-first releases. Two options: 'Clone from existing release' or 'Create as new'.",
        "trigger": "Three-dots icon in Releases tab → Clone, or Create Release button (non-first release)",
        "cloneOption": {
            "fields": [
                {"name": "Select release to clone", "type": "dropdown", "mandatory": True, "default": "latest release"},
                {"name": "Release Version", "type": "text", "mandatory": True},
                {"name": "Target Release Date", "type": "date-picker", "mandatory": True},
                {"name": "Change Summary", "type": "text", "mandatory": True}
            ],
            "dataCloned": [
                "Release Details (Pen Test dates, BU SO FCSR date, Cont. Pen Test)",
                "Roles & Responsibilities Product Team table",
                "Questionnaire answers",
                "Process Requirements (all statuses, Evidence, Justification, Source Link)",
                "Product Requirements (all statuses, Evidence, Justification, Source Link)",
                "CSRR SDL Process Req Summary evaluation statuses",
                "CSRR Product Req Summary evaluation statuses",
                "CSRR System Design (info, components, countermeasures, residual risk)",
                "CSRR Threat Model (all including links and residual risk)",
                "CSRR 3rd Party Suppliers & SE Bricks + residual risk",
                "CSRR Static Code Analysis tools + residual risk",
                "CSRR SCA tools + residual risk",
                "CSRR FOSS Check (all except actions)",
                "CSRR Security Defects (SVV Issues, Pen Test Details, residual risk)",
                "CSRR External Vulnerabilities + residual risk"
            ],
            "dataNotCloned": [
                "Review & Confirm tab content",
                "FCSR Decision tab content",
                "All actions"
            ]
        },
        "createAsNewOption": {
            "fields": [
                {"name": "Release Version", "type": "text", "mandatory": True},
                {"name": "Last Full Pen Test Date", "type": "date-picker", "mandatory": False},
                {"name": "Continuous Penetration Testing", "type": "toggle"},
                {"name": "Cont. Pen Test Contract Date", "type": "date-picker", "conditional": "Cont. Pen Test = Yes"},
                {"name": "Change Summary", "type": "text", "mandatory": True}
            ]
        },
        "warnings": [
            "Cloned questionnaire: 'Some answers were inherited during cloning from another release. Please review and update if needed.'",
            "Cloned requirements: 'Requirements were cloned from another release. Please review and update if needed.'"
        ],
        "buttons": ["Create&Scope", "Reset Form", "Cancel"],
        "automationCoverage": "none",
        "confluenceRef": "485734647"
    })
    print("+ Added node: clone-release")

# ── 4. New node: req-versioning ────────────────────────────────────────────────
if not node_exists("req-versioning"):
    data['nodes'].append({
        "id": "req-versioning",
        "label": "Requirements Versioning",
        "type": "feature",
        "parentNode": "release-detail",
        "description": "Version control for process and product requirements database. When requirements are updated in BackOffice, releases in Scoping/Manage stages see a warning with options to keep previous version or update to new version.",
        "warningMessage": "Warning shown on Process/Product Requirements tabs when newer requirement version is available",
        "userOptions": [
            {"option": "Keep previous version", "effect": "Warning remains visible; can change later"},
            {"option": "Change version", "subOptions": ["Update status to Planned", "Keep existing status"], "effect": "Warning updates to info message; updated requirements shown"}
        ],
        "stageAvailability": {
            "Scoping (pre-questionnaire)": "Requirements scoped with latest version after questionnaire",
            "Scoping (post-questionnaire)": "Warning shown; manual re-scoping options available",
            "Scope Approval": "Warning shown; manual re-scoping options available",
            "In Progress (Manage)": "Warning shown; manual re-scoping options available",
            "FCSR Readiness/FCSR Review/Final Acceptance": "No updates shown or performed",
            "Completed/Cancelled/Inactive": "No updates"
        },
        "autoTrigger": "Configurable date in BackOffice; automatic mandatory update applied even if 'Keep previous version' was selected",
        "majorFields": {
            "processRequirements": ["Code", "Name", "Description", "Selection Criteria"],
            "productRequirements": ["Code", "Name", "Description", "Selection Criteria"]
        },
        "automationCoverage": "none",
        "confluenceRef": "681885844"
    })
    print("+ Added node: req-versioning")

# ── 5. New node: sa-pql-signoff ────────────────────────────────────────────────
if not node_exists("sa-pql-signoff"):
    data['nodes'].append({
        "id": "sa-pql-signoff",
        "label": "SA & PQL Sign Off Stage",
        "type": "workflow-stage",
        "parentNode": "release-detail",
        "stageAlias": "Security & Privacy Readiness Sign Off (when DP applicable)",
        "description": "FCSR Readiness Review stage where Security Advisor and Process Quality Leader review process/product requirements, update Evaluation Status, assess residual risks, and submit for FCSR Review.",
        "responsibleRoles": ["Security Advisor (SDPA)", "Process Quality Leader (PQL)", "Privacy Reviewer (if DP applicable)"],
        "keyFeatures": [
            "Task auto-assigned via My Tasks when release reaches this stage",
            "SA and PQL can access all Manage-stage actions EXCEPT submitting to Jira",
            "Evaluation Status editable on Cybersecurity Residual Risks tab",
            "Auto-calculated fields: SDL Process Summary (Done/Total, FullyMet/Total) and Product Req Summary (across all releases, current release)",
            "FCSR Decision Tab: Add Participant recommendations (Go/No-Go/Go with Pre/Post-Conditions)",
            "Rework button: send back to Manage with mandatory justification",
            "Submit for FCSR Review: both SA and PQL must submit"
        ],
        "evaluationStatusOptions": ["Not evaluated", "Not met", "Partially met", "Fully met"],
        "validations": [
            "If SBOM status = 'Submitted', SBOM ID must be provided",
            "Both SA and PQL must provide recommendations before submission"
        ],
        "escalation": "Either reviewer can return to rework even if the other already signed off",
        "sbomValidation": "SBOM ID mandatory when SBOM Status = 'Submitted'",
        "automationCoverage": "none",
        "confluenceRef": "450758381"
    })
    print("+ Added node: sa-pql-signoff")

# ── 6. New node: fcsr-review-stage ────────────────────────────────────────────
if not node_exists("fcsr-review-stage"):
    data['nodes'].append({
        "id": "fcsr-review-stage",
        "label": "FCSR Review Stage",
        "type": "workflow-stage",
        "parentNode": "release-detail",
        "description": "Formal Cybersecurity Review stage. Routed to SA, LOB Security Leader, or BU Security Officer based on Minimum Oversight Level and FCSR date. Decision triggers release completion or post-FCSR actions.",
        "routingLogic": {
            "toBUSO": "Minimum Oversight Level = BU Security Officer OR last BU SO FCSR > 12 months",
            "toLOBSL": "Minimum Oversight Level = LOB Security Leader",
            "toSA": "Otherwise (Minimum Oversight Level = Team)"
        },
        "escalationChain": "SA → LOB Security Leader → BU Security Officer → CISO/SVP LOB (exception required toggle)",
        "fcsr_decision_tab_sections": [
            "Recommendation (with Instructions link)",
            "Cybersecurity Risk Summary (group tiles → links to CSRR sections)",
            "FCSR Participants (Add Participant popup: Release Team or Others option)",
            "Key Discussion Topics (topic name + discussion details)",
            "FCSR Decision (dropdown: No-Go/Go with Pre-Conditions/Go with Post-Conditions/Go)",
            "Exception Required (toggle + CISO/SVP LOB checkbox)",
            "Action Plan items"
        ],
        "addParticipantPopup": {
            "releaseTeamOption": {
                "fields": ["User (dropdown from R&R tab)", "Recommendation (radiobutton)", "Comment (500 char limit)"],
                "buttons": ["Save", "Save & Create New", "Cancel", "X"]
            },
            "othersOption": {
                "fields": ["User (Sailpoint lookup)", "Role (free text)", "Recommendation (radiobutton)", "Comment (500 char limit)"],
                "buttons": ["Save", "Save & Create New", "Cancel", "X"]
            }
        },
        "decisions": ["No-Go", "Go with Pre-Conditions", "Go with Post-Conditions", "Go"],
        "outcomesAfterDecision": {
            "Go": "Release automatically completed → status = Completed",
            "No-Go": "Release automatically cancelled",
            "Go with Pre-Conditions": "Routes to Post FCSR Actions stage",
            "Go with Post-Conditions": "Routes to Final Acceptance stage"
        },
        "postFcsrActionsLock": "Once on Post FCSR Actions or Final Acceptance, FCSR Participants section is read-only",
        "automationCoverage": "none",
        "confluenceRef": "450758400"
    })
    print("+ Added node: fcsr-review-stage")

# ── 7. New node: post-fcsr-stage ──────────────────────────────────────────────
if not node_exists("post-fcsr-stage"):
    data['nodes'].append({
        "id": "post-fcsr-stage",
        "label": "Post FCSR Actions Stage",
        "type": "workflow-stage",
        "parentNode": "release-detail",
        "description": "Post FCSR Actions stage — only reached if FCSR Decision = 'Go with Pre-Conditions'. PO/SM must close all Pre-Condition actions before submitting.",
        "responsibleRoles": ["Product Owner", "Security Manager"],
        "decisionOutcomes": {
            "Go with Pre-Conditions": "PO must address Pre-Condition actions. CSRR and FCSR Decision tabs editable for actions only. 'Edit Actions' button at bottom-right.",
            "Go": "Release automatically completed",
            "Go with Post-Conditions": "Routes to Final Acceptance",
            "No-Go": "Release automatically cancelled with warning to create new release"
        },
        "editActionsDialog": {
            "trigger": "Edit Actions button (bottom right)",
            "fields": ["Action Status (dropdown)", "Closure Comment"],
            "buttons": ["Cancel", "Save Actions"]
        },
        "sbomValidation": "SBOM Status/ID editable during Post FCSR Actions (Actions Closure status) but becomes immutable after Final Acceptance",
        "finalAcceptance": {
            "trigger": "Product Owner or Security Manager submits release for final acceptance",
            "routedTo": "FCSR approver of this release",
            "approverOptions": ["Complete release (→ Completed status)", "Return to PO for rework"],
            "sbomValidations": [
                "SBOM Status and SBOM ID must not be empty",
                "If SBOM Status = 'In Progress', SBOM ID must be provided"
            ],
            "penTestValidation": "SVV-4 Pen Test Details must be completed if SVV-4 status ≠ Not Applicable/Postponed"
        },
        "automationCoverage": "none",
        "confluenceRef": "450758656"
    })
    print("+ Added node: post-fcsr-stage")

# ── 8. Enhance scope-review-tab node ──────────────────────────────────────────
srn = get_node("scope-review-tab")
if srn:
    srn['description'] = "Review & Confirm tab on Release Detail page. Used by Security Advisor / LOB Security Leader / BU Security Officer / Privacy Advisor to confirm release scope before Manage stage. Contains: Requirements Summary (donut charts), Previous FCSR Summary, Cybersecurity Risk Summary, Data Privacy Risk Summary, Scope Review Participants, Key Discussion Topics, Scope Review Decision, Action Plan items."
    srn['confluenceRef'] = "521112079"
    srn['elements'] = {
        "requirementsSummary": {
            "collapsedByDefault": True,
            "processRequirementsSubSection": {
                "filters": ["SDL Practice (dropdown)", "Include Sub-Requirements (toggle)"],
                "chart": "Donut chart - % of requirements per status",
                "actions": ["View Full Screen", "Print Chart", "Download PNG/JPEG/SVG"]
            },
            "productRequirementsSubSection": {
                "filters": ["Category (dropdown)", "Source (dropdown)", "Include Sub-Requirements (toggle)"],
                "chart": "Donut chart - % of requirements per status",
                "actions": ["View Full Screen", "Print Chart", "Download PNG/JPEG/SVG"]
            },
            "note": "Snapshot frozen when release moves to Manage stage. Reflects real-time data if sent back to rework."
        },
        "previousFcsrSummary": {
            "collapsedByDefault": True,
            "fields": [
                "Previous Release (dropdown - latest on Post FCSR/Final Acceptance by default)",
                "Status (read-only)",
                "Privacy Risk (read-only)",
                "Risk Classification (read-only)",
                "FCSR Decision Date (read-only)",
                "PCC Decision (read-only)",
                "Link to Protocol File",
                "FCSR Approval Decision (read-only)",
                "Exception Required (read-only)",
                "FCSR Approver (read-only)",
                "Comments of Exception Required (read-only)"
            ],
            "hiddenWhen": "No previous release has PCC Decision or Data Privacy Summary"
        },
        "cybersecurityRiskSummary": {
            "collapsedByDefault": True,
            "content": "Tiles for each CSRR group showing selected risk from previous stage. Clickable → opens CSRR section in new tab."
        },
        "dataPrivacyRiskSummary": {
            "collapsedByDefault": True,
            "content": "Tiles for each DP section showing selected risk. Clickable → opens DP Review section in new tab.",
            "hiddenWhen": "No DP Risk Summary on selected previous release"
        },
        "scopeReviewParticipants": {
            "openByDefault": True,
            "editableStages": ["Review & Confirm"],
            "readOnlyStages": ["Creation & Scoping", "Manage", "SA & PQL Sign Off", "FCSR Review", "Post FCSR Actions", "Final Acceptance"],
            "addParticipantPopup": {
                "releaseTeamOption": {
                    "fields": ["User (dropdown from R&R)", "Recommendation (radiobutton: Approved/Pending/Rejected/Approved with Actions/Reworked)", "Comment (500 char)"],
                    "defaultUser": "currently logged-in user if no recommendation yet",
                    "buttons": ["Save", "Save & Create New", "Cancel", "X"]
                },
                "othersOption": {
                    "fields": ["User (Sailpoint lookup)", "Role (free text, mandatory)", "Recommendation (radiobutton)", "Comment"],
                    "buttons": ["Save", "Save & Create New", "Cancel", "X"]
                }
            },
            "editDeleteRestriction": "Once release on Manage stage, participants locked to read-only"
        },
        "keyDiscussionTopics": {
            "openByDefault": True,
            "editableStages": ["Review & Confirm", "Creation & Scoping (after rework)", "Manage", "SA & PQL Sign Off", "FCSR Review", "Post FCSR Actions"],
            "readOnlyStages": ["Final Acceptance"],
            "fields": ["Topic Name (text)", "Discussion Details (text)", "Date (auto)", "Added By (auto)"],
            "restrictions": "Topics from other stages not editable/deletable; only newly added topics can be deleted in same stage"
        },
        "scopeReviewDecision": {
            "openByDefault": True,
            "editableStages": ["Review & Confirm"],
            "readOnlyOtherStages": True,
            "fields": [
                {"name": "Scope Review Decision", "type": "dropdown", "options_source": "BackOffice (Approved/Approved with Actions/Rework)", "mandatory_for_submit": True, "optional_for_rework": True}
            ]
        },
        "actionPlanItems": {
            "openByDefault": True,
            "submitActionsToJira": True,
            "refreshDataFromJira": True,
            "fields": [
                {"name": "Action Name", "mandatory": True},
                {"name": "Action Description", "mandatory": True},
                {"name": "Action State", "options": "from BackOffice", "mandatory": True},
                {"name": "Category", "options": "from BackOffice", "mandatory": True},
                {"name": "Assignee", "type": "lookup", "mandatory": False},
                {"name": "Closure Comment", "mandatory": False},
                {"name": "Due Date", "mandatory": False},
                {"name": "Evidence", "mandatory": False},
                {"name": "JIRA Link", "note": "Auto-populated after Jira submission"}
            ]
        }
    }
    print("~ Enhanced node: scope-review-tab")

# ── 9. Enhance release-detail: add new dialogs and feature enhancements ────────
rd = get_node("release-detail")
if rd:
    # Add applicability lock to Process Requirements tab details
    for tab in rd.get('elements', {}).get('tabs', []):
        if tab['name'] == 'Process Requirements':
            tab['applicabilityLock'] = {
                "description": "Requirements with 'Can be marked as Not Applicable = No' (configured in BackOffice) cannot be set to N/A",
                "enforcement": ["UI (disabled N/A option with tooltip)", "Bulk status change (error message)", "File upload (validation error)", "Jira API integration (highlighted error)"],
                "confluenceRef": "680705081"
            }
            tab['parentChildSelection'] = {
                "description": "When selecting parent requirement, dropdown popup appears with options to select parent only or parent + all sub-requirements",
                "triggerOn": "Parent requirement checkbox click or Select All checkbox",
                "deSelectOptions": ["De-select parent only", "De-select parent and sub-requirements"],
                "selectOptions": ["Select parent only", "Select parent with sub-requirements"],
                "selectAllOptions": ["Select parent requirements only", "Select parents with sub-requirements"],
                "disabledWhen": "'Show process sub-requirements' toggle = off on Product Configuration",
                "confluenceRef": "680721787"
            }
        if tab['name'] == 'Cybersecurity Residual Risks (CSRR)':
            for sec in tab.get('subSections', []):
                if sec['name'] == 'SDL Processes Summary':
                    sec['sbomStatus'] = {
                        "field": "SBOM Status",
                        "type": "dropdown",
                        "options": ["In Progress", "Submitted", "N/A"],
                        "conditionalFields": {
                            "N/A": "Justification (mandatory)",
                            "In Progress/Submitted": "SBOM ID (text field)"
                        },
                        "editableOnPostFCSR": True,
                        "immutableAfterFinalAcceptance": True,
                        "validations": [
                            "SA&PQL stage: if SBOM Status = Submitted → SBOM ID mandatory",
                            "Final Acceptance: SBOM Status + SBOM ID must be non-empty",
                            "Final Acceptance: if SBOM Status = In Progress → SBOM ID mandatory"
                        ],
                        "confluenceRef": "558601259"
                    }
                if sec['name'] == 'Security Defects':
                    sec['penTestConditions'] = {
                        "description": "Penetration Testing details management for Security Defects section",
                        "createReleaseField": {
                            "forExistingProductRelease": "Was pen test performed? (Yes/No) replaces 'Last Full Pen Test Date'",
                            "yesSubFields": ["Last Pen Test Type (Full/Partial/Continuous)", "Last Pen Test Date (mandatory)"],
                            "noSubField": "Justification (mandatory)"
                        },
                        "csrrEnforcement": {
                            "penTestPerformed_yes": "Pen Test Type + Internal SRD Number/Vendor Ref Number = mandatory",
                            "penTestNotPerformed_or_Delegated_or_NA": "Justification field mandatory"
                        },
                        "immutableAfterCompletion": True,
                        "fcsrAutoAction": "If mandatory Pen Test fields missing at FCSR Review → system auto-creates action 'Review Penetration Testing Details fields' with Pre-Condition status",
                        "fcsrValidation": "SVV-4 Pen Test status ≠ Not Applicable/Postponed → Pen Test Details must be completed at SA&PQL Submit",
                        "confluenceRef": "558602014"
                    }

    # Add clone-release and req-versioning to dialogs
    existing_dialog_ids = [d.get('id') for d in rd.get('dialogs', [])]
    if 'clone-release-popup' not in existing_dialog_ids:
        rd.setdefault('dialogs', []).append({
            "id": "clone-release-popup",
            "label": "Clone Release / Create Release Dialog",
            "description": "Shown when 'Create Release' is clicked (non-first release) or 'Clone' is chosen from three-dots menu",
            "options": ["Clone from existing release", "Create as new"],
            "ref_node": "clone-release"
        })
    if 'req-versioning-warning' not in existing_dialog_ids:
        rd.setdefault('dialogs', []).append({
            "id": "req-versioning-warning",
            "label": "Requirements Version Update Warning",
            "description": "Appears on Process/Product Requirements tabs when BackOffice requirement database has updates",
            "options": ["Keep previous version", "Change version (with optional status reset to Planned)"],
            "ref_node": "req-versioning"
        })
    if 'parent-child-selection-popup' not in existing_dialog_ids:
        rd.setdefault('dialogs', []).append({
            "id": "parent-child-selection-popup",
            "label": "Parent/Sub-Requirement Selection Popup",
            "description": "Dropdown popup when parent requirement checkbox is clicked",
            "selectOptions": ["Select parent only", "Select parent with sub-requirements"],
            "deSelectOptions": ["De-select parent only", "De-select parent and sub-requirements"],
            "ref_node": "req-versioning"
        })

    print("~ Enhanced node: release-detail (dialogs, SBOM, Pen Test, Applicability Lock, Parent-Child)")

# ── 10. Enhance workflowStages.releaseWorkflow ─────────────────────────────────
wf = data.get('workflowStages', {}).get('releaseWorkflow', {})
stage_defs = {
    "Creation & Scoping": {
        "responsibleRoles": ["Product Owner", "Security Manager"],
        "availableTabs": ["Release Details", "Roles & Responsibilities", "Questionnaire", "Process Requirements", "Product Requirements"],
        "submissionAction": "Submit for Review",
        "routingNote": "Questionnaire determines Risk Classification → affects reviewer assignment for next stages",
        "reworkNote": "Can receive rework from Review & Confirm stage"
    },
    "Review & Confirm": {
        "responsibleRoles": ["Security Advisor / LOB Security Leader / BU Security Officer (based on MOL + Risk)", "Privacy Advisor (if DP applicable)"],
        "availableTabs": ["Release Details", "Roles & Responsibilities", "Questionnaire", "Process Requirements", "Product Requirements", "Review & Confirm tab"],
        "submissionAction": "Submit (→ Manage) / Rework (→ Creation & Scoping)",
        "routingLogic": {
            "toBUSO": "MOL = BU Security Officer OR last BU SO FCSR > 12 months",
            "toLOBSL": "MOL = LOB Security Leader",
            "toSA": "MOL = Team + Risk = Insignificant",
            "toLOBSL_minor": "MOL = Team + Risk = Minor",
            "toBUSO_major": "MOL = Team + Risk = Major/Initial"
        },
        "riskClassificationChange": "If reviewer changes risk classification, approver route changes accordingly"
    },
    "Manage": {
        "responsibleRoles": ["Product Owner", "Security Manager"],
        "availableTabs": ["All Release Detail tabs", "Cybersecurity Residual Risks", "FCSR Decision"],
        "submissionAction": "Submit for SA & PQL Sign Off",
        "reworkNote": "Can receive rework from SA & PQL Sign Off stage",
        "keyActivities": ["Manage SDL/Product Requirements", "Manage CSRR (10 sections)", "Submit to Jira/Jama", "Create/Update Action Items", "Provide FCSR Recommendation"]
    },
    "Security & Privacy Readiness Sign Off": {
        "stageAliases": ["SA & PQL Sign Off", "Security & Privacy Readiness Sign Off (when DP applicable)"],
        "responsibleRoles": ["Security Advisor", "Process Quality Leader", "Privacy Reviewer (if DP applicable)"],
        "availableTabs": ["All tabs", "Data Protection & Privacy Review (if DP applicable)"],
        "submissionAction": "Submit for FCSR Review / Rework",
        "submissionsRequired": "Both SA AND PQL must submit (2 of 2)",
        "keyActivities": ["Update Evaluation Status", "Review CSRR", "Provide FCSR recommendations", "Send for rework if data insufficient"],
        "sbomValidation": "SBOM ID mandatory if SBOM Status = Submitted"
    },
    "FCSR Review": {
        "responsibleRoles": ["SA / LOB SL / BU SO (based on MOL)", "CISO / SVP LOB (if exception required)"],
        "availableTabs": ["All tabs (read for most)", "FCSR Decision tab (editable)"],
        "submissionAction": "Approve FCSR / Escalate / Rework",
        "decisionOptions": ["No-Go (→ Cancelled)", "Go (→ Completed)", "Go with Pre-Conditions (→ Post FCSR Actions)", "Go with Post-Conditions (→ Final Acceptance)"],
        "escalationChain": "SA → LOB SL → BU SO → CISO/SVP LOB"
    },
    "Post FCSR Actions": {
        "responsibleRoles": ["Product Owner", "Security Manager"],
        "availableTabs": ["CSRR tab (actions only)", "FCSR Decision tab (actions only)"],
        "submissionAction": "Submit (if Go / Go with Post-Conditions) / Release Cancelled (if No-Go)",
        "triggeredBy": "FCSR Decision = Go with Pre-Conditions only",
        "keyActivity": "Close all Pre-Condition action items"
    },
    "Final Acceptance": {
        "responsibleRoles": ["FCSR Approver (SA/LOB SL/BU SO) — if Go with Post-Conditions", "PO/SM — if Go (Post FCSR Actions skipped)"],
        "submissionAction": "Final Acceptance (→ Completed) / Rework",
        "sbomValidations": ["SBOM Status + SBOM ID must be non-empty", "SBOM ID mandatory if SBOM Status = In Progress"],
        "penTestValidation": "SVV-4 Pen Test Details mandatory if SVV-4 ≠ N/A or Postponed"
    }
}
for stage in wf.get('stages', []):
    if stage['name'] in stage_defs:
        stage.update(stage_defs[stage['name']])
        print(f"~ Enhanced workflowStage: {stage['name']}")

# ── 11. Add new links ──────────────────────────────────────────────────────────
new_links = [
    {"source": "release-detail", "target": "manage-release-progress", "label": "enters Manage stage"},
    {"source": "manage-release-progress", "target": "jira", "label": "submit SDL/Product reqs, actions to Jira"},
    {"source": "manage-release-progress", "target": "jama", "label": "submit Product reqs to Jama via Orchestra"},
    {"source": "release-detail", "target": "sa-pql-signoff", "label": "Submit for SA & PQL"},
    {"source": "release-detail", "target": "fcsr-review-stage", "label": "Submit for FCSR Review"},
    {"source": "release-detail", "target": "post-fcsr-stage", "label": "FCSR Decision: Go with Pre-Conditions"},
    {"source": "release-detail", "target": "clone-release", "label": "Clone Release / Create Release (non-first)"},
    {"source": "release-detail", "target": "req-versioning", "label": "requirement version update notification"},
    {"source": "sa-pql-signoff", "target": "fcsr-review-stage", "label": "Submit for FCSR Review"},
    {"source": "fcsr-review-stage", "target": "post-fcsr-stage", "label": "Decision: Go with Pre-Conditions"},
    {"source": "post-fcsr-stage", "target": "release-detail", "label": "Final Acceptance / Completed"},
]
added_links = 0
for lnk in new_links:
    if not link_exists(lnk['source'], lnk['target']):
        data['links'].append(lnk)
        added_links += 1
        print(f"+ Added link: {lnk['source']} → {lnk['target']}")

# ── 12. Save ───────────────────────────────────────────────────────────────────
with open(MAP_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"DONE. Saved application-map.json v1.8.0")
print(f"Nodes: {len(data['nodes'])}")
print(f"Links: {len(data['links'])}")
print(f"New links added: {added_links}")
