# WF 12. Integration: Data Ingestion API — Test Case Specifications

> Generated: 2026-04-22 — Complete rewrite based on API v1.3 (Sep 2025)
> Area: `integrations` | Workflow: `Integration: Data Ingestion API`
> Feature Registry: `docs/ai/knowledge-base/feature-registry/integrations.md`
> Knowledge File: `docs/ai/knowledge-base/knowledge/data-ingestion-api.md`
> API Docs: `docs/ai/knowledge-base/user-guides/PICASso Data Ingestion API (4) (1).docx`

---

## 1. Coverage Analysis

### Current State

| Category | Count |
|----------|-------|
| Total Scenarios | **0** (all 19 legacy scenarios removed — incorrect) |
| **NEW (this session)** | **55** |

### Coverage Gap Table (Five Dimensions)

| # | Dimension | Status | Notes |
|---|-----------|--------|-------|
| 1 | **Happy Path** | ✅ | E2E CRUD for all 11 domains + auth + BackOffice config |
| 2 | **Negative / Validation** | ✅ | Required fields, invalid data, LoV validation, link validation, boundary values |
| 3 | **Role-Based Access** | ✅ | Scope-based access: Global, Org-scoped, Product-scoped, section grants, denied access |
| 4 | **State Transitions** | ✅ | Editable states (5) vs. non-editable states; state-based rejection |
| 5 | **Data Integrity** | ✅ | POST → GET read-back; PUT → GET confirm update; DELETE → GET confirm 404; UI reflection |

---

## 2. Authentication & Token Management

#### `INT-INGEST-AUTH-001` — Acquire OAuth 2.0 token with valid client credentials [P1]

**Preconditions:** Azure AD app registered; client_id and client_secret available

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to Azure AD token endpoint with `grant_type=client_credentials`, valid `client_id`, `client_secret`, and `scope=<app_id>/.default` | HTTP 200; response body contains `access_token`, `token_type=Bearer`, `expires_in=3599` |
| 2 | Verify the `access_token` field is a non-empty JWT string | The `access_token` is a dot-separated three-part string (header.payload.signature) |

**Coverage dimension:** Happy Path

---

#### `INT-INGEST-AUTH-002` — Token rejected with invalid client_secret [P1]

**Preconditions:** Valid client_id; deliberately wrong client_secret

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to Azure AD token endpoint with valid `client_id` but invalid `client_secret` | HTTP 401; response body contains `error=invalid_client` |
| 2 | Send a GET request to any Data Ingestion API endpoint using the response as-is (no valid token) | HTTP 401; PICASso rejects the request |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-AUTH-003` — Expired token is rejected by PICASso [P1]

**Preconditions:** A previously valid token that has expired (>3599 seconds old), or a manually crafted expired JWT

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to `/ReferenceData_GetLoV/YesNo` with an expired Bearer token in the Authorization header | HTTP 401; response indicates token is expired or invalid |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-AUTH-004` — Request without Authorization header is rejected [P1]

**Preconditions:** None

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to `/ReferenceData_GetLoV/YesNo` without an Authorization header | HTTP 401; response indicates missing authentication |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-AUTH-005` — Token with unregistered client_id is rejected by PICASso [P2]

**Preconditions:** Valid Azure AD token from a client_id NOT registered in PICASso BackOffice

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Acquire a valid token from Azure AD using an unregistered client_id | HTTP 200; Azure AD returns a valid `access_token` |
| 2 | Send a GET request to `/ReferenceData_GetLoV/YesNo` using the token | HTTP 401 or 403; PICASso rejects the request because the Client ID is not in Consumers Configuration |

**Coverage dimension:** Role-Based Access

---

## 3. Consumer Configuration (BackOffice UI)

#### `INT-INGEST-CONFIG-001` — Add a new External Tool in BackOffice Consumers Configuration [P1]

**Preconditions:** Logged in as BackOffice Admin; navigate to BackOffice → Data Ingestion API Configuration → Consumers Configuration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → Data Ingestion API Configuration → Consumers Configuration | The Consumers Configuration page is visible; existing external tools listed |
| 2 | Click the `Add External Tool` button | The Add External Tool form is visible with Name and Client ID fields |
| 3 | Type a unique tool name in the `Name` field | The Name field contains the entered value |
| 4 | Type a valid Azure AD Client ID in the `Client ID` field | The Client ID field contains the entered value |
| 5 | Click the `Save` button | The new external tool appears in the Consumers Configuration list |

**Coverage dimension:** Happy Path

---

#### `INT-INGEST-CONFIG-002` — Configure Global access level for an External Tool [P1]

**Preconditions:** An External Tool exists in Consumers Configuration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the External Tool's Access Level configuration | The Access Level configuration page is visible |
| 2 | Select `Global` as the Access Level | The Global scope is selected; no org/product scoping required |
| 3 | Enable section grants for at least one SDL domain (e.g., Release Details read+write) | The section grant checkboxes are checked |
| 4 | Click `Save` | The Access Level configuration is saved; the tool now has Global access |

**Coverage dimension:** Happy Path

---

#### `INT-INGEST-CONFIG-003` — Configure Product-scoped access level for an External Tool [P2]

**Preconditions:** An External Tool exists in Consumers Configuration; at least one Product exists in PICASso

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the External Tool's Access Level configuration | The Access Level configuration page is visible |
| 2 | Select `Product` as the Access Level scope | Product selection fields are visible |
| 3 | Select a specific Product from the dropdown | The product name is selected |
| 4 | Enable section grants for specific SDL domains | The section grant checkboxes are checked |
| 5 | Click `Save` | The Access Level configuration is saved; the tool has access only to the selected product |

**Coverage dimension:** Role-Based Access

---

#### `INT-INGEST-CONFIG-004` — Multiple access levels on same scope [P2]

**Preconditions:** An External Tool exists with one Access Level already configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the External Tool's Access Level configuration | At least one existing Access Level is visible |
| 2 | Click `Add Access Level` | A new Access Level row or form is visible |
| 3 | Select a different scope (e.g., Org1-level) and different section grants | The new scope and grants are configured |
| 4 | Click `Save` | Both access levels are saved and visible; the tool has combined permissions |

**Coverage dimension:** Role-Based Access
**Note:** Multiple access levels can coexist except for Global (Global replaces all others)

---

## 4. Scope & Authorization Enforcement

#### `INT-INGEST-SCOPE-001` — Global-scoped tool can ingest data for any product [P1]

**Preconditions:** External Tool configured with Global access level and Release Details write permission; valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` for Product A with valid payload | HTTP 201; release created successfully |
| 2 | Send a POST request to `/Release/CreateRelease` for Product B with valid payload | HTTP 201; release created successfully for a different product |

