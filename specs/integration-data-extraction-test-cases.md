# WF 20. Integration: Data Extraction API — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `integrations` · **Workflow:** Integration: Data Extraction API
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 12 |
| Automated | 0 |
| Pending | 12 |
| On-Hold | 0 |
| Has Steps | 0 |
| Missing Steps | 12 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | API-001–004 cover extraction endpoints; AUTH-001–004 cover authentication |
| Negative / Validation | ❌ | **Missing: invalid token, expired token, malformed request** |
| Role-Based Access | ⚠️ | AUTH covers OAuth flows; **missing: insufficient scope returns 403** |
| State Transitions | N/A | API is stateless read-only |
| Data Integrity | ⚠️ | **Missing: data schema validation, response shape correctness** |

### 1.3 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| INT-EXTRACT-NEG-001 | Invalid or expired OAuth token returns 401 Unauthorized | P1 | Negative — auth failure |
| INT-EXTRACT-NEG-002 | Request with insufficient scope returns 403 Forbidden | P2 | Negative — authorization |
| INT-EXTRACT-NEG-003 | Malformed query parameters return 400 Bad Request | P2 | Negative — input validation |
| INT-EXTRACT-SCHEMA-001 | Extraction endpoint response matches documented JSON schema | P2 | Data Integrity — schema |
| INT-EXTRACT-DPP-001 | dppReview sub-object included in release extraction when DPP applicable | P2 | Data Integrity — DPP |

---

## 2. Test Case Specifications

### 2.1 Core Extraction Endpoints

#### `INT-EXTRACT-API-001` — Data extracted from Staging Area DB (synced nightly with main DB)

**Preconditions:** API access configured. Test data exists in the staging area.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to an extraction endpoint (e.g., `/GRC_API/rest/v2/releases`) with valid credentials | The response status is 200 |
| 2 | Verify the response body contains JSON data | The response Content-Type is `application/json` |
| 3 | Verify the data reflects the nightly sync (matches known staging area data) | At least 1 release record is present |

**Coverage dimension:** Happy Path
**Subsection:** Core Extraction Endpoints

---

#### `INT-EXTRACT-API-002` — API documentation accessible at PPR and Prod URLs

**Preconditions:** Valid credentials.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to `/GRC_API/rest/v2/` | The response status is 200 |
| 2 | Verify the response contains API documentation content | The response includes endpoint descriptions or a Swagger/OpenAPI spec |

**Coverage dimension:** Happy Path
**Subsection:** Core Extraction Endpoints

---

#### `INT-EXTRACT-API-003` — All extraction endpoints return correct JSON data

**Preconditions:** Valid credentials and test data.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send GET requests to each extraction endpoint (releases, products, requirements, etc.) | Each response returns status 200 |
| 2 | Verify each response body is valid JSON | No parsing errors |
| 3 | Verify each response contains at least 1 data record | The `data` array is not empty |

**Coverage dimension:** Data Integrity
**Subsection:** Core Extraction Endpoints

---

#### `INT-EXTRACT-API-004` — Pagination and filtering parameters work correctly

**Preconditions:** Valid credentials. Endpoint supports pagination.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request with `?page=1&pageSize=5` | The response returns at most 5 records |
| 2 | Send a GET request with `?page=2&pageSize=5` | The response returns the next batch (different records) |
| 3 | Send a GET request with a filter parameter (e.g., `?status=Active`) | The response only contains records matching the filter |

**Coverage dimension:** Happy Path
**Subsection:** Core Extraction Endpoints

---

### 2.2 Authentication

#### `INT-EXTRACT-AUTH-001` — System-to-system: OAuth 2.0 Client Credentials flow works

**Preconditions:** Azure AD app registered. Client ID and secret available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to the OAuth token endpoint with client_id and client_secret | The response status is 200 |
| 2 | Verify the response contains an `access_token` field | The access token is a non-empty string |
| 3 | Use the access token to call an extraction endpoint | The endpoint returns status 200 with data |

**Coverage dimension:** Happy Path
**Subsection:** Authentication

---

#### `INT-EXTRACT-AUTH-002` — User-to-system: Authorization Code flow via PingID authenticates one user

**Preconditions:** User account with API access. PingID configured.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Initiate the Authorization Code flow (redirect to PingID login) | The login page loads |
| 2 | Enter valid user credentials | Authentication succeeds |
| 3 | Exchange the authorization code for an access token | An access token is returned |
| 4 | Use the access token to call an extraction endpoint | The endpoint returns status 200 |

**Coverage dimension:** Happy Path
**Subsection:** Authentication

---

#### `INT-EXTRACT-AUTH-003` — User-to-system (PowerQuery): Refresh token generated in PICASso UI

**Preconditions:** User with API access. PICASso PAT link available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the PAT link in PICASso UI | The token generation page loads |
| 2 | Click to generate a refresh token | A refresh token is displayed or downloadable |
| 3 | Verify the token file can be saved locally as `AccessToken.txt` | The file saves correctly |

**Coverage dimension:** Happy Path
**Subsection:** Authentication

---

#### `INT-EXTRACT-AUTH-004` — PowerQuery authentication: Excel Power Query M code retrieves data using stored token

**Preconditions:** Refresh token stored locally. Power Query M function configured.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the `fxCallAPIUsingRefreshToken` M function with the stored token | The function executes |
| 2 | Verify the function returns data from the extraction API | Data rows are returned (non-empty result set) |

