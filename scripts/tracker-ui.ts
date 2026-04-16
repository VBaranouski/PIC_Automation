/**
 * Test Scenario Tracker — Web UI Server
 *
 * Express REST API that wraps all tracker DB operations
 * and serves a single-page frontend dashboard.
 *
 * Usage:  npx tsx scripts/tracker-ui.ts
 * Opens:  http://localhost:3005
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'fs';
import {
  addScenario,
  getScenario,
  updateScenario,
  removeScenario,
  setAutomationState,
  setExecutionStatus,
  holdScenario,
  unholdScenario,
  addGroupToScenario,
  removeGroupFromScenario,
  listAllGroups,
  addGroup,
  listScenarios,
  syncWithSpecFiles,
  getStats,
  exportToJson,
  importFromJson,
  isValidAutomationState,
  isValidExecutionStatus,
  isValidPriority,
  isValidFeatureArea,
  getScenarioDetails,
  setScenarioDetails,
  getDistinctWorkflows,
} from '../src/tracker/operations';
import {
  AUTOMATION_STATES,
  EXECUTION_STATUSES,
  PRIORITIES,
  FEATURE_AREAS,
  DEFAULT_GROUPS,
} from '../src/tracker/models';
import type { ListFilters, TrackerExport, AutomationState, ExecutionStatus } from '../src/tracker/models';
import { getDbPath, closeDb } from '../src/tracker/db';

// ── App setup ─────────────────────────────────────────────────────────────────

const app = express();
const PORT = Number(process.env.TRACKER_PORT) || 3005;

app.use(express.json({ limit: '10mb' }));

// Express 5 types params as string | string[]; our routes always have single-value params
const param = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : String(v ?? '');

// Serve the SPA
const UI_DIR = path.resolve(__dirname, '..', 'src', 'tracker', 'ui');
app.use('/ui', express.static(UI_DIR));

// Serve allure-report static files (so the embedded Allure report works)
const ALLURE_REPORT_DIR = path.resolve(__dirname, '..', 'allure-report');
const ALLURE_RESULTS_DIR = path.resolve(__dirname, '..', 'allure-results');
const ALLURE_GENERATE_ARGS = ['allure', 'generate', 'allure-results', '-o', 'allure-report', '--config', 'config/allure.config.ts'];
const JSON_REPORT_PATH = path.resolve(__dirname, '..', 'test-results', 'results.json');
app.use('/allure-report', express.static(ALLURE_REPORT_DIR, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
  },
}));

// Fallback: allure-report directory doesn't exist yet (must come after static middleware)
app.use('/allure-report', (_req: Request, res: Response) => {
  const hasResults = existsSync(ALLURE_RESULTS_DIR);
  const heading = hasResults ? 'Test results found — report not generated yet' : 'No Allure report found';
  const detail = hasResults
    ? 'Tests were executed. Generate the HTML report with:'
    : 'Run your tests first, then generate the report:';
  res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><title>No Allure Report</title>
<style>body{background:#0e0e0e;color:#adaaaa;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:16px}
h1{color:#fff;font-size:1.5rem;margin:0}p{margin:0;font-size:.875rem}
code{background:#1a1a1a;padding:4px 10px;border-radius:4px;color:#ff9157;font-size:.8rem}
</style></head>
<body>
  <h1>${heading}</h1>
  <p>${detail}</p>
  <code>npm run report:allure:generate</code>
</body>
</html>`);
});

// Root redirect → SPA
app.get('/', (_req: Request, res: Response) => {
  res.redirect('/ui/index.html');
});

// ── Error wrapper ─────────────────────────────────────────────────────────────

function wrap(fn: (req: Request, res: Response) => Promise<void> | void) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = fn(req, res);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeWorkspaceSpecPath(filePath: string | undefined): string {
  if (!filePath) return '';
  const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  if (path.isAbsolute(normalized)) {
    return path.relative(PROJECT_ROOT, normalized).replace(/\\/g, '/').replace(/^\.\//, '');
  }
  return normalized;
}

function stripSubsectionPrefix(subsection: string | undefined): string {
  return String(subsection ?? '').replace(/^\d+(?:\.\d+)*\s+/, '').trim();
}

interface ParsedSpecTestTarget {
  scenarioId: string;
  testTitle: string;
  descriptionText: string;
}

interface ParsedSpecRunTargets {
  tests: ParsedSpecTestTarget[];
  scenarioTitleById: Map<string, string>;
  subsectionTitleByName: Map<string, string>;
}

const parsedSpecRunTargetsCache = new Map<string, ParsedSpecRunTargets>();

function getSpecContent(specFile: string): string {
  const candidates = [
    path.join(PROJECT_ROOT, specFile),
    path.join(PROJECT_ROOT, 'tests', specFile),
  ];
  const absPath = candidates.find((candidate) => existsSync(candidate));
  return absPath ? readFileSync(absPath, 'utf-8') : '';
}

function parseSubsectionTitleMap(content: string): Map<string, string> {
  const subsectionTitleByName = new Map<string, string>();
  let pendingSubsection = '';

  for (const line of content.split(/\r?\n/)) {
    const workflowMatch = line.match(/^\s*\/\/\s*WORKFLOW\s+(\d+(?:\.\d+)*)\s+[—–-]\s+(.+?)\s*$/);
    if (workflowMatch) {
      pendingSubsection = `${workflowMatch[1]} ${workflowMatch[2].trim()}`;
      continue;
    }

    const describeMatch = line.match(/test\.describe\(\s*(['"`])(.+?)\1\s*,/);
    if (pendingSubsection && describeMatch) {
      subsectionTitleByName.set(pendingSubsection, describeMatch[2].trim());
      pendingSubsection = '';
    }
  }

  return subsectionTitleByName;
}

function getSpecRunTargets(specFile: string): ParsedSpecRunTargets {
  const normalizedSpecFile = normalizeWorkspaceSpecPath(specFile);
  const cached = parsedSpecRunTargetsCache.get(normalizedSpecFile);
  if (cached) return cached;

  const content = getSpecContent(normalizedSpecFile);
  const tests: ParsedSpecTestTarget[] = [];
  const scenarioTitleById = new Map<string, string>();
  const subsectionTitleByName = parseSubsectionTitleMap(content);
  const testRegex = /test(?:\.(?:skip|fixme|fail|only))?\s*\(\s*(['"`])([\s\S]*?)\1\s*,[\s\S]*?allure\.description\(([\s\S]*?)\);/g;

  for (const match of content.matchAll(testRegex)) {
    const testTitle = String(match[2] ?? '').trim();
    const description = extractQuotedText(String(match[3] ?? ''));
    const scenarioId = extractScenarioIdFromDescription(description);
    const descriptionText = extractScenarioTextFromDescription(description) || testTitle;

    if (!testTitle) continue;

    tests.push({ scenarioId, testTitle, descriptionText });
    if (scenarioId && !scenarioTitleById.has(scenarioId)) {
      scenarioTitleById.set(scenarioId, testTitle);
    }
  }

  const parsed = { tests, scenarioTitleById, subsectionTitleByName };
  parsedSpecRunTargetsCache.set(normalizedSpecFile, parsed);
  return parsed;
}

function resolveScenarioRunGrep(
  specFile: string,
  scenarioId: string,
  title: string | undefined,
  description: string | undefined,
): string {
  const targets = getSpecRunTargets(specFile);
  const direct = targets.scenarioTitleById.get(String(scenarioId || '').toUpperCase());
  if (direct) return escapeRegex(direct);

  const candidateText = `${title ?? ''} ${description ?? ''}`.trim();
  const candidateTokens = tokenizeMatchText(candidateText || scenarioId);
  let bestTitle = '';
  let bestScore = 0;

  for (const target of targets.tests) {
    const normalizedTestTitle = normalizeText(target.testTitle);
    const normalizedDescriptionText = normalizeText(target.descriptionText);
    const normalizedCandidateText = normalizeText(candidateText);

    if (
      normalizedCandidateText
      && (
        normalizedTestTitle.includes(normalizedCandidateText)
        || normalizedCandidateText.includes(normalizedTestTitle)
        || normalizedDescriptionText.includes(normalizedCandidateText)
        || normalizedCandidateText.includes(normalizedDescriptionText)
      )
    ) {
      const score = Math.max(normalizedTestTitle.length, normalizedDescriptionText.length, normalizedCandidateText.length);
      if (score > bestScore) {
        bestScore = score;
        bestTitle = target.testTitle;
      }
    }

    const titleScore = overlapScore(candidateTokens, tokenizeMatchText(target.testTitle));
    const descriptionScore = overlapScore(candidateTokens, tokenizeMatchText(target.descriptionText));
    const fuzzyScore = Math.max(titleScore, descriptionScore);
    if (fuzzyScore >= 0.45 && fuzzyScore > bestScore) {
      bestScore = fuzzyScore;
      bestTitle = target.testTitle;
    }
  }

  return bestTitle ? escapeRegex(bestTitle) : '';
}

function resolveSubsectionRunGrep(specFile: string, subsection: string): string {
  const targets = getSpecRunTargets(specFile);
  const direct = targets.subsectionTitleByName.get(subsection);
  if (direct) return escapeRegex(direct);

  const strippedSubsection = stripSubsectionPrefix(subsection);
  const normalizedSubsection = normalizeText(strippedSubsection || subsection);
  let bestDescribe = '';
  let bestScore = 0;

  for (const [subsectionName, describeTitle] of targets.subsectionTitleByName.entries()) {
    const normalizedSubsectionName = normalizeText(stripSubsectionPrefix(subsectionName) || subsectionName);
    const normalizedDescribeTitle = normalizeText(describeTitle);

    if (
      normalizedSubsection
      && (
        normalizedDescribeTitle.includes(normalizedSubsection)
        || normalizedSubsection.includes(normalizedDescribeTitle)
        || normalizedSubsectionName.includes(normalizedSubsection)
        || normalizedSubsection.includes(normalizedSubsectionName)
      )
    ) {
      const score = Math.max(normalizedDescribeTitle.length, normalizedSubsectionName.length, normalizedSubsection.length);
      if (score > bestScore) {
        bestScore = score;
        bestDescribe = describeTitle;
      }
    }

    const subsectionScore = overlapScore(tokenizeMatchText(strippedSubsection), tokenizeMatchText(describeTitle));
    if (subsectionScore >= 0.45 && subsectionScore > bestScore) {
      bestScore = subsectionScore;
      bestDescribe = describeTitle;
    }
  }

  return bestDescribe ? escapeRegex(bestDescribe) : '';
}

function hasExistingSpecFile(specFile: string): boolean {
  const normalizedSpecFile = normalizeWorkspaceSpecPath(specFile);
  return Boolean(normalizedSpecFile) && existsSync(path.join(PROJECT_ROOT, normalizedSpecFile));
}

function enrichScenario<T extends { id: string; title: string; description: string; spec_file: string }>(scenario: T): T & { hasSpecFile: boolean; canRunIndividually: boolean } {
  const hasSpecFile = hasExistingSpecFile(scenario.spec_file);
  return {
    ...scenario,
    hasSpecFile,
    canRunIndividually: hasSpecFile && Boolean(resolveScenarioRunGrep(scenario.spec_file, scenario.id, scenario.title, scenario.description)),
  };
}

function normalizeSpecPath(filePath: string | undefined): string {
  if (!filePath) return '';
  const normalized = filePath.replace(/\\/g, '/');
  const withoutTestsPrefix = normalized.replace(/^tests\//, '');
  if (path.isAbsolute(normalized)) {
    return path.relative(path.join(PROJECT_ROOT, 'tests'), normalized).replace(/\\/g, '/').replace(/^\.\.\//, '');
  }
  return withoutTestsPrefix;
}

function normalizeText(value: string | undefined): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/verify\s+/g, '')
    .replace(/should\s+/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function inferFeatureAreaFromSpecPath(specFile: string): string {
  const normalized = normalizeSpecPath(specFile);
  if (normalized.startsWith('auth/')) return 'auth';
  if (normalized.startsWith('landing/')) return 'landing';
  if (normalized.startsWith('products/')) return 'products';
  if (normalized.startsWith('releases/')) return 'releases';
  if (normalized.startsWith('doc/')) return 'doc';
  return '';
}

function normalizeMatchToken(token: string): string {
  return token
    .replace(/(ing|ed|es|s)$/i, '')
    .trim();
}

function tokenizeMatchText(value: string | undefined): string[] {
  const stopWords = new Set(['the', 'and', 'for', 'with', 'when', 'that', 'this', 'from', 'into', 'then', 'than', 'are', 'was', 'were', 'has', 'have', 'had', 'not', 'all', 'any', 'per', 'via', 'tab', 'page', 'grid', 'data']);
  return normalizeText(value)
    .split(/\s+/)
    .map(normalizeMatchToken)
    .filter((token) => token.length >= 3 && !stopWords.has(token));
}

function overlapScore(left: string[], right: string[]): number {
  if (!left.length || !right.length) return 0;
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  let shared = 0;
  for (const token of leftSet) {
    if (rightSet.has(token)) shared += 1;
  }
  return shared / Math.max(leftSet.size, rightSet.size);
}

function executionStatusRank(status: ExecutionStatus): number {
  switch (status) {
    case 'failed-defect': return 4;
    case 'passed': return 3;
    case 'skipped': return 2;
    case 'not-executed':
    default:
      return 1;
  }
}

function pickHigherExecutionStatus(current: ExecutionStatus | undefined, next: ExecutionStatus): ExecutionStatus {
  if (!current) return next;
  return executionStatusRank(next) > executionStatusRank(current) ? next : current;
}

function extractScenarioIdFromDescription(description: string): string {
  const match = description.match(/([A-Z]{2,}(?:-[A-Z0-9]+)*-\d+|WF\d{2}-\d{4})/i);
  return match ? match[1].toUpperCase() : '';
}

function extractScenarioTextFromDescription(description: string): string {
  const parts = description.split(/:\s+/, 2);
  return parts.length === 2 ? parts[1].trim() : description.trim();
}

function extractQuotedText(expression: string): string {
  const parts = Array.from(expression.matchAll(/(['"])((?:\\.|(?!\1)[\s\S])*)\1/g)).map((match) => match[2]);
  return parts.join('').replace(/\s+/g, ' ').trim();
}

function buildScenarioLookupForSpec(specFile: string): Map<string, { id: string; searchText: string }> {
  const lookup = new Map<string, { id: string; searchText: string }>();
  const targets = getSpecRunTargets(specFile);

  for (const target of targets.tests) {
    const searchText = normalizeText(target.descriptionText || target.testTitle);
    lookup.set(normalizeText(target.testTitle), { id: target.scenarioId, searchText });
  }

  return lookup;
}

function resolveScenarioIdForResult(
  scenarioLookup: Map<string, { id: string; searchText: string }>,
  scenariosBySpec: ReturnType<typeof listScenarios>,
  testTitle: string,
): string {
  const normalizedTitle = normalizeText(testTitle);
  const direct = scenarioLookup.get(normalizedTitle);
  if (direct?.id && scenariosBySpec.some((scenario) => scenario.id === direct.id)) {
    return direct.id;
  }

  const candidateText = direct?.searchText || normalizedTitle;
  let bestMatch = '';
  let bestScore = 0;
  const candidateTokens = tokenizeMatchText(candidateText || testTitle);

  for (const scenario of scenariosBySpec) {
    const titleText = normalizeText(scenario.title);
    const descriptionText = normalizeText(scenario.description);
    if (candidateText && (titleText.includes(candidateText) || candidateText.includes(titleText) || (descriptionText && (descriptionText.includes(candidateText) || candidateText.includes(descriptionText))))) {
      const score = Math.max(titleText.length, descriptionText.length, candidateText.length);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = scenario.id;
      }
    }

    const titleScore = overlapScore(candidateTokens, tokenizeMatchText(scenario.title));
    const descriptionScore = overlapScore(candidateTokens, tokenizeMatchText(scenario.description));
    const fuzzyScore = Math.max(titleScore, descriptionScore);
    if (fuzzyScore >= 0.45 && fuzzyScore > bestScore) {
      bestScore = fuzzyScore;
      bestMatch = scenario.id;
    }
  }

  return bestMatch;
}

function mapPlaywrightStatus(status: string | undefined): ExecutionStatus {
  switch (String(status || '').toLowerCase()) {
    case 'passed':
      return 'passed';
    case 'skipped':
      return 'skipped';
    case 'failed':
    case 'timedout':
    case 'interrupted':
      return 'failed-defect';
    default:
      return 'not-executed';
  }
}

function extractResultMessage(result: any): string {
  const errors = Array.isArray(result?.errors) ? result.errors : [];
  for (const error of errors) {
    const message = String(error?.message || error?.value || '').trim();
    if (message) return message;
  }

  const directMessage = String(result?.error?.message || result?.error?.value || '').trim();
  if (directMessage) return directMessage;

  return '';
}

function extractTestAnnotationReason(test: any): string {
  const annotations = Array.isArray(test?.annotations) ? test.annotations : [];
  for (const annotation of annotations) {
    const type = String(annotation?.type || '').toLowerCase();
    if (!['skip', 'fixme', 'fail'].includes(type)) continue;
    const description = String(annotation?.description || '').trim();
    if (description) return description;
  }
  return '';
}

function normalizeExecutionNoteMessage(message: string): string {
  return message
    .replace(/\s+/g, ' ')
    .replace(/^Error:\s*/i, '')
    .trim();
}