**Coverage dimension:** Role-Based Access

---

#### `INT-INGEST-SCOPE-002` — Product-scoped tool is rejected when targeting a different product [P1]

**Preconditions:** External Tool configured with Product-scoped access for Product A only; valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` for Product A | HTTP 201; release created successfully |
| 2 | Send a POST request to `/Release/CreateRelease` for Product B (not in scope) | HTTP 403; response indicates unauthorized access to the product |

**Coverage dimension:** Role-Based Access

---

#### `INT-INGEST-SCOPE-003` — Tool without section grant for a domain is rejected [P1]

**Preconditions:** External Tool configured with Global access but WITHOUT System Design write permission; valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/SystemDesign/CreateSystemDesignInfo` with valid payload | HTTP 403; response indicates insufficient section permissions |
| 2 | Send a GET request to `/ReferenceData_GetLoV/YesNo` (reference data requires no section grant) | HTTP 200; reference data returned successfully |

**Coverage dimension:** Role-Based Access

---

#### `INT-INGEST-SCOPE-004` — Org-scoped tool can access products within org hierarchy [P2]

**Preconditions:** External Tool configured with Org1-scoped access; valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` for a product within the allowed Org1 | HTTP 201; release created successfully |
| 2 | Send a POST request to `/Release/CreateRelease` for a product outside the allowed Org1 | HTTP 403; response indicates unauthorized access |

**Coverage dimension:** Role-Based Access

---

## 5. Release Details Domain

#### `INT-INGEST-RELEASE-001` — Create, read, and update a release via API (E2E happy path) [P1]

**Preconditions:** Valid OAuth token with Release Details write permission; existing ProductId in PICASso

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with `ProductId`, unique `ReleaseVersion`, future `TargetReleaseDate`, `ChangeSummary` | HTTP 201; response contains the created release identifier |
| 2 | Send a GET request to `/Release/GetRelease` for the created release | HTTP 200; response matches the POST payload (ProductId, ReleaseVersion, TargetReleaseDate, ChangeSummary) |
| 3 | Send a PUT request to `/Release/UpdateRelease` with updated `ChangeSummary` | HTTP 200; response confirms the update |
| 4 | Send a GET request to `/Release/GetRelease` for the same release | HTTP 200; `ChangeSummary` matches the updated value |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-RELEASE-002` — Duplicate ReleaseVersion returns 403 [P1]

**Preconditions:** A release already exists for the target product with a specific ReleaseVersion

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with the same `ProductId` and `ReleaseVersion` as the existing release | HTTP 403; response indicates the release already exists |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-RELEASE-003` — TargetReleaseDate in the past is rejected [P2]

**Preconditions:** Valid OAuth token; existing ProductId

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with `TargetReleaseDate` set to a past date | HTTP 400; response indicates the target release date cannot be in the past |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-RELEASE-004` — ContinuousPenetrationTesting=True requires ContractDate [P2]

