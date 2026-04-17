/**
 * Test Scenario Tracker — Database Migrations
 *
 * Versioned migration objects for evolving the SQLite schema.
 * Each migration has an `up` SQL string and a `description`.
 */

export interface Migration {
  version: number;
  description: string;
  up: string;
}

/**
 * Ordered list of schema migrations.
 * New migrations are appended at the end with an incremented version number.
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 3,
    description: 'Widen priority CHECK constraint to include Edge',
    up: `
      PRAGMA foreign_keys = OFF;
      CREATE TABLE scenario_groups_backup_v3 AS
        SELECT scenario_id, group_name FROM scenario_groups;
      CREATE TABLE scenario_details_backup_v3 AS
        SELECT scenario_id, steps, expected_results, execution_notes FROM scenario_details;
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
      DELETE FROM scenario_groups;
      INSERT INTO scenario_groups (scenario_id, group_name)
      SELECT scenario_id, group_name FROM scenario_groups_backup_v3;
      DELETE FROM scenario_details;
      INSERT INTO scenario_details (scenario_id, steps, expected_results, execution_notes)
      SELECT scenario_id, steps, expected_results, execution_notes FROM scenario_details_backup_v3;
      DROP TABLE scenario_groups_backup_v3;
      DROP TABLE scenario_details_backup_v3;
      CREATE INDEX IF NOT EXISTS idx_scenarios_auto_state  ON scenarios(automation_state);
      CREATE INDEX IF NOT EXISTS idx_scenarios_exec_status ON scenarios(execution_status);
      CREATE INDEX IF NOT EXISTS idx_scenarios_priority    ON scenarios(priority);
      CREATE INDEX IF NOT EXISTS idx_scenarios_feature     ON scenarios(feature_area);
      CREATE INDEX IF NOT EXISTS idx_scenarios_workflow    ON scenarios(workflow);
      PRAGMA foreign_keys = ON;
    `,
  },
];

/** Latest schema version (derived from last migration). */
export const LATEST_VERSION = MIGRATIONS.length ? MIGRATIONS[MIGRATIONS.length - 1].version : 3;
