# Generate DOC Release Linkage Tests (WF 11.16)

Generate Playwright TypeScript automation tests for the **DOC–Release Linkage** scenarios within the Digital Offer Certification (DOC) module.

---

## Context

"Release linkage" covers the bi-directional connection between a DOC and its associated release:
- Release selection in Digital Offer Details (the `Release` dropdown and "Other Release" flow)
- Target Release Date auto-population from the linked release
- Release link in the DOC Detail header (navigating to Release Detail)
- Release version appearing in My DOCs grid
- DOC status appearing on the Product Detail → Digital Offer Certification tab

**New spec file:** `tests/doc/doc-release-linkage.spec.ts`
**Existing specs to extend:** `tests/doc/doc-detail-offer.spec.ts` (Release dropdown, ATC-11.16.3–11.16.5)
**Page objects:** `src/pages/doc-details.page.ts`, `src/pages/new-product.page.ts` (for Product Detail tab check)

---

## Roles & Privileges Required

From `picasso-roles-and-access.md`:

| Action | Required Privilege / Role |
|--------|--------------------------|
| View DOC detail | `VIEW_DOC` or any DOC role |
| Edit DOC Digital Offer Details | `EDIT_DOC_DETAILS` |
| View Release Detail | `PRODUCTOWNER` or `VIEWERPRODUCT` (or any release-level privilege) |
| View Product Detail | `PRODUCTOWNER` or `VIEWERPRODUCT` |

The main test user must have at least `VIEW_DOC` + `EDIT_DOC_DETAILS` + access to the related product/release.

---

## Discovery Pattern

Use the DOC discovered from My DOCs tab that has a release linked (standard initiated DOC). Store the `docId` and expected `releaseVersion` in `.doc-state.json`. If `doc-state.json` does not contain a `releaseVersion` key, read it from the DOC Detail header at runtime.

---

## Scenarios to Implement (in priority order)

### P2 — Header Release Link

| TC ID | Title | Spec | Notes |
|-------|-------|------|-------|
| `ATC-11.16.1` | DOC Detail header shows Release version label and value | `doc-release-linkage.spec.ts` | Assert label and non-empty text in header area |
| `ATC-11.16.2` | Clicking Release link in DOC header navigates to Release Detail | `doc-release-linkage.spec.ts` | Assert URL contains `ReleaseDetail` or heading "Release" visible; use `page.goBack()` for cleanup |

### P2 — Digital Offer Details: Release Dropdown

| TC ID | Title | Spec | Notes |
|-------|-------|------|-------|
| `ATC-11.16.3` | Release dropdown lists available releases for the product | `doc-detail-offer.spec.ts` (extend) | Enter edit mode; assert combobox shows at least one option |
| `ATC-11.16.4` | Selecting a release auto-populates Target Release Date (read-only) | `doc-detail-offer.spec.ts` (extend) | Select a release; assert Target Release Date has a non-empty value |
| `ATC-11.16.5` | Selecting "Other Release" shows "Release Version" text input | Already covered by `DOC-OFFER-005` — verify it passes |
| `ATC-11.16.6` | Target Release Date field is disabled / read-only in edit mode | Already covered by `DOC-OFFER-009` — verify it passes |
| `ATC-11.16.7` | Release Version text field is empty when switching back from "Other Release" to a named release | `doc-detail-offer.spec.ts` (extend) | Switch to Other Release → enter version → switch to real release → assert version field hidden |

### P2 — My DOCs Grid: Release Version Column

| TC ID | Title | Spec | Notes |
|-------|-------|------|-------|
| `ATC-11.16.8` | My DOCs grid shows "Target Release Date" column | `landing/my-docs-tab.spec.ts` (extend) | Assert column header visible (already covered by LANDING-DOCS-003, but add explicit target release date check) |
| `ATC-11.16.9` | DOC row in My DOCs shows a non-empty Target Release Date value | `landing/my-docs-tab.spec.ts` (extend) | Assert at least one row has a non-empty cell in the Target Release Date column |

### P2 — Product Detail: Digital Offer Certification Tab

| TC ID | Title | Spec | Notes |
|-------|-------|------|-------|
| `ATC-11.16.10` | Digital Offer Certification tab appears on Product Detail after DOC is initiated | `doc-release-linkage.spec.ts` | Navigate to Product Detail of the DOC's product; assert "Digital Offer Certification" tab label visible |
| `ATC-11.16.11` | Digital Offer Certification tab shows DOC Name, DOC Status, and VESTA ID | `doc-release-linkage.spec.ts` | Click tab; assert data rows visible; assert DOC status is not empty |

---

## Pre-flight Checks (Before Writing Code)

1. **MCP snapshot required:**
   - Open DOC Detail header → identify the exact text of the release link (e.g., "Release: v1.2" or a standalone link).
   - Open Digital Offer Details in edit mode → snapshot the Release combobox and Target Release Date field.
   - Navigate to Product Detail → identify if "Digital Offer Certification" tab is labeled exactly that.
   - Note the exact column header text for "Target Release Date" in the My DOCs grid.

2. **Check existing coverage:** `doc-detail-offer.spec.ts` already covers TC-11.16.5 and TC-11.16.6. Reuse those tests; do not duplicate.

3. **Identify Release Detail URL pattern:** Determine if the release link is an `<a>` with `href` containing `ReleaseDetail` or something else. Record in the locator factory.

---

## Code Generation Rules

- New spec `doc-release-linkage.spec.ts` for tests not fitting existing offer/detail spec files.
- Extend `doc-detail-offer.spec.ts` only for ATC-11.16.3, 11.16.4, 11.16.7 (they belong in the offer spec thematically).
- Extend `landing/my-docs-tab.spec.ts` only for ATC-11.16.8–11.16.9.
- Use `test.setTimeout(90_000)` for all read-only navigation tests.
- New locators go into `src/locators/doc-details.locators.ts` (extend existing factory).
- Page object navigation to Release Detail: add `navigateToLinkedRelease()` method in `doc-details.page.ts`.
- Page object navigation to Product Detail DOC tab: extend `new-product.page.ts` or create `product-detail.page.ts` if not existing.
- After code generation: `npx playwright test tests/doc/doc-release-linkage.spec.ts --project=pw-autotest`

---

## After Running

- Update `docs/ai/automation-testing-plan.md` section **11.4** (header release link) and **11.5** (offer tab release dropdown) with new TC statuses.
- Add new section **11.16 DOC–Release Linkage** to the plan if not already present.
- Update `docs/ai/current-automation-coverage-matrix.md`.
- If release link navigation fails due to a permission/access issue, classify as **test-data blocker** (not a defect).
