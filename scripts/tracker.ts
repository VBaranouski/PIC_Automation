#!/usr/bin/env npx tsx
/**
 * Test Scenario Tracker — CLI
 *
 * Usage:
 *   npx tsx scripts/tracker.ts <command> [options]
 *   npm run tracker -- <command> [options]
 *
 * Commands:
 *   list       List scenarios with optional filters
 *   add        Add a new test scenario
 *   remove     Remove a test scenario
 *   status     Change the status of a scenario
 *   hold       Put a scenario on hold (auto-skipped in test runs)
 *   unhold     Remove hold from a scenario (set back to pending)
 *   group      Add or remove groups from a scenario
 *   groups     List all available groups
 *   sync       Reconcile DB with actual spec files
 *   report     Print summary statistics
 *   export     Export all scenarios to JSON
 *   import     Import scenarios from a JSON file
 *   seed       Seed DB from the automation-testing-plan.md
 *   show       Show details of a single scenario
 */

import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import path from 'path';
import fs from 'fs';

import { getDb, closeDb, getDbPath } from '../src/tracker/db';
import {
  addScenario,
  getScenario,
  removeScenario,
  setStatus,
  holdScenario,
  unholdScenario,
  updateScenario,
  listScenarios,
  addGroupToScenario,
  removeGroupFromScenario,
  listAllGroups,
  addGroup,
  syncWithSpecFiles,
  getStats,
  exportToJson,
  importFromJson,
  isValidStatus,
  isValidPriority,
  isValidFeatureArea,
} from '../src/tracker/operations';
import { SCENARIO_STATUSES, PRIORITIES, FEATURE_AREAS } from '../src/tracker/models';
import type { ScenarioStatus, Priority, FeatureArea, Scenario } from '../src/tracker/models';

// ── Status color helpers ──────────────────────────────────────────────────────

const statusColor: Record<ScenarioStatus, (s: string) => string> = {
  pending: chalk.yellow,
  automated: chalk.green,
  passed: chalk.cyan,
  failed: chalk.red,
  skipped: chalk.gray,
  'on-hold': chalk.magenta,
};

const priorityColor: Record<Priority, (s: string) => string> = {
  P1: chalk.red.bold,
  P2: chalk.yellow,
  P3: chalk.gray,
};

function colorStatus(s: ScenarioStatus): string {
  return (statusColor[s] || chalk.white)(s);
}

function colorPriority(p: Priority): string {
  return (priorityColor[p] || chalk.white)(p);
}

// ── Program ───────────────────────────────────────────────────────────────────

const program = new Command();

program
  .name('tracker')
  .description('PICASso Test Scenario Tracker — manage test scenarios with SQLite')
  .version('1.0.0');

// ── list ──────────────────────────────────────────────────────────────────────

program
  .command('list')
  .description('List test scenarios with optional filters')
  .option('-s, --status <status>', `Filter by status (${SCENARIO_STATUSES.join(', ')})`)
  .option('-p, --priority <priority>', `Filter by priority (${PRIORITIES.join(', ')})`)
  .option('-a, --area <area>', `Filter by feature area (${FEATURE_AREAS.join(', ')})`)
  .option('-g, --group <group>', 'Filter by group/tag name')
  .option('-w, --workflow <workflow>', 'Filter by workflow name (partial match)')
  .option('-q, --search <query>', 'Search in ID, title, and description')
  .option('-f, --spec <path>', 'Filter by spec file path (partial match)')
  .option('--compact', 'Compact output (ID + title only)')
  .action((opts) => {
    // Initialise DB
    getDb();

    const scenarios = listScenarios({
      status: opts.status,
      priority: opts.priority,
      feature_area: opts.area,
      group: opts.group,
      workflow: opts.workflow,
      search: opts.search,
      spec_file: opts.spec,
    });

    if (scenarios.length === 0) {
      console.log(chalk.yellow('No scenarios found matching the filters.'));
      closeDb();
      return;
    }

    if (opts.compact) {
      for (const s of scenarios) {
        console.log(`${colorPriority(s.priority)} ${chalk.cyan(s.id)} ${s.title} [${colorStatus(s.status)}]`);
      }
    } else {
      const table = new Table({
        head: ['ID', 'Title', 'Status', 'Priority', 'Area', 'Groups', 'Spec File'],
        colWidths: [22, 50, 14, 10, 12, 20, 40],
        wordWrap: true,
        style: { head: ['cyan'] },
      });

      for (const s of scenarios) {
        table.push([
          s.id,
          s.title.slice(0, 48),
          colorStatus(s.status),
          colorPriority(s.priority),
          s.feature_area,
          s.groups.join(', ') || '—',
          s.spec_file || '—',
        ]);
      }

      console.log(table.toString());
    }

    console.log(chalk.gray(`\n${scenarios.length} scenario(s) found.`));
    closeDb();
  });

