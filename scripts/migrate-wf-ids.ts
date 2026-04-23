/**
 * Migration script: Rename WF##-#### IDs to descriptive area-based prefixes.
 *
 * Maps each WF + subsection combo to a descriptive prefix, assigns sequential
 * numbers continuing from the current max for that prefix, and updates the DB
 * in a single transaction.
 *
 * Usage: npx tsx scripts/migrate-wf-ids.ts [--dry-run]
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DRY_RUN = process.argv.includes('--dry-run');
const DB_PATH = path.resolve(__dirname, '..', 'config', 'scenarios.db');

// ── Subsection → prefix mapping ──────────────────────────────────────────────
//
// For each workflow, map subsection patterns to descriptive prefixes.
// Order matters within a workflow: first match wins.

interface SubsectionRule {
  /** Substring match against the `subsection` column */
  match: string;
  /** Target prefix (without trailing dash) */
  prefix: string;
}

const WF_RULES: Record<string, SubsectionRule[]> = {
  WF01: [{ match: '1.2', prefix: 'AUTH-SSO' }],
  WF03: [{ match: '3.2', prefix: 'PRODUCT-DETAIL' }],

  // Stage 1: Creation & Scoping
  // NOTE: longer/more-specific matches MUST come before shorter ones
  WF04: [
    { match: '4.12a', prefix: 'REQVER-BANNER' },
    { match: '4.12b', prefix: 'REQVER-UPDATE' },
    { match: '4.12c', prefix: 'REQVER-ADD' },
    { match: '4.12d', prefix: 'REQVER-DEACTIVATE' },
    { match: '4.12e', prefix: 'REQVER-MINOR' },
    { match: '4.12f', prefix: 'REQVER-TRIGGER' },
    { match: '4.12g', prefix: 'REQVER-HISTORY' },
    { match: '4.10',  prefix: 'PROCREQ-LOCK' },
    { match: '4.11',  prefix: 'PROCREQ-TREE' },
    { match: '4.1 ',  prefix: 'RELEASE-CREATE' },
    { match: '4.2',   prefix: 'RELEASE-ONBOARD' },
    { match: '4.4',   prefix: 'RELEASE-HEADER' },
    { match: '4.8',   prefix: 'PROCESS-REQ-TAB' },
    { match: '4.9',   prefix: 'PRODUCT-REQ-TAB' },
  ],

  // Stage 2: Review & Confirm
  WF05: [
    { match: '5.1', prefix: 'REVIEW-CONFIRM' },
    { match: '5.2', prefix: 'REVIEW-CONFIRM' },
    { match: '5.3', prefix: 'REVIEW-CONFIRM' },
    { match: '5.4', prefix: 'REVIEW-CONFIRM' },
    { match: '5.5', prefix: 'REVIEW-CONFIRM' },
    { match: '5.6', prefix: 'REVIEW-CONFIRM' },
    { match: '5.7', prefix: 'REVIEW-CONFIRM' },
    { match: '5.8', prefix: 'REVIEW-CONFIRM' },
    { match: 'WF5 Outstanding', prefix: 'REVIEW-CONFIRM' },
  ],

  // Stage 3: Manage
  // NOTE: longer matches first to avoid ambiguity
  WF06: [
    { match: '6.3a', prefix: 'MANAGE' },
    { match: '6.3b', prefix: 'MANAGE' },
    { match: '6.3c', prefix: 'MANAGE' },
    { match: '6.4b', prefix: 'MANAGE' },
    { match: '6.5b', prefix: 'MANAGE' },
    { match: '6.1',  prefix: 'MANAGE' },
    { match: '6.2',  prefix: 'MANAGE' },
    { match: '6.4',  prefix: 'MANAGE' },
    { match: '6.5',  prefix: 'MANAGE' },
    { match: '6.6',  prefix: 'MANAGE' },
  ],

  // Stage 4: SA & PQL Sign Off
  WF07: [
    { match: '7.', prefix: 'SA-PQL' },
  ],

  // Stage 5: FCSR Review
  WF08: [
    { match: '8.', prefix: 'FCSR-REVIEW' },
  ],

  // Stage 6: Post FCSR Actions
  WF09: [
    { match: '9.', prefix: 'POST-FCSR' },
  ],

  // Stage 7: Final Acceptance
  WF10: [
    { match: '10.', prefix: 'FINAL-ACCEPT' },
  ],

  // DOC workflows
  // NOTE: longer matches first — '11.11' before '11.1'
  WF11: [
    { match: '11.11', prefix: 'DOC-CERT' },
    { match: '11.12', prefix: 'DOC-HISTORY' },
    { match: '11.13', prefix: 'DOC-LIFECYCLE' },
    { match: '11.14', prefix: 'DOC-TASKS' },
    { match: '11.6',  prefix: 'DOC-ROLES' },
    { match: '11.7',  prefix: 'DOC-ITS' },
    { match: '11.8',  prefix: 'DOC-CONTROL' },
  ],

  // Roles Delegation
  WF12: [
    { match: '12.', prefix: 'ROLES-DELEG' },
  ],

  // Actions Management
  WF13: [
    { match: '13.10', prefix: 'ACTIONS-MGMT' },
    { match: '13.11', prefix: 'ACTIONS-MGMT' },
    { match: '13.', prefix: 'ACTIONS-MGMT' },
  ],

  // Release History
  WF14: [
    { match: '14.', prefix: 'RELEASE-HISTORY' },
  ],

  // Stage Sidebar
  WF15: [
    { match: '15.', prefix: 'STAGE-SIDEBAR' },
  ],

  // Data Protection & Privacy
  WF16: [
    { match: '16.', prefix: 'DPP' },
  ],

  // Maintenance Mode
  WF17: [
    { match: '17.', prefix: 'MAINTENANCE' },
  ],

  // Requirements Versioning (BackOffice)
  WF18: [
    { match: '18.', prefix: 'REQ-VERSION' },
  ],

  // Tableau Reports
  WF19: [
    { match: '19.', prefix: 'TABLEAU' },
  ],

  // REST API
  WF20: [
    { match: '20.', prefix: 'REST-API' },
  ],

  // Integration Tool Config
  WF21: [
    { match: '21.', prefix: 'INTEGRATION' },
  ],

  // Training Module
  WF22: [
    { match: '22.', prefix: 'TRAINING' },
  ],
};

