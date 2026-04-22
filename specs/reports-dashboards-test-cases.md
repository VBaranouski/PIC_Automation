# WF 17. Reports & Dashboards (Tableau Integration) — Test Case Specifications

> **Generated:** 2026-04-22 · **Feature Area:** `reports` · **Workflow:** Reports & Dashboards (Tableau Integration)
> **Skill:** `create-test-cases` v2

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 25 |
| Automated | 0 |
| Pending | 25 |
| On-Hold | 0 |
| Has Steps | 0 |
| Missing Steps | 25 |

### 1.2 Five-Dimension Coverage Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| Happy Path | ✅ | ACCESS-001–003, FCSR-001, LIFECYCLE-001–004, METRICS-001–009 |
| Negative / Validation | ⚠️ | **Missing: user without Tableau access cannot see button; empty org filter behavior** |
| Role-Based Access | ⚠️ | FCSR-002/003 cover role-scoped data; **missing: non-Tableau user cannot access** |
| State Transitions | N/A | Reports are read-only dashboards |
| Data Integrity | ✅ | METRICS-001–009, VERSION-001–005, ACCESS-004 |

### 1.3 New Scenarios to Fill Gaps

| ID | Title | Priority | Gap Filled |
|----|-------|----------|------------|
| REPORT-TABLEAU-ROLE-001 | Non-Tableau user does not see "Access Tableau" button | P2 | Role-Based Access — denied |
| REPORT-TABLEAU-ROLE-002 | BU-scoped user sees only their org hierarchy data | P2 | Role-Based Access — scoped |
| REPORT-TABLEAU-NEG-001 | Empty org filter selection shows "No data available" message | P3 | Negative — empty state |

---

## 2. Test Case Specifications

### 2.1 Access & Navigation

#### `REPORT-TABLEAU-ACCESS-001` — "Access Tableau" button is visible on the landing page (role-dependent)

**Preconditions:** User is logged in with a role that has Tableau access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The Landing Page loads |
| 2 | Click the `Reports & Dashboards` tab | The Reports tab content loads |
| 3 | Verify the `Access Tableau` button is visible | The button is visible |

**Coverage dimension:** Happy Path
**Subsection:** Access & Navigation

---

#### `REPORT-TABLEAU-ACCESS-002` — Clicking "Access Tableau" opens Tableau dashboard in a new window/tab

**Preconditions:** "Access Tableau" button is visible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the `Access Tableau` button | A new browser tab/window opens |
| 2 | Verify the new tab contains the Tableau dashboard URL | The URL contains the Tableau domain |

**Coverage dimension:** Happy Path
**Subsection:** Access & Navigation

---

#### `REPORT-TABLEAU-ACCESS-003` — Summary Dashboard loads with dynamic filtering capabilities

**Preconditions:** Tableau dashboard is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the dashboard loads with visible filter controls | At least 1 filter dropdown is visible |
| 2 | Verify the dashboard contains chart or table content | Visual report elements are visible |

**Coverage dimension:** Happy Path
**Subsection:** Access & Navigation

---

#### `REPORT-TABLEAU-ACCESS-004` — 4-level Org filters: Org Level 1 → Org Level 2 → Org Level 3 → Product (cascading)

**Preconditions:** Tableau dashboard is open with filter controls.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the `Org Level 1` filter is visible | The filter is visible with options |
| 2 | Select an `Org Level 1` value | The `Org Level 2` filter updates to show only child values |
| 3 | Select an `Org Level 2` value | The `Org Level 3` filter updates to show only child values |
| 4 | Select an `Org Level 3` value | The `Product` filter updates to show only products in that org |

**Coverage dimension:** Data Integrity
**Subsection:** Access & Navigation

---

### 2.2 FCSR Reporting

#### `REPORT-TABLEAU-FCSR-001` — Quarterly FCSR metrics are shown by BU/LOB/Entity

**Preconditions:** Tableau dashboard open. FCSR report section.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the FCSR metrics section of the dashboard | The FCSR report area is visible |
| 2 | Verify metrics are broken down by organizational level | BU, LOB, or Entity labels are visible |
| 3 | Verify at least 1 FCSR metric value is displayed | A numeric or chart metric is visible |

**Coverage dimension:** Happy Path
**Subsection:** FCSR Reporting

---

#### `REPORT-TABLEAU-FCSR-002` — Role-based view permissions: BU Security Officer, LOB Security Leader, SVP LoB, CSPO/CISO

**Preconditions:** Users with different report roles have Tableau access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as a BU Security Officer and open the FCSR report | Data for the user's BU is visible |
| 2 | Log in as a LOB Security Leader and open the FCSR report | Data for the user's LOB is visible |
| 3 | Verify each user sees only their scoped data | No cross-BU/LOB data is visible |

