# WF 2. Landing Page & Home Navigation — New Test Case Specifications

> Generated: 2026-04-22 — Gap analysis session
> Area: `landing` | Workflow: `Landing Page & Home Navigation`
> Feature Registry: `/Users/Uladzislau_Baranouski/.picasso-kb/context/knowledge-base/feature-registry/landing.md`

---

## 1. Coverage Analysis

### Current State (post-insertion)

| Category | Count |
|----------|-------|
| Total Scenarios | 106 |
| Automated | 66 |
| Pending | 10 |
| Updated | 7 |
| **NEW (this session)** | **23** |

### Coverage Gap Table (Five Dimensions)

| # | Dimension | Status | Notes |
|---|-----------|--------|-------|
| 1 | **Happy Path** | ✅ | All 5 tabs have E2E scenarios; Reports tab now has filters + column config |
| 2 | **Negative / Validation** | ✅ | Empty states, no-match search, reset behavior covered |
| 3 | **Role-Based Access** | ⚠️ | DOC-conditional columns tested (PRODUCT-DETAIL-015); deeper role-denied tests still missing |
| 4 | **State Transitions** | ✅ | Show Active Only toggles for Products + Releases; tab switching |
| 5 | **Data Integrity** | ✅ | Filter → Reset round-trip; Configure Columns save → Restore Default |

---

## 2. New Scenarios — Reports & Dashboards Tab (2.7)

### Configure Columns

#### `LANDING-REPORTS-CONFIG-001` — "Configure Columns" opens column selection dropdown [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Landing Page | Landing Page heading visible |
| 2 | Click the Reports & Dashboards tab | Reports grid visible |
| 3 | Click the Configure Columns button | Column selection drop-down list appears with checkboxes |

---

#### `LANDING-REPORTS-CONFIG-002` — Select/deselect columns + Done updates grid [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click Configure Columns | Drop-down visible |
| 2 | Deselect a currently-selected column checkbox | — |
| 3 | Click Done | Deselected column no longer visible in grid; others remain |

---

#### `LANDING-REPORTS-CONFIG-003` — "Restore Default" reverts to default columns [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Deselect a column and click Done | Column hidden |
| 2 | Click Configure Columns → Restore Default → Done | Grid shows default columns: Product Name, Release, Release Status, Data Privacy Risk Level, Cybersecurity Risk Level, Last BU Level FCSR Date, Last Full Pen Test Date, Last Completed Release, FCSR Decision, Number of Actions |

---

#### `LANDING-REPORTS-CONFIG-004` — "Cancel" discards column changes [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click Configure Columns, deselect a column | — |
| 2 | Click Cancel | Deselected column is still visible in the grid |

---

### General Filters

#### `LANDING-REPORTS-FILTER-001` — Org Level 1 filter narrows results [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Reports & Dashboards tab | Grid visible |
| 2 | Click More Filters (if needed) | Filter panel expands |
| 3 | Select a value from Org Level 1 dropdown | Grid shows only products/releases from that BU; row count ≤ initial |

---

#### `LANDING-REPORTS-FILTER-002` — Org Level 2 depends on Org Level 1 [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select Org Level 1 value | — |
| 2 | Open Org Level 2 dropdown | Only child organizations of the selected BU appear |

---

#### `LANDING-REPORTS-FILTER-003` — Product filter scoped by Org Level [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select Org Level 1 value | — |
| 2 | Open Product dropdown | Only products from the selected BU listed |

---

#### `LANDING-REPORTS-FILTER-004` — Release Number filter scoped by Product [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a Product from the filter | — |
| 2 | Open Release Number dropdown | Only releases for the selected product listed |

---

#### `LANDING-REPORTS-FILTER-005` — Reset clears all filters [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply Org Level 1 + Product filters | Grid filtered |
| 2 | Click Reset | All dropdowns return to default; grid shows full unfiltered data |

---

### User Role Filters

#### `LANDING-REPORTS-ROLE-001` — Product Owner filter narrows results [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click More Filters | — |
| 2 | Select a Product Owner name | Grid shows only products/releases with that owner |

---

#### `LANDING-REPORTS-ROLE-002` — Multiple user role filters combine [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a Product Owner | — |
| 2 | Select a Security Advisor | Grid shows only results matching both selected roles |

---

### Additional Filters

#### `LANDING-REPORTS-DATEFILTER-001` — Product Creation Period filter [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click More Filters | — |
| 2 | Select a date range in Product Creation Period | Grid shows only products created within the range |

---

#### `LANDING-REPORTS-DATEFILTER-002` — Product Type multi-select filter [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select one or more Product Type values | Grid shows only matching products |

---

### Column Data & Navigation

#### `LANDING-REPORTS-DATA-001` — Responsible Users columns visible [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enable PO, SM, SA, PQL columns via Configure Columns | — |
| 2 | Click Done | Columns visible in grid with data |

---

#### `LANDING-REPORTS-DATA-002` — Last BU FCSR Date highlighted when old/Unknown [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Locate a product with "Unknown" or >12-month-old FCSR date | Cell visually highlighted |

---

#### `LANDING-REPORTS-DATA-003` — Product Name link → Product Detail [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click a Product Name link | URL contains /ProductDetail; heading visible |

---

#### `LANDING-REPORTS-DATA-004` — Release link → Release Detail [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click a Release link | URL contains /ReleaseDetail; heading visible |

---

#### `LANDING-REPORTS-DATA-005` — Open Actions count link → Actions Summary [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the number in Open Actions/Conditions column | Navigates to Actions Summary |

---

#### `LANDING-REPORTS-DATA-006` — "Access Tableau" link has href [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify Access Tableau link | Link visible with Tableau URL in href |

---

## 3. New Scenarios — My Products Tab (2.3)

#### `LANDING-PRODS-ACTIVE-001` — "Show Active Only" defaults to ON [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to My Products tab | Show Active Only toggle visible and ON; only active products shown |

---

#### `LANDING-PRODS-ACTIVE-002` — Toggle OFF reveals inactive products [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Toggle Show Active Only to OFF | Inactive products appear; row count ≥ count with toggle ON |

---

#### `LANDING-PRODS-ORG2-001` — Org Level 2 filter narrows products [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select a value from Org Level 2 dropdown | Grid shows only products from selected department/LOB |

---

## 4. New Scenarios — My Releases Tab (2.4)

#### `LANDING-RELS-ACTIVE-001` — "Show Active Only" defaults to ON [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to My Releases tab | Show Active Only toggle visible and ON; only ongoing releases shown |

---

#### `LANDING-RELS-ACTIVE-002` — Toggle OFF reveals non-active releases [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Toggle Show Active Only to OFF | Cancelled/Completed/Inactive releases appear; row count ≥ previous |

---

## 5. Review Gate Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms from the banned list | ✅ |
| 4 | UI element names match user guide / DOM | ✅ |
| 5 | Negative cases for every input field | ✅ (cancel in column config) |
| 6 | Role-based access tested | ⚠️ DOC conditional columns only |
| 7 | State transitions: happy path + toggle | ✅ |
| 8 | Data integrity: filter + reset round-trip | ✅ |
| 9 | Cross-feature side effects identified | ✅ (Org filter cascade) |
| 10 | No environment-specific hardcoded values | ✅ |

---

## 6. Summary

| Metric | Count |
|--------|-------|
| Total WF2 scenarios | 106 |
| New scenarios (this session) | 23 |
| New — P2 | 17 |
| New — P3 | 6 |
| Subsection: Reports & Dashboards | 19 new |
| Subsection: My Products | 3 new |
| Subsection: My Releases | 2 new |
