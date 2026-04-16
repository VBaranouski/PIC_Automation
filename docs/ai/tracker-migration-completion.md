# Tracker Migration Completion

Status: completed
Date: 2026-04-15

## Scope Completed

- Migrated tracker content to use normalized workflow names, subsections, execution states, and spec-file mappings.
- Added tracker UI support for grouped workflow rendering, workflow/subsection run controls, exact scenario resolution, and result syncing from Playwright JSON output.
- Tightened Playwright special-project matching so landing specs no longer leak into DOC dependency chains.
- Added `tracker sync --import-missing` to create tracker rows for scenario IDs that already exist in `allure.description(...)` but are missing from the SQLite DB.
- Split the largest landing workflow spec into smaller workflow-aligned spec files so tracker workflow and subsection execution can stay precise.

## Current Operating Model

- The tracker database in `config/scenarios.db` is the live operational dataset.
- `allure.description('SCENARIO-ID: ...')` in specs is the canonical source for scenario IDs.
- `npm run tracker -- sync` refreshes spec-file mappings for existing tracker rows.
- `npm run tracker -- sync --import-missing` is the follow-up step after adding new spec-backed IDs.
- `npm run tracker:export` produces the normalized JSON snapshot at `config/scenarios-export.json`.

## Recommended Maintenance Flow

```bash
npm run tracker -- sync --import-missing
npm run tracker:export
npm run tracker:ui
```

## Notes

- The legacy migration planning notes are compacted into this completion record.
- Repo-wide `tsc --noEmit` still has unrelated existing errors outside tracker work, so tracker maintenance should be validated with targeted commands until those are fixed.
