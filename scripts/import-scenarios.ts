#!/usr/bin/env npx tsx
/**
 * Import test scenarios by feature area from an xlsx file into the tracker DB.
 *
 * Matches the column layout produced by export-scenarios.ts.
 *
 * Behavior:
 *   • Updates existing scenarios — only writes when data actually changed.
 *   • Content changes (title, description, steps, expected results) →
 *     sets automation_state = 'updated' and execution_status = 'not-executed'.
 *   • New rows in Excel → inserted with automation_state = 'pending',
 *     execution_status = 'not-executed'.
 *   • DB scenarios missing from Excel (within the same feature_area) →
 *     flagged 'on-hold' with a note.
 *   • Validates all enum fields; prints a per-row error log for anything invalid.
 *   • Runs a dry-run first unless --write is passed.
 *
 * Usage:
 *   npx tsx scripts/import-scenarios.ts --area auth                           # dry-run
 *   npx tsx scripts/import-scenarios.ts --area auth --write                   # commit to DB
 *   npx tsx scripts/import-scenarios.ts --area auth --file /path/to/file.xlsx --write
 *   npx tsx scripts/import-scenarios.ts --area doc --no-remove                # skip on-hold flagging
 */

import path from 'path';
import * as XLSX from 'xlsx';
import chalk from 'chalk';

import { getDb, closeDb } from '../src/tracker/db';
import {
  getScenario,
  scenarioExists,
  updateScenario,
  addScenario,
  setScenarioDetails,
  getScenarioDetails,
  listScenarios,
  isValidPriority,
  isValidFeatureArea,
} from '../src/tracker/crud';
import type { Priority, FeatureArea, ListFilters } from '../src/tracker/models';

// ── CLI flags ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const DRY_RUN   = !args.includes('--write');
const NO_REMOVE = args.includes('--no-remove');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const AREA = getArg('--area');
const WORKFLOW = getArg('--workflow');

if (!AREA && !WORKFLOW) {
  console.error('Usage: npx tsx scripts/import-scenarios.ts --area <feature_area> [--workflow <name>] [--file <path>] [--write] [--no-remove]');
  console.error('       npx tsx scripts/import-scenarios.ts --workflow <name> --file <path> [--write] [--no-remove]');
  console.error('Areas: auth, landing, products, releases, doc, reports, backoffice, integrations, other');
  process.exit(1);
}
if (AREA && !isValidFeatureArea(AREA)) {
  console.error(chalk.red(`Invalid feature area: "${AREA}"`));
  console.error('Valid areas: auth, landing, products, releases, doc, reports, backoffice, integrations, other');
  process.exit(1);
}

const fileLabel = WORKFLOW ? WORKFLOW.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') : AREA!;
const DEFAULT_FILE = path.join(PROJECT_ROOT, 'docs', 'ai', 'test-cases', 'input', `${fileLabel}-scenarios-for-import.xlsx`);
const INPUT_FILE   = getArg('--file') ?? DEFAULT_FILE;

// Sheet name convention: "<Label> Scenarios" (matches export-scenarios.ts)
const SHEET_NAME = `${fileLabel.charAt(0).toUpperCase() + fileLabel.slice(1)} Scenarios`;

// ── Column index map (matches export-scenarios.ts HEADERS order) ───────────────

