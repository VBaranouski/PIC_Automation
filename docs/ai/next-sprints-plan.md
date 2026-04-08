# PICASso Automation — Next Sprints Coverage Plan

> **Purpose:** Reference document for the next agent / developer iteration. Focus on the highest-value remaining non-destructive coverage gaps after the latest WL3/WF4 documentation sync.  
> **Current baseline:** Plan synced through WL3 Product History expansion and the latest WF4 create/clone/header/details coverage updates (as of 2026-04-08).  
> **Near-term target:** Close the remaining WF3 Product Management gaps, then finish the highest-value WF4 release-detail and clone/onboarding gaps before returning to the remaining safe WF11 slices.
> **Current priority reset (2026-04-08):** Finish remaining WF3 Product Management gaps, then complete WF4 release create/clone/details/header follow-on coverage, then resume the remaining safe WF11 DOC coverage

---

## Context & Constraints

| Item | Detail |
| --- | --- |
| Framework | Playwright + TypeScript |
| Test environment | `https://qa.leap.schneider-electric.com` |
| Auth fixture | `loginPage` + `userCredentials` from `src/fixtures` |
| Page objects | `src/pages/` — extend existing POs; do not duplicate |
| State sharing | Use `src/helpers/product-state.helper.ts` (`writeProductState` / `readProductState`) |
| Known deferred defect | `PRODUCT-DETAIL-007` Brand Label — `test.fixme`, do NOT attempt to fix until dedicated test data is provisioned |

---

## Sprint 4 — WF11 DOC Remaining Non-Destructive Coverage

**Goal:** Close the remaining safe WF11 gaps that do not require destructive stage mutations or special approver privileges.  
**Estimated new tests:** ~8–12  
**Spec files to extend:** `tests/doc/doc-detail-certification.spec.ts`, `tests/doc/doc-history.spec.ts`, `tests/doc/doc-detail-roles.spec.ts`, `tests/doc/doc-detail-its.spec.ts`, `tests/landing/my-docs-tab.spec.ts`

### Sprint 4 Tasks

#### S4-T1 · Certification Decision popup coverage (P2)

- Extend `doc-detail-certification.spec.ts` with a non-destructive popup-open test
- Assert popup opens from `Decision Proposal` DOC, contains Proposed Decision + Comment fields
- If supported by available options, assert decision-specific date field visibility (`Validity End Date` or `Due Date for Actions Closure`)
- Dismiss popup with Cancel/X only; do not save

#### S4-T2 · Certification workflow graceful checks (P2)

- Add safe checks for `Send for Rework` popup visibility and required Comment field
- Keep state unchanged by cancelling the dialog
- Do not confirm rework unless a dedicated disposable DOC is provisioned

#### S4-T3 · Roles read-only privilege coverage (P2)

- Add a graceful privilege-aware check for a read-only Roles view (`VIEW_DOC` path)
- If test account lacks alternate role context, classify as blocked rather than forcing environment mutation

#### S4-T4 · ITS empty-state / read-only edges (P2)

- Cover popup/list behaviors that are observable without persisting changes
- Prioritise: Add Control popup grey-state/read-only affordances, no-results behavior, and privilege gating
- Keep destructive add/descope flows deferred to dedicated test data

#### S4-T5 · DOC History remaining filter coverage (P3)

- Extend `doc-history.spec.ts` for date-range behavior and pagination/per-page checks
- If environment has insufficient history rows, assert control availability and record graceful skip notes

#### S4-T6 · My DOCs suite tidy-up (P2)

- Revisit `landing/my-docs-tab.spec.ts` for the two remaining false items already partially wired in plan docs
- Fix test issues only; if app defects remain, preserve failure classification in docs

---

## Sprint 5 — WF11 DOC Lifecycle Completion (Observation-First)

**Goal:** Complete WF11 lifecycle coverage using pre-existing DOCs and observation-first checks before enabling destructive transitions.  
**Estimated new tests:** ~6–10  
**Spec files to extend:** `tests/doc/doc-lifecycle.spec.ts`

### Sprint 5 Tasks

#### S5-T1 · Start ITS Risk Assessment transition observation (P1)

- Use a known Risk Assessment DOC when available
- Verify stage/status, active pipeline step, and ITS control status expectations without mutating the seed DOC

#### S5-T2 · Risk Assessment tab availability (P1)

- Assert Risk Assessment-only UI appears on later-stage DOCs
- Add `Add Controls` visibility check at Risk Assessment stage for privileged user

#### S5-T3 · Risk Summary Review → Issue Certification observation (P1)

- Reuse a Decision Proposal DOC to verify downstream arrival state and frozen summary behavior
- Treat actual stage submission as destructive and defer unless disposable data is available

