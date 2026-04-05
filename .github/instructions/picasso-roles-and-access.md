# PICASso Roles, Access & Privileges Reference

Combined reference for writing user stories, test cases, UAT scenarios, and automation scripts with correct role names, privilege codes, and access-based test scenarios.

**Sources:** Confluence 2.4 Role Management (page 450758702), Confluence 1.3.2.2 Roles & Responsibilities (page 450757896), BackOffice `/GRC_BackOffice/GRCRoles` and `/GRC_BackOffice/AccessPrivileges` (QA env, 2026-03-30), `input/Privileges-2.xlsx` (151 base) + Confluence Appendix 3 + JIRA privilege stories — **78 roles, 157 privileges across 15 functional groups**.

---

## Role Categories

| Category | Who assigns | Visible outside admin? | Purpose |
|----------|-------------|------------------------|---------|
| **Development** | Product owners / admins | Yes | Product development SDL process |
| **Governance** | Tool administrators, senior governance | Yes | Reporting, approvals, oversight |
| **Administrative** | Tool administrators only | No (admin-only) | BackOffice management |

---

## Development Roles (Product-Scoped)

| Role Code | Display Name | Notes |
|-----------|-------------|-------|
| `PRODUCTOWNER` | Product Owner | Primary actor for most release operations |
| `SECURITYMANAGER` | Security Manager | Assists Product Owner; similar but secondary access |
| `SECURITYADVISOR` | Security and Data Protection Advisor | Also called "SDPA" or "Security Advisor" informally; approves FCSRs |
| `PROCESSQUALITYLEADER` | Process Quality Leader | Also called "PQL"; reviews SDPA&PQL Sign Off stage |
| `PRIVACYADVISOR` | Dedicated Privacy Advisor | Reviews DPP sections in releases |
| `ITOWNER` | IT Owner | DOC (Digital Offer Certification) section owner |
| `PROJECTMANAGER` | Project Manager | DOC section role; fills project manager field |
| `SECURITYOPERATIONASSISTANT` | Security operation Assistant | Product-level security ops helper |
| `VIEWERPRODUCT` | Viewer Product | Read-only access to a specific product |
| `PODELEGATE` | Product Owner Delegate | Older delegate pattern |

**Delegate variants** (same access as principal, granted by delegation):

| Role Code | Display Name |
|-----------|-------------|
| `DELEGATEPRODUCTOWNER` | Delegated Product Owner |
| `DELEGATESECURITYADVISOR` | Delegated Security Advisor |
| `DELEGATESECURITYMANAGER` | Delegate Security Manager |
| `DELEGATEPROCESSQUALITYLEADER` | Delegate Process Quality Leader |
| `DELEGATEPRIVACYADVISOR` | Delegate Privacy Advisor |
| `DELEGATE_IT_OWNER` | Delegate IT Owner |
| `DELEGATE_PROJECT_MANAGER` | Delegate Project Manager |

---

## Governance Roles (Organizational)

### Global-Scope Governance

| Role Code | Display Name | Responsibility |
|-----------|-------------|----------------|
| `CISO` | CISO | Reviews releases when escalated to CISO level |
| `DELEGATECISO` | Delegate CISO | Delegates CISO review responsibilities |
| `DEPUTYCISO` | Deputy CISO | Deputy for CISO approval workflows |
| `DEPUTYCPSO` | Deputy CPSO | Deputy for CPSO approval workflows |
| `CPSO` | CPSO | Central Product Security Officer |
| `Delegate CPSO` | Delegate CPSO | Delegates CPSO responsibilities |
| `DATA_EXTRACTION_API_USER` | Data Extraction API User | API-only access for data extraction |

### Org Level 1 Governance (Business Unit level)

| Role Code | Display Name | Responsibility |
|-----------|-------------|----------------|
| `BUSECURITYOFFICER` | BU Security Officer | Approves release scope and FCSRs at BU level |
| `DELEGATEDBUSECURITYOFFICER` | Delegated BU Security Officer | Delegates BU Security Officer tasks |
| `PRIVACYREVIEWER` | Privacy Reviewer | Reviews DPP in releases |
| `DELEGATEDPRIVACYREVIEWER` | Delegated Privacy Reviewer | Delegates Privacy Reviewer tasks |
| `DIGITALRISKLEAD` | Digital Risk Lead | Digital risk oversight at BU level |
| `DELEGATE_DIGITALRISKLEAD` | Delegate Digital Risk Lead | Delegates Digital Risk Lead tasks |
| `SENIORBUSINESSVP` | Senior Business Vice President (Senior BVP) | Senior BVP oversight at BU level |
| `DELEGATE_SENIORBUSINESSVP` | Delegate Senior BVP | Delegates Senior BVP responsibilities |
| `GLOBALORG1` | Global ORG1 | Global org-level-1 access |
| `PRODUCTADMINORG1` | Product Admin Org 1 Creation | Can create products under specific BU |
| `PRODUCT_ADMIN_ORG1_MODIFICATION` | Product Admin Org 1 Modification | Can edit products under specific BU |
| `DELEGATEDPRODUCTADMINORG1` | Delegate Product Admin Org 1 | Delegates Org 1 product admin |
| `DELEGATE_PRODUCT_ADMIN_ORG1_CREATION` | Delegate Product Admin Org 1 Creation | Delegates Org 1 creation rights |
| `DELEGATE_PRODUCT_ADMIN_ORG1_MODIFICATION` | Delegate Product Admin Org 1 Modification | Delegates Org 1 modification rights |

### Org Level 2 Governance (Line of Business level)