const COL = {
  ID:               0,
  PRIORITY:         1,
  AUTOMATION_STATE: 2,
  EXECUTION_STATUS: 3,
  FEATURE_AREA:     4,
  WORKFLOW:         5,
  SUBSECTION:       6,
  GROUPS:           7,
  TITLE:            8,
  DESCRIPTION:      9,
  STEPS:            10,
  EXPECTED_RESULTS: 11,
  EXECUTION_NOTES:  12,
  SPEC_FILE:        13,
  MERGED_INTO:      14,
  // CREATED_AT: 15 — read-only, ignored on import
  // UPDATED_AT: 16 — read-only, ignored on import
} as const;

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Parse numbered-list step text back to a string array. */
function parseStepList(raw: string): string[] {
  if (!raw) return [];
  return raw.split(/\r?\n/).map((l) => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
}

function parseGroups(raw: string): string[] {
  if (!raw) return [];
  return raw.split(',').map((g) => g.trim().toLowerCase()).filter(Boolean);
}

/** Compare two string arrays for equality. */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/** Check if content fields changed (triggers automation_state → 'updated'). */
function hasContentChanged(
  existing: { title: string; description: string; steps: string[]; expected_results: string[] },
  incoming: { title: string; description: string; steps: string[]; expectedResults: string[] },
): boolean {
  if (existing.title !== incoming.title) return true;
  if (existing.description !== incoming.description) return true;
  if (!arraysEqual(existing.steps, incoming.steps)) return true;
  if (!arraysEqual(existing.expected_results, incoming.expectedResults)) return true;
  return false;
}

/** Check if any metadata field changed (non-content, non-triggering). */
function hasMetadataChanged(
  existing: { priority: string; feature_area: string; workflow: string; subsection: string; spec_file: string; execution_notes: string; groups: string[] },
  incoming: { priority: string; feature_area: string; workflow: string; subsection: string; spec_file: string; execution_notes: string; groups: string[] },
): boolean {
  if (existing.priority !== incoming.priority) return true;
  if (existing.feature_area !== incoming.feature_area) return true;
  if (existing.workflow !== incoming.workflow) return true;
  if (existing.subsection !== incoming.subsection) return true;
  if (existing.spec_file !== incoming.spec_file) return true;
  if (existing.execution_notes !== incoming.execution_notes) return true;
  if (!arraysEqual([...existing.groups].sort(), [...incoming.groups].sort())) return true;
  return false;
}

// ── Load workbook ──────────────────────────────────────────────────────────────

console.log(chalk.cyan(`Reading: ${INPUT_FILE}`));
const wb = XLSX.readFile(INPUT_FILE, { cellText: false, cellDates: false });

// Try exact sheet name, fall back to first non-Summary sheet
let ws = wb.Sheets[SHEET_NAME];
let actualSheet = SHEET_NAME;
if (!ws) {
  const candidate = wb.SheetNames.find((n) => n.toLowerCase() !== 'summary');
  if (candidate) {
    ws = wb.Sheets[candidate];
    actualSheet = candidate;
    console.log(chalk.yellow(`Sheet "${SHEET_NAME}" not found — using "${candidate}"`));
  } else {
    console.error(chalk.red(`No usable sheet found. Available: ${wb.SheetNames.join(', ')}`));
    process.exit(1);
  }
}

const aoa = XLSX.utils.sheet_to_json<XLSX.CellObject[]>(ws, {
  header: 1,
  raw: true,
  defval: null,
}) as unknown[][];

const dataRows = aoa.slice(1).filter((r) => r && r[COL.ID]);

console.log(`Found ${dataRows.length} data rows in sheet "${actualSheet}"\n`);

// ── Process rows ───────────────────────────────────────────────────────────────

getDb();

let contentUpdated = 0;
let metadataUpdated = 0;
let unchanged = 0;
let inserted = 0;
let flaggedRemoved = 0;
let skipped = 0;
const errors: string[] = [];
const excelIds = new Set<string>();

for (let i = 0; i < dataRows.length; i++) {
  const row = dataRows[i] as (string | number | null)[];
  const lineNo = i + 2;

  const id               = String(row[COL.ID] ?? '').trim();
  const priority         = String(row[COL.PRIORITY] ?? '').trim();
  const feature_area     = String(row[COL.FEATURE_AREA] ?? '').trim();
  const workflow         = String(row[COL.WORKFLOW] ?? '').trim();
  const subsection       = String(row[COL.SUBSECTION] ?? '').trim();
  const groupsRaw        = String(row[COL.GROUPS] ?? '').trim();
  const title            = String(row[COL.TITLE] ?? '').trim();
  const description      = String(row[COL.DESCRIPTION] ?? '').trim();
  const stepsRaw         = String(row[COL.STEPS] ?? '').trim();
  const expectedRaw      = String(row[COL.EXPECTED_RESULTS] ?? '').trim();
  const execution_notes  = String(row[COL.EXECUTION_NOTES] ?? '').trim();
  const spec_file        = String(row[COL.SPEC_FILE] ?? '').trim();

  // ── Validation ─────────────────────────────────────────────────────────────
  const rowErrors: string[] = [];
  if (!id)                               rowErrors.push('ID is empty');
  if (!title)                            rowErrors.push('Title is empty');
  if (!isValidPriority(priority))        rowErrors.push(`Invalid priority: "${priority}"`);
  if (!isValidFeatureArea(feature_area)) rowErrors.push(`Invalid feature_area: "${feature_area}"`);

  if (rowErrors.length) {
    errors.push(`Row ${lineNo} [${id || '?'}]: ${rowErrors.join('; ')}`);
    skipped++;
    continue;
  }

  excelIds.add(id);

  const groups = parseGroups(groupsRaw);
  const steps  = parseStepList(stepsRaw);
  const expectedResults = parseStepList(expectedRaw);
  const exists = scenarioExists(id);

  // ── New scenario — insert with pending/not-executed ─────────────────────────
  if (!exists) {
    if (DRY_RUN) {
      console.log(chalk.blue(`  [DRY-RUN] INSERT: ${id} — ${title.slice(0, 60)}`));
    } else {
      addScenario({
        id,
        title,
        description,
        automation_state: 'pending',
        execution_status: 'not-executed',
        priority: priority as Priority,
        feature_area: feature_area as FeatureArea,
        spec_file,
        workflow,
        subsection,
        groups,
        steps,
        expected_results: expectedResults,
        execution_notes,
      });
      console.log(chalk.blue(`  INSERTED: ${id} (pending / not-executed)`));
    }
    inserted++;
    continue;
  }

  // ── Existing scenario — diff before writing ────────────────────────────────
  const existing = getScenario(id)!;
  const existingDetails = getScenarioDetails(id);

  const contentChanged = hasContentChanged(
    {
      title: existing.title,
      description: existing.description,
      steps: existingDetails?.steps ?? [],
      expected_results: existingDetails?.expected_results ?? [],
    },
    { title, description, steps, expectedResults },
  );

  const metaChanged = hasMetadataChanged(
    {
      priority: existing.priority,
      feature_area: existing.feature_area,
      workflow: existing.workflow,
      subsection: existing.subsection ?? '',
      spec_file: existing.spec_file,
      execution_notes: existingDetails?.execution_notes ?? '',
      groups: existing.groups,
    },
    { priority, feature_area, workflow, subsection, spec_file, execution_notes, groups },
  );

  if (!contentChanged && !metaChanged) {
    unchanged++;
    continue;
  }

  if (DRY_RUN) {
    const changeType = contentChanged ? 'CONTENT UPDATE' : 'METADATA UPDATE';
    const marker = contentChanged ? chalk.magenta : chalk.yellow;
    console.log(marker(`  [DRY-RUN] ${changeType}: ${id} — ${title.slice(0, 55)}`));
    contentChanged ? contentUpdated++ : metadataUpdated++;
    continue;
  }

  // ── Write changes ──────────────────────────────────────────────────────────

  if (contentChanged) {
    // Content changed → mark as 'updated', reset execution to 'not-executed'
    updateScenario(id, {
      title,
      description,
      automation_state: 'updated',
      execution_status: 'not-executed',
      priority: priority as Priority,
      feature_area: feature_area as FeatureArea,
      spec_file,
      workflow,
      subsection,
      groups,
    });
    setScenarioDetails(id, { steps, expected_results: expectedResults, execution_notes });
    console.log(chalk.magenta(`  CONTENT UPDATED → 'updated': ${id}`));
    contentUpdated++;
  } else {
    // Metadata-only change — preserve current automation_state & execution_status
    updateScenario(id, {
      priority: priority as Priority,
      feature_area: feature_area as FeatureArea,
      spec_file,
      workflow,
      subsection,
      groups,
    });
    if (execution_notes !== (existingDetails?.execution_notes ?? '')) {
      setScenarioDetails(id, {
        steps: existingDetails?.steps ?? [],
        expected_results: existingDetails?.expected_results ?? [],
        execution_notes,
      });
    }
    console.log(chalk.yellow(`  METADATA UPDATED: ${id}`));
    metadataUpdated++;
  }
}

// ── Detect removed scenarios ─────────────────────────────────────────────────

if (!NO_REMOVE) {
  const filterOpts: ListFilters = WORKFLOW
    ? { workflow: WORKFLOW }
    : { feature_area: AREA as FeatureArea };
  const allAreaScenarios = listScenarios(filterOpts);
  const removedScenarios = allAreaScenarios.filter(
    (s) => !excelIds.has(s.id) && s.automation_state !== 'on-hold',
  );

  if (removedScenarios.length > 0) {
    console.log(chalk.red(`\n── Scenarios in DB but missing from Excel (${removedScenarios.length}) ──`));
    const today = new Date().toISOString().slice(0, 10);

    for (const s of removedScenarios) {
      if (DRY_RUN) {
        console.log(chalk.red(`  [DRY-RUN] FLAG ON-HOLD: ${s.id} — ${s.title.slice(0, 55)}`));
      } else {
        updateScenario(s.id, { automation_state: 'on-hold' });
        const existingDetails = getScenarioDetails(s.id);
        setScenarioDetails(s.id, {
          steps: existingDetails?.steps ?? [],
          expected_results: existingDetails?.expected_results ?? [],
          execution_notes: `Removed from ${fileLabel} import on ${today}. Previous state: ${s.automation_state}`,
        });
        console.log(chalk.red(`  FLAGGED ON-HOLD: ${s.id}`));
      }
      flaggedRemoved++;
    }
  }
}

closeDb();

// ── Summary ────────────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(60));
if (DRY_RUN) {
  console.log(chalk.yellow.bold('DRY-RUN mode — no changes written to DB.'));
  console.log(chalk.yellow('Re-run with --write to apply changes.'));
  console.log();
}
console.log(`Content updated  (→ 'updated'):  ${chalk.magenta(String(contentUpdated))}`);
console.log(`Metadata updated (state kept):   ${chalk.yellow(String(metadataUpdated))}`);
console.log(`Unchanged (no-op):               ${chalk.gray(String(unchanged))}`);
console.log(`Inserted   (→ 'pending'):        ${chalk.blue(String(inserted))}`);
console.log(`Flagged removed (→ 'on-hold'):   ${chalk.red(String(flaggedRemoved))}`);
console.log(`Skipped (validation errors):     ${chalk.gray(String(skipped))}`);

if (errors.length) {
  console.log('\n' + chalk.red.bold(`Validation errors (${errors.length}):`));
  for (const e of errors) console.log(chalk.red(`  ✗ ${e}`));
  process.exitCode = 1;
} else {
  console.log(chalk.green('\n✓ No validation errors.'));
}
