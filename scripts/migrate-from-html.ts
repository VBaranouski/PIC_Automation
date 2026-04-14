#!/usr/bin/env npx tsx
/**
 * migrate-from-html.ts
 *
 * One-shot migration: reads automation-testing-plan.html, parses all three
 * embedded data blobs, wipes and recreates the scenarios DB under schema v2,
 * inserts all scenarios with their sidecar details.
 *
 * Usage:
 *   npx tsx scripts/migrate-from-html.ts [--html <path>] [--db <path>] [--dry-run] [--force]
 *
 * Flags:
 *   --html <path>   Override HTML source (default: docs/ai/automation-testing-plan.html)
 *   --db <path>     Override DB path (default: config/scenarios.db)
 *   --dry-run       Parse + report, write nothing, skip backup
 *   --force         Allow overwriting an existing schema-v2 DB
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { parseHtmlPlan } from '../src/tracker/html-parser';

const ROOT = path.resolve(__dirname, '..');

interface Args {
  htmlPath: string;
  dbPath: string;
  dryRun: boolean;
  force: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    htmlPath: path.join(ROOT, 'docs', 'ai', 'automation-testing-plan.html'),
    dbPath: path.join(ROOT, 'config', 'scenarios.db'),
    dryRun: false,
    force: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--force') args.force = true;
    else if (a === '--html') args.htmlPath = argv[++i];
    else if (a === '--db')   args.dbPath = argv[++i];
    else if (a === '-h' || a === '--help') {
      console.log('Usage: tsx scripts/migrate-from-html.ts [--html <path>] [--db <path>] [--dry-run] [--force]');
      process.exit(0);
    }
  }
  return args;
}

// Extract SCHEMA_SQL from db.ts source to avoid re-defining it here.
function loadSchemaSql(): string {
  const dbSrc = fs.readFileSync(path.join(ROOT, 'src', 'tracker', 'db.ts'), 'utf-8');
  const match = dbSrc.match(/const SCHEMA_SQL = `([\s\S]*?)`;/);
  if (!match) throw new Error('Failed to load SCHEMA_SQL from src/tracker/db.ts');
  return match[1];
}

function backupDb(dbPath: string): string | null {
  if (!fs.existsSync(dbPath)) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = `${dbPath}.bak-${stamp}`;
  fs.copyFileSync(dbPath, backup);
  return backup;
}

function main(): void {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(args.htmlPath)) {
    console.error(`✗ HTML not found: ${args.htmlPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(args.htmlPath, 'utf-8');
  const { scenarios, warnings } = parseHtmlPlan(html);

  console.log(`Parsed ${scenarios.length} scenarios from ${args.htmlPath}`);
  if (warnings.length) {
    console.log(`${warnings.length} warnings (first 5):`);
    for (const w of warnings.slice(0, 5)) console.log('  - ' + w);
  }

  if (args.dryRun) {
    const byExec = scenarios.reduce<Record<string, number>>((acc, s) => {
      acc[s.execution_status] = (acc[s.execution_status] || 0) + 1;
      return acc;
    }, {});
    const byAuto = scenarios.reduce<Record<string, number>>((acc, s) => {
      acc[s.automation_state] = (acc[s.automation_state] || 0) + 1;
      return acc;
    }, {});
    console.log('Execution status distribution:', byExec);
    console.log('Automation state distribution:', byAuto);
    console.log('(dry-run — wrote nothing)');
    return;
  }

  // Refuse to clobber an existing schema-v2 DB unless --force.
  if (fs.existsSync(args.dbPath)) {
    const probe = new Database(args.dbPath);
    try {
      const row = probe.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get() as { value?: string } | undefined;
      if (row?.value === '2' && !args.force) {
        console.error(`✗ DB already at schema v2 (${args.dbPath}). Use --force to overwrite existing data.`);
        probe.close();
        process.exit(2);
      }
    } catch {
      // Not a v2 DB — safe to proceed.
    }
    probe.close();
  }

  const backup = backupDb(args.dbPath);
  if (backup) console.log(`Backed up existing DB → ${path.relative(ROOT, backup)}`);

  // Remove old DB files so SQLite creates a fresh database.
  if (fs.existsSync(args.dbPath)) fs.unlinkSync(args.dbPath);
  for (const sfx of ['-shm', '-wal']) {
    const extra = args.dbPath + sfx;
    if (fs.existsSync(extra)) fs.unlinkSync(extra);
  }

  fs.mkdirSync(path.dirname(args.dbPath), { recursive: true });
  const db = new Database(args.dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const schemaSql = loadSchemaSql();
  db.exec(schemaSql);
  db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('schema_version', '2');

  const insertScenario = db.prepare(`
    INSERT INTO scenarios (id, title, description, automation_state, execution_status,
      priority, feature_area, spec_file, workflow, subsection, created_at, updated_at)
    VALUES (@id, @title, '', @automation_state, @execution_status,
      @priority, @feature_area, @spec_file, @workflow, @subsection, datetime('now'), datetime('now'))
  `);
  const insertDetail = db.prepare(`
    INSERT INTO scenario_details (scenario_id, steps, expected_results, execution_notes)
    VALUES (?, ?, ?, ?)
  `);

  const run = db.transaction(() => {
    for (const s of scenarios) {
      insertScenario.run({
        id: s.id,
        title: s.title,
        automation_state: s.automation_state,
        execution_status: s.execution_status,
        priority: s.priority,
        feature_area: s.feature_area,
        spec_file: s.spec_file,
        workflow: s.workflow,
        subsection: s.subsection,
      });
      insertDetail.run(s.id, JSON.stringify(s.steps), JSON.stringify(s.expected_results), s.execution_notes);
    }
  });
  run();

  const count = (db.prepare('SELECT COUNT(*) as c FROM scenarios').get() as { c: number }).c;
  if (count !== scenarios.length) {
    console.error(`✗ Post-insert count ${count} ≠ parsed ${scenarios.length}`);
    db.close();
    process.exit(3);
  }

  db.close();
  console.log(`✓ Inserted ${count} scenarios into ${path.relative(ROOT, args.dbPath)}`);
  console.log(`✓ schema_version = 2`);
}

main();
