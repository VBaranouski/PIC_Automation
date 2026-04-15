# Tracker ↔ HTML Plan Migration — Implementation Plan

**Status:** Complete

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the SQLite tracker a faithful replacement of `docs/ai/automation-testing-plan.html` by extending the schema to dual-status + rich content, rebuilding the DB from the HTML, and surfacing everything in the tracker UI.

**Architecture:** Split the existing `status` field into `automation_state` (pending/automated/on-hold) and `execution_status` (passed/not-executed/skipped/failed-defect). Keep the existing `scenario_details` sidecar table for `steps`/`expected_results`/`execution_notes` — it already exists. Parse the three embedded JSON-like blobs from the HTML in a one-shot, destructive-but-backup-safe `migrate-from-html.ts` script. Extend the existing tracker UI and Express endpoints; no new routes.

**Tech Stack:** TypeScript, `better-sqlite3`, `commander` (CLI), `express` (UI server), vanilla HTML/JS for the tracker UI, `tsx` for script execution.

**Spec:** `docs/superpowers/specs/2026-04-14-tracker-html-migration-design.md`

---

## File Structure

**Modified:**
- `src/tracker/models.ts` — add `AutomationState`, `ExecutionStatus` types; update `Scenario`, `ScenarioRow`, `ListFilters`.
- `src/tracker/db.ts` — schema v2 DDL (drop `status`, add `automation_state` + `execution_status`, add `meta` table, keep `scenario_details`).
- `src/tracker/operations.ts` — split `setStatus` into `setAutomationState` + `setExecutionStatus`; extend `listScenarios` with new filters; add `getSchemaVersion`.
- `scripts/tracker.ts` — replace `status` command with `auto-state` + `exec-status` (keep `status` as deprecated alias); update `list` columns.
- `scripts/tracker-ui.ts` — extend `/api/scenarios` query params.
- `src/tracker/ui/index.html` — extra badge, filter controls, group-by toggle, detail drawer sections for steps / expected results / execution notes.
- `package.json` — add `tracker:migrate` + `tracker:migrate:dry` scripts; remove `tracker:sync-from-html` scripts.

**Created:**
- `src/tracker/html-parser.ts` — isolated HTML → scenario records parser (the hard-to-test bits live here; pure function).
- `scripts/migrate-from-html.ts` — one-shot migration entry point (backup, wipe, invoke parser, insert, validate).
- `tests/tracker/html-parser.test.ts` — unit tests for the parser.
- `tests/tracker/migrate-from-html.test.ts` — integration test against a fixture HTML.
- `tests/fixtures/automation-testing-plan.fixture.html` — small fixture with ~3 scenarios for tests.

**Deleted after migration succeeds (separate cleanup commit):**
- `scripts/sync-from-html-plan.ts` — superseded.

---

## Task 1 — Extend type model

**Files:**
- Modify: `src/tracker/models.ts`

- [ ] **Step 1: Update `models.ts` with new types**

Replace `SCENARIO_STATUSES` with two separate status vocabularies, extend `Scenario`, `ScenarioRow`, and `ListFilters`.

```ts
// src/tracker/models.ts (full file)

// ── Automation state (lifecycle of the test itself) ──────────────────────────
export const AUTOMATION_STATES = ['pending', 'automated', 'on-hold'] as const;
export type AutomationState = (typeof AUTOMATION_STATES)[number];

// ── Execution status (result of the last run) ────────────────────────────────
export const EXECUTION_STATUSES = ['passed', 'not-executed', 'skipped', 'failed-defect'] as const;
export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

// ── Priority levels ──────────────────────────────────────────────────────────
export const PRIORITIES = ['P1', 'P2', 'P3'] as const;
export type Priority = (typeof PRIORITIES)[number];

// ── Feature areas ────────────────────────────────────────────────────────────
export const FEATURE_AREAS = [
  'auth', 'landing', 'products', 'releases',
  'doc', 'reports', 'backoffice', 'integrations', 'other',
] as const;
export type FeatureArea = (typeof FEATURE_AREAS)[number];

// ── Groups / tags ────────────────────────────────────────────────────────────
export const DEFAULT_GROUPS = [
  'smoke', 'critical', 'regression', 'integration',
  'edge-case', 'destructive', 'manual-only',
] as const;
export type GroupLabel = (typeof DEFAULT_GROUPS)[number] | string;

// ── Scenario ────────────────────────────────────────────────────────────────
export interface Scenario {
  id: string;
  title: string;
  description: string;
  automation_state: AutomationState;
  execution_status: ExecutionStatus;
  priority: Priority;
  feature_area: FeatureArea;
  spec_file: string;
  workflow: string;
  subsection: string;
  groups: string[];
  // Sidecar content (from scenario_details table, joined into this object)
  steps: string[];
  expected_results: string[];
  execution_notes: string;
  created_at: string;
  updated_at: string;
}

export interface ScenarioRow {
  id: string;
  title: string;
  description: string;
  automation_state: AutomationState;
  execution_status: ExecutionStatus;
  priority: Priority;
  feature_area: FeatureArea;
  spec_file: string;
  workflow: string;
  subsection: string;
  created_at: string;
  updated_at: string;
}

export interface ListFilters {
  automation_state?: AutomationState;
  execution_status?: ExecutionStatus;
  priority?: Priority;
  feature_area?: FeatureArea;
  group?: string;
  workflow?: string;
  search?: string;
  spec_file?: string;
}

export interface TrackerExport {
  version: number;
  exported_at: string;
  scenarios: Scenario[];
}

// ── Back-compat re-exports (deprecated; for legacy CLI path only) ────────────
/** @deprecated use AutomationState + ExecutionStatus */
export const SCENARIO_STATUSES = [
  'pending', 'automated', 'passed', 'failed', 'skipped', 'on-hold',
] as const;
/** @deprecated */
export type ScenarioStatus = (typeof SCENARIO_STATUSES)[number];
```

- [ ] **Step 2: Run typecheck**

Run: `cd PIC_Automation && npm run typecheck`
Expected: many errors referring to `status`, `setStatus`, etc. from `operations.ts` and `tracker.ts`. This is expected — fixed in Task 2+.

- [ ] **Step 3: Commit**

```bash
cd PIC_Automation
git add src/tracker/models.ts
git commit -m "feat(tracker): add AutomationState + ExecutionStatus types (schema v2)"
```

---

## Task 2 — Schema v2 in db.ts

**Files:**
- Modify: `src/tracker/db.ts`

- [ ] **Step 1: Replace the file with schema v2 DDL**

Replace the whole `SCHEMA_SQL` + drop the `migrateScenarioStatuses` back-compat migration (the migration script will wipe existing DBs).

```ts
// src/tracker/db.ts (replace SCHEMA_SQL and getDb() body)

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DB_DIR = path.join(PROJECT_ROOT, 'config');
const DB_PATH = path.join(DB_DIR, 'scenarios.db');

export const SCHEMA_VERSION = 2;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scenarios (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  automation_state TEXT NOT NULL DEFAULT 'pending'
                        CHECK (automation_state IN ('pending','automated','on-hold')),
  execution_status TEXT NOT NULL DEFAULT 'not-executed'
                        CHECK (execution_status IN ('passed','not-executed','skipped','failed-defect')),
  priority         TEXT NOT NULL DEFAULT 'P2'
                        CHECK (priority IN ('P1','P2','P3')),
  feature_area     TEXT NOT NULL DEFAULT 'other'
                        CHECK (feature_area IN ('auth','landing','products','releases','doc','reports','backoffice','integrations','other')),
  spec_file        TEXT NOT NULL DEFAULT '',
  workflow         TEXT NOT NULL DEFAULT '',
  subsection       TEXT NOT NULL DEFAULT '',
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scenario_groups (
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  group_name  TEXT NOT NULL,
  PRIMARY KEY (scenario_id, group_name)
);

CREATE TABLE IF NOT EXISTS groups (
  name        TEXT PRIMARY KEY,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS scenario_details (
  scenario_id      TEXT PRIMARY KEY REFERENCES scenarios(id) ON DELETE CASCADE,
  steps            TEXT NOT NULL DEFAULT '[]',
  expected_results TEXT NOT NULL DEFAULT '[]',
  execution_notes  TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_scenarios_auto_state  ON scenarios(automation_state);
CREATE INDEX IF NOT EXISTS idx_scenarios_exec_status ON scenarios(execution_status);
CREATE INDEX IF NOT EXISTS idx_scenarios_priority    ON scenarios(priority);
CREATE INDEX IF NOT EXISTS idx_scenarios_feature     ON scenarios(feature_area);
CREATE INDEX IF NOT EXISTS idx_scenarios_workflow    ON scenarios(workflow);
CREATE INDEX IF NOT EXISTS idx_scenario_groups_grp   ON scenario_groups(group_name);

INSERT OR IGNORE INTO groups (name, description) VALUES
  ('smoke',       'Core happy-path tests that must pass before anything else'),
  ('critical',    'Critical business flows — authentication, stage transitions, gating actions'),
  ('regression',  'Full regression suite covering all functional areas'),
  ('integration', 'Tests involving external systems (Jira, Jama, SSO, LEAP)'),
  ('edge-case',   'Boundary conditions, error states, unusual inputs'),
  ('destructive', 'Tests that modify/delete data irreversibly — run with caution'),
  ('manual-only', 'Scenarios intentionally excluded from automation');
`;

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  _db.exec(SCHEMA_SQL);

  const metaRow = _db.prepare('SELECT value FROM meta WHERE key = ?').get('schema_version') as { value?: string } | undefined;
  if (!metaRow) {
    _db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('schema_version', String(SCHEMA_VERSION));
  }

  return _db;
}

