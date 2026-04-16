#!/usr/bin/env npx tsx
/**
 * sync-ids-from-specs.ts — Synchronize scenario IDs, titles and descriptions
 * in the tracker DB with the canonical IDs embedded in every spec file.
 *
 * Problem being solved:
 *   DOC-area scenarios were seeded with DIGITAL-OFFER-CERTIF-NNN IDs instead of
 *   the canonical IDs used inside the spec files (DOC-ITS-001, DOC-DETAIL-001 …).
 *   All areas may also have stale allure.description text.
 *
 * What the script does:
 *   1. Reads every spec file referenced in the DB.
 *   2. Extracts (canonicalId, testTitle, allureDescription, steps, expected) tuples
 *      using three detection patterns:
 *        a) `// ── SOME-ID-001 ──…` comment immediately before a test()
 *        b) `// SOME-ID-001 (smoke) …` comment immediately before a test()
 *        c) allure.description('SOME-ID-001: …') inside the test body
 *   3. For each DB scenario that has a DIGITAL-OFFER-CERTIF-NNN id OR whose
 *      description doesn't match the spec:
 *        - Find the best-matching spec test via Jaccard title similarity.
 *        - Rename the id (updating FK tables scenario_groups + scenario_details).
 *        - Update title and description.
 *   4. For pending DOC scenarios that have no spec match, assign a
 *      planned-prefix id: DOC-CERT-P001, DOC-ITS-P001, TC-LIFECYCLE-P001 …
 *
 * Usage:
 *   npx tsx scripts/sync-ids-from-specs.ts          # apply
 *   npx tsx scripts/sync-ids-from-specs.ts --dry    # preview only
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DB_PATH      = path.join(PROJECT_ROOT, 'config', 'scenarios.db');
const DRY          = process.argv.includes('--dry');

const db = new Database(DB_PATH);

// ── Types ─────────────────────────────────────────────────────────────────────

interface SpecEntry {
  canonicalId: string;
  testTitle:   string;
  description: string;
  steps:       string[];
  expected:    string[];
}

interface DbScenario {
  id:         string;
  title:      string;
  description: string;
  spec_file:  string;
  feature_area: string;
  status:     string;
  subsection: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function tokenize(s: string): Set<string> {
  const STOP = new Set(['a','an','the','and','or','not','no','for','of','to',
    'in','on','at','is','are','was','were','be','been','being','with','from',
    'by','as','it','its','that','this','these','those','should','must','can',
    'will','when','after','before','than','then','but','also','if','which']);
  return new Set(
    s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
     .filter(w => w.length > 1 && !STOP.has(w))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  const inter = [...a].filter(t => b.has(t)).length;
  const union = new Set([...a, ...b]).size;
  return inter / union;
}

function isVerifyStep(s: string): boolean {
  return /^(verify|assert|expect|confirm|check|ensure)\b/i.test(s.trim());
}

// ── Spec-file parser ──────────────────────────────────────────────────────────

/**
 * Patterns for extracting canonical IDs from a spec file line:
 *   1.  // ── DOC-ITS-001 ──────────
 *   2.  // ── DOC-ITS-017 (fixme: …) ──
 *   3.  // DOC-INIT-001 (smoke) — some text
 *   4.  // -----------\n// DOC-INIT-001 …
 *
 * The canonical ID itself is the first token matching the naming convention.
 */
