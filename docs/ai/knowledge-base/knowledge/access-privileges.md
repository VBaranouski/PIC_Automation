# PICASso Access Privileges Reference

> Source: `docs/ai/knowledge-base/user-guides/Access Privileges 21.4.xlsx`  
> Use this file in tests to determine which role to use for a given privilege.  
> **158 unique privileges** across **19 functional areas**.

---

## Canonical Role List

| Role | Short Name | Notes |
|------|-----------|-------|
| SuperUser | SuperUser | Highest-level admin; holds nearly all privileges |
| TechAdmin | TechAdmin | Technical administrator; BackOffice + API config |
| ContentAdmin | ContentAdmin | Reference data and content management |
| UserAdmin | UserAdmin | User and role assignment management |
| ProductAdmin / OrgAdmin | ProductAdmin | Product creation/modification; scoped by Org 1/2/3 |
| Product Owner | PO | Product team; manages product and release tabs |
| Security Manager | SM | Product team; co-manages product and release tabs |
| Security Advisor (SDPA) | SA | Reviews and advises on security content |
| Process Quality Leader (PQL) | PQL | Quality review of processes |
| Privacy Advisor | PA | Data privacy section owner |
| Privacy Reviewer | PR | Reviews privacy decisions |
| BU Security Officer | BUSO | Business Unit security authority; governance approvals |
| LOB Security Leader | LOBSL | Line of Business security leader |
| SVP LOB | SVPLOB | Senior VP; high-level risk acceptance |
| CISO | CISO | Chief Information Security Officer |
| CPSO | CPSO | Chief Privacy & Security Officer |
| BVP / Senior BVP | BVP | Business VP; DOC acceptance |
| DOC Lead | DOCLead | Digital Offer Certification lead |
| IT Owner / Project Manager | ITPM | IT asset owner; DOC scoping |
| Viewer Global / Viewer Product | Viewer | Read-only access; no edit rights |
| Global | Global | Cross-org visibility and approval rights |

---

## Role Groups (for test parameterization)

| Group | Members |
|-------|---------|
| **Product team** | Product Owner, Security Manager, Security Advisor |
| **Governance roles** | BU Security Officer, LOB Security Leader, SVP LOB, CISO |
| **Privacy roles** | Privacy Advisor, Privacy Reviewer |
| **Admin roles** | SuperUser, TechAdmin, ContentAdmin, UserAdmin, ProductAdmin |
| **DOC roles** | DOC Lead, BVP, CISO, CPSO, BUSO, IT Owner / Project Manager |
| **Viewer roles** | Viewer Global, Viewer Product |
| **All product roles** | Product Owner, Security Manager, Security Advisor, PQL |
| **All authenticated** | Any logged-in user |

---

## Privileges by Functional Area

### BackOffice & Administration

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `BACKOFFICE_ACCESS` | BackOffice Access | SuperUserContentAdminTechAdminProductAdminUserAdmin | Grants visibility of the BackOffice tab in the navigation. Note: this privilege alone shows the tab but produces an access error when clicked — additional privileges (e.g. MANAGE_REF_DATA, USER_UPDATE) must also be assigned for actual functionality. |
| `MANAGE_REF_DATA` | Create/Update Reference Data | TechAdmin, SuperUser, Content Admin | Allows viewing and editing reference data across BackOffice: Users & Roles (Levels/Scopes), Organization Settings (Org 1/2/3), Product Settings (Definition, Source, Status, Types, State), Release Settings (Status, Risk Classification, RACI Roles, FCSR Decisions, Tasks), CyberSecurity Residual Risks (Action Categories, Residual Risks, SDL Gaps, SCA Tools, Security Defects, Software Composition, etc.), and Notification Configuration (E-Mail). |
| `MANAGE_ROLES` | Manage Roles | SuperUser, User Admin | Allows viewing and editing Users&Roles section in BackOffice, including adding new roles and assigning privileges to roles. |
| `EXPORT_USERS` | Export Users | UserAdminSuperUser | Allows exporting the full user list with roles assigned from BackOffice (e.g., to CSV format for auditing). |
| `PERFORM_MONITORING` | Performance Monitoring | SuperUserTechAdmin | Allows accessing performance monitoring dashboards and system metrics in BackOffice. |
| `GENERATE_REPORT` | Generate Report | Product Owner, Security Manager, Security Advisor, LOB Security Leader, SVP LOB, BU Security Officer | Allows generating Scope Approval and FCSR reports from the release. Separate from the Reports & Dashboards section. |
| `PAT_CREATE` | Personal Access Token | All authenticated users | Allows a user to create a Personal Access Token (PAT) for authenticating API calls. Self-service privilege available to all authenticated users. |
| `USER_UPDATE` | User Create/Update | UserAdminSuperUser | Gives access to Users&Roles section in BackOffice, including assigning roles to users. |
| `USER_ROLE_ASSIGN` | User Role (Re) Assign | UserAdminSuperUser | Allows assigning or re-assigning roles to users. Controls who can grant access to specific products, releases, and governance functions. This is the primary access-control privilege. |
| `DELEGATE_ROLE` | Delegate Role | Product OwnerSecurity AdvisorSecurity ManagerPQLBU Security OfficerLOB Security Leader | Allows a principal role holder to delegate their role to another user, creating a delegate assignment. Delegated users inherit the same access as the principal role for the scope of delegation. |

