/**
 * Test Scenario Tracker — Type Definitions
 *
 * Central type system for the SQLite-backed test scenario tracker.
 * All CLI commands, DB operations, and Playwright integration share these types.
 */

// ── Status lifecycle ──────────────────────────────────────────────────────────
export const SCENARIO_STATUSES = [
  'pending',      // Not yet automated — needs implementation
  'automated',    // Automated test exists and passes
  'passed',       // Automated test was executed successfully
  'failed',       // Automated test exists but is currently failing
  'skipped',      // Intentionally skipped (e.g. out of scope)
  'on-hold',      // Paused — will be auto-skipped during test runs
] as const;

export type ScenarioStatus = (typeof SCENARIO_STATUSES)[number];

// ── Priority levels ───────────────────────────────────────────────────────────
export const PRIORITIES = ['P1', 'P2', 'P3'] as const;
export type Priority = (typeof PRIORITIES)[number];

// ── Feature areas (maps to test directories) ──────────────────────────────────
export const FEATURE_AREAS = [
  'auth',
  'landing',
  'products',
  'releases',
  'doc',
  'reports',
  'backoffice',
  'integrations',
  'other',
] as const;

export type FeatureArea = (typeof FEATURE_AREAS)[number];

// ── Group / tag labels ────────────────────────────────────────────────────────
export const DEFAULT_GROUPS = [
  'smoke',
  'critical',
  'regression',
  'integration',
  'edge-case',
  'destructive',
  'manual-only',
] as const;

export type GroupLabel = (typeof DEFAULT_GROUPS)[number] | string;

// ── Core scenario record ──────────────────────────────────────────────────────
export interface Scenario {
  /** Unique test case ID, e.g. AUTH-LOGIN-001 */
  id: string;
  /** Human-readable title */
  title: string;
  /** Optional longer description or notes */
  description: string;
  /** Current automation status */
  status: ScenarioStatus;
  /** Business priority */
  priority: Priority;
  /** Feature area / workflow */
  feature_area: FeatureArea;
  /** Relative path to the .spec.ts file (if one exists) */
  spec_file: string;
  /** Workflow section from the testing plan, e.g. "WORKFLOW 1 — Authentication" */
  workflow: string;
  /** Subsection within the workflow, e.g. "2.1 Tab Structure" */
  subsection: string;
  /** Groups / tags assigned to this scenario */
  groups: string[];
  /** ISO-8601 creation timestamp */
  created_at: string;
  /** ISO-8601 last-update timestamp */
  updated_at: string;
}

// ── Database row (flat, no array fields) ──────────────────────────────────────
export interface ScenarioRow {
  id: string;
  title: string;
  description: string;
  status: ScenarioStatus;
  priority: Priority;
  feature_area: FeatureArea;
  spec_file: string;
  workflow: string;
  subsection: string;
  created_at: string;
  updated_at: string;
}

// ── Filtering / query options ─────────────────────────────────────────────────
export interface ListFilters {
  status?: ScenarioStatus;
  priority?: Priority;
  feature_area?: FeatureArea;
  group?: string;
  workflow?: string;
  search?: string;
  spec_file?: string;
}

// ── Import / export format ────────────────────────────────────────────────────
export interface TrackerExport {
  version: number;
  exported_at: string;
  scenarios: Scenario[];
}