**Coverage dimension:** Data Integrity
**Subsection:** Authentication
**Note:** Requires Excel/Power Query environment for full validation.

---

### 2.3 External Tool Configuration

#### `INT-EXTRACT-CONFIG-001` — External Tool created in BackOffice with scope definition

**Preconditions:** BackOffice admin access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → External Tools section | The section loads |
| 2 | Create a new External Tool entry | The creation form opens |
| 3 | Define the tool scope (product/org level) | The scope fields accept values |
| 4 | Save the configuration | The tool is saved and listed |

**Coverage dimension:** Happy Path
**Subsection:** External Tool Configuration

---

#### `INT-EXTRACT-CONFIG-002` — Azure AD app registration → Client ID configured in PICASso

**Preconditions:** Azure AD app is registered externally.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the External Tool configuration in BackOffice | The form loads |
| 2 | Enter the Azure AD Client ID | The field accepts the value |
| 3 | Save the configuration | The Client ID persists after save |

**Coverage dimension:** Data Integrity
**Subsection:** External Tool Configuration

---

#### `INT-EXTRACT-CONFIG-003` — PAT link in PICASso UI generates refresh token for PowerQuery

**Preconditions:** User with API access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the PAT management link | The PAT page loads |
| 2 | Click the generate/regenerate token action | A new token is generated |
| 3 | Verify the token value is displayed or available for download | The token is a non-empty string |

**Coverage dimension:** Happy Path
**Subsection:** External Tool Configuration

---

#### `INT-EXTRACT-CONFIG-004` — Token stored locally; Power Query references it for authentication

**Preconditions:** Token has been generated and stored as `AccessToken.txt`.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the token file exists locally | The file exists and is not empty |
| 2 | Verify the Power Query reference path points to the token file | The configuration references the correct file path |

**Coverage dimension:** Data Integrity
**Subsection:** External Tool Configuration
**Note:** Environment-specific validation; verify file exists.

---

### 2.4 Negative / Validation (NEW)

#### `INT-EXTRACT-NEG-001` — Invalid or expired OAuth token returns 401 Unauthorized

**Preconditions:** An expired or fabricated access token.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to an extraction endpoint with an invalid `Authorization: Bearer <invalid-token>` header | The response status is 401 |
| 2 | Verify the response body contains an error message | The error indicates authentication failure |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `INT-EXTRACT-NEG-002` — Request with insufficient scope returns 403 Forbidden

**Preconditions:** Valid token but scoped to a different product/org than requested.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to an extraction endpoint for a resource outside the token's scope | The response status is 403 |
| 2 | Verify the response body indicates insufficient permissions | The error message mentions scope or authorization |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `INT-EXTRACT-NEG-003` — Malformed query parameters return 400 Bad Request

**Preconditions:** Valid credentials.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request with malformed parameters (e.g., `?page=-1` or `?pageSize=abc`) | The response status is 400 |
| 2 | Verify the response body contains a validation error | The error describes the invalid parameter |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

### 2.5 Data Integrity (NEW)

#### `INT-EXTRACT-SCHEMA-001` — Extraction endpoint response matches documented JSON schema

**Preconditions:** Valid credentials. API documentation available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to the releases extraction endpoint | The response status is 200 |
| 2 | Validate the response against the documented JSON schema | All required fields are present; data types match |
| 3 | Verify nested objects (e.g., `roles`, `requirements`) match their sub-schemas | Nested structures are correct |

**Coverage dimension:** Data Integrity
**Subsection:** Data Integrity

---

#### `INT-EXTRACT-DPP-001` — dppReview sub-object included in release extraction when DPP applicable

**Preconditions:** A release with DPP applicable exists in the staging area.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a GET request to the release extraction endpoint for a DPP-applicable release | The response status is 200 |
| 2 | Verify the response contains a `dppReview` sub-object | The `dppReview` object is present (not null) |
| 3 | Verify the sub-object includes `privacyRisk`, `maturityLevelByPrivacySection`, `recommendation`, `pccDecision` | All 4 fields are present |

**Coverage dimension:** Data Integrity
**Subsection:** Data Integrity

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| Core Extraction Endpoints | INT-EXTRACT-API-001 through 004 |
| Authentication | INT-EXTRACT-AUTH-001 through 004 |
| External Tool Configuration | INT-EXTRACT-CONFIG-001 through 004 |
| Negative / Validation | INT-EXTRACT-NEG-001, 002, 003 |
| Data Integrity | INT-EXTRACT-SCHEMA-001, INT-EXTRACT-DPP-001 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms | ✅ |
| 4 | UI element names match (API test — N/A) | ✅ |
| 5 | Negative cases | ✅ (NEG-001, 002, 003) |
| 6 | Role-based access tested | ✅ (AUTH-001, NEG-002) |
| 7 | State transitions | N/A (stateless API) |
| 8 | Data integrity | ✅ (SCHEMA-001, DPP-001) |
| 9 | Cross-feature side effects | ✅ (DPP-001 validates DPP data in API) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 12 |
| New scenarios | 5 (NEG-001, NEG-002, NEG-003, SCHEMA-001, DPP-001) |
| Total scenarios | 17 |
| P1 | 3 |
| P2 | 10 |
| P3 | 4 |