**Preconditions:** Valid OAuth token; existing ProductId

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with `ContinuousPenetrationTesting=True` and `ContinuousPenetrationTestingContractDate=null` | HTTP 400; response indicates ContinuousPenetrationTestingContractDate is required |
| 2 | Send a POST request to `/Release/CreateRelease` with `ContinuousPenetrationTesting=True` and a valid `ContinuousPenetrationTestingContractDate` | HTTP 201; release created successfully |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-RELEASE-005` — ChangeSummary exceeds 65535 characters [P3]

**Preconditions:** Valid OAuth token; existing ProductId

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with `ChangeSummary` containing 65536 characters | HTTP 400; response indicates ChangeSummary exceeds maximum length |
| 2 | Send a POST request to `/Release/CreateRelease` with `ChangeSummary` containing exactly 65535 characters | HTTP 201; release created successfully |

**Coverage dimension:** Negative / Validation (boundary)

---

#### `INT-INGEST-RELEASE-006` — Missing mandatory ProductId returns 400 [P1]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` without `ProductId` in the payload | HTTP 400; response contains "ProductId not found or Empty" |

**Coverage dimension:** Negative / Validation

---

## 6. SDL Process Requirements Domain

#### `INT-INGEST-SDLREQ-001` — CRUD cycle for SDL Process Requirements Summary [P1]

**Preconditions:** Valid OAuth token; existing release in INPROGRESS state with Release Details write + SDL Process Requirements write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/SDLProcessRequirementsSummary/CreateSDLProcessRequirementsSummary` with valid payload | HTTP 201; summary created |
| 2 | Send a GET request to `/SDLProcessRequirementsSummary/GetSDLProcessRequirementsSummary` | HTTP 200; response matches the POST payload |
| 3 | Send a PUT request to `/SDLProcessRequirementsSummary/UpdateSDLProcessRequirementsSummary` with updated fields | HTTP 200; update confirmed |
| 4 | Send a GET request to confirm the update | HTTP 200; response matches the PUT payload |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-SDLREQ-002` — CRUD cycle for SDL Process Requirements Actions [P1]

**Preconditions:** Valid OAuth token; existing release with SDL section permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/SDLProcessRequirementsSummary/CreateSDLProcessRequirementsAction` with valid payload | HTTP 201; action created with identifier |
| 2 | Send a GET request to `/SDLProcessRequirementsSummary/GetSDLProcessRequirementsAction` | HTTP 200; action data matches |
| 3 | Send a PUT request to update the action | HTTP 200; update confirmed |
| 4 | Send a DELETE request to `/SDLProcessRequirementsSummary/DeleteSDLProcessRequirementsAction` | HTTP 200; action deleted |
| 5 | Send a GET request for the deleted action | HTTP 404; action no longer exists |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-SDLREQ-003` — Update Open Process Requirements (PUT only) [P2]

**Preconditions:** Valid OAuth token; existing release with SDL section permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to `/SDLOpenProcessRequirements/GetSDLOpenProcessRequirements` | HTTP 200; current open requirements data returned |
| 2 | Send a PUT request to `/SDLOpenProcessRequirements/UpdateSDLOpenProcessRequirements` with updated values | HTTP 200; update confirmed |
| 3 | Send a GET request to confirm the update | HTTP 200; response matches the PUT payload |

**Coverage dimension:** Happy Path
**Note:** Open Process Requirements supports PUT+GET only (no POST/DELETE)

---

#### `INT-INGEST-SDLREQ-004` — Residual Risk Classification for SDL Process Requirements [P2]

**Preconditions:** Valid OAuth token; existing release with SDL section permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a Residual Risk Classification for SDL Process Requirements with valid LoV value | HTTP 201; residual risk record created |
| 2 | Send a GET request to retrieve the residual risk classification | HTTP 200; data matches the POST payload |
| 3 | Send a PUT request to update the residual risk classification | HTTP 200; update confirmed |

**Coverage dimension:** Happy Path

---

## 7. System Design Domain

#### `INT-INGEST-SYSDES-001` — CRUD cycle for System Design Info + Components [P1]

**Preconditions:** Valid OAuth token; existing release in editable state with System Design write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/SystemDesign/CreateSystemDesignInfo` with valid payload | HTTP 201; system design info created |
| 2 | Send a POST request to `/SystemDesign/CreateSystemDesignComponent` with component details | HTTP 201; component created with identifier |
| 3 | Send a GET request to retrieve system design info | HTTP 200; response includes the created info and component |
| 4 | Send a PUT request to update the component | HTTP 200; component updated |
| 5 | Send a DELETE request to remove the component | HTTP 200; component deleted |
| 6 | Send a GET request to confirm component deletion | HTTP 404; component no longer exists |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-SYSDES-002` — System Design Countermeasures CRUD [P2]

