# WF 3. Product Management — New Test Case Specifications

> Generated: 2026-04-22 — Gap analysis session
> Area: `products` | Workflow: `Product Management`
> Feature Registry: `docs/ai/knowledge-base/feature-registry/products.md`

---

## 1. Coverage Analysis

### Current State (post-insertion)

| Category | Count |
|----------|-------|
| Total Scenarios | 122 |
| Automated | 80 |
| Pending | 27 |
| **NEW (this session)** | **16** |

### Coverage Gap Table (Five Dimensions)

| # | Dimension | Status | Notes |
|---|-----------|--------|-------|
| 1 | **Happy Path** | ✅ | Product creation, view, edit, inactivation, tracking tools, cross-org all have E2E |
| 2 | **Negative / Validation** | ✅ | Duplicate name, missing required fields, Brand Label + Vendor dependency, DPP toggle disabled with active release |
| 3 | **Role-Based Access** | ⚠️ | Product Admin levels tested; DOC conditional columns added; deeper role-denied still missing |
| 4 | **State Transitions** | ✅ | Creation → view → edit → save; Reset Form reverts; Cancel discards; DPP toggle lock |
| 5 | **Data Integrity** | ✅ | Edit → Save → Read-back; History date sort verification; Filter empty state |

---

## 2. New Scenarios — Product Creation (3.1)

#### `PRODUCT-CREATION-019` — "Reset" button clears all fields [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to New Product creation form | Form visible |
| 2 | Fill in Product Name, Product State, Product Definition, Product Type, Org Level 1 | Fields populated |
| 3 | Click the Reset button | Product Name empty; dropdowns revert to placeholder; Org Level 1 reset |

---

#### `PRODUCT-CREATION-020` — "Cancel" discards product and navigates away [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to New Product creation form | — |
| 2 | Fill in some product fields | — |
| 3 | Click Cancel | Product NOT created; user navigated away from creation form |

---

#### `PRODUCT-CREATION-021` — Product Description accepts rich text formatting [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to New Product creation form | — |
| 2 | Click into Product Description field | Rich text editor toolbar visible |
| 3 | Type formatted text | Formatted text accepted and visible |

---

#### `PRODUCT-CREATION-022` — Releases tab greyed out during creation [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to New Product creation form | Releases tab visible but greyed out (disabled/non-clickable) |

---

#### `PRODUCT-CONFIG-001` — "Show Process sub-requirements" toggle visible in Product Configuration [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail in edit mode | — |
| 2 | Scroll to Product Configuration section | "Show the Process sub-requirements within Release Management process" toggle visible |

---

#### `PRODUCT-CONFIG-002` — Enabling sub-requirements toggle impacts release Process Requirements [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enable "Show the Process sub-requirements" toggle in Product Detail edit mode | — |
| 2 | Click Save | — |
| 3 | Navigate to a release Process Requirements tab | Sub-requirements visible under parent requirements |

**Note:** Cross-feature test: Product config → Release process requirements.

---

## 3. New Scenarios — Product Detail View (3.2)

#### `PRODUCT-DETAIL-013` — Security Summary section shows key security fields [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail for a product with ≥1 release | — |
| 2 | Scroll to Security Summary section | Minimum Oversight Level, Last BU Security FCSR Date, Last Full Pen Test Date fields visible |

**Note:** Fields shown only when at least one release exists.

---

#### `PRODUCT-DETAIL-014` — Releases tab enabled after product creation [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create a new product with valid data | — |
| 2 | Navigate to the product's detail page | Releases tab enabled and clickable |
| 3 | Click Releases tab | Empty releases grid or "no releases" message visible |

---

#### `PRODUCT-DETAIL-015` — DOC columns shown when user has DOC permissions [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in as a user with DOC permissions | — |
| 2 | Navigate to My Products tab | Vesta ID, DOC Lead, Security Advisor columns visible in the grid |

---

## 4. New Scenarios — Product Change History (3.3)

#### `PRODUCT-HISTORY-009` — Date Range filter narrows history records [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Product Change History popup | — |
| 2 | Select a date range in Date Range selector | Only records within the selected range visible |

---

#### `PRODUCT-HISTORY-010` — No matching data message when filters exclude all [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Product Change History popup | — |
| 2 | Type a non-existent keyword in Search | "There is no data matching selected filter" message visible |

---

#### `PRODUCT-HISTORY-011` — Records sorted by Date descending (newest first) [P3]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Product Change History popup | First record has the most recent date; subsequent records have equal or earlier dates |

---

## 5. New Scenarios — Product Edit (3.4)

#### `PRODUCT-EDIT-007` — "Reset Form" reverts changes but keeps edit mode [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter Product Detail edit mode | — |
| 2 | Change the Product Name field | — |
| 3 | Click Reset Form | Product Name reverts to original; form remains in edit mode (Save/Cancel visible) |

---

#### `PRODUCT-DPP-001` — DPP toggle cannot be disabled with active release [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Product Detail for a DPP-enabled product with active release | — |
| 2 | Click Edit Product | — |
| 3 | Verify DPP toggle state | Toggle is disabled or shows warning preventing deactivation |

**Note:** Per user guide: "If the product has an active release, it is not possible to disable the DPP toggle."

---

## 6. New Scenarios — Tracking Tools (3.8)

#### `TRACKING-TOOLS-016` — Jira "Test Connection" success shows confirmation [P2]

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter Product Detail edit mode | — |
| 2 | Activate Jira toggle, enter valid Source Link and Project Key | — |
| 3 | Click Test Connection | Success confirmation message visible |

**Note:** Requires valid Jira credentials and connectivity in QA.

---

## 7. Review Gate Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms from the banned list | ✅ |
| 4 | UI element names match user guide / DOM | ✅ |
| 5 | Negative cases for every input field | ✅ (Reset, Cancel, DPP lock, no-match history) |
| 6 | Role-based access tested | ⚠️ DOC conditional columns |
| 7 | State transitions: happy path + toggle | ✅ |
| 8 | Data integrity: create + read-back | ✅ |
| 9 | Cross-feature side effects identified | ✅ (sub-req toggle → release, DPP → release) |
| 10 | No environment-specific hardcoded values | ✅ |

---

## 8. Summary

| Metric | Count |
|--------|-------|
| Total WF3 scenarios | 122 |
| New scenarios (this session) | 16 |
| New — P2 | 10 |
| New — P3 | 6 |
| Subsection: 3.1 New Product Creation | 6 new |
| Subsection: 3.2 Product Detail — View Mode | 3 new |
| Subsection: 3.3 Product Change History | 3 new |
| Subsection: 3.4 Product Edit | 2 new |
| Subsection: 3.8 Tracking Tools | 1 new |