function isDeferredFixme(test: any): boolean {
  const annotations = Array.isArray(test?.annotations) ? test.annotations : [];
  return annotations.some((annotation) => String(annotation?.type || '').toLowerCase() === 'fixme');
}

function isTimeoutFailure(result: any, resultMessage: string): boolean {
  const normalizedStatus = String(result?.status || '').toLowerCase();
  if (normalizedStatus === 'timedout' || normalizedStatus === 'timed-out') return true;
  return /timeout(?:\s+of)?|test timeout exceeded/i.test(resultMessage);
}

function formatExecutionNote(test: any, result: any, status: ExecutionStatus): string {
  const annotationReason = extractTestAnnotationReason(test);
  const resultMessage = normalizeExecutionNoteMessage(extractResultMessage(result));
  const reason = annotationReason || resultMessage;

  if (status === 'skipped') {
    return reason ? `Skipped: ${reason}` : '';
  }

  if (status === 'failed-defect') {
    if (isTimeoutFailure(result, resultMessage)) {
      return 'Failed: Timeout Error. Element is missing or has not been loaded due to perfomance issue.';
    }
    return `Failed: ${reason || 'Execution failed during Playwright run.'}`;
  }

  return '';
}

function mergeExecutionNotes(existingNote: string, runtimeNote: string): string {
  const existing = String(existingNote || '').trim();
  const runtime = String(runtimeNote || '').trim();
  if (!runtime) return existing;
  if (!existing) return runtime;
  if (existing === runtime || existing.includes(runtime)) return existing;
  return `${runtime}\n\n${existing}`;
}