| Role Code | Display Name | Responsibility |
|-----------|-------------|----------------|
| `LOBSECURITYLEADER` | LOB Security Leader | Approves LOB-level release scope and FCSRs |
| `DELEGATEDLOBSECURITYLEADER` | Delegate Security Leader | Delegates LOB Security Leader tasks |
| `SVPLOB` | SVP LOB | Senior VP LOB; accountable for FCSR review when BU escalates |
| `DELEGATESVPLOB` | Delegate SVP LOB Org2 | Delegates SVP LOB responsibilities |
| `BUSINESSVP` | Business Vice President (BVP) | BVP oversight at LOB level |
| `DELEGATE_BUSINESSVP` | Delegate Business Vice President (BVP) | Delegates BVP responsibilities |
| `DIGITALOFFERCERTIFICATIONLEAD` | Digital Offer Certification Lead | Leads DOC certification process at LOB level |
| `DELEGATE_DIGITALOFFERCERTIFICATIONLEAD` | Delegate Digital Offer Certification Lead | Delegates DOC certification lead |
| `PRODUCTADMINORG2` | Product Admin Org 2 Creation | Can create products under specific LOB |
| `PRODUCT_ADMIN_ORG2_MODIFICATION` | Product Admin Org 2 Modification | Can edit products under specific LOB |
| `DELEGATEDPRODUCTADMINORG2` | Delegate Product Admin Org 2 | Delegates Org 2 product admin |
| `DELEGATE_PRODUCT_ADMIN_ORG2_CREATION` | Delegate Product Admin Org 2 Creation | Delegates Org 2 creation rights |
| `DELEGATE_PRODUCT_ADMIN_ORG2_MODIFICATION` | Delegate Product Admin Org 2 Modification | Delegates Org 2 modification rights |
| `VIEWERORG2` | Viewer Org 2 | Read-only access at LOB level |

### Org Level 3 Governance (Entity level)

| Role Code | Display Name | Responsibility |
|-----------|-------------|----------------|
| `LOBSECURITYLEADER_ORG3` | LOB Security Leader | LOB Security Leader at Entity level |
| `DELEGATELOBSECURITYLEADER_ORG3` | Delegate LOB Security Leader Org3 | Delegates LOB Security Leader at Entity |
| `SVPLOB_ORG3` | SVP LOB | SVP LOB at Entity level |
| `DELEGATESVPLOB_ORG3` | Delegate SVP LOB ORG3 | Delegates SVP LOB at Entity level |
| `PRODUCTADMINORG3` | Product Admin Org 3 Creation | Can create products under specific Entity |
| `PRODUCT_ADMIN_ORG3_MODIFICATION` | Product Admin Org 3 Modification | Can edit products under specific Entity |
| `DELEGATEDPRODUCTADMINORG3` | Delegate Product Admin Org 3 | Delegates Org 3 product admin |
| `DELEGATE_PRODUCT_ADMIN_ORG3_CREATION` | Delegate Product Admin Org 3 Creation | Delegates Org 3 creation rights |
| `DELEGATE_PRODUCT_ADMIN_ORG3_MODIFICATION` | Delegate Product Admin Org 3 Modification | Delegates Org 3 modification rights |
| `DELEGATE_PRODUCT_ADMIN_PRD_MODIFICATION` | Delegate Product Admin Product Modification | Delegates product modification at Product scope |
| `PRODUCT_ADMIN_PRD_MODIFICATION` | Product Admin Product Modification | Edits products created by Product Admin Creation roles |
| `ORG3` | Organ level 3 | General Org Level 3 governance access |

---

## Administrative Roles (BackOffice only)

| Role Code | Display Name | Capabilities |
|-----------|-------------|--------------|
| `SUPERUSER` | SuperUser | Can perform any task; add other superusers; promote users to any role |
| `CONTENTADMIN` | Content Admin | Questionnaire Create/Update; Product Requirements Library Create/Update; SDL Process Requirements Library Create/Update |
| `TECHADMIN` | Tech Admin | Create and update reference data |
| `PRODUCTADMIN` | Product Admin | Global: create new product within any BU; assign standard user as product owner |
| `USERADMIN` | User Admin | Create/delete standard users; manage users' roles |
| `CPSO` | CPSO | Central Product Security Officer (also appears in Governance context) |
| `VIEWERGLOBAL` | Viewer Global | Read-only access to all products and releases globally |
| `GLOBAL` | Global | Global administrative access |

---

## Capabilities Summary by Key Role

| Role | Can do | Cannot do |
|------|--------|-----------|
| **Product Owner** | Create releases, submit questionnaire, update requirements, fill CSRR, provide FCSR recommendation, work on action items | Approve FCSRs, approve scope at BU/LOB level |
| **Security Manager** | Everything Product Owner can do + access My Products list | Same governance restrictions as Product Owner |
| **Security and Data Protection Advisor (SDPA)** | Review release scope, perform tasks on SDPA&PQL Sign Off, approve FCSRs, final acceptance | Cannot create releases |
| **Process Quality Leader (PQL)** | Review release during SDPA&PQL Sign Off stage | No release creation or FCSR approval |
| **Dedicated Privacy Advisor** | Review DPP in releases where DPP is applicable with High or Extreme risk | Outside DPP scope |
| **Privacy Reviewer** | Review DPP sections, provide Privacy Review feedback | No non-DPP access |
| **BU Security Officer** | Approve release scope and FCSRs per routing logic at BU level | Below BU-level scope decisions |
| **LOB Security Leader** | Approve LOB-level release scope and FCSRs per routing logic | Below LOB-level scope decisions |
| **SVP LOB** | Accountable for FCSR review when BU Security Leader escalates | Regular release operations |
| **CISO** | Review releases when escalated to CISO level | Below-CISO scope decisions |
| **IT Owner** | Fill IT Owner field in DOC section; DOC-specific tasks | Non-DOC features |
| **User Admin** | Create/delete standard users; assign and manage user roles | Product/release operations |
| **Viewer Global / Viewer Org 2 / Viewer Product** | Read-only access at their scope level | Edit anything |

---

## SDL Roles in Releases (Roles & Responsibilities Tab)

### SDL Roles (auto-populated from BackOffice)
- Product Owner / Product Manager, Security Advisor, Security Manager / Project Manager / Scrum Master, Process Quality Leader, Privacy Advisor, Privacy Reviewer, ORG 1 Security Officer, ORG 2 Security Lead, ORG 2 SVP, CISO

### Product Team (filled manually — NO system access)
These users do **not** have PICASso system access — recorded for informational purposes only. **Never write test cases or automation scripts that log in as these roles:**
- Architect, Developer, V&V Tester, PEN Tester, Tech Writer, Build Manager, Vulnerability Handler / PCERT Leader

---

## User Story Phrasing Guide

### Development role stories

