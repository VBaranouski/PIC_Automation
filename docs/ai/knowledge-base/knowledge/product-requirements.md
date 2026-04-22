# Knowledge — Product Requirements

> Tier 2 · on-demand · distilled from User Guide + Confluence + QA exploration walk.
> Sources: Confluence 688765053 (Software Composition Details Scan & Component Management); UG §Product Requirements; exploration-findings.md §Release Detail.

## Overview

The **Product Requirements** tab (under Release Detail) lists technical/product controls that must be satisfied for release sign-off. It pairs with **Software Composition Analysis (SCA)** scan data — feature 688765053 introduces a new Scan-to-Component model replacing the legacy independent-scan-and-component storage.

## Key UI Elements

### Tab location
- Release Detail → **Product Requirements** sub-tab.
- Siblings: Questionnaire, Process Requirements, Review & Confirm, Data Protection and Privacy Review, Cybersecurity Residual Risks, FCSR Decision.

### Grid filters (multi-select after PIC-10367)
- Category, Sources, Status, Sub-Status, Priority.

### SCA — Add Scan Results modal (feature 688765053)
Entry point: **Add Scan Results** button on Product Requirements tab (CSRR / SCA sub-section).

| Element | Type | Notes |
|---|---|---|
| Software Composition Analysis Tool | dropdown (required) | Values: `Black Duck Binary Analysis`, `Black Duck Hub`, `JFrog Xray`, `Other`. |
| Scan ID (BDBA only) | text (numeric, required) | Instruction text explains where to find Scan ID in BlackDuck URL. |
| Import Scan Results | button | Loading state on click. Enables Add after success. |
| Add | button | Disabled until scan is imported (BDBA) or fields filled (manual). |
| Cancel | button | Always enabled. Discards input. |

### Scan / Component data model
```
Release ─┬─ Scan #1 ─┬─ Component A
         │           ├─ Component B
         │           └─ Component C
         └─ Scan #2 ─┬─ Component D
                     └─ Component E
```
Each Component belongs to **exactly one** Scan; deleting a Scan removes all its Components (legacy many-to-many is gone).

## Workflows / Business Rules

### 1. Add Scan Results — BDBA import path
1. Open modal → pick `Black Duck Binary Analysis`.
2. Paste BlackDuck Scan ID (numeric). Click **Import Scan Results**.
3. System fetches component list + vulnerabilities from BlackDuck.
4. User clicks **Add** to persist under the current release.

### 2. Manual scan entry (no IMPORTBDBA privilege)
1. Pick tool other than BDBA (or BDBA with manual toggle, if available).
2. Enter components one-by-one (name, version, license, CVE list).
3. Severity level is resolved via BackOffice CVSS Severity Levels table (`MANAGE_REF_DATA` privilege).

### 3. Re-import / refresh
- Re-import replaces Components under the same Scan.
- Refresh updates vulnerabilities only (component identity stays).
- Both actions require `IMPORTBDBA`.

### 4. Legacy / cloned data
- Releases cloned from a pre-688765053 release inherit Scans under the new model (conversion applied at clone).
- Orphan components (no parent Scan) are migrated into a synthetic `Legacy Scan` bucket.

## Edge Cases & Validations

- BDBA import must block when Scan ID is non-numeric (inline error).
- Add button must stay disabled until either (a) successful import, or (b) at least one component captured manually.
- Removing a Scan must show confirmation listing all child components.
- Extraction & Injection APIs reflect the new model — old payload shape (`scans[]` + `components[]` as siblings) is deprecated; tests against the API must use `scans[].components[]` nested.

## Role-Based Access

| Role | Privileges | Can | Cannot |
|---|---|---|---|
| Security Advisor | IMPORTBDBA | Import/refresh BDBA, add manual | — |
| Developer | — | Add manual scan data | Import from BlackDuck |
| Process Quality Leader | — | Review | Import or delete Scans |
| BackOffice Admin | MANAGE_REF_DATA | Edit CVSS Severity Levels | — |

## Related Features

- `releases.sca.component-management` — NEW (this doc).
- `releases.requirements.filters` — shared multi-select pattern.
- `releases.csrr.residual-risks` — consumes Scan vulnerabilities.

## Sources

- **Confluence:** 688765053 (Software Composition Details Scan & Component Management, v6).
- **User Guide:** `Self-Help - PICASso - User Guide - Copy.md` §Product Requirements, §Software Composition Analysis.
- **Exploration:** `exploration-findings.md` §Release Detail (2026-04-22) — confirms "Included SE Components" + "Part of SE Products" buttons on Release Detail.
- **Jira:** INT-INGEST-API-007 (tracker integrations area) — related API-level test.
