/**
 * Test Scenario Tracker — CRUD Operations
 *
 * All database read/write operations for scenarios and groups.
 * Used by the CLI tool and the Playwright integration helper.
 */

import { getDb, getProjectRoot } from './db';
import type {
  Scenario,
  ScenarioRow,
  ScenarioStatus,
  Priority,
  FeatureArea,
  ListFilters,
  TrackerExport,
} from './models';
import { SCENARIO_STATUSES, PRIORITIES, FEATURE_AREAS } from './models';
import path from 'path';
import fs from 'fs';
import { glob } from 'fs';

// ── Helpers ───────────────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

/** Convert a flat DB row + its group rows into a full Scenario object. */
function rowToScenario(row: ScenarioRow, groups: string[]): Scenario {
  return { ...row, groups };
}

/** Fetch group names for a scenario ID. */
function getGroups(scenarioId: string): string[] {
  const db = getDb();
  const rows = db.prepare('SELECT group_name FROM scenario_groups WHERE scenario_id = ?').all(scenarioId) as { group_name: string }[];
  return rows.map((r) => r.group_name);
}

/** Set groups for a scenario (replaces all existing). */
function setGroups(scenarioId: string, groups: string[]): void {
  const db = getDb();
  db.prepare('DELETE FROM scenario_groups WHERE scenario_id = ?').run(scenarioId);
  const insert = db.prepare('INSERT OR IGNORE INTO scenario_groups (scenario_id, group_name) VALUES (?, ?)');
  const ensureGroup = db.prepare('INSERT OR IGNORE INTO groups (name) VALUES (?)');
  for (const g of groups) {
    const name = g.trim().toLowerCase();
    if (!name) continue;
    ensureGroup.run(name);
    insert.run(scenarioId, name);
  }
}

// ── Validation helpers ────────────────────────────────────────────────────────

export function isValidStatus(s: string): s is ScenarioStatus {
  return (SCENARIO_STATUSES as readonly string[]).includes(s);
}

export function isValidPriority(p: string): p is Priority {
  return (PRIORITIES as readonly string[]).includes(p);
}

export function isValidFeatureArea(f: string): f is FeatureArea {
  return (FEATURE_AREAS as readonly string[]).includes(f);
}

// ── CRUD: Add ─────────────────────────────────────────────────────────────────

export interface AddScenarioInput {
  id: string;
  title: string;
  description?: string;
  status?: ScenarioStatus;
  priority?: Priority;
  feature_area?: FeatureArea;
  spec_file?: string;
  workflow?: string;
  groups?: string[];
}

export function addScenario(input: AddScenarioInput): Scenario {
  const db = getDb();
  const ts = now();

  const stmt = db.prepare(`
    INSERT INTO scenarios (id, title, description, status, priority, feature_area, spec_file, workflow, created_at, updated_at)
    VALUES (@id, @title, @description, @status, @priority, @feature_area, @spec_file, @workflow, @created_at, @updated_at)
  `);

  const params = {
    id: input.id,
    title: input.title,
    description: input.description ?? '',
    status: input.status ?? 'pending',
    priority: input.priority ?? 'P2',
    feature_area: input.feature_area ?? 'other',
    spec_file: input.spec_file ?? '',
    workflow: input.workflow ?? '',
    created_at: ts,
    updated_at: ts,
  };

  stmt.run(params);
  if (input.groups?.length) {
    setGroups(input.id, input.groups);
  }

  return getScenario(input.id)!;
}

// ── CRUD: Get ─────────────────────────────────────────────────────────────────

export function getScenario(id: string): Scenario | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(id) as ScenarioRow | undefined;
  if (!row) return null;
  return rowToScenario(row, getGroups(id));
}

export function scenarioExists(id: string): boolean {
  const db = getDb();
  const row = db.prepare('SELECT 1 FROM scenarios WHERE id = ?').get(id);
  return !!row;
}

// ── CRUD: Update ──────────────────────────────────────────────────────────────

export interface UpdateScenarioInput {
  title?: string;
  description?: string;
  status?: ScenarioStatus;
  priority?: Priority;
  feature_area?: FeatureArea;
  spec_file?: string;
  workflow?: string;
  groups?: string[];
}