function loadPlaywrightSpecStatuses(): Map<string, 'passed' | 'failed'> {
  const statuses = new Map<string, 'passed' | 'failed'>();
  if (!existsSync(JSON_REPORT_PATH)) return statuses;

  try {
    const report = JSON.parse(readFileSync(JSON_REPORT_PATH, 'utf-8'));
    const applyStatus = (filePath: string | undefined, status: 'passed' | 'failed' | null) => {
      if (!filePath || !status) return;
      const normalized = normalizeSpecPath(filePath);
      const existing = statuses.get(normalized);
      if (existing === 'failed') return;
      if (status === 'failed' || !existing) {
        statuses.set(normalized, status);
      }
    };

    const walkSuite = (suite: any, inheritedFile = '') => {
      const currentFile = normalizeSpecPath(suite?.file || inheritedFile || '');

      for (const spec of suite?.specs || []) {
        const specFile = normalizeSpecPath(spec?.file || currentFile || '');
        const resultStatuses = (spec?.tests || []).flatMap((test: any) =>
          (test?.results || []).map((result: any) => String(result?.status || '').toLowerCase()),
        );
        const status = resultStatuses.some((item: string) => ['failed', 'timedout', 'interrupted'].includes(item))
          ? 'failed'
          : resultStatuses.includes('passed')
            ? 'passed'
            : null;
        applyStatus(specFile, status);
      }

      for (const child of suite?.suites || []) {
        walkSuite(child, currentFile);
      }
    };

    for (const suite of report?.suites || []) {
      walkSuite(suite);
    }
  } catch {
    return statuses;
  }

  return statuses;
}

function listSpecFilesInJsonReport(): string[] {
  if (!existsSync(JSON_REPORT_PATH)) return [];

  try {
    const report = JSON.parse(readFileSync(JSON_REPORT_PATH, 'utf-8'));
    const specFiles = new Set<string>();

    const walkSuite = (suite: any, inheritedFile = '') => {
      const currentFile = normalizeSpecPath(suite?.file || inheritedFile || '');
      for (const spec of suite?.specs || []) {
        const specFile = normalizeSpecPath(spec?.file || currentFile || '');
        if (specFile) specFiles.add(specFile);
      }
      for (const child of suite?.suites || []) {
        walkSuite(child, currentFile);
      }
    };

    for (const suite of report?.suites || []) {
      walkSuite(suite);
    }

    return [...specFiles];
  } catch {
    return [];
  }
}

