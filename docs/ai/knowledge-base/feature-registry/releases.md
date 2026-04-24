# Feature Registry — releases

> Tier 2 · on-demand · area = `releases`

## 7-Stage Workflow

| Stage | Scenario-ID Prefix |
|---|---|
| Creation & Scoping | RELEASE-SCOPE-* |
| Review & Confirm | RELEASE-REVIEW-* |
| Manage | RELEASE-MANAGE-* |
| SA & PQL Sign Off | RELEASE-SIGNOFF-* |
| FCSR Review | RELEASE-FCSR-* |
| Post FCSR Actions | RELEASE-POSTFCSR-* |
| Final Acceptance | RELEASE-ACCEPT-* |

## Features

| Feature ID | Description | Status | Scenario-ID Prefix | UG Section | Confluence Page IDs | POM Method(s) | Last Verified |
|---|---|---|---|---|---|---|---|
| releases.create | New Release creation | active | RELEASE-CREATE-* | — | — | `ReleaseDetailPage.create()` | — |
| releases.questionnaire | Security questionnaire for scoping | active | RELEASE-QUESTIONNAIRE-* | — | — | — | — |
| releases.questionnaire.auto-gen | Auto-generate requirements from answers | active | RELEASE-AUTOGEN-* | — | — | — | — |
| releases.process-requirements.grid | Process Requirements tab grid | active | RELEASE-PROCREQ-* | — | — | — | — |
| releases.process-requirements.bulk-edit | Bulk edit on process requirements | active | RELEASE-PROCREQ-BULK-* | — | — | — | — |
| releases.process-requirements.filters | Process Requirements filters (SDL Practice, Status, Sub-Status, Accountable Role/Person) | active | RELEASE-PROCREQ-FILTER-* | — | — | — | — |
| releases.product-requirements.grid | Product Requirements tab grid | active | RELEASE-PRODREQ-* | — | — | — | — |
| releases.product-requirements.filters | Product Requirements filters (Category, Sources, Status, Sub-Status, Priority) | active | RELEASE-PRODREQ-FILTER-* | — | — | — | — |
| releases.requirements.filters | Unified filter conversion to multi-select across all requirement tabs (PIC-10367) | active | RELEASE-REQ-FILTER-* | — | — | — | 2026-04-22 |
| releases.csrr.residual-risks | CSRR — 10 sub-sections | active | RELEASE-CSRR-* | — | — | — | — |
| releases.csrr.sdl-summary | CSRR — SDL Processes Summary | active | RELEASE-CSRR-SDL-* | — | — | — | — |
| releases.csrr.product-summary | CSRR — Product Requirement Summary | active | RELEASE-CSRR-PROD-* | — | — | — | — |
| releases.data-protection | Data Protection & Privacy Review tab | active | RELEASE-DPP-* | — | — | — | — |
| releases.fcsr.decision | FCSR Decision workflow | active | RELEASE-FCSR-DEC-* | — | — | — | — |
| releases.fcsr.report-configurator | FCSR Report Configurator | active | RELEASE-FCSR-RPT-* | — | — | — | — |
| releases.fcsr.approval-hierarchy | Multi-level approval (SA → LOB → BU) | active | RELEASE-FCSR-APPROVE-* | — | — | — | — |
| releases.actions.pre-condition | Pre-condition actions tracking | active | RELEASE-ACTION-PRE-* | — | — | — | — |
| releases.actions.post-condition | Post-condition actions tracking | active | RELEASE-ACTION-POST-* | — | — | — | — |
| releases.signoff.sa | Security Advisor sign-off | active | RELEASE-SIGNOFF-SA-* | — | — | — | — |
| releases.signoff.pql | Process Quality Leader sign-off | active | RELEASE-SIGNOFF-PQL-* | — | — | — | — |
| releases.details.history | Release change history | active | RELEASE-HISTORY-* | — | — | — | — |
| releases.requirements.versioning | Product & Process Requirements versioning banner (Keep / Change version + auto-apply date) | in-development | RELEASE-REQ-VERSION-* | — | 610919092 | — | 2026-04-22 |
| releases.requirements.traceability.delegated | Delegated Requirements Traceability popup (Product Name / Other Product / Contact Person) on Delegated status; delegation display in Requirement Info popup, CSRR, export/import XLSX, Jira/Jama sync warning | active | RELEASE-REQ-DELEGATED-* | — | 587596145, 709600377, 688765443, 715847649 | — | 2026-04-24 |
| releases.sca.component-management | Software Composition Analysis — Scan-to-Component model, Add Scan Results modal, BDBA import | in-development | RELEASE-SCA-001–RELEASE-SCA-055 | — | 688765053 | — | 2026-05-23 |
| releases.data-protection.privacy-by-design | Data Protection & Privacy Review — Privacy Sections, Maturity Levels, Recommendation, PCC Decision | in-development | RELEASE-DPP-* | `triggers-for-the-privacy-review-for-the-release`, `stages-of-the-privacy-review-in-picasso` | 483816813, 457062708, 467663710, 431747813 | — | 2026-04-22 |
| releases.signoff.privacy | Privacy Reviewer workflow at SA & PQL Sign Off — N/A marking, maturity levels, evidence rating, FCSR recommendation, PCC Decision | active | RELEASE-DPP-PRIVACY-001–RELEASE-DPP-PRIVACY-007 | — | — | — | 2026-04-22 |
| releases.fcsr.exception | FCSR Exception path — CISO and/or SVP LOB review & approval required for exception decisions | active | RELEASE-FCSR-EXCEPTION-001–RELEASE-FCSR-EXCEPTION-003 | — | — | — | 2026-04-22 |
