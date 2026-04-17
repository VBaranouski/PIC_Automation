/**
 * Test Scenario Tracker — Spec file parser
 *
 * TypeScript AST–based parsing of spec files to extract scenario IDs,
 * test steps, details, and importable candidate data.
 */

import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';

import { getProjectRoot } from './db';
import type { AutomationState, Priority, FeatureArea, Scenario } from './models';
import {
  normalizeSpecFilePath,
  featureAreaFromSpecFile,
  workflowNameFromSubsection,
} from './helpers';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface ImportableScenarioCandidate {
  id: string;
  title: string;
  description: string;
  automation_state: AutomationState;
  priority: Priority;
  feature_area: FeatureArea;
  spec_file: string;
  workflow: string;
  subsection: string;
  groups: string[];
}

export interface ScenarioDetailOverride {
  title?: string;
  steps?: string[];
  expected_results?: string[];
  execution_notes?: string;
}

export interface ParsedSpecScenarioDetail {
  id: string;
  title: string;
  description: string;
  steps: string[];
  isFixme: boolean;
}

// ── Caches ────────────────────────────────────────────────────────────────────

const parsedSpecDetailsCache = new Map<string, Map<string, ParsedSpecScenarioDetail>>();
let detailOverrideCache: Map<string, ScenarioDetailOverride> | null = null;

// ── Text extraction helpers ───────────────────────────────────────────────────

