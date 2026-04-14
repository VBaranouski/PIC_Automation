# Tracker ↔ Automation Testing Plan HTML — Migration & UI Parity (Plan 1)

**Status:** Draft — awaiting user review
**Date:** 2026-04-14
**Scope:** Plan 1 of 2. Plan 2 (run-scenarios-from-UI) is deferred.

## Problem

`docs/ai/automation-testing-plan.html` has been the de-facto source of truth for automation test coverage (~435 scenarios with titles, steps, expected results, execution status, workflow/subsection structure). The SQLite-backed Test Scenario Tracker (`src/tracker/`, CLI via `scripts/tracker.ts`, UI on port 3005) has drifted: coverage, statuses, and titles no longer match. Day-to-day, it is unclear which artifact is correct.

The goal is to replace the HTML plan with the tracker — not just sync it, but rebuild the tracker so it can fully represent the HTML's data, then freeze the HTML as an archive.

## Goals

1. Tracker DB contains every scenario currently in the HTML plan, with faithful titles, steps, expected results, workflow/subsection metadata, execution notes, and statuses.
2. Tracker UI surfaces that data legibly (keeping the tracker's existing style).
3. One repeatable, destructive-but-safe migration path from HTML → DB.
4. Tracker CLI remains usable for day-to-day status updates.

## Non-goals (Plan 2 material)

- Executing Playwright tests from the tracker UI.
- Live streaming of test output.
- Any backend that shells out to `npx playwright test`.

## Architecture

Four pieces:

1. **Schema v2** — extend `Scenario` model (`src/tracker/models.ts` + DB in `src/tracker/db.ts`).
2. **Migration script** — `scripts/migrate-from-html.ts`, one-shot, transactional, backup-safe.
3. **Tracker UI extensions** — extend `src/tracker/ui/index.html` to display new fields; keep existing look.
4. **CLI updates** — split `status` command in `scripts/tracker.ts`.

Nothing new on the transport layer; existing Express server (`scripts/tracker-ui.ts`) gains no new routes, only extended query params.

## Data Model (Schema v2)

```ts
// src/tracker/models.ts
export interface Scenario {
  // Existing, unchanged
  id: string;
  title: string;
  description: string;
  priority: 'P1' | 'P2' | 'P3';
  feature_area: FeatureArea;
  spec_file: string;
  workflow: string;
  subsection: string;
  groups: string[];
  created_at: string;
  updated_at: string;

  // NEW — dual status (replaces single `status`)
  automation_state: 'pending' | 'automated' | 'on-hold';
  execution_status: 'passed' | 'not-executed' | 'skipped' | 'failed-defect';

  // NEW — HTML-parity content
  steps: string[];
  expected_results: string[];
  execution_notes: string;
}
```

**DB schema changes** (`src/tracker/db.ts`):

- Drop column: `status`.
- Add columns: `automation_state TEXT NOT NULL`, `execution_status TEXT NOT NULL`, `steps TEXT NOT NULL DEFAULT '[]'` (JSON), `expected_results TEXT NOT NULL DEFAULT '[]'` (JSON), `execution_notes TEXT NOT NULL DEFAULT ''`.
- Add `meta` table with key/value rows; seed `schema_version = 2`. Migration script refuses to run if `schema_version` doesn't match expected.
- `ScenarioRow` (flat row type) mirrors the above; `operations.ts` serializes `steps`/`expected_results` on write, parses on read (same approach used today for `groups`).

**Defaults during migration:**

- `automation_state = 'automated'` if HTML lists a `spec_path` for the scenario, else `'pending'`. Existing `on-hold` rows are not special-cased since the DB is wiped.
- `execution_status` comes from HTML's `AUTO_CASE_STATUS` map; scenarios not listed default to `'not-executed'`.

## Migration

**Script:** `scripts/migrate-from-html.ts` (new; retires `scripts/sync-from-html-plan.ts`).

**HTML data sources parsed:**

1. `<script id="doc-auto-case-details" type="application/json">` — object keyed by scenario ID with `title`, `spec_path`, `steps[]`, `expected_results[]`, optional `execution_notes`.
2. JS object literal `AUTO_CASE_STATUS` — ID → `[humanLabel, cssStatusClass]`. Extracted via regex (same approach `sync-from-html-plan.ts` already uses successfully).
3. Subsection index (literal like `"1.1": [["AUTH-LOGIN-001", "..."]]`) — source of `workflow` + `subsection` + ordering hint.

**Steps, in one SQLite transaction:**

1. Verify HTML exists; extract blobs; fail loud on parse errors.
2. Back up `config/scenarios.db` → `config/scenarios.db.bak-<timestamp>`.
3. Drop & recreate `scenarios` table and `meta` table under schema v2.
4. Merge HTML data per scenario ID; insert `Scenario` rows.
5. Write `meta.schema_version = 2`.
6. Print summary: inserted count, missing-detail count, execution-status distribution, any scenario without a `spec_file`.

**Flags:**

- `--dry-run`: parse + report, write nothing, skip backup.
- `--html <path>`: override HTML source location.

**Post-migration invariants (assertion-checked; rollback on failure):**

- Row count in DB == number of unique scenario IDs across all three HTML blobs.
- Every scenario has a non-empty `title`.
- Every scenario's `spec_file`, if non-empty, maps to a file on disk. Non-fatal — warnings printed.
- Schema version row equals 2.

**Rollback:** restore `.bak` file; drop schema v2 tables. Script provides `--rollback` flag that restores the most recent backup.

## Tracker UI

Keep existing style (dark theme, sidebar layout). Extend three areas:

### 1. Scenario list row

Add an execution badge next to the existing status badge. Two badges now render per row:

- Automation badge: `pending | automated | on-hold` — existing color scheme.
- Execution badge: `passed | not-executed | skipped | failed-defect` — new colors map to HTML's palette (green / grey / yellow / red).

Title, ID, priority, feature area unchanged.

### 2. Scenario detail drawer

Expanded when a row is clicked. Adds three sections below the existing metadata:

- **Steps** — numbered ordered list from `steps[]`.
- **Expected results** — bullet list from `expected_results[]`.
- **Execution notes** — italicized muted block, only rendered when non-empty.

Existing fields (workflow, subsection, spec path, groups, timestamps) stay where they are.

### 3. Filter bar

Add three filters:

- Execution status: all | passed | failed-defect | skipped | not-executed.
- Automation state: all | pending | automated | on-hold.
- Workflow: dropdown populated from distinct `workflow` values in the DB.

Add **Group by workflow** toggle: when on, list collapses under workflow → subsection headers (mirrors HTML's grouping). Off by default; selection persists in `localStorage` under key `tracker.groupByWorkflow`.

### Server-side

`src/tracker/operations.ts` `listScenarios()` gains optional parameters: `execution_status`, `automation_state`, `workflow`. `/api/scenarios` endpoint in `scripts/tracker-ui.ts` forwards them verbatim. No new endpoints.

## CLI Changes

`scripts/tracker.ts`:

- Split `status <id> <value>` into:
  - `auto-state <id> <pending|automated|on-hold>`
  - `exec-status <id> <passed|not-executed|skipped|failed-defect>`
- Keep `status` as a deprecated alias — prints a warning and routes to `auto-state`. Removed in a follow-up cleanup.
- `hold` / `unhold` now flip `automation_state` (previously flipped `status`).
- `list` command: replace single `Status` column with two columns (`Auto State`, `Exec Status`).

`scripts/sync-ids-from-specs.ts` stays; only ever touches `automation_state`. Never writes `execution_status` (that field belongs to real runs or manual entry, not static sync).

## Validation

1. **Parser unit tests** — assert scenario count and round-trip fidelity of 3+ known scenarios (including `AUTH-LOGIN-001`, `AUTH-FPW-001`, one DOC scenario with `execution_notes`).
2. **Snapshot test** — run migration against a fixture HTML, export tracker DB to JSON, diff against committed snapshot.
3. **Manual UI smoke** — load tracker UI at port 3005, verify: filters apply correctly, group-by toggle collapses into workflow headers, detail drawer renders steps/expected results for a passed and a failed scenario.
4. **CLI smoke** — `tracker list` with each filter value, confirm counts.
5. **Spec file existence check** — post-migration report lists any scenario whose `spec_file` path is missing on disk.

## Rollout

Single atomic step. No phased flag. `npm run tracker:migrate` runs the script; on success, schema v2 is live. The HTML plan is not modified, moved, or deleted in this plan — it remains in place as a read-only reference until Plan 2 closes.

## Open questions

None blocking.

## References

- HTML source: `docs/ai/automation-testing-plan.html` (~8,425 lines, ~435 scenario IDs)
- Existing tracker: `src/tracker/`, `scripts/tracker.ts`, `scripts/tracker-ui.ts`
- Existing partial sync (to retire): `scripts/sync-from-html-plan.ts`
- Existing spec-to-ID sync: `scripts/sync-ids-from-specs.ts`