const ID_FROM_COMMENT = /\/\/[-─\s]+([A-Z][A-Z0-9]+-[A-Z0-9-]+\d+(?:-\d+)?)\b/;
const ID_FROM_ALLURE  = /allure\.description\s*\(\s*(['"`])([\s\S]*?)\1/;
const ALLURE_ID_START = /^([A-Z][A-Z0-9]+-[A-Z0-9-]+\d+(?:-\d+)?):\s*/;

function stripAllureConcat(raw: string): string {
  // Remove JS string concatenation artifacts: ' + ' between quoted fragments
  return raw
    .replace(/'\s*\+\s*'/g, '')
    .replace(/"\s*\+\s*"/g, '')
    .replace(/`\s*\+\s*`/g, '')
    .trim();
}

function parseSpecFile(content: string): SpecEntry[] {
  const lines  = content.split('\n');
  const result: SpecEntry[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Only look at test( ... declarations at any indent level
    const testMatch = line.match(/^\s*test\s*\(\s*(['"`])(.*?)\1/);
    if (!testMatch) continue;

    const rawTitle = testMatch[2];

    // --- Scan backwards for the canonical ID comment (up to 10 lines back) ---
    let canonicalId = '';
    for (let back = 1; back <= 10 && i - back >= 0; back++) {
      const prev = lines[i - back];
      const m = prev.match(ID_FROM_COMMENT);
      if (m) { canonicalId = m[1]; break; }
      // Stop if we hit another test() or an obviously unrelated section
      if (/^\s*test\s*\(/.test(prev) && back > 1) break;
    }

    // --- Find test body end and scan for allure.description ----------------
    let depth = 0;
    let bodyStart = -1;
    let bodyEnd   = i;
    for (let k = i; k < lines.length; k++) {
      for (const ch of lines[k]) {
        if (ch === '{') { if (depth === 0) bodyStart = k; depth++; }
        if (ch === '}') { depth--; if (depth === 0) { bodyEnd = k; break; } }
      }
      if (bodyStart >= 0 && depth === 0) break;
    }

    const body = lines.slice(bodyStart >= 0 ? bodyStart : i, bodyEnd + 1).join('\n');

    // Extract allure.description (may span lines, may use string concat)
    let allureDesc = '';
    const adMatch = body.match(/allure\.description\s*\(\s*['"`]([\s\S]*?)['"`]\s*(?:\+[\s\S]*?['"`][\s\S]*?['"`]\s*)*\)/);
    if (adMatch) {
      allureDesc = stripAllureConcat(adMatch[0]
        .replace(/allure\.description\s*\(\s*/, '')
        .replace(/\s*\)\s*;?\s*$/, '')
        .replace(/['"`]\s*\+\s*['"`]/g, '')
        .replace(/^['"`]|['"`]$/g, '')
      );
    }

    // If no comment-based ID but allure description starts with ID pattern, extract it
    if (!canonicalId && allureDesc) {
      const m2 = allureDesc.match(ALLURE_ID_START);
      if (m2) canonicalId = m2[1];
    }

    // Extract test.step labels
    const steps:    string[] = [];
    const expected: string[] = [];
    const stepRe = /await\s+test\.step\s*\(\s*(['"`])([\s\S]*?)\1/g;
    let sm: RegExpExecArray | null;
    while ((sm = stepRe.exec(body)) !== null) {
      const label = sm[2].trim();
      if (label) {
        if (isVerifyStep(label)) expected.push(label);
        else steps.push(label);
      }
    }

    if (canonicalId) {
      result.push({
        canonicalId,
        testTitle:   rawTitle,
        description: allureDesc,
        steps,
        expected,
      });
    }
  }

  return result;
}

// ── Spec-file prefix → planned prefix mapping ─────────────────────────────────

function specFileToPendingPrefix(specFile: string): string {
  const base = path.basename(specFile, '.spec.ts');
  const MAP: Record<string, string> = {
    'new-product-creation-digital-offer': 'DOC-SETUP-P',
    'initiate-doc':                       'DOC-INIT-P',
    'doc-detail':                         'DOC-DETAIL-P',
    'doc-detail-offer':                   'DOC-OFFER-P',
    'doc-detail-roles':                   'DOC-ROLES-P',
    'doc-detail-its':                     'DOC-ITS-P',
    'control-detail':                     'DOC-CONTROL-P',
    'doc-detail-actions':                 'DOC-ACTIONS-P',
    'doc-detail-risk-summary':            'DOC-RISK-P',
    'doc-detail-certification':           'DOC-CERT-P',
    'doc-history':                        'DOC-HISTORY-P',
    'doc-lifecycle':                      'TC-LIFECYCLE-P',
    'doc-emails-tasks':                   'DOC-TASKS-P',
    'my-docs-tab':                        'LANDING-DOCS-P',
  };
  return MAP[base] ?? `${base.toUpperCase().replace(/-/g, '_')}-P`;
}

// ── Cache parsed spec files ───────────────────────────────────────────────────

const specCache = new Map<string, SpecEntry[]>();

function getSpecEntries(specFile: string): SpecEntry[] {
  if (specCache.has(specFile)) return specCache.get(specFile)!;
  const absPath = path.join(PROJECT_ROOT, specFile);
  if (!fs.existsSync(absPath)) { specCache.set(specFile, []); return []; }
  const entries = parseSpecFile(fs.readFileSync(absPath, 'utf-8'));
  specCache.set(specFile, entries);
  return entries;
}

// ── DB operations ─────────────────────────────────────────────────────────────

function getAllScenarios(): DbScenario[] {
  return db.prepare(`SELECT id, title, description, spec_file, feature_area, automation_state AS status, subsection
                     FROM scenarios
                     ORDER BY feature_area, spec_file, id`).all() as DbScenario[];
}

// PRAGMA foreign_keys must be set OUTSIDE transactions in SQLite/better-sqlite3
db.pragma('foreign_keys = OFF');

const renameId = db.transaction((oldId: string, newId: string, newTitle: string, newDesc: string) => {
  // Check target ID doesn't already exist (skip if it does — avoid collision)
  const exists = db.prepare('SELECT 1 FROM scenarios WHERE id = ?').get(newId);
  if (exists) return false;

  db.prepare('UPDATE scenarios SET id = ?, title = ?, description = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .run(newId, newTitle, newDesc, oldId);
  db.prepare('UPDATE scenario_groups  SET scenario_id = ? WHERE scenario_id = ?').run(newId, oldId);
  db.prepare('UPDATE scenario_details SET scenario_id = ? WHERE scenario_id = ?').run(newId, oldId);
  return true;
});

const updateDesc = db.prepare(
  'UPDATE scenarios SET description = ?, updated_at = datetime(\'now\') WHERE id = ?'
);

const upsertDetails = db.prepare(`
  INSERT INTO scenario_details (scenario_id, steps, expected_results, execution_notes)
  VALUES (@id, @steps, @expected, '')
  ON CONFLICT (scenario_id) DO UPDATE SET
    steps            = excluded.steps,
    expected_results = excluded.expected_results
`);

// ── Main ──────────────────────────────────────────────────────────────────────

const scenarios = getAllScenarios();

// Track assigned canonical IDs per spec file to avoid duplicates
const assignedBySpec = new Map<string, Set<string>>();
// Track next pending counter per spec file prefix
const pendingCounter = new Map<string, number>();

let renamedCount = 0;
let updatedDescCount = 0;
let pendingAssignedCount = 0;
let skippedCollision = 0;

console.log(`\n🔄 Syncing ${scenarios.length} scenarios from spec files...\n`);
if (DRY) console.log('  [DRY RUN — no writes]\n');

// ── Pass 1: process scenarios WITH existing spec files ────────────────────────

for (const scenario of scenarios) {
  if (!scenario.spec_file) continue;

  const specEntries = getSpecEntries(scenario.spec_file);
  if (!specEntries.length) continue;

  if (!assignedBySpec.has(scenario.spec_file)) {
    assignedBySpec.set(scenario.spec_file, new Set());
  }
  const assigned = assignedBySpec.get(scenario.spec_file)!;

  const scenarioTokens = tokenize(scenario.title);

  // Find best matching spec entry (excluding already-assigned canonical IDs)
  let best: SpecEntry | null = null;
  let bestScore = 0;

  for (const entry of specEntries) {
    // If this DB scenario already HAS the canonical ID, it's a definitive match
    if (scenario.id === entry.canonicalId) {
      best = entry; bestScore = 1.0; break;
    }
    if (assigned.has(entry.canonicalId)) continue;
    const score = jaccard(scenarioTokens, tokenize(entry.testTitle));
    if (score > bestScore) { bestScore = score; best = entry; }
  }

  if (!best || bestScore < 0.08) continue; // no confident match → leave as pending

  assigned.add(best.canonicalId);

  const isLegacyId = scenario.id.startsWith('DIGITAL-OFFER-CERTIF-') || /^WF\d+-\d+$/.test(scenario.id);
  const newId      = best.canonicalId;
  const newTitle   = best.testTitle.length > 20 ? best.testTitle : scenario.title;
  const newDesc    = best.description || scenario.description;

  if (isLegacyId && newId !== scenario.id) {
    if (DRY) {
      console.log(`  RENAME  ${scenario.id} → ${newId}`);
      console.log(`          title: "${scenario.title.slice(0, 80)}"`);
      console.log(`          desc:  "${newDesc.slice(0, 100)}"\n`);
      renamedCount++;
    } else {
      const ok = renameId(scenario.id, newId, scenario.title, newDesc);
      if (ok) {
        // Update steps and expected results
        if (best.steps.length || best.expected.length) {
          upsertDetails.run({
            id: newId,
            steps:    JSON.stringify(best.steps.length ? best.steps : ['Log in and navigate to the relevant page.', 'Perform the action under test.']),
            expected: JSON.stringify(best.expected.length ? best.expected : [`${scenario.title.replace(/\.$/, '')}.`]),
          });
        }
        renamedCount++;
      } else {
        if (!DRY) console.log(`  ⚠ Collision skipped: ${newId} already exists`);
        skippedCollision++;
      }
    }
  } else if (!isLegacyId && newDesc && newDesc !== scenario.description) {
    // Existing proper ID — just update description if changed
    if (!DRY) {
      updateDesc.run(newDesc, scenario.id);
      updatedDescCount++;
    } else {
      updatedDescCount++;
    }
  }
}

// ── Pass 2: pending DOC scenarios with no spec match → assign planned prefix ──

const legacyUnmatched = getAllScenarios().filter(
  s => s.id.startsWith('DIGITAL-OFFER-CERTIF-') && s.spec_file
);

for (const scenario of legacyUnmatched) {
  const prefix = specFileToPendingPrefix(scenario.spec_file);
  if (!pendingCounter.has(prefix)) pendingCounter.set(prefix, 1);
  const seq    = pendingCounter.get(prefix)!;
  pendingCounter.set(prefix, seq + 1);
  const newId  = `${prefix}${String(seq).padStart(3, '0')}`;

  if (DRY) {
    console.log(`  PENDING ${scenario.id} → ${newId}  "${scenario.title.slice(0, 70)}"`);
    pendingAssignedCount++;
  } else {
    const ok = renameId(scenario.id, newId, scenario.title, scenario.description);
    if (ok) pendingAssignedCount++;
    else skippedCollision++;
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n─────────────────────────────────────────────────');
console.log(`✅  ${DRY ? 'Would rename' : 'Renamed'}     ${renamedCount} scenarios to canonical IDs`);
console.log(`📝  ${DRY ? 'Would update' : 'Updated'}     ${updatedDescCount} descriptions from allure.description()`);
console.log(`🗂   ${DRY ? 'Would assign' : 'Assigned'}    ${pendingAssignedCount} planned-prefix IDs to unmatched pending`);
if (skippedCollision) console.log(`⚠   Skipped ${skippedCollision} due to ID collision`);
console.log('─────────────────────────────────────────────────\n');

if (!DRY) db.pragma('foreign_keys = ON');
db.close();