**Preconditions:** Valid OAuth token; existing release with System Design write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/SystemDesign/CreateSystemDesignCountermeasure` with valid payload | HTTP 201; countermeasure created |
| 2 | Send a GET request to retrieve countermeasures | HTTP 200; countermeasure data matches |
| 3 | Send a PUT request to update the countermeasure | HTTP 200; update confirmed |
| 4 | Send a DELETE request to remove the countermeasure | HTTP 200; countermeasure deleted |

**Coverage dimension:** Happy Path

---

#### `INT-INGEST-SYSDES-003` — System Design Actions and Residual Risk [P2]

**Preconditions:** Valid OAuth token; existing release with System Design write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a System Design Action | HTTP 201; action created |
| 2 | Send a POST request to create System Design Residual Risk Classification | HTTP 201; residual risk created |
| 3 | Send a GET request to retrieve actions and residual risk | HTTP 200; both entities present in response |
| 4 | Send a PUT request to update the action status | HTTP 200; action status updated |
| 5 | Send a DELETE request to remove the action | HTTP 200; action deleted |

**Coverage dimension:** Happy Path

---

## 8. Threat Model Domain

#### `INT-INGEST-THREAT-001` — CRUD cycle for Threat Model Details + Mitigations [P1]

**Preconditions:** Valid OAuth token; existing release in editable state with Threat Model write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/ThreatModel/CreateThreatModelDetails` with valid payload | HTTP 201; threat model details created |
| 2 | Send a POST request to `/ThreatModel/CreateThreatModelMitigation` with mitigation details | HTTP 201; mitigation created with identifier |
| 3 | Send a GET request to retrieve threat model details | HTTP 200; response includes details and mitigation |
| 4 | Send a PUT request to update the mitigation | HTTP 200; mitigation updated |
| 5 | Send a DELETE request to remove the mitigation | HTTP 200; mitigation deleted |
| 6 | Send a GET request to confirm mitigation removal | HTTP 404; mitigation no longer exists |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-THREAT-002` — Threat Model Accepted Threats + Severity [P2]

**Preconditions:** Valid OAuth token; existing release with Threat Model write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create an Accepted Threat | HTTP 201; accepted threat created |
| 2 | Send a POST request to create Threat Model Severity classification | HTTP 201; severity record created |
| 3 | Send a GET request to retrieve accepted threats and severity | HTTP 200; both records present |
| 4 | Send a PUT request to update the accepted threat | HTTP 200; update confirmed |
| 5 | Send a DELETE request to remove the accepted threat | HTTP 200; threat removed |

**Coverage dimension:** Happy Path

---

#### `INT-INGEST-THREAT-003` — Threat Model Actions and Residual Risk [P2]

**Preconditions:** Valid OAuth token; existing release with Threat Model write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a Threat Model Action | HTTP 201; action created |
| 2 | Send a POST request to create Threat Model Residual Risk | HTTP 201; residual risk created |
| 3 | Send a GET request to confirm both entities | HTTP 200; action and residual risk present |
| 4 | Send a DELETE request to remove the action | HTTP 200; action deleted |

**Coverage dimension:** Happy Path

---

## 9. 3rd Party Suppliers & SE Bricks Domain

#### `INT-INGEST-3RDPARTY-001` — CRUD cycle for 3rd Party Products [P1]

**Preconditions:** Valid OAuth token; existing release in editable state with 3rd Party Suppliers write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/ThirdPartySuppliers/CreateThirdPartyProduct` with valid product details | HTTP 201; third-party product created |
| 2 | Send a GET request to retrieve third-party products | HTTP 200; product data matches |
| 3 | Send a PUT request to update the product | HTTP 200; update confirmed |
| 4 | Send a DELETE request to remove the product | HTTP 200; product deleted |
| 5 | Send a GET request for the deleted product | HTTP 404; product no longer exists |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-3RDPARTY-002` — SE Brick Library Platform CRUD [P2]

**Preconditions:** Valid OAuth token; existing release with 3rd Party Suppliers write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create an SE Brick Library Platform record | HTTP 201; SE Brick record created |
| 2 | Send a GET request to retrieve the SE Brick record | HTTP 200; data matches |
| 3 | Send a PUT request to update the SE Brick | HTTP 200; update confirmed |
| 4 | Send a DELETE request to remove the SE Brick | HTTP 200; record deleted |

**Coverage dimension:** Happy Path

---

#### `INT-INGEST-3RDPARTY-003` — 3rd Party Suppliers Actions and Residual Risk [P2]

**Preconditions:** Valid OAuth token; existing release with 3rd Party Suppliers write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a 3rd Party Suppliers Action | HTTP 201; action created |
| 2 | Send a POST request to create 3rd Party Suppliers Residual Risk | HTTP 201; residual risk created |
| 3 | Send a GET request to confirm both entities | HTTP 200; action and residual risk present |
| 4 | Send a DELETE request to remove the action | HTTP 200; action deleted |

**Coverage dimension:** Happy Path

---

## 10. Static Code Analysis Domain

#### `INT-INGEST-SCA-001` — CRUD cycle for Static Code Analysis Tools [P1]

**Preconditions:** Valid OAuth token; existing release in editable state with Static Code Analysis write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/StaticCodeAnalysis/CreateStaticCodeAnalysisTool` with valid tool name and details | HTTP 201; SCA tool created |
| 2 | Send a GET request to retrieve SCA tools | HTTP 200; tool data matches |
| 3 | Send a PUT request to update the tool details | HTTP 200; update confirmed |
| 4 | Send a DELETE request to remove the tool | HTTP 200; tool deleted |
| 5 | Send a GET request for the deleted tool | HTTP 404; tool no longer exists |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-SCA-002` — Static Code Analysis Actions and Residual Risk [P2]

**Preconditions:** Valid OAuth token; existing release with SCA write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create an SCA Action | HTTP 201; action created |
| 2 | Send a POST request to create SCA Residual Risk | HTTP 201; residual risk created |
| 3 | Send a GET request to confirm both entities | HTTP 200; action and residual risk present |
| 4 | Send a PUT request to update the action | HTTP 200; update confirmed |
| 5 | Send a DELETE request to remove the action | HTTP 200; action deleted |

**Coverage dimension:** Happy Path

---

## 11. Software Composition Analysis Domain

#### `INT-INGEST-SWCOMP-001` — CRUD cycle for SCA Records + Vulnerable Components [P1]

**Preconditions:** Valid OAuth token; existing release in editable state with Software Composition Analysis write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/SoftwareCompositionAnalysis/CreateSoftwareCompositionAnalysis` with valid payload | HTTP 201; SCA record created |
| 2 | Send a POST request to create a Third Party Component with Vulnerability | HTTP 201; vulnerable component created |
| 3 | Send a GET request to retrieve the SCA record and components | HTTP 200; both entities present |
| 4 | Send a PUT request to update the vulnerable component | HTTP 200; update confirmed |
| 5 | Send a DELETE request to remove the vulnerable component | HTTP 200; component deleted |
| 6 | Send a DELETE request to remove the SCA record | HTTP 200; record deleted |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-SWCOMP-002` — Software Composition Analysis Actions and Residual Risk [P2]

**Preconditions:** Valid OAuth token; existing release with SCA write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a Software Composition Analysis Action | HTTP 201; action created |
| 2 | Send a POST request to create Software Composition Analysis Residual Risk | HTTP 201; residual risk created |
| 3 | Send a GET request to confirm both entities | HTTP 200; action and residual risk present |
| 4 | Send a DELETE request to remove the action | HTTP 200; action deleted |

**Coverage dimension:** Happy Path

---

## 12. FOSS Check Domain

#### `INT-INGEST-FOSS-001` — CRUD cycle for FOSS Check Licensing Compliance [P1]

**Preconditions:** Valid OAuth token; existing release in editable state with FOSS Check write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/FOSSCheck/CreateFOSSCheckLicensingCompliance` with valid payload | HTTP 201; licensing compliance record created |
| 2 | Send a GET request to retrieve the licensing compliance record | HTTP 200; data matches the POST payload |
| 3 | Send a PUT request to update the licensing compliance | HTTP 200; update confirmed |
| 4 | Send a GET request to confirm the update | HTTP 200; response matches the PUT payload |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-FOSS-002` — FOSS Check Actions CRUD [P2]

**Preconditions:** Valid OAuth token; existing release with FOSS Check write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a FOSS Check Action | HTTP 201; action created |
| 2 | Send a GET request to retrieve the action | HTTP 200; action data matches |
| 3 | Send a PUT request to update the action | HTTP 200; update confirmed |
| 4 | Send a DELETE request to remove the action | HTTP 200; action deleted |
| 5 | Send a GET request for the deleted action | HTTP 404; action no longer exists |

**Coverage dimension:** Happy Path

---

## 13. Security Defects Domain

#### `INT-INGEST-SECDEF-001` — CRUD cycle for Pen Test Details + SVV Issues [P1]

**Preconditions:** Valid OAuth token; existing release in editable state with Security Defects write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/SecurityDefects/CreateSecurityDefectsPenTestDetails` with valid payload | HTTP 201; pen test details created |
| 2 | Send a POST request to create an SVV Issue | HTTP 201; SVV issue created with identifier |
| 3 | Send a GET request to retrieve pen test details and SVV issues | HTTP 200; both entities present |
| 4 | Send a PUT request to update the SVV issue | HTTP 200; update confirmed |
| 5 | Send a DELETE request to remove the SVV issue | HTTP 200; SVV issue deleted |
| 6 | Send a GET request for the deleted SVV issue | HTTP 404; issue no longer exists |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-SECDEF-002` — Security Defects Actions and Residual Risk [P2]

**Preconditions:** Valid OAuth token; existing release with Security Defects write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a Security Defects Action | HTTP 201; action created |
| 2 | Send a POST request to create Security Defects Residual Risk | HTTP 201; residual risk created |
| 3 | Send a POST request to create Security Defects Risk Classification | HTTP 201; risk classification created |
| 4 | Send a GET request to confirm all three entities | HTTP 200; action, residual risk, and risk classification present |
| 5 | Send a DELETE request to remove the action | HTTP 200; action deleted |

**Coverage dimension:** Happy Path

---

## 14. External Vulnerabilities Domain

#### `INT-INGEST-EXTVULN-001` — CRUD cycle for External Vulnerability Issues [P1]

**Preconditions:** Valid OAuth token; existing release in editable state with External Vulnerabilities write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/ExternalVulnerabilities/CreateExternalVulnerabilityIssue` with valid payload | HTTP 201; issue created |
| 2 | Send a GET request to retrieve the issue | HTTP 200; issue data matches |
| 3 | Send a PUT request to update the issue | HTTP 200; update confirmed |
| 4 | Send a DELETE request to remove the issue | HTTP 200; issue deleted |
| 5 | Send a GET request for the deleted issue | HTTP 404; issue no longer exists |