// ── Main logic ───────────────────────────────────────────────────────────────

function main() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = OFF');

  // 1. Find existing max numbers for every prefix
  const maxNumbers = new Map<string, number>();
  const allIds: string[] = db
    .prepare('SELECT id FROM scenarios')
    .all()
    .map((r: any) => r.id as string);

  for (const id of allIds) {
    // Skip WF##-#### IDs — those are what we're renaming
    if (/^WF\d{2}-/.test(id)) continue;

    // Extract trailing number: e.g. "REVIEW-CONFIRM-037" → prefix "REVIEW-CONFIRM", num 37
    const m = id.match(/^(.+?)-(\d{3}(?:-[a-z])?)$/);
    if (!m) continue;
    const prefix = m[1];
    const numStr = m[2].split('-')[0]; // strip variant suffix like "-b"
    const num = parseInt(numStr, 10);
    const cur = maxNumbers.get(prefix) ?? 0;
    if (num > cur) maxNumbers.set(prefix, num);
  }

  // 2. Build rename mapping
  const renames: Array<{ oldId: string; newId: string }> = [];
  const prefixCounters = new Map<string, number>();

  // Initialize counters from existing maxes
  for (const [prefix, max] of maxNumbers) {
    prefixCounters.set(prefix, max);
  }

  // Get all WF##-#### scenarios ordered by workflow then by original ID
  const wfScenarios: Array<{ id: string; subsection: string }> = db
    .prepare("SELECT id, subsection FROM scenarios WHERE id GLOB 'WF[0-9][0-9]-*' ORDER BY id")
    .all() as any[];

  let unmapped = 0;
  for (const row of wfScenarios) {
    const wfKey = row.id.substring(0, 4); // "WF04", "WF05", etc.
    const rules = WF_RULES[wfKey];
    if (!rules) {
      console.warn(`  ⚠ No rules for ${wfKey} — skipping ${row.id}`);
      unmapped++;
      continue;
    }

    // Find matching rule (first match wins)
    const rule = rules.find((r) => row.subsection.includes(r.match));
    if (!rule) {
      console.warn(`  ⚠ No subsection match for ${row.id} (subsection: "${row.subsection}")`);
      unmapped++;
      continue;
    }

    const counter = (prefixCounters.get(rule.prefix) ?? 0) + 1;
    prefixCounters.set(rule.prefix, counter);
    const newId = `${rule.prefix}-${String(counter).padStart(3, '0')}`;
    renames.push({ oldId: row.id, newId });
  }

  console.log(`\n📊 Rename summary:`);
  console.log(`   Total WF##-#### scenarios: ${wfScenarios.length}`);
  console.log(`   Mapped to rename:          ${renames.length}`);
  console.log(`   Unmapped/skipped:          ${unmapped}`);
  console.log();

  // Print prefix summary
  const prefixSummary = new Map<string, number>();
  for (const r of renames) {
    const prefix = r.newId.replace(/-\d{3}$/, '');
    prefixSummary.set(prefix, (prefixSummary.get(prefix) ?? 0) + 1);
  }
  console.log('   Prefix breakdown:');
  for (const [prefix, count] of [...prefixSummary.entries()].sort()) {
    const existingMax = maxNumbers.get(prefix) ?? 0;
    console.log(`     ${prefix.padEnd(25)} ${count} new (existing max: ${String(existingMax).padStart(3, '0')})`);
  }

  // 3. Write mapping file for reference
  const mappingPath = path.resolve(__dirname, '..', 'tmp', 'id-rename-mapping.json');
  fs.mkdirSync(path.dirname(mappingPath), { recursive: true });
  fs.writeFileSync(mappingPath, JSON.stringify(renames, null, 2));
  console.log(`\n   Mapping saved to: tmp/id-rename-mapping.json`);

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN — no changes applied. Remove --dry-run to execute.\n');
    // Print first 20 renames as sample
    console.log('   Sample renames:');
    for (const r of renames.slice(0, 20)) {
      console.log(`     ${r.oldId.padEnd(15)} → ${r.newId}`);
    }
    if (renames.length > 20) console.log(`     ... and ${renames.length - 20} more`);
    db.close();
    return;
  }

  // 4. Execute renames in a transaction
  console.log('\n🔄 Applying renames...');

  // Back up DB first
  const backupPath = DB_PATH.replace('.db', `-backup-${Date.now()}.db`);
  fs.copyFileSync(DB_PATH, backupPath);
  console.log(`   Backup saved to: ${path.basename(backupPath)}`);

  const update = db.prepare('UPDATE scenarios SET id = ?, updated_at = datetime(\'now\') WHERE id = ?');
  const updateGroups = db.prepare('UPDATE scenario_groups SET scenario_id = ? WHERE scenario_id = ?');
  const updateDetails = db.prepare('UPDATE scenario_details SET scenario_id = ? WHERE scenario_id = ?');

  const transaction = db.transaction(() => {
    // To avoid primary key conflicts during rename, we do a two-pass:
    // 1. Rename to temporary IDs
    // 2. Rename from temporary to final IDs
    const tmpPrefix = '__RENAME_TMP__';

    for (let i = 0; i < renames.length; i++) {
      const tmp = `${tmpPrefix}${i}`;
      const old = renames[i].oldId;
      update.run(tmp, old);
      updateGroups.run(tmp, old);
      updateDetails.run(tmp, old);
    }

    for (let i = 0; i < renames.length; i++) {
      const tmp = `${tmpPrefix}${i}`;
      const newId = renames[i].newId;
      update.run(newId, tmp);
      updateGroups.run(newId, tmp);
      updateDetails.run(newId, tmp);
    }

    return renames.length;
  });

  const count = transaction();
  console.log(`   ✅ Renamed ${count} scenarios successfully.`);

  // 5. Verify
  const remaining = db
    .prepare("SELECT COUNT(*) as cnt FROM scenarios WHERE id GLOB 'WF[0-9][0-9]-*'")
    .get() as any;
  console.log(`   Remaining WF##-#### IDs: ${remaining.cnt}`);

  // Re-enable foreign keys and verify integrity
  db.pragma('foreign_keys = ON');
  const fkCheck = db.pragma('foreign_key_check') as any[];
  if (fkCheck.length > 0) {
    console.error(`   ⚠ Foreign key violations detected: ${fkCheck.length}`);
    console.error(fkCheck.slice(0, 5));
  } else {
    console.log('   ✅ Foreign key integrity verified.');
  }

  db.close();
  console.log('\nDone.\n');
}

main();