function syncScenarioStatusesFromRun(specFiles: string[], _fallbackStatus: 'passed' | 'failed' | null): void {
  if (!existsSync(JSON_REPORT_PATH)) return;

  const report = JSON.parse(readFileSync(JSON_REPORT_PATH, 'utf-8'));
  const normalizedSpecFiles = specFiles.map(normalizeSpecPath);
  const allScenarios = listScenarios();
  const trackedScenarios = new Map<string, (typeof allScenarios)>();
  for (const specFile of normalizedSpecFiles) {
    const featureArea = inferFeatureAreaFromSpecPath(specFile);
    trackedScenarios.set(
      specFile,
      allScenarios.filter((scenario) => {
        const scenarioSpecFile = normalizeSpecPath(scenario.spec_file);
        if (scenarioSpecFile === specFile) return true;
        return !scenarioSpecFile && Boolean(featureArea) && scenario.feature_area === featureArea;
      }),
    );
  }

  const statusByScenario = new Map<string, ExecutionStatus>();
  const noteByScenario = new Map<string, string>();
  const matchedScenarioSpecFiles = new Map<string, string>();
  const deferredFixmeByScenario = new Map<string, boolean>();

  const walkSuite = (suite: any, inheritedFile = '') => {
    const currentFile = normalizeSpecPath(suite?.file || inheritedFile || '');

    for (const spec of suite?.specs || []) {
      const specFile = normalizeSpecPath(spec?.file || currentFile || '');
      if (!normalizedSpecFiles.includes(specFile)) continue;

      const specScenarios = trackedScenarios.get(specFile) || [];
      if (!specScenarios.length) continue;

      const scenarioLookup = buildScenarioLookupForSpec(specFile);

      for (const test of spec?.tests || []) {
        const scenarioId = resolveScenarioIdForResult(
          scenarioLookup,
          specScenarios,
          String(test?.title || spec?.title || ''),
        );
        if (!scenarioId) continue;
        matchedScenarioSpecFiles.set(scenarioId, specFile);
        deferredFixmeByScenario.set(scenarioId, isDeferredFixme(test));

        for (const result of test?.results || []) {
          const mappedStatus = mapPlaywrightStatus(result?.status);
          if (mappedStatus === 'not-executed') continue;
          const currentStatus = statusByScenario.get(scenarioId);
          const nextStatus = pickHigherExecutionStatus(currentStatus, mappedStatus);
          statusByScenario.set(scenarioId, nextStatus);

          const runtimeNote = formatExecutionNote(test, result, mappedStatus);
          if (!runtimeNote) continue;
          if (!currentStatus || executionStatusRank(mappedStatus) >= executionStatusRank(currentStatus)) {
            noteByScenario.set(scenarioId, runtimeNote);
          }
        }
      }
    }

    for (const child of suite?.suites || []) {
      walkSuite(child, currentFile);
    }
  };

  for (const suite of report?.suites || []) {
    walkSuite(suite);
  }

  const matchedScenarioIds = new Set<string>([
    ...Array.from(statusByScenario.keys()),
    ...Array.from(matchedScenarioSpecFiles.keys()),
  ]);

  for (const scenario of allScenarios.filter((item) => matchedScenarioIds.has(item.id))) {
    if (scenario.automation_state === 'on-hold') continue;

    const nextStatus = statusByScenario.get(scenario.id) || 'not-executed';
    const matchedSpecFile = matchedScenarioSpecFiles.get(scenario.id);
    if (matchedSpecFile && normalizeSpecPath(scenario.spec_file) !== matchedSpecFile) {
      updateScenario(scenario.id, { spec_file: path.join('tests', matchedSpecFile) });
    }
    if (scenario.automation_state === 'pending' && nextStatus !== 'not-executed' && !deferredFixmeByScenario.get(scenario.id)) {
      setAutomationState(scenario.id, 'automated');
    }

    setExecutionStatus(scenario.id, nextStatus);

    const existingDetails = getScenarioDetails(scenario.id);
    const runtimeNote = noteByScenario.get(scenario.id) || '';
    const mergedNotes = mergeExecutionNotes(existingDetails?.execution_notes ?? scenario.execution_notes ?? '', runtimeNote);
    setScenarioDetails(scenario.id, {
      steps: existingDetails?.steps ?? scenario.steps ?? [],
      expected_results: existingDetails?.expected_results ?? scenario.expected_results ?? [],
      execution_notes: mergedNotes,
    });
  }
}
}

// ── API: Scenarios ────────────────────────────────────────────────────────────

/** GET /api/scenarios — list with optional filters */
app.get(
  '/api/scenarios',
  wrap((req, res) => {
    const filters: ListFilters = {};
    const q = req.query;

    if (q.automation_state) {
      const v = param(q.automation_state as any);
      if (!isValidAutomationState(v)) {
        res.status(400).json({ error: `Invalid automation_state: ${v}` });
        return;
      }
      filters.automation_state = v;
    }
    if (q.execution_status) {
      const v = param(q.execution_status as any);
      if (!isValidExecutionStatus(v)) {
        res.status(400).json({ error: `Invalid execution_status: ${v}` });
        return;
      }
      filters.execution_status = v;
    }
    if (q.priority)         filters.priority         = param(q.priority as any) as any;
    if (q.feature_area)     filters.feature_area     = param(q.feature_area as any) as any;
    if (q.group)            filters.group            = param(q.group as any);
    if (q.workflow)         filters.workflow         = param(q.workflow as any);
    if (q.search)           filters.search           = param(q.search as any);
    if (q.spec_file)        filters.spec_file        = param(q.spec_file as any);

    const scenarios = listScenarios(Object.keys(filters).length ? filters : undefined);

    // Server-side pagination — allow up to 5 000 rows so the UI can load all workflows in one call
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(5000, Math.max(1, Number(req.query.limit) || 50));
    const total = scenarios.length;
    const start = (page - 1) * limit;
    const items = scenarios.slice(start, start + limit).map(enrichScenario);

    res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  }),
);

/** GET /api/scenarios/:id — single scenario */
app.get(
  '/api/scenarios/:id',
  wrap((req, res) => {
    const id = param(req.params.id);
    const scenario = getScenario(id);
    if (!scenario) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    res.json(enrichScenario(scenario));
  }),
);

/** POST /api/scenarios — add new scenario */
app.post(
  '/api/scenarios',
  wrap((req, res) => {
    const { id, title, description, automation_state, execution_status, priority, feature_area, spec_file, workflow, groups } = req.body;
    if (!id || !title) {
      res.status(400).json({ error: 'id and title are required' });
      return;
    }
    if (automation_state && !isValidAutomationState(automation_state)) {
      res.status(400).json({ error: `Invalid automation_state: ${automation_state}` });
      return;
    }
    if (execution_status && !isValidExecutionStatus(execution_status)) {
      res.status(400).json({ error: `Invalid execution_status: ${execution_status}` });
      return;
    }
    if (priority && !isValidPriority(priority)) {
      res.status(400).json({ error: `Invalid priority: ${priority}` });
      return;
    }
    if (feature_area && !isValidFeatureArea(feature_area)) {
      res.status(400).json({ error: `Invalid feature_area: ${feature_area}` });
      return;
    }
    try {
      const scenario = addScenario({ id, title, description, automation_state, execution_status, priority, feature_area, spec_file, workflow, groups });
      res.status(201).json(scenario);
    } catch (err: any) {
      if (err.message?.includes('UNIQUE constraint')) {
        res.status(409).json({ error: `Scenario ${id} already exists` });
      } else {
        throw err;
      }
    }
  }),
);

