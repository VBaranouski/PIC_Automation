#!/usr/bin/env npx tsx
/**
 * Test Scenario Tracker — Seed Script
 *
 * Parses `docs/ai/automation-testing-plan.md` and populates the SQLite DB
 * with all test scenario entries found in the markdown checklist.
 *
 * Usage:
 *   npx tsx scripts/seed-tracker.ts
 *   npx tsx scripts/seed-tracker.ts --dry-run
 */

import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { getDb, closeDb, getProjectRoot } from '../src/tracker/db';
import { upsertScenario, getStats } from '../src/tracker/operations';
import type { ScenarioStatus, Priority, FeatureArea, GroupLabel } from '../src/tracker/models';

// ── Config ────────────────────────────────────────────────────────────────────

const PLAN_PATH = path.join(getProjectRoot(), 'docs', 'ai', 'automation-testing-plan.md');
const DRY_RUN = process.argv.includes('--dry-run');

// ── Feature-area detection from spec paths ────────────────────────────────────

function detectFeatureArea(specFile: string, workflow: string): FeatureArea {
  const lower = specFile.toLowerCase() + ' ' + workflow.toLowerCase();
  if (lower.includes('auth/') || lower.includes('authentication')) return 'auth';
  if (lower.includes('landing/') || lower.includes('landing page')) return 'landing';
  if (lower.includes('products/') || lower.includes('product management') || lower.includes('product detail')) return 'products';
  if (lower.includes('releases/') || lower.includes('release')) return 'releases';
  if (lower.includes('doc/') || lower.includes('doc ') || lower.includes('digital offer certification')) return 'doc';
  if (lower.includes('report') || lower.includes('dashboard') || lower.includes('tableau')) return 'reports';
  if (lower.includes('backoffice') || lower.includes('back office') || lower.includes('back-office')) return 'backoffice';
  if (lower.includes('integration') || lower.includes('api') || lower.includes('jira') || lower.includes('jama') || lower.includes('intel')) return 'integrations';
  return 'other';
}

/** Map markdown checkbox to scenario status. */
function checkboxToStatus(checkbox: string, lineText: string): ScenarioStatus {
  if (checkbox === '[x]') return 'automated';
  if (checkbox === '[~]') {
    // Distinguish skipped vs known-failing vs deferred
    const lower = lineText.toLowerCase();
    if (lower.includes('test.fail') || lower.includes('known defect') || lower.includes('known bug')) return 'failed';
    if (lower.includes('deferred') || lower.includes('out of scope') || lower.includes('manual')) return 'skipped';
    return 'skipped';
  }
  // [ ] — not yet automated
  return 'pending';
}

/** Map P1/P2/P3 from the markdown line. */
function extractPriority(line: string): Priority {
  if (line.includes('**P1**')) return 'P1';
  if (line.includes('**P3**')) return 'P3';
  return 'P2';
}

/** Derive groups from priority and context. */
function deriveGroups(priority: Priority, status: ScenarioStatus, line: string, specFile: string): string[] {
  const groups: string[] = [];

  // P1 → smoke + critical
  if (priority === 'P1') {
    groups.push('smoke', 'critical');
  }

  // Everything non-manual gets regression
  if (status !== 'skipped' || !line.toLowerCase().includes('manual')) {
    groups.push('regression');
  }

  // Detect destructive
  if (line.toLowerCase().includes('destructive') || line.toLowerCase().includes('inactivat')) {
    groups.push('destructive');
  }

  // Manual-only
  if (line.toLowerCase().includes('manual testing only') || line.toLowerCase().includes('manual only')) {
    groups.push('manual-only');
  }

  // Edge cases
  if (line.toLowerCase().includes('edge case') || line.toLowerCase().includes('boundary')) {
    groups.push('edge-case');
  }

  // Integration
  if (line.toLowerCase().includes('sso') || line.toLowerCase().includes('jira') || line.toLowerCase().includes('jama') || line.toLowerCase().includes('api')) {
    groups.push('integration');
  }

  return [...new Set(groups)];
}

// ── Markdown parser ───────────────────────────────────────────────────────────

interface ParsedScenario {
  id: string;
  title: string;
  description: string;
  status: ScenarioStatus;
  priority: Priority;
  feature_area: FeatureArea;
  spec_file: string;
  workflow: string;
  groups: string[];
}

