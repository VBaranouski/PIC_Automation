/**
 * Test Scenario Tracker — Sync operations
 *
 * Reconciliation between the tracker DB and spec files on disk:
 * spec-file mapping normalization, orphan detection, and detail syncing.
 */

import path from 'path';
import fs from 'fs';

import { getProjectRoot } from './db';
import type { Scenario } from './models';
import { normalizeSpecFilePath } from './helpers';
import {
  extractScenarioIdsFromSpecContent,
  findSpecFiles,
  loadScenarioDetailOverrides,
  parseScenarioDetailsFromSpec,
  isGenericExecutionNote,
} from './spec-parser';
import {
  listScenarios,
  scenarioExists,
  updateScenario,
  getScenarioDetails,
  setScenarioDetails,
  setAutomationState,
  setExecutionStatus,
} from './crud';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface SpecMappingIndex {
  existingSpecFiles: Set<string>;
  scenarioIdToSpecFile: Map<string, string>;
  subsectionToSpecFile: Map<string, string>;
}

export interface SyncResult {
  newIds: string[];
  orphanedIds: string[];
  updatedSpecFiles: string[];
}

export interface SyncScenarioDetailsResult {
  updatedDetailIds: string[];
  demotedIds: string[];
  coveredIds: string[];
}

// ── Spec mapping index ────────────────────────────────────────────────────────

export function buildSpecMappingIndex(scenarios: Scenario[]): SpecMappingIndex {
  const root = getProjectRoot();
  const testsDir = path.join(root, 'tests');
  const existingSpecFiles = new Set<string>();
  const scenarioIdToSpecFile = new Map<string, string>();

  for (const absPath of findSpecFiles(testsDir)) {
    const relPath = normalizeSpecFilePath(path.relative(root, absPath));
    existingSpecFiles.add(relPath);
    const content = fs.readFileSync(absPath, 'utf-8');
    for (const scenarioId of extractScenarioIdsFromSpecContent(content)) {
      scenarioIdToSpecFile.set(scenarioId, relPath);
    }
  }

  const subsectionCandidates = new Map<string, Set<string>>();
  for (const scenario of scenarios) {
    const exactSpecFile = scenarioIdToSpecFile.get(scenario.id);
    const currentSpecFile = normalizeSpecFilePath(scenario.spec_file);
    const resolvedCurrentSpecFile = existingSpecFiles.has(currentSpecFile) ? currentSpecFile : '';
    const candidateSpecFile = exactSpecFile || resolvedCurrentSpecFile;
    if (!candidateSpecFile || !scenario.workflow || !scenario.subsection) continue;
    const subsectionKey = `${scenario.workflow}::${scenario.subsection}`;
    const candidates = subsectionCandidates.get(subsectionKey) ?? new Set<string>();
    candidates.add(candidateSpecFile);
    subsectionCandidates.set(subsectionKey, candidates);
  }

  const subsectionToSpecFile = new Map<string, string>();
  for (const [subsectionKey, specFiles] of subsectionCandidates.entries()) {
    if (specFiles.size === 1) {
      subsectionToSpecFile.set(subsectionKey, [...specFiles][0]);
    }
  }

  return { existingSpecFiles, scenarioIdToSpecFile, subsectionToSpecFile };
}

export function resolveScenarioSpecFile(scenario: Scenario, index: SpecMappingIndex): string {
  const exactSpecFile = index.scenarioIdToSpecFile.get(scenario.id);
  if (exactSpecFile) return exactSpecFile;

  const currentSpecFile = normalizeSpecFilePath(scenario.spec_file);
  if (currentSpecFile && index.existingSpecFiles.has(currentSpecFile)) {
    return currentSpecFile;
  }

  if (scenario.workflow && scenario.subsection) {
    const subsectionSpecFile = index.subsectionToSpecFile.get(`${scenario.workflow}::${scenario.subsection}`);
    if (subsectionSpecFile) return subsectionSpecFile;
  }

  return '';
}