### Workflow Templates

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `VIEW_WORKFLOW_TEMPLATES` | View Workflow Templates | SuperUserContentAdminTechAdmin | Allows viewing the Workflow Templates list and individual template details in BackOffice. Source: PIC-9542 (upcoming). |
| `CREATE_EDIT_WORKFLOW_TEMPLATE` | Create/Edit/Publish Workflow Template | SuperUserTechAdmin | Allows creating, editing, and publishing workflow templates in BackOffice. Source: PIC-9542 (upcoming). |
| `ACTIVATE_DEACTIVATE_WORKFLOW_TEMPLATE` | Activate/Deactivate Workflow Template | SuperUserTechAdmin | Allows activating or deactivating workflow templates in BackOffice. Source: PIC-9542 (upcoming). |

### Maintenance Mode & Banners

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `VIEW_MAINTENANCE_MODE` | View maintenance mode | SuperUserTechAdmin | Allows viewing the current maintenance mode status and scheduled maintenance window in BackOffice. |
| `EDIT_MAINTENANCE_MODE` | Edit maintenance mode | SuperUserTechAdmin | Allows enabling, disabling, and scheduling maintenance mode window. |
| `SYSTEM_ACCESS_DURING_MAINTENANCE` | System access during maintenance | SuperUserTechAdmin | Allows using the system while maintenance mode is active. Users with this privilege bypass the maintenance lock screen. |
| `VIEW_MAINTENANCE_CUSTOM_BANNERS_CONFIGURATION` | View Maintenance Custom Banners Configuration | SuperUserTechAdmin | Allows viewing configured custom banners that are displayed as information or warning messages on UI. |
| `EDIT_CUSTOM_BANNERS_CONFIGURATION` | Edit Custom Banners Configuration | SuperUserTechAdmin | Allows creating and editing custom banners shown to users on UI, including message text and display timing. |

