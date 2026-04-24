# Knowledge — Product & Release Inactivation

> Tier 2 · on-demand · area = `products`
> Source: Confluence page-id 561972034 · PIC-6769 · PIC-7643 · PIC-7644 · PIC-7648
> Last verified: 2026-04-24 (In Production)

## Overview

Allows `ProductAdmin` (and equivalent roles) to soft-delete Products and Releases by setting their status to "Inactive". Records are kept in the database for auditability and easy recovery. Once inactivated, a product or release is read-only and hidden from default active views. The feature is gated by two dedicated privileges: `INACTIVATE_PRODUCT` and `INACTIVATE_RELEASE`.

---

## Key UI Elements

### Product Inactivation
- **My Products tab → Actions column** — a new column containing a three-dot (⋮) icon per row; only visible to users with `INACTIVATE_PRODUCT`. Clicking opens a context menu with `Inactivate`.
- **Product Details page → three-dot (⋮) button** — placed next to the product status badge in the header; opens a dropdown with `Inactivate`. Hidden from users without the privilege.
- **Inactivate Product modal** — title: "Inactivate Product"; confirmation text: "Are you sure you want to inactivate this Product? This action is irreversible."; mandatory `Justification` text field; buttons: `Cancel` and `Inactivate Product`.
- **"Show Active Only" toggle** on My Products tab — replaces the old "Show inactive products" toggle. Default: ON (only active products shown). When OFF: active + inactive both shown.
- **Inactive status badge** — hoverable; tooltip reads: "The product was inactivated due to \<justification\>." Shown on both My Products tab and Product Details page.

### Release Inactivation
- **Product Details → Releases tab → Actions column** — three-dot (⋮) icon per release row. Shows `Inactivate` + `Clone` when user has both `INACTIVATE_RELEASE` and release-creation privileges; shows only `Clone` when user can create but cannot inactivate; hidden entirely when user has neither.
- **My Releases tab → Actions column** — same three-dot pattern; entire column hidden from users without `INACTIVATE_RELEASE`.
- **Inactivate Release modal** — title: "Inactivate Release"; confirmation text: "Are you sure you want to inactivate this Release? This action is irreversible."; mandatory `Justification` text field; buttons: `Cancel` and `Inactivate Release`.
- **"Show Active Only" toggle** on My Releases tab and on the Product → Releases tab — replaces "Show completed releases". Default: ON (only ongoing). When OFF: Completed, Cancelled, and Inactive releases shown.
- **Inactive release status badge** — hoverable; tooltip: "The release was inactivated due to \<justification\>." Shown on My Releases, Product Releases tab, and Release Details page.

---

## Workflows / Business Rules

### Product Inactivation
1. **Eligibility check** — a product can be inactivated only if it has **no active or completed releases/DOCs**. Allowed states for releases/DOCs: Cancelled or Inactive. If the product has ≥1 ongoing or completed release/DOC, the `Inactivate` button is greyed out with a tooltip: _"Product cannot be inactivated as it has ongoing and/or completed releases/DOCs. If this product is no longer commercialized nor supported, it's Product State attribute is to be set to 'End of Life'."_
2. **Trigger** — clicking enabled `Inactivate` (from My Products Actions column OR Product Details three-dot) opens the confirmation modal.
3. **Justification** — the `Justification` field is mandatory; the `Inactivate Product` button is disabled until non-empty text is entered.
4. **Confirmation** — clicking `Inactivate Product` changes product status to "Inactive"; clicking `Cancel` or `×` closes the modal with no changes.
5. **Post-inactivation** — product status becomes "Inactive" on both My Products tab and Product Details page; product is read-only (no edits, no new releases or DOCs); hidden from My Products tab when "Show Active Only" is ON.

### Release Inactivation
1. **Eligibility by release state:**
   - "Creation & Scoping" stage → `Inactivate` enabled.
   - Active release past "Creation & Scoping" → `Inactivate` greyed out with tooltip: _"Release cannot be inactivated as it passed 'Creation & Scoping' stage. If this release is no longer valid, it can be cancelled."_
   - Completed release → `Inactivate` not shown at all; only `Clone` available.
   - Manually cancelled release → `Inactivate` enabled.
   - Release cancelled due to **No-Go FCSR Decision** → `Inactivate` greyed out with tooltip: _"This release cannot be inactivated as it was cancelled due to 'No-Go' FCSR Decision."_ (Bug PIC-8038 fixed — previously was incorrectly allowed.)