| Role | Recommended phrasing |
|------|---------------------|
| Product Owner | `As a Product Owner with access to manage the release,` |
| Security Manager | `As a Security Manager assigned to the product,` |
| Security and Data Protection Advisor | `As a Security and Data Protection Advisor (SDPA) assigned to the product,` |
| Process Quality Leader | `As a Process Quality Leader (PQL) assigned to the product,` |
| Dedicated Privacy Advisor | `As a Dedicated Privacy Advisor assigned to the product,` |
| IT Owner | `As an IT Owner assigned to the product,` |
| Project Manager (DOC) | `As a Project Manager assigned to the product,` |
| Viewer Product | `As a user with Viewer Product access to the product,` |

### Governance role stories

| Role | Recommended phrasing |
|------|---------------------|
| BU Security Officer | `As a BU Security Officer responsible for the Business Unit,` |
| LOB Security Leader | `As a LOB Security Leader responsible for the Line of Business,` |
| SVP LOB | `As an SVP LOB for the Line of Business,` |
| CISO | `As a CISO responsible for global release oversight,` |
| Privacy Reviewer | `As a Privacy Reviewer assigned at the BU level,` |
| Digital Offer Certification Lead | `As a Digital Offer Certification Lead,` |

### Admin role stories

| Role | Recommended phrasing |
|------|---------------------|
| User Admin | `As a User Administrator with access to BackOffice User Management,` |
| Content Admin | `As a Content Administrator with access to questionnaire and requirements management,` |
| Viewer Global | `As a user with Viewer Global access,` |

---

## Access-Based Test Scenario Triggers

When an AC involves a **restricted action**, always include these test scenarios:

| If AC says... | Also test... |
|---------------|-------------|
| "Product Owner can [action]" | Security Manager (should also work), Viewer Product (should be read-only or blocked) |
| "Security Advisor approves..." | Product Owner (should NOT be able to approve), Security Manager (should NOT approve) |
| "Only BU Security Officer can approve scope at BU level" | Product Owner (blocked), LOB Security Leader (may depend on routing) |
| "User Admin can create/manage users" | Product Owner (no BackOffice access), Content Admin (no user management) |
| Feature is "read-only for Viewer" | Viewer Global / Viewer Product (cannot edit), Product Owner (can edit) |
| DOC field is filled by IT Owner | Security Manager (can also fill), Product Owner (check if allowed), Viewer (blocked) |
| FCSR approval | Only Security Advisor and governance roles (BU Security Officer, LOB Security Leader) |

**Negative test pattern:** For any privileged action, always test:
1. A role that **has** the privilege (happy path)
2. A role that clearly does **NOT** have the privilege (should see disabled button, access denied, or missing UI element)

---

## Spec-Defined Privileges (MANDATORY to extract)

Confluence specs often define **new privileges** in a "User Roles and Permissions" section (commonly 2.1). These override defaults.

### Pattern to look for in spec_text

```text
2.1 User Roles and Permissions
Two new privileges must be created:

PRIVILEGE_CODE    Privilege Name    Description of what it allows
PRIVILEGE_CODE_2  Privilege Name 2  Description

By default, these privileges are assigned to [Role A], [Role B].
Other Roles (e.g., [Role C], [Role D]): do NOT have this permission.
```

### How to use spec-defined privileges

| When writing... | Do this |
| --- | --- |
| **User stories** | Reference the privilege by name in `as_a` or AC as the gating condition |
| **Test cases** | Positive tests for roles with the privilege; negative tests for roles explicitly excluded |
| **Automation scripts** | Reference the exact privilege code in `automation_notes` |

---

## Privilege Reference (157 privileges across 15 groups)

**How to use:**
- **Privilege code** = exact string used in BackOffice and referenced in specs under "User Roles and Permissions".
- **Typical roles** = roles that hold this privilege by default. Spec definitions override these.
- **Scope notes** = "limited by VESTA ID" means action is restricted to products/offers the user is linked to.
- Always create one positive test (role that has the privilege) and one negative test (role that does not).

### 1. Administration & BackOffice

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `BACKOFFICE_ACCESS` | BackOffice Access | Grants visibility of the BackOffice tab. Note: this alone shows the tab but produces an access error — additional privileges needed for actual access. | SuperUser, ContentAdmin, TechAdmin, ProductAdmin, UserAdmin |
| `MANAGE_REF_DATA` | Create/Update Reference Data | Allows viewing and editing reference data tables in BackOffice (Users & Roles, Organization Settings, Product Settings, Release Settings, CSRR, Notification Config). | TechAdmin, SuperUser |
| `MANAGE_ROLES` | Manage Roles | Allows viewing and editing role definitions in BackOffice. | SuperUser |
| `MANAGE_STAGE` | Manage Stage Release | Allows editing each tab on the Manage Stage screen and submitting a release for SA/PQL review. | SuperUser, ContentAdmin |
| `API_EXTRACTION_CONFIG` | API Extraction Configuration | Allows configuring data extraction API endpoints and credentials. | SuperUser, TechAdmin |
| `API_JIRA_CONFIG` | API Credentials Configuration | Allows configuring Jira API credentials for integration sync. | SuperUser, TechAdmin |
| `DATA_INGESTION_API_CONFIG` | Data Ingestion API Configuration | Allows setting up ingestion API parameters for external data sources. | SuperUser, TechAdmin |
| `EXPORT_USERS` | Export Users | Allows exporting the user list from BackOffice. | UserAdmin, SuperUser |
| `PERFORM_MONITORING` | Performance Monitoring | Allows accessing performance monitoring dashboards in BackOffice. | SuperUser, TechAdmin |
| `GENERATE_REPORT` | Generate Report | Allows generating system-level reports from BackOffice. | SuperUser, Governance roles with reporting access |
| `CREATE_UPDATE_DOC_BACKOFFICE` | Configure the BackOffice for the DOC | Allows configuring DOC-specific BackOffice settings. | SuperUser, ContentAdmin |
| `PAT_CREATE` | Personal Access Token | Allows a user to create a Personal Access Token for API authentication. | All authenticated users (self-service) |
| `VIEW_WORKFLOW_TEMPLATES` | View Workflow Templates | Allows viewing Workflow Templates list and details in BackOffice. | SuperUser, ContentAdmin, TechAdmin |
| `CREATE_EDIT_WORKFLOW_TEMPLATE` | Create/Edit/Publish Workflow Template | Allows creating, editing, and publishing workflow templates. | SuperUser, TechAdmin |
| `ACTIVATE_DEACTIVATE_WORKFLOW_TEMPLATE` | Activate/Deactivate Workflow Template | Allows activating or deactivating workflow templates. | SuperUser, TechAdmin |