#### S5-T4 · Completed / revoked / frozen-state sweep (P2)

- Consolidate completed-doc read-only assertions already spread across suites
- Keep revoke action as graceful-skip unless a `REVOKE_DOC` account is provisioned

---

## Sprint 6 — WF3 Product Management Remaining Priorities

**Goal:** Close the remaining WL3 product-management scenarios after the latest New Product, Product Detail, Product History, and safe Product Edit additions.  
**Estimated new tests:** ~6–10  
**Spec files to extend:** `tests/products/product-details.spec.ts`, `tests/products/edit-product.spec.ts`, `tests/products/my-products-tab.spec.ts`

### Sprint 6 Tasks

#### S6-T1 · Product Type warning with active release (P2)

- Add the remaining edit-mode warning flow for changing Product Type when a release is already in progress
- Reuse a product that already exposes an active/in-progress release rather than creating destructive setup data
- Keep the assertion warning-focused; avoid persisting the type change unless the rollback path is stable

#### S6-T2 · Users Management / LEAP License coverage (P2)

- Cover the two remaining LEAP License states in Users Management:
  - assigned-role user shows `Active`
  - user without license shows `No License`
- Prefer observation-first assertions on existing data; avoid mutating user-role assignments unless a disposable user/product is identified

#### S6-T3 · Product Configuration follow-on slice (P2/P3)

- If Sprint 6 capacity remains, pick the safest Product Configuration scenarios next:
  - Tracking Tools read-only state
  - active-release lock behavior
  - status-mapping entry visibility
- Keep this slice below the Product Type warning and LEAP License work

#### S6-T4 · Lower-priority WL3 backlog only after mainline closes (P3)

- Leave these as follow-on WL3 backlog items once S6-T1 and S6-T2 are complete:
  - product inactivation
  - risk calculator / risk profile checks
  - cross-org edge cases
- Preserve `PRODUCT-DETAIL-007` as a deferred known defect unless new dedicated data is provisioned

---

## Sprint 7 — WF4 Release Remaining Priorities

**Goal:** Finish the highest-value WF4 gaps now that release create, clone basics, header workflow panel checks, and Release Details tab coverage have been expanded.  
**Estimated new tests:** ~10–16  
**Spec files to extend/create:** `tests/releases/create-new-release.spec.ts`, `tests/releases/clone-release.spec.ts`, `tests/releases/release-detail-header.spec.ts`, `tests/releases/release-details-tab.spec.ts`

### Sprint 7 Tasks

#### S7-T1 · Create Release rules still missing after onboarding coverage (P2)

- Cover duplicate-name behavior against cancelled and inactivated releases
- Revisit Existing Product Release once the current QA onboarding defects are fixed
- Keep defect-classified onboarding validations in place; do not weaken them to force green runs

#### S7-T2 · Clone inheritance matrix (P2)

- Extend `clone-release.spec.ts` from its current dialog/default-validation coverage into inheritance checks
- Prioritise safe read-only confirmations first: latest source selection, inherited summary areas, intentionally not inherited areas
- Leave row-action `Clone` entry blocked/defect-classified until QA exposes it in My Releases actions

#### S7-T3 · Release Details remaining tab gaps (P2)

- Extend `release-details-tab.spec.ts` for the remaining non-destructive gaps:
  - Cancel/leave confirmation in inline edit mode
  - Add SE Product dialog open path
  - safe empty-state / read-only combinations on both subtabs

#### S7-T4 · Workflow panel counts and stage sidebar (P1/P2)

- Extend `release-detail-header.spec.ts` with stage counts, completion-date visibility, and stage-sidebar validation
- Keep orange-dot/rework-state assertions below the mainline unless stable QA data is available

---

## Sprint 1 — WF4 Release Stage 1 Completion (P1 & P2)

**Goal:** Full automation coverage for the Create Release dialog and Product Releases tab.  
**Estimated new tests:** ~18  
**Spec files to create/extend:** `tests/releases/create-new-release.spec.ts` (extend), `tests/products/product-details-releases.spec.ts` (extend)

### Sprint 1 Tasks

#### S1-T1 · `RELEASE-CREATE-003` — Release Type Radio Buttons (P2)

- **Scenario:** Open Create Release dialog for a product with no releases
- **Steps:** Inspect dialog for radio group "New Product Release / Existing Product Release"
- **Expected:** Both radio options are visible and New Product Release is selected by default
- **Notes:** Read-only UI check — no state change needed

#### S1-T2 · `RELEASE-CREATE-004` — Continuous Pen Test checkbox reveals date field (P2)

