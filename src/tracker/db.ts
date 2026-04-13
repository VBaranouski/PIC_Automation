/**
 * Test Scenario Tracker — SQLite Database Layer
 *
 * Initialises the SQLite database at `config/scenarios.db`,
 * creates the schema on first run, and exposes the raw `Database` handle
 * for use by the operations module.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// ── Paths ─────────────────────────────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DB_DIR = path.join(PROJECT_ROOT, 'config');
const DB_PATH = path.join(DB_DIR, 'scenarios.db');

// ── Schema DDL ────────────────────────────────────────────────────────────────
const SCHEMA_SQL = `
-- Core scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id           TEXT    PRIMARY KEY,
  title        TEXT    NOT NULL,
  description  TEXT    NOT NULL DEFAULT '',
  status       TEXT    NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','in-progress','automated','failed','skipped','on-hold')),
  priority     TEXT    NOT NULL DEFAULT 'P2'
                       CHECK (priority IN ('P1','P2','P3')),
  feature_area TEXT    NOT NULL DEFAULT 'other'
                       CHECK (feature_area IN ('auth','landing','products','releases','doc','reports','backoffice','integrations','other')),
  spec_file    TEXT    NOT NULL DEFAULT '',
  workflow     TEXT    NOT NULL DEFAULT '',
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Groups / tags — many-to-many via join table
CREATE TABLE IF NOT EXISTS scenario_groups (
  scenario_id  TEXT    NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  group_name   TEXT    NOT NULL,
  PRIMARY KEY (scenario_id, group_name)
);

-- Available group labels (for validation / autocomplete)
CREATE TABLE IF NOT EXISTS groups (
  name         TEXT    PRIMARY KEY,
  description  TEXT    NOT NULL DEFAULT ''
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_scenarios_status       ON scenarios(status);
CREATE INDEX IF NOT EXISTS idx_scenarios_priority     ON scenarios(priority);
CREATE INDEX IF NOT EXISTS idx_scenarios_feature_area ON scenarios(feature_area);
CREATE INDEX IF NOT EXISTS idx_scenario_groups_group  ON scenario_groups(group_name);

-- Seed default group labels
INSERT OR IGNORE INTO groups (name, description) VALUES
  ('smoke',       'Core happy-path tests that must pass before anything else'),
  ('critical',    'Critical business flows — authentication, stage transitions, gating actions'),
  ('regression',  'Full regression suite covering all functional areas'),
  ('integration', 'Tests involving external systems (Jira, Jama, SSO, LEAP)'),
  ('edge-case',   'Boundary conditions, error states, unusual inputs'),
  ('destructive', 'Tests that modify/delete data irreversibly — run with caution'),
  ('manual-only', 'Scenarios intentionally excluded from automation');

-- Add subsection column (safe to re-run — uses IF NOT EXISTS logic via pragma)
-- Handled programmatically in getDb() below.

-- Test case details (steps & expected results from the testing plan)
CREATE TABLE IF NOT EXISTS scenario_details (
  scenario_id      TEXT    PRIMARY KEY REFERENCES scenarios(id) ON DELETE CASCADE,
  steps            TEXT    NOT NULL DEFAULT '[]',
  expected_results TEXT    NOT NULL DEFAULT '[]',
  execution_notes  TEXT    NOT NULL DEFAULT ''
);
`;

// ── Public API ────────────────────────────────────────────────────────────────

let _db: Database.Database | null = null;

/**
 * Returns the singleton Database connection, creating the DB file
 * and schema if they don't exist yet.
 */
export function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure the directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  _db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  _db.pragma('journal_mode = WAL');
  // Enable foreign-key enforcement
  _db.pragma('foreign_keys = ON');

  // Create tables if first run
  _db.exec(SCHEMA_SQL);

  // ── Migrations ──────────────────────────────────────────────────────────
  // Add subsection column if it doesn't exist yet
  const cols = _db.prepare("PRAGMA table_info(scenarios)").all() as { name: string }[];
  if (!cols.some(c => c.name === 'subsection')) {
    _db.exec("ALTER TABLE scenarios ADD COLUMN subsection TEXT NOT NULL DEFAULT ''");
  }

  return _db;
}

/**
 * Closes the database connection (for clean shutdown in scripts).
 */
export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

/**
 * Returns the absolute path to the DB file (useful for diagnostics).
 */
export function getDbPath(): string {
  return DB_PATH;
}

/**
 * Returns the project root path.
 */
export function getProjectRoot(): string {
  return PROJECT_ROOT;
}
