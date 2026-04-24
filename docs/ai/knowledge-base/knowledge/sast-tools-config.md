# Knowledge — SAST Tools: BackOffice Configuration

> Tier 2 · on-demand · distilled from Confluence 493626639 (02. Already in Prod)
> Feature area: `backoffice` · Feature-ID: `backoffice.sast.config`
> Last verified: 2026-04-24

## Overview

SAST Tools Configuration in BackOffice allows TechAdmin and SuperUser roles to configure SCA (Software Composition Analysis) tool severity inputs that drive the CSRR (Cyber Security Risk Review) tab on the Release Details page. Admins can define custom severity input rows for SCA tools — setting severity thresholds, weights, and active/inactive status. Changes to these inputs are reflected immediately in the CSRR UI for all users.

## Key UI Elements

**BackOffice — SAST Tools Configuration page** (`/GRC_BackOffice/SASTToolsConfig`)

- Located under **BackOffice → IT Security Configuration → SAST Tools Configuration**
- `Add severity input` button — opens Create popup
- Table columns: `Tool`, `Severity`, `Total`, `Weight`, `Is Active` (toggle), `Actions` (three-dot → Edit / Deactivate)

**SCA Tool Severity Input popup fields:**

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Tool | Dropdown | Yes | SCA tool name (e.g., BDBA, Black Duck, Dependency Track) |
| Severity | Dropdown | Yes | Vulnerability severity level (e.g., Critical, High, Medium, Low) |
| Total | Number input | Yes | Total count of vulnerabilities |
| Weight | Number input | Yes | Weight factor for CSRR score calculation |
| Is Active | Checkbox | No | Determines if input appears in CSRR calculations |

## Workflows / Business Rules

1. **Add severity input**: TechAdmin/SuperUser opens "Add severity input" popup, fills all mandatory fields, saves → new row appears in the list.
2. **Edit severity input**: Click three-dot → Edit → modify fields → save. Changes take effect in CSRR immediately.
3. **Deactivate severity input**: Click three-dot → Deactivate → confirmation popup → confirm → row `Is Active` becomes `false`; no longer counted in CSRR.
4. **Re-activate**: Edit row, set `Is Active = true` → save.
5. **CSRR reflection**: Each severity input row directly affects the SCA sub-section of the CSRR tab on Release Details. Weight × Total drives the score bar and numeric display.
6. **Duplicate prevention**: Adding a row with the same Tool + Severity as an existing active row → validation error.

## Edge Cases & Validations

- **Total = 0** → allowed; weight × 0 = 0 contribution to score.
- **Weight = 0** → allowed; row contributes nothing to CSRR score.
- **Deactivate last active row for a tool** → CSRR section for that tool shows empty / no results.
- **Empty Tool / Severity** → inline validation error; Save blocked.
- **Negative Total or Weight** → validation error; Save blocked.
- **Severity input with no active rows** → CSRR tab still renders; that tool section is hidden or shows "No data".

## Role-Based Access

| Role | Can | Cannot |
|---|---|---|
| `TechAdmin` | View, Add, Edit, Deactivate severity inputs | — |
| `SuperUser` | View, Add, Edit, Deactivate severity inputs | — |
| All other roles | View CSRR results on Release Details | Access SAST Tools Configuration BackOffice page |

**Privilege:**
- `EDIT_SAST_TOOLS_CONFIGURATION` — create, edit, deactivate inputs
- Assigned to: `SuperUser`, `TechAdmin`

## CSRR UI Reflection

When severity input changes are saved in BackOffice, the following updates on Release Details → CSRR tab:

- Score recalculates based on new weights/totals
- Severity row appears/disappears depending on `Is Active` state
- Deactivated rows are not counted in pass/fail thresholds
- The change is visible immediately to all users without page reload (OutSystems partial refresh)

## Related Features

- `releases.sca.component-management` — BDBA import and manual scan flow that populates Total values consumed by these severity inputs.
- `backoffice.banner.config` — Another BackOffice-only configuration feature in the same area.

## Sources

- **Confluence:** page-id `493626639` — "SAST Tools Configuration" (02. Already in Prod)
- **Scenarios:** `BACKOFFICE-SAST-*` (16 scenarios across 3 subsections)
- **Spec file:** `specs/backoffice-sast-tools-config-test-cases.md`
