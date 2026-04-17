/**
 * Test Scenario Tracker — Database Layer
 *
 * Manages the SQLite connection (singleton), schema creation, and versioning.
 * Schema v2: dual-status model (automation_state + execution_status), meta table.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DB_DIR = path.join(PROJECT_ROOT, 'config');
const DB_PATH = path.join(DB_DIR, 'scenarios.db');

export const SCHEMA_VERSION = 3;

export const SCHEMA_SQL = `
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
                        CHECK (priority IN ('P1','P2','P3','Edge')),
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
  _db.transaction(() => {
    _db!.exec(SCHEMA_SQL);
    const metaRow = _db!.prepare('SELECT value FROM meta WHERE key = ?').get('schema_version') as { value?: string } | undefined;
    const currentVersion = metaRow?.value ? Number(metaRow.value) : 0;
    if (!metaRow) {
      _db!.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('schema_version', String(SCHEMA_VERSION));
    } else if (currentVersion < 3) {
      // Migration v2 → v3: widen priority CHECK constraint to include 'Edge'
      _db!.exec(`
        PRAGMA foreign_keys = OFF;
        CREATE TABLE scenarios_v3 (
          id               TEXT PRIMARY KEY,
          title            TEXT NOT NULL,
          description      TEXT NOT NULL DEFAULT '',
          automation_state TEXT NOT NULL DEFAULT 'pending'
                                CHECK (automation_state IN ('pending','automated','on-hold')),
          execution_status TEXT NOT NULL DEFAULT 'not-executed'
                                CHECK (execution_status IN ('passed','not-executed','skipped','failed-defect')),
          priority         TEXT NOT NULL DEFAULT 'P2'
                                CHECK (priority IN ('P1','P2','P3','Edge')),
          feature_area     TEXT NOT NULL DEFAULT 'other'
                                CHECK (feature_area IN ('auth','landing','products','releases','doc','reports','backoffice','integrations','other')),
          spec_file        TEXT NOT NULL DEFAULT '',
          workflow         TEXT NOT NULL DEFAULT '',
          subsection       TEXT NOT NULL DEFAULT '',
          created_at       TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
        );
        INSERT INTO scenarios_v3 SELECT * FROM scenarios;
        DROP TABLE scenarios;
        ALTER TABLE scenarios_v3 RENAME TO scenarios;
        CREATE INDEX IF NOT EXISTS idx_scenarios_auto_state  ON scenarios(automation_state);
        CREATE INDEX IF NOT EXISTS idx_scenarios_exec_status ON scenarios(execution_status);
        CREATE INDEX IF NOT EXISTS idx_scenarios_priority    ON scenarios(priority);
        CREATE INDEX IF NOT EXISTS idx_scenarios_feature     ON scenarios(feature_area);
        CREATE INDEX IF NOT EXISTS idx_scenarios_workflow    ON scenarios(workflow);
        PRAGMA foreign_keys = ON;
      `);
      _db!.prepare('UPDATE meta SET value = ? WHERE key = ?').run(String(SCHEMA_VERSION), 'schema_version');
    }
  })();

  return _db;
}

export function getSchemaVersion(): number {
  const db = getDb();
  const row = db.prepare('SELECT value FROM meta WHERE key = ?').get('schema_version') as { value?: string } | undefined;
  return row?.value ? Number(row.value) : 0;
}

export function closeDb(): void {
  if (_db) { _db.close(); _db = null; }
}

export function getDbPath(): string { return DB_PATH; }
export function getProjectRoot(): string { return PROJECT_ROOT; }