export function updateScenario(id: string, input: UpdateScenarioInput): Scenario | null {
  const db = getDb();
  const existing = getScenario(id);
  if (!existing) return null;

  const sets: string[] = ['updated_at = @updated_at'];
  const params: Record<string, string> = { id, updated_at: now() };

  if (input.title !== undefined) { sets.push('title = @title'); params.title = input.title; }
  if (input.description !== undefined) { sets.push('description = @description'); params.description = input.description; }
  if (input.status !== undefined) { sets.push('status = @status'); params.status = input.status; }
  if (input.priority !== undefined) { sets.push('priority = @priority'); params.priority = input.priority; }
  if (input.feature_area !== undefined) { sets.push('feature_area = @feature_area'); params.feature_area = input.feature_area; }
  if (input.spec_file !== undefined) { sets.push('spec_file = @spec_file'); params.spec_file = input.spec_file; }
  if (input.workflow !== undefined) { sets.push('workflow = @workflow'); params.workflow = input.workflow; }

  db.prepare(`UPDATE scenarios SET ${sets.join(', ')} WHERE id = @id`).run(params);

  if (input.groups !== undefined) {
    setGroups(id, input.groups);
  }

  return getScenario(id);
}

// ── CRUD: Remove ──────────────────────────────────────────────────────────────

export function removeScenario(id: string): boolean {
  const db = getDb();
  // Groups are cascade-deleted via FK
  const result = db.prepare('DELETE FROM scenarios WHERE id = ?').run(id);
  return result.changes > 0;
}

// ── Status shortcuts ──────────────────────────────────────────────────────────

export function setStatus(id: string, status: ScenarioStatus): Scenario | null {
  return updateScenario(id, { status });
}

export function holdScenario(id: string): Scenario | null {
  return setStatus(id, 'on-hold');
}

export function unholdScenario(id: string): Scenario | null {
  return setStatus(id, 'pending');
}

// ── Group operations ──────────────────────────────────────────────────────────

export function addGroupToScenario(scenarioId: string, groupName: string): void {
  const db = getDb();
  const name = groupName.trim().toLowerCase();
  db.prepare('INSERT OR IGNORE INTO groups (name) VALUES (?)').run(name);
  db.prepare('INSERT OR IGNORE INTO scenario_groups (scenario_id, group_name) VALUES (?, ?)').run(scenarioId, name);
  db.prepare('UPDATE scenarios SET updated_at = ? WHERE id = ?').run(now(), scenarioId);
}

export function removeGroupFromScenario(scenarioId: string, groupName: string): void {
  const db = getDb();
  db.prepare('DELETE FROM scenario_groups WHERE scenario_id = ? AND group_name = ?').run(scenarioId, groupName.trim().toLowerCase());
  db.prepare('UPDATE scenarios SET updated_at = ? WHERE id = ?').run(now(), scenarioId);
}

export function listAllGroups(): { name: string; description: string; count: number }[] {
  const db = getDb();
  return db.prepare(`
    SELECT g.name, g.description, COUNT(sg.scenario_id) as count
    FROM groups g
    LEFT JOIN scenario_groups sg ON sg.group_name = g.name
    GROUP BY g.name
    ORDER BY count DESC, g.name ASC
  `).all() as { name: string; description: string; count: number }[];
}

export function addGroup(name: string, description?: string): void {
  const db = getDb();
  db.prepare('INSERT OR IGNORE INTO groups (name, description) VALUES (?, ?)').run(
    name.trim().toLowerCase(),
    description ?? '',
  );
}

// ── List / filter ─────────────────────────────────────────────────────────────