### Product Management

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `PRODUCT_CREATE` | Product Create | ProductAdmin Product AdminOrg1/2/3 Creation, SuperUser | Allows creating a new product in PICASso. Required for submitting the New Product form. |
| `PRD_VIEW` | Product View | All product/release/DOC roles, Viewer Global, Org 1, Org 2, Org 3, Product roles | Allows viewing a product's details page in read-only mode. Without this privilege, the product is not visible to the user at all. |
| `PRD_UPDATE` | Product update | Product Owner, Security Manager, Security Advisor, LOB Security Leader, Product Admin Modification, Global | Allows editing an existing product's details including name, org levels, team member assignments, and product metadata. |
| `PRODUCT_OWNER_UPDATE` | Product Owner Update | Product Owner, Security Manager, Security Advisor, LOB Security Leader, Product Admin Modification, Global | Allows changing the Product Owner field on a product. This is restricted beyond standard PRD_UPDATE to prevent unauthorized ownership transfers. |
| `INACTIVATE_PRODUCT` | Inactivate Product | Product Admin Modification, Delegate Product Admin Modification (all levels), SuperUser, Global | Allows seeing and interacting with the 'Inactivate product' button. Without this privilege, the button is hidden or disabled. Products once inactivated are moved to an inactive state and no longer appear in active searches. Source: PIC-7648. |
| `ADD_ASSOCIATED_PRODUCT` | Add associated product | Product OwnerSecurity ManagerSecurity AdvisorGlobalSuperUser | Allows adding an associated product link to a product record (establishing product-to-product relationships). Not limited by scope — any org product can be selected. Source: PIC-4272. |
| `EDIT_ASSOCIATED_PRODUCT` | Edit associated products | Product OwnerSecurity ManagerSecurity AdvisorGlobalSuperUser | Allows editing or removing existing associated product relationships on a release detail tab. Source: PIC-4272. |
| `VIEW_PRODUCT_ACTIONS` | View Product Actions | Product Admin Creation/Modification (all org levels + product, Product Owner, Security Manager, PQL, BU Security Officer, LOB Security Lead, SVP LOB, CISO, Privacy Advisor, Privacy Reviewer, SuperUser, Global | Allow users to view all actions created for the product in their scope |
| `EDIT_PRODUCT_ACTIONS` | Edit Product Actions | Product Admin Product Modification, Product Owner, Security Manager, PQL, BU Security Officer, LOB Security Lead, SVP LOB, CISO, Privacy Advisor, Privacy Reviewer, SuperUser, Global | Allow users to edit actions created for the product in their scope (separate from release-level actions). |
| `VIEW_DIGITALOFFERS_PRODUCTS_INFO` | View Digital Offers info for the products | DOC LeadBU Security OfficerGovernance roles | Allows viewing Digital Offer information across all products regardless of VESTA ID linkage. Used by governance roles monitoring DOC status across the organisation. By org scope |
| `EDIT_CROSS_ORG_DEV` | Edit Cross Org Dev Fields | Product OwnerSecurity ManagerSecurity AdvisorLOB Security Leader (Org 2)ProductAdminOrg1/2/3Product Admin Product Modification | Allows populating and editing Cross Organizational Development fields (Org Level 1/2/3) on Product Details, independent of the user's role scope. Source: PIC-8281. |
| `ATTESTATIONSOFTWARE_UPDATE` | Attestation Software Update | Product Owner, Security Manager, Security Advisor, LOB Security Leader, Product Admin Modification, Global | Allows updating the software attestation section in the CSRR (confirmation that software components meet defined criteria). |
| `PRD_REQUIREMENTS_LIB_CREATE_UPDATE` | Product Requirements Library Create/Update | ContentAdminSuperUser | Allows creating and modifying entries in the Product Requirements Library in BackOffice. |
| `PRD_REQUIREMENTS_LIB_VIEW` | Product Requirements Library View | ContentAdmin | Allows viewing the Product Requirements Library (read-only access to the library contents). |

### Release Management

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `MANAGE_STAGE` | Manage Stage Release | Product Owner, Security Manager | Allows editing each tab in the release on the Manage Stage and submitting a release for the SA/PQL review stage. |
| `RLS_VIEW` | Release View | All product rolesViewer roles | Allows viewing a release and its content. This is the base privilege for any release access — without it, the release is not visible to the user. |
| `RLS_UPDATE` | Release Create and Update | Product Admin Modification, Product Owner, Security Manager, Security Advisor, LOB Security Officer | Allows creating new releases and editing release-level fields including description, version, team assignments, and metadata. |
| `INACTIVATE_RELEASE` | Inactivate Release | ProductAdminOrg1/2/ Creation/Modification, Delegate Product Admin Creation/Modification (all levels), SuperUser, Global | Allows seeing and using the 'Inactivate release' button. Without this privilege, the button is hidden. Inactivated releases are removed from active views. Source: PIC-7648. |
| `CLASSIFICATION_UPDATE` | Classification Update | Product OwnerSecurity ManagerSecurity Advisor | Allows updating the security classification level of a release (e.g., Low / Medium / High / Extreme). |
| `EDIT_RELEASE_RISK` | Edit Release Risk Classification | Security Advisor, LOB Security Leader, BU Security Officer, Superuser | Allows editing the risk classification fields on a release, separate from the general classification level. |
| `UPDATE_REQ_VERSION_IN_RELEASE` | Update requirements version in Release | Product OwnerSecurity ManagerSecurity AdvisorLOB Security LeaderBU Security OfficerSuperUserGlobal | Allows confirming or cancelling a requirements version update in a release from the "Requirements Update" pop-up. Source: PIC-8553. |

### Integrations (Jira / Jama / BDBA)

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `JIRASYNC` | Sync Data With Jira | Product OwnerSecurity Manager | Allows triggering a manual synchronisation of release or story data with the connected Jira project. |
| `SYNCJAMA` | Sync Data With Jama | Product OwnerSecurity ManagerSecurity AdvisorProcess Quality LeaderCISOLOB Security LeaderSVP LOBBU Security OfficerPrivacy AdvisorPrivacy ReviewerGlobalSuperUser | Allows sending requirements to Jama and requesting a refresh of requirement statuses from Jama. Source: PIC-5906. |
| `IMPORTBDBA` | Import Data From BDBA | Product Owner, Security Manager, Security Advisor, Global, SuperUser | Allows importing SCA scan results and sending a request to refresh data from BlackDuck Binary Analysis (BDBA) tool within a release. Source: PIC-9500. |

### API Configuration

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `API_EXTRACTION_CONFIG` | API Extraction Configuration | SuperUserTechAdmin | Allows configuring data extraction API endpoints and credentials used for exporting PICASso data to external systems. |
| `API_JIRA_CONFIG` | API Credentials Configuration | SuperUserTechAdmin | Allows configuring Jira API credentials used for the Jira integration sync feature. |
| `DATA_INGESTION_API_CONFIG` | Data Ingestion API Configuration | SuperUserTechAdmin | Allows setting up ingestion API parameters for external data sources feeding data into PICASso. |

### Personal Workspace & Reports

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `MY_RELEASES` | My Releases | All product roles, Superuser | Grants access to the "My Releases" section on the home page, listing releases where the user holds a role. Primary landing widget for product-facing roles. |
| `MY_TASKS` | My Tasks | All product roles, LOB Security Leader, BU Security Officer, Superuser, DOC Lead, Senior BVP, Privacy Reviewer, CISO, Global | Grants access to the "My Tasks" section listing pending action items and review tasks assigned to the user across all releases. |
| `MY_PRODUCTS` | My Products | Product Admin Creation/Modification, Product Team, LOB Security Leader, BU Security Officer, Privacy Reviewer, SVP LOB, Senior BVP, Viewer, Superuser | Grants access to the "My Products" section listing products the user is assigned to. Available to roles that support multi-product oversight. |
| `REPORTS_DASHBOARDS` | Reports & Dashboards | Product  Team, LOB Security Leader, BU Security Officer, SVP LOB, CISO, Privacy Reviewer, Global, Viewer, Superuser | Grants access to the Reports & Dashboards section for analytics, KPI views, and release status overviews. |

### Requirements Library

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `SDL_PROCESS_REQUIREMENTS_LIB_CREATE_UPDATE` | SDL Process Requirements Library Create/Update | ContentAdminSuperUser | Allows creating and modifying entries in the SDL Process Requirements Library in BackOffice. |
| `SDL_PROCESS_REQUIREMENTS_LIB_VIEW` | SDL Process Requirements Library View | ContentAdmin | Allows viewing the SDL Process Requirements Library (read-only). |
| `SDL_PROCESS_QUESTIONNAIRE_UPDATE` | SDL Process Questionnaire Update | ContentAdminSuperUser | Allows updating SDL process questionnaire templates in BackOffice (adding/editing questions and answer options). |
| `PRODUCT_QUESTIONNAIRE_UPDATE` | Product Questionnaire Update | ContentAdminSuperUser | Allows updating product-level questionnaire templates in BackOffice. |
| `PROD_REQ_QESTIONNAIRE_FILL` | Product Requirements Questionnaire Fill | Product OwnerSecurity Manager | Allows filling in the product requirements questionnaire within a release. This is the front-office counterpart — users answer the questionnaire, not manage its template. |
| `UPDATE_PROCESS_REQUIREMENTS_UPLOAD` | Update Process Requirements with the file upload | ContentAdminSuperUser | Allows bulk-updating SDL process requirements via file upload (Excel/CSV template). |
| `UPDATE_PRODUCT_REQUIREMENTS_UPLOAD` | Update Product Requirements with the file upload | ContentAdminSuperUser | Allows bulk-updating product requirements via file upload. |
| `DOWNLOAD_PROCESS_REQUIREMENT_TEMPLATE` | Download Process Requirement template | Product team, LOB Security Leader, BU Security Officer, Superuser | Allows downloading the SDL process requirements upload template file for populating before bulk upload. |
| `DOWNLOAD_PRODUCT_REQUIREMENT_TEMPLATE` | Download Product Requirement template | Product team, LOB Security Leader, BU Security Officer, Superuser | Allows downloading the product requirements upload template file. |
| `ADD_CUSTOM_REQUIREMENTS` | Add Custom Requirements | Product team, LOB Security Leader, BU Security Officer, Superuser | Controls access to custom requirement management: viewing/interacting with the '+ Custom Requirement' button, bulk uploads, and editing/removing existing custom requirements. Source: PIC-5874. |

### Scope Review

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `SCOPE_SUBMIT` | Release Scope Submit | Product team, LOB Security Leader, BU Security Officer, Superuser | Allows starting questionnaire (product and process parts), editing requirements status, submitting the scope for review, and questionnaire editing. |
| `SCOPE_CONFIRM` | Release Scope Confirm | Security AdvisorBU Security OfficerLOB Security Leader Superuser | Allows submitting a release for Scope Approval after the scope review is complete. |
| `SCOPEREVIEW_LEVEL1` | Scope Review Level 1 – Security Advisor Level | Security AdvisorDelegate Security Advisor | Allows reviewing and acting on the release scope at Security Advisor level (first tier in scope review routing). |
| `SCOPEREVIEW_LEVEL2` | Scope Review Level 2 – LOB Security Leader Level | LOB Security LeaderDelegate LOB Security Leader | Allows reviewing and acting on the release scope at LOB Security Leader level (second tier). |
| `SCOPEREVIEW_LEVEL3` | Scope Review Level 2 – BU Security Officer Level | BU Security OfficerDelegate BU Security Officer | Allows reviewing and acting on the release scope at BU Security Officer level (third tier — note label says "Level 2" but routes as Level 3). |
| `VIEW_SCOPEREVIEWCONFIRMTAB` | View Scope Review & Confirm tab | Product OwnerSecurity ManagerSecurity AdvisorProcess Quality LeaderCISOLOB Security LeaderSVP LOBBU Security OfficerPrivacy AdvisorGlobalSuperUser | Allows viewing the Scope Review & Confirm tab in a release even without the ability to take action on it. Source: PIC-5307. |
| `MANAGE_SCOPEREVIEW PARTICIPANT` | Add Scope Review Participant | Security AdvisorLOB Security LeaderBU Security OfficerPrivacy AdvisorGlobalSuperUser | Allows adding scope review participants on the review&confirm tab. |
| `MANAGE_KEYDECISIONTOPIC` | Add Key Decision topic | Security AdvisorLOB Security LeaderBU Security OfficerPrivacy AdvisorGlobalSuperUser | Allows adding key decision topics on the review&confirm tab. Source: PIC-5307. |
| `MANAGE_SCOPEREVIEWDECISION` | Add Scope Review Decision | Security AdvisorLOB Security LeaderBU Security OfficerPrivacy AdvisorGlobalSuperUser | Allows providing scope review decision on the review&confirm tab. Source: PIC-5307. |
| `MANAGE_SCOPEREVIEWACTION` | Add Scope Review Action | Product OwnerSecurity ManagerSecurity AdvisorLOB Security LeaderBU Security OfficerGlobalSuperUser | Allows adding action items arising on the review&confirm tab. Source: PIC-5307. |

### CyberSecurity Residual Risk (CSRR)

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `CSRR_SDL_PROCESS_SUMMARY_UPDATE` | CSRR SDL Process Summary Update | Product OwnerSecurity ManagerSecurity Advisor | Allows editing the SDL Process Summary section of the CSRR. |
| `CSRR_PRODUCT_REQ_SUMMARY_UPDATE` | CSRR Product Requirement Summary Update | Product OwnerSecurity Manager | Allows editing the Product Requirements Summary section of the CSRR. |
| `CSRR_SYSTEM_DESIGN` | CSRR System Design | Product OwnerSecurity Manager | Allows updating the System Design section of the CSRR (architecture diagrams, design decisions). |
| `CSRR_STATIC_CODE_ANALYSIS_UPDATE` | CSRR Static Code Analysis Update | Product OwnerSecurity Manager | Allows updating the Static Code Analysis section of the CSRR with tool results and findings. |
| `CSRR_FOSSCHECK_UPDATE` | CSRR FOSS Check Update | Product OwnerSecurity Manager | Allows updating the Free and Open Source Software (FOSS) Check section of the CSRR. |
| `CSRR_THREAT_MODEL` | CSRR Threat Model Update | Product OwnerSecurity ManagerSecurity Advisor | Allows updating the Threat Model section of the CSRR (threat identification and mitigations). |
| `CSRR_THIRD_PARTY_SUPPLIERS_UPDATE` | CSRR Third Party Suppliers Update | Product OwnerSecurity Manager | Allows updating the Third Party Suppliers section of the CSRR (supplier risk and component provenance). |
| `CSRR_SECURITYDEFECTS_UPDATE` | CSRR Security Defects Update | Product OwnerSecurity Manager | Allows updating the Security Defects section of the CSRR with open vulnerability counts and status. |
| `CSRR_SOFTWARE_COMPOSITION` | CSRR Software Composition Analysis Update | Product OwnerSecurity Manager | Allows updating the Software Composition Analysis (SCA) section of the CSRR. |
| `FCSR_DECISION_UPDATE` | FCSR Decision Update | Product OwnerSecurity Manager | Allows editing the FCSR decision fields including risk acceptance recommendation and supporting notes. |

### Final Certification & Security Review (FCSR)

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `FCSRREADINESSREVIEW` | FCSR Readiness Review | Security Advisor, PQL, Superuser | Allows editing process and product requirements, cybersecurity residual risks, and FCSR decision tabs; also allows sending the FCSR back to rework before formal submission. |
| `FCSREVIEW_LEVEL1` | FCSR Review Level 1 – Security Advisor Level | Security AdvisorDelegate Security Advisor | Allows editing the FCSR Decision tab at Security Advisor level (applies when the risk level is insignificant according to the routing logic). First tier in the approval chain. |
| `FCSREVIEW_LEVEL2` | FCSR Review Level 2 | LOB Security LeaderDelegate LOB Security Leader | Allows editing the FCSR Decision tab at LOB Security Leader level (applies when the risk level is insignificant). |
| `FCSREVIEW_LEVEL3` | FCSR Review Level 3 | BU Security OfficerDelegate BU Security Officer | Allows editing the FCSR Decision tab at BU Security Officer level (applies when the risk level is initial), including exception handling and escalation. |
| `FCSREVIEW_LEVEL4` | FCSR Review 4 | SVP LOBDelegate SVP LOB | Allows editing the FCSR Decision and approving it when escalated to CISO or SVP LOB tier. |
| `FCSREVIEW_CISO` | FCSR Review CISO | CISODelegate CISODeputy CISO | When the FCSR decision level is CISO: allows sending the FCSR for rework and approving it. |
| `FCSREVIEW_SVPLOB` | FCSR Review SVP LOB | SVP LOB | When the FCSR decision level is SVP LOB: allows sending the FCSR for rework and approving it. |
| `FCSR_APPROVE` | FCSR Approve | Security AdvisorBU Security OfficerLOB Security Leader | Allows approving or rejecting the FCSR at the designated governance tier. Approval moves the release to the next stage or completes the FCSR process. |
| `FCSR_APPROVE_DELEGATE` | FCSR Approval Delegate | Delegate Security AdvisorDelegated BU Security Officer | Allows a delegated user to perform FCSR approval actions on behalf of the principal role holder. |
| `FCSR_EXCEPT_APPROVE` | FCSR Exception Approve | CISO, SVP LOB, Global, Superuser | Allows approving an FCSR exception request — when a release does not fully meet standard criteria and requires a formal exception decision. |
| `FINAL_APPROVAL` | Final Approval | Security Advisor, LOB Security Leader, BU Security Officer, Superuser | Allows performing the final acceptance/sign-off on a release after FCSR approval. Used in releases that include a Post FCSR Actions stage. |
| `FINALAPPROVAL_STAGERELEASE` | Final Approval Release Stage | Security Advisor, LOB Security Leader, BU Security Officer, Superuser | Grants access to the Final Approval stage in the release workflow, allowing the user to see and interact with this stage. |
| `ACTIONSCLOSURE` | Actions Closure Release Stage | Product OwnerSecurity ManagerSecurity Advisor | Allows marking the Actions Closure stage as complete on a release, confirming all post-FCSR action items are resolved. |
| `CISO_PROVIDE_RISK_ACCEPTANCE_DECISION` | Provide Risk Acceptance Decision by CISO | CISO | Allows the CISO to provide a risk acceptance decision on a release FCSR. Source: PIC-8807 (upcoming). |
| `SVP_PROVIDE_RISK_ACCEPTANCE_DECISION` | Provide Risk Acceptance Decision by SVP | SVP LOB | Allows the SVP LOB to provide a risk acceptance decision on a release FCSR. Source: PIC-8807 (upcoming). |

### Data Privacy

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `VIEW_DATAPRIVACY_TAB` | View Data Privacy Review tab | Product Owner, Security Manager, Security Advisor, | Allows viewing the Data Protection and Privacy Review tab in a release (read-only access to the tab itself). |
| `VIEW_DATAPRIVACY_SUMMARY` | View Data Privacy Summary | Privacy AdvisorPrivacy ReviewerGovernance roles | Allows viewing the Data Protection and Privacy Summary section on the Product Details page. |
| `EDIT_DATAPRIVACY_SUMMARY` | Edit Data Privacy Summary | Privacy AdvisorSecurity Advisor | Allows editing the Data Protection and Privacy Summary tab. |
| `VIEW_PRIVACY_RISK` | View Privacy Risk | Privacy AdvisorPrivacy ReviewerProduct Owner | Allows viewing Data Protection and Privacy Risk in a release. |
| `EDIT_PRIVACY_RISK` | Edit Privacy Risk | Dedicated Privacy Advisor, Security and Data Protection Advisor | Allows editing Data Protection and Privacy Risk field on the Review and Confirm stage. |
| `ANSWER_PRIVACY_QUESTIONNAIRE` | Answer Privacy Questionnaire | Product OwnerSecurity Manager | Allows filling in the privacy questionnaire within a release on behalf of the product team. |
| `ADD_EVIDENCES_PRIVACYSECTION` | Add Evidences for the Privacy Section | Product OwnerSecurity ManagerPrivacy Advisor | Allows adding evidence and links to supporting documents in the Evidence Collection on DPP Review tab. |
| `ADD_CLARIFICATION_PRIVACYSECTION` | Add clarification for the Privacy Section | Product OwnerSecurity ManagerPrivacy Advisor | Allows adding information for the field "Offer Owner's Reply" for the Privacy Section on the Data Privacy Review tab within the SDL/FCSR review process |
| `UPDATE_ACTIONS_PRIVACYSECTION` | Update actions for the Privacy Section | Privacy AdvisorProduct Owner | Allows creating and updating action items within the privacy section to track required remediation work. |
| `EDIT_MATURITYLEVEL_PRIVACYSECTION` | Edit Maturity level for the Privacy Section | Privacy Advisor | Allows editing the Maturity Level for the Privacy Section on the Data Privacy Review tab within the SDL/FCSR review process |
| `EVALUATE_REQUIREMENTS_PRIVACYSECTION` | Evaluate requirements for the Privacy Sections | Privacy ReviewerPrivacy Advisor | Allows updating the evaluation status for requirements on the Data Privacy Review tab within the SDL/FCSR review process |
| `RATE_ANSWERS_PRIVACYQUEST` | Rate answers of the Privacy Questionnaire | Privacy ReviewerDelegated Privacy Reviewer | Allows updating the rating for answers on the Privacy Questionnaire on the Data Privacy Review tab within the SDL/FCSR review process |
| `RATE_EVIDENCES_PRIVACYSECTION` | Rate evidences provided for the Privacy Section | Privacy ReviewerDelegated Privacy Reviewer | Allows the Privacy Reviewer to rate evidence items in Evidence Collection in privacy sections of DPP Review tab. |
| `ADD_PRIVACYREVIEW_FEEDBACK` | Provide Privacy Review Feedback | Privacy ReviewerDelegated Privacy Reviewer | Allows the Privacy Reviewer to provide feedback on the Feedback tab in privacy sections. |
| `ADD_PRIVACYREVIEW_FEEDBACK_REPLY` | Add Privacy Review Feedback Reply | Product OwnerSecurity ManagerPrivacy Advisor | Allows the product owner or security manager to reply to Privacy Reviewer feedback comments, creating a feedback thread. |
| `UPDATE_RESIDUALRISKS_PRIVACYSECTIONS` | Update Residual Risks for the Privacy Sections | Privacy Advisor, Privacy Reviewer, Superuser | Allows managing Residual Risks for the Privacy Section on the Data Privacy Review tab within the SDL/FCSR review process |
| `CONFIRM_PRIVACY_READINESSSIGNOFF` | Security and Privacy Readiness Sign Off | Security AdvisorPrivacy Advisor | Allows confirming the sign-off for the FCSR review after the FCSR Readiness and Data Privacy Review was completed |
| `VIEW_DATAPRIVACYSUMMARY` | View Data Privacy Summary in FCSR Decision | Security AdvisorBU Security OfficerGovernance roles | Allows to view the Data Privacy Summary on the FCSR Decision tab of the SDL/FCSR review process |
| `ADD_PCCDECISION` | PCC Decision | Privacy Reviewer, LOB Security Leader, BU Security Officer, CISO, Superuser | Allows providing the PCC (Privacy Compliance Comittee Decision on the FCSR Decision tab of the SDL/FCSR review process |
| `UPDATE_PRIVACYRISK_LIB` | Privacy Risk Management | ContentAdminSuperUser | Allows managing the Privacy Risk library in BackOffice (adding/editing risk categories, templates, and descriptions). |
| `UPDATE_NOTAPPLICABLE_PRIVACYSECTION` | Update Not Applicable for the Privacy Section | Privacy AdvisorProduct Owner | Allows marking a privacy section as Not Applicable with a justification. |

### DOC – View Access

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `VIEW_DOC` | View DOC | By org scope | View DOCs on the "My DOCs" tab |
| `VIEW_LINKED_RELEASE_INFO` | View the linked release info | By org scope | Allows viewing the SDL release linked to a DOC — not restricted by VESTA ID, so governance roles can see across all offers. |
| `VIEW_IT_SECURITY_SUMMARY` | View IT Security Summary | By org scope | Allows viewing the IT Security Summary section of a DOC. |
| `VIEW_DOC_REPORTS` | View DOC reports | By org scope | Allows viewing DOC reporting dashboards. Scope limited by org, not VESTA ID. |
| `VIEW_ALL_DOCS` | View all DOCs on the tab "My Docs" | Global | Allows seeing all DOCs in the "My Docs" tab, including DOCs for products the user is not directly linked to. |

### DOC – Lifecycle Operations

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `CREATE_DIGITAL_OFFER_CERTIFICATION` | Create Digital Offer Certification | By org scope | Allows requesting a new DOC. |
| `INITIATE_DIGITAL_OFFER_CERTIFICATION` | Initiate Digital Offer Certification | By org scope | Allows formally initiating (starting) a DOC, moving it from draft to active certification process. |
| `CANCEL_DIGITAL_OFFER_CERTIFICATION` | Cancel Digital Offer Certification | By org scope | Allows cancelling an active DOC (org-level governance action, not limited by VESTA ID). |
| `CANCEL_DIGITAL_OFFER_CERTIFICATION_REQUEST` | Cancel Digital Offer Certification Request | Limited by VESTA ID | Allows the product team to request cancellation of their own DOC (limited by VESTA ID — only for linked offers). |
| `REVOKE_DOC` | Revoke DOC | By org scope | Allows revoking a previously certified DOC, returning it to an uncertified state. |
| `COMPLETE_DOC` | Complete DOC | By org scope | Allows marking a DOC as complete at the end of the workflow. |
| `SEND_FOR_REWORK` | Send DOC for Rework | By org scope | Allows sending a DOC back to the product team (DO team) for rework when submitted evidence or data is insufficient. |
| `SUBMIT_FOR_ACTIONS_CLOSURE` | Submit for Actions Closure | By org scope | Allows submitting a DOC to the Actions Closure stage, confirming outstanding findings are resolved. |
| `SUBMIT_FOR_APPROVAL` | Submit for Approval | By org scope | Allows submitting a DOC for governance approval by BVP/BUSO or higher. |
| `SUBMIT_DOC_REVIEW_RISK_SUMMARY` | Submit DOC to Review Risk Summary | By org scope | Allows submitting a DOC to the Risk Summary Review stage. |
| `SUBMIT_DOC_ISSUE_CERTIFICATION` | Submit DOC for Issue Certification | By org scope | Allows submitting a DOC for Issue Certification stage (the final certification decision stage). |

### DOC – Editing

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `CREATE_UPDATE_DOC_BACKOFFICE` | Configure the BackOffice for the DOC | SuperUserContentAdmin | Allows configuring DOC-specific BackOffice settings including stages, control templates, and certification parameters. |
| `EDIT_DOC_DETAILS` | Edit Digital Offer Certification Details | Limited by VESTA ID | Allows editing DOC detail fields (DOC name, Link to related documents, etc.). |
| `EDIT_INITIATED_DOC_DETAILS` | Edit DOC Details from ITS Scope Controls stage | By org scope | Allows editing DOC details starting from the Scope ITS Controls stage onward, when the DOC Lead needs to make adjustments post-initiation. |
| `EDIT_USERS_ROLES_DOC` | Edit assigned DOC users | By org scope | Allows editing DOC role assignments on the Roles&Responsibilities tab (BU Security Officer, CISO, DOCL, DRL, BVP, Senior BVP). |
| `ADD_DOC_APPROVER` | Add DOC Approver | By org scope | Allows adding an approver to the DOC approval chain for governance sign-off. |
| `ENTER_DATA_PRIVACY_REVIEW_SDL_FCSR_SUMMARYDATA` | Enter Data Privacy Review and SDL/FCSR summary data | Limited by VESTA ID | Allows filling in the DPP Review and SDL/FCSR summary sections within a DOC, typically completed by the product team during data entry stages. |
| `CREATE_UPDATE_DOC_ACTIONS` | Create/update DOC Actions | Limited by VESTA ID | Allows creating and updating action items within a DOC. |

### DOC – IT Security Controls

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `SCOPE_IT_SECURITY_CONTROLS` | Scope the IT Security Controls | By org scope | Allows the DOC Lead to define which IT security controls are in scope for this particular offer. |
| `PROVIDE_CONTROL_EVIDENCE_COMMENTS` | Provide evidence/comments for controls | Limited by VESTA ID | Allows the DO team to upload evidence and add comments for each in-scope IT security control. |
| `SUBMIT_CONTROL_FOR_REVIEW` | DO TEAM to submit the control for review by DOCL | Limited by VESTA ID | Allows the DO team to submit a control for review by the DOC Lead. |
| `PROVIDE_CONTROL_COMMENT` | Provide comments for controls by DOCL | By org scope | Allows the DOC Lead to provide comments on a control in Under Review status. |
| `SEND_CONTROL_BACK_FOR_UPDATE` | DOCL to send back control to DO team | By org scope | Allows the DOC Lead to return a control to the DO team for updates when evidence is insufficient. |
| `MARK_CONTROL_NOT_APPLICABLE` | DOCL to mark control as not applicable | By org scope | Allows the DOC Lead to mark a control as not applicable for this specific offer with justification. |
| `COMPLETE_RISK_ASSESSMENT` | DOCL to complete risk assessment for the control | By org scope | Allows the DOC Lead to finalise the risk assessment for a control after reviewing all evidence. |
| `CREATE_UPDATE_FINDINGS` | Create/Update Findings | By org scope | Allows creating and updating security findings raised during IT security control review. |
| `EVALUATE_ITS_CONTROLS_RISKS` | Evaluate ITS Controls Risks | By org scope | Allows evaluating and rating the risks associated with each IT security control. |
| `EDIT_IT_SECURITY_SUMMARY` | Edit IT Security Summary | By org scope | Allows editing the IT Security Summary section of a DOC after controls have been assessed. |
| `SPECIFY_UPDATE_DOC_DECISION` | Specify and update DOC Decision | By org scope | Allows specifying the DOC decision outcome (Certified / Certified with Exception / Waiver required) and updating it as the review progresses. |

### DOC – Acceptance & Waivers

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `ACCEPT_DOC_CERTIFIED` | Accept or reject DOC Decision Certified | By org scope | Allows accepting or rejecting a standard DOC certification decision. |
| `BVP_ACCEPT_DOC_WITH_EXCEPTION` | BVP – Accept/reject DOC Certified with Exception | By org scope | Allows the Business Vice President to accept or reject a DOC certified with exception. |
| `BUSO_ACCEPT_DOC_WITH_EXCEPTION` | BU Security Officer – Accept/reject DOC Certified with Exception | By org scope | Allows the BU Security Officer to accept or reject a DOC certified with exception. |
| `BUSO_ACCEPT_DOC_WAIVER` | BU Security Officer – Accept/reject DOC Decision Waiver | By org scope | Allows the BU Security Officer to accept or reject a DOC waiver decision. |
| `CISO_ACCEPT_DOC_WAIVER` | CISO – Accept/reject DOC Decision Waiver | Global | Allows the CISO to accept or reject a DOC waiver decision at global level. |
| `CPSO_ACCEPT_DOC_WAIVER` | CPSO – Accept/reject DOC Decision Waiver | Global | Allows the CPSO to accept or reject a DOC waiver decision. |
| `SVP_ACCEPT_DOC_WAIVER` | Senior BVP – Accept/reject DOC Decision Waiver | By org scope | Allows the Senior Business Vice President to accept or reject a DOC waiver decision. |

### Release Notes

| Code | Name | Typical Roles | Description |
|------|------|--------------|-------------|
| `VIEW_RELEASE_NOTES_CONFIGURATION` | View Release Notes Configuration | ContentAdminSuperUser | Allows viewing the Release Notes Configuration sub-section in BackOffice and its current content settings. |
| `UPDATE_RELEASE_NOTES_CONFIGURATION` | Update Release Notes Configuration | ContentAdminSuperUser | Allows editing existing release notes items, creating new entries, managing source links, and activating/deactivating items in the configuration. |

---

## Test Usage Notes

### Choosing a role for a test

1. **BackOffice tests** — use `TechAdmin` or `SuperUser`; assert `ContentAdmin` and `UserAdmin` see only their sections; `Viewer` must not see the BackOffice tab at all (no `BACKOFFICE_ACCESS`).
2. **Product creation** — use `ProductAdmin`; negative tests use `Viewer` or roles without `PRODUCT_CREATE`.
3. **Release management** — `Product Owner` + `Security Manager` for the standard flow; `SuperUser` for override actions.
4. **Scope review** — `Product Owner` submits (`SCOPE_SUBMIT`); level reviewers need `SCOPEREVIEW_LEVEL1/2/3` (LOB Security Leader / BU Security Officer / CISO respectively).
5. **FCSR flow** — each `FCSREVIEW_LEVEL1-4` maps to a governance role; `FINAL_APPROVAL` requires `SuperUser` or `Global`.
6. **DOC operations** — `DOC Lead` initiates; `BVP` or `CISO` accepts; `BUSO`/`CPSO`/`SVP` can accept with waiver.
7. **Data Privacy** — `Privacy Advisor` answers questionnaire; `Privacy Reviewer` rates; `CISO`/`SuperUser` provide PCC decisions.
8. **Maintenance Mode** — `SuperUser` or `TechAdmin` can edit (`EDIT_MAINTENANCE_MODE`); `SYSTEM_ACCESS_DURING_MAINTENANCE` gates all access during downtime.
9. **API / Integration config** — `SuperUser` or `TechAdmin` only.
10. **Viewer access tests** — `Viewer Global` should see products/releases read-only; negative-assert on all `EDIT_*` and create/action privileges.

### Negative test patterns

- Role missing `BACKOFFICE_ACCESS` → BackOffice tab must not appear.
- Role with `BACKOFFICE_ACCESS` but without section privilege (e.g., `MANAGE_REF_DATA`) → tab visible, but clicking produces an access error.
- `Viewer` roles → all read assertions pass, all write/action assertions fail.
- `SYSTEM_ACCESS_DURING_MAINTENANCE` absent → user is redirected to the maintenance page (all roles except SuperUser/TechAdmin).
- DOC waiver acceptance (`BUSO_ACCEPT_DOC_WAIVER`, `CISO_ACCEPT_DOC_WAIVER`, etc.) → only the specific acceptance-role can confirm; others must be blocked.