2. **Trigger** — clicking enabled `Inactivate` (from My Releases Actions OR Product Releases tab Actions) opens the confirmation modal.
3. **Justification** — mandatory; submit blocked while empty.
4. **Confirmation** — `Inactivate Release` sets status to "Inactive"; `Cancel` closes with no changes.
5. **Post-inactivation** — status "Inactive" appears in all release views; release is hidden when "Show Active Only" is ON; **name re-use allowed** — a new release with the same name can be created after the original is inactivated.
6. **New status in BackOffice** — "Inactive" release status must be created in BackOffice → Release Settings → Release Statuses and appears in the Status filter on My Releases tab.

---

## Edge Cases & Validations

| Scenario | System Behaviour |
|----------|-----------------|
| Empty `Justification` on submit | `Inactivate Product/Release` button disabled; form not submitted |
| Clicking `Cancel` or `×` on modal | Modal closes; no status change; no data saved |
| Product with active release → Inactivate menu item | Greyed out with tooltip |
| Release past Creation & Scoping → Inactivate | Greyed out with tooltip |
| Completed release in Actions menu | Only `Clone` shown; no `Inactivate` |
| No-Go FCSR cancelled release → Inactivate | Greyed out (not absent) — tooltip shown |
| Manually cancelled release → Inactivate | Enabled |
| Inactive product → edit product | Edit button absent or disabled |
| Inactive product → create new release | New Release button absent or disabled |
| Creating release with same name as inactive release | Allowed (name uniqueness only applies to active releases) |
| "Show Active Only" toggle default state | ON by default on both My Products and My Releases tabs |

---

## Role-Based Access

| Role | INACTIVATE_PRODUCT | INACTIVATE_RELEASE | Notes |
|------|-------------------|--------------------|-------|
| `ProductAdmin` (Global, Org 1/2/3) | ✅ | ✅ | Primary test actor for all inactivation tests |
| `Delegate Product Admin` (all levels) | ✅ | ✅ | Inherited via delegation |
| `SuperUser` | ✅ | ✅ | Full system access |
| `Global` (Global, Org 1) | ✅ | ✅ | Cross-org scope |
| `Product Owner` | ❌ | ❌ | Cannot inactivate; no Actions column on My Products/My Releases |
| `Security Manager` | ❌ | ❌ | Cannot inactivate |
| `Viewer Global / Viewer Product` | ❌ | ❌ | Read-only; no actions at all |

**Denied-access test role:** `Product Owner` — use this role for RBAC negative scenarios. It is in the "Product team" group but holds neither `INACTIVATE_PRODUCT` nor `INACTIVATE_RELEASE`.

---

## Related Features

- `products.inactivate` — `PRODUCT-INACTIVATE-*` scenarios (9 existing + 9 new from PIC-6769 session)
- `products.release-inactivate` — `RELEASE-INACTIVATE-*` scenarios (13 new from PIC-6769 session)
- `landing.my-products` — "Show Active Only" toggle tested in `LANDING-MY-PRODUCTS-003`, `LANDING-PRODS-ACTIONS-001`
- `landing.my-releases` — "Show Active Only" toggle tested in `LANDING-RELS-ACTIVE-001/002`
- `releases.create` — name re-use post-inactivation tested in `RELEASE-CREATE-019`

---

## Sources

- **Confluence:** page-id 561972034 — "Product/Release Inactivation", last verified 2026-04-24
- **Jira:** PIC-6769 (Feature), PIC-7643 (Product Inactivation — In Production), PIC-7644 (Release Inactivation — In Production), PIC-7648 (Privileges — In Production), PIC-8038 (Bug fix: No-Go FCSR guard — Closed)
- **Spec file:** `specs/product-management-test-cases.md` § 7–8