export function extractQuotedText(expression: string): string {
  return Array.from(expression.matchAll(/(['"])((?:\\.|(?!\1)[\s\S])*)\1/g))
    .map((match) => match[2])
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractScenarioIdFromDescription(description: string): string {
  const match = description.match(/([A-Z]{2,}(?:-[A-Z0-9]+)*-\d+|WF\d{2}-\d{4})/i);
  return match ? match[1].toUpperCase() : '';
}

export function extractScenarioTextFromDescription(description: string): string {
  const parts = description.split(/:\s+/, 2);
  return parts.length === 2 ? parts[1].trim() : description.trim();
}

export function extractScenarioIdsFromSpecContent(content: string): string[] {
  const ids = new Set<string>();
  const descriptionRegex = /allure\.description\(([^)]*)\)/g;

  for (const match of content.matchAll(descriptionRegex)) {
    const quotedText = Array.from(String(match[1] ?? '').matchAll(/(['"])((?:\\.|(?!\1)[\s\S])*)\1/g))
      .map((part) => part[2])
      .join(' ');
    const scenarioId = quotedText.match(/([A-Z]{2,}(?:-[A-Z0-9]+)*-\d+|WF\d{2}-\d{4})/i)?.[1]?.toUpperCase();
    if (scenarioId) ids.add(scenarioId);
  }

  return [...ids];
}

// ── TypeScript AST helpers ────────────────────────────────────────────────────

export function extractStringFromTsExpression(node: ts.Expression | undefined): string {
  if (!node) return '';
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    return [
      node.head.text,
      ...node.templateSpans.flatMap((span) => [extractStringFromTsExpression(span.expression), span.literal.text]),
    ].join('');
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return `${extractStringFromTsExpression(node.left)}${extractStringFromTsExpression(node.right)}`;
  }
  if (ts.isParenthesizedExpression(node)) {
    return extractStringFromTsExpression(node.expression);
  }
  return '';
}

export function isTestDefinitionCall(expression: ts.LeftHandSideExpression): boolean {
  if (ts.isIdentifier(expression)) return expression.text === 'test';
  if (!ts.isPropertyAccessExpression(expression)) return false;
  return ts.isIdentifier(expression.expression)
    && expression.expression.text === 'test'
    && ['skip', 'fixme', 'fail', 'only'].includes(expression.name.text);
}

export function isFixmeTestDefinition(expression: ts.LeftHandSideExpression): boolean {
  return ts.isPropertyAccessExpression(expression)
    && ts.isIdentifier(expression.expression)
    && expression.expression.text === 'test'
    && expression.name.text === 'fixme';
}

export function isTestStepCall(expression: ts.LeftHandSideExpression): boolean {
  return ts.isPropertyAccessExpression(expression)
    && ts.isIdentifier(expression.expression)
    && expression.expression.text === 'test'
    && expression.name.text === 'step';
}

export function isAllureDescriptionCall(expression: ts.LeftHandSideExpression): boolean {
  return ts.isPropertyAccessExpression(expression)
    && ts.isIdentifier(expression.expression)
    && expression.expression.text === 'allure'
    && expression.name.text === 'description';
}

// ── Generic execution note check ──────────────────────────────────────────────

export function isGenericExecutionNote(note: string | undefined): boolean {
  const normalized = String(note || '').trim();
  return normalized === 'Skipped: No explicit skip reason provided by Playwright.'
    || normalized === 'Skipped: No explicit skip reason recorded yet.'
    || normalized === 'Failed: Execution failed during Playwright run.';
}

// ── Spec file discovery ───────────────────────────────────────────────────────

export function findSpecFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findSpecFiles(fullPath));
    } else if (entry.name.endsWith('.spec.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Override loading ──────────────────────────────────────────────────────────

export function loadScenarioDetailOverrides(): Map<string, ScenarioDetailOverride> {
  if (detailOverrideCache) return detailOverrideCache;

  const overrides = new Map<string, ScenarioDetailOverride>();
  const overrideFile = path.join(getProjectRoot(), 'tmp', 'add-all-remaining-details.mjs');
  if (!fs.existsSync(overrideFile)) {
    detailOverrideCache = overrides;
    return overrides;
  }

  const source = fs.readFileSync(overrideFile, 'utf8');
  const match = source.match(/const newEntries = `([\s\S]*?)`;/);
  if (!match) {
    detailOverrideCache = overrides;
    return overrides;
  }

  try {
    const parsed = JSON.parse(`{${match[1]}}`) as Record<string, ScenarioDetailOverride>;
    for (const [id, value] of Object.entries(parsed)) {
      overrides.set(id.toUpperCase(), value);
    }
  } catch {
    // Ignore malformed override source and fall back to spec parsing only.
  }

  detailOverrideCache = overrides;
  return overrides;
}

// ── Full spec detail parsing (TS AST) ─────────────────────────────────────────

export function parseScenarioDetailsFromSpec(specFile: string): Map<string, ParsedSpecScenarioDetail> {
  const normalizedSpecFile = normalizeSpecFilePath(specFile);
  const cached = parsedSpecDetailsCache.get(normalizedSpecFile);
  if (cached) return cached;

  const details = new Map<string, ParsedSpecScenarioDetail>();
  const absPath = path.join(getProjectRoot(), normalizedSpecFile);
  if (!normalizedSpecFile || !fs.existsSync(absPath)) {
    parsedSpecDetailsCache.set(normalizedSpecFile, details);
    return details;
  }

  const sourceText = fs.readFileSync(absPath, 'utf8');
  const sourceFile = ts.createSourceFile(absPath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  function collectFromBody(node: ts.Node): { description: string; steps: string[]; hasFixme: boolean } {
    let description = '';
    const steps: string[] = [];
    let hasFixme = false;

    const visit = (current: ts.Node): void => {
      if (ts.isCallExpression(current)) {
        if (!description && isAllureDescriptionCall(current.expression)) {
          description = extractStringFromTsExpression(current.arguments[0]).replace(/\s+/g, ' ').trim();
        }
        if (isTestStepCall(current.expression)) {
          const stepTitle = extractStringFromTsExpression(current.arguments[0]).replace(/\s+/g, ' ').trim();
          if (stepTitle) steps.push(stepTitle);
        }
        if (isFixmeTestDefinition(current.expression)) {
          hasFixme = true;
        }
      }
      ts.forEachChild(current, visit);
    };

    visit(node);
    return { description, steps, hasFixme };
  }

  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node) && isTestDefinitionCall(node.expression)) {
      const title = extractStringFromTsExpression(node.arguments[0]).replace(/\s+/g, ' ').trim();
      const callback = node.arguments.find((arg) => ts.isArrowFunction(arg) || ts.isFunctionExpression(arg)) as ts.FunctionLikeDeclaration | undefined;
      if (callback?.body) {
        const collected = collectFromBody(callback.body);
        const scenarioId = extractScenarioIdFromDescription(collected.description);
        if (scenarioId) {
          details.set(scenarioId, {
            id: scenarioId,
            title,
            description: collected.description,
            steps: collected.steps,
            isFixme: isFixmeTestDefinition(node.expression) || collected.hasFixme,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  parsedSpecDetailsCache.set(normalizedSpecFile, details);
  return details;
}

// ── Import candidate extraction ───────────────────────────────────────────────

export function parseImportableScenariosFromSpec(
  specFile: string,
  existingBySpec: Map<string, Scenario[]>,
): ImportableScenarioCandidate[] {
  const content = fs.readFileSync(path.join(getProjectRoot(), specFile), 'utf-8');
  const subsectionMarkers = Array.from(content.matchAll(/^\s*\/\/\s*WORKFLOW\s+(\d+(?:\.\d+)*)\s+[—–-]\s+(.+?)\s*$/gm)).map((match) => ({
    index: match.index ?? 0,
    subsection: `${match[1]} ${match[2].trim()}`,
  }));
  const existingScenarios = existingBySpec.get(specFile) ?? [];
  const fallbackWorkflow = existingScenarios.length === 1
    ? existingScenarios[0].workflow
    : [...new Set(existingScenarios.map((scenario) => scenario.workflow).filter(Boolean))].length === 1
      ? existingScenarios.find((scenario) => scenario.workflow)?.workflow ?? ''
      : '';
  const fallbackSubsection = [...new Set(existingScenarios.map((scenario) => scenario.subsection).filter(Boolean))].length === 1
    ? existingScenarios.find((scenario) => scenario.subsection)?.subsection ?? ''
    : '';

  const candidates: ImportableScenarioCandidate[] = [];
  const testRegex = /test(?:\.(?:skip|fixme|fail|only))?\s*\(\s*(['"`])([\s\S]*?)\1\s*,[\s\S]*?allure\.description\(([\s\S]*?)\);/g;

  for (const match of content.matchAll(testRegex)) {
    const description = extractQuotedText(String(match[3] ?? ''));
    const scenarioId = extractScenarioIdFromDescription(description);
    if (!scenarioId) continue;

    let subsection = '';
    for (const marker of subsectionMarkers) {
      if (marker.index < (match.index ?? 0)) subsection = marker.subsection;
      else break;
    }

    const workflow = workflowNameFromSubsection(subsection) || fallbackWorkflow;
    const scenarioText = extractScenarioTextFromDescription(description);
    const testTitle = String(match[2] ?? '').trim();
    const title = scenarioText || testTitle;
    const groups: string[] = [];
    if (/@smoke\b/i.test(testTitle) || /allure\.tag\(\s*['"]smoke['"]\s*\)/.test(String(match[0] ?? ''))) groups.push('smoke');
    if (/@regression\b/i.test(testTitle) || /allure\.tag\(\s*['"]regression['"]\s*\)/.test(String(match[0] ?? ''))) groups.push('regression');

    candidates.push({
      id: scenarioId,
      title,
      description,
      automation_state: /test\.fixme\s*\(/.test(String(match[0] ?? '')) ? 'pending' : 'automated',
      priority: groups.includes('smoke') ? 'P1' : 'P2',
      feature_area: featureAreaFromSpecFile(specFile),
      spec_file: specFile,
      workflow,
      subsection: subsection || fallbackSubsection,
      groups,
    });
  }

  return candidates;
}
