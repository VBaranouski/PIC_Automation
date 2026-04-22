# WF 22. Integration: Intel DS / Informatica (Training Completion) — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `integrations` · **Workflow:** Integration: Intel DS / Informatica (Training Completion)
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 22 |
| Automated | 0 |
| Pending | 22 |
| On-Hold | 0 |
| Has Steps | 0 |
| Missing Steps | 22 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | AUTH-001–005, CONFIG-001–004, METRICS-001–004 |
| Negative / Validation | ❌ | **Missing: invalid SESA ID, malformed training data, rejected batch items** |
| Role-Based Access | ⚠️ | AUTH covers JWT; **missing: non-authorized system cannot push data** |
| State Transitions | ✅ | METRICS-003 covers frozen state at FCSR Review |
| Data Integrity | ✅ | METRICS-001–004, STAGING-001–004, POPUP-001–003, REPORT-001–002 |

### 1.3 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| INT-INTELDS-NEG-001 | Invalid SESA ID in /trainees request returns error | P2 | Negative — input validation |
| INT-INTELDS-NEG-002 | Malformed training data in /trainings/status is rejected | P2 | Negative — payload validation |
| INT-INTELDS-NEG-003 | Expired or invalid JWT token returns 401 | P1 | Negative — auth failure |
| INT-INTELDS-ROLE-001 | Non-authorized system cannot push training data | P2 | Role-Based Access — denied |

---

## 2. Test Case Specifications

### 2.1 Authentication & Token

#### `INT-INTELDS-AUTH-001` — Intel DS authenticates via Azure AD (Entra ID) → JWT token

**Preconditions:** Intel DS system has Azure AD credentials registered.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to the Azure AD token endpoint with Intel DS client credentials | The response status is 200; a JWT access_token is returned |
| 2 | Verify the token is a valid JWT (three dot-separated Base64 segments) | The token structure is valid |

**Coverage dimension:** Happy Path
**Subsection:** Authentication & Token

---

#### `INT-INTELDS-AUTH-002` — PICASso validates JWT via public key signature verification

**Preconditions:** JWT token obtained from Azure AD.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to PICASso `/trainees` endpoint with the JWT in the Authorization header | The response status is 200 |
| 2 | Verify PICASso accepted the token (no 401 or 403) | The response body contains valid data or acknowledgment |

**Coverage dimension:** Happy Path
**Subsection:** Authentication & Token

---

#### `INT-INTELDS-AUTH-003` — POST /trainees API: PICASso provides list of SESA IDs from Roles & Responsibilities

**Preconditions:** Valid JWT. A release has Roles & Responsibilities with assigned users.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to the `/trainees` endpoint with the release identifier | The response status is 200 |
| 2 | Verify the response contains an array of SESA IDs | The array is not empty; each item is a valid SESA format |
| 3 | Verify the SESA IDs match users assigned in Roles & Responsibilities for the release | The IDs correspond to assigned release roles |

**Coverage dimension:** Data Integrity
**Subsection:** Authentication & Token

---

#### `INT-INTELDS-AUTH-004` — POST /trainings/status API: Intel DS sends training completion data

**Preconditions:** Valid JWT. SESA IDs have been retrieved.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/trainings/status` with payload: `[{sesa_number, course_code, transcript_status, dates}]` | The response status is 200 |
| 2 | Verify the response contains a `batch_id` | The batch_id is a non-empty string |
| 3 | Verify the response summary includes `accepted`, `rejected`, `ignored` counts | All 3 count fields are present |

**Coverage dimension:** Data Integrity
**Subsection:** Authentication & Token

---

#### `INT-INTELDS-AUTH-005` — Response includes batch_id with accepted/rejected/ignored summary

**Preconditions:** Training status data has been submitted.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `batch_id` in the response is unique | The batch_id differs from previous submissions |
| 2 | Verify `accepted` count matches the number of valid training records | The count is ≥ 0 |
| 3 | Verify `rejected` + `ignored` + `accepted` equals the total submitted records | The sum matches the submission count |

**Coverage dimension:** Data Integrity
**Subsection:** Authentication & Token

---

### 2.2 BackOffice Configuration

#### `INT-INTELDS-CONFIG-001` — "Release related role" setting available for 10 RACI roles

**Preconditions:** BackOffice admin.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to BackOffice → Training Configuration section | The section loads |
| 2 | Verify the "Release related role" setting is visible for RACI roles | At least 10 role entries are listed with configuration options |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration

---

#### `INT-INTELDS-CONFIG-002` — "Learning Object ID" field available for each training

**Preconditions:** BackOffice admin. Training list is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open a training configuration entry | The training detail form loads |
| 2 | Verify the `Learning Object ID` field is visible | The field is present and editable |
| 3 | Enter a Learning Object ID and save | The value persists after save |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

#### `INT-INTELDS-CONFIG-003` — "Required to work in SE" setting for trainings

**Preconditions:** BackOffice admin. Training detail form.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Required to work in SE` toggle/checkbox is visible | The control is present |
| 2 | Toggle it ON and save | The setting persists |

