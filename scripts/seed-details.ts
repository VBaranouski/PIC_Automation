/**
 * Seed Scenario Details — Parse the automation-testing-plan.html
 * embedded JSON and populate the `scenario_details` table with
 * steps + expected_results for each test case.
 *
 * Usage:  npx tsx scripts/seed-details.ts [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { getDb, closeDb, getProjectRoot } from '../src/tracker/db';
import { upsertScenarioDetails, scenarioExists } from '../src/tracker/operations';

const DRY_RUN = process.argv.includes('--dry-run');

function main() {
  const root = getProjectRoot();
  const htmlPath = path.join(root, 'docs', 'ai', 'automation-testing-plan.html');

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ HTML test plan not found at ${htmlPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Extract the JSON block from <script id="doc-auto-case-details" type="application/json">
  const jsonMatch = html.match(/<script\s+id="doc-auto-case-details"\s+type="application\/json">\s*([\s\S]*?)\s*<\/script>/);
  if (!jsonMatch) {
    console.error('❌ Could not find the doc-auto-case-details JSON block in the HTML');
    process.exit(1);
  }

  let caseDetails: Record<string, {
    title?: string;
    spec_path?: string;
    steps?: string[];
    expected_results?: string[];
    execution_notes?: string;
  }>;

  try {
    caseDetails = JSON.parse(jsonMatch[1]);
  } catch (err: any) {
    console.error(`❌ Failed to parse JSON: ${err.message}`);
    process.exit(1);
  }

  const ids = Object.keys(caseDetails);
  console.log(`\n📋 Found ${ids.length} test case detail entries in HTML\n`);

  // Ensure DB schema is up to date
  const db = getDb();

  let seeded = 0;
  let skipped = 0;
  let noMatch = 0;

  for (const [id, detail] of Object.entries(caseDetails)) {
    const steps = detail.steps || [];
    const expectedResults = detail.expected_results || [];
    const executionNotes = detail.execution_notes || '';

    if (steps.length === 0 && expectedResults.length === 0) {
      skipped++;
      continue;
    }

    if (!scenarioExists(id)) {
      noMatch++;
      if (DRY_RUN) {
        console.log(`  ⚠️  ${id} — not in DB (steps: ${steps.length}, expected: ${expectedResults.length})`);
      }
      continue;
    }

    if (DRY_RUN) {
      console.log(`  ✅ ${id} — ${steps.length} steps, ${expectedResults.length} expected results`);
    } else {
      upsertScenarioDetails(id, steps, expectedResults, executionNotes);
    }
    seeded++;
  }

  console.log(`\n${DRY_RUN ? '🔍 DRY RUN — no changes written' : '✅ Done!'}`);
  console.log(`   Seeded:    ${seeded}`);
  console.log(`   Skipped:   ${skipped} (no steps/expected)`);
  console.log(`   No match:  ${noMatch} (ID not in DB)\n`);

  closeDb();
}

main();
