# Knowledge — Process Requirements

> Tier 2 · on-demand · distilled from User Guide + Confluence + QA exploration walk.
> Sources: Confluence 610919092, 587596145; UG `Self-Help - PICASso - User Guide - Copy.md` §Process Requirements; exploration-findings.md §Release Detail.

## Overview

The **Process Requirements** tab (under Release Detail) lists mandatory engineering activities for a release. Each requirement has a code, name, description, formula, SDL Practice, sub-status, accountable role/person, and versioning state. Two active initiatives reshape this tab: **Requirements Versioning** (610919092 / PIC-8504 feature) and **Delegated Requirements Traceability** (587596145 / PIC-2829 BAU).

## Key UI Elements

### Location
- Release Detail → **Process Requirements** sub-tab (confirmed by exploration-findings.md).
- Sibling tabs: Release Details, Roles & Responsibilities, Questionnaire, **Product Requirements**, Review & Confirm, Data Protection and Privacy Review, Cybersecurity Residual Risks, FCSR Decision.

### Grid & filters (applies to Process + Product Requirements)
- Multi-select filters (PIC-10367): SDL Practice, Status, Sub-Status, Accountable Role/Person, Category, Sources, Priority.
- Row-level controls: three-dot action menu per row, **View/Edit** in Actions column.

### Versioning banner (feature 610919092)
- Warning/info banner at top of the tab when a newer requirements-database version exists for a scoped requirement.
- Banner displays list of changes and (if configured in BackOffice) an auto-apply date.
- Actions in the banner: **Keep previous version**, **Change version** (opens row selector; offers "Update status to Planned" toggle, default off).

### Delegated status popup (feature 587596145)
Triggered by: three-dot menu → **Delegated**, OR Actions → View/Edit → Edit → set status = Delegated.

> **Full field reference, validation rules, XLSX export/import columns, Jira/Jama sync warning, and CSRR display details** are in the dedicated knowledge file:
> `docs/ai/knowledge-base/knowledge/delegated-requirements-traceability.md`

## Workflows / Business Rules

### Versioning — major vs minor field changes
- **Major fields:** `code`, `name`, `description`, `formula`. Any change triggers a re-scope warning.
- **Minor fields:** any other field. Changes flow through silently on the next re-scope.

### Versioning — behaviour by release status

| Release status | Behaviour on newer version |
|---|---|
| Scoping (not yet scoped) | Scope with latest version when questionnaire is completed. |
| Scoping (already scoped) or cloned release | Warning banner appears; user chooses Keep / Change. |
| In Progress (Manage) | Same as above. |
| FCSR Readiness, FCSR Review, Final Acceptance, Issue closure | No notification, no update. |
| Completed, Cancelled, Inactive | No notification, no update. |

### Delegated traceability — status flow
- Manual re-scoping (questionnaire / risk update / explicit rescope) refreshes linked delegated products.
- When the delegated requirement's target product/release status changes, the banner on the originating release updates (parked-requirements sub-tree 709600377, sub-status workflow 715847649).

## Edge Cases & Validations

- `Other Product` path must persist free-text exactly as entered (no sanitisation lowercases it). Never clear on reopen.
- Saving Delegated without Product Name + Contact Person must block with inline error.
- Versioning "Change version" with zero rows selected must no-op (not dismiss the banner).
- When the auto-apply date is reached, the system overrides the user's `Keep previous version` choice silently — assertion must verify banner flips from warning to info.

## Role-Based Access

| Role | Can | Cannot |
|---|---|---|
| Security Advisor | View banner, trigger Change/Keep, set Delegated, re-scope | — |
| Process Quality Leader | View banner, approve scoped set | Trigger Delegated popup (read-only) |
| Product Owner | View only | Modify status, change version |
| Developer / Contributor | View own requirements | Trigger versioning changes |
| Tech Lead | Enter evidence, change sub-status | Change version |

## Related Features

- `releases.requirements.versioning` — NEW (this doc).
- `releases.requirements.traceability.delegated` — NEW (this doc).
- `releases.requirements.filters` — IMPROVEMENT (PIC-10367 multi-select).
- `releases.process-requirements.bulk-edit` — existing.
- `releases.product-requirements.grid` — sibling tab, same filter pattern.

## Sources

- **Confluence:** 610919092 (Product & Process Requirements Versioning, v44) · 587596145 (Delegated Requirements Traceability, v59) · 709600377 (Parked Requirements) · 688765443 (Part 2) · 715847649 (Part 3 — sub-status / history / grouping).
- **User Guide:** `docs/ai/knowledge-base/user-guides/Self-Help - PICASso - User Guide - Copy.md` — sections on Process Requirements grid and Release Detail lifecycle.
- **Exploration:** `docs/ai/knowledge-base/exploration-findings.md` §Release Detail (2026-04-22).
- **Jira epic:** PIC-8504 (versioning), PIC-2829 (BAU delegated).
