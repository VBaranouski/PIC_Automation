# Knowledge — Data Protection & Privacy

> Tier 2 · on-demand · distilled from User Guide + Confluence + QA exploration walk.
> Sources: Confluence 483816813 (Privacy by design — changes) and its children 457062708 / 467663710 / 431747813; UG `Self-Help - PICASso - Data Protection & Privacy User Guide - Copy.md`; exploration-findings.md §Release Detail.

## Overview

The **Data Protection & Privacy (DP&P) Review** is a release-level workflow that runs in parallel with CSRR when the Product has the DP&P toggle ON. It captures Privacy Risk, Privacy Sections maturity levels, and produces a **Privacy Reviewer Recommendation** plus optional **PCC Decision**. Confluence root 483816813 groups the 2025/2026 "Privacy by design" changes: Data Privacy Updates Based on Content Part 2 (457062708), Data Privacy Process changes (467663710), and Data Extraction API update (431747813).

## Key UI Elements

### Entry points
- **Product Details form** → Product Related Details → `Data Protection & Privacy` toggle (WF16-0001).
- **Release Detail** → `Data Protection and Privacy Review` sub-tab (confirmed in exploration-findings.md).
- **Product Team** tab → `Dedicated Privacy Advisor` lookup field (visible only when DP&P = Yes, WF16-0005).

### Toggle confirmation dialog (WF16-0002/0004)
- Saving Product with DP&P newly ON opens a confirmation: _"Please note that you toggled on 'Data Protection & Privacy' and this will activate the Data protection and privacy tasks in new release."_
- Buttons: **OK** (persist) / **Cancel** (revert toggle to OFF).

### DP&P Review tab structure
Based on UG sections 3.x:
- 3.2.1 Review & update Privacy Questionnaire answers.
- 3.2.2 Review & update calculated Data Protection & Privacy Risk value.
- 3.3.2 Actions on the DP&P Review tab (Privacy Reviewer workflow).
- 3.3.2.1 Complete the Privacy Questionnaire.
- 3.3.2.4 Manage actions specified by the Privacy Reviewer.

### Core fields
- **Privacy Risk** (High / Medium / Low / Not Applicable, BackOffice-coloured).
- **Privacy Reviewer Recommendation** (`GO`, `No GO`, `GO with Pre Conditions`, `GO with Post Conditions`).
- **PCC Decision** (applicable only when Privacy Risk = High; values `Yes` / `No`).
- **Maturity Level** per Privacy Section (BackOffice-configured levels, displayed as coloured circles in reports).
- **Expected Maturity Level** (initial target set per Privacy Section).

## Workflows / Business Rules

### Release-level triggers (UG §Triggers for the Privacy Review)
1. Product has DP&P toggle ON.
2. A new release is created → system auto-generates DP&P review tasks.
3. Privacy Questionnaire answers drive the calculated Privacy Risk.
4. High risk → PCC Decision mandatory before FCSR Readiness.

### Review stages (UG §Stages of the Privacy Review)
1. Scoping (questionnaire answered).
2. In progress (Privacy Reviewer populates Maturity Levels + Actions).
3. Review complete (Recommendation + optional PCC Decision).
4. Release reaches Completed or Cancelled → feeds Tableau reports (see `knowledge/reports-dashboards.md`).

### Data Extraction API (431747813)
- `GET /extraction/release/{id}` payload now includes `dppReview` sub-object with: `privacyRisk`, `maturityLevelByPrivacySection[]`, `recommendation`, `pccDecision`.
- Old sibling `privacyReview` object is deprecated — tests asserting the legacy shape must be updated.

## Edge Cases & Validations

- Toggling DP&P OFF on a Product with an active release must warn (existing tasks remain but no new ones generated).
- PCC Decision selector must be hidden when Privacy Risk ≠ High (web-first assertion: the element should not be attached, not just invisible).
- Privacy Reviewer Recommendation coloring: GO=green, No GO=red, Pre=orange, Post=yellow. The color is a backend-assigned class — tests should assert the class, not the RGB.
- Expected Maturity Level must be frozen once the release enters "In progress" — UI must disable the editor (not just hide it).

## Role-Based Access

| Role | Can | Cannot |
|---|---|---|
| Product Owner | View DP&P tab, read recommendation | Edit Privacy Sections / Recommendation |
| Dedicated Privacy Advisor | Set Maturity Level, Recommendation, Actions | Change Privacy Risk (derived from questionnaire) |
| Security Advisor | View DP&P tab | Edit Privacy-specific fields |
| PCC Reviewer | Set PCC Decision when Privacy Risk = High | Edit Maturity Levels |
| Privacy Reviewer | Complete Privacy Questionnaire, close Privacy actions | Perform cybersecurity assessments |

## Related Features

- `releases.data-protection.privacy-by-design` — NEW (this doc).
- `reports.tableau.data-privacy` — consumes DP&P output (see `knowledge/reports-dashboards.md`).
- `releases.questionnaire` — privacy sections of the unified questionnaire.
- `doc.dpp.*` (WF16-*) — DP&P-related DOC-level scenarios already in tracker.

## Sources

- **Confluence:** 483816813 (Privacy by design — changes, v2, last 2025-04-07) · 457062708 (Data Privacy Updates Based on Content - Part 2) · 467663710 (Data Privacy Process changes) · 431747813 (Data Extraction API update).
- **User Guide:** `Self-Help - PICASso - Data Protection & Privacy User Guide - Copy.md` lines 165–519 (Triggers, Stages, Review flow 3.x).
- **Exploration:** `exploration-findings.md` §Release Detail (2026-04-22) confirms `Data Protection and Privacy Review` sub-tab.
- **Tracker:** WF16-0001/0002/0004/0005 (DPP toggle scenarios, existing).
