# Knowledge — Delegated Requirements Traceability

> Tier 2 · on-demand · distilled from Confluence 587596145 + Jira PIC-8802, PIC-8803, PIC-8804, PIC-8833, PIC-8839.
> Last verified: 2026-04-24. Feature area: `releases`.

## Overview

When a product team cannot address a security requirement themselves (e.g., a component is built by another team), they can delegate that requirement to another product. **Delegated Requirements Traceability** (PIC-8802) extends the existing "Delegated" status in PICASso by linking the originating requirement to the exact target product, release, and requirement — enabling full lifecycle traceability. Applies to both **Process Requirements** and **Product Requirements** tabs.

Implemented stories in production: PIC-8803 (manual + bulk delegation popup), PIC-8804 (display & edit), PIC-8833 (XLSX export/import), PIC-8839 (Jira/Jama sync warning). On Hold: PIC-8805 (Actions Management auto-creation).

---

## Key UI Elements

### Delegation Details Popup

Opened by:
- Three-dot menu on a requirement row → `Delegated`
- Actions column → `View/Edit` → `Edit` → change status dropdown to `Delegated`

Available from both Process Requirements and Product Requirements tabs.

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| `Product Name` | Dropdown + search | Yes | Search by Product ID or Product Name. `Other Product` pinned to top of list. |
| `Other Product` | Free text | Yes (if Other Product selected) | Appears only when `Other Product` is chosen in `Product Name`. |
| `Contact Person` | User lookup | Yes (if product not in PICASso) | Appears when `Other Product` is selected. User responsible for implementing the delegated requirement. |
| `Product Release` | Dropdown (or free text) | No | Lists active releases of the selected product. `Other Release` option available. Free text when `Other Product` is selected. |
| `Requirement` | Dropdown + search | No | Lists requirements of the selected release, filtered by type (process/product). `Requirement Not Found` option available. If selected — free text fields for requirement code/name appear. |
| `Status` | Read-only | — | Auto-populated from the selected Requirement's current status. |
| `Evaluation Status` | Read-only | — | Auto-populated; updates in real time if status changes on the target product. |
| `Due Date` | Date picker | No | Omitting triggers a confirmation popup before save. Past dates are allowed. |
| `Delegated Requirement Part` | Free text | No | Describes which part of the current requirement the selected requirement covers. |

**Multi-product support:**
- `+Add Product` button adds an additional product delegation form (with its own fields above).
- `Remove Product` button (visible when ≥2 forms) triggers confirmation: *"Are you sure you want to remove this product?"*

**Multi-requirement support (per product):**
- `+Add Requirement` button adds an additional `Requirement` + `Delegated Requirement Part` row within one product form.
- `Remove Requirement` button triggers confirmation: *"Are you sure you want to remove this requirement?"*

### Due Date Omission Confirmation
When `Save` is clicked without a `Due Date`, the system shows:
> *"You haven't specified a due date for requirement(s) delegated to following products: \<product name\>. Are you sure you want to save requirement without setting it?"*

User may confirm to save anyway.

### Bulk Update popup
If multiple requirement rows are selected and bulk status is set to `Delegated`, the same delegation popup appears with identical fields and `+Add Product` / `+Add Requirement` support.

---

## Delegation Display — Requirement Info Popup (View mode)

After delegation is saved, the **Requirement Info** popup (View/Edit → view mode) displays delegation section as **read-only** with:
- `Delegated to Product`
- `Delegated to Release`
- `Delegated to Requirement`
- `Status` (of the target requirement)
- `Evaluation Status`
- `Delegated Requirement Part`
- `Due Date`

**Clickable links:** `Delegated to Product` and `Delegated to Release` values are hyperlinks that navigate to the respective product/release detail pages.

---

## Delegation Display — Receiving Requirement

The requirement that *others are delegated to* receives:

1. **Information icon (ℹ)** next to its status on the grid row. Tooltip: *"Requirement(s) was delegated to this requirement."*

2. **Collapsible "Delegated Requirement" section** in its Requirement Info popup showing (per delegating requirement):
   - `Requirement Name`
   - `Status`
   - `Delegated from Product`
   - `Delegated from Release`
   - `Comment`
   - `Due Date`

---

## Delegation Display — CSRR Tab

Delegation details surface in both CSRR sub-sections:

- **SDL Processes Summary** (for process requirements): `View Requirement` / `Edit Evaluation Status` popup shows the delegation fields for any delegated process requirement.
- **Product Requirements Summary** (for product requirements): same popup pattern.

Additionally, a receiving requirement (one that was *delegated to*) shows a collapsible `Delegated Requirement` accordion in the same CSRR popup sections.

---

## XLSX Export / Import

### Export
The XLSX export for Process Requirements and Product Requirements gains a **`Delegation Details` tab** (in addition to the existing `Data` and `Instructions` tabs). Columns on that tab:

| Column | Notes |
|---|---|
| `Requirement Code` | Code of the delegated requirement (from `Data` tab) |
| `Requirement Name` | Name of the delegated requirement |
| `Delegated to Product ID` | Format `PIC-xxx`. Populated if product exists in PICASso. |
| `Delegated to Product Name` | Populated regardless of whether the product exists in PICASso. |
| `Delegated to Release ID` | Populated if release exists in PICASso. |
| `Delegated to Product Release` | Release version/name. |
| `Delegated to Requirement Code` | Requirement code in the target release. |
| `Delegated to Requirement Name` | Requirement name. |
| `Delegation Due Date` | Format `YYYY-MM-DD`. Optional; past dates allowed. |
| `Delegated Requirement Part` | Free-text part specifier. Optional. |