export function listScenarios(filters?: ListFilters): Scenario[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (filters?.status) {
    conditions.push('s.status = @status');
    params.status = filters.status;
  }
  if (filters?.priority) {
    conditions.push('s.priority = @priority');
    params.priority = filters.priority;
  }
  if (filters?.feature_area) {
    conditions.push('s.feature_area = @feature_area');
    params.feature_area = filters.feature_area;
  }
  if (filters?.workflow) {
    conditions.push('s.workflow LIKE @workflow');
    params.workflow = `%${filters.workflow}%`;
  }
  if (filters?.search) {
    conditions.push('(s.id LIKE @search OR s.title LIKE @search OR s.description LIKE @search)');
    params.search = `%${filters.search}%`;
  }
  if (filters?.spec_file) {
    conditions.push('s.spec_file LIKE @spec_file');
    params.spec_file = `%${filters.spec_file}%`;
  }
  if (filters?.group) {
    conditions.push('EXISTS (SELECT 1 FROM scenario_groups sg WHERE sg.scenario_id = s.id AND sg.group_name = @group)');
    params.group = filters.group.trim().toLowerCase();
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT s.* FROM scenarios s ${where} ORDER BY s.priority ASC, s.feature_area ASC, s.id ASC`;

  const rows = db.prepare(sql).all(params) as ScenarioRow[];
  return rows.map((row) => rowToScenario(row, getGroups(row.id)));
}

// ── Sync: scan spec files & reconcile ─────────────────────────────────────────

export interface SyncResult {
  newIds: string[];
  orphanedIds: string[];
  updatedSpecFiles: string[];
}

export function syncWithSpecFiles(): SyncResult {
  const root = getProjectRoot();
  const testsDir = path.join(root, 'tests');
  const result: SyncResult = { newIds: [], orphanedIds: [], updatedSpecFiles: [] };

  if (!fs.existsSync(testsDir)) return result;

  // Recursively find all .spec.ts files
  const specFiles = findSpecFiles(testsDir);
  const foundIds = new Map<string, string>(); // id → relative spec path

  for (const absPath of specFiles) {
    const relPath = path.relative(root, absPath);
    const content = fs.readFileSync(absPath, 'utf-8');

    // Match allure.description('TEST-ID-XXX: ...') patterns
    const descRegex = /allure\.description\(\s*['"`]([A-Z][\w-]+-\d+)[:\s]/g;
    let match: RegExpExecArray | null;
    while ((match = descRegex.exec(content)) !== null) {
      foundIds.set(match[1], relPath);
    }
  }

  const db = getDb();

  // Check for IDs in spec files that aren't in the DB yet
  for (const [id, specPath] of foundIds) {
    if (!scenarioExists(id)) {
      result.newIds.push(id);
    } else {
      // Update spec_file if changed
      const existing = getScenario(id);
      if (existing && existing.spec_file !== specPath) {
        updateScenario(id, { spec_file: specPath });
        result.updatedSpecFiles.push(id);
      }
    }
  }

  // Check for DB entries whose spec_file no longer exists or no longer contains the ID
  const allDbScenarios = listScenarios();
  for (const scenario of allDbScenarios) {
    if (scenario.spec_file && scenario.status === 'automated') {
      const absSpecPath = path.join(root, scenario.spec_file);
      if (!fs.existsSync(absSpecPath)) {
        result.orphanedIds.push(scenario.id);
      } else {
        const content = fs.readFileSync(absSpecPath, 'utf-8');
        if (!content.includes(scenario.id)) {
          result.orphanedIds.push(scenario.id);
        }
      }
    }
  }

  return result;
}

function findSpecFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findSpecFiles(fullPath));
    } else if (entry.name.endsWith('.spec.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Statistics / report ───────────────────────────────────────────────────────

export interface TrackerStats {
  total: number;
  byStatus: Record<ScenarioStatus, number>;
  byPriority: Record<Priority, number>;
  byFeatureArea: Record<string, number>;
  byGroup: Record<string, number>;
}

export function getStats(): TrackerStats {
  const db = getDb();

  const total = (db.prepare('SELECT COUNT(*) as c FROM scenarios').get() as { c: number }).c;

  const byStatus = {} as Record<ScenarioStatus, number>;
  for (const s of SCENARIO_STATUSES) {
    byStatus[s] = (db.prepare('SELECT COUNT(*) as c FROM scenarios WHERE status = ?').get(s) as { c: number }).c;
  }

  const byPriority = {} as Record<Priority, number>;
  for (const p of PRIORITIES) {
    byPriority[p] = (db.prepare('SELECT COUNT(*) as c FROM scenarios WHERE priority = ?').get(p) as { c: number }).c;
  }

  const areaRows = db.prepare('SELECT feature_area, COUNT(*) as c FROM scenarios GROUP BY feature_area ORDER BY c DESC').all() as { feature_area: string; c: number }[];
  const byFeatureArea: Record<string, number> = {};
  for (const r of areaRows) byFeatureArea[r.feature_area] = r.c;

  const groupRows = db.prepare(`
    SELECT sg.group_name, COUNT(*) as c
    FROM scenario_groups sg
    GROUP BY sg.group_name
    ORDER BY c DESC
  `).all() as { group_name: string; c: number }[];
  const byGroup: Record<string, number> = {};
  for (const r of groupRows) byGroup[r.group_name] = r.c;

  return { total, byStatus, byPriority, byFeatureArea, byGroup };
}

// ── Export / Import (JSON) ────────────────────────────────────────────────────

export function exportToJson(): TrackerExport {
  const scenarios = listScenarios();
  return {
    version: 1,
    exported_at: new Date().toISOString(),
    scenarios,
  };
}

export function importFromJson(data: TrackerExport): { imported: number; skipped: number } {
  let imported = 0;
  let skipped = 0;

  const importTransaction = getDb().transaction(() => {
    for (const scenario of data.scenarios) {
      if (scenarioExists(scenario.id)) {
        skipped++;
        continue;
      }
      addScenario({
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        status: scenario.status,
        priority: scenario.priority,
        feature_area: scenario.feature_area,
        spec_file: scenario.spec_file,
        workflow: scenario.workflow,
        groups: scenario.groups,
      });
      imported++;
    }
  });

  importTransaction();
  return { imported, skipped };
}

// ── Bulk upsert (used by seed script) ─────────────────────────────────────────

export function upsertScenario(input: AddScenarioInput): { action: 'created' | 'updated' } {
  if (scenarioExists(input.id)) {
    updateScenario(input.id, {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      feature_area: input.feature_area,
      spec_file: input.spec_file,
      workflow: input.workflow,
      groups: input.groups,
    });
    return { action: 'updated' };
  } else {
    addScenario(input);
    return { action: 'created' };
  }
}

// ── On-hold IDs (fast lookup for Playwright integration) ──────────────────────

export function getOnHoldIds(): Set<string> {
  const db = getDb();
  const rows = db.prepare("SELECT id FROM scenarios WHERE status = 'on-hold'").all() as { id: string }[];
  return new Set(rows.map((r) => r.id));
}

// ── Scenario details (steps & expected results) ──────────────────────────────

export interface ScenarioDetails {
  scenario_id: string;
  steps: string[];
  expected_results: string[];
  execution_notes: string;
}

export function getScenarioDetails(id: string): ScenarioDetails | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM scenario_details WHERE scenario_id = ?').get(id) as {
    scenario_id: string; steps: string; expected_results: string; execution_notes: string;
  } | undefined;
  if (!row) return null;
  return {
    scenario_id: row.scenario_id,
    steps: JSON.parse(row.steps),
    expected_results: JSON.parse(row.expected_results),
    execution_notes: row.execution_notes,
  };
}

export function upsertScenarioDetails(id: string, steps: string[], expectedResults: string[], executionNotes?: string): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO scenario_details (scenario_id, steps, expected_results, execution_notes)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(scenario_id) DO UPDATE SET
      steps = excluded.steps,
      expected_results = excluded.expected_results,
      execution_notes = excluded.execution_notes
  `).run(id, JSON.stringify(steps), JSON.stringify(expectedResults), executionNotes ?? '');
}

export function getAllScenarioDetails(): Map<string, ScenarioDetails> {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM scenario_details').all() as {
    scenario_id: string; steps: string; expected_results: string; execution_notes: string;
  }[];
  const map = new Map<string, ScenarioDetails>();
  for (const row of rows) {
    map.set(row.scenario_id, {
      scenario_id: row.scenario_id,
      steps: JSON.parse(row.steps),
      expected_results: JSON.parse(row.expected_results),
      execution_notes: row.execution_notes,
    });
  }
  return map;
}

// ── Workflows list ────────────────────────────────────────────────────────────

export function getDistinctWorkflows(): string[] {
  const db = getDb();
  const rows = db.prepare("SELECT DISTINCT workflow FROM scenarios WHERE workflow != '' ORDER BY workflow").all() as { workflow: string }[];
  return rows.map(r => r.workflow);
}
