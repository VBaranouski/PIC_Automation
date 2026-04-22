# Data Ingestion API — Knowledge File

> **Source:** PICASso Data Ingestion API v1.3 (Sep 2025) + swagger.json
> **Area:** `integrations` · **Workflow:** Integration: Data Ingestion API

---

## 1. Purpose

REST API enabling external tools (CI/CD pipelines, third-party systems) to **write** data into PICASso. Counterpart of the read-only Data Extraction API. Covers full CRUD (POST/PUT/DELETE/GET) across 11 SDL domains.

## 2. Architecture

- **Protocol:** REST over HTTPS
- **Base Paths:**
  - Dev: `https://dev.leap.schneider-electric.com/GRC_Ingestion_API/rest/v1/`
  - QA: `https://qa.leap.schneider-electric.com/GRC_Ingestion_API/rest/v1/`
  - PPR: `https://ppr.leap.schneider-electric.com/GRC_Ingestion_API/rest/v1/`
  - Prod: `https://leap.schneider-electric.com/GRC_Ingestion_API/rest/v1/`
- **Auth:** OAuth 2.0 Client Credentials Grant via Azure AD (Entra ID)
- **Token endpoint:** `POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token`
- **Token lifetime:** 3599 seconds (1 hour); PICASso caches and auto-refreshes

## 3. Authentication Flow

1. Consumer registers an Azure AD app → gets `client_id`, `client_secret`, API permissions
2. Consumer's tool is registered in PICASso **BackOffice → Data Ingestion API Configuration → Consumers Configuration → Add External Tool** (name + Client ID)
3. Access Level configured per tool: **Global**, or scoped by **Org1**, **Org2**, **Org3**, **Product** — with per-section read/write grants
4. Multiple access levels can coexist on the same scope (except Global)
5. Token request: `POST /token` with `grant_type=client_credentials`, `scope=<app_id>/.default`, `client_id`, `client_secret`
6. PICASso validates JWT: signature via Entra ID public key → issuer → audience → expiration
7. PICASso parses payload → validates schema + field-level data → applies business rules → stores in DB

## 4. Authorization & Scope Mapping

- Scope is enforced **inside PICASso** (not by external IAM)
- On each request, PICASso looks up the Client ID's External Tool config
- Compares product/org in the payload against allowed access levels + permitted sections
- Match → data ingested
- No match → **403** with descriptive unauthorized access error
- Fine-grained per-domain section grants (e.g., tool A can write System Design but not Threat Model)

## 5. API Domains (11)

| # | Domain | Endpoint Prefix | CRUD Operations | Key Entities |
|---|--------|----------------|-----------------|-------------|
| 1 | **Release Details** | `/Release` | POST, PUT, GET | Release (ProductId, ReleaseVersion, TargetReleaseDate, ChangeSummary, ContinuousPenetrationTesting, IsOnboarding) |
| 2 | **SDL Process Requirements Summary** | `/SDLOpenProcessRequirements`, `/SDLProcessRequirementsSummary` | PUT+GET (Open Reqs), POST+PUT+GET (Summary), POST+PUT+DELETE+GET (Actions), POST+PUT+GET (Residual Risk) | Requirements, Actions, Residual Risk Classification |
| 3 | **System Design** | `/SystemDesign` | POST+PUT+GET (Info), CRUD (Actions), CRUD (Components), CRUD (Countermeasures), POST+PUT+GET (Residual Risk), POST+PUT+GET (Risk Classifications) | Info, Actions, Components, Countermeasures, Residual Risk |
| 4 | **Threat Model** | `/ThreatModel` | POST+PUT+GET (Details), CRUD (Accepted), CRUD (Actions), CRUD (Mitigations), POST+PUT+GET (Residual Risk), POST+PUT+GET (Severity) | Details, Accepted Threats, Actions, Mitigations, Residual Risk, Severity |
| 5 | **3rd Party Suppliers & SE Bricks** | `/ThirdPartySuppliers` | CRUD (Actions), CRUD (Products), POST+PUT+GET (Residual Risk), CRUD (SE Brick Library Platform) | Actions, Products, Residual Risk, SE Bricks |
| 6 | **Static Code Analysis** | `/StaticCodeAnalysis` | CRUD (Actions), POST+PUT+GET (Residual Risk), CRUD (Tools) | Actions, Residual Risk, Tools |
| 7 | **Software Composition Analysis** | `/SoftwareCompositionAnalysis` | CRUD (SCA records), CRUD (Actions), POST+PUT+GET (Residual Risk), CRUD (Third Party Components with Vulnerabilities) | SCA Records, Actions, Residual Risk, Vulnerable Components |
| 8 | **FOSS Check** | `/FOSSCheck` | CRUD (Actions), POST+PUT+GET (Licensing Compliance) | Actions, Licensing Compliance |
| 9 | **Security Defects** | `/SecurityDefects` | CRUD (Actions), POST+PUT+GET (Pen Test Details), POST+PUT+GET (Residual Risk), CRUD (SVV Issues), POST+PUT+GET (Risk Classifications) | Actions, Pen Tests, Residual Risk, SVV Issues |
| 10 | **External Vulnerabilities** | `/ExternalVulnerabilities` | CRUD (Actions), CRUD (Issues), POST+PUT+GET (Residual Risk) | Actions, Issues, Residual Risk |
| 11 | **Reference Data** | `/ReferenceData_GetLoV/{EntityCode}` | GET only | Lookup tables (30+ entity codes) |