function parseTestingPlan(content: string): ParsedScenario[] {
  const lines = content.split('\n');
  const scenarios: ParsedScenario[] = [];
  const seenIds = new Set<string>();

  let currentWorkflow = '';
  let currentSpecFile = '';
  let autoIncrementCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track current WORKFLOW heading
    const workflowMatch = line.match(/^#{1,2}\s+(WORKFLOW\s+\d+.*)/i);
    if (workflowMatch) {
      currentWorkflow = workflowMatch[1].replace(/[—–-]+\s*$/, '').trim();
    }

    // Track sub-section headings (### 3.1, ### 4.7 etc.)
    const subSectionMatch = line.match(/^#{2,3}\s+([\d.]+\s+.*)/);
    if (subSectionMatch) {
      const sectionName = subSectionMatch[1].trim();
      if (!currentWorkflow) {
        currentWorkflow = sectionName;
      }
    }

    // Track current Spec file from "**Spec:**" lines
    const specMatch = line.match(/\*\*Spec:\*\*\s*`([^`]+)`/);
    if (specMatch) {
      // Take the first spec file mentioned
      currentSpecFile = specMatch[1];
      // Normalise: ensure it starts with tests/
      if (!currentSpecFile.startsWith('tests/')) {
        currentSpecFile = 'tests/' + currentSpecFile;
      }
    }

    // Match checklist lines: - [x] **P1** `ID` title  OR  - [x] **P1** title (no ID)
    const checklistMatch = line.match(/^-\s+(\[[ x~]\])\s+\*\*(P[123])\*\*\s+(.*)/);
    if (!checklistMatch) continue;

    const checkbox = checklistMatch[1];
    const priorityStr = checklistMatch[2] as Priority;
    let rest = checklistMatch[3];

    // Extract explicit test case ID like `AUTH-LOGIN-001`
    let testId = '';
    const idMatch = rest.match(/`([A-Z][\w-]+-\d+)`/);
    if (idMatch) {
      testId = idMatch[1];
      rest = rest.replace(idMatch[0], '').trim();
    }

    // Clean up the title
    let title = rest
      .replace(/^\s*/, '')
      .replace(/\s*\*\(.*?\)\*\s*$/, '')   // Remove italic notes at end
      .replace(/\s*—\s*`[^`]+`.*$/, '')    // Remove inline spec refs
      .trim();

    // Remove leading/trailing formatting
    title = title.replace(/^[—–-]\s*/, '').trim();

    // If no explicit ID found, generate one
    if (!testId) {
      autoIncrementCounter++;
      // Try to derive from workflow/section
      const areaPrefix = currentWorkflow
        .replace(/^WORKFLOW\s+\d+\s*[—–-]?\s*/i, '')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toUpperCase()
        .slice(0, 20);
      testId = `${areaPrefix || 'AUTO'}-${String(autoIncrementCounter).padStart(3, '0')}`;
    }

    // Skip duplicate IDs (keep first occurrence)
    if (seenIds.has(testId)) {
      // Append a suffix to make unique
      let suffix = 2;
      while (seenIds.has(`${testId}-${String(suffix).padStart(2, '0')}`)) suffix++;
      testId = `${testId}-${String(suffix).padStart(2, '0')}`;
    }
    seenIds.add(testId);

    // Build description from blockquote lines that follow (> lines)
    let description = '';
    let j = i + 1;
    while (j < lines.length && lines[j].match(/^\s*>/)) {
      description += lines[j].replace(/^\s*>\s?/, '').trim() + ' ';
      j++;
    }
    description = description.trim();

    const status = checkboxToStatus(checkbox, line + ' ' + description);
    const feature_area = detectFeatureArea(currentSpecFile, currentWorkflow);
    const groups = deriveGroups(priorityStr, status, line + ' ' + description, currentSpecFile);

    scenarios.push({
      id: testId,
      title: title.slice(0, 200),
      description: description.slice(0, 500),
      status,
      priority: priorityStr,
      feature_area,
      spec_file: currentSpecFile,
      workflow: currentWorkflow.slice(0, 100),
      groups,
    });
  }

  return scenarios;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log(chalk.cyan.bold('\n  🌱 Test Scenario Tracker — Seed from Testing Plan\n'));

  if (!fs.existsSync(PLAN_PATH)) {
    console.log(chalk.red(`  Testing plan not found: ${PLAN_PATH}`));
    process.exit(1);
  }

  const content = fs.readFileSync(PLAN_PATH, 'utf-8');
  console.log(chalk.gray(`  Parsing: ${PLAN_PATH}`));
  console.log(chalk.gray(`  File size: ${(content.length / 1024).toFixed(1)} KB, ${content.split('\n').length} lines\n`));

  const scenarios = parseTestingPlan(content);
  console.log(chalk.white(`  Parsed ${chalk.bold(String(scenarios.length))} test scenarios from the plan.\n`));

  if (DRY_RUN) {
    console.log(chalk.yellow('  DRY RUN — no changes written to DB.\n'));
    // Print summary
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byArea: Record<string, number> = {};
    for (const s of scenarios) {
      byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      byPriority[s.priority] = (byPriority[s.priority] || 0) + 1;
      byArea[s.feature_area] = (byArea[s.feature_area] || 0) + 1;
    }
    console.log('  By Status:', byStatus);
    console.log('  By Priority:', byPriority);
    console.log('  By Feature Area:', byArea);

    // Show first 10 entries
    console.log(chalk.cyan('\n  First 10 parsed scenarios:'));
    for (const s of scenarios.slice(0, 10)) {
      console.log(`    ${s.priority} [${s.status}] ${s.id}: ${s.title.slice(0, 60)} (${s.feature_area}, groups: ${s.groups.join(',')})`);
    }
    console.log();
    return;
  }

  // Initialise DB
  getDb();

  let created = 0;
  let updated = 0;

  for (const s of scenarios) {
    const result = upsertScenario(s);
    if (result.action === 'created') created++;
    else updated++;
  }

  console.log(chalk.green(`  ✓ Created: ${created}`));
  console.log(chalk.blue(`  ↻ Updated: ${updated}`));

  // Print stats
  const stats = getStats();
  console.log(chalk.cyan(`\n  DB now contains ${stats.total} scenarios total.\n`));

  closeDb();
}

main();
