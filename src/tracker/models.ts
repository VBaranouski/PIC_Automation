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
