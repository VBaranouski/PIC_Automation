#!/usr/bin/env npx tsx
/**
 * seed-subsections.ts
 *
 * Parses automation-testing-plan.md and maps each scenario ID to its
 * subsection heading (e.g. "2.1 Tab Structure", "4.5 Release Details Tab").
 * Updates the `subsection` column on the scenarios table.
 *
 * Usage:
 *   npx tsx scripts/seed-subsections.ts [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { getDb, closeDb } from '../src/tracker/db';

const DRY_RUN = process.argv.includes('--dry-run');
const MD_PATH = path.resolve(__dirname, '..', 'docs', 'ai', 'automation-testing-plan.md');

if (!fs.existsSync(MD_PATH)) {
  console.error(`❌ Cannot find ${MD_PATH}`);
  process.exit(1);
}

const content = fs.readFileSync(MD_PATH, 'utf-8');
const lines = content.split('\n');

// Build a mapping: scenarioId → subsection title
// We replicate the seed-tracker.ts ID generation logic to also capture auto-generated IDs
const idToSubsection = new Map<string, string>();

let currentWorkflow = '';
let currentSubsection = '';
let autoIncrementCounter = 0;
const seenIds = new Set<string>();

for (const line of lines) {
  // Detect WORKFLOW headings
  const wfMatch = line.match(/^#{1,2}\s+(WORKFLOW\s+\d+.*)/i);
  if (wfMatch) {
    currentWorkflow = wfMatch[1].replace(/[—–-]+\s*$/, '').trim();
    currentSubsection = '';
    continue;
  }

  // Detect subsection headings: ### 2.1 Tab Structure
  const subMatch = line.match(/^#{2,3}\s+([\d]+\.[\d]+[a-z]?\s+.+)/);
  if (subMatch) {
    currentSubsection = subMatch[1].trim();
    continue;
  }

  // Match checklist items (same regex as seed-tracker.ts)
  const checklistMatch = line.match(/^-\s+(\[[ x~]\])\s+\*\*(P[123])\*\*\s+(.*)/);
  if (!checklistMatch) continue;

  let rest = checklistMatch[3];

  // Extract explicit test case ID
  let testId = '';
  const idMatch = rest.match(/`([A-Z][\w-]+-\d+(?:-\d+)?)`/);
  if (idMatch) {
    testId = idMatch[1];
  }

  // If no explicit ID, replicate the auto-generation logic from seed-tracker.ts
  if (!testId) {
    autoIncrementCounter++;
    const areaPrefix = currentWorkflow
      .replace(/^WORKFLOW\s+\d+\s*[—–-]?\s*/i, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toUpperCase()
      .slice(0, 20);
    testId = `${areaPrefix || 'AUTO'}-${String(autoIncrementCounter).padStart(3, '0')}`;
  }

  // Handle duplicate IDs the same way as seed-tracker.ts
  if (seenIds.has(testId)) {
    let suffix = 2;
    while (seenIds.has(`${testId}-${String(suffix).padStart(2, '0')}`)) suffix++;
    testId = `${testId}-${String(suffix).padStart(2, '0')}`;
  }
  seenIds.add(testId);

  // Map this ID to its current subsection
  if (currentSubsection) {
    idToSubsection.set(testId, currentSubsection);
  }
}

console.log(`📋 Parsed ${idToSubsection.size} scenario→subsection mappings from markdown\n`);

if (DRY_RUN) {
  // Show sample
  const entries = [...idToSubsection.entries()];
  for (const [id, sub] of entries.slice(0, 20)) {
    console.log(`  ${id.padEnd(30)} → ${sub}`);
  }
  if (entries.length > 20) console.log(`  … and ${entries.length - 20} more`);
  process.exit(0);
}

// Apply to DB
const db = getDb();
const update = db.prepare('UPDATE scenarios SET subsection = ? WHERE id = ?');

let updated = 0;
let notFound = 0;

const txn = db.transaction(() => {
  for (const [id, subsection] of idToSubsection) {
    const result = update.run(subsection, id);
    if (result.changes > 0) {
      updated++;
    } else {
      notFound++;
    }
  }
});

txn();
closeDb();

console.log(`✅ Updated ${updated} scenarios with subsection info`);
if (notFound) console.log(`⚠️  ${notFound} IDs from markdown not found in DB`);
