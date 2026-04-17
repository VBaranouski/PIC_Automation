/**
 * Test Scenario Tracker — Import / Export
 *
 * JSON export/import and spec-based scenario import.
 */

import path from 'path';
import fs from 'fs';

import { getDb, getProjectRoot } from './db';
import type { Scenario, TrackerExport } from './models';
import { normalizeSpecFilePath } from './helpers';
import {
  findSpecFiles,
  parseImportableScenariosFromSpec,
} from './spec-parser';
import {
  addScenario,
  listScenarios,
  scenarioExists,
} from './crud';
import { normalizeScenarioSpecMappings } from './sync';

// ── Export ─────────────────────────────────────────────────────────────────────

export function exportToJson(): TrackerExport {
  const scenarios = normalizeScenarioSpecMappings(listScenarios(), false).scenarios;
  return {
    version: 1,
    exported_at: new Date().toISOString(),
    scenarios,
  };
}

// ── Import from spec files ────────────────────────────────────────────────────

export function importMissingScenariosFromSpecs(onlyIds?: string[]): { importedIds: string[]; skippedIds: string[] } {
  const root = getProjectRoot();
  const testsDir = path.join(root, 'tests');
  if (!fs.existsSync(testsDir)) return { importedIds: [], skippedIds: [] };

  const requestedIds = new Set((onlyIds ?? []).map((id) => id.toUpperCase()));
  const existingScenarios = listScenarios();
  const existingBySpec = new Map<string, Scenario[]>();
  for (const scenario of existingScenarios) {
    const normalizedSpecFile = normalizeSpecFilePath(scenario.spec_file);
    if (!normalizedSpecFile) continue;
    const items = existingBySpec.get(normalizedSpecFile) ?? [];
    items.push({ ...scenario, spec_file: normalizedSpecFile });
    existingBySpec.set(normalizedSpecFile, items);
  }

  const importedIds: string[] = [];
  const skippedIds: string[] = [];

  for (const absPath of findSpecFiles(testsDir)) {
    const specFile = normalizeSpecFilePath(path.relative(root, absPath));
    for (const candidate of parseImportableScenariosFromSpec(specFile, existingBySpec)) {
      if (requestedIds.size && !requestedIds.has(candidate.id)) continue;
      if (scenarioExists(candidate.id)) {
        skippedIds.push(candidate.id);
        continue;
      }
      addScenario({
        id: candidate.id,
        title: candidate.title,
        description: candidate.description,
        automation_state: candidate.automation_state,
        execution_status: 'not-executed',
        priority: candidate.priority,
        feature_area: candidate.feature_area,
        spec_file: candidate.spec_file,
        workflow: candidate.workflow,
        subsection: candidate.subsection,
        groups: candidate.groups,
      });
      importedIds.push(candidate.id);
    }
  }

  return { importedIds, skippedIds };
}

// ── Import from JSON ──────────────────────────────────────────────────────────

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
        automation_state: scenario.automation_state,
        execution_status: scenario.execution_status,
        priority: scenario.priority,
        feature_area: scenario.feature_area,
        spec_file: scenario.spec_file,
        workflow: scenario.workflow,
        subsection: scenario.subsection,
        groups: scenario.groups,
        steps: scenario.steps,
        expected_results: scenario.expected_results,
        execution_notes: scenario.execution_notes,
      });
      imported++;
    }
  });

  importTransaction();
  return { imported, skipped };
}
