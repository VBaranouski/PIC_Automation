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
| PIC-10367 | PIC-2026-RC-11.0 | releases | releases.requirements.filters | IMPROVEMENT | Convert single-select → multi-select filters on Process/Product Requirements, CSRR summaries, DP&P tabs | knowledge/process-requirements.md, knowledge/product-requirements.md | — | pending |

## Rolling rules

1. A row older than 2 fix versions moves to `change-impact-archive.md` on the next sprint close.
2. When a row transitions to `done`, set the feature-registry `last-verified` date in the matching area file.
3. If a `NEW` row is added, ensure its feature-id also appears in `feature-registry/<area>.md` within the same PR.