**Coverage dimension:** Role-Based Access
**Subsection:** FCSR Reporting

---

#### `REPORT-TABLEAU-FCSR-003` — Data visibility is role-scoped (users see only their org hierarchy data)

**Preconditions:** Two users with different org scopes.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as User A (Org Level 1 = "BU Alpha") and open reports | Only BU Alpha data is visible |
| 2 | Log in as User B (Org Level 1 = "BU Beta") and open reports | Only BU Beta data is visible |
| 3 | Verify User A cannot see BU Beta data | BU Beta products/releases are absent |

**Coverage dimension:** Role-Based Access
**Subsection:** FCSR Reporting

---

### 2.3 Lifecycle Reports

#### `REPORT-TABLEAU-LIFECYCLE-001` — Product Lifecycle Status dashboard shows product status distribution

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Lifecycle Status section | The lifecycle chart is visible |
| 2 | Verify product status categories are shown | At least 2 status categories are visible (e.g., Active, Inactive) |

**Coverage dimension:** Happy Path
**Subsection:** Lifecycle Reports

---

#### `REPORT-TABLEAU-LIFECYCLE-002` — Red Flag Reporting highlights products with critical issues

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Red Flag Reporting section | The report area is visible |
| 2 | Verify highlighted products are listed | At least 1 product with a critical flag indicator is visible (or an empty state message) |

**Coverage dimension:** Happy Path
**Subsection:** Lifecycle Reports

---

#### `REPORT-TABLEAU-LIFECYCLE-003` — Product Security Posture details shows security metrics per product

**Preconditions:** Tableau dashboard open with a product selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Security Posture section | The posture detail is visible |
| 2 | Verify security metric values are shown for the selected product | At least 1 security metric is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Lifecycle Reports

---

#### `REPORT-TABLEAU-LIFECYCLE-004` — Release Security Posture details shows security metrics per release

**Preconditions:** Tableau dashboard open with a release selected.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Release Security Posture section | The posture detail is visible |
| 2 | Verify security metrics are shown for the selected release | At least 1 security metric is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Lifecycle Reports

---

### 2.4 Metrics

#### `REPORT-TABLEAU-METRICS-001` — FCSR Approval Decision metric is displayed

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the FCSR Approval Decision metric is visible on the dashboard | The metric label and value are visible |

**Coverage dimension:** Happy Path
**Subsection:** Metrics

---

#### `REPORT-TABLEAU-METRICS-002` — Pen Test completed metric is displayed

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Pen Test completed metric is visible | The metric label and value are visible |

**Coverage dimension:** Happy Path
**Subsection:** Metrics

---

#### `REPORT-TABLEAU-METRICS-003` — SBOM Submitted metric is displayed

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the SBOM Submitted metric is visible | The metric label and value are visible |

**Coverage dimension:** Happy Path
**Subsection:** Metrics

---

#### `REPORT-TABLEAU-METRICS-004` — SDL Completeness metric is displayed

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the SDL Completeness metric is visible | The metric label and value are visible |

**Coverage dimension:** Happy Path
**Subsection:** Metrics

---

#### `REPORT-TABLEAU-METRICS-005` — Security Defects count metric is displayed

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Security Defects count metric is visible | The metric label and value are visible |

**Coverage dimension:** Happy Path
**Subsection:** Metrics

---

#### `REPORT-TABLEAU-METRICS-006` — Test coverage metric is displayed

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Test coverage metric is visible | The metric label and value are visible |

**Coverage dimension:** Happy Path
**Subsection:** Metrics

---

#### `REPORT-TABLEAU-METRICS-007` — Risk ratings metric is displayed

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Risk ratings metric is visible | The metric label and value are visible |

**Coverage dimension:** Happy Path
**Subsection:** Metrics

---

#### `REPORT-TABLEAU-METRICS-008` — Data Privacy risk level metric is displayed

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the Data Privacy risk level metric is visible | The metric label and value are visible |

**Coverage dimension:** Happy Path
**Subsection:** Metrics

---

#### `REPORT-TABLEAU-METRICS-009` — Daily permission sync ensures role-based data visibility is current

**Preconditions:** Tableau dashboard. User role has been recently changed.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify the user's data scope reflects their current role assignment | Only data matching the user's current role scope is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Metrics
**Note:** Timing-dependent; may need to run after the nightly sync.

---

### 2.5 Requirements Versioning Reports

#### `REPORT-TABLEAU-VERSION-001` — Product Requirements actual on Date report

**Preconditions:** Tableau dashboard open. At least 1 product requirement has versioned history.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Requirements actual on Date report | The report loads |
| 2 | Verify the Date filter defaults to today | The date filter shows today's date |
| 3 | Verify the Product/Release filter is available | The filter is visible |
| 4 | Verify requirement rows are visible | At least 1 requirement row with all fields is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements Versioning Reports

