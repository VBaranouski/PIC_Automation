#!/usr/bin/env npx tsx
/**
 * Test Scenario Tracker — CLI
 *
 * Usage:
 *   npx tsx scripts/tracker.ts <command> [options]
 *   npm run tracker -- <command> [options]
 *
 * Commands:
 *   list        List scenarios with optional filters
 *   add         Add a new test scenario
 *   remove      Remove a test scenario
 *   auto-state  Change the automation state of a scenario
 *   exec-status Change the execution status of a scenario
 *   status      [deprecated] Alias for auto-state
 *   hold        Put a scenario on hold (auto-skipped in test runs)
 *   unhold      Remove hold from a scenario (set back to pending)
 *   group       Add or remove groups from a scenario
 *   groups      List all available groups
 *   sync        Reconcile DB with actual spec files
 *   report      Print summary statistics
 *   export      Export all scenarios to JSON
 *   import      Import scenarios from a JSON file
 *   seed        Seed DB from the automation-testing-plan.md
 *   show        Show details of a single scenario
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
  setAutomationState,
  setExecutionStatus,
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
  isValidAutomationState,
  isValidExecutionStatus,
  isValidPriority,
  isValidFeatureArea,
} from '../src/tracker/operations';
import {
  AUTOMATION_STATES,
  EXECUTION_STATUSES,
  PRIORITIES,
  FEATURE_AREAS,
} from '../src/tracker/models';
import type {
  AutomationState,
  ExecutionStatus,
  Priority,
  FeatureArea,
  Scenario,
} from '../src/tracker/models';

const autoStateColor: Record<AutomationState, (s: string) => string> = {
  pending:   chalk.yellow,
  automated: chalk.green,
  'on-hold': chalk.magenta,
};
const execStatusColor: Record<ExecutionStatus, (s: string) => string> = {
  passed:          chalk.cyan,
  'not-executed':  chalk.gray,
  skipped:         chalk.gray,
  'failed-defect': chalk.red,
};
const priorityColor: Record<Priority, (s: string) => string> = {
  P1: chalk.red.bold,
  P2: chalk.yellow,
  P3: chalk.gray,
};

function colorAuto(s: AutomationState): string { return (autoStateColor[s] || chalk.white)(s); }
function colorExec(s: ExecutionStatus): string  { return (execStatusColor[s] || chalk.white)(s); }
function colorPriority(p: Priority): string     { return (priorityColor[p]  || chalk.white)(p); }

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
  .option('--auto-state <state>',     `Filter by automation state (${AUTOMATION_STATES.join(', ')})`)
  .option('--exec-status <status>',   `Filter by execution status (${EXECUTION_STATUSES.join(', ')})`)
  .option('-p, --priority <priority>',`Filter by priority (${PRIORITIES.join(', ')})`)
  .option('-a, --area <area>',        `Filter by feature area (${FEATURE_AREAS.join(', ')})`)
  .option('-g, --group <group>',      'Filter by group/tag name')
  .option('-w, --workflow <workflow>','Filter by workflow name (partial match)')
  .option('-s, --search <term>',      'Search id/title/description')
  .option('--spec <path>',            'Filter by spec file (partial match)')
  .action((opts) => {
    getDb();
    const scenarios = listScenarios({
      automation_state: opts.autoState,
      execution_status: opts.execStatus,
      priority: opts.priority,
      feature_area: opts.area,
      group: opts.group,
      workflow: opts.workflow,
      search: opts.search,
      spec_file: opts.spec,
    });

    if (!scenarios.length) {
      console.log(chalk.gray('No scenarios match filters.'));
      closeDb();
      return;
    }

    const table = new Table({
      head: ['ID', 'Priority', 'Auto State', 'Exec Status', 'Area', 'Title'],
      style: { head: ['cyan'] },
      colWidths: [22, 10, 12, 14, 14, 60],
      wordWrap: true,
    });
    for (const s of scenarios) {
      table.push([
        s.id,
        colorPriority(s.priority),
        colorAuto(s.automation_state),
        colorExec(s.execution_status),
        s.feature_area,
        s.title,
      ]);
    }
    console.log(table.toString());
    console.log(chalk.gray(`\n${scenarios.length} scenarios`));
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
    console.log(`  Auto State:   ${colorAuto(s.automation_state)}`);
    console.log(`  Exec Status:  ${colorExec(s.execution_status)}`);
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
  .option('--auto-state <state>', `Automation state (${AUTOMATION_STATES.join(', ')})`, 'pending')
  .option('--exec-status <status>', `Execution status (${EXECUTION_STATUSES.join(', ')})`, 'not-executed')
  .option('-p, --priority <priority>', `Priority (${PRIORITIES.join(', ')})`, 'P2')
  .option('-a, --area <area>', `Feature area (${FEATURE_AREAS.join(', ')})`, 'other')
  .option('-f, --spec <path>', 'Path to the .spec.ts file')
  .option('-w, --workflow <workflow>', 'Workflow section name')
  .option('-g, --groups <groups>', 'Comma-separated group names (e.g. smoke,critical)')
  .action((opts) => {
    getDb();

    if (!isValidAutomationState(opts.autoState)) {
      console.log(chalk.red(`Invalid automation state: ${opts.autoState}. Valid: ${AUTOMATION_STATES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    if (!isValidExecutionStatus(opts.execStatus)) {
      console.log(chalk.red(`Invalid execution status: ${opts.execStatus}. Valid: ${EXECUTION_STATUSES.join(', ')}`));
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
        automation_state: opts.autoState as AutomationState,
        execution_status: opts.execStatus as ExecutionStatus,
        priority: opts.priority as Priority,
        feature_area: (opts.area || 'other') as FeatureArea,
        spec_file: opts.spec,
        workflow: opts.workflow,
        groups,
      });
      console.log(chalk.green(`✓ Added scenario: ${scenario.id} — ${scenario.title}`));
    } catch (err: any) {
      if (err.message?.includes('UNIQUE constraint')) {
        console.log(chalk.red(`Scenario "${opts.id}" already exists. Use "auto-state" or "show" command instead.`));
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

// ── auto-state ────────────────────────────────────────────────────────────────

program
  .command('auto-state <id> <newState>')
  .description(`Set automation state. Valid: ${AUTOMATION_STATES.join(', ')}`)
  .action((id: string, newState: string) => {
    getDb();
    if (!isValidAutomationState(newState)) {
      console.log(chalk.red(`Invalid automation state: ${newState}. Valid: ${AUTOMATION_STATES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    const updated = setAutomationState(id.toUpperCase(), newState as AutomationState);
    if (updated) console.log(chalk.green(`✓ ${updated.id} auto-state → ${colorAuto(updated.automation_state)}`));
    else         console.log(chalk.red(`Scenario "${id}" not found.`));
    closeDb();
  });

// ── exec-status ───────────────────────────────────────────────────────────────

program
  .command('exec-status <id> <newStatus>')
  .description(`Set execution status. Valid: ${EXECUTION_STATUSES.join(', ')}`)
  .action((id: string, newStatus: string) => {
    getDb();
    if (!isValidExecutionStatus(newStatus)) {
      console.log(chalk.red(`Invalid execution status: ${newStatus}. Valid: ${EXECUTION_STATUSES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    const updated = setExecutionStatus(id.toUpperCase(), newStatus as ExecutionStatus);
    if (updated) console.log(chalk.green(`✓ ${updated.id} exec-status → ${colorExec(updated.execution_status)}`));
    else         console.log(chalk.red(`Scenario "${id}" not found.`));
    closeDb();
  });

// ── status (deprecated alias) ─────────────────────────────────────────────────

// Deprecated alias — routes to auto-state for backward compatibility.
program
  .command('status <id> <newStatus>')
  .description('[deprecated] Alias for auto-state')
  .action((id: string, newStatus: string) => {
    console.log(chalk.yellow('⚠  `status` is deprecated — use `auto-state` or `exec-status` instead.'));
    if (!isValidAutomationState(newStatus)) {
      console.log(chalk.red(`Invalid automation state: ${newStatus}. Valid: ${AUTOMATION_STATES.join(', ')}`));
      closeDb();
      process.exit(1);
    }
    getDb();
    const updated = setAutomationState(id.toUpperCase(), newStatus as AutomationState);
    if (updated) console.log(chalk.green(`✓ ${updated.id} auto-state → ${colorAuto(updated.automation_state)}`));
    else         console.log(chalk.red(`Scenario "${id}" not found.`));
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
    console.log(chalk.bold('Scenario Tracker Report'));
    console.log(chalk.gray('───────────────────────'));
    console.log(`Total scenarios: ${stats.total}`);

    console.log(chalk.bold('\nBy Automation State:'));
    for (const [k, v] of Object.entries(stats.byAutomationState)) console.log(`  ${colorAuto(k as AutomationState)}: ${v}`);

    console.log(chalk.bold('\nBy Execution Status:'));
    for (const [k, v] of Object.entries(stats.byExecutionStatus)) console.log(`  ${colorExec(k as ExecutionStatus)}: ${v}`);

    console.log(chalk.bold('\nBy Priority:'));
    for (const [k, v] of Object.entries(stats.byPriority)) console.log(`  ${colorPriority(k as Priority)}: ${v}`);

    console.log(chalk.bold('\nBy Feature Area:'));
    for (const [k, v] of Object.entries(stats.byFeatureArea)) console.log(`  ${k}: ${v}`);
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