**Total endpoints:** 128 (across all domains)

## 6. Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success (update/get) |
| 201 | Created (new resource) |
| 400 | Invalid input / validation failure |
| 401 | Unauthorized (invalid/missing/expired token) |
| 403 | Forbidden (resource already exists, OR insufficient scope) |
| 404 | Not found (entity doesn't exist) |

## 7. Key Validation Rules (Cross-Domain)

### Release Details
- `ProductId` is mandatory and must exist
- `ReleaseVersion` must be unique (no duplicates → 403)
- `TargetReleaseDate` cannot be in the past
- `ContinuousPenetrationTesting=True` requires `ContinuousPenetrationTestingContractDate` (not null)
- `ContinuousPenetrationTestingContractDate` ≠ `TargetReleaseDate`
- `IsOnboarding=True` requires `LastBUSecurityOfficerFCSRDate`
- `ChangeSummary` max 65535 chars

### State-Based Editability
Data can only be created/edited when the release is in one of these states:
- `INPROGRESS`
- `FCSRREADINESSREVIEW`
- `ACTIONSCLOSURE`
- `FCSRREVIEW`
- `FCSRESCALATED`

Requests against releases in other states return error: *"release is in a state where it is not possible to create or edit"*

### Field Validation Patterns
- Link fields: validated as URLs → *"Invalid <field name>. Please confirm that you wrote the link correctly."*
- Reference data fields: validated against LoV → *"Invalid data sent - <field name>"*
- Required fields: → *"<field name> not found or Empty"*

## 8. Reference Data Entity Codes (30+)

| Entity Code | Entity Code |
|-------------|-------------|
| SDL_Gaps | SCATool |
| EvaluationStatus | IssuesNumberTrajectory |
| ResidualRisk | YesNoInProgress |
| ActionItemStatus | SoftwareComposition |
| ActionCategory | TrajectoryVulnarableComponents |
| InternalExternal | ComponentType |
| FCSRDecision | MaintenanceStatusRisk |
| YesNo | YesNoInProgressNA |
| RiskLevelCountermeasure | YesNoNotYetEvaluatedNA |
| TPSProductType | SecurityDefectsSource |
| IRARating | SecurityDefectsSeverity |
| TPSOverallMaturityLevel | PenTestPerformedOptions |
| YesNoNA | PenTestType |
| YesNoInProgressUnkown | ExternalVulnerabilitiesSource |
| BrickStatus | ExternalVulnerabilitiesSeverity |

## 9. BackOffice Configuration

- **Path:** BackOffice → Data Ingestion API Configuration → Consumers Configuration
- **Add External Tool:** Name + Client ID → Access Level (Global/Org1/Org2/Org3/Product) → Section grants
- **Multiple access levels** per scope allowed (except Global)
- Changes take immediate effect on next API call