**Coverage dimension:** Happy Path, Data Integrity

---

#### `INT-INGEST-EXTVULN-002` — External Vulnerabilities Actions and Residual Risk [P2]

**Preconditions:** Valid OAuth token; existing release with External Vulnerabilities write permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create an External Vulnerabilities Action | HTTP 201; action created |
| 2 | Send a POST request to create External Vulnerabilities Residual Risk | HTTP 201; residual risk created |
| 3 | Send a GET request to confirm both entities | HTTP 200; action and residual risk present |
| 4 | Send a DELETE request to remove the action | HTTP 200; action deleted |

**Coverage dimension:** Happy Path

---

## 15. Reference Data Domain

#### `INT-INGEST-REFDATA-001` — Retrieve valid Reference Data LoV by entity code [P1]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to `/ReferenceData_GetLoV/YesNo` | HTTP 200; response contains an array of LoV items with at least `Yes` and `No` values |
| 2 | Send a GET request to `/ReferenceData_GetLoV/ResidualRisk` | HTTP 200; response contains residual risk level values |
| 3 | Send a GET request to `/ReferenceData_GetLoV/ActionItemStatus` | HTTP 200; response contains action item status values |

**Coverage dimension:** Happy Path

---

#### `INT-INGEST-REFDATA-002` — Invalid entity code returns error [P2]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to `/ReferenceData_GetLoV/InvalidEntityCode` | HTTP 400 or 404; response indicates invalid entity code |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-REFDATA-003` — All documented entity codes return valid data [P2]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to `/ReferenceData_GetLoV/SDL_Gaps` | HTTP 200; non-empty array of LoV items |
| 2 | Send a GET request to `/ReferenceData_GetLoV/EvaluationStatus` | HTTP 200; non-empty array of LoV items |
| 3 | Send a GET request to `/ReferenceData_GetLoV/FCSRDecision` | HTTP 200; non-empty array of LoV items |
| 4 | Send a GET request to `/ReferenceData_GetLoV/SCATool` | HTTP 200; non-empty array of LoV items |
| 5 | Send a GET request to `/ReferenceData_GetLoV/IRARating` | HTTP 200; non-empty array of LoV items |
| 6 | Send a GET request to `/ReferenceData_GetLoV/PenTestType` | HTTP 200; non-empty array of LoV items |