// ── show ──────────────────────────────────────────────────────────────────────

program
  .command('show <id>')
  .description('Show full details of a scenario')
  .action((id: string) => {
    getDb();
    const s = getScenario(id.toUpperCase());
    if (!s) {
      console.log(chalk.red(`Scenario "${id}" not found.`));
      closeDb();
      process.exit(1);
    }

    console.log(chalk.cyan.bold(`\n  ${s.id}`));
    console.log(chalk.white(`  ${s.title}\n`));
    console.log(`  Status:       ${colorStatus(s.status)}`);
    console.log(`  Priority:     ${colorPriority(s.priority)}`);
    console.log(`  Feature Area: ${s.feature_area}`);
    console.log(`  Workflow:     ${s.workflow || '—'}`);
    console.log(`  Spec File:    ${s.spec_file || '—'}`);
    console.log(`  Groups:       ${s.groups.length ? s.groups.join(', ') : '—'}`);
    if (s.description) {
      console.log(`  Description:  ${s.description}`);
    }
    console.log(`  Created:      ${s.created_at}`);
    console.log(`  Updated:      ${s.updated_at}`);
    console.log();
    closeDb();
  });

// ── add ───────────────────────────────────────────────────────────────────────

program
  .command('add')
  .description('Add a new test scenario')
  .requiredOption('-i, --id <id>', 'Unique scenario ID (e.g. AUTH-LOGIN-010)')
  .requiredOption('-t, --title <title>', 'Scenario title')
  .option('-d, --description <desc>', 'Description or notes')
  .option('-s, --status <status>', `Status (${SCENARIO_STATUSES.join(', ')})`, 'pending')
  .option('-p, --priority <priority>', `Priority (${PRIORITIES.join(', ')})`, 'P2')
  .option('-a, --area <area>', `Feature area (${FEATURE_AREAS.join(', ')})`, 'other')
  .option('-f, --spec <path>', 'Path to the .spec.ts file')
  .option('-w, --workflow <workflow>', 'Workflow section name')
  .option('-g, --groups <groups>', 'Comma-separated group names (e.g. smoke,critical)')
  .action((opts) => {
    getDb();

    if (!isValidStatus(opts.status)) {
      console.log(chalk.red(`Invalid status: ${opts.status}. Valid: ${SCENARIO_STATUSES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    if (!isValidPriority(opts.priority)) {
      console.log(chalk.red(`Invalid priority: ${opts.priority}. Valid: ${PRIORITIES.join(', ')}`));
      closeDb();
      process.exit(1);
    }

    const groups = opts.groups ? opts.groups.split(',').map((g: string) => g.trim()) : [];

    try {
      const scenario = addScenario({
        id: opts.id.toUpperCase(),
        title: opts.title,
        description: opts.description,
        status: opts.status as ScenarioStatus,
        priority: opts.priority as Priority,
        feature_area: (opts.area || 'other') as FeatureArea,
        spec_file: opts.spec,
        workflow: opts.workflow,
        groups,
      });
      console.log(chalk.green(`✓ Added scenario: ${scenario.id} — ${scenario.title}`));
    } catch (err: any) {
      if (err.message?.includes('UNIQUE constraint')) {
        console.log(chalk.red(`Scenario "${opts.id}" already exists. Use "status" or "show" command instead.`));
      } else {
        console.log(chalk.red(`Error: ${err.message}`));
      }
      closeDb();
      process.exit(1);
    }

    closeDb();
  });

// ── remove ────────────────────────────────────────────────────────────────────

program
  .command('remove <id>')
  .description('Remove a test scenario')
  .action((id: string) => {
    getDb();
    const removed = removeScenario(id.toUpperCase());
    if (removed) {
      console.log(chalk.green(`✓ Removed scenario: ${id.toUpperCase()}`));
    } else {
      console.log(chalk.red(`Scenario "${id}" not found.`));
    }
    closeDb();
  });

// ── status ────────────────────────────────────────────────────────────────────

program
  .command('status <id> <newStatus>')
  .description(`Change scenario status. Valid statuses: ${SCENARIO_STATUSES.join(', ')}`)
  .action((id: string, newStatus: string) => {
    getDb();
    if (!isValidStatus(newStatus)) {
      console.log(chalk.red(`Invalid status: ${newStatus}. Valid: ${SCENARIO_STATUSES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    const updated = setStatus(id.toUpperCase(), newStatus as ScenarioStatus);
    if (updated) {
      console.log(chalk.green(`✓ ${updated.id} status → ${colorStatus(updated.status)}`));
    } else {
      console.log(chalk.red(`Scenario "${id}" not found.`));
    }
    closeDb();
  });

// ── hold / unhold ─────────────────────────────────────────────────────────────

program
  .command('hold <id>')
  .description('Put a scenario on hold (auto-skipped during test runs)')
  .action((id: string) => {
    getDb();
    const updated = holdScenario(id.toUpperCase());
    if (updated) {
      console.log(chalk.magenta(`⏸  ${updated.id} is now ON HOLD`));
    } else {
      console.log(chalk.red(`Scenario "${id}" not found.`));
    }
    closeDb();
  });

program
  .command('unhold <id>')
  .description('Remove hold — set scenario back to pending')
  .action((id: string) => {
    getDb();
    const updated = unholdScenario(id.toUpperCase());
    if (updated) {
      console.log(chalk.green(`▶  ${updated.id} is now PENDING (hold removed)`));
    } else {
      console.log(chalk.red(`Scenario "${id}" not found.`));
    }
    closeDb();
  });

// ── group ─────────────────────────────────────────────────────────────────────

program
  .command('group <action> <id> <groupName>')
  .description('Add or remove a group from a scenario. Action: add | remove')
  .action((action: string, id: string, groupName: string) => {
    getDb();
    const upperId = id.toUpperCase();

    if (!getScenario(upperId)) {
      console.log(chalk.red(`Scenario "${id}" not found.`));
      closeDb();
      process.exit(1);
    }

    if (action === 'add') {
      addGroupToScenario(upperId, groupName);
      console.log(chalk.green(`✓ Added group "${groupName}" to ${upperId}`));
    } else if (action === 'remove') {
      removeGroupFromScenario(upperId, groupName);
      console.log(chalk.green(`✓ Removed group "${groupName}" from ${upperId}`));
    } else {
      console.log(chalk.red(`Invalid action: "${action}". Use "add" or "remove".`));
    }
    closeDb();
  });

// ── groups ────────────────────────────────────────────────────────────────────

program
  .command('groups')
  .description('List all available groups/tags')
  .option('--add <name>', 'Add a new group')
  .option('-d, --description <desc>', 'Description for the new group')
  .action((opts) => {
    getDb();

    if (opts.add) {
      addGroup(opts.add, opts.description);
      console.log(chalk.green(`✓ Group "${opts.add}" added.`));
    }

    const groups = listAllGroups();
    if (groups.length === 0) {
      console.log(chalk.yellow('No groups defined.'));
      closeDb();
      return;
    }

    const table = new Table({
      head: ['Group', 'Description', 'Scenarios'],
      style: { head: ['cyan'] },
    });

    for (const g of groups) {
      table.push([g.name, g.description || '—', g.count]);
    }
    console.log(table.toString());
    closeDb();
  });

// ── sync ──────────────────────────────────────────────────────────────────────

program
  .command('sync')
  .description('Reconcile DB with actual .spec.ts files (find new IDs, detect orphans)')
  .action(() => {
    getDb();
    console.log(chalk.cyan('Scanning tests/**/*.spec.ts for allure.description IDs...'));
    const result = syncWithSpecFiles();

    if (result.newIds.length) {
      console.log(chalk.yellow(`\nNew IDs found in spec files but NOT in DB (${result.newIds.length}):`));
      for (const id of result.newIds) console.log(`  + ${id}`);
    }
    if (result.orphanedIds.length) {
      console.log(chalk.red(`\nOrphaned IDs in DB (spec file missing or ID removed) (${result.orphanedIds.length}):`));
      for (const id of result.orphanedIds) console.log(`  ⚠ ${id}`);
    }
    if (result.updatedSpecFiles.length) {
      console.log(chalk.green(`\nUpdated spec_file paths (${result.updatedSpecFiles.length}):`));
      for (const id of result.updatedSpecFiles) console.log(`  ↻ ${id}`);
    }

    if (!result.newIds.length && !result.orphanedIds.length && !result.updatedSpecFiles.length) {
      console.log(chalk.green('✓ DB is in sync with spec files.'));
    }
    closeDb();
  });

// ── report ────────────────────────────────────────────────────────────────────

program
  .command('report')
  .description('Print summary statistics')
  .action(() => {
    getDb();
    const stats = getStats();

    console.log(chalk.cyan.bold(`\n  📊 Test Scenario Tracker — Report`));
    console.log(chalk.cyan(`  ${'─'.repeat(40)}\n`));
    console.log(`  Total scenarios: ${chalk.bold(String(stats.total))}\n`);

    // By status
    console.log(chalk.white.bold('  By Status:'));
    for (const [status, count] of Object.entries(stats.byStatus)) {
      if (count > 0) {
        const pct = ((count / stats.total) * 100).toFixed(1);
        console.log(`    ${colorStatus(status as ScenarioStatus).padEnd(25)} ${String(count).padStart(4)}  (${pct}%)`);
      }
    }

    // By priority
    console.log(chalk.white.bold('\n  By Priority:'));
    for (const [priority, count] of Object.entries(stats.byPriority)) {
      if (count > 0) {
        const pct = ((count / stats.total) * 100).toFixed(1);
        console.log(`    ${colorPriority(priority as Priority).padEnd(25)} ${String(count).padStart(4)}  (${pct}%)`);
      }
    }

    // By feature area
    console.log(chalk.white.bold('\n  By Feature Area:'));
    for (const [area, count] of Object.entries(stats.byFeatureArea)) {
      const pct = ((count / stats.total) * 100).toFixed(1);
      console.log(`    ${area.padEnd(20)} ${String(count).padStart(4)}  (${pct}%)`);
    }

    // By group
    if (Object.keys(stats.byGroup).length) {
      console.log(chalk.white.bold('\n  By Group:'));
      for (const [group, count] of Object.entries(stats.byGroup)) {
        console.log(`    ${group.padEnd(20)} ${String(count).padStart(4)}`);
      }
    }

    console.log();
    closeDb();
  });

// ── export ────────────────────────────────────────────────────────────────────

program
  .command('export')
  .description('Export all scenarios to a JSON file')
  .option('-o, --output <path>', 'Output file path', 'config/scenarios-export.json')
  .action((opts) => {
    getDb();
    const data = exportToJson();
    const outputPath = path.resolve(opts.output);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(chalk.green(`✓ Exported ${data.scenarios.length} scenarios to ${outputPath}`));
    closeDb();
  });

// ── import ────────────────────────────────────────────────────────────────────

program
  .command('import <file>')
  .description('Import scenarios from a JSON file (skips existing IDs)')
  .action((file: string) => {
    getDb();
    const absPath = path.resolve(file);
    if (!fs.existsSync(absPath)) {
      console.log(chalk.red(`File not found: ${absPath}`));
      closeDb();
      process.exit(1);
    }

    const raw = fs.readFileSync(absPath, 'utf-8');
    const data = JSON.parse(raw);
    const result = importFromJson(data);
    console.log(chalk.green(`✓ Imported ${result.imported} scenarios, skipped ${result.skipped} (already exist).`));
    closeDb();
  });

// ── seed ──────────────────────────────────────────────────────────────────────

program
  .command('seed')
  .description('Seed the DB from docs/ai/automation-testing-plan.md')
  .option('--dry-run', 'Parse and show what would be seeded without writing to DB')
  .action((opts) => {
    // Dynamically import the seed function
    const seedPath = path.resolve(__dirname, 'seed-tracker.ts');
    if (!fs.existsSync(seedPath)) {
      // Try .js fallback (in case running compiled)
      const seedPathJs = path.resolve(__dirname, 'seed-tracker.js');
      if (!fs.existsSync(seedPathJs)) {
        console.log(chalk.red(`Seed script not found at ${seedPath}`));
        closeDb();
        process.exit(1);
      }
    }
    // We call seed-tracker.ts directly via tsx instead
    console.log(chalk.cyan('Run seed separately:  npx tsx scripts/seed-tracker.ts'));
    if (opts.dryRun) {
      console.log(chalk.gray('(dry-run mode — add --dry-run flag to the seed script)'));
    }
    closeDb();
  });

// ── Parse & run ───────────────────────────────────────────────────────────────

program.parse();