export function getSchemaVersion(): number {
  const db = getDb();
  const row = db.prepare('SELECT value FROM meta WHERE key = ?').get('schema_version') as { value?: string } | undefined;
  return row?.value ? Number(row.value) : 1;
}

export function closeDb(): void {
  if (_db) { _db.close(); _db = null; }
}

export function getDbPath(): string { return DB_PATH; }
export function getProjectRoot(): string { return PROJECT_ROOT; }
```

- [ ] **Step 2: Delete the old DB file so schema v2 is created on next run**

```bash
cd PIC_Automation
rm -f config/scenarios.db config/scenarios.db-shm config/scenarios.db-wal
```

- [ ] **Step 3: Verify schema creates cleanly**

Run: `cd PIC_Automation && npx tsx -e "import {getDb, getSchemaVersion} from './src/tracker/db'; getDb(); console.log('schema_version:', getSchemaVersion());"`
Expected: `schema_version: 2` and no errors.

- [ ] **Step 4: Commit**

```bash
cd PIC_Automation
git add src/tracker/db.ts
git commit -m "feat(tracker): schema v2 — split status, add meta table, retire legacy migration"
```

---

## Task 3 — Update operations.ts

**Files:**
- Modify: `src/tracker/operations.ts`

- [ ] **Step 1: Update imports and helpers**

At the top of `operations.ts`, replace the imports block and status helpers:

```ts
// src/tracker/operations.ts — imports + helpers replacement

import { getDb, getProjectRoot } from './db';
import type {
  Scenario,
  ScenarioRow,
  AutomationState,
  ExecutionStatus,
  Priority,
  FeatureArea,
  ListFilters,
  TrackerExport,
} from './models';
import {
  AUTOMATION_STATES,
  EXECUTION_STATUSES,
  PRIORITIES,
  FEATURE_AREAS,
} from './models';
import path from 'path';
import fs from 'fs';

function now(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v.map(String) : []; }
  catch { return []; }
}

export function isValidAutomationState(s: string): s is AutomationState {
  return (AUTOMATION_STATES as readonly string[]).includes(s);
}
export function isValidExecutionStatus(s: string): s is ExecutionStatus {
  return (EXECUTION_STATUSES as readonly string[]).includes(s);
}
export function isValidPriority(p: string): p is Priority {
  return (PRIORITIES as readonly string[]).includes(p);
}
export function isValidFeatureArea(f: string): f is FeatureArea {
  return (FEATURE_AREAS as readonly string[]).includes(f);
}
```

- [ ] **Step 2: Rewrite `rowToScenario` to join sidecar details**

Replace the existing `rowToScenario` helper:

```ts
function rowToScenario(row: ScenarioRow, groups: string[]): Scenario {
  const db = getDb();
  const detail = db.prepare(
    'SELECT steps, expected_results, execution_notes FROM scenario_details WHERE scenario_id = ?'
  ).get(row.id) as { steps?: string; expected_results?: string; execution_notes?: string } | undefined;

  return {
    ...row,
    groups,
    steps: parseJsonArray(detail?.steps),
    expected_results: parseJsonArray(detail?.expected_results),
    execution_notes: detail?.execution_notes ?? '',
  };
}
```

- [ ] **Step 3: Replace `addScenario` / `updateScenario` / `setStatus` block**

Replace the entire CRUD + status shortcuts section (from `AddScenarioInput` through `unholdScenario`):

```ts
export interface AddScenarioInput {
  id: string;
  title: string;
  description?: string;
  automation_state?: AutomationState;
  execution_status?: ExecutionStatus;
  priority?: Priority;
  feature_area?: FeatureArea;
  spec_file?: string;
  workflow?: string;
  subsection?: string;
  groups?: string[];
  steps?: string[];
  expected_results?: string[];
  execution_notes?: string;
}

export function addScenario(input: AddScenarioInput): Scenario {
  const db = getDb();
  const ts = now();

  db.prepare(`
    INSERT INTO scenarios (
      id, title, description, automation_state, execution_status,
      priority, feature_area, spec_file, workflow, subsection,
      created_at, updated_at
    ) VALUES (
      @id, @title, @description, @automation_state, @execution_status,
      @priority, @feature_area, @spec_file, @workflow, @subsection,
      @created_at, @updated_at
    )
  `).run({
    id: input.id,
    title: input.title,
    description: input.description ?? '',
    automation_state: input.automation_state ?? 'pending',
    execution_status: input.execution_status ?? 'not-executed',
    priority: input.priority ?? 'P2',
    feature_area: input.feature_area ?? 'other',
    spec_file: input.spec_file ?? '',
    workflow: input.workflow ?? '',
    subsection: input.subsection ?? '',
    created_at: ts,
    updated_at: ts,
  });

  if (input.groups?.length) setGroups(input.id, input.groups);

  if (input.steps || input.expected_results || input.execution_notes) {
    setScenarioDetails(input.id, {
      steps: input.steps ?? [],
      expected_results: input.expected_results ?? [],
      execution_notes: input.execution_notes ?? '',
    });
  }

  return getScenario(input.id)!;
}

export interface UpdateScenarioInput {
  title?: string;
  description?: string;
  automation_state?: AutomationState;
  execution_status?: ExecutionStatus;
  priority?: Priority;
  feature_area?: FeatureArea;
  spec_file?: string;
  workflow?: string;
  subsection?: string;
  groups?: string[];
}

export function updateScenario(id: string, input: UpdateScenarioInput): Scenario | null {
  const db = getDb();
  if (!getScenario(id)) return null;

  const sets: string[] = ['updated_at = @updated_at'];
  const params: Record<string, string> = { id, updated_at: now() };

  if (input.title            !== undefined) { sets.push('title = @title');                       params.title = input.title; }
  if (input.description      !== undefined) { sets.push('description = @description');           params.description = input.description; }
  if (input.automation_state !== undefined) { sets.push('automation_state = @automation_state'); params.automation_state = input.automation_state; }
  if (input.execution_status !== undefined) { sets.push('execution_status = @execution_status'); params.execution_status = input.execution_status; }
  if (input.priority         !== undefined) { sets.push('priority = @priority');                 params.priority = input.priority; }
  if (input.feature_area     !== undefined) { sets.push('feature_area = @feature_area');         params.feature_area = input.feature_area; }
  if (input.spec_file        !== undefined) { sets.push('spec_file = @spec_file');               params.spec_file = input.spec_file; }
  if (input.workflow         !== undefined) { sets.push('workflow = @workflow');                 params.workflow = input.workflow; }
  if (input.subsection       !== undefined) { sets.push('subsection = @subsection');             params.subsection = input.subsection; }

  db.prepare(`UPDATE scenarios SET ${sets.join(', ')} WHERE id = @id`).run(params);

  if (input.groups !== undefined) setGroups(id, input.groups);

  return getScenario(id);
}