**Coverage dimension:** Data Integrity
**Note:** This is a representative sample of 6 out of 30+ entity codes; full coverage can be parameterized

---

## 16. Cross-Domain Validation Rules

#### `INT-INGEST-VAL-001` — Invalid LoV value rejected across domains [P1]

**Preconditions:** Valid OAuth token; existing release in editable state

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a System Design component with an invalid `RiskLevelCountermeasure` value (not from LoV) | HTTP 400; response contains "Invalid data sent - RiskLevelCountermeasure" |
| 2 | Verify the same LoV validation applies to Threat Model by sending an invalid `IRARating` value | HTTP 400; response contains "Invalid data sent - IRARating" |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-VAL-002` — Invalid URL in link fields rejected [P1]

**Preconditions:** Valid OAuth token; existing release in editable state

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request with a link field containing an invalid URL (e.g., `not-a-url`) | HTTP 400; response contains "Invalid <field name>. Please confirm that you wrote the link correctly." |
| 2 | Send a POST request with a link field containing a valid URL (e.g., `https://example.com/report`) | HTTP 201; record created successfully |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-VAL-003` — Required field missing returns descriptive error [P1]

**Preconditions:** Valid OAuth token; existing release in editable state

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a resource with a mandatory field omitted | HTTP 400; response contains "<field name> not found or Empty" |
| 2 | Send the same POST request with the mandatory field populated | HTTP 201; resource created successfully |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-VAL-004` — IsOnboarding=True requires LastBUSecurityOfficerFCSRDate [P2]

**Preconditions:** Valid OAuth token; existing ProductId

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with `IsOnboarding=True` and `LastBUSecurityOfficerFCSRDate=null` | HTTP 400; response indicates LastBUSecurityOfficerFCSRDate is required when IsOnboarding is true |
| 2 | Send a POST request with `IsOnboarding=True` and a valid `LastBUSecurityOfficerFCSRDate` | HTTP 201; release created successfully |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-VAL-005` — ContinuousPenetrationTestingContractDate must differ from TargetReleaseDate [P3]