- **Scenario:** Open Create Release dialog, check the "Continuous Penetration Testing" checkbox
- **Steps:** Click the checkbox, assert `Cont. Pen Test Contract Date` date picker appears
- **Expected:** Cont. Pen Test Contract Date input becomes visible after checkbox is checked

#### S1-T3 · `RELEASE-CREATE-005` — Target Release Date past-date prevention (P2)

- **Scenario:** Open Create Release dialog, attempt to set Target Release Date to yesterday
- **Steps:** Open date picker, navigate to yesterday, attempt to select it
- **Expected:** Yesterday's date is disabled/greyed out in the picker

#### S1-T4 · `RELEASE-CREATE-006` — "Existing Product Release" radio reveals pen-test fields (P2)

- **Scenario:** Open Create Release dialog, select "Existing Product Release"
- **Steps:** Select radio, observe revealed fields
- **Expected:** "Was pen test performed? (Yes/No)" radio appears; selecting Yes reveals Last Pen Test Type + Last Pen Test Date; selecting No reveals Justification field

#### S1-T5 · `RELEASE-CREATE-007` — Second-release dialog shows Clone/New options (P2)

- **Scenario:** Navigate to a product that already has at least one release, open Create Release dialog
- **Steps:** Click Create Release, inspect dialog options
- **Expected:** Two radio options appear: "Clone from existing release" and "Create as new"
- **Notes:** Requires finding a product with existing releases — use `product-state.json` or scan My Products

#### S1-T6 · `PRODUCT-RELEASES-005` through `PRODUCT-RELEASES-008` — Releases tab grid (P2)

Extend `product-details-releases.spec.ts`:

- **005:** Clicking a release name in the Releases tab navigates to Release Detail page
- **006:** Release status badge (e.g., "Scoping", "Active") is displayed on the grid row
- **007:** Releases tab shows correct column headers (Release Number, Status, Target Date, Created By)
- **008:** Releases tab per-page selector changes row count

**Fixture strategy:** Use `readProductState()` to get the product URL from the state written by `RELEASE-CREATE-002`.

---

## Sprint 2 — WF4 Release Detail Page Header (P1 & P2)

**Goal:** Automate the Release Detail page header, breadcrumb, and pipeline bar.  
**Estimated new tests:** ~12  
**New spec file:** `tests/releases/release-detail-header.spec.ts`

### Sprint 2 Tasks

#### S2-T1 · `RELEASE-HEADER-001` — Release Detail page loads (P1)

- **Scenario:** Navigate from My Releases grid to a release
- **Steps:** Click release name link, wait for page load
- **Expected:** Release Detail page opens; breadcrumb shows Home > Product Name > Release Version

#### S2-T2 · `RELEASE-HEADER-002` — Release status badge (P1)

- **Expected:** "Active" status badge with green colour is visible in the release header

#### S2-T3 · `RELEASE-HEADER-003` — Pipeline bar shows all 7 stage names (P1)

- **Expected:** Creation & Scoping · Review & Confirm · Manage · Security & Privacy Readiness Sign Off · FCSR Review · Post FCSR Actions · Final Acceptance

#### S2-T4 · `RELEASE-HEADER-004` — Current stage is highlighted (P1)

- **Expected:** The active stage has a distinct highlighted style compared to pending stages

#### S2-T5 · `RELEASE-HEADER-005` — "View Flow" button opens workflow popup (P1)

- **Steps:** Click "View Flow" button, wait for popup
- **Expected:** Workflow progress popup appears with stage submission counts and responsible usernames

#### S2-T6 · `RELEASE-HEADER-006` — Stage Sidebar via "Need Help" button (P1)

- **Steps:** Click "Need Help" button
- **Expected:** Stage Sidebar opens showing stage name, responsible users table (User/Role/Approval Date), description, and Close (X) button

#### S2-T7 · `RELEASE-HEADER-007` — Breadcrumb navigation (P2)

- **Steps:** Click Home link in breadcrumb; navigate back to release; click Product Name in breadcrumb
- **Expected:** Home link navigates to Landing Page; Product Name link navigates to Product Detail page

#### S2-T8 · `RELEASE-HEADER-008` — Workflow popup shows responsible users for Scoping stage (P2)

- **Steps:** Open workflow popup, inspect responsible users for "Creation & Scoping"
- **Expected:** At least one username is shown; Minimum Oversight Level value displayed

**Fixture strategy:** Find a release in Scoping state from My Releases grid. If `product-state.json` has a release URL from Sprint 1, use it directly.

---

## Sprint 3 — WF11 DOC: Unblock Destructive Flows (P1 & P2)

**Goal:** Unfix `test.fixme` stubs in `doc-lifecycle.spec.ts` for the stage-transition flows; activate `DOC-ITS-015` through `DOC-ITS-019`.  
**Estimated new tests:** ~10  
**Spec files to extend:** `tests/doc/doc-lifecycle.spec.ts`, `tests/doc/doc-detail-its.spec.ts`

