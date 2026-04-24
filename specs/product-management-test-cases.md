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

---

## 7. New Scenarios — Product Inactivation Gaps (3.7) — PIC-7643 / PIC-7648

> Source: [Confluence 561972034](https://confluence.se.com/spaces/PIC/pages/561972034/Product+Release+Inactivation) · PIC-6769 · PIC-7643 · PIC-7648
> Role allowed: `ProductAdmin` (holds `INACTIVATE_PRODUCT`)  |  Role denied: `Product Owner` (no `INACTIVATE_PRODUCT`)

#### `PRODUCT-INACTIVATE-005` — Inactivate button is disabled with tooltip when product has active releases or DOCs [P2]

**Preconditions:** Logged in as `ProductAdmin`. Navigate to the My Products tab. A product exists that has at least one active or completed release or DOC (not Cancelled/Inactive).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and open the `My Products` tab | The `My Products` grid is visible with at least 1 row |
| 2 | Locate a product that has ongoing or completed releases or DOCs | A product row is visible in the grid |
| 3 | Click the three-dot (⋮) Actions menu for that product row | The Actions menu opens |
| 4 | Hover over the `Inactivate` option | The `Inactivate` option is greyed-out (disabled); a tooltip reads "Product cannot be inactivated as it has ongoing and/or completed releases/DOCs. If this product is no longer commercialized nor supported, it's Product State attribute is to be set to 'End of Life'" |

**Coverage dimension:** Negative / Validation  
**Note:** Tests the disabled-state guard rule from PIC-7643 AC#4.

---

#### `PRODUCT-INACTIVATE-006` — Three-dot menu on Product Details page shows "Inactivate" option for eligible product [P1]

**Preconditions:** Logged in as `ProductAdmin`. A product exists with no active or completed releases/DOCs (only Cancelled or Inactive releases, or none at all).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page for an eligible product | The product header is visible with status badge and three-dot (⋮) button |
| 2 | Click the three-dot (⋮) button next to the product status in the header | A dropdown opens |
| 3 | Verify the `Inactivate` option is visible in the dropdown | The `Inactivate` menu item is visible and enabled |

**Coverage dimension:** Happy Path  
**Note:** Verifies the three-dot menu entry point on Product Details (separate from the My Products grid).

---

#### `PRODUCT-INACTIVATE-007` — Clicking "Inactivate" on Product Details opens confirmation modal [P1]

**Preconditions:** Logged in as `ProductAdmin`. Navigate to Product Details page of an eligible product.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page for an eligible product (no active releases/DOCs) | The product header with three-dot (⋮) button is visible |
| 2 | Click the three-dot (⋮) button next to the product status | The Actions dropdown opens with the `Inactivate` option |
| 3 | Click the `Inactivate` option | The `Inactivate Product` confirmation modal opens |
| 4 | Verify the modal contents | The modal title reads "Inactivate Product"; a confirmation prompt is visible reading "Are you sure you want to inactivate this Product? This action is irreversible."; a `Justification` text input is visible; `Cancel` and `Inactivate Product` buttons are present |

**Coverage dimension:** Happy Path

---

#### `PRODUCT-INACTIVATE-008` — Justification field is mandatory: submit blocked when empty [P2]

**Preconditions:** Logged in as `ProductAdmin`. The `Inactivate Product` confirmation modal is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the `Inactivate Product` confirmation modal (three-dot menu → Inactivate on Product Details) | The modal is visible with an empty `Justification` field |
| 2 | Leave the `Justification` field empty | The `Inactivate Product` submit button is disabled or a validation error is visible |
| 3 | Click the `Inactivate Product` button without entering justification | The inactivation is not submitted; validation error message or disabled state prevents submission |

**Coverage dimension:** Negative / Validation  
**Note:** Justification is a mandatory field per PIC-7643 AC#3.

---

#### `PRODUCT-INACTIVATE-009` — Cancel closes confirmation modal without changing product status [P2]

**Preconditions:** Logged in as `ProductAdmin`. The `Inactivate Product` confirmation modal is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the `Inactivate Product` confirmation modal | The modal is visible |
| 2 | Type a justification text in the `Justification` field | Text is entered |
| 3 | Click the `Cancel` button | The modal closes |
| 4 | Verify the product status on the Product Details page | The product status is unchanged (not Inactive) |

**Coverage dimension:** Negative / Validation

---

#### `PRODUCT-INACTIVATE-010` — Full E2E: submitting inactivation modal sets product status to Inactive [P1]

**Preconditions:** Logged in as `ProductAdmin`. An eligible product exists with no active or completed releases/DOCs. Note: this test is destructive — use a dedicated test product. Supersedes the FIXME note in PRODUCT-INACTIVATE-002.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page for the eligible test product | The product header is visible with current status |
| 2 | Click the three-dot (⋮) button next to the product status | The Actions dropdown opens |
| 3 | Click the `Inactivate` option | The `Inactivate Product` confirmation modal opens |
| 4 | Type a justification in the `Justification` field (e.g., "Test inactivation — automation") | The text is entered in the field |
| 5 | Click the `Inactivate Product` button | The modal closes; the product status badge changes to "Inactive" |
| 6 | Navigate to the `My Products` tab on the Landing Page | The product does not appear in the list when "Show Active Only" is ON |

**Coverage dimension:** Happy Path, Data Integrity  
**Note:** serial-dependent — relies on URL/state set by the preceding product setup. Use a dedicated, disposable product in the test environment.

---

#### `PRODUCT-INACTIVATE-011` — Inactive product is read-only: edit and release creation blocked [P2]

**Preconditions:** Logged in as `ProductAdmin`. A product in Inactive status exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page of an Inactive product | The product header shows "Inactive" status |
| 2 | Verify the `Edit Product` button or edit pencil icon | The `Edit Product` button is not present or is disabled |
| 3 | Navigate to the `Releases` tab of the inactive product | The "New Release" button is not visible or is disabled |

**Coverage dimension:** State Transitions  
**Note:** Per PIC-7643 AC — inactive products are read-only.

---

#### `PRODUCT-INACTIVATE-012` — Tooltip on Inactive status badge shows inactivation justification [P2]

**Preconditions:** Logged in as `ProductAdmin`. A product has been inactivated with a known justification text.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page of the Inactive product | The status badge shows "Inactive" |
| 2 | Hover over the "Inactive" status badge | A tooltip appears with text matching the pattern: "The product was inactivated due to \<justification\>." |
| 3 | Navigate to the `My Products` tab (with "Show Active Only" toggled OFF) | The product is visible in the list |
| 4 | Hover over the "Inactive" status badge in the My Products grid row | The same justification tooltip is displayed |

**Coverage dimension:** Data Integrity

---

#### `PRODUCT-INACTIVATE-013` — RBAC: Product Owner does not see Actions column in My Products grid [P2]

**Preconditions:** Logged in as `Product Owner` (does not hold `INACTIVATE_PRODUCT` privilege).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and open the `My Products` tab | The `My Products` grid is visible |
| 2 | Verify the presence of the `Actions` column in the My Products grid | The `Actions` column is not visible in the grid |
| 3 | Navigate to the Product Details page for a product in scope | The three-dot (⋮) button next to the product status is not present in the header |

**Coverage dimension:** Role-Based Access  
**Note:** Per PIC-7643 AC#5 — the Actions column and three-dot are hidden from users without `INACTIVATE_PRODUCT`.

---

## 8. New Scenarios — Release Inactivation (3.10) — PIC-7644 / PIC-7648

> New subsection · Source: PIC-7644, PIC-7648 · Prefix: `RELEASE-INACTIVATE-*`
> Role allowed: `ProductAdmin` (holds `INACTIVATE_RELEASE`)  |  Role denied: `Product Owner` (no `INACTIVATE_RELEASE`)

#### `RELEASE-INACTIVATE-001` — Actions column on Product's Releases tab shows Inactivate + Clone for Creation & Scoping release [P1]

**Preconditions:** Logged in as `ProductAdmin`. Navigate to Product Details > Releases tab. A release in "Creation & Scoping" stage exists.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details page and click the `Releases` tab | The Releases grid is visible |
| 2 | Verify the `Actions` column is present in the grid | The `Actions` column with a three-dot (⋮) icon is visible for each release row |
| 3 | Click the three-dot (⋮) icon in the `Actions` column for a release in "Creation & Scoping" stage | A dropdown opens |
| 4 | Verify the dropdown options | Both `Inactivate` and `Clone` options are visible and enabled |

**Coverage dimension:** Happy Path

---

#### `RELEASE-INACTIVATE-002` — My Releases tab shows Inactivate option for eligible releases [P2]

**Preconditions:** Logged in as `ProductAdmin`. A release in "Creation & Scoping" stage is accessible from the My Releases tab.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and open the `My Releases` tab | The `My Releases` grid is visible |
| 2 | Verify the `Actions` column is present | The `Actions` column with a three-dot (⋮) icon is visible for each release row |
| 3 | Click the three-dot (⋮) icon for a release in "Creation & Scoping" stage | The Actions dropdown opens with the `Inactivate` option visible |

**Coverage dimension:** Happy Path

---

#### `RELEASE-INACTIVATE-003` — Inactivate button is greyed out with tooltip for releases past Creation & Scoping [P2]

**Preconditions:** Logged in as `ProductAdmin`. A product has an active release in a stage past "Creation & Scoping" (e.g., Review & Confirm or later).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details > `Releases` tab | The Releases grid is visible |
| 2 | Click the three-dot (⋮) icon in the `Actions` column for a release past Creation & Scoping | The Actions dropdown opens |
| 3 | Hover over the `Inactivate` option | The `Inactivate` option is greyed-out; the tooltip reads "Release cannot be inactivated as it passed 'Creation & Scoping' stage. If this release is no longer valid, it can be cancelled." |

**Coverage dimension:** Negative / Validation  
**Note:** Per PIC-7644 AC#4.

---

#### `RELEASE-INACTIVATE-004` — Completed releases: only Clone shown in Actions (Inactivate absent) [P2]

**Preconditions:** Logged in as `ProductAdmin`. A product has a Completed release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details > `Releases` tab with "Show Active Only" toggled OFF | The Releases grid shows Completed releases |
| 2 | Click the three-dot (⋮) icon for a Completed release | The Actions dropdown opens |
| 3 | Verify the dropdown contents | Only `Clone` is visible; `Inactivate` is not present in the dropdown |

**Coverage dimension:** State Transitions  
**Note:** Per PIC-7644 AC#5 — Completed releases show only Clone.

---

#### `RELEASE-INACTIVATE-005` — Manually cancelled release shows Inactivate option in Actions [P2]

**Preconditions:** Logged in as `ProductAdmin`. A release was manually cancelled by a user (not cancelled due to No-Go FCSR Decision).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details > `Releases` tab with "Show Active Only" toggled OFF | The Releases grid shows Cancelled releases |
| 2 | Click the three-dot (⋮) icon for the manually Cancelled release | The Actions dropdown opens |
| 3 | Verify the `Inactivate` option | The `Inactivate` option is visible and enabled |

**Coverage dimension:** State Transitions  
**Note:** Per PIC-7644 AC#6 — manually cancelled releases can be inactivated.

---

#### `RELEASE-INACTIVATE-006` — No-Go FCSR cancelled release: Inactivate button is greyed out with tooltip [P2]

**Preconditions:** Logged in as `ProductAdmin`. A release was cancelled automatically due to a No-Go FCSR Decision.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details > `Releases` tab with "Show Active Only" toggled OFF | The Releases grid shows the No-Go cancelled release |
| 2 | Click the three-dot (⋮) icon for the No-Go cancelled release | The Actions dropdown opens |
| 3 | Hover over the `Inactivate` option | The `Inactivate` option is greyed-out; the tooltip reads "This release cannot be inactivated as it was cancelled due to 'No-Go' FCSR Decision." |

**Coverage dimension:** State Transitions, Negative / Validation  
**Note:** Per PIC-7644 AC#6 + bug fix PIC-8038 (Closed).

---

#### `RELEASE-INACTIVATE-007` — Clicking Inactivate on a release opens confirmation modal [P1]

**Preconditions:** Logged in as `ProductAdmin`. A release in "Creation & Scoping" stage is accessible.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details > `Releases` tab | The Releases grid is visible |
| 2 | Click the three-dot (⋮) icon for a release in "Creation & Scoping" stage | The Actions dropdown opens |
| 3 | Click the `Inactivate` option | The `Inactivate Release` confirmation modal opens |
| 4 | Verify the modal contents | The modal title reads "Inactivate Release"; the confirmation prompt reads "Are you sure you want to inactivate this Release? This action is irreversible."; a `Justification` text input is visible; `Cancel` and `Inactivate Release` buttons are present |

**Coverage dimension:** Happy Path

---

#### `RELEASE-INACTIVATE-008` — Justification field is mandatory in release inactivation modal [P2]

**Preconditions:** Logged in as `ProductAdmin`. The `Inactivate Release` confirmation modal is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the `Inactivate Release` confirmation modal | The modal is visible with an empty `Justification` field |
| 2 | Leave the `Justification` field empty | The `Inactivate Release` submit button is disabled or a validation indicator is present |
| 3 | Click the `Inactivate Release` button without entering justification | The inactivation is not submitted; the modal remains open with a validation error or disabled state |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-INACTIVATE-009` — Cancel closes release inactivation modal without status change [P2]

**Preconditions:** Logged in as `ProductAdmin`. The `Inactivate Release` confirmation modal is open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the `Inactivate Release` confirmation modal | The modal is visible |
| 2 | Type justification text in the `Justification` field | Text is entered |
| 3 | Click the `Cancel` button | The modal closes |
| 4 | Verify the release status in the Releases grid | The release status is unchanged (not Inactive) |

**Coverage dimension:** Negative / Validation

---

#### `RELEASE-INACTIVATE-010` — Full E2E: submitting inactivation changes release status to Inactive [P1]

**Preconditions:** Logged in as `ProductAdmin`. A dedicated test release in "Creation & Scoping" stage exists. Note: this test is destructive.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details > `Releases` tab | The Releases grid shows the test release in "Creation & Scoping" stage |
| 2 | Click the three-dot (⋮) icon for the test release | The Actions dropdown opens |
| 3 | Click `Inactivate` | The `Inactivate Release` confirmation modal opens |
| 4 | Type "Test inactivation — automation" in the `Justification` field | The text is entered |
| 5 | Click the `Inactivate Release` button | The modal closes; the release status in the grid changes to "Inactive" |
| 6 | Navigate to the `My Releases` tab on the Landing Page with "Show Active Only" toggled OFF | The release appears in the list with "Inactive" status |
| 7 | Verify it is possible to create a new release with the same name | The new release creation dialog accepts the same name (name re-use allowed after inactivation) |

**Coverage dimension:** Happy Path, Data Integrity  
**Note:** serial-dependent — relies on URL/state set by earlier product setup fixture.

---

#### `RELEASE-INACTIVATE-011` — "Show Active Only" toggle on Product Releases tab hides Inactive releases when ON [P2]

**Preconditions:** Logged in as `ProductAdmin`. A product has at least one Inactive release.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Details > `Releases` tab | The `Show Active Only` toggle is ON by default |
| 2 | Verify the Inactive release is not visible in the grid | The Inactive release does not appear in the list |
| 3 | Toggle `Show Active Only` to OFF | The Inactive release becomes visible in the grid with "Inactive" status |
| 4 | Toggle `Show Active Only` back to ON | The Inactive release is hidden again |

**Coverage dimension:** State Transitions

---

#### `RELEASE-INACTIVATE-012` — Tooltip on Inactive release status badge shows justification [P2]

**Preconditions:** Logged in as `ProductAdmin`. A release has been inactivated with a known justification text.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the `My Releases` tab with "Show Active Only" toggled OFF | The Inactive release is visible in the grid |
| 2 | Hover over the "Inactive" status badge for the release | A tooltip appears containing the inactivation justification text |
| 3 | Navigate to the Product Details > `Releases` tab (with "Show Active Only" OFF) | The Inactive release is visible |
| 4 | Hover over the "Inactive" status badge | The same justification tooltip is displayed |

**Coverage dimension:** Data Integrity

---

#### `RELEASE-INACTIVATE-013` — RBAC: Product Owner sees only Clone in Actions (no Inactivate) [P2]

**Preconditions:** Logged in as `Product Owner` (does not hold `INACTIVATE_RELEASE` privilege). A product has a release in "Creation & Scoping" stage.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page and open the `My Releases` tab | The `My Releases` grid is visible |
| 2 | Verify the `Actions` column | The `Actions` column is not visible in the My Releases grid |
| 3 | Navigate to the Product Details > `Releases` tab | The Releases grid with the `Actions` column is visible |
| 4 | Click the three-dot (⋮) icon for a release in "Creation & Scoping" stage | The Actions dropdown opens |
| 5 | Verify the dropdown contents | Only `Clone` is visible; the `Inactivate` option is not present |

**Coverage dimension:** Role-Based Access  
**Note:** Per PIC-7644 AC#3 — without `INACTIVATE_RELEASE`, no Actions column on My Releases; only Clone shown on Product Releases tab if user can create releases.

---

## 9. Review Gate Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Every step uses an allowed verb | ✅ |
| 2 | Every expected result is machine-verifiable | ✅ |
| 3 | No vague terms from the banned list | ✅ |
| 4 | UI element names match user guide / DOM | ✅ |
| 5 | Negative cases for every input field | ✅ (Reset, Cancel, DPP lock, no-match history, justification mandatory x2) |
| 6 | Role-based access tested | ✅ PRODUCT-INACTIVATE-013, RELEASE-INACTIVATE-013 |
| 7 | State transitions: happy path + illegal | ✅ Greyed-out states, stage restrictions, No-Go FCSR guard |
| 8 | Data integrity: create + read-back | ✅ Justification tooltip verified, name re-use post-inactivation |
| 9 | Cross-feature side effects identified | ✅ (sub-req toggle → release, DPP → release, inactivation → read-only) |
| 10 | No environment-specific hardcoded values | ✅ |
| 11 | Every scenario ID follows `AREA-SUBSECTION-NNN` format | ✅ |
| 12 | Every scenario has steps + expected results populated | ✅ (after DB insert + backfill) |
| 13 | No description starts with `<ID>: ` | ✅ |
| 14 | All role names match `access-privileges.md` canonical list | ✅ `ProductAdmin`, `Product Owner` |
| 15 | No duplicate IDs in the DB | ✅ (verified after insert) |

---

## 10. Summary

| Metric | Count |
|--------|-------|
| Total WF3 scenarios (after this session) | 144 |
| New scenarios (previous session) | 16 |
| New scenarios (this session — PIC-6769) | 22 |
| New — P1 | 6 (PRODUCT-INACTIVATE-006/007/010, RELEASE-INACTIVATE-001/007/010) |
| New — P2 | 16 |
| Subsection: 3.7 Product Inactivation | 9 new (PRODUCT-INACTIVATE-005 → -013) |
| Subsection: 3.10 Release Inactivation | 13 new (RELEASE-INACTIVATE-001 → -013) |
| Jira feature: PIC-6769 | Fully covered |
| User stories covered | PIC-7643 (Product Inactivation), PIC-7644 (Release Inactivation), PIC-7648 (Privileges) |
| User stories excluded (On Hold / Closed) | PIC-6188 (Closed) |
