/**
 * Test Scenario Tracker — Statistics
 *
 * Aggregated statistics and reporting queries.
 */

import { getDb } from './db';
import type { AutomationState, ExecutionStatus, Priority } from './models';
import { AUTOMATION_STATES, EXECUTION_STATUSES, PRIORITIES } from './models';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface TrackerStats {
  total: number;
  byAutomationState: Record<AutomationState, number>;
  byExecutionStatus: Record<ExecutionStatus, number>;
  byPriority: Record<Priority, number>;
  byFeatureArea: Record<string, number>;
  byGroup: Record<string, number>;
}

// ── Statistics / report ───────────────────────────────────────────────────────

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