### 2. Maintenance Mode

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `VIEW_MAINTENANCE_MODE` | View maintenance mode | Allows viewing current maintenance mode status and scheduled windows. | SuperUser, TechAdmin |
| `EDIT_MAINTENANCE_MODE` | Edit maintenance mode | Allows enabling, disabling, and scheduling maintenance mode. | SuperUser, TechAdmin |
| `SYSTEM_ACCESS_DURING_MAINTENANCE` | System access during maintenance | Allows using the system while maintenance mode is active. | SuperUser, TechAdmin |
| `VIEW_MAINTENANCE_CUSTOM_BANNERS_CONFIGURATION` | View Maintenance Custom Banners Configuration | Allows viewing configured custom banners during maintenance. | SuperUser, TechAdmin |
| `EDIT_CUSTOM_BANNERS_CONFIGURATION` | Edit Custom Banners Configuration | Allows creating and editing custom banners shown during maintenance. | SuperUser, TechAdmin |

### 3. User Management

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `USER_UPDATE` | User Create/Update | Gives access to User Management in BackOffice, including creating/updating user profiles and assigning roles. | UserAdmin, SuperUser |
| `USER_ROLE_ASSIGN` | User Role (Re) Assign | Allows assigning or re-assigning roles to users. | UserAdmin, SuperUser |
| `DELEGATE_ROLE` | Delegate Role | Allows a principal role holder to delegate their role to another user. | Product Owner, Security Advisor, Security Manager, PQL, Privacy Advisor, IT Owner, Project Manager, and governance role holders |

### 4. Product Management

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `PRODUCT_CREATE` | Product Create | Allows creating a new product. | ProductAdmin, ProductAdminOrg1/2/3, SuperUser |
| `PRD_VIEW` | Product View | Allows viewing a product's details page (read-only). | All roles assigned to the product; Viewer Global |
| `PRD_UPDATE` | Product update | Allows editing an existing product's details. | Product Owner, Security Manager, ProductAdmin roles |
| `PRODUCT_OWNER_UPDATE` | Product Owner Update | Allows changing the Product Owner field on a product. | ProductAdmin, SuperUser |
| `INACTIVATE_PRODUCT` | Inactivate Product | Allows seeing and interacting with the 'Inactivate product' button. Source: PIC-7648. | ProductAdmin, ProductAdminOrg1/2/3, Delegate ProductAdmin (Global/Org1/Org2/Org3), SuperUser, Global |
| `ADD_ASSOCIATED_PRODUCT` | Add associated product | Allows adding an associated product link. Source: PIC-4272. | Product Owner, Security Manager, Security Advisor, Global, SuperUser |
| `EDIT_ASSOCIATED_PRODUCT` | Edit associated products | Allows editing or removing existing associated product links. Source: PIC-4272. | Product Owner, Security Manager, Security Advisor, Global, SuperUser |
| `VIEW_PRODUCT_ACTIONS` | View Product Actions | Allows viewing the Actions tab on a product. | Product Owner, Security Manager, Security Advisor |
| `EDIT_PRODUCT_ACTIONS` | Edit Product Actions | Allows creating and updating action items on a product. | Product Owner, Security Manager |
| `VIEW_DIGITALOFFERS_PRODUCTS_INFO` | View Digital Offers info for the products (not limited by VESTA ID) | Allows viewing Digital Offer information across all products. | Digital Offer Certification Lead, BU Security Officer, governance roles |

### 5. Release Management

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `RLS_VIEW` | Release View | Allows viewing a release and its content. Base privilege for any release access. | All roles assigned to the product; Viewer roles |
| `RLS_UPDATE` | Release Create and Update | Allows creating new releases and editing release fields. | Product Owner, Security Manager |
| `INACTIVATE_RELEASE` | Inactivate Release | Allows seeing and using the 'Inactivate release' button. Source: PIC-7648. | ProductAdmin, ProductAdminOrg1/2/3, Delegate ProductAdmin (Global/Org1/Org2/Org3), SuperUser, Global |
| `CLASSIFICATION_UPDATE` | Classification Update | Allows updating the security classification level of a release. | Product Owner, Security Manager, Security Advisor |
| `EDIT_RELEASE_RISK` | Edit Release Risk Classification | Allows editing the risk classification fields on a release. | Product Owner, Security Manager, Security Advisor |
| `EDIT_CROSS_ORG_DEV` | Edit Cross Org Dev Fields | Allows populating Cross Organizational Development fields on Product Details page. Source: PIC-8281. | Product Owner, Security Manager, Security Advisor (SDPA), LOB Security Leader (Org 2 scope), ProductAdminOrg1/2/3, Product Admin Product Modification, SuperUser |
| `UPDATE_REQ_VERSION_IN_RELEASE` | Update requirements version in Release | Allows confirming or cancelling a requirements version update. Source: PIC-8553. | Product Owner, Security Manager, Security Advisor, LOB Security Leader, BU Security Officer, SuperUser, Global (and delegate variants) |
| `JIRASYNC` | Sync Data With Jira | Allows triggering a manual Jira synchronization. | Product Owner, Security Manager |
| `SYNCJAMA` | Sync Data With Jama | Allows sending requirements to Jama and refreshing statuses. Source: PIC-5906. | Product Owner, Security Manager, Security Advisor, Process Quality Leader, CISO, LOB Security Leader, SVP LOB, BU Security Officer, Privacy Advisor, Privacy Reviewer, Global, SuperUser |