### Sprint 3 Tasks

#### S3-T1 · `DOC-LIFECYCLE-013` (existing fixme) — Revoke DOC lifecycle test (P2)

- **Current state:** `test.fixme` — user `PICEMDEPQL` lacks `REVOKE_DOC` privilege
- **Precondition:** Obtain a test account with `REVOKE_DOC` privilege OR add the privilege to the QA user via BackOffice
- **Steps:** Navigate to DOC in Controls Scoping stage → click Revoke DOC → confirm in dialog
- **Expected:** DOC status transitions to "Revoked"; Revoke action no longer visible

#### S3-T2 · `DOC-ITS-015` — Add a control from the Add Control popup (P1)

- **Current state:** `test.fixme` — requires a DOC in Scoping stage with editable ITS list
- **Steps:** Open ITS Checklist → click "Add Control" → search for a control → select it → click "Add Selected"
- **Expected:** Selected control appears in the ITS Checklist grid with "Not Assessed" status
- **Cleanup:** Remove the added control at the end of the test

#### S3-T3 · `DOC-ITS-016` — Descope a control with a justification (P1)

- **Steps:** Find an ITS control in scope → open Descope popup → enter mandatory justification → confirm
- **Expected:** Control is removed from the ITS Checklist grid; history entry added

#### S3-T4 · `DOC-ITS-017` — Control filtering by Category (P2)

- **Steps:** Open ITS Checklist, select a Category in the filter dropdown
- **Expected:** Grid narrows to controls matching the selected category; Reset restores all controls

#### S3-T5 · `DOC-ITS-018` — Submit ITS Risk Assessment (P1)

- **Precondition:** DOC with all ITS controls assessed (each has a status set)
- **Steps:** Click "Start ITS Risk Assessment" (when button is active) → confirm dialog
- **Expected:** DOC stage advances to "Risk Assessment"; ITS Checklist becomes read-only

#### S3-T6 · `DOC-ITS-019` — ITS Risk Assessment gating validation (P2)

- **Scenario:** DOC with at least one control in "Not Assessed" state
- **Steps:** Click "Start ITS Risk Assessment" button
- **Expected:** Button is disabled OR clicking it shows a blocking error about unassessed controls

#### S3-T7 · Extend `DOC-LIFECYCLE` suite — Cancel DOC full flow (P2)

- **Current state:** Cancel DOC button and dialog dismiss are tested; actual cancellation is not
- **Precondition:** Dedicated DOC in Scoping that is safe to cancel (seed a new one in `beforeAll`)
- **Steps:** Click Cancel DOC → confirm cancellation in dialog → verify
- **Expected:** DOC status changes to "Cancelled"; DOC Detail tabs become read-only; pipeline bar shows cancellation

---

## Key Technical Notes for Next Agent

### Test Data Setup

- **Products:** Use `readProductState('product-state.json')` for products created by earlier tests. If not available, scan My Products grid with `landingPage.clickTab('My Products')`.
- **Releases:** After Sprint 1 creates a release, write its URL to `product-state.json` using `writeProductState`. Sprint 2 reads it.
- **DOCs:** The seed DOC URL is provisioned externally (not created by tests). Read it from config or from a `doc-state.json` file. To unblock Sprint 3 destructive tests, use `test.beforeAll` to create a fresh DOC per describe block.

### Fixture Pattern

```typescript
test.beforeAll(async ({ browser }) => {
  // Create isolated context for setup
  const context = await browser.newContext();
  const page = await context.newPage();
  // ... create test DOC/product/release ...
  await context.close();
});
```

### `test.fixme` Removal Checklist

Before removing any `test.fixme`:

1. Confirm the precondition is met (privilege, test data, environment state)
2. Run the test in isolation: `npx playwright test --grep "TC ID" --project=chromium`
3. If passing, remove `test.fixme` and update the `autoTestStatuses` in `docs/ai/automation-testing-plan.html`
4. Update `docs/ai/automation-testing-plan.md` — change `[~]` → `[x]` and remove the fixme note

### Deferred (NOT for Sprint 1–3)

| Item | Reason |
| --- | --- |
| `PRODUCT-DETAIL-007` Brand Label | OS cascade AJAX L2 lock — needs dedicated test product with known-stable org level state |
| `PRODUCT-ACTIONS-003` Create Action | Destructive — needs a dedicated release in an open stage |
| WF4 Stage 2 (Review & Confirm) | Requires a product in "Scoping" state that is ready to advance — high setup cost |
| WF12 Roles Delegation | No priority alignment yet |
