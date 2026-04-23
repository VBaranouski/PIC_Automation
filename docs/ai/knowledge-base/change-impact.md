# Change Impact — Tier 1 · Rolling 2-Sprint Log

> Always loaded. Keep ≤ 40 rows (last 2 sprints). Older entries roll to [change-impact-archive.md](change-impact-archive.md).

## Schema

| Jira | Fix Version | Area | Feature-ID | Type | Change Summary | Knowledge File | Scenarios to Review | Status |
|---|---|---|---|---|---|---|---|---|

- **Type:** `NEW` or `IMPROVEMENT`
- **Status:** `pending` → `in-progress` → `done`
- **Scenarios to Review:** comma-separated scenario-id prefixes from the tracker
- Feature-ID format: `<area>.<slug>` (e.g. `releases.questionnaire.auto-gen`)

## Entries

| Jira | Fix Version | Area | Feature-ID | Type | Change Summary | Knowledge File | Scenarios to Review | Status |
|---|---|---|---|---|---|---|---|---|
| — | — | backoffice | backoffice.access-privileges | NEW | Created access-privileges.md knowledge file from Access Privileges 21.4.xlsx — 158 unique privileges × 21 roles, 19 functional areas, role groups, test usage notes | knowledge/access-privileges.md | — | done |
| PIC-10367 | PIC-2026-RC-11.0 | releases | releases.requirements.filters | IMPROVEMENT | Convert single-select → multi-select filters on Process/Product Requirements, CSRR summaries, DP&P tabs | knowledge/process-requirements.md, knowledge/product-requirements.md | — | pending |
| PIC-8504 | PIC-2026-RC-11.0 | releases | releases.requirements.versioning | NEW | Product & Process Requirements Versioning — banner, Keep/Change version flow, auto-apply date, major vs minor field rules | knowledge/process-requirements.md | RELEASE-REQ-VERSION-* | pending |
| PIC-2829 | BAU | releases | releases.requirements.traceability.delegated | NEW | Delegated Requirements Traceability popup with Product Name, Other Product, Contact Person, Release, Evidence link, Justification | knowledge/process-requirements.md | RELEASE-REQ-DELEGATED-* | pending |
| — | PIC-2026-RC-11.0 | releases | releases.sca.component-management | NEW | Scan-to-Component data model + Add Scan Results modal (BDBA import, manual scan, CVSS severity from BackOffice) | knowledge/product-requirements.md | RELEASE-SCA-* | pending |
| — | PIC-2026-RC-11.0 | releases | releases.data-protection.privacy-by-design | NEW | Privacy Sections maturity, Recommendation, PCC Decision (High-risk gated), Data Extraction API update | knowledge/data-protection.md | RELEASE-DPP-* | pending |
| — | PIC-2026-RC-11.0 | reports | reports.tableau.data-privacy | NEW | 4 Master Data reports + Top Privacy Gaps + Crown Jewels matrix with RLS drill-down (Org L1→L2→L3) | knowledge/reports-dashboards.md | REPORT-DPP-* | pending |
| — | — | releases | releases.signoff.privacy | NEW | Privacy Reviewer workflow at SA & PQL Sign Off — N/A marking, maturity levels, evidence rating, FCSR recommendation, PCC Decision | knowledge/data-protection.md | RELEASE-DPP-PRIVACY-001–RELEASE-DPP-PRIVACY-007 | pending |
| — | — | releases | releases.fcsr.exception | NEW | FCSR Exception path — CISO and/or SVP LOB review and approval for exception decisions | — | RELEASE-FCSR-EXCEPTION-001–RELEASE-FCSR-EXCEPTION-003 | pending |
| — | — | integrations | integrations.data-extraction | NEW | Data Extraction API — 17 scenarios with steps, 5 new gap-filling scenarios | knowledge/data-protection.md | INT-EXTRACT-* | done |
| — | — | integrations | integrations.data-ingestion | NEW | Data Ingestion API — 22 scenarios with steps, 3 new gap-filling scenarios | — | INT-INGEST-* | done |
| — | — | integrations | integrations.intel-ds | NEW | Intel DS / Informatica training completion — 26 scenarios with steps, 4 new gap-filling scenarios | — | INT-INTELDS-* | done |
| — | — | other | other.email-notifications | NEW | Email Notifications & Task Triggers — 29 new scenarios covering 17 UG email types + tasks | — | NOTIF-* | done |
| — | — | other | other.maintenance-mode | NEW | Maintenance Mode — 24 scenarios with steps, 3 new gap-filling scenarios | — | MAINTENANCE-* | done |
| — | — | reports | reports.tableau | NEW | Reports & Dashboards — 28 scenarios with steps, 3 new gap-filling scenarios | knowledge/reports-dashboards.md | REPORT-TABLEAU-* | done |
| — | — | backoffice | backoffice.requirements-versioning | NEW | Requirements Versioning BackOffice — 32 scenarios with steps, 2 new gap-filling scenarios | — | BACKOFFICE-VERSION-* | done |
| — | — | releases | releases.data-protection | IMPROVEMENT | DPP Review — 54 scenarios with steps, 5 new gap-filling scenarios | knowledge/data-protection.md | RELEASE-DPP-* | done |
| — | — | releases | releases.details.history | IMPROVEMENT | Release History — 22 scenarios with steps, 2 new role-based scenarios | — | RELEASE-HISTORY-* | done |
| — | — | releases | releases.stage-sidebar | IMPROVEMENT | Stage Sidebar — 19 scenarios with steps, 3 new gap-filling scenarios | — | STAGE-SIDEBAR-* | done |
| — | — | integrations | — | REMOVAL | Deleted `user-guides/Picasso API Doc.md` (534-line API & CI/CD design doc); superseded by `user-guides/PICASso Data Extraction API.md` and the Data Ingestion API knowledge files added in PR #10 | knowledge/data-ingestion-api.md | — | done |

## Rolling rules

1. A row older than 2 fix versions moves to `change-impact-archive.md` on the next sprint close.
2. When a row transitions to `done`, set the feature-registry `last-verified` date in the matching area file.
3. If a `NEW` row is added, ensure its feature-id also appears in `feature-registry/<area>.md` within the same PR.