### 6. Landing Page & Navigation

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `MY_RELEASES` | My Releases | Grants access to "My Releases" section on the home page. | Product Owner, Security Manager, Security Advisor, PQL, Privacy Advisor |
| `MY_TASKS` | My Tasks | Grants access to "My Tasks" section. | All active role holders |
| `MY_PRODUCTS` | My Products | Grants access to "My Products" section. | Security Manager, Security Advisor, PQL, governance roles |
| `REPORTS_DASHBOARDS` | Reports & Dashboards | Grants access to the Reports & Dashboards section. | Product Owner, Security Manager, Security Advisor, governance roles |

### 7. Requirements Libraries

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `PRD_REQUIREMENTS_LIB_CREATE_UPDATE` | Product Requirements Library Create/Update | Allows creating and modifying entries in the Product Requirements Library. | ContentAdmin, SuperUser |
| `PRD_REQUIREMENTS_LIB_VIEW` | Product Requirements Library View | Allows viewing the Product Requirements Library. | ContentAdmin, Product Owner, Security Manager |
| `SDL_PROCESS_REQUIREMENTS_LIB_CREATE_UPDATE` | SDL Process Requirements Library Create/Update | Allows creating and modifying entries in the SDL Process Requirements Library. | ContentAdmin, SuperUser |
| `SDL_PROCESS_REQUIREMENTS_LIB_VIEW` | SDL Process Requirements Library View | Allows viewing the SDL Process Requirements Library. | ContentAdmin, Product Owner, Security Manager |
| `SDL_PROCESS_QUESTIONNAIRE_UPDATE` | SDL Process Questionnaire Update | Allows updating SDL process questionnaire templates. | ContentAdmin, SuperUser |
| `PRODUCT_QUESTIONNAIRE_UPDATE` | Product Questionnaire Update | Allows updating product-level questionnaire templates. | ContentAdmin, SuperUser |
| `PROD_REQ_QESTIONNAIRE_FILL` | Product Requirements Questionnaire Fill | Allows filling in the product requirements questionnaire within a release. | Product Owner, Security Manager |
| `UPDATE_PROCESS_REQUIREMENTS_UPLOAD` | Update Process Requirements with the file upload | Allows bulk-updating SDL process requirements via file upload. | ContentAdmin, SuperUser |
| `UPDATE_PRODUCT_REQUIREMENTS_UPLOAD` | Update Product Requirements with the file upload | Allows bulk-updating product requirements via file upload. | ContentAdmin, SuperUser |
| `DOWNLOAD_PROCESS_REQUIREMENT_TEMPLATE` | Download Process Requirement template | Allows downloading the SDL process requirements upload template. | ContentAdmin, Product Owner, Security Manager |
| `DOWNLOAD_PRODUCT_REQUIREMENT_TEMPLATE` | Download Product Requirement template | Allows downloading the product requirements upload template. | ContentAdmin, Product Owner, Security Manager |
| `ADD_CUSTOM_REQUIREMENTS` | Add Custom Requirements | Controls access to custom requirement management: '+ Custom Requirement' button, bulk uploads, editing/removing custom requirements. Source: PIC-5874. | Product Owner, Security Manager, Security Advisor, SuperUser |
| `ATTESTATIONSOFTWARE_UPDATE` | Attestation Software Update | Allows updating the software attestation section in the CSRR. | Product Owner, Security Manager |

### 8. Release Scope & Review

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `SCOPE_SUBMIT` | Release Scope Submit | Allows starting questionnaires, editing requirements status, submitting for scope review. | Product Owner, Security Manager |
| `SCOPE_CONFIRM` | Release Scope Confirm | Allows submitting a release for Scope Approval after review. | Security Advisor, BU Security Officer, LOB Security Leader |
| `SCOPEREVIEW_LEVEL1` | Scope Review Level 1 - Security Advisor Level | Allows reviewing and acting on scope at Security Advisor level. | Security Advisor, Delegated Security Advisor |
| `SCOPEREVIEW_LEVEL2` | Scope Review Level 2 - LOB Security Leader Level | Allows reviewing and acting on scope at LOB Security Leader level. | LOB Security Leader, Delegated LOB Security Leader |
| `SCOPEREVIEW_LEVEL3` | Scope Review Level 2 - BU Security Officer Level | Allows reviewing and acting on scope at BU Security Officer level. | BU Security Officer, Delegated BU Security Officer |
| `VIEW_SCOPEREVIEWCONFIRMTAB` | View Scope Review & Confirm tab | Allows viewing the Scope Review & Confirm tab. Source: PIC-5307. | Product Owner, Security Manager, Security Advisor, PQL, CISO, LOB Security Leader, SVP LOB, BU Security Officer, Privacy Advisor, Global, SuperUser |
| `MANAGE_SCOPEREVIEW PARTICIPANT` | Add Scope Review Participant | Allows adding participants to a scope review meeting. Source: PIC-5307. | Security Advisor, LOB Security Leader, BU Security Officer, Privacy Advisor, Global, SuperUser |
| `MANAGE_KEYDECISIONTOPIC` | Add Key Decision topic | Allows adding key decision topics to a scope review. Source: PIC-5307. | Security Advisor, LOB Security Leader, BU Security Officer, Privacy Advisor, Global, SuperUser |
| `MANAGE_SCOPEREVIEWDECISION` | Add Scope Review Decision | Allows recording decisions from a scope review meeting. Source: PIC-5307. | Security Advisor, LOB Security Leader, BU Security Officer, Privacy Advisor, Global, SuperUser |
| `MANAGE_SCOPEREVIEWACTION` | Add Scope Review Action | Allows adding action items from a scope review. Source: PIC-5307. | Product Owner, Security Manager, Security Advisor, LOB Security Leader, BU Security Officer, Global, SuperUser |

