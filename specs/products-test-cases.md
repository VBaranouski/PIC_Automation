# WF3. Product Management — Test Case Specifications

> **Area:** `products` · **Tracker feature_area:** `products` · **Generated:** 2026-04-22
> **Registry:** `docs/ai/knowledge-base/feature-registry/products.md`

---

## 1. Coverage Analysis

### 1.1 Current Tracker State

| Metric | Count |
|--------|-------|
| Total scenarios | 109 |
| Automated | 80 |
| Pending | 29 |
| On-hold | 0 |
| Passed | 55 |
| Skipped | 19 |
| Failed-defect | 3 (PRODUCT-CREATION-009, PRODUCT-DETAIL-005, CROSS-ORG-005, TRACKING-TOOLS-005) |
| Not-executed | 32 |

### 1.2 Feature Sub-area Breakdown

| Sub-area | Automated | Pending | Spec File |
|----------|-----------|---------|-----------|
| Product Creation (PRODUCT-CREATION-*) | 12 | 10 | `new-product-creation.spec.ts` |
| Product Detail Header (PRODUCT-DETAIL-*) | 8 | 2 | `product-details.spec.ts` |
| Product Edit (PRODUCT-EDIT-*) | 2 | 4 | `edit-product.spec.ts` |
| Product Releases Tab (PRODUCT-RELEASES-*) | 7 | 1 | `product-details-releases.spec.ts` |
| Product History (PRODUCT-HISTORY-*) | 8 | 1 | `product-details-history.spec.ts` |
| Product Inactivation (PRODUCT-INACTIVATE-*) | 3 | 1 | `product-inactivation.spec.ts` |
| Tracking Tools (TRACKING-TOOLS-*) | 11 | 1 | `tracking-tools.spec.ts` |
| Status Mapping (STATUS-MAP-*) | 6 | 0 | `status-mapping.spec.ts` |
| Risk Profile (RISK-PROFILE-*) | 3 | 1 | `risk-profile.spec.ts` |
| Cross-Org Dev (CROSS-ORG-*) | 7 | 0 | `cross-org.spec.ts` |
| DOC Cert Tab (PROD-DOC-CERT-*) | 2 | 0 | `product-details.spec.ts` |
| Product Actions (PRODUCT-ACTIONS-*) | 0 | 1 | `product-details-actions.spec.ts` |
| LEAP License (PRODUCT-LEAP-*) | 2 | 0 | `users-management.spec.ts` |
| My Products Tab (LANDING-MY-PRODUCTS-*) | 4 | 0 | `my-products-tab.spec.ts` |
| WF03-* (unmerged imports) | 0 | 6 | — |

### 1.3 Five Coverage Dimensions Gap Table

| Dimension | Status | Gap |
|-----------|--------|-----|
| **Happy Path** | ✅ Covered | Product creation (PRODUCT-CREATION-002), edit (PRODUCT-EDIT-001/002), detail view (PRODUCT-DETAIL-001/002), release creation from product (PRODUCT-RELEASES-001-008), history (PRODUCT-HISTORY-001-008) |
| **Negative / Validation** | ⚠️ Partial | Missing: required-field validation on creation form (PRODUCT-CREATION-002-b pending), Brand Label + Vendor validation (PRODUCT-CREATION-015/016 pending), Digital Offer required fields (PRODUCT-CREATION-017 pending) |
| **Role-Based Access** | ⚠️ Partial | Product Admin inactivation tested (PRODUCT-INACTIVATE-001). Missing: non-admin cannot inactivate, Viewer role cannot edit, Product Owner vs. Security Manager write differences |
| **State Transitions** | ⚠️ Partial | Product Type change warning with active release (PRODUCT-TYPE-WARN-001 automated/skipped). Missing: inactivation completes state change (PRODUCT-INACTIVATE-002 pending/deferred), DPP toggle state persistence (PRODUCT-DETAIL-006 skipped) |
| **Data Integrity** | ⚠️ Partial | Edit → Save → Read-back covered (PRODUCT-EDIT-002). Missing: edit → cancel → confirm values unchanged (PRODUCT-EDIT-006 pending), Digital Offer data round-trip |

---

## 2. Deduplication Table