**Preconditions:** Valid OAuth token; existing ProductId

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with `ContinuousPenetrationTesting=True` and `ContinuousPenetrationTestingContractDate` equal to `TargetReleaseDate` | HTTP 400; response indicates the dates must be different |
| 2 | Send the same request with `ContinuousPenetrationTestingContractDate` different from `TargetReleaseDate` | HTTP 201; release created successfully |

**Coverage dimension:** Negative / Validation (edge case)

---

## 17. State-Based Editability

#### `INT-INGEST-STATE-001` — Data ingestion succeeds for all 5 editable states [P1]

**Preconditions:** Valid OAuth token; releases in each of the 5 editable states

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create data for a release in `INPROGRESS` state | HTTP 201; data created |
| 2 | Send a POST request to create data for a release in `FCSRREADINESSREVIEW` state | HTTP 201; data created |
| 3 | Send a POST request to create data for a release in `ACTIONSCLOSURE` state | HTTP 201; data created |
| 4 | Send a POST request to create data for a release in `FCSRREVIEW` state | HTTP 201; data created |
| 5 | Send a POST request to create data for a release in `FCSRESCALATED` state | HTTP 201; data created |

**Coverage dimension:** State Transitions

---

#### `INT-INGEST-STATE-002` — Data ingestion rejected for non-editable release state [P1]

**Preconditions:** Valid OAuth token; a release in a non-editable state (e.g., CLOSED, CANCELLED)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create data for a release in a non-editable state | HTTP 400 or 403; response contains "release is in a state where it is not possible to create or edit" |

**Coverage dimension:** State Transitions

---

#### `INT-INGEST-STATE-003` — PUT update rejected for non-editable release state [P2]

**Preconditions:** Valid OAuth token; a release in a non-editable state with existing data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a PUT request to update existing data on a release in a non-editable state | HTTP 400 or 403; response contains "release is in a state where it is not possible to create or edit" |

**Coverage dimension:** State Transitions

---

#### `INT-INGEST-STATE-004` — DELETE rejected for non-editable release state [P2]

**Preconditions:** Valid OAuth token; a release in a non-editable state with existing data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a DELETE request to remove data from a release in a non-editable state | HTTP 400 or 403; response contains "release is in a state where it is not possible to create or edit" |

**Coverage dimension:** State Transitions

---

## 18. Error Response Patterns

#### `INT-INGEST-ERR-001` — 404 for non-existent resource on GET [P1]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request for a release that does not exist (non-existent ProductId + ReleaseVersion) | HTTP 404; response indicates the resource was not found |
| 2 | Send a GET request for a non-existent System Design component ID | HTTP 404; response indicates the resource was not found |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-ERR-002` — 404 for DELETE on non-existent resource [P2]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a DELETE request for a resource ID that does not exist | HTTP 404; response indicates the resource was not found |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-ERR-003` — Malformed JSON payload returns 400 [P2]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with malformed JSON body (missing closing brace) | HTTP 400; response indicates invalid request format |

**Coverage dimension:** Negative / Validation

---

#### `INT-INGEST-ERR-004` — Empty request body returns 400 [P2]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/Release/CreateRelease` with an empty body | HTTP 400; response indicates required fields are missing |

**Coverage dimension:** Negative / Validation

---

## 19. UI Data Reflection

#### `INT-INGEST-UI-001` — Release created via API is visible in PICASso Release Detail page [P1]

**Preconditions:** A release successfully created via the Data Ingestion API; logged in as a user with access to the product

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page for the product used in API creation | The Product Detail page is visible |
| 2 | Click the `Releases` tab | At least 1 release row is visible in the Releases grid |
| 3 | Verify the release version created via API appears in the grid | A row containing the API-created `ReleaseVersion` is visible |
| 4 | Click the release version link to open Release Detail | The Release Detail page is visible; the `ChangeSummary` matches the API payload |

**Coverage dimension:** Data Integrity

---

#### `INT-INGEST-UI-002` — System Design data ingested via API is visible in Release SDL sections [P2]

**Preconditions:** System Design data successfully ingested via API for an existing release

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the release | The Release Detail page is visible |
| 2 | Click the `System Design` section/tab | The System Design section is visible |
| 3 | Verify the components created via API are displayed | At least 1 component row is visible; component data matches the API payload |

**Coverage dimension:** Data Integrity

---