### 9. CSRR (Cybersecurity Residual Risk Report)

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `CSRR_SDL_PROCESS_SUMMARY_UPDATE` | CSRR SDL Process Summary Update | Allows editing the SDL Process Summary section. | Product Owner, Security Manager, Security Advisor |
| `CSRR_PRODUCT_REQ_SUMMARY_UPDATE` | CSRR Product Requirement Summary Update | Allows editing the Product Requirements Summary section. | Product Owner, Security Manager |
| `CSRR_SYSTEM_DESIGN` | CSRR System Design | Allows updating the System Design section. | Product Owner, Security Manager |
| `CSRR_STATIC_CODE_ANALYSIS_UPDATE` | CSRR Static Code Analysis Update | Allows updating the Static Code Analysis section. | Product Owner, Security Manager |
| `CSRR_FOSSCHECK_UPDATE` | CSRR FOSS Check Update | Allows updating the FOSS Check section. | Product Owner, Security Manager |
| `CSRR_THREAT_MODEL` | CSRR Threat Model Update | Allows updating the Threat Model section. | Product Owner, Security Manager, Security Advisor |
| `CSRR_THIRD_PARTY_SUPPLIERS_UPDATE` | CSRR Third Party Suppliers Update | Allows updating the Third Party Suppliers section. | Product Owner, Security Manager |
| `CSRR_SECURITYDEFECTS_UPDATE` | CSRR Security Defects Update | Allows updating the Security Defects section. | Product Owner, Security Manager |
| `CSRR_SOFTWARE_COMPOSITION` | CSRR Software Composition Analysis Update | Allows updating the Software Composition Analysis section. | Product Owner, Security Manager |

### 10. FCSR (Field Cybersecurity Status Report)

Routing escalation: Security Advisor → LOB Security Leader → BU Security Officer → SVP LOB → CISO.

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `FCSR_DECISION_UPDATE` | FCSR Decision Update | Allows editing FCSR decision fields (recommendation, risk acceptance, notes). | Product Owner, Security Manager |
| `FCSRREADINESSREVIEW` | FCSR Readiness Review | Allows editing process/product requirements, CSRR, and FCSR decision tabs; sending back to rework before formal FCSR submission. | Security Advisor |
| `FCSREVIEW_LEVEL1` | FCSR Review Level 1 - Security Advisor Level | Allows editing FCSR Decision tab at Security Advisor level. | Security Advisor, Delegated Security Advisor |
| `FCSREVIEW_LEVEL2` | FCSR Review Level 2 - LOB Security Leader Level | Allows editing FCSR Decision tab at LOB Security Leader level. | LOB Security Leader, Delegated LOB Security Leader |
| `FCSREVIEW_LEVEL3` | FCSR Review Level 3 - BU Security Officer Level | Allows editing FCSR Decision tab at BU Security Officer level, including exception handling. | BU Security Officer, Delegated BU Security Officer |
| `FCSREVIEW_LEVEL4` | FCSR Review 4 | Allows editing FCSR Decision when escalated to CISO or SVP LOB tier. | SVP LOB, Delegated SVP LOB |
| `FCSREVIEW_CISO` | FCSR Review CISO | Allows sending for rework and approving FCSR when decision level is CISO. | CISO, Delegate CISO, Deputy CISO |
| `FCSREVIEW_SVPLOB` | FCSR Review SVP LOB | Allows sending for rework and approving FCSR when decision level is SVP LOB. | SVP LOB |
| `FCSR_APPROVE` | FCSR Approve | Allows approving or rejecting the FCSR at the designated governance tier. | Security Advisor, BU Security Officer, LOB Security Leader |
| `FCSR_APPROVE_DELEGATE` | FCSR Approval Delegate | Allows a delegated user to perform FCSR approval on behalf of the principal. | Delegate Security Advisor, Delegated BU Security Officer |
| `FCSR_EXCEPT_APPROVE` | FCSR Exception Approve | Allows approving an FCSR exception request. | CISO, BU Security Officer (escalation path) |
| `FINAL_APPROVAL` | Final Approval | Allows performing the final acceptance/sign-off on a release after FCSR approval. | Security Advisor (Post FCSR Actions stage) |
| `FINALAPPROVAL_STAGERELEASE` | Final Approval Release Stage | Grants access to the Final Approval stage in the release workflow. | Security Advisor, governance roles |
| `ACTIONSCLOSURE` | Actions Closure Release Stage | Allows marking the Actions Closure stage as complete. | Product Owner, Security Manager, Security Advisor |
| `CISO_PROVIDE_RISK_ACCEPTANCE_DECISION` | Provide Risk Acceptance Decision by CISO | Allows the CISO to provide a risk acceptance decision. Source: PIC-8807. | CISO |
| `SVP_PROVIDE_RISK_ACCEPTANCE_DECISION` | Provide Risk Acceptance Decision by SVP | Allows the SVP LOB to provide a risk acceptance decision. Source: PIC-8807. | SVP LOB |