export function setAutomationState(id: string, state: AutomationState): Scenario | null {
  return updateScenario(id, { automation_state: state });
}
export function setExecutionStatus(id: string, exec: ExecutionStatus): Scenario | null {
  return updateScenario(id, { execution_status: exec });
}
export function holdScenario(id: string): Scenario | null {
  return setAutomationState(id, 'on-hold');
}
export function unholdScenario(id: string): Scenario | null {
  return setAutomationState(id, 'pending');
}
```

- [ ] **Step 4: Replace `listScenarios` with new filter keys**

```ts
export function listScenarios(filters?: ListFilters): Scenario[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (filters?.automation_state) { conditions.push('s.automation_state = @automation_state'); params.automation_state = filters.automation_state; }
  if (filters?.execution_status) { conditions.push('s.execution_status = @execution_status'); params.execution_status = filters.execution_status; }
  if (filters?.priority)         { conditions.push('s.priority = @priority');                 params.priority = filters.priority; }
  if (filters?.feature_area)     { conditions.push('s.feature_area = @feature_area');         params.feature_area = filters.feature_area; }
  if (filters?.workflow)         { conditions.push('s.workflow LIKE @workflow');              params.workflow = `%${filters.workflow}%`; }
  if (filters?.search)           { conditions.push('(s.id LIKE @search OR s.title LIKE @search OR s.description LIKE @search)'); params.search = `%${filters.search}%`; }
  if (filters?.spec_file)        { conditions.push('s.spec_file LIKE @spec_file');            params.spec_file = `%${filters.spec_file}%`; }
  if (filters?.group)            { conditions.push('EXISTS (SELECT 1 FROM scenario_groups sg WHERE sg.scenario_id = s.id AND sg.group_name = @group)'); params.group = filters.group.trim().toLowerCase(); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT s.* FROM scenarios s ${where} ORDER BY s.priority ASC, s.feature_area ASC, s.id ASC`;

  const rows = db.prepare(sql).all(params) as ScenarioRow[];
  return rows.map((row) => rowToScenario(row, getGroups(row.id)));
}
```

- [ ] **Step 5: Update `getStats` to return dual counts**

Replace the stats section:

```ts
export interface TrackerStats {
  total: number;
  byAutomationState: Record<AutomationState, number>;
  byExecutionStatus: Record<ExecutionStatus, number>;
  byPriority: Record<Priority, number>;
  byFeatureArea: Record<string, number>;
  byGroup: Record<string, number>;
}

export function getStats(): TrackerStats {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as c FROM scenarios').get() as { c: number }).c;

  const byAutomationState = {} as Record<AutomationState, number>;
  for (const s of AUTOMATION_STATES) {
    byAutomationState[s] = (db.prepare('SELECT COUNT(*) as c FROM scenarios WHERE automation_state = ?').get(s) as { c: number }).c;
  }

  const byExecutionStatus = {} as Record<ExecutionStatus, number>;
  for (const s of EXECUTION_STATUSES) {
    byExecutionStatus[s] = (db.prepare('SELECT COUNT(*) as c FROM scenarios WHERE execution_status = ?').get(s) as { c: number }).c;
  }

  const byPriority = {} as Record<Priority, number>;
  for (const p of PRIORITIES) {
    byPriority[p] = (db.prepare('SELECT COUNT(*) as c FROM scenarios WHERE priority = ?').get(p) as { c: number }).c;
  }

  const areaRows = db.prepare('SELECT feature_area, COUNT(*) as c FROM scenarios GROUP BY feature_area ORDER BY c DESC').all() as { feature_area: string; c: number }[];
  const byFeatureArea: Record<string, number> = {};
  for (const r of areaRows) byFeatureArea[r.feature_area] = r.c;

  const groupRows = db.prepare('SELECT sg.group_name, COUNT(*) as c FROM scenario_groups sg GROUP BY sg.group_name ORDER BY c DESC').all() as { group_name: string; c: number }[];
  const byGroup: Record<string, number> = {};
  for (const r of groupRows) byGroup[r.group_name] = r.c;

  return { total, byAutomationState, byExecutionStatus, byPriority, byFeatureArea, byGroup };
}
```

- [ ] **Step 6: Update `syncWithSpecFiles` to use `automation_state`**

Find the block that references `scenario.status === 'automated'` and replace with `scenario.automation_state === 'automated'`:

```ts
if (scenario.spec_file && scenario.automation_state === 'automated') {
```

- [ ] **Step 7: Run typecheck**

Run: `cd PIC_Automation && npm run typecheck`
Expected: errors only in `scripts/tracker.ts`, `scripts/tracker-ui.ts`, `scripts/sync-from-html-plan.ts`, `scripts/seed-tracker.ts`, and possibly `scripts/sync-ids-from-specs.ts`. No errors in `src/tracker/`.

- [ ] **Step 8: Commit**

```bash
cd PIC_Automation
git add src/tracker/operations.ts
git commit -m "feat(tracker): split status in operations; rowToScenario joins scenario_details"
```

---

## Task 4 — HTML parser module

**Files:**
- Create: `src/tracker/html-parser.ts`
- Create: `tests/fixtures/automation-testing-plan.fixture.html`
- Create: `tests/tracker/html-parser.test.ts`

- [ ] **Step 1: Write the fixture HTML**

Create a minimal HTML with the three blobs so parser tests have a deterministic input.

```html
<!-- tests/fixtures/automation-testing-plan.fixture.html -->
<!DOCTYPE html>
<html><head><title>Fixture</title></head><body>
<script id="doc-auto-case-details" type="application/json">
{
  "AUTH-LOGIN-001": {
    "title": "Verify login page loads",
    "spec_path": "projects/pw-autotest/tests/auth/login.spec.ts",
    "steps": ["Open app", "Observe login form"],
    "expected_results": ["Form is visible"]
  },
  "AUTH-LOGIN-999": {
    "title": "Broken login case",
    "spec_path": "projects/pw-autotest/tests/auth/login.spec.ts",
    "steps": ["Submit with wrong creds"],
    "expected_results": ["Error shown"],
    "execution_notes": "Known flaky on QA"
  },
  "DOC-CREATE-001": {
    "title": "Create a DOC",
    "spec_path": "projects/pw-autotest/tests/doc/doc-lifecycle.spec.ts",
    "steps": ["Open DOC tab", "Click New"],
    "expected_results": ["DOC wizard opens"]
  }
}
</script>
<script>
const SUBSECTION_INDEX = {
  "1.1": [["AUTH-LOGIN-001", "`auth/login.spec.ts` — desc"]],
  "1.2": [["AUTH-LOGIN-999", "`auth/login.spec.ts` — desc"]],
  "4.1": [["DOC-CREATE-001", "`doc/doc-lifecycle.spec.ts` — desc"]]
};
const AUTO_CASE_STATUS = {
  'AUTH-LOGIN-001': ['Passed', 'passed'],
  'AUTH-LOGIN-999': ['Failed: defect', 'failed-defect'],
  'DOC-CREATE-001': ['Skipped', 'skipped']
};
</script>
</body></html>
```

- [ ] **Step 2: Write failing unit tests**

```ts
// tests/tracker/html-parser.test.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parseHtmlPlan } from '../../src/tracker/html-parser';

const FIXTURE = path.resolve(__dirname, '..', 'fixtures', 'automation-testing-plan.fixture.html');

test.describe('parseHtmlPlan', () => {
  test('extracts scenarios from fixture', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const result = parseHtmlPlan(html);
    expect(result.scenarios.length).toBe(3);
  });

  test('maps title, spec_path, steps, expected_results, execution_notes', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    const loggedIn = scenarios.find((s) => s.id === 'AUTH-LOGIN-001')!;
    expect(loggedIn.title).toBe('Verify login page loads');
    expect(loggedIn.spec_file).toBe('tests/auth/login.spec.ts');
    expect(loggedIn.steps).toEqual(['Open app', 'Observe login form']);
    expect(loggedIn.expected_results).toEqual(['Form is visible']);
    expect(loggedIn.execution_notes).toBe('');

    const broken = scenarios.find((s) => s.id === 'AUTH-LOGIN-999')!;
    expect(broken.execution_notes).toBe('Known flaky on QA');
  });

  test('maps AUTO_CASE_STATUS into execution_status', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'AUTH-LOGIN-001')!.execution_status).toBe('passed');
    expect(scenarios.find((s) => s.id === 'AUTH-LOGIN-999')!.execution_status).toBe('failed-defect');
    expect(scenarios.find((s) => s.id === 'DOC-CREATE-001')!.execution_status).toBe('skipped');
  });

  test('derives subsection from SUBSECTION_INDEX', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'AUTH-LOGIN-001')!.subsection).toBe('1.1');
    expect(scenarios.find((s) => s.id === 'DOC-CREATE-001')!.subsection).toBe('4.1');
  });

  test('defaults automation_state to automated when spec_path present', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    for (const s of scenarios) expect(s.automation_state).toBe('automated');
  });

  test('infers feature_area from ID prefix', () => {
    const html = fs.readFileSync(FIXTURE, 'utf-8');
    const { scenarios } = parseHtmlPlan(html);
    expect(scenarios.find((s) => s.id === 'AUTH-LOGIN-001')!.feature_area).toBe('auth');
    expect(scenarios.find((s) => s.id === 'DOC-CREATE-001')!.feature_area).toBe('doc');
  });
});
```

- [ ] **Step 3: Verify the tests fail**

Run: `cd PIC_Automation && npx playwright test tests/tracker/html-parser.test.ts --reporter=list`
Expected: FAIL — `parseHtmlPlan` is not defined.

- [ ] **Step 4: Implement the parser**

```ts
// src/tracker/html-parser.ts
import type {
  Scenario,
  AutomationState,
  ExecutionStatus,
  FeatureArea,
  Priority,
} from './models';

export interface ParsedPlan {
  scenarios: Array<Omit<Scenario, 'created_at' | 'updated_at' | 'groups' | 'description'>>;
  warnings: string[];
}

interface HtmlDetailEntry {
  title: string;
  spec_path?: string;
  steps?: string[];
  expected_results?: string[];
  execution_notes?: string;
}

function extractJsonBlob(html: string, id: string): string | null {
  const re = new RegExp(`<script\\s+id="${id}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = re.exec(html);
  return match ? match[1].trim() : null;
}

function extractObjectLiteral(html: string, varName: string): string | null {
  // Matches:  const VAR = { ... };  including multi-line, balanced to the matching brace.
  const startRe = new RegExp(`(?:const|let|var)\\s+${varName}\\s*=\\s*{`);
  const start = startRe.exec(html);
  if (!start) return null;
  const openIdx = html.indexOf('{', start.index + start[0].length - 1);
  let depth = 0;
  for (let i = openIdx; i < html.length; i++) {
    const ch = html[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return html.slice(openIdx, i + 1);
    }
  }
  return null;
}

function parseLooseObject<T = unknown>(text: string): T {
  // Converts single-quoted JS object literals into JSON by replacing
  // keys and string values. Used for AUTO_CASE_STATUS and SUBSECTION_INDEX.
  const jsonish = text
    .replace(/([\{,]\s*)([A-Za-z_][\w-]*)\s*:/g, '$1"$2":')  // keys: `key:` → `"key":`
    .replace(/'/g, '"')                                       // single → double quotes
    .replace(/,\s*([}\]])/g, '$1');                           // trailing commas
  return JSON.parse(jsonish) as T;
}

function normalizeSpecPath(raw: string | undefined): string {
  if (!raw) return '';
  let p = raw.replace(/^projects\/pw-autotest\//, '');
  if (!p.startsWith('tests/')) p = 'tests/' + p;
  return p;
}

function inferFeatureArea(id: string, specPath: string): FeatureArea {
  const idUp = id.toUpperCase();
  const spec = specPath.toLowerCase();
  if (idUp.startsWith('AUTH-')) return 'auth';
  if (idUp.startsWith('LANDING-')) return 'landing';
  if (idUp.startsWith('PRODUCT-') || spec.includes('products/')) return 'products';
  if (idUp.startsWith('DOC-') || idUp.startsWith('ATC-DOC-') || idUp.startsWith('REVIEW-CONFIRM-')) return 'doc';
  if (idUp.startsWith('RELEASE-') || idUp.startsWith('MANAGE-') || idUp.startsWith('CLONE-') || idUp.startsWith('ATC-REVIEW-CONFIRM-')) return 'releases';
  if (spec.includes('report') || spec.includes('tableau')) return 'reports';
  if (spec.includes('backoffice')) return 'backoffice';
  if (spec.includes('integration') || spec.includes('jira') || spec.includes('jama') || spec.includes('intel')) return 'integrations';
  return 'other';
}

function inferWorkflow(subsection: string, area: FeatureArea): string {
  // Use subsection's first number to pick a workflow name.
  const major = subsection.split('.')[0];
  const map: Record<string, string> = {
    '1': 'WORKFLOW 1 — Authentication',
    '2': 'WORKFLOW 2 — Landing Page & Home Navigation',
    '3': 'WORKFLOW 3 — Product Management',
    '4': 'WORKFLOW 4 — DOC Lifecycle',
    '5': 'WORKFLOW 5 — Review & Confirm',
    '6': 'WORKFLOW 6 — Release Management',
    '7': 'WORKFLOW 7 — Reports & Dashboards',
  };
  if (map[major]) return map[major];
  // Fallback: derive from feature area
  return `WORKFLOW — ${area.charAt(0).toUpperCase()}${area.slice(1)}`;
}

function inferPriority(id: string): Priority {
  const idUp = id.toUpperCase();
  if (idUp.includes('SMOKE') || idUp.startsWith('AUTH-LOGIN-') || idUp.startsWith('DOC-CREATE-')) return 'P1';
  if (idUp.endsWith('-001')) return 'P1';
  return 'P2';
}

export function parseHtmlPlan(html: string): ParsedPlan {
  const warnings: string[] = [];

  // 1) doc-auto-case-details JSON
  const detailJson = extractJsonBlob(html, 'doc-auto-case-details');
  if (!detailJson) throw new Error('Missing <script id="doc-auto-case-details"> blob');
  const details = JSON.parse(detailJson) as Record<string, HtmlDetailEntry>;

  // 2) AUTO_CASE_STATUS object literal
  const statusLiteral = extractObjectLiteral(html, 'AUTO_CASE_STATUS');
  const statusMap: Record<string, [string, string]> = statusLiteral
    ? parseLooseObject(statusLiteral)
    : {};

  // 3) SUBSECTION_INDEX (keyed by "1.1", values are arrays-of-arrays)
  const indexLiteral = extractObjectLiteral(html, 'SUBSECTION_INDEX');
  const subsectionIndex: Record<string, Array<[string, string]>> = indexLiteral
    ? parseLooseObject(indexLiteral)
    : {};

  // Invert: scenarioId → subsection
  const idToSubsection = new Map<string, string>();
  for (const [sub, entries] of Object.entries(subsectionIndex)) {
    for (const [scenarioId] of entries) {
      idToSubsection.set(scenarioId, sub);
    }
  }

  // Union of all IDs we see
  const allIds = new Set<string>([
    ...Object.keys(details),
    ...Object.keys(statusMap),
    ...idToSubsection.keys(),
  ]);

  const scenarios: ParsedPlan['scenarios'] = [];
  for (const id of allIds) {
    const d = details[id];
    const title = d?.title ?? id;
    const spec_file = normalizeSpecPath(d?.spec_path);
    const subsection = idToSubsection.get(id) ?? '';
    const feature_area = inferFeatureArea(id, spec_file);
    const workflow = inferWorkflow(subsection, feature_area);

    const statusEntry = statusMap[id];
    const execCss = statusEntry?.[1];
    const execution_status: ExecutionStatus = (['passed', 'not-executed', 'skipped', 'failed-defect'] as const)
      .includes(execCss as ExecutionStatus) ? (execCss as ExecutionStatus) : 'not-executed';

    const automation_state: AutomationState = spec_file ? 'automated' : 'pending';

    if (!d) warnings.push(`${id}: missing details block`);
    if (!subsection) warnings.push(`${id}: missing SUBSECTION_INDEX entry`);

    scenarios.push({
      id,
      title,
      automation_state,
      execution_status,
      priority: inferPriority(id),
      feature_area,
      spec_file,
      workflow,
      subsection,
      steps: d?.steps ?? [],
      expected_results: d?.expected_results ?? [],
      execution_notes: d?.execution_notes ?? '',
    });
  }

  scenarios.sort((a, b) => a.id.localeCompare(b.id));
  return { scenarios, warnings };
}
```

- [ ] **Step 5: Run parser tests, verify they pass**

Run: `cd PIC_Automation && npx playwright test tests/tracker/html-parser.test.ts --reporter=list`
Expected: 6/6 PASS.

- [ ] **Step 6: Commit**

```bash
cd PIC_Automation
git add src/tracker/html-parser.ts tests/tracker/html-parser.test.ts tests/fixtures/automation-testing-plan.fixture.html
git commit -m "feat(tracker): HTML plan parser with unit tests"
```

---

## Task 5 — Migration script

**Files:**
- Create: `scripts/migrate-from-html.ts`
- Create: `tests/tracker/migrate-from-html.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing integration test**

```ts
// tests/tracker/migrate-from-html.test.ts
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';

const ROOT = path.resolve(__dirname, '..', '..');
const FIXTURE = path.resolve(ROOT, 'tests', 'fixtures', 'automation-testing-plan.fixture.html');
const SCRATCH_DB = path.resolve(ROOT, 'tmp', 'migrate-test.db');

test.describe('migrate-from-html', () => {
  test.beforeEach(() => {
    fs.mkdirSync(path.dirname(SCRATCH_DB), { recursive: true });
    if (fs.existsSync(SCRATCH_DB)) fs.unlinkSync(SCRATCH_DB);
  });

  test('dry-run exits 0 and writes nothing', () => {
    const res = spawnSync('npx', ['tsx', 'scripts/migrate-from-html.ts', '--html', FIXTURE, '--db', SCRATCH_DB, '--dry-run'], {
      cwd: ROOT,
      encoding: 'utf-8',
    });
    expect(res.status).toBe(0);
    expect(fs.existsSync(SCRATCH_DB)).toBe(false);
  });

  test('live run inserts all fixture scenarios', () => {
    const res = spawnSync('npx', ['tsx', 'scripts/migrate-from-html.ts', '--html', FIXTURE, '--db', SCRATCH_DB], {
      cwd: ROOT,
      encoding: 'utf-8',
    });
    expect(res.status).toBe(0);
    expect(fs.existsSync(SCRATCH_DB)).toBe(true);

    const Database = require('better-sqlite3');
    const db = new Database(SCRATCH_DB);
    const count = (db.prepare('SELECT COUNT(*) as c FROM scenarios').get() as { c: number }).c;
    expect(count).toBe(3);
    const loggedIn = db.prepare('SELECT * FROM scenarios WHERE id = ?').get('AUTH-LOGIN-001') as any;
    expect(loggedIn.title).toBe('Verify login page loads');
    expect(loggedIn.execution_status).toBe('passed');
    expect(loggedIn.automation_state).toBe('automated');

    const detail = db.prepare('SELECT * FROM scenario_details WHERE scenario_id = ?').get('AUTH-LOGIN-999') as any;
    expect(detail.execution_notes).toBe('Known flaky on QA');
    db.close();
  });

  test('refuses to run twice without --force', () => {
    const args = ['tsx', 'scripts/migrate-from-html.ts', '--html', FIXTURE, '--db', SCRATCH_DB];
    spawnSync('npx', args, { cwd: ROOT, encoding: 'utf-8' });
    const second = spawnSync('npx', args, { cwd: ROOT, encoding: 'utf-8' });
    expect(second.status).not.toBe(0);
    expect(second.stderr + second.stdout).toMatch(/already at schema v2|existing data|--force/i);
  });
});
```

- [ ] **Step 2: Verify it fails**

Run: `cd PIC_Automation && npx playwright test tests/tracker/migrate-from-html.test.ts --reporter=list`
Expected: FAIL — script does not exist.

- [ ] **Step 3: Implement the migration script**

```ts
#!/usr/bin/env npx tsx
// scripts/migrate-from-html.ts

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { parseHtmlPlan } from '../src/tracker/html-parser';

const ROOT = path.resolve(__dirname, '..');

interface Args {
  htmlPath: string;
  dbPath: string;
  dryRun: boolean;
  force: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    htmlPath: path.join(ROOT, 'docs', 'ai', 'automation-testing-plan.html'),
    dbPath: path.join(ROOT, 'config', 'scenarios.db'),
    dryRun: false,
    force: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--force') args.force = true;
    else if (a === '--html') args.htmlPath = argv[++i];
    else if (a === '--db')   args.dbPath = argv[++i];
    else if (a === '-h' || a === '--help') {
      console.log('Usage: tsx scripts/migrate-from-html.ts [--html <path>] [--db <path>] [--dry-run] [--force]');
      process.exit(0);
    }
  }
  return args;
}

const SCHEMA_SQL = fs.readFileSync(path.join(ROOT, 'src', 'tracker', 'db.ts'), 'utf-8')
  .match(/const SCHEMA_SQL = `([\s\S]*?)`;/)?.[1];

function ensureSchema(db: Database.Database): void {
  if (!SCHEMA_SQL) throw new Error('Failed to load SCHEMA_SQL from src/tracker/db.ts');
  db.exec(SCHEMA_SQL);
}

function backupDb(dbPath: string): string | null {
  if (!fs.existsSync(dbPath)) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = `${dbPath}.bak-${stamp}`;
  fs.copyFileSync(dbPath, backup);
  return backup;
}

function main(): void {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(args.htmlPath)) {
    console.error(`✗ HTML not found: ${args.htmlPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(args.htmlPath, 'utf-8');
  const { scenarios, warnings } = parseHtmlPlan(html);

  console.log(`Parsed ${scenarios.length} scenarios from ${args.htmlPath}`);
  if (warnings.length) {
    console.log(`${warnings.length} warnings (first 5):`);
    for (const w of warnings.slice(0, 5)) console.log('  - ' + w);
  }

  if (args.dryRun) {
    const byExec = scenarios.reduce<Record<string, number>>((acc, s) => { acc[s.execution_status] = (acc[s.execution_status] || 0) + 1; return acc; }, {});
    const byAuto = scenarios.reduce<Record<string, number>>((acc, s) => { acc[s.automation_state] = (acc[s.automation_state] || 0) + 1; return acc; }, {});
    console.log('Execution status distribution:', byExec);
    console.log('Automation state distribution:', byAuto);
    console.log('(dry-run — wrote nothing)');
    return;
  }

  // Refuse to clobber an existing schema-v2 DB unless --force.
  if (fs.existsSync(args.dbPath)) {
    const probe = new Database(args.dbPath);
    try {
      const row = probe.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get() as { value?: string } | undefined;
      if (row?.value === '2' && !args.force) {
        console.error(`✗ DB already at schema v2 (${args.dbPath}). Use --force to overwrite existing data.`);
        probe.close();
        process.exit(2);
      }
    } catch { /* not a v2 DB — safe to proceed */ }
    probe.close();
  }

  const backup = backupDb(args.dbPath);
  if (backup) console.log(`Backed up existing DB → ${path.relative(ROOT, backup)}`);

  // Fresh DB: remove file so getDb creates it cleanly.
  if (fs.existsSync(args.dbPath)) fs.unlinkSync(args.dbPath);
  for (const sfx of ['-shm', '-wal']) {
    const extra = args.dbPath + sfx;
    if (fs.existsSync(extra)) fs.unlinkSync(extra);
  }

  fs.mkdirSync(path.dirname(args.dbPath), { recursive: true });
  const db = new Database(args.dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  ensureSchema(db);

  db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('schema_version', '2');

  const insertScenario = db.prepare(`
    INSERT INTO scenarios (id, title, description, automation_state, execution_status,
      priority, feature_area, spec_file, workflow, subsection, created_at, updated_at)
    VALUES (@id, @title, '', @automation_state, @execution_status,
      @priority, @feature_area, @spec_file, @workflow, @subsection, datetime('now'), datetime('now'))
  `);
  const insertDetail = db.prepare(`
    INSERT INTO scenario_details (scenario_id, steps, expected_results, execution_notes)
    VALUES (?, ?, ?, ?)
  `);

  const run = db.transaction(() => {
    for (const s of scenarios) {
      insertScenario.run({
        id: s.id,
        title: s.title,
        automation_state: s.automation_state,
        execution_status: s.execution_status,
        priority: s.priority,
        feature_area: s.feature_area,
        spec_file: s.spec_file,
        workflow: s.workflow,
        subsection: s.subsection,
      });
      insertDetail.run(s.id, JSON.stringify(s.steps), JSON.stringify(s.expected_results), s.execution_notes);
    }
  });
  run();

  const count = (db.prepare('SELECT COUNT(*) as c FROM scenarios').get() as { c: number }).c;
  if (count !== scenarios.length) {
    console.error(`✗ Post-insert count ${count} ≠ parsed ${scenarios.length}`);
    db.close();
    process.exit(3);
  }

  db.close();
  console.log(`✓ Inserted ${count} scenarios into ${path.relative(ROOT, args.dbPath)}`);
  console.log(`✓ schema_version = 2`);
}

main();
```

- [ ] **Step 4: Add npm scripts to package.json**

Replace the two `tracker:sync-from-html*` entries with:

```json
    "tracker:migrate": "npx tsx scripts/migrate-from-html.ts",
    "tracker:migrate:dry": "npx tsx scripts/migrate-from-html.ts --dry-run",
```

- [ ] **Step 5: Run the tests**

Run: `cd PIC_Automation && npx playwright test tests/tracker/migrate-from-html.test.ts --reporter=list`
Expected: 3/3 PASS.

- [ ] **Step 6: Run against real HTML as a dry run sanity check**

Run: `cd PIC_Automation && npm run tracker:migrate:dry`
Expected: non-zero parse count (~400+), prints execution status distribution, exits 0.

- [ ] **Step 7: Commit**

```bash
cd PIC_Automation
git add scripts/migrate-from-html.ts tests/tracker/migrate-from-html.test.ts package.json
git commit -m "feat(tracker): migrate-from-html script with integration tests"
```

---

## Task 6 — CLI updates (tracker.ts)

**Files:**
- Modify: `scripts/tracker.ts`

- [ ] **Step 1: Update imports at the top**

Replace the imports and color maps to match the new types:

```ts
// scripts/tracker.ts — imports + color maps replacement

import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import path from 'path';
import fs from 'fs';

import { getDb, closeDb, getDbPath } from '../src/tracker/db';
import {
  addScenario,
  getScenario,
  removeScenario,
  setAutomationState,
  setExecutionStatus,
  holdScenario,
  unholdScenario,
  updateScenario,
  listScenarios,
  addGroupToScenario,
  removeGroupFromScenario,
  listAllGroups,
  addGroup,
  syncWithSpecFiles,
  getStats,
  exportToJson,
  importFromJson,
  isValidAutomationState,
  isValidExecutionStatus,
  isValidPriority,
  isValidFeatureArea,
} from '../src/tracker/operations';
import {
  AUTOMATION_STATES,
  EXECUTION_STATUSES,
  PRIORITIES,
  FEATURE_AREAS,
} from '../src/tracker/models';
import type {
  AutomationState,
  ExecutionStatus,
  Priority,
  FeatureArea,
  Scenario,
} from '../src/tracker/models';

const autoStateColor: Record<AutomationState, (s: string) => string> = {
  pending:   chalk.yellow,
  automated: chalk.green,
  'on-hold': chalk.magenta,
};
const execStatusColor: Record<ExecutionStatus, (s: string) => string> = {
  passed:         chalk.cyan,
  'not-executed': chalk.gray,
  skipped:        chalk.gray,
  'failed-defect': chalk.red,
};
const priorityColor: Record<Priority, (s: string) => string> = {
  P1: chalk.red.bold,
  P2: chalk.yellow,
  P3: chalk.gray,
};

function colorAuto(s: AutomationState): string { return (autoStateColor[s] || chalk.white)(s); }
function colorExec(s: ExecutionStatus): string { return (execStatusColor[s] || chalk.white)(s); }
function colorPriority(p: Priority): string    { return (priorityColor[p]  || chalk.white)(p); }
```

- [ ] **Step 2: Update `list` command options and output**

Find the `list` command block (starts near line 93) and replace its option flags + action:

```ts
program
  .command('list')
  .description('List test scenarios with optional filters')
  .option('--auto-state <state>',     `Filter by automation state (${AUTOMATION_STATES.join(', ')})`)
  .option('--exec-status <status>',   `Filter by execution status (${EXECUTION_STATUSES.join(', ')})`)
  .option('-p, --priority <priority>',`Filter by priority (${PRIORITIES.join(', ')})`)
  .option('-a, --area <area>',        `Filter by feature area (${FEATURE_AREAS.join(', ')})`)
  .option('-g, --group <group>',      'Filter by group/tag name')
  .option('-w, --workflow <workflow>','Filter by workflow name (partial match)')
  .option('-s, --search <term>',      'Search id/title/description')
  .option('--spec <path>',            'Filter by spec file (partial match)')
  .action((opts) => {
    getDb();
    const scenarios = listScenarios({
      automation_state: opts.autoState,
      execution_status: opts.execStatus,
      priority: opts.priority,
      feature_area: opts.area,
      group: opts.group,
      workflow: opts.workflow,
      search: opts.search,
      spec_file: opts.spec,
    });

    if (!scenarios.length) {
      console.log(chalk.gray('No scenarios match filters.'));
      closeDb();
      return;
    }

    const table = new Table({
      head: ['ID', 'Priority', 'Auto State', 'Exec Status', 'Area', 'Title'],
      style: { head: ['cyan'] },
      colWidths: [22, 10, 12, 14, 14, 60],
      wordWrap: true,
    });
    for (const s of scenarios) {
      table.push([
        s.id,
        colorPriority(s.priority),
        colorAuto(s.automation_state),
        colorExec(s.execution_status),
        s.feature_area,
        s.title,
      ]);
    }
    console.log(table.toString());
    console.log(chalk.gray(`\n${scenarios.length} scenarios`));
    closeDb();
  });
```

- [ ] **Step 3: Replace the `status` command with `auto-state` + `exec-status` + deprecated alias**

Find the `program.command('status <id> <newStatus>')` block and replace it:

```ts
program
  .command('auto-state <id> <newState>')
  .description(`Set automation state. Valid: ${AUTOMATION_STATES.join(', ')}`)
  .action((id: string, newState: string) => {
    getDb();
    if (!isValidAutomationState(newState)) {
      console.log(chalk.red(`Invalid automation state: ${newState}. Valid: ${AUTOMATION_STATES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    const updated = setAutomationState(id.toUpperCase(), newState as AutomationState);
    if (updated) console.log(chalk.green(`✓ ${updated.id} auto-state → ${colorAuto(updated.automation_state)}`));
    else         console.log(chalk.red(`Scenario "${id}" not found.`));
    closeDb();
  });

program
  .command('exec-status <id> <newStatus>')
  .description(`Set execution status. Valid: ${EXECUTION_STATUSES.join(', ')}`)
  .action((id: string, newStatus: string) => {
    getDb();
    if (!isValidExecutionStatus(newStatus)) {
      console.log(chalk.red(`Invalid execution status: ${newStatus}. Valid: ${EXECUTION_STATUSES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    const updated = setExecutionStatus(id.toUpperCase(), newStatus as ExecutionStatus);
    if (updated) console.log(chalk.green(`✓ ${updated.id} exec-status → ${colorExec(updated.execution_status)}`));
    else         console.log(chalk.red(`Scenario "${id}" not found.`));
    closeDb();
  });

// Deprecated alias — routes to auto-state for backward compatibility.
program
  .command('status <id> <newStatus>')
  .description('[deprecated] Alias for auto-state')
  .action((id: string, newStatus: string) => {
    console.log(chalk.yellow('⚠  `status` is deprecated — use `auto-state` or `exec-status` instead.'));
    if (!isValidAutomationState(newStatus)) {
      console.log(chalk.red(`Invalid automation state: ${newStatus}. Valid: ${AUTOMATION_STATES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    getDb();
    const updated = setAutomationState(id.toUpperCase(), newStatus as AutomationState);
    if (updated) console.log(chalk.green(`✓ ${updated.id} auto-state → ${colorAuto(updated.automation_state)}`));
    else         console.log(chalk.red(`Scenario "${id}" not found.`));
    closeDb();
  });
```

- [ ] **Step 4: Update remaining references to `setStatus`, `status`, `colorStatus`**

Search for remaining `setStatus(`, `colorStatus(`, `scenario.status`, `s.status` references in the file and update:
- `colorStatus(s.status)` → `colorAuto(s.automation_state) + ' / ' + colorExec(s.execution_status)`
- `setStatus(...)` → `setAutomationState(...)` or `setExecutionStatus(...)` (context-dependent; the `hold`/`unhold` commands don't need changes since those ops are wrapped)
- `scenario.status === 'automated'` → `scenario.automation_state === 'automated'`

Focus the search on the `show`, `report`, and any scenario-display helpers. Use `rg 'colorStatus|setStatus\(|\.status'` from the repo root to find them.

- [ ] **Step 5: Update the `report` command**

Find the `.command('report')` block and replace the stats rendering:

```ts
program
  .command('report')
  .description('Print summary statistics')
  .action(() => {
    getDb();
    const stats = getStats();
    console.log(chalk.bold('Scenario Tracker Report'));
    console.log(chalk.gray('───────────────────────'));
    console.log(`Total scenarios: ${stats.total}`);

    console.log(chalk.bold('\nBy Automation State:'));
    for (const [k, v] of Object.entries(stats.byAutomationState)) console.log(`  ${colorAuto(k as AutomationState)}: ${v}`);

    console.log(chalk.bold('\nBy Execution Status:'));
    for (const [k, v] of Object.entries(stats.byExecutionStatus)) console.log(`  ${colorExec(k as ExecutionStatus)}: ${v}`);

    console.log(chalk.bold('\nBy Priority:'));
    for (const [k, v] of Object.entries(stats.byPriority)) console.log(`  ${colorPriority(k as Priority)}: ${v}`);

    console.log(chalk.bold('\nBy Feature Area:'));
    for (const [k, v] of Object.entries(stats.byFeatureArea)) console.log(`  ${k}: ${v}`);
    closeDb();
  });
```

- [ ] **Step 6: Run typecheck**

Run: `cd PIC_Automation && npm run typecheck`
Expected: no errors in `scripts/tracker.ts`. Errors may still exist in `scripts/tracker-ui.ts`, `scripts/seed-tracker.ts`, `scripts/sync-from-html-plan.ts`, `scripts/sync-ids-from-specs.ts`.

- [ ] **Step 7: Manual CLI smoke**

Run: `cd PIC_Automation && npm run tracker:migrate -- --force && npm run tracker:list -- --auto-state automated`
Expected: table with Priority / Auto State / Exec Status columns, rows visible.

Run: `cd PIC_Automation && npm run tracker -- auto-state AUTH-LOGIN-001 on-hold`
Expected: `✓ AUTH-LOGIN-001 auto-state → on-hold` (magenta).

Run: `cd PIC_Automation && npm run tracker -- exec-status AUTH-LOGIN-001 failed-defect`
Expected: `✓ AUTH-LOGIN-001 exec-status → failed-defect` (red).

Run: `cd PIC_Automation && npm run tracker -- status AUTH-LOGIN-001 pending`
Expected: deprecation warning + success.

- [ ] **Step 8: Commit**

```bash
cd PIC_Automation
git add scripts/tracker.ts
git commit -m "feat(tracker): split CLI status into auto-state + exec-status (status aliased)"
```

---

## Task 7 — Tracker-UI server updates

**Files:**
- Modify: `scripts/tracker-ui.ts`

- [ ] **Step 1: Update imports**

In `scripts/tracker-ui.ts`, replace the tracker imports block:

```ts
import {
  addScenario,
  getScenario,
  updateScenario,
  removeScenario,
  setAutomationState,
  setExecutionStatus,
  holdScenario,
  unholdScenario,
  addGroupToScenario,
  removeGroupFromScenario,
  listAllGroups,
  addGroup,
  listScenarios,
  syncWithSpecFiles,
  getStats,
  exportToJson,
  importFromJson,
  isValidAutomationState,
  isValidExecutionStatus,
  isValidPriority,
  isValidFeatureArea,
  getScenarioDetails,
  getAllScenarioDetails,
  getDistinctWorkflows,
} from '../src/tracker/operations';
import {
  AUTOMATION_STATES,
  EXECUTION_STATUSES,
  PRIORITIES,
  FEATURE_AREAS,
  DEFAULT_GROUPS,
} from '../src/tracker/models';
import type { ListFilters, TrackerExport, AutomationState, ExecutionStatus } from '../src/tracker/models';
```

- [ ] **Step 2: Extend GET `/api/scenarios` query params**

Find the `/api/scenarios` GET handler. Replace its filter-extraction block with:

```ts
app.get('/api/scenarios', (req: Request, res: Response) => {
  const filters: ListFilters = {};
  const q = req.query;

  if (q.automation_state) filters.automation_state = param(q.automation_state as any) as AutomationState;
  if (q.execution_status) filters.execution_status = param(q.execution_status as any) as ExecutionStatus;
  if (q.priority)         filters.priority         = param(q.priority as any) as any;
  if (q.feature_area)     filters.feature_area     = param(q.feature_area as any) as any;
  if (q.group)            filters.group            = param(q.group as any);
  if (q.workflow)         filters.workflow         = param(q.workflow as any);
  if (q.search)           filters.search           = param(q.search as any);
  if (q.spec_file)        filters.spec_file        = param(q.spec_file as any);

  res.json(listScenarios(filters));
});
```

- [ ] **Step 3: Update any POST endpoints that referenced the old `status`**

Search for `setStatus(` in `scripts/tracker-ui.ts`. Replace with dual endpoints:

```ts
// POST /api/scenarios/:id/auto-state  { state: AutomationState }
app.post('/api/scenarios/:id/auto-state', (req: Request, res: Response) => {
  const state = req.body?.state;
  if (!isValidAutomationState(state)) return res.status(400).json({ error: 'invalid automation state' });
  const updated = setAutomationState(param(req.params.id).toUpperCase(), state);
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
});

// POST /api/scenarios/:id/exec-status  { status: ExecutionStatus }
app.post('/api/scenarios/:id/exec-status', (req: Request, res: Response) => {
  const status = req.body?.status;
  if (!isValidExecutionStatus(status)) return res.status(400).json({ error: 'invalid execution status' });
  const updated = setExecutionStatus(param(req.params.id).toUpperCase(), status);
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
});
```

If there's an existing `POST /api/scenarios/:id/status`, remove it.

- [ ] **Step 4: Update the enums exposed by `/api/meta` or equivalent**

Search for `SCENARIO_STATUSES` references in `tracker-ui.ts`. Replace with `AUTOMATION_STATES` and `EXECUTION_STATUSES` — expose both to the client:

```ts
app.get('/api/meta', (_req: Request, res: Response) => {
  res.json({
    automation_states: AUTOMATION_STATES,
    execution_statuses: EXECUTION_STATUSES,
    priorities: PRIORITIES,
    feature_areas: FEATURE_AREAS,
    default_groups: DEFAULT_GROUPS,
  });
});
```

(If `/api/meta` doesn't exist under that name, find the equivalent "constants" endpoint and replace its payload.)

- [ ] **Step 5: Run typecheck**

Run: `cd PIC_Automation && npm run typecheck`
Expected: no errors in `scripts/tracker-ui.ts`. Remaining errors in `seed-tracker.ts`, `sync-from-html-plan.ts`, `sync-ids-from-specs.ts` are acceptable — those scripts will be cleaned up in Task 9.

- [ ] **Step 6: Smoke the server**

Run: `cd PIC_Automation && npm run tracker:ui` (in one terminal)
Run: `curl 'http://localhost:3005/api/scenarios?automation_state=automated' | head -200` (in another)
Expected: JSON array with `automation_state` and `execution_status` fields on each row.

- [ ] **Step 7: Commit**

```bash
cd PIC_Automation
git add scripts/tracker-ui.ts
git commit -m "feat(tracker): tracker-ui endpoints for auto-state + exec-status"
```

---

## Task 8 — UI front-end (index.html)

**Files:**
- Modify: `src/tracker/ui/index.html`

> Because `index.html` is a single file with inline CSS/JS, each step points at a section to edit rather than a line range. Use the browser DevTools on a running `npm run tracker:ui` instance to confirm styling after each step.

- [ ] **Step 1: Add execution badge styles**

Locate the existing CSS block near the top of `<head><style>`. Add:

```css
/* Execution status badge */
.badge.exec-passed       { background: #0d2a0f; color: #3fb950; border-color: #3fb950; }
.badge.exec-not-executed { background: #21262d; color: #8b949e; border-color: #30363d; }
.badge.exec-skipped      { background: #21262d; color: #e3b341; border-color: #e3b341; }
.badge.exec-failed-defect{ background: #3b0d10; color: #ff7b72; border-color: #ff7b72; }

/* Automation state badge */
.badge.auto-pending  { background: #332500; color: #e3b341; border-color: #e3b341; }
.badge.auto-automated{ background: #0d2a0f; color: #3fb950; border-color: #3fb950; }
.badge.auto-on-hold  { background: #2b1241; color: #d2a8ff; border-color: #d2a8ff; }
```

- [ ] **Step 2: Render two badges per scenario row**

Find the template string / render function that builds each scenario row (search for `scenario-row` or similar). Replace the single status-badge render with:

```js
function renderBadges(s) {
  const exec = `<span class="badge exec-${s.execution_status}">${s.execution_status}</span>`;
  const auto = `<span class="badge auto-${s.automation_state}">${s.automation_state}</span>`;
  return `${auto} ${exec}`;
}
```

Wire `renderBadges(s)` into the row HTML template (replacing whatever references `s.status`).

- [ ] **Step 3: Add filter controls to the filter bar**

Find the filter bar `<div id="filter-bar">` block. Add:

```html
<select id="filter-auto-state">
  <option value="">Any auto state</option>
  <option value="pending">Pending</option>
  <option value="automated">Automated</option>
  <option value="on-hold">On hold</option>
</select>

<select id="filter-exec-status">
  <option value="">Any exec status</option>
  <option value="passed">Passed</option>
  <option value="not-executed">Not executed</option>
  <option value="skipped">Skipped</option>
  <option value="failed-defect">Failed: defect</option>
</select>

<select id="filter-workflow">
  <option value="">Any workflow</option>
  <!-- populated at load from /api/workflows -->
</select>

<label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)">
  <input type="checkbox" id="group-by-workflow"> Group by workflow
</label>
```

- [ ] **Step 4: Wire filter controls to fetch**

Find the existing scenario-fetch function (likely `loadScenarios` or `refresh`). Replace its query-param construction:

```js
async function loadScenarios() {
  const params = new URLSearchParams();
  const autoState = document.getElementById('filter-auto-state').value;
  const execStatus = document.getElementById('filter-exec-status').value;
  const workflow = document.getElementById('filter-workflow').value;
  const search = document.getElementById('search-input')?.value ?? '';

  if (autoState)  params.set('automation_state', autoState);
  if (execStatus) params.set('execution_status', execStatus);
  if (workflow)   params.set('workflow', workflow);
  if (search)     params.set('search', search);

  const res = await fetch('/api/scenarios?' + params.toString());
  const scenarios = await res.json();
  renderList(scenarios);
}

['filter-auto-state', 'filter-exec-status', 'filter-workflow', 'search-input']
  .forEach(id => document.getElementById(id)?.addEventListener('change', loadScenarios));
```

- [ ] **Step 5: Populate workflow dropdown on load**

Add at the bottom of the initial boot script:

```js
async function populateWorkflowFilter() {
  const res = await fetch('/api/workflows');
  const workflows = await res.json();
  const sel = document.getElementById('filter-workflow');
  for (const w of workflows) {
    const opt = document.createElement('option');
    opt.value = w; opt.textContent = w;
    sel.appendChild(opt);
  }
}
populateWorkflowFilter();
```

If `/api/workflows` doesn't exist yet in `tracker-ui.ts`, add this route there:

```ts
// scripts/tracker-ui.ts
app.get('/api/workflows', (_req: Request, res: Response) => {
  res.json(getDistinctWorkflows());
});
```

- [ ] **Step 6: Detail drawer — steps, expected results, execution notes**

Find the detail-rendering function (search for `scenario-detail` / `drawer` / `showDetail`). Extend its output:

```js
function renderDetail(s) {
  const stepsHtml = s.steps.length
    ? `<ol class="detail-steps">${s.steps.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ol>`
    : '<em class="muted">No steps recorded.</em>';
  const expectedHtml = s.expected_results.length
    ? `<ul class="detail-expected">${s.expected_results.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`
    : '<em class="muted">No expected results recorded.</em>';
  const notesHtml = s.execution_notes
    ? `<div class="detail-notes"><em>${escapeHtml(s.execution_notes)}</em></div>`
    : '';

  return `
    <div class="detail-section"><h3>Steps</h3>${stepsHtml}</div>
    <div class="detail-section"><h3>Expected Results</h3>${expectedHtml}</div>
    ${notesHtml ? `<div class="detail-section"><h3>Execution Notes</h3>${notesHtml}</div>` : ''}
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
```

Call `renderDetail(s)` wherever the drawer body HTML is built.

Add CSS:

```css
.detail-section { margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--border); }
.detail-section h3 { font-size: 12px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.detail-steps, .detail-expected { padding-left: 24px; }
.detail-steps li, .detail-expected li { margin: 4px 0; line-height: 1.5; }
.detail-notes { padding: 8px 12px; background: var(--surface2); border-left: 3px solid var(--orange); border-radius: 4px; }
.muted { color: var(--muted); }
```

- [ ] **Step 7: Group-by-workflow toggle**

Add to `loadScenarios` — after rendering:

```js
const groupByCheck = document.getElementById('group-by-workflow');
groupByCheck.checked = localStorage.getItem('tracker.groupByWorkflow') === '1';
groupByCheck.addEventListener('change', () => {
  localStorage.setItem('tracker.groupByWorkflow', groupByCheck.checked ? '1' : '0');
  loadScenarios();
});

function renderList(scenarios) {
  const list = document.getElementById('scenario-list');
  list.innerHTML = '';
  if (groupByCheck.checked) {
    const grouped = {};
    for (const s of scenarios) {
      const key = `${s.workflow || 'WORKFLOW — Other'} :: ${s.subsection || '—'}`;
      (grouped[key] ||= []).push(s);
    }
    for (const [header, rows] of Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))) {
      const section = document.createElement('section');
      section.className = 'workflow-group';
      section.innerHTML = `<h2 class="workflow-header">${escapeHtml(header)}</h2>` +
        rows.map(s => renderRow(s)).join('');
      list.appendChild(section);
    }
  } else {
    list.innerHTML = scenarios.map(s => renderRow(s)).join('');
  }
}
```

`renderRow(s)` is the existing row builder — now it returns a string instead of mutating the DOM; if it currently appends, refactor to a string builder.

Add CSS for the header:

```css
.workflow-group { margin-bottom: 20px; }
.workflow-header { font-size: 13px; color: var(--blue); padding: 6px 12px; background: var(--surface2); border-radius: var(--radius-sm); margin-bottom: 8px; }
```

- [ ] **Step 8: Manual UI smoke**

Run: `cd PIC_Automation && npm run tracker:ui` (leave running)

Open `http://localhost:3005/ui/` in a browser and verify:
1. Each row shows two badges side by side (auto-state and exec-status).
2. Filter dropdowns (auto state, exec status, workflow) filter the list.
3. Clicking a scenario opens the detail drawer with Steps / Expected Results / Execution Notes sections.
4. Turning on **Group by workflow** collapses the list under workflow headers; reload — preference persists.
5. `AUTH-LOGIN-001` (passed) and `AUTH-FPW-001` (failed-defect) render with the correct colors.

- [ ] **Step 9: Commit**

```bash
cd PIC_Automation
git add src/tracker/ui/index.html scripts/tracker-ui.ts
git commit -m "feat(tracker-ui): dual badges, workflow filter, group-by toggle, detail drawer"
```

---

## Task 9 — Cleanup of legacy scripts

**Files:**
- Modify: `scripts/seed-tracker.ts` (or delete if redundant after migration)
- Modify: `scripts/sync-ids-from-specs.ts`
- Delete: `scripts/sync-from-html-plan.ts`
- Delete: `scripts/seed-details.ts`, `scripts/seed-steps.ts`, `scripts/seed-subsections.ts` (if redundant — verify first)

- [ ] **Step 1: Audit legacy scripts**

Run: `cd PIC_Automation && grep -l "setStatus\|SCENARIO_STATUSES" scripts/*.ts`

For each file listed, decide: update to new API, or delete if the migration script has obviated it.

- [ ] **Step 2: Update `sync-ids-from-specs.ts`**

Replace any `setStatus(id, 'automated')` with `setAutomationState(id, 'automated')`. Leave `execution_status` alone — spec-file presence only implies automation state, not execution result.

Run: `cd PIC_Automation && npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Delete superseded scripts**

```bash
cd PIC_Automation
git rm scripts/sync-from-html-plan.ts
```

If `seed-tracker.ts`, `seed-details.ts`, `seed-steps.ts`, `seed-subsections.ts` are also obsolete (confirm by reading their headers — if they exist only to populate from HTML sources, they're redundant), `git rm` them too.

Remove any `package.json` scripts that point to deleted files.

- [ ] **Step 4: Run the full test suite once**

Run: `cd PIC_Automation && npx playwright test tests/tracker --reporter=list`
Expected: all parser + migration tests PASS.

- [ ] **Step 5: Commit**

```bash
cd PIC_Automation
git add -A
git commit -m "chore(tracker): retire legacy sync/seed scripts; sync-ids uses new API"
```

---

## Task 10 — Run real migration against the production HTML

**Files:**
- Modify: `config/scenarios.db` (regenerated)

- [ ] **Step 1: Dry run against the real HTML**

Run: `cd PIC_Automation && npm run tracker:migrate:dry`
Expected: prints ~400+ scenarios, warning count, status/state distributions, exits 0.

- [ ] **Step 2: Live migration (with --force since schema v1 DB will be backed up)**

Run: `cd PIC_Automation && npm run tracker:migrate -- --force`
Expected: `Backed up existing DB → config/scenarios.db.bak-<stamp>`, `✓ Inserted N scenarios`, `✓ schema_version = 2`.

- [ ] **Step 3: Verify tracker UI against real data**

Run: `cd PIC_Automation && npm run tracker:ui`
Open `http://localhost:3005/ui/`.

Verify:
- Scenario count roughly matches HTML plan (~400+).
- `AUTH-LOGIN-001` → auto-state `automated`, exec-status `passed`, steps list populated.
- `AUTH-FPW-001` → exec-status `failed-defect` (red).
- `AUTH-SSO-001` → exec-status `not-executed` (grey).
- Filter `failed-defect` reduces the list appreciably.
- Group-by-workflow renders workflow sections with real titles (WORKFLOW 1 — Authentication, etc.).

- [ ] **Step 4: Commit the regenerated DB (optional — per project convention)**

If `config/scenarios.db` is tracked in git (check `git check-ignore config/scenarios.db`), commit it. Otherwise skip.

```bash
cd PIC_Automation
# Only if not gitignored:
git add config/scenarios.db
git commit -m "chore(tracker): regenerate scenarios.db from HTML plan (schema v2)"
```

- [ ] **Step 5: Update spec / plan status**

Mark the plan complete by editing `docs/superpowers/plans/2026-04-14-tracker-html-migration.md`: change the header to `**Status:** Complete`. Commit.

```bash
cd PIC_Automation
git add docs/superpowers/plans/2026-04-14-tracker-html-migration.md
git commit -m "docs: mark tracker migration plan complete"
```

---

## Validation Summary

After all tasks are merged:

- `npm run typecheck` → 0 errors.
- `npx playwright test tests/tracker` → all PASS.
- `npm run tracker:migrate:dry` → parses ~400 scenarios with 0 errors.
- `npm run tracker:ui` → UI shows dual badges, filters work, detail drawer shows steps/expected results, group-by toggle works.
- `config/scenarios.db` contains schema v2 with counts matching the HTML plan.

HTML plan is now a frozen reference. Day-to-day scenario management moves to the tracker. Plan 2 (run-scenarios-from-UI) can build on this foundation.
