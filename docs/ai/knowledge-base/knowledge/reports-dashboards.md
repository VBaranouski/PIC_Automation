# Knowledge — Reports & Dashboards

> Tier 2 · on-demand · distilled from User Guide + Confluence + QA exploration walk.
> Sources: Confluence 440200506 (10. [NEW] Data Privacy Reports in Tableau); UG §Reports; exploration-findings.md §Landing → Reports & Dashboards.

## Overview

**Reports & Dashboards** is the 5th Landing tab and surfaces Tableau-hosted reports scoped to the user's organization (Org Level 1/2/3). Feature 440200506 (FR Status = Finalized) adds three new Master Data reports and several drill-down Privacy Sections reports backed by the Data Protection & Privacy Review output.

## Key UI Elements

### Landing tab — Reports & Dashboards (from exploration walk)
- **Filters:** `Select an option`, `Select one or more options` (multi-select for org + product scope).
- **Grid columns** (from exploration-findings.md, 2026-04-22):
  - Product, Release, Release Status, Product owner, Security Manager, Security and Data Protection Advisor, Dedicated Privacy Advisor
  - PQL, SVP LOB, LOB Security Leader
  - Data Protection and Privacy Risk Level, CyberSecurity RISK Level
  - Last BU Level FCSR Date, Last Full Pen Test Date
  - Last Completed Release, Last Completed Release FCSR Decision, Last completed release FCSR Exception Required flag
  - Number of open actions / conditions
- **Pagination:** 139 pages observed for the PQL user.
- **Access Tableau** button opens external Tableau (LANDING-HOME-020 confirms).

### New Data Privacy Reports in Tableau (440200506)

#### Master Data reports
1. **Privacy Risk Distribution** — pie chart of Privacy Risk levels from the last Completed Data Privacy Review per product.
2. **Data Privacy Review Status** — summary cards:
   - Products with ongoing reviews (last release status ∉ {Completed, Cancelled}).
   - Products with Expected Maturity **met** (Maturity unchanged across all applicable Privacy Sections).
   - Products with Expected Maturity **NOT met** (Maturity changed in ≥1 section).
3. **Privacy Certification Performance YTD** — bar chart per year keyed on release creation date (same ongoing / met / not-met split as report 2).
4. **PCC Decision pie chart** — pie of PCC Decision values from the last Completed release per product.

#### Privacy Sections reports (drill-down)
1. **Top Privacy Gaps** — rating table of Privacy Sections with Maturity Level = `Insufficient` or `Non-Compliant` from the last Completed release.
2. **Privacy Certification — Crown Jewels** — matrix per product with columns:
   - Org Level 1 (BU), Org Level 2 (LoB/Division), Org Level 3 (LoB/Entity)
   - Product Name
   - Privacy Risk (BackOffice-coloured)
   - Privacy Review Status (Ongoing=yellow, Maturity not met=red, Maturity met=green, Cancelled=grey)
   - Privacy Reviewer Recommendation (GO=green, No GO=red, GO with Pre=orange, GO with Post=yellow)
   - PCC Decision (applicable only when Privacy Risk = High; Yes=green, No=red)
   - One column per Privacy Section (Maturity Level as coloured circle)

## Workflows / Business Rules

### Scope filtering (all Master Data reports)
- Users with reports access at Org 1 or Org 2 only see their organization + descendants.
- Drill-down path: Organization Level 1 → Level 2 → Level 3.
- Top-level view differs by access scope (global vs single-BU user).

### Data freshness
- Reports reflect **last release by release creation date** per product.
- Only releases with DP&P Review populated contribute to Privacy Risk / Maturity counts.
- Cancelled releases are counted separately (never flow into ongoing/met/not-met buckets).

### "Ongoing" definition
`release.status NOT IN {Completed, Cancelled}` → counts towards ongoing reviews.

## Edge Cases & Validations

- Users without Tableau access must not see the `Access Tableau` button (role-dependent, DOC-REPORTS-016 tracks this for DOC; apply to releases).
- Product with no DP&P Review on any release → must not appear in any Privacy report (null-safe exclusion, not row with empty values).
- A product whose last release is Cancelled should still appear in the Cancelled bucket, not in "ongoing".
- Color-coding for Recommendation must match DP&P tab exactly — `data-protection.md` is the source of truth.
- Drill-down must respect RLS (row-level security): a BU user clicking from global view must be re-scoped, not given unfiltered data.

## Role-Based Access

| Role | Can | Cannot |
|---|---|---|
| Reports User (global) | View all Master + Privacy reports across all BUs | Edit underlying data |
| Reports User (Org L1/L2) | View only their BU + descendants | Drill into other BUs |
| Process Quality Leader | View Reports tab | — (read-only) |
| Privacy Reviewer | View Privacy reports for scoped products | View global reports |
| Non-Tableau user | See `Access Tableau` button hidden | Open external Tableau |

## Related Features

- `reports.tableau.data-privacy` — NEW (this doc).
- `reports.tableau.link` — existing `Access Tableau` entry point.
- `reports.org-hierarchy` — existing 4-level breakdown.
- `releases.data-protection.privacy-by-design` — upstream data (see `knowledge/data-protection.md`).

## Sources

- **Confluence:** 440200506 (10. [NEW] Data Privacy Reports in Tableau, v10, FR Status = Finalized).
- **User Guide:** (no dedicated UG section yet — feature is [NEW]).
- **Exploration:** `exploration-findings.md` §Landing → Reports & Dashboards (2026-04-22).
- **Tracker:** LANDING-HOME-020 (Access Tableau visible), REPORT-TABLEAU-ACCESS-001 (Access Tableau button role-dependent), DOC-REPORTS-016 (no-access user cannot view reports).
