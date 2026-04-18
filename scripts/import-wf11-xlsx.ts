#!/usr/bin/env npx tsx
/**
 * Import WF11 DOC test scenarios from the exported xlsx back into the tracker DB.
 *
 * • Updates existing scenarios (all editable fields).
 * • Optionally inserts new rows that don't exist yet (--add-new flag).
 * • Validates all enum fields; prints a per-row error log for anything invalid.
 * • Runs a dry-run first unless --write is passed.
 *
 * Usage:
 *   npx tsx scripts/import-wf11-xlsx.ts                          # dry-run
 *   npx tsx scripts/import-wf11-xlsx.ts --write                  # commit to DB
 *   npx tsx scripts/import-wf11-xlsx.ts --write --add-new        # update + insert missing
 *   npx tsx scripts/import-wf11-xlsx.ts --file /path/to/file.xlsx --write
 *
 * Only "WF11 DOC Scenarios" sheet is read; column order is fixed (same as the export).
 */

import path from 'path';
import * as XLSX from 'xlsx';
import chalk from 'chalk';

import { getDb, closeDb } from '../src/tracker/db';
import {
  scenarioExists,
  updateScenario,
  addScenario,
  setScenarioDetails,
  setGroups,
} from '../src/tracker/crud';
import {
  isValidAutomationState,
  isValidExecutionStatus,
  isValidPriority,
  isValidFeatureArea,
} from '../src/tracker/crud';
import type { AutomationState, ExecutionStatus, Priority, FeatureArea } from '../src/tracker/models';

// ── CLI flags ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--write');
const ADD_NEW  = args.includes('--add-new');

const fileArgIdx = args.indexOf('--file');
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_FILE = path.join(PROJECT_ROOT, 'docs', 'ai', 'wf11-doc-scenarios-export.xlsx');
const INPUT_FILE   = fileArgIdx !== -1 ? args[fileArgIdx + 1] : DEFAULT_FILE;

const SHEET_NAME = 'WF11 DOC Scenarios';

// ── Column index map (must match export-wf11-xlsx.ts HEADERS order) ────────────

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
  // CREATED_AT: 14 — read-only, ignored on import
  // UPDATED_AT: 15 — read-only, ignored on import
} as const;

// ── Helpers ────────────────────────────────────────────────────────────────────

function cell(row: XLSX.CellObject[], colIdx: number): string {
  const c = row[colIdx];
  if (!c) return '';
  if (c.t === 'n') return String(c.v ?? '');
  return String(c.v ?? '').trim();
}

/** Parse numbered-list step text back to a string array.
 *  Handles "1. foo\n2. bar" or plain text (stored as single-item array). */
function parseStepList(raw: string): string[] {
  if (!raw) return [];
  const lines = raw.split('\n').map((l) => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  return lines;
}

function parseGroups(raw: string): string[] {
  if (!raw) return [];
  return raw.split(',').map((g) => g.trim().toLowerCase()).filter(Boolean);
}

// ── Load workbook ──────────────────────────────────────────────────────────────

console.log(chalk.cyan(`Reading: ${INPUT_FILE}`));
const wb = XLSX.readFile(INPUT_FILE, { cellText: false, cellDates: false });
const ws = wb.Sheets[SHEET_NAME];
if (!ws) {
  console.error(chalk.red(`Sheet "${SHEET_NAME}" not found. Available: ${wb.SheetNames.join(', ')}`));
  process.exit(1);
}

// Parse as dense array-of-arrays (raw values)
const aoa = XLSX.utils.sheet_to_json<XLSX.CellObject[]>(ws, {
  header: 1,
  raw: true,
  defval: null,
}) as unknown[][];

// Skip header row
const dataRows = aoa.slice(1).filter((r) => r && r[COL.ID]);

console.log(`Found ${dataRows.length} data rows in sheet "${SHEET_NAME}"\n`);

// ── Process rows ───────────────────────────────────────────────────────────────

getDb();

let updated = 0;
let inserted = 0;
let skipped = 0;
const errors: string[] = [];

for (let i = 0; i < dataRows.length; i++) {
  const row = dataRows[i] as (string | number | null)[];
  const lineNo = i + 2; // 1-based + header row offset

  const id               = String(row[COL.ID] ?? '').trim();
  const priority         = String(row[COL.PRIORITY] ?? '').trim();
  const automation_state = String(row[COL.AUTOMATION_STATE] ?? '').trim();
  const execution_status = String(row[COL.EXECUTION_STATUS] ?? '').trim();
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
  if (!id)                              rowErrors.push('ID is empty');
  if (!title)                           rowErrors.push('Title is empty');
  if (!isValidPriority(priority))       rowErrors.push(`Invalid priority: "${priority}"`);
  if (!isValidAutomationState(automation_state)) rowErrors.push(`Invalid automation_state: "${automation_state}"`);
  if (!isValidExecutionStatus(execution_status)) rowErrors.push(`Invalid execution_status: "${execution_status}"`);
  if (!isValidFeatureArea(feature_area))         rowErrors.push(`Invalid feature_area: "${feature_area}"`);

  if (rowErrors.length) {
    errors.push(`Row ${lineNo} [${id || '?'}]: ${rowErrors.join('; ')}`);
    skipped++;
    continue;
  }

  const groups = parseGroups(groupsRaw);
  const steps  = parseStepList(stepsRaw);
  const expectedResults = parseStepList(expectedRaw);

  const exists = scenarioExists(id);

  if (!exists && !ADD_NEW) {
    // New scenario found but --add-new not passed
    console.log(chalk.gray(`  SKIP (new, not inserting): ${id}`));
    skipped++;
    continue;
  }

  if (DRY_RUN) {
    const action = exists ? 'UPDATE' : 'INSERT';
    console.log(chalk.yellow(`  [DRY-RUN] ${action}: ${id} — ${title.slice(0, 60)}`));
    exists ? updated++ : inserted++;
    continue;
  }

  // ── Write to DB ─────────────────────────────────────────────────────────────
  if (exists) {
    updateScenario(id, {
      title,
      description,
      automation_state: automation_state as AutomationState,
      execution_status: execution_status as ExecutionStatus,
      priority: priority as Priority,
      feature_area: feature_area as FeatureArea,
      spec_file,
      workflow,
      subsection,
      groups,
    });
    setScenarioDetails(id, {
      steps,
      expected_results: expectedResults,
      execution_notes,
    });
    console.log(chalk.green(`  UPDATED: ${id}`));
    updated++;
  } else {
    addScenario({
      id,
      title,
      description,
      automation_state: automation_state as AutomationState,
      execution_status: execution_status as ExecutionStatus,
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
    console.log(chalk.blue(`  INSERTED: ${id}`));
    inserted++;
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
console.log(`Would update:  ${chalk.green(String(updated))}`);
console.log(`Would insert:  ${chalk.blue(String(inserted))}${ADD_NEW ? '' : chalk.gray('  (use --add-new to enable insertions)')}`);
console.log(`Skipped:       ${chalk.gray(String(skipped))}`);

if (errors.length) {
  console.log('\n' + chalk.red.bold(`Validation errors (${errors.length}):`));
  for (const e of errors) console.log(chalk.red(`  ✗ ${e}`));
  process.exitCode = 1;
} else {
  console.log(chalk.green('\n✓ No validation errors.'));
}