/** PUT /api/scenarios/:id — update scenario */
app.put(
  '/api/scenarios/:id',
  wrap((req, res) => {
    const { title, description, automation_state, execution_status, priority, feature_area, spec_file, workflow, groups } = req.body;
    if (automation_state && !isValidAutomationState(automation_state)) {
      res.status(400).json({ error: `Invalid automation_state: ${automation_state}` });
      return;
    }
    if (execution_status && !isValidExecutionStatus(execution_status)) {
      res.status(400).json({ error: `Invalid execution_status: ${execution_status}` });
      return;
    }
    if (priority && !isValidPriority(priority)) {
      res.status(400).json({ error: `Invalid priority: ${priority}` });
      return;
    }
    if (feature_area && !isValidFeatureArea(feature_area)) {
      res.status(400).json({ error: `Invalid feature_area: ${feature_area}` });
      return;
    }
    const id = param(req.params.id);
    const updated = updateScenario(id, { title, description, automation_state, execution_status, priority, feature_area, spec_file, workflow, groups });
    if (!updated) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    res.json(updated);
  }),
);

/** DELETE /api/scenarios/:id — remove scenario */
app.delete(
  '/api/scenarios/:id',
  wrap((req, res) => {
    const id = param(req.params.id);
    const removed = removeScenario(id);
    if (!removed) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    res.json({ ok: true });
  }),
);

// ── API: Status shortcuts ─────────────────────────────────────────────────────

// POST /api/scenarios/:id/auto-state  { state: AutomationState }
app.post(
  '/api/scenarios/:id/auto-state',
  wrap((req, res) => {
    const id = param(req.params.id);
    const state = req.body?.state;
    if (!isValidAutomationState(state)) {
      res.status(400).json({ error: `Invalid automation state: ${state}` });
      return;
    }
    const updated = setAutomationState(id, state);
    if (!updated) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    res.json(updated);
  }),
);

// POST /api/scenarios/:id/exec-status  { status: ExecutionStatus }
app.post(
  '/api/scenarios/:id/exec-status',
  wrap((req, res) => {
    const id = param(req.params.id);
    const status = req.body?.status;
    if (!isValidExecutionStatus(status)) {
      res.status(400).json({ error: `Invalid execution status: ${status}` });
      return;
    }
    const updated = setExecutionStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    res.json(updated);
  }),
);

/** POST /api/scenarios/:id/hold — put on hold */
app.post(
  '/api/scenarios/:id/hold',
  wrap((req, res) => {
    const id = param(req.params.id);
    const updated = holdScenario(id);
    if (!updated) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    res.json(updated);
  }),
);

/** POST /api/scenarios/:id/unhold — remove from hold */
app.post(
  '/api/scenarios/:id/unhold',
  wrap((req, res) => {
    const id = param(req.params.id);
    const updated = unholdScenario(id);
    if (!updated) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    res.json(updated);
  }),
);

// ── API: Groups ───────────────────────────────────────────────────────────────

/** GET /api/groups — list all groups with counts */
app.get(
  '/api/groups',
  wrap((_req, res) => {
    res.json(listAllGroups());
  }),
);

/** POST /api/groups — create a new group label */
app.post(
  '/api/groups',
  wrap((req, res) => {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ error: 'name is required' });
      return;
    }
    addGroup(name, description);
    res.status(201).json({ ok: true });
  }),
);

/** POST /api/scenarios/:id/groups — add group to scenario */
app.post(
  '/api/scenarios/:id/groups',
  wrap((req, res) => {
    const { group } = req.body;
    if (!group) {
      res.status(400).json({ error: 'group is required' });
      return;
    }
    const id = param(req.params.id);
    const scenario = getScenario(id);
    if (!scenario) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    addGroupToScenario(id, group);
    res.json(getScenario(id));
  }),
);

/** DELETE /api/scenarios/:id/groups/:group — remove group from scenario */
app.delete(
  '/api/scenarios/:id/groups/:group',
  wrap((req, res) => {
    const id = param(req.params.id);
    const groupName = param(req.params.group);
    const scenario = getScenario(id);
    if (!scenario) {
      res.status(404).json({ error: `Scenario ${id} not found` });
      return;
    }
    removeGroupFromScenario(id, groupName);
    res.json(getScenario(id));
  }),
);

// ── API: Project resolution for test runner ───────────────────────────────────

/**
 * Map spec file paths to their Playwright project name by matching against
 * testMatch patterns from playwright.config.ts.  Specific projects take
 * precedence over the catch-all "chromium" project so that tests run with
 * the correct (and minimal) dependency chain.
 */
const SPEC_TO_PROJECT = new Map<string, string>([
  ['tests/releases/release-detail-header.spec.ts', 'release-detail-header'],
  ['tests/doc/new-product-creation-digital-offer.spec.ts', 'doc-product-setup'],
  ['tests/doc/initiate-doc.spec.ts', 'doc-initiation'],
  ['tests/doc/doc-state.setup.ts', 'doc-state-setup'],
  ['tests/doc/my-docs-tab.spec.ts', 'doc-my-docs-tab'],
  ['tests/doc/doc-detail.spec.ts', 'doc-detail-header'],
  ['tests/doc/doc-detail-offer.spec.ts', 'doc-detail-offer'],
  ['tests/doc/doc-detail-roles.spec.ts', 'doc-detail-roles'],
  ['tests/doc/doc-detail-its.spec.ts', 'doc-detail-its'],
  ['tests/doc/control-detail.spec.ts', 'doc-control-detail'],
  ['tests/doc/doc-history.spec.ts', 'doc-history'],
  ['tests/doc/doc-detail-actions.spec.ts', 'doc-detail-actions'],
  ['tests/doc/doc-detail-risk-summary.spec.ts', 'doc-detail-risk-summary'],
  ['tests/doc/doc-detail-certification.spec.ts', 'doc-detail-certification'],
  ['tests/doc/doc-lifecycle.spec.ts', 'doc-lifecycle'],
]);

function resolveProjectForSpec(specFile: string): string {
  const normalizedSpecFile = normalizeWorkspaceSpecPath(specFile);
  const explicitProject = SPEC_TO_PROJECT.get(normalizedSpecFile);
  if (explicitProject) return explicitProject;
  if (/[\\/]tests[\\/]tracker[\\/].*\.test\.ts$/.test(normalizedSpecFile)) {
    return 'tracker';
  }
  if (/\.setup\.ts$/.test(normalizedSpecFile)) return 'setup';
  return 'chromium';
}

