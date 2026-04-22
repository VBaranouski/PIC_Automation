# WF 21. Integration: Data Ingestion API — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `integrations` · **Workflow:** Integration: Data Ingestion API
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 19 |
| Automated | 0 |
| Pending | 19 |
| On-Hold | 0 |
| Has Steps | 0 |
| Missing Steps | 19 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | API-001–011 cover all 11 domain endpoints; AUTH-001–004 cover OAuth |
| Negative / Validation | ⚠️ | AUTH-004 covers 401/403; **missing: malformed payload, invalid domain data** |
| Role-Based Access | ✅ | AUTH-003 covers scope mapping; AUTH-004 covers insufficient scope |
| State Transitions | N/A | API is stateless write operations |
| Data Integrity | ⚠️ | UI-001–003 cover UI reflection; **missing: idempotency, duplicate detection** |

### 1.3 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| INT-INGEST-NEG-001 | Malformed JSON payload returns 400 Bad Request | P2 | Negative — input validation |
| INT-INGEST-NEG-002 | Missing required fields return descriptive error | P2 | Negative — field validation |
| INT-INGEST-IDEM-001 | Submitting the same data twice does not create duplicate records | P2 | Data Integrity — idempotency |

---

## 2. Test Case Specifications

### 2.1 Domain Endpoints

#### `INT-INGEST-API-001` — Release domain: Create, Update, Get operations work correctly

