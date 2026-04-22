#!/usr/bin/env tsx
/**
 * Backfill scenario_details (steps + expected_results) into the tracker DB
 * by parsing the test-case specification markdown files under specs/.
 *
 * The create-test-cases skill produces full step tables for every scenario,
 * but earlier runs forgot Step 6c — populating scenario_details after
 * inserting into the tracker. This script fixes that gap by extracting
 * the tables from the specs and calling upsertScenarioDetails() for each.
 *
 * Scenario block format in specs:
 *
 *   #### `SCENARIO-ID` — Title
 *
 *   **Preconditions:** ...
 *
 *   | Step | Action | Expected Result |
 *   |------|--------|----------------|
 *   | 1 | action ... | expected ... |
 *   | 2 | action ... | expected ... |
 *
 *   **Coverage dimension:** ...
 *
 * Usage:
 *   npx tsx scripts/backfill-scenario-details-from-specs.ts              # dry-run
 *   npx tsx scripts/backfill-scenario-details-from-specs.ts --write      # apply
 *   npx tsx scripts/backfill-scenario-details-from-specs.ts --write --only WF05 WF06
 *   npx tsx scripts/backfill-scenario-details-from-specs.ts --overwrite  # overwrite existing non-empty rows
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDb } from '../src/tracker/db';
import { upsertScenarioDetails, getScenarioDetails, getScenario } from '../src/tracker/crud';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SPECS_DIR = path.join(REPO_ROOT, 'specs');

interface ParsedScenario {
  id: string;
  title: string;
  steps: string[];
  expectedResults: string[];
  sourceFile: string;
}

const SCENARIO_HEADER_RE = /^####\s+`([A-Z][A-Z0-9_-]+-\d+[a-z]?)`\s*[—-]\s*(.+?)\s*$/;

function parseSpecFile(filePath: string): ParsedScenario[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const results: ParsedScenario[] = [];

  let current: { id: string; title: string } | null = null;
  let inTable = false;
  let sawSeparator = false;
  let steps: string[] = [];
  let expected: string[] = [];

  const flush = () => {
    if (current && (steps.length || expected.length)) {
      results.push({
        id: current.id,
        title: current.title,
        steps: [...steps],
        expectedResults: [...expected],
        sourceFile: path.relative(REPO_ROOT, filePath),
      });
    }
    current = null;
    inTable = false;
    sawSeparator = false;
    steps = [];
    expected = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hdr = line.match(SCENARIO_HEADER_RE);
    if (hdr) {
      flush();
      current = { id: hdr[1], title: hdr[2] };
      continue;
    }
    if (!current) continue;

    // Detect the start of the step table header
    if (!inTable && /^\|\s*Step\s*\|\s*Action\s*\|\s*Expected Result/i.test(line)) {
      inTable = true;
      sawSeparator = false;
      continue;
    }

    if (inTable) {
      // Separator row like |------|--------|----------------|
      if (!sawSeparator && /^\|\s*-+/.test(line)) {
        sawSeparator = true;
        continue;
      }
      // Data row
      if (/^\|/.test(line)) {
        // Split and drop leading/trailing empty tokens
        const cells = line.split('|').slice(1, -1).map((c) => c.trim());
        if (cells.length >= 3) {
          const action = cells[1];
          const expectedResult = cells.slice(2).join(' | ').trim();
          if (action) steps.push(action);
          if (expectedResult) expected.push(expectedResult);
        }
        continue;
      }
      // Non-pipe line ends the table; stay inside `current` until next header
      inTable = false;
    }
  }
  flush();
  return results;
}

function parseSpecsDir(dir: string): ParsedScenario[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectMd(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }
  const all: ParsedScenario[] = [];
  for (const f of files) all.push(...parseSpecFile(f));
  return all;
}

function collectMd(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectMd(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const overwrite = args.includes('--overwrite');
  const onlyIdx = args.indexOf('--only');
  const onlyPrefixes = onlyIdx >= 0 ? args.slice(onlyIdx + 1).filter((a) => !a.startsWith('--')) : [];

  console.log(`[backfill] Parsing ${SPECS_DIR}`);
  let parsed = parseSpecsDir(SPECS_DIR);
  console.log(`[backfill] Parsed ${parsed.length} scenario blocks from specs`);

  // De-duplicate: if a scenario appears in >1 spec file, keep the one with the most steps.
  const byId = new Map<string, ParsedScenario>();
  for (const p of parsed) {
    const prior = byId.get(p.id);
    if (!prior || p.steps.length > prior.steps.length) byId.set(p.id, p);
  }
  parsed = Array.from(byId.values());

  if (onlyPrefixes.length) {
    parsed = parsed.filter((p) => onlyPrefixes.some((pre) => p.id.startsWith(pre)));
    console.log(`[backfill] Filtered to ${parsed.length} scenarios with prefix ${onlyPrefixes.join(',')}`);
  }

  getDb(); // init

  let written = 0;
  let skippedExists = 0;
  let skippedEmpty = 0;
  let skippedNotInDb = 0;
  const perWorkflow = new Map<string, number>();

  for (const p of parsed) {
    if (!p.steps.length && !p.expectedResults.length) {
      skippedEmpty++;
      continue;
    }
    const scenario = getScenario(p.id);
    if (!scenario) {
      skippedNotInDb++;
      if (process.env.DEBUG) console.log(`  [not-in-db] ${p.id}  (${p.sourceFile})`);
      continue;
    }
    if (!overwrite) {
      const existing = getScenarioDetails(p.id);
      if (existing && (existing.steps.length > 0 || existing.expected_results.length > 0)) {
        skippedExists++;
        continue;
      }
    }
    if (write) {
      upsertScenarioDetails(p.id, p.steps, p.expectedResults);
    }
    written++;
    const wf = scenario.workflow ?? 'Uncategorized';
    perWorkflow.set(wf, (perWorkflow.get(wf) ?? 0) + 1);
  }

  console.log('\n[backfill] Summary');
  console.log(`  ${write ? 'Wrote   ' : 'Would write'}: ${written}`);
  console.log(`  Skipped (details already exist): ${skippedExists}`);
  console.log(`  Skipped (no steps parsed)       : ${skippedEmpty}`);
  console.log(`  Skipped (scenario not in DB)    : ${skippedNotInDb}`);

  if (perWorkflow.size) {
    console.log('\n[backfill] Per-workflow breakdown');
    for (const [wf, n] of Array.from(perWorkflow.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
      console.log(`  ${wf.padEnd(55)} ${n}`);
    }
  }

  if (!write) {
    console.log('\n[backfill] Dry-run — pass --write to apply.');
  }
}

main();