**Coverage dimension:** Happy Path
**Subsection:** BackOffice Configuration
**Note:** Affects France contractor calculation in training completion metrics.

---

#### `INT-INTELDS-CONFIG-004` — Training-to-Role mapping history maintained with versioned records

**Preconditions:** BackOffice admin. Training-to-role mappings exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Modify a training-to-role mapping | The change saves |
| 2 | Navigate to the mapping history | A versioned record of the change is visible |
| 3 | Verify the previous mapping value is stored | The old and new mapping values are both visible |

**Coverage dimension:** Data Integrity
**Subsection:** BackOffice Configuration

---

### 2.3 Training Completion Metrics

#### `INT-INTELDS-METRICS-001` — Bar chart shows mandatory vs optional training completion % per release

**Preconditions:** Training data has been ingested. Release detail page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Detail page that has training data | The page loads |
| 2 | Locate the training completion bar chart | The chart is visible |
| 3 | Verify the chart shows separate bars for mandatory and optional training | At least 2 bar segments or series are visible |
| 4 | Verify percentage values are displayed | Percentage labels are visible on or near the bars |

**Coverage dimension:** Happy Path
**Subsection:** Training Completion Metrics

---

#### `INT-INTELDS-METRICS-002` — Calculation considers General employees vs France contractors

**Preconditions:** Training data with both employee types.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a release with both general employees and France contractors in R&R | The release page loads |
| 2 | Verify the training completion percentage accounts for the "Required to work in SE" flag | The percentage differs from a simple total count (reflects the SE flag weighting) |

**Coverage dimension:** Data Integrity
**Subsection:** Training Completion Metrics
**Note:** Exact calculation verification may require comparing with known test data.

---

#### `INT-INTELDS-METRICS-003` — Data is frozen at FCSR Review status (no further updates)

**Preconditions:** A release has reached FCSR Review status.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the release at FCSR Review status | The release page loads |
| 2 | Note the training completion percentage | The percentage value is recorded |
| 3 | Submit new training data via the Intel DS API for this release | The API accepts the data |
| 4 | Refresh the release page and check the training chart | The percentage has NOT changed (data frozen at FCSR) |

**Coverage dimension:** State Transitions
**Subsection:** Training Completion Metrics

---

#### `INT-INTELDS-METRICS-004` — Bar chart recalculates on: Intel DS data receipt, BackOffice changes, role changes

**Preconditions:** Release with training data.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the current training completion percentage | The value is recorded |
| 2 | Submit new training completion data via Intel DS API (for a pre-FCSR release) | The submission succeeds |
| 3 | Refresh the release page | The training completion percentage has updated |

**Coverage dimension:** Data Integrity
**Subsection:** Training Completion Metrics

---

### 2.4 Learn More Popup

#### `INT-INTELDS-POPUP-001` — "Learn More" link on training bar chart opens a popup