/** POST /api/run/resolve-project — resolve best Playwright project for a spec file */
app.post(
  '/api/run/resolve-project',
  wrap((req, res) => {
    const { specFile } = req.body as { specFile?: string };
    if (!specFile) {
      res.status(400).json({ error: 'specFile is required' });
      return;
    }
    res.json({ specFile, project: resolveProjectForSpec(specFile) });
  }),
);

/** POST /api/run/resolve-scenario — resolve a single scenario to an exact grep target */
app.post(
  '/api/run/resolve-scenario',
  wrap((req, res) => {
    const { scenarioId, specFile, title, description } = req.body as {
      scenarioId?: string;
      specFile?: string;
      title?: string;
      description?: string;
    };

    if (!scenarioId || !specFile) {
      res.status(400).json({ error: 'scenarioId and specFile are required' });
      return;
    }

    const grep = resolveScenarioRunGrep(specFile, scenarioId, title, description);
    if (!grep) {
      res.status(404).json({ error: `Scenario ${scenarioId} cannot be run independently from ${specFile}` });
      return;
    }

    res.json({ scenarioId, specFile, grep, project: resolveProjectForSpec(specFile) });
  }),
);

/** POST /api/run/resolve-subsection — resolve a subsection to a describe-level grep target */
app.post(
  '/api/run/resolve-subsection',
  wrap((req, res) => {
    const { subsection, specFile } = req.body as { subsection?: string; specFile?: string };

    if (!subsection || !specFile) {
      res.status(400).json({ error: 'subsection and specFile are required' });
      return;
    }

    const grep = resolveSubsectionRunGrep(specFile, subsection);
    if (!grep) {
      res.status(404).json({ error: `Subsection ${subsection} cannot be resolved to a specific describe block in ${specFile}` });
      return;
    }

    res.json({ subsection, specFile, grep, project: resolveProjectForSpec(specFile) });
  }),
);

// ── API: Stats & tools ────────────────────────────────────────────────────────

/** GET /api/workflows — distinct workflow names for UI dropdowns */
app.get(
  '/api/workflows',
  wrap((_req, res) => {
    res.json(getDistinctWorkflows());
  }),
);

/** GET /api/scenarios/:id/details — steps + expected results */
app.get(
  '/api/scenarios/:id/details',
  wrap((req, res) => {
    const id = param(req.params.id);
    const details = getScenarioDetails(id);
    if (!details) {
      res.json({ scenario_id: id, steps: [], expected_results: [], execution_notes: '' });
      return;
    }
    res.json(details);
  }),
);

/** GET /api/stats — dashboard statistics */
app.get(
  '/api/stats',
  wrap((_req, res) => {
    res.json(getStats());
  }),
);

/** POST /api/sync — sync with spec files */
app.post(
  '/api/sync',
  wrap((_req, res) => {
    const result = syncWithSpecFiles();
    res.json(result);
  }),
);

/** GET /api/export — export all data as JSON */
app.get(
  '/api/export',
  wrap((_req, res) => {
    const data = exportToJson();
    res.setHeader('Content-Disposition', 'attachment; filename=tracker-export.json');
    res.json(data);
  }),
);

/** POST /api/import — import scenarios from JSON */
app.post(
  '/api/import',
  wrap((req, res) => {
    const data = req.body as TrackerExport;
    if (!data?.scenarios?.length) {
      res.status(400).json({ error: 'Invalid import data — expected { scenarios: [...] }' });
      return;
    }
    const result = importFromJson(data);
    res.json(result);
  }),
);

/** GET /api/meta — enum values for dropdowns */
app.get(
  '/api/meta',
  wrap((_req, res) => {
    res.json({
      automation_states: AUTOMATION_STATES,
      execution_statuses: EXECUTION_STATUSES,
      priorities: PRIORITIES,
      feature_areas: FEATURE_AREAS,
      default_groups: DEFAULT_GROUPS,
    });
  }),
);

// ══════════════════════════════════════════════════════════════════════════════
// TEST RUNNER — spawn Playwright tests and stream output to the UI
// ══════════════════════════════════════════════════════════════════════════════

interface RunHistoryEntry {
  id: string;
  specFiles: string[];
  project: string;
  grep: string;
  status: 'passed' | 'failed' | 'cancelled';
  startTime: string;
  endTime: string;
  duration: number; // ms
  outputLineCount: number;
  summary: string; // e.g. "3 passed, 1 failed"
}

interface TestRun {
  id: string;
  proc: ChildProcess | null;
  output: string[];    // line-by-line output
  status: 'idle' | 'running' | 'passed' | 'failed' | 'cancelled';
  startTime: number;
  specFiles: string[];
  project: string;
  grep: string;
  exitCode: number | null;
  summary: string;
}

const PROJECT_ROOT = path.resolve(__dirname, '..');
let currentRun: TestRun = {
  id: '', proc: null, output: [], status: 'idle',
  startTime: 0, specFiles: [], project: 'auto', grep: '',
  exitCode: null, summary: '',
};
const runHistory: RunHistoryEntry[] = [];
const MAX_HISTORY = 50;

function invalidateAllureCache(): void {
  allureCache = null;
}

function parseExecutionCounts(lines: string[]): { totalTests: number | null; workers: number | null } {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const plain = lines[index].replace(/\x1b\[[0-9;]*m/g, '');
    const match = plain.match(/Running\s+(\d+)\s+tests?\s+using\s+(\d+)\s+workers?/i);
    if (match) {
      return { totalTests: Number(match[1]), workers: Number(match[2]) };
    }
  }
  return { totalTests: null, workers: null };
}