#### `INT-INGEST-UI-003` — Actions created via API appear in the Actions management view [P2]

**Preconditions:** Actions created via API for at least one SDL domain on an existing release

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page for the release | The Release Detail page is visible |
| 2 | Navigate to the relevant SDL section's Actions view | The Actions list is visible |
| 3 | Verify the action created via API is displayed | At least 1 action row is visible; action title and status match the API payload |

**Coverage dimension:** Data Integrity

---

#### `INT-INGEST-UI-004` — Data deleted via API is removed from PICASso UI [P2]

**Preconditions:** A resource previously created via API then deleted via API DELETE endpoint

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the relevant section in PICASso UI where the resource was previously visible | The section is visible |
| 2 | Verify the deleted resource is no longer displayed | The resource is not visible in the list/grid; row count does not include the deleted item |

**Coverage dimension:** Data Integrity

---

## 20. Idempotency & Concurrency

#### `INT-INGEST-IDEM-001` — Duplicate POST for the same unique resource returns 403 [P2]

**Preconditions:** Valid OAuth token; a resource already created via POST

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to create a resource with the same unique identifier as an existing one | HTTP 403; response indicates the resource already exists |
| 2 | Send a GET request to verify the original resource is unchanged | HTTP 200; original data is intact and unmodified |

**Coverage dimension:** Data Integrity

---

#### `INT-INGEST-IDEM-002` — PUT to non-existent resource returns 404 [P2]

**Preconditions:** Valid OAuth token

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a PUT request to update a resource that does not exist | HTTP 404; response indicates the resource was not found |

**Coverage dimension:** Negative / Validation

---

## Summary

| Subsection | Scenario IDs | Count | P1 | P2 | P3 |
|------------|-------------|-------|----|----|-----|
| Authentication & Token Management | INT-INGEST-AUTH-001..005 | 5 | 4 | 1 | 0 |
| Consumer Configuration (BackOffice) | INT-INGEST-CONFIG-001..004 | 4 | 2 | 2 | 0 |
| Scope & Authorization | INT-INGEST-SCOPE-001..004 | 4 | 3 | 1 | 0 |
| Release Details Domain | INT-INGEST-RELEASE-001..006 | 6 | 3 | 2 | 1 |
| SDL Process Requirements Domain | INT-INGEST-SDLREQ-001..004 | 4 | 1 | 3 | 0 |
| System Design Domain | INT-INGEST-SYSDES-001..003 | 3 | 1 | 2 | 0 |
| Threat Model Domain | INT-INGEST-THREAT-001..003 | 3 | 1 | 2 | 0 |
| 3rd Party Suppliers Domain | INT-INGEST-3RDPARTY-001..003 | 3 | 1 | 2 | 0 |
| Static Code Analysis Domain | INT-INGEST-SCA-001..002 | 2 | 1 | 1 | 0 |
| Software Composition Analysis Domain | INT-INGEST-SWCOMP-001..002 | 2 | 1 | 1 | 0 |
| FOSS Check Domain | INT-INGEST-FOSS-001..002 | 2 | 1 | 1 | 0 |
| Security Defects Domain | INT-INGEST-SECDEF-001..002 | 2 | 1 | 1 | 0 |
| External Vulnerabilities Domain | INT-INGEST-EXTVULN-001..002 | 2 | 1 | 1 | 0 |
| Reference Data Domain | INT-INGEST-REFDATA-001..003 | 3 | 1 | 2 | 0 |
| Cross-Domain Validation | INT-INGEST-VAL-001..005 | 5 | 3 | 1 | 1 |
| State-Based Editability | INT-INGEST-STATE-001..004 | 4 | 2 | 2 | 0 |
| Error Response Patterns | INT-INGEST-ERR-001..004 | 4 | 1 | 3 | 0 |
| UI Data Reflection | INT-INGEST-UI-001..004 | 4 | 1 | 3 | 0 |
| Idempotency & Concurrency | INT-INGEST-IDEM-001..002 | 2 | 0 | 2 | 0 |
| **TOTAL** | | **64** | **29** | **33** | **2** |

### Priority Breakdown
- **P1 (Critical):** 29 scenarios — core auth, scope enforcement, happy-path CRUD per domain, key validation rules
- **P2 (Major):** 33 scenarios — secondary CRUD patterns, edge validation, UI reflection, error patterns
- **P3 (Edge):** 2 scenarios — boundary values (ChangeSummary length, date equality)

### Zero-Regression Assessment
All 5 coverage dimensions are satisfied:
- ✅ Happy Path: E2E CRUD for all 11 domains
- ✅ Negative/Validation: Required fields, LoV, links, conditional fields, boundaries
- ✅ Role-Based Access: Global/Org/Product scope, section grants, unregistered client
- ✅ State Transitions: All 5 editable states + non-editable rejection
- ✅ Data Integrity: POST→GET, PUT→GET, DELETE→GET(404), UI reflection
