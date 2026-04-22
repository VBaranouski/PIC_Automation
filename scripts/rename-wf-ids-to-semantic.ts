#!/usr/bin/env tsx
/**
 * Rename ALL WF##-#### scenario IDs to semantic prefixes.
 *
 * Reads every scenario whose ID matches WF\d{2}-\d{4}, determines the correct
 * semantic prefix from its `subsection` and `workflow` columns, and assigns a
 * sequential number starting after existing non-WF IDs that share the prefix.
 *
 * Usage:
 *   npx tsx scripts/rename-wf-ids-to-semantic.ts              # dry-run
 *   npx tsx scripts/rename-wf-ids-to-semantic.ts --write       # apply
 *   npx tsx scripts/rename-wf-ids-to-semantic.ts --write --verbose
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDb } from '../src/tracker/db';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(REPO_ROOT, 'config', 'scenarios.db');
const BACKUP_DIR = path.join(REPO_ROOT, 'docs', 'ai', 'backups');

// ══════════════════════════════════════════════════════════════════════════════
// SUBSECTION → PREFIX MAPPING  (keys = exact DB subsection values)
// ══════════════════════════════════════════════════════════════════════════════

const SUBSECTION_TO_PREFIX: Record<string, string> = {
  // ── WF01: Authentication ────────────────────────────────────────────────
  '1.2 SSO Authentication': 'AUTH-LOGIN',

  // ── WF03: Product Management ────────────────────────────────────────────
  '3.2 Product Detail — View Mode': 'PRODUCT-DETAIL',

  // ── WF04: Stage 1 — Creation & Scoping ──────────────────────────────────
  '4.1 Create Release Dialog': 'RELEASE-CREATE',
  '4.2 Onboarding (Existing) Release': 'RELEASE-CREATE',
  '4.4 Release Detail Page — Header & Workflow Pipeline': 'RELEASE-SCOPE-WORKFLOW',
  '4.8 Process Requirements Tab': 'RELEASE-PROCREQ',
  '4.9 Product Requirements Tab': 'RELEASE-PRODREQ',
  '4.10 Process Requirements — Applicability Lock': 'RELEASE-PROCREQ-LOCK',
  '4.11 Process Requirements — Parent-Child Selection': 'RELEASE-PROCREQ-SELECT',
  '4.12a Warning Banner & Version Notification': 'RELEASE-REQ-VERSION',
  '4.12b Use Case 1 — Existing Requirement Field Updated (Major)': 'RELEASE-REQ-VERSION',
  '4.12c Use Case 2 — New Requirement Added': 'RELEASE-REQ-VERSION',
  '4.12d Use Case 3 — Requirement Deactivated': 'RELEASE-REQ-VERSION',
  '4.12e Minor Field Updates': 'RELEASE-REQ-VERSION',
  '4.12f Auto-Trigger & Mandatory Changes': 'RELEASE-REQ-VERSION',
  '4.12g Release History Integration': 'RELEASE-REQ-VERSION',

  // ── WF05: Stage 2 — Review & Confirm ────────────────────────────────────
  '5.1 Stage Transition & Routing': 'RELEASE-REVIEW',
  '5.2 Requirements Summary Section': 'RELEASE-REVIEW-SUMMARY',
  '5.3 Previous FCSR Summary Section': 'RELEASE-REVIEW-PREVFCSR',
  '5.4 Scope Review Participants Section': 'RELEASE-REVIEW-SCOPE',
  '5.5 Key Discussion Topics Section': 'RELEASE-REVIEW-TOPICS',
  '5.6 Scope Review Decision Section': 'RELEASE-REVIEW-DECISION',
  '5.7 Action Plan Items Section': 'RELEASE-REVIEW-ACTION',
  '5.8 Submit & Rework': 'RELEASE-REVIEW-SUBMIT',
  'WF5 Outstanding Non-Automated Scenarios (2026-04-12)': 'RELEASE-REVIEW',

  // ── WF06: Stage 3 — Manage ──────────────────────────────────────────────
  '6.1 Manage Stage Entry & Navigation': 'RELEASE-MANAGE',
  '6.2 Manage SDL Process Requirements — Jira Integration': 'RELEASE-MANAGE-JIRA',
  '6.3a Product Configuration — Tracking Tools': 'RELEASE-MANAGE-TRACKING',
  '6.3b Submit & Refresh Product Requirements to/from Jama': 'RELEASE-MANAGE-JAMA',
  '6.3c Jama-Submitted Requirements — Editable Fields': 'RELEASE-MANAGE-JAMA-EDIT',
  '6.4 Cybersecurity Residual Risks (CSRR) Tab': 'RELEASE-CSRR',
  '6.4b Jira/Jama Submitted Requirements — Editable Fields': 'RELEASE-MANAGE-JIRAJAMA',
  '6.5 Action Items — Create & Manage': 'RELEASE-MANAGE-ACTION',
  '6.5b Actions Management Bar Chart (Stats)': 'RELEASE-MANAGE-ACTION-CHART',
  '6.6 FCSR Recommendation (FCSR Decision Tab)': 'RELEASE-MANAGE-FCSR',

  // ── WF07: Stage 4 — SA & PQL Sign Off ──────────────────────────────────
  '7.1 Stage Entry & Task Assignment': 'RELEASE-SIGNOFF-SA',
  '7.2 Evaluation Status Editing': 'RELEASE-SIGNOFF-EVAL',
  '7.3 Auto-Calculated Summaries': 'RELEASE-SIGNOFF-SUMMARY',
  '7.4 SBOM Validation at SA & PQL Stage': 'RELEASE-SIGNOFF-SBOM',
  '7.5 Dual Sign-Off Requirement': 'RELEASE-SIGNOFF-DUAL',
  '7.6 Rework from SA & PQL Sign Off': 'RELEASE-SIGNOFF-REWORK',

  // ── WF08: Stage 5 — FCSR Review ────────────────────────────────────────
  '8.1 Stage Entry & Routing': 'RELEASE-FCSR',
  '8.2 FCSR Decision Tab Sections': 'RELEASE-FCSR-DEC',
  '8.3 FCSR Participants': 'RELEASE-FCSR-PARTICIPANT',
  '8.4 FCSR Decision & Outcomes': 'RELEASE-FCSR-OUTCOME',
  '8.5 Escalation Chain': 'RELEASE-FCSR-ESCALATION',
  '8.6a Report Configurator — Access & Visibility': 'RELEASE-FCSR-RPT-ACCESS',
  '8.6b Report Configurator — Section Selection': 'RELEASE-FCSR-RPT-SECTION',
  '8.6c Report Content — Metadata': 'RELEASE-FCSR-RPT-META',
  '8.6d Report Content — Scope Review&Approval (Section 1)': 'RELEASE-FCSR-RPT-SCOPE',
  '8.6e Report Content — FCSR Review (Section 2)': 'RELEASE-FCSR-RPT-REVIEW',
  '8.6f Report Content — Actions Management (Section 3)': 'RELEASE-FCSR-RPT-ACTIONS',
  '8.6g Report Content — Data Protection and Privacy (Section 4)': 'RELEASE-FCSR-RPT-DPP',
  '8.6h Report — Release History': 'RELEASE-FCSR-RPT-HISTORY',

  // ── WF09: Stage 6 — Post FCSR Actions ──────────────────────────────────
  '9.1 No-Go Path': 'RELEASE-POSTFCSR-NOGO',
  '9.2 Go with Pre-Conditions Path — Action Closure': 'RELEASE-POSTFCSR-PRE',
  '9.3 SBOM & CSRR Editability During Post FCSR Actions': 'RELEASE-POSTFCSR-SBOM',
  '9.4 Stage Routing — Go and Go with Post-Conditions': 'RELEASE-POSTFCSR',

  // ── WF10: Stage 7 — Final Acceptance ────────────────────────────────────
  '10.1 Stage Entry': 'RELEASE-ACCEPT',
  '10.2 SBOM Validations at Final Acceptance': 'RELEASE-ACCEPT-SBOM',
  '10.3 Pen Test Validation at Final Acceptance': 'RELEASE-ACCEPT-PENTEST',
  '10.4 Final Acceptance & Return to Rework': 'RELEASE-ACCEPT-DECISION',

  // ── WF11: DOC ───────────────────────────────────────────────────────────
  '11.6 DOC Detail — Roles & Responsibilities Tab': 'DOC-ROLES',
  '11.7 DOC Detail — ITS Checklist Tab': 'DOC-ITS',
  '11.8 DOC Detail — Control Detail Page': 'DOC-CONTROL',
  '11.11 DOC Detail — Certification Decision Tab': 'DOC-CERT',
  '11.12 DOC History': 'DOC-HISTORY',
  '11.13 DOC Lifecycle Transitions': 'DOC-LIFECYCLE',
  '11.14 DOC Emails & Tasks': 'DOC-TASKS',

  // ── WF12: Roles Delegation ──────────────────────────────────────────────
  '12.1 Roles Delegation Page': 'ROLES-DELEGATION-PAGE',
  '12.2 Delegate Role Pop-Up — Single Role': 'ROLES-DELEGATION-SINGLE',
  '12.3 Edit and Remove Delegation': 'ROLES-DELEGATION-EDIT',
  '12.4 Bulk Delegation': 'ROLES-DELEGATION-BULK',
  '12.5 CSO-Specific Permissions (BU SO / LOB SL)': 'ROLES-DELEGATION-CSO',
  '12.6 Delegation Display in Product & Release Details': 'ROLES-DELEGATION-SCOPE',
  '12.7 Delegation History': 'ROLES-DELEGATION-HISTORY',
  '12.8 Post-Delegation Effects & Task Handover': 'ROLES-DELEGATION-EFFECTS',

  // ── WF13: Actions Management ────────────────────────────────────────────
  '13.1 Actions Management Access & Link': 'ACTIONS-ACCESS',
  '13.2 Actions Management Page — Table & Columns': 'ACTIONS-GRID',
  '13.3 Filters on Actions Management Page': 'ACTIONS-FILTER',
  '13.4 View Action Details Pop-Up': 'ACTIONS-VIEW',
  '13.5 Edit Actions': 'ACTIONS-EDIT',
  '13.6 Create New Action from Actions Management': 'ACTIONS-CREATE',
  '13.7 Submit Actions to Jira & Refresh': 'ACTIONS-JIRA',
  '13.8 Actions Management History': 'ACTIONS-HISTORY',
  '13.9 Actions Editing in Release — Stage-Aware Behaviour': 'ACTIONS-STAGE',
  '13.10 Actions Summary on Review & Confirm Tab': 'ACTIONS-SUMMARY',
  '13.11 Email Notifications on Actions': 'ACTIONS-EMAIL',

  // ── WF14: Release History ───────────────────────────────────────────────
  '14.1 Access & Grid Basics': 'RELEASE-HISTORY',
  '14.2 Sorting & Filtering': 'RELEASE-HISTORY-FILTER',
  '14.3 Pagination & Error States': 'RELEASE-HISTORY-EDGE',
  '14.4 Audit Trail Entries': 'RELEASE-HISTORY-AUDIT',

  // ── WF15: Stage Sidebar & Responsible Users ─────────────────────────────
  '15.1 Need Help Sidebar Panel': 'STAGE-SIDEBAR',
  '15.2 Workflow Popup & Rework Signals': 'STAGE-SIDEBAR-WORKFLOW',
  '15.3 My Tasks Assignee Coverage': 'STAGE-SIDEBAR-TASKS',

  // ── WF16: DPP Review ───────────────────────────────────────────────────
  '16.1 DPP Activation at Product Level': 'RELEASE-DPP-ACTIVATION',
  '16.2 DPP Review Tab in Release': 'RELEASE-DPP-TAB',
  '16.3 PCC (Privacy Compliance Committee) Decision': 'RELEASE-DPP-PCC',
  '16.4 Privacy Reviewer Task & Stage Integration': 'RELEASE-DPP-REVIEWER',
  '16.5 DPP Section in PDF Report': 'RELEASE-DPP-REPORT',
  '16.6 DPP Data in Release History': 'RELEASE-DPP-HISTORY',
  '16.7 Privacy Section — Requirements List (BackOffice)': 'RELEASE-DPP-BACKOFFICE',
  '16.8 DPP Review Tab — Requirements from Privacy Sections': 'RELEASE-DPP-REQLIST',

  // ── WF17: Maintenance Mode ─────────────────────────────────────────────
  '17.1 Maintenance Page — Unprivileged User View': 'MAINTENANCE-USER',
  '17.2 Maintenance Mode — Privileged Access (Superuser / Tech Admin)': 'MAINTENANCE-ADMIN',
  '17.3 Maintenance Mode Configuration (BackOffice)': 'MAINTENANCE-CONFIG',

  // ── WF18: BackOffice Requirements Versioning ───────────────────────────
  '18.1 Mandatory Change Confirmation Popup': 'BACKOFFICE-VERSION-CONFIRM',
  '18.2 Requirements Version History': 'BACKOFFICE-VERSION-HISTORY',
  '18.3 View & Restore Previous Versions': 'BACKOFFICE-VERSION-RESTORE',
  '18.4 Requirement Code Immutability': 'BACKOFFICE-VERSION-CODE',
  '18.5 Removed Fields': 'BACKOFFICE-VERSION-FIELDS',
  '18.6 Export/Import Version Columns': 'BACKOFFICE-VERSION-EXPORT',
  '18.7 BackOffice Change History': 'BACKOFFICE-VERSION-CHANGELOG',

  // ── WF19: Reports & Dashboards (Tableau) ───────────────────────────────
  '19.1 Tableau Access & Navigation': 'REPORT-TABLEAU-ACCESS',
  '19.2 FCSR Approval Decision Trending (4.3.1)': 'REPORT-TABLEAU-FCSR',
  '19.3 Product Lifecycle & Security Posture (4.3.2–4.3.4)': 'REPORT-TABLEAU-LIFECYCLE',
  '19.4 MVP Dashboard Metrics (18 metrics)': 'REPORT-TABLEAU-METRICS',
  '19.5 Requirements Version Reports (Tableau)': 'REPORT-TABLEAU-VERSION',

  // ── WF20: Integration — Data Ingestion API ─────────────────────────────
  '20.1 Authentication & Authorization': 'INT-INGEST-AUTH',
  '20.2 API Domains (11 CRUD Endpoints)': 'INT-INGEST-API',
  '20.3 Data Transparency in UI': 'INT-INGEST-UI',

  // ── WF21: Integration — Data Extraction API ────────────────────────────
  '21.1 Authentication Modes': 'INT-EXTRACT-AUTH',
  '21.2 Data Source & API Endpoints': 'INT-EXTRACT-API',
  '21.3 Tool Configuration': 'INT-EXTRACT-CONFIG',

  // ── WF22: Integration — Intel DS / Informatica ─────────────────────────
  '22.1 Authentication & Data Flow': 'INT-INTELDS-AUTH',
  '22.2 Training Completion Progress Metrics': 'INT-INTELDS-METRICS',
  '22.3 Learn More Popup': 'INT-INTELDS-POPUP',
  '22.4 BackOffice Training Configuration': 'INT-INTELDS-CONFIG',
  '22.5 Staging Area & Extraction': 'INT-INTELDS-STAGING',
  '22.6 Tableau Training Report': 'INT-INTELDS-REPORT',
};

// Workflow-level fallback when subsection is null or not in the map
const WORKFLOW_DEFAULT_PREFIX: Record<string, string> = {
  'Authentication': 'AUTH-LOGIN',
  'Product Management': 'PRODUCT-DETAIL',
  'Release — Stage 1: Creation & Scoping': 'RELEASE-SCOPE',
  'Release — Stage 2: Review & Confirm': 'RELEASE-REVIEW',
  'Release — Stage 3: Manage': 'RELEASE-MANAGE',
  'Release — Stage 4: SA & PQL Sign Off': 'RELEASE-SIGNOFF',
  'Release — Stage 5: FCSR Review': 'RELEASE-FCSR',
  'Release — Stage 6: Post FCSR Actions': 'RELEASE-POSTFCSR',
  'Release — Stage 7: Final Acceptance': 'RELEASE-ACCEPT',
  'Digital Offer Certification (DOC)': 'DOC-MISC',
  'Roles Delegation': 'ROLES-DELEGATION',
  'Actions Management': 'ACTIONS-MISC',
  'Release History': 'RELEASE-HISTORY',
  'Stage Sidebar & Responsible Users': 'STAGE-SIDEBAR',
  'Data Protection & Privacy (DPP) Review': 'RELEASE-DPP',
  'Integration: Data Extraction API': 'INT-EXTRACT',
  'Integration: Data Ingestion API': 'INT-INGEST',
  'Integration: Intel DS / Informatica (Training Completion)': 'INT-INTELDS',
  'Reports & Dashboards (Tableau Integration)': 'REPORT-TABLEAU',
  'Requirements Versioning: BackOffice Administration': 'BACKOFFICE-VERSION',
  'Maintenance Mode': 'MAINTENANCE',
};

// ══════════════════════════════════════════════════════════════════════════════

interface WfScenario {
  id: string;
  workflow: string;
  subsection: string | null;
  title: string;
}

function resolvePrefix(s: WfScenario): string {
  // 1. Direct subsection match
  if (s.subsection && SUBSECTION_TO_PREFIX[s.subsection]) {
    return SUBSECTION_TO_PREFIX[s.subsection];
  }
  // 2. Workflow-level fallback
  if (s.workflow && WORKFLOW_DEFAULT_PREFIX[s.workflow]) {
    return WORKFLOW_DEFAULT_PREFIX[s.workflow];
  }
  return 'UNKNOWN';
}

function collectTextFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    if (entry.isDirectory()) out.push(...collectTextFiles(full));
    else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.ts')))
      out.push(full);
  }
  return out;
}

function backupDb(): string {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '-').slice(0, 19);
  const target = path.join(BACKUP_DIR, `tracker-db-pre-bulk-rename-${ts}.sqlite`);
  fs.copyFileSync(DB_PATH, target);
  return target;
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const verbose = args.includes('--verbose');

  const db = getDb();

  // ── Load WF##-#### scenarios ──────────────────────────────────────────
  const wfRows = db
    .prepare(`SELECT id, workflow, subsection, title FROM scenarios WHERE id GLOB 'WF[0-9][0-9]-*' ORDER BY id`)
    .all() as WfScenario[];
  console.log(`[rename] Found ${wfRows.length} WF##-#### scenarios`);

  // ── Load existing non-WF prefix counters ──────────────────────────────
  const allIds = db
    .prepare(`SELECT id FROM scenarios WHERE id NOT GLOB 'WF[0-9][0-9]-*' ORDER BY id`)
    .all() as { id: string }[];

  const prefixMax = new Map<string, number>();
  for (const { id } of allIds) {
    const match = id.match(/^(.+)-(\d{3})(-[a-z])?$/);
    if (match) {
      const prefix = match[1];
      const num = parseInt(match[2], 10);
      prefixMax.set(prefix, Math.max(prefixMax.get(prefix) ?? 0, num));
    }
  }

  // ── Build rename map ──────────────────────────────────────────────────
  const byPrefix = new Map<string, WfScenario[]>();
  const unknowns: WfScenario[] = [];

  for (const row of wfRows) {
    const prefix = resolvePrefix(row);
    if (prefix === 'UNKNOWN') { unknowns.push(row); continue; }
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
    byPrefix.get(prefix)!.push(row);
  }

  if (unknowns.length > 0) {
    console.log(`\n[rename] WARNING: ${unknowns.length} unmapped scenarios:`);
    for (const u of unknowns) {
      console.log(`  ${u.id} | wf="${u.workflow}" | sub="${u.subsection}" | title="${u.title.slice(0, 60)}"`);
    }
    if (!write) {
      console.log('\nFix these before running --write');
    }
  }

  const renameMap = new Map<string, string>();
  for (const [prefix, scenarios] of byPrefix.entries()) {
    let counter = prefixMax.get(prefix) ?? 0;
    for (const s of scenarios) {
      counter++;
      renameMap.set(s.id, `${prefix}-${String(counter).padStart(3, '0')}`);
    }
    prefixMax.set(prefix, counter);
  }

  // ── Summary ───────────────────────────────────────────────────────────
  const prefixSummary = new Map<string, number>();
  for (const newId of renameMap.values()) {
    const prefix = newId.replace(/-\d{3}$/, '');
    prefixSummary.set(prefix, (prefixSummary.get(prefix) ?? 0) + 1);
  }

  console.log(`\n[rename] Mapping ${renameMap.size} scenarios across ${prefixSummary.size} prefixes:`);
  for (const [prefix, count] of [...prefixSummary.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${prefix.padEnd(40)} ${count}`);
  }

  // Collision checks
  const newIds = [...renameMap.values()];
  const newIdSet = new Set(newIds);
  if (newIdSet.size !== newIds.length) {
    const dupes = newIds.filter((id, i) => newIds.indexOf(id) !== i);
    console.error(`\n[rename] ABORT: duplicate new IDs:`, [...new Set(dupes)].slice(0, 10));
    process.exit(1);
  }

  // Check no collision with existing non-WF IDs
  const placeholders = newIds.map(() => '?').join(',');
  const existingCollisions = db
    .prepare(`SELECT id FROM scenarios WHERE id IN (${placeholders}) AND id NOT GLOB 'WF[0-9][0-9]-*'`)
    .all(...newIds) as { id: string }[];
  if (existingCollisions.length > 0) {
    console.error(`\n[rename] ABORT: ${existingCollisions.length} target IDs already exist:`,
      existingCollisions.map(r => r.id).slice(0, 10));
    process.exit(1);
  }

  if (verbose) {
    console.log('\n[rename] Full mapping (first 60):');
    let i = 0;
    for (const [old, nw] of renameMap.entries()) {
      const row = wfRows.find(r => r.id === old);
      console.log(`  ${old.padEnd(12)} → ${nw.padEnd(35)} [${row?.subsection?.slice(0, 40) ?? '(null)'}]`);
      if (++i >= 60) { console.log(`  ... and ${renameMap.size - 60} more`); break; }
    }
  }

  if (!write) {
    console.log(`\n[rename] Dry-run complete — ${renameMap.size} renames planned, ${unknowns.length} unmapped.`);
    console.log('[rename] Pass --write to apply.');
    return;
  }

  if (unknowns.length > 0) {
    console.error(`\n[rename] ABORT: ${unknowns.length} scenarios have no prefix mapping. Fix the map first.`);
    process.exit(1);
  }

  // ── Backup ────────────────────────────────────────────────────────────
  const backup = backupDb();
  console.log(`\n[rename] Backup: ${path.relative(REPO_ROOT, backup)}`);

  // ── Apply DB renames ──────────────────────────────────────────────────
  db.pragma('foreign_keys = OFF');
  const tx = db.transaction(() => {
    const stmtScenarios = db.prepare('UPDATE scenarios SET id = ? WHERE id = ?');
    const stmtDetails = db.prepare('UPDATE scenario_details SET scenario_id = ? WHERE scenario_id = ?');
    const stmtGroups = db.prepare('UPDATE scenario_groups SET scenario_id = ? WHERE scenario_id = ?');

    let renameCount = 0;
    for (const [oldId, newId] of renameMap.entries()) {
      const res = stmtScenarios.run(newId, oldId);
      if (res.changes === 0) { console.warn(`  SKIP: ${oldId} not found`); continue; }
      stmtDetails.run(newId, oldId);
      stmtGroups.run(newId, oldId);
      renameCount++;
    }
    console.log(`[rename] Renamed ${renameCount} scenarios in DB`);

    try {
      const stmtMFrom = db.prepare('UPDATE scenario_merges SET merged_from_id = ? WHERE merged_from_id = ?');
      const stmtMInto = db.prepare('UPDATE scenario_merges SET merged_into_id = ? WHERE merged_into_id = ?');
      for (const [oldId, newId] of renameMap.entries()) {
        stmtMFrom.run(newId, oldId);
        stmtMInto.run(newId, oldId);
      }
    } catch { /* table may not exist */ }
  });
  tx();
  db.pragma('foreign_keys = ON');

  // ── Integrity check ───────────────────────────────────────────────────
  const orphans = db
    .prepare(
      `SELECT sd.scenario_id FROM scenario_details sd LEFT JOIN scenarios s ON sd.scenario_id = s.id WHERE s.id IS NULL
       UNION
       SELECT sg.scenario_id FROM scenario_groups sg LEFT JOIN scenarios s ON sg.scenario_id = s.id WHERE s.id IS NULL`
    )
    .all() as { scenario_id: string }[];
  if (orphans.length) {
    console.error('[rename] INTEGRITY FAILURE — orphans:', orphans.map(o => o.scenario_id).slice(0, 10));
    process.exit(2);
  }
  console.log('[rename] Integrity check passed');

  const remaining = db
    .prepare(`SELECT COUNT(*) AS cnt FROM scenarios WHERE id GLOB 'WF[0-9][0-9]-*'`)
    .get() as { cnt: number };
  console.log(`[rename] Remaining WF##-#### IDs: ${remaining.cnt}`);

  // ── Update text files ─────────────────────────────────────────────────
  const textDirs = ['specs', 'docs/ai/knowledge-base', 'docs/ai/test-cases'];
  const textFiles: string[] = [];
  for (const dir of textDirs) textFiles.push(...collectTextFiles(path.join(REPO_ROOT, dir)));

  // Build mega-regex sorted longest-first to avoid partial matches
  const sortedOlds = [...renameMap.keys()].sort((a, b) => b.length - a.length || a.localeCompare(b));
  const escaped = sortedOlds.map(id => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const megaRegex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'g');

  let totalFileChanges = 0;
  for (const fp of textFiles) {
    const content = fs.readFileSync(fp, 'utf8');
    const newContent = content.replace(megaRegex, (match) => renameMap.get(match) ?? match);
    if (newContent !== content) {
      const changes = (content.match(megaRegex) || []).length;
      fs.writeFileSync(fp, newContent);
      totalFileChanges += changes;
      console.log(`  ${path.relative(REPO_ROOT, fp)}: ${changes} replacements`);
    }
  }
  console.log(`[rename] Updated ${totalFileChanges} references across text files`);

  // ── Save rename map ───────────────────────────────────────────────────
  const mapPath = path.join(BACKUP_DIR, 'wf-to-semantic-rename-map.json');
  const mapObj: Record<string, string> = {};
  for (const [k, v] of renameMap) mapObj[k] = v;
  fs.writeFileSync(mapPath, JSON.stringify(mapObj, null, 2));
  console.log(`[rename] Rename map: ${path.relative(REPO_ROOT, mapPath)}`);

  console.log('\n[rename] Done.');
}

main();
