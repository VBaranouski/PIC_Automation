#!/usr/bin/env npx tsx
/**
 * Export test scenarios by feature area to xlsx.
 *
 * Usage:
 *   npx tsx scripts/export-scenarios.ts --area auth
 *   npx tsx scripts/export-scenarios.ts --area auth --out /custom/path.xlsx
 *   npx tsx scripts/export-scenarios.ts --area landing
 *
 * Output: docs/ai/test-cases/output/<area>-scenarios-export.xlsx
 */

import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';
import Database from 'better-sqlite3';
import { FEATURE_AREAS } from '../src/tracker/models';

// ── CLI ────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(PROJECT_ROOT, 'config', 'scenarios.db');

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const AREA = getArg('--area');
if (!AREA) {
  console.error('Usage: npx tsx scripts/export-scenarios.ts --area <feature_area>');
  console.error('Areas: auth, landing, products, releases, doc, reports, backoffice, integrations, other');
  process.exit(1);
}
if (!(FEATURE_AREAS as readonly string[]).includes(AREA)) {
  console.error(`Invalid feature area: "${AREA}"`);
  console.error(`Valid areas: ${FEATURE_AREAS.join(', ')}`);
  process.exit(1);
}

const DEFAULT_OUT = path.join(PROJECT_ROOT, 'docs', 'ai', 'test-cases', 'output', `${AREA}-scenarios-export.xlsx`);
const OUTPUT_PATH = getArg('--out') ?? DEFAULT_OUT;

// ── DB query ───────────────────────────────────────────────────────────────────

interface ScenarioRow {
  id: string;
  title: string;
  description: string;
  automation_state: string;
  execution_status: string;
  priority: string;
  feature_area: string;
  spec_file: string;
  workflow: string;
  subsection: string;
  groups: string | null;
  steps: string | null;
  expected_results: string | null;
  execution_notes: string | null;
  merged_into: string | null;
  created_at: string;
  updated_at: string;
}

const db = new Database(DB_PATH, { readonly: true });

const rows = db.prepare<[string], ScenarioRow>(`
  SELECT
    s.id,
    s.title,
    s.description,
    s.automation_state,
    s.execution_status,
    s.priority,
    s.feature_area,
    s.spec_file,
    s.workflow,
    s.subsection,
    GROUP_CONCAT(sg.group_name, ', ') AS groups,
    sd.steps,
    sd.expected_results,
    sd.execution_notes,
    sm.merged_into_id AS merged_into,
    s.created_at,
    s.updated_at
  FROM scenarios s
  LEFT JOIN scenario_groups sg ON sg.scenario_id = s.id
  LEFT JOIN scenario_details sd ON sd.scenario_id = s.id
  LEFT JOIN scenario_merges sm ON sm.merged_from_id = s.id
  WHERE s.feature_area = ?
  GROUP BY s.id
  ORDER BY
    CASE s.priority WHEN 'P1' THEN 1 WHEN 'P2' THEN 2 WHEN 'P3' THEN 3 ELSE 4 END,
    s.id
`).all(AREA);

db.close();

if (!rows.length) {
  console.error(`No scenarios found for feature_area = '${AREA}'`);
  process.exit(1);
}

console.log(`Found ${rows.length} "${AREA}" scenarios.`);

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseJsonArray(raw: string | null): string {
  if (!raw) return '';
  try {
    const arr = JSON.parse(raw) as unknown[];
    if (!Array.isArray(arr)) return raw;
    return arr.map((item, i) => `${i + 1}. ${String(item)}`).join('\n');
  } catch {
    return raw;
  }
}

// ── Build worksheet data ───────────────────────────────────────────────────────

const HEADERS = [
  'ID',
  'Priority',
  'Automation State',
  'Execution Status',
  'Feature Area',
  'Workflow',
  'Subsection',
  'Groups / Tags',
  'Title',
  'Description',
  'Test Steps',
  'Expected Results',
  'Execution Notes',
  'Spec File',
  'Merged Into',
  'Created At',
  'Updated At',
];

const SHEET_NAME = `${AREA.charAt(0).toUpperCase() + AREA.slice(1)} Scenarios`;

const dataRows = rows.map((r) => [
  r.id,
  r.priority,
  r.automation_state,
  r.execution_status,
  r.feature_area,
  r.workflow,
  r.subsection ?? '',
  r.groups ?? '',
  r.title,
  r.description ?? '',
  parseJsonArray(r.steps),
  parseJsonArray(r.expected_results),
  r.execution_notes ?? '',
  r.spec_file ?? '',
  r.merged_into ?? '',
  r.created_at,
  r.updated_at,
]);

const worksheetData = [HEADERS, ...dataRows];

// ── Workbook ───────────────────────────────────────────────────────────────────

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(worksheetData);

ws['!cols'] = [
  { wch: 22 },  // ID
  { wch: 8 },   // Priority
  { wch: 16 },  // Automation State
  { wch: 16 },  // Execution Status
  { wch: 12 },  // Feature Area
  { wch: 36 },  // Workflow
  { wch: 30 },  // Subsection
  { wch: 24 },  // Groups
  { wch: 60 },  // Title
  { wch: 60 },  // Description
  { wch: 70 },  // Test Steps
  { wch: 70 },  // Expected Results
  { wch: 40 },  // Execution Notes
  { wch: 50 },  // Spec File
  { wch: 22 },  // Merged Into
  { wch: 20 },  // Created At
  { wch: 20 },  // Updated At
];

const lastCol = XLSX.utils.encode_col(HEADERS.length - 1);
const lastRow = rows.length + 1;
ws['!autofilter'] = { ref: `A1:${lastCol}${lastRow}` };

XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);

// ── Summary sheet ──────────────────────────────────────────────────────────────

const byAutoState: Record<string, number> = {};
const byExecStatus: Record<string, number> = {};
const byPriority: Record<string, number> = {};

for (const r of rows) {
  byAutoState[r.automation_state] = (byAutoState[r.automation_state] ?? 0) + 1;
  byExecStatus[r.execution_status] = (byExecStatus[r.execution_status] ?? 0) + 1;
  byPriority[r.priority] = (byPriority[r.priority] ?? 0) + 1;
}

const summaryData: (string | number)[][] = [
  [`${AREA.toUpperCase()} Scenarios Export Summary`],
  [`Generated: ${new Date().toISOString()}`],
  [],
  ['Total scenarios', rows.length],
  [],
  ['── Automation State ──'],
  ...Object.entries(byAutoState).map(([k, v]) => [k, v]),
  [],
  ['── Execution Status ──'],
  ...Object.entries(byExecStatus).map(([k, v]) => [k, v]),
  [],
  ['── Priority ──'],
  ...Object.entries(byPriority).sort().map(([k, v]) => [k, v]),
];

const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
wsSummary['!cols'] = [{ wch: 40 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

// ── Write file ─────────────────────────────────────────────────────────────────

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
XLSX.writeFile(wb, OUTPUT_PATH);

console.log(`✓ Exported to: ${OUTPUT_PATH}`);
console.log(`  Sheets: "${SHEET_NAME}" (${rows.length} rows), "Summary"`);