### Import validation rules
| Condition | Outcome |
|---|---|
| Both `Delegated to Product ID` and `Delegated to Product Name` are empty | Error |
| `Delegated to Product ID` exists in PICASso | Product is linked; name is auto-resolved |
| `Delegated to Product ID` is empty but `Product Name` is provided | Treated as "not in PICASso" |
| `Delegated to Requirement Code` not in the requirements library | Error |
| `Delegated to Requirement Code` exists but not scoped for the specified release | Error |
| `Delegation Due Date` is in the past | Accepted without error (past dates explicitly allowed) |
| `Delegated to Release ID` absent when product exists in PICASso | Accepted (optional) |

---

## Jira / Jama API Sync Warning (PIC-8839)

If a requirement's status is set to `Delegated` via Jira/Jama sync (not manually in PICASso), and delegation traceability details are missing:

- A **warning icon (⚠)** appears next to the `Delegated` status label on the requirement row.
- Hovering/clicking reveals the message: *"Please specify delegation details"*.

If at least one such unresolved warning exists in the release:

- Attempting to submit the release to the next stage shows a **warning message** (listing the affected requirements).
- Submission is **NOT blocked** — user can proceed past the warning.

---

## Workflows / Business Rules

1. Only requirements currently in a non-terminal status can be set to `Delegated` via the three-dot menu. The menu action is hidden for requirements in terminal states.
2. A single requirement can be delegated to **multiple products** (via `+Add Product`), and within each product, to **multiple requirements** (via `+Add Requirement`).
3. When delegating to a product that **does not exist in PICASso** (`Other Product`), the `Contact Person` user lookup is mandatory — it designates the responsible person for that external product.
4. `Product Release` is a **dropdown** when a known PICASso product is selected; it becomes a **free-text field** when `Other Product` is selected.
5. If `Other Release` is selected in `Product Release`, an additional `Other Release` free-text field appears to capture the version manually.
6. `Evaluation Status` in the popup updates in **real time** — if the status of the target requirement changes on the delegated-to product, the originating release's delegation info reflects it without a manual refresh.
7. Delegation edits (change product, release, requirement, due date) are made via the **Edit Requirement** popup (delegation fields are editable there). The Requirement Info (view) popup is read-only.

---

## Edge Cases & Validations

- Saving with `Product Name` empty → inline validation error, popup stays open.
- Saving with `Other Product` selected but `Other Product` free-text empty → validation error.
- Saving with `Contact Person` empty when `Other Product` is selected → validation error.
- Removing all products leaves one empty product form (cannot reach a state with zero forms).
- Removing all requirement rows leaves one empty `Requirement` field row.
- `+Add Product` is available regardless of how many forms are already open (no hard cap documented).
- Bulk delegation: if multiple requirements are delegated to the same product and `Other Product` is used, the same `Contact Person` field applies to the bulk form.
- XLSX import with `Delegated to Requirement Code` that is valid in the library but NOT scoped for the target release → error (not a generic "not found" error — the message should distinguish the scoping issue from a missing-code issue).

---

## Role-Based Access

| Role | Can | Cannot |
|---|---|---|
| Security Manager | Set Delegated, fill delegation popup, edit, bulk update, export/import XLSX | — |
| Product Owner | View delegation details (read-only Requirement Info) | Edit delegation fields |
| Security Advisor | View delegation details | Edit delegation fields |
| Process Quality Leader | View delegation details | Set Delegated status |
| Viewer Global / Viewer Product | View delegation info in Requirement Info popup | Any edit action |

Privilege gate: `SCOPE_SUBMIT` is required to change requirement status (including to Delegated) on the Process/Product Requirements tabs.

---

## Related Features

- `releases.process-requirements.grid` — parent feature; delegation popup is reached via the three-dot action on grid rows.
- `releases.product-requirements.grid` — same delegation popup applies to product requirements.
- `releases.requirements.versioning` — sibling feature on the same tab (PIC-8504); both affect the requirements grid simultaneously.
- `releases.requirements.filters` — multi-select filter upgrade (PIC-10367).
- `releases.csrr.sdl-summary` and `releases.csrr.product-summary` — delegation info surfaces inside CSRR SDL and Product summary sub-sections.

## Sources

- **Confluence:** 587596145 (Delegated Requirements Traceability, primary spec, v59) · 709600377 · 688765443 · 715847649.
- **Jira:** PIC-8802 (Feature) · PIC-8803 (manual + bulk) · PIC-8804 (display & edit) · PIC-8833 (XLSX) · PIC-8839 (Jira/Jama sync warning). PIC-8805 on hold.
- **Tracker scenarios:** `RELEASE-REQ-DELEGATED-001` – `RELEASE-REQ-DELEGATED-029` (workflow: "Delegated Requirements Traceability").
- **Spec file:** `specs/releases-delegated-requirements-traceability-test-cases.md`.