### 11. Privacy & Data Protection

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `VIEW_DATAPRIVACY_TAB` | View Data Privacy Review tab | Allows viewing the Data Privacy Review tab in a release. | Privacy Advisor, Privacy Reviewer, Security Advisor, Product Owner |
| `VIEW_DATAPRIVACY_SUMMARY` | View Data Privacy Summary | Allows viewing the Data Privacy Summary section. | Privacy Advisor, Privacy Reviewer, governance roles |
| `EDIT_DATAPRIVACY_SUMMARY` | Edit Data Privacy Summary | Allows editing the Data Privacy Summary. | Privacy Advisor, Security Advisor |
| `VIEW_PRIVACY_RISK` | View Privacy Risk | Allows viewing privacy risk assessments in a release. | Privacy Advisor, Privacy Reviewer, Product Owner |
| `EDIT_PRIVACY_RISK` | Edit Privacy Risk | Allows editing privacy risk assessment fields. | Privacy Advisor |
| `ANSWER_PRIVACY_QUESTIONNAIRE` | Answer Privacy Questionnaire | Allows filling in the privacy questionnaire within a release. | Product Owner, Security Manager |
| `ADD_EVIDENCES_PRIVACYSECTION` | Add Evidences for the Privacy Section | Allows uploading evidence documents to the privacy section. | Product Owner, Security Manager, Privacy Advisor |
| `ADD_CLARIFICATION_PRIVACYSECTION` | Add clarification for the Privacy Section | Allows adding clarification comments to privacy section items. | Product Owner, Security Manager, Privacy Advisor |
| `UPDATE_ACTIONS_PRIVACYSECTION` | Update actions for the Privacy Section | Allows creating and updating action items within the privacy section. | Privacy Advisor, Product Owner |
| `EDIT_MATURITYLEVEL_PRIVACYSECTION` | Edit Maturity level for the Privacy Section | Allows setting the maturity level rating for privacy requirements. | Privacy Advisor |
| `EVALUATE_REQUIREMENTS_PRIVACYSECTION` | Evaluate requirements for the Privacy Sections | Allows evaluating (pass/fail/partial) each privacy requirement. | Privacy Reviewer, Privacy Advisor |
| `RATE_ANSWERS_PRIVACYQUEST` | Rate answers of the Privacy Questionnaire | Allows the Privacy Reviewer to rate questionnaire answers. | Privacy Reviewer, Delegated Privacy Reviewer |
| `RATE_EVIDENCES_PRIVACYSECTION` | Rate evidences provided for the Privacy Section | Allows the Privacy Reviewer to rate uploaded evidence. | Privacy Reviewer, Delegated Privacy Reviewer |
| `ADD_PRIVACYREVIEW_FEEDBACK` | Provide Privacy Review Feedback | Allows the Privacy Reviewer to provide written feedback. | Privacy Reviewer, Delegated Privacy Reviewer |
| `ADD_PRIVACYREVIEW_FEEDBACK_REPLY` | Add Privacy Review Feedback Reply | Allows the product team to reply to Privacy Reviewer feedback. | Product Owner, Security Manager, Privacy Advisor |
| `UPDATE_RESIDUALRISKS_PRIVACYSECTIONS` | Update Residual Risks for the Privacy Sections | Allows updating residual risk fields within the privacy section. | Privacy Advisor, Product Owner |
| `CONFIRM_PRIVACY_READINESSSIGNOFF` | Security and Privacy Readiness Sign Off | Allows performing the security and privacy readiness sign-off stage. | Security Advisor, Privacy Advisor |
| `VIEW_DATAPRIVACYSUMMARY` | View Data Privacy Summary in FCSR Decision | Allows viewing the DPP summary within the FCSR Decision section. | Security Advisor, BU Security Officer, governance roles |
| `ADD_PCCDECISION` | PCC Decision | Allows recording the Privacy Compliance Committee decision. | Privacy Advisor, Security Advisor |
| `UPDATE_PRIVACYRISK_LIB` | Privacy Risk Management | Allows managing the Privacy Risk library in BackOffice. | ContentAdmin, SuperUser |
| `UPDATE_NOTAPPLICABLE_PRIVACYSECTION` | Update Not Applicable for the Privacy Section | Allows marking a privacy section or requirement as Not Applicable. | Privacy Advisor, Product Owner |

### 12. DOC (Digital Offer Certification)

"Limited by VESTA ID" = user must be linked to the specific offer. "Not limited by VESTA ID" = user can act on all offers within their org scope.

#### Viewing

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `VIEW_DOC` | View DOC | Allows viewing a DOC record. Scope limited by org, not VESTA ID. | DOC Lead, IT Owner, Product Owner, Security Manager, governance roles |
| `VIEW_LINKED_RELEASE_INFO` | View the linked release info | Allows viewing the SDL release linked to a DOC. Not limited by VESTA ID. | DOC Lead, governance roles |
| `VIEW_IT_SECURITY_SUMMARY` | View IT Security Summary | Allows viewing the IT Security Summary section of a DOC. | DOC Lead, BU Security Officer, governance roles |
| `VIEW_DOC_REPORTS` | View DOC reports | Allows viewing DOC reporting dashboards. Scope limited by org, not VESTA ID. | DOC Lead, governance roles, Security Manager |
| `VIEW_ALL_DOCS` | View all DOCs on the tab "My Docs" | Allows seeing all DOCs including DOCs for products the user is not linked to. | DOC Lead, governance roles |

#### Lifecycle

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `CREATE_DIGITAL_OFFER_CERTIFICATION` | Create Digital Offer Certification | Allows creating a new DOC record. Not limited by VESTA ID. | DOC Lead, ProductAdmin, SuperUser |
| `INITIATE_DIGITAL_OFFER_CERTIFICATION` | Initiate Digital Offer Certification | Allows initiating a DOC. Not limited by VESTA ID. | DOC Lead |
| `CANCEL_DIGITAL_OFFER_CERTIFICATION` | Cancel Digital Offer Certification | Allows cancelling a DOC. Not limited by VESTA ID. | DOC Lead, BU Security Officer |
| `CANCEL_DIGITAL_OFFER_CERTIFICATION_REQUEST` | Cancel Digital Offer Certification Request | Allows requesting cancellation of a DOC. Limited by VESTA ID. | IT Owner, Product Owner (assigned to the offer) |
| `REVOKE_DOC` | Revoke DOC | Allows revoking a previously certified DOC. | DOC Lead, BU Security Officer |
| `COMPLETE_DOC` | Complete DOC | Allows marking a DOC as complete at the end of the workflow. | DOC Lead |
| `SEND_FOR_REWORK` | Send DOC for Rework | Allows sending a DOC back to the product team for rework. | DOC Lead |
| `SUBMIT_FOR_ACTIONS_CLOSURE` | Submit for Actions Closure | Allows submitting a DOC to the Actions Closure stage. | DOC Lead, IT Owner |
| `SUBMIT_FOR_APPROVAL` | Submit for Approval | Allows submitting a DOC for governance approval. | DOC Lead, IT Owner |
| `SUBMIT_DOC_REVIEW_RISK_SUMMARY` | Submit DOC to Review Risk Summary | Allows submitting a DOC to the Review Risk Summary stage. | DOC Lead |
| `SUBMIT_DOC_ISSUE_CERTIFICATION` | Submit DOC for Issue Certification | Allows submitting a DOC for certification issuance. | DOC Lead |