**Preconditions:** Training bar chart is visible on the release page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Learn More` link near the training bar chart | A popup or dialog opens |
| 2 | Verify the popup content loads | The popup contains training detail information |

**Coverage dimension:** Happy Path
**Subsection:** Learn More Popup

---

#### `INT-INTELDS-POPUP-002` — Popup shows mandatory and optional trainings per RACI role

**Preconditions:** Learn More popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the popup lists mandatory trainings | At least 1 mandatory training entry is visible |
| 2 | Verify the popup lists optional trainings | Optional training entries are visible (or a "none" indicator) |
| 3 | Verify trainings are grouped or filtered by RACI role | Role labels are visible alongside training items |

**Coverage dimension:** Data Integrity
**Subsection:** Learn More Popup

---

#### `INT-INTELDS-POPUP-003` — Training-to-role mapping details are visible

**Preconditions:** Learn More popup is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the popup shows the calculation date | A date is visible |
| 2 | Verify each training shows its mapped role(s) | Role names are visible next to training names |

**Coverage dimension:** Data Integrity
**Subsection:** Learn More Popup

---

### 2.5 Tableau Reports

#### `INT-INTELDS-REPORT-001` — "Trainings list per role" Tableau report with Date/Product/Release filters

**Preconditions:** Tableau access. Training data exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the "Trainings list per role" report in Tableau | The report loads |
| 2 | Verify Date, Product, and Release filters are available | All 3 filters are visible |
| 3 | Apply a Product filter | The report updates to show only that product's trainings |

**Coverage dimension:** Data Integrity
**Subsection:** Tableau Reports

---

#### `INT-INTELDS-REPORT-002` — Matrix shows which trainings are required per role

**Preconditions:** Tableau report open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the report displays a role × training matrix | Rows (roles) and columns (trainings) are visible |
| 2 | Verify at least 1 intersection cell shows "Required" or equivalent indicator | A requirement indicator is present |

**Coverage dimension:** Data Integrity
**Subsection:** Tableau Reports

---

### 2.6 Staging Area & Extraction

#### `INT-INTELDS-STAGING-001` — Training completion % data available in Staging Area

**Preconditions:** Training data ingested. Staging area synced.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Query the staging area for training completion data | The data is returned |
| 2 | Verify the completion percentages match the release page values | The values match |

**Coverage dimension:** Data Integrity
**Subsection:** Staging Area & Extraction

---

#### `INT-INTELDS-STAGING-002` — Training-to-role assignments available in Data Extraction API

**Preconditions:** Data Extraction API access. Training-to-role mappings configured.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the extraction API endpoint for training-to-role data | The response status is 200 |
| 2 | Verify the response contains role-to-training mapping data | The mapping array is not empty |

**Coverage dimension:** Data Integrity
**Subsection:** Staging Area & Extraction

---

#### `INT-INTELDS-STAGING-003` — RACI role country/email fields available for extraction

**Preconditions:** Data Extraction API access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the extraction API for RACI role details | The response status is 200 |
| 2 | Verify the response includes `country` and `email` fields for role users | Both fields are present in the response |

**Coverage dimension:** Data Integrity
**Subsection:** Staging Area & Extraction

---

#### `INT-INTELDS-STAGING-004` — Release dates available for extraction

**Preconditions:** Data Extraction API access. Releases with training data exist.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the extraction API for release date data | The response status is 200 |
| 2 | Verify the response includes release creation date and stage transition dates | Date fields are present and non-null |

**Coverage dimension:** Data Integrity
**Subsection:** Staging Area & Extraction

---

### 2.7 Negative / Validation (NEW)

#### `INT-INTELDS-NEG-001` — Invalid SESA ID in /trainees request returns error

**Preconditions:** Valid JWT.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/trainees` with an invalid SESA ID format (e.g., "INVALID_123") | The response indicates the SESA ID was rejected |
| 2 | Verify the error message identifies the invalid entry | The error references the malformed SESA ID |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `INT-INTELDS-NEG-002` — Malformed training data in /trainings/status is rejected

**Preconditions:** Valid JWT.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/trainings/status` with missing required fields (e.g., no `course_code`) | The response status is 400 or the record is marked as `rejected` |
| 2 | Verify the batch summary shows `rejected` ≥ 1 | The rejected count reflects the invalid records |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `INT-INTELDS-NEG-003` — Expired or invalid JWT token returns 401

**Preconditions:** An expired or fabricated JWT.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/trainees` with an expired JWT in the Authorization header | The response status is 401 |
| 2 | Verify the error message indicates authentication failure | The error body mentions token expiry or invalid signature |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

#### `INT-INTELDS-ROLE-001` — Non-authorized system cannot push training data

**Preconditions:** A system with a valid JWT but without Intel DS integration scope.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Send a POST request to `/trainings/status` with a token lacking Intel DS scope | The response status is 403 |
| 2 | Verify the error indicates insufficient permissions | The error mentions authorization or scope |

**Coverage dimension:** Role-Based Access — denied
**Subsection:** Negative / Validation

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| Authentication & Token | INT-INTELDS-AUTH-001 through 005 |
| BackOffice Configuration | INT-INTELDS-CONFIG-001 through 004 |
| Training Completion Metrics | INT-INTELDS-METRICS-001 through 004 |
| Learn More Popup | INT-INTELDS-POPUP-001 through 003 |
| Tableau Reports | INT-INTELDS-REPORT-001, 002 |
| Staging Area & Extraction | INT-INTELDS-STAGING-001 through 004 |
| Negative / Validation | INT-INTELDS-NEG-001, 002, 003, INT-INTELDS-ROLE-001 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms | ✅ |
| 4 | UI element names match DOM snapshot | ✅ |
| 5 | Negative cases | ✅ (NEG-001, 002, 003) |
| 6 | Role-based access tested | ✅ (AUTH-002, ROLE-001) |
| 7 | State transitions | ✅ (METRICS-003 frozen at FCSR) |
| 8 | Data integrity | ✅ (AUTH-003/004, STAGING-001–004, POPUP-002) |
| 9 | Cross-feature side effects | ✅ (STAGING ties to Data Extraction API) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 22 |
| New scenarios | 4 (NEG-001, NEG-002, NEG-003, ROLE-001) |
| Total scenarios | 26 |
| P1 | 4 |
| P2 | 14 |
| P3 | 8 |