| Pending ID | Automated Overlap | Action |
|---|---|---|
| `WF03-0034` — DOC cert tab visibility | `PROD-DOC-CERT-001` — same feature, automated + passed | **REMOVE** `WF03-0034` (true duplicate) |
| `PRODUCT-DETAIL-016` — DOC cert empty state | `PROD-DOC-CERT-002` — tests tab activation; PRODUCT-DETAIL-016 tests empty state content specifically | **KEEP** `PRODUCT-DETAIL-016` — overlapping but different (cert tab active vs. empty state message) |
| `PRODUCT-CREATION-014` — Cross-Org toggle on creation form | `CROSS-ORG-001`/`CROSS-ORG-002` — same toggle on edit form | **KEEP** `PRODUCT-CREATION-014` — context differs (creation vs. edit form) |
| `PRODUCT-CREATION-009-b` — Definition dropdown cascade | `PRODUCT-CREATION-013` — Type options change on Definition change | **KEEP both** — 009-b tests the Definition dropdown options list; 013 tests the AJAX cascade behavior (known defect). Clarify distinction in titles. |
| `PRODUCT-CREATION-015` — Vendor required when Brand Label | `PRODUCT-CREATION-016` — Brand Label makes Vendor mandatory | **MERGE** into single scenario `PRODUCT-CREATION-015`. 016 is the styling check; 015 is the functional save-blocked check. Keep 015 (functional), remove 016. |
| `WF03-0077` — Jira connection invalid creds | `TRACKING-TOOLS-011` — Jira connection success deferred | **KEEP** `WF03-0077` — negative test of connection feature (different from 011's success path). Rename to `TRACKING-TOOLS-013`. |
| `WF03-0080` — Jama email notifications | No overlap | **KEEP** — rename to `TRACKING-TOOLS-014`. |
| `WF03-0081` — Jama Test Connection | `TRACKING-TOOLS-011` — same deferral pattern | **KEEP** — rename to `TRACKING-TOOLS-015`. Mark deferred. |
| `WF03-0094` — Data Extraction API Cross-Org | No overlap | **KEEP** — Phase 2 deferred. Rename to `PRODUCT-API-001`. |

### Deduplication CLI Actions

```bash
# Remove true duplicates
npx tsx scripts/tracker.ts remove WF03-0034

# Remove merged duplicate (015 absorbs 016's intent)
npx tsx scripts/tracker.ts remove PRODUCT-CREATION-016
```

---

## 3. Test Case Specifications

### 3.1 Product Creation — Pending Scenarios

---

#### `PRODUCT-CREATION-001-b` — Product Owner and Security Manager lookup fields accept input and select from dropdown

**Preconditions:** Logged in as Process Quality Leader (PQL). New Product form loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page | The `New Product` heading is visible; the `Product Team` tab is visible |
| 2 | Click the `Product Team` tab | The `Product Team` tab content is visible with `Product Owner`, `Security Manager`, `Security and Data Protection Advisor`, and `Process Quality Leader` role rows |
| 3 | Click the edit link (pencil icon) next to the `Product Owner` role label | The `Product Owner` searchbox appears with placeholder text "Type 4 letters" |
| 4 | Type "Ulad" into the `Product Owner` searchbox using pressSequentially with 150ms delay | A dropdown result containing "Uladzislau Baranouski" is visible within 30 seconds |
| 5 | Click the "Uladzislau Baranouski" result in the `Product Owner` dropdown | The `Product Owner` field displays "Uladzislau Baranouski" |
| 6 | Click the edit link (pencil icon) next to the `Security Manager` role label | The `Security Manager` searchbox appears |
| 7 | Type "Ulad" into the `Security Manager` searchbox using pressSequentially with 150ms delay | A dropdown result containing "Uladzislau Baranouski" is visible |
| 8 | Click the "Uladzislau Baranouski" result in the `Security Manager` dropdown | The `Security Manager` field displays "Uladzislau Baranouski" |

**Coverage dimension:** Happy Path (team role assignment sub-flow)
**Note:** Uses OutSystems user lookup widget 3-step pattern. 240s timeout on edit link wait due to OS server-side rendering.

---

#### `PRODUCT-CREATION-002-b` — Saving with missing required fields shows inline validation errors

**Preconditions:** Logged in as PQL. New Product form loaded, no fields filled.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page | The `New Product` heading is visible |
| 2 | Click the `Save` button without filling any fields | The form stays visible; the URL does not change to `/ProductDetail` |
| 3 | Verify inline validation errors on the form | At least 1 validation error message is visible on the page |
| 4 | Verify the `Product Name` field has a validation indicator | The `Product Name` field has a required/error styling (red border or error message near the field) |
| 5 | Fill the `Product Name` field with "Validation Test Product" | The `Product Name` field contains "Validation Test Product" |
| 6 | Click `Save` without filling organization and team fields | The form stays visible; at least 1 validation error message is visible |

**Coverage dimension:** Negative / Validation
**Note:** OutSystems validation may show a toast or inline errors. Verify which pattern PICASso uses during CLI validation.

---

#### `PRODUCT-CREATION-009-b` — Product Definition dropdown contains expected options

**Preconditions:** Logged in as PQL. New Product form loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page | The `Product Definition*` dropdown is visible |
| 2 | Click the `Product Definition*` dropdown | The dropdown options list is visible |
| 3 | Verify the dropdown contains expected options | The options include at least: "System", "Software", "Component", "Service" |
| 4 | Select "System" from the `Product Definition*` dropdown | The `Product Definition*` dropdown displays "System" |
| 5 | Click the `Product Type*` dropdown | The `Product Type*` dropdown options list is visible with at least 1 option |

**Coverage dimension:** Happy Path (form field options)
**Note:** This tests the static option list. PRODUCT-CREATION-013 tests the AJAX cascade behavior (known defect).

---

#### `PRODUCT-CREATION-011-b` — DPP confirmation dialog — "Cancel" button discards the save

**Preconditions:** Logged in as PQL. New Product form with all required fields filled. `Data Protection & Privacy` checkbox checked.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page and fill all required fields (name, state, definition, type, org levels, team roles) | All required fields are populated |
| 2 | Click the `Data Protection & Privacy` checkbox in the Product Configuration tab | The `Data Protection & Privacy` checkbox is checked |
| 3 | Click the `Save` button | The DPP confirmation dialog is visible with a message about Data Protection & Privacy |
| 4 | Click the `Cancel` button in the DPP confirmation dialog | The dialog closes; the New Product form is still visible; the URL does not contain `/ProductDetail` |
| 5 | Verify the form fields are still populated | The `Product Name` field still contains the entered product name |

**Coverage dimension:** Negative (dialog cancel flow)
**Note:** Depends on PRODUCT-CREATION-011 being the parent test that confirms the dialog appears.

---

#### `PRODUCT-CREATION-011-c` — DPP confirmation dialog — "Save" button completes product creation

**Preconditions:** Logged in as PQL. New Product form with all required fields filled. `Data Protection & Privacy` checkbox checked.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page and fill all required fields including DPP checkbox | All required fields are populated; `Data Protection & Privacy` checkbox is checked |
| 2 | Click the `Save` button | The DPP confirmation dialog is visible |
| 3 | Click the `Save` button in the DPP confirmation dialog | The dialog closes; the page transitions to Product Detail view mode |
| 4 | Verify the product is created successfully | The `Edit Product` button is visible; the URL contains `/ProductDetail` |
| 5 | Verify the `Data Protection & Privacy` indicator is visible on the product detail page | The DPP indicator or badge shows the product has DPP enabled |

**Coverage dimension:** Happy Path (DPP-enabled creation flow)

---

#### `PRODUCT-CREATION-013` — Product Type options change based on Product Definition (AJAX cascade)

**Preconditions:** Logged in as PQL. New Product form loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page | The `Product Definition*` and `Product Type*` dropdowns are visible |
| 2 | Select "System" from the `Product Definition*` dropdown | The `Product Definition*` displays "System" |
| 3 | Click the `Product Type*` dropdown and record the available options | The `Product Type*` dropdown shows a list of options (record count and names) |
| 4 | Select "Software" from the `Product Definition*` dropdown | The `Product Definition*` displays "Software" |
| 5 | Click the `Product Type*` dropdown and record the available options | The `Product Type*` dropdown options differ from the options recorded in step 3 |

**Coverage dimension:** State Transitions (cascading dropdown behavior)
**Note:** KNOWN DEFECT — QA environment currently returns identical Product Type lists across definitions. Use `test.fail()` annotation until product fix is deployed.

---

#### `PRODUCT-CREATION-014` — Cross-Organizational Development toggle reveals Dev Org fields on creation form

**Preconditions:** Logged in as PQL. New Product form loaded.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page | The `New Product` heading is visible |
| 2 | Click the `Product Organization` tab | The `Product Organization` tab content is visible |
| 3 | Verify the `Cross-Organizational Development` toggle is visible | The `Cross-Organizational Development` checkbox/toggle is visible |
| 4 | Click the `Cross-Organizational Development` toggle to enable it | The toggle is checked/enabled |
| 5 | Verify the Development Org Level fields appear | The `Development Org Level 1`, `Development Org Level 2`, and `Development Org Level 3` dropdown fields are visible |

**Coverage dimension:** Happy Path (conditional field reveal on creation form)
**Note:** Similar to CROSS-ORG-001/002 but tested on the creation form context rather than edit form.

---

#### `PRODUCT-CREATION-015` — Vendor field is required when Brand Label is checked

**Preconditions:** Logged in as PQL. New Product form with all other required fields filled.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page and fill all required fields (name, state, definition, type, org, team) | All required fields are populated |
| 2 | Click the `Brand Label` checkbox | The `Brand Label` checkbox is checked; the `Vendor` field becomes visible with required/mandatory styling |
| 3 | Leave the `Vendor` field empty and click `Save` | The form stays visible; a validation error or message indicates the `Vendor` field is required |
| 4 | Type "Schneider Electric" into the `Vendor` field | The `Vendor` field contains "Schneider Electric" |
| 5 | Click `Save` | The product is created successfully; the `Edit Product` button is visible |

**Coverage dimension:** Negative / Validation (conditional required field)
**Note:** Absorbs intent of removed PRODUCT-CREATION-016 (mandatory styling check is implicit in step 2).

---

#### `PRODUCT-CREATION-017` — Digital Offer required fields validation

**Preconditions:** Logged in as PQL. New Product form loaded. `Digital Offer` checkbox checked.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page | The `New Product` heading is visible |
| 2 | Click the `Digital Offer` checkbox | The `Digital Offer Details` accordion section is visible |
| 3 | Verify the required fields in the Digital Offer section | The `VESTA ID`, `IT Owner`, and `Project Manager` fields are visible |
| 4 | Fill all other required product fields but leave VESTA ID, IT Owner, and Project Manager empty | All non-Digital-Offer required fields are populated |
| 5 | Click `Save` | The form stays visible; validation errors indicate the Digital Offer required fields are missing |

**Coverage dimension:** Negative / Validation (Digital Offer required fields)

---

#### `PRODUCT-CREATION-018` — Digital Offer accordion functional elements

**Preconditions:** Logged in as PQL. New Product form loaded. `Digital Offer` checkbox checked.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the New Product page and click the `Digital Offer` checkbox | The `Digital Offer Details` accordion section is visible |
| 2 | Verify the `+Add VESTA ID` row/button is visible in the Digital Offer section | The `+Add VESTA ID` element is visible |
| 3 | Click `+Add VESTA ID` | A new VESTA ID input row appears |
| 4 | Verify the `IT Owner` searchbox is visible | The `IT Owner` searchbox is visible with a placeholder |
| 5 | Type "Ulad" into the `IT Owner` searchbox using pressSequentially with 150ms delay | A dropdown result is visible within 30 seconds |
| 6 | Verify the `Project Manager` searchbox is visible | The `Project Manager` searchbox is visible with a placeholder |
| 7 | Type "Ulad" into the `Project Manager` searchbox using pressSequentially with 150ms delay | A dropdown result is visible within 30 seconds |

**Coverage dimension:** Happy Path (Digital Offer searchbox functionality)
**Note:** IT Owner and Project Manager use the DOC section searchbox pattern (directly visible, no edit-link required).

---

### 3.2 Product Detail — Pending Scenarios

---

#### `PRODUCT-DETAIL-001-b` — Product name and product ID visible in header

**Preconditions:** Logged in as PQL. Navigated to a known product detail page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page for a known product | The `Product Details` top tab is visible |
| 2 | Verify the product name is visible in the page header | The product name heading is visible and is not empty |
| 3 | Verify the product ID is visible in PIC-XXXX format | A text matching the pattern `PIC-` followed by digits is visible in the header area |

**Coverage dimension:** Data Integrity (header metadata display)

---

#### `PRODUCT-DETAIL-001-c` — Active/Inactive status badge in header

**Preconditions:** Logged in as PQL. Navigated to a known active product detail page.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page for a known active product | The `Product Details` top tab is visible |
| 2 | Verify a status badge is displayed in the header | A badge or label element is visible in the header area |
| 3 | Verify the badge text indicates the product is active | The badge contains text "Active" or the active-state indicator |

**Coverage dimension:** Data Integrity (status indicator display)

---

### 3.3 Product Edit — Pending Scenarios

---

#### `PRODUCT-EDIT-003` — After saving, view mode is restored

**Preconditions:** Logged in as PQL. Navigated to a product detail page. Product in edit mode with a modified field.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a product detail page and click the `Edit Product` button | The page switches to edit mode; the `Save` button is visible |
| 2 | Modify the `Commercial Reference Number` field with a unique value | The field contains the new value |
| 3 | Click the `Save` button | The page transitions back to view mode |
| 4 | Verify the `Edit Product` button reappears | The `Edit Product` button is visible |
| 5 | Verify the `Save` button is not visible | The `Save` button is not visible |

**Coverage dimension:** State Transitions (edit → save → view mode)

---

#### `PRODUCT-EDIT-004` — Cancel with changes shows Leave Page dialog

**Preconditions:** Logged in as PQL. Product detail page in edit mode with dirty form.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a product detail page and click the `Edit Product` button | Edit mode is active; the `Cancel` button is visible |
| 2 | Modify the `Product Name` field to a different value | The field contains the new value (form is dirty) |
| 3 | Click the `Cancel` button | The Leave Page confirmation dialog is visible |
| 4 | Verify the dialog contains "Leave" and "Cancel" buttons | The `Leave` button and `Cancel` button are both visible in the dialog |

**Coverage dimension:** Negative (unsaved changes protection)

---

#### `PRODUCT-EDIT-005` — "Leave" in dialog discards unsaved changes

**Preconditions:** Logged in as PQL. Product detail page in edit mode with dirty form. Leave Page dialog open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a product detail page, enter edit mode, modify `Product Name`, and click `Cancel` | The Leave Page confirmation dialog is visible |
| 2 | Click the `Leave` button in the Leave Page dialog | The dialog closes; the page returns to view mode |
| 3 | Verify the `Edit Product` button is visible | The `Edit Product` button is visible (view mode restored) |
| 4 | Verify the product name shows the original value (not the modified value) | The product name heading contains the original product name |

**Coverage dimension:** Negative (discard changes flow)

---

#### `PRODUCT-EDIT-006` — Saved values visible when reopening edit mode

**Preconditions:** Logged in as PQL. Product with a previously saved edit (e.g., modified commercial reference number).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the product detail page that was previously edited | The product detail page loads with the `Edit Product` button visible |
| 2 | Click the `Edit Product` button | Edit mode activates; form fields become editable |
| 3 | Verify the `Commercial Reference Number` field contains the previously saved value | The `Commercial Reference Number` field contains the value saved in the prior edit session |
| 4 | Click `Cancel` | The view mode is restored without changes |

**Coverage dimension:** Data Integrity (persistence verification)

---

### 3.4 Product Releases Tab — Pending Scenarios

---

#### `PRODUCT-RELEASES-004` — Create a new release with valid data

**Preconditions:** Logged in as PQL. Navigated to a product detail page → Releases tab. Product may or may not have existing releases.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page and click the `Releases` top tab | The Releases tab content is visible |
| 2 | Click the `Create Release` button | The Create Release dialog/form is visible |
| 3 | Fill the required release fields (Release Version, Target Release Date, Release Type) | All required fields contain valid data |
| 4 | Click the `Create & Scope` button | The dialog closes; the page navigates to the Release Detail page or the releases grid refreshes |
| 5 | Verify the new release appears in the releases grid (if navigated back) or the Release Detail page loads | The release version is visible in the grid row, or the Release Detail heading is visible with the URL containing `/ReleaseDetail` |

**Coverage dimension:** Happy Path (release creation from product context)
**Note:** This is a cross-feature scenario — it creates state used by release-workflow tests. Consider data cleanup or disposable product.

---

### 3.5 Product History — Pending Scenarios

---

#### `PRODUCT-HISTORY-003-b` — Activity dropdown filter narrows records by activity type

**Preconditions:** Logged in as PQL. Product Change History dialog open on a product with multiple history entries of different activity types.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a product detail page and click the `View History` link | The Product Change History dialog is visible with at least 1 history row |
| 2 | Record the initial row count in the history grid | The initial count is at least 1 |
| 3 | Click the `Activity` dropdown filter | The dropdown options list is visible with activity type options |
| 4 | Select a specific activity type from the dropdown | The dropdown displays the selected activity type |
| 5 | Verify the grid rows are filtered | The row count changes (either decreases or stays same if all match); all visible rows show the selected activity type in the Activity column |
| 6 | Click `Reset` or clear the Activity filter | The grid restores to the initial row count |

**Coverage dimension:** Happy Path (filter functionality)
**Note:** Follows filter test pattern: record initial count → apply → verify changed → reset → verify restored.

---

### 3.6 Product Inactivation — Pending Scenarios

---

#### `PRODUCT-INACTIVATE-002` — After inactivation, product status changes to Inactive

**Preconditions:** Logged in as Product Admin. My Products grid visible with an eligible active product.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Landing Page → My Products tab | The My Products grid is visible with at least 1 row |
| 2 | Click the three-dot `Actions` menu on an eligible product row | The context menu is visible with the `Inactivate` option |
| 3 | Click `Inactivate` | A confirmation dialog or the inactivation action proceeds |
| 4 | Confirm the inactivation (if dialog appears) | The product status changes |
| 5 | Verify the product's `Product Status` column shows "Inactive" | The `Product Status` column for the target product contains "Inactive" |

**Coverage dimension:** State Transitions (active → inactive)
**Note:** DEFERRED — destructive action. Requires disposable test product created in setup. Deferred to future sprint.

---

### 3.7 Tracking Tools — Pending Scenarios

---

#### `TRACKING-TOOLS-012` — Deactivating a tracking tool resets related fields

**Preconditions:** Logged in as PQL. Product in edit mode. Jira tracking tool previously activated.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to product detail page, click `Edit Product`, then click the `Product Configuration` tab | The `Product Configuration` tab content is visible with Jira toggle in ON state |
| 2 | Click the Jira toggle to deactivate it | The Jira toggle switches to OFF |
| 3 | Verify the Jira-specific fields are hidden | The `Jira Source Link` and `Jira Project Key` fields are not visible |
| 4 | Verify the `Product requirements` radio is reset to "Not Applicable" | The `Product requirements` radio group shows "Not Applicable" selected |
| 5 | Verify the `Process requirements` radio is reset to "Not Applicable" | The `Process requirements` radio group shows "Not Applicable" selected |
| 6 | Click `Cancel` to discard changes | The edit mode is cancelled without saving |

**Coverage dimension:** State Transitions (tracking tool deactivation reset behavior)

---

### 3.8 WF03-* Scenarios — Renamed & Refined

---

#### `PRODUCT-DETAIL-016` — Digital Offer Certification tab shows empty state when no DOC exists

**Preconditions:** Logged in as PQL. Navigated to a product with `Digital Offer = Yes` and Product Owner assigned, but NO DOC has been initiated yet.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page for a Digital Offer product without any DOC | The product detail page loads; the `Digital Offer Certification` bottom tab is visible |
| 2 | Click the `Digital Offer Certification` tab | The tab becomes active (selected) |
| 3 | Verify the empty state message is displayed | A message indicating no DOC exists (e.g., "No Digital Offer Certification available" or similar empty state text) is visible in the tab content area |

**Coverage dimension:** Negative (empty state handling)
**Note:** Requires a test product with Digital Offer enabled but no DOC initiated. May need specific test data setup.

---

#### `TRACKING-TOOLS-013` (was `WF03-0077`) — Jira Test Connection — invalid credentials show error

**Preconditions:** Logged in as PQL. Product in edit mode. Jira activated. Jira Source Link and Project Key populated with invalid values.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to product detail page, enter edit mode, click `Product Configuration` tab | The `Product Configuration` tab is visible with Jira toggle |
| 2 | Activate the Jira toggle (if not already active) | The Jira fields are visible; the `Test Connection` button is visible |
| 3 | Type an invalid URL into the `Jira Source Link` field | The field contains the invalid URL |
| 4 | Type an invalid key into the `Jira Project Key` field | The field contains the invalid key |
| 5 | Click the `Test Connection` button | A red error message or error banner is visible indicating the connection failed |

**Coverage dimension:** Negative (invalid integration credentials)
**Note:** Does not require real Jira credentials — tests the negative path only.

---

#### `TRACKING-TOOLS-014` (was `WF03-0080`) — Jama Email Notifications Recipients

**Preconditions:** Logged in as PQL. Product in edit mode. Product has Product Owner and Security Manager assigned.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to product detail page, enter edit mode, click `Product Configuration` tab | The `Product Configuration` tab content is visible |
| 2 | Activate the Jama toggle | The Jama fields become visible |
| 3 | Verify the `Email Notifications Recipients` section is visible | The `Email Notifications Recipients` area is visible |
| 4 | Verify it is pre-filled with Product Owner and Security Manager | At least 2 recipient entries are visible (matching PO and SM names) |
| 5 | Click `Cancel` to discard changes | Edit mode is cancelled |

**Coverage dimension:** Happy Path (Jama email notification defaults)
**Note:** Adding/removing users requires DOM exploration during CLI validation to determine the interaction pattern.

---

#### `TRACKING-TOOLS-015` (was `WF03-0081`) — Jama Test Connection deferred

**Preconditions:** Real Jama connectivity required.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | (Deferred — requires real Jama endpoint) | — |

**Coverage dimension:** Happy Path (integration connectivity)
**Note:** DEFERRED — requires real Jama connectivity not available in QA. Use `test.skip()`.

---

#### `PRODUCT-API-001` (was `WF03-0094`) — Data Extraction API includes Cross-Org fields

**Preconditions:** Product with Cross-Org Development enabled. API access available.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | (Deferred — Phase 2 scope) | — |

**Coverage dimension:** Data Integrity (API export completeness)
**Note:** DEFERRED — Phase 2 feature. Not yet available.

---

### 3.9 Risk Profile — Pending Scenario

---

#### `RISK-PROFILE-003` — Submitting a calculation adds a row to the Risk Profile history grid

**Preconditions:** Logged in as PQL. Product detail page → Security Summary tab → Risk Profile Calculator open.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to product detail page, click `Security Summary` tab, click `Calculate Risk Profile` button | The Risk Profile Calculator page loads |
| 2 | Record the current row count in the Risk Profile history grid | The count is recorded (may be 0 or more) |
| 3 | Fill the `Exposure`, `Likelihood`, and `Impact` input fields with valid values | All three fields contain values |
| 4 | Click the `Submit` or `Calculate` button | The calculation is processed |
| 5 | Verify a new row appears in the Risk Profile history grid | The row count is 1 more than the count recorded in step 2 |
| 6 | Verify the new row shows Date, Submitted By, Risk level, Exposure, Likelihood, Impact columns | All column values in the new row are not empty |

**Coverage dimension:** Data Integrity (calculation persistence)
**Note:** DEFERRED — destructive action that creates permanent data. Requires disposable test product.

---

### 3.10 Product Actions — Pending Scenario

---

#### `PRODUCT-ACTIONS-003` — Create a new action on Actions Management page

**Preconditions:** Logged in as PQL. Navigated to Actions Management page for a product.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Product Detail page and open the Actions Management page (via product header or appropriate link) | The Actions Management page or panel is visible |
| 2 | Record the current row count in the actions grid | The count is recorded (may be 0 or more) |
| 3 | Click the button to create a new action (e.g., `Create Action` or `Add Action`) | The Create Action dialog or form is visible |
| 4 | Fill the required action fields (name, description, due date, assignee) | All required fields contain valid data |
| 5 | Click `Save` or `Create` to submit the new action | The dialog closes or the form submits |
| 6 | Verify the new action appears in the actions grid | The row count is 1 more than the count recorded in step 2; the new action name is visible in the grid |

**Coverage dimension:** Happy Path (CRUD — create action)
**Note:** Requires DOM exploration during CLI validation to determine exact button names and form fields. May be cross-feature with release actions.

---

## 4. Review Gate Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Every step uses an allowed verb (Navigate, Click, Type, Select, Hover, Scroll, Clear, Upload, Verify, Assert, Confirm, Wait) | ✅ |
| 2 | Every expected result is machine-verifiable (observable state, no vague terms) | ✅ |
| 3 | No vague terms: "Check", "Ensure", "Should", "Validate", "looks correct", "works", "properly" | ✅ |
| 4 | UI element names match exploration findings DOM snapshot (Product Team tab, Product Organization tab, etc.) | ✅ (verified against exploration-findings.md) |
| 5 | Negative cases for every input field group: creation validation (PRODUCT-CREATION-002-b), Brand Label + Vendor (015), Digital Offer required (017), Jira invalid creds (TRACKING-TOOLS-013) | ✅ |
| 6 | Role-based access tested: PQL creates (all creation scenarios), Product Admin inactivates (PRODUCT-INACTIVATE-002) | ⚠️ Partial — no denied-role scenarios for edit/inactivate in this batch |
| 7 | State transitions: edit → save → view (PRODUCT-EDIT-003), tracking tool deactivation reset (TRACKING-TOOLS-012), DPP dialog cancel/save (011-b/011-c), cascade dropdown (013) | ✅ |
| 8 | Data integrity: edit → save → read-back (PRODUCT-EDIT-006), header metadata (PRODUCT-DETAIL-001-b) | ✅ |
| 9 | Cross-feature side effects: release creation from product (PRODUCT-RELEASES-004), Digital Offer certification tab (PRODUCT-DETAIL-016) | ✅ |
| 10 | No environment-specific hardcoded values (URLs use relative paths, counts use "at least 1") | ✅ |

---

## 5. Tracker Actions

### Removals (Duplicates)

```bash
# WF03-0034 duplicates PROD-DOC-CERT-001 (automated, passed)
npx tsx scripts/tracker.ts remove WF03-0034

# PRODUCT-CREATION-016 absorbed by PRODUCT-CREATION-015
npx tsx scripts/tracker.ts remove PRODUCT-CREATION-016
```

### Renames (WF03-* → standard prefix)

```bash
# These require remove + create or DB UPDATE since tracker may not support rename
# WF03-0077 → TRACKING-TOOLS-013
# WF03-0080 → TRACKING-TOOLS-014
# WF03-0081 → TRACKING-TOOLS-015
# WF03-0094 → PRODUCT-API-001
```

### After Automation

```bash
# Mark automated scenarios
npx tsx scripts/tracker.ts auto-state PRODUCT-CREATION-001-b automated
npx tsx scripts/tracker.ts auto-state PRODUCT-CREATION-002-b automated
# ... repeat for each automated scenario
```

---

## 6. Summary

| Metric | Value |
|--------|-------|
| **Total pending scenarios** | 29 |
| **True duplicates to remove** | 2 (WF03-0034, PRODUCT-CREATION-016) |
| **Actionable pending (after dedup)** | 27 |
| **Deferred (destructive/unavailable)** | 4 (PRODUCT-INACTIVATE-002, RISK-PROFILE-003, TRACKING-TOOLS-015, PRODUCT-API-001) |
| **Ready for automation** | 23 |
| **P1 scenarios** | 2 (PRODUCT-DETAIL-001-b, PRODUCT-EDIT-003) |
| **P2 scenarios** | 19 |
| **P3 scenarios** | 2 (RISK-PROFILE-003, WF03-0094) |

### Priority Breakdown for Automation

| Priority | Ready | Deferred | Spec File |
|----------|-------|----------|-----------|
| P1 | PRODUCT-DETAIL-001-b, PRODUCT-EDIT-003 | — | `product-details.spec.ts`, `edit-product.spec.ts` |
| P2 | 17 scenarios across creation, detail, edit, releases, history, tracking tools | 2 (PRODUCT-INACTIVATE-002, TRACKING-TOOLS-015) | Multiple spec files |
| P3 | — | 2 (RISK-PROFILE-003, PRODUCT-API-001) | `risk-profile.spec.ts`, new |

### Zero-Regression Assessment

**Products area is at ~73% automated coverage** (80/109). After automating the 23 ready scenarios, coverage rises to **~94%** (103/109). The remaining 4 deferred scenarios (2 destructive, 1 requires external connectivity, 1 is Phase 2) require specific environment/data setup before they can be automated. Two scenarios need removal as duplicates.

**Remaining gap for full zero-regression:** Role-based access denial tests (non-admin cannot inactivate, Viewer cannot edit) are not yet in the tracker and should be added in a follow-up batch.