#### Editing & Data Entry

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `EDIT_DOC_DETAILS` | Edit Digital Offer Certification Details | Allows editing DOC detail fields. Limited by VESTA ID. | IT Owner, Project Manager (linked to offer) |
| `EDIT_INITIATED_DOC_DETAILS` | Edit DOC Details from ITS Scope Controls stage | Allows editing DOC details from ITS Scope Controls stage onward. Not limited by VESTA ID. | DOC Lead |
| `EDIT_USERS_ROLES_DOC` | Edit assigned DOC users | Allows editing DOC role assignments. Not limited by VESTA ID. | DOC Lead, SuperUser |
| `ADD_DOC_APPROVER` | Add DOC Approver | Allows adding an approver to the DOC approval chain. | DOC Lead |
| `ENTER_DATA_PRIVACY_REVIEW_SDL_FCSR_SUMMARYDATA` | Enter Data Privacy Review and SDL/FCSR summary data | Allows filling DPP Review and SDL/FCSR summary sections within a DOC. Limited by VESTA ID. | IT Owner, Privacy Advisor (linked to offer) |
| `CREATE_UPDATE_DOC_ACTIONS` | Create/update DOC Actions | Allows creating and updating action items within a DOC. Limited by VESTA ID. | IT Owner, Project Manager (linked to offer) |

#### IT Security Controls

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `SCOPE_IT_SECURITY_CONTROLS` | Scope the IT Security Controls | Allows scoping which IT security controls apply to a DOC. Not limited by VESTA ID. | DOC Lead |
| `PROVIDE_CONTROL_EVIDENCE_COMMENTS` | Provide evidence/comments for controls | Allows the product team to provide evidence and comments for each control. Limited by VESTA ID. | IT Owner, Project Manager (linked to offer) |
| `SUBMIT_CONTROL_FOR_REVIEW` | DO TEAM to submit the control for review | Allows the DO team to submit a control for review by the DOC Lead. | IT Owner, Project Manager |
| `PROVIDE_CONTROL_COMMENT` | Provide comments for controls by DOCL | Allows the DOC Lead to provide comments on a control in Under Review status. | DOC Lead |
| `SEND_CONTROL_BACK_FOR_UPDATE` | DOCL to send back control to DO team | Allows the DOC Lead to return a control to the DO team for updates. | DOC Lead |
| `MARK_CONTROL_NOT_APPLICABLE` | DOCL to mark control as not applicable | Allows the DOC Lead to mark a control as not applicable. | DOC Lead |
| `COMPLETE_RISK_ASSESSMENT` | DOCL to complete risk assessment for the control | Allows the DOC Lead to finalize the risk assessment for a control. | DOC Lead |
| `CREATE_UPDATE_FINDINGS` | Create/Update Findings | Allows creating and updating findings for DOC controls. Not limited by VESTA ID. | DOC Lead |
| `EVALUATE_ITS_CONTROLS_RISKS` | Evaluate ITS Controls Risks | Allows evaluating risks for each IT security control. Not limited by VESTA ID. | DOC Lead |
| `EDIT_IT_SECURITY_SUMMARY` | Edit IT Security Summary | Allows editing the IT Security Summary section of a DOC. Not limited by VESTA ID. | DOC Lead |
| `SPECIFY_UPDATE_DOC_DECISION` | Specify and update DOC Decision | Allows specifying and updating the DOC decision outcome. Not limited by VESTA ID. | DOC Lead |

#### Approvals (Governance)

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `ACCEPT_DOC_CERTIFIED` | Accept or reject DOC Decision Certified | Allows accepting or rejecting a DOC certification decision. Not limited by VESTA ID. | DOC Lead, BU Security Officer |
| `BVP_ACCEPT_DOC_WITH_EXCEPTION` | BVP to Accept or reject DOC Decision Certified with Exception | Allows BVP to accept/reject a DOC certified with exceptions. | Business Vice President (BVP) |
| `BUSO_ACCEPT_DOC_WITH_EXCEPTION` | BU Security Officer to Accept or reject DOC Decision Certified with Exception | Allows BU Security Officer to accept/reject a DOC certified with exceptions. | BU Security Officer |
| `BUSO_ACCEPT_DOC_WAIVER` | BU Security Officer to Accept or reject DOC Decision Waiver | Allows BU Security Officer to accept/reject a DOC waiver decision. | BU Security Officer |
| `CISO_ACCEPT_DOC_WAIVER` | CISO to Accept or reject DOC Decision Waiver | Allows CISO to accept/reject a DOC waiver decision. | CISO, Deputy CISO |
| `CPSO_ACCEPT_DOC_WAIVER` | CPSO to Accept or reject DOC Decision Waiver | Allows CPSO to accept/reject a DOC waiver decision. | CPSO, Deputy CPSO |
| `SVP_ACCEPT_DOC_WAIVER` | Senior BVP to Accept or reject DOC Decision Waiver | Allows Senior BVP to accept/reject a DOC waiver decision. | Senior Business Vice President |

### 13. Release Notes Configuration

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `VIEW_RELEASE_NOTES_CONFIGURATION` | View Release Notes Configuration | Allows viewing the Release Notes Configuration sub-section in BackOffice. | ContentAdmin, SuperUser |
| `UPDATE_RELEASE_NOTES_CONFIGURATION` | Update Release Notes Configuration | Allows editing release notes items, creating new ones, managing source links, activating/deactivating. | ContentAdmin, SuperUser |

### 14. Integration & API

| Privilege Code | Privilege Name | Description | Typical Roles |
|---|---|---|---|
| `IMPORTBDBA` | Import Data From BDBA | Allows importing SCA scan results from BlackDuck Binary Analysis (BDBA) tool. Source: PIC-9500. | Product Owner, Security Manager, Security Advisor, Global, SuperUser |

---

## Important Notes

1. **"Security Advisor" vs "Security and Data Protection Advisor"**: Formal name is "Security and Data Protection Advisor" (role code `SECURITYADVISOR`). Use the full formal name in Jira story statements.
2. **Delegate roles**: Every major role has a delegate variant (e.g., `DELEGATEPRODUCTOWNER`). Delegate roles have the same access privileges. Test cases for the principal apply to delegate roles too unless the spec says otherwise.
3. **Product Team roles have NO system access**: Architect, Developer, V&V Tester, Pen Tester, Tech Writer, Build Manager, and Vulnerability Handler are listed in Roles & Responsibilities but cannot log in to PICASso.
4. **Landing page varies by role**: The home screen and visible sections differ per role.
5. **FCSR routing logic**: FCSR approval routing follows BU Security Officer → LOB Security Leader → SVP LOB → CISO escalation path.
6. **DOC roles**: IT Owner and Project Manager are DOC-specific roles that use the same searchbox widget as other user lookup fields.

---