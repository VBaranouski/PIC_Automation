#!/usr/bin/env tsx
/**
 * Fix two issues introduced by earlier create-test-cases runs:
 *
 *   1. Rename the 29 scenarios the skill minted with placeholder WF##-####
 *      IDs during the WF 4–12 gap-fill pass. Rename them to semantic
 *      prefixes consistent with the feature registry (e.g. RELEASE-DPP-*,
 *      RELEASE-FCSR-EXCEPTION-*, ROLES-DELEGATION-*, ACTIONS-*,
 *      RELEASE-HISTORY-*, STAGE-SIDEBAR-*).
 *
 *   2. Strip the leading "<ID>: " prefix from the `description` column for
 *      scenarios where the description begins with the scenario's own ID —
 *      this caused duplicate ID text in the tracker UI.
 *
 * All changes run in a single SQLite transaction. A timestamped DB backup
 * is taken under docs/ai/backups/ before any write.
 *
 * Usage:
 *   npx tsx scripts/fix-scenario-ids-and-descriptions.ts           # dry-run
 *   npx tsx scripts/fix-scenario-ids-and-descriptions.ts --write   # apply
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDb } from '../src/tracker/db';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(REPO_ROOT, 'config', 'scenarios.db');
const BACKUP_DIR = path.join(REPO_ROOT, 'docs', 'ai', 'backups');

// ── Rename map ────────────────────────────────────────────────────────────────
// Derived from titles + feature-registry prefixes. Order is stable.
const RENAME_MAP: Record<string, string> = {
  // WF07 Privacy Review → releases.data-protection / releases.signoff.privacy
  'WF07-0026': 'RELEASE-DPP-PRIVACY-001',
  'WF07-0027': 'RELEASE-DPP-PRIVACY-002',
  'WF07-0028': 'RELEASE-DPP-PRIVACY-003',
  'WF07-0029': 'RELEASE-DPP-PRIVACY-004',
  'WF07-0030': 'RELEASE-DPP-PRIVACY-005',
  'WF07-0031': 'RELEASE-DPP-PRIVACY-006',
  'WF07-0032': 'RELEASE-DPP-PRIVACY-007',
  'WF07-0033': 'RELEASE-SIGNOFF-PENTEST-001',
  // WF08 FCSR Exception + FCSR Decision sections
  'WF08-0083': 'RELEASE-FCSR-EXCEPTION-001',
  'WF08-0084': 'RELEASE-FCSR-EXCEPTION-002',
  'WF08-0085': 'RELEASE-FCSR-EXCEPTION-003',
  'WF08-0086': 'RELEASE-FCSR-DEC-001',
  'WF08-0087': 'RELEASE-FCSR-DEC-002',
  // WF09 Post FCSR
  'WF09-0018': 'RELEASE-POSTFCSR-001',
  'WF09-0019': 'RELEASE-POSTFCSR-002',
  // WF10 Final Acceptance
  'WF10-0018': 'RELEASE-ACCEPT-001',
  'WF10-0019': 'RELEASE-ACCEPT-002',
  // WF12 Roles Delegation
  'WF12-0053': 'ROLES-DELEGATION-ACCESS-001',
  'WF12-0054': 'ROLES-DELEGATION-LIFECYCLE-001',
  'WF12-0055': 'ROLES-DELEGATION-VALIDATION-001',
  'WF12-0056': 'ROLES-DELEGATION-VALIDATION-002',
  // WF13 Actions Management
  'WF13-0089': 'ACTIONS-ACCESS-001',
  'WF13-0090': 'ACTIONS-BARCHART-001',
  'WF13-0091': 'ACTIONS-PAGINATION-001',
  'WF13-0092': 'ACTIONS-PAGINATION-002',
  // WF14 Release History
  'WF14-0020': 'RELEASE-HISTORY-001',
  // WF15 Stage Sidebar
  'WF15-0014': 'STAGE-SIDEBAR-001',
  'WF15-0015': 'STAGE-SIDEBAR-002',
  'WF15-0016': 'STAGE-SIDEBAR-003',
};

// Text files that reference these IDs and must be updated in lock-step.
const REFERENCED_FILES = [
  'specs/cross-cutting-wf11-15-test-cases.md',
  'specs/releases-stages2-7-test-cases.md',
  'docs/ai/knowledge-base/feature-registry/releases.md',
  'docs/ai/knowledge-base/change-impact.md',
];

function backupDb(): string {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '-')
    .slice(0, 19);
  const target = path.join(BACKUP_DIR, `tracker-db-pre-idfix-${ts}.sqlite`);
  fs.copyFileSync(DB_PATH, target);
  return target;
}

function main() {
  const write = process.argv.includes('--write');

  const db = getDb();

  // ── Preflight ───────────────────────────────────────────────────────────────
  const oldIds = Object.keys(RENAME_MAP);
  const newIds = Object.values(RENAME_MAP);

  const existingOld = db
    .prepare(
      `SELECT id FROM scenarios WHERE id IN (${oldIds.map(() => '?').join(',')})`
    )
    .all(...oldIds) as { id: string }[];
  const existingNew = db
    .prepare(
      `SELECT id FROM scenarios WHERE id IN (${newIds.map(() => '?').join(',')})`
    )
    .all(...newIds) as { id: string }[];

  console.log('[fix-ids] Rename preflight:');
  console.log(`  old IDs present in DB : ${existingOld.length} / ${oldIds.length}`);
  console.log(`  new IDs already taken : ${existingNew.length} / ${newIds.length}`);
  if (existingNew.length > 0) {
    console.error('  ABORT: target IDs already exist:', existingNew.map((r) => r.id));
    process.exit(1);
  }
  if (existingOld.length < oldIds.length) {
    const missing = oldIds.filter((id) => !existingOld.some((r) => r.id === id));
    console.warn('  WARN: these source IDs were not found (will be skipped):', missing);
  }

  // Description dedup preflight
  const dupRows = db
    .prepare(
      `SELECT id, description FROM scenarios
       WHERE description IS NOT NULL
         AND (description LIKE id || ': %' OR description LIKE id || ':%')`
    )
    .all() as { id: string; description: string }[];
  console.log(`[fix-ids] Description dedup: ${dupRows.length} rows with "<ID>: ..." prefix`);

  if (!write) {
    console.log('\n[fix-ids] Dry-run — pass --write to apply.');
    console.log('\n[fix-ids] Rename samples:');
    for (const [oldId, newId] of Object.entries(RENAME_MAP).slice(0, 5)) {
      console.log(`  ${oldId} → ${newId}`);
    }
    console.log(`  ... and ${oldIds.length - 5} more`);
    console.log('\n[fix-ids] Description dedup samples:');
    for (const row of dupRows.slice(0, 3)) {
      const stripped = row.description.replace(new RegExp(`^${row.id}:\\s*`), '');
      console.log(`  ${row.id}`);
      console.log(`    before: ${row.description.slice(0, 90)}...`);
      console.log(`    after : ${stripped.slice(0, 90)}...`);
    }
    return;
  }

  // ── Backup ─────────────────────────────────────────────────────────────────
  const backup = backupDb();
  console.log(`[fix-ids] Backup created: ${path.relative(REPO_ROOT, backup)}`);

  // ── Apply ──────────────────────────────────────────────────────────────────
  db.pragma('foreign_keys = OFF');
  const tx = db.transaction(() => {
    // 1. Rename scenario IDs across every table that references scenarios.id
    const renameScenarios = db.prepare('UPDATE scenarios SET id = ? WHERE id = ?');
    const renameDetails = db.prepare(
      'UPDATE scenario_details SET scenario_id = ? WHERE scenario_id = ?'
    );
    const renameGroups = db.prepare(
      'UPDATE scenario_groups SET scenario_id = ? WHERE scenario_id = ?'
    );
    const renameMergesFrom = db.prepare(
      'UPDATE scenario_merges SET merged_from_id = ? WHERE merged_from_id = ?'
    );
    const renameMergesInto = db.prepare(
      'UPDATE scenario_merges SET merged_into_id = ? WHERE merged_into_id = ?'
    );

    let renamed = 0;
    for (const [oldId, newId] of Object.entries(RENAME_MAP)) {
      const res = renameScenarios.run(newId, oldId);
      if (res.changes === 0) continue;
      renameDetails.run(newId, oldId);
      renameGroups.run(newId, oldId);
      try {
        renameMergesFrom.run(newId, oldId);
        renameMergesInto.run(newId, oldId);
      } catch {
        // table may not exist on older schemas — ignore
      }
      renamed++;
    }
    console.log(`[fix-ids] Renamed ${renamed} scenarios`);

    // 2. Strip "<ID>: " prefix from description
    const fixDesc = db.prepare(
      `UPDATE scenarios
         SET description = TRIM(SUBSTR(description, LENGTH(id) + 2))
         WHERE description LIKE id || ':%'`
    );
    const descRes = fixDesc.run();
    console.log(`[fix-ids] Stripped ID prefix from ${descRes.changes} descriptions`);
  });
  tx();
  db.pragma('foreign_keys = ON');

  // ── Integrity check ────────────────────────────────────────────────────────
  const orphans = db
    .prepare(
      `SELECT sd.scenario_id FROM scenario_details sd
         LEFT JOIN scenarios s ON sd.scenario_id = s.id
         WHERE s.id IS NULL
       UNION
       SELECT sg.scenario_id FROM scenario_groups sg
         LEFT JOIN scenarios s ON sg.scenario_id = s.id
         WHERE s.id IS NULL`
    )
    .all() as { scenario_id: string }[];
  if (orphans.length) {
    console.error('[fix-ids] POST-CHECK FAIL — orphan rows detected:', orphans);
    process.exit(2);
  }
  console.log('[fix-ids] Integrity check passed — no orphan rows');

  // ── Update text references ─────────────────────────────────────────────────
  console.log('\n[fix-ids] Updating referenced text files:');
  for (const rel of REFERENCED_FILES) {
    const full = path.join(REPO_ROOT, rel);
    if (!fs.existsSync(full)) {
      console.log(`  skip (missing): ${rel}`);
      continue;
    }
    let content = fs.readFileSync(full, 'utf8');
    let changes = 0;
    for (const [oldId, newId] of Object.entries(RENAME_MAP)) {
      // Only replace whole-token occurrences (bounded by non-[A-Z0-9_-])
      const re = new RegExp(`\\b${oldId}\\b`, 'g');
      const before = content;
      content = content.replace(re, newId);
      if (content !== before) changes += (before.match(re) || []).length;
    }
    if (changes > 0) {
      fs.writeFileSync(full, content);
      console.log(`  ${rel}: ${changes} replacements`);
    } else {
      console.log(`  ${rel}: no references`);
    }
  }

  console.log('\n[fix-ids] Done.');
}

main();