---

#### `REPORT-TABLEAU-VERSION-002` — Process Requirements actual on Date report

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements actual on Date report | The report loads |
| 2 | Verify the Date filter defaults to today | The date filter shows today's date |
| 3 | Verify requirement rows are visible | At least 1 requirement row is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements Versioning Reports

---

#### `REPORT-TABLEAU-VERSION-003` — Product Requirements Versions history report

**Preconditions:** Tableau dashboard open. A product requirement has multiple versions.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Requirements Versions history report | The report loads |
| 2 | Verify filters: Requirement, Category, Source, "Show last version only" are available | All 4 filters are visible |
| 3 | Verify version rows are visible | At least 1 version row is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements Versioning Reports

---

#### `REPORT-TABLEAU-VERSION-004` — Process Requirements Versions history report

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Process Requirements Versions history report | The report loads |
| 2 | Verify filters: Requirement, SDL Practice, "Show last version only" are available | All 3 filters are visible |
| 3 | Verify version rows are visible | At least 1 version row is visible |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements Versioning Reports

---

#### `REPORT-TABLEAU-VERSION-005` — Product and Process Requirements Change history report

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Requirements Change history report | The report loads |
| 2 | Verify filters: Requirement, Activity, Updated field, Date range are available | All 4 filters are visible |
| 3 | Verify columns: Date, User, Code, Name, Activity, Updated field, Old Value, New Value | At least 8 column headers are visible |

**Coverage dimension:** Data Integrity
**Subsection:** Requirements Versioning Reports

---

### 2.6 Role-Based Access (NEW)

#### `REPORT-TABLEAU-ROLE-001` — Non-Tableau user does not see "Access Tableau" button

**Preconditions:** User is logged in with a role that does NOT have Tableau access.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page | The Landing Page loads |
| 2 | Click the `Reports & Dashboards` tab | The tab content loads |
| 3 | Verify the `Access Tableau` button is NOT visible | The button is absent from the page |

**Coverage dimension:** Role-Based Access — denied
**Subsection:** Role-Based Access

---

#### `REPORT-TABLEAU-ROLE-002` — BU-scoped user sees only their org hierarchy data

**Preconditions:** User has Tableau access scoped to a specific BU.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the Tableau dashboard | The dashboard loads |
| 2 | Verify the Org Level 1 filter pre-selects or shows only the user's BU | Only the user's BU appears in the filter |
| 3 | Verify all visible data rows belong to the user's org hierarchy | No data from other BUs is visible |

**Coverage dimension:** Role-Based Access — scoped
**Subsection:** Role-Based Access

---

### 2.7 Negative / Validation (NEW)

#### `REPORT-TABLEAU-NEG-001` — Empty org filter selection shows "No data available" message

**Preconditions:** Tableau dashboard open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Clear all org filter selections | Filters are empty |
| 2 | Verify the dashboard shows an empty state or "No data available" message | The report area shows a no-data indicator |

**Coverage dimension:** Negative / Validation
**Subsection:** Negative / Validation

---

## 3. Subsection Assignment Map

| Subsection | Scenario IDs |
|------------|-------------|
| Access & Navigation | REPORT-TABLEAU-ACCESS-001 through 004 |
| FCSR Reporting | REPORT-TABLEAU-FCSR-001 through 003 |
| Lifecycle Reports | REPORT-TABLEAU-LIFECYCLE-001 through 004 |
| Metrics | REPORT-TABLEAU-METRICS-001 through 009 |
| Requirements Versioning Reports | REPORT-TABLEAU-VERSION-001 through 005 |
| Role-Based Access | REPORT-TABLEAU-ROLE-001, 002 |
| Negative / Validation | REPORT-TABLEAU-NEG-001 |

## 4. Review Gate Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms | ✅ |
| 4 | UI element names match DOM snapshot | ✅ |
| 5 | Negative cases | ✅ (NEG-001) |
| 6 | Role-based access tested | ✅ (FCSR-002/003, ROLE-001, ROLE-002) |
| 7 | State transitions | N/A (read-only reports) |
| 8 | Data integrity | ✅ (ACCESS-004, VERSION-001–005, METRICS-009) |
| 9 | Cross-feature side effects | ✅ (VERSION reports consume BackOffice versioning data) |
| 10 | No environment-specific values | ✅ |
| 11 | Every scenario ID follows format | ✅ |
| 12 | Every scenario has steps | ✅ |
| 13 | No description starts with ID | ✅ |

## 5. Summary

| Metric | Value |
|--------|-------|
| Existing scenarios | 25 |
| New scenarios | 3 (ROLE-001, ROLE-002, NEG-001) |
| Total scenarios | 28 |
| P1 | 4 |
| P2 | 14 |
| P3 | 10 |