function generateAllureReport(): Promise<void> {
  return new Promise((resolve) => {
    rmSync(ALLURE_REPORT_DIR, { recursive: true, force: true });
    invalidateAllureCache();

    const proc = spawn('npx', ALLURE_GENERATE_ARGS, {
      cwd: PROJECT_ROOT,
      env: { ...process.env, FORCE_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const addOutput = (data: Buffer) => {
      const lines = data.toString().split('\n').map(line => line.trimEnd()).filter(Boolean);
      if (!lines.length) return;
      currentRun.output.push(...lines.map(line => `\x1b[90m[allure]\x1b[0m ${line}`));
      if (currentRun.output.length > 5000) {
        currentRun.output = currentRun.output.slice(-4000);
      }
    };

    proc.stdout?.on('data', addOutput);
    proc.stderr?.on('data', addOutput);
    proc.on('close', () => {
      invalidateAllureCache();
      resolve();
    });
    proc.on('error', () => resolve());
  });
}

/** POST /api/run — start a Playwright test run */
app.post(
  '/api/run',
  wrap((req, res) => {
    if (currentRun.status === 'running') {
      res.status(409).json({ error: 'A test run is already in progress. Cancel it first.' });
      return;
    }

    const { specFiles, project, grep, headed } = req.body as {
      specFiles?: string[];  // relative paths like "tests/releases/create-new-release.spec.ts"
      project?: string;
      grep?: string;
      headed?: boolean;
    };

    if (!specFiles || specFiles.length === 0) {
      res.status(400).json({ error: 'specFiles array is required (relative paths to .spec.ts files)' });
      return;
    }

    // Validate files exist
    const missing = specFiles.filter(f => !existsSync(path.join(PROJECT_ROOT, f)));
    if (missing.length) {
      res.status(400).json({ error: `Spec files not found: ${missing.join(', ')}` });
      return;
    }

    const runId = `run-${Date.now()}`;
    const args = ['playwright', 'test', ...specFiles];

    // Resolve project: explicit > auto-detected from spec files > none
    let projectName = project && project !== 'auto' ? project : '';
    if (!projectName && specFiles.length > 0) {
      // When all spec files resolve to the same project, use it automatically
      const resolved = new Set(specFiles.map(resolveProjectForSpec));
      if (resolved.size === 1) {
        projectName = [...resolved][0];
      }
      // Mixed projects: let Playwright figure it out (no --project flag)
    }
    if (projectName) {
      args.push('--project=' + projectName);
    }
    if (grep) args.push(`--grep=${grep}`);
    if (headed) args.push('--headed');

    currentRun = {
      id: runId,
      proc: null,
      output: [
        `\x1b[36m▶ Starting test run: ${runId}\x1b[0m`,
        `\x1b[90m  Files:   ${specFiles.join(', ')}\x1b[0m`,
        `\x1b[90m  Project: ${projectName || 'auto (all matching)'}\x1b[0m`,
        grep ? `\x1b[90m  Grep:    ${grep}\x1b[0m` : '',
        `\x1b[90m  Command: npx ${args.join(' ')}\x1b[0m`,
        '─'.repeat(70),
        '',
      ].filter(Boolean),
      status: 'running',
      startTime: Date.now(),
      specFiles,
      project: projectName || 'auto',
      grep: grep || '',
      exitCode: null,
      summary: '',
    };

    const proc = spawn('npx', args, {
      cwd: PROJECT_ROOT,
      env: { ...process.env, FORCE_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    currentRun.proc = proc;

    const addOutput = (data: Buffer) => {
      const text = data.toString();
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.trim() || currentRun.output.length > 0) {
          currentRun.output.push(line);
        }
      }
      // Keep output buffer manageable (max 5000 lines)
      if (currentRun.output.length > 5000) {
        currentRun.output = currentRun.output.slice(-4000);
      }
    };

    proc.stdout?.on('data', addOutput);
    proc.stderr?.on('data', addOutput);

    proc.on('close', async (code) => {
      const duration = Date.now() - currentRun.startTime;
      currentRun.exitCode = code;
      currentRun.proc = null;

      if (currentRun.status === 'cancelled') {
        // Was cancelled — keep status as cancelled
        currentRun.output.push('', `\x1b[33m⚠ Test run cancelled after ${(duration / 1000).toFixed(1)}s\x1b[0m`);
        currentRun.summary = 'Cancelled';
      } else if (code === 0) {
        currentRun.status = 'passed';
        currentRun.output.push('', `\x1b[32m✓ All tests passed (${(duration / 1000).toFixed(1)}s)\x1b[0m`);
        currentRun.summary = 'All passed';
      } else {
        currentRun.status = 'failed';
        currentRun.output.push('', `\x1b[31m✗ Tests failed with exit code ${code} (${(duration / 1000).toFixed(1)}s)\x1b[0m`);
        currentRun.summary = `Failed (exit ${code})`;
      }

      // Parse summary from output (look for Playwright's summary line)
      const summaryLine = [...currentRun.output].reverse().find(l =>
        /\d+\s+(passed|failed|skipped)/.test(l.replace(/\x1b\[[0-9;]*m/g, ''))
      );
      if (summaryLine) {
        currentRun.summary = summaryLine.replace(/\x1b\[[0-9;]*m/g, '').trim();
      }

      if (currentRun.status === 'passed' || currentRun.status === 'failed') {
        syncScenarioStatusesFromRun(currentRun.specFiles, currentRun.status);
      }

      currentRun.output.push('', '\x1b[90mGenerating Allure report…\x1b[0m');
      await generateAllureReport();

      // Add to history
      runHistory.unshift({
        id: currentRun.id,
        specFiles: currentRun.specFiles,
        project: currentRun.project,
        grep: currentRun.grep,
        status: currentRun.status as 'passed' | 'failed' | 'cancelled',
        startTime: new Date(currentRun.startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration,
        outputLineCount: currentRun.output.length,
        summary: currentRun.summary,
      });
      if (runHistory.length > MAX_HISTORY) runHistory.length = MAX_HISTORY;
    });

    proc.on('error', (err) => {
      currentRun.output.push(`\x1b[31mProcess error: ${err.message}\x1b[0m`);
      currentRun.status = 'failed';
      currentRun.proc = null;
      currentRun.summary = `Error: ${err.message}`;
    });

    res.json({ id: runId, status: 'running', specFiles, project: projectName });
  }),
);

/** GET /api/run/status — poll current run state (with ?since=lineIndex for incremental) */
app.get(
  '/api/run/status',
  wrap((req, res) => {
    const since = Math.max(0, Number(req.query.since) || 0);
    const newLines = currentRun.output.slice(since);
    const counts = parseExecutionCounts(currentRun.output);

    res.json({
      id: currentRun.id,
      status: currentRun.status,
      specFiles: currentRun.specFiles,
      totalTests: counts.totalTests,
      workers: counts.workers,
      project: currentRun.project,
      grep: currentRun.grep,
      exitCode: currentRun.exitCode,
      summary: currentRun.summary,
      elapsed: currentRun.status === 'running' ? Date.now() - currentRun.startTime : 0,
      totalLines: currentRun.output.length,
      lines: newLines,
      since,
    });
  }),
);

/** POST /api/run/sync-results — apply the latest JSON report statuses to tracker scenarios */
app.post(
  '/api/run/sync-results',
  wrap((req, res) => {
    const requested = Array.isArray(req.body?.specFiles)
      ? req.body.specFiles.map((item: unknown) => normalizeSpecPath(String(item))).filter(Boolean)
      : [];
    const specFiles = requested.length ? requested : listSpecFilesInJsonReport();

    if (!specFiles.length) {
      res.status(400).json({ error: 'No spec files found in the latest JSON report.' });
      return;
    }

    syncScenarioStatusesFromRun(specFiles, null);
    res.json({ ok: true, syncedSpecFiles: specFiles });
  }),
);

/** POST /api/run/cancel — kill running test */
app.post(
  '/api/run/cancel',
  wrap((_req, res) => {
    if (currentRun.status !== 'running' || !currentRun.proc) {
      res.status(400).json({ error: 'No test run is currently in progress' });
      return;
    }
    currentRun.status = 'cancelled';
    currentRun.proc.kill('SIGTERM');
    // Force kill after 5s if still running
    setTimeout(() => {
      if (currentRun.proc && !currentRun.proc.killed) {
        currentRun.proc.kill('SIGKILL');
      }
    }, 5000);
    res.json({ ok: true, message: 'Cancelling test run…' });
  }),
);

/** GET /api/run/history — recent test run history */
app.get(
  '/api/run/history',
  wrap((_req, res) => {
    res.json(runHistory);
  }),
);

/** GET /api/spec-files — list all spec files on disk for the run dialog */
app.get(
  '/api/spec-files',
  wrap((_req, res) => {
    const { execSync } = require('child_process');
    const files = execSync('find tests -name "*.spec.ts" -o -name "*.setup.ts" | sort', {
      cwd: PROJECT_ROOT, encoding: 'utf-8',
    }).trim().split('\n').filter(Boolean);
    res.json(files);
  }),
);

// ══════════════════════════════════════════════════════════════════════════════
// ALLURE REPORT DATA — parse allure-results JSON files and summary.json
// ══════════════════════════════════════════════════════════════════════════════

interface AllureResult {
  uuid: string;
  name: string;
  status: string;
  statusDetails?: { message?: string; trace?: string };
  start: number;
  stop: number;
  duration: number;
  suite: string;
  subSuite: string;
  parentSuite: string;
  tags: string[];
  fullName: string;
  parameters: { name: string; value: string }[];
}

// Cache allure results (re-parsed on demand)
let allureCache: { results: AllureResult[]; parsedAt: number; summary: any } | null = null;
const ALLURE_CACHE_TTL = 30_000; // 30s

function parseAllureResults(): { results: AllureResult[]; summary: any } {
  // Check cache
  if (allureCache && Date.now() - allureCache.parsedAt < ALLURE_CACHE_TTL) {
    return { results: allureCache.results, summary: allureCache.summary };
  }

  const results: AllureResult[] = [];
  if (existsSync(ALLURE_RESULTS_DIR)) {
    const files = readdirSync(ALLURE_RESULTS_DIR).filter(f => f.endsWith('-result.json'));
    for (const file of files) {
      try {
        const raw = JSON.parse(readFileSync(path.join(ALLURE_RESULTS_DIR, file), 'utf-8'));
        const labels = raw.labels || [];
        const getLabel = (n: string) => labels.find((l: any) => l.name === n)?.value || '';
        results.push({
          uuid: raw.uuid || '',
          name: raw.name || 'Unknown',
          status: raw.status || 'unknown',
          statusDetails: raw.statusDetails || {},
          start: raw.start || 0,
          stop: raw.stop || 0,
          duration: (raw.stop || 0) - (raw.start || 0),
          suite: getLabel('suite'),
          subSuite: getLabel('subSuite'),
          parentSuite: getLabel('parentSuite'),
          tags: labels.filter((l: any) => l.name === 'tag').map((l: any) => l.value),
          fullName: raw.fullName || '',
          parameters: raw.parameters || [],
        });
      } catch { /* skip malformed files */ }
    }
  }

  // Parse summary.json
  let summary: any = null;
  const summaryPath = path.join(ALLURE_REPORT_DIR, 'summary.json');
  if (existsSync(summaryPath)) {
    try { summary = JSON.parse(readFileSync(summaryPath, 'utf-8')); } catch { /* ignore */ }
  }

  allureCache = { results, parsedAt: Date.now(), summary };
  return { results, summary };
}

/** POST /api/allure/generate — run allure generate and return when done */
app.post(
  '/api/allure/generate',
  wrap(async (_req, res) => {
    await generateAllureReport();
    const hasReport = existsSync(path.join(ALLURE_REPORT_DIR, 'index.html'));
    if (hasReport) {
      res.json({ ok: true });
    } else {
      res.status(500).json({ ok: false, error: 'Report generation failed or allure-results is empty' });
    }
  }),
);

/** GET /api/allure/summary — high-level stats + per-suite breakdown */
app.get(
  '/api/allure/summary',
  wrap((_req, res) => {
    const { results, summary } = parseAllureResults();

    // Aggregate by status
    const byStatus: Record<string, number> = {};
    for (const r of results) {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    }

    // Aggregate by suite
    const bySuite: Record<string, { total: number; passed: number; failed: number; skipped: number; broken: number; duration: number }> = {};
    for (const r of results) {
      const suite = r.suite || 'Unknown';
      if (!bySuite[suite]) bySuite[suite] = { total: 0, passed: 0, failed: 0, skipped: 0, broken: 0, duration: 0 };
      bySuite[suite].total++;
      if (r.status === 'passed') bySuite[suite].passed++;
      else if (r.status === 'failed') bySuite[suite].failed++;
      else if (r.status === 'broken') bySuite[suite].broken++;
      else bySuite[suite].skipped++;
      bySuite[suite].duration += Math.max(0, r.duration);
    }

    // Most recent run timestamp
    const lastRun = results.length > 0 ? Math.max(...results.map(r => r.stop || r.start)) : 0;

    // Total duration from summary or compute
    const totalDuration = summary?.duration || results.reduce((sum, r) => sum + Math.max(0, r.duration), 0);

    res.json({
      total: results.length,
      byStatus,
      bySuite: Object.entries(bySuite)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, stats]) => ({ name, ...stats })),
      lastRun,
      totalDuration,
      reportName: summary?.name || 'Allure Report',
      reportCreatedAt: summary?.createdAt || 0,
    });
  }),
);

/** GET /api/allure/results — paginated test results with filtering */
app.get(
  '/api/allure/results',
  wrap((req, res) => {
    let { results } = parseAllureResults();

    // Filters
    const status = req.query.status as string;
    const suite = req.query.suite as string;
    const search = req.query.search as string;
    const tag = req.query.tag as string;

    if (status) results = results.filter(r => r.status === status);
    if (suite) results = results.filter(r => r.suite === suite);
    if (tag) results = results.filter(r => r.tags.includes(tag));
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.suite.toLowerCase().includes(q) ||
        r.subSuite.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q)
      );
    }

    // Sort by start time descending, then name
    results.sort((a, b) => (b.start - a.start) || a.name.localeCompare(b.name));

    // Pagination
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 100));
    const total = results.length;
    const items = results.slice((page - 1) * limit, page * limit);

    res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  }),
);