export function normalizeScenarioSpecMappings(scenarios: Scenario[], persist = false): { scenarios: Scenario[]; updatedIds: string[] } {
  const index = buildSpecMappingIndex(scenarios);
  const updatedIds: string[] = [];
  const normalizedScenarios = scenarios.map((scenario) => {
    const resolvedSpecFile = resolveScenarioSpecFile(scenario, index);
    if (resolvedSpecFile === normalizeSpecFilePath(scenario.spec_file)) {
      return scenario;
    }

    if (persist) {
      updateScenario(scenario.id, { spec_file: resolvedSpecFile });
    }
    updatedIds.push(scenario.id);
    return { ...scenario, spec_file: resolvedSpecFile };
  });

  return { scenarios: normalizedScenarios, updatedIds };
}

// ── Sync: scan spec files & reconcile ─────────────────────────────────────────

export function syncWithSpecFiles(options?: { dryRun?: boolean }): SyncResult {
  const dryRun = options?.dryRun ?? false;
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

  // Check for IDs in spec files that aren't in the DB yet
  for (const [id] of foundIds) {
    if (!scenarioExists(id)) {
      result.newIds.push(id);
    }
  }

  const normalized = normalizeScenarioSpecMappings(listScenarios(), !dryRun);
  result.updatedSpecFiles.push(...normalized.updatedIds);

  // Check for DB entries whose spec_file no longer exists or no longer contains the ID
  for (const scenario of normalized.scenarios) {
    if (scenario.spec_file && scenario.automation_state === 'automated') {
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

// ── Sync scenario details from spec AST ───────────────────────────────────────

export function syncScenarioDetailsFromSpecs(): SyncScenarioDetailsResult {
  const scenarios = listScenarios();
  const overrides = loadScenarioDetailOverrides();
  const updatedDetailIds: string[] = [];
  const demotedIds: string[] = [];
  const coveredIds: string[] = [];

  for (const scenario of scenarios) {
    const normalizedSpecFile = normalizeSpecFilePath(scenario.spec_file);
    const parsedDetail = normalizedSpecFile ? parseScenarioDetailsFromSpec(normalizedSpecFile).get(scenario.id) : undefined;
    const override = overrides.get(scenario.id);
    const existingDetail = getScenarioDetails(scenario.id);

    if (parsedDetail) {
      coveredIds.push(scenario.id);

      const parsedSteps = parsedDetail.steps.length
        ? parsedDetail.steps
        : (parsedDetail.title ? [parsedDetail.title] : []);

      const nextSteps = existingDetail?.steps.length
        ? existingDetail.steps
        : (override?.steps?.length ? override.steps : parsedSteps);
      const nextExpectedResults = existingDetail?.expected_results.length
        ? existingDetail.expected_results
        : (override?.expected_results ?? []);
      const existingNotes = String(existingDetail?.execution_notes || '').trim();
      const overrideNotes = String(override?.execution_notes || '').trim();
      const nextExecutionNotes = (!existingNotes || isGenericExecutionNote(existingNotes))
        ? overrideNotes
        : existingNotes;

      const stepsChanged = JSON.stringify(existingDetail?.steps ?? []) !== JSON.stringify(nextSteps ?? []);
      const expectedChanged = JSON.stringify(existingDetail?.expected_results ?? []) !== JSON.stringify(nextExpectedResults ?? []);
      const notesChanged = String(existingDetail?.execution_notes ?? '') !== nextExecutionNotes;

      if (stepsChanged || expectedChanged || notesChanged || !existingDetail) {
        setScenarioDetails(scenario.id, {
          steps: nextSteps ?? [],
          expected_results: nextExpectedResults ?? [],
          execution_notes: nextExecutionNotes,
        });
        updatedDetailIds.push(scenario.id);
      }

      if (parsedDetail.isFixme) {
        if (scenario.automation_state !== 'pending') {
          setAutomationState(scenario.id, 'pending');
          demotedIds.push(scenario.id);
        }
        setExecutionStatus(scenario.id, 'not-executed');
      }

      continue;
    }

    if (scenario.automation_state === 'automated') {
      setAutomationState(scenario.id, 'pending');
      setExecutionStatus(scenario.id, 'not-executed');
      demotedIds.push(scenario.id);
    }
  }

  return { updatedDetailIds, demotedIds, coveredIds };
}