**Preconditions:** Valid OAuth token with appropriate scope.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to the Release Create endpoint with valid payload | The response status is 200 or 201; a release ID is returned |
| 2 | Send a PUT request to the Release Update endpoint with modified fields | The response status is 200; the updated fields are reflected |
| 3 | Send a GET request for the created release | The response contains the release with updated field values |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-002` — SDL Process Requirements Summary domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit requirements data via the Process Requirements endpoint | The response status is 200 |
| 2 | Submit actions data | The response status is 200 |
| 3 | Submit residual risk data | The response status is 200 |
| 4 | Verify open requirements can be queried | The response returns the submitted data |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-003` — System Design domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit system design info via the endpoint | The response status is 200 |
| 2 | Submit actions, components, countermeasures, residual risk | Each response status is 200 |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-004` — Threat Model domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit threat model details, severity stats, accepted threats, actions, mitigations, residual risk | Each response status is 200 |
| 2 | Verify data is queryable via the threat model GET endpoint | The response contains the submitted threat model data |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-005` — 3rd Party Suppliers & SE Bricks domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit TPS products and SE bricks data | The response status is 200 |
| 2 | Submit actions and residual risk | The response status is 200 |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-006` — Static Code Analysis domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit SCA tool details via the endpoint | The response status is 200 |
| 2 | Submit residual risk and actions | The response status is 200 |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-007` — Software Composition Analysis domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit SCA details and 3rd-party components with vulnerabilities | The response status is 200 |
| 2 | Submit actions and residual risk | The response status is 200 |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-008` — FOSS Check domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit FOSS details via the endpoint | The response status is 200 |
| 2 | Submit actions | The response status is 200 |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-009` — Security Defects domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit SVV test issues and pen test details | The response status is 200 |
| 2 | Submit actions and residual risk | The response status is 200 |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-010` — External Vulnerabilities domain operations

**Preconditions:** Valid token. A release exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit external vulnerability details | The response status is 200 |
| 2 | Submit residual risk and actions | The response status is 200 |

**Coverage dimension:** Happy Path
**Subsection:** Domain Endpoints

---

#### `INT-INGEST-API-011` — Reference Data domain operations

**Preconditions:** Valid token.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to the Reference Data endpoint | The response status is 200 |
| 2 | Verify lookup tables and configuration data are returned | The response contains non-empty reference data arrays |

**Coverage dimension:** Data Integrity
**Subsection:** Domain Endpoints

---

### 2.2 Authentication & Authorization

#### `INT-INGEST-AUTH-001` — API uses OAuth 2.0 Client Credentials Grant via Azure AD

**Preconditions:** Azure AD app registered. Client credentials available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to the Azure AD token endpoint with client_id and client_secret | The response status is 200; an access_token is returned |
| 2 | Use the token to call an ingestion endpoint | The endpoint returns status 200 |

**Coverage dimension:** Happy Path
**Subsection:** Authentication & Authorization

---

#### `INT-INGEST-AUTH-002` — Consumer registers app in Entra ID; Client ID configured in BackOffice

**Preconditions:** Azure AD app registered.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → External Tools | The section loads |
| 2 | Verify the Client ID can be entered and saved | The Client ID field accepts the value and persists |

**Coverage dimension:** Data Integrity
**Subsection:** Authentication & Authorization

---

#### `INT-INGEST-AUTH-003` — Scope mapping per Client ID controls product/org level access

**Preconditions:** Client ID with specific scope defined.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to an ingestion endpoint for a product within scope | The response status is 200 |
| 2 | Send a POST request for a product OUTSIDE the configured scope | The response status is 403 |

**Coverage dimension:** Role-Based Access
**Subsection:** Authentication & Authorization

---

#### `INT-INGEST-AUTH-004` — Unauthenticated requests return 401; insufficient scope returns 403

**Preconditions:** No token / token with wrong scope.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to an ingestion endpoint without an Authorization header | The response status is 401 |
| 2 | Send a POST request with a token that has insufficient scope | The response status is 403 |

**Coverage dimension:** Negative / Validation
**Subsection:** Authentication & Authorization

---

### 2.3 UI Reflection

#### `INT-INGEST-UI-001` — Data ingested via API is visible in the PICASso UI

**Preconditions:** Data has been submitted via ingestion API.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in to PICASso and navigate to the release that received API data | The Release Detail page loads |
| 2 | Navigate to the relevant tab (e.g., Process Requirements) | The tab content loads |
| 3 | Verify the API-submitted data is visible | The data fields match the values submitted via API |

**Coverage dimension:** Data Integrity
**Subsection:** UI Reflection

---

#### `INT-INGEST-UI-002` — CI/CD-sourced data shows source attribution in the UI

**Preconditions:** Data submitted via API with CI/CD source attribution.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release data that was submitted via CI/CD API | The data is visible |
| 2 | Verify a source attribution indicator is visible | An indicator (e.g., "API" label or icon) marks the data as CI/CD-sourced |

**Coverage dimension:** Data Integrity
**Subsection:** UI Reflection

---

#### `INT-INGEST-UI-003` — RBAC adherence: API-ingested data respects role-based access

**Preconditions:** Data submitted via API. Users with different roles.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as a user with full access and view the API-submitted data | All data fields are visible |
| 2 | Log in as a user with restricted access | Only data within the user's scope is visible |

**Coverage dimension:** Role-Based Access
**Subsection:** UI Reflection

---

#### `INT-INGEST-UI-004` — API versioning is supported (v1, v2 endpoints)

**Preconditions:** Both v1 and v2 endpoints exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to the v1 endpoint | The response status is 200 |
| 2 | Send a POST request to the v2 endpoint | The response status is 200 |
| 3 | Verify both versions handle the request correctly | Response payloads are valid for their respective versions |

**Coverage dimension:** Data Integrity
**Subsection:** UI Reflection

---

### 2.4 Negative / Validation (NEW)

#### `INT-INGEST-NEG-001` — Malformed JSON payload returns 400 Bad Request

**Preconditions:** Valid token.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request with a malformed JSON body (e.g., missing closing brace) | The response status is 400 |
| 2 | Verify the error message indicates a parsing error | The error body mentions JSON or payload format |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `INT-INGEST-NEG-002` — Missing required fields return descriptive error

**Preconditions:** Valid token.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request with a valid JSON structure but missing a required field (e.g., `releaseName`) | The response status is 400 or 422 |
| 2 | Verify the error message identifies the missing field | The error names the specific missing or invalid field |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

### 2.5 Data Integrity (NEW)

#### `INT-INGEST-IDEM-001` — Submitting the same data twice does not create duplicate records

**Preconditions:** Valid token. Initial data submission has succeeded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send the same POST request with identical payload a second time | The response status is 200 (update, not duplicate creation) |
| 2 | Query the data via GET or UI | Only 1 record exists (no duplicate) |

**Coverage dimension:** Data Integrity
**Subsection:** Data Integrity

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| Domain Endpoints | INT-INGEST-API-001 through 011 |
| Authentication & Authorization | INT-INGEST-AUTH-001 through 004 |
| UI Reflection | INT-INGEST-UI-001 through 004 |
| Negative / Validation | INT-INGEST-NEG-001, 002 |
| Data Integrity | INT-INGEST-IDEM-001 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms | ✅ |
| 4 | UI element names match (API test — N/A for API; UI-001–003 match DOM) | ✅ |
| 5 | Negative cases | ✅ (AUTH-004, NEG-001, NEG-002) |
| 6 | Role-based access tested | ✅ (AUTH-003, AUTH-004, UI-003) |
| 7 | State transitions | N/A (stateless API) |
| 8 | Data integrity | ✅ (UI-001, IDEM-001, API-011) |
| 9 | Cross-feature side effects | ✅ (UI-001 verifies API→UI data flow) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 19 |
| New scenarios | 3 (NEG-001, NEG-002, IDEM-001) |
| Total scenarios | 22 |
| P1 | 4 |
| P2 | 13 |
| P3 | 5 |