/** GET /api/allure/suites — list of all unique suites */
app.get(
  '/api/allure/suites',
  wrap((_req, res) => {
    const { results } = parseAllureResults();
    const suites = new Map<string, number>();
    for (const r of results) {
      const s = r.suite || 'Unknown';
      suites.set(s, (suites.get(s) || 0) + 1);
    }
    res.json([...suites.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([name, count]) => ({ name, count })));
  }),
);

/** GET /api/allure/failures — just failed/broken tests with error details */
app.get(
  '/api/allure/failures',
  wrap((_req, res) => {
    const { results } = parseAllureResults();
    const failures = results
      .filter(r => r.status === 'failed' || r.status === 'broken')
      .sort((a, b) => a.suite.localeCompare(b.suite) || a.name.localeCompare(b.name))
      .map(r => ({
        uuid: r.uuid,
        name: r.name,
        status: r.status,
        suite: r.suite,
        subSuite: r.subSuite,
        duration: r.duration,
        message: r.statusDetails?.message || '',
        trace: r.statusDetails?.trace || '',
        tags: r.tags,
      }));
    res.json(failures);
  }),
);

// ── Global error handler ──────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  🧪 Tracker UI running at  http://localhost:${PORT}`);
  console.log(`     API base:              http://localhost:${PORT}/api`);
  console.log(`     Database:              ${getDbPath()}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down…');
  closeDb();
  process.exit(0);
});
process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});
