/**
 * Test Scenario Tracker — HTML Plan Parser (v2)
 *
 * Parses the WF array from automation-testing-plan.html into clean scenario records.
 * The WF array is the authoritative test plan data source (~1,200 items across 22 workflows).
 *
 * Data sources parsed:
 * 1. const WF = [...]                   — main test plan items with workflow/section structure
 * 2. *_SCENARIO_CASES dicts             — automated test case ID mappings per section item
 * 3. const AUTO_CASE_STATUS             — execution status per automated case ID
 * 4. <script id="doc-auto-case-details"> — steps/expected_results per automated case ID
 *
 * ID scheme: WF{n:02d}-{seq:04d} (e.g., WF01-0001 = workflow 1, 1st item)
 *
 * Pure function: takes HTML string, returns ParsedPlan. No file I/O, no DB.
 */

import type { Scenario, AutomationState, ExecutionStatus, FeatureArea, Priority } from './models';

export interface ParsedPlan {
  scenarios: Array<Omit<Scenario, 'created_at' | 'updated_at' | 'groups' | 'description'>>;
  warnings: string[];
}

interface DetailEntry {
  title?: string;
  spec_path?: string;
  steps?: string[];
  expected_results?: string[];
  execution_notes?: string;
}

// Maps WF workflow number to FeatureArea value
const WF_FEATURE_AREA: Record<number, FeatureArea> = {
  1: 'auth',
  2: 'landing',
  3: 'products',
  4: 'releases', 5: 'releases', 6: 'releases', 7: 'releases',
  8: 'releases', 9: 'releases', 10: 'releases',
  11: 'doc', 12: 'doc', 13: 'doc',
  14: 'releases', 15: 'releases',
  16: 'doc',
  17: 'other',
  18: 'backoffice',
  19: 'reports',
  20: 'integrations', 21: 'integrations', 22: 'integrations',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalizePriority(raw: string): Priority {
  if (raw === 'P0' || raw === 'P1') return 'P1';
  if (raw === 'P3') return 'P3';
  return 'P2';
}

function normalizeSpecPath(raw: string | undefined): string {
  if (!raw) return '';
  let p = raw.replace(/^projects\/pw-autotest\//, '');
  if (!p.startsWith('tests/')) p = 'tests/' + p;
  return p;
}

function extractJsonBlob(html: string, id: string): string | null {
  const re = new RegExp(`<script\\s+id="${id}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const m = re.exec(html);
  return m ? m[1].trim() : null;
}

/** Extracts a balanced { ... } block for a named JS/TS variable declaration. */
function extractObjectLiteral(text: string, varName: string): string | null {
  const startRe = new RegExp(`(?:const|let|var)\\s+${varName}\\s*=\\s*{`);
  const start = startRe.exec(text);
  if (!start) return null;
  const openIdx = text.indexOf('{', start.index + start[0].length - 1);
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return text.slice(openIdx, i + 1);
    }
  }
  return null;
}

function parseAutoStatus(literal: string): Record<string, ExecutionStatus> {
  const result: Record<string, ExecutionStatus> = {};
  // Match: 'ID': ['Label', 'css-value']  or  "ID": ["Label", "css-value"]
  const entryRe = /['"]([A-Z][A-Z0-9-]+)['"]\s*:\s*\[[^\]]*,\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(literal)) !== null) {
    const id = m[1];
    const css = m[2];
    const valid: ExecutionStatus[] = ['passed', 'not-executed', 'skipped', 'failed-defect'];
    result[id] = (valid as string[]).includes(css) ? (css as ExecutionStatus) : 'not-executed';
  }
  return result;
}

/**
 * Parses all *_SCENARIO_CASES dicts into a nested map:
 *   dictName → { sectionKey → [atcId, ...] }
 *
 * Each entry looks like:  "1.1": [["AUTH-LOGIN-001", "desc"], ...]
 * Multiple ATC IDs per key are possible; we collect all.
 */
function parseAllScenarioCases(script: string): Record<string, Record<string, string[]>> {
  const dictNames = [
    'AUTH_SCENARIO_CASES',
    'LANDING_SCENARIO_CASES',
    'PRODUCT_SCENARIO_CASES',
    'RELEASE_SCENARIO_CASES',
    'DOC_SCENARIO_CASES',
  ] as const;

  const allDicts: Record<string, Record<string, string[]>> = {};

  for (const name of dictNames) {
    const block = extractObjectLiteral(script, name);
    if (!block) continue;

    const dict: Record<string, string[]> = {};
    // Match outer key: "N.N.N":
    const keyRe = /"([^"]+)"\s*:\s*\[/g;
    let km: RegExpExecArray | null;
    while ((km = keyRe.exec(block)) !== null) {
      const key = km[1];
      const afterBracket = block.slice(km.index + km[0].length);
      // Collect text of this array entry (balanced [])
      let depth = 1;
      let entryText = '';
      for (let i = 0; i < afterBracket.length && depth > 0; i++) {
        const ch = afterBracket[i];
        if (ch === '[') depth++;
        else if (ch === ']') depth--;
        entryText += ch;
      }
      // Extract all IDs inside inner ["ID", "..."] tuples
      const ids: string[] = [];
      const idRe = /\[\s*["']([A-Z][A-Z0-9-]+)["']/g;
      let idM: RegExpExecArray | null;
      while ((idM = idRe.exec(entryText)) !== null) {
        ids.push(idM[1]);
      }
      if (ids.length) dict[key] = ids;
    }

    allDicts[name] = dict;
  }

  return allDicts;
}

/** Resolves a raw JS expression like AUTH_SCENARIO_CASES["1.1"] to its ATC IDs. */
function resolveAtcIds(
  refExpr: string,
  scenarioCases: Record<string, Record<string, string[]>>,
): string[] {
  const m = /(\w+_SCENARIO_CASES)\["([^"]+)"\]/.exec(refExpr);
  if (!m) return [];
  const dict = scenarioCases[m[1]];
  if (!dict) return [];
  return dict[m[2]] ?? [];
}

// ── WF array parser ──────────────────────────────────────────────────────────

interface RawItem {
  wfN: number;
  wfTitle: string;
  sectionTitle: string;
  done: boolean;
  itemTitle: string;
  priority: string;
  scenarioRef: string; // raw JS ref expression, e.g. AUTH_SCENARIO_CASES["1.1"]
}

/**
 * Line-by-line state machine over the WF block.
 *
 * Tracks current workflow (n, title) and section (title) as it scans,
 * emitting a RawItem whenever it encounters an item line.
 */
function parseWfItems(script: string): RawItem[] {
  const wfStart = script.indexOf('const WF = [');
  if (wfStart < 0) return [];

  // Stop at the next top-level const declaration after WF (e.g. const prefixMap)
  const nextConst = script.indexOf('\nconst ', wfStart + 10);
  const wfBlock = nextConst > 0 ? script.slice(wfStart, nextConst) : script.slice(wfStart);

  const items: RawItem[] = [];
  let currentWfN = 0;
  let currentWfTitle = '';
  let currentSection = '';

  // Regex patterns (each applied per-line)
  const wfHeaderRe = /n\s*:\s*(\d+)\s*,\s*title\s*:\s*"([^"]+)"/;
  const sectionWithTitleRe = /\{\s*title\s*:\s*"([^"]+)"\s*,\s*items\s*:\s*\[/;
  const sectionNullRe = /\{\s*title\s*:\s*null\s*,\s*items\s*:\s*\[/;
  // Item: [true/false, "title (with possible \" escapes)", "P0-P9", optional CASES_DICT["key"]]
  // The 4th arg is matched specifically as WORD_SCENARIO_CASES["key"] to avoid
  // ambiguity with the ] inside the reference expression (e.g. AUTH_SCENARIO_CASES["1.1"]).
  const itemRe =
    /^\s*\[\s*(true|false)\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"(P\d)"\s*(?:,\s*(\w+_SCENARIO_CASES\["[^"]+"\]))?\s*\],?\s*$/;

  for (const line of wfBlock.split('\n')) {
    const wfM = wfHeaderRe.exec(line);
    if (wfM) {
      currentWfN = parseInt(wfM[1], 10);
      currentWfTitle = wfM[2];
      currentSection = '';
      continue;
    }

    const secM = sectionWithTitleRe.exec(line);
    if (secM) {
      currentSection = secM[1];
      continue;
    }
    if (sectionNullRe.test(line)) {
      currentSection = '';
      continue;
    }

    const itemM = itemRe.exec(line);
    if (itemM) {
      items.push({
        wfN: currentWfN,
        wfTitle: currentWfTitle,
        sectionTitle: currentSection,
        done: itemM[1] === 'true',
        itemTitle: itemM[2].replace(/\\"/g, '"'),
        priority: itemM[3],
        scenarioRef: (itemM[4] ?? '').trim(),
      });
    }
  }

  return items;
}

// ── Public API ───────────────────────────────────────────────────────────────

export function parseHtmlPlan(html: string): ParsedPlan {
  const warnings: string[] = [];

  // 1. doc-auto-case-details (steps, expected_results, execution_notes)
  const detailJson = extractJsonBlob(html, 'doc-auto-case-details');
  if (!detailJson) throw new Error('Missing <script id="doc-auto-case-details"> blob');
  const details = JSON.parse(detailJson) as Record<string, DetailEntry>;

  // 2. AUTO_CASE_STATUS (execution status per ATC ID)
  const statusLiteral = extractObjectLiteral(html, 'AUTO_CASE_STATUS');
  const statusMap = statusLiteral ? parseAutoStatus(statusLiteral) : {};

  // 3. *_SCENARIO_CASES dicts (section key → ATC IDs)
  const scenarioCases = parseAllScenarioCases(html);

  // 4. WF array items
  const rawItems = parseWfItems(html);
  if (rawItems.length === 0) {
    warnings.push('WF array not found or empty — check HTML source structure');
  }

  // Sequential counter per workflow number for ID generation
  const wfSeq = new Map<number, number>();

  const scenarios: ParsedPlan['scenarios'] = rawItems.map((raw) => {
    const seq = (wfSeq.get(raw.wfN) ?? 0) + 1;
    wfSeq.set(raw.wfN, seq);

    const id = `WF${String(raw.wfN).padStart(2, '0')}-${String(seq).padStart(4, '0')}`;
    const feature_area: FeatureArea = WF_FEATURE_AREA[raw.wfN] ?? 'other';
    const priority = normalizePriority(raw.priority);
    const automation_state: AutomationState = raw.done ? 'automated' : 'pending';

    // Resolve ATC IDs from the *_SCENARIO_CASES reference
    const atcIds = raw.scenarioRef ? resolveAtcIds(raw.scenarioRef, scenarioCases) : [];
    const primaryAtcId = atcIds[0] ?? '';

    // Some _SCENARIO_CASES dicts prefix IDs with "ATC-" (e.g. ATC-DOC-SETUP-001) while
    // doc-auto-case-details and AUTO_CASE_STATUS use the bare form (DOC-SETUP-001).
    // Strip the prefix before doing lookups so both forms resolve correctly.
    const lookupId = primaryAtcId.replace(/^ATC-/, '');

    // Look up detail content (steps, results, notes) via primary ATC ID
    const detail = lookupId ? details[lookupId] : undefined;
    const spec_file = normalizeSpecPath(detail?.spec_path);

    // Look up execution status from AUTO_CASE_STATUS
    const execution_status: ExecutionStatus = lookupId
      ? (statusMap[lookupId] ?? 'not-executed')
      : 'not-executed';

    return {
      id,
      title: raw.itemTitle,
      automation_state,
      execution_status,
      priority,
      feature_area,
      spec_file,
      workflow: raw.wfTitle,
      subsection: raw.sectionTitle,
      steps: detail?.steps ?? [],
      expected_results: detail?.expected_results ?? [],
      execution_notes: detail?.execution_notes ?? '',
    };
  });

  return { scenarios, warnings };
}
